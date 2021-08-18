---
title: Symbol
order: 2
group:
  title: javascript
  path: /js
  order: 4
---

# Symbol

`Symbol`是`ES6`新增的一种数据类型，其特点是独一无二，每次调用`Symbol()`都会返回不同的 🈯 值

## 为什么加入 Symbol

在`ES5`中，对象的属性名只能是字符串(`{0: 'a', 1: 'b'}`的`0`和`1`最终其实也是字符串)，这样带来的问题是，对象的属性可能被覆盖

`ES6`规范中规定，对象的属性可以是字符串和`Symbol`值，这样就可以为对象添加独一无二的属性和方法

这是通常解释为什么要加入`Symbol`类型的原因，但我觉得还是没有说服力，主要是目前没找到`Symbol`的适用场景，业务开发很少用到，框架开发可能用到一点

我想介绍`Symbol`的主要原因是全局的`Symbol`可以定义对象的一些底层方法，比如`Symbol.iterator`定义的是对象的迭代器方法，被`for...of`使用，`Symbol.toPrimitive`定义了对象转换为基本类型(`string`，`number`等)的方法，`Symbol.toStringTag`用于对象的默认描述的字符串值，被`Object.prototype.toString()`使用

在了解完这些之后会有一种恍然大悟的感觉，原来`for...of`是这么遍历对象的，原来对象转换为原始值可以自定义

## Symbol 的 API

```js
// 直接使用Symbol()，会返回一个symbol值
const mySymbol = Symbol();

// Symbol不能用于构造函数，所以 new Symbol()会报错
const mySymbol = new Symbol(); // 报错

// Symbol的特点是每次返回独一无二的值，所以Symbol() === Symbol()返回false
Symbol() === Symbol(); // false

// Symbol函数可以接收一个参数作为Symbol的描述，但仅仅只是描述，不影响值
Symbol('s') === Symbol('s'); // 同样返回false

// 如果想用同一个Symbol，可以用Symbol.for(key)，Symbol.for()会注册一个全局Symbol，如果已经存在则直接返回已存在的Symbol
Symbol.for('s') === Symbol.for('s'); // true

// Symbol.keyFor(symbol)返回的是Symbol的key
const mySymbol = Symbol.for('s');
Symbol.keyFor(mySymbol); // s
```

## Symbol 作为对象的属性名时，不会被`for...in`，`for,,,of`遍历，也不会被`Object,keys()`，`Object.getOwnPropertyNames()`和`JSON.stringify()`返回

但是可以通过`Object.getOwnPropertySymbols()`得到，也可以通过`Reflect.ownKeys()`得到，`Reflect`是`ES6`是对`Object`的一个补充和优化，暂时不用了解

```js
const obj = {};
const a = Symbol('a');
const b = Symbol('b');

obj[a] = 'a';
obj[b] = 'b';

Object.keys(obj); // []
Object.getOwnPropertyNames(obj); // []
JSON.stringify(obj); // "{}"

Object.getOwnPropertySymbols(obj); // [Symbol(a), Symbol(b)]
```

## 全局 Symbol 及其作用

前面提到，全局的`Symbol`可以定义对象的一些默认行为，下面一起来看一下

### Symbol.toPrimitive

定义了对象转换为原始值的时候调用的函数，函数接收一个字符串参数，称之为`hint`，`hint`的值可以`string`，`number`和`default`，表明对象转换为原始值时，可以转换为`string`，`number`，`default`即默认行为

在`ES5`中，有部分面试题会考到对象的`toString`属性和`valueOf`属性，这两个属性是`ES5`中对象转换为`string`或`number`时调用的方法

所以总结下来，目前对象转换成原始值的方法为：

- 如果对象有`[Symbol.toPrimitive]`属性，则调用这个属性的函数
- 否则，如果转换成字符串（`alert`等），则优先调用`toString`方法，没有`toString`方法则调用`valueOf`方法
- 否则，如果转换成数字(数学运算)，则优先调用`valueOf`方法，没有`valueOf`方法则调用`toString`方法

```js
const obj = {
  name: 'obj',
  value: 1,
  toString() {
    return this.name;
  },
  valueOf() {
    return this.value;
  }
}

1 + obj; // 2，和下面的减法有区别，可以看下面Symbol.iterator的例子
1 - obj; // 0
alert(obj); // 弹出obj，而不是默认的[object Object]

const obj2 = {
  name: 'obj2',
  value: 2,
  [Symbol.toPrimitive]: function(hint) {
    console.log(hint);
    switch(hint) {
      case 'string': {
        return this.name;
      }
      case 'number':
      case 'default':
        return this.value
    }
  }
}

1 + obj2; // 打印default，返回3， 说明采取的是default hint

1 - obj2； // 打印number，返回-1，说明采用的是number hint

alert(obj2); // 打印string，弹出obj，而不是默认的[object Object]

```

### Symbol.iterator

函数，返回一个遍历器对象，定义的是对象如何被遍历的，遍历即依次访问对象的属性，`ES6`中主要指的是`for...of`循环

遍利器对象是一个拥有`next`方法的对象，`next`方法返回形如`{value: '', done: false}`的值，`value`表示遍历的值，`done`表示遍历是否完成，`Generator`函数返回的正是一个遍历器对象

```js
const arr = [1, 2, 3];
const obj = {
  a: 1,
  b: 2,
  c: 3,
};

// 数组上有原生的Symbol.iterator属性
console.log(arr[Symbol.iterator]); // ƒ values() { [native code] }

// 对象默认没有Symbol.iterator属性，所以不能遍历
console.log(obj[Symbol.iterator]); // undefined

for (let key of arr) {
  console.log(key); // 依次打印1，2，3
}

for (let key of obj) {
  console.log(key); // 报错，Uncaught TypeError: obj is not iterable，obj是不可遍历的
}
```

上面我们可以看到，普通对象本身没有遍历器属性，所以不能用`for...of`来遍历，所以一般遍历对象是用`Object.keys()`取出对象的属性数组，再遍历数组

```js
const obj = {
  a: 1,
  b: 2,
  c: 3,
};

const keys = Object.keys(obj);

for (let key of keys) {
  console.log(key, obj[key]);
}
```

想用`for...of`遍历对象，对象必须有`Symbol.iterator`属性

```js
const obj = {
  from: 2,
  to: 5,
  [Symbol.iterator]: function() {
    return {
      current: this.from,
      last: this.to,
      next() {
        if (this.current <= this.last) {
          return {
            value: this.current++,
            done: false,
          };
        }

        return {
          value: undefined,
          done: true,
        };
      },
    };
  },
};

for (let key of obj) {
  console.log(key);
}

// 依次打印2，3，4，5
```

### 其他

还有很多其他内置的全局`Symbol`就不一一列举了，可以去参考资料里查看

## 参考资料

[阮一峰 - ECMAScript 6 入门 - Symbol](https://es6.ruanyifeng.com/#docs/symbol)

[javascript.info - Symbol](https://zh.javascript.info/symbol)

[MDN - Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
