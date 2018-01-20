---
title: Linux 配置 之 英文个人目录
date: 2016-10-18
categories:
- Linux
- 配置
tags:
- Linux 配置
---

## Ubuntu

### Step 1

终端:

```bash
export LANG=en_US
xdg-user-dirs-gtk-update
```

这时会弹出一个配置界面, 提示是否将中文目录切换为英文目录, 确定. 系统会删除没有内容的中文目录, 而有内容的目录会保持. 并创建 8 个相应的英文目录: "Desktop", "Download", "Templates", "Public", "Documents", "Music", "Pictures", "Videos".

<!-- more -->

这时常用中文目录已经变成英文目录.

### Step 2

```bash
export LANG=zh_CN.UTF-8
xdg-user-dirs-gtk-update
```

这次选否, 且选上 `不再提示`.

## Debian CentOS

这俩系统没有 xdg-user-dirs-gtk-update 这个程序

直接执行下面的命令即可

```sh
sed -e 's/桌面/Desktop/g' \
  -e 's/下载/Downloads/g' \
  -e 's/模板/Templates/g' \
  -e 's/公共/Public/g' \
  -e 's/文档/Documents/g' \
  -e 's/音乐/Music/g' \
  -e 's/图片/Pictures/g' \
  -e 's/视频/Videos/g' \
  -i ~/.config/user-dirs.dirs
mv ~/桌面 ~/Desktop
mv ~/下载 ~/Downloads
mv ~/模板 ~/Templates
mv ~/公共 ~/Public
mv ~/文档 ~/Documents
mv ~/音乐 ~/Music
mv ~/图片 ~/Pictures
mv ~/视频 ~/Videos
# 注销后生效 还要删除一个 `桌面` 文件夹
```
