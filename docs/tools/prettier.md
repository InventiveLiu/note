---
title: prettier
order: 6
group:
  title: 工程化工具
  order: 7
---

# prettier

`Prettier`是一个代码格式化工具，能够帮团队统一编码风格

所谓编码风格，包含的内容很多，比如缩进、驼峰、换行，甚至空格分号等等，`ESLint`也能够达完成这些工作，那为什么还需要`Prettier`呢？

`ESLint`的不同配置会产生不同风格，而且每个人都有自己的习惯，所以会存在一些关于编码风格的讨论，比如怎么配置更好？我是不是配置对了呢？

`Prettier`的目的就是为了结束这些讨论，`Prettier`的理念是**极少的配置**，**你就用我的风格，否则就不要用我**

但老实说，我还是没彻底明白为什么需要`Prettier`，只是大家都在用，我不用就`out`了，也许在格式化方面`Prettier`会比`ESLint`更快？

`ESLint`会检查并提示错误，然后`--fix`会修复它，而`Prettier`不会检查而是直接全部格式化，[这里](https://github.com/prettier/prettier/issues/7828)提到`Prettier`的`VSCode`插件比`ESLint`+`--autofix`更快

抛开速度（假设`Prettier`更快）来讲，我觉得对小团队，两者差别不大; 但对大公司，若干团队之间想统一风格的话，`Prettier`是有优势的

## 配置

虽然`prettier`自称极少的配置，但还是存在一些配置的，同样建议在单独的文件中配置，例如`.prettierrc.js`

完整的配置列表直接看[官网](https://prettier.io/docs/en/options.html)吧

## 忽略文件

`.prettierignore`文件，或者`prettier-ignore`注释

## 与`ESLint`，`StyleLint`配合使用

`Linter`类型的库，规则可以分为 2 类：

- 编码风格，`max-length`，`no-mixed-spaces-and-tabs`

  对于这一类规则，`Prettier`也可以做到

- 代码质量，如`no-unused-vars`, `no-implicit-globals`

  对于这一类规则，`Prettier`无能为力

所以，`Prettier`建议用`Prettier`做编码风格格式化，用`Linter`做代码质量把控；方法就是把`Linter`关于编码风格的规则禁用，仅保留代码质量相关的规则，`Prettier`已经帮我们实现了

- `eslint-config-prettier`

```js
// .eslintrc.js
module.exports = {
  extends: ['eslint:recommended', 'prettier'],
};
```

- `stylelint-config-prettier`

```js
// .stylelintrc.js
module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
};
```

## VSCode 插件

`VSCode`插件提供编码时的`Prettier`实时自动格式化，不需要运行`prettier --write .`命令

## 参考资料

[Prettier 看这一篇就行了](https://zhuanlan.zhihu.com/p/81764012)
