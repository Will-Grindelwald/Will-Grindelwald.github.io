---
title: 获取脚本所在绝对目录
date: 2016-10-26
categories:
- Linux
- Shell
tags:
- Shell
---

因为脚本可能是在别的目录里调用的, 甚至是在子 shell 中调用的, 所以仅 `pwd` 是不行的

应该用它

```bash
curpath=$(cd `dirname $0`; pwd)
```

<!-- more -->
