git add .
git commit -m 'feat: add doc'
echo '正在推送中..'  
if git push origin main; then
   echo '推送成功'  
fi
