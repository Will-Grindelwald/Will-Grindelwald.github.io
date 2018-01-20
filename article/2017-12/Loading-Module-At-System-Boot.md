---
title: 在系统启动时加载指定的模块
date: 2017-12-23
categories:
- Linux
- 运维
tags:
- 运维
---

用户常常有这样的需求: 在系统启动时加载某些模块, 如无线模块。而我的需求是在系统启动时加载 nbd 模块。

<!-- more -->

参考: https://wiki.archlinux.org/index.php/Kernel_modules_(简体中文)

## 开机加载

systemd 读取 `/etc/modules-load.d/` 中的配置加载额外的内核模块。配置文件名称通常为 `/etc/modules-load.d/<program>.conf`。格式很简单, 一行一个要读取的模块名, 而空行以及第一个非空格字符为`#`或`;`的行会被忽略, 如：

```sh
/etc/modules-load.d/nbd.conf
```

```sh
# Load nbd.ko at boot
nbd
```

另见 [modules-load.d(5)](http://jlk.fjfi.cvut.cz/arch/manpages/man/modules-load.d.5)。

## 配置内核模块参数

使用 /etc/modprobe.d / 中的文件

要通过配置文件传递参数, 在 `/etc/modprobe.d/` 中添加 `<program>.conf` 文件, 内容为

```sh
options modname parametername=parametercontents
```

例如

```sh
/etc/modprobe.d/nbd.conf
options nbd max_part=16
```
