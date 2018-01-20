---
title: Linux 下 SVN 服务器搭建
date: 2016-10-25
categories:
- 版本管理
- SVN
tags:
- SVN
---

本文讲解 Linux 下 SVN 服务器的搭建: 基本的单仓库 SVN 服务器, 支持 HTTP 协议的 SVN 服务器, 多仓库的 SVN 服务器。

<!-- more -->

## 基础

安装步骤如下:

1. **yum install subversion**
1. 查看安装版本 **svnserve --version**

    ```sh
    svnserve, 版本 1.7.14 (r1542130)
    编译于 Nov 20 2015, 19:25:09

    版权所有 (C) 2013 Apache 软件基金会.
    此软件包含了许多人的贡献, 请查看文件 NOTICE 以获得更多信息.
    Subversion 是开放源代码软件, 请参阅 http://subversion.apache.org/ 站点.

    下列版本库后端(FS) 模块可用:

    * fs_base : 模块只能操作 BDB 版本库.
    * fs_fs : 模块与文本文件 (FSFS) 版本库一起工作.

    Cyrus SASL 认证可用.
    ```

1. 创建 svn 版本库目录 **mkdir -p /var/svn/project1**
1. 创建版本库 **svnadmin create /var/svn/project1**

    ```sh
    [will@master-cent7-1:/var/svn/project1]$>ll
    总用量 16
    drwxr-xr-x. 2 root root   51 10月 24 09:28 conf
    drwxr-sr-x. 6 root root 4096 10月 24 09:12 db
    -r--r--r--. 1 root root    2 10月 24 09:12 format
    drwxr-xr-x. 2 root root 4096 10月 24 09:12 hooks
    drwxr-xr-x. 2 root root   39 10月 24 09:12 locks
    -rw-r--r--. 1 root root  229 10月 24 09:12 README.txt
    ```

1. 进入 conf 目录(该 svn 版本库配置文件) **cd conf/**

    ```sh
    authz           文件是权限控制文件
    passwd          是帐号密码文件
    svnserve.conf   svn 服务配置文件
    ```

1. 设置帐号密码, 在文件 passwd 中: 在[users]块中添加用户和密码, 格式: `帐号=密码`, 如 `ljc=ljc`

    ```sh
    [will@master-cent7-1:/var/svn/project1/conf]$>vim passwd
    ### This file is an example password file for svnserve.
    ### Its format is similar to that of svnserve.conf. As shown in the
    ### example below it contains one section labelled [users].
    ### The name and password for each user follow, one account per line.

    [users]
    # harry = harryssecret
    # sally = sallyssecret
    ljc=ljc
    ```

1. 设置权限: 在文件 authz 添加如下代码:

    ```sh
    [groups]
    admin = user1, user2

    [/]
    @admin = rw  # admin 用户组对当前版本库的根目录有读写权限
    ljc = rw
    * =          # 其他用户权限为空
    ```

1. 修改 svnserve.conf 文件:　打开下面的几个注释

    ```sh
    anon-access = none    # 匿名用户无权限
    auth-access = write   # 授权用户可写
    password-db = passwd  # 使用哪个文件作为账号文件
    authz-db = authz      # 使用哪个文件作为权限文件
    realm = project1      # 认证空间名
    ```

1. 启动 svn

    ```sh
    svnserve -d --listen-port 3690 -r /var/svn/project1  # 用 svn://192.168.125.171[:3690] 打开 /project1
    ```

    or

    ```sh
    svnserve -d --listen-port 3690 -r /var/svn           # 用 svn://192.168.125.171[:3690]/project1 打开 /project1
    ```

    停止 svn 命令

    ```sh
    killall svnserve
    ```

## 高级

### 1. 搭建支持 HTTP 协议的 svn 服务器

http://www.centoscn.com/CentosServer/ftp/2015/0620/5701.html

### 2. 配置 svn 服务器开机启动

```sh
systemctl enable svnserve.service
```

### 3. 多仓库

#### 两个仓库

```sh
svnadmin create /var/svn/project1
svnadmin create /var/svn/project2
```

#### 共用一份 authz 和 passwd 文件

```sh
cd /var/svn/project1/conf
cp authz passwd /var/svn
```

passwd 的填写见 6.

authz 修改如下

```sh
[groups]
admin = user1, user2
group1 = abc,cde
group2 = cde,ljk

[project1:/] # 仓库 1 与仓库 2 权限管理不同
@group1 = rw # group1 用户组对 project1 项目的根目录有读写权限
ljc = rw
* =          # 其他用户权限为空

[project2:/]
@group2 = rw # group2 用户组对 project2 项目的根目录有读写权限
ljc = rw
* =
```

若是多个仓库的认证权限一样, 可以这样(若指定了仓库独有的权限就会 **屏蔽** 这一条)

```sh
[/]          # admin 用户组对 **所有未指定独有权限的项目的根目录** 有读写权限
@admin = rw
```

#### svnserve.conf 文件的填写

project1 的 svnserve.conf 文件

```sh
anon-access = none          # 匿名用户无权限
auth-access = write         # 授权用户可写
password-db = ../../passwd  # 与 project2 共用一个
authz-db = ../../authz      # 与 project2 共用一个
realm = project1            # 认证空间名
```

project2 的 svnserve.conf 文件

```sh
anon-access = none          # 匿名用户无权限
auth-access = write         # 授权用户可写
password-db = ../../passwd  # 与 project1 共用一个
authz-db = ../../authz      # 与 project1 共用一个
realm = project2            # 认证空间名
```

####　启动 svn

```sh
svnserve -d --listen-port 3690 -r /var/svn/
```

用 svn://192.168.125.171[:3690]/project1 访问 /project1

用 svn://192.168.125.171[:3690]/project2 访问 /project2
