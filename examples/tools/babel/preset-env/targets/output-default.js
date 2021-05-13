'use strict';

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

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

var arrowFunc = function arrowFunc() {
  var obj = {
    a: 1,
    b: 2,
    c: 3,
  };

  var a = obj.a,
    rest = _objectWithoutPropertiesLoose(obj, ['a']);

  console.log(rest);
};

var asyncFunc = /*#__PURE__*/ (function() {
  var _ref = _asyncToGenerator(
    /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
      var result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              _context.next = 2;
              return fetch('www.baidu.com');

            case 2:
              result = _context.sent;
              console.log(result);

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee);
    }),
  );

  return function asyncFunc() {
    return _ref.apply(this, arguments);
  };
})();

var funcA = function funcA(a) {
  if (a === void 0) {
    a = 1;
  }

  console.log(a);

  for (
    var _len = arguments.length,
      rest = new Array(_len > 1 ? _len - 1 : 0),
      _key = 1;
    _key < _len;
    _key++
  ) {
    rest[_key - 1] = arguments[_key];
  }

  console.log(rest);
};

var Book = /*#__PURE__*/ (function() {
  function Book() {
    var _this = this;

    this.name = 'book';

    this.getName = function() {
      return _this.name;
    };
  }

  var _proto = Book.prototype;

  _proto.getNameA = function getNameA() {
    return this.name;
  };

  return Book;
})();

Book.staticName = 'book static';

Book.staticFunc = function() {
  return Book.staticName;
};
