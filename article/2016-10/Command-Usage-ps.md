---
title: ps 命令
date: 2016-10-22
categories:
- Linux
- Shell
tags:
- Shell
---

## ps 命令是 Process Status 的缩写

ps 命令列出的是执行 ps 命令的时刻的进程的快照, 相关命令: top | htop | pstree

<!-- more -->

## linux 上进程有 5 种状态

1. R TASK_RUNNING 可执行状态 正在运行或在运行队列中等待 - Linux 中 "运行" 和 "就绪" 都是 R
1. S TASK_INTERRUPTIBLE 可中断的睡眠状态
    1. 在等待某事件的发生而被挂起
    1. 进程列表中的绝大多数进程都处于 S 状态 (除非机器的负载很高)
1. D TASK_UNINTERRUPTIBLE 不可中断的睡眠状态
    1. 不可中断指的并不是 CPU 不响应外部硬件的中断, 即是响应中断的
    1. 而是指进程不响应异步信号, 即 kill -9 杀不死!
    1. D 状态总是非常短暂的 (一般是 IO), 通过 ps 命令基本上不可能捕捉到.
1. T TASK_STOPPED or TASK_TRACED 暂停状态或跟踪状态 (如 gdb 中的断点跟踪)
    1. 进程收到 SIGSTOP, SIGSTP, SIGTIN, SIGTOU 信号后停止运行
    1. 向 TASK_STOPPED 状态的进程发送一个 SIGCONT 信号, 可以让其从 TASK_STOPPED 状态恢复到 TASK_RUNNING 状态
    1. 处于 TASK_TRACED 状态的进程不能响应 SIGCONT 信号而被唤醒, 只能等到调试进程通过 ptrace 系统调用执行 PTRACE_CONT、PTRACE_DETACH 等操作, 或调试进程退出, 被调试的进程才能恢复 TASK_RUNNING 状态
1. Z ASK_DEAD – EXIT_ZOMBIE 退出状态
    1. 进程在退出的过程中, 处于 TASK_DEAD 状态, 但进程描述符存在, 直到父进程调用 wait4() 系统调用后释放
    1. 进程成为僵尸进程

## 常用参数

ps 命令支持三种语法格式

* UNIX 风格, 选项可以组合在一起, 选项前 `有 "-" 连字符`
* BSD 风格, 选项可以组合在一起, 选项前 `没有 "-" 连字符`
* GNU 风格的长选项, 选项前 `有两个 "-" 连字符`

可以混用 (?), 但可能有冲突, 我一般使用 UNIX 风格的 ps 命令

ps　[-aAcdefHjlmNVwy]  
　　[acefhgLnrsSTuvxX]  
　　[-C<指令名称>]  
　　[-g<群组名称>][-G<群组号码>]  
　　[-p<程序识别码>][p<程序识别码>]  
　　[-u<用户识别码>][-U<用户识别码>][U<用户名称>]  
　　[-s<阶段作业>]  
　　[-t<终端机编号>][t<终端机号码>]  
　　[-<程序识别码>]  
　　[--group<群组名称>][-Group<群组识别码>]  
　　[--pid<程序识别码>][--user<用户名称>][--User<用户识别码>]  
　　[--sid<阶段作业>][--tty<终端机编码>][--rows<显示列数>]  
　　[--cols<每行字符数>][--columns<每列字符数>][--cumulative][--deselect][--forest][--headers][--no-headers][--lines<显示列数>][--width<每列字符数>]  
　　[--info][--version][--help]

* -a       显示所有终端机下执行的程序, 除了阶段作业领导者之外.
* a        显示现行终端机下的所有程序, 包括其他用户的程序.
* -e = -A  显示所有进程
* -f       显示 UID,PPIP,C 与 STIME 栏位.
* f = -H   以树状结构显示进程的层次
* -g 或 -G <群组识别码> 列出属于该群组的程序的状况, 也可使用群组名称来指定.
* -C       <指令名称> 列出指定指令的程序的状况
* -j 或 j  采用工作控制的格式显示程序状况.
* -l 或 l  详细格式
* -o       用户自定义格式.
* -p 123   指定 pid
* -u abc   指定 username
* u        以用户为主的格式来显示程序状况.
* x        显示所有程序, 不以终端机来区分.

## 示例

1. 常用命令

    ```sh
    ps -ef
    ps -lA
    ps aux
    ps axjf
    ```

    ```sh
    [will@willpc ~]$ ps aux
    USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME  COMMAND
    root         1  0.0  0.0 126804  7604 ?        Ss   11月19   1:09 /usr/lib/systemd/systemd --switched-root --system --deserialize 21
    root         2  0.0  0.0      0     0 ?        S    11月19   0:00 [kthreadd]
    root         3  0.1  0.0      0     0 ?        S    11月19  31:42 [ksoftirqd/0]
    root         7  0.0  0.0      0     0 ?        S    11月19   0:00 [migration/0]
    root         8  0.0  0.0      0     0 ?        S    11月19   0:00 [rcu_bh]
    root         9  0.0  0.0      0     0 ?        S    11月19   0:00 [rcuob/0]
    ```

1. 根据 CPU 使用来升序排序

    ```sh
    ps -aux --sort -pcpu | less
    ```

1. 根据 内存使用 来升序排序

    ```sh
    ps -aux --sort -pmem | less
    ```

1. 我们也可以将它们合并到一个命令, 并通过管道显示前 10 个结果:

    ```sh
    ps -aux --sort -pcpu,+pmem | head -n 10
    ```

1. 根据线程来过滤进程

    如果我们想知道特定进程的线程, 可以使用 -L 参数, 后面加上特定的 PID.

    ```sh
    ps -L 1213
    ```

1. 有时候我们希望以树形结构显示进程, 可以使用 -axjf 参数.

    ```sh
    ps -axjf
    ```

    或者可以使用另一个命令.

    ```sh
    pstree
    ```

    结果往往过长, 一般配合 more/less 和 grep 使用

## ps 输出的 Head 标头 解释

* USER: 该 process 属于哪个使用者
* PID : 该 process 的号码
* %CPU: 该 process 使用掉的 CPU 资源百分比
* %MEM: 该 process 所占用的物理内存百分比
* VSZ : 该 process 使用掉的虚拟内存量 (Kbytes)
* RSS : 该 process 占用的固定的内存量 (Kbytes)
* TTY : 该 process 是在那个终端机上面运作, 若与终端机无关, 则显示 , 另外,  tty1-tty6 是本机上面的登入者程序, 若为 pts/0 等等的, 则表示为由网络连接进主机的程序
* STAT: 该程序目前的状态, 主要的状态有:
    * D 不可中断 Uninterruptible(usually IO)
    * R 正在运行, 或在队列中的进程
    * S 处于休眠状态
    * T 停止或被追踪
    * Z 僵尸进程
    * W 进入内存交换 (从内核 2.6 开始无效)
    * X 死掉的进程
    * < 高优先级
    * n 低优先级
    * s 包含子进程
    * \+ 位于后台的进程组

## 制定格式输出来查看进程状态

```sh
ps -eo user,stat..,cmd
```

参数 -e 显示所有进程信息, -o 参数控制输出. pid, user 和 args 参数显示 PID, 运行应用的用户和运行参数.

* user 用户名
* uid 用户号
* pid 进程号
* ppid 父进程号
* size 内存大小, Kbytes 字节.
* vsize 总虚拟内存大小, bytes 字节 (包含 code+data+stack)
* share 总共享页数
* nice 进程优先级 (缺省为 0, 最大为 -20)
* priority(pri) 内核调度优先级
* pmem 进程分享的物理内存数的百分比
* trs 程序执行代码驻留大小
* rss 进程使用的总物理内存数, Kbytes 字节
* time 进程执行起到现在总的 CPU 暂用时间
* stat 进程状态
* cmd(args) 执行命令的简单格式

例子:

查看当前系统进程的 uid,pid,stat,pri, 以 uid 号排序.

```sh
ps -eo pid,stat,pri,uid –sort uid
```

查看当前系统进程的 user,pid,stat,rss,args, 以 rss 排序.

```sh
ps -eo user,pid,stat,rss,args –sort rss
```

## 使用 PS 实时监控进程状态

ps 命令会显示你系统当前的进程状态, 但是这个结果是静态的.

当有一种情况, 我们需要像上面第四点中提到的通过 CPU 和内存的使用率来筛选进程, 并且我们希望结果能够每秒刷新一次. 为此, 我们可以将 ps 命令和 watch 命令结合起来.

```sh
watch -n 1 'ps -aux --sort -pmem, -pcpu'
```

如果输出太长, 我们也可以限制它, 比如前 20 条, 我们可以使用 head 命令来做到.

```sh
watch -n 1 'ps -aux --sort -pmem, -pcpu | head 20'
```

这里的动态查看并不像 top 或者 htop 命令一样美观. 但是使用 ps 的好处是你能够定义显示的字段, 还可以输出到文件方便日后分析.

举个例子, 如果你只需要看名为'pungki'用户的信息, 你可以使用下面的命令:

```sh
watch -n 1 'ps -aux -U pungki u --sort -pmem, -pcpu | head 20'
```
