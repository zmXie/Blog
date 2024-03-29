---
title: CSS动画
date: 2021-03-07
tags:
  - CSS
categories:
  - frontEnd
---

实现 CSS 动画有两种方式：1.transition 过度动画；2.animation 关键帧动画。

<!-- more -->

### transition

```scss
/* eg：鼠标悬停，div旋转一周并且变为红色，0.5秒后宽度变为100px */
div {
  width: 50px;
  height: 50px;
  background-color: yellow;
  transition: 1s, width 1s 0.5s ease-in; // 设置动画时间为1s，另外单独设置宽度动画时间1s并延迟0.5秒加速完成
}
div:hover {
  transform: rotate(1turn); // 1turn = 360deg
  background-color: red;
  width: 100px;
}
```

- transition 动画优点是使用简单，但是比较局限：

  1. 需要事件触发，所以不能在网页加载时自动发生。
  2. 不能重复播放，除非再次触发。
  3. 只有两个状态，不能定义中间状态。

### animation

```scss
div {
  // infinite：无限循环， both：根据动画方向轮流应用forwards和backwards
  animation: heartbeat 1s infinite both;
}
@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
```
几个常用的动画库
- [Animate CSS](https://animate.style)
- [Animista](http://animista.net/)

---

### SVG

svg 是基于 xml 格式的矢量图，我们也可以使用 svg 标签来自定义图形。

```html
<!-- 定义一个宽500px高100px的svg图形容器 viewBox：基于自身坐标系截取一块区域并放大到整个区域显示-->
<svg width="500" height="100" viewBox="0 0 500 100">
    <!-- 矩形（宽高98px 边框2px） -->
    <rect x="1" y="1" width="98" height="98" style="stroke:pink;stroke-width:2;fill-opacity:0.1;"/>
    <!-- 圆形 (圆心：(150,50) 半径：49px 边框2px)-->
    <circle cx="150" cy="50" r="49" stroke="black" stroke-width="2" fill="red"/>
    <!-- 椭圆 (圆心：(300,50) x半径：99px y半径：49px 边框2px) -->
    <ellipse cx="300" cy="50" rx="99" ry="49" style="fill:yellow;stroke:purple;stroke-width:2"/>
    <!-- 文本 -->
    <text x="30" y="55" fill="red">SVG</text>
</svg>
```
<iframe id="iframe" height=150 width=100% frameborder=0 allowfullscreen="true" :src="$withBase('/svg.html')">  
 </iframe>

- [svg教程](https://www.runoob.com/svg/svg-tutorial.html)
- [SVG 参考手册](https://www.runoob.com/svg/svg-reference.html)
- [SVG 在线编辑器](https://c.runoob.com/more/svgeditor/)

### 仿Element-UI的loading动画
```html
<body>
  <svg width="42" height="42" viewBox="25 25 50 50" class="box">
    <circle cx="50" cy="50" r="20" fill="none" class="circle"></circle>
</svg>
</body>
<style>
    .box {
        animation: rotate 2s infinite linear;
    }
    .box .circle {
        stroke-width: 2;
        stroke: #409eff;
        stroke-linecap: round;
        animation: circle 1.5s infinite ease-in-out both;
    }
    /* 旋转动画 */
    @keyframes rotate {
        to {
            transform: rotate(360deg);
        }
    }
    /* 弧线动画 */
    /* 圆的周长：2πr=2*3.14*20=125.6 */
    @keyframes circle {
        0% {
            /* 状态1: 点，虚线长为1 间距200 */
            stroke-dasharray: 1 150;
            stroke-dashoffset: 0;
        }
        50% {
            /* 状态2: 圆，虚线长100 间距150 并且向右偏移40 */
            stroke-dasharray: 100, 150;
            stroke-dashoffset: -40;
        }
        to {
            /* 状态3: 点，虚线长100 间距150 并且向右偏移120 */
            stroke-dasharray: 100 150;
            stroke-dashoffset: -120px;
        }
    }
</style>
```
<iframe id="iframe" height=150 width=100% frameborder=0 allowfullscreen="true" :src="$withBase('/loading.html')">  
 </iframe>
