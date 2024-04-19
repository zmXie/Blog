---
title: DOM事件流
date: 2021-04-19
tags:
  - JavaScript
categories:
  - frontEnd
---

当一个 HTML 元素产生一个事件时，事件会在该元素节点与根节点之间的路径传播，路径所经过的节点都会收到该事件，这个传播过程称为 DOM 事件流。

<!-- more -->

### 三个阶段

- **捕获阶段**：事件从根节点开始，从上往下传播，直到目标节点。
- **目标阶段**：事件到达目标节点，目标节点处理事件阶段。
- **冒泡阶段**：事件从目标节点开始，从下往上传播，直到根节点。

在事件流中，每个元素都可以对事件进行处理，可以通过`addEventListener`添加事件监听，也可以使用 `on` 开头的属性设置事件处理函数，**默认在冒泡阶段响应。**，比如元素节点`html`->`div`->`p`，点击 p，则触发的 click 事件顺序为`p`->`div`->`html`。

```html
<body>
  <div id="outer" onclick="divClick()">
    <p id="inner" onclick="pClick()"></p>
  </div>
  <script>
    document.addEventListener(
      'click',
      function () {
        console.log('document事件触发了');
      },
      true
    );
    document.querySelector('html').addEventListener('click', function () {
      console.log('html事件触发了');
    });
    function divClick() {
      console.log('div事件触发了');
    }
    function pClick() {
      console.log('p事件触发了');
    }
  </script>
</body>
<!-- 
  打印顺序：
  p事件触发了 
  div事件触发了 
  html事件触发了
  document事件触发了
  -->
```

监听事件也可以设置在捕获阶段响应，一般用于事件拦截。比如元素节点`html`->`div`->`p`，点击 p，则触发的 click 事件顺序为`p`->`div`->`html`。

```js
//useCapture设置为true，则表示在捕获阶段处理
addEventListener('click', function () {}, true); // true则表示为指定捕获阶段处理
```

```html
<body>
  <div id="outer" onclick="divClick()">
    <p id="inner" onclick="pClick()"></p>
  </div>
  <script>
    document.addEventListener(
      'click',
      function () {
        console.log('document事件触发了');
      },
      true
    );
    document.querySelector('html').addEventListener(
      'click',
      function () {
        console.log('html事件触发了');
      },
      true
    );
    document.getElementById('outer').addEventListener(
      'click',
      function () {
        console.log('div事件触发了');
      },
      true
    );
    document.getElementById('inner').addEventListener(
      'click',
      function () {
        console.log('p事件触发了');
      },
      true
    );
  </script>
</body>
<!-- 
  打印顺序：
  p事件触发了 
  div事件触发了 
  html事件触发了
  document事件触发了
  -->
```

### 阻止事件流

阻止事件流油两种方式：

- `e.stopPropagation()`：阻止事件传播，如果是在冒泡阶段则阻止冒泡传播，如果在捕获阶段则阻止捕获传播。
- `e.preventDefault()`：取消元素的默认事件，比如 a 链接默认打开 url。

### 事件委托

利用事件冒泡机制，将事件绑定到父元素上，从而避免每一个子元素都绑定事件，减少开销。然后通过`e.target`获取目标元素，通过`dataset`获取目标元素绑定的数据。
