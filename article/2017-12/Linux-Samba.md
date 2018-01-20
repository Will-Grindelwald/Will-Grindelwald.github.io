---
title: linux 访问 windows 共享文件夹
date: 2017-12-06
categories:
- Linux
- Shell
tags:
- Shell
- samba
---

linux 访问 windows 共享文件夹主要有两种方式: mount 和 samba

<!-- more -->

## mount

1. 安装 cifs

    ```sh
    sudo yum install cifs-utils
    ```

1. 创建挂载点

    ```sh
    mkdir /mnt/share
    ```

1. 将共享文件夹挂载到 share 文件夹

    ```sh
    sudo mount -t cifs -o username=<share>,password=<share> //192.168.66.198/share /mnt/share
    sudo mount -t cifs -o username=<share>,password=<share> //192.168.66.198 /mnt/share
    ```

    其中几个参数表示含义:
    cifs: Common Internet File System, 可以理解为网络文件系统。取代被淘汰的 smbfs
    usrname: 访问共享文件夹的用户名
    password: 访问密码
    //192.168.66.198/share: 表示网络文件夹的地址, **注意这里最后不能加 /**, 如果是//192.168.66.198/share/ 则会报如下错误: mount: //192.168.66.198/share/ is not a valid block device

1. 取消挂载

    ```sh
    umount /mnt/share
    ```

PS: 使用 mount 挂载的方法在系统重新启动后就会失效, 如果希望开机时自动挂载, 将下面设置加入 /etc/fstab 文件最后面就可以了。

```sh
//192.168.66.198/share /mnt/share cifs defaults,username=<share>,password=<share> 0 2
```

其中 /mnt/share 表示挂载点, 就是上面 share 目录的完整路径。

## samba

共享文件 使用的 是 samba 协议, 所以可以直接使用 samba-client

```sh
yum install samba-client.x86_64                                 # 安装 samba 客户端
# apt install smbclient
smbclient //192.168.211.1/test_samba                            # 通过 samba 打开 windows 共享目录
smbclient //192.168.1.1/smb_share/ -U smb_user                  # 系统提示输入 smb_user_passwd
smbclient //192.168.1.1/smb_share/ smb_user_passwd -U smb_user  # 不提示输入密码
```

出现提示符

```sh
smb: \> help
exit           get            getfacl        geteas         hardlink
help           history        iosize         lcd            link
......省略若干命令......
```

## 总结

使用 mount 命令相对来说简单一些, 符合使用习惯, 可以用文件管理器查看
