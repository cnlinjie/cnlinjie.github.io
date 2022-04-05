title: 'Centos 升级 git '
date: 2018-04-10 11:53:10
category: Linux
tags: 
- git

---

 

查看当前版本

```
git version 
```

![show version](http://qiniu.oss.cnlinjie.cn/2018-04-10-show%20version.png)


<!-- more -->


## 卸载当前版本

```
yum remove git
```


找到最新的（或你想要的版本）：https://github.com/git/git/releases

目前最新：v2.17.0

依赖环境:

```
 yum install -y curl-devel expat-devel gettext-devel openssl-devel zlib-devel asciidoc xmlto perl-devel perl-CPAN autoconf*
```

## 安装

```
wget https://github.com/git/git/archive/v2.17.0.tar.gz
tar -xvf v2.17.0.tar.gz
cd v2.17.0
make configure
./configure --prefix=/usr/local/git --with-iconv=/usr/local/libiconv
make all doc
make install install-doc install-html
echo "export PATH=$PATH:/usr/local/git/bin" >> /etc/bashrc
source /etc/bashrc
```

## 再查看版本号

```
git version 
```

![](http://qiniu.oss.cnlinjie.cn/2018-04-10-15233325844877.jpg)





