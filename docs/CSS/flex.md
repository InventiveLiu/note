---
title: 经典布局
order: 4
group:
  title: CSS
  order: 3
---

# 经典布局

一般的网页设计都逃不过几种布局方式，比如上中下结构，左右结构等，这些结构以前一般是采用定位（`position`），浮动（`float`）来实现，而`flex`兼容性提高后，大多数可以采用`flex`来实现，可以只掌握`flex`的实现方式

## 1. 水平/垂直居中

这一般是面试必问的一道题，实现方式也有很多种，我觉得不必记住所有实现方式，只需要记住最常用的就可以，下面也只列举我觉得比较实用的方式

<code src="../../demo/AlignCenter"></code>

为了方便演示，上面的例子的父子元素都有宽高，但其实非固定宽高也可以用上面的方法，上面主要列举了`flex`方法，绝对定位+`transform`方法，以及伪元素加`vertical-align`方法，其中`flex`方法最简单，而`vertical-align`方法可以兼容`ie8`

## 2. 三栏布局

我很讨厌圣杯布局和双飞翼布局这两个名字，因为我无法从这两个名字中获取任何有关布局的信息，反而要去记名字和布局的特点，但其实圣杯布局和双飞翼布局实现的最终效果都是左右宽度固定，中间宽度自适应的三栏布局，所以我更愿意称之为三栏布局，而圣杯和双飞翼都只是三栏布局的实现方式之一

首先自然能想到的`html`结构如下

```html
<body>
  <div class="header">header</div>
  <div class="content">
    <div class="left">left</div>
    <div class="middle">middle</div>
    <div class="right">right</div>
  </div>
  <div class="footer">footer</div>
</body>
```

### 2.1 绝对定位

为了把`left`,`middle`,`right`放一行，首先想到的是用绝对定位来实现

<code src="../../demo/ThreeColumn/Absolute"></code>

此时`content`的高度是`middle`的高度，左右两边与中间是不等高的，如果要求左右两边与中间等高，一般情况下`middle`的内容是要比左右两边高的，所以左右两边都可以加上`height: 100%`

### 2.2 浮动

浮动的方法，一般指的就是圣杯和双飞翼，`html`结构需要改一下，把`middle`放最上面（`float: right`时可以放最下面）

两者的`html`结构和`css`大部分相同，区别是解决`left`和`right`把`middle`的内容覆盖的问题

圣杯是给`content`一个`padding`，然后`left`，`right`分别用`relative`定位来移动位置

双飞翼则是在`middle`的内部再加一个`div`包裹，称之为`inner-middle`，给`inner-middle`一个`padding`值把内容挤到可视区域

<code src="../../demo/ThreeColumn/Float"></code>

此时`content`的高度是`left`，`middle`，`right`中较高的一个，如果要求等高的话，`content`设置`overflow:hidden`时可以用`padding-bottom: 100%;margin-bottom: -100%`来实现

### 2.3 flex

`flex`实现三栏布局最方便

<code src="../../demo/ThreeColumn/Flex"></code>

## 3. 等高布局

前面三栏布局中已经提到了等高布局的实现方式：

- 父元素`overflow:hidden`，子元素`float`+`padding-bottom:100%`+`margin-bottom:-100%`
- `flex`子元素不设置`align-items`时，默认就是等高的

## 4. 顶部（底部）固定，剩下区域撑满滚动

移动端常见的布局方式，以前会用绝对定位来实现，现在只想用`flex`，`flex`在需要撑满剩下空间的需求上特别有用

## 5. 瀑布流

瀑布流的特点是，子元素宽度固定，高度不固定，依次排列并且滚动加载

- `css`中`column-count`属性的支持度已经很高了，所以允许的话可以直接使用
- `flex`也可以实现瀑布流，利用一个横向`flex`和多个纵向`flex`

## 总结

关于布局，我觉得目前必须掌握的是`flex`布局，可以去参考链接里学习，至于`grid`布局，我目前还没有使用过，所以没有提到

## 参考链接

[Flex 布局教程：语法篇 - 阮一峰](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

[CSS Grid 网格布局教程 - 阮一峰](http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)
