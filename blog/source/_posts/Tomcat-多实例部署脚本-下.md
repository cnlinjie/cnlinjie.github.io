title: Tomcat 多实例部署脚本-下
date: 2015-06-20 18:31:34
category: Tomcat
tags: 
- Java 
- Tomcat
---

### 思路
上一篇[Tomcat 多实例部署脚本]( http://www.linjie.org/2015/06/15/Tomcat-%E5%A4%9A%E5%AE%9E%E4%BE%8B%E9%83%A8%E7%BD%B2%E8%84%9A%E6%9C%AC/ "googe") 大概说了些多实例的一些方案，现在这篇就纯粹的说自动化脚本。
轻拍。
#### 思路(基于上篇博文的基础)：
> 0、建立一个新目录, **mkdir default_template**
> 1、在Tomcat中的将所需的配置文件取出来，放到这个新目录中
> 2、修改 server.xml 文件，将所有所需手工替换的用`占用符`占用
> 3、在conf 目录中，建立一个`./conf/Catalina/localhost/ROOT.xml` 文件（`注1` 说明为什么建立这个文件）
> 4、在default_template目录中建立：`logs`,`temp`,`work` 等三个为目录
> 5、在目录中建立启动和停止实例的脚本，参考上篇博文，(见`注2`)
> 6、使用脚本，替换此目录中所有的`占位符`，替代手工操作

**注1：Tomcat中，如果要使用域名的根目录访问，需要将项目文件放在ROOT目录中，否则只能采用二级目录访问，而建立此`ROOT.xml` 文件，则可以任意指定，此文件中仅一句：`<Context path="" docBase="webapps_dir" />`,其中path若为空，则默认为根目录没，具体可以下载此文件查看。 当然，还有其他的方式，只不过个人认为这种比较灵活**

**注2：或者直接下载此文最下面提供的示例**

<!-- more -->

### 脚本实现
具体直接看脚本实现：

```
#/bin/sh

httpport=""
serverport=""
ajpport=""
#这里定义webapps的目录，根据域名在此生成对应的目录
webappsdir="/data/nfs/webapps"
#这里定为配置文件的目录，根据域名生成对应的配置文件
websitedir="/data/tomcat/website"
#域名
domain=""
#Tomcat的Home目录
tomcathome="/data/tomcat"
#上面的配置文件目录
templatedir="/data/tomcat/website/default_template"
#访问路径，默认就是根目录，现在没用到
accesspath=""
#配置后是否直接运行
isrun="n"

echo "===========Input Port========="
#输入运行的端口号，每个实例都需要不同的端口号，我是以8181为基础，8182，8183 这样递增
read -p "(http run port):" httpport

if [ "$httpport" = "" ]; then
     echo "http port can't be empty"
     exit
fi
#server port 如果为空，则默认在上面的哪个端口中加个3，如：38181，38182
read -p "(server port default 3$httpport):" serverport
if [ "$serverport" = "" ]; then
	serverport=3$httpport
fi
#ajport 和server port一样，运行端口千米加个4。如：48181
read -p "(ajp port default 4$httpport):" ajpport
if [ "$ajpport" = "" ]; then
	ajpport=4$httpport
fi
#域名
echo "============input domain============="
#read -p "domain:" domain
read -p "domain:" domain
if [ "$domain" = "" ]; then
	echo " domain can't be empty"
	exit
fi

if [ -d "$websitedir/$domain" ]; then
        echo "==========================="
        echo "$domain is exist!"
        echo "==========================="      
	exit
fi

#如果不想用默认的webapps目录，则自定义输入，否则使用默认的+域名
echo "============input webapps dir==========="
webappsdir_input=""
read -p "webapps dir:(default $webappsdir/$domain):" webappsdir_input
if [ "$webappsdir_input" = "" ]; then
	webappsdir_input=$webappsdir/$domain
fi
#配置完后是否直接运行
echo "=========is run now?(y/n)======="
read -p "(default n):" isrun



if [ ! -d "$webappsdir_input" ]; then
	mkdir -p $webappsdir_input
fi

echo "http port:$httpport"
echo "server port:$serverport"
echo "ajp port:$ajpport"
echo "domain :$domain"
echo "webapps dir :$webappsdir_input"
echo "======== Cp ========"
cp $templatedir $websitedir/$domain -r
#以下均为替换 占位符
echo "=========replace======="
#sed -i "s/catalina_base_dir/catalina_base_dir_r/g" `grep catalina_base_dir -rl ./tomcat.sh`
echo $webappsdir_input

#tomcat.sh
sed -i "s#catalina_base_dir#${websitedir}/${domain}#g" `grep catalina_base_dir -rl $websitedir/$domain/tomcat.sh`
sed -i "s#catalina_home_dir#${tomcathome}#g" `grep catalina_home_dir -rl $websitedir/$domain/tomcat.sh`

#conf/server.xml
sed -i "s#server_port#${serverport}#g" `grep server_port -rl $websitedir/$domain/conf/server.xml`
sed -i "s#http_port#${httpport}#g" `grep http_port -rl $websitedir/$domain/conf/server.xml`
sed -i "s#ajp_port#${ajpport}#g" `grep ajp_port -rl $websitedir/$domain/conf/server.xml`
sed -i "s#localhost_webapps#${tomcathome}/webapps#g" `grep localhost_webapps -rl $websitedir/$domain/conf/server.xml`


#ROOT.xml
sed -i "s#webapps_dir#${webappsdir_input}#g" `grep webapps_dir -rl $websitedir/$domain/conf/Catalina/localhost/ROOT.xml`

#生成默认的index.html
if [ ! -f "$webappsdir_input/index.html" ]; then
	touch "$webappsdir_input/index.html"
	echo "<html><head><title>$domain</title></head><body>$domain</body><html>" > $webappsdir_input/index.html
fi


if [ "$isrun" = "y" ]; then
	sh $websitedir/$domain/tomcat.sh start
fi

#OK 
echo "=========Success============="
```

### 实现结果截图

根据上面的脚本执行结果。如图1：
![图1 执行结果 ](http://7xk2gz.com1.z0.glb.clouddn.com/tomcat_deploy_shell_execing.png)
.
此脚本执行后生成两种个目录，分别为配置文件目录，和项目所在的webapps目录。如图2和图3：
配置文件目录

![图2 配置文件效果](http://7xk2gz.com1.z0.glb.clouddn.com/tomcat_deploy_shell_website_conf.png)

生成的webapps目录：

![图3 webapps目录](http://7xk2gz.com1.z0.glb.clouddn.com/tomcat_deploy_shell_webapps.png)

此时在配置文件目录中，直接运行：

```sh
#/bin/sh
./tomcat.sh start
#或
./tomcat.sh stop 

```

就可以直接运行。
写的粗糙，轻拍。


