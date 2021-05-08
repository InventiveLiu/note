'use strict';

var _interopRequireDefault = require('@babel/runtime-corejs3/helpers/interopRequireDefault');

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime-corejs3/helpers/defineProperty'),
);

const arrowFunc = () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
  };
  const { a, ...rest } = obj;
  console.log(rest);
};

const asyncFunc = async () => {
  const result = await fetch('www.baidu.com');
  console.log(result);
};

const funcA = (a = 1, ...rest) => {
  console.log(a);
  console.log(rest);
};

class Book {
  constructor() {
    (0, _defineProperty2.default)(this, 'name', 'book');
    (0, _defineProperty2.default)(this, 'getName', () => {
      return this.name;
    });
  }

  getNameA() {
    return this.name;
  }
}

(0, _defineProperty2.default)(Book, 'staticName', 'book static');
(0, _defineProperty2.default)(Book, 'staticFunc', () => {
  return Book.staticName;
});
