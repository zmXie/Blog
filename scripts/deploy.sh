npm run build

cd public

git init
git add -A
git commit -m 'deploy'

git remote add origin https://gitee.com/xzm-ddpz/gitee.io.git
git push -u origin "master"

cd ../
rm -rf public