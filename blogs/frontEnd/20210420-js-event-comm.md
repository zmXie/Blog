---
title: JavaScript事件通信（EventBus、dispatchEvent）
date: 2021-04-20
tags:
  - JavaScript
categories:
  - frontEnd
---

- `EventBus（事件总线）`是一种可以跨组件的全局通信方式，核心思想是通过单例转发事件来实现。
- `dispatchEvent（事件分发）`也是一种可以跨组件的全局通信方式，核心思想是通过`window`派发自定义事件来实现。

<!-- more -->

### EventBus

- JS 实现，创建`EventBus`单例，`on`监听，存储事件名与回调的映射；`emit`发送事件，调用映射中的回调。
  ```js
  class EventBus {
    constructor() {
      this.eventMap = {};
    }
    // 监听事件
    on(name, fn) {
      if (!name || !fn) {
        throw new Error('参数不能为空');
      }
      this.eventMap[name] = fn;
    }
    // 发送事件
    emit(name, ...args) {
      const fn = this.eventMap[name];
      if (!fn) {
        return;
      }
      fn(...args);
    }
    // 移除事件
    off(name) {
      delete this.eventMap[name];
    }
  }
  const eventBus = new EventBus();
  export default eventBus;
  ```
- Vue 实现，创建一个 Vue 单例，绑定到 Vue 原型对象上，利用自身的`on`和`emit`实现通信

  ```js
  // 在main.js中注册
  Vue.prototype.$bus = new Vue();

  // 组件A中监听并移除
  created() {
    this.$bus.$on('refresh', ()=>{});
  },
  beforeDestroy(){
     this.$bus.$off('refresh');
  }

  // 组件B中发送
  click(){
   this.$bus.$emit('refresh',{id:1});
  }
  ```

### dispatchEvent

```js
  // 组件A中监听并移除
  created() {
    window.addEventListener('refresh', ()=>{});
  },
  beforeDestroy(){
    window.removeEventListener('refresh');
  }

  // 组件B中发送
  click(){
    window.dispatchEvent(new CustomEvent('refresh',{id:'1'}));
  }
```
