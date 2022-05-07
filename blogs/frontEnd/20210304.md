---
title: CSS自定义滑动滚动条
date: 2021-03-04
tags:
  - CSS
categories:
  - frontEnd
---

### CSS 滚动条选择器

- `::-webkit-scrollbar`——整个滚动条。
- `::-webkit-scrollbar-thumb`——滚动条上的滚动滑块。
- `::-webkit-scrollbar-track`——滚动条轨道。
- `::-webkit-scrollbar-track-piece`——滚动条没有滑块的轨道部分。
- `::-webkit-scrollbar-button`——滚动条上的按钮（上下箭头）。

自定义滑块样式：

```scss
&::-webkit-scrollbar {
  width: 6px;
  background-color: white;
}
&::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background-color: #f2f6fc;
}
```

注意：仅支持基于 webkit 的浏览器，比如：Chrome、Edge、Safari。
