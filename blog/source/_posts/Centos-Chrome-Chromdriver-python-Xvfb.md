title: Centos Chrome Chromdriver python Xvfb 无界面模式
date: 2018-05-21 17:19:02
tags: 
    python
---


安装 Xvfb 

> Xvfb 是一个实现了 X 服务器协议的 虚拟显示服务器，运行在内存当中，如果要运行浏览器，必须要用 X 显示服务，所以安装 Xvfb ， 安装如下。 

```
yum install Xvfb -y
yum install libXfont -y
yum install xorg-x11-fonts* -y
```
 为防止依赖缺失，发生莫名其妙的问题，可以再执行:

```
yum install zlib-devel bzip2 bzip2-devel readline-devel sqlite sqlite-devel openssl-devel xz xz-devel -y
```

安装 google-chrome 

```
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
yum install google-chrome-stable_current_x86_64.rpm 
```

<!-- more -->


安装 chromedriver，到 chromedriver 官方的页面找到对应 google-chrome 的 chromedriver 版本：

https://sites.google.com/a/chromium.org/chromedriver/downloads

如果被墙住了，国内：

https://npm.taobao.org/mirrors/chromedriver/

下载后直接解压，是一个可执行的文件，为了方便，可以直接复制到 /usr/local/bin 目录中

```
cp  ./chromedriver   /usr/local/bin 
```

启动 Xvfb ：
```
Xvfb -ac :99 -screen 0 1280x1024x16 & export DISPLAY=:99
```

手动测试下，启动google-chrome 
```
[root@linjie test]# google-chrome
[9311:9311:0521/164942.275865:ERROR:zygote_host_impl_linux.cc(88)] Running as root without --no-sandbox is not supported. See https://crbug.com/638180.
```
报错，查资料，说要加: `--no-sandbox ` 的模式启动：
```
[root@linjie test]# google-chrome --no-sandbox
Fontconfig warning: "/etc/fonts/fonts.conf", line 147: blank doesn't take any effect anymore. please remove it from your fonts.conf
```
貌似可以了。
写个测试执行试一试，建立chrome.py ，然后输入，这是基于 python3 的：


```python
#!/usr/bin/env python3
from selenium import webdriver
import time

if __name__ == '__main__':
    options = webdriver.ChromeOptions()
    options.add_argument("--no-sandbox")
    driver = webdriver.Chrome("/usr/local/bin/chromedriver",chrome_options=options)
    driver.get('https://www.baidu.com')
    print(driver.title)
    time.sleep(1)
    driver.close()
```

执行前先安装 selenium 依赖

```
pip install selenium 
```


然后执行

```
[root@linjie test]# ./chrome.py
百度一下，你就知道
```

应该是可以了。















