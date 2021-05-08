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
