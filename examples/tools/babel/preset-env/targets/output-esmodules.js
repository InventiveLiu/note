'use strict';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      _next(undefined);
    });
  };
}

var arrowFunc = () => {};

var asyncFunc = /*#__PURE__*/ (function() {
  var _ref = _asyncToGenerator(function*() {
    var result = yield fetch('www.baidu.com');
    console.log(result);
  });

  return function asyncFunc() {
    return _ref.apply(this, arguments);
  };
})();

class Book {
  constructor() {
    _defineProperty(this, 'name', 'book');

    _defineProperty(this, 'getName', () => {
      return this.name;
    });
  }

  getNameA() {
    return this.name;
  }
}

_defineProperty(Book, 'staticName', 'book static');

_defineProperty(Book, 'staticFunc', () => {
  return Book.staticName;
});
