---
title: 编译 nbd 模块 for CentOS7
date: 2017-12-15
categories:
- Linux
- 运维
tags:
- 运维
---

CentOS 很奇怪的一点是 内核 默认 没有编译 NBD 模块, NBD 常用于挂载虚拟磁盘。

本文讲解 CentOS7 编译 NBD 模块

<!-- more -->

首先查看 本机 内核版本

```sh
uname -r
```

找到 对应的 内核源码包 http://vault.centos.org/7.4.1708/updates/Source/SPackages/kernel-3.10.0-693.11.1.el7.src.rpm

## 修改源码

目前(7.4.1708 kernel-3.10.0-693.11.1) 的 NBD 模块编译会出错 :(

解决办法

```sh
错误：
drivers/block/nbd.c: 在函数‘__nbd_ioctl’中:
drivers/block/nbd.c:619:19: 错误：‘REQ_TYPE_SPECIAL’未声明(在此函数内第一次使用)
   sreq.cmd_type = REQ_TYPE_SPECIAL;
                   ^
drivers/block/nbd.c:619:19: 附注：每个未声明的标识符在其出现的函数内只报告一次
make[1]: *** [drivers/block/nbd.o] 错误 1
make: *** [_module_drivers/block] 错误 2
```

1. `REQ_TYPE_SPECIAL` 变量是在 `/usr/src/kernels/3.10.0-514.26.2.el7.x86_64/include/linux/blkdev.h` 文件中定义, 由代码可知 `REQ_TYPE_SPECIAL = 7`：

    ```sh
    /*
     * request command types
     */
    enum rq_cmd_type_bits {
        REQ_TYPE_FS             = 1,    /* fs request */
        REQ_TYPE_BLOCK_PC,              /* scsi command */
        REQ_TYPE_SENSE,                 /* sense request */
        REQ_TYPE_PM_SUSPEND,            /* suspend request */
        REQ_TYPE_PM_RESUME,             /* resume request */
        REQ_TYPE_PM_SHUTDOWN,           /* shutdown request */
    #ifdef __GENKSYMS__
        REQ_TYPE_SPECIAL,               /* driver defined type */
    #else
        REQ_TYPE_DRV_PRIV,              /* driver defined type */
    #endif
        /*
         * for ATA/ATAPI devices. this really doesn't belong here, ide should
         * use REQ_TYPE_DRV_PRIV and use rq->cmd[0] with the range of driver
         * private REQ_LB opcodes to differentiate what type of request this is
         */
        REQ_TYPE_ATA_TASKFILE,
        REQ_TYPE_ATA_PC,
    };1234567891011121314151617181920212223
    ```

1. 修改 drivers/block/nbd.c, 将 sreq.cmd_type 直接定义为 7

    ```sh
    //sreq.cmd_type = REQ_TYPE_SPECIAL;
    sreq.cmd_type = 7;
    ```

## 法一 仅编译 nbd 模块(推荐)

```sh
#!/bin/bash

# 1. 安装编译软件和编译所需的软件包
sudo yum install -y kernel-devel kernel-headers elfutils-libelf-devel
# 2. 下载和安装源码包
wget http://vault.centos.org/7.4.1708/updates/Source/SPackages/kernel-3.10.0-693.11.1.el7.src.rpm
rpm -ivh kernel-3.10.0-693.11.1.el7.src.rpm
# 3. 解压源码包
cd ~/rpmbuild/SOURCES
sudo tar Jxf linux-3.10.0-693.11.1.el7.tar.xz -C /usr/src/kernels/
cd /usr/src/kernels/
sudo mv $(uname -r) $(uname -r)-old
sudo mv linux-3.10.0-* $(uname -r)
# 4. 编译 nbd 内核模块
cd $(uname -r)
sudo make mrproper
sudo cp ../$(uname -r)-old/Module.symvers ./
sudo cp /boot/config-$(uname -r) ./.config
sudo make oldconfig
sudo make prepare
sudo make scripts
sudo make CONFIG_BLK_DEV_NBD=m M=drivers/block               # < -- 位置一, 出错见上文 -- >
# 5. drivers/block/nbd.ko 即为 编译结果
modinfo drivers/block/nbd.ko
# 6. 安装模块
sudo cp drivers/block/nbd.ko /lib/modules/$(uname -r)/kernel/drivers/block/
sudo depmod -a
```

## 法二 重新编译 整个内核

```sh
#!/bin/bash

# 1. 安装编译软件和编译所需的软件包
sudo yum install -y xmlto asciidoc hmaccalc python-devel newt-devel perl perl-ExtUtils-Embed pesign elfutils-devel binutils-devel audit-libs-devel java-devel numactl-devel ncurses-devel pciutils-devel
# 2. 下载和安装源码包
wget http://vault.centos.org/7.4.1708/updates/Source/SPackages/kernel-3.10.0-693.11.1.el7.src.rpm
rpm -ivh kernel-3.10.0-693.11.1.el7.src.rpm
# 3. 编译 nbd 内核模块
mkdir -p ~/rpmbuild/{BUILD,BUILDROOT,RPMS,SOURCES,SPECS,SRPMS}
echo '%_topdir %(echo $HOME)/rpmbuild' > ~/.rpmmacros
cd ~/rpmbuild/SPECS
rpmbuild -bp --target=$(uname -m) kernel.spec
cd ~/rpmbuild/BUILD/kernel-*/linux-*/
make menuconfig
# select: Device Driver -> Block devices -> Set “M” On “Network block device support” Save and exit
make prepare
make modules_prepare
make                                                         # < -- 位置二, 出错见上文 -- >
make M=drivers/block -j8
# 4. drivers/block/nbd.ko 即为 编译结果
modinfo drivers/block/nbd.ko
# 5. 安装模块
sudo cp drivers/block/nbd.ko /lib/modules/$(uname -r)/kernel/drivers/block/
sudo depmod -a
```

除了网上千篇一律的博文, 我还找到这篇关于 `创建你自己的内核模块` 的文章 https://wiki.centos.org/zh/HowTos/BuildingKernelModules

## 启动模块

```sh
sudo modprobe nbd max_part=16
lsmod | grep nbd
```
