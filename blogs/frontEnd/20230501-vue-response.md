---
title: vue2与vue3实现双向绑定的区别
date: 2023-05-01
tags:
  - Vue
categories:
  - frontEnd
---

众所周知，vue2 使用`Object.defineProperty`来实现双向绑定，而 vue3 使用`Proxy`来实现，那么究竟有什么区别呢？

<!-- more -->

### Vue2 使用`Object.defineProperty`

在 Vue2 中，通过`Object.defineProperty`来挟持对象中的每一个属性的`getter`和`setter`方法，从而实现数据的双向绑定。

- `Object.defineProperty`是 Object 的静态方法，可以在对象上添加或修改属性，也可以定义属性的`getter`和`setter`。

  ```js
  // 监听对象属性的getter与setter
  function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
      get() {
        console.log(`Getting value of ${key}: ${val}`);
        return val;
      },
      set(newVal) {
        if (newVal !== val) {
          console.log(`Setting value of ${key}: ${newVal}`);
          val = newVal;
          // 触发视图更新或其他逻辑
        }
      }
    });
  }
  // 遍历对象属性，并添加对应的属性监听
  function reactive(obj) {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key]);
    });
  }
  // 定义data对象
  let data = {
    name: 'John',
    age: 30
  };
  // 挟持data对象的每一个属性，使其具有响应式
  reactive(data);

  // 示例
  console.log(data.name); // Getting value of name: John
  data.name = 'Doe'; // Setting value of name: Doe
  console.log(data.age); // Getting value of age: 30
  data.age = 31; // Setting value of age: 31
  ```

### Vue3 使用`Proxy`

在 Vue3 中，通过`Proxy`可以更方便的挟持整个对象，而不仅仅是某一个属性。`Proxy`可以对对象的所有操作进行拦截，包括属性访问、修改、新增。

- `Proxy`对象用于创建一个对象的代理， 对代理对象的所有操作都会转发到原始对象上。

  ```js
  // 代理整个对象，通过get与set拦截对象属性操作
  function reactive(obj) {
    return new Proxy(obj, {
      get(target, key) {
        console.log(`Getting value of ${key}: ${target[key]}`);
        return target[key];
      },
      set(target, key, value) {
        if (target[key] !== value) {
          console.log(`Setting value of ${key}: ${value}`);
          target[key] = value;
          // 触发视图更新或其他逻辑
        }
        return true;
      }
    });
  }
  // 创建一个数据对象的代理对象
  let data = reactive({ name: 'John', age: 30 });

  // 示例
  console.log(data.name); // Getting value of name: John
  data.name = 'Doe'; // Setting value of name: Doe
  console.log(data.age); // Getting value of age: 30
  data.age = 31; // Setting value of age: 31
  ```

### 区别

- vue2
  - 必须遍历对象的每一个属性，为每一个属性单独定义`getter`和`setter`。
  - 不能监听到对象属性的添加或删除，只能处理对象一开始就有的属性，除非使用`$set(key,value)`，也不能监听数组的变化。
- vue3
  - 一次性处理整个对象，自动捕获所有 get 和 set 操作。
  - 可以动态监听对象属性的添加、删除，甚至可以监听数组的变化。
