'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

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

var Book = /*#__PURE__*/ (function() {
  function Book() {
    var _this = this;

    _classCallCheck(this, Book);

    _defineProperty(this, 'name', 'book');

    _defineProperty(this, 'getName', function() {
      return _this.name;
    });
  }

  _createClass(Book, [
    {
      key: 'getNameA',
      value: function getNameA() {
        return this.name;
      },
    },
  ]);

  return Book;
})();

_defineProperty(Book, 'staticName', 'book static');

_defineProperty(Book, 'staticFunc', function() {
  return Book.staticName;
});
