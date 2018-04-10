title: 'Teamcity 安装部署和项目构建 初探'
date: 2018-04-08 10:14:30
category: java
tags: 
- java
- CI

---


# 本篇初衷

1. 学习和了解Teamcity的概念和功能。
2. 基本使用 Teamcity ，实现代码提交到git后，自动化编译，运行。


Teamcity 一些复杂的操作也还在摸索当中，一样还是要看文档，所以有事没事多翻翻官网的文档，一定会有收货，英语不好也可以恰当的使用谷歌的全文翻译，不要被局限住。

看文档带着目的性去看，先看文档目录，然后让文档按照你的思路去组合，东翻翻西翻翻的结果还是一团浆糊。

<!-- more -->

# Teamcity 是什么

百科定义：TeamCity是一款功能强大的持续集成（Continue Integration）工具，包括服务器端和客户端，目前支持Java，.NET项目开发。

文档地址：https://confluence.jetbrains.com/display/TCD10/TeamCity+Documentation

## 概念和生命周期

### 一些概念
**TeamCity Server**: 服务器，一个总管，负责监听和指挥等，监听项目变动，然后存储在数据库上，接着加入队列，等待 构建代理 进行构建。

**Build Agent**:   构建代理，实际上构建和测试的一个端口，等待 Teamcity 服务器分配构建任务，构建完成后将构件 发给服务器。

**Project**: 项目 单位，每个项目包含了配置构建信息，比如项目地址（从哪里拉取项目），拉取完之后触发的操作配置等。

**VCS Root**: 项目的源码路径，包含在项目路面。

**Build Configuration**: 构建配置，包含在项目里面。

**Build Step**: 构建步骤（项目拉取完怎么做什么），包含在项目里面。

**Build Trigger**: 构建触发器（可以配置什么时候拉源码，拉取的频率），包含在项目里面。


**Build Queue**: 构建队列。


**Build Artifacts**：构建成品。

对应的文档：https://confluence.jetbrains.com/display/TCD10/Continuous+Integration+with+TeamCity

### 构建过程

1. Teamcity 检测源码的改变，并将其存到数据库
2. 构建触发器 监听数据库，如果有改变，则加入到构建队列中
3. 服务器查找空闲的 代理，如果代理空闲，则分配给代理构建任务
4. 代理执行过程，会将日志反馈给服务器
5. 构建完成后会将 完成的 构件 发给服务器



# 安装部署 (Linux 环境)

## 安装

官方文档：https://confluence.jetbrains.com/display/TCD10/Installation+Quick+Start

下载地址：https://www.jetbrains.com/zh/teamcity/download/



目前最新的版本： Teamcity 2017.2.3

系统： CentOS Linux release 7.4.1708  

环境要求：JDK 1.8 以上，配置好java 的环境。

MySQL： 目前服务器装有Mysql，所以直接使用MySQL ， Teamcity 也可以使用内置的 sqlite ，可直接使用。


下载过来的是个 .zip 的压缩包，解压后，目录应该如下： 
![](http://7xkxil.com1.z0.glb.clouddn.com/2018-04-09-15232861377527.jpg)

使用最简单的安装部署方式，直接 cd 进入到 `bin` 里面，执行:

```
[root@localhost TeamCity]# cd ./Teamcity/bin/
[root@localhost bin]# ./runAll.sh start 
```

停止的话：

```
[root@localhost bin]# ./runAll.sh stop 
```

至此，已经算是初步安装完成了。

##  配置环境

Teamcity 默认的端口是：8111 ，可在配置文件更改（不是重点）

浏览器访问：http://ip:8111

此时如果正确安装的话，会看到：

![](http://7xkxil.com1.z0.glb.clouddn.com/2018-04-09-15232869661694.jpg)

让你填一个数据存储目录，我填了 `/data/TeamCityData`

*PS: 这一步忘记截图了，用的别人的图。*

![](http://7xkxil.com1.z0.glb.clouddn.com/2018-04-09-2.%20查找驱动.png)

下拉里面可以选择 MySQL ，截图时截了PostgreSQL ，不好意思。

此时应该会提示 缺失 对应的驱动，将数据库驱动文件复制到对应的目录,我的是 /data/TeamCityData/lib/jdbc 
然后回来 点击下`Refresh JDBC drivers` ，然后填写信息，我的已经建好对应的 数据库和用户名，所以如下：


![](http://7xkxil.com1.z0.glb.clouddn.com/2018-04-09-15232871143038.jpg)

然后看到许可协议，点击接受。

**接着创建初始的管理员账号：**

![](http://7xkxil.com1.z0.glb.clouddn.com/2018-04-09-5.%20创建账户.png)

**然后环境配置基本就完成了:**

![](http://7xkxil.com1.z0.glb.clouddn.com/2018-04-09-6.%20创建完之后.png)

看到左上角的， Projects , Changes, Agents, Build Queue. 

Projects ： 项目管理区域

Agents ： 代理，就是真正用来构建的，我们刚刚在执行 runAll start的时候，其实已经默认启用了一个代理。

Build Queue: 构建队列。

下一步就是新建一个项目，并实现自动拉取代码和自动构建。



# 新建项目

1. 创建新建

![](http://7xkxil.com1.z0.glb.clouddn.com/15233737476375.jpg)




## 使用 git 

根据不同的平台选择不同的方式，我私人项目用的比较多的是 开源中国的 gitee，所以填写如下
 
 ![](http://7xkxil.com1.z0.glb.clouddn.com/15233739995789.jpg)

之后会跳到让构建步骤

![](http://7xkxil.com1.z0.glb.clouddn.com/15233742450748.jpg)

这里会检测出你项目自带的哪些可以执行的脚本，然后选择，我这边就不选了，等会儿还可以自定义。


点击左边的 `Build Steps` .



## 实现自动化

当项目被检出之后，会自动触发这一步，所以在这边编辑后构建脚本就可以实现自动化。

![](http://7xkxil.com1.z0.glb.clouddn.com/15233743614757.jpg)

1. 自动添加构建脚本
2. 自动检测项目中自带的脚本，如上一步看到的。

这里选择 Add Build Step 

![](http://7xkxil.com1.z0.glb.clouddn.com/15233745920326.jpg)

这边有很多的选项，有Maven ，有命令行，有FTP（构建完成后可以将构建完成的软件包通过FTP上传等），我这边直接选择命令行。

实现打包。

![](http://7xkxil.com1.z0.glb.clouddn.com/15233749645812.jpg)


这边步骤可以有很多，1，2，3，4 .... 

![](http://7xkxil.com1.z0.glb.clouddn.com/15233750453223.jpg)
 


配置完，回到项目， 
![](http://7xkxil.com1.z0.glb.clouddn.com/15233751355056.jpg)

，然后点击 run

![](http://7xkxil.com1.z0.glb.clouddn.com/15233751704406.jpg)


 我这边因为使用 mvn 命令，所以在服务器上也必须配置好 mvn 环境，否则

![](http://7xkxil.com1.z0.glb.clouddn.com/15233752477005.jpg)


# 总结

 Teamcity 主要检查各种源码管理 (git ,svn)  等，检出完成之后，再调用对应的构建步骤，具体如何构建全听命于你。
 
 

