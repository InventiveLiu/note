---
title: UI组件库
order: 3
group:
  title: 个人项目
  order: 1
---

# 组件库搭建

## 文档工具选择

## 如何生成 ts 声明文件

## 如何给组件库提供按需加载方案

直接参考`antd`的按需加载方案，分为利用`babel-plugin-import`方案，和利用`ES Module TreeShaking`方案

### babel-plugin-import

`babel-plugin-import`的作用

```js
import { Button } from 'ui-lib';
```

会被转换成

```js
import Button from 'ui-lib/es/Button'; // 具体路径是可配置的
import 'ui-lib/es/Button/style/css';
```

这样就要求把各个组件分开打包到不同的文件夹, 需要多个入口

### tree shaking

`antd`升级后把按需加载改成了`tree shaking`模式，关于`tree shaking`可以查看[模块化](/js/module#treeshaking)

`tree shaking`需要`ES Module`的支持，而`webpack`打包输出`ES Module`还处于试验阶段，所以选择对`ES Module`支持更好的`rollup`

这里也不会详细说明如何使用`rollup`，直接上配置文件，重要信息都在配置文件里可以体现

```js
export default {};
```
