---
title: UI组件库
order: 3
group:
  title: 个人项目
  order: 1
---

# 组件库搭建

## 文档工具选择

`dumi`

## 如何生成 ts 声明文件

我选择用`babel`来编译`ts`，用`tsc`来生成`.d.ts`声明文件，所以`tsconfig.json`配置如下：

```json
{
  "declaration": true, // 生成声明文件
  "emitDeclarationOnly": true, // 只生成声明文件
  "declarationDir": "./types", // 声明文件存放目录，建议单独存放
  "isolatedModules": true // babel 编译 ts时，不能使用const enum等特性
}
```

## 如何给组件库提供按需加载方案

参考`antd`的按需加载方案，早期（`v4`之前）`antd`是利用`babel-plugin-import`方案，后来（`v4`）改成利用`ES Module TreeShaking`方案

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

这样就要求把各个组件分开打包到不同的文件夹, 需要多个入口，各组件单独打包成文件

### tree shaking

`antd`升级后把按需加载改成了`tree shaking`模式，关于`tree shaking`可以查看[模块化](/js/module#treeshaking)

`tree shaking`需要`ES Module`的支持，而`webpack`打包输出`ES Module`还处于试验阶段，所以选择对`ES Module`支持更好的`rollup`

这里也不会详细说明如何使用`rollup`，直接上配置文件，重要信息都在配置文件里可以体现

```js
// import glob from 'glob';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import pkg from './package.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const external = Object.keys(pkg.peerDependencies);

export default {
  input: 'src/index.tsx',
  output: ['esm'].map(format => ({
    format,
    exports: 'auto',
    dir: `lib`,
    preserveModules: true,
    preserveModulesRoot: 'src',
  })),
  external: [/@babel\/runtime/, ...external],
  plugins: [
    nodeResolve({
      extensions,
    }),
    commonjs(),
    babel({
      babelHelpers: 'runtime',
      extensions,
      exclude: ['node_modules/**'],
    }),
    postcss({
      extract: true,
      extensions: ['.css', '.scss'],
      minimize: true,
    }),
  ],
};
```

### 其他方案

既然可以利用多入口把各个组件单独输出，那么也可以直接将每个组件当成一个单独的包，采用`monorepo`的方式统一管理，像`lodash`就有一个大包，然后每个功能函数又有一个单独的自己小包

## css 如何按需加载

如果是使用`babel-plugin-import`的话，`css`已经是拆分成单独的文件了，达到了按需加载的目的

如果是使用`tree-shaking`提供`js`的按需加载的话，`css`可以嵌入到`js`里，而不是生成单独的`.css`文件

### antd 怎么做的

`antd`默认的是引入全部的`css`

## icon 等图片如何处理

业务开发时，小图片一般都会打包成`base64`编码嵌入到`css`里面，但是前面又提到`css`可能嵌入`js`里面，这样一来`js`的体积会变大很多

大图片一般是输出成单独的文件到某个文件夹，但是如何保证组件库的使用者能够正确的引用正确的图片路径呢？

以上两个问题是我在开发组件库的过程中所思考的，目前得到的解决方案如下：

- icon

  前端对于 icon 的处理其实也经历过一段时间发展，早期一般采用雪碧图`image spirit`，即利用`background-position`来显示不同图片，可以减少对图片的`http`请求，但问题是难以维护，新赠或者修改`icon`时需要修改整个雪碧图，还可能需要调整`background-position`的值；

  后来使用`gulp`,`webpack`等工具之后，`icon`都会打包成`base64`编码直接写入`css`，但这样做新的问题就是`css`体积会变大，因为`base64`代码本身就比较多，也做不到复用；

  雪碧图还有一个替代方案是使用字体图标，即利用字体库来显示图标，比如`font-awesome`，以及[icon-font](https://www.iconfont.cn/help/detail?helptype=code)，使用方法有`unicode`引用，`font-class`引用，`svg-symbol`引用，三种使用方法的说明及优缺点都在`icon-font`上有说明

  总结一下，`icon`目前我推荐的是使用`svg-symbol`引用来处理

- 大图片

  对于一个组件库来说，需要使用大图片的情况比较少，但对于业务组件来说，使用大图片的情况还是有的；对于大图片目前只想到了两种方案，一种是可以使用远程图片地址，这对于公司内部的使用来说问题不大，但对于公开的组件库，使用远程图片就不好了，因为使用者无法保证远程图片的有效性；第二种同样是采用`svg`格式的图片，直接编写到`html`或`jsx`中，这种方式简单直接，也是推荐的一种方式

## 字体文件如何处理

某些业务组件可能用到特殊的字体，比如我们现在的金额显示，目前没想到较好的方法，只能采用远程链接的方式
