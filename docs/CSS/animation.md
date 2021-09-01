---
title: CSS3
order: 3
group:
  title: CSS
  order: 3
---

# CSS3

当前很多开发(包括我自己)对`css`属性的掌握程度仅限于盒模型(`width`, `padding`, `border`, `margin`)，定位(`position`)、浮动(`float`)，背景（`background`）、字体大小颜色等相关(`font-size`, `color`)，`flex`布局（`display: flex`）等，而对于`css`的动画、阴影等属性还停留在"初识"阶段，不会用，但其实那只是`css3`中的一部分，只不过大部分`css3`的内容都被忽略了，少数实用的比如`圆角`,`阴影`,`flex`布局等菜被人掌握

这就是目前`css`的现状，以我自己的经历来讲，我觉得造成这种局面的原因之一是我们拿到的大部分网站的设计稿本身就只是一张静态图片，没有动画和其他酷炫的操作，也就是说不需要用造成了不会用，另一个原因是早期`css`动画和阴影等属性支持度不高，所以之前不能用造成了现在不会用

但其实很多`css`属性很早就已经得到支持了，所以我觉得有必要深入了解一下这些属性，利用`css`来实现一些很`哇塞`的效果

## 变换 transform

`transform`翻译为变换， 属性值是一个函数，称之为`transform function`，按功能分为以下几种，而每种变换又分为`2D`和`3D`，`2D`很好理解，就是网页这个平面，水平方向是`X轴`，竖直方向是`Y轴`，而`3D`则是在垂直于网页的方向的增加了`Z轴`

- 移动, `translate(x, y)`，`2D`变换有`translateX()`和`translateY()`，与之相关的`3D`变换有`translate3d(x, y, z)`，`translateX()`，`translateY()`，`translateZ()`

- 缩放, `scale(x, y)`，`2D`变换还有`scaleX()`和`scaleY()`，与之相关的`3D`变换有`scale3d(x, y, z)`, `scaleX()`，`scaleY()`，`scaleZ()`

- 旋转, `rotate(angle)`，注意`2D`变换中**没有`rotate(x, y)`**，与之相关的`3D`变换有`rotate3d(x, y, z, angle)`, `rotateX(angle)`，`rotateY(angle)`，`rotateZ(angle)`

  旋转这里注意一下，并不是`rotate(x, y)`，也不是`rotate(x, y, z)`

- 倾斜，`skew(x-angle, y-angle)`，`2D`变换有`skewX()`，`skewY()`，没有对应的`3D`变换

- 矩阵，`matrix(a,b,c,d,e,f)`，6 个值的`3x3`矩阵，与之相关的`3D`变换是`matrix3d(...)`，16 个值的`4x4`矩阵

  关于矩阵，是属于线性代数的知识，数学渣渣表示已经忘光了，想了解到可以查看参考链接中张鑫旭老师的解析

- 透视，`perspective()`

  `@TODO` 理解`3D`变换中的透视

### transform-origin

`transform-origin(x, y, z)`定义的是变换相对的位置，默认是`50% 50% 0`，即相对于矩形中心点变换的

`x`的值可以是`left`、`center`、`right`，也可以是具体的长度单位或者百分比长度

`y`的值可以是`top`、`middle`、`bottom`，也可以是具体的长度单位或半分比长度

`z`的值只能是具体的长度单位

### 其他变换属性或者值

关于`transform`变换，还有其他属性或者值，我没有接触过，暂时也无法理解

- `transform-style: flat|preserve-3d;`，定义被嵌套的元素如何在`3D`空间中显示

  - 默认值`flat`表示所有子元素在 2D 平面呈现
  - `preserve-3d`表示所有子元素在 3D 空间中呈现

- `perspective: none;`，`@TODO` 理解`3D`变换中的透视

- `perspective-origin: 50%, 50%;`，定义的是`3D`变换的视角，`@TODO` 理解`3D`变换中的透视

- `backface-visibility: visible|hidden;`，定义元素背向屏幕时是否可见

  - 默认值`visible`，表示背面可见
  - `hidden`表示背面不可见

## 过渡 `transition`

在我们熟悉的普通的`css`中，是没有时间这个概念的，任何变化都是瞬间完成的，比如我们在`hover`时改变一个元素的宽度，那么当我们`hover`时宽度会瞬间改变

`transition`翻译为过渡，其作用是给上述的瞬间改变一个时间，即在指定时间内完成改变

有时间之后自然就有了速度，所以`transition`还可以指定改变完成的速度

`transition`是以下属性的简写，简写的顺序没有很大关系，`transition: 2s width`和`transition: width 2s`都能识别，只有一个时间的话优先匹配动画完成时间，但是我们应该养成良好的习惯，保持统一的顺序就可以，我个人是习惯按下面的顺序写的

- `transition-property`

  指定采用此过渡动画的属性名，只有指定的属性变化才会有过渡动画，其他属性仍然是瞬间变化的，默认值`all`表示所有属性

- `transition-duration`

  指定过渡动画完成的时间，`1s`表示`1`秒，`1ms`表示`1`毫秒，默认值为 0，即瞬间改变

- `transition-timing-function`

  指定过渡动画的速度函数，默认值是`ease`，可选值有：

  - `linear`，直线，即匀速变化，相当于`cubic-bezier(0,0,1,1)`

  - `ease`，慢速开始，然后变快，慢速结束，相当于`cubic-bezier(0.25,0,0.25,1)`

  - `ease-in`，慢速开始，相当于`cubic-bezier(0.42,0,1,1)`

  - `ease-out`，慢速结束，相当于`cubic-bezier(0,0,0.58,1)`

  - `ease-in-out`，慢速开始，慢速结束，相当于`cubic-bezier(0.42,0,0.58,1)`

  - `cubic-bezier(x1,y1,x2,y2)`，指定三次贝塞尔曲线的动画

    数学渣渣不能理解贝塞尔曲线的公式，[https://cubic-bezier.com/](https://cubic-bezier.com/)这个地址能够帮助我们查看具体的动画效果

    三次贝塞尔曲线有 4 个点，其中`P0`定义为`(0, 0)`，`P4`定义为`(1, 1)`，所以`cubic-bezier`函数定义的是另外两个点的位置，`(x1, y1)`是`P2`点，即网站上的红点，`(x2, y2)`是`P3`点，即网站上的蓝点

- `transition-delay`

  指定的是过渡延迟开始的时间，`1s`表示`1`秒，`1ms`表示`1`毫秒，默认为 0，即不延迟

### transition 的局限性

`transition`比较简单、容易理解，这是他的优点，但简单往往意味着有一些局限，比如：

- 需要触发条件，通常是鼠标事件

- 只能定义开始状态和结束状态，无法定义中间状态

- 不能重复动画，除非再次触发

## 动画 animation

`animation`翻译为动画，他解决了`transition`的局限性，比`transition`更强大

在学习`animation`之前有必要了解一下关键帧`@keyframes`，他定义的是动画具体改变的内容，

```css
@keyframes animationname {
  keyframes-selector {
    css-styles;
  }
  keyframes-selector {
    css-styles;
  }
  keyframes-selector {
    css-styles;
  }
  ...
}
```

其中，`animationname`定义的是动画名称，取名同样注意一下语意化，`keyframes-selector`表示帧选择器，取值可以是`0-100%`，或者`from`(相当于`0%`)，`to`(相当于`100%`)，`css-style`即常规的`css`样式，定义的是所选帧的具体样式

接下来学习`animation`，他也是多个属性的简写

- `animation-name`，定义的是使用的动画名，即`@keyframes`定义的名称

- `animation-duration`，定义的是完成动画的周期，`1s`表示`1`秒，`1ms`表示`1`毫秒，默认为 0，即动画瞬间完成

- `animation-timing-function`，定义的是动画的速度曲线，与`transition-timing-function`取值一致

- `animation-delay`，定义的是动画延迟的时间，`1s`表示`1`秒，`1ms`表示`1`毫秒，默认 0，即立即开始

---

以上属性跟`transition`差不多，下面的属性是`transition`没有的

- `animation-iteration-count`，定义的是动画播放的次数，默认是`1`，可选择`n`次，或者`infinite`无限次

- `animation-fill-mode`，定义的是动画结束后，元素采用的样式，默认值是`none`，可选值如下

  - `none`，表示采用动画开始之前的样式

  - `forwards`，表示采用动画结束时的样式

  - `backwards`，表示采用动画开始时的样式

  - `both`，表示根据`animation-direction`（见后）轮流应用`forwards`和`backwards`规则

- `animation-direction`, 定义的是动画播放的方向，默认值`normal`，即正常播放，可选值如下

  - `normal`，正常顺序播放

  - `reverse`，反向播放

  - `alternate`，轮流播放，即第一次正向播放，第二次反向播放，第三次正向播放...

  - `alternate-reverse`，反向轮流播放，即第一次反向播放，第二次正向播放，第三次反向播放...

- `animation-play-state`，定义的是动画是否在播放，默认`running`，即播放，可选值如下

  - `running`，动画播放

  - `paused`，动画暂停，可以用来在鼠标`hover`状态下暂停动画，鼠标移开动画继续

---

`CSS`动画到这里就学习完了，感觉是一看就会，一用就废，主要是没有使用经验和场景

## 多列 column-\*

多列布局是一种布局方式，与之相关的属性如下：

- `column-count`，定义列的数量，默认值`auto`，可选其他整数`n`

- `column-width`，定义列的宽度，默认值`auto`，可选其他长度值

- `columns`，是`column-count`和`column-width`的简写方式

  `column-count`和`column-width`都能够影响实际的列数，那么当两者冲突的时候会取哪一个指呢？

  我在`chrome`上试了一下，取的是列数较小的那一个，比如按`column-width`能够得到`4`列，而`column-count`定义为`3`，则实际列数为`3`，按`column-width`能够得到`2`列，而`column-count`定义为`3`，则实际列数为`2`

- `column-gap`，定义的是列间距，默认值`normal`，`w3c`建议是`1em`的值

- `column-rule`，`column-rule-width`，`column-rule-style`，`column-rule-color`的简写，分别定义的是两列之间分割线的宽度，样式和颜色，类似于`border`

- `column-span`，定义元素跨多少列，默认`1`，取值只能是`1`或`all`，即不存在跨`2`列这种情况

- `column-fill`，定义如何填充列，默认值`balance`，表示列的长短平衡，可选值还有`auto`

---

多列布局的作用，可以用来实现瀑布流，还可以用来实现竖着排版的文字

## 阴影 box-shadow、text-shadow

## 边框

## 渐变

## 滤镜 filter

## clip-path

## 混合模式

## 参考链接

[CSS 动画简介 - 阮一峰](http://www.ruanyifeng.com/blog/2014/02/css_transition_and_animation.html)

[cubic-bezier 函数动画](https://cubic-bezier.com/)

[animatable - 可作为动画的 css 属性](https://projects.verou.me/animatable/)

[CSS Inspiration -- CSS 灵感](https://github.com/chokcoco/CSS-Inspiration)

[iCSS 前端趣闻](https://github.com/chokcoco/iCSS)

[理解 CSS3 transform 中的 Matrix(矩阵) - 张鑫旭](https://www.zhangxinxu.com/wordpress/2012/06/css3-transform-matrix-%e7%9f%a9%e9%98%b5/)
