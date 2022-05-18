---
title: 异步处理和Promise
order: 2
group:
  title: javascript
  path: /js
  order: 4
---

# Promise/A+规范

> 一份开源的、健全的、可交互的`JavaScript Promise`标准 —— 由已实现的开发者提供、供想实现的开发者参考

一个`Promise`代表的是一个异步操作的最终结果。与`Promise`交互的主要途径是通过`then`方法，`then`方法注册了一个回调函数来接收`Promise`的最终结果或者接收`Promise`不能被解决（`fulfilled`）的原因

本规范详细定义了`then`方法的具体表现，为所有遵循`Promise/A+`规范的`Promise`实现提供了基本的参照，所以，本规范应该被认为是稳定的，尽管`Promise/A+`组织可能偶尔修改这个规范来达到适配一些新发现的边角情况，这些改动基本很小且向下兼容。我们只会在经过谨慎的考虑，讨论和测试之后，才会大幅度或者不向下兼容地修改本规范的内容

从历史角度看，本规范明确了早期`Promise/A`规范中的提议的行为条款，扩展了一些默认行为，删减了一些没有明确定义的以及一些存在问题的

最后，`Promise/A+`规范的核心部分并没有规定如何去新建、解决或者拒绝一个`Promise`，而是专注于提供一个可交互的`then`方法，未来其他规范可能会设计上述主题（如何去新建、解决或者拒绝一个`Promise`）

## 1. 术语

- `promise`是一个对象或者函数，他拥有遵循本规范的`then`方法
- `thenable`是一个拥有`then`方法的对象或者函数
- `value`是一个合法的`javascript`值，包括`undefined`，`thenable`和`promise`
- `exception`是通过`throw`语句抛出的值
- `reason`是表明`promise`为什么被拒绝的原因

## 2. 要求

### 2.1 Promise 的状态

一个`promise`的状态只能是`pending`，`fulfilled`或者`rejected`中的一个

- 当处于`pending`状态时，`promise`
  - 可能转向`fulfilled`或者`rejected`状态
- 当处于`fulfilled`状态时，`promise`
  - 不能转向其他状态
  - 必须有一个`value`，且`value`不会发生变化
- 当处于`rejected`状态时，`promise`
  - 不能转向其他状态
  - 必须有一个`reason`，且`reason`不会发生变化

### 2.2 `then`方法

`promise`必须提供一个`then`方法来访问它当前的或者最终`value`或`reason`

`promise`的`then`方法接收两个参数：

```js
promise.then(onFulfilled, onRejected);
```

- `onFulfilled`和`onRejected`都是可选参数
  - 如果`onFulfilled`不是函数，那么必须被忽略
  - 如果`onRejected`不是函数，那么必须被忽略
- 如果`onFulfilled`是函数
  - 必须在`promise`状态变为`fulfilled`之后执行，且把`promise`的`value`作为`onFulfilled`函数的第一个参数
  - 不能在`promise`状态变为`fulfilled`之前执行
  - 不能执行多次，只能执行一次
- 如果`onRejected`是函数
  - 必须在`promise`状态变为`rejected`之后执行，且把`promise`的`reason`作为`onRejected`函数的第一个参数
  - 不能在`promise`状态变为`rejected`之前执行
  - 不能执行多次，只能执行一次
- `onFulfilled`和`onRejected`只能在[执行上下文](https://es5.github.io/#x10.3)栈仅包含`platform code`之后执行，这句话的理解参考注释 1
- `onFulfilled`和`onRejected`必须作为函数调用（即：没有`this`值）,这句话的理解参考注释 2
- `then`方法可能在同一个`promise`被调用多次
  - 当`promise`状态是`fulfilled`时，所有`onFulfilled`回调必须按`then`方法注册的顺序执行
  - 当`promise`状态是`rejected`时，所有`onRejected`回调必须按`then`方法注册的顺序执行
- `then`方法必须返回一个`promise`，见注释 3

  ```js
  promise2 = promise1.then(onFulfilled, onRejected);
  ```

  - 如果`onFulfilled`或者`onRejected`返回一个值`x`，则运行下面的**2.3 Promise 解决程序**`[[Resolve]](promise2, x)`
  - 如果`onFulfilled`或者`onRejected`抛出一个异常`e`，则`promise2`必须以`e`作为`reason`变为`rejected`状态
  - 如果`onFulfilled`不是一个函数而`promise1`的状态是`fulfilled`，则`promise2`必须以相同的`value`变为`fulfilled`状态
  - 如果`onRejected`不是一个函数而`promise1`的状态是`rejected`，则`promise2`必须以相同的`reason`变为`rejected`状态

### 2.3 Promise 解决程序

`Promise`解决程序是一个抽象的操作，它接收一个`promise`和一个`value`作为输入，被描述为`[[Resolve]](promise, x)`，如果`x`是一个`thenable`，即`x`的表现看起来像一个`promise`，解决程序会尝试使`promise`接收`x`的状态，否则，解决程序会以`x`作为`value`来使`promise`变为`fulfilled`状态

这种对`thenable`的处理方法`promise`的实现变得更具有通用性，只要他们暴露一个遵循`Promise/A+`规范的`then`方法即可，同时也让遵循`Promise/A+`规范的`Promise`实现与那些不太遵循规范的实现能够良好的共存

执行`[[Resolve]](promise, x)`时按以下步骤

- 如果`promise`和`x`指向同一个对象，则以`TypeError`为`reason`来使`promise`状态变为`rejected`
- 如果`x`是一个`promise`，则使`promise`接受`x`的状态，这里见注释 4
  - 如果`x`是`pending`状态，则`promise`必须保持`pending`状态，直到`x`变为`fulfilled`或者`rejected`
  - 如果`x`是`fulfilled`状态，则以相同的`value`来使`promise`变为`fulfilled`
  - 如果`x`是`rejected`状态，则以相同的`reason`来使`promise`变为`rejected`
- 如果`x`是一个对象或者函数
  - 把`x.then`赋值给`then`，见注释 5
  - 如果在取`x.then`的值时抛出异常`e`，则以`e`为`reason`使`promise`变为`rejected`状态
  - 如果`then`是一个函数，则以`x`为`this`调用它，第一个参数为`resolvePromise`，第二个参数为`rejectPromise`
    - 如果`resolvePromise`以参数`y`被调用，则执行`[[Resolve]](promise, y)`
    - 如果`rejectPromise`以参数`r`被调用，则以`r`为`reason`使`promise`状态变为`rejected`
    - 如果`resolvePromise`或者`rejectPromise`都被调用了，或者以同一个参数调用了多次，那么只有第一个调用有效，其他调用会被忽略
    - 如果运行`then`时抛出异常`e`
      - 如果`resolvePromise`或`rejectPromise`已经被调用，则忽略它
      - 否则，以`e`作为`reason`使`promise`变为`rejected`状态
  - 如果`then`不是一个函数，以`x`为`value`使`promise`变为`fulfilled`状态
- 如果`x`不是对象或者函数，则以`x`为`value`来使`promise`变为`fulfilled`状态

如果`promise`被一个循环的`thenable`链变为`fulfilled`状态，`[[Resolve](promise, thenable)]`的递归特性最终会导致`[[Resolve](promise, thenable)]`再次被调用。上述算法不强制，但是鼓励开发者识别这样的循环是否存在，如果存在则以一个可识别的`TypeError`来使`promise`变为`rejected`状态，参见注释 6

## 3. 注释

1. 这里`platform code`表示引擎、环境和`promise`的实现代码，事实上，这一要求确保了`onFulfilled`和`onRejected`是异步执行的，在一次事件循环之后`then`方法已全新的栈被调用，这一要求既可以用**宏任务**，比如`setTimeout`或者`setImmediate`，来实现，也可以用**微任务**来实现，比如`MutationObserver`(浏览器端)或者`process.nextTick`(`nodejs`端)。由于`promise`的实施被当作`platform code`，它本身就可能包含一个任务队列

2. 在严格模式下，`this`是`undefined`，非严格模式下，`this`是全局对象

3. 满足所有条件的情况下，可以允许`promise2 === promise1`，但每一种实现方式都必须明确指出是否允许`promise2 === promise1`，以及在什么情况下`promise2 === promise1`

4. 通常来讲，`x`符合本规范的情况下才能被称为真正的`promise`，这一规则允许那些特例实现接受符合已知要求的 Promises 状态。

5. 这步我们先是存储了一个指向 x.then 的引用，然后测试并调用该引用，以避免多次访问 x.then 属性。这种预防措施确保了该属性的一致性，因为其值可能在检索调用时被改变。

6. 实现不应该对 thenable 链的深度设限，并假定超出本限制的递归就是无限循环。只有真正的循环递归才应能导致 TypeError 异常；如果一条无限长的链上 thenable 均不相同，那么递归下去永远是正确的行为
