---
title: webpack
order: 1
group:
  title: 工程化工具
  order: 7
---

# webpack

`webpack`是一个模块化打包工具，当前阶段的`web`开发基本离不开`webpack`

虽然`webpack 5`已经更新很久了，但从`npm`下载情况来看，`webpack 4`仍然是主力

很多人都开玩笑说需要一个专门的岗位叫`webpack`配置工程师，说明了`webpack`的配置很复杂

我觉得一方面是`webpack`包含的功能非常多，需要提供给`loader`和`plugin`开发者`api`，又需要给业务开发者提供各种配置

另一方面是`webpack`提供了很多种写法来达到相同的目的，这样会给使用者造成一定的困扰

## 核心概念

`webpack`的配置项非常多，但核心概念其实不会很多，所以不要被`webpack`的配置给吓到

### mode

打包模式，可选值有`development`，`production`，`none`，很好理解

`webpack`对不同的值会有不同的默认配置，一般本地开发用`development`，生产环境打包用`production`

### entry

入口，默认是`./src/index.js`

入口的写法有很多种，单入口和多入口适用的场景也不同，现在单入口开发用得比较多

```js
module.exports = {
  entry: './src/index.js', // 单入口，默认值
};

module.exports = {
  entry: ['.src/a.js', './src/b.js'], // 单入口，数组内的模块会被打包成一个chunk
};

module.exports = {
  entry: {
    main: './src/index.js', // 单入口，与第一个等价
  },
};

module.exports = {
  // 多入口
  entry: {
    pageA: './src/pageA.js',
    pageB: './src/pageB.js',
  },
};

module.exports = {
  entry: {
    a2: 'dependingfile.js',
    b2: {
      dependOn: 'a2', // 入口描述对象，这个是阅读文档时发现的，还没具体用过
      import: './src/app.js',
    },
  },
};
```

### output

出口，配置的是打包后生成文件的规则，包括文件名，路径等

### loader

`loader`可以理解为各种类型模块的处理工具，比如处理`.js`可以用`babel-loader`，处理`.css`可以用`css-loader`等

`loader`支持链式调用，且跟数组顺序是相反的，比如在处理`css`的时候，会使用`css-loader`，`style-loader`，如果使用了`sass`预处理器，则还需`sass-loader`，并且执行顺序应该是`sass-loader`，`css-loader`，`style-loader`，所以最终配置如下：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(sc|c)ss/,
        use: [
          // 这里use也支持多种写法，具体看下面的例子
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
};
```

### plugin

插件，给`webpack`提供了各种功能，比`loader`更强大，`loader`能做的事情，`plugin`也能做

### modules

模块，`webpack`中一切皆模块，比如：

- `ES2015`的`import`语句
- `CommonJS`的`require`语句
- `AMD`的`define`和`require`语句
- `css/sass/less`中的`@import`语句
- `css/sass/less`中的`url`或者`html`中`img`的`src`

`webpack`自己本身支持的模块有：

- `ES Module`模块
- `CommonJS`模块
- `AMD`模块
- `Assets`模块，`webpack5`中新赠，图片，字体等无需再配置额外的`loader`
- `WebAssembly`模块

通过`loader`，`webpack`还可以支持一下模块：

- CoffeeScript
- TypeScript
- ESNext
- Sass
- Less
- Stylus
- Elm

`webpack`模块解析规则：

- 绝对路径，例如`import '/home/file.js'`，由于已经获取了绝对路径，所以不需要解析
- 相对路径，例如`import './src/index.js'`，相对于`import`的文件解析
- 模块路径，例如`import 'some-package'`，会在`resolve.modules`配置的目录里寻找，默认是`mode_modules`, 同时`resolve.alias`也可以将相对路径改为模块路径

  解析模块路径时，这里也有很多知识点需要掌握，很多都跟`package.json`有关，深入的可以看`resolve`配置

  当`some-package`有`package.json`文件时，如果`package.json`中有`exports`字段，那么`import`的时候，就只能从`exports`字段指定的路径导入，其他路径都会提示找不到模块

  当`package.json`没有`exports`字段时，会根据`target`配置来按顺序选择`browser`，`module`，`main`字段中的某一个

  默认`target`是`web`，当有`package.json`有`browser`字段时，`import 'some-package'`实际引入的是`browser`字段指向的文件

  当`target`是`node`时，`browser`字段会被忽略，优先选择`module`字段指向的文件

### Module Federation

这个是`webpack5`的概念，跟**微前端**，**微前端**我理解为把`web`应用拆分为多个独立的模块，每个模块可以有自己的开发语言，各模块之间相互独立互不干扰，但是又能通过某种机制来实现模块之间的通信和交互

关于微前端，目前我还没有实践过，只是看过一点`qiankun`的文档

### manifest

在用`webpack`打包的项目中，有三种类型的代码

- 自己的源码
- 第三方库的代码
- `webpack`的`runtime`以及`manifest`，控制着所有模块之间的交互

`runtime`就是当应用在浏览器运行时，`webpack`帮我们调度各个模块的代码，控制哪些模块已经加载了，哪些模块是懒加载的

`manifest`就是`webpack`在打包编译时生成的一些跟模块相关的数据，`runtime`通过`manifest`来调度各个模块

讲`manifest`是因为他跟浏览器缓存有一定关系，一般我们希望用户浏览器能够缓存我们的文件，并且希望在更新代码后，那些不变的内容继续被用户缓存，而变化的内容能够被用户更新，所以我们一般选择在`output`的配置中增加`contenthash`或者其他内容来控制缓存

但是`webpack`每次打包注入的`runtime`和`manifest`都会变化，会导致缓存达不到预期，解决办法就是将`manifest`提取出来单独成为一个文件，具体做法放后面讲

### chunk

`chunk`是什么，之前一直很疑惑，还专门寻找过答案，现在`webpack`官网给出了解释，跟之前得到的答案差不多

在`webpack`打包过程中，`modules`会被合并成`chunk`，`chunk`会合并成为`chunk group`，并由此形成了一个有`modules`相互连接的图标，当我们声明一个`entry`的时候，我们就创建了一个`chunk group`

`chunk`有两种形式

- 初始的，通常是入口文件及其依赖形成的`chunk`
- 非初始的，通常是懒加载的模块，`dynamic import`或者`SplitChunksPlugin`分隔的

### bundle

`bundle`也是`webpack`使用过程中经常碰到的词，可以理解为`webpack`处理`chunk`后最终生成的文件

## 配置

下面的配置都以最新的(`webpack5`)文档为例子常用且简单的配置，比如`mode`，`entry`就不讲了

### output

- filename

  指定的是初始加载的`chunk`生成的文件(和路径)，不包括动态加载的`chunk`和`loader`生成的文件

  我通常设置为`js/[name].js?v=[chunkhash]`

- chunkFilename

  指定的是非初始的`chunk`生成的文件(和路径)，默认是`[id].js`，这也是`webpack`打包会出现`0.js`等这种数字名文件的原因

  文档中提到，生成的文件名会被`webpack`的`runtime`用来请求加载`chunk`，所以占位符(`[name][chunkhash]`等)会生成一个到`chunk id`的映射，这样会增加文件大小，并且在任何`chunk`的占位符值修改后，都会使`bundle`失效

  虽然会增加文件大小，但如果实在是不习惯看着`0.js`这样的文件的话，可以指定`chunkFilename`

  我通常设置为`js/[name].js?v=[chunkhash]`，`name`可以在动态加载时用`/* webpackChunkName: 'my-chunk' */`设置

- assetModuleFilename

  这个是`webpack5`新增的，在`webpack5`中我们不需要使用`file-loader`,`url-loader`等(如果强烈需要的话，也可以用)，可以直接使用`Asset Modules`

  我通常设置为`assets/[name][ext]?v=[hash:8]`，注意这里的`[ext]`是带有`.`的

- path

  输出文件的目录，默认为`path.join(process.cwd(), 'dist')`，通常不需要设置

- publicPath

  公共目录，默认是`auto`，通常设置为`/`，或者如果项目运行在二级目录，比如`www.xxx.com/your-app`, 那么可以设置为`/your-app/`，如果使用`cdn`服务，也可以设置为`cdn`的地址，比如`https://cdn.xxx.com/`

  注意末尾都会有`/`，这个配置决定了如何访问静态资源，访问地址是`publicPath` + `filename`或者`chunkFilename`等，`filename`等前面都没有带`/`，`publicPath`这里需要带`/`

- clean

  `webpack5`中可以设置`output.clean`为`true`来在每次打包前删除目录，不用额外的`rimraf`库

到目前位置，一般业务开发的`output`配置已经完成了，如果是库开发，可能还需要关心下面几个字段

- library 和 libraryTarget

  `library.type`设置为`module`时可以输出`ES Module`规范的代码，目前没有使用过这个配置

### module

`module`的配置决定了`webpack`如何处理各种类型的模块，是配置各种`loader`的地方

`module`中除了`rules`外的其他配置，目前还没使用过，下面只讲`rules`中如何配置

官方文档把`rule`的配置分为三个部分，条件，结果，和嵌套`rule`

条件就是匹配模块的规则，满足条件的才会被匹配，常用的有`test`，`include`和`exclude`

结果就是定义如何处理匹配的模块，通常用`use`，很多其他写法都是`use`的简写版

嵌套`rule`还没有使用过

- enforce

  可选值有`pre`或`post`，或者不设置，不设置时表示`normal`

  一般开发情况下只需要知道`pre`表示最先调用，`post`表示最后调用即可

  但实际上这样说不对，因为`loader`的执行分为两个阶段，`Pitching`阶段和`Normal`阶段，这个要自己实现一个`loader`才能有体会

  这个在使用`eslint-loader`的时候会用到，因为`eslint-loader`需要最先执行，

- include 和 exclude

  `include`就是包含哪些模块，`exclude`就是排除哪些模块，很好理解，但如果`include`和`exclude`包含了同一个模块，结果会是怎样的呢？虽然这个问题很奇怪，但我还是试了一下，结论是`exclude`会生效

  `exclude`通常会配置为`/node_modules/`，目的是排除`node_modules`中的代码，因为这些代码一般都是经过作者处理过的，不需要额外的处理

  但也有例外的情况，比如在本地测试的时候，用`npm link`一个未编译的代码，或者库的作者没有处理，这个时候就需要处理`node_modules`里面的某些库，这种情况该怎么做？

  [这个 issue](https://github.com/webpack/webpack/issues/2031)里有答案，目前我觉得以下两种都可行

  ```js
  // 利用正则表达式
  module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules\/(?!(MY-MODULE|ANOTHER-ONE)\/).*/,
        },
      ],
    },
  };

  // 用两个rule，区分，更灵活
  module.exports = {
    module: {
      rules: [
        // ...,
        // my application source code (added react preset) - exclude all /node_modules/
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
              },
            },
          ],
        },
        // specific library (or could be file) from node_modules, only preset-env, include /node_modules/LIBRARY
        {
          test: /\.js$/,
          include: /node_modules\/LIBRARY/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              },
            },
          ],
        },
        // ....
      ],
    },
  };
  ```

  另外，`exclude`和`include`一般不会同时设置，上面的`issue`也有很多人推荐使用`include`而不是`exclude`，使用`include`时，没有被包含在内的也是不会处理的，相当于`exclude`了

- use

`rule.loader`，`rule.options`，`rule.query`全是`rule.use`的简写，所以我觉得直接使用`use`比较好

`use`是一个数组，参数可以是字符串，也可以是形如`{ loader: 'xxx-loader', options: {} }`的对象，其中`options`是传递给`xxx-loader`的配置

字符串其实也是对象的简写，即：`use: ['css-loader']`等价于`use: [ { loader: 'css-loader' }]`

---

到目前为止，业务开发常用的配置已经可以满足需求了，剩下的就在处理`Assets Module`的时候会需要`rule.parser.dataUrlCondition.maxSize`，其他`module`或者`rule`相关的配置暂时没使用过

### resolve

这个配置控制的是模块如何解析的，解析可以理解为如何找到模块对应的文件

`resolve`一般会配置`alias`，其他虽然可能不会配置，但我觉得重要的也会讲一下

- alias

  别名，一般用来避免写`../../`这种很长的相对目录

  ```js
  module.exports = {
    resolve: {
      alias: {
        Components: path.resolve(__dirname, 'src/components/'),
      },
    },
  };
  ```

  配置后可以把原来的

  ```js
  import Button from '../../components/Button';
  ```

  改写为

  ```js
  import Button from 'Components/Button';
  ```

  还记得上面提到的模块解析规则吗？配置`alias`后，`import`的路径由相对路径变成了模块路径，那么`webpack`会去`node_modules`里面找吗？答案是否定的，`alias`的配置优先于模块解析规则

- extensions

  扩展名，默认`['.js', '.json', '.wasm']`

  这个控制的是，当`import`的时候，如何处理没有扩展名的文件，这也是我们在`import`的时候可以不写扩展名的原因

  数组的顺序是有影响的，前面的优先，如果同时有`xxx.js`和`xxx.json`，`xxx.js`会被解析

- mainFields

  一般不用修改这个，这个控制的是，模块解析`package.json`中的哪些字段，顺序是有影响的，前面的优先

  上面的模块解析规则提到过，`target`不设置或者设置为`web`等，`mainFields`默认为`['browser', 'module', 'main']`

  `target`为`node`时，`mainFields`默认为`['module', 'main']`

- mainFiles

  这个控制的是，当解析的是一个路径时，取路径下的哪个文件名，默认是`['index']`，这也是我们在`import`的时候，可以不写`index`的原因

- modules

  这个控制的是，在解析模块路径的时候，应该查找哪些目录，默认是`['node_modules']`，数组顺序是有影响的，前面的优先

  问题来了，设置了`alias`后，解析路径变成了模块路径，是否需要把`alias`的路径设置`modules`里呢？答案是不需要

- unsafeCache

  与缓存相关，目前没有测试具体作用，所以我一般不配置

  `module`里也有一个`module.unsafeCache`，`webpack`还有个全局的`cache`配置，都是跟缓存有关系

其他配置目前都没使用过，略过

### optimization

这个配置是`webpack4`添加的，控制的是代码压缩，`chunk`分隔等，这里面需要了解的内容比较多

- minimize

  是否压缩代码

- minimizer

  压缩代码使用的工具，默认`terser-webpack-plugin`，可以自己手动覆盖`terser-webpack-plugin`，还可以添加`css-minimizer-webpack-plugin`来压缩 css

  `webpack5`中可以用`...`继承默认配置，比如：

  ```js
  const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
  module.exports = {
    optimization: {
      minimize: true,
      minimizer: [
        ...,
        new CssMinimizerPlugin(),
      ]
    }
  }
  ```

- splitChunks

  代码分割的插件，比较重要，`webpack`默认的配置适用于绝大多数情况

  **默认情况**

  默认情况下，这个插件只会影响异步加载的`chunks`(前面提到过，chunk 的形成有两种方式，初始的和非初始的)，因为修改初始`chunk`会影响`HTML`文件里的`script`标签

  `webpack`会根据下面的条件来自动拆分`chunk`:

  - 新的`chunk`可以被共享，或者其 modules 来自 node_modules 文件夹

    我理解的意思就是，新生成的`chunk`必须是被多个其他`chunk`共享的，或者是来自`node_modules`中第三方库的代码

  - 新的`chunk`必须大于`20KB`(压缩和`gzip`之前)

    新生成的`chunk`必须大于`20KB`，如果小于`20KB`就不用新生成`chunk`了，这个值可配置，之前默认值是`30KB`，改小了应该跟放开了并发数有关

  - 在按需加载`chunk`时，最大并发请求数小于等于`30`

    意思是按需加载超过`30`个并发的话就不继续生成新`chunk`，之前这个默认值是`6`或者`5`，现在为`30`应该是得益于`http2`的支持

  - 初始化页面加载时，最大并发请求数小于等于`30`

    意思是页面加载超过`30`个并发的话就不继续生成新`chunk`，之前这个默认值是`4`或者`3`，现在为`30`应该是得益于`http2`的支持

    `webpack`团队认为默认的配置已经是`web`性能的最佳实践了，但具体还是要根据项目本身的情况来定；如果修改了默认配置的话，一定要确认我们的修改是真正有用的修改。默认配置如下：

    ```js
    module.exports = {
      //...
      optimization: {
        splitChunks: {
          chunks: 'async',
          minSize: 20000,
          minRemainingSize: 0,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          enforceSizeThreshold: 50000,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      },
    };
    ```

    在讲其他配置前，我想先讲一下`cacheGroups`，因为`cacheGroups`可以继承或者重写`splitChunks.*`，即`splitChunks`下面很多配置都能够在`cacheGroups`里应用，但是`test`,`priority`,`reuseExistingChunk`这三个，只能在`cacheGroups`下面使用

    `cacheGroups`可以理解为要拆分或者合并的`chunk`，到底是拆分还是合并呢？我理解为合并更好一点

    `cacheGroups.{cacheGroup}.test`，控制这个`cacheGroup`应该包含哪些模块

    `cacheGroups.{cacheGroup}.priority`，控制这个`cacheGroup`的优先级，值越大优先级越高

    `cacheGroups.{cacheGroup}.reuseExistingChunk`，重复使用已经从主`bundle`分离的模块，而不是新建一个，这个会影响`chunk`的名称

    `cacheGroups.{cacheGroup}.enforce`，强制生成单独的`chunk`，忽略`minSize`，`minChunk`，`maxAsyncRequests`，`maxInitialRequests`等这些限制条件

    `splitChunks.automaticNameDelimiter`，默认`~`，生成的`chunk`文件名的分割符

    `splitChunks.automaticNameMaxLength`，默认 109，生成`chunk`的文件名最大字符数

    `splitChunks.chunks`, 表示需要选择哪些`chunk`，可选`all`(全部),`async`(异步的，非初始的),`initial`(初始的)

    `splitChunks.maxAsyncRequests`，最大异步并发数，默认`30`

    `splitChunks.maxInitialRequests`，最大初始并发数，默认`30`

    `splitChunks.defaultSizeTypes`，大小类型，默认`['javascript', 'unknown']`

    `splitChunks.minChunks`，拆分前，模块必须被共享的次数，默认 1

    `splitChunks.hidePathInfo`，对因达到`maxSize`而拆分的`chunk`，生成文件名时避免暴露路径

    `splitChunks.minSize`，生成`chunk`的最小文件大小，默认`20000`

    `splitChunks.enforceSizeThreshold`，强制拆分时的门槛，默认`50000`

    `splitChunks.minRemainingSize`, 拆分后保留的最小大小，为了避免出现大小为 0 的`chunk`，开发环境下默认 0，生产环境下默认`minSize`，一般不需要设置

    `splitChunks.layer`，在`module`的定义中，有`layer`的概念，这里是通过`layer`来筛选`module`

    `splitChunks.maxSize`，表示 chunk 的最大大小，超过这个大小的会被分割，分割后的 chunk 大小至少比 minSize 大，maxSize 在开启 http2 和长期缓存的情况下很有用，设置 maxSize 的同时也会设置 maxAsyncSize 和 maxInitialSize

    `splitChunks.maxAsyncSize`，同`maxSize`，不同的是它只影响异步加载的`chunk`

    `splitChunks.maxInitialSize`，同`maxSize`，不同的是它只影响初始加载的`chunk`

    `splitChunks.name`，`webpack`推荐在生产环境下设置为`false`，设置为某个`string`的时候，所有匹配的模块将会被合并成一个`chunk`

    ***

    到这里`optimization`的配置就浏览完了，是不是感觉一头雾水...我也是

    但大多数情况，使用默认的配置即可，就像`webpack`说的那样，如果要修改默认配置，就必须做出有意义的修改

- runtimeChunk

  前面提到过`webpack`的`runtime`(和`manifest`)会影响缓存，需要单独提取出来，这个配置就是用来提取`runtime`的

  默认为`false`，即不提取`runtime`

  配置为`true`或者`multiple`，每个入口都单独生成一个`runtime`文件，等价于

  ```js
  module.exports = {
    optimization: {
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`,
      },
    },
  };
  ```

  配置为`single`，所有 chunk 只生成一个`runtime`文件，等价于

  ```js
  module.exports = {
    optimization: {
      runtimeChunk: {
        name: 'runtime',
      },
    },
  };
  ```

  一般推荐配置为`single`

- emitOnErrors

  默认`false`，表示编译时报错也会生成文件，不建议修改

- moduleIds

  告诉`webpack`在生成`moduleId`的时候采用哪种算法，`moduleId`我理解为模块的标识，我们打开一个`webpack`生成的文件，会发现很多`qxXW`这样的字符，对应这一个函数，然后被其他函数调用，这应该就是`moduleId`

  默认为`false`，设置为`false`时可以通过插件来配置，比如使用`webpack.ids.DeterministicModuleIdsPlugin`

  可选值`natural`，表示按使用顺序的数字 id，即 1、2、3 这种

  可选值`named`，表示对调试更友好的可读性更好的 id

  可选值`deterministic`，`webpack5`新赠，表示模块名经过`hash`转化后的几位数值，生产环境建议设置为这个，因为对缓存有帮助

  可选值`size`，表示与模块初始大小相关的数字 id

  `webpack4`和`webpack5`有一点差别，`webpack4`中

  `hashed`相当于`deterministic`，`total-size`被废弃

- chunkIds

  告诉`webpack`在生成`chunkId`的时候采用哪种算法

  `mode: development`情况下，默认值是`named`，`mode: production`情况下，默认值是`deterministic`

  `webpack5`比`webpack4`多了`deterministic`，在`webpack5`中用默认值即可，`webpack4`中我一般选择`named`

- nodeEnv

  设置`process.env.NODE_ENV`，默认是`mode`的值

- mangleWasmImports

  默认是`false`，设置为`true`时，表示告诉`webpack`通过修改`import`为更小的字符，来达到减小`wasm`大小的目的

  `wasm`是`WebAssembly`的缩写，也是`WebAssembly`的文件后缀，至于`WebAssembly`是什么，...，一言难尽，目前我只是听说过

- removeAvailableModules

  告诉`webpack`检测并移除那些在父模块中已经包含的模块，目前`webpack4`和`webpack5`在生产环境默认都是`true`，但是开启这个后会影响`webpack`的性能，并且在下一个主要版本中会默认设置为`false`

- removeEmptyChunks

  默认为`true`，删除空模块，用默认值即可

- mergeDuplicateChunks

  默认为`true`，合并有相同模块的`chunk`，用默认值即可

- flagIncludedChunks

  生产环境默认为`true`，其他情况默认为`false`，作用是告诉`webpack`查明并标记那些是其他`chunk`子集的`chunk`，这样的话大的`chunk`加载了就不必要加载子`chunk`了

- occurrenceOrder

  `webpack5`已经没有这个属性了，作用是告诉`webpack`找出一个模块顺序来使得初始`bundle`最小，`webpack4`中生产环境默认为 true

  `webpack4` → `webpack5`

  `optimization.occurrenceOrder: true` → `optimization: { chunkIds: 'total-size', moduleIds: 'size' }`

- providedExports

  默认为`true`，作用是告诉`webpack`找出具体导出了哪些模块，为`export * from ...`提供更高效的代码

- usedExports

  默认为`true`，`webpack4`生产环境默认为`true`，作用是告诉`webpack`检测哪些模块的导出被使用了，这个对后续的清除无用代码有帮助

- concatenateModules

  生产环境默认为`true`，作用是告诉`webpack`去寻找哪些能够合并成一个模块的片段

- sideEffects

  告诉`webpack`要识别`package.json`（第三方库的，而不是本项目的）中的`sideEffects`字段，`sideEffects`默认是否开启由`providedExports`决定，`providedExports`开启则开启

- portableRecords

  告知`webpack`生成带有相对路径的记录(records)，默认关闭，除非设置了`recordsPath`, `recordsInputPath`, `recordsOutputPath`中的一个

- mangleExports

  生产环境默认为`deterministic`，对缓存有帮助，使用默认值即可

- innerGraph

  默认为`true`，对未使用的导出实施`inner graph`分析，具体不知道啥作用

- realContentHash

  默认为`true`，对静态文件提供额外的`hash`编码来保证文件不变的时候`hash`不变

---

到这里`optimization`的配置全部浏览了一遍，大部分使用默认值即可，我们平时业务开发可以这样设置

```js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 删除所有console.*
          },
          format: {
            comments: false, // 删除所有注释
          }
        },
        extractComments: false, // 不为@license这类注释生成单独的文件
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true, // 删除css中的注释
              }
            }
          ]
        }
      })
    ],
    splitChunks: {
      // 自己决定是否修改默认配置
    },
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
  }
}
```

### plugins

定义各种插件的地方，需要看具体的插件使用文档

### devServer

配置`webpack-dev-server`的地方，可以配置端口，代理，热替换等功能

### devtool

配置`source map`的地方，`source map`分为好几种，官网列举了他们的`build`和`rebuild`速度，是源码还是编译后的代码，总结下来有以下几点：

- 生产环境

  可以设置为`false`，不生成`source map`，这是最快的编译方式，我一般用这种，缺点是生产环境无法调试，不知道具体的报错原因

  可以设置为`source-map`，这是最完整的，但注意不应该暴露给普通用户，避免源码泄露

  可以设置为`hidden-source-map`，`nosources-source-map`

- 开发环境

  可以设置为`eval`，这是最快的，但缺点是不是源码，调试不方便

  可以设置为`eval-source-map`，这个`build`速度较慢，`rebuild`还行，但是显示的是源码，调试方便，我一般用这个

  可以设置为`eval-cheap-source-map`，`eval-cheap-module-source-map`

### externals

翻译为外面的，表示打包时不要打包进去，而是从外部引入

以常见的`jquery`为例，如果不想`jquery`被打包到我们自己的代码中，可以这样配置

`html`中引入`jquery`

```html
<script src="https://code.jquery.com/jquery-3.1.0.js"></script>
```

`webpack`配置`externals`

```js
module.exports = {
  externals: {
    jquery: 'jQuery',
  },
};
```

注意上面的`jquery: jQuery`不是随便写的，`jquery`是包名，`jQuery`是挂载在`windows`上的全局变量

这时候我们使用`jquery`跟原来一样`import $ from 'jquery'`即可

### performance

这个控制的不是`webpack`打包时候的性能，而是`webpack`打包后的结果如果超过了某个值，影响用户使用时，`webpack`会给出警告

- hints

  达到预警值时给出`warning`，或者`error`，或者`false`来关闭提示

- maxEntrypointSize

  默认值`250000`，即生成的`bundle`超过`250KB`就给出提示

- maxAssetSize

  默认值`250000`，即生成的静态资源超过`250KB`就给出提示

- assetFilter

  控制的是哪些文件需要检测，默认是

  ```js
  function assetFilter(assetFilename) {
    return !/\.map$/.test(assetFilename);
  }
  ```

  可以看出`source map`是不需要检测的

### stats

`stats`是`statistic`的缩写，翻译为统计数据，控制的是是否在终端打印出编译的结果信息

如果是用`webpack-dev-server`启动，则可以在`devServer`的`stats`中配置

### cache

缓存相关，开启缓存可以加快打包速度，在`development`模式下，`cache`会被设置成`type: 'memory'`，在`production`模式下，`cache`会被禁用，即设置为`false`

`cache`设置为`type: 'filesystem'`时，还可以配置其他选项，比如缓存的目录，过期时间等

---

到目前为止，`webpack`的基本配置就介绍完了，下面将会介绍具体怎么使用，比如如何处理`css`，如何处理图片、字体等

## 如何处理 css

`css`或者`sass`和`less`，都需要通过对应的`loader`来处理, 与之相关的`loader`有

- `style-loader`,

  作用是把`css`以`style`标签插入到`dom`中

- `MiniCssExtractPlugin.loader`

  `mini-css-extract-plugin`的`loader`，作用是把`css`生成单独的文件，不能与`style-loader`一起使用

- `css-loader`

  作用是处理`.css`文件

- `postcss-loader`

  如果使用了`postcss`

- `sass-loader`

  如果使用了`sass`

- `less-loader`

  如果使用了`less`

以`scss`为例，我通常会配置成下面这样，版本不同可能会有差异

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(sc|c)ss$/i,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, // 这个控制的是 @import 语法在被`css-loader`处理前需要被几个其他loader处理
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                // 这里可以配置postcss，也可以使用单独的postcss.config.js配置
                plugins: ['autoprefixer'],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: 'sass', // 推荐sass，也可以不配置，会根据安装的是sass还是node-sass自动选择
              sassOptions: {
                //...
              },
            },
          },
        ],
      },
    ],
  },
};
```

## 如何处理图片，字体

`webpack5`中集成了`url-loader`,`raw-loader`, `file-loader`的功能，所以不需要额外的`loader`

```js
module.exports = {
  output: {
    assetModuleFilename: '[name][ext]?v=[hash:8]', // 开发环境不需要hash
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset', // 让webpack判断是inline还是resource
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 10kb
          },
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
```

以上配置在`webpack4`中等价于

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        loader: 'url-loader',
        options: {
          name: '[name].[ext]?v=[hash:8]',
          limit: 10 * 1024, // 10kb
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        loader: 'url-loader',
        options: {
          name: '[name].[ext]?v=[hash:8]',
        },
      },
    ],
  },
};
```

## 如何配置开发环境(sourceMap, HMR)

开发环境要求的是调试方便，所以`sourceMap`和`HMR`比不可少

- sourceMap

  前面提到，我习惯在开发模式下，设置`devtool: 'eval-source-map'`，但是官方提示说`eval-cheap-module-source-map`是大多数情况的最佳选择，我试了以下，`eval-cheap-module-source-map`比`eval-source-map`要快一点，而且也能对应到源码，是个不错的选择

  在查看`css-minimizer-webpack-plugin`时发现，`css`的`sourceMap`只支持`source-map`,`inline-source-map`,`hidden-source-map`和`nosources-source-map`，`css-minimizer-webpack-plugin`是压缩`css`的，一般在生产环境下使用

- HMR

  `HMR`为什么会让我感到困惑呢，因为开启的方式有多种，应该说是启动本地开发服务器的方法有多种

  - `webpack-dev-server`

  启动本地开发服务器，最简单的是直接使用`webpack-dev-server`，配置`hot: true`或者`webpack serve --hot`来开启`HMR`

  此时不需要添加`new webpack.HotModuleReplacementPlugin`，`--hot`已经帮我们添加了

  - `webpack-dev-middleware` + `webpack-hot-middleware` + `new webpack.HotModuleReplacementPlugin()`

  对于有`nodejs`开发经验的人来说，用上述组合可以更灵活的配置自己的本地开发服务器，`webpack-dev-middleware`和`webpack-hot-middleware`都可以理解为`express`的插件，`HotModuleReplacementPlugin`表示开启`webpack`的`HMR`

  ***

  以上是`HMR`的开启方式，开启只后已经能够实现自动刷新`UI`了，但是对于`react`开发来说，除了希望能够自动刷新`UI`界面外，还希望能够保留组件的`state`，此时就需要`react-hot-loader`或者`react-refresh`

  - `react-hot-loader`

  官方说即将被废弃，在环境支持的情况下，推荐使用`react-refresh`

  - `react-refresh`

  新的解决方案，配合`@pmmmwh/react-refresh-webpack-plugin`使用

关于`HMR`，需要做的配置还是挺多的，具体请看`examples/tools/webpack-hmr`目录下的例子

## 如何配置代码分割

代码分割的目的是避免产生过大的包，从而降低用户加载的时间

在`webpack`中对代码进行分割的方式主要有三种

- 通过`entry`分离

  这是最简单直接的方式，但是如果不做其他的操作的话，多个入口之间公用的代码会被重复打包

- 通过`entry`的`dependOn`或者`SplitChunksPlugin`防止重复打包

  `entry`的`dependOn`这个用得不多，`SplitChunksPlugin`的用法在上面`optimization.splitChunks`中已经提到了

- 通过动态导入分离

  动态导入`import()`语法需要`promise`支持，每个动态导入都可以生成一个单独的文件，可以通过`import(/* webpackChunkName: 'some-module' */'./some-module.js')`来设置`chunk`的`name`，也就是文件名称

  动态导入还可以做到`prefetch`或`preload`，这两个都是预先加载没用到的代码，但稍微有点区别

  `prefetch`一般是下一个页面可能用到的代码，比如列表页和详情页这种关系，可以用`import(/* webpackPrefetch: 'true' */'./some-module.js')`来控制

  `preload`一般是当前页面可能用到的代码，比如一个弹框，可以用`import(/* webpackPreload: 'true' */'./some-module.js')`来控制

  从表现形式来看，`prefetch`和`preload`的区别如下：

  - `prefetch`会在父`chunk`加载结束后开始加载，而`preload`是与父`chunk`并行加载

  - 浏览器支持成都不一样

具体到实际到开发中，我觉得可以做代码分割的地方有

- 常用且基本不变的第三方库，比如`react`,`react-dom`等，可以用`splitChunks`分割到一起

- 大型应用，可以以路由为分割点，例如`react-router`中`component`采用动态导入

- 大型第三方库，比如`echarts`图表库，采用动态导入

- 某些特定的页面才会用到，并且非常大的一些库，比如富文本，图片裁剪等

## 如何利用`tree shaking`

`tree shaking`是基于`ES Module`的静态结构的功能，所以必须使用`ES Module`才能达到`tree shaking`的效果

但是之前的`@babel/preset-env`默认会把我们的代码转换成`commonjs`的代码，所以需要设置`{ modules: false }`，新版本的`@babel/preset-env`的默认值已经改为`{ modules: 'auto' }`

还需要在项目的`package.json`中标记`sideEffects`，可以设置为`false`或者`["**/*.css","**/*.scss"]`这种

## 如何加快打包速度

项目太大的话，`webpack`的打包速度会直接影响开发体验，所以要使用正确合理的方法来优化，下面是官网的一些建议，结合我自己的一些经验

- 使用最新的版本，包括最新版的`webpack`，最新版的`node.js`，`npm`或者`yarn`

  这一点有点不现实，因为工具版本更新太快，而我们平时开发持续时间比较长，即使最开始是最新版，持续一段时间之后可能就变落后了，而版本升级可能造成额外的工作甚至是 bug，所以一般也不会轻易去升级

- 尽可能少的使用`loader`，`plugin`等，只使用自己需要的

- `loader`使用`include`来使得需要其处理的范围最小最精确

- `resolve.modules`, `resolve.extensions`, `resolve.mainFiles`, `resolve.descriptionFiles`这些都只设置必须的，他们会增加调用文件系统的次数

- 如果不使用`symlinks`，设置`resolve.symlinks: false`

- 使用`DllPlugin`插件

  这点已经可以不使用了，因为`dllPlugin`对`webpack4`和`webpack5`的提升有限，具体参考[辛辛苦苦学会的 webpack dll 配置，可能已经过时了](https://juejin.cn/post/6844903952140468232)

- 小即是快，使用更少更小的第三方库，删除无用代码，只编译正在开发的代码

- `worker`池，使用`thread-loader`将非常耗资源的操作交给单独的`worker`来做，但是`worker`的数量不能太多

  很多`loader`或者`plugin`都支持多线程了，所以不用单独设置

- 开启缓存，在`package.json`的`postinstall`字段中清除缓存

  开启缓存我觉得是最有效的方式，效果非常明显

- 对`loader`或者`plugin`进行分析，不要引入性能问题

- `ProgressPlugin`会增加性能消耗，所以如果不是很需要的话不用使用他

---

下面是开发环境的建议

- 使用`webpack`的`watch mode`，而不是使用其他工具来监听文件并通知`webpack`

  `webpack-dev-server`和`webpack-dev-middleware`都是使用的`watch mode`，所以这一点不用优化

- 编译到内存中，而不是输出到磁盘

  `webpack-dev-server`和`webpack-dev-middleware`都是这样的，所以也不用优化

- 使用合理的`devtool`，大多数情况`eval-cheap-module-source-map`是最好的选择

- 避免使用生产环境的功能，像代码压缩，计算`hash`都是生产环境才需要做的事情

- 最小化入口文件，官方给的例子是配置`runtimeChunk: true`

  这点不是很理解，配置为`true`的话，每个入口都会生成`runtime-chunk`，配置为`single`的话，只生成一个`runtime-chunk`，哪一个在开发环境下合适呢？

- 避免额外的优化操作，`webpack`通过执行额外的算法任务，来优化输出结果的体积和加载性能。这些优化适用于小型代码库，但是在大型代码库中却非常耗费性能

  ```js
  module.exports = {
    // ...
    optimization: {
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    },
  };
  ```

  官方推荐大型应用开发环境可以这么配置，我觉得可以试一下

- 设置`output.pathinfo`为`false`，在打包数千个模块的项目时可以这么做

---

下面是生产环境的建议

- 不要为了性能优化而牺牲生产环境的代码质量，生产环境以稳定可靠为目标

- 确认是否真的需要`sourceMap`, 因为他非常耗时

  除非能够使用有效的手段来定位生产环境的问题，比如使用`sentry`等平台追踪或者配置`nginx`白名单，否则生产环境不用生成`sourceMap`

## 有用的插件

- [speed-measure-webpack-plugin](https://www.npmjs.com/package/speed-measure-webpack-plugin)分析打包时间

- [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)分析打包大小

## 其他进阶

上面的都是如何使用或者配置`webpack`，想进一步进阶的话，可以尝试开发自己的`loader`或者`plugin`

### loader 开发

待续

### plugin 开发

待续

## 其他打包工具

打包工具有很多，这里有一个打包工具的对比[Tooling.Report](https://bundlers.tooling.report/)，对理解或者选择打包工具有帮助

`webpack`是平时开发用得最多的一个，但是`webpack`的编译速度一直让人诟病，特别是启动开发服务器的时候。

随着`ES Module`逐渐被浏览器支持，社区也出现了很多直接使用`ES Module`来运行开发服务器的库，开发直接省略了编译这个步骤，所以非常快，最佳代表应该是`vite`了，目前还没有尝试过，但心里已蠢蠢欲动，等尝试后再来写一篇`vite`的总结
