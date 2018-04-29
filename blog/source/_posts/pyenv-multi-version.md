title: pyenv 多版本管理 同时使用多个Python
date: 2018-04-29 23:53:20
tags: 
    - python
    - pyenv


---

```
pyenv: python2: command not found

The `python2' command exists in these Python versions:
  2.7.13
  
```
![](http://7xkxil.com1.z0.glb.clouddn.com/15250173391023.jpg)



使用多pyenv 管理多个python 版本时，通常只是设置一个默认的 , 使用多个会出现如何的异常情况，此时需要单独设置。



<!-- more -->

```
[linjie@Linjie IdeaProjects ]$ pyenv versions
* system (set by /usr/local/var/pyenv/version)
* 2.7.13 (set by /usr/local/var/pyenv/version)
* 3.6.0 (set by /usr/local/var/pyenv/version)

[linjie@Linjie IdeaProjects ]$ pyenv global system 2.7.13 3.6.0

```

使用`pyenv global` 设置时，可以设置多个，设置之后如图：


![](http://7xkxil.com1.z0.glb.clouddn.com/15250174632176.jpg)



参考来源：
https://github.com/pyenv/pyenv/issues/34
https://github.com/pyenv/pyenv/issues/206#issuecomment-50121655
http://berukann.hatenablog.jp/entry/2017/01/14/144340


