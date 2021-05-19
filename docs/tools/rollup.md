---
title: rollup
order: 7
group:
  title: 工程化工具
  order: 7
---

# rollup

`rollup`是`js`的模块化打包器，对输出`ES Module`支持更友好，`webpack`目前(`v5.37.0`)输出`ES Module`还处于实验阶段

前端打包构建工具层出不穷，耳熟的有`webpack`，`parcel`，`rollup`，`snowpack`，`vite`，经常使用的也就只有`webpack`了

但在尝试开发组件库的时候，如果需要组件库能够利用`tree-shaking`实现按需加载，就必须输出`ES Module`规范的文件，加上很多文章也建议用`webpack`做业务开发，用`rollup`做库类开发，所以我才决定学习一下`rollup`

## 配置

与`webpack`类似，`rollup`也需要一个配置文件，通常为根目录下面的`rollup.config.js`

与`webpack`不同的是，`rollup.config.js`默认是`ES Module`规范，默认处理的也是`ES Module`规范的代码，通过`@rollup/plugin-commonjs`可以让`rollup`使用`commonjs`规范的库

### 配置项

`rollup`的配置列表如下

```js
// rollup.config.js

export default {
  // 可以是对象，也可以是多个对象的数组
  // core input options 核心输入配置

  /**
   * 外部的，即：用到但是不打包的代码，由外部引入，类似 webpack 中的 externals
   */
  external,

  /**
   * 入口文件，字符串，数组，或者对象
   */

  input,

  plugins, // 插件

  // advanced input options 高级输入配置

  /**
   * 缓存，false或者 RollupCache 对象，看文档似乎只能在 node api 里面使用
   */

  cache,

  /**
   * 处理 warning 的拦截器，function(warning, handle)
   */

  onwarn,

  /**
   * strict, allow-extension, exports-only, 或者 false
   * 我理解为是否严格的保持 export import 的关系
   * 文档说对库建议为strict，默认为strict
   */

  preserveEntrySignatures,

  /**
   * 默认false，遇到 deprecated（废弃）的特性时会警告
   * 为true时，遇到 deprecated（废弃）的特性时会报错
   */
  strictDeprecations,

  // danger zone 危险区域，意味着不知道配置的意义时不要随便修改

  /**
   * 传递给 Acorn parse 函数的options配置
   * Acorn 是一个js写的js解析器
   */
  acorn,

  /**
   * Acorn 使用的插件
   */
  acornInjectPlugins,

  /**
   * 默认的上下文，通常指this的值，默认为undefined
   */

  context,

  /**
   * 与context类似，每个模块的上下文，可以是id => string函数，也可以是{id: string}对象
   */

  moduleContext,

  /**
   * 默认false，表示处理`symbolic link`时使用链接后的地址
   * 为true时，表示用链接前的地址，即不处理`symbolic link`
   * symbolic link 我理解为类似快捷方式类似的东西
   */

  preserveSymlinks,

  /**
   * 默认false，表示import了一个没有export的值时会报错
   * 即: import { a } from 'b'，但是 b 里面没有 export a，这种情况会报错
   * 为true时，不会报错，a 会是 undefined
   */

  shimMissingExports,

  /**
   * 默认true，开启treeshake
   * false表示关闭treeshake，其他值
   */
  treeshake: {
    annotations,
    moduleSideEffects,
    propertyReadSideEffects,
    tryCatchDeoptimization,
    unknownGlobalSideEffects,
  },

  // experimental 实验性功能

  /**
   * 设置缓存被使用的次数，默认10，即：缓存被使用10次后不再使用
   */

  experimentalCacheExpiry,

  /**
   * 是否收集性能相关的时间指标，默认false
   */

  perf,

  output: {
    // 可以是对象，也可以是数组
    // core output options 核心输出配置

    /**
     * 输出文件的目录
     * 如果有多个输出文件，需要指定这个配置
     * 否则，可以使用file配置
     */

    dir,

    /**
     * 输出的文件，只有在输出一个文件的时候才能被使用
     */

    file,

    /**
     * 指定输出文件的规范，默认`es`
     * amd,
     * cjs, commonjs
     * es, esm, module
     * iife,
     * umd,
     * system, systemjs
     */

    format,

    /**
     * 全局变量，external指定了外部的模块，globals指定的是外部模块对应的变量，例如 jquery: '$'
     * 在输出 umd/iife 格式的时候可能用到
     */

    globals,

    /**
     * 输出 umd/iife 格式的时候，指定对外暴露的库的名称
     */

    name,

    /**
     * 输出文件时使用的插件
     */

    plugins,

    // advanced output options 高级输出配置

    /**
     * 输出静态资源文件（css,图片等）的格式，有以下占位符可用
     * [extname]，文件后缀，包含点，例如 '.css'
     * [ext]，文件后缀，不包含点，例如 'css'
     * [hash]，基于名称和内容的hash值
     * [name]，文件名，不包含后缀
     */
    assetFileNames,

    /**
     * 放在输出文件顶部的信息
     */
    banner,

    /**
     * 在code-splitting 代码分割时产生的公共模块的名称，可以用以下占位符
     * [format]，输出文件的规范，例如`es`
     * [hash]，基于内容和所有依赖的hash值
     * [name]，名称，可以通过manualChunks设置
     */
    chunkFileNames,

    /**
     * 默认false
     * 为true时，会压缩rollup产生的包裹在外层的代码，用户书写的代码不会改变
     */

    compact,

    /**
     * 入口文件的输出文件，有以下占位符可用
     * [format]，输出文件规范
     * [hash]，基于内容和所有依赖的hash值
     * [name]，入口文件名（不包含后缀）
     */

    entryFileNames,

    /**
     * 输出 umd/iife 格式的文件时，是否扩展name定义的全局对象，默认false
     * 为true时，会输出形如`global.name = global.name || {}`的样子
     * 为false时，会输出形如`global.name = {}`
     */

    extend,

    /**
     * 放在输出文件底部的信息，类似banner
     */

    footer,

    /**
     * 在输出多个chunk的时候，是否提升`import`顺序，默认true
     * 设置了preserveModules时，此选项会被忽略
     * 具体作用参考https://rollupjs.org/guide/en/#why-do-additional-imports-turn-up-in-my-entry-chunks-when-code-splitting
     */

    hoistTransitiveImports,

    /**
     * 是否将动态导入变成行内引入，默认false
     * 只有在单个输入的情况下才有效，并且会改变代码执行顺序，本来是动态导入的，结果会马上执行
     */

    inlineDynamicImports,

    /**
     * 表示rollup如何处理commonjs等没有default导出、命名空间（import * as xxx from 'xxx'）、动态导入等功能的代码
     * 当前版本(v2.48.0)默认true，下个大版本的默认值将会是auto
     * __esModule属性是rollup，babel等工具统一的一个标准，用来表示此模块是一个转换后的ES Module模块
     */

    interop,

    /**
     * 类似banner，区别是任何输出格式都会加上
     */
    intro,

    /**
     * 自定义公共模块的输出
     */

    manualChunks,

    /**
     * 输出es/system格式的代码时，或者compact设置为true时，默认为true
     * 其他情况默认为false
     * 为true时，rollup会把export的变量重命名为单个字母，以便更好的压缩代码
     */

    minifyInternalExports,

    /**
     * 类似footer，区别是任何输出格式都会加上
     */

    outro,

    /**
     * 外部模块的键值对，外部模块指的是不能识别或者external配置的外部模块
     */

    paths,

    /**
     * 默认false，表示会尽可能创建更少的chunk文件
     * true表示会按原来的模块名创建文件，通常用来转换格式，例如从es转换为cjs格式
     */

    preserveModules,

    /**
     * preserveModules为true时才有用，表示应该从入口文件剥离的目录，即：输出的文件不应该包含此路径
     */

    preserveModulesRoot,

    /**
     * 默认false
     * true，表示单独生成sourcemao文件
     * inline，表示data URI的形式跟在输出文件后面
     * hidden，跟true类似，区别是sourcemap相关的注释被suppressed（不知道该翻译成啥）
     */

    sourcemap,

    /**
     * 默认false
     * true，表示souremap不包含源码，会让sourcemap文件明显减小
     */

    sourcemapExcludeSources,

    /**
     * sourcemap文件
     */

    sourcemapFile,

    /**
     * soucemap生成的路径转换
     */

    sourcemapPathTransform,

    /**
     * 默认false
     * true，表示校验输出的代码是否是有效的js代码，通常用来调试插件的输出
     */

    validate,

    // danger zone 危险区域，不明白配置的意义就不要更改
    amd,
    esModule,
    exports,
    externalLiveBindings,
    freeze,
    indent,
    namespaceToStringTag,
    noConflict,
    preferConst,
    strict,
    systemNullSetters,
  },

  watch:
    {
      /**
       * 默认0，表示改动多久后触发重新运行rollup
       */

      buildDelay,
      /**
       * 传递给chokidar的配置
       * chokidar，一个file watch库
       */

      chokidar,
      /**
       * 重新运行是否清除控制台，默认true
       */

      clearScreen,
      /**
       * 是否跳过`bundle.write()`这一步，默认false
       */

      skipWrite,
      exclude,
      include,
    } | false,
};
```

### 处理 js/jsx/ts/tsx

在此之前先了解两个库，`@rollup/plugin-node-resolve`和`@rollup/plugin-commonjs`

`@rollup/plugin-node-resolve`的作用是帮`rollup`找到`node_modules`里的第三方库

`@rollup/plugin-commonjs`的作用是转换`commonjs`为`ES Module`，通常需要在其他插件之前使用，避免`commonjs`检测出现问题

一般情况下，上面两个插件都是需要的

`js/jsx/ts/tsx`的处理都可以交给`babel`，安装`@rollup/plugin-node-resolve`和`@rollup/plugin-babel`

```js
// rollup.config.js

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'es',
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      /**
       * 文档推荐设置babelHelpers的值，尽管有时候使用的是默认值
       * runtime，当开发库的时候建议设置为此值，需配合@babel/plugin-transform-runtime使用，详情见本站的babel文档
       *  当输出为cjs或者es规范时，需要把@babel/runtime设置为external,
       *  注意要使用正则(external: [/@babel\/runtime/])或者函数(external: id => id.includes('@babel/runtime')
       *  因为helpers是从下级目录导入的，且rollup判断是否external是根据string是否完全匹配的
       *
       * bundled，业务开发的时候建议设置为此值，也是默认值
       * external，如果你不知道这代表什么，就不要使用这个，需配合@babel/plugin-external-helpers使用
       * inline，不推荐使用，会造成代码重复
       *
       * 这个配置项跟@babel/plugin-transform-runtime的配置有什么关系？待验证
       */
      babelHelpers: 'runtime',
      /**
       * 默认值['.js', '.jsx', '.es6', '.es', '.mjs']
       * 如果要处理ts，必须加上.ts或.tsx
       */

      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
  ],
};
```

### 处理 css

`rollup`是`js`库类的打包利器，一般不会处理`css`，但是对于 UI 组件库来说，`css`是必不可少的，`rollup-plugin-postcss`能帮助实现处理`css`(包括`scss`,`less`,`stylus`)

```js
npm install postcss rollup-plugin-postcss
```

```js
// rollup.config.js
import postcss from 'rollup-plugin-postcss';

export default {
  // ...
  plugins: [
    postcss({
      extract: true, // 是否单独生成css文件
      modules: true, // 是否启用CSS Module，利用的是 postcss-modules库
      minimize: true, // 是否压缩css，利用的是cssnano库
    }),
  ],
};
```

### 处理图片

### 处理字体

###
