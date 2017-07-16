---
title: 一些常用的修复 Windows 系统的命令行及使用教程
date: 2017-03-29
categories:
- Windows
- cmd
tags:
- Windows
- cmd
---

## 1 基础

对于一些问题, 我们可以先试一试 `sfc` 命令.

简介: SFC 命令用于检查系统文件, 并可以在重启 win7 后恢复受损的系统文件.

| 参数 | 解释 |
| ------------ | -------- |
| /scannow     | 立即扫描所有受保护的系统文件. |
| /scanonce    | 一次扫描所有受保护的系统文件. |
| /scanboot    | 每次重启时扫描所有受保护的系统文件. |
| /revert      | 将扫描返回到默认操作. |
| /purgecache  | 立即清除 "Windows 文件保护" 文件缓存, 并扫描所有受保护的系统文件. |
| /cachesize=x | 设置 "Windows 文件保护" 文件缓存的大小, 以 MB 为单位. |

<!-- more -->

例如: 在 "命令提示符" 窗口中, 输入命令

```cmd
SFC /Scannow
```

此命令在完成扫描及重启操作后, 一些基本的文件损坏故障就可以恢复.

## 2 进阶篇

如果上面的方法还无法修复问题, 那么就可以试一试 dism 命令了. DISM 命令功能强大复杂, 这里就不细说.

操作: 管理员运行 CMD 后, 输入

```cmd
Dism/Online /Cleanup-Image /A
```

其中, A 部分有三种格式

1. Scanhealth 扫描所有系统文件的完整性.
1. Checkhealth 检查系统文件, 并与服务器标准对比, 然后报告偏差文件
1. Restorehealth 将所有有偏差的文件恢复至于服务器样本一致

注意: 运行上面的命令时, 需要电脑有可用网络. 并且, 这条命令比较花时间, 比较消耗电脑资源, 所以修复期间建议可以干点别的.

补充: 对于没有网的小伙伴, 有没有不要网络的方法呢？答案当然是有的. 前提是你要有一个当前系统的 ISO 安装镜像 (其实只需要用到里面的 install.wim 文件).

步骤:

1. 如果是 ISO 镜像, 先挂载当前系统镜像. 如果是 install.wim 请略过这一步
1. 使用 wimtool 工具挂载 install.wim 文件到指定的目录, 这里以 d:\mount 为例. 小伙伴们自己修复时只需要把 D:\mount 改为自己的路径就可以了.
1. 挂载完成后管理员身份运行下面的命令 Dism /Online/Cleanup-Image /RestoreHealth /Source:D:\mount\windows /LimitAccess
1. 不喜欢命令的童鞋推荐使用初雨论坛的 DISM++ 工具.

## 参考

https://www.landiannews.com/archives/15698.html
