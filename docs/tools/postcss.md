---
title: postcss
order: 4
group:
  title: 工程化工具
  order: 7
---

# postcss

一个用`JavasScript`来编译`css`的工具，有丰富的插件，相当于`css`中的`Babel`

## 作用

- 提高`css`可读性(对浏览器的可识别性)

  主要利用`autoprefixer`插件，为`css`属性添加`-webkit-`,`-moz-`等浏览器前缀

- 提前使用未来的`css`属性或功能

  主要利用`postcss-preset-env`插件

- 告别全局 css，避免全局命名冲突

  `CSS Module`

- 检验`css`语法错误

  `stylelint`

- 其他，例如`cssnano`压缩`css`，`postcss-import`转换`@import`规则等

## 怎么用

这里不深入`postcss`的`js api`，只说明如何利用`postcss`来帮助我们开发，以在`webpack`中使用为例

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            option: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                // write postcss config here
                parser: 'postcss-js',
                plugins: [
                  'postcss-import',
                  [
                    'autoprefixer',
                    {
                      // options here
                    },
                  ],
                ],
              },
              execute: true, // true if you use JS styles(CSS-in-JS) postcss-js
            },
          },
        ],
      },
    ],
  },
};
```

同样推荐使用单独的文件来配置`postcss`，例如`postcss.config.js`，配置支持所有的[ProcessOptions](https://postcss.org/api/#processoptions)以及`plugins`

```js
module.exports = {
  parser: 'postcss-js',
  plugins: [
    'postcss-import',
    [
      'autoprefixer',
      {
        // options here
      },
    ],
  ],
};
```

## 跟`sass`和`less`等预处理器有什么关系

`sass`，`less`等称之为`css`[预处理器](/css/pre-processors)，可以让`css`拥有变量，函数等高级功能

`postcss`通过插件，也能够拥有变量，函数等效果，但`postcss`能做的更多，比如`autoprefixer`

`postcss`和预处理器并不冲突，`postcss`出现得晚，由于之前很多开发者都习惯了`sass`或`less`的语法，所以`postcss`会有很多插件去实现类似的语法，比如

- `sass`里可以用`@import`来，`postcss`里的插件`postcss-import`也可以使用`@import`，但两者是有区别的
- `sass`里可以嵌套规则，`postcss`里的插件`postcss-nested`也可以让我们使用嵌套规则

也许是因为这个原因，初学者可能会把`postcss`和`sass`混为一谈，殊不知两者差别还是很大的

### postcss 和 sass 一起使用

一般是`postcss`继续处理`sass`编译后的`css`，这时候我们不需要太多的`postcss`插件，通常就是用`autoprefixer`或者`postcss-preset-env`(这个库包含`autoprefixer`)，以`webpack`为例

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss/
        exclude: /node_modules/
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              // css，postcss, sass都支持`@import`这个语法
              // 这个配置表示 @import xxx 这样的引入资源，在被`css-loader`处理之前，会被几个loader处理
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
            }
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              // 会根据你安装的sass处理器来选择，如果你安装的是node-sass，则会使用node-sass
              // 推荐安装sass，放弃使用node-sass
              implementation: 'sass'
            }
          }
        ]
      }
    ]
  }
}

// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```

### postcss-scss 有什么用？

这个插件并不是在`postcss`中使用`scss`(实际上也没有在`postcss`中使用`scss`这个用法，没有意义)，它只会解析`scss`语法，但不会把`sass`语法转换成`css`，它的作用是帮`postcss`理解`scss`语法，例如`stylelint`就是利用`postcss-scss`来提供对`scss`的支持

一般开发者不会用到这个库

## 总结一下

`postcss`并不是`sass`的替代品，它可以单独使用，也可以跟`sass`一起使用，如果只需要变量，函数，嵌套写法等部分功能，而不想引入更大的`sass`，可以单独使用`postcss`；而如果更习惯使用`sass`，可以添加`sass-loader`，并不妨碍使用`postcss`的其他功能

如果在`.css`文件中使用嵌套规则的写法，`VSCode`会提示语法错误，有 2 个方法可以解决

- 将`VSCode`对`.css`文件的解析改成`.scss`

  - 优点，语法提示跟`.css`一致
  - 缺点，容易混淆`.css`与`.scss`

- 安装`PostCSS Language Support`插件

  - 优点，更能体现`postcss`的作用
  - 缺点，语法提示不足（版本 v1.0.9），比如输入`padding`，不会联想出`padding-top`等
