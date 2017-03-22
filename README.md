# cnlinjie.github.io

install node and npm
```
#cd /data/blog
#npm install hexo -g
#hexo init blog
#cd ./blog
#npm install
#npm install hexo-deployer-git --save
#hexo n 'new post'
#hexo s
#hexo g
#hexo d
```
and
```
#hexo d -g
```

#新环境时如何checkout新分支
```
git chekcout -b -f hexo origin/hexo
```
如果没有 -f 这个强制的话，一直提示错误。
