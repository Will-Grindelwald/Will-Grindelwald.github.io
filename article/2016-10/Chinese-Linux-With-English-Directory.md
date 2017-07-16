---
title: Linux 配置 之 英文个人目录
date: 2016-10-18
categories:
- Linux
- 配置
tags:
- Linux 配置
---

## Step 1

终端:

```bash
export LANG=en_US
xdg-user-dirs-gtk-update
```

这时会弹出一个配置界面, 提示是否将中文目录切换为英文目录, 确定. 系统会删除没有内容的中文目录, 而有内容的目录会保持. 并创建 8 个相应的英文目录: "Desktop", "Download", "Templates", "Public", "Documents", "Music", "Pictures", "Videos".

<!-- more -->

这时常用中文目录已经变成英文目录.

## Step 2

```bash
export LANG=zh_CN.UTF-8
xdg-user-dirs-gtk-update
```

这次选否, 且选上 `不再提示`.
