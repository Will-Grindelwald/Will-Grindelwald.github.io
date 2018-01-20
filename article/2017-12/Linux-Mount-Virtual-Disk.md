---
title: linux 挂载 VHD VHDX VDI VMDK 等虚拟磁盘
date: 2017-12-12
categories:
- Linux
- 运维
tags:
- 运维
---

本人在看了许多资料后查到了 三种 在 Linux 下挂载 虚拟磁盘 的方法, 下面一一讲解

<!-- more -->

## 法一 virt-filesystems + guestmount

将 虚拟磁盘 中的文件系统直接挂载, 性能较差 :(

```sh
sudo apt install libguestfs-tools
sudo yum install libguestfs-tools

guestmount -a /path/to/T.vhd -m /dev/sda2 ~/T
umount /dev/sda2
```

* -a 参数指定虚拟磁盘
* -m 参数指定要挂载的设备在客户机中的挂载点, 如果指定错误, 会有错误输出, 然后给出正确的挂载点；
* –rw 表示以读写的形式挂载到宿主机中;
* –ro 理所当然的表示以只读的形式挂载；
* 最后给出在宿主机中的挂载点。

如果不知道客户机中磁盘设备的包含的文件系统, 可以使用 virt-filesystems 命令检测也可以让 guestmount 命令加上参数 -i 自己检测。命令如下：
Virt-filesystems 加参数 -a 检测一个客户机磁盘文件, 加参数 -d 检测一个客户机使用的磁盘文件, 加参数 –parts 检测客户机的磁盘分区信息, 此时不包括 LVM 信息。
virt-filesystems -a /home/kvm/guest.img
virt-filesystems -d MyGuestName
virt-filesystems -d MyGuestName --parts

命令手册:

* http://libguestfs.org/
* http://libguestfs.org/guestmount.1.html
* http://libguestfs.org/virt-filesystems.1.html

**使用 guestmount 命令不需要 root 权限!** 只要用户拥有访问虚拟磁盘和使用挂载点的权限, 就可以使用 guestmount 命令。

## 法二 vmware-mount

vmware-mount 是 虚拟机 VMWare 提供的工具, 感觉不错, 稳定, 性能尚可。缺点: 没法单独安装, 必须安装完整的 VMWare 才能使用

vmware-mount -p abc.vhd 查看 虚拟硬盘的分区情况

加载 vhd 分区
vmware-mount abc.vhd 1 -o ro ~/Test
上面的 1 表示第 1 个分区, 如果加载的是第 2 个分区, 改成 2。

vmware-mount -x 卸载分区

vmware-mount --help

```sh
Usage: vmware-mount diskPath [partition num] mountPoint
       vmware-mount [option] [opt args]

There are two modes for mounting disks.  If no option is
specified, we mount individual partitions from virtual disks
independently.  The filesystem on the partition will be
accessible at the mount point specified.

The -f option mounts a flat representation of a disk on a
user-specified mount point.  The user must explicitly unmount
the disk when finished.  A disk may not be in both modes at once.

Options: -p <diskID>      list all partitions on a disk
         -l <diskID>      list all mounted partitions on a disk
         -L               list all mounted disks
         -d <mountPoint>  cleanly unmount this partition
                          (closes disk if it is the last partition)
         -f <diskPath> <mountPoint> mount a flat representation of the disk
                          at "mountPoint/flat."
         -k <diskID>      unmount all partitions and close disk
         -K <diskID>      force unmount all partitions and close disk
         -x               unmount all partitions and close all disks
         -X               force unmount all partitions and close all disks
         -r               mount the disk or partition read-only
         -o               comma-separated list of options to be passed
                          to the 'mount' when mounting a partition
```

## 法三 qemu-nbd + mount

qemu-nbd 挂载的是块设备, 性能要好一些。nbd 模块一般发行版都已内建, 但奇怪的是 CentOS 并没有, 要自己构建。

### 安装 qemu 工具

sudo apt install qemu-utils qemu-block-extra # for debian 9
sudo yum install qemu-kvm                    # for CentOS 7

### 加载 nbd 模块

mod 相关命令

```sh
lsmod |grep nbd               # 查看当前 nbd 模块是否已加载
sudo modprobe nbd max_part=16 # 插入模块 参数不能少
sudo modprobe -r nbd          # 移除模块
sudo modinfo nbd              # 查看模块 nbd 信息
```

想要开机启动 nbd 模块, 见 `在系统启动时加载指定的模块`

### 操作流程

```sh
# 挂载 虚拟磁盘 到块设备 /dev/nbd0
sudo qemu-nbd -f vhdx -c /dev/nbd0 /path/to/XD.vhdx
# 更新分区表
sudo partprobe /dev/nbd0
# 挂载 块设备 /dev/nbd0 的 第二个分区 /dev/nbd0p2 到 /home/will/X/ 文件系统为 ntfs
sudo mount -t ntfs /dev/nbd0p2 /home/will/X/
# 卸载 /dev/nbd0p2 分区
sudo umount /dev/nbd0p2
# 卸载 块设备
sudo qemu-nbd -d /dev/nbd0
```

在 windows 上 格式化 的 虚拟磁盘 往往第一个分区是 MSR 分区, 所以查看一下分区情况

```sh
$ sudo fdisk -l /dev/nbd0

Disk /dev/nbd0: 5 GiB, 5368709120 bytes, 10485760 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: F291C8C9-6CF2-4389-896F-D62AF9C83819

Device      Start      End  Sectors Size Type
/dev/nbd0p1    34    65569    65536  32M Microsoft reserved
/dev/nbd0p2 67584 10483711 10416128   5G Microsoft basic data

# 有时 fdisk 不管用
$ sudo parted -l

Disk /dev/nbd0: 5369MB
Sector size (logical/physical): 512B/512B
Partition Table: gpt
Disk Flags:

Number  Start   End     Size    File system  Name                          标志
 1      17.4kB  33.6MB  33.6MB               Microsoft reserved partition  msftres
 2      34.6MB  5368MB  5333MB  ntfs         Basic data partition
```

所以常常挂载的是第二个分区 /dev/nbd0p2

### 命令讲解

#### mount

```sh
sudo mount -t type device dir
sudo mount -t ntfs /dev/nbd0p2 /home/will/xd/
sudo mount -a                     安装在 /etc/fstab 文件中列出的所有文件系统
           -t 指定设备的文件系统类型
           -r 讲文件系统安装为只读
           -v 详细显示安装信息
           -o 指定挂载文件系统时的选项, 有些也可写到在/etc/fstab中。常用的有：
           defaults 使用所有选项的默认值（auto、nouser、rw、suid）
           auto/noauto 允许/不允许以 –a选项进行安装
           dev/nodev 对/不对文件系统上的特殊设备进行解释
           exec/noexec 允许/不允许执行二进制代码
           suid/nosuid 确认/不确认suid和sgid位
           user /nouser 允许/不允许一般用户挂载
           codepage=XXX 代码页
           iocharset=XXX 字符集
           ro 以只读方式挂载
           rw 以读写方式挂载
           remount 重新挂载已经挂载了的文件系统
           loop 挂载回旋设备
```

1. 挂载点必须是一个已经存在的目录
1. 这个目录可以不为空, 但挂载后这个目录下以前的内容将不可用, umount 以后会恢复正常。使用多个 -o 参数的时候, -o 只用一次, 参数之间用 半角逗号 隔开

#### umount

```sh
sudo umount /dev/nbd0
```

* -r    若无法成功卸除, 则尝试以只读的方式重新挂入文件系统。
* -v    执行时显示详细的信息

#### qemu-nbd

```sh
sudo qemu-nbd -f vhdx -c /dev/nbd0 /path/to/XD.vhdx # for vhdx
sudo qemu-nbd -f vpc -c /dev/nbd0 /path/to/VD.vhd   # for vhd
sudo qemu-nbd -d /dev/nbd0
```

* -c 连接
* -d 取消连接
* -f 指定格式

#### qemu-img

见 http://smilejay.com/2012/08/qemu-img-details/
