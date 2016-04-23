title: php 用nginx实现拦截器的思路
date: 2016-04-22 22:46:22
category: php
tags:
- PHP
- PHP interceptor
---
首先感谢一老友提供的思路。
接着～，
PHP现有项目上发现一个问题，上传到项目的文件随意用了随机字符串，但只有登陆用户把这个地址发出去，其他人就可以直接访问或下载该文件。
比如：http://wwww.test.com/upload/xxxxx.xls
可以直接下载下来，因为是直接存在的文件。
此时要做限制，思路就是拦截下 /upload/ 这个路径，用Java的话就是加个拦截器，PHP的话没做过这个，友人提供的思路用nginx实现。
用nginx做匹配拦截，然后转发到对应的php方法，将之后的xxxxx.xls 当作参数传，如下：
```
location  ~ /upload/ {
      rewrite  ^/upload/(.*)$  /index.php/Filter/get_img?path=/$1  last;
      break;

}

```
此时在 PHP做处理即可。
记录下～
