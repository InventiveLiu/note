---
title: 配置解析
order: 1
group:
  title: typescript
  path: /ts
  order: 4
---

# tsconfig

`ts`配置文件，一般为`tsconfig.json`，配置项非常多，总数超过了 100，大致可以分为以下几类：

## top level 最外层的配置项

- [references](https://www.typescriptlang.org/docs/handbook/project-references.html)

  这是`3.0`新赠的特性，项目引用，将大型项目拆分成多个小模块，用多个`tsconfig.json`来配置，可以减少项目编译的时间，具体需要看上面的官方文档

- `files`，默认`false`

  指定哪些文件被包含在内，如果找不到指定的文件则会报错，通常在项目小，文件不多的时候使用，大项目推荐使用`include`

- `extends`，默认`false`

  指定继承哪些文件的配置

- include，如果设置了`files`，则默认值为`[]`，否则默认值为`[**/*]`

  指定了包含哪些文件或目录，相对于`tsconfig.json`所在的目录

- `exclude`，默认为`["node_modules", "bower_components", "jspm_packages"]`，如果设置了`outDir`，那`outDir`也会被加上

  指定哪些文件或目录应该被排除，需要注意的是，`exclude`是相对`include`设置的，即在`include`设置的范围内去排除，并不能保证`exclude`的文件不会出现在代码里

`include`和`exclude`都支持的通配符

- `*`，匹配 0 或多个，以目录作为分割，即只匹配某一个目录的
- `?`，匹配某一个，同样以目录作为分割
- `**/`，匹配某个层级下的所有目录

## compilerOptions 对 ts 编译器的配置

`ts`的主要配置集中在这儿，所以这里也继续细分一下配置项

### 项目配置

- `allowJs`，默认`false`

  是否允许`import`一个`.js`文件，如果是`js`和`ts`混用的项目，一般设置为`true`

- `checkJs`，默认`false`

  是否检查`.js`文件的类型，作用跟在`.js`文件顶部使用`// @ts-check`一样，都可以开启对`.js`文件的类型检查

- `composite`，默认`false`

  这个是配合`references`使用的，被`references`提及的项目，`composite`必须设置为`true`，可以让构建工具（包括`tsc --build`本身）快速判断该项目是否已经编译过了

  当设置为`true`时，`rootDir`默认为`tsconfig.json`的目录，`declaration`默认为`true`

- `declaration`，默认`false`，`composite`为`true`时默认为`true`

  是否生成`.d.ts`声明文件，声明文件的作用是提供智能提示以及类型推断

- `declarationMap`，默认`false`

  是否为`.d.ts`声明文件生成`sourceMap`文件，当使用`project references`时建议设置为`true`

- `downlevelIteration`，默认`false`

  这个控制的是`tsc`把`ts`转换成`js`时是如何处理迭代器（`iteration`）的

  `ES6`新赠了很多新的迭代方法，比如`for of`循环(`for ( el of arr)`)，数组展开（`[a, ...b]`），函数参数展开（`fn(...args)`），以及`Symbol.iterator`

  当设置为`true`时，`tsc`会检查`target`是否支持`Symbol.iterator`，如果不支持则提供`polyfill`，以便提供更符合`ES6`规范的代码

  这个有点类似`Babel`里的`useBuiltIns`的味道，`ts`的官网给了很多[downlevelIteration](https://www.typescriptlang.org/tsconfig#downlevelling)的例子，在某些情况下，不使用`downlevelIteration`的话， 编译后的代码执行结果可能不符合预期

* `importHelpers`，默认`false`

  是否从`tslib`里引入`helper`函数，类似`Babel`中的`@babel/plugin-transform-runtime`，`tslib`则对应`@babel/runtime`

* `incremental`，默认`false`，`composite`设置为`true`时默认`true`

  告诉`ts`以递增的方式更新编译结果，开启后上一次的编译结果会保存在`.tsbuildinfo`文件夹

* `isolatedModules`，默认`false`

  `Babel`等工具也能够把`ts`转换成`js`，但不能做类型检查，也不能正确转换`const enum`s 等`ts`特性，开启这个配置后，在使用`const enum`s 的时候，`tsc`会给出警告

  建议在使用`Babel`转换`ts`代码的时候开启

* `jsx`，默认`undefined`，可选值有`react`，`react-jsx`，`react-jsxdev`，`react-native`，`preserve`

  - `react`，把`jsx`元素转换成`React.createElement`
  - `react-jsx`，把`jsx`元素转换成`_jsx`，即`react/jsx-runtime`中的`jsx`
  - ``react-jsxdev`，把`jsx`元素转换成`\_jsx`，即`react/jsx-dev-runtime`中的`jsx`
  - `react-native`，不转换`jsx`
  - `preserve`，不转换`jsx`

  注意`react-jsx`和`react-jsxdev`是`React 17`新推出的`jsx`语法转换方法，不再依赖`React`

  在`Babel`中也提到了类似的转换方法，即`@babel/preset-react`有个配置`runtime`，也可以使用新的`jsx`转换语法

* `lib`

  设置需要引入的包，`ts`包含了一组内建的`js`API 的类型，比如`Math`，也包含了浏览器环境的对象类型，比如`document`，当`target`设置为`ES6`或更高时，也会包含新特性的类型，比如`Map`

  一般设置为`['ES6', 'DOM']`即可

* `module`，如果`target`设置为`ES3`或`ES5`，则默认是`CommonJS`

  可选值有`CommonJS`，`ES2015`，`ES2020`，`None`，`UMD`，`AMD`，`System`，`ESNext`

  `ES2015`和`ES2020`有什么区别呢？`ES2020`中添加了`import.meta`和 dynamic `import`s 支持

* `noEmit`，默认`false`

  开启后不会生成`js`文件，`sourceMap`文件，`.d.ts`声明文件

  当使用`Babel`等工具来转换`ts`时，可以开启

* `outDir`

  设置之后，生成的`js`，`sourceMap`，`.d.ts`等文件都会在此文件夹，且保持原来的目录结构

  如果不设置，生成的文件都会在原`ts`文件所在的目录

* `outFile`，

  输出合并至同一个文件，仅在`module`为`System`，`AMD`，或者`None`时可用

* `plugins`

  为编辑器提供的插件列表

* `removeComments`，默认`false`

  是否删除注释

* `rootDir`

  默认是不包含声明文件的最长路径，具体理解可以看下面的例子

  ```bash
  MyProj
  ├── tsconfig.json
  ├── core
  │   ├── a.ts
  │   ├── b.ts
  │   ├── sub
  │   │   ├── c.ts
  ├── types.d.ts
  ```

  上面目录结构中，`rootDir`推导出来的结果是`core/`，假设`outDir`设置为`dist`，则输出结构为

  ```
  MyProj
  ├── dist
  │   ├── a.js
  │   ├── b.js
  │   ├── sub
  │   │   ├── c.js
  ```

  可以看到输出结果中不包含`core`目录，要想输出结果包含`core`目录，则可以设置`rootDir`为`.`

* `sourceMap`，默认`false`

  是否生成`sourceMap`文件

* `target`，默认`ES3`

  指定转换后的`js`版本，现代浏览器支持所有`ES6`特性，所以`ES6`是一个好的选择

* `tsBuildInfoFile`， 默认`.tsbuildinfo`

  指定编译缓存的目录，见`incremental`

### 严格检查

- `strict`, 默认`false`

  `strict`可以理解为一些列严格检查的集合，当`strict`为`true`时，相关的配置默认值也会为`true`

- `alwaysStrict`

  使用`js`严格模式，每个生成的`js`文件都会有`use strict`声明

- `noImplicitAny`

  不允许含蓄的`any`类型

- `noImplicitThis`

  不允许含蓄的`this`指向

- `strictBindCallApply`

  检查`call`和`apply`的参数类型

- `strictFunctionTypes`

  更严格地检查函数的参数类型

- `strictNullChecks`

  严格的`null`和`undefined`检查

- `strictPropertyInitialization`

  严格的属性初始化

### 模块解析

由于`ESM`以及`Commonjs`，`AMD`等模块规范之间的一些差异，从而可能引发一些问题

- `esModuleInterop`，默认`false`，推荐`true`

  默认情况下，`ts`对待`CommonJS`/`AMD`/`UMD`模块跟`ESM`模块类似，这样做有两个假设被证明是有一定缺陷的：

  - 命名`import`，`import * as moment from 'moment'`，跟`const moment = require('moment')`表现一样
  - 默认`import`，`import moment from 'moment'`，跟`const moment = require('moment').default`表现一样

  上面两个转换会有 2 个问题：

  - `ES6`规范定义命名`import`的结果只能是`object`对象，但是`ts`把它当作`const x = require('xx')`时，它可以是一个函数并且能够被调用，这打破了`ES6`的规范
  - 在精确转换到`ES6`规范时，大多数`CommonJS`/`AMD`/`UMD`库没有严格遵循`ts`的实践

  开启`esModuleInterop`能够解决上述两个问题

- `allowSyntheticDefaultImports`

  当`module`为`System`时，或者开启`esModuleInterop`时，默认为`true`

  一般在`ts`中引入`react`推荐这样写：

  ```js
  import * as React from 'react';
  ```

  开启`esModuleInterop`和`allowSyntheticDefaultImports`后，也允许按以前的习惯写：

  ```js
  import React from 'react';
  ```

  这个选项不会改变`tsc`编译出来的结果，只会影响类型检查，而`Babel`在没有`default`导出时会自动创建一个

- `allowUmdGlobalAccess`，默认`false`

  开启时，允许以全局变量的方式访问`UMD`导出的结果

- `moduleResolution`，`module`为`CommonJS`时，默认为`node`，`module`为其他（`AMD`，`System`，`UMD`，`es2015`，`esnext`等）

  参考[官方文档](https://www.typescriptlang.org/docs/handbook/module-resolution.html)

- `baseUrl`

  解析非绝对路径的模块时用到的路径，可以不用再写`../../`这种路径

- `paths`

  路径映射，路径相对于`baseUrl`的

- `preserveSymlinks`，默认`false`

  不解析`symlinks`，设置了`preserveSymlinks`为`true`，相当于设置了`webpack`的`resolve.symlinks`为`false`，反之亦然

- `rootDirs`

  接收一个数组，可以把数组内的路径当作同一个路径

- `typeRoots`

  默认情况下，所有可见的`@types`目录包在编译时都可使用，`node_modules/@types`目录被视为可见的，包括`./node_modules/@types`，`../node_modules/@types`等

  如果设置了`typeRoots`，则只有`typeRoots`下的目录在编译时会被使用

- `types`

  与`typeRoots`类似，`typeRoots`是指定目录的，`types`是指定具体包名的

### sourceMap 相关

前面提到了`sourceMap`可以控制是否生成`sourceMap`文件，下面的控制更为精细

- `inlineSourceMap`， 默认`false`

  开启`sourceMap`会生成单独的`.js.map`文件，而开启`inlineSourceMap`则会把`sourceMap`文件的内容放到`js`文件结尾

  这么做会增加`js`文件大小，一般仅用于调试，与`sourceMap`互斥

- `inlineSources`，默认`false`

  是否包含原`.ts`文件的内容，仅当`sourceMap`或者`inlineSourceMap`开启时可用

- `mapRoot`

  指定调试时查找`sourceMap`文件的位置

- `sourceRoot`

  指定调试时查找`.ts`文件的位置

### Linter 检查

一些额外的`Linter`检查，也可以使用`eslint`代替，不展开

### 实验阶段的配置

不展开，主要是装饰器相关的，装饰器还是处于实验阶段的特性

### 其他配置

- `allowUnreachableCode`，默认`undefined`

  如何处理永远不能执行的代码，这个不知道为什么没归类到`Linter`里面

  - `undefined`，给`warning`
  - `true`，忽略，不给提示
  - `false`，给报错

- `allowUnusedLabels`，默认`undefined`

  如何处理未使用的`labels`

  - `undefined`，给`warning`
  - `true`，忽略，不给提示
  - `false`，给报错

  `label`在`js`里比较少见，我特意去查了一下，`label`一般与`break`或者`continue`一起使用，并且所有浏览器都支持（`ie 4`就开始支持了），但我确实没用过

  ```js
  let i, j;
  loop1: for (i = 0; i < 3; i++) {
    //The first for statement is labeled "loop1"
    loop2: for (j = 0; j < 3; j++) {
      //The second for statement is labeled "loop2"
      if (i === 1 && j === 1) {
        break loop1;
      }
      console.log('i = ' + i + ', j = ' + j);
    }
  }
  ```

- `assumeChangesOnlyAffectDirectDependencies`

  开启后，`ts`只会重新检查和编译有修改的文件和直接引用这些文件的文件

- `declarationDir`

  指定生成`.d.ts`声明文件的文件夹

- `disableReferencedProjectLoad`

  在多工程的项目里，前面提到可以使用`project reference`，`ts`默认会把所有工程都加载到内存中，项目太大的话这种方式造成内存消耗

  开启后，只有打开的文件才会加载到内存

- `disableSizeLimit`

  为了防止消耗过多的内存，`ts`有一个内存使用限制，开启后可以解除这个限制

- `disableSolutionSearching`
- `disableSourceOfProjectReferenceRedirect`

- `emitBOM`，默认为`false`

  除非你知道什么是`byte order mark`并且需要它才开启

- `emitDeclarationOnly`，默认`false`

  只生成`.d.ts`声明文件，有两种情况会需要它：

  - 使用`Babel`等非官方`tsc`转换`ts`文件
  - 作为库的开发，给库的使用者提供声明文件

- `explainFiles`

  打印编译过程中会使用的`.d.ts`文件并给出原因，可以用来调试

- `extendedDiagnostics`

  这个可用来发现`ts`编译的时间消耗在那哪里

- `forceConsistentCasingInFileNames`，默认`false`，推荐`true`

  文件名大小写敏感

- `generateCpuProfile`

  生成`v8 CPU`报告，可以发现为什么`ts`编译会慢

- `importsNotUsedAsValues`

  在`ts`中，`import`即可以导入值，也可以导入类型，转换成`js`之后，导入值应该被保留，而导入类型应该被删除，这个配置控制的是如何处理导入的类型

  - `remove`，默认情况，会删除仅导入类型的`import`
  - `preserve`，保持所有导入的未使用的值或类型
  - `error`，保持所有导入的未使用的值或类型，但是当值导入仅被当作类型使用时会报错

  `ts`中可以使用`import type`来单独导入类型

- `jsxFactory`，默认`React.createElement`

  转换`jsx`语法时使用的函数

- `jsxFragmentFactory`

  转换`jsx`语法时，如何处理`<></>`

- `jsxImportSource`

  转换`jsx`语法是，从哪里`import`函数

- `listEmittedFiles`

  打印`ts`生成的文件列表

- `listFiles`

  打印`ts`编译过程中使用的文件

- `maxNodeModuleJsDepth`，默认`0`

  `node_modules`最大层级，仅当`allowJs`开启时才能使用

- `noEmitHelpers`，默认`false`

  不引入`helper`函数，此时应该自己引入全局`polyfill`

- `noEmitOnError`，默认`false`

  如果遇到报错，则不生成任何文件

- `noLib`，默认`false`

  不包含任何`lib`

- `noResolve`，默认`false`
- `noStrictGenericChecks`，默认`false`
- `preserveConstEnums`，默认`false`

  保留`const enums`的声明

- `resolveJsonModule`

  解析`.json`文件

- `skipLibCheck`，默认`false`，推荐`true`

  开启后，当有两个以不同方式定义的的同一个类型时，`ts`会使用代码指向的那一个

  为什么会有两份类型定义呢？我想到的可能的情况就是库在`node_modules/@types`里有一份定义，库本身又提供了一份定义

- `stripInternal`

  对`JSDoc`的`@internal`注释不生成声明

- `suppressExcessPropertyErrors`，默认`false`

  开启后对超出 object 属性不会报错，不推荐开启，可以使用`// @ts-ignore`达到相同的目的

- `suppressImplicitAnyIndexErrors`，默认`false`

  同样不建议开启，而是使用`// @ts-ignore`

- `traceResolution`，默认`false`

  想知道一个模块为什么没有被编译时可以开启

- `useDefineForClassFields`，默认`false`

  这个配置是为了适配即将到来的`class-fields`提案

  `ts`早在`class`属性被正式采用之前就在使用`class`属性了，但是`class`属性提案跟`ts`的实现有一点区别

  具体可参考[从 TS 的 useDefineForClassFields 选项到 class-fields 提案](https://zhuanlan.zhihu.com/p/258906525)

### 命令行特有参数

- `preserveWatchOutput`，默认`false`

  是否保留上次`watch mode`编译的输出

- `pretty`，默认`true`

## watchOptions 对 watch mode 的配置

`watch mode`模式下的配置，暂时没用到，不展开

## typeAcquisition 对 js 文件如何增加类型 的配置

针对`js`项目设置，不展开

## 我应该怎么配置？

我在很多地方都提到会使用`Babel`来编译`ts`，那么这样的话`tsconfig.json`的配置应该是

```json
{
  "compilerOptions": {
    "declarationDir": "./types",
    "declaration": true,
    "emitDeclarationOnly": true
  }
}
```
