title: fedora23 编译 WizNote2.3.3
date: 2016-08-25 22:20:56
tags:
---

##前期环境准备

1. **为了方便操作，请先切换到root环境下!**
2. 前期的gcc,make 等编译环境应该默认你们有了。

## 下载WizNote 源码
1. 打开官网应该都知道源码的地址放在哪，如果你会点git操作就更好了。
    地址：*https://github.com/WizTeam/WizQTClient*
2. 下载回来解压，然后cd进目录，直接执行`./linux-package.sh ` 进行编译安装。
3. OK，可以吗？反正我就是不行，报了一大堆问题，所以继续。

## 准备依赖环境
    本次依赖环境所需是根据本次经验而成，如果有其他问题可以留言。
    
    核心就是：缺啥装啥，有yum(dnf)就直接装，没有先找找有没现成的 rpm ,再没有就编译。所以不必惊慌。
    
以下是我所遇到的问题，如果同样问题的可以对号入座，如果不一样，可以留言，看到就回
：
1.  卡在了这，提示我找不到 这几个库文件。
```
cp /usr/lib/x86_64-linux-gnu/libQtWebKit.so.4 ./
cp /usr/lib/x86_64-linux-gnu/libQtGui.so.4 ./
cp /usr/lib/x86_64-linux-gnu//libQtXml.so.4 ./
cp /usr/lib/x86_64-linux-gnu/libQtNetwork.so.4 ./
cp /usr/lib/x86_64-linux-gnu/libQtCore.so.4 ./
```
<!-- more -->
我直接google搜索：libQtWebKit.so 
发现是在：http://rpm.pbone.net/index.php3/stat/3/srodzaj/1/search/libQtWebKit.so.4()(64bit)
这里有，于是找到对应版本安装下载。
下载后，安装：`yum install qtwebkit-2.3.4-8.fc23.i686.rpm` （我的版本）

*另：后来我发现yum 里面有个 qtwebkit 的，可以直接 yum install qtwebkit  ，但我没试过 :-D*

好了，安装过后，再继续，提示我还是找不到，纳闷。
于是通过 find /usr/ -name "libQtWebKit.so.4" 去查，发现路径跟安装脚本不一样，在`/usr/lib/libQtWebKit.so.4 ` 于是我查了剩下的几个位置，果然都不一样，于是修改安装脚本，如下：
```bash
cp /usr/lib/libQtWebKit.so.4 ./
cp /usr/lib/libQtGui.so.4 ./
cp /usr/lib/libQtXml.so.4 ./
cp /usr/lib/libQtNetwork.so.4 ./
cp /usr/lib/libQtCore.so.4 ./
```
OK，继续执行，这个问题就过了。

2. 这次遇到的是QT问题，提示没有找到QT的什么什么，还需要设置QT_DIR的环境变量（当时没有记录下来）。

好，缺少QT环境，那就安装，怎么装，我先去wiz.cn看了看，有篇 http://www.wiz.cn/wiznote-qt/compile-wiznote-on-centos
在`下载安装QT 4.8.6 `之前可以照做这个：
安装开发库
```
sudo yum install libX11-devel, libXext-devel, libXtst-devel
sudo yum install libX11-devel libXext-devel libXtst-devel
sudo yum install libXrender-devel
sudo yum install zlib-devel
sudo yum install openssl-devel
sudo yum install flex bison gperf libicu-devel libxslt-devel ruby
sudo yum install libxcb libxcb-devel xcb-util xcb-util-devel
sudo yum install freetype-devel
sudo yum install fontconfig-devel
```
还有我后来从QT官网找到个：
```
 yum install mesa-libEGL-devel libgcrypt-devel libgcrypt pciutils-devel nss-devel libXtst-devel gperf
cups-devel pulseaudio-libs-devel libgudev1-devel systemd-devel libcap-devel alsa-lib-devel flex bison ruby
```

然后开始折腾QT环境（我能说我下了5.6的，结果wiz依赖的居然是最新的5.7,泪奔！编译了我几个小时）
到这边：http://download.qt.io/official_releases/qt/5.7/5.7.0/single/
选一个自己下载。
下载回来后，解压，不要按照为知上的那个。
cd 进目录之后，如下
```
./configure --prefix=/usr/local/qt-5.7.0
```
那个路径最好指定下，当然你可以改。
这个时候我好像没出什么问题，可能是之前依赖都装了差不多了。
之后就是熟悉了 `make` 和 `make install`了，这个过程有点漫长，我用了将近4个小时，跟我的渣CPU有关，慢慢等。


## 开始编译
好，环境依赖解决后，就可以开始编译了。
重新进入到WizNote的源码里面，继续执行`./linux-package.sh ` ,等待[100]的编译过后（我又没有截图，太心急了）。
然后后退一个目录，就可以看到这两个东西：
`WizNote`和`WizNote.tar.gz` 。
恭喜，编译成功，直接cd进 WizNote 然后看到一个执行文件，直接先执行`./WizNote` ，完美！
