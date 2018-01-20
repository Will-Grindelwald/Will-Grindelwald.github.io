---
title: VMWare 虚拟机中 CentOS7 使用共享文件夹
date: 2017-12-10
categories:
- Linux
- 运维
tags:
- 运维
---

VMWare 虚拟机提供了 共享文件夹 功能, CentOS7 比较奇怪, 不能自动挂载

<!-- more -->

```sh
# 查看 共享名
vmware-hgfsclient

# 创建挂载点
sudo mkdir /mnt/hgfs

# 挂载
sudo vmhgfs-fuse .host:/ /mnt/hgfs -o subtype=vmhgfs-fuse,allow_other
```
