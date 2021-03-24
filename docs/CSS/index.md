---
title: 基础
order: 1
group:
  title: CSS
  order: 3
---

# CSS基础

CSS(Cascading Style Sheets)，层叠样式表，是网页的装饰，写出漂亮酷炫的网页就靠它了。

我自己写css有以下习惯：

1. 类名用小写字母和`-`连接，而不是驼峰，因为html一般标签都是小写字母
2. 尽量不使用ID选择器和标签选择器，原因请参考下面选择器章节
3. 选择器层级尽量不要超过3层，因为深层嵌套会影响CSS查找效率

要知道，浏览器解析`CSS`是**从右往左**进行的，所以最右边的`CSS`选择器称之为关键选择器，它匹配的范围不能太大（及不要用通配符和标签选择器），否则会影响CSS解析速度

涉及WEB性能优化的内容我们可以稍后再讲，关于`CSS`的书写建议是：遵循以上原则，但没必要为了为此耗费过多的时间。因为设备性能在不断提升，相比于其他影响性能的因素，`CSS`的影响是有限的。

## 1. 属性继承与层叠

### 1.1 继承

每一个css属性都定义了这个属性默认是继承的还是非继承的

#### 1.1.1 继承属性

当一个元素的继承属性没有指定值的时候，则取父元素同属性的**计算值**，文档的根元素则会取属性的初始值

> 计算值所需要的计算通常包括将相对值转换成绝对值(如 em 单位或百分比)。例如，如一个元素的属性值为 font-size:16px 和 padding-top:2em, 则 padding-top 的计算值为 32px）

典型的继承属性有：

* 字体相关：font、font-family、font-size、font-weight
* 文本相关：color、text-indent、text-align、text-shadow、word-spacing
* 其他：visibility、cursor

#### 1.1.2 非继承属性

当一个元素的非继承属性没有指定值的时候，则取属性的初始值

#### 1.1.3 控制继承

css为控制继承提供了4个特殊的通用属性值，每个css属性都可以接收这些值

* inherit，设置该属性会使子元素属性和父元素相同。实际上，就是 "开启继承"
* initial，设置属性值和浏览器默认样式相同。如果浏览器默认样式中未设置且该属性是自然继承的，那么会设置为 inherit
* unset，将属性重置为自然值，也就是如果属性是自然继承那么就是 inherit，否则和 initial一样
* revert，用的不多，只有很少的浏览器支持

### 1.2 层叠

层叠，我理解为层层叠加；同一个dom节点上可能有很多个css规则应用，这些css规则叠加在一起就是这个dom节点的css属性。

在叠加的过程中遇到了相同的属性，那么首先根据css规则的来源来判断谁生效，来源相同的则根据优先级规则（见选择器优先级）判断谁生效

> css来源可以分为：浏览器默认，用户自定义，网页作者，css动画，!important，css transitions

css来源的权重顺序由低到高依次是：

1. 浏览器默认
2. 用户自定义（我理解为通过浏览器设置字体大小等）
3. 网页作者（最常见）
4. css动画
5. 浏览器默认+!important
6. 网页作者+!important
7. 用户自定义+!important
8. css transitions

css动画，关键帧（@keyframes）不参与层叠，也就是说任何时候css动画都是取单一的关键帧的值，而不是几个关键帧的混合
同时需要注意的是，关键帧里面定义的值会被!important覆盖

## 2. 选择器

选择器，顾名思义就是选择CSS作用于哪些元素

### 2.1 选择器分类

CSS选择器按匹配的元素可以分为以下几类：

#### 2.1.1 通配符选择器

匹配所有元素，但是一般不推荐使用，因为存在性能问题；虽然说在设备性能越来越好的今天，这点性能影响可以忽略。

```css
* {
  margin: 0;
  padding: 0;
}
```

#### 2.1.2 标签选择器

匹配指定标签

我不喜欢用标签选择器，因为它不够具体，

```css
h1 {
  font-size: 18px;
}
```

#### 2.1.3 类选择器

匹配带有相应class属性的标签

```css
.class {
  font-size: 18px;
}
```

#### 2.1.4 ID选择器

匹配对应ID的标签，ID应该全局唯一

假设不小心写了2个相同的ID，CSS是可以作用于这2个元素的，但是`document.getElementById`只能获取第一个元素

ID选择器的优先级和效率都比较高，但是存在两个问题：

1. 无法复用，ID是全局唯一的
2. ID选择器跟其他选择器一起使用时，效率反而变低，例如`#id p {}`效率比`.class p {}`低

所以我觉得ID选择器更适用于`JS`中查找元素，在CSS中应单独使用ID选择器，避免同时与其他选择器一起使用

```css
#id {
  font-size: 18px;
}
```

#### 2.1.5 属性选择器

匹配带有相应属性的元素

```css
a[href="#"] {
  font-size: 18px;
}
```

#### 2.1.6 伪类选择器

伪类，我理解为一种状态，比如`hover`状态，用`:`表示

```css
a:hover {
  font-size: 18px;
}
```

个人觉得有用的伪类如下，自己经常用到的有`hover`，`last-child`，`nth-child`

* hover 鼠标悬停状态
* active，被用户激活的状态，当用鼠标交互时，它代表的是用户按下按键和松开按键之间的时间。
* visited，被用户访问过的状态
* checked，被选中的状态，通常用于checkbox，radio，option
* disabled，被禁用的状态
* empty，代表没有子元素的元素。子元素只可以是元素节点或文本（包括空格）。注释或处理指令都不会产生影响
* first-child，表示作为第一个子元素，p:first-child{}表示选中作为第一个子元素的p标签
* first-of-type，表示出现的第一个该类型的元素，p:first-of-type{}表示出现的第一个p标签
* focus，表示获得焦点的状态
* last-child，表示作为最后一个子元素
* last-of-type，表示出现的最后一个该类型的元素
* :not(选择器)，用来匹配不符合一组选择器的元素，括号里的选择器不能有not，也不能有伪元素
* nth-child(an+b)，这个伪类先找到所有当前元素的兄弟元素，然后按照位置排序，序号与an+b（n=1,2,3,...）匹配的则匹配
* nth-last-child(an+b)，跟nth-child基本一致，不同点是从最后开始排序
* nth-of-type(an+b)，语义跟first-of-type一致，用法跟nth-child一致
* nth-last-of-type(an+b)
* only-child，表示唯一子元素
* only-of-type，表示唯一类型的元素
* optional，表示没有required属性的input，select，textarea
* read-only，表示不可编辑的状态
* root，匹配文档树的根元素。对于 HTML 来说，:root 表示<html>元素，除了优先级更高之外，与 html 选择器相同

#### 2.1.7 伪元素选择器

常用的伪元素有`before`，`after`，用`::`表示

```css
a::before {
    content: '<';
}

a::after {
    content: '>';
}
```

#### 2.1.8 后代选择器

匹配后代，即子和孙以及更深层次的

```css
/* 匹配div下面的所有p标签 */
div p {
  font-size: 18px;
}
```

#### 2.1.9 子代选择器

匹配子元素，孙元素及更深层的不匹配

```css
/* 匹配div下面的第一层p标签 */
div > p {
    font-size: 18px;
}
```

#### 2.1.10 相邻兄弟选择器

```css
/* 匹配div相邻的p标签 */
div + p {
    font-size: 12px;
}
```

#### 2.1.11 通用兄弟选择器

```css
/* 匹配 */
div ～ p {
    font-size: 12px;
}
```

### 2.2 选择器优先级

通配符选择器（`*`），关系型选择器（`+`, `>`, `~`, ` `），否定伪类（`:not()`）不影响优先级

其他选择器（或来源）优先级由高到低如下：

* `!important`，优先级最高，但是一般不建议使用
* `inline-style`，优先级次之，一般也很少用
* ID选择器，建议单独使用
* 类选择器，属性选择器，伪类选择器
* 标签选择器，伪元素选择器

选择器的优先级可以用降维打击来形容，一个id选择器的优先级大于N个类选择器的优先级，以此类推；除了优先级之外，加载顺序也很重要，相同的优先级，后加载的会覆盖前面加载的

## 3. 盒模型

盒模型是`CSS`中的一个重要的概念，理解盒模型可以更好的帮助我们进行页面布局

我理解的盒模型是一个元素所占的位置，相关的`CSS`属性有:

* 宽`width`，高`height`
* 内边距`padding`
* 边框`border`
* 外边距`margin`
* `box-sizing`

最开始IE的盒模型跟其他浏览器的盒模型表现不一致，主要体现在元素的宽高是否包含padding和border；

而`box-sizing: border-box;`可以统一盒模型的表现方式，即：元素的宽高包含`padding`和`border`

## 4. BFC（Block Formatting Context）块级格式化上下文

BFC，浏览器渲染CSS的一个独立的区域，是的区域内外相互隔离，互不影响

BFC与盒模型都可以想象成一个块，不通的是，BFC这个块里可以有很多其他小块

以下常见的条件会创建一个BFC：

* 根元素`<html>`，即整个文档属于一个BFC
* 浮动，`float`属性不为`none`的元素
* 绝对定位元素，`position`为`absolute`或`fixed`的元素
* 行内块元素，`display`为`inline-block`的元素
* `overflow`计算值不为`visible`的块元素
* `display`为`flex`或`inline-flex`的直接子元素
* `display`为`grid`或`inline-grid`的直接子元素

以下不常见的条件，也会创建一个BFC：

* 表格单元格，（元素的`display`为`table-cell`，HTML表格单元格默认为该值）
* 表格标题，（元素的 display 为 table-caption，HTML表格标题默认为该值）
* 匿名表格单元格元素，（元素的`display`为`table`、`table-row`、`table-row-group`、`table-header-group`、`table-footer-group`（分别是HTML`table`、`row`、`tbody`、`thead`、`tfoot`的默认属性）或 `inline-table`）
* `display`值为`flow-root`的元素
* `contain`值为`layout`、`content`或`paint`的元素
* 多列容器（元素的`column-count`或`column-width`不为`auto`，包括`column-count`为1）
* `column-span`为`all`的元素始终会创建一个新的BFC，即使该元素没有包裹在一个多列容器中

### 4.1 浮动与清除浮动

说起BFC，有人可能觉得有点陌生，但说起浮动和清除浮动，就不应该陌生了。BFC对浮动和清除浮动都很重要，前面提到BFC之间不会相互影响，所以：

* 浮动定位只会应用于同一个BFC内的元素，不会影响其他BFC中元素的布局
* 清除浮动只能清除同一BFC中在它前面的元素的浮动

下面的例子演示了浮动造成的高度塌陷，以及如何利用清除浮动来消除这个影响

<code src="../../demo/ClearFloat"></code>

现在，`float`属性我个人很少用到了，布局更多采用`flex`布局，这个会有专门的章节讲到

### 4.2 外边距折叠（margin重叠）

很多人应该都碰到过`margin`重叠的问题，下面的例子演示了外边距重叠以及如何消除重叠

<code src="../../demo/MarginCollapsing"></code>

## 5. `z-index`层叠上下文

我们面向的浏览器是一个平面，是二维空间，但是加上Z轴（`z-index`）的话就是一个三维空间，层叠上下文就是这样一个三维空间

以下条件会创建一个层叠上下文:

* 根元素`<html>`
* `position`的值为`absolute`或`relative`，且`z-index`不为`auto`的元素
* `position`的值为`fixed`或`sticky`的元素
* display为flex的直接子元素，且z-index不为auto
* display为grid的直接子元素，且z-index不为auto
* opacity值小于1的元素
* mix-blend-mode属性不为normal的元素
* -webkit-overflow-scrolling 属性值为 touch 的元素
* 以下任意属性不为none的元素
  * transform
  * filter
  * perspective
  * clip-path
  * mask/mask-image/mask-border

层叠上下文的子元素按相同的规则进行层叠，**子元素的z-index只在父元素内生效**
