---
title: 如何在 CentOS 和 Ubuntu 中安装 Linux Kernel 最新版
date: 2017-12-20
categories:
- Linux
- 运维
tags:
- 运维
---

发行版的内核一般不是最新版, 可以手动安装。

<!-- more -->

目前 Linux Kernel 的最新稳定版是 Linux Kernel 4.14, 本文讲述了在 CentOS 和 Ubuntu 中手动安装、更新 Linux Kernel 4.14 的方法, 这些步骤也同时适用于其它基于 YUM 和基于 APT 的系统。

## CentOS 系统安装 Linux Kernel 4.14

以下步骤在 CentOS 7 64 位版本中进行了测试, 它也适用于其他 RPM 发行版, 如：RHEL、Fedora 和 Scientific Linux 等。

由于最新的内核在官方存储库中目前还不可用, 所以我们需要添加 [ELRepo 仓库](http://elrepo.org/tiki/tiki-index.php)来安装这个最新的 Linux Kernel 4.14 内核。

1. 使用如下命令添加 ELRepo GPG 密钥：

    ```sh
    rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
    ```

1. 使用如下命令在 CentOS 7、RHEL 7 或 Scientific Linux 7 中添加 ELRepo 存储库：

    ```sh
    rpm -Uvh http://www.elrepo.org/elrepo-release-7.0-3.el7.elrepo.noarch.rpm
    ```

    CentOS 6、RHEL 6、Scientific Linux 6 添加 ELRepo 存储库的命令是：

    ```sh
    rpm -Uvh http://www.elrepo.org/elrepo-release-6-8.el6.elrepo.noarch.rpm
    ```

1. 指定从 ELRepo 安装 Linux Kernel：

    ```sh
    yum --enablerepo=elrepo-kernel install kernel-ml
    ```

    --enablerepo 参数 可以指定源

1. 安装内核后, 重新启动系统并从 Grub 启动菜单中选择最新的内核。

1. 在确定新内核没问题后, 可以移除旧内核

    ```sh
    yum remove kernel -y
    ```

## Ubuntu 16.04 LTS 系统安装 Linux Kernel 4.14

在 Ubuntu 16.04 LTS 或其它基于 Ubuntu 的系统中（如 Debian、Linux Mint 等 ）安装最新 Linux Kernel 4.14 内核的步骤如下：

1. 现在已经可以从 Ubuntu 官方内核库中下载 [Linux Kernel 4.14](http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.14/)。

    64 位 Ubuntu 系统：

    ```sh
    wget http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.14/linux-headers-4.14.0-041400_4.14.0-041400.201711122031_all.deb
    wget http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.14/linux-headers-4.14.0-041400-generic_4.14.0-041400.201711122031_amd64.deb
    wget http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.14/linux-image-4.14.0-041400-generic_4.14.0-041400.201711122031_amd64.deb
    ```

    32 位 Ubuntu 系统：

    ```sh
    wget http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.14/linux-headers-4.14.0-041400_4.14.0-041400.201711122031_all.deb
    wget http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.14/linux-headers-4.14.0-041400-generic_4.14.0-041400.201711122031_i386.deb
    wget http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.14/linux-image-4.14.0-041400-generic_4.14.0-041400.201711122031_i386.deb
    ```

1. 下载完成后使用如下命令安装 Linux Kernel 4.14：

    ```sh
    sudo dpkg -i *.deb
    ```

1. 使用如下命令更新 Grub 引导加载程序：

    ```sh
    sudo update-grub
    ```

    如果使用 BURG 引导加载程序, 请运行：

    ```sh
    sudo update-burg
    ```

1. 重新启动系统并登录到新安装的内核。
