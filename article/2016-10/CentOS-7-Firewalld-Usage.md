---
title: CentOS 防火墙 firewalld 使用
date: 2016-10-20
categories:
- Linux
- 运维
tags:
- 运维
- CentOS
- 防火墙
---

## 简介

Centos 7 使用 firewalld 代替了原来的 iptables, 最大的好处有两个:

1. 支持动态更新, 不用重启服务
1. 就是加入了防火墙的 "zone" 概念

<!-- more -->

firewalld 有图形界面和工具界面, 图形界面请参照官方文档

firewalld 的字符界面管理工具是 `firewall-cmd`

firewalld 默认配置文件有两个: `/usr/lib/firewalld/` (系统配置, 尽量不要修改) 和 `/etc/firewalld/` (用户配置地址)

### zone 概念

硬件防火墙默认一般有三个区, firewalld 引入了这一概念, 系统默认存在以下区域 (根据文档自己理解, 如果有误请指正):

* drop: 默认丢弃所有包
* block: 拒绝所有外部连接, 允许内部发起的连接
* public: 指定外部连接可以进入
* external: 这个不太明白, 功能上和上面相同, 允许指定的外部连接
* dmz: 和硬件防火墙一样, 受限制的公共连接可以进入
* work: 工作区, 概念和 workgoup 一样, 也是指定的外部连接允许
* home: 类似家庭组
* internal: 信任所有连接

对防火墙不算太熟悉, 还不太明白。

public、external、dmz、work、home 从功能上都需要自定义允许连接, 具体使用上的区别还需高人指点

## 管理 firewalld

```sh
yum install firewalld firewall-config  # 安装 firewalld

systemctl enable firewalld   # 设置开机自启动
systemctl disable firewalld  # 取消开机自启动
systemctl start firewalld    # 启动
systemctl stop firewalld     # 停止
systemctl restart firewalld  # 重启防火墙
systemctl status firewalld   # 查看防火墙状态
```

## 查看 firewalld 信息

```sh
firewall-cmd --state                       # 状态
firewall-cmd --help                        # 帮助
firewall-cmd --version                     # 版本
firewall-cmd --get-active-zones            # 区域信息
firewall-cmd --get-zone-of-interface=eth0  # 指定接口所属区域
```

## 配置 firewalld

```sh
# 配置完成后都要更新防火墙规则
firewall-cmd --reload            # 更新防火墙规则
firewall-cmd --complete-reload   # 两者的区别就是第一个无需断开连接, 就是 firewalld 特性之一动态添加规则, 第二个需要断开连接, 类似重启服务

# 打开端口 -- 这个最常用
firewall-cmd --zone=public --list-ports                      # 查看区域 public 所有打开的端口
firewall-cmd --zone=public --add-port=8080/tcp               # 加入一个端口到区域 public
firewall-cmd --zone=public --add-port=8080/tcp --permanent   # 永久生效

firewall-cmd --zone=public --add-source=192.168.125.0/24     # 加入源 IP 到区域 public
firewall-cmd --zone=public --add-source=192.168.125.0/24 --permanent  # 永久生效

firewall-cmd --zone=public --add-interface=eth0              # 将接口添加到区域, 默认接口都在 public
firewall-cmd --zone=public --add-interface=eth0 --permanent  # 永久生效

firewall-cmd --set-default-zone=public # 设置默认接口区域, 立即生效无需重启

firewall-cmd --panic-on     # 拒绝所有包
firewall-cmd --panic-off    # 取消拒绝状态
firewall-cmd --query-panic  # 查看是否拒绝

# 打开一个服务, 类似于将端口可视化, 服务需要在配置文件中添加, /etc/firewalld 目录下有 services 文件夹, 这个不详细说了, 详情参考文档
firewall-cmd --zone=work --add-service=smtp

# 移除服务
firewall-cmd --zone=work --remove-service=smtp
```
