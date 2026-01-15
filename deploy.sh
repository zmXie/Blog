if npm run build; then
    echo '构建完成'
    cd dist
    git init
    git add -A
    git commit -m 'deploy'
    echo '正在推送中..'
    if git push -f git@github.com:zmXie/zmXie.github.io.git main; then
        echo '推送完成'
        cd ../
        rm -rf dist
        echo '本地构建产物已删除'
        npm run push
    fi
fi
