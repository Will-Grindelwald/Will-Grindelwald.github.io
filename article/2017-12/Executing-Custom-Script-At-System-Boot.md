---
title: 开机执行自定义脚本
date: 2017-12-22
categories:
- Linux
- 运维
tags:
- 运维
---

Linuxer 常常会有定制化需求: 在开机启动时执行一些自定义的脚本, 那么如何实现呢?

<!-- more -->

## 旧式解决方案

### for CentOS7

1. 在 /etc/init.d/ 下创建脚本 XXX.sh, 内容开头有要求

    ```sh
    #!/bin/bash
    #chkconfig:2345 80 30
    #description:XXX
    ```

    说明:

    2345 是指脚本的运行级别，即在 2345 这 4 种模式下都可以运行，234 都是文本界面，5 就是图形界面 X
    80 是指脚本将来的启动顺序号，如果别的程序的启动顺序号比 70 小（比如 44、45），则脚本需要等这些程序都启动以后才启动。
    30 是指系统关闭时，脚本的停止顺序号。

1. 给予执行权限

    ```sh
    # chmod 755 /etc/init.d/XXX.sh
    ```

1. 利用 chkconfig 命令将脚本设置为自启动

    ```sh
    # chkconfig --add XXX.sh
    ```

    命令使用 `man chkconfig`

### for Debian9

1. 在 /etc/init.d/ 下创建 System-V 风格的启动脚本 XXX.sh, 内容开头有要求

    ```sh
    #!/bin/bash
    ### BEGIN INIT INFO
    # Default-Start:     2 3 4 5
    # Default-Stop:      0 1 6
    ### END INIT INFO
    ```

    参考文档: https://wiki.debian.org/LSBInitScripts
    以及一篇博文: http://www.d3rm.org/Linux_Boot_Process/LSB_Init_Scripts.html

1. 给予执行权限

    ```sh
    # chmod 755 /etc/init.d/XXX.sh
    ```

1. 安装这个 System-V 风格的启动脚本

    ```sh
    # update-rc.d XXX.sh defaults
    ```

    命令使用 `man update-rc.d`

## systemd 下的新式解决方案

未来都是 systemd, 那在 systemd 下怎样实现我们的需求?

可以写一个自己的服务 Unit, 功能更丰富, start stop restart

我的需求暂时已经被上面的方法满足了, 就先不研究了 :)

附几篇参考文献吧

* http://forum.ubuntu.org.cn/viewtopic.php?f=155&t=395231
* https://wiki.archlinux.org/index.php/Systemd_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)#.E7.BC.96.E5.86.99.E5.8D.95.E5.85.83.E6.96.87.E4.BB.B6
* http://blog.csdn.net/fu_wayne/article/details/38018825
