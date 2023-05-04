---
title: Sass(Scss) 与PostCSS
date: 2021-03-09
tags:
  - CSS
categories:
  - frontEnd
---

CSS 是一门非编程式的语言，没有嵌套层级和作用域，也没有合理的复用机制，所以往往会冒出大量重复的选择器，导致难以维护，为了解决这种问题，就产生了 [Sass](https://www.sass.hk) 这一类的预处理器，以及[PostCSS](https://www.postcss.com.cn) 后处理器。

<!-- more -->

---

### Sass(Scss)

Sass 是 CSS 的预处理器，本质是一层自定义的 DSL（Domain Special Language），在 CSS 语法基础上增加了变量、嵌套、混入、继承等功能，再由[sass-loader](https://webpack.html.cn/loaders/sass-loader.html)将 .sass/.scss 这种非 CSS 文件编译成 CSS 文件。
另外 Sass 有两种语法格式，一种是 Sass 一种是 Scss，而 Scss 是 Sass 的升级版，完全兼容 CSS3，所以通常使用 Scss。

- 集成

  ```js
  npm install -D sass-loader node-sass
  ```

  ```js
  //  在 webpack 的 module.rules 中配置
  {
      test: /\.(sc|sa|c)ss$/,
      use: [
          {
            loader: 'sass-loader'
          }
      ]
  }
  ```

- 变量：使用`$`标识符定义变量。

  ```scss
  $link-color: blue;
  a {
    color: $link_color;
  }
  ```

- 嵌套：可以按照层级嵌套选择器，`&`标识符表示父级选择器。

  ```scss
  article a {
    color: blue;
    &:hover {
      color: red;
    }
  }
  ```

- 混入：使用`@mixin`定义混入，`@include`导入混入。

  ```scss
  @mixin link($color: blue, $hover: red) {
    color: $color;
    &:hover {
      color: $hover;
    }
  }
  article a {
    @include link();
  }
  ```

- 继承：使用`@extend`来继承已存在的样式，`%`占位符标记的样式如果不被`@extend`继承，那么不会产生任何代码。

  ```scss
  // 继承
  .btn {
    border: 1px solid #ccc;
    padding: 6px 10px;
    font-size: 14px;
  }
  %mt5 {
    margin-top: 5px;
  }
  .btn-primary {
    background-color: #f36;
    @extend .btn;
    @extend %mt5;
  }
  ```

---

### PostCss

PostCss 是 CSS 的后处理器，能够将 CSS 字符串 解析成 AST（Abstract Syntax Tree），然后通过配置的插件对 AST 进行相关处理，最后再将 AST 重新转换为 CSS 字符串。

- 集成（vue-cli 默认已经集成）

  ```js
  npm i  postcss-loader -D
  ```

  ```js
  //  在 webpack 的 module.rules 中配置
   {
        test: /\.(sc|sa|c)ss$/,
        use: [

          {
            loader: 'postcss-loader'
          }
        ]
   }
  ```

- 安装并配置常用插件

  ```js
  npm install --save-dev postcss-import postcss-url postcss-preset-env postcss-aspect-ratio-mini postcss-write-svg postcss-px-to-viewport postcss-viewport-units cssnano
  ```

  在`.postcssrc.js`文件中添加如下配置

  ```js
  module.exports = {
    plugins: {
      "postcss-import": {}, // 解决@import引入问
      "postcss-url": {}, // 处理文件路径的引用
      "postcss-preset-env": {}, // 转换现代CSS为浏览器支持的pkg
      "postcss-aspect-ratio-mini": {}, // 处理元素容器宽高比
      "postcss-write-svg": {  utf8: false } // 处理移动端1px的解决方案。该插件主要使用的是border-image和background来做1px的相关处理
      "postcss-px-to-viewport": { // 转换px-vw/vh等，是vw适配方案的核心插件之一
        viewportWidth: 375, // 视窗的宽度(基于你的视觉稿来定)
        viewportHeight: 667, // 视窗的高度
        unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数, 很多时候无法整处
        viewportUnit: "vw", // 指定需要转换成的视窗单位，建议使用vw
        selectorBlackList: ['.ignore', '.hairlines'], // 不转换的类名，.hairlines一般用于设置border-width:0.5px的元素
        minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
        mediaQuery: false, // 允许在媒体查询中转换`px`
        exclude: /(\/|\\)(node_modules)(\/|\\)/ // 忽略node_modules目录下的文件
      },
      "postcss-viewport-units": { // 给vw/vh做适配，是实现转换必不可少的插件
        // 过滤伪类和伪元素
        filterRule: (rule) =>
          rule.selector.includes("::after") &&
          rule.selector.includes("::before") &&
          rule.selector.includes(":after") &&
          rule.selector.includes(":before"),
      },
      cssnano: { // 压缩清理CSS
        "cssnano-preset-advanced": {
          zindex: false,
          // autoprefixer：自动添加css的浏览器前缀，比如-webkit-
          autoprefixer: false, // cssnano和postcss-preset-env都具有autoprefixer，所以保留一个即可
        },
      },
    },
  };
  ```
