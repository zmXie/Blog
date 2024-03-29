---
title: JavaScript继承
date: 2021-04-15
tags:
  - JavaScript
categories:
  - frontEnd
---

JavaScript 继承是基于原型的，当访问对象的属性不存在时会根据`__proto__`往上查找其他对象的属性，所以修改原型对象上的属性会影响下面所有对象；而基于类继承的语言则不同，比如 Objective-C，当访问对象属性不存在时会向父类查找，但是属性终究还是挂在当前对象上，修改该属性不会影响到其他对象。

<!-- more -->

### 原型链继承

- 原理：将父类的实例对象作为子类的原型。
- 优点：子类的实例可以顺着原型链往上访问所有属性和方法。
- 缺点：修改原型对象上的引用属性会影响所有实例对象。

  ```js
  // 父类
  function Person() {
    this.colors = ["white", "yellow"];
  }
  Person.prototype.age = 18;
  // 子类
  function Student() {}
  Student.prototype = new Person();
  Student.prototype.constructor = Student;
  // 实例
  let s1 = new Student();
  let s2 = new Student();
  s1.colors.push("black"); // 修改了原型对象上的属性，所以所有实例对象都会受影响
  console.log(s1.colors); // [ 'white', 'yellow', 'black' ]
  console.log(s2.colors); // [ 'white', 'yellow', 'black' ]
  console.log(s2.age); // 18
  ```

### 构造继承

- 原理：通过调用父类构造函数的 call 或者 apply 方法，将父类的属性 copy 到子类。
- 优点：对象的属性独立，相当于复制，不会被其他对象影响；可以多继承（call 多个）。
- 缺点：没有基于父类的原型链扩展，所以不能访问父类原型上的属性和方法。

  ```js
  // 父类
  function Person() {
    this.colors = ["white", "yellow"];
  }
  Person.prototype.age = 18;
  // 子类
  function Student() {
    Person.call(this); // 调用Person构造函数，将属性绑定到Student构造出来的对象上
  }
  // 实例
  let s1 = new Student();
  let s2 = new Student();
  s1.colors.push("black");
  console.log(s1.colors); // [ 'white', 'yellow', 'black' ]
  console.log(s2.colors); // [ 'white', 'yellow' ]
  console.log(s2.age); // undefined（无法访问父类原型对象上的属性）
  ```

### 组合继承

- 原理：原型链继承 + 构造继承的组合。
- 优点：对象属性独立，并且可以访问原型链。
- 缺点：父类构造函数会调用两次，意味着原型对象上也会添加同样的属性，但其实是多余的。

  ```js
  // 父类
  function Person() {
    this.colors = ["white", "yellow"];
  }
  Person.prototype.age = 18;
  // 子类
  function Student() {
    Person.call(this); // 构建Student对象时，又调用了一次Person构造函数
  }
  Student.prototype = new Person(); // 调用了一次Person构造函数
  Student.prototype.constructor = Student;
  // 实例
  let s1 = new Student();
  let s2 = new Student();
  s1.colors.push("black");
  console.log(s1.colors); // [ 'white', 'yellow', 'black' ]
  console.log(s2.colors); // [ 'white', 'yellow' ]
  console.log(s2.age); // 18
  ```

### 寄生组合式继承

- 原理：通过`Object.create`函数，创建一个基于父类原型的实例作为子类的原型，并且调用父类构造函数的 call 方法将属性添加到子类。
  ::: tip ES5 提供的函数
  // 创建一个对象，并将这个对象的**proto**指向另一个对象。 <br>
  **Object.create**(proto，[propertiesObject]) <br>
  **proto**：新创建对象的原型对象。<br>
  **propertiesObject**：可选，属性描述对象(对新创建的对象添加指定的属性值)。
  :::
- 优点：对象属性独立，并且可以访问原型链，且原型对象上也没有多余属性。
- 缺点：无。

  ```js
  // 父类
  function Person() {
    this.colors = ["white", "yellow"];
  }
  Person.prototype.age = 18;
  // 子类
  function Student() {
    Person.call(this); // 调用Person构造函数，将属性复制到子类
  }
  Student.prototype = Object.create(Person.prototype); // 创建一个基于父类原型的实例
  Student.prototype.constructor = Student; // 修正原型对象的构建函数
  // 实例
  let s1 = new Student();
  let s2 = new Student();
  s1.colors.push("black");
  console.log(s1.colors); // [ 'white', 'yellow', 'black' ]
  console.log(s2.colors); // [ 'white', 'yellow' ]
  console.log(s2.age); // 18
  ```

### ES6 中 Class 的继承

- 原理：`Class` 可以通过`extends`关键字实现继承，本质还是`寄生组合式继承`的方式。
- 优点：对象属性独立，并且可以访问原型链，且原型对象上也没有多余属性。
- 缺点：无。

  ```js
  // 父类
  class Person {
    constructor() {
      this.colors = ["white", "yellow"];
    }
  }
  Person.prototype.age = 18;
  // 子类
  class Student extends Person {
    constructor() {
      // 相当于 Person.call()，将父类属性复制到子类。
      super();
    }
  }
  // 实例
  let s1 = new Student();
  let s2 = new Student();
  s1.colors.push("black");
  console.log(s1.colors); // [ 'white', 'yellow', 'black' ]
  console.log(s2.colors); // [ 'white', 'yellow' ]
  console.log(s2.age); // 18
  ```

### 多继承

- JavaScript 可以通过`Object.assign`混入的方式实现多继承。
  ::: tip ES5 提供的函数
  // 将源对象的属性分配到目标对象（对象合并，如果属性是对象，则copy引用，即浅拷贝），相同的键会被覆盖。 <br>
  **Object.assign**(target, ...sources) <br>
  **target**：目标对象。<br>
  **sources**：源对象，可以传多个。
  :::

  ```js
  function MyClass() {
    // 将所有父类的属性都复制到子类
    SuperClass.call(this);
    OtherSuperClass.call(this);
  }
  // 继承一个类
  MyClass.prototype = Object.create(SuperClass.prototype);
  // 混合其它
  Object.assign(MyClass.prototype, OtherSuperClass.prototype);
  // 重新指定constructor
  MyClass.prototype.constructor = MyClass;
  ```
