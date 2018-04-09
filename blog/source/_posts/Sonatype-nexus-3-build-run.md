title: 团队建设-Maven 仓库 Sonatype Nexus 的搭建
date: 2016-04-23 19:13:37
category: Maven
tags:
- maven
- sonatype
- sonatype-nexus-3
- 团队建设
---
PS：新瓶装老酒，都是些老东西，写写提提神。

>   协作是团队开发和个人开发最主要的区别，除了日常必要的磨练和沟通之外，最重要的是如何定一个合理的规矩，用来解决团队所可能出现的冲突，且慢慢积累团队技术底蕴和文化。

###   Sonatype 私有库 
日常开发中Maven 已经必备！

不过一般个人开发也不用配置什么，直接使用Maven 中央库即可，就算有什么私人或没传到中央库的jar文件，也可以使用各种方式加入到项目中来，所以不太必要有什么自己的私有库。

不过团队开发中，有些企业内部有自己不宜公开的开发框架或基础框架等，如果上面个人的解决方案，可能是生成一个Jar文件扔到项目里面，不过如果涉及到基础框架更新或维护，这可能就不太理想了，所以有一套团队或企业内部的私有库，就显的很重要了。

好了，完毕！不罗嗦了。

`PS2：英文文档很全，如果没什么压力的话，可以直接看官方文档。 :)`

地址：https://books.sonatype.com/nexus-book/3.0/reference/index.html

<!-- more -->

###  前提 
当前 sonatype neuxs 基于Java,所以需要在环境里面安装jdk，当前这个版本需要jdk1.8 ，所以请先配好java环境。
因为我本机已经安装了Java，且java安装教程很多，请参考网络上的。

###  下载
开始下载，地址：http://www.sonatype.com/download-oss-sonatype

![图片](http://7xk2gz.com1.z0.glb.clouddn.com/Sonatype-nexus-3-build-run2016-04-23%2021-51-03%20%E7%9A%84%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE.png)

当前最新版本：nexus-3.0.0-03 (这个版本支持npm,Nuget等)

平台：根据环境选择（我这边选Unix)

OK ，点击下载就好了。

###  运行 

将下载好的文件直接解压，见如图：
![](http://7xk2gz.com1.z0.glb.clouddn.com/Sonatype-nexus-3-build-run2016-04-23%2021-54-25%20%E7%9A%84%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE.png)

OK，解压好了，进入到bin里面，我是放到了/opt 目录下面，所以直接：

```sh
cd /opt/nexus-3.0.0-03/bin/
./nexus
```

它提示：


```
Usage: ./nexus {start|stop|run|run-redirect|status|restart|force-reload}

```


如果是以root身份运行，则会看到：


```sh
[root@localhost bin]# ./nexus
WARNING: ************************************************************
WARNING: Detected execution as "root" user.  This is NOT recommended!
WARNING: ************************************************************
Usage: ./nexus {start|stop|run|run-redirect|status|restart|force-reload}

```

好了，根据提示，现在开始运行：

```sh
[linjie@localhost bin]$ ./nexus start
Starting nexus

```

OK，如果片没什么问题，就应该启动起来了，访问：
http://localhost:8081/
默认的端口是8081。
此时应该可以看到：
![](http://7xk2gz.com1.z0.glb.clouddn.com/Sonatype-nexus-3-build-run2016-04-23%2022-06-35%20%E7%9A%84%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE.png)

点击 右边上角的 Sign In，默认账号密码：`admin`,`admin123`.

恭喜，已经安装好了，:) ， 不用设置什么数据库密码，之类的.

登陆之后，看看仓库：
![](http://7xk2gz.com1.z0.glb.clouddn.com/Sonatype-nexus-3-build-run2016-04-23%2022-12-52%20%E7%9A%84%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE.png)

Name 就不说了，其他的：


Type 

1. proxy 是代理仓库 ，如果自己私有库没有对应的资源(jar等)，会到这里去找。
2. hosted 是宿主仓库 ,是自己的私有库地址，这个就是自己的。这个有 releases 和snapshots 两种类型，你如果自己创建的时候，需要指定 ，一个是正式发布地址，一个是开发中地址。
3. group 管理组 ，组是Nexus一个强大的特性，它允许你在一个单独的URL中组合多个仓库。比如这里默认组合了：`maven-central`、`maven-releases`和`maven-snapshots` ，一般直接引用这个地址就好了。

Status

这里本来也没什么好说的，不过却遇到一个跟 neuxs 2.x不同的坑。如果用过2.x可能就入坑，比如我。

这里目有两个状态：`Online` 和 `Online - Remote Connection Pending...`

首先说下，这是正常的，没坑，如果没和2.x版本对比过，就是这样的。

为什么说坑，因为当我成功安装了之后，马上迫不及待的就开始搜索，比如：springframework ,这是搜索出来一片空白，内心一慌，我靠！怎么回事，如果找到这里，点了进去，如图：

狂按 Rebuild Index, 提示我成功之后，立即搜索，还是一片空白！各种方式，依旧无用！:(  

之后我google 这里：
http://stackoverflow.com/questions/34782859/sonatype-nexus-3-remote-connection-pending

> The "connection pending" message is normal in 3.0m6. It just means nothing has been downloaded through the proxy repository yet. Try running a build that retrieves artifacts through the proxy, the status will change once the first file of the artifact is downloaded.

就放下了。

#### 运行其他

左边的控制栏，分为三类，仓库，安全（用户），支持，系统，慢慢体验。

### 项目使用


#### **先试一试能不能代理中央库，实现下载**

pom.xml 文件：

```xml
<repositories>
		<repository>
			<id>harme-maven-public</id>
			<name>maven-public</name>
			<url>http://localhost:8081/repository/maven-public/</url>
			<snapshots>
				<enabled>true</enabled>
			</snapshots>
			<releases>
				<enabled>true</enabled>
			</releases>
		</repository>
	</repositories>
	<pluginRepositories>
		<pluginRepository>
			<id>harme-maven-public</id>
			<name>maven-public</name>
			<url>http://localhost:8081/repository/maven-public/</url>
			<releases>
				<enabled>true</enabled>
			</releases>
			<snapshots>
				<enabled>false</enabled>
			</snapshots>
		</pluginRepository>
	</pluginRepositories>
```



####  再试一试能不能部属构件到nexus 

setting.xml 文件，在servers节点里面：

```xml

<server>
  <id>oss</id>
  <username>admin</username>
  <password>admin123</password>
</server>

```

pom.xml 文件再加：

```xml
<distributionManagement>
    <repository>
        <id>oss</id>
        <url>http://localhost:8081/repository/maven-releases/</url>
    </repository>
    <snapshotRepository>
        <id>oss</id>
        <url>http://localhost:8081/repository/maven-snapshots/</url>
    </snapshotRepository>
</distributionManagement>
```

好了。先这样。




PS3： 如果想要以 service 这种服务运行的话，也很简单，看文档：
https://books.sonatype.com/nexus-book/3.0/reference/install.html#service-linux


