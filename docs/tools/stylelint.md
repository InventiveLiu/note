---
title: stylelint
order: 5
group:
  title: 工程化工具
  order: 7
---

# stylelint

`css`一直是我们 web 开发者容易忽视的一个领域（相对`js`来说），但其实`css`同样很强大，并且值得被重视

`js`有`ESLint`来帮助我们检查代码规范，纠正我们的编码习惯，`css`中的`stylelint`也可以帮助我们写出更好的`css`代码

我们写`css`可能很随意，比如滥用标签选择器，过多的嵌套规则，冲突或者无效的`css`属性等，使用`stylelint`后可能会碰到一些报错，我们去探索去了解这些报错背后的原因，就可以更加理解`css`，写出更好  的代码

## 配置

建议使用单独的文件配置，比如`.stylelintrc.js`

### extends

继承其他配置，常用的有`stylelint-config-standard`, `stylelint-recommended`, `stylelint-config-prettier`等

### plugins

插件，即规则的集合，常用的有`stylelint-order`

### rules

规则，写法跟`ESLint`类似，

```js
// .stylelintrc.js
module.exports = {
  rules: {
    indentation: [
      2,
      {
        except: ['block'], // 规则名数组，没明白这个的作用
        message: 'Please use 2 spaces for indentation.', // 提示信息
        severity: 'error', // warning 或者 error
      },
    ],
  },
};
```

### ignoreFiles

可以使用这个配置来忽略某些文件，或者使用`.stylelintignore`，或者使用注释

## VSCode 插件

`VSCode`插件提供编码时的`stylelint`实时校验和保存自动`fix`，不需要运行`stylelint --fix`命令

我建议是在保存是自动修复，因为这样我们可以看到做了哪些更改，以及会去思考为什么要这么改，对编码习惯有帮助

如果不在乎编码习惯或者电脑太慢了，一般是通过`git hooks`在提交代码之前做检查和修复

## 跟 prettier 配合使用

见[prettier](/tools/prettier)章节
