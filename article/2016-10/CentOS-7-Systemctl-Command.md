---
title: CentOS 7 systemctl 使用
date: 2016-10-21
categories:
- Linux
- 运维
tags:
- 运维
- CentOS
---

## 简介

systemctl 是系统服务管理器命令, 它实际上将 service 和 chkconfig 这两个命令组合到一起

<!-- more -->

## systemctl 命令格式

```bash
systemctl [OPTIONS...]  {COMMAND}...
```

## systemctl 示例

以 nginx 服务为例, 实现停止、启动、重启的动作如下:

```bash
systemctl stop    nginx.service      # 停止
systemctl start   nginx.service      # 启动
systemctl restart nginx.service      # 重启
systemctl status  nginx.service      # 检查服务状态
systemctl enable  nginx.service      # 使服务开机启动
systemctl disable nginx.service      # 取消服务开机启动
systemctl list -units --type=service # 查看所有已启动的服务
```

彻底关闭服务

```bash
systemctl status nginx.service
systemctl stop nginx.service
systemctl disable nginx.service
```

## systemctl 与 旧指令 chkconfig service 对比

| 任务              | 旧指令                         | 新指令                                   |
| ----------------- | ----------------------------- | --------------------------------------- |
| 使某服务自动启动    | chkconfig --level 3 httpd on  | systemctl enable httpd.service           |
| 使某服务不自动启动  | chkconfig --level 3 httpd off | systemctl disable httpd.service          |
| 检查服务状态       | service httpd status          | systemctl status httpd.service (服务详细信息) systemctl is-active httpd.service (仅显示是否 Active) |
| 显示所有已启动的服务 | chkconfig --list              | systemctl list-units --type=service      |
| 启动某服务         | service httpd start           | systemctl start httpd.service            |
| 停止某服务         | service httpd stop            | systemctl stop httpd.service             |
| 重启某服务         | service httpd restart         | systemctl restart httpd.service          |
