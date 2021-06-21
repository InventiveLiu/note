---
title: 配置解析
order: 1
group:
  title: typescript
  path: /ts
  order: 4
---

# typescript

本来是想把`ts`放在`js`章节之下的，但是仔细一想还是决定单独作为一个章节，因为`ts`是`js`的超集，不应该作为`js`的子模块

# 1. 基本类型

## 1.1 Boolean

```typescript
let isDone: boolean = false;
```

## 1.2 Number

```typescript
let decimal: number = 6;
```

## 1.3 String

```typescript
let color: string = 'red';
```

## 1.4 Symbol

```typescript
const sym: symbol = Symbol();
```

## 1.5 Array

数组元素类型必须一致

```typescript
let list: number[] = [1, 2, 3];

let list: Array<number> = [1, 2, 3];
```

## 1.6 Tuple(元组)

数组元素类型可以不一致

```typescript
// Declare a tuple type
let x: [string, number];

// Initialize it
x = ['hello', 10]; // OK

// Initialize it incorrectly
x = [10, 'hello']; // Error
```

## 1.7 Enum(枚举)

### 1.7.1 数字枚举

```typescript
enum Color {
  Red,
  Green,
  Blue,
}

let c: Color = Color.Red;
```

以上代码会编译为：

```javascript
var Color;
(function(Color) {
    Color[Color['Red'] = 0] = 'Red';
    Color[Color['Green'] = 1] = 'Green';
    Color[Color['Blue'] = 2] = 'Blue'
})(Color || Color = {}));
let c = Color.Red; // 0
```

数字枚举的默认值从 0 开始依次+1，我们也可以定义初始值，比如：

```
enum Color { Red = 1, Green, Blue }
```

会编译成：

```javascript
var Color;
(function(Color) {
    Color[Color['Red'] = 1] = 'Red';
    Color[Color['Green'] = 2] = 'Green';
    Color[Color['Blue'] = 3] = 'Blue'
})(Color || Color = {}));
```

我们甚至可以从第 N 个开始设置初始值，比如：

```
enum Color { Red, Yellow, Green = 10, Blue }
```

会编译成：

```javascript
var Color;
(function(Color) {
    Color[Color['Red'] = 0] = 'Red';
    Color[Color['Yellow'] = 1] = 'Yellow';
    Color[Color['Green'] = 10] = 'Green';
    Color[Color['Blue'] = 11] = 'Blue'
})(Color || Color = {}));
```

### 1.7.2 字符串枚举

```
enum Color { Red = 'Red', Yellow = 'Yellow', Green = 'Green', Blue = 'Blue' }
```

会编译为：

```javascript
var Color;
(function(Color) {
    Color['Red'] = 'Red';
    Color['Yellow'] = 'Yellow';
    Color['Green'] = 'Green';
    Color['Blue'] = 'Blue'
})(Color || Color = {}));
```

### 1.7.3 常量枚举

常量枚举是用`const`修饰的枚举，这种枚举不会生成 Javascript 代码，例如：

```typescript
const enum Color {
  Red,
  Green,
  Blue,
}
const color: Color = Color.Red;
```

会编译为：

```javascript
const color = 0; /* Red */
```

### 1.7.4 异构枚举

异构枚举的初始值是数字和字符串的混合，初始值为字符串的下一个枚举必须也有初始值

```
enum Color { Red, Yellow = 'Yellow', Green = 10, Blue }
```

会编译为：

```javascript
var Color;
(function(Color) {
  Color[(Color['Red'] = 0)] = 'Red';
  Color['Yellow'] = 'Yellow';
  Color[(Color['Green'] = 10)] = 'Green';
  Color[(Color['Blue'] = 11)] = 'Blue';
})(Color || (Color = {}));
```

我们可以发现，数字枚举值多了反向映射，即：`Color[0] === 'Red'; Color['Red'] === 0;`

## 1.8 Any 和 Unknown

Any 和 Unknown 放在一起是因为他们很像，但是他们又有区别，有点类似 null 和 undefined 的味道

### 1.8.1 Any

Any 表示任意类型，任何类型(never 除外)的值都可以赋值给 any，并且 any 可以赋值给任何类型的值，例如：

```typescript
const a: any = '123';
const n: number = a; // OK
```

### 1.8.2 Unknown

UnKnown 表示未知类型，任何类型(never 除外)的值都能赋值给 unknown，但是 unknown 类型的值只能赋值给 any 或 unknown，例如

```typescript
const u: unknown = '123';
const n: number = u; // Type 'unknown' is not assignable to type 'number'
```

## 1.9 Void

Void 表示空类型，没有类型

```typescript
function sayHi(): void {
  alert('Hi');
}
```

## 1.10 Null 和 Undefined

null 和 undefined 类型就是他本身，默认情况下，`--strictNullChecks`配置是没有开启的，即表示`null`和`undefined`类型可以赋值给其他任何类型，这样会造成一些问题，所以建议开启`--strictNullChecks`，然后通过联合类型来处理可能为 null 或 undefined 的情况，比如: `number | null | undefined`

## 1.11 Never

Never 表示那些不存在的类型，比如一个永远抛出异常的函数返回值，或者一个永远不会有返回值的函数的返回值。never 是其他类型的子类型，可以赋值给其他类型，但是其他类型都不能赋值给 never 类型

```typescript
// Function returning never must not have a reachable end point
function error(message: string): never {
  throw new Error(message);
}

// Function returning never must not have a reachable end point
function infiniteLoop(): never {
  while (true) {}
}
```

在 TypeScript 中，可以利用 never 类型的特性来实现全面性检查，具体示例如下：

```typescript
type Foo = string | number;

function controlFlowAnalysisWithNever(foo: Foo) {
  if (typeof foo === 'string') {
    // 这里 foo 被收窄为 string 类型
  } else if (typeof foo === 'number') {
    // 这里 foo 被收窄为 number 类型
  } else {
    // foo 在这里是 never
    const check: never = foo;
  }
}
```

如果`Foo`类型被修改，，

```typescript
type Foo = string | number | boolean;
```

并且没有修改`controlFlowAnalysisWithNever`函数的逻辑，那么会编译不通过

## 1.12 Object

Object 类型通常用不到，暂时不考虑

# 2. type 关键字

## 2.1 字面类型 Literal Types

顾名思义，字面类型就是你看到的类型，字面类型有字符串，数字和布尔值三种，字面类型是上述类型点子集。

```typescript
// const声明的变量，不会改变，因此TypeScript会认为他的类型是Hello，而不是string
const Hello = 'Hello';

// const声明的变量，不会改变，因此TypeScript会认为他的类型是string
let HelloWorld = 'HelloWorld';

// Easing是字符串字面类型，值只能取三个当中的一个
type Easing = 'ease-in' | 'ease-out' | 'ease-in-out'

// Odd是数字字面类型，值只能取10以内的奇数
type Odd = 1 | 3 | 5 | 7 ｜ 9
```

## 2.2 联合类型（Union Types）和 交叉类型(Intersection Types)

### 2.2.1 Union Types 联合类型

```typescript
type StringOrNumber = string | number;
```

```typescript
type NetworkStateLoading = {
  state: 'loading';
};

type NetWorkStateFailed = {
  state: 'failed';
  code: number;
};

type NetWorkStateSuccess = {
  state: 'success';
  response: {
    title: string;
    duration: number;
    summary: string;
  };
};

type NetWorkState =
  | NetWorkStateLoading
  | NetWorkStateFailed
  | NetWorkStateSuccess;

function logger(state: NetWorkState): string {
  // 此时编译器并不知道state的具体类型，所以直接访问code会编译不通过
  state.code;

  switch (
    state.state // state是所有类型共有的，所以一定存在，不会报错
  ) {
    case 'loading':
      return 'loading...';
    case 'failed':
      return `request failed! Error code ${state.code}`; // 此时state.code一定存在，不会报错
    case 'success':
      return `request success! title: ${state.response.title}`;
  }
}
```

此时如果`NetWorkState`增加了一种类型，比如`NetWorkCache`，而`logger`函数没修改，那么就会产生上面讲`never`类型的例子，`never`类型可以用来做类型全面覆盖检查。

### 2.2.2 Itersection Types 交叉类型

```typescript
type A = {
  a: string;
};

type B = {
  a: number;
  b: string;
};

type C = A & B;

const c: C = {
  a: 1, // Error， Type 'number' is not assignable to type 'never'
  b: '2',
};
```

C 中的 a 变成了`never`类型，因为 a 既要是`string`又要是`number`，不存在这样的类型所以变成了`nerver`，但是不定义 a 又会报错，所以我觉得不要干这种事比较好

```tytpescript
interface D { d: boolean; }
interface E { e: string; }
interface F { f: number; }

interface A { x: D; }
interface B { x: E; }
interface C { x: F; }

type ABC = A & B & C;

let abc: ABC = {
  x: {
    d: true,
    e: 'semlinker',
    f: 666
  }
};

console.log('abc:', abc);
```

说明非基础类型的同名属性合并是可以的

# 3. 接口 Interface

TypeScript 的核心原则之一就是在类型检查的时候关注的是值的“形状”（而不关系其内部结构）,这通常被成为`Duck Typing`。

> `Duck Typing`的原话是，走起来像鸭子，游泳起来像鸭子，叫起来像鸭子，那么它就是一只鸭子。

我们不用管鸭子是活的还是充气的，`interface`基本使用如下：

```typescript
interface People {
  name: string;
  age?: number;
  gender?: string;
  readonly password: string;
  [propName: string]: any;
}
```

有几点说明：

1. `?`表示可选属性
2. `readonly`表示只读属性
3. `[propName: string]: any`表示除了上面的属性外，Peopel 还可以有其他属性
4. 属性结尾用`;`，我试了`,`也没问题，官方文档用的`;`所以推荐用`;`

## 3.1 函数的`interface`

函数需要定义参数和返回值

```typescript
interface SearchFunc = {
    (src: string, sub: string): boolean
}

let mySearchFunc: SearchFunc = function (src, sub) {
    // 此处省略参数和返回值类型，typescript可以根据上下文推断出参数和返回值的类型
    let result = src.search(sub);
    return result >= -1;
}
```

## 3.2 可索引类型

我们知道，对象或数字在取值的时候，可以用`a[10]`或者`ageMap['daniel']`这种方式，其中`10`和`daniel`称之为索引，可索引类型就是定义哪种类型的值可以用来作为索引。`typescript`用`index`标识来表示索引类型，例如：

```typescript
interface StringArray {
  [index: number]: string;
}

const myArray1: StringArray = ['1', '2']; // OK
const myArray2: StringArray = [1, 2]; // Error, Type 'number' is not assignable to type 'string'

const myObj1: StringArray = {
  1: 1,
  2: 2,
}; // OK

const myObj2: StringArray = {
  '1': 1,
  '2': 2,
}; // Error, Property ''1'' is incompatible with index signature
```

# 4. Class 类

`TypeScript`中的类跟原生`Javascript`中的类基本一致，不同的是在`TypeScript`中，类属性可以有`public`(默认)，`private`，`protect`，`readonly`等修饰词，也可以有`static`等修饰词，类本身还可以有`abstract`修饰词

## 4.1 public 公有属性

不声明的情况下默认为公有属性，公有属性类和实例都能访问

## 4.2 private 私有属性

私有属性只能在类内部访问，实例无法访问

原生`JavaScript`已经有私有属性提案了，并且`chrome`已经开始支持了，使用如下：

```javascript
class Point {
    #x;
    #y;

    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }
}

const point = new Point(1,1);

point.#x // Uncaught SyntaxError: Private field '#x' must be declared in an enclosing class
```

在`TypeScript`中，用`private`关键字表示私有属性：

```typescript
class Point {
  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const point = new Point(1, 1);

point.x; // Property 'x' is private and only accessible within class 'Point'
```

## 4.3 protected 受保护的属性

`protected`属性跟`private`属性类似，区别是`protected`属性可以在子类中访问，例如：

```typescript
class Person {
  protected name: string;
  private age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

class Employee extends Person {
  private department: string;

  constructor(name: string, department: string) {
    super(name, 21);
    this.department = department;
  }

  getAge() {
    return `age: ${this.age}`; // Error, Property 'age' is private and only accessible within class 'Person'
  }

  getInfo() {
    return `name: ${this.name}, department: ${this.department}`;
  }
}

const Jack = new Employee('Jack', 'Web');

Jact.getInfo(); // name: Jack, department: Web

Jack.name; // Property 'name' is protected and only accessible within class 'Person' and its subclasses
Jack.age; // Property 'age' is private and only accessible within class 'Person'
Jack.department; // Property 'department' is private and only accessible within class 'Employee'
```

## 4.4 readonly 只读属性

只读，顾名思义，能且只能获取值，不能修改

```
class Octopus {
  readonly name: string;
  readonly numberOfLegs: number = 8;

  constructor(theName: string) {
    this.name = theName;
  }
}

let dad = new Octopus("Man with the 8 strong legs");
console.log(dad.name); // Man with the 8 strong legs
dad.name = "Man with the 3-piece suit"; // Error, Cannot assign to 'name' because it is a read-only property.

```

## 4.5 参数即属性

构造函数的参数可以在声明的时候定义为属性并初始化，例如

```typescript
class Octopus {
  readonly numberOfLegs: number = 8;

  constructor(readonly name: string) {}
}

let dad = new Octopus('Man with the 8 strong legs');
console.log(dad.name);
```

## 4.6 Getter 和 Setter

`TypeScript`支持设置`getter/setter`来拦截成员的访问方法，以便更好的控制成员是如何被访问的，例如：

```typescript
const fullNameMaxLength = 10;

class Employee {
  private _fullName: string = '';

  get fullName(): string {
    return this._fullName;
  }

  set fullName(newName: string) {
    if (newName && newName.length > fullNameMaxLength) {
      throw new Error('fullName has a max length of ' + fullNameMaxLength);
    }

    this._fullName = newName;
  }
}

let employee = new Employee();
employee.fullName = 'Bob Smith';

if (employee.fullName) {
  console.log(employee.fullName);
}

employee.fullName = 'I am more than 10'; // Error, fullName has a max length of 10
```

使用`getter/setter`需要注意以下几点：

1. `typescript`编译器需要输出`ECMAScript 5`或以上的 JS 代码
2. 只有`getter`没有`setter`的属性会被当作`readonly`属性

## 4.7 静态属性和非静态属性

静态属性：类本身的属性，不用实例化也可以访问
非静态属性：类原型上的属性，必须实例化才可以访问

具体看例子：

```typescript
class Grid {
  // 静态属性
  static origin = { x: 0, y: 0 };
  // 非静态属性（方法）
  calculateDistanceFromOrigin(point: { x: number; y: number }) {
    let xDist = point.x - Grid.origin.x;
    let yDist = point.y - Grid.origin.y;
    return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
  }

  constructor(public scale: number) {}
}
```

会编译为：

```typescript
'use strict';
var Grid = /** @class */ (function() {
  function Grid(scale) {
    this.scale = scale;
  }

  // 非静态属性（方法）
  Grid.prototype.calculateDistanceFromOrigin = function(point) {
    var xDist = point.x - Grid.origin.x;
    var yDist = point.y - Grid.origin.y;
    return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
  };
  // 静态属性
  Grid.origin = { x: 0, y: 0 };
  return Grid;
})();
```

## 4.8 Abstract Classes 抽象类

不可以直接实例化，但是可以被继承的类，用`abstract`表示，例如：

```typescript
abstract class Department {
  constructor(public name: string) {}

  printName(): void {
    console.log('Department name: ' + this.name);
  }

  abstract printMeeting(): void; // abstract 修饰的属性必须被继承
}

class AccountingDepartment extends Department {
  constructor() {
    super('Accounting and Auditing'); // constructors in derived classes must call super()
  }

  printMeeting(): void {
    console.log('The Accounting Department meets each Monday at 10am.');
  }

  generateReports(): void {
    console.log('Generating accounting reports...');
  }
}

let department: Department; // ok to create a reference to an abstract type
department = new Department(); // error: cannot create an instance of an abstract class

department = new AccountingDepartment(); // ok to create and assign a non-abstract subclass
department.printName();
department.printMeeting();
department.generateReports(); // Error, Property 'generateReports' does not exist on type 'Department'
```

抽象类（Abstract Class）和接口（Interface）的区别是：抽象类可以有成员属性方法的具体实现，例如上面的`printName`方法

## 4.9 高级技巧

当在`TypeScript`中声明一个类时，实际上会同时生成 2 个值：

1. 类实例的类型（Type）
2. 构造函数方法

```typescript
class Greeter {
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  greet() {
    return 'Hello, ' + this.greeting;
  }
}

let greeter: Greeter; // 这里的Greeter类型就是声明Greeter类时产生的
greeter = new Greeter('world');
console.log(greeter.greet()); // "Hello, world"
```

会编译为：

```javascript
let Greeter = (function() {
  function Greeter(message) {
    this.greeting = message;
  }

  Greeter.prototype.greet = function() {
    return 'Hello, ' + this.greeting;
  };

  return Greeter;
})(); // 这里的Greeter函数也是在声明Greeter类时产生的

let greeter;
greeter = new Greeter('world');
console.log(greeter.greet()); // "Hello, world"
```

# 5. Extends and implements 扩展和实现

## 5.1 Type 和 Interface 的区别

在讲`Type`的时候，我们提到了交叉类型，例如：

```typescript
type PointX = {
  x: number;
};

type PointY = {
  y: number;
};

type Point = PointX & PointY;

let point: Point = {
  x: 1,
  y: 1,
};
```

Interface 也可以实现相同的效果，例如：

```typescript
interface PointX {
  x: number;
}

interface Point extends PointX {
  y: number;
}

let point: Point = {
  x: 1,
  y: 1,
};
```

甚至我们可以混写`Type`和`Interface`，例如：

```typescript
type PointX = {
  x: number;
};

interface Point extends PointX {
  y: number;
}
```

```typescript
interface PointX {
  x: number;
}

type Point = PointX & {
  y: number;
};
```

`Type`和`Interface`除了写法不一样外，几乎是类似的，主要的区别是：

- 已经定义的`Type`不可以被再次定义，例如：

```typescript
type Point = {
  x: number;
};

type Point = {
  y: number;
}; // Error, Duplicate identifier 'Point'
```

- `Interface`可以再次被定义，多次定义的结果将合并

```typescript
interface Point {
  x: number;
}

interface Point {
  y: number;
}

let point: Point = {
  x: 1,
  y: 1,
};
```

由于`Interface`更符合面向对象的`Open–closed`原则（开放继承，封闭修改，即在不修改源码的基础上继承），所以推荐尽可能的使用`Interface`。

接下来的讨论默认也只讨论`Interface`

## 5.2 extends 扩展

### 5.2.1 interface extends interface

这种情况上面已经举例过, 这里需要提出的是，extends 可以扩展多个接口，例如：

```typescript
interface PointX {
  x: number;
}

interface PointY {
  y: number;
}

interface Point extends PointX, PointY {
  z: number;
}

let point: Point = {
  x: 0,
  y: 0,
  z: 0,
};
```

### 5.2.2 interface extends class

前面我们提到，在声明类`class`的时候，实际上产生了两个值，其中一个就是`class`实例的类型（接口），因此`interface extends class`是成立的

```typescript
class PointX {
  x: number;
  constructor(x: number) {
    this.x = x;
  }
}

class PointY {
  y: number;
  constructor(y: number) {
    this.y = y;
  }
}

interface Point extends PointX, PointY {
  z: number;
}

let point: Point = {
  x: 0,
  y: 0,
  z: 0,
};
```

### 5.2.3 class extends interface

> 没有这个用法

### 5.2.4 class extends class

可以重写属性和方法，也可以不重写，使用默认的属性和方法

```typescript
class Animal {
  name: string;
  displayName: string = 'Animal';

  constructor(name: string) {
    this.name = name;
  }

  getDisplayName() {
    return 'Animal';
  }

  getName() {
    return this.name;
  }
}

class Cat extends Animal {
  displayName: string = 'Cat';

  constructor(name: string) {
    super(name);
  }

  getDisplayName() {
    return 'Cat';
  }
}

console.log(cat.displayName); // 'Cat'
console.log(cat.name); // 'Kitty'
console.log(cat.getDisplayName()); // Cat
console.log(cat.getName()); // 'Kitty'
```

## 5.3 implements 实现

实现，顾名思义，需要继承**所有**属性和方法才能称之为实现

只有 Class 才能`implements`其他 Class 或 Interface, 并且`super`方法不存在，不能被调用

### 5.3.1 class implements interface

- 普通用法：

```typescript
interface Animal {
  name: string;
  getName: () => string;
}

class Cat implements Animal {
  // 不要name属性的话，会有以下报错
  // Class 'Cat' incorrectly implements interface 'Animal'.
  // Property 'displayName' is missing in type 'Cat' but required in type 'Animal
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}
```

- 构造函数

前面我们提到了静态属性和非静态属性，`interface`只能够描述非静态属性，构造函数是属于静态属性的，所以直接按普通方法用会报错：

```typescript
interface Animal {
  new (name: string): void; // new是构造函数标识符
  name: string;
}

class Cat implements Animal {
  // Class 'Cat' incorrectly implements interface 'Animal'.
  // Type 'Cat' provides no match for the signature 'new (name: string): void'
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
```

这个时候，我们可以定义 2 个`interface`，一个用来描述构造函数，另一个用来描述实例方法，例如：

```typescript
interface AnimalConstructor {
  new (name: string): AnimalInterface;
}

interface AnimalInterface {
  name: string;
  // sound: () => void; // 注释打开即可正确运行
}

function createAnimal(
  construct: AnimalConstructor,
  name: string,
): AnimalInterface {
  return new construct(name);
}

class Cat implements AnimalInterface {
  constructor(public name: string) {}

  sound() {
    // 此处定义的sound方法在AnimalInterface中不存在，但是此处不报错
    console.log(`${this.name} miao!`);
  }
}

class Dog implements AnimalInterface {
  constructor(public name: string) {}

  sound() {
    // 此处定义的sound方法在AnimalInterface中不存在，但是此处不报错
    console.log(`${this.name} woof!`);
  }
}

// 此处报错， Property 'sound' is missing in type 'AnimalInterface' but required in type 'Cat'.
const cat: Cat = createAnimal(Cat, 'Kitty');

// Property 'sound' is missing in type 'AnimalInterface' but required in type 'Dog'.
const dog: Dog = createAnimal(Dog, 'Foo');

cat.sound(); // 'cat miao!'
dog.sound(); // 'dog woof!'
```

另外一种简单的处理构造函数描述的方法是，使用类表达式：

```typescript
interface AnimalConstructor {
  new (name: string): AnimalInterface;
}

interface AnimalInterface {
  name: string;
  sound: () => void;
}

const Cat: AnimalConstructor = class Cat implements AnimalInterface {
  constructor(public name: string) {}

  sound() {
    console.log(`${this.name} miao!`);
  }
};

const cat: AnimalInterface = new Cat('cat');

cat.sound();
```

### 5.3.2 class implements class

前面提到，在声明 class 的时候，同时会产生一个 class 实例的类型，假设称之为`classInterface`所以`class implements class`实际上是`class implements classInterface`，也就变成了`class implements interface`的情况

# 6. Generics 泛型

> 软件工程中一项重要的工作就是组件不仅仅需要定义一个良好的 API，同时也需要考虑组件的复用性和扩展性；

即组件即需要满足当前的条件，也需要尽可能满足未来可能出现的条件，泛型就是为此而生的；泛意指通用，型就是类型，泛型可以理解为通用类型，也可以理解为类型变量，例如：

```typescript
function identify<T>(arg: T): T {
  return arg;
}

// identify<string>相当于定义了一个函数
// function identify(arg: string): string { return arg; }
const output = identify<string>('hello');
```

# 7. 断言

断言，用来告诉编译器“我知道自己在干什么”。。

## 7.1 类型断言

类型断言好比其他语言里的类型转换，但是不进行特殊的数据检查和解构。它没有运行时的影响，只是在编译阶段起作用

```typescript
let someValue: any = 123;

// 不做类型断言，不会报错
let strLength1: string = someValue.toFixed(2);

// as语法
let strLength2: string = (someValue as number).toFixed(2);

// 尖括号语法，使用jsx的话，不能使用尖括号语法，只能使用as语法
let strLength3: string = (<number>someValue).toFixed(2);
```

## 7.2 非空断言

在上下文中当类型检查器无法断定类型时，一个新的后缀表达式操作符 ! 可以用于断言操作对象是非 null 和非 undefined 类型。具体而言，x! 将从 x 值域中排除 null 和 undefined 。

```typescript
function myFunc(maybeString: string | undefined | null) {
  // Type 'string | null | undefined' is not assignable to type 'string'.
  // Type 'undefined' is not assignable to type 'string'.
  const onlyString: string = maybeString; // Error
  const ignoreUndefinedAndNull: string = maybeString!; // Ok
}
```

因为 ! 非空断言操作符会从编译生成的 JavaScript 代码中移除，所以在实际使用的过程中，要特别注意。比如下面这个例子：

```
const a: number | undefined = undefined;
const b: number = a!;
console.log(b);
```

以上 TS 代码会编译生成以下 ES5 代码：

```
"use strict";
const a = undefined;
const b = a;
console.log(b);
```

虽然在 TS 代码中，我们使用了非空断言，使得 const b: number = a!;

语句可以通过 TypeScript 类型检查器的检查。

但在生成的 ES5 代码中，!非空断言操作符被移除了，所以在浏览器中执行以上代码，在控制台会输出 undefined。

## 7.3 确定赋值断言

在 TypeScript 2.7 版本中引入了确定赋值断言，即允许在实例属性和变量声明后面放置一个 `!` 号，从而告诉 TypeScript 该属性会被明确地赋值。为了更好地理解它的作用，我们来看个具体的例子：

```typescript
let x: number;
initialize();
// Variable 'x' is used before being assigned.(2454)
console.log(2 * x); // Error

function initialize() {
  x = 10;
}
```

很明显该异常信息是说变量 x 在赋值前被使用了，要解决该问题，我们可以使用确定赋值断言：

```typescript
let x!: number;
initialize();
console.log(2 * x); // Ok

function initialize() {
  x = 10;
}
```

# 8. 声明合并

前面提到，在声明`class`类的时候，实际上产生了 2 个值。仔细想一下，其实不仅是声明`class`有这种情况，声明`Enum`也有，以下表格是声明的内容与产生的值对应关系：

| 声明内容   | 命名空间（Namespace） | 类型（Type） | 值（Value） |
| ---------- | --------------------- | ------------ | ----------- |
| Namespcae  | 是                    |              | 是          |
| Class      |                       | 是           | 是          |
| Enum       |                       | 是           | 是          |
| Interface  |                       | 是           |
| Type Alias |                       | 是           |
| Function   |                       |              | 是          |
| Variable   |                       |              | 是          |

前面还提到，声明相同的`interface`的时候，会合并，例如：

```
interface Point {
    x: number;
}
interface Point {
    y: number;
}

// 相当于
interface Point {
    x: number;
    y: number;
}
```

合并的时候，非函数成员名需要是唯一的，如果有相同的名称，则其类型需要是唯一的，不然编译器会报错；

函数成员合并，同名的成员会被当作函数的重载，后定义的优先级较高，例如：

```typescript
interface Cloner {
  clone(animal: Animal): Animal;
}

interface Cloner {
  clone(animal: Sheep): Sheep;
}

interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
}
```

相当于

```typescript
interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
  clone(animal: Sheep): Sheep;
  clone(animal: Animal): Animal;
}
```

`@TODO`函数重载具体有什么作用，怎么用，需要探讨

# 9. 类型匹配

我们先看一个例子：

```typescript
interface Named {
  name: string;
}

class Person {
  name: string;
}

let p: Named;
// OK, because of structural typing
p = new Person();
```

上面的例子比较好理解，`Named`和`Person`的结构相似，因此可以赋值

```typescript
interface Named {
  name: string;
}

let x: Named;
// 编译器推断y的类型是 { name: string; location: string; }
let y = { name: 'Alice', location: 'Seattle' };
x = y; // OK，因为y类型结构“包含”x
```

这个例子中，`y`的类型“包含”`x`的结构类型

```typescript
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; // OK
x = y; // Error
```

这个例子中，函数 y 的参数“包含”函数 x 的参数，所以`x`能赋值给`y`
