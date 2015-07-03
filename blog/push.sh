#!/bin/sh
if_commit=""
read -p "是否提交源文件到github上(y/n) default(n)": if_commit
if [ "if_commit" = "" ]; then
   if_commit="n"
fi

git add .
git commit -m 'test'
git push

