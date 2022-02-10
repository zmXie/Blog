npm run build

echo '构建完成'  

cd public

git init
git add -A
git commit -m 'deploy'

echo '正在推送中..'  

git push -f https://github.com/zmXie/zmXie.github.io.git master

echo '推送完成'  

cd ../
rm -rf public

echo '本地构建产物已删除'  