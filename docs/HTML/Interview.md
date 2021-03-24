---
title: 面试题
group:
  title: HTML
  order: 2
---

# 面试题

### `!DOCTYPE`有什么作用？

我们知道，HTML是一种标记语言，而`!DOCTYPE`是标准通用标记语言的文档类型声明，他的作用是告诉解析器采用什么样的文档类型定义来解析文档

在HTML中，`<!DOCTYPE html>`表示告诉浏览器（解析器）采用标准模式来解析HTML文档

### 为什么建议把CSS的`link`标签放在`<head>`和`</head>`之间，而把JS的`script`标签放在`</body>`之前

这题涉及到浏览器的解析机制，我觉得放到[浏览器](/browser/interview)章节更合适

### HTML和XHTML有什么区别？

`XHTML`我了解得不多，不知道面试官问这个问题的意图是什么，可能是想通过与`XHTML`对比来更加了解`HTML`

* `XHTML`必须正确的嵌套

  在书写HTML的时候，会大意写出这样的代码

  ```html
  <p>123<em>123</p></em>
  ```

  打开浏览器会自动变成

  ```html
  <p>123<em>123</em></p>
  ```

* `XHTML`必须正确的关闭

  HTML中有自闭合标签，比如`img`,`input`等，甚至大意写出`<p>123`时，浏览器也会识别为`<p>123</p>`

### 如何获取`<html>`这个标签

`document.documentElement`

这是我被问到的一个面试题，当时只回答了用`document.getElementsByTagName('html')`获取，这个方法是肯定能获取的，但效率明显不高；

实际开发过程中，我几乎没有获取过`html`这个标签，所以我在思考出题人的意图是什么？获取`html`标签有什么用处？

我只记得，`rem`和`px`的换算关系是由`html`标签上的`font-size`的值决定的，暂时没想到其他用处
