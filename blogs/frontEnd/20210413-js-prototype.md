---
title: JavaScript原型与原型链
date: 2021-04-13
tags:
  - JavaScript
categories:
  - frontEnd
---

原型与原型链都是 JavaScript 基于继承而设计出来的概念。在 JavaScript 中每个对象都有一个`__proto__`指针，指向它的原型对象，共享原型对象中所有的属性和方法，而原型对象同样有自己的`__proto__`指针，层层往上直到`null`，这样就构成了原型链。

<!-- more -->

### prototype

- **每个函数都有一个`prototype`指针属性**，指向原型对象。
- 原型对象默认跟着函数一并创建，可以任意扩展属性和方法。
- 函数构建出来的对象可以共享其原型对象所有的属性和方法。

  ```js
  function Person() {}
  console.log(Person.prototype); // Person {}

  Person.prototype.age = 0;
  Person.prototype.eat = function () {
    return '吃饭';
  };
  let p = new Person();
  console.log(p.age); // 0
  console.log(p.eat()); // 吃饭
  ```

### proto

- **每个对象都有一个`__proto__`指针属性**，指向原型对象，跟构造函数的`prototype`指向同一个对象。
- 当对象访问的属性或方法不存在时，会顺着`__proto__`往上继续查找，如果都没有，属性会返回 undefined，方法会报错。

  ```js
  function Person() {}
  Person.prototype.age = 0;
  let p = new Person();
  console.log(Person.prototype === p.__proto__); // true
  console.log(p.age); // 0
  console.log(p.name); // undefined
  console.log(p.eat()); // TypeError: p.eat is not a function
  ```

### constructor

- **每个对象都有一个`constructor`指针属性**，指向其构造函数。
- 构造函数与原型对象是相互引用的，构造函数的`prototype`指向原型对象，原型对象的`constructor`指向构造函数。

  ```js
  function Person() {}
  let xiaoming = new Person();
  console.log(xiaoming.constructor === Person); // true
  console.log(Person.prototype.constructor === Person); // true
  ```

<img :src="$withBase('/原型与构造函数.png')" alt="mixureSecure">

### 原型链

- 对象之间通过`__proto__`指针连起来，这样就形成了原型链。

  ```js
  function Person() {}
  let xiaoming = new Person();
  ```

  <img :src="$withBase('/对象原型链.png')" alt="mixureSecure">

- 在 JavaScript 中函数也是对象，同样有`__proto__`指针属性，所有函数的`__proto__`都统一指向`Function.prototype`，`Function.prototype`的`__proto__`指向`Object.prototype`。
  <img :src="$withBase('/完整原型链.png')" alt="mixureSecure">
