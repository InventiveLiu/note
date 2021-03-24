---
title: 移动端适配
order: 2
group:
  title: CSS
  order: 3
---

# 移动端适配

## 1. 媒体查询方案

`CSS`中的媒体查询，一般指的是通过`@media`来指定特定的设备来应用样式，以IOS设备为例，部分媒体查询代码可以是下面这样的

```css
/* ----------- iPhone 5, 5S, 5C and 5SE ----------- */

/* Portrait and Landscape */
@media only screen 
  and (min-device-width: 320px) 
  and (max-device-width: 568px)
  and (-webkit-min-device-pixel-ratio: 2) {

}

/* Portrait */
@media only screen 
  and (min-device-width: 320px) 
  and (max-device-width: 568px)
  and (-webkit-min-device-pixel-ratio: 2)
  and (orientation: portrait) {
}

/* Landscape */
@media only screen 
  and (min-device-width: 320px) 
  and (max-device-width: 568px)
  and (-webkit-min-device-pixel-ratio: 2)
  and (orientation: landscape) {

}

/* ----------- iPhone 6, 6S, 7 and 8 ----------- */

/* Portrait and Landscape */
@media only screen 
  and (min-device-width: 375px) 
  and (max-device-width: 667px) 
  and (-webkit-min-device-pixel-ratio: 2) { 

}

/* Portrait */
@media only screen 
  and (min-device-width: 375px) 
  and (max-device-width: 667px) 
  and (-webkit-min-device-pixel-ratio: 2)
  and (orientation: portrait) { 

}

/* Landscape */
@media only screen 
  and (min-device-width: 375px) 
  and (max-device-width: 667px) 
  and (-webkit-min-device-pixel-ratio: 2)
  and (orientation: landscape) { 

}

/* ----------- iPhone 6+, 7+ and 8+ ----------- */

/* Portrait and Landscape */
@media only screen 
  and (min-device-width: 414px) 
  and (max-device-width: 736px) 
  and (-webkit-min-device-pixel-ratio: 3) { 

}

/* Portrait */
@media only screen 
  and (min-device-width: 414px) 
  and (max-device-width: 736px) 
  and (-webkit-min-device-pixel-ratio: 3)
  and (orientation: portrait) { 

}

/* Landscape */
@media only screen 
  and (min-device-width: 414px) 
  and (max-device-width: 736px) 
  and (-webkit-min-device-pixel-ratio: 3)
  and (orientation: landscape) { 

}

/* ----------- iPhone X ----------- */

/* Portrait and Landscape */
@media only screen 
  and (min-device-width: 375px) 
  and (max-device-width: 812px) 
  and (-webkit-min-device-pixel-ratio: 3) { 

}

/* Portrait */
@media only screen 
  and (min-device-width: 375px) 
  and (max-device-width: 812px) 
  and (-webkit-min-device-pixel-ratio: 3)
  and (orientation: portrait) { 

}

/* Landscape */
@media only screen 
  and (min-device-width: 375px) 
  and (max-device-width: 812px) 
  and (-webkit-min-device-pixel-ratio: 3)
  and (orientation: landscape) { 

}
```

`style`和`link`标签的`media`属性也可以指定哪些样式文件应该被应用，`media`默认值是`all`

```html
<link href="print.css" rel="stylesheet" media="print">
<link href="mobile.css" rel="stylesheet" media="screen and (max-width: 600px)">
<style media="all and (max-width: 500px)">
    p {
      color: blue;
      background-color: yellow;
    }
  </style>
```

媒体查询不仅可以针对移动端优化，还能针对不通尺寸的PC进行适配，可以说非常强大

* 优点：精准，设计支持的话可以在不同设备上呈现不同的布局
* 不足：复杂，需要记住很多断点；难维护，需要维护多套样式
* 兼容性：[基本100%支持](https://caniuse.com/?search=%40media)

## 2. `px` + 百分比或`flex`方案

早期的方案，高度采用`px`固定，宽度用百分比（或`flex`）来控制

* 优点：简单
* 缺点：做不到完全还原设计稿，存在拉伸问题
* 兼容性：100%兼容

百分比是相对的，下面列出了常见属性的百分比是相对于谁的：

* `with`: 相对于直接父元素的`with`
* `height`: 相对于直接父元素的`height`
* `right`/`left`: 相对与直接非`static`定位的父元素`width`
* `top`/`bottom`: 相对与直接非`static`定位的父元素`height`
* `padding`/`margin`: 都是相对于直接父元素的`width`
* `border-radius`: 相对于自身的宽高
* `font-size`: 相对于继承的`font-size`
* `line-height`: 相对于自身的`font-size`
* `vertical-align`: 相对于自身的`line-height`

## 3. rem方案



## 4. vh/vw方案
