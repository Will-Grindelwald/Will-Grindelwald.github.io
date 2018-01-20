---
title: Linux 软件包管理
date: 2017-10-22
categories:
- Linux
- 运维
tags:
- 运维
- 软件包管理
---

详解 Linux 下的软件包管理 rpm、dpkg、YUM 及其前端 yum/dnf、APT 及其前端 apt-get/apt

PS: yum 的下一代 dnf 发展的相当迅速, 而 apt-get 也已被更友好的命令行工具 apt 替代。

只想了解 命令使用 的可以看下一篇 `Linux 软件包管理 命令手册`

<!-- more -->

## 1. RPM/DPKG 两大阵营简介

在 GNU/Linux( 以下简称 Linux) 操作系统中, RPM 和 DPKG 为最常见的两类软件包管理工具, 他们分别应用于基于 RPM 软件包的 Linux 发行版本和 DEB 软件包的 Linux 发行版本。软件包管理工具的作用是提供在操作系统中安装, 升级, 卸载需要的软件的方法, 并提供对系统中所有软件状态信息的查询。

RPM 全称为 Redhat Package Manager, 最早由 Red Hat 公司制定实施, 随后被 GNU 开源操作系统接受并成为很多 Linux 系统 (RHEL) 的既定软件标准。与 RPM 进行竞争的是基于 Debian 操作系统 (UBUNTU) 的 DEB 软件包管理工具 - DPKG, 全称为 Debian Package, 功能方面与 RPM 相似。

### 1.1 RPM 包的安装 / 升级 / 查询 / 卸载

一个 RPM 包包含了已压缩的软件文件集以及该软件的内容信息（在头文件中保存）, 通常表现为以 .rpm 扩展名结尾的文件, 例如 package.rpm 。对其操作, 需要使用 rpm 命令。下面介绍 rpm 工具的参数和使用方法。

#### RPM 命令常用参数

RPM 的常规使用方法为 rpm -? package.rpm, 其中 -? 为操作参数 ( 更多信息, 请查阅帮助 $man rpm)：

* -q 在系统中查询软件或查询指定 rpm 包的内容信息
* -i 在系统中安装软件
* -U 在系统中升级软件
* -e 在系统中卸载软件
* -h 用 #(hash) 符显示 rpm 安装过程
* -v 详述安装过程
* -p 表明对 RPM 包进行查询, 通常和其它参数同时使用, 如：
* -qlp 查询某个 RPM 包中的所有文件列表
* -qip 查询某个 RPM 包的内容信息

#### RPM 命令参数使用方法

以上参数有些需要组合使用, 比如说 rpm -h package.rpm 是没有意义的, 但 rpm -ih package.rpm 即表示安装 package 并用 # 符显示安装进度。

* 安装 RPM 包

    `# rpm -ivh package.rpm`

* 升级 RPM 包命令

    `# rpm -Uvh package.rpm`

* 卸载 RPM 包命令

    `# rpm -ev package`

* 查询 RPM 包中包含的文件列表命令

    `# rpm -qlp package`

* 查询 RPM 包中包含的内容信息命令

    `# rpm -qip package`

* 查询系统中所有已安装 RPM 包

    `# rpm -qa`

#### RPM 包管理示例

以下步骤描述了一个普通用户安装 IBM Lotus Notes V85 ( 以下简称 Notes) 的典型操作过程。 Notes 的 RPM 包名为 ibm_lotus_notes-8.5.i586.rpm 。

1. 首先查询是否该软件是否已经在系统中存在

    `# rpm -qa | grep ibm_lotus_notes`

    如果返回信息为空那么说明该软件还未被安装。

1. 查询 Notes 软件包内容：

    ```sh
    # rpm -qip ibm_lotus_notes-8.5.i586.rpm

     Name        : ibm_lotus_notes           Relocations: /opt/ibm/lotus/notes
     Version     : 8.5                               Vendor: IBM
     Release     : 20081211.1925             Build Date: Sat 13 Dec 2008 09:38:55 AM CST
     Install Date: (not installed)               Build Host: dithers.notesdev.ibm.com
     Group       : Applications/Office
     Source RPM: ibm_lotus_notes-8.5-20081211.1925.src.rpm
     Size        : 603779427                        License: Commercial
     Signature   : DSA/SHA1, Sat 13 Dec 2008 09:43:02 AM CST, Key ID 314c8c6534f9ae75
     Summary     : IBM Lotus Notes
     Description :
     IBM Lotus Notes software provides a robust ...
    ```

1. 安装 Notes:

    `# rpm -ivh ibm_lotus_notes-8.5.i586.rpm`

1. 升级 Notes：

    若今后需要基于该版本升级至更高版本的 Notes(ibm_lotus_notes-9.0.i586.rpm), 则使用 -U 参数：

    `# rpm -Uvh ibm_lotus_notes-8.5.i586.rpm`

    在该步骤中如果使用 -i 则系统通常会报文件冲突错误, 无法正常安装。

1. 卸载 Notes

    注意卸载软件使用软件名称, 而不是包文件名：

    `# rpm -ev ibm_lotus_notes`

### 1.2 DEB 包的安装 / 升级 / 查询 / 卸载

一个 DEB 包包含了已压缩的软件文件集以及该软件的内容信息（在头文件中保存）, 通常表现为以 .deb 扩展名结尾的文件, 例如 package.deb 。对其操作, 需要使用 dpkg 命令。下面介绍 dpkg 工具的参数和使用方法, 并以 IBM Lotus Notes 在 UBUNTU 904 安装为例做具体说明。

#### DPKG 命令常用参数

DPKG 的常规使用方法为 dpkg -? Package(.rpm), 其中 -? 为安装参数 ( 更多信息, 请查阅帮助 $man rpm)：

* -l 在系统中查询软件内容信息
* --info 在系统中查询软件或查询指定 rpm 包的内容信息
* -i 在系统中安装 / 升级软件
* -r 在系统中卸载软件 , 不删除配置文件
* -P 在系统中卸载软件以及其配置文件

#### DPKG 命令参数使用方法

* 安装 DEB 包命令

    `$ sudo dpkg -i package.deb`

* 升级 DEB 包命令

    `$ sudo dpkg -i package.deb ( 和安装命令相同）`

* 卸载 DEB 包命令

    `$ sudo dpkg -r package.deb # 不卸载配置文件`
    `$ sudo dpkg -P package.deb # 卸载配置文件`

* 查询 DEB 包中包含的文件列表命令

    `$ sudo dpkg-deb -c package.deb`

* 查询 DEB 包中包含的内容信息命令

    `$ dpkg --info package.deb`

* 查询系统中所有已安装 DEB 包

    `$ dpkg -l package`

#### DEB 包管理示例

以下步骤描述了一个普通用户安装 IBM Lotus Notes V85 ( 以下简称 Notes) 的典型操作过程。 Notes 的 DEB 包名为 ibm_lotus_notes-8.5.i586.deb.

1. 首先查询是否该软件是否已经在系统中存在

    `$ dpkg -l ibm-lotus-*`

    如果系统中从未安装过 Lotus 产品, 那么返回信息为 :

    `No pakcages found matching ibm-lotus-*`

    如果系统安装过 Lotus 产品, 但已被删除, 那么返回信息为 :

    `pn ibm-lotus-notes none (no description available)`

1. 查询 Notes 软件包内容：

    `$ dpkg --info ibm_lotus_notes-8.5-i586.deb`

    返回信息 :

    ```sh
    new debian package, version 2.0.
     size 335012296 bytes: control archive= 231821 bytes.
     ...
     Package: ibm-lotus-notes
     Version: 8.5-20081211.1925
     Section: IBM
     Priority: extra
     Architecture: i386
     Installed-Size: 619444
     Maintainer: IBM Lotus Product
     Description: IBM Lotus Notes
      IBM Lotus Notes software provides a robust ... ...
    ```

1. 安装 Notes:

    `$ sudo dpkg -i ibm_lotus_notes-8.5.i586.deb`

    返回信息 :

    ```sh
    (Reading database ... 151150 files and directories currently installed.)
     Preparing to replace ibm-lotus-notes 8.5-20081211.1925
     (using ibm-lotus-notes-higher-version.i586.deb) ...
     Unpacking replacement ibm-lotus-notes ...

     Setting up ibm-lotus-notes (higher-version) ...
    ```

1. 升级 Notes：

    `$ sudo dpkg -i ibm_lotus_notes-8.5.i586.deb`

    返回信息 :

    ```sh
    (Reading database ... 151150 files and directories currently installed.)
     Preparing to replace ibm-lotus-notes 8.5-20081211.1925
     (using ibm-lotus-notes-higher-version.i586.deb) ...
     Unpacking replacement ibm-lotus-notes ...

     Setting up ibm-lotus-notes (higher-version) ...
    ```

1. 卸载 Notes

    注意卸载软件使用软件名称, 而不是包文件名：

    `$ sudo dpkg -P ibm-lotus-notes`

## 2. 更友好的包管理软件

### 2.1 软件包依赖性关系

由于开源的多态性, Linux 操作系统中的软件之间的依赖性关系处理一直令用户感到头疼。如果 package_a 依赖于 package_b, 那么在一个没有安装 package_b 的系统中, package_a 是不被系统推荐安装的, 强制安装很可能会导致软件无法正常工作。基于以上 package_a 和 package_b 的关系, 在一个干净的系统中 ( 未安装 package_a 或 package_b), 欲安装 package_a, 错误通常会表现为：

RHEL 5.2

```sh
# rpm -ivh package_a.rpm

 error: Failed dependencies:
        pacakge_b = version info is needed by package_a
```

Ubuntu 904

```sh
$ sudo dpkg -i package_a.deb

 dpkg: regarding package_a.deb containing package, pre-dependency problm:
  package_a pre-depends on package_b (version info)
 dpkg: error processing package_a.deb (--install):
  pre-dependency problem - not installing package_a
 Errors were encountered while processing:
  package_a.deb
```

#### 查询软件包依赖关系

##### 查询 RPM 包的依赖关系, 使用 rpm -qRp

```sh
# rpm -qRp package_a.rpm

 package_b = version_info
或
 package_b >= version_info
或
 package_b <= version_info
```

表明 package_a.rpm 依赖于 version_info 版的 package_b, 或者任何高于并包括 version_info 版的 package_b, 亦或低于或包括 version_info 版的 package_b 。所以 package_b.rpm 必须在 package_a 之前安装于系统中。

##### 查询 DEB 包的依赖关系, 可解读 dpkg --info 结果中的 Pre-Depends 字段：

```sh
$ dpkg --info package_a.deb

 Pre-depends: package_b (= version_info)
 Depends: package_b (= version_info)
或
 Pre-depends: package_b (>= version_info)
 Depends: package_b (>= version_info)
或
 Pre-depends: package_b (<= version_info)
 Depends: package_b (<= version_info)
```

表明 package_a.deb 依赖于 version_info 版的 package_b 或者任何高于并包括 version_info 版的 package_b 亦或低于或包括 version_info 版的 package_b. 所以 package_b.deb 必须在 package_a 之前安装于系统中。

所以正确的安装方法如下节所示。

#### 安装方法

对于 package_a, 正确的安装方法应该是：

```sh
##RPM
 # rpm -ivh package_b.rpm
 # rpm -ivh package_a.rpm

 ##DEB
 $ sudo dpkg -i package_b.deb
 $ sudo dpkg -i package_a.deb
```

#### 嵌套的依赖关系

如上示例为最理想的依赖关系, 实际应用中往往最令用户头疼的是 package_a 依赖于 package_b/c/d/e/f 等多个包 , 而 package_b/c/d/e/f 等包又依赖于 package_b1,b2,b3/c1,c2/d1,d2/e1,e2/f1,f2 等等 ... ... 为保证软件的正常使用, 必须找到所有依赖包以及子依赖包并且安装。过多的依赖关系大大降低了 Linux 软件安装的用户友好性。所以针对此类问题, 使用了更高级的包管理策略去解决 - Yum/APT 。

### 2.2 YUM

YUM 基于 RPM 包管理工具, 能够从指定的源空间（服务器, 本地目录等）自动下载目标 RPM 包并且安装, 可以自动处理依赖性关系并进行下载、安装, 无须繁琐地手动下载、安装每一个需要的依赖包。此外, YUM 的另一个功能是进行系统中所有软件的升级。如上所述, YUM 的 RPM 包来源于源空间, 在 RHEL 中由 /etc/yum.repos.d/ 目录中的 .repo 文件配置指定, 如 rhel-debuginfo.repo 的内容：

rhel-debuginfo.repo

```sh
[rhel-debuginfo]
 name=Red Hat Enterprise Linux 5Client - i386 - Debug
 baseurl=ftp://ftp.redhat.com/pub/redhat/linux/enterprise/5Client/en/os/i386/Debuginfo/
 enabled=0
 gpgcheck=1
 gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-redhat-release
```

YUM 的系统配置文件位于 /etc/yum.conf, 内容如：

```sh
[main]
 cachedir=/var/cache/yum
 keepcache=1
 debuglevel=2
 pkgpolicy=newest
 logfile=/var/log/yum.log
 distroverpkg=redhat-release
 tolerant=1
 exactarch=1
 obsoletes=1
 gpgcheck=1
 plugins=1
 exclude=firefox gftp
```

配置文件用来定义用户期望的 yum 行为, 比如, gpgcheck=1 表明安装时不进行 gpg 验证, exclued=firefox gftp 表明进行系统全软件升级时不升级 firefox 和 gftp 。

### yum 常用命令

* 安装指定软件 :

    `# yum -y install package-name`

* 列出系统中已安装软件

    `# yum list`

* 列出系统中可升级的所有软件

    `# yum check-update`

* 升级系统中可升级的所有软件

    `# yum update`

* 升级指定软件

    `# yum update package-name`

* 在升级过程中接受所有互动问答

    `# yum -y update`

* 卸载指定软件

    `# yum remove package-name`

更多有关 yum 的信息, 请查阅 http://fedoraproject.org/wiki/Tools/yum 。

### 2.3 APT

APT 的全称为 Advanced Packaging Tools 。与 YUM 对应, 它最早被设计成 DPKG 的前端软件, 现在通过 apt-rpm 也支持 rpm 管理。而本节本节将介绍 APT 作为 DPKG 前端的使用。 APT 的主要命令行工具为 apt-get, 通过此工具可满足和上述 yum 相似的功能要求。

APT 的软件源定义来自 /etc/apt/sources.list 文件：

```sh
# See http://help.ubuntu.com/community/UpgradeNotes for how to upgrade to
 # newer versions of the distribution.

 deb http://cn.archive.ubuntu.com/ubuntu/ hardy main restricted
 deb-src http://cn.archive.ubuntu.com/ubuntu/ hardy main restricted
```

注意每次手动修改上述文件后, 需要使用 sudo apt-get update 来更新系统的源使新的源数据被当前系统识别。

UBUNTU 中 APT 的配置文件位于 /etc/apt/apt.conf.d, 其中的多个配置文件依功能分类。

#### apt-get 常用命令

* 更新源索引

    `$ sudo apt-get update`

* 安装指定软件

    `$ sudo apt-get install package-name`

* 下载指定软件的源文件

    `$ sudo apt-get source package-name`

* 将系统中所有软件升级到最新版本

    `$ sudo apt-get upgrade`

* 将操作系统连同所有软件升级到最新版本

    `$ sudo apt-get dist-upgrade`

* 卸载指定软件

    `$ sudo apt-get remove package-name`

更多有关 APT 的信息, 请查阅 http://www.debian.org/doc/manuals/apt-howto/index.en.html 。

### 2.4 RPM 与 DEB 的兼容 - Alien

Alien 工具可以将 RPM 软件包转换成 DEB 软件包, 或把 DEB 软件包转换成 RPM 软件包, 以此适应兼容性的需要。注意首先请在系统中安装 alien 。

* 在 UBUNTU 中使用 alien 将 rpm 转换为 deb 并安装 :

  `$ sudo alien -d package.rpm `` ``$ sudo dpkg -i package.deb`

* 在 RHEL 中使用 alien 将 deb 转换为 rpm 并安装 :

  `# alien -r package.deb `` ``# rpm -ivh package.rpm`

更多 alien 相关信息请查阅 http://linux.die.net/man/1/alien

## 3. 总结

本文以 RHEL 5.2 和 Ubuntu 904 为例, 基于命令行操作, 介绍了 Linux 系统中两大常用软件包管理工具 - RPM 与 DPKG 。首先从最底端的 rpm/dpkg 命令操作开始列举了它们的基本使用方法, 随后指出了软件的依赖关系以及由此带来的问题, 并对此问题的解决方案, 也是最流行的 YUM 与 APT 前端软件管理系统进行了操作介绍。最后本文简要说明了当前 RPM/DEB 的兼容性问题的常规解决方法。

## 4. 常见问题列表

### 可以手动强制不进行 RPM/DEB 的依赖性关系检查吗？

* RPM

    可以。使用 --nodeps 辅助参数, 则安装过程将不理会依赖性关系限制, 强制安装目标包, 如：

    ```sh
    rpm -i --nodeps package_a.rpm
    ```

* DEB

    可以。使用— force-depends 辅助参数, 如：

    ```sh
    sudo dpkg -i --force-depends package_a.deb
    ```

### RPM 中的 --force 是干什么用的？

RPM 中的默认安装规则是不允许同一个包多次安装的, 也不允许降级安装。使用 --force 辅助参数将不考虑以上因素, 强制安装 RPM 包。但是, --force 无法强制安装一个不满足系统依赖性关系的包 ( 此时需要用到 --nodeps 参数 ) 。使用方法如：

`# rpm -i --force package_a.rpm`

### RPM/DPKG 支持远程安装吗？

* RPM

    是。 RPM 支持 HTTP 和 FTP 协议, 如：

    ```sh
    rpm -Uvh ftp://user:pass@ftpserver/package.rpm
    ```

* DPKG

    最新的基于 DEB 包的系统中, 远程安装通常被更先进的 APT 代替。

### 可以从 RPM/DPKG 中抽取个别文件吗？

* RPM

    是。可以使用 rpm2cpio 工具来提取文件：[http://www.rpm.org/max-rpm/s1-rpm-miscellania-rpm2cpio.html](http://www.rpm.org/max-rpm/s1-rpm-miscellania-rpm2cpio.html)

* DPKG

    是。可以使用 dpkg-deb 工具来提取文件：

    ```sh
    dpkg-deb --extract ibm_lotus_notes-8.5.i586.deb $dir( 目标目录 )
    ```

### RPM/DPKG 提供包安装成功的验证机制吗？

* RPM

    是。可以使用 -V 参数进行验证。

* DPKG

    Debian 系统通常使用 debsums 工具参数进行验证。

### RPM/DPKG 提供包安全签名吗？

* RPM

    是。可以使用 --import 导入与软件同时发布的 GPG KEY, 接着使用 -K 命令来验证包的安全性, 如：

    ```sh
    rpm --import pub_ibm_lotus_notes.gpg # rpm -K ibm_lotus_notes-8.5.i586.rpm 返回信息 : ibm_lotus_notes-8.5.i586.rpm: (sha1) dsa sha1 md5 gpg OK
    ```

* DPKG

    DPKG 不提供原生的 Key 验证机制。可以使用 debsigs 和 debsigs-verify, 详情请见：[http://man.ddvip.com/os/debiansecuring-howto/ch7.zh-cn.html](http://man.ddvip.com/os/debiansecuring-howto/ch7.zh-cn.html)

### 如果 RPM 的底层数据库损坏, RPM 还能使用吗？

* RPM

    如果底层数据库损坏, RPM 将无法正常使用。此时最常用的解决方法是重构数据库：

    ```sh
    rm -f /var/lib/rpm/__* ; rpm -vv --rebuilddb
    ```

* RPM

    DPKG 本身不提供底层数据库恢复机制。它的数据库以文件形式保存在 /var/lib/dpkg 目录中。及时地备份这个目录是最好的预防数据库损坏措施。

### 可以查询系统中已经安装的某个文件属于哪个 RPM 包吗？

* RPM

    可以。使用 -qf 参数 , 如在安装了 Notes8.5 的系统中：

    ```sh
    rpm -qf /opt/ibm/lotus/notes/notes 返回信息 : Ibm_lotus_notes-8.5-20081211.1920
    ```

* DPKG

    可以。使用— search 参数 , 如在安装了 Notes8.5 的系统中：

    ```sh
    dpkg --search /opt/ibm/lotus/notes/notes 返回信息 : ibm-lotus-notes: /opt/ibm/lotus/notes/notes
    ```

### 可以查询 RPM 包的安装时间吗？

* RPM

    可以。可使用 --last 查询。如：

    ```sh
    rpm -qa --last 返回信息 : 系统中所有软件的安装时间。
    ```

* DPKG

    DPKG 不提供直接的查询参数, 但是可以用过查询 dpkg 的日志文件实现这个功能。如：

    ```sh
    cat /var/log/dpkg.log | grep "\ install\ "
    ```