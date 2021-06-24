---
title: cli工具
order: 2
group:
  title: 个人项目
  order: 1
---

# cli

`cli`是`command line interface`的简写，即命令行工具，常用的`vue-cli`，`create-react-app`等都属于`cli`

## `cli`可以帮前端开发做什么？

搭建`cli`的目的是帮助我们减少重复的工作，在前端开发中，我们经常做的事情有：

- 新建项目，如果沿用当前框架，则把某个项目的代码 copy 一份来修改，不够纯净
- 新建项目，如果搭建新的框架，则开始寻找轮子，甚至从零开始自己搭建，自己配`webpack`，`babel`等
- 编写页面，复制另一个页面来修改，或者手动新建`index.js`，`index.css`并编写基础的内容

以上是我觉得自己经常重复做的事情，`cli`可以帮我新建一个纯净的项目，帮我们拉取自己的项目框架，这是我搭建`cli`的主要原因

## 如何搭建自己的 cli

网上很多搭建`cli`的教程，借助第三方库搭建一个`cli`不是很难

### 新建项目

创建目录

```bash
mkdir inventive-cli && cd inventive-cli
```

初始化`npm`，并修改`package.json`

```bash
npm init -y
```

`package.json`的`bin`字段表示项目有命令行需要添加到环境变量

```json
{
  "name": "inventive-cli",
  "version": "1.0.0",
  "description": "a simple cli for inventiveLiu",
  "main": "index.js",
  "bin": {
    "inventive": "./src/cli.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "inventiveLiu",
  "license": "ISC"
}
```

新建文件`src/cli.js`，并输入以下内容

```js
#! /usr/bin/env node

console.log('i am from cli');
```

`#! /usr/bin/env node`的作用是使用用户环境`nodejs`

`npm link`然后运行`inventive`命令，不出意外的话控制台会打印`i am from cli`

### 使用的第三方库

- [commander](https://github.com/tj/commander.js)

  我们在使用命令行的时候，都会传入参数，比如不知道命令行怎么使用时，我们会运行`inventive --help`来查看怎么使用

  `--help`就是我们传递的参数，当不使用`commander`的时候，我们来看一下如何获取参数，修改`cli.js`如下

  ```js
  #! /usr/bin/env node

  console.log('i am from cli');

  console.log('argv: ', process.argv);
  ```

  为了能够得到参数的规律，我们多加几个参数，比如我们运行`inventive --one two tree=four --env development -v`

  控制台打印结果如下

  ```bash
  i am from cli
  argv:  [
    '/usr/local/bin/node',
    '/usr/local/bin/inventive',
    '--one',
    'two',
    'tree=four',
    '--env',
    'development',
    '-v'
  ]
  ```

  观察下来，`argv`是一个数组，且从第 3 个开始才是我们想要的参数，参数以空格作为分隔，这样我们就可以拿到参数，然后做自己想做的事情，想法很简单，但实现起来又会出现很多问题，比如怎么将参数名和参数值对应起来，`--one`的值是`true`还是`two`，这些问题如何解决我没有继续研究，而是选择使用`commander`

  在使用其他`cli`的过程中，我觉得`cli`对参数的定义和传递都遵循一定的规律，比如`-`一般表示缩写命令，`--`一般表示详细命令，例如`npm install -S`和`npm install --save`，我想找到一个类似[Semantic Versioning](`https://semver.org/`)的规范，但是没有找到

  参数的传递如果没有规范的话，很容易混乱，而`commander`似乎定义了这种规范，`commander`主要帮我们做了三件事情

  - 定义`option`, `option`即`--env`这种参数
  - 定义`command`, `command`即`npm init`的`init`这种命令，`command`可以有自己的`option`
  - 定义`--help`

  安装`commander`后，修改`cli.js`如下

  ```js
  #! /usr/bin/env node

  const { Command } = require('commander');
  const program = new Command('inventive');
  const pkg = require('../package.json');

  /**
   * 定义版本及使用说明
   */
  program.version(pkg.version).usage('<command> [options]');

  /**
   * 定义 create 命令
   * -f, --force, 表示目录已存在时强制覆盖
   */
  program
    .command('create <project-name>')
    .description('create a new project')
    .option('-f, --force', 'overwrite directory if exist')
    .action((name, options) => {
      console.log(name, options);
      // 下面会提到create.js
      require('./create')(name, options);
    });

  program.parse(process.argv);
  ```

  运行`inventive`命令，会有我们熟悉的提示

  ```bash
  ➜  inventive-cli inventive
  Usage: inventive inventive <command> [options]

  Options:
    -V, --version                    output the version number
    -h, --help                       display help for command

  Commands:
    create [options] <project-name>  create a new project
    help [command]                   display help for command
  ```

  运行`inventive create my-app`，可以拿到正确的参数

  ```bash
  my-app {}
  ```

- [inquirer](https://www.npmjs.com/package/inquirer)

  `cli`少不了跟用户交互的场景，比如需要询问用户是否覆盖已有目录，再比如需要询问用户选择哪一个模版

  `inquirer`就是一个这样一个工具，帮助我们跟用户交互，主要方法是`prompt`，然后通过`type`来配置各种类型的交互

  安装`inquirer`后，按照以下顺序询问用户

  1. 是新建一个应用代码还是库类代码？因为他们的打包工具及`babel`的配置有些差别

  2. 选择一个模版，根据第一步的结果，返回不同的模版给用户选择

  3. 是否使用`ts`，如果是库类开发，强烈建议用`ts`

  新建一个`create.js`来处理`create`命令，最终的代码如下：

  ```js
  const path = require('path');
  const fs = require('fs-extra');
  const inquirer = require('inquirer');
  const chalk = require('chalk');

  const create = (name, options) => {
    const targetDir = path.join(process.cwd(), name);
    const isExist = fs.existsSync(targetDir);

    if (isExist) {
      if (options.force) {
        fs.removeSync(targetDir);
      } else {
        console.log(
          chalk`{yellow target dir exist, you may use {bold create -f or --force} to overwrite it}`,
        );
        return;
      }
    }

    const questions = [
      {
        type: 'list',
        name: 'type',
        message:
          'application or library? they have different bundler and babel config',
        choices: [
          {
            name: 'application',
            value: 'application',
          },
          {
            name: 'library',
            value: 'library',
          },
        ],
        default: 0,
      },
      {
        type: 'list',
        name: 'template',
        message: 'choose a template for you',
        choices: answer => {
          if (answer.type === 'application') {
            return [
              {
                name:
                  'basic template include webpack, babel, eslint, prettier, stylelint, react and react-router',
                value: 'basic',
              },
              {
                name:
                  'redux template, include more with redux and redux-saga than above',
                value: 'redux',
              },
              {
                name:
                  'antd template, usually used to create an admin dashboard application',
                value: 'antd',
              },
            ];
          }

          return [
            {
              name:
                'basic template, used to create a js lib, include rollup, babel, eslint, prettier',
              value: 'basic',
            },
            {
              name:
                'ui library template, used to create an ui library, include more with stylelint and dumi',
              value: 'ui',
            },
          ];
        },
        default: 0,
      },
      {
        type: 'confirm',
        name: 'ts',
        message: 'do you need typescript? strongly recommend for library',
        default: true,
      },
    ];

    inquirer.prompt(questions).then(answers => {
      console.log(answers);
    });
  };

  module.exports = create;
  ```

- [chalk](https://www.npmjs.com/package/chalk)

  `chalk`翻译为**粉笔**，很形象，它的作用是给`console.log`增加字体色、背景色、加粗等功能，给用户更友好的提示

- [ora](https://www.npmjs.com/package/ora)

  在控制台显示`loading`，有些耗时的操作可以显示`loading`，提升体验

接下来的问题就是如何为用户新建项目模版，上面的例子中，模版列表是写死在`cli`中的，模版有新赠或者修改时都需要修改`cli`的代码，这样不够灵活，我看了`create-react-app`的源码，它可以从各种途经新建模版，包括`npm`源，`git`地址，`file:`本地地址，`.tar.gz`远程压缩包等

个人项目不需要考虑太多情况，目前做法是把每个模版都在`github`单独维护，设置`topic`，然后通过`github api`获取我的仓库列表，通过`topic`过滤得到模版仓库列表

得到模版后，通过`git clone`获取模版代码，然后删除`.git`目录并重新`init`， `create.js`最终代码如下

```js
const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const ora = require('ora');
const https = require('https');

/**
 * get repo on github
 *
 */
const getTemplates = () =>
  new Promise((resolve, reject) => {
    https
      .get(
        'https://api.github.com/users/inventiveliu/repos',
        {
          headers: {
            accept: 'application/vnd.github.mercy-preview+json', // needed to show topics
            'content-type': 'application/json',
            'user-agent': 'nodejs', // needed for github api
          },
        },
        res => {
          const { statusCode } = res;
          const contentType = res.headers['content-type'];

          let error;
          if (statusCode !== 200) {
            error = new Error(
              'Request Failed.\n' + `Status Code: ${statusCode}`,
            );
          } else if (!/^application\/json/.test(contentType)) {
            error = new Error(
              'Invalid content-type.\n' +
                `Expected application/json but received ${contentType}`,
            );
          }
          if (error) {
            reject(error);
            // Consume response data to free up memory
            res.resume();
            return;
          }

          let result = '';
          res.on('data', chunk => {
            result += chunk;
          });

          res.on('end', () => {
            try {
              const jsonData = JSON.parse(result);
              const templateRepo = jsonData
                .filter(v => v.topics && v.topics.includes('template'))
                .map(({ name, description, clone_url }) => ({
                  name: description,
                  value: clone_url,
                  short: name,
                }));
              const app = templateRepo.filter(v =>
                v.short.startsWith('application'),
              );
              const lib = templateRepo.filter(v =>
                v.short.startsWith('library'),
              );
              resolve({
                app,
                lib,
              });
            } catch (error) {
              reject(error);
            }
          });
        },
      )
      .on('error', err => {
        reject(err);
      });
  });

/**
 * clone template
 * @param {string} url
 * @param {string} des
 */
const tryToClone = (url, des) => {
  const spinner = ora('clone template...\n').start();
  try {
    execSync(`git clone ${url} ${des}`, { stdio: 'inherit' });

    spinner.succeed(chalk.green('clone template succeed'));
  } catch (error) {
    spinner.fail(chalk.red('clone template failed with error message'));
    console.log(chalk.red(error.message));
    process.exit(1);
  }
};

/**
 * git re-init project
 * @param {string} targetDir
 * @param {boolean} commit
 */
const tryToReInit = (targetDir, commit) => {
  try {
    // remove original .git
    fs.removeSync(path.join(targetDir, '.git'));
    execSync('git init', {
      cwd: targetDir,
      stdio: 'ignore',
    });

    if (commit) {
      execSync('git add -A', {
        cwd: targetDir,
        stdio: 'ignore',
      });
      execSync('git commit -m "init project using inventive-cli"', {
        cwd: targetDir,
        stdio: 'ignore',
      });
    }
  } catch (error) {
    console.log(chalk.red('git re-init failed with error message'));
    console.log(chalk.red(error.message));
    process.exit(1);
  }
};

/**
 *
 * @param {string} name
 * @param {object} options
 */
const create = async (name, options) => {
  const targetDir = path.join(process.cwd(), name);
  const isExist = fs.existsSync(targetDir);

  if (isExist) {
    if (options.force) {
      fs.removeSync(targetDir);
    } else {
      console.log(
        chalk`{yellow target dir exist, you may use {bold create -f or --force} to overwrite it}`,
      );
      process.exit(1);
    }
  }

  const spinner = ora('fetching templates...');

  spinner.start();

  const templates = await getTemplates().catch(err => {
    spinner.fail(chalk.red('fetch template failed with error message'));
    console.log(chalk.red(err.message));
    return null;
  });

  if (!templates) {
    process.exit(1);
  }

  spinner.succeed(chalk.green('fetch template success'));

  const questions = [
    {
      type: 'list',
      name: 'type',
      message:
        'new application or library? they have different bundler and babel config',
      choices: [
        {
          name: 'application',
          value: 'application',
        },
        {
          name: 'library',
          value: 'library',
        },
      ],
      default: 0,
    },
    {
      type: 'list',
      name: 'template',
      message: 'choose a template for you',
      choices: answer => {
        templates;
        if (answer.type === 'application') {
          return templates.app;
        }

        return templates.lib;
      },
      default: 0,
    },
    {
      type: 'confirm',
      name: 'ts',
      message: 'do you need typescript? strongly recommend for library',
      default: answer => answer.type === 'library',
    },
  ];

  const answers = await inquirer.prompt(questions);
  tryToClone(answers.template, name);

  // remove .git directory and re-init
  tryToReInit(targetDir, options.commit);

  console.log(
    chalk.green(
      'All done! Open your project and read README.md to see how to start coding',
    ),
  );
};

module.exports = create;
```

到这里一个基本的`cli`算是完成了，但其实还有很多工作可以做，比如`cli`版本更新提示，再比如自动执行`npm install`为用户安装依赖等

## 参考链接

[从 0 构建自己的脚手架/CLI 知识体系（万字）](https://juejin.cn/post/6966119324478079007)\

[可视化搭建前端工程 - 阿里飞冰了解一下](https://juejin.cn/post/6844903650729394190)
