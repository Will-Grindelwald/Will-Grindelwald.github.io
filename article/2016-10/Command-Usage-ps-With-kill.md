---
title: ps 配合 kill 使用
date: 2016-10-31
categories:
- Linux
- Shell
tags:
- Shell
---

## 常规篇

首先, 用 ps 查看进程, 方法如下:

```sh
$ ps -ef
……
will       1822     1  0 11:38 ?        00:00:49 gnome-terminal
will       1823  1822  0 11:38 ?        00:00:00 gnome-pty-helper
will       1824  1822  0 11:38 pts/0    00:00:02 bash
will       1827     1  4 11:38 ?        00:26:28 /usr/lib/firefox-3.6.18/firefox-bin
will       1857  1822  0 11:38 pts/1    00:00:00 bash
will       1880  1619  0 11:38 ?        00:00:00 update-notifier
……
will      11946  1824  0 21:41 pts/0    00:00:00 ps -ef
```

<!-- more -->

或者:

```sh
$ ps -aux
……
will       1822  0.1  0.8  58484 18152 ?        Sl   11:38   0:49 gnome-terminal
will       1823  0.0  0.0   1988   712 ?        S    11:38   0:00 gnome-pty-helper
will       1824  0.0  0.1   6820  3776 pts/0    Ss   11:38   0:02 bash
will       1827  4.3  5.8 398196 119568 ?       Sl   11:38  26:13 /usr/lib/firefox-3.6.18/firefox-bin
will       1857  0.0  0.1   6688  3644 pts/1    Ss   11:38   0:00 bash
will       1880  0.0  0.6  41536 12620 ?        S    11:38   0:00 update-notifier
……
will      11953  0.0  0.0   2716  1064 pts/0    R+   21:42   0:00 ps -aux
```

此时如果我想杀了火狐的进程就在终端输入:

```sh
kill -9 1827
```

其中 `-9` 指定了传递给进程的信号是 9, 即强制、尽快终止进程.
1827 则是上面 ps 查到的火狐的 PID.
简单吧, 但有个问题, 进程少了则无所谓, 进程多了, 就会觉得痛苦了, 无论是 `ps -ef` 还是 `ps -aux`, 每次都要在一大串进程信息里面查找到要杀的进程, 看的眼都花了.

## 进阶篇

### 改进 1

把 ps 的查询结果通过管道给 grep 查找包含特定字符串的进程. 管道符 "|" 用来隔开两个命令, 管道符左边命令的输出会作为管道符右边命令的输入.

```sh
$ ps -ef | grep firefox
will       1827     1  4 11:38 ?        00:27:33 /usr/lib/firefox-3.6.18/firefox-bin
will      12029  1824  0 21:54 pts/0    00:00:00 grep --color=auto firefox
```

这次就清爽了. 然后就是

```sh
kill -9 1827
```

还是嫌打字多?

### 改进 2 - 使用 pgrep

一看到 pgrep 首先会想到什么? 没错, grep! pgrep 的 p 表明了这个命令是专门用于进程查询的 grep.

```sh
$ pgrep firefox
1827
```

看到了什么? 没错火狐的 PID, 接下来又要打字了:

```sh
kill -9 1827
```

### 改进 3 - 使用 pidof

看到 pidof 想到啥? 没错 pid of xx, 字面翻译过来就是 xx 的 PID.

```sh
$ pidof firefox-bin
1827
```

和 pgrep 相比稍显不足的是, pidof 必须给出进程的全名. 然后就是老生常谈:

```sh
kill -9 1827
```

无论使用 ps 然后慢慢查找进程 PID 还是用 grep 查找包含相应字符串的进程, 亦或者用 pgrep 直接查找包含相应字符串的进程 pid, 然后手动输入给 kill 杀掉, 都稍显麻烦. 有没有更方便的方法? 有!

### 改进 4

```sh
ps -ef | grep firefox | grep -v grep | cut -c 9-15 | xargs kill -9
```

说明:
"grep firefox" 的输出结果是, 所有含有关键字 "firefox" 的进程.
"grep -v grep" 是在列出的进程中去除含有关键字 "grep" 的进程.
"cut -c 9-15" 是截取输入行的第 9 个字符到第 15 个字符, 而这正好是进程号 PID.
"xargs kill -9" 中的 xargs 命令是用来把前面命令的输出结果 (PID) 作为 "kill -9" 命令的参数, 并执行该命令. "kill -9" 会强行杀掉指定进程.
难道你不想抱怨点什么? 没错太长了

### 改进 5

知道 pgrep 和 pidof 两个命令, 干嘛还要打那么长一串!

```sh
pgrep firefox | xargs kill -9
```

### 改进 6

```sh
$ ps -ef | grep firefox | awk '{print $2}' | xargs kill -9
kill: No such process
```

有一个比较郁闷的地方, 进程已经正确找到并且终止了, 但是执行完却提示找不到进程.
其中 awk '{print $2}' 的作用就是打印 (print) 出第二列的内容. 根据常规篇, 可以知道 ps 输出的第二列正好是 PID. 就把进程相应的 PID 通过 xargs 传递给 kill 作参数, 杀掉对应的进程.

### 改进 7

难道每次都要调用 xargs 把 PID 传递给 kill? 答案是否定的:

```sh
kill -9 `ps -aux | grep firefox | awk '{print $2}'`
```

### 改进 8

没错, 命令依然有点长, 换成 pgrep.

```sh
kill -9 `pgrep firefox`
```

### 改进 9 - pkill

看到 pkill 想到了什么? 没错 pgrep 和 kill! pkill = pgrep + kill.

```sh
pkill -9 firefox
```

### 改进 10 - killall

killall 和 pkill 是相似的, 不过如果给出的进程名不完整, killall 会报错. pkill 或者 pgrep 只要给出进程名的一部分就可以终止进程.

```sh
killall -9 firefox
```

## 总结

```sh
ps -ef                         # *
ps -aux                        # *
pgrep firefox                  # *
pidof firefox-bin
pgrep firefox | xargs kill -9
kill -9 `pgrep firefox`        # *
pkill -9 firefox               # *
killall -9 firefox             # *
```

## 参考

http://blog.csdn.net/a351945755/article/details/20210087
