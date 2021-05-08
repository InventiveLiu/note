'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _classCallCheck2 = _interopRequireDefault(
  require('@babel/runtime/helpers/classCallCheck'),
);

var _createClass2 = _interopRequireDefault(
  require('@babel/runtime/helpers/createClass'),
);

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
);

var _regenerator = _interopRequireDefault(
  require('@babel/runtime/regenerator'),
);

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator'),
);

var _objectWithoutProperties2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectWithoutProperties'),
);

require('core-js/modules/es.object.to-string.js');

require('core-js/modules/es.promise.js');

require('core-js/modules/es.function.name.js');

var p = new Promise();

var arrowFunc = function arrowFunc() {
  var obj = {
    a: 1,
    b: 2,
    c: 3,
  };
  var a = obj.a,
    rest = (0, _objectWithoutProperties2.default)(obj, ['a']);
  console.log(rest);
};

var asyncFunc = /*#__PURE__*/ (function() {
  var _ref = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee() {
      var result;
      return _regenerator.default.wrap(function _callee$(_context) {
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

var funcA = function funcA() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
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

    (0, _classCallCheck2.default)(this, Book);
    (0, _defineProperty2.default)(this, 'name', 'book');
    (0, _defineProperty2.default)(this, 'getName', function() {
      return _this.name;
    });
  }

  (0, _createClass2.default)(Book, [
    {
      key: 'getNameA',
      value: function getNameA() {
        return this.name;
      },
    },
  ]);
  return Book;
})();

(0, _defineProperty2.default)(Book, 'staticName', 'book static');
(0, _defineProperty2.default)(Book, 'staticFunc', function() {
  return Book.staticName;
});
