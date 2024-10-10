---
title: 函数式组件与render
date: 2022-08-16
tags:
  - Vue
categories:
  - frontEnd
---

<!-- more -->

### 函数式组件

函数式组件是一个没有 Vue 实例的组件，意味着没有响应式数据，也没有生命周期函数，也没有 this 上下文，只接受 props 的一个组件，一般用于性能优化，比如长列表的 cell，数据都来源于 props，它没有 Vue 实例和数据监听，性能更好。

- **方式 1**：设置 `functional: true`，标记为函数式组件。

  ```js
  Vue.component('my-component', {
    functional: true,
    props: {
      // ...
    },
    // 为了弥补缺少的实例
    // 提供第二个参数作为上下文
    render: function (createElement, context) {
      // ...
    }
  });
  ```

- **方式 2**：使用模版，通过`functional`标记为函数式组件。
  ```html
  <template functional> </template>
  ```

### render

render 是一个渲染函数，可以通过 JavaScript 来构建虚拟 DOM，一般动态内容可以用 render 函数来写，比如 table 的 columns。

- **类型**：`(createElement: () => VNode) => VNode`，接收一个 createElement 方法作为第一个参数用来创建 VNode（虚拟 DOM），如果是一个函数组件，还会接收一个额外的 context 参数，弥补没有 this 的问题，context 包含 { props, children, slots, parent, … }
- **createElement**： 通常用 **h** 别名表示。

  ```js
  render(h) {
    return h(
      'el-tooltip', // 标签名、组件名
      {
        // 属性对象
        class: 'my-class',
        props: {
          content: "提示内容",
          placement: "top"
        }
      },
      [
        // 子节点，如果h只传两个参数，那第二参数将解析为子节点 <div>Hello World</div>
        h('div', 'Hello World')
      ]
    );
  }
  ```

  1. 第 1 个参数：**标签名或组件**（tag）， 可以是一个字符串(HTML 标签、组件名) 或者是一个组件对象
  2. 第 2 个参数：**数据对象**（data），一个包含属性、事件、样式等信息的对象（可选）。

     ```js
     {
         // {String | Object | Function}
         'class': { foo: true, bar: false },
         // {String | Object | Function}
         style: { color: 'red', fontSize: '14px' },
         // 普通的 HTML attribute
         attrs: { id: 'foo' },
         // 组件 prop
         props: {  myProp: 'bar'  },
         // DOM property
         domProps: { innerHTML: 'baz' },
         // 事件监听器
         on: { click: this.clickHandler },
         // 仅用于组件，用于监听原生事件，而不是组件内部使用
         // `vm.$emit` 触发的事件。
         nativeOn: { click: this.nativeClickHandler},
         // 传递作用域插槽 { name: props => VNode | Array<VNode> }
         scopedSlots: {
           default: props => h('span', props.text)
         },
         // 传递具名插槽，指定插槽名称
         slot: 'slot-name',
         key: 'myKey',
         ref: 'myRef',
         // for循环中使用相同的 ref 名， 那么 `$refs.myRef` 会变成一个数组。
         refInFor: true
       }
     ```

  3. 第 3 个参数：**子节点**（children），一个子节点、一个子节点数组或者是字符串（可选）。

- **插槽**

  - 默认插槽
    ```js
    // 在my-component组件中定义一个默认插槽
    render(h) {
      return h(
        'div',
        this.$slots.default
      );
    }
    // 在父组件中使用，通过子节点参数传递默认插槽的VNode
    render(h) {
      return h(
        'my-component',
        h('div', 'Hello World') // 传递到my-component组件的默认插槽上
      )
    }
    ```
  - 具名插槽
    ```js
    // 在my-component组件中定义具名插槽
    render(h) {
      return h(
        'div',
        [
          this.$slots.header,
          this.$slots.default,
          this.$slots.footer,
        ]
      );
    }
    // 在父组件中使用，通过slot传递对应具名插槽的VNode
    render(h) {
      return h(
        'my-component',
        [
          h('div', { slot:'header' },'顶部插槽内容'),
          h('div','默认插槽内容'),
          h('div', { slot:'footer' },'尾部插槽内容')
        ]
      )
    }
    ```
  - 作用域插槽
    ```js
    // 在my-component组件中定义作用域插槽
    render(h) {
      return h(
        'div',
        [
          // 先检查是否有对应的插槽传递，再调用插槽函数
          this.$scopedSlots.header && this.$scopedSlots.header({ header: 'header' }),
          this.$scopedSlots.default && this.$scopedSlots.default({ default: 'default' }),
          this.$scopedSlots.footer && this.$scopedSlots.footer({ footer: 'footer' })
        ]
      );
    }
    // 在父组件中使用，通过scopedSlots传递对应作用域插槽的VNode
    render(h) {
      return h(
        'my-component',
        {
          scopedSlots: {
            header: props => h('div', props.header),
            default: props => h('div', props.default),
            footer: props => h('div', props.footer)
          }
        }
      );
    }
    ```

- **模版编译**：所有模版都会通过`vue-template-compiler`插件编译为渲染函数。

### JSX

如果子节点比较多，用 render 函数来写的话，会出现很多 h 函数，嵌套起来影响阅读，相比之下直接用标签更清晰，而 JSX**能够在标签内部嵌入 JavaScript 表达式。通过将表达式包裹在大括号 {} 内**，同时具备了灵活性跟可读性，**最后通过 JSX babel 插件解析为 createElement 函数**。

```jsx
// 在my-component组件中定义普通插槽（默认插槽 & 具名插槽）
render(h) {
  const slots = this.$slots // 接受普通插槽，默认插槽名字为default
  return (
    <div>
      { slots.header }
      { slots.default }
      { slots.footer }
    </div>
  )
}
// 在父组件中使用，并往普通插槽插入VNode
render(h) {
  return (
    <my-component>
      <div slot="header"> 顶部插槽内容 </div>
      <div> 默认插槽内容 </div>
      <div slot="footer"> 尾部插槽内容 </div>
    </my-component>
  );
}
```

```jsx
// 在my-component组件中定义作用域插槽
render(h) {
  const scopedSlots = this.$scopedSlots // 接受作用域插槽
  return (
    <div>
      { scopedSlots.header && scopedSlots.header( header: 'header') }
      { scopedSlots.default && scopedSlots.default( default: 'default') }
      { scopedSlots.footer && scopedSlots.footer( footer: 'footer') }
    </div>
  )
}
// 在父组件中使用，并往普通插槽插入VNode
render(h) {
  return (
    <my-component
      scopedSlots={{
        header: (props) => <div>{props.header}</div>,
        default: (props) => <div>{props.default}</div>,
        footer: (props) => <div>{props.footer}</div>
      }}
    >
    </my-component>
  );
}
```
