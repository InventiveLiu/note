let name = 'a';
const obj = {
  name: 'a',
};

console.log('a is required');

const setName = newName => {
  name = newName;
  obj.name = newName;
};

const getName = () => name;

// module.exports.name = name;
// module.exports.obj = obj;
// module.exports.setName = setName;
// module.exports.getName = getName;

module.exports = {
  name,
  obj,
  setName,
  getName,
};
