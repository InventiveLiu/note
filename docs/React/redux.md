---
title: redux
order: 3
group:
  title: React
  order: 6
---

# redux

`redux`是`js`应用的状态管理容器，可以和`React`以及其他任何库一起使用

我们常见的是跟`React`一起使用，但不要误会`redux`是`react`独有的

## 术语

在使用`redux`的时候，经常接触到一些概念，比如`reducers`,`actions`，下面将解释分别一下这些概念

### Store

`store`是一个对象，它存储着当前`redux`应用的状态（这个状态称之为`state`，为避免与`react state`弄混淆，我习惯称之为`store`），并且拥有返回当前状态的函数`getState`

一个`redux`应用应该只有一个`store`

### Actions

`action`是一个`js`对象，它通常包含一个`type`字段，可以把`action`想象为一个描述应用发生了什么的事件

`type`字段应该描述该`action`要做什么，通常还有一个`payload`字段用来携带参数

```js
const addTodoAction = {
  type: 'todo/addTodo',
  payload: 'learn redux',
};
```

### Action Creators

`action creator`是一个返回`action`的函数，一般`payload`里面可能有变量，所以需要用到函数

```js
const addTodo = text => ({
  type: 'todo/addTodo',
  payload: text,
});
```

### Reducers

`reducer`是一个描述如何更新`store`的函数，它接受当前状态`store`和`action`作为参数，返回的是一个新的`store`

`(store, action) => newState`，可以把`reducer`理解为一个事件监听器，它监听`action`传递的事件，然后更新对应的`store`并返回新的`store`

`reducer`函数必须是纯函数，应该有以下限制：

- 只能基于`store`和`action`来计算新的`store`
- 不允许直接修改`store`，而应该采用`immutable data`的方式来更新
- 不能做异步的操作，不能产生随机数（例如`new Date()`，`Math.random()`），不能有其他副作用

`reducer`函数的内部逻辑一般也比较简单，判断`action.type`是不是目标值(可以用`if`也可以用`switch`)，是则更新`store`并返回新`store`，不是则返回原`store`

```js
const initState = {
  count: 0,
};

const counterReducer = (state = initState, action) => {
  if (action.type === 'counter/increment') {
    return {
      ...state,
      count: state.count + 1,
    };
  }

  return state;
};
```

### dispatch

`dispatch`是`store`实例上的一个方法，它接受一个`action`作为参数，可以理解为触发`action`这个事件

### selectors

`selector`是一个函数，作用是从`store`里获取想要的值

一个大型应用的`store`通常包含很多字段，通常一个业务逻辑只需要部分字段

### `redux`数据流

`UI view`通过`dispatch`函数触发`action`，`reducer`接受`action`并更新`store`，`store`的更新反映到`UI view`上产生变化

## API

`redux`的`API`是比较少的

### createStore(reducer, [preloadedState], [enhancer])

创建并返回全局的`store`状态树，一个`redux`应用应该只包含一个`store`

- `reducer`，`reducer`函数，接受`store`和`action`返回新的`store`
- `preloadedState`，初始状态，可以是服务端返回的值，也可以是上一次会话（`user session`）保存的状态
  如果`reducer`参数是`combineReducers`函数产生的，那么`preloadedState`必须跟`reducer`有相同的`key`
  否则可以是任何`reducer`可识别的值
- `enhancer`，翻译为增强，是一个函数，作用是利用第三方中间件来达到更高级的目的，比如时间旅行（撤销，重做），`store`持久化
  `redux`自带的增强函数是`applyMiddleware()`

### store api

`store`是`createStore`函数返回的对象，它有以下几个方法

- `getState()`，返回当前的`state`状态树
- `dispatch(action)`，`dispatch`函数
- `subscribe(listener)`，订阅，每次`action`被触发都会执行`listener`函数
- `replaceReducer(nextReducer)`，替换当前`reducer`，通常在`hot reload`热更新时可能用到

### combineReducers(reducers)

业务开发过程中，通常会将各业务模块分开，分别定义自己的`state`和`action`以及`reducer`函数，`combineReducers`可以把这些`reducers`结合起来形成一个`reducer`传递给`createStore`

参数`reducers`是一个对象，传递给`combineReducers`函数的`reducer`必须遵守以下规则

- 对不识别对`action`，返回原状态
- 不能返回`undefined`
- 初始`state`不能为`undefined`

### applyMiddleware(...middleware)

`middleware`是用来扩展`redux`功能的中间件，比如用来实现异步`action`操作

`middleware`的特点是可以组合使用，每个`middleware`不需要知道它前面或者后面的`middleware`是干啥的

`middleware`函数接收`store`上的`dispatch`和`getState`作为命名参数，返回一个函数，这个函数会被下一个`middleware`的`dispatch`函数调用，即`({ dispatch, getState }) => next => action`

### bindActionCreators(actionCreators, dispatch)

一般我们可以直接使用`store.dispatch`，或者使用`react-redux`的`connect`来使组件可以获得`dispatch`，对于没有`connect`的自组件，我们可以把`dispatch`传递下去

`bindActionCreators`提供的是另外一种方法，不传递`dispatch`，而是直接传递具体的`action`触发函数

### compose(...functions)

`compose`是函数编程的一个概念，形如`a(b(c(x)))`这种一个函数的返回值是另一个函数的参数的嵌套关系，`redux`提供`compose`函数是为了方便使用`enhancer`

## 最佳实践

这是`redux`官网总结的最佳实践原则，分为三个部分

### 基本原则，必须遵守

- 不要直接修改`store`
- `reducer`必须是纯函数，不能有副作用
- 不要在`store`中存储不可序列化的类型，比如`Promises`，`Symbols`，`Maps/Sets`，`functions`或者`class`实例
- 每个应用只包含一个`store`

### 强烈推荐原则

- 使用`Redux Toolkit`来书写`redux`逻辑
- 使用`immer`来实现`Immutable Updates`
- 以`Feature Folders`的形式组织文件目录结构
- `Reducers`里放尽可能多的逻辑
- 减少`{...state, ...action.payload}`这种粗暴的方法
- 传递给`combineReducers`的`reducers`应该是`{ user: {}, post: {} }`，而不是`{userReducer: {}, postReducer: {} }`
- 以数据所属的模块来组织`store`，而不是根据组件来组织`store`
- 把`reducers`当作状态机(`@TODO`)
- `store`尽量做到扁平化
- 把`action`当作描述**发生了什么**的事件，而不是仅仅当作改变`store`的赋值方法
- 使用有意义的`action.type`，而不仅仅是`UPDATE_STORE`
- 允许多个`reducer`响应同一个`action`(`@TODO`)
- 不要`dispatch`多个`action`，考虑把多个`action`合并成一个，或者使用`react-redux`的`batch()`方法来避免多次更新`UI`
- 思考数据是不是一定要放在`store`里面
- 使用`react-redux`的`hooks api`
- 让更多的组件`connect`到`store`，从`store`中直接读取数据
- `react-redux`中推荐使用`object shorthand`形式的`mapDispatchToProps`
- 多次使用`useSelector`,而不是一次性取出所有的值
- 使用`ts`或者`flow`来做静态类型校验
- 使用`Redux DevTools Extension`来调试
- 使用原始的`js`类型作为`store`数据，而不是`Immutable.js`的数据类型，推荐使用`immer`来做`immutable update`

### 推荐原则

- `action`的`type`建议使用`domain/eventName`形式
- `action`遵循`FSA(Flux Standard Actions)`，即
  - 数据应该放在`payload`字段
  - 可以有`meta`字段表示额外的信息
  - 可以有`error`字段表示某种错误
- 使用`Action Creators`
- 使用`redux-thunk`来处理异步
- 将复杂的业务逻辑移到组件外
- 使用`selector`来从`store`中取数据，推荐使用`reselect`
- `selector`命名为`selectSomething`
- 不要把`form state`表单状态放在`store`里

## react-redux

`react-reducer`是方便我们在`react`中使用`reducer`的一个库，它的 API 比`reducer`更少

### Provider

`<Provider>`下面的组件都能够通过`react-reducer`的`api`来访问`store`

一般情况下，`<Provider>`会放在最外层，这样整个应用都可以访问`store`

`Provider`组件有三个`props`：

- `store`，即`redux`里的`store`，一般由`redux`里的`createStore`返回
- `children`，`react`组件
- `context`，即`react`的`context`，如果使用自定义`context`，则在使用`connect`或者`hooks api`时，必须提供相同的`context`

常见的`Provider`用法：

```jsx | pure
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { App } from './App';
import createStore from './createReduxStore';

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
```

### batch()

同时更新多个`dispatch`，参考`React`的`unstable_batchedUpdates`

```jsx | pure
import { batch } from 'react-redux';

function myThunk() {
  return (dispatch, getState) => {
    // should only result in one combined re-render, not two
    batch(() => {
      dispatch(increment());
      dispatch(increment());
    });
  };
}
```

### connect()

`connect`函数是链接`redux`与`React`组件的方法，是一个`HOC`，使用方法如下

`connect(mapStateToProps?, mapDispatchToProps?, mergeProps?, options?)(WrapComponent)`

- `mapStateToProps?: (state, ownProps?) => Object`

  把`redux`的`store`中的数据转换为组件的`props`，第一个参数`state`是`redux`里的`store`，第二个参数是组件本身的`props`

- `mapDispatchToProps?: Object | (dispatch, ownProps?) => Object`

  可以是`Object`，也可以是`(dispatch, ownProps?) => Object`函数，推荐使用`Object`形式

  默认情况下，`connected component`的`props`中会有一个`dispatch`函数，使用了`mapDispatchToProps`后，`connected component`默认**不会有`dispatch`函数**，除非我们在`mapDispatchToProps`函数的返回值中包含`dispatch`

  不使用`mapDispatchToProps`的时候，我们想在点击按钮时触发某个`action`可以这么写

  ```jsx | pure
  const { dispatch } = props;
  // ...
  <button
    onClick={() => {
      dispatch({ type: 'do-something' });
    }}
  >
    click me
  </button>;
  ```

  使用`mapDispatchToProps`后，可以更直接的写

  ```jsx | pure
  // connect mapDispatchToProps func
  connect(mapStateToProps, dispatch => ({
    doSomething: () => dispatch({ type: 'do-something' }),
  }))(component);
  // or mapDispatchToProps object, 会自动调用 bindActionCreators
  connect(mapStateToProps, {
    doSomething: () => ({ type: 'do-something' }),
  })(component);

  // component
  const { doSomething } = props;
  // ...
  <button onClick={doSomething}></button>;
  ```

- `mergeProps?: (stateProps, dispatchProps, ownProps) => Object`

  表示`stateProps`，`dispatchProps`和`ownProps`是如何合并的，默认是`{...stateProps, ...dispatchProps, ...ownProps}`

- `options?: object`

  ```js | pure
  {
    /**
     * 即 React Context
     * Provider自定义了context的时候，connect也必须指定同样的context
     */
    context?: Object,
    /**
     * 默认 true
     * 假定connect的组件是一个纯组件，在大多数情况下是合理的，一般不需要修改，除非你知道这意味着什么
     */
    pure?: boolean,
    /**
     * (next: Object, prev: Object) => boolean
     * 默认是严格等于，即 (next, prev) => prev === next
     */
    areStatesEqual?: Function,
    /**
     * (next: Object, prev: Object) => boolean
     * 默认是浅比较
     */
    areOwnPropsEqual?: Function,
    /**
     * (next: Object, prev: Object) => boolean
     * 默认是浅比较
     */
    areStatePropsEqual?: Function,
    /**
     * (next: Object, prev: Object) => boolean
     * 默认是浅比较
     */
    areMergedPropsEqual?: Function,
    /**
     * 如果为 true, 则 connected component 的ref属性会指向 WarpComponent
     */
    forwardRef?: boolean,
  }
  ```

### Hooks API

`react`推出`hooks`后，很多库都做了更新以便能够使用`hooks`，`react-redux`也提供了`hooks api`，并推荐使用`hooks api`

- `useSelector(selector: Function, equalityFn?: Function)`

  从`store`中取数据，类似于`mapStateToProps`，`selector`函数即`redux`中的`selector`函数

  `equalityFn`默认是严格`===`，如果`selector`返回的是一个`object`，可以使用`shallowEqual`

  ```js | pure
  import { shallowEqual, useSelector } from 'react-redux';

  const selectedData = useSelector(selectorReturningObject, shallowEqual);
  ```

- `useDispatch()`

  返回`dispatch`函数

- `useStore()`

  返回`store`对象，不应该经常使用，推荐使用`useSelector`和`useDispatch`

## 为什么`reducer`必须是纯函数？

之前一直没有思考这个问题，`redux`规定`reducer`必须是纯函数，这个是由`reducer`的职责决定的，`reducer`的作用就是接收原`store`和`action`，返回一个新的`store`，这一个过程如果不是纯函数的话，会产生很多问题，比如：

- 无法测试，就算测试用例全部通过，也无法保证线上环境没有问题
- 无法回溯，撤销/重做可能得到不同的结果
- 难以调试，难定位到底是哪里修改了`store`的数据

相对的，`reducer`为纯函数就能避免上述问题

## 为什么`redux`需要处理异步逻辑？

`redux`本身不能处理异步逻辑，异步逻辑的处理都是交给中间件比如`redux-thunk`来处理，我们把接口请求等异步操作全放到`action creator`函数里，然后`dispatch`异步的`action`来请求数据并更新`store`

但是我们完全可以在业务代码里把异步逻辑处理完之后，再`dispatch`同步的`action`来更新`store`，而且这样能更直观的反映出业务逻辑的整个流程，我个人在使用`redux`的时候，写着写着就会变成这种写法，不用`redux`来处理异步，只用它来做一个全局的状态管理工具

后来我开始思考这个问题，在业务代码里处理异步，和在`redux`中间件里处理异步，谁更合适？

我搜索了一番，在[知乎](https://www.zhihu.com/question/268586998)上看到了同样的问题，发现不少人都反对在`redux`里处理异步，因为逻辑不够直接，代码分散在各处，阅读不流畅等原因，另外一些回答提到了一些缺点，比如不利于维护

在`redux`中处理异步逻辑，更多的是从架构设计以及逻辑跟 UI 分离的方面考虑的，`redux`作者也提到：

> So the benefit of using middleware like Redux Thunk or Redux Promise is that components aren’t aware of how action creators are implemented, and whether they care about Redux state, whether they are synchronous or asynchronous, and whether or not they call other action creators. The downside is a little bit of indirection, but we believe it’s worth it in real applications.

用`redux-thunk`等中间件的好处是，组件不必关心`action`是怎么实现的，`redux state`是怎么变更的，是同步还是异步的，是否调用了其他`action`，缺点就是不够直接，但是对于真实应用来说是值得的

## 异步解决方案

`redux`的`reducer`必须是纯函数，不能解决异步的问题，`redux`把异步的解决方案交给了社区，于是有很多优秀的解决方案

### redux-thunk

`redux`官方的解决方案，源码只有 14 行

```js | pure
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

`redux-thunk` 允许`action creator`返回一个函数，函数的参数为`dispatch`，`getState`以及自定义的其他参数`extraArgument`

```js | pure
const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

function increment() {
  return {
    type: INCREMENT_COUNTER,
  };
}

function incrementAsync() {
  return dispatch => {
    setTimeout(() => {
      // Yay! Can invoke sync or async actions with `dispatch`
      dispatch(increment());
    }, 1000);
  };
}
```

### redux-saga

相比于`redux-thunk`，`redux-saga`提供了更多的流程上的控制，比如`throttle`(节流)，`debounce`(防抖)，`retry`(重试)，`all`(同时，全部返回才返回)，`race`(竞争，某一个返回则返回)

## 参考链接

[redux 中间件对于异步 action 的意义是什么？](https://www.zhihu.com/question/268586998)

[Why do we need middleware for async flow in Redux?](https://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux)
