'use strict';

class Book {
  constructor() {
    this.name = 'book';

    this.getName = () => {
      return this.name;
    };
  }

  getNameA() {
    return this.name;
  }
}

Book.staticName = 'book static';

Book.staticFunc = () => {
  return Book.staticName;
};
