---
title: linux 网络配置
date: 2017-11-02
categories:
- Linux
- 运维
tags:
- 运维
- 网络
- IP
- DNS
- 网关
---

linux 下 IP 网关 DNS 的配置

<!-- more -->

## IP & 网关

### CentOS7

修改网卡配置文件 /etc/sysconfig/network-scripts/ 下 `ifcfg-*` 的文件, "*" 为网卡名

### Debian9/Ubuntu

修改网卡配置文件 /etc/network/interfaces

```sh
# 开机自动激 lo 接口
auto lo
# 配置 lo 接口为环回口
iface lo inet loopback

# 开机自动激活 eth0 接口
auto eth0
# 配置 eth0 接口为静态IP
iface eth0 inet static     # 如果是 IPV6 网络则使用 inet6
address 192.168.247.199
netmask 255.255.255.0
gateway 192.168.247.2

# 单网卡配置多个 ip，设置第二个 ip 地址
auto eth0:0
iface eth0:0 inet static
address 192.168.247.200
netmask 255.255.255.0
gateway 192.168.247.2

# 配置 eth0 接口为 dhcp
auto eth1
iface eth1 inet dhcp
```

sudo systemctl restart networking
sudo systemctl restart NetworkManager

## DNS

### for CentOS Fedora Debian

这三个都是用 NetworkManager 进行管理

1. 在 /etc/NetworkManager/NetworkManager.conf 文件 [main] 块下添加 dns=none, 重启 NetworkManager

    ```sh
    sudo sh -c "sed -i '/^\[main\]$/a\dns=none' /etc/NetworkManager/NetworkManager.conf"
    sudo systemctl restart NetworkManager.service
    ```

1. 在重启后 修改 /etc/resolv.conf 文件, 因为重启后 dns=none 才生效

    ```sh
    sudo rm -rf /etc/resolv.conf                  # 对于 resolv.conf 是个链接的情况，一定要删了重建文件, 不要直接修改
    sudo sh -c "echo '114.114.114.114' > /etc/resolv.conf"
    ```

### for Ubuntu

Ubuntu 按如下操作即可

```sh
sudo sh -c "echo '114.114.114.114' > /etc/resolvconf/resolv.conf.d/base"
sudo resolvconf -u
```
