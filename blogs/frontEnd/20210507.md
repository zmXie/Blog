---
title: Element-UI 实战技巧
date: 2021-05-06
tags:
  - Vue
categories:
  - frontEnd
---

记录使用 Element-UI 过程中，相关技巧与问题。

<!-- more -->

### 全局修改配置

需要再注册前修改

```js
// 修改点击 modal 关闭 Dialog
Element.Dialog.props.closeOnClickModal.default = false;
// 修改input组件默认有清空按钮
ElementUI.Input.props.clearable.default = true;
// 全局配置size，和弹框z-index
Vue.use(ElementUI, { size: "medium", zIndex: 3000 });
```

### 封装 loading

```js
Element.prototype.showLoading = function () {
  if (this.loading) return;
  this.loading = ElementUI.Loading.service({
    target: this,
    fullscreen: false,
  });
  // 5秒自动关闭
  setTimeout(() => {
    this.loading?.close();
    delete this.loading;
  }, 5000);
};
Element.prototype.closeLoading = function () {
  this.loading?.close();
  delete this.loading;
};
// 使用
document.querySelector(config.loadingClass)?.showLoading();
document.querySelector(target)?.closeLoading();
```

### el-button

- 防抖：防抖通常会使用`debounce`来做，而`debounce`的原理是：在事件触发 n 秒后执行函数，如果 n 秒内再次触发，则会重新计时。这样点击响应会有延时，并且超过规定时间再次点击还是会触发事件，体验不如`loading`好，但是`loading`每次都需要定义变量，很繁琐，所以对 el-button 封装处理。

  - 自定义组件`ld-button`。

  ```vue
  <template>
    <el-button v-bind="$attrs" @click="handleClick" :loading="loading">
      <slot></slot>
    </el-button>
  </template>
  <script>
  export default {
    name: "ld-button",
    props: {
      click: Function,
    },
    data() {
      return {
        loading: false,
      };
    },
    methods: {
      handleClick() {
        this.loading = true;
        Promise.resolve(this.click()).finally(() => {
          this.loading = false;
        });
      },
    },
  };
  </script>
  ```

  - 使用`ld-button`，在异步任务完成之前，按钮处于 loading 不可点击状态，无需再定义变量来做绑定。

  ```vue
  <template>
    <ld-button :click="confirm">确定</ld-button>
  </template>
  <script>
  export default {
    methods: {
      async confirm() {
        const res = await ajax();
      },
    },
  };
  </script>
  ```

### el-input

- 统一去掉首尾空格：去首尾空格一般会用`v-model.trim`修饰符，但是这样在编辑时不能输入空格，尤其是英文输入非常别扭，所以只能在`change`的时候通过`.trim()`去除，如果整个项目都要应用，就需要在注册的时候来统一处理。

  ```js
  // 统一格式化去除input首尾空格
  Vue.component("el-input", {
    extends: ElementUI.Input,
    created() {
      this.$on("change", (value) => {
        this.$emit("input", value.trim());
      });
    },
  });
  ```

- 自动聚焦：`autofocus`经常失效，可以通过自定义`v-focus`指令来实现

  ```js
  // 注册一个全局自定义指令 `v-focus`
  Vue.directive("focus", {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el) {
      el.querySelector(".el-input__inner")?.focus();
    },
  });
  ```

- 限制输入：注册`v-filter`指令来实现。

  ```js
  // 限制输入框只能输入数字
  // v-filter:number 数字
  // v-filter:en 非中文
  // v-filter:int 正整数
  // v-filter:float="3" 小数，不传默认为2位小数
  Vue.directive("filter", {
    bind(el, binding, vnode) {
      let input = vnode.elm;
      let type = binding.arg;
      if (input.tagName !== "INPUT") {
        input = input.querySelector("input");
      }
      if (!input) return;
      input.addEventListener("compositionstart", () => {
        vnode.inputLocking = true;
      });
      input.addEventListener("compositionend", () => {
        vnode.inputLocking = false;
        input.dispatchEvent(new Event("input"));
      });
      input.addEventListener(
        "input",
        (e) => {
          e.preventDefault(); // 阻止掉默认的change事件
          if (vnode.inputLocking) {
            return;
          }
          let oldValue = input.value;
          let newValue = oldValue;
          if (type === "number") {
            // 数字类型
            newValue = newValue.replace(/[^\d]/g, "");
          } else if (type === "en") {
            // 英文类型
            newValue = newValue.replace(/[\u4E00-\u9FFF]/g, "");
          } else if (type === "int") {
            // 整数
            newValue = Number(newValue).toString();
          } else if (type === "float") {
            // 浮点数
            newValue = newValue.replace(/[^\d.]/g, "");
            newValue = newValue.replace(/^\./g, "");
            newValue = newValue
              .replace(".", "$#$")
              .replace(/\./g, "")
              .replace("$#$", ".");
            const decimal = Number(binding.value) || 2; // 默认1位小数
            const reg = new RegExp(`^(\\-)*(\\d+)\\.(\\d{${decimal}}).*$`);
            newValue = newValue.replace(reg, "$1$2.$3");
            if (newValue) {
              let arr = newValue.split(".");
              newValue =
                Number(arr[0]) + (arr[1] === undefined ? "" : "." + arr[1]); // 去掉开头多余的0
            }
          }
          // 判断是否需要更新，避免进入死循环
          if (newValue !== oldValue) {
            input.value = newValue;
            input.dispatchEvent(new Event("input")); // 通知v-model更新 vue底层双向绑定实现的原理是基于监听input事件
            input.dispatchEvent(new Event("change")); // 手动触发change事件
          }
        },
        true // 在捕获阶段处理，目的是赶在change事件之前阻止change事件(非法输入在触发指令之前先触发了change，需要干掉)
      );
    },
  });
  ```

### el-select

- 上拉加载更多：通过注册自定义指令`v-el-select-loadmore`来支持上拉加载

  ```js
  Vue.directive("el-select-loadmore", {
    bind(el, binding) {
      const el_wrap = el.querySelector(
        ".el-select-dropdown .el-select-dropdown__wrap"
      );
      let last = 0;
      el_wrap.addEventListener("scroll", function () {
        if (this.scrollHeight - this.scrollTop <= this.clientHeight) {
          // 500毫秒节流
          const now = Date.now();
          if (now - last > 500) {
            binding.value();
            last = now;
          }
        }
      });
    },
  });
  ```

### el-dialog

- 拖拽移动：通过注册自定义指令`v-dialogDrag`来支持拖拽

  ```js
  // v-dialogDrag: 弹窗拖拽
  Vue.directive("dialogDrag", {
    bind(el, binding, vnode, oldVnode) {
      const dragDom = el.querySelector(".el-dialog");
      const dialogHeaderEl = el.querySelector(".el-dialog__header");
      const dialogFooterEl = el.querySelector(".el-dialog__footer");
      dialogFooterEl.style.cursor = dialogHeaderEl.style.cursor = "move";
      // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
      const sty =
        dragDom.currentStyle || window.getComputedStyle(dragDom, null);
      // 鼠标按下事件
      const mousedown = (e) => {
        // 鼠标按下的位置
        const startX = e.clientX;
        const startY = e.clientY;
        // 获取到的值带px 正则匹配替换
        let styL, styT;
        if (sty.left.includes("%")) {
          // 将百分比转为对应像素
          styL =
            +document.body.clientWidth * (+sty.left.replace(/\%/g, "") / 100);
          styT =
            +document.body.clientHeight * (+sty.top.replace(/\%/g, "") / 100);
        } else {
          // 移除px，仅保留数字
          styL = +sty.left.replace(/\px/g, "");
          styT = +sty.top.replace(/\px/g, "");
        }
        // 鼠标移动事件
        document.onmousemove = function (e) {
          // 计算移动的距离
          const l = e.clientX - startX;
          const t = e.clientY - startY;
          // 移动当前元素
          dragDom.style.left = `${l + styL}px`;
          dragDom.style.top = `${t + styT}px`;
        };
        // 鼠标松开移除事件监听
        document.onmouseup = function (e) {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
      // 头尾添加鼠标事件
      dialogHeaderEl.onmousedown = mousedown;
      dialogFooterEl.onmousedown = mousedown;
    },
  });
  ```

### 图标乱码

近期在项目中偶现 `Elemet-UI` 图标乱码问题，经过一系列排查，最后发现是修改`Element-UI`主题色导致的。

- 原因：改饿了么主题色要把他的 scss 文件引进来，在打包的时候，我们的`dart-sass`会把 icon 的 unicode 转成明文，所以渲染的时候会乱码。
- 解决方案：安装`css-unicode-loader`，配置到`sass-loader`前面，在打包的时候它可以把明文再次转成 unicode。
  ```sh
  npm i css-unicode-loader -D
  ```
  ```js
  module: {
    rules: [
      // 处理css/scss/sass
      {
        test: /\.(sc|sa|c)ss$/,
        use: [
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "css-unicode-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ];
  }
  ```
