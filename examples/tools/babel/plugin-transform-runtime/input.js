const p = new Promise();

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
  name = 'book';

  getName = () => {
    return this.name;
  };

  getNameA() {
    return this.name;
  }

  static staticName = 'book static';

  static staticFunc = () => {
    return Book.staticName;
  };
}
