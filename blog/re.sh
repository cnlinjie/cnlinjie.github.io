#!/bin/sh
if_commit=""
git_message=""
read -p "是否提交源文件到github上(y/n) default(n):" if_commit
if [ "$if_commit" = "" ]; then
	if_commit="n"
fi
if [ "$if_commit" = "y" ]; then
	read -p "输入提交信息:" git_message
	if [ "$git_message" = "" ]; then
		git_message = "没有提交信息"
	fi
fi

echo "-----------开始发布:----------"
hexo g -d 

if [ "$if_commit" = "y" ]; then
	echo "---------------发布成功，开始提交源文件:---------------------"
	git add .
	git commit -m $git_message
	git push
fi

