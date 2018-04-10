title: 团队建设-Maven 仓库 Sonatype Nexus 的搭建
date: 2016-04-23 19:13:37
category: Maven
tags:
- maven
- sonatype
- sonatype-nexus-3
- 团队建设
---
 

###   Sonatype 私有库 
  

文档地址：https://books.sonatype.com/nexus-book/3.0/reference/index.html

<!-- more -->

###  依赖环境

当前 sonatype neuxs 基于Java,所以需要在环境里面安装jdk，当前这个版本需要jdk1.8 。

### 创建Nexus用户

运行用户不建议为root ，可以再创建一个nexus 用户。

以root权限运行：

```
adduser nexus
su nexus
```

以下都是在 nexus 用户的权限下执行。

###  下载和运行

下载地址：http://www.sonatype.com/download-oss-sonatype

![图片](http://7xk2gz.com1.z0.glb.clouddn.com/Sonatype-nexus-3-build-run2016-04-23%2021-51-03%20%E7%9A%84%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE.png)

根据平台选择不同的版本。


将下载好的文件直接解压，见如图：


![](http://7xkxil.com1.z0.glb.clouddn.com/15233731913167.jpg)

在nexus用户的根目录: 

```sh
cd ~/nexus-3.0.0-03/bin/
./nexus start
```

现在已经启动了，默认端口是8081，访问：

 ![](http://7xk2gz.com1.z0.glb.clouddn.com/Sonatype-nexus-3-build-run2016-04-23%2022-06-35%20%E7%9A%84%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE.png)

右边上角的 Sign In，默认账号密码：


`admin`,`admin123`.


 
###  以服务的方式运行

切到nexus用户

文档：https://books.sonatype.com/nexus-book/3.0/reference/install.html#service-linux

1. 在 .bashrc 中加入

    ```
    NEXUS_HOME="/opt/nexus"
    ```
    
2. 修改 `~/nexus-3.0.0-03/bin/nexus.rc`

```
run_as_user="nexus"
```

3.  软连接到 /etc/init.d

```
sudo ln -s $NEXUS_HOME/bin/nexus /etc/init.d/nexus
```

此时应该就可以用 service nexus stop/start 这种服务启动

4.  加入开机启动

```

cd /etc/init.d
sudo chkconfig --add nexus
sudo chkconfig --levels 345 nexus on
sudo service nexus start
```


 

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

