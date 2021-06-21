---
title: 预处理器
order: 5
group:
  title: CSS
  order: 3
---

# css-preprocessing

`css`预处理器让`css`拥有变量、函数、嵌套写法等功能，变得更强大，我常用的是`scss`，`less`、`stylus`较少使用

这里只记录我在使用`scss`的过程中的一些困惑，并不是`scss`的使用教程，学习`scss`建议阅读官方文档

## .scss 和 .sass 文件有什么区别

`scss`的语法会有两种格式的后缀，`.sass`和`.scss`，这两种格式只是在写法上会有所不同，可以相互转换

`.scss`是`.css`的超集，更接近`css`的写法，所以我选择用`.scss`

```scss
$color: #333;
$bgColor: #eee;

body {
  color: $color;
  background-color: $bgColor;
}
```

`.sass`是`sass`原先的语法，没有分号`;`，没用大括号`{}`，用缩进表示`{}`的关系，上手会不习惯

```sass
  $color: #333
  $bgColor: #eee

  body
    color: $color;
    background-color: $bgColor;
```

## 使用`node-sass`还是`sass`

`node-sass`的文档已经说明了，`node-sass`即将被废弃，应该使用`DartSass`，其对应的 npm 包就是`sass`

`dart`是一门编程语言，`Flutter`使用的就是`dart`

## @import 和 @use 有什么区别

`sass`官网已经说明，`@import`会有很多问题：

- `@import`引入后，变量，函数都是全局的，用户不知道变量是哪个文件引入的，命名也可能冲突
- 每次`@import`都会执行一次编译，会增加编译时间，输出冗余的代码
- `@import`无法定义私有的变量

以上问题`@use`都可以解决，但是目前只有`Dart sass`支持`@use`

文档说`@import`多次引入同一文件时，会造成同样的 css 多次输出，我尝试`@use`之后发现`@use`同样也会造成重复的输出，可能用法不对，待研究

## @mixin 和 @function 有什么区别

`@mixin`定义的是一段代码块，然后用`@include`去引用他们，尽管`@mixin`能接收参数，但`@mixin`不会有返回值

`@function`定义的是一个函数，有输入参数，有返回结果，使用的时候直接调用即可（前提是可访问）

`@function`不建议有任何副作用，只是用来计算值，例如可以利用函数计算`px`和`rem`的转换关系

## @include 和 @extend 有什么区别

`@include`引入的是`@mixin`定义的内容

`@extend`引入的是其他选择器定义的内容

两者都可以做到代码复用，但使用场景是不同的，最明显的区别是`@mixin`可以接收变量，而`@extend`只能扩展其他选择器的内容
