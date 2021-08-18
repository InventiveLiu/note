---
title: 基础
order: 1
group:
  title: HTML
  order: 2
---

# HTML 基础

> HTML（超文本标记语言——HyperText Markup Language）是构成 Web 世界的一砖一瓦。它定义了网页内容的含义和结构。除 HTML 以外的其它技术则通常用来描述一个网页的表现与展示效果（如 CSS），或功能与行为（如 JavaScript）。——MDN

## 1. HTML 标签

标签，也可以称为元素，是 HTML 的核心内容。一个简单的 HTML 文档结构如下：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>HTML</title>
    <link />
    <style>
      body {
      }
    </style>
  </head>
  <body>
    <nav>...</nav>
    <main>...</main>
    <footer>...</footer>
    <script></script>
  </body>
</html>
```

### 1.1 link 标签

`link`标签的作用是引入外部资源

**`link`标签的`rel`[属性值](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Link_types)有很多，其中`alternate`，`preload`，`prefetch`等都可以单独写一篇文章来研究一下**

- 引入样式表`stylesheet`

  ```html
  <link rel="stylesheet" href="style.css" />
  ```

- 指定网站图标

  ```html
  <link rel="icon" href="favicon.ico" />
  ```

  不过现在推荐使用 png 格式的 favicon，还可以利用`sizes`属性提供多个尺寸的图片

  ```html
  <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
  <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
  <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
  ```

- 指定 apple-touch-icon

  ```html
  <link
    rel="apple-touch-icon"
    sizes="57x57"
    href="/apple-touch-icon-57x57.png"
  />
  <link
    rel="apple-touch-icon"
    sizes="114x114"
    href="/apple-touch-icon-114x114.png"
  />
  <link
    rel="apple-touch-icon"
    sizes="72x72"
    href="/apple-touch-icon-72x72.png"
  />
  <link
    rel="apple-touch-icon"
    sizes="144x144"
    href="/apple-touch-icon-144x144.png"
  />
  <link
    rel="apple-touch-icon"
    sizes="60x60"
    href="/apple-touch-icon-60x60.png"
  />
  <link
    rel="apple-touch-icon"
    sizes="120x120"
    href="/apple-touch-icon-120x120.png"
  />
  <link
    rel="apple-touch-icon"
    sizes="76x76"
    href="/apple-touch-icon-76x76.png"
  />
  <link
    rel="apple-touch-icon"
    sizes="152x152"
    href="/apple-touch-icon-152x152.png"
  />
  ```

  关于 favicon 和 apple-touch-icon，可以参考[这篇文章](https://css-tricks.com/favicon-quiz/)

- 指定 manifest

  ```html
  <link rel="manifest" href="/manifest.json" />
  ```

  manifest 是 PWA(Progressive Web App)的一部分，有机会学到 PWA 的时候再了解

### 1.2 meta 标签

meta 标签表示由其他元标签（`base`, `link`, `script`, `style`, `title`）不能表示的元数据

- 指定文档字符集

  ```html
  <meta charset="utf-8" />
  ```

- 指定`viewport`

  `viewport`在移动端适配时会用到

  ```html
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  ```

- SEO 优化

  指定页面描述和关键词

  ```html
  <!-- 不超过150字 -->
  <meta name="description" content="150 words" />
  <!-- 多个关键词用,隔开 -->
  <meta name="keywords" content="words1,words2,words3" />
  ```

- 忽略自动识别电话和邮箱

  ```html
  <meta name="format-detection" content="telephone=no,email=no" />
  ```

## 2. 行内元素和块级元素

### 2.1 行内元素

默认情况下，行内元素只占据它对应标签的边框所包含的空间（不会另起一行），行内元素只能包含数据和其他行内元素

常见的行内元素有：

- `<span>`,`<img>`,`<a>`,`<script>`
- `<button>`,`<input>`,`<label>`,`<select>`,`textarea`

### 2.2 块级元素

默认情况下，块级元素会占据其父元素（容器）的整个空间（会另起一行），块级元素能包含行内元素和其他块级元素

常见的块级元素有：

`<div>`,`<p>`,`<header>`,`<footer>`,`<form>`,`<section>`,`<video>`,`<audio>`,`<canvas>`

### 2.3 HTML5 中的定义

在浏览[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Block-level_elements)的时候了解到，行内元素和块级元素是 HTML 4.01 标准中的，HTML5 中对此没有明确的定义，取而代之的是更为复杂的[“内容类别（Content Categories）”](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/Content_categories)代替。

我简单浏览了一下，个人觉得没有块级元素和行内元素直接

## 3. 语义化

很多开发（包括我自己）都喜欢`div`+`span`一把梭，这样写的代码虽然能够正常运行，但失去了语义化的能力。

我们都知道，HTML 标签是有含义的，比如`<p>`标签代表段落（paragraph），简单来讲，语义化就是合理的使用 HTML 标签以及其特有属性来书写 HTML。

我们写的代码是给机器看的，但同时也是给其他开发人员看的，语义化不仅能让机器更好的理解代码，更好的进行 SEO，还能方便其他开发阅读理解代码，更好的进行沟通。

HTML5 中新赠了很多语义化标签，比如文章`article`，章节`section`，导航`nav`，页脚`footer`，所以开发要养成好的习惯，尽量使用语义化的 HTML 标签

## 4. HTML 属性

HTML 标签可以有属性和值，这些属性和值可以赋予标签更多的功能，比如我们常用的`class`，`style`等

下面列一些不常用但比较重要的一些属性

### 4.1 async

`script`标签独有的属性

默认情况下，浏览器遇到`script`标签时会暂停解析 html，立即加载`script`标签的内容并执行，所以`script`标签会阻塞 HTML 的解析

加上`async`属性表示告诉浏览器，与 HTML 解析并行加载这段`script`代码并且加载完成后立即运行

### 4.2 contenteditable

全局属性，所有 HTML 标签上都可以有这个属性

加上`contenteditable`后，页面内容变得可编辑，很多富文本编辑器利用的就是这个属性

### 4.3 data-\*

全局属性，所有 HTML 标签上都可以有这个属性

在`jquery`时代，框架没那么流行，开发经常利用`data-*`把额外的数据保存在`dom`上，利用`jquery`存取数据都很方便

现在是框架的时代，已经不推荐使用`data-*`了，因为这里的数据很容易被串改

### 4.4 defer

`script`标签独有的属性

跟`async`类似，告诉浏览器与 HTML 解析并行加载这段`script`代码，不同的是等 HTML 解析完再执行

### 4.5 draggable

全局属性，所有 HTML 标签上都可以有这个属性

- 注意有两个字母`g`
- `draggable`的值不是布尔值，而是枚举值`true`和`false`，所以不能像布尔值一样只写属性名，`<img draggable>`无效，正确的写法是`<img draggable="true">`

配合浏览器的`Drag and Drop`API 能够实现拖拽效果

### 4.6 scoped

`style`标签独有的属性

表示样式仅作用于其父项和子项元素

这个属性已经被废弃了，但是可能会被重新引入

在写`Vue`代码的时候，经常会用到此属性，应该只是一个`polyfill`

### 4.7 srcset

`img`和`source`标签的属性

`srcset`和`sizes`配合能实现响应式图片，具体可参考[MDN](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)：

```html
<img
  srcset="
    elva-fairy-320w.jpg 320w,
    elva-fairy-480w.jpg 480w,
    elva-fairy-800w.jpg 800w
  "
  sizes="(max-width: 320px) 280px,
            (max-width: 480px) 440px,
            800px"
  src="elva-fairy-800w.jpg"
  alt="Elva dressed as a fairy"
/>
```

## 5. 怪异模式和标准模式

> 在很久以前的网络上，页面通常有两种版本：为网景（Netscape）的 Navigator 准备的版本，以及为微软（Microsoft）的 Internet Explorer 准备的版本。当 W3C 创立网络标准后，为了不破坏当时既有的网站，浏览器不能直接弃用这些标准。因此，浏览器采用了两种模式，用以把能符合新规范的网站和老旧网站区分开。

> 目前浏览器的排版引擎使用三种模式：怪异模式（Quirks mode）、接近标准模式（Almost standards mode）、以及标准模式（Standards mode）。在怪异模式下，排版会模拟 Navigator 4 与 Internet Explorer 5 的非标准行为。为了支持在网络标准被广泛采用前，就已经建好的网站，这么做是必要的。在标准模式下，行为即（但愿如此）由 HTML 与 CSS 的规范描述的行为。在接近标准模式下，只有少数的怪异行为被实现。

很多人应该都看过一个面试题目：`<!DOCTYPE html>`有什么作用？

`DOCTYPE`的作用就是告诉浏览器采用哪种模式来渲染页面，在 HTML5 中，我们都会在 HTML 文档的最顶部写上`<!DOCTYPE html>`，作用是告诉浏览器采用标准模式来渲染页面。如果不声明`DOCTYPE`或者不是在最顶部声明，就可能在 IE9 或更老的浏览器中触发怪异模式，造成页面达不到预期效果。

至于怪异模式和标准模式有什么区别，这里列举一些我觉得有意思的，其他的可以参考[MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Mozilla_quirks_mode_behavior)

- 怪异模式下，css 选择器是大小写不敏感的；标准模式下，css 选择器是大小写敏感的
- 怪异模式下，CSS 的 color 可以接受不带`#`的 6 位颜色值
