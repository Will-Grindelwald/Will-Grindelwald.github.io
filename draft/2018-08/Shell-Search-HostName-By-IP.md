---
title: shell search hostname by IP
date: 2018-08-09
categories:
- 
tags:
- 
---

shell 根据 IP 地址反查 hostname

<!-- more -->

## 根据 IP 如何查询 hostname

在 Linux 下有一个工具叫做 nslookup, 利用反向 DNS 协议，可以根据 IP 地址查询到此 IP 地址对应的 hostname。

```sh
nslookup 10.0.0.5
```

即可查询到此 IP 对应的 hostname。

## 根据 hostname 如何查询 IP

1. nslookup

```sh
nslookup hongchangfirst.amazon.com
```

1. 直接 ping，即可显示 IP 地址。

参考: http://blog.csdn.net/hongchangfirst/article/details/44811017
