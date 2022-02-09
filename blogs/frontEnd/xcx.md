---
title: 对小程序的理解
date: 2021-09-15
tags:
  - miniprogram
categories:
  - frontEnd
---

小程序本质是 Hybrid App（混合 App），渲染层走的 webView，逻辑层走 JSCore(V8,JavascriptCore)。

<!-- more -->


::: tip 
为什么比普通的 H5 页面体验好:
1. 小程序是双线程模型，渲染层和逻辑层分两个线程执行，通过原生来通信。
2. 小程序每一个页面都是一个 webview，页面栈里是一个个 webview，体验接近原生，并且可以分担单个 webview 的任务压力。
3. 充分利用原生的能力，比如网络请求、缓存、授权等等，都是通过 JSBrige 调用原生来做。
:::
