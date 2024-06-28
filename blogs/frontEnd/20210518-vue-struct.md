---
title: Vue单页应用结构
date: 2021-05-18
tags:
  - Vue
categories:
  - frontEnd
---

一个单页面应用就是一个 Vue 实例，通过 `new Vue(…)`挂载到 dom 元素上。
每一个页面都是一个 `vueComponent` 实例（vueComponent 继承自 Vue），通过 `Router` 建立页面组件与 `hash` 的映射表（hash 是 url 中#号后面的值）。
当改变 url 中的 hash 值时，会通过路由映射表找到对应的组件，挂载到 Vue 实例下，然后更新虚拟 dom，最后渲染到页面上。

<!-- more -->

```js
// 替换hash值
function replaceHash() {
  let url = location.origin + location.pathname;
  // 改变hash，replace不会重新加载页面
  location.replace(`${url}#/${Date.now()}?t=${Date.now()}`);
}
// 添加历史记录
function pushState() {
  const now = Date.now();
  let url = location.origin + location.pathname + '/' + now;
  // 添加历史记录，会更新当前url，但不会重新加载页面；使用history模式时，需要服务端设置通配符，确保所有路由路径都返回入口html，否则刷新报404。
  history.pushState({ key: now }, '', url);
}
// 监听hashChange，popState
(function () {
  window.addEventListener('hashchange', (e) => {
    // 根据当前hash中的path匹配出对应的组件，渲染到router-view中
    console.log('hashchange', e);
  });
  window.addEventListener('popstate', (e) => {
    // 根据当前url中的path匹配对应的组件，渲染到router-view中
    console.log('popstate', e);
  });
})();
```
