---
title: windows linux 双系统 时间异常
date: 2017-12-27
categories:
- Linux
- 配置
tags:
- Linux配置
- 双系统
---

windows linux 双系统 时间异常

<!-- more -->

原因:

* Windows 把 BIOS 时间当做本地时间
* linux 把 BIOS 时间当做 GTM+0 时间, 东 8 区即 GTM+8
* Windows 同步时间后更改 BIOS 时间, 再进入 Ubuntu 系统, 时间会变成正常时间 +8 小时
* Ubuntu 同步时间后更改 BIOS 时间, 再进入 Windows 系统, 时间会变成正常时间 -8 小时

解决方法就是让 Windows 和 Ubuntu 时间管理的方式相同, 改 linux 比较简单

```sh
sudo hwclock -w --localtime
```

执行该命令后 adjtime 文件(可能本来没有这个文件)的第三行会自动变为 LOCAL, 然后再同步时间即可。
