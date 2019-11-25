# assets

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 开发流程

- 根据接口文档写`service`
- 配置routers
- 构建页面
- 如果后端还没写完，根据`service`添加`proxy`

## 前端组件开发规范

前端组件整体上根据业务和非业务抽离成业务相关组件和业务无关组件，业务无关组件比如我们自己引入的一些ui库。

业务相关组件包括公共组件，某一模块公用组件，当前模块独用组件。

业务相关组件可以再通过抽离数据层，来封装具体的业务数据以及方法

从组件中抽取出来可以不止一个业务相关数据层，或者说业务相关数据层应该是在分析需求之后构建的，然后下发到组件，一个组件可以有多个数据层来支撑。

业务无关的组件当然也可以抽离数据层，只不过与业务相关组件抽离的原则不同，抽离出来的数据层也是业务无关的。

所以根据以上所述，当我们分析了业务需求，分析了页面之后，在封装组件的时候需要按顺序考虑以下问题：
- 是否要封装成业务无关的组件？
- 是否要封装成业务相关公共组件？
- 仅在这一模块中公共的组件？
- 当前模块独有的组件

在抽离数据层的时候，也同样考虑是否是全局公用，还是当前组件公用，如果是全局公用，根据业务划分，抽离出来，然后注入组件。这一层的目的是分离数据与视图

## 组件命名规范

- 自定义的引入使用PascalCasedComponent，以和ui库组件区分
- 待续...

## 样式自定义

一般情况下不需要改动，如若改动告知 \<kangcc@vodjk.com\>


如果有更改element-ui库组件样式的需求，在assets目录下运行

```
(npm i element-theme -g得到et命令)

yarn et --watch --config ./element-variables.scss --out ./theme
或
./node_modules/.bin/et --watch --config ./element-variables.scss --out ./theme`

改变sass文件的变量值即可
```

如果发现样式库中不合理的地方(ui或者测试或者自己觉得不符合本项目气质的地方)，在`utils/mixins/theme_change.scss`中对相应的类就行样式修改

## element-ui v1版本到v2版本升级说明

- el-dialog废弃v-model和size，指定大小通过width和fullscreen
- button的size变更为medium,small,mini
- 如果使用element-UI的icon，button的icon需要写完整的图标名，input需要在icon前加suffix或prefix
- tag的type只支持success,info,warning和danger
- button的type多一种属性plain,减少对应type的饱和度

搜集了以下文档，帮助相关开发人员理解 v1 到 v2 的差异

- [官方 CHANGELOG](https://github.com/ElemeFE/element/blob/dev/CHANGELOG.zh-CN.md)
- [Element-ui升级2.0后初体验](https://segmentfault.com/a/1190000012051823)

## 包升级说明

- 升级了之后，手动执行`npm run dll`，重新生成vendor库，因为本地开发环境不使用vendor，而build之后的环境需要
- **如果使用npm升级包，同时也应该用yarn来升级一下，以更新本地的yarn.lock，并提交上去来锁定版本**
