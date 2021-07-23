---
title: 路由管理
order: 5
group:
  title: React
  order: 6
---

# 路由管理

`react`的路由管理，用得比较多的应该是`react-router`了，最近在阅读文档的时候，发现还有一个`@reach/router`使用的人也比较多

这里也想提一下`react-router-dom`，因为`react-router`与`react-router-dom`有时候不知道两个之间的区别和联系，可以把`react-router`理解为核心功能，与使用环境无关，而`react-router-dom`是`react-router`在`dom`环境下（一般是浏览器）的封装，与之对应的是`react-router-native`，是在`React Native`环境下的封装

## react-router，react-router-dom，基于版本 v5.2.0

我觉得可以从以下几个问题来看路由管理

### 如何跳转页面

页面跳转也可以分为两个方面，一个是利用`Link`或`NavLink`来渲染跳转链接，另一个是利用`history`在`js`里做跳转

- Link

`<Link />`默认会渲染成`a`标签，必须指定`to`属性

- NavLink

`NavLink`是一种特殊的`Link`，特殊的地方是路由匹配的话会加上我们指定的`activeClassName`和`activeStyle`，即选中状态

- history

`history`是一个对象，包含`history.push`、`history.replace`、`history.goBack`等路由切换的方法

### 如何渲染页面

一般通过`react-router-dom`里`BrowserRouter`、`HashRouter`以及`Route`来渲染

- Router，BrowserRouter，HashRouter，MemoryRouter，StaticRouter

  这几个`Router`一般只需要用一个即可，下面的`Switch`和`Route`必须是某一个`Router`的`children`才行(因为是利用`Context`来传递路由相关数据的)

  `Router`是最原始的版本，可以传入自定义的`history`，例如

  ```js
  import React from 'react';
  import ReactDOM from 'react-dom';
  import { Router, Switch, Route } from 'react-router-dom';
  import { createBrowserHistory } from 'history';

  const customHistory = createBrowserHistory();

  const App = () => (
    <Router history={customHistory}>
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );

  ReactDOM.render(<App />, node);
  ```

`BrowserRouter`是利用`H5`的`history API`实现的路由跳转，一般我会选择用这个

`HashRouter`是利用`url`的`hash`变化来实现路由跳转，兼容低版本浏览器，但是不支持`location.key`和`location.state`，并且当当我们跳转到同一个链接时（比如一直点击同一个链接），`HashRouter`会提示不会在`history`栈里添加新的记录

`MemoryRouter`是把路由变化存储在内存中，浏览器地址栏不会变化，适合在非浏览器环境中使用，目前我没使用过

`StaticRouter`是永远不会改变地址的`Router`，目前没使用过

- Switch, Route, Redirect

  `Route`是用来做路由匹配的，只有匹配了规则才会渲染相应的组件，渲染组件有三种方式，一般不同时使用，同时使用的话优先级依次是`children`，`component`，`render`

  - `component`属性

    ```js
    <Route path="/" component={Home}>
    ```

    此时`Home`组件上会新增三个`props`，分别是`match`，`location`，`history`

  - `render`属性

    ```js
    <Route path="/" render={({ match, location, history }) => <Home />} />
    ```

    此时如果没有给`Home`传对应的`props`，`Home`组件上是没有`match`，`location`等`props`的，所以要记得传

    `render`属性和`component`属性的区别是：

    `That means if you provide an inline function to the component prop, you would create a new component every render. This results in the existing component unmounting and the new component mounting instead of just updating the existing component.`

    总结起来就是当传递`inline function`时，`component`属性会新建一个组件，所以会执行原组件的`ComponentWillUnmount`和新组件的`constructor`、`componentDidMount`等生命周期，而使用`render`的时候只会更新原组件

    还是比较难以感受到实际的区别，所以我觉得需要一个小`demo`来感受一下，可以看[这里](https://codesandbox.io/s/render-vs-component-2sxpu)

    在`home0`的路由下，点击`add`，发现`Home`只执行了`render`，符合预期

    在`home1`的路由下，点击`add`，发现`Home`只执行了`unmount`和新的`didmount`和`render`，这就是上面说的`component`在`inline function`下会先卸载原组件再新建一个新的组件，这样会导致`state`丢失

    在`home2`的路由下，点击`add`，发现`Home`只执行了`render`，符合预期

    所以总结就是，可以使用`component={SomeComponent}`或者`render={() => <SomeComponent />}`，但是不建议使用`component={() => <SomeComponent />}`

  - `children`

  `children`属性和`render`属性是类似的，当`children`为普通组件时，会根据是否匹配渲染，当`children`是类似`render`的函数时，**不论是否匹配都会渲染函数的结果**

  ```js
  <Route path="/home">
    // 只有匹配才会渲染，但是home不会有match, location等属性
    <Home />
  </Route>

  <Route path="/home">
    {({ match, location, history }) => {
      // 可根据是否匹配渲染不同结果
      return match ? <Home /> : <Other />
    }}
  </Route>
  ```

  `Switch`的作用是，只渲染匹配到的第一个`Route`或者`Redirect`

  `Redirect`的作用是，匹配到某个路由时，跳转到另一个路由，一般可以用来维护新页面和老页面的跳转关系

### 路由属性有哪些，如何传递/获取路由参数？

`route props`包含`match`，`location`和`history`

前面提到了三种渲染方式，每一种方式都可以把`route props`传递给渲染的组件，在`hooks`时代，我们还可以用`useHistory`，`useLocation`和`useRouteMatch`来获取路由属性

#### 路由参数的传递/获取

路由传递参数的方法有三种，`/url?search` `/url/:params`和`location.state`

`/url?search`传递的参数可以在`location.search`里拿到，拿到的结果是带`?`的字符串，可以用[querystring](https://www.npmjs.com/package/querystring)解析

`/url/:params`传递的参数可以在`match.params`里拿到

`location.state`传递参数是在`Link`或者`NavLink`或者`history.push`时传递的，比如

```js
history.push({
  pathname: '/url',
  state: {
    someValue: '',
  },
});
```

然后在新的页面可以通过`location.state`拿到参数，但是如果使用的是`HashRouter`，这里拿到的参数在页面刷新时会消失，使用`BrowserRouter`则不会

### 其他辅助功能

剩下的功能中，`withRouter`是需要关注的，它是一个高阶组件，作用是给组件增加`route props`，因为在`hooks`之前，只有`Route`直接渲染的组件才会有`route props`，子组件是没有的，但是有了`hooks`只后，我们可以在任意组件里使用`useHistory`来拿参数，不用再使用`withRouter`了

其他功能如`generatePath`函数，`matchPath`函数我没用过，也没有想到合适的使用场景，所以不展开了

## 权限验证

很多时候我们都希望某些页面只有登录的用户才能看到，未登录的用户跳转到登录页，登录只后再跳回来，基于以上需求可以定一个这样的`Route`

```js
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const auth = checkAuth(); //

      if (auth) {
        return <Component {...props} />;
      }

      return <Redirect to={`/login?redirect=${props.location.pathname}`} />;
    }}
  />
);
```

`PrivateRoute`的使用方法与`Route`是一样的，但是不能有自己的`render`属性
