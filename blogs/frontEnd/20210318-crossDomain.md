---
title: 跨域
date: 2021-03-18
tags:
  - 浏览器
categories:
  - frontEnd
---

跨域（Cross-Origin）是浏览器的一个安全机制（**同源策略**），当浏览器发生 AJAX 请求时，如果 http 协议、域名、端口，其中一个不同时，则在接受请求响应时会被浏览器拦截并抛出错误。

<!-- more -->

### 解决方案

1. CORS（跨域资源共享）：设置响应头`Access-Control-Allow-Origin`，由后端将请求的 `origin` 添加到该响应头中。

```js
const express = require('express');
const app = express();
app.get('/data', (req, res) => {
  // 将请求头中的origin设置为允许来源
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.send({ message: 'Hello!' });
});
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

2. JSONP：带回调的 JSON，利用`<script>`标签没有同源限制的特性来发送请求，后端通过回调函数将数据返回给前端。

```js
// 后端
const express = require('express');
const app = express();
app.get('/data', (req, res) => {
  const callback = req.query.callback;
  const data = { message: 'Hello, JSONP!' };
  if (callback) {
    res.type('text/javascript');
    res.send(`${callback}(${JSON.stringify(data)})`);
  } else {
    res.send(data);
  }
});
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

```html
<!-- 前端 -->
<script>
  function fetchData() {
    const script = document.createElement('script');
    script.src = 'http://localhost:3000/data?callback=handleResponse';
    document.body.appendChild(script);
  }
  function handleResponse(data) {
    console.log(data);
  }
</script>
```

3. 反向代理：代理服务器，浏览器只与相同域的代理服务器通信，由代理服务器去访问目标服务器，再将数据返回给浏览器，这样就可以避免跨域。

```js
// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        // 标识，当path中出现/api时，则由代理服务器去访问
        target: 'http://localhost:8080', // 代理服务器的域（需要设置为浏览器url的域）
        changeOrigin: true, // 更改源
        pathRewrite: {
          '^/api': '' // 请求时将标识去掉
        }
      }
    }
  }
};
```
