---
title: ESLint
order: 3
group:
  title: 工程化工具
  order: 7
---

# ESLint

`ESLint`是一个`javascript`代码检查工具，可以帮我们统一代码风格，减少代码 BUG

## 配置

建议使用单独的文件进行配置，我习惯用`.eslintrc.js`文件

### extends

继承其他配置，可以继承`ESLint`自身，例如`eslint:recommended`， 也可以继承第三方库，例如用得比较多得`airbnb`，也可以继承`plugins`，例如`plugin:react/recommended`，也可以继承一个文件，例如`path/to/config.js`

```js
module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb',
    'plugin:react/recommended',
    'path/to/config.js',
  ],
};
```

`extends`数组中的规则是有顺序的，如果有相同的规则冲突的话，会以最后一个为准，有时候会出现不同的规则产生冲突，比如`prettier`的代码风格与其他代码风格，如果开启了`VSCode`自动修复的话，会发现不管怎么保存都会报错，这时候就需要禁用某一个规则采用另外一个

### plugins

插件，可理解为一系列`rules`的集合，常用的`plugin`有`react`、`react-hooks`等

```js
module.exports = {
  plugins: [
    'react', // eslint-config-react
    'react-hooks', // eslint-config-react-hooks
  ],
};
```

### parser

解析器，`ESLint`默认的解析器是[Espree](https://github.com/eslint/espree)，官方还列举了[Esprima](https://www.npmjs.com/package/esprima)，[@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser)，[@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser)

`Espree`和`Esprima`这两个我不了解，下面介绍一下`@babel/eslint-parser`和`@typescript-eslint/parser`

#### @babel/eslint-parser

`babel-eslint`这个包已经被废弃了，取而代之的是`@babel/eslint-parser`，它的作用就是让`ESLint`在`Babel`转换源码后运行，因为`ESLint`默认的解析器及核心规则只支持最新的已确认的规范，不支持实验规范以及非标准规范（`flow`，`TypeScript`等），所以当我们使用了`ESLint`默认不支持的语法并且使用了`Babel`时，可以使用此解析器

`@babel/eslint-parser`可以让`ESLint`支持较新的语法，但是不能改变`ESLint`本身自带的规则去校验新语法，所以需要配合`@babel/eslint-plugin`来使用

`@babel/eslint-plugin`只有几个规则，分别对应`ESLint`自身的规则，配置方法也一样

- `@babel/new-cap`，处理的是装饰器语法(`@Decorator`)
- `@babel/no-invalid-this`，处理的是`class`属性和私有方法
- `@babel/no-unused-expressions`，处理的是`do`表达式
- `@babel/object-curly-spacing`，处理的是`export * as x from "mod"`这种写法，可以被`--fix`自动修复
- `@babel/semi`，处理的`class`属性，可以被`--fix`自动修复

#### @typescript-eslint/parser

`@babel/eslint-parser`配合`@babel/preset-typescript`可以解析`typescript`，但是不能做静态类型检查

静态类型检查还是需要`typescript`来做，除了这个区别之外，`@babel/eslint-parser`支持额外的（相对`TypeScript Compile`来说）语法，而`@typescript-eslint/parser`只支持`TypeScript Compile`支持的语法，具体有什么区别，可以看[这里](https://blog.logrocket.com/choosing-between-babel-and-typescript-4ed1ad563e41/)，不过一般常用的特性（箭头函数，Promise，Async/Await 等）两者都是支持的

那么问题来了，当使用`typescript`的时候，是用`Babel`还是`TypeScript Compile`编译呢？

我看了一些文章（见参考链接），有的建议用`Babel`编译，用`tsc --noEmit`或者编辑器（例如`VSCode`）做静态类型检查，原因如下：

- `babel`可以编译几乎全部的`ts`语法，有几个不支持的情况(例如参考链接中列举的`const enums`)也可以绕过去
- `babel`生成代码会根据`targets`的配置来按需转换语法和引入`polyfill`，能生成更小的目标代码。而`ts`还是粗粒度的指定`es5`、`es3`的 `target`，不能按需转换，引入`polyfill`也是在入口全部引入，生成的代码体积会更大。
- `babel`编译`ts`代码不会进行类型检查，速度会更快，想做类型检查的时候可以单独执行`tsc --noEmit`

我赞同这种观点，再加上我没有太多的`ts`使用经验，所以我会选择`Babel`

`@typescript-eslint/parser`也需要与`@typescript-eslint/eslint-plugin`配合使用

### globals

定义全局变量，比如`webpack.DefinePlugin`可以定义`webpack`编译时的全局变量，某些全局变量在使用时`ESLint`会报错，在`globals`里定义之后，可以避免报错

```js
module.exports = {
  globals: {
    __DEV__: 'readonly',
    SOMETHING: 'writable',
  },
};
```

由于历史原因，`false`，`readable`等价于`readonly`；`true`，`writeable`等价于`writable`

### env

定义使用环境，这样就不会报环境的全局变量未定义，常用的环境如下：

- browser
- node
- amd, 这样`require`和`define`就不会报错
- jest，这样`describe`、`test`、`expect`等关键词不会报错

### rules

`ESLint`规则，上述`extends`和`plugins`包含了很多规则，有些并不适用于自己，所以这里`rules`可以修改规则的提醒方式，一般有三个值可配置

- `off`, 关闭规则
- `warn`, 以警告的方式提醒
- `error`, 以错误的方式提醒，`ESLint`检验会不通过

除了上述三个配置外，某些规则还会有自己的配置，`VS Code`会给出文档链接，遇到了直接看文档就行

### overrides

重写配置，一般针对特定等文件名、后缀、目录等进行特殊的配置

### root

当有多个目录和`ESLint`配置文件时，`root`为`true`不会继续往上查找配置

## 注释的作用

利用注释也可以对`ESLint`做一些配置，主要用的就是关闭检验规则，以及开启检验规则

- 禁用全部规则

  ```js
  /* eslint-disable */

  // 不校验这里的代码

  /* eslint-enable */

  // 校验这里的代码
  ```

- 禁用指定的规则

  ```js
  /* eslint-disable no-alert, no-console  */

  alert('eslint');
  console.log('eslint');

  /* eslint-enable no-alert  */
  ```

- 禁用某行

  ```js
  alert('eslint'); // eslint-disable-line

  alert('eslint'); /* eslint-disable-line */

  // eslint-disable-next-line
  alert('eslint');

  /* eslint-disable-next-line */
  alert('eslint');
  ```

- 禁用某行的指定规则，一般用得少

  ```js
  alert('eslint'); // eslint-disable-line no-alert

  alert('eslint'); /* eslint-disable-line no-alert */

  // eslint-disable-next-line no-alert
  alert('eslint');

  /* eslint-disable-next-line no-alert */
  alert('eslint');
  ```

- 配置某个规则

  ```js
  /* eslint no-alert: "off", no-console: "off" */

  /* eslint no-alert: "off", no-console: "off" -- 说明注释原因 */

  /* eslint no-alert: "off", no-console: "off" 
    --
    说明注释原因 */

  /* eslint no-alert: "off", no-console: "off"
   * -- 说明注释原因，这种不会生效
   */
  ```

## VSCode 插件

`VSCode`插件提供编码时的`ESLint`实时校验和保存自动`fix`，不需要运行`eslint --fix`命令

我建议是在保存是自动修复，因为这样我们可以看到做了哪些更改，以及会去思考为什么要这么改，对编码习惯有帮助

如果不在乎编码习惯或者电脑太慢了，一般是通过`git hooks`在提交代码之前做检查和修复

## webpack 插件

`eslint-loader`已经被废弃了，取而代之的是`EslintWebpackPlugin`，相比于`eslint-loader`，`EslintWebpackPlugin`有 4 个优点：

- 配置简单
- 生成一份单独的输出报告
- 直接使用`eslint`的缓存
- 只对有修改的文件重新`lint`

原`eslint-loader`使用方式：

```js
// eslint-loader
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          // eslint options (if necessary)
        },
      },
    ],
  },
  // ...
};
```

修改为：

```js
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  // ...
  plugins: [new ESLintPlugin(options)],
  // ...
};
```

注意`options`的配置与上面提到的`.eslintrc.js`里的配置是不一样的，这里的`options`并不是配置规则的，而是传递给`ESLint nodejs api`的配置，我觉得常用的配置可能就是,`extensions`, `fix`和`cache`

- `extensions`，默认`js`，视情况也可以是`['js', 'jsx', 'ts', 'tsx']`等
- `fix`，是否自动修复，默认`false`, 我建议`false`，自动修复交给编辑器(`VSCode`)来完成
- `cache`，是否启用缓存，默认`false`，我建议`true`，可以大大缩减时间，但也会碰到一些缓存问题，把缓存手动删除即可
- `cacheLocation`，缓存位置，默认是`.eslintcache`文件（根目录）
- `cacheStrategy`，缓存策略，可选`metadata` | `content`，默认是`metadata`，建议`metadata`； `metadata`可以理解为文件的名称、大小、修改时间等信息，`content`即文件的内容

所以一般配置如下：

```js
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      cache: true,
    }),
  ],
  // ...
};
```

## 跟 prettier 配合使用

见[prettier](/tools/prettier)章节

## 参考链接

[TypeScript and Babel 7](https://devblogs.microsoft.com/typescript/typescript-and-babel-7/)

[Choosing between Babel and TypeScript Compile](https://blog.logrocket.com/choosing-between-babel-and-typescript-4ed1ad563e41/)

[《前端领域的转译打包工具链》上篇](https://zhuanlan.zhihu.com/p/368948648)
