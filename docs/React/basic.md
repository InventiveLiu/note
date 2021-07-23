---
title: 基础
order: 1
group:
  title: React
  order: 6
---

# React

本文是基于`react`官方文档，结合自己的经验，列举出的`react`开发者必须了解的基础知识，`hooks`不在本文范围内，会单独拎出来讲

## state 和 props

`state`翻译为状态，是`react`组件自己的数据，`props`翻译为属性，是外部传递给`react`组件的数据，这两个还是比较容易理解和区分的

但是，对于初学者来讲，组件的`state`容易跟`redux`的`state`弄混，所以我更愿意称`redux`的`state`为`store`

### 什么时候用`state`，什么时候用`store`？

首先回答第一个问题，我们都知道`react`是数据驱动视图变化的，即用户的交互会改变数据，数据的变化会反应到视图上

所以那些自身改动需要反应到视图变化上的数据，就要考虑放到`state`里，而那些不需要反应到视图变化上的数据，就没必要放到`state`里，可以直接挂在`this`上（对`class`组件来说），这样可以减少不必要的`render`更新

`state`是组件自己的数据，外部不能直接访问，而实际业务开发中，会有很多组件需要共享数据，`react`有个`state`提升的概念，即把共享的数据提升到两个（或更多）组件的最小父组件的`state`中去，然后把数据通过`props`传递给自组件，这样做的问题是，层级太深的话，需要一层一层的传递，显然不可取

聪明的开发者(`redux`)又想到了其他的方案，把共享数据都放在某个位置(`store`)，然后提供一个方法(`connect + mapStateToProps`)让每个组件自己去那个位置取自己想要的数据

从上面的描述，我们明白了为什么会需要`redux`状态管理，回到第二个问题本身，`store`里存放的应该是组件间共用的数据，实际开发中更多的是多个页面之间共用的数据

## 无状态组件、React.Component、React.PureComponent

无状态组件，指的是没有自己`state`的组件，这类组件通常可以写成一个函数

有自己的状态的组件，通常会写成`class`，并且继承`React.Component`

而`React.PureComponent`是与`React.Component`类似的，区别是`PureComponent`自己实现了`shouldComponentUpdate`函数，实现的方法是把`props`与`nextProps`, `state`与`nextState`分别进行**浅比较**

## 为什么我的组件更新了？为什么我的组件没更新？

这应该是很多新手经常问的问题，要明白这个问题，需要理解`react`的更新机制（虚拟`DOM`，`diff`算法，真实`DOM`），这里只简单提一下，`state`和`props`的更改能触发`re-render`，产生新的虚拟`DOM`，然后`react`通过`diff`算法比较新的虚拟`DOM`和老的虚拟`DOM`，有差异的地方`react-dom`才会更新真实`DOM`

也就是说，组件触发了`re-render`并不一定会触发`UI`更新，但是会执行`react`的`diff`算法以及组件的生命周期函数，这些大多数情况下都属于额外的开销，应该尽量避免

参考[When does React re-render components?](https://felixgerschau.com/react-rerender-components/#force-an-update-in-react-hooks)

下面所说的组件更新统一理解为组件`re-render`

### 为什么我的组件更新了？

遇到这个问题的一般都是知道`state`或者`props`改变了就会导致组件更新，但是并不是说`state`和`props`“没变”组件就不会更新，我们在调用`this.setState`的时候，就算没有改变`state`的值，组件还是会执行生命周期函数(`PureComponent`不会执行)，还有一个容易忽视或者意料之外的更新原因，父组件更新会导致子组件更新，哪怕子组件的`props`没有变化

另外一个需要注意的点就是，`props`传递的是值还是引用(`object`, `array`等)，值没有变化但是引用发生变化也是导致组件更新的原因之一

### 为什么我的组件没更新？

遇到这个问题，首先要检查的是`this.setState`或者`redux`的使用方法对不对，然后再检查引用关系是否改变，最后还可以检查是否`shouldComponentUpdate`阻止了更新

### 如何避免子组件不必要的更新？

避免子组件不必要的更新是`react`性能优化的关键，可以从以下几个方面入手

- 调整组件结构，拆分组件到更小的粒度，把`state`的变化控制在合理范围内

  我觉得这个应该是最重要的，但是也是最需要经验积累的，以表单页面为例，如果我们把表单的`state`放在父组件里面，那么每次表单输入更新都会造成父组件更新，从而造成兄弟组件的一些不必要的更新，解决方案是把表单输入部分单独提取成一个组件，让表单组件内部去管理`state`，从而不影响父组件和兄弟组件的更新

- 使用`PureComponent`或者自己优化`shouldComponentUpdate`函数

  大部分情况使用`PureComponent`即可，同时需要牢记`PureComponent`的`shouldComponentUpdate`做的是**浅比较**

  `shouldComponentUpdate`应该作为性能优化的手段，而不是在使用派生状态时阻止组件更新的方法，如果这么用了，说明对于派生状态的理解还不够，可以看下面的`getDerivedStateFromProps`

- 使用`React.memo`来记住（`memorize`）组件

  `React.memo`是一个高阶组件，作用是，当组件的`props`没有变化时，直接返回上一次的`render`结果，默认情况下`React.memo`对`props`的比较同样是**浅比较**，我们也可以指定比较函数`areEqual`

  ```js
  function MyComponent(props) {
    /* render using props */
  }
  function areEqual(prevProps, nextProps) {
    /*
    return true if passing nextProps to render would return
    the same result as passing prevProps to render,
    otherwise return false
    */
  }
  export default React.memo(MyComponent, areEqual);
  ```

### 强制更新

一般不会去做强制更新，但是`react`也提供了`class`组件强制更新的方法`this.forceUpdate()`

## 生命周期

`class`组件的更新是遵循一定的生命周期的，虽然`hooks`出现已经有一段时间了，但这是否意味着不用了解生命周期了呢？

我认为不是的，因为`class`组件依然存在，而且很多人还没来得及使用`hooks`

`react`的生命周期经历过改版，`componentWillMount`等生命周期钩子函数已经被弃用了，所以下面会分为旧版生命周期和新版生命周期来讲

### 旧版生命周期

- 挂载时，依次执行

  - `constructor`
  - `componentWillMount`
  - `render`
  - `componentDidMount`

- `props`更新，**或父组件`re-render`时**，依次执行

  - `componentWillReceiveProps(nextProps, nextState)`
  - `shouldComponentUpdate(nextProps, nextState)`，`PureComponent`没有这个生命周期
  - `componentWillUpdate(nextProps, nextState)`
  - `render`
  - `componentDidUpdate(prevProps, prevState)`

- `state`更新时，依次执行(与`props`更新相比，不执行`componentWillReceiveProps`)

  - `shouldComponentUpdate(nextProps, nextState)`，`PureComponent`没有这个生命周期
  - `componentWillUpdate(nextProps, nextState)`
  - `render`
  - `componentDidUpdate(prevProps, prevState)`

- 卸载时，执行

  - `componentWillUnmount`

- 出错时，执行

  - `componentDidCatch(error, info)`

### 新版生命周期

参考：
[Update on Async Rendering](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html)

为什么会有新版的生命周期呢？总结下来原因有两点：

1. 生命周期函数经常被误用，比如在`componentWillMount`里请求接口，在`componentWillReceiveProps`里请求接口等操作
2. 在`react`新推出的异步渲染机制下，`componentWillMount`等生命周期可能会被打断，然后重新执行，即可能执行多次

`react`准备废弃这三个生命周期，`componentWillMount`，`componentWillReceiveProps`，`componentWillUpdate`，并且提供了三个新的生命周期，`static getDerivedStateFromProps`，`getSnapshotBeforeUpdate`，`getDerivedStateFromError`，按如下的方式执行

- 挂载时，依次执行

  - `constructor`
  - `static getDerivedStateFromProps => new state or null`
  - `render`
  - `componentDidMount`

- 更新时（`state`更新，`props`更新，**或父组件`re-render`时**），依次执行

  - `static getDerivedStateFromProps => new state or null`
  - `shouldComponentUpdate(nextProps, nextState)`，`PureComponent`没有这个生命周期
  - `render`
  - `getSnapshotBeforeUpdate(prevProps, prevState) => snapshot`
  - `componentDidUpdate(prevProps, prevState, snapshot)`

- 卸载时，执行

  - `componentWillUnmount`

- 出错时，执行

  - `static getDerivedStateFromError(error) => new state or null`，`render`阶段，不能有副作用
  - `componentDidCatch(error, info)`，`commit`阶段，可以有副作用

从官网推荐的[这个地址](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)可以看到生命周期的示意图，从示意图中可以看到，生命周期分为两个（或者说三个）阶段，`render`阶段和`commit`阶段，其中`render`阶段由于会被`react`暂停，打断，重新开始，所以不能有副作用，所以副作用应该放到`commit`阶段的生命周期函数中

---

下面介绍一下`static getDerivedStateFromProps`和`getSnapshotBeforeUpdate`这两个函数

### static getDerivedStateFromProps

这个函数名翻译过来就是从`props`里派生出`state`，所以其作用也是如此，看似很简单，但是使用的时候应该谨慎，很多情况其实没必要使用这个方法

首先需要注意的是，这是一个`static`静态方法，意味着`this`指向的是`class`本身，而不是实例，也就不能访问`this.props`和`this.state`

再看这个函数的参数和返回值，`static getDerivedStateFromProps(nextProps, curState) => nextState or null`，第一个参数是`nextProps`，表示新的`props`，第二个参数是`curState`，表示当前的`state`，返回值是`nextState`，表示需要修改的`state`，或者返回`null`表示`state`不需要变化

参数并没有`prevProps`，所以当我们需要比较`prevProps`与`nextProps`时，可以这样做

```js
class MyComponent extends React.Component {
  // ...
  state = {
    isScrollingDown: false,
    lastRow: null,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.currentRow !== state.lastRow) {
      return {
        isScrollingDown: props.currentRow > state.lastRow,
        lastRow: props.currentRow, // 这里把需要比较的数据存到state里
      };
    }
  }
}
```

还有一个容易误解的地方是，`getDerivedStateFromProps`(包括`componentWillReceiveProps`)只在`props`变化时调用，从上面提到的实际情况看，这个函数在很多情况下都可能被调用

`getDerivedStateFromProps`(包括`componentWillReceiveProps`)常见的两种错误用法是：

- 无条件的把`props`复制到`state`
- 当`props`变化时，修改`state`

下面是错误用法的举例

```js
class EmailInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  /**
   * 这里用componentWillReceiveProps演示
   * 因为componentWillReceiveProps在组件本身state发生变化时不会执行
   * 能够更好的反映出组件自己控制state和props控制state的变化
   */
  componentWillReceiveProps(nextProps, nextState) {
    // 无条件的把props复制到state
    this.setState({
      email: nextProps.email,
    });
  }

  /**
   * 如果这样写的话，state不会发生改变，handleChange相当于失效了
   */
  // static getDerivedStateFromProps(props, state) {
  //   return {
  //     email: props.email,
  //   }
  // }

  handleChange = e => {
    this.setState({
      email: e.target.value,
    });
  };

  render() {
    const { email } = this.state;
    return <input onChange={this.handleChange} value={email} />;
  }
}
```

我曾今也写过上面这样的组件，我希望外面的`props`能够控制组件的`state`，还希望组件自己能够修改自己的`state`

这样写的问题是，父组件更新会导致`getDerivedStateFromProps`执行，然后`props`里的`email`是以前的值，`state`里的`email`是修改后的值，`getDerivedStateFromProps`的执行会让我们修改的`state`丢失，回到最初的值

这个时候，聪明的开发者会想到比较一下前后`props`里的`email`，不一样才执行`setState`

```js
componentWillReceiveProps(nextProps) {
  // 当props变化时，才复制到state
  if (nextProps.email !== this.props.email) {
    this.setState({ email: nextProps.email });
  }
}

// or

static getDerivedStateFromProps(props, state) {
  if (props.email !== state.lastPropEmail) {
    return {
      email: props.email,
      lastPropEmail: props.email,
    }
  }

  return null;
}
```

这样试了一下，似乎没问题了，但是我们直接看[官网给的反例](https://codesandbox.io/s/mz2lnkjkrx)，这个例子表明，`props`变化时才更新`state`在某些情况下会出现应该更新却没有更新的情况

官方文档一直在劝退，不要轻易使用`getDerivedStateFromProps`(包括`componentWillReceiveProps`)，某些情况可以使用其他方法代替，比如：

- 想在`props`变化后，执行一些副作用（例如请求数据或者动画效果），应该在`componentDidUpdate`里执行，同时注意`componentDidUpdate`里执行`setState`的话，一定要加判断条件，否则会无限循环

- 想从`props`里计算出我们需要的值，比如从一个列表里过滤得到我们需要的列表，可以直接在`render`函数里声明变量

  `const filteredList = this.props.list.filter(v => v.text.includes(this.state.filterText))`

  如果列表数据很大，过滤比较慢，这时候可以考虑用`memorization`手段，`memorization`就是当函数参数没有变化时，直接返回上一次计算的结果，这样可以避免不必要的计算开销，官方例子使用的库是[memoize-one](https://www.npmjs.com/package/memoize-one)

- 想在`props`改变时重置某些`state`，可以考虑

  - 使用完全可控的组件，不使用派生`state`，而直接使用`props`里的值，[官网例子](https://codesandbox.io/s/7154w1l551)
  - 非完全可控组件，可以使用`key`来重置，这时候所有`state`都会重置，[官网例子](https://codesandbox.io/s/7154w1l551)
  - 如果只想重置某些属性，可以对比特殊`props`，比如`id`什么的，[官网例子](https://codesandbox.io/s/rjyvp7l3rq)

    或者使用`ref`，然后父组件直接调用实例的方法来重置, [官网例子](https://codesandbox.io/s/l70krvpykl)

上面讲了很多，核心思想是保证数据源的唯一性，一个数据不能这里也可以控制，那里也可以控制，并且两个控制方法还是相互影响难以掌控的

### getSnapshotBeforeUpdate

这个函数名翻译过来就是**获取更新前的快照**，在`render`之后，`componentDidUpdate`之前(在更新`DOM`和`ref`之前)执行，函数有两个参数，第一个参数`prevProps`表示更新前的`props`，第二个参数`prevState`表示更新前的`state`，返回值作为`componentDidUpdate`的第三个参数，所以使用了这个函数必须同时使用`componentDidUpdate`函数

从[生命周期示意图](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)可以看到，`getSnapshotBeforeUpdate`是在`pre-commit`阶段，可以访问`DOM`

官网上提到`render`阶段和`commit`阶段之间会有延迟，那么在这个延迟期间，如果用户操作了`DOM`（比如调整了窗口大小），那么在`render`阶段获取的关于`DOM`的属性就是不正确的，而`getSnapshotBeforeUpdate`可以获取最新的`DOM`属性

## 列表与`key`

我们在使用`.map`来生成列表的时候，如果不加`key`属性，会在控制台看到`warning`提示列表应该有唯一的`key`值，这个`key`的作用是帮助`react`来识别列表的哪一个元素是新赠的，哪一个元素被删除了，以及哪一个元素被移动位置了

`key`值在列表里应该具有确定性和唯一性，确定性指的是对同一份数据，它的`key`应该是不变的，这也是为什么数组的`index`不建议当作`key`的原因，因为当元素有新增或者删除时，同一份数据的`index`可能发生变化

当接口给的数据没有合适的字段作为`key`时，为了消除那个`warning`有时候会想方设法的给元素添加一个`key`，甚至采用随机数，这样的做法是不可取的，这个时候我觉得正确的做法应该是先考虑接口数据中多个字段组合是否能形成一个唯一且稳定的`key`，如果还是没有合适的，再考虑自己生成一个 key 字段塞到数据里面

如果列表没有添加，删除，排序等操作，默认用`index`做`key`也不是不行

`key`还有一个作用，在上面`getDerivedStateFromProps`声明周期中有提到，当组件的`key`变化时，`react`会重新生成一个组件，而不是更新原来的组件，所以`key`还可以用来刷新组件

## 受控组件 & 非受控组件

受控组件和非受控组件一般是针对表单元素的，以`input`为例，如果指定了`input`的`value`属性，那么`input`显示的值就受`value`属性控制，如果代码不改变`value`的值，输入框就不能输入任何内容，所以称之为受控组件，受控组件一般同时指定`value`和`onChange`属性，获取`input`输入值时直接在代码里就可以拿到

非受控组件是相对受控组件而言的，不指定`input`的`value`属性的话，`input`可以输入任意值，此时想获取`input`的值的话，可以通过`ref`来获取`DOM`然后再获取值

---

上面是我理解的常规的受控组件和非受控组件，但是在看`getDerivedStateFromProps`文档时，文档还提到了一种受控组件和非受控组件的解释：

数据都通过`props`传递，可以理解为受控组件，因为它的显示都取决于组件外部

数据放在`state`里自己控制的，可以理解为非受控组件，因为它的显示可以自己控制

## 高阶组件

高阶组件是一个函数，函数参数包含一个组件，函数返回值是一个新的组件

> 什么时候用高阶组件？

这个问题我觉得没有标准答案，当我们在开发过程中发现自己在重复地做一些事情，就要思考是不是有其他可以优化的手段了，高阶组件只是`react`开发过程中的一种优化方式，作用是逻辑复用、强化`props`

其实我们在`react`开发过程中，已经在使用高阶组件了，比如`react-router`的`withRouter`，作用是给没有路由`props`（`history`和`location`）的组件添加路由`props`

> 怎么用高阶组件

高阶组件最常用的用法是这个样子的

```js
const withHOC = (WrappedComponent) => {

  class WithHOC extends React.Component {
    state = {
      name: 'HOC',
    }

    // do something

    render() {
      // 根据条件渲染Component
      if (this.state.name === 'HOC') {
        return <div>HOC</div>
      }
      // 给Component增加一些props，称之为强化`props`
      return <WrappedComponent {...this.state} {...this.props}>
    }
  }

  // 指定HOC组件的名字，方便调试
  // WrapComponent.displayName = `WithHOC(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WrapComponent;
}
```

上面这种写法一般称之为属性代理，可以看到属性代理两个很容易理解的作用: **条件渲染**和**强化`props`**，但是属性代理有一个需要注意的点是，`WrappedComponent`上的静态方法不会复制到新的组件上，所以需要特殊处理，可以利用这个库[hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics)来帮助我们处理

上面是一般的高阶组件用法，但我们拿到传递过来的组件时，我们理论上可以对组件做任何事情，比如修改声明周期函数

```js
const withHOC = WrappedComponent => {
  const oldDidMount = WrappedComponent.prototype.componentDidMount;
  WrappedComponent.prototype.componentDidMount = function() {
    console.log('new did mount');
    oldDidMount.call(this);
  };

  //...
};
```

官方不建议这样直接修改组件的原型链，除非你知道自己在做什么，否则不要这样做

---

下面还有一种高阶组件的写法

```js
const HOC = Component => {
  class MyComponent extends Component {
    // 这里直接继承传递过来的组件
    // do something

    render() {
      return super.render(); // 可以用super调用Component自己的方法
    }
  }

  return MyComponent;
};
```

上面的写法一般称之为反向代理，高阶组件直接继承的是传递过来的组件，所以可以获取组件的`state`和`props`，重写组件的方法（包括生命周期函数），修改组件`render`结果

这种写法仅适用于`class`组件，并且我们必须对传递过来的组件有足够的了解，还有需要注意的是这种写法很容易覆盖组件原本的行为，多个反向
代理高阶组件一起使用时也需要特别注意，因为可能相互覆盖

一般不推荐这种反向代理的写法，除非你知道自己在做什么

## Context

翻译为上下文，`react`中`context`是一种组件之间传递数据的一种方式，其主要应用场景是那些在不同层级的组件都需要访问的数据，是不是和`react-redux`很像？

- React.createContext

创建一个`Context`对象，用法`const ThemeContext = React.createContext('dark')`

- Context.Provider

每个`Context`都有一个`Provider`组件，接收一个`value`属性

```js
<MyContext.Provider value="dark"></MyContext.Provider>
```

- Class.contextType

`class`组件的静态属性`contextType`可以指定这个`class`使用哪一个`Context`，然后可以使用`this.context`来访问`Context.Provider`的`value`值

```js
class MyButton extends React.Component {
  render() {
    const theme = this.context;
    return <div>{theme}</div>;
  }
}

MyButton.contextType = ThemeContext;
```

- Context.Consumer

`Context.Consumer`是订阅`Context.Provider`的`value`变化的组件，可以用在普通函数组件中

```js
<Context.Consumer>
  {value => {
    // value的值是 Context.Provider 的 value
    return <div>{value}</div>;
  }}
</Context.Consumer>
```

- Context.displayName

`React DevTools`使用这个字符串来显示`Context`的名字

---

`Context`理解起来并不难，但实际业务开发中用的概率较少，因为对于`Context`的使用场景（在不同层级的组件都需要访问的数据）都交给`react-redux`了，而`react-redux`正是利用`Context`来实现的

## Ref

在`hooks`出现之前，`ref`的主要作用是用来访问`DOM`元素，或者访问`class`组件的实例来调用组件的方法，函数组件上不能使用`ref`属性，因为没有实例

- `React.createRef`

```js
class AutoFocusInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    // 注意这里的current
    this.textInput.current.focus();
  }

  render() {
    return <input ref={this.textInput} />;
  }
}
```

- 回调`ref`

```js
class AutoFocusInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = null;
    this.setTextInputRef = element => {
      this.textInput = element;
    };
  }

  componentDidMount() {
    // 注意这里没有current
    this.textInput.focus();
  }

  render() {
    return <input ref={this.setTextInputRef} />;
  }
}
```

---

回到上面高阶组件的例子

```js
const hoc = (WrappedComponent) => {
  class HOC extends React.Component {
    render() {
      return (
        <WrappedComponent {...this.props} {...this.state} />
      )
    }
  }
  return HOC;
}

// 高阶组件使用ref
const HOC = hoc(WrappedComponent);
const hocRef = React.createRef();
<HOC ref={hocRef}>
```

高阶组件使用`ref`时，上面的`ref`指向的是`HOC`，而不是`WrappedComponent`，因为`ref`并不是组件的`props`，它跟`key`一样是`react`单独处理的属性，所以高阶组件无法传递`ref`

这时候需要使用`React.forwardRef`来转发`ref`，使用方法如下

```js
const hoc = (WrappedComponent) => {
  class HOC extends React.Component {
    render() {
      return (
        <WrappedComponent {...this.props} {...this.state} />
      )
    }
  }

  return React.forwardRef((props, forwardedRef) => <HOC {...props} ref={forwardedRef}>);
}
```

## Portals

`ReactDOM.createPortal`，作用是把组件渲染到父组件之外的节点中，用法`ReactDOM.createPortal(child, container)`，`child`是任何可以渲染的`react`子元素，`container`是一个`DOM`元素

`Portals`的作用是把`DOM`元素渲染到其他位置，但是其他行为，比如`context`以及事件冒泡，尽管真实的`DOM`元素没有父子关系，但是虚拟`DOM`的冒泡事件依然能够被捕获，具体可以看官网的[这个例子](https://codepen.io/gaearon/pen/jGBWpE)

`Portals`的典型应用场景是一些弹出层，比如弹框，下拉选择等

## 性能优化

这部分来自官方文档，我觉得有两点可以着重关注一下，一个是虚拟列表，另一个是`immutable data`

- 虚拟列表

在`web`开发中，`DOM`的渲染和管理是非常耗时的，随着`DOM`的增多，页面会越来越卡顿

而在处理滚动加载的列表时，假设列表长度无限，如果一直向下滚动，就会导致`DOM`越来越多，会有卡顿

虚拟列表的解决思路是，只渲染窗口看得见的数据，窗口看不见的数据不用渲染成真实`DOM`

- immutable data

在`react`开发中，对于`props`和`state`传递的是值还是引用关系，这点非常重要，像`someProps={{}}`这种很容易被忽略，这种写法每次传递的都是新的`{}`对象，所以`someProps`每次都会变化

## React API

下面只列举我觉得需要特别关注的 API

### React.memo

`React.memo(Component, [equalFunc])`

`React.memo`是高阶组件，通常作为一种性能优化的手段，被包裹的在`props`不变的情况下，`React`会直接复用上一次渲染的结果

使用时需要注意，`React,memo`只比较`props`，`state`或`context`的变更依然能够引起组件渲染

`React.memo`默认使用浅比较，我们也可以使用第二个参数来控制比较结果，`equalFunc(prevProps, nextProps) => boolean`，返回`true`表示一致，不重新渲染，`false`表示不一致，需要重新渲染

### React.lazy & React.Suspense

`Suspense`目前唯一支持的使用场景是配合`lazy`来实现动态加载组件，不过根据官方文档，未来`Suspense`会有更多更强大的使用场景，比如请求数据等，我们拭目以待

```js
const SomeComponent = React.lazy(() => import('./SomeComponent'));

function MyComponent = () => {
  return (
    <React.Suspense fallback={(<Loading />)}>
      <div>
        <SomeComponent />
      </div>
    </React.Suspense>
  )
}
```

`React.lazy`的使用需要`promise`支持

### React.cloneElement

```js
React.clone(element, [props], [...children]);
```

以`element`元素为样板克隆并返回新的`React`元素，保留原`props`并且可以修改或增加新的`props`，
