---
title: 基础
order: 1
group:
  title: javaScript
  path: /js
  order: 4
---

# js 基础

`js`可以说是前端开发最重要的一部分了，本文不会很系统的去讲`js`的基础知识，只是列举一些我觉得比较重要的或者容易忽视的点

## 编码规范

把编码规范放在首位，因为我觉得它非常重要，但很多人都忽视这一点，编码风格包括：

- 变量命名，函数命名，常量命名

  取名是一件比较重要的事情，对于比较重要的变量，我们希望从变量的名字能够得到一些信息，而不是简单的`abc`或者通用的`data`，这样做的目的是方便后期维护，否则就会经常需要猜测某个变量是干嘛的

  常量推荐使用全大写字母来表示，目的是理解常量代表的意思，并且方便全局统一修改

- 代码缩进，大驼峰小驼峰，下划线，空格，字符串单引号双引号，分号，尾逗号显示等

  这部分可以借助`ESLint`来帮助我们实现代码的规范化

- 代码注释

  零注释的代码会给协作和维护带来困难，而无效的注释也会浪费开发时间，而良好的注释不仅可以增强代码的可读性，还可以配合编辑器得到智能提示，这部分可以参考[jsdoc](https://jsdoc.app/)文档

## 数据类型

`ES5`中有 6 种数据类型，`ES6+`添加了`Symbol`和`BigInt`，所以有 8 种数据类型，这 8 种数据类型又分为 7 种原始类型和 1 种引用类型，引用类型这点很重要，在判断是否相等时要特别注意引用类型

7 种原始类型

- `null`

  空，可以理解为分配了一块地址给你，但地址里啥都没有，是空的

  `typeof null`结果为`object`，这是`js`语言早期的历史 bug，所以在用`typeof`判断数据类型时需要注意，面试题里会有如何正确的判断`object`类型

- `number`

  整数或者浮点数，取值在`+(2^53 - 1)`（最大安全整数`Number.MAX_SAFE_INTEGER`）和`-(2^53 - 1)`（`Number.MIN_SAFE_INTEGER`）之间，超过这个范围的计算结果会不正确

  同时，`js`的浮点数运算也会出现结果不正确的情况，比如`0.1 + 0.2`结果是`0.30000000000000004`，这是由于`js`遵循`IEEE-754`规范，所有遵循这个规范的编程语言都会有浮点数计算的问题，在对数据精度有要求的开发过程中需要特别注意，解决方案放在面试题中

  `number`中还有几个眼熟的常量，比如`NaN`和`Infinity`

* `undefined`

  未定义，可以理解为没有分配地址，都不知道他在哪儿

* `string`

  字符串，比较常用的一个类型，相对来说是比较简单的

  但是在处理某些问题上也需要做一定的积累和记录，比如正则表达式相关，再比如`emoji`字符串长度处理，这些都放到面试题里讲一下

* `boolean`

  逻辑值，`true` or `false`，也可以用`1` or `0`表示, 最简单的数据类型了，但是也有需要注意的地方，比如字符串`'0'`代表`true`

* `symbol`

  唯一的标识，会单独讲为什么要引入`Symbol`类型以及怎么使用`Symbol`类型

* `bigint`

  大整数，为了解决前面提到的`number`取值范围的问题

1 种引用类型

- `object`

  对象，一种特殊的类型，`js`里自建的类型（比如`Math`，`Date`等）都是基于`object`的，甚至包括函数也属于`object`

  需要特别注意的是，函数`function`并不是基本类型，而是隶属于`object`，`typeof alert`结果是`function`是早期`js`语言的问题，因为`function`在`js`的世界里非常重要，地位不比`object`差，所以会分别单独讲

### 类型转换

`js`是弱类型的语言，意思就是在`js`里变量可以从一个类型变成另一个类型，这个变化的过程称之为类型转换

类型转换可以分为隐式转换和显式转换，隐式转换指的是代码上没有明显的转换，比如我们经常写`if (someValue)`，或者经常比较`'1' == 1`，这里都有一个隐式类型转换的过程

显式类型转换指的是从代码上能直接看出来做了类型转换，比如我们经常把数字字符串转换成数字`Number('123')`

巧妙的类型转换能够实现一些让人赞叹的功能（挖个坑），但是我个人是不习惯太多的类型转换的，因为有些利用类型转换实现的功能会难以理解，而潜在的一些类型转换会造成一些`bug`

`ts`在`js`的基础上加上了`强类型`，并且还能拥有丰富的语法提示，值得学习

## 声明提升

声明提升是`ES5`中一个很重要的表现，允许在声明之前使用变量，以前也经常作为面试考点，但在`ES6`中，使用`let`和`const`声明的变量不会有提升（这里说不会提升其实也不准确，应该用`暂死区`理解比较好，表明`js`知道有变量声明，但是在`暂死区`你还不能使用它），**函数声明**依然会在自己的作用域里提升

```js
console.log(a); // 不会报错，a是undefined
var a = 1;

console.log(b); // 会报错，Uncaught ReferenceError: b is not defined
let b = 1;

myFuncA(); // 不会报错，函数正常运行
function myFuncA() {}

myFuncB(); // 会报错，Uncaught ReferenceError: myFuncB is not defined
let myFuncB = function() {};

// 这里使用的是var，但同样会报错，Uncaught TypeError: myFunc is not a function
// 因为变量提升只是声明提升，赋值并没有提升，此时myFuncC还是undefined
myFuncC();
var myFuncC = function() {};
```

## 运算符和优先级

`js`支持很多常规的数学运算，加（`+`）减(`-`)乘（`*`）除（`/`），取余（`%`），幂运算（`**`），其他运算符如下：

`+`还可以用来把字符串转换成数字，类似`Number(xxx)`，此时的`+`可以理解为一元运算符

`+=`，`-=`，`*=`, `/=`，原地运算，只能作用于变量

`++`自增`1`和`--`自减`1`，前置(`++n`)和后置(`n++`)`n`都会自增，但是两者返回值不一样，前置返回自增后的值（`n+1`），后置返回自增前的值（`n`）

`,`运算符，所有语句都会执行，但只有最后一个语句的结果会返回，平时开发不建议使用，但是如果我们查看`webpack`压缩后的代码，会发现大量的`,`运算符，所以需要理解

`a ? b : c`，唯一一个三元运算符，相当于`if(a) { b } else { c }`

大于`>`, 大于等于`>=`，小与`<`，小于等于`<=`，普通等于`==`，严格等于`===`，值的比较，需要注意隐式类型转换（`null`转换成数字是`0`，`undefined`转换成数字是`NaN`，字符串转换成数字会忽略首尾空格）以及字符串比较是逐个比较字符的`Unicode`编码顺序

或`||`, 且`&&`，非`!`，逻辑运算，可以用于条件判断，也可以用于获取第一个真值（`||`返回第一个真值，没有真值时返回最后一个值）或者假值（`&&`返回第一个假值，没有假值时返回最后一个值），例如`null || 2 || undefined`的返回值是`2`，`1 && null && 2`的返回值是`null`，`||`在碰到第一个真值后立即返回结果，不会执行后面的语句，`&&`在碰到第一个假值时会立即返回，不会执行后面的结果，所以当我们写`if(xxx1 || xxx2)`或者`if(xxx1 && xxx2)`时，可以稍微注意一下`xxx1`和`xxx2`的先后顺序

`??`运算符，跟`||`很像，区别是`??`只判断`null`和`undefined`，`a ?? b`，当`a`是`null`和`undefined`的时候，返回`b`，否则返回`b`，而`a || b`，当`a`是任何假值（`null`, `undefined`, `0`, `false`等）时，返回`b`，否则返回`a`

`?.`，严格来说，`?.`并不是运算符，而是一种特殊的语法，用于防止取对象的值时报`undefined`错误，`a?.b`,`a.method?.()`，在`a`为`undefined`的时候不会报错，而会返回`undefined`

正如数学中乘法的优先级比加法高，`js`里运算符也是有相同的优先级的，但是我不建议也不喜欢在面试中出一些关于运算符优先级的题目，因为实际业务开发中不会有太多的优先级问题，用`()`来明确优先级也能够增加代码可读性

另外前面提到了隐式类型转换，使用运算符是发生隐式类型转换最常见的例子，比如`1 + '2'`结果是`'12'`，除了字符串相`+`之外，我觉得在运算过程中应该避免隐式类型转换

## 值是否相等？

值是否相等是一个很重要的问题，因为他涉及到原始值与引用值，还涉及到`react`组件是否更新等问题

### 抽象相等比较 ==

`ECMAScript`官网上已经给出了算法，[Abstract Equality Comparison](https://262.ecma-international.org/12.0/#sec-abstract-equality-comparison)，从算法描述也可以看出来，当`==`两边`Type`不一样时，会有一个类型转换的过程，这也是为什么`1 == '1'`的结果是`true`

现在是不推荐使用`==`的，因为`undefined == null`，`1 == '1'`这些都会返回`true`，这是不合理的

### 绝对相等比较 ===

`===`比较不会有类型转换的过程，当类型不同的时候会直接返回`false`，所以`undefined === null`，`1 === '1'`这些都会返回`false`，是我们期望的结果

大多数情况下，`===`能够符合我们的需求，但是`===`也有自己的局限，比如`NaN === NaN`返回的是`false`，`+0 === -0`返回的是`true`，如果需要考虑这两种情况的话就需要特殊判断

### Object.is

`Object.is(x, y)`与`x === y`的区别就是`Object.is`弥补了`===`的局限，`Object.is(NaN, NaN)`返回的是`true`，`Object.is(+0, -0)`返回的是`false`

`React.useState`比较新旧`state`用的是`Object.is`比较

## 函数与闭包

经常听到这样一句话，函数是`js`里的“一等公民”，我想这句话的意思是函数在`js`世界的地位很高，有自己的作用域，可以接收参数，也可以做其他函数的参数，可以构造对象，可以...

函数的作用很多，这里主要讲一个重要的概念，**闭包**，在`react`的`class`组件开发时代，似乎不用理解闭包也能很好的开发，但是`hooks`时代又把闭包带到了开发者面前

### 什么是闭包？

这是很多人喜欢问的面试题，按我之前的理解，闭包是内部函数访问外部函数的变量。现在重新查看[MDN 上对闭包的定义](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)，发现这么理解闭包是有点问题的

> A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function’s scope from an inner function. In JavaScript, closures are created every time a function is created, at function creation time. -- MDN

闭包是一个函数及其周围状态（词法环境）捆绑在一起的组合，换句话说，闭包让内部函数能够访问外部函数的作用域，在`js`中，每次创建函数的时候都会创建一个闭包

> A closure is a function that remembers its outer variables and can access them. In JavaScript, all functions are naturally closures (there is only one exception, to be covered in The "new Function" syntax) -- https://javascript.info/closure

闭包是能记住外部变量并访问的函数，在`js`中，任何函数天生就是闭包（`new Function`除外）

按上面的两个链接的说法，每个函数都是会形成一个闭包是有点颠覆我对闭包的理解的，然后我又回想了下为什么我会认为闭包一定要访问外部变量，我觉得是因为闭包只有在访问外部变量并使用时才有意义，普通函数你说他是一个闭包其实是没意义的，`new Function`除外指的是`new Function`访问的是全局变量

```js
function getFunc() {
  let value = 'test';

  let func = new Function('alert(value)');

  return func;
}

getFunc()(); // error: value is not defined
```

抛开概念，我觉得闭包还有一个让人难理解或者记住的是不知道能用闭包来干嘛，下面将从具体的问题入手来看闭包可以帮我们做什么

- 经典的循环绑定事件问题

  ```html
  <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
  </ul>
  ```

  ```js
  const list = document.getElementsByTagName('li');

  for (var i = 0; i < list.length; i++) {
    list[i].addEventListener('click', () => {
      console.log(i + 1);
    });
  }
  ```

  然后我们去点击`li`标签，发现打印的都是`3`，这并不符合预期，闭包的解决方案如下

  ```js
  const list = document.getElementsByTagName('li');

  for (var i = 0; i < list.length; i++) {
    list[i].addEventListener(
      'click',
      (j => {
        return () => {
          console.log(j + 1);
        };
      })(i),
    );
  }
  ```

  上面采用立即执行函数，接收参数`i`，返回我们实际想执行的另一个函数，函数访问了立即执行函数的参数，这里利用了闭包**捕获**了参数`i`的值

  上面的捕获帮我们达到了目的，但在使用`react hooks`时，闭包的捕获会给我们带来困扰，具体可以看`react hooks`章节——为什么我拿到的 props 或 state 不是最新的

- 假设有一段文字（`id='p'`）和三个按钮(`id`分别是`size-12`,`size-14`,`size-16`)，三个按钮的作用是改变文字的字号

  对这个需求，我很自然的就会这么写

  ```js
  function changeSize(size) {
    document.getElementById('p').style.fontSize = size + 'px';
  }

  document.getElementById('size-12').onclick = function() {
    changeSize(12);
  };
  document.getElementById('size-14').onclick = function() {
    changeSize(14);
  };
  document.getElementById('size-16').onclick = function() {
    changeSize(16);
  };
  ```

  上面这么写没毛病，下面提供另一种写法，这两种写法谈不上优劣，只是我觉得是两种不同的思考方式

  ```js
  function changeSize(size) {
    return function() {
      document.getElementById('p').style.fontSize = size + 'px';
    };
  }

  document.getElementById('size-12').onclick = changeSize(12);
  document.getElementById('size-14').onclick = changeSize(14);
  document.getElementById('size-16').onclick = changeSize(16);
  ```

  细想一下这种写法跟`react`里面用高阶函数传递参数一样，这里面也是有闭包存在的

- 设计一个计数器，每运行一次打印数加`1`

  ```js
  // 全局变量
  let count = 0;

  function counter() {
    console.log(++count);
  }

  counter(); // 1
  counter(); // 2
  ```

  全局变量可以实现，但全局变量的弊端非常明显，容易命名冲突，容易被其他人修改，所以不可靠

  ```js
  // 闭包
  function makeCounter() {
    let count = 0;
    return function() {
      console.log(++count);
    };
  }

  const counter = makeCounter();

  counter(); // 1
  counter(); // 2
  ```

  这是闭包最常用的场景了，我们不想`count`暴露在全局，所以选择闭包，只要`counter`不销毁，`count`就一直在内存中，这也是很多人提到的闭包的弊端，容易造成内存泄露，要释放`count`的内存，需要手动把`counter`置空，`counter = null`

## 原型和原型链

`js`里的原型链是比较复杂且很容易混淆的一个知识点，平时框架下的开发，原型与原型链似乎没有用武之地，所以很多人都似懂非懂，包括我自己

尽管框架能够让我们在不了解原型与原型链的情况下也能够很好的开发，但是要想提升自己对`js`的理解，提高自己的原生`js`能力，原型和原型链是不可缺少的

### 理解 this

先理解`js`里的`this`指向可以帮助我们更好的理解原型链

- 全局上下文

  关于全局上下文，一般认为浏览器环境是`window`（或者`self`），`node`环境只有`global`，但`web worker`环境，只有`self`，`ES2020`为了统一又推出了`globalThis`

  下面只考虑浏览器环境和`node`环境

  ```js
  // 浏览器环境
  console.log(this === window); // true
  // node环境
  console.log(this === global); // true
  ```

- 函数上下文

  总结就是`this`总是指向调用函数的对象，即谁调用的就指向谁

  - 简单调用

  ```js
  function f() {
    return this;
  }

  // 浏览器环境
  f1() === window; // true
  // node环境
  f1() === global; // true

  // 严格模式，如果执行上下文中this未定义，则this === undefined
  function f2() {
    'use strict';
    return this;
  }

  f2() === undefined; // true
  window.f2() === window; // true
  ```

  - 作为对象方法调用

  ```js
  const obj = {
    a: 1,
    f: function() {
      return this.a;
    },
  };

  obj.f(); // 1， this指向的是obj，返回的是obj.a
  const f = obj.f;
  f(); // undefined，this指向的是window，返回的是window.a, 所以是undefined
  ```

  - `call` 和 `apply`

  `call`和`apply`是`Function`原型链上的方法，可以改变`this`指向

  `call`和`apply`的区别在于函数的参数传递，`apply`接收一个数组（`Array`，都以`A`开头，方便记忆）作为原函数的参数

  ```js
  const obj1 = {
    a: 1,
    f: function() {
      return this.a;
    },
  };

  const obj2 = {
    a: 2,
  };

  obj.f(); // 1
  obj.f.call(obj2); // 2
  obj.f.apply(obj2); // 2
  ```

  - `bind`

  `bind`也是`Function`原型链上的方法，`ES6`新增的，作用是绑定`this`，不随调用变化，`call`和`apply`也不能改变

  `bind`只能绑定一次，第二次绑定无效

  ```js
  function f() {
    return this.a;
  }

  const g = f.bind({ a: 'bind one' });

  const h = g.bind({ b: 'bind two ' });

  g(); // bind one
  h(); // bind one

  const a = {
    a: 'not bind',
    f,
    g,
    h,
  };

  a.f(); // not bind
  a.g(); // bind one
  a.h(); // bind one

  g.call({ a: 'bind vs call' }); // bind one
  ```

  - 箭头函数

  箭头函数除了写法简洁之外，还有一个重要的特点就是没有自己的`this`，也没有`prototype`属性，所以不能当作构造函数

  箭头函数里的`this`总是指向它创建的时候的`this`

  ```js
  const obj = {
    a: 1,
    f: () => {
      return this.a;
    },
  };

  obj.f(); // undefined，this指向的是window，返回的是window.a, 所以是undefined
  window.a = 2;
  obj.f(); // 2
  ```

  - 构造函数

  构造函数的`this`指向一个新的对象，关于构造函数和`new`操作符，下面还会详细讲到

  ```js
  function C() {
    console.log(this);
    this.a = 1;
    console.log(this);
  }
  const obj = new C(); // {}, { a: 1 }
  obj; // { a: 1 }
  obj.a; // 1
  ```

  - `dom`事件处理函数中的`this`

  `this`总是指向绑定事件的元素

  ```js
  function handleClick(e) {
    console.log(this); // 总是document对象
    console.log(e.target); // 总是点击的元素
    console.log(this === e.target); // 可能是true，也可能是false，在这里只能是false，因为点击的元素不会是document，而是下面具体的元素
  }

  document.addEventListener('click', handleClick, false);
  ```

  - `dom`内敛事件处理函数中的`this`

  在框架时代，这种写法已经很少用到了

  ```html
  <!-- this指向button -->
  <button onclick="alert(this.tagName.toLowerCase());">Show this</button>
  <!-- this指向window -->
  <button onclick="alert((function(){return this})());">Show inner this</button>
  ```

### new 操作符与构造函数

前面提到构造函数的`this`总是指向一个新对象，函数当作构造函数使用时必须加`new`操作符，来看看`new`操作符具体做了什么

```js
function Square(w, h) {
  this.w = w;
  this.h = h;
}

Square.prototype.area = function() {
  return this.w * this.h;
};

const square = new Square(3, 5);

square;

square.area();
```

上面是一个简单的构造函数的例子，构造函数或者说`new`操作符做了下面几件事情：

- 声明一个新的对象并赋值给`this`
- 执行函数体，通常是修改`this`的属性
- 如果没有返回值或者返回值不是对象，则把构造函数的`prototype`属性赋值给`this`的`__proto__`属性并返回`this`
- 如果返回值是对象，则返回该对象

注意上面提到的**构造函数的`prototype`属性赋值给`this`的`__proto__`属性**，这其实已经体现出原型链是什么了

在打印对象的时候，现代浏览器已经不会显示`__proto__`属性了，而是显示`[[Prototype]]`，虽然目前仍然能够访问`__proto__`属性，但是[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto)上已经标明此属性不属于`web`标准，可能会被废弃，推荐使用`Object.getPrototypeOf()`

### prototype 与**proto**

前面构造函数提到的`prototype`与`__proto__`的关系已经表明原型链是怎么形成的，原型链离不开这两个属性，但偏偏这两个属性很像，都有`proto`，所以很容易混淆了

之前总结的理解原型链的规则：

- 通用规则
  1. 只有函数才有`prototype`属性
  2. 每个对象都有`__proto__`属性，函数也是对象，所以函数也有`__proto__`属性
  3. 对象是由函数生成的
  4. 生成对象时，对象的`__proto__`属性指向函数的`prototype`
  5. 函数的`prototype`默认有两个属性，一个是`constructor`，指向函数自身，另一个是`__proto__`，指向`Object.prototype`

```js
const obj = {}; // 等同于 const obj = new Object()
obj.__proto__ === Object.prototype; // true

const f = function() {};
f.__proto__ === Function.prototype; // true
f.prototype.constructor === f; // true
f.prototype.__proto__ === Object.prototype; // true
```

特殊情况，`Object.prototype.__proto__ === null`，也可以说原型链的终点是`Object.prototype`

原型链的作用之一是共享属性，在查找一个对象的属性时，首先会查找对象自身的属性，没找到的话会继续往原型链上查找，直到找到，或者达到原型链的终点为止

```js
const obj = {
  a: 1,
  b: 2,
  f: function() {
    return this.a + this.b;
  },
};

const p = Object.create(obj); // p.__proto__ = obj
p; // {}
p.a; // 1, p是个空对象，本身没有a属性，但其原型链上有
p.b; // 2
p.f(); // 3,

p.a = 3;
p.b = 4;
p; // { a: 3, b: 4 }
p.f(); // 7，p本身就有属性a和b，所以用的是自己的a和b，而不是原型链上的值
```

### typeof 和 instanceof 以及 hasOwnProperty

上面提到的在查找对象的属性时，会在原型链上查找，那么随之而来的问题是如何判断某个属性是对象本身的还是原型链上的，类似的问题还有如何判断数据类型，如何判断对象类型，这些问题都是业务开发用得比较少但面试又经常问的一些点

- 如何判断数据类型？

  `typeof`判断能够返回基本的数据类型，但是有两个特例，一个是`typeof null`返回`object`，另一个是`typeof func`返回`function`，而`function`不属于基本类型

  ```js
  typeof null; // object

  typeof undefined; // undefined

  typeof 0; // number

  typeof 0n; // bigint

  typeof '0'; // string

  typeof true; // boolean

  typeof Symbol(); // symbol

  typeof {}; // object

  typeof function() {}; // function
  ```

  所以在使用`typeof`判断`object`的时候要注意区分`null`

- 如何判断对象类型？

  `typeof`只能够判断是否是`object`，如果想继续判断是否是`array`，或者其他对象，该怎么做？

  `instanceof`不推荐使用，其用法`obj instanceof constructor`能够判断构造函数的`prototype`(`constructor.prototype`)是否出现在对象`obj`的原型链上，即对象或对象的原型链是否由构造函数生成，但问题是对象的原型链和构造函数的`prototype`都
  可以修改，会导致判断结果不准确，来看下面的例子

  ```js
  function C() {}

  var o = new C();

  o instanceof C; // true

  C.prototype = {};

  o instanceof C; // false
  ```

  聪明的开发者想到了其他的办法，利用`Object.prototype.toString.call`来判断

  ```js
  Object.prototype.toString.call(); // [object Undefined]

  Object.prototype.toString.call(null); // [object Null]

  Object.prototype.toString.call(0); // [object Number]

  Object.prototype.toString.call(0n); // [object BigInt]

  Object.prototype.toString.call(true); // [object Boolean]

  Object.prototype.toString.call(Symbol()); // [object Symbol]

  Object.prototype.toString.call({}); // [object Object]

  Object.prototype.toString.call(function() {}); // [object Function]

  Object.prototype.toString.call([]); // [object Array]

  function C() {}

  var o = new C();

  Object.prototype.toString.call(o); // [object Object]
  ```

  下面是一个完整的类型判断函数

  ```js
  function typeOf(obj) {
    const type = typeof obj;

    if (type === 'object') {
      const toStringType = Object.prototype.toString.call(obj);

      return toStringType
        .split(' ')[1]
        .split(']')[0]
        .toLocaleLowerCase();
    }

    return type;
  }
  ```

- 如何判断对象属性是本身的还是原型链上的？

  `hasOwnProperty`用于判断对象自身是否有某个属性，不会查找原型链

## Event Loop

事件循环，通常指浏览器或者`node`如何执行我们的代码，在面试中经常会给一段代码问先打印的顺序是什么，这里考的就是对事件循环的理解，理解事件循环必须先了解下面几个概念

- 调用栈

  栈是计算机的一种数据结构，其特点是，先进后出

  调用栈可以理解为我们在一个函数里调用另外一个函数，先执行完成的是另外一个函数，然后执行完成的是本函数，例如`a(b(c()))`，调用栈先把函数`a`放进去，`a`调用函数`b`于是函数`b`也被压进栈里，同理`c`也被压进栈，然后`c`执行完了先出栈（后进先出）,然后`b`出栈，然后`a`出栈，调用栈为空

- 任务队列

  队列也是计算机的一种数据结构，其特点是，先进先出

  任务队列，我们可以把`js`的执行想象成一个一个的任务，调用栈为空的时候，主线程会去任务队列里拿新的任务放到调用栈，当执行到异步任务时，会把异步的回调加到任务队列

  异步回调加入任务队列又分两种情况，或者说异步任务分为两种，一种是宏任务(例如`setTimeout`)，另一种是微任务(例如`Promise.then`)

  宏任务与微任务的区别是，微任务排队有优先权，可以插队，也就是说会比宏任务优先执行

前面提到，调用栈为空时，主线程会去任务队列里拿新的任务放到调用栈，事件循环就是主线程不断从任务队列读取任务放入调用栈执行直到任务队列为空的这一过程，总体原则是：**先同步再异步，先微任务再宏任务**

下面用具体的例子来说明这一过程

```js
console.log(1); // 同步任务，直接执行，打印1

setTimeout(() => {
  // 异步任务，宏任务，加入任务队列，取名S1
  console.log(2);

  setTimeout(() => {
    // 异步任务，宏任务，加入任务队列，取名S2
    console.log(3);
  }, 0);
}, 0);

new Promise(resolve => {
  // 同步任务
  console.log(4);

  setTimeout(() => {
    // 异步任务，宏任务，取名S3
    console.log(5);
    resolve(); // 将微任务放入任务队列
  }, 0);
}).then(() => {
  // 异步任务，微任务，取名T1
  console.log(6);
  setTimeout(() => {
    // 异步任务，宏任务，取名S4
    console.log(7);
  });
});

console.log(8); // 同步任务
```

可以先思考一下，打印的顺序是什么

<details>
  <summary>查看答案</summary>

答案是先打印`1,4,8`,返回`undefined`,接着打印`2,5,6,3,7`，下面分解下执行步骤

1.  执行同步任务，打印 1
2.  遇到异步任务，将回调 S1 加入任务队列，此时队列是 S1
3.  执行 Promise 同步任务，打印 4
4.  遇到异步任务，将回调 S3 加入任务队列，此时队列是 S3->S1
5.  执行同步任务，打印 8，此时同步任务已经执行完，返回`undefined`, 调用栈为空，所以去任务队列里拿新的任务 S1
6.  执行任务 S1，打印 2
7.  遇到异步任务，将回调 S2 加入队列，此时队列是 S2->S3
8.  S1 执行完毕，调用栈为空，去任务队列拿新任务 S3
9.  执行 S3， 打印 5
10. resolve 将微任务 T1 放入任务队列，且排在宏任务前面，此时任务队列是 S2->T1
11. S3 执行完毕，调用栈为空，去任务队列拿新任务 T1
12. 执行 T1，打印 6
13. 遇到异步任务，将回调 S4 放入任务队列，此时任务队列是 S4->S2
14. T1 执行完毕，调用栈为空，去任务队列拿新任务 S2
15. 执行 S2，打印 3
16. S2 执行完毕，调用栈为空，去任务队列拿新任务 S4
17. 执行 S4，打印 7
18. 任务队列为空，执行完毕

</details>

上面只有`Promise`的例子，`js`中异步处理方案还有`Generator`函数以及`async`函数，下面分别来看一下

首先单独观察一下`Generator`函数是怎么执行的，暂时不用纠结`Generator`

```js
function* makeGenerator() {
  console.log(1);
  yield console.log(2);
  console.log(3);
  yield console.log(4);
  console.log(5);
}

const g = makeGenerator(); // 没有打印任何内容

g.next(); // 打印1，2，返回{value: undefined, done: false}

console.log(6); // 打印6

g.next(); // 打印3，4，返回{value: undefined, done: false}

console.log(7); // 打印7

g.next(); //打印5，返回{value: undefined, done: true}
```

我们运行一下可以看到打印结果是`1,2,6,3,4,7,5`，最后返回`{value: undefined, done: true}`

`Generator`函数的执行，并不会执行我们看到的函数体，而是返回一个可迭代对象，调用可迭代对象的`next`方法才开始真正执行函数体，且每次碰到`yield`就会把执行权交给主线程，这里是执行权交换的过程，我觉得不能用宏任务微任务来理解，`yield`和`next`方法是`Generator`函数和主线程交换数据的方法，具体的可以在`js`异步处理章节查看

`async`函数是`Generator`函数的语法糖，但两者表现形式是有区别的, 上面的例子改用`async`函数来模拟

```js
async function makeAsync() {
  console.log(1);
  await (console.log(2),
  new Promise(resolve => {
    console.log(3);
    setTimeout(() => {
      console.log(4);
      resolve();
    }, 0);
  }));
  console.log(5);
  await (console.log(6),
  setTimeout(() => {
    console.log(7);
  }, 0));
  console.log(8);
}

const a = makeAsync();

console.log(9);

a.then(() => {
  console.log(10);
});

console.log(11);
```

我们再运行一下，可以看到先打印`1,2,3,9,11`，打印完之后，返回了一个`undefined`，接着继续打印`4,5,6,8,10,7`

不理解的话不要慌，`async`函数只是一个语法糖，我们可以用`Promise`来改写它，`await`后面如果不是一个`Promise`，那么可以理解为调用`Promise.resolve()`，即`await 123`可以理解为`await Promise.resolve(123)`, 进一步理解为`await new Promise(resolve => resolve(123))`

所以，上面的`async`函数的例子可以用`Promise`改写为

```js
function makeAsync() {
  return new Promise(resolve1 => {
    console.log(1);
    console.log(2); // 逗号表达式
    new Promise(resolve2 => {
      console.log(3);

      setTimeout(() => {
        console.log(4);
        resolve2();
      }, 0);
    }).then(() => {
      console.log(5);
      console.log(6); // 逗号表达式
      new Promise(resolve3 => {
        resolve3(
          setTimeout(() => {
            console.log(7);
          }, 0),
        );
      }).then(() => {
        console.log(8);
        // 这里不能少resolve1
        // async函数报错会执行reject，return或执行完相当于resolve，并且要等所有await执行完才resolve
        resolve1();
      });
    });
  });
}

const a = makeAsync();

console.log(9);

a.then(() => {
  console.log(10);
});

console.log(11);
```

改写成`Promise`之后可以尝试用**先同步再异步，先微任务再宏任务**来理解

---

到这里关于各种代码执行顺序的面试题应该都能解决了，平时业务开发也不会去纠结这种执行顺序的问题，但是我觉得作为开发，至少要了解的是同步和异步，不然写出下面的代码还不知道为什么返回的`result`是空字符串就让人很无语了

```js
function getResult() {
  let result = '';

  new Promise(resolve => {
    setTimeout(() => {
      // 模拟接口请求
      resolve('result');
    }, 300);
  }).then(res => {
    result = res;
  });

  return result;
}

const res = getResult(); // 结果是空字符串
```

## 总结

到这里，我觉得`js`的基础就已经"讲完了"，如果了解上面的全部内容，我觉得就是一名合格的开发者

但是，`js`的基础远不止这么些内容，我觉得其他的内容要么比较简单或者很少用到，比如位运算、`Math`，`Date`等，这一部分不会去深究它，要么比较复杂或者语法比较新，比如`Symbol`，`Iterator`，`Proxy`等，这部分会单独去研究

## 参考链接

[ECMAScript 6 入门](https://es6.ruanyifeng.com/)

[javascript.info](https://javascript.info/)

[ECMAScript 规范](https://262.ecma-international.org/12.0/#sec-strict-equality-comparison)
