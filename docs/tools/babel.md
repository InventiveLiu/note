---
title: babel
order: 2
group:
  title: 工程化工具
  order: 7
---

# babel

作为前端工程化的基石，很多人都用过，但很多人都没用明白，包括我自己

本文基于当前最新版本`v7.14.0`进行演示

## babel 是什么

> Babel is a JavaScript compiler (babel 是一个`javascript`编译器)

`babel`的作用主要有以下几点：

- Transform syntax，转换语法，例如`jsx`
- 为目标环境不支持的特性提供`polyfill`，比如`async/await`等
- 源码转换，比如`babel-plugin-import`插件等

## babel 配置

`babel`的配置文件可以有很多形式，建议使用单独的配置文件，配置文件主要包含`presets`和`plugins`两个配置项

### 配置文件格式

配置文件通常分为`json`格式和`js`格式，这两种格式是有点区别的

`js`格式的优点是可以导出函数，根据不同环境设置不同的配置，但缺点是`babel`难以判断是否需要缓存，所以需要设置`api.cache`

在一次配置`babel`的配置过程中碰到了这个问题，当时全都是用的最新的版本

```json
{
  "devDependencies": {
    "@babel/core": "^7.14.5",
    "@babel/eslint-parser": "^7.14.5",
    "@babel/eslint-plugin": "^7.14.5",
    "@babel/plugin-transform-runtime": "^7.14.5",
    "@babel/preset-env": "^7.14.5",
    "@babel/preset-react": "^7.14.5",
    "babel-loader": "^8.2.2",
    "eslint": "^7.28.0",
    "eslint-config-airbnb": "^18.2.1",
    "eslint-config-prettier": "^8.3.0",
    "eslint-plugin-import": "^2.23.4",
    "eslint-plugin-jsx-a11y": "^6.4.1",
    "eslint-plugin-react": "^7.24.0",
    "eslint-plugin-react-hooks": "^4.2.0",
    "eslint-plugin-unicorn": "^33.0.1",
    "eslint-webpack-plugin": "^2.5.4",
    "html-webpack-plugin": "^5.3.1"
  }
}
```

```js
Parsing error: Caching was left unconfigured. Babel's plugins, presets, and .babelrc.js files can be configured
for various types of caching, using the first param of their handler functions:

module.exports = function(api) {
  // The API exposes the following:

  // Cache the returned value forever and don't call this function again.
  api.cache(true);

  // Don't cache at all. Not recommended because it will be very slow.
  api.cache(false);

  // Cached based on the value of some function. If this function returns a value different from
  // a previously-encountered value, the plugins will re-evaluate.
  var env = api.cache(() => process.env.NODE_ENV);

  // If testing for a specific env, we recommend specifics to avoid instantiating a plugin for
  // any possible NODE_ENV value that might come up during plugin execution.
  var isProd = api.cache(() => process.env.NODE_ENV === "production");

  // .cache(fn) will perform a linear search though instances to find the matching plugin based
  // based on previous instantiated plugins. If you want to recreate the plugin and discard the
  // previous instance whenever something changes, you may use:
  var isProd = api.cache.invalidate(() => process.env.NODE_ENV === "production");

  // Note, we also expose the following more-verbose versions of the above examples:
  api.cache.forever(); // api.cache(true)
  api.cache.never();   // api.cache(false)
  api.cache.using(fn); // api.cache(fn)

  // Return the value that will be cached.
  return { };
};
```

于是按照提示设置了`api.cache(true)`，但是接着在配置`eslint`并设置`parser: '@babel/eslint-parser'`后又开始报错了

```js
Caching has already been configured with .never or .forever()
```

通过上面的报错可以看到，`api.cache(true)`就相当于`api.cache.forever()`，目前没有解决这个问题，只能放弃`js`格式的配置

之所以用`js`格式的配置是因为，在用`jest`测试时，需要编译为`cjs`规范的代码，`@babel/preset-env`需配置`modules: 'cjs'`

但平时开发时，`@babel/preset-env`一般配置`modules: false`

### presets

`presets`其实就是一系列`plugin`的合集

`presets`的值是一个`PresetEntry`数组，数组内容可以是下面几种写法，常用的是前面两种

- `PresetEntryName`，单独一个`preset`名的字符串
- `[PresetEntryName， PresetEntryOption]`，一个数组，数组第一个是`preset`，第二个是该`preset`的配置
- `[PresetEntryName， PresetEntryOption, string]`，跟上一个相比多了一个`string`，这个`string`的作用是区分合并配置项(`extends`,`overrides`等)用的
- `babel.createConfigItem()`的结果，我没用到过

```js
export default {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
    '@babel/preset-react',
  ],
};
```

`presets`数组是有顺序的，按数据顺序倒叙执行，即最后一个先执行

官方的`preset`只有四个，下面分别介绍

#### @babel/preset-env

`babel`之前有很多`Stage-X`的`preset`，这些`Stage-X`都已经废弃了，现在统一使用`@babel/preset-env`

`@babel/preset-env`的配置如下：

- `targets`，定义目标环境

  配合`browserslist`使用，一般建议忽略这个配置，使用单独的`browserslist`配置文件，因为很多工具都会用到`browserslist`的配置，具体可以看`browserslist`[文档](/tools/browerslist)

  在没有声明`targets`，也没有找到`browserslist`配置时，`babel`会把所有代码转换成`ES5`代码

- `bugfixes`，默认`false`，在`babel v8`版本会改成默认`true`

  默认情况下，`@babel/preset-env`把相近的高级语法分成了一个一个小组，这些小组的包可能比较大，并且包含很多边界情况；`@babel/preset-env`只能根据`targets`的配置，以组的形式来启用或者不启用语法转换。

  例如“函数参数”这个组`@babel/plugin-transform-function-parameters`，它包含了解构(`...`)，默认值，剩余参数(`...rest`)等语法，如果某一个语法导致了目标环境的语法错误(比如不支持默认参数，但支持解构和剩余参数)，`@babel/preset-env`会把整个组的语法兼容都加上去，这样会增加不必要的代码，最坏的情况就是输出的结果完全是`ES5`，这与`@babel/preset-env`的初衷是违背的。

  `bugfixes`是为了解决上述问题而产生的，当设置为`true`的时候，`@babel/preset-env`会以最小的改动去修复目标环境不支持的语法，而不是把整个组都加上去。

  当开启`targets: { esmodules: true }`时，`bugfixes`会给出最好的结果，而开启`bugfixes`会达到`@babel/preset-modules`一样的效果，并且可以自定义`targets`，效果更好

  我的总结：开启`bugfixes`，`@babel/preset-modules`可以不使用了（正好我也没用过）

- `spec`，默认`false`，开启更符合规范的编译，可能会更慢，我没用过

- `loose`，默认`false`，译为宽松模式

  `babel`及其插件，有两种编译模式：

  - `normal mode`，输出更接近`ES6`规范的`ES5`代码
  - `loose mode`，输出更小的，更简单的`ES5`代码，更像平时的手写代码

  通过以上描述以及[这里](https://2ality.com/2015/12/babel6-loose-mode.html)的例子，似乎`loose mode`代码更少，那为什么都不推荐使用呢？

  我找了蛮久的文档，终于在[这里](https://meetguns.com/blog/babel-plugins-loose-mode-caveats/)找到了答案，在`loose mode`下的编译结果可能会不符合预期，请看下面的例子，可以去[babel playground](https://babeljs.io/repl)试一下结果：

```js
// Input code
const charArr = [...'hello'];

/**
 * output code in loose mode(Produces wrong result)
 *  Expected output: ["h", "e", "l", "l", "o"]
 *  Actual output: ["hello"]
 */
var charArr = [].concat('hello');
```

那么到底该不该采用`loose mode`，参考链接里给出了一个总结：

- 如果是业务开发，不推荐采用`loose mode`，除非一直关注编译后的代码，并且有完善的错误监控体系以及良好的测试覆盖
- 如果是库类开发，可以采用`loose mode`，因为源码掌控在自己手中

- `modules`, 默认`auto`，可选值有`amd` | `umd` | `systemjs` | `commonjs` | `cjs` | `auto` | `false`

  默认情况下（`auto`），`@babel/preset-env`会根据[caller](https://babeljs.io/docs/en/options#caller)的数据来判断`ES Module`和其特性（例如：`import()`）是否被转换。`caller`的数据通常会在`babel-loader`、`@rollup/plugin-babel`等插件中具体说明，用户不必自己传递`caller`的数据，如果`caller`的数据表名当前进程支持`ES Module`，那么`auto`就相当于`false`，否则`auto`就相当于`commonjs`（`cjs`只是`commonjs`的简称）

  这个配置的作用很好理解，官方的建议是大多数情况下采用默认的`auto`就可以了，但之前看到有的文章提到需要设置为`false`，不然`webpack`的`tree shaking`会失效（会被转换成`commonjs`，不支持`tree shaking`）

  经过实际验证之后发现最新的版本并没有这个问题，所以按官方的建议采用默认配置即可

- `debug`，开启后会在控制台打印`@babel/preset-env`采用的`plugins`、`polyfills`、`targets`、`modules`等信息

  ```bash
  @babel/preset-env: `DEBUG` option

  Using targets:
  {
    "chrome": "88",
    "edge": "89",
    "firefox": "86",
    "ios": "14",
    "safari": "14",
    "samsung": "13"
  }

  Using modules transform: auto

  Using plugins:
    proposal-class-properties { firefox, ios, safari, samsung }
    proposal-private-methods { firefox, ios, safari, samsung }
    syntax-numeric-separator
    proposal-logical-assignment-operators { samsung }
    syntax-nullish-coalescing-operator
    proposal-optional-chaining { chrome, edge, samsung }
    syntax-json-strings
    syntax-optional-catch-binding
    syntax-async-generators
    syntax-object-rest-spread
    proposal-export-namespace-from { ios, safari }
    syntax-dynamic-import
    syntax-top-level-await

  Using polyfills: No polyfills were added, since the `useBuiltIns` option was not set.
  ```

- `include`，默认为`[]`，表示无论如何都要采用的`plugin`
- `exclude`，默认为`[]`，表示无论如何都不采用的`plugin`

  前面提到，`presets`其实是一系列`plugin`的合集，根据不同的配置采用不用的`plugin`，`include`和`exclude`都是用来控制`plugin`的，我目前没用到

- `useBuiltIns`，默认`false`，可选值有`usage` | `entry` | `false`

  这是个很**重要的配置**，它决定了`@babel/preset-env`是如何处理`polyfills`。`polyfills`一般翻译为垫片，`babel`默认只转换语法（箭头函数，解构等），不转换 API（Array.includes, Promise 等），`polyfills`的作用就是帮我们处理这些 API 的

  - `false`表示`babel`不会自动添加`polyfills`，通常我们需要手动在入口文件添加

    ```js
    import 'core-js/stable';
    import 'regenerator-runtime/runtime';
    ```

    不推荐这么用，因为会引入所有`polyfills`，包体积会变大

  - `entry`，我理解为在入口处理`polyfills`，通常我们也需要在入口文件添加`core-js`等，不过`babel`会根据配置的`targets`帮我们替换成特定的`core-js`包

    ```js
    /**
     * @babel/polyfill 已经被废弃了，官方建议直接引入下面两个库
     */
    import 'core-js/stable';
    import 'regenerator-runtime/runtime'; // generator函数 和 Async/Await函数
    ```

    需要注意的是，`entry`是根据`targets`配置来判断我们需要的`polyfills`的，不管实际代码有没有用到，而当我们很确定自己的代码只用到了某些特定的方法时，在使用`core-js@3`的时候可以只引入特定的入口，例如：

    ```js
    import 'core-js/es/array';
    import 'regenerator-runtime/runtime';
    ```

    总结一下，`entry`配置是最稳的，缺点就是污染全局变量、包体积可能比预期的要大

  - `usage`，不需要在入口引入`core-js`，根据`targets`配置，只引入用到且环境不支持的`polyfills`

    看起来很美好，但是`usage`也存在两个“问题”，问题之所以打引号是因为这两个问题在某些情况下也可以接受

    - 会污染全局变量，这个对业务开发者或许可以接受，但对库的开发者就不能被接受了，因为库的使用者会抓狂
    - `babel`一般配置为不去处理`node_modules`中的代码，不能保证运行不会出错

- `corejs`，默认`2.0`，可以指定`core-js`版本，以及是否开启`proposals`(处于提案阶段，还没正式确定，未来可能变化的特性)

  只有当`useBuiltIns`设置为`entry`或者`usage`时，`corejs`配置才会生效，设置版本号的时候，尽量指定小版本，例如`3.8`，这样可以更精确

  开启`proposals`的方法:

  - `useBuiltIns`设置为`entry`时，可以直接`import "core-js/proposals/string-replace-all"`
  - `useBuiltIns`设置为`usage`时，可以用`shippedProposals`配置开启，也可以用`corejs: { version: 3.8, proposals: true }`开启，这两种方法支持的`proposals`不是完全一样的，具体需要看官方文档

  关于`corejs`使用`2.x`还是`3.x`，建议使用`3.x`, 因为`2.x`已经不再维护来，最新的特性都会在`3.x`中维护

- `forceAllTransforms`，默认`false`

  默认情况下，`@babel/preset-env`只会执行`targets`配置需要的编译，开启此配置后会强制执行所有编译，这在只支持`ES5`的环境（例如`uglifyjs`只能压缩`ES5`代码）中可以尝试开启，一般不会用到

- `configPath`， 默认`process.cwd()`，查找`browserslist`配置的目录
- `ignoreBrowserslistConfig`, 默认`false`，我没用过
- `browserslistEnv`，默认`undefined`，指定`browserslist`环境，`browserslist`可以给[不同环境不同的配置](https://github.com/browserslist/browserslist#configuring-for-different-environments)
- `shippedProposals`, 默认`false`，前面提到过开启`proposals`的方法

#### @babel/preset-react

这个就是`babel`处理`react`语法的一个插件合集

- `runtime`, 默认`classic`，在`babel v8`的版本，默认值会改成`automatic`, 可选值有`classic`和`automatic`

  `React`在`v17.0`版本推出了一种新的`jsx`语法转换方法(`automatic`)，同时旧的转换方法(`classic`)仍然支持，`babel`配合`React`做了这一改动。

  新的转换方法的优点是：

  - 写`jsx`的时候，不用再额外的`import React from 'react'`，所以使用`automatic`的时候需要关闭对应的`ESLint`规则
  - 输出的`bundle`大小可能有轻微的改善，需要视具体的配置情况而定
  - 将来会减少学习`React`需要掌握的概念

其他配置项略过，目前都没有实际用到

#### @babel/preset-typescript

`babel`解析`ts`语法的插件，需要注意的是，`babel`只解析语法，不做静态类型检查，所以仍需要`tsc`来检查静态类型，好在`VSCode`本身支持`ts`的静态类型检查

- `isTSX`，默认`false`，是否解析`jsx`

其他配置暂时略过

#### @babel/preset-flow

`flow`是一个`js`的一个静态类型检查器，没有使用过

### plugins

`plugins`的写法和`presets`是一样的，需要注意的是他们之间的执行顺序

- `plugins`先执行，`presets`后执行
- `plugins`的执行是按数组顺序执行的
- `presets`的执行是按数组**倒序**执行的

#### @babel/cli 和 @babel/register

`@babel/cli`是在命令行中执行`babel`的方法

`@babel/register`利用`require`钩子函数来在`require`的时候运行`babel`，钩子函数绑定在`node`的原生`require`函数上，这样就让`nodejs`有`babel`的能力，比如编译`jsx`代码

#### @babel/plugin-transform-runtime

前面提到的`@babel/preset-env`可以转换语法，并且提供引入`polyfills`的方法。打开`@babel/preset-env`转换语法的结果，会发现有很多`_createClass`,`_defineProperty`这样的函数，称之为`helper`函数，默认情况下，这样的函数在每一个用到的文件都会存在，所以会造成包的体积变大

`@babel/plugin-transform-runtime`的作用就是把`_createClass`等函数转换成`@babel/runtime`（或`@babel/runtime-corejs2`,``@babel/runtime-corejs3`，取决于下面`corejs`的配置）里的函数，统一起来以减少重复代码，减小打包体积

`@babel/plugin-transform-runtime`的另一个作用是提供不污染全局变量的`polyfills`，这对库的开发者比较友好

- `corejs`, 默认`false`，可选值`2`, `3`, `false`，或者 `{ version: 2 | 3, proposals: boolean }`

  `corejs`表示`@babel/plugin-transform-runtime`如何处理`polyfills`，`false`表示不处理`polyfills`，只处理`helpers`，`2`或者`3`表示引入对应版本的`core-js`，配置不同，安装的`@babel/runtime`版本也不同

  | corejs option | Install command                           |
  | ------------- | ----------------------------------------- |
  | false         | npm install --save @babel/runtime         |
  | 2             | npm install --save @babel/runtime-corejs2 |
  | 3             | npm install --save @babel/runtime-corejs3 |

#### @babel/runtime

见上方`@babel/plugin-transform-runtime`，需配合使用，且应该装在`dependencies`里面

#### 其他 plugins

[@babel/plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties)

转换`class`的属性，已经包含在`@babel/preset-env`里面了

[@babel/plugin-syntax-dynamic-import](https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import)

这个插件的作用

`@babel/preset-env`不知道有没有使用动态导入语法`import()`，`import()`需要有`Promise`的支持

### extends

继承其他配置

### overrides

重写其他配置，比如针对特定的文件采用特定的配置

### babel-loader

`babel-loader`是`webpack`的`babel`处理器，它除了`babel`本身的配置项之外，还支持以下配置项：

- `cacheDirectory`，是否缓存`babel`编译的结果，默认`false`，我个人会设置为`true`，因为会加快`babel`处理速度，遇到缓存问题再用`rm -rf node_modules/.cache/babel-loader`删除缓存

以下三个配置目前还没接触过

- `cacheIdentifier`
- `cacheCompression`
- `customize`

## 小结一下

`babel`的作用是转换高级语法以及提供引入`polyfills`的方法，引入`polyfills`的方法有下面几种：

- `@babel/preset-env`的`useBuiltIns`设置为`entry`，同时配置`corejs`
  - 优点：会根据`targets`配置，引入**全部**所需的`polyfills`，不会有遗漏，上线比较稳定
  - 缺点：
    - 污染全局变量
    - 会引入不必要的`polyfills`

具体配置如下：

```js
// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: { version: '3.12', proposals: true },
      },
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
      },
    ],
  ],
};

// 同时在入口处
import 'core-js/stable';
import 'regenerator-runtime/runtime'; // 如果有用到generator函数或者Async/Await
```

- `@babel/preset-env`的`useBuiltIns`设置为`usage`，同时配置`corejs`
  - 优点：会根据`targets`配置，只引入自己使用的`polyfills`
  - 缺点：
    - 污染全局变量
    - 如果不处理`node_modules`，无法保证第三方库不会引入不支持的代码，上线不稳定

这种情况，我会让`babel-loader`处理`node_modules`并且开启`babel-loader`的缓存，具体配置如下：

```js
// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: { version: '3.12', proposals: true },
      },
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
      },
    ],
  ],
};

// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /.js/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
    ],
  },
};
```

- `@babel/plugin-transform-runtime`的`corejs`设置为`3`，同时配置`corejs`
  - 优点：不会污染全局变量，适用于库的开发
  - 缺点：不能根据`targets`配置来判断需要引入哪些`polyfills`，只要使用了就会引用，不管环境是否已经支持，所以包体积会变大

具体配置如下：

```js
// babel.config.js
module.exports = {
  presets: [['@babel/preset-env']],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: { version: 3, proposals: true },
      },
    ],
  ],
};
```

如果是业务开发，参考链接中都是建议用第一种方式引入，因为比较稳定，并且不用处理`node_modules`，在编译速度上也可以接受；如果追求极致的想去减少包体积，我觉得可以使用第二种

如果是库开发，目前只能使用第三种方式

理想情况是，即不污染全局变量，又能根据环境和使用情况来按需引入`polyfills`，目前无法实现

## babel 插件开发

`@TODO` `babel plugin`开发

## 参考链接

[解剖 Babel —— 向前端架构师迈出一小步](https://mp.weixin.qq.com/s/C1hxBYVbHHHWfofDvekt8Q)

[99% 开发者没弄明白的 babel 知识](https://mp.weixin.qq.com/s/B8XRsMg2uJrQTD5IFWOdlw)

[babel6-loose-mode](https://2ality.com/2015/12/babel6-loose-mode.html)

[babel-plugins-loose-mode-caveats](https://meetguns.com/blog/babel-plugins-loose-mode-caveats/)

[Babel —— 把 ES6 送上天的通天塔](https://mp.weixin.qq.com/s/plJewhUd0xDXh3Ce4CGpHg)

[babel issue 9853](https://github.com/babel/babel/issues/9853#issuecomment-619587386)
