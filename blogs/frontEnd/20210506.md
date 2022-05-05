---
title: Vue配置Sass全局变量和混入
date: 2021-05-06
tags:
  - Vue
categories:
  - frontEnd
---

1. 安装 sass-resources-loader 插件
<!-- more -->

```bash
npm i sass-resources-loader --save-dev
```

2. 配置 webpack.conf.js

```javascript
module: {
  rules: [
    {
      test: /\.(sc|sa|c)ss$/,
      use: [
        {
          loader: "sass-resources-loader",
          options: {
            resources: path.resolve(
              __dirname,
              "../src/assets/styles/global/index.scss"
            ),
          },
        },
      ],
    },
  ];
}
```

3. 在配置对应目录下创建全局混入

```scss
// 主题色
$theme_color: #1c00a3;

// 字符串换行
@mixin multiline($line: 20) {
  white-space: normal;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: $line;
  -webkit-box-orient: vertical;
}
```

4. 直接使用

```scss
color: $theme_color;
@include multiline(2);
```
