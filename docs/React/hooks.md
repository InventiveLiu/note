---
title: Hooks
order: 2
group:
  title: React
  order: 6
---

# hooks

`hooks`是`react 16.8`推出的新特性，能够让函数组件拥有`state`以及其他的特性

## 为什么要增加`hooks`？

这个问题官网给了三个原因，相信`react`使用者在开发过程中多多少少会有点体会

### 组件很难做到逻辑复用

尽管在`react`中可以用`render props`或者高阶组件来做到部分逻辑复用，但这两者都需要重新组织组件的结构，并且会形成组件的嵌套地狱

而`hooks`能够将组件的逻辑部分提取出来，让我们在不改变组件结构的情况下做到逻辑复用，使得组件之间甚至开源社区之间共享复用逻辑更简单

如何理解这里的逻辑复用呢？我觉得就是那些在不同的业务中都经常用到的一些逻辑，比如权限验证，再比如`loading`处理，我们可以看一下阿里的[ahooks](https://ahooks.js.org/zh-CN)这个库，思考一下这里面的`hooks`自己是否也能用到，这就是逻辑复用

### 复杂组件变得难以理解

我们经常需要在`componentDidMount`里做多件事情，比如请求数据，事件监听，然后在`componentWillUnmount`里取消请求，移除事件，这样多个不同的逻辑放在一起容易产生 bug

而`hooks`能将组件中不同的逻辑区分开，这也是很多人提到的关注点分离，一个`useEffect`只做一件事情

### class 语法让人和机器都难以理解

在`class`组件中，我们需要关注`this`的绑定，还需要引入没有稳定的语法提案([@babel/plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties))

而且`class`组件无意中会让开发者使用让[component folding](https://github.com/facebook/react/issues/7323)优化手段无效的方案，导致`class`组件不能很好的压缩

`hooks`可以让我们在不使用`class`的情况下拥有`react`的特性

## `hooks`使用规则

`hooks`的使用是有一定约束的，我们可以通过`ESLint`插件[eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)来帮助我们检查`hooks`的使用是否正确

- `hooks`只能在函数顶层调用，不能在循环，条件判断中调用

  这点很重要，我们在使用`hooks`的过程中经常使用多个`useState`，有没有思考过`react`是怎么知道哪一个`state`对应哪一个`useState`的？答案是`react`根据`hooks`的调用顺序来确定对应关系，所以不能在循环，条件判断中使用`hooks`

  来看官网的一个例子

  ```js
  function Form() {
    // 1. Use the name state variable
    const [name, setName] = useState('Mary');

    // 2. Use an effect for persisting the form
    useEffect(function persistForm() {
      localStorage.setItem('formData', name);
    });

    // 3. Use the surname state variable
    const [surname, setSurname] = useState('Poppins');

    // 4. Use an effect for updating the title
    useEffect(function updateTitle() {
      document.title = name + ' ' + surname;
    });

    // ...
  }
  ```

  每次渲染的时候，`hooks`的执行顺序是一致的

  ```js
  // ------------
  // First render
  // ------------
  useState('Mary'); // 1. Initialize the name state variable with 'Mary'
  useEffect(persistForm); // 2. Add an effect for persisting the form
  useState('Poppins'); // 3. Initialize the surname state variable with 'Poppins'
  useEffect(updateTitle); // 4. Add an effect for updating the title

  // -------------
  // Second render
  // -------------
  useState('Mary'); // 1. Read the name state variable (argument is ignored)
  useEffect(persistForm); // 2. Replace the effect for persisting the form
  useState('Poppins'); // 3. Read the surname state variable (argument is ignored)
  useEffect(updateTitle); // 4. Replace the effect for updating the title

  // ...
  ```

- `hooks`只能在`react`函数组件或者自定义`hooks`中调用，不能在普通函数中调用

## 官方`hooks`列表

### useState

`const [state, setState] = useState(initialState);`

`initialState`是初始值，可以是普通值，也可以是返回普通值的函数

`state`是我们要使用的状态，初始化时等于`initialState`

`setState`是更新`state`的函数，在`re-render`的过程中，`react`会保证`setState`的身份标识保持不变，所以`setState`不用放到`useEffect`的依赖数组里

`setState`的参数可以是值，`setState(newState)`，但它不会像`class`组件的`this.setState`一样合并值，而是直接使用`newState`

`setState`的参数还可以是函数，`setState(prevState => newState)`，这样可以保证`prevState`是最新的

如果`newState`和当前的`state`是一样的（`react`用`Object.is`比较），那么`react`会跳过更新

[Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)比较和`===`是有区别的，主要区别在于`-0`，`+0`以及`NaN`和`Number.NaN`这些特殊情况上，同时也需要注意引用关系，比如下面的`Object.is([], [])`和`Object.is({ a: 1 }, { a: 1 })`

```js
// Case 1: Evaluation result is the same as using ===
Object.is(25, 25); // true
Object.is('foo', 'foo'); // true
Object.is('foo', 'bar'); // false
Object.is(null, null); // true
Object.is(undefined, undefined); // true
Object.is(window, window); // true
Object.is([], []); // false
var foo = { a: 1 };
var bar = { a: 1 };
Object.is(foo, foo); // true
Object.is(foo, bar); // false

// Case 2: Signed zero
Object.is(0, -0); // false
Object.is(+0, -0); // false
Object.is(-0, -0); // true
// 注意这里的n表示BigInt类型的整数，参考 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
Object.is(0n, -0n); // true

// Case 3: NaN
Object.is(NaN, 0 / 0); // true
Object.is(NaN, Number.NaN); // true
```

### useEffect

```js
useEffect(() => {
  // do something
  return () => {
    // do something
  };
}, [dep /* ... */]);
```

`useEffect`的作用是执行一些有副作用的操作，比如修改`DOM`，请求数据，事件监听，打印日志等

我们先关注第二个参数依赖数组，这个参数的作用是控制`useEffect`的执行，只有当依赖数组里的元素发生变化时，`useEffect`才会重新执行

再来看第一个参数，第一个参数是一个函数，即我们要执行的副作用函数，返回值也是一个函数（或者没有返回值），每次`useEffect`重新执行前都会先执行返回函数，所以一般可以在这里做取消事件监听，取消`setTimeout`等操作

与`componentDidMount`和`componentDidUpdate`不同的是，`useEffect`的**执行时机**是在浏览器布局和绘制之后（即`UI`更新之后，从这里也可以知道，`componentDidMount`和`componentDidUpdate`是在`UI`更新前执行的）

### useContext

`const value = useContext(MyContext);`

`useContext`的作用是订阅 Context 的变化，相当于`class`组件里的`static contextType = MyContext`

对于`Context`的具体作用，可以参考`react`基础`Context`一节

### useReducer

`const [store, dispatch] = useReducer(reducer, initialValue, initFunc)`

`useReducer`是`useState`的替代方案，当`state`较多且关系复杂时可以考虑使用`useReducer`

参数`reducer`是一个形如 `(state, action) => newState`的`reducer`函数，用过`redux`的应该都不陌生

参数`initialValue`是`store`的初始值，如果指定了第三个参数`initFunc`的话，`initialValue`则是`initFunc`的参数

参数`initFunc`是可选的，表示初始化函数，`initFunc(initialValue)`的返回值会作为`store`的初始值

返回值`store`是我们要用的数据

返回值`dispatch`是修改`store`的函数，`react`保证在`re-render`的过程中，`dispatch`的引用值不变

### useCallback

```js
useCallback(() => {
  // do something
}, [dep]);
```

`useCallback`的作用是返回一个`memorized`的函数，只有当依赖数组变化时，函数的引用才会变化

### useMemo

```js
useMemo(() => {
  return computeExpensiveValue(dep);
}, [dep]);
```

`useMemo`的作用是返回一个`memorized`的值，只有当依赖数组变化时，才重新计算这个值

可以看出`useCallback(fn, deps)`等价与`useMemo(() => fn, deps)`

`useMemo`和`useCallback`都是返回`memorized`的数据，可以用来做一些新能优化方面的事情

### useRef

`const ref = useRef(initialValue)`

`useRef`的作用是返回一个`ref`对象，可以和之前的`ref`一样用来获取`DOM`，另一个重点是`ref`在整个组件的生命周期内保持不变，所以可以用来当作以前的`this`来记录任何不影响组件更新的值

### useImperativeHandle

```js
useImperativeHandle(ref, createHandle, [deps]);
```

`useImperativeHandle`的作用是，提供类似于`class`组件调用子组件实例方法的途经，需要与`forwardRef`配合使用，来看下面的例子

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    customFocus: () => {
      inputRef.current.focus();
    },
    customBlur: () => {
      inputRef.current.blur();
    },
  }));
  return <input ref={inputRef} />;
}

FancyInput = forwardRef(FancyInput);

// write
<FancyInput ref={fancyRef} />;
// then call
fancyRef.current.customFocus(); // input will focus
fancyRef.current.customBlur(); // input will blur
```

### useLayoutEffect

`useLayoutEffect`用法与`useEffect`一样，两者的区别是执行时机不一样

前面提到，`useEffect`的执行时机是在`UI`更新之后，与`class`组件的生命周期`componentDidMount`和`componentDidUpdate`不一样

而`useLayoutEffect`的执行时机与`componentDidMount`和`componentDidUpdate`是一样的，在`UI`更新之前同步的执行

但是官网建议优先使用`useEffect`，因为它不会阻塞`UI`渲染，只有当遇到问题是才考虑使用`useLayoutEffect`

那么遇到什么问题才需要考虑使用`useLayoutEffect`呢？答案是页面出现闪烁（先渲染一个值然后立马渲染另一个值）时，或者我们想在更新`UI`之前做些什么时，可以考虑使用`useLayoutEffect`

可以看这里[useLayoutEffect](https://codesandbox.io/s/uselayouteffect-no-flash-ylyyg)和[useEffect](https://codesandbox.io/s/useeffect-flash-on-render-yluoi)的区别，感受一下闪烁是什么意思

### useDebugValue

`useDebugValue`的主要作用是方便在`React DevTools`里查看自定义`hooks`的标签

## 自定义`hooks`

自定义`hooks`就是用`react`官方的`hooks`组合来实现可复用的逻辑，自定义`hooks`约定必须以`use`开头，即形如`useXXX`，这样`react`才能知道这可能是一个自定义`hooks`并检查它是否符合规范

下面简单列举一些自定义`hooks`的实现方式

### usePrevious

获取上一次的值，官网 FAQ 里有提到

```js
// usePrevious.js
import { useState, useRef, useEffect } from 'react';

export default function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
```

```js
// index.js
import { useState } from 'react';
import usePrevious from './usePrevious.js';

const Demo = () => {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <p>
        Now: {count}, before: {prevCount}
      </p>
    </p>
  );
};
```

### useWhyDidYouUpdate

在控制台打印组件更新的原因

```js
// https://ahooks.js.org/zh-CN/hooks/state/use-why-did-you-update
import { useEffect, useRef } from 'react';

export default function useWhyDidYouUpdate(componentName, props) {
  const  prevProps = useRef(); // 这里可以用usePrevious

  useEffect(() => {
    if (prevProps.current) {
      const allKeys = Object.keys({ ...prevProps.current, ...props });
      const changedProps = {};

      allKeys.forEach((key) => {
        if (prevProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: prevProps.current![key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length) {
        console.log('[why-did-you-update]', componentName, changedProps);
      }
    }

    prevProps.current = props;
  });
}
```

```js
// index.js
import {} from 'react';
import useWhyDidYouUpdate from './useWhyDidYouUpdate.js';

const Demo = props => {
  const [count, setCount] = useState(0);

  useWhyDidYouUpdate('demo', { ...props, count });

  // ...
};
```

## `hooks`FAQ

官方的`hooks`答疑，我觉得有几个问题值得关注一下，所以做了一下融汇和总结

### `hooks`如何模拟`class`组件的生命周期?

首先我想表达一下我自己的观点，`hooks`和`class`组件是两种不同的思考方式，在使用`hooks`的过程中不能一味的想着怎么去模仿生命周期函数，而应该根据`hooks`的特性来正确地使用`hooks`

- `constructor`

  函数组件不需要构造函数，不用模拟

- `getDerivedStateFromProps`

  尽管官方不推荐使用`getDerivedStateFromProps`，但如果用到了的话，`hooks`还是能够模拟的

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

    // ...
  }
  ```

  ```js
  const MyComponent = (props) => {
    const [isScrollingDown, setIsScrollingDown] = useState(false);
    const [lastRow, setLastRow] = useState();

    if (props.currentRow !== lastRow) {
      setIsScrollingDown((props.currentRow > lastRow);
      setLastRow(props.currentRow);
    }

    // ...
  }
  ```

- `render`

  不需要模拟

- `componentDidMount`, `componentDidUpdate`, `componentDidUnmount`

  这三个推荐用`useEffect`来模拟，但是要注意的是`useEffect`的执行时机跟他们是不同的，`useLayoutEffect`模拟更合适

  ```js
  useEffect(() => {
    console.log('did mount');

    return () => {
      console.log('will unmount');
    };
  }, []);

  useEffect(() => {
    console.log('did mount');
    console.log('did update');
  }, [deps]);
  ```

- `shouldComponentUpdate`

  使用`React.memo`，`React.memo`只比较`props`，详见`react`基础`React.memo`章节

- `getSnapshotBeforeUpdate`，`componentDidCatch`以及`getDerivedStateFromError`，暂时无法模拟

### 我应该使用单个 useState 还是多个 useState?

当状态较多时，会出现连续多个`setXXXState`的情况，而如果把`state`都合并，又需要注意`hooks`的`setXXXState`并不会自动合并更新，所以才会有这个问题

官方建议是，把`state`拆分成多个，拆分的原则是这几个`state`不会同时发生变化，也就是说如果某几个`state`总是一起变化，就该考虑是不是该合并成一个`state`了

### 如何实现只在更新时执行 effect？

`useEffect`可以模拟`componentDidMount`和`componentDidUpdate`，这个问题的意思应该是`useEffect`如何区分`didMount`和`didUpdate`，借助一个`useRef`就可以实现

```js
const Demo = () => {
  const [count, setCount] = useState(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      console.log('did mount');
      isFirstRender.current = false;
    } else {
      console.log('did update');
    }
  }, [count]);

  return (
    <div
      onClick={() => {
        setCount(count + 1);
      }}
    >
      {count}
    </div>
  );
};
```

### 如何实现 forceUpdate？

```js
// useReducer版
const Demo = () => {
  const [ignore, forceUpdate] = useReducer(x => x + 1, 0);
};

// useState版
const Demo = () => {
  const [ignore, setIgnore] = useState(0);

  const forceUpdate = () => {
    setIgnore(x => x + 1);
  };
};
```

如果要把`forceUpdate`给其他组件调用，考虑使用`useImperativeHandle`

### 为什么我拿到的 props 或 state 不是最新的？

这个问题我自己也碰到过很多遍，总结原因是没有理解`hooks`作为函数组件与`class`组件的区别，可以查看[这篇文章](https://overreacted.io/how-are-function-components-different-from-classes/)，文章中提到函数组件和`class`组件的最大区别是：函数组件每一次渲染都会**捕获**它渲染所需要的值（`props`和`state`）

先来看一下`class`组件的一个例子

```js
class Message extends React.Component {
  state = {
    message: '',
  };

  showMessage = () => {
    alert(this.state.message);
  };

  handleInputChange = e => {
    this.setState({
      message: e.target.value,
    });
  };

  handleClick = () => {
    setTimeout(this.showMessage, 3000);
  };

  render() {
    const { message } = this.state;
    return (
      <div>
        <input value={message} onChange={this.handleInputChange} />
        <button onClick={this.handleClick}>show message</button>
      </div>
    );
  }
}
```

当我们输入`message1`，然后点击按钮，然后 3 秒内修改输入为`message2`，此时等待弹窗，结果弹出的是`message2`

下面来看函数组件的例子

```js
const Message = () => {
  const [message, setMessage] = useState('');

  const showMessage = () => {
    alert(message);
  };

  const handleInputChange = e => {
    setMessage(e.target.value);
  };

  const handleClick = () => {
    setTimeout(showMessage, 3000);
  };

  return (
    <div>
      <input value={message} onChange={handleInputChange} />
      <button onClick={handleClick}>show message</button>
    </div>
  );
};
```

同样的，我们输入`message1`，然后点击按钮，然后 3 秒内修改输入为`message2`，此时等待弹窗，结果弹出的是`message1`

为了方便演示，上面的例子使用了`hooks`，但其实两者表现出来的差异并不是`hooks`造成的，而是函数组件每次渲染都有自己的渲染所需要的值，可以理解为每次渲染就是一次快照，数据已经定格了

---

在上面的函数组件中，如果想弹出的结果是`message2`该怎么做？

- 思路 1，用 useRef

  `class`组件是用`this`来访问`state`或`props`的，这是能够访问到最新值的原因，所以`hooks`里面也可以用`useRef`来实现

  ```js
  const Message = () => {
    const [message, setMessage] = useState('');
    const latestMessage = useRef(message);

    const showMessage = () => {
      alert(latestMessage.current);
    };

    const handleInputChange = e => {
      const newMessage = e.target.value;
      setMessage(newMessage);
      latestMessage.current = newMessage;
    };

    const handleClick = () => {
      setTimeout(showMessage, 3000);
    };

    return (
      <div>
        <input value={message} onChange={handleInputChange} />
        <button onClick={handleClick}>show message</button>
      </div>
    );
  };
  ```

- 思路 2，用 useReducer

  `useReducer`可以理解为发送一个命令，具体执行命令的是`reducer`函数，而`reducer`函数里能够获取最新的`state`

  ```js
  const initState = {
    message: '',
  };

  const reducer = (state, { type, payload }) => {
    switch (type) {
      case 'SET_MESSAGE': {
        return {
          ...state,
          message: payload,
        };
      }

      case 'ALERT_MESSAGE': {
        alert(state.message);
        return state; // don`t forget this
      }

      default: {
        return state;
      }
    }
  };

  const Message = () => {
    const [store, dispatch] = useReducer(reducer, initState);
    const { message } = store;

    const showMessage = () => {
      dispatch({
        type: 'ALERT_MESSAGE',
      });
    };

    const handleInputChange = e => {
      const newMessage = e.target.value;
      dispatch({
        type: 'SET_MESSAGE',
        payload: newMessage,
      });
    };

    const handleClick = () => {
      setTimeout(showMessage, 3000);
    };

    return (
      <div>
        <input value={message} onChange={handleInputChange} />
        <button onClick={handleClick}>show message</button>
      </div>
    );
  };
  ```

  `useState`的`setXXXState`也可以用函数来获取最新值，比如`setCount(c => c + 1)`和`setCount(count + 1)`相比，前者能够获取最新的`count`，而后者可能拿不到最新的`count`

上面举的例子用的是`useState`，然后用`setTimeout`模拟了异步，实际上在`useEffect`里有异步操作的话，也会碰到同样的问题，解决方法类似

### 如何正确的处理 useEffect 的依赖

首先，官方建议是如果提供了依赖数组，那么所有在`useEffect`内部使用的`props`,`state`以及他们派生出来的值都应该添加到依赖数组，否则会出现上面提到的拿到的`state`或`props`不是最新的值

在`class`组件时，我们经常这么写

```js
class Demo extends React.Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const { id } = this.props;
    const result = await fetch({ id });
    // do something
  };
}
```

然后`hooks`组件可能也想这么写

```js
const Demo = ({ id }) => {
  const fetchData = async () => {
    const result = await fetch({ id });
    // do something
  };

  useEffect(() => {
    fetchData();
  }, []);
};
```

尽管这可能是我们想要的效果，`id`不变的话也不会重新执行`fetchData`，但这么做会带来风险，首先`eslint`插件不能正确的帮我们判断`hooks`使用是否正确，因为它知道我们是否使用了依赖，其次长期这样写的话会养成不好的习惯，有一定的风险，正确的做法是把`fetchData`的声明移动到`useEffect`内部，然后添加正确的依赖

```js
const Demo = ({ id }) => {
  // 这样写也是错的，因为useEffect的第一个参数的返回值必须是一个函数，async函数返回的是一个promise
  useEffect(async () => {
    const result = await fetch({ id });
    // do something
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch({ id });
      // do something
    };
    fetchData();
  }, [id]);
};
```

再来看一个例子

```js
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <h1>{count}</h1>;
}
```

这个函数的目的应该是希望得到一个计数器，但实际上`count`的值由`0`变`1`后一直是`1`，原因可以参考上面的函数组件与`class`组件的区别，解决方法可以是把`count`加到依赖数组里，但是这样做会导致每次`count`变化时，都要取消定时器然后重新创建定时器，显然不太合理，最终的解决方案是不依赖`count`，把`setCount`参数改成函数

```js
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <h1>{count}</h1>;
}
```

### 如何初始化一个开销很大的 useState 或者 useRef

在某些情况下，我们可能希望从`props`计算出`useState`的初始值，所以可能这么写

```js
const Demo = props => {
  // createFromProps每次render都会执行
  const [state, setState] = useState(createFromProps(props.user));
};
```

前面（`hooks`使用规则）提到过`useState`在多次`render`的时候只会用一次初始值，后面都会忽略初始值参数，但是`createFromProps`每次`render`都会执行，而理想情况是`createFromProps`只执行一次，可以这么写

```js
const Demo = props => {
  // createFromProps只执行一次
  const [state, setState] = useState(() => createFromProps(props.user));
};
```

接着看`useRef`的例子

```js
function Image(props) {
  // IntersectionObserver 在每次渲染都会被创建
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

`useState`因为能接收一个函数作为参数，`useRef`不能接收函数该怎么处理呢？需要自己处理

```js
function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver 只会被惰性创建一次
  function getObserver() {
    if (ref.current === null) {
      ref.current = new IntersectionObserver(onIntersect);
    }
    return ref.current;
  }

  // 当你需要时，调用 getObserver()
  // ...
}
```

### 如何做数据请求？

这个问题看似很简单，刚开始使用`hooks`的时候，都知道在`useEffect`里请求数据，但如何把数据请求做得更合理，比如如何处理响应时序问题(后请求的接口先响应，先请求的接口后响应，导致显示的结果与请求的参数对不上，在`tab`切换时可能遇到)，如何取消请求，如何处理`Can't call setState (or forceUpdate) on an unmounted component`这个`warning`

当然，上面的问题在`class`组件中也会碰到，我们还是先看一个`class`组件的例子

```js
class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    axios
      .get('xxx')
      .then(res => {
        this.setState({
          list: res.list,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  // ...
}
```

上面是一个很常规的写法，但是由于接口请求是异步的，如果我们在接口返回前做了路由跳转，导致组件销毁了，然后接口返回后继续执行`then`函数里的`this.setState`，这时就会有`Can't call setState (or forceUpdate) on an unmounted component`这个`warning`，尽管这个`warning`不会让应用崩溃，但会有内存泄露的风险，而且数量多的话也会影响性能

`class`组件的解决办法如下

```js
class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
    this._mounted = false;
  }

  componentDidMount() {
    this._mounted = true;
    axios
      .get('xxx')
      .then(res => {
        if (this._mounted) {
          this.setState({
            list: res.list,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  // ...
}
```

再来看`hooks`的例子

```js
const Demo = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    axios
      .get('xxx')
      .then(res => {
        setList({
          list: res.list,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }, [deps]);
};
```

上面的`hooks`同样有报`Can't call setState (or forceUpdate) on an unmounted component`的风险，解决方案如下

```js
const Demo = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    let ignore = false;
    axios
      .get('xxx')
      .then(res => {
        if (!ignore) {
          setList({
            list: res.list,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    return () => {
      ignore = true;
    };
  }, [deps]);
};
```

上面添加了一个`ignore`变量，就可以解决`warning`，同时也可以解决时序问题

但是上面的例子只是忽略了上一次请求的结果，并没有取消上一个请求，如果想实现取消请求，建议使用`axios`库

---

在查看文档的时候又了解了一个新的库[SWR](https://swr.vercel.app/zh-CN)，`SWR`是`stale-while-revalidate`，是一种`http`缓存失效策略，当请求接口时，这种策略会首先从缓存中返回数据（这个数据可能是过期的）,同时发送一个请求，最后请求返回最新的数据再更新

### hooks 会因创建函数而变慢吗？

在使用`hooks`的时候，经常需要在函数内部创建新的函数来满足业务需求，所以很多人都有疑问（包括我），每次`re-render`的时候都会重新创建这些函数，会有性能问题吗？

官方的答案是，不会！现代浏览器在闭包和类的原始性能只有在极端场景下才会有明显的差别

所以我们不需要特意未函数包一层`useCallback`或者`useMemo`，但是如果是出于其他目的，比如保持引用相同，防止子组件更新，是可以考虑使用`useCallback`或`useMemo`的

### 如何在 useCallback 里读取一个经常变化的值？

`useCallback`的目的是为了在依赖不变的情况下保持相同的引用，这个问题其实和为什么获取的`props`和`state`不是最新的是一样的，解决方法同样可以利用`useReducer`来把取数操作放到外面，或者利用`useRef`来保存一个最新值的引用
