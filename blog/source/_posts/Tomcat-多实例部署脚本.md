title: Tomcat 多实例部署脚本
date: 2015-06-15 22:31:34
category: Tomcat
tags: 
- Java 
- Tomcat
---

###单实例部署的麻烦

> 掀桌！单实例部署，TMD的每次重启所有项目都被影响！！


单实例部署时，不管是直接放在webapps下，还是增加配置文件`./conf/server.xml` 中的`<host>` ，关闭和启动都是所有项目都受到影响 ，特别一些启动时间比较长的项目，等待很艹蛋，更特别的在于如果没有热部署或者热部署失败时，修改一个class或配置文件，重启的效率能让你掀桌！！

###多实例的几种方式

> 1.多Tomcat软件实例
> 2.增加 CATALINA_BASE  
> 3.其他的先略过不表

Y,多实例不可避免，多实例的两种方式上面说了。
####1.最简单就是多Tomcat，
**部署时拷贝一个Tomcat，然后修改端口。**
```xml
<!-- 用来停止Tomcat的端口(8005),需改 -->
<Server port="8005" shutdown="SHUTDOWN">
...
	<!-- Http 访问端口(8080)，续改 -->
	<Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" />
	....
     <!-- Ajp端口(8009) ，负责和其他的HTTP服务器建立连接。没用到就注释掉。 -->
     <Connector port="8009" protocol="AJP/1.3" redirectPort="8443" />
<Server>

```
<!-- more -->

多Tomcat实例 总的就是修改这两个端口Server的和 Http协议的，很简单，但也很实用。

#####2. 第二个  单Tomcat 多实例 ，增加 catalina_base  
> 一个实例增加一个 catalina_base ,但只用一个Tomcat软件实体

在Tomcat的目录中，有这么几个子目录：

> 1.bin
> 2.lib
> 3.conf
> 4.logs
> 5.temp
> 6.work
> 7.webapps

其中 1 **bin** 和 2 **lib** 是Tomcat的执行文件和依赖文件，是重要的，标记。
接着 3 **conf** 是配置文件，也主要,主要,主要(重要的事说3遍)的，标记。
其他 4，5，6，分别是日志，临时，和编译后的工作目录，次要。
最后 7 是我们熟知的，基本刚开始的时候都是用来存放项目，然后使用二级目录访问,可略过。

好，现在说说这个单Tomcat多实例的思路。
我们启用tomcat时，所使用的方式一般为：./bin/startup.sh

OK，而实际上它会调用 catalina.sh 这个脚本，而关键的在于这个脚本中有一个配置选项：

**CATALINA_BASE**
```sh
#   CATALINA_BASE   (Optional) Base directory for resolving dynamic portions
#                   of a Catalina installation.  If not present, resolves to
#                   the same directory that CATALINA_HOME points to.
```
这个就是用来解决多实例的一个配置， `CATALINA_BASE` 配置项 所指定的目录，需要一个 `conf` 目录，而`conf`就包含了配置端口和项目路径。而默认的`CATALINA_BASE` 指向了Tomcat的根目录。可能还不怎么清楚，要怎么配置多`CATALINA_BASE` ?

#####步骤

有点小绕，看步骤和脚本：

1.解压一个Tomcat,我选择的版本是：apache-tomcat-7.0.56，移动至 /usr/local/apache-tomcat-7.0.56
2.建立一个实例对应的目录，如：/data/website/demo.linjie.org
3.将apache-tomcat-7.0.56中的`conf`目录完整的copy到 demo.linjie.org 目录
4.关键：在目录下建立一个脚本,可以如：touch tomcat.sh ，脚本内容如下

```
#!/bin/sh
# 本脚本参考：http://www.ttlsa.com
 . /etc/init.d/functions
 RETVAL=$?
# tomcat实例目录,重要，这个就是指向了含有 conf的实例目录，这个比较重要！在于 export 会将指定的变量临时加入用户变量

# export CATALINA_BASE="$PWD"
export CATALINA_BASE="/data/website/demo.linjie.org"
# tomcat安装目录，这个指向tomact所在的路径
export CATALINA_HOME="/usr/local/apache-tomcat-7.0.56"
#下面就是用来启动了
case "$1" in
start)
if [ -f $CATALINA_HOME/bin/startup.sh ];then
echo $"Start Tomcat"
$CATALINA_HOME/bin/startup.sh
fi
;;
stop)
if [ -f $CATALINA_HOME/bin/shutdown.sh ];then
$CATALINA_HOME/bin/shutdown.sh
fi
;;
*)
echo $"Usage: $0 {start|stop}"
exit 1
;;
esac
exit $RETVAL
```
这里注意，需要修改默认的端口，这个步骤跟多tomcat类似，参考上面的。
这个时候启动这个tomcat.sh 就是相当于启用了这个实例。然后停止时，也不影响其他的实例，前提是，你端口要不一样，如果端口一样，则会影响其他项目。
好吧，貌似跟多Tomcat差不多。唯一的有点就在于看着干净，爽快，而如果想要升级Tomcat，一般来说就升级这个单Tomcat软件主体就OK 了。



6.最后，在实例的目录中建立其他的目录，如：

> 1.logs
> 2.work
> 3.temp
> 4.webapps

OK，以上，这个可以基本完成目标了，不过还没达到我想要的理想值，下篇再介绍如何自动化。

###其他

其他就是，这个还不够，还不够，还需要自动化。是的。还不够！
