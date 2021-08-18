---
title: 移动端适配
order: 2
group:
  title: CSS
  order: 3
---

# 移动端适配

提到移动端适配，很多人都能够提到媒体查询，`rem`，`vw/wh`等方案，也有很多人能够深入的讲解物理像素、设备像素、`css`像素、`dpi`、`dpr`，`viewport`等知识点，这些知识点我也会提到，因为他们是理解移动端适配的原理需要了解的，但是呢，这些知识点又比较容易混淆，容易忘记，所以我不建议去死记硬背，记不住没关系，知道怎么去做就行

## 从 1px 问题说起

`1px`问题是移动端常见的一个问题，其表现为在某些手机上`1px`实际显示得比`1px`要大，比如显示成`2px`或者`3px`

### 为什么会有 1px 问题？2px 就没有问题吗？

很多文章在讲移动端适配的时候都会提到`dpr`，然后说在`dpr`为`2`的时候，`1px`会显示成`2px`，导致很多人误以为`1px`问题是`dpr`造成的，但其实并不是，如果是`dpr`造成的，为什么`2px`不会显示成`4px`呢？

常规的移动端设计稿宽度是`750px`，然后我们打开谷歌浏览器的移动适配模式，发现上面显示的`iphone6/7/8`显示的是`375px`，我们先不用管什么设备像素、`css`像素、`dpr`，简单直白的理解就是我们要把宽`750px`的设计稿装在宽`375px`的容器里(高度同理)，所以设计稿上的尺寸我们应该缩小 2 倍，即：`border: 1px`应该写成为`border: 0.5px`

但是呢，早期浏览器不支持`border: 0.5px`的写法，会把`0.5px`当作`1px`处理，导致其他位置都正常缩小的情况下，`0.5px`并没有被缩小，也就是前面提到的`1px`"变大了"

`750px`的设计稿上`2px`会写成`1px`，浏览器能够正常处理，所以不会有问题，而`3px`会写成`1.5px`，也是能够正常显示的

### 1px 问题还存在吗？

我没有自己去验证，但根据参考文章中提到的，`IOS8`之后，`Android5.1`之后，大部分移动设备都能够支持`0.5px`的显示，所以`1px`问题是否还存在呢？

如果按照上面的理解的`1px`问题的原因，在设备支持`0.5px`显示之后，`1px`问题就不存在了，[这里](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/115)也有相同的观点，我不敢下定论。

PC 端，比如当前我的电脑`Mac Chrome 92.0.4515.131`版本，依然不能显示`0.5px`的边框

## 移动端适配到底适配的是什么？

适配这个词很好理解，就是让我们的代码在不同的终端浏览器里面表现符合预期，`PC`端其实也有适配问题，比如`IE`就经常被吐槽

回到移动端适配，由于移动端设备屏幕尺寸参差不齐，`css`和`js`的支持程度也不一致，除了前面提到的`1px`问题，还有许多其他的问题，比如`iphone-x`的顶部刘海和底部按钮遮挡问题，高清屏下图片模糊问题，输入法弹出后覆盖输入框或者顶起输入框问题等

以上我觉得都属于移动端适配问题，而很多人谈移动端适配仅仅只提到`rem`等布局适配方案

### 不同设备看到的内容是更多还是更大？

在继续探讨之前，先要明白这个问题，用户买更大屏的手机是为了看到更大的内容还是更多的内容？这个问题涉及到`rem`和`vw/vh`方案

我觉得正常来讲，用户是希望看到更多内容的，但如果产品或者设计师要求不同设备看到内容是多少是一致的，而我们无法说服对方时，只能按产品要求来实现

### 该不该使用`rem`布局方案？

这个就涉及到`rem`方案的弊端，通常说到`rem`方案指的是淘宝团队的`lib-flexible`，我最开始使用的时候尝到了一定的甜头，也碰到了一些问题，比如富文本里很难用`rem`处理，后来好久没开发移动端了，再看`lib-flexible`已经完成了自己的使命，不推荐使用了，因为`viewport`单位`vw/vh/vmin/vmax`的支持度已经很高了，推荐使用`viewport`方案

最近再研究移动端适配时，发现很多人又有不一样的观点，`rem`和`vw/wh`的本质是一样的，都是同比放大或缩小来适配，不同设备看到的内容是一样多，只是大小有区别，这就回到了前面一个问题

如果同意更大的手机应该看到更多的内容多话，就不应该完全使用`vw/vh`或者`rem`，而应该以`px`为主，配合`flex`或者`%`或者`vw`完成布局

### `1px`问题解决方案

`1px`问题在移动设备支持`0.5px`显示之后，可以直接使用`0.5px`，所以如果对自己的用户设备范围比较自信的话，可以不用处理

而如果还是担心有`1px`问题的话，也可以做一些特殊处理，比如利用`border-image`或者`background-image`来实现，但是两种方法都不支持圆角，同时需要引入额外的图片，并且修改颜色的话还需要修改图片，维护比较麻烦，借助[postcss-write-svg](https://www.npmjs.com/package/postcss-write-svg)可以帮助我们维护这个图片

还有一种方法是利用伪元素+`transform: scale()`来处理，因为是纯`css`实现，且可以满足圆角, 所以我推荐这种写法，这种写法需要注意点是，伪元素采用绝对定位的话，需要注意`z-index`的值，避免点击事件被伪元素覆盖，可以用手机查看这里的[example](/examples/)

### `iphone-x`适配方案

`iphone-x`和之后的几代`iphone`顶部都有一个刘海，底部都有一条横杠，这两个部分都可能影响用户视觉或操作，尤其是底部横杠，因为底部按钮是移动端常见的一个布局

解决思路是识别设备是否是`iphone-x`或类似`iphone-x`，是的话则给`body`一个`padding-bottom`的距离

这个思路存在两个问题，如何判断设备？不仅`iphone-x`有这个问题，很多安卓也有类似的设计；如何定义`padding-bottom`的值？虽然这个值经过测试可以得出为`34px`，但如果有天这个值变了我们的代码也要变

好在`css`有环境变量`safe-area-inset-top`，`safe-area-inset-bottom`等变量，这两个变量分别是安全区域上面和下面的距离，下面直接给出使用方法

首先，`meta viewport`标签必须添加`viewport-fit=cover`这个属性，所以`viewport`应该是下面这样的

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover"
/>
```

然后，`css`里给我们需要的元素添加`padding-bottom`属性

```css
body {
  padding-bottom: env(safe-area-inset-bottom); /* env在 ios >= 11.2 中生效 */
  padding-bottom: constant(
    safe-area-inset-bottom
  ); /* constant在 ios < 11.2 中生效 */
}
```

`css`问题解决了，`js`里怎么解决呢？比如有场景是需要计算元素距离底部距离的，这个底部距离是包括`safe-area-inset-bottom`的值的，所以又回到了怎么获取`safe-area-inset-bottom`的值的问题，不过可以把问题转化为`js`里怎么获取`css`里变量的值

原生`css`已经支持变量了，而`js`可以通过`getPropertyValue`方法来获取变量的值

```css
:root {
  --sab: env(safe-area-inset-bottom);
}
```

```js
// document.documentElement 是 html 标签
// 使用getComputedStyle方法获取style属性，而不是直接使用style属性，两者是有区别的
const sab = window
  .getComputedStyle(document.documentElement)
  .getPropertyValue('--sab');
```

### 图片模糊解决方案

这点我目前都是使用`2`倍图来折中处理，更好的方式当然是根据不同设备分别使用`1`倍图，`2`倍图或者`3`倍图，但会增加工作量和维护成本

根据不同设备使用不同图片的方法有

- 媒体查询
- `img`标签可以使用`srcset`属性，支持程度已经很高了
- 背景图可以使用`-webkit-image-set()`，但目前支持度不理想

`svg`矢量图也是一种较好的解决方案，但我目前对`svg`没有研究

### 输入法弹出问题

[]

## 移动端适配中的概念

下面是一些相关的概念，就像前面提到的，我觉得不用去死记硬背

### 英寸

我对寸这个单位一直没什么概念，但在买手机，买显示器或者买电视的时候，屏幕大小都是用寸来做单位的，比如 6.5 寸的手机，24 寸的显示器，52 寸的电视

寸是一个长度单位，1 寸=2.54 厘米，6.5 寸的屏幕指的是屏幕对角线的长度是 6.5 寸

### 像素

这里的像素指的是屏幕像素，我理解为屏幕上具有成千上万个具有位置和颜色属性的点

### 分辨率

平时显示器会提到分辨率，比如`1920x1080`，这里应该指的是最大分辨率，即这个屏幕最多能够显示`1920x1080`个像素点，当我们调整分辨率时，多个像素点会组合成一个新的像素点

### 设备物理像素(dp)

设备像素我理解就是上面提到的屏幕最大分辨率，比如`iphone6`官网显示像素分辨率为`750 x 1334`

### 设备独立像素(dip)

我们打开`chrome`的模拟移动端的调试器，选择`iphone6/7/8`，发现显示的宽高是`375 x 667`，这里的`375 x 667`就是设备独立像素，又称之为设备无关像素，他的作用是告诉不同分辨率的屏幕，元素应该显示的实际大小

### 设备像素比(dpr)

就是物理像素和设备独立像素的比，例如`iphone6`的设备像素比就是`750 / 375 = 2`

### css 像素(px)

`css`像素通常指`px`，是一个抽象的单位，在没有缩放的情况下，`1px`是等于`1`设备独立像素，换算关系为`dip = px / scale`

### viewport

`viewport`翻译为视窗，我们都知道近大远小，看事物的角度不同会有不同的结果，视窗给我的感觉就像定义的屏幕距离页面的距离一样

举个例子，相框和相片，现实中相框总是正好符合相片大小的，而假设我们的相片非常大，则需要把相框与相片隔一定的距离，透过相框看相片才能把相片完全框在相框里面

关于`viewport`，还有三个概念

- `layout viewport`，可以理解为相片的大小，也就是我们页面的大小，可以通过`document.documentElement.clientWidth`获取

- `visual viewport`，可以理解为相框的大小，也就是我们屏幕的大小，可以通过`window.innerWidth`获取

- `ideal viewport`，可以理解为相框大小正好符合相册大小，是移动端开发的理想值

我们在设置`viewport`的时候，通常会写`width=device-width`，这里其实就是把`viewport`设置成`ideal viewport`

但是很多人不知道的是，`initial-scale=1`也可以把`viewport`设置成`ideal viewport`，这是因为`initial-scale`的缩放是相对于`ideal viewport`缩放的

> 那为什么经常同时写上`width=device-width, initial-scale=1`呢？

首先，并一定要同时写上这两个，比如`lib-flexible`就没有写`width=device-width`，因为他缩放了`initial-scale`

其次，很多人看别人同时写两个，自己也这么写，以前同时写上这两个是因为以前的的浏览器会有`bug`，[这里](https://www.runoob.com/w3cnote/viewport-deep-understanding.html)提到过

> 那同时设置`width`和`initial-scale`，并且两者得到的`viewport`不一样怎么办？

答案是浏览器一般会取较大的那个，例如`width=350, initial-scale=1`，在`ideal viewpoint`的值为`320`时，会取`350`，在`ideal viewport`为`375`时，会取`375`

## 移动端布局适配方案

### 1. 媒体查询方案

`CSS`中的媒体查询，一般指的是通过`@media`来指定特定的设备来应用样式，以 IOS 设备为例，部分媒体查询代码可以是下面这样的

```css
/* ----------- iPhone 5, 5S, 5C and 5SE ----------- */

/* Portrait and Landscape */
@media only screen and (min-device-width: 320px) and (max-device-width: 568px) and (-webkit-min-device-pixel-ratio: 2) {
}

/* Portrait */
@media only screen and (min-device-width: 320px) and (max-device-width: 568px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait) {
}

/* Landscape */
@media only screen and (min-device-width: 320px) and (max-device-width: 568px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
}

/* ----------- iPhone 6, 6S, 7 and 8 ----------- */

/* Portrait and Landscape */
@media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) {
}

/* Portrait */
@media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait) {
}

/* Landscape */
@media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
}

/* ----------- iPhone 6+, 7+ and 8+ ----------- */

/* Portrait and Landscape */
@media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) {
}

/* Portrait */
@media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait) {
}

/* Landscape */
@media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
}

/* ----------- iPhone X ----------- */

/* Portrait and Landscape */
@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) {
}

/* Portrait */
@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait) {
}

/* Landscape */
@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
}
```

`style`和`link`标签的`media`属性也可以指定哪些样式文件应该被应用，`media`默认值是`all`

```html
<link href="print.css" rel="stylesheet" media="print" />
<link
  href="mobile.css"
  rel="stylesheet"
  media="screen and (max-width: 600px)"
/>
<style media="all and (max-width: 500px)">
  p {
    color: blue;
    background-color: yellow;
  }
</style>
```

媒体查询不仅可以针对移动端优化，还能针对不通尺寸的 PC 进行适配，可以说非常强大

- 优点：精准，设计支持的话可以在不同设备上呈现不同的布局
- 不足：复杂，需要记住很多断点；难维护，需要维护多套样式
- 兼容性：[基本 100%支持](https://caniuse.com/?search=%40media)

### 2. `px` + 百分比

早期的方案，高度采用`px`固定，宽度用百分比来控制

- 优点：简单
- 缺点：百分比计算复杂
- 兼容性：100%兼容

百分比是相对的，下面列出了常见属性的百分比是相对于谁的：

- `with`: 相对于直接父元素的`with`
- `height`: 相对于直接父元素的`height`
- `right`/`left`: 相对与直接非`static`定位的父元素`width`
- `top`/`bottom`: 相对与直接非`static`定位的父元素`height`
- `padding`/`margin`: 都是相对于直接父元素的`width`，所以可以用`padding: 100%`来实现一个正方形
- `border-radius`: 相对于自身的宽高
- `font-size`: 相对于继承的`font-size`
- `line-height`: 相对于自身的`font-size`
- `vertical-align`: 相对于自身的`line-height`
- `transform: translate(x, y)`，相对于自身的宽高，所以可以用来实现水平垂直居中

### 3. 设计稿宽度 750px,`viewport`设置`width=750`，然后根据屏幕计算`initial-scale`的值

我觉得这是最简单粗暴的方案，也属于等比缩放的一种，在这种方案下，可以全部使用`px`，缩小的话清晰度不会丢失，放大的话清晰度丢失问题也有办法解决，比如直接用最大的尺寸来设计，似乎很完美，我甚至想不出有啥问题

但是这个方案不仅没有流行，反而很少有文章提到，所以肯定是哪个环节有问题，我没有去尝试，在知乎上搜了一下

https://www.zhihu.com/question/32198592

https://www.zhihu.com/question/270207480

总结起来就是，没有大问题，但有坑，而且有坑就会出现大问题，比如嵌入到 App 可能不识别缩放

### 4. rem 方案

`rem`是一个相对单位，相对于`html`根元素`font-size`的值，即把实际`px`宽度，除以`html`标签的`font-size`值就是其`rem`宽度，换算关系为`rem = px / root-font-size`

`rem`方案我觉得其实也算是一种百分比方案，只不过他帮助我们定好了百分比的参考系，都是相对`root-font-size`的，而我们可以根据屏幕宽度来动态计算`root-font-size`的值，所以`rem`方案其实就是相对屏幕宽度的百分比，是`vw/vh`的一种模拟

在网上看到`rem`方案有三种不同实现的方式

- `html`的`font-size`设置为`62.5%`或者`625%`，然后通过媒体查询重新设置`font-size`的百分比值

  我之前是没有接触过这种`rem`的设置方法的，好奇为啥是`62.5%`，原来是利用了浏览器默认字体为`16px`，即`1rem=16px`，为了方便计算，现在想设置为`1rem=10px`，所以`html`设置`font-size`的值为`10 / 16 = 62.5%`

  这个方法我想吐槽一下，利用浏览器默认值的百分比是什么鬼，如果浏览器默认值不一致呢？为什么不直接设置`font-size`是`10px`，然后根据媒体查询设置其他情况下的`px`值，感觉很莫名其妙，而且媒体查询是一个范围，不能精确还原缩放比例，所以这个方案在我这里是通不过的

- 根据屏幕动态设置`html`的`font-size`，不缩放`viewport`，即`initial-scale=1`

  假设设计稿宽度为`x`，分为`100`份，每份`y = x / 100`，`html`的`font-size`设置为`document.documentElement.clientWidth / y + 'px'`，设计稿的`px`值除`100`就是`rem`的值

- `lib-flexible`，不仅根据屏幕动态设置`html`的`font-size`，还根据`dpr`来动态缩放`viewport`，`scale = 1 / dpr`

  设计稿宽度为`x`，分为 100 份，每份`y = x / 100`，`html`的`font-size`设置为`10`份，先根据`dpr`来设置`viewport`的`initial-scale`，然后设置`font-size`，即`document.documentElement.clientWidth / 10 + 'px'`

  当然`lib-flexible`还做了一些其他设置，比如设置了`body`的`font-size`，避免不经意的字体太大

### 5. vw/vh 方案

`rem`方案是`vw/vh`的替代方案，因为当时`vw/vh`的支持程度不友好，而如今`vw/wh`的支持度已经很高了，所以可以尝试采用`vw/vh`方案来布局

`vw`是一个相对单位，理解他是相对于什么的比较重要，`vw`是`viewport`的`1%`，并不是常规理解的屏幕的`1%`，虽然一般情况下`viewport`会设置`width=device-width`

### 6. px + flex 布局

这个放最后来讲，是因为很多人目前推荐的移动端布局方式是`px`为主，`flex`布局为辅，配合其他的比如媒体查询，`vw`等做一些特殊处理

`flex`布局适用于大方向上的布局，比如上中下结构，左中右结构，等分结构等等

## 总结

技术在不断发展，移动端适配也经历了多种适配方案，但目前没有一个方案说能做到完美无缺，我们应该做的是结合使用场景采取不同的方案，比如对于短频快的活动页面，方案`3`可以考虑，对于只针对手机，不考虑`pad`和`pc`，方案`4`,`5`,`6`都可以考虑，而对于想要一套代码自适应`PC`，`Pad`和手机，可以考虑媒体查询

## 参考

- [使用 Flexible 实现手淘 H5 页面的终端适配](https://www.w3cplus.com/mobile/lib-flexible-for-html5-layout.html)
- [再聊移动端页面的适配](https://www.w3cplus.com/css/vw-for-layout.html)
- [如何在 Vue 项目中使用 vw 实现移动端适配](https://www.w3cplus.com/mobile/vw-layout-in-vue.html)
- [深入浅出移动端适配（总结版）](https://juejin.cn/post/6844903951012200456)
- [Web 移动端适配方案](https://juejin.cn/post/6894044091836563469)
- [A tale of two viewports — part one](https://www.quirksmode.org/mobile/viewports.html)
- [A tale of two viewports — part two](https://www.quirksmode.org/mobile/viewports2.html)
- [Meta viewport](https://www.quirksmode.org/mobile/metaviewport/)
- [viewport 深入理解|菜鸟教程](https://www.runoob.com/w3cnote/viewport-deep-understanding.html)
