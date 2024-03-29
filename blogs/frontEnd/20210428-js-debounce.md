---
title: JavaScript防抖与节流
date: 2021-04-28
tags:
  - JavaScript
categories:
  - frontEnd
---

防抖与节流都是 web 操作上的优化手段，当函数高频触发时，可以控制函数的执行次数，两者效果不一样，使用场景也不同。

<!-- more -->

### 防抖（debounce）

- 效果：函数连续触发只会执行最后一次。
- 原理：在事件触发 n 秒后执行函数，如果 n 秒内再次触发，则重新计时。
- 应用场景：搜索联想，点赞取消。

```js
function debounce(fn, delay = 500) {
  let timer = 0;
  return function (...arg) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arg);
    }, delay);
  };
}
```

### 节流（throttle）

- 效果：函数连续触发时每隔 n 秒只执行一次。
- 原理：在事件触发时，先判断与上次执行的时间间隔，大于 n 秒才执行。
- 应用场景：监听 scroll 事件，鼠标滚轮事件。

```js
function throttle(fn, delay = 500) {
  let last = 0;
  return function (...arg) {
    let now = new Date();
    if (now - last > delay) {
      fn.apply(this, arg);
      last = now;
    }
  };
}
```
