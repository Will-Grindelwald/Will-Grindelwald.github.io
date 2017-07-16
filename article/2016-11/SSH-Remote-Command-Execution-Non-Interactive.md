---
title: ssh 非交互式远程执行命令
date: 2016-11-21
categories:
- Linux
- 运维
tags:
- 运维
- ssh
---

**待整理**

非交互式在远程主机上执行命令或者脚本可以帮助我们快速完成一些任务. 比如, 在集群环境中, 同时在各个结点上的日志文件中查询特定的关键字

ssh 命令格式如下:

```sh
ssh [-1246AaCfgKkMNnqsTtVvXxYy] [-b bind_address] [-c cipher_spec]
    [-D [bind_address:]port] [-e escape_char] [-F configfile]
    [-I pkcs11] [-i identity_file]
    [-L [bind_address:]port:host:hostport]
    [-l login_name] [-m mac_spec] [-O ctl_cmd] [-o option] [-p port]
    [-R [bind_address:]port:host:hostport] [-S ctl_path]
    [-W host:port] [-w local_tun[:remote_tun]]
    [user@]hostname [command]
```

<!-- more -->

主要参数说明:
-l 指定登入用户
-p 设置端口号
-f 后台运行, 并推荐加上 -n 参数
-n 将标准输入重定向到 /dev/null, 防止读取标准输入
-N 不执行远程命令, 只做端口转发
-q 安静模式, 忽略一切对话和错误提示
-T 禁用伪终端配置

ssh 执行远程命令格式:

ssh [options][remote host][command]

假设远程服务器 IP 是 192.168.110.34

例: 查看远程服务器的 cpu 信息

```sh
www-online@onlinedev01:~$ ssh -l www-online 192.168.110.34 "cat /proc/cpuinfo"
www-online@192.168.110.34's password:
processor       : 0
vendor_id       : GenuineIntel
cpu family      : 6
model           : 26
model name      : Intel(R) Xeon(R) CPU           E5506  @ 2.13GHz
stepping        : 5
cpu MHz         : 2128.000
cache size      : 4096 KB
fpu             : yes
fpu_exception   : yes
cpuid level     : 11
wp              : yes
flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss syscall nx rdtscp lm constant_tsc arch_perfmon pebs bts rep_good xtopology tsc_reliable nonstop_tsc aperfmperf pni ssse3 cx16 sse4_1 sse4_2 popcnt hypervisor lahf_lm
bogomips        : 4256.00
clflush size    : 64
cache_alignment : 64
address sizes   : 40 bits physical, 48 bits virtual
power management:

processor       : 1
vendor_id       : GenuineIntel
cpu family      : 6
model           : 26
model name      : Intel(R) Xeon(R) CPU           E5506  @ 2.13GHz
stepping        : 5
cpu MHz         : 2128.000
cache size      : 4096 KB
fpu             : yes
fpu_exception   : yes
cpuid level     : 11
wp              : yes
flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss syscall nx rdtscp lm constant_tsc arch_perfmon pebs bts rep_good xtopology tsc_reliable nonstop_tsc aperfmperf pni ssse3 cx16 sse4_1 sse4_2 popcnt hypervisor lahf_lm
bogomips        : 4260.80
clflush size    : 64
cache_alignment : 64
address sizes   : 40 bits physical, 48 bits virtual
power management:
```

例: 执行远程服务器的 sh 文件
首先在远程服务器的 /home/www-online/ 下创建一个 uptimelog.sh 脚本

```sh
#!/bin/bash

uptime >> 'uptime.log'

exit 0
```

使用 chmod 增加可执行权限

```sh
chmod u+x uptimelog.sh
```

在本地调用远程的 uptimelog.sh

```sh
ssh -l www-online 192.168.110.34 "/home/www-online/uptimelog.sh"
```

执行完成后, 在远程服务器的 /home/www-online/ 中会看到 uptime.log 文件, 显示 uptime 内容

```sh
www-online@nmgwww34:~$ tail -f uptime.log
21:07:34 up 288 days,  8:07,  1 user,  load average: 0.05, 0.19, 0.31
```

例: 执行远程后台运行 sh
首先把 uptimelog.sh 修改一下, 修改成循环执行的命令。作用是每一秒把 uptime 写入 uptime.log

```sh
#!/bin/bash

while :
do
  uptime >> 'uptime.log'
  sleep 1
done

exit 0
```

我们需要这个 sh 在远程服务器以后台方式运行, 命令如下:

```sh
www-online@onlinedev01:~$ ssh -l www-online 192.168.110.34 "/home/www-online/uptimelog.sh &"
www-online@192.168.110.34's password:
```

输入密码后, 发现一直停住了, 而在远程服务器可以看到, 程序已经以后台方式运行了。

```sh
www-online@nmgwww34:~$ ps aux|grep uptimelog.sh
1007     20791  0.0  0.0  10720  1432 ?        S    21:25   0:00 /bin/bash /home/www-online/uptimelog.sh
```

原因是因为 uptimelog.sh 一直在运行, 并没有任何返回, 因此调用方一直处于等待状态。
我们先 kill 掉远程服务器的 uptimelog.sh 进程, 然后对应此问题进行解决。

ssh 调用远程命令后不能自动退出解决方法
可以将标准输出与标准错误输出重定向到 /dev/null, 这样就不会一直处于等待状态。

```sh
www-online@onlinedev01:~$ ssh -l www-online 192.168.110.34 "/home/www-online/uptimelog.sh > /dev/null 2>&1 &"
www-online@192.168.110.34's password:
www-online@onlinedev01:~$
```

但这个 ssh 进程会一直运行在后台, 浪费资源, 因此我们需要自动清理这些进程。

实际上, 想 ssh 退出, 我们可以在 ssh 执行完成后 kill 掉 ssh 这个进程来实现。
首先, 创建一个 sh 执行 ssh 的命令, 这里需要用到 ssh 的 -f 与 -n 参数, 因为我们需要 ssh 也以后台方式运行, 这样才可以获取到进程号进行 kill 操作。
创建 ssh_uptimelog.sh, 脚本如下

```sh
#!/bin/bash

ssh -f -n -l www-online 192.168.110.34 "/home/www-online/uptimelog.sh &" # 后台运行 ssh

pid=$(ps aux | grep "ssh -f -n -l www-online 192.168.110.34 /home/www-online/uptimelog.sh" | awk '{print $2}' | sort -n | head -n 1) # 获取进程号

echo "ssh command is running, pid:${pid}"

sleep 3 && kill ${pid} && echo "ssh command is complete" # 延迟 3 秒后执行 kill 命令, 关闭 ssh 进程, 延迟时间可以根据调用的命令不同调整

exit 0
```

可以看到, 3 秒后会自动退出

```sh
www-online@onlinedev01:~$ ./ssh_uptimelog.sh
www-online@192.168.110.34's password:
ssh command is running, pid:10141
ssh command is complete
www-online@onlinedev01:~$
```

然后查看远程服务器, 可以见到 uptimelog.sh 在后台正常执行。

```sh
www-online@nmgwww34:~$ ps aux|grep uptime
1007     28061  0.1  0.0  10720  1432 ?        S    22:05   0:00 /bin/bash /home/www-online/uptimelog.sh
```

查看 uptime.log, 每秒都有 uptime 数据写入。

```sh
www-online@nmgwww34:~$ tail -f uptime.log
22:05:44 up 288 days,  9:05,  1 user,  load average: 0.01, 0.03, 0.08
22:05:45 up 288 days,  9:05,  1 user,  load average: 0.01, 0.03, 0.08
22:05:46 up 288 days,  9:05,  1 user,  load average: 0.01, 0.03, 0.08
22:05:47 up 288 days,  9:05,  1 user,  load average: 0.01, 0.03, 0.08
22:05:48 up 288 days,  9:05,  1 user,  load average: 0.01, 0.03, 0.08
```

通过 SSH 命令远程执行命令首先需要建立相关主机间的信任关系 (无密码登录). 否则, 在执行命令前 SSH 命令会提示你输入远程主机的密码, 这就产生了系统与人的交互, 不利于脚本的自动化. 建立主机间信任关系的方法如下:

假设我们有两台主机. 主机名分别为 linuxa 和 linuxb. 首先在 linuxa 上以当前用户运行如下命令生成本主机的公钥和私钥文件:

```sh
ssh-keygen -t rsa
```

上述命令执行后, 隐藏目录~/.ssh 下会出现两个文件: id_rsa 和 id_rsa.pub. 其中, id_rsa.pub 为公钥文件. 将该文件的内容追加到对端主机 linuxb 上~/.ssh 目录下的 authorized_keys 文件中. 若该文件不存在, 可自行创建之. 下面是一个 id_rsa.pub 文件示例的文件内容:

```sh
ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAtbW/vKjrIkTfFjSJP9FyVb3kQStc31oBuiKVaCZzoejxSM2+ck6CB09l4BoFujpI0+omL4NptxkEAgkCGnMco2yXrVSOqhqyaQV2BnDPkyMoEq2MGB9hSc9xQKa+Q== viscent@viscent
```

接下来, 就可以在不输入密码的情况下在远程主机私执行命令了. 命令格式如下:

ssh 远程用户名 @远程主机 IP 地址 '远程命令或者脚本'

比如,

```sh
ssh userA@192.168.0.6 'hostname'
```

上述命令执行后, 终端输出的是对端主机的主机名, 而不是你当前登录的主机的主机名. 说明 hostname 这个命令其实是在对端主机上运行的.

若要远程执行脚本, 只需要将上面的命令的第三个参数改为要执行的远程脚本的文件名全称即可. 比如:

```sh
ssh userA@192.168.0.6 '/home/userA/script/test.sh'
```

shell 远程执行: 经常需要远程到其他节点上执行一些 shell 命令, 如果分别 ssh 到每台主机上再去执行很麻烦, 因此能有个集中管理的方式就好了. 一下介绍两种 shell 命令远程执行的方法.

前提条件: 配置 ssh 免密码登陆

*. 对于简单的命令: 如果是简单执行几个命令, 则:

```sh
ssh user@remoteNode "cd /home ; ls"
```

基本能完成常用的对于远程节点的管理了, 几个注意的点:

1. 双引号, 必须有. 如果不加双引号, 第二个 ls 命令在本地执行
1. 分号, 两个命令之间用分号隔开

*. 对于脚本的方式:
　　有些远程执行的命令内容较多, 单一命令无法完成, 考虑脚本方式实现:

```sh
#!/bin/bash
ssh user@remoteNode > /dev/null 2>&1 << eeooff
cd /home
touch abcdefg.txt
exit
eeooff
echo done!
```

远程执行的内容在 "<< eeooff" 至 "eeooff" 之间, 在远程机器上的操作就位于其中, 注意的点:

<< eeooff, ssh 后直到遇到 eeooff 这样的内容结束, eeooff 可以随便修改成其他形式.
重定向目的在于不显示远程的输出了
在结束前, 加 exit 退出远程节点

**需要特别注意的是: 当远程脚本中使用了一些命令, 而这些命令被 Shell 解析器的识别依赖于 PATH 环境变量时, 该脚本需要在其第一行中包含执行 profile 文件的命令. 比如, 在 Bash 中, 该脚本的第一行为:**

```sh
source ~/.bashrc
```

否则, 远程脚本可能报一些命令无法找到的错误.

补充:

配置 hadoop 伪分布式的话, 需要本机对本机能够进行免密码访问, 直接将公钥文件 id_rsa.pub 的文件追加到 authorized_keys 中即可

```sh
sudo apt-get install ssh
cd ~                                             # 最好在要配置的用户的家目录下
ssh-keygen -t rsa                                # 生成 rsa 密钥对, 也可以选 dsa
cp ./.ssh/id_rsa.pub ./.ssh/authorized_keys      # id_rsa.pub 是公钥, id_rsa 是私钥
ssh localhost                                    # 验证, 第一次要输入'yes'确认加入 the list of known hosts
```

## 参考

http://blog.csdn.net/fdipzone/article/details/23000201
http://www.cnblogs.com/ilfmonday/p/ShellRemote.html
http://viscent.iteye.com/blog/1706691
