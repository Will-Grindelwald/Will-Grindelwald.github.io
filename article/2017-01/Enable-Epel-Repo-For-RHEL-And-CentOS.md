---
title: 如何为 RHEL / CentOS 7.x / 6.x / 5.x 启用 EPEL 存储库
date: 2017-01-22
categories:
- Linux
- 运维
tags:
- 运维
- CentOS
---

**待整理**

**2016 年 8 月 17 日**[CentOS 系统](http://www.howtoing.com/category/operating-system/centos/) [RedHat](http://www.howtoing.com/category/operating-system/redhat/)

这个指南手册显示了您将如何启用 RHEL / CentOS 的 6/5 **EPEL 软件库**, 以便使用 yum 命令来安装额外的标准开源软件包.

<!-- more -->

**另请参阅** :  [安装和 RHEL 启用 RPMForge 软件库 / CentOS 7/6/5/4](http://www.howtoing.com/enable-rpmforge-repository/)

## 什么是 EPEL

**EPEL**(额外的企业版 Linux 软件包) 是开源和基于免费的社区信息库项目由 Fedora 的团队, 提供 100％的高品质的附加软件包的 Linux 发行版, 包括 RHEL(红帽企业 Linux), CentOS 的, 与科学 Linux 操作系统. Epel 项目不是 RHEL / Cent OS 的一部分, 但它是为主要的 Linux 发行版本提供的, 它提供了许多开源软件包, 如网络, 系统管理, 编程, 监视等等. 大多数 epel 软件包由 Fedora 软件库维护.

## 为什么我们使用 EPEL 存储库

1. 提供许多开源包以通过 Yum 安装.
1. EPEL 仓库是 100％开源和免费使用.
1. 它不提供任何核心重复的软件包和没有兼容性问题.
1. 所有 epel 包都由 Fedora 库维护.

## 如何在 RHEL / CentOS 7/6/5 中启用 EPEL 存储库

首先, 您需要使用 `wget` 下载的文件, 然后使用你的系统上 `RPM` 启用 EPEL 软件库安装它. 根据您的 Linux 操作系统版本使用以下链接. **请确保您必须是 root 用户** ).

### RHEL / CentOS 7 64 位

```sh
## RHEL/CentOS 7 64-Bit ##
# wget http://dl.fedoraproject.org/pub/epel/7/x86_64/e/epel-release-7-8.noarch.rpm
# rpm -ivh epel-release-7-8.noarch.rpm
```

### RHEL / CentOS 6 32-64 位

```sh
## RHEL/CentOS 6 32-Bit ##
# wget http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
# rpm -ivh epel-release-6-8.noarch.rpm
## RHEL/CentOS 6 64-Bit ##
# wget http://download.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
# rpm -ivh epel-release-6-8.noarch.rpm
```

### RHEL / CentOS 5 32-64 位

```sh
## RHEL/CentOS 5 32-Bit ##
# wget http://download.fedoraproject.org/pub/epel/5/i386/epel-release-5-4.noarch.rpm
# rpm -ivh epel-release-5-4.noarch.rpm
## RHEL/CentOS 5 64-Bit ##
# wget http://download.fedoraproject.org/pub/epel/5/x86_64/epel-release-5-4.noarch.rpm
# rpm -ivh epel-release-5-4.noarch.rpm
```

### RHEL / CentOS 4 32-64 位

```sh
## RHEL/CentOS 4 32-Bit ##
# wget http://download.fedoraproject.org/pub/epel/4/i386/epel-release-4-10.noarch.rpm
# rpm -ivh epel-release-4-10.noarch.rpm
## RHEL/CentOS 4 64-Bit ##
# wget http://download.fedoraproject.org/pub/epel/4/x86_64/epel-release-4-10.noarch.rpm
# rpm -ivh epel-release-4-10.noarch.rpm
```

## 如何验证 EPEL 仓库

您需要运行以下命令来验证是否已启用 EPEL 存储库. 一旦你运行命令, 你将看到 epel 存储库.

```sh
# yum repolist
```

**示例输出**

```sh
Loaded plugins: downloadonly, fastestmirror, priorities
Loading mirror speeds from cached hostfile
* base: centos.aol.in
* epel: ftp.cuhk.edu.hk
* extras: centos.aol.in
* rpmforge: be.mirror.eurid.eu
* updates: centos.aol.in
Reducing CentOS-5 Testing to included packages only
Finished
1469 packages excluded due to repository priority protections
repo id                           repo name                                                      status
base                              CentOS-5 - Base                                               2,718+7
epel Extra Packages for Enterprise Linux 5 - i386 4,320+1,408
extras                            CentOS-5 - Extras                                              229+53
rpmforge                          Red Hat Enterprise 5 - RPMforge.net - dag                      11,251
repolist: 19,075
```

## 如何使用 EPEL 仓库

您需要使用 `yum` 命令用于搜索和安装软件包. 例如, 我们使用 EPEL 仓库搜索的 zabbix 软件包, 让我们看看它是否可用下 EPEL.

```sh
# yum --enablerepo=epel info zabbix
```

**示例输出**

```sh
Available Packages
Name       : zabbix
Arch       : i386
Version    : 1.4.7
Release    : 1.el5
Size       : 1.7 M
Repo : epel
Summary    : Open-source monitoring solution for your IT infrastructure
URL        : http://www.zabbix.com/
License    : GPL
Description: ZABBIX is software that monitors numerous parameters of a network.
```

让我们使用 EPEL 仓库选项 **-enablerepo = EPEL** 开关安装的 zabbix 软件包.

```sh
# yum --enablerepo=epel install zabbix
```

**注**: EPEL 配置文件位于 **/etc/yum.repos.d/epel.repo. **

这样, 您就可以安装多达使用 **EPEL** 回购高标准的开源软件包.
