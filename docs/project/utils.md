---
title: 常用工具函数
order: 4
group:
  title: 个人项目
  order: 1
---

# 工具函数

在平时的业务开发中会有很多相似的情况需要处理，比如防抖/节流，保留 2 位小数，避免浮点数运算出错等

## 防抖 debounce

函数在`N`秒内只执行一次，如果`N`秒内再次触发，则重新计时，防抖`debounce`控制的是函数执行的次数

按使用场景，防抖可以分为立即执行和延迟执行，常见的立即执行的例子是按钮的点击，我们希望点击之后立即执行，也希望重复点击不会重复执行，常见的延迟执行的例子是搜索框，我们希望用户输入停顿几秒后开始搜索，如果用户一直在输入就不触发搜索

```js
/**
 * @param fn
 * @param wait
 * @param immediate
 */
function debounce(fn, wait, immediate = false) {
  let timer = null;

  return function(...args) {
    const context = this;
    if (timer) {
      clearTimeout(timer);
    } else if (immediate) {
      fn.apply(context, args);
    }
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
}
```

## 节流

函数在`N`秒内只执行一次，重复触发会重复执行，函数节流控制的是函数执行的频率，节流函数首次触发一般是立即执行的，常见的使用场景有`scroll`和`resize`事件

```js
/**
 * @param fn
 * @param wait
 */
function throttle(fn, wait) {
  let lastLock = false; // 函数执行的锁

  return function(...args) {
    if (lastLock) return;
    const context = this;
    fn.apply(context, args);
    lastLock = true;
    setTimeout(() => {
      // 定时把锁打开
      lastLock = false;
    }, wait);
  };
}
```

## 保留 n 位小数

```js
/**
 * 保留n为小数，可选择补零
 * @param {number} num
 * @param {number} fraction  n位小数，默认为2
 * @param {boolean} zeroFill 是否补零，默认false
 * @returns
 */
const keepDecimal = (num, fraction = 2, zeroFill = false) => {
  const res = `${Math.round(num * 10 ** fraction) / 10 ** fraction}`;

  if (fraction > 0 && zeroFill) {
    const [int, decimal = ''] = res.split('.');
    const zeroCount = fraction - decimal.length;
    let newDecimal = decimal;
    if (zeroCount > 0) {
      newDecimal += new Array(zeroCount + 1).join('0');
    }
    return `${int}.${newDecimal}`;
  }
  return res;
};
```

## 数字显示千分位分隔符

金额显示一般会带有千分位分割符，例如`123456.78`，会显示为`123,456.78`

```js
/**
 * 数字千分位格式化 - 循环
 * @param {number} number
 * @returns
 */
export const numberSplitThousands = (number = 0) => {
  const [numberInt, numberDecimal] = `${number}`.split('.'); // 分成整数部分和小数部分
  const numberArr = numberInt.split(''); // 整数部分分成数组

  const len = numberArr.length; //
  let insert = len % 3 || 3; // 被3整除的时候
  let count = 0;
  while (insert < len) {
    numberArr.splice(insert, 0, ',');
    count += 1;
    insert = insert + count + 3;
  }

  return numberArr.join('') + (numberDecimal ? `.${numberDecimal}` : '');
};
```

```js
/**
 * 数字千分位格式化 - 正则
 * @param {number} number
 * @returns
 */
export const numberSplitThousands = (number = 0) => {
  const res = `${number}`.replace(/\d+/, (
    n, // 先提取整数部分
  ) => n.replace(/(\d)(?=(\d{3})+$)/g, $1 => `${$1},`));
  return res;
};
```

## 浮点数运算
