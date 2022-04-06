---
title: Vue常用过滤器
date: 2021-04-30
tags:
  - Vue
categories:
  - frontEnd
---

过滤器通常用于处理文本格式化，类似于管道，数据经过该管道处理之后都会以一种特定的格式输出，比如日期格式、去空格、手机号脱敏等等。

<!-- more -->

### 注册使用

- 局部注册，只能局部使用。

  ```js
  filters: {
    // 函数第一个参数为要加工的数据，后面所有参数都是加工参数。
    money: function (value, pre = "￥") {
      return `${pre}${value}`;
    }
  }
  ```

- 全局注册，可全局使用。

  ```js
  Vue.filter("money", function (value, pre = "￥") {
    return `${pre}${value}`;
  });
  ```

- 使用：用管道符`|`加过滤器名称即可。

  ```js
  <div>金额：{{ 66.6 | money }}</div> // ￥66.6
  <div>金额：{{ 66.6 | money('$') }}</div> // $66.6
  ```

### 常用过滤器

```js
// filter.js

// 日期时间格式化
export function dateFormat(value, format = "YYYY-MM-DD HH:mm:ss") {
  if (!value) return "";
  return dayjs().format(format);
}

// 手机号脱敏
export function phoneEncrypt(value) {
  value = String(value);
  return value.replace(/^(\d{3})\d*(\d{4})$/g, "$1****$2");
}

// 去除空格 type 1-所有空格 2-前后空格 3-前空格 4-后空格
export function trim(value, type = 1) {
  switch (type) {
    case 1:
      return value.replace(/\s/g, "");
    case 2:
      return value.replace(/(^\s*)|(\s*$)/g, "");
    case 3:
      return value.replace(/^\s*/g, "");
    case 4:
      return value.replace(/\s*$/g, "");
  }
}

// 保留小数点位数，默认2位
export function decimalFormat(value, digit = 2) {
  var f = parseFloat(value);
  if (isNaN(f)) {
    return false;
  }
  let unit = 10 ** digit;
  f = Math.round(value * unit) / unit;
  var s = f.toString();
  var rs = s.indexOf(".");
  if (rs < 0 && digit > 0) {
    rs = s.length;
    s += ".";
  }
  while (s.length <= rs + digit) {
    s += "0";
  }
  return s;
}
```

### 批量注册

```js
// index.js
import * as filters from "./filter";
import Vue from "vue";
console.log(filters);

// 遍历对象
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});
```
