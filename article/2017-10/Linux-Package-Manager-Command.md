---
title: Linux 软件包管理 命令手册
date: 2017-10-22
categories:
- Linux
- 运维
tags:
- 运维
- 软件包管理
---

rpm deb yum dnf apt apt-get 命令总结

安装单个软件包时(不会有依赖处理)使用 rpm/dpkg, 否则用 yum dnf apt apt-get 来安装, 自动处理依赖。

<!-- more -->

## 1. rpm & deb

### 1.1 rpm

参数

* -a：查询所有套件；
* -b<完成阶段><套件档>+或-t <完成阶段><套件档>+：设置包装套件的完成阶段，并指定套件档的文件名称；
* -c：只列出组态配置文件，本参数需配合"-l"参数使用；
* -d：只列出文本文件，本参数需配合"-l"参数使用；
* -e<套件档>或--erase<套件档>：删除指定的套件；
* -f<文件>+：查询拥有指定文件的套件；
* -h或--hash：套件安装时列出标记；
* -i：显示套件的相关信息；
* -i<套件档>或--install<套件档>：安装指定的套件档；
* -l：显示套件的文件列表；
* -p<套件档>+：查询指定的RPM套件档；
* -q：使用询问模式，当遇到任何问题时，rpm指令会先询问用户；
* -R：显示套件的关联性信息；
* -s：显示文件状态，本参数需配合"-l"参数使用；
* -U<套件档>或--upgrade<套件档>：升级指定的套件档；
* -v：显示指令执行过程；
* -vv：详细显示指令执行过程，便于排错。

常用指令

| 指令                   | 功能                   |
| -------------------- | -------------------- |
| rpm -ivh package.rpm | 安装 RPM/DEB 包         |
| rpm -Uvh package.rpm | 升级 RPM/DEB 包         |
| rpm -ev package      | 卸载 RPM/DEB 包         |
| rpm -qa              | 查询系统中所有已安装 RPM/DEB 包 |
| rpm -qip package     | 查询 RPM/DEB 包中包含的详细信息 |
| rpm -qlp package     | 查询 RPM/DEB 包中包含的文件列表 |

某个程序是哪个软件包安装的，或者哪个软件包包含这个程序

```sh
rpm -qf `which 程序名`    # 返回软件包的全名
rpm -qif `which 程序名`   # 返回软件包的有关信息
rpm -qlf `which 程序名`   # 返回软件包的文件列表
rpm -qilf `which 程序名`  # 返回软件包全名、软件包信息和文件列表
```

某个文件是哪个软件包安装的，或者哪个软件包包含这个文件

```sh
whereis ftptop
ftptop: /usr/bin/ftptop /usr/share/man/man1/ftptop.1.gz

rpm -qf /usr/bin/ftptop
proftpd-1.2.8-1
```

### 1.2 deb

| 指令                        | 功能                |
| ------------------------- | ----------------- |
| dpkg -i package.deb       | 安装包               |
| dpkg -i package.deb       | 升级包               |
| dpkg -r package           | 卸载包               |
| dpkg -P package           | 彻底的卸载(包括配置文件)     |
| dpkg -l                   | 列出当前已安装的包         |
| dpkg -s                   | 查询已经安装的指定软件包的详细信息 |
| dpkg -c package.deb       | 列出 deb 包所包含的文件    |
| dpkg -S keyword           | 查询系统中的某个文件属于那个软件包 |
| dpkg -L package           | 查询系统已安装包的文件位置     |
| dpkg --unpack package.deb | 解开 deb 包的内容       |
| dpkg --configure package  | 配置包               |

### 1.3 简单对照 rpm dpkg

| rpm 指令               | dpkg 指令                           | 功能                   |
| -------------------- | --------------------------------- | -------------------- |
| rpm -ivh package.rpm | dpkg -i package.deb               | 安装 RPM/DEB 包         |
| rpm -Uvh package.rpm | dpkg -i package.deb               | 升级 RPM/DEB 包         |
| rpm -ev package      | dpkg -r package / dpkg -P package | 卸载 RPM/DEB 包         |
| rpm -qa              | dpkg -l                           | 查询系统中所有已安装 RPM/DEB 包 |
| rpm -qip package     | dpkg -s                           | 查询 RPM/DEB 包中包含的详细信息 |
| rpm -qlp package     | dpkg -c package.deb               | 查询 RPM/DEB 包中包含的文件列表 |
| rpm -qf keyword      | dpkg -S keyword                   | 查询系统中的某个文件属于那个软件包    |

## 2. yum & dnf & apt & apt-get

### 2.1 yum 与 dnf

DNF，全称 Dandified Yum，是 RPM 发行版的软件包管理器 Yellowdog Updater, Modified(yum)的下一代版本。DNF 最早出现在 Fedora 18 中，并在 Fedora 22 中替代 yum。

为什么要舍弃 Yum? 有三个主要原因：

1. Yum 没有 API 文档。这意味着开发者需要做更多的工作。Yum 开发者写一个调用函数都需要查看 Yum 的代码库，使开发变得缓慢。
1. Python3。Fedora 将会过渡到 Python3，但 Yum 却没有这个能力，而 DNF 既可以使用 Python2，也可以在 Python3 环境下运行。
1. 依赖解决能力长期是 Fedora 软件包管理的阿喀硫斯之踵。DNF 使用基于 SAT 的依赖问题解决方法，与 SUSE 和 OpenSUSE 的 Zypper 类似。

两者的命令基本一样, 可以无缝过渡。

| yum 指令                   | dnf 指令                   | 功能              |
| ------------------------- | ------------------------- | ----------------- |
| yum install package       | dnf install package       | 安装软件包 |
| yum reinstall package     | dnf reinstall package     | 重新安装软件包 |
| yum update                | dnf update                | 更新所有软件包 |
| yum update package        | dnf update package        | 更新指定软件包 |
| yum upgrade               | dnf upgrade               | 大规模的版本升级 |
| yum check-update          | dnf check-update          | 检查是否有可用的更新 |
| yum remove package        | dnf remove package        | 删除指定软件包 |
| yum autoremove            | dnf autoremove            | 自动移除那些曾作为依赖被安装现在不再需要的软件包 |
| yum list                  | dnf list                  | 显示所有已经安装和可以安装的程序包 |
| yum list --installed      | dnf list --installed      | 显示所有已经安装的程序包 |
| yum list --available      | dnf list --available      | 显示可用软件包的安装情况 |
| yum list package          | dnf list package          | 显示指定软件包的安装情况 |
| yum provides keyword      | dnf provides keyword      | 查看是哪个软件包提供了系统中的某一文件 |
| yum search string         | dnf search string         | 在软件包详细信息中搜索指定字符串 |
| yum info package          | dnf info package          | 显示指定软件包的描述信息和概要信息 |
| yum clean packages        | dnf clean packages        | 清除缓存目录下的软件包 |
| yum clean headers         | dnf clean headers         | 清除缓存目录下的 headers |
| yum clean oldheaders      | dnf clean oldheaders      | 清除缓存目录下旧的 headers |
| yum clean = yum clean all | dnf clean = yum clean all | 清除缓存目录下的软件包及旧的 headers <br>= yum clean packages && yum clean oldheaders |
| yum makecache             | dnf makecache             | 创建元数据缓存 |
| yum history               | dnf history               | 查看 DNF 命令的执行历史 |
| -----------------         | -----------------         | ----------------- |
| yum grouplist             | dnf grouplist             | 查看程序组列表 |
| yum groupinfo group       | dnf groupinfo group       | 显示程序组 group 信息 |
| yum groupinsall group     | dnf groupinsall group     | 安装程序组 |
| yum groupremove group     | dnf groupremove group     | 删除程序组 group |
| -----------------         | -----------------         | ----------------- |
| yum localinstall          | dnf localinstall          | 安装本地的 rpm 软件包 |
| yum localupdate           | dnf localupdate           | 显示本地 rpm 软件包进行更新 |
| -----------------         | -----------------         | ----------------- |
| yum repolist              | dnf repolist              | 显示系统中可用的已配置的源 |
| yum repolist all          | dnf repolist all          | 显示系统中可用和不可用的所有的已配置的源 |
| -----------------         | -----------------         | ----------------- |
| yum deplist package       | dnf deplist package       | 列出指定软件包的依赖关系 |
| yum resolvedep package    | - 无 -                    | 判断哪个包提供了指定依赖|

常用参数

* -y：对所有的提问都回答“yes”
* -c file：指定配置文件
* -q：安静模式
* -v：详细模式
* --enablerepo 可以指定源: yum --enablerepo=elrepo-kernel install kernel-ml

### 2.2 apt 与 apt-get

Debian 系 Linux 操作系统使用名为 Advanced Packaging Tool(APT)的工具来管理包，不要把它与 apt 命令混淆，它们之间是其实不是同一个东西。在基于 Debian 的 Linux 发行版中，有各种工具可以与 APT 进行交互，以方便用户安装、删除和管理的软件包。apt-get 便是其中一款广受欢迎的命令行工具，另外一款较为流行的是 Aptitude 这一命令行与 GUI 兼顾的小工具。还有许多类似的命令，如 apt-cache、apt-config 等。这些命令都比较低级又包含众多功能，普通的 Linux 用户也许永远都不会使用到。换种说法来说，就是最常用的 Linux 包管理命令都被分散在了 apt-get、apt-cache 和 apt-config 这三条命令当中。apt 命令的引入就是为了解决命令过于分散的问题，它包括了 apt-get 命令出现以来使用最广泛的功能选项，以及 apt-cache 和 apt-config 命令中很少用到的功能。在使用 apt 命令时，用户不必再由 apt-get 转到 apt-cache 或 apt-config，而且 apt 更加结构化，并为用户提供了管理软件包所需的必要选项。简单来说就是：apt = apt-get、apt-cache 和 apt-config 中最常用命令选项的集合。

虽然 apt 与 apt-get 有一些类似的命令选项，但它并不能完全向下兼容 apt-get 命令。也就是说，可以用 apt 替换部分 apt-get 系列命令，但不是全部。

| apt 命令             | 取代的命令               | 命令的功能                                 |
| ------------------- | ----------------------- | ---------------------------------------- |
| apt install package | apt-get install package | 安装软件包                                 |
| apt remove package  | apt-get remove package  | 移除软件包                                 |
| apt purge package   | apt-get purge package   | 移除软件包及配置文件                         |
| apt update          | apt-get update          | 刷新存储库索引                              |
| apt upgrade         | apt-get upgrade         | 升级所有可升级的软件包                       |
| apt autoremove      | apt-get autoremove      | 自动删除不需要的包(曾作为依赖被安装现在不再需要) |
| apt full-upgrade    | apt-get dist-upgrade    | 大规模的版本升级                            |
| apt search string   | apt-cache search string | 搜索应用程序                                |
| apt show package    | apt-cache show package  | 显示指定包的信息                             |

当然，apt 还有一些自己的命令：

| 新的 apt 命令     | 命令的功能                                                       |
| ---------------- | -------------------------------------------------------------- |
| apt list         | 列出包含条件的包(已安装，可升级等) 可选参数 --installed --upgradeable |
| apt edit-sources | 编辑源列表                                                       |

另有命令

apt-cache depends package 了解使用依赖
apt-get source package 下载该包的源代码
apt-get build-dep package 安装 package 相关的编译环境
apt-get --reindtall install 重新安装软件包

### 2.3 yum dnf apt apt-get 对照

| yum                       | dnf                       | apt                    | apt-get                 | 说明            |
| ------------------------- | ------------------------- | ---------------------- | ----------------------- | -------------- |
| yum install package       | dnf install package       | apt install package    | apt-get install package | 安装软件包   |
| yum reinstall package     | dnf reinstall package     |                        |                         | 重新安装软件包 |
| yum update                | dnf update                | apt upgrade            | apt-get upgrade         | 更新所有软件包 |
| yum update package        | dnf update package        | apt upgrade package    | apt-get upgrade package | 更新指定软件包 |
| yum upgrade               | dnf upgrade               | apt full-upgrade       | apt-get dist-upgrade    | 大规模的版本升级 |
| yum check-update          | dnf check-update          |                        |                         | 检查是否有可用的更新, 只检查不更新 |
| yum remove package        | dnf remove package        | apt remove package     | apt-get remove package  | 移除软件包 |
| yum autoremove            | dnf autoremove            | apt autoremove         | apt-get autoremove      | 自动删除不需要的包(曾作为依赖被安装现在不再需要) |
| yum list                  | dnf list                  | apt list               | dpkg -l                 | 显示所有已经安装和可以安装的程序包 |
| yum list --installed      | dnf list --installed      | apt list --installed   |                         | 显示所有已经安装的程序包 |
| yum list --available      | dnf list --available      | apt list --upgradeable |                         | 显示可用软件包的安装情况 |
| yum list package          | dnf list package          |                        |                         | 显示指定软件包的安装情况 |
| yum provides keyword      | dnf provides keyword      | dpkg -S keyword        | dpkg -S keyword         | 查看是哪个软件包提供了系统中的某一文件 |
| yum search all string     | dnf search all string     | apt search string      | apt-cache search string | 在软件包详细信息中搜索指定字符串(apt 支持正则) |
| yum info package          | dnf info package          | apt show package       | apt-cache show package  | 显示指定软件包的描述信息和概要信息 |
| yum clean packages        | dnf clean packages        |                        |                         | 清除缓存目录下的软件包 |
| yum clean headers         | dnf clean headers         |                        |                         | 清除缓存目录下的 headers |
| yum clean oldheaders      | dnf clean oldheaders      |                        |                         | 清除缓存目录下旧的 headers |
| yum clean = yum clean all | dnf clean = yum clean all | apt clean *            | apt-get clean *         | 清除缓存目录下的软件包及旧的 headers (apt/apt-get 的 clean 会忽略 clean 之后的任何参数) |
| yum makecache             | dnf makecache             | apt update             | apt-get update          | 创建元数据缓存/刷新存储库索引     |
| yum history               | dnf history               |                        |                         | 查看 DNF 命令的执行历史 |
| /etc/yum.repos.d/*        | /etc/yum.repos.d/*        | /etc/apt/sources.list  | /etc/apt/sources.list   | 源库的设定文件      |
