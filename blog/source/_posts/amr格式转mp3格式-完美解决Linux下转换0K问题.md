title: amr格式转mp3格式(完美解决Linux下转换0K问题)
date: 2015-08-06 21:46:03
category: java
tags: 
- java
- jave
- amr转mp3

------

##**问题**
因项目需求，需要将 amr 格式的文件转成 mp3格式。
网络上提供的思路大多是使用jave-x-x.jar。
这个包确实有用，因为开发时是在windows环境中，测试转换虽然报了异常：
```java
it.sauronsoftware.jave.EncoderException:   Duration: N/A, bitrate: N/A
```
但也确实转换成功了，可以播放。
可是一旦部署到Linux环境当中，不是转换失败，就是转换的文件为大小 0 k。百思不得其解。 

<!-- more -->
##**原因**
经过一些资料和源码跟踪，终于找到了原因。
jave的能转换的原理其实就是**调用外部的二进制可执行文件** `ffmpeg`，打开它的jar包就可以发现，它里面内置了：
![jave原jar包截图](http://7xkxil.com1.z0.glb.clouddn.com/jave-ffmpegjave-old.png)
。
所以实际上，jave就是封装了一层对外部`ffmpeg`的调用。
而windows上能转换是因为：ffmpeg.exe 这个程序没问题。
而Linux上转换失败也是因为 ffmpeg 这个可能版本太老或依赖库缺失。
起初我以为是调用外部的ffmpeg，所以重新安装编译了Linux的ffmpeg，然并卵。
所以只能再想其他解决方案。

##**解决**
知道原因之后，解决思路有两种。
1. 不使用jave ，将jave一些核心的代码抽取出来，自己调用系统外部。
2. 下载最新的ffmpeg，替换掉原先的ffmpeg。

不用说，就是第二种了。

下载站点：http://ffmpeg.org/download.html
进去：
![下载](http://7xkxil.com1.z0.glb.clouddn.com/jave-ffmpegdownload.png)

然后选择一个32位还是64位。

![下载](http://7xkxil.com1.z0.glb.clouddn.com/jave-ffmpegdownload2.png)


下载之后解压,选择其中的ffmpeg，替换掉。


![ffmpeg替换之后](http://7xkxil.com1.z0.glb.clouddn.com/jave-ffmpegjave-new.png)



##**其他**
吐槽，之前自己自己编译，浪费好多时间，虽然也可以成功。但每换一个Linux环境就要重新编译。
