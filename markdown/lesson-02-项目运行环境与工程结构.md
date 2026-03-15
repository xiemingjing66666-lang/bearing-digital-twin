# 第 2 课：项目运行环境与工程结构

## 1. 本课定位

第 1 课我们解决的是“这是什么项目”的问题。  
第 2 课要解决的是另一个非常关键的问题：

**这个项目是怎么跑起来的，它的工程结构为什么这样组织。**

很多初学者在看真实项目时，会遇到两个典型障碍：

- 知道页面能打开，但不知道启动过程发生了什么
- 能看到很多文件夹，但不知道每个目录在整个工程里扮演什么角色

所以这一课的重点不是业务细节，而是工程认知。  
你要开始从“使用项目”进入“理解项目”的阶段。

---

## 2. 学习目标

学完这一课，你应该能够做到：

- 说清楚这个项目使用了哪些核心技术
- 看懂 `package.json` 中常见字段的意义
- 理解 `dev`、`build`、`lint`、`preview` 这几个脚本的作用
- 理解一个 `Vite + React + TypeScript` 项目的基本运行过程
- 认识当前项目主要目录的职责
- 区分 `main.tsx` 和 `App.tsx` 的不同角色

---

## 3. 先回答一个根本问题：项目为什么能运行

一个前端项目之所以能运行，不是因为“代码放在那儿就能显示页面”，而是因为它背后有一套完整的工程机制：

- 包管理工具负责安装依赖
- 构建工具负责启动开发服务器
- 入口文件负责挂载应用
- React 负责组件渲染
- 浏览器负责展示最终页面

在这个项目中，这套机制主要由下面几个部分组成：

- `package.json`
- `node_modules`
- `vite.config.ts`
- `index.html`
- `src/main.tsx`
- `src/App.tsx`

你可以先把它想象成一条流水线：

`安装依赖 -> 启动开发服务 -> 加载入口页面 -> 执行 main.tsx -> 渲染 App.tsx -> 显示整个应用`

---

## 4. 认识 package.json

建议先阅读：

- [package.json](/E:/code/bearing-digital-twin/package.json)

`package.json` 可以理解为前端项目的“工程说明书”。  
它至少承担了四个角色：

- 描述项目基础信息
- 声明依赖包
- 定义可执行脚本
- 告诉工具链当前项目如何组织

### 4.1 项目基本信息

你会看到类似内容：

```json
{
  "name": "bearing-digital-twin",
  "private": true,
  "version": "0.0.0",
  "type": "module"
}
```

这些字段可以这样理解：

- `name`：项目名称
- `private`：表示这是私有项目，通常不会直接发布到 npm
- `version`：项目版本号
- `type: "module"`：说明项目采用 ES Module 模块体系

这里你暂时不需要深入所有细节，但要知道：

**`package.json` 是工程入口级别的配置文件。**

### 4.2 scripts：项目最常用的操作入口

当前项目中最值得你优先理解的是：

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

这几个脚本非常重要。

#### `npm run dev`

作用：

- 启动开发服务器
- 支持本地调试
- 支持热更新

这是你平时开发时最常用的命令。

#### `npm run build`

作用：

- 先做 TypeScript 构建检查
- 再执行 Vite 打包

这里的：

- `tsc -b` 用于 TypeScript 工程构建检查
- `vite build` 用于生成可部署产物

你可以把它理解为：

**把开发态代码变成生产可发布代码。**

#### `npm run lint`

作用：

- 检查代码风格和潜在问题

这一步不会运行页面，但会帮助你提前发现：

- 不规范写法
- 潜在错误
- 不符合约定的代码

#### `npm run preview`

作用：

- 在本地预览打包后的产物

它更接近“部署后的效果检查”，而不是日常开发主命令。

---

## 5. 认识项目依赖

还是看 [package.json](/E:/code/bearing-digital-twin/package.json)。

项目依赖通常分两大类：

- `dependencies`
- `devDependencies`

### 5.1 dependencies：运行时依赖

这些是应用运行时真正需要的库，比如：

- `react`
- `react-dom`
- `three`
- `@react-three/fiber`
- `@react-three/drei`
- `echarts`
- `leva`

你可以先建立这层认知：

- `react` 和 `react-dom` 负责界面渲染
- `three` 负责 3D 引擎能力
- `@react-three/fiber` 让你用 React 写 Three.js 场景
- `@react-three/drei` 提供一些常用三维辅助组件
- `echarts` 用来做图表
- `leva` 常用于参数调试面板或控制面板类交互

### 5.2 devDependencies：开发时依赖

这些依赖主要帮助你开发和构建，比如：

- `vite`
- `typescript`
- `eslint`
- `@vitejs/plugin-react`

这类依赖更多服务于：

- 本地开发
- 类型检查
- 构建打包
- 代码规范校验

一个简单理解方式是：

- `dependencies` 偏“应用功能”
- `devDependencies` 偏“开发工具”

---

## 6. Vite 在这个项目里扮演什么角色

Vite 是这个项目的前端构建工具。  
你现在不需要把它学得特别深入，但至少要知道它在干什么。

它主要负责：

- 启动本地开发服务器
- 加快模块加载速度
- 支持热更新
- 构建生产代码

建议结合查看：

- [vite.config.ts](/E:/code/bearing-digital-twin/vite.config.ts)

你可以先把 Vite 理解成：

**这个项目的开发运行平台。**

没有它，你写的 React 代码不会自动变成浏览器能流畅运行的工程应用。

---

## 7. index.html 的角色

建议查看：

- [index.html](/E:/code/bearing-digital-twin/index.html)

很多初学者容易忽略这个文件，但它其实非常重要。  
它的作用可以理解成：

- 浏览器最先加载的 HTML 壳
- React 应用挂载的容器入口

前端应用不是直接“打开 `App.tsx` 就显示出来”，而是：

1. 浏览器先打开 `index.html`
2. 页面里有一个挂载节点
3. `main.tsx` 找到这个节点
4. React 把应用渲染进去

所以 `index.html` 是“浏览器入口”，`main.tsx` 是“前端应用入口”。

---

## 8. main.tsx 和 App.tsx 的关系

这是第 2 课最重要的知识点之一。

建议阅读：

- [src/main.tsx](/E:/code/bearing-digital-twin/src/main.tsx)
- [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)

### 8.1 main.tsx 做什么

`main.tsx` 通常负责：

- 引入全局样式
- 创建 React 根节点
- 把 `App` 挂载到页面容器上

你可以把它理解成：

**应用启动文件。**

它不负责具体业务逻辑，也不负责页面细节，它负责“把应用启动起来”。

### 8.2 App.tsx 做什么

`App.tsx` 通常负责：

- 页面总体布局
- 主要状态组织
- 组件装配
- 功能模块连接

你可以把它理解成：

**应用主界面文件。**

### 8.3 两者的区别

最简洁的理解方式：

- `main.tsx` 负责“启动”
- `App.tsx` 负责“运行中的应用内容”

如果你把这两个文件混在一起理解，后面读工程会很容易乱。

---

## 9. 当前项目的目录结构应该怎么看

建议你先从根目录和 `src` 目录去理解。

### 9.1 根目录常见内容

当前项目根目录中比较值得关注的有：

- `src`
- `public`
- `markdown`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.ts`
- `eslint.config.js`
- `index.html`

### 9.2 每个关键目录的职责

#### `src`

这是项目最核心的源码目录。  
应用的大部分逻辑都在这里。

#### `public`

通常用于放一些静态资源。  
这类资源一般不会经过模块化编译逻辑处理。

#### `markdown`

这是你当前学习资料所在的位置。  
按你的要求，课程文档、学习建议、教学内容都统一保存在这里。

### 9.3 src 目录怎么拆理解

结合当前项目，`src` 里面可以这样看：

- `components`：通用组件和界面模块
- `hooks`：自定义 Hook，封装业务状态逻辑
- `scenes`：三维场景级组件
- `services`：数据服务、通信服务、业务接入层
- `styles`：样式文件
- `types`：应用级类型定义
- `utils`：工具函数

这其实是一种比较清晰的前端工程分层。

---

## 10. 为什么要这样分目录

一个真实项目如果不分层，很快就会变成“所有东西都堆在一起”。  
而当前这种分法的好处很明显。

### 10.1 组件层负责界面

你想看页面长什么样、怎么拆面板，就去 `components`。

### 10.2 Hook 层负责状态逻辑

你想看实时数据如何加工、告警如何生成，就去 `hooks`。

### 10.3 服务层负责数据来源

你想看 mock 数据从哪来、WebSocket 怎么接入，就去 `services`。

### 10.4 场景层负责 3D 可视化

你想看模型、相机、灯光、热力图，就去 `scenes` 和相关 3D 组件。

### 10.5 类型层负责约束系统边界

你想先理解系统有哪些数据对象，就去 `types` 和 `services/types.ts`。

这就是工程化阅读的一个关键原则：

**先按职责分区，再进具体实现。**

---

## 11. TypeScript 配置文件在干什么

建议查看：

- [tsconfig.json](/E:/code/bearing-digital-twin/tsconfig.json)
- [tsconfig.app.json](/E:/code/bearing-digital-twin/tsconfig.app.json)
- [tsconfig.node.json](/E:/code/bearing-digital-twin/tsconfig.node.json)

你现在不需要逐项研究所有配置，但要知道它们主要在做什么：

- 告诉 TypeScript 如何检查代码
- 告诉 TypeScript 需要覆盖哪些文件
- 区分应用代码和 Node 侧配置代码的检查环境

简单理解：

- `tsconfig.json` 更像总配置入口
- `tsconfig.app.json` 更偏浏览器应用代码
- `tsconfig.node.json` 更偏构建工具和 Node 环境相关文件

后面你会逐步体会：  
这些配置不是“装饰品”，而是在保护工程质量。

---

## 12. ESLint 配置在干什么

建议查看：

- [eslint.config.js](/E:/code/bearing-digital-twin/eslint.config.js)

ESLint 的作用是帮助你保持代码质量。  
它不是用来“挑刺”的，而是帮你尽早发现问题。

在真实项目里，Lint 规则常常会帮助你避免：

- 忘记清理副作用
- 写出不稳定的 Hook 逻辑
- 出现未使用变量
- 留下有风险的代码习惯

所以以后你看到 `npm run lint`，不要把它理解成“只是格式检查”，它更接近“静态质量守门员”。

---

## 13. 一个前端项目从启动到显示的大致流程

你现在应该开始建立这个流程感。

可以这样理解当前项目：

1. 通过 `npm install` 安装依赖
2. 通过 `npm run dev` 启动 Vite 开发服务
3. 浏览器访问本地地址
4. 浏览器先加载 [index.html](/E:/code/bearing-digital-twin/index.html)
5. `index.html` 引入 [src/main.tsx](/E:/code/bearing-digital-twin/src/main.tsx)
6. `main.tsx` 创建 React 根节点并渲染 [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)
7. `App.tsx` 再去装配整套应用界面

如果你能把这 7 步讲清楚，说明你已经从“会用项目”进入“理解工程运行机制”的阶段了。

---

## 14. 本课应该形成的工程视角

学完这一课，你最重要的不是记住每个配置项，而是形成下面这个工程视角：

### 第一，前端项目不是零散文件集合

它是一套协同工作的系统，包括：

- 依赖管理
- 启动机制
- 构建机制
- 入口组织
- 目录分层

### 第二，读项目要先看入口和结构

不要一上来就钻进业务细节。  
先搞清楚：

- 从哪里启动
- 入口文件是谁
- 主组件是谁
- 源码目录怎么分区

### 第三，目录结构本身就是一种设计

很多时候，目录结构已经在告诉你：

- 这个项目重视什么
- 逻辑如何分层
- 哪些能力是独立模块

这是一种非常重要的“读工程能力”。

---

## 15. 本课代码导读建议

这一课建议你重点阅读下面这些文件：

- [package.json](/E:/code/bearing-digital-twin/package.json)
- [src/main.tsx](/E:/code/bearing-digital-twin/src/main.tsx)
- [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)
- [vite.config.ts](/E:/code/bearing-digital-twin/vite.config.ts)
- [index.html](/E:/code/bearing-digital-twin/index.html)
- [tsconfig.json](/E:/code/bearing-digital-twin/tsconfig.json)
- [eslint.config.js](/E:/code/bearing-digital-twin/eslint.config.js)

建议阅读时重点回答下面几个问题：

- 项目是靠什么命令启动的
- `main.tsx` 和 `App.tsx` 的职责分别是什么
- `src` 目录为什么这样划分
- 为什么一个项目需要 TypeScript 配置和 ESLint 配置

---

## 16. 本课知识小结

这一课你需要牢牢记住 4 个结论。

### 结论 1：`package.json` 是工程说明书

它管理：

- 项目基本信息
- 启动脚本
- 依赖包
- 工具链入口

### 结论 2：`main.tsx` 和 `App.tsx` 不是一回事

- `main.tsx` 负责启动应用
- `App.tsx` 负责组织应用内容

### 结论 3：目录结构反映工程设计

当前项目通过 `components`、`hooks`、`services`、`scenes`、`types` 等目录完成分层，这不是随便分的，而是在表达职责边界。

### 结论 4：前端项目运行依赖完整工具链

这个项目的运行不是“打开一个 HTML”那么简单，而是依赖：

- npm
- Vite
- React
- TypeScript
- ESLint

共同协作完成。

---

## 17. 本课作业

请你完成下面 4 个作业。

### 作业 1：解释 4 个脚本

用自己的话解释：

- `dev`
- `build`
- `lint`
- `preview`

要求：

- 不照抄文档
- 每个脚本至少写一句作用说明

### 作业 2：说明 `main.tsx` 和 `App.tsx` 的区别

要求：

- 不少于 80 字
- 尽量用“启动”和“装配”这两个词去理解

### 作业 3：画一版目录职责图

要求：

- 至少包含 `components`、`hooks`、`services`、`scenes`、`types`
- 每个目录写一句用途说明

### 作业 4：写出项目启动流程

要求：

- 按顺序写出从执行命令到页面显示的大致过程
- 不少于 6 步

---

## 18. 下节课预告

第 3 课我们会进入：

**React 项目的入口与组件装配**

你会更深入地理解：

- `App.tsx` 为什么是整个应用的总装配层
- 它是如何把多个模块拼成一个完整页面的
- 顶层组件为什么要负责状态汇总和事件分发

这会让你第一次真正开始从“工程结构”走向“应用结构”。

---

## 19. 一句话总结

第 2 课的核心任务，是建立对项目运行机制和工程分层的清晰认识，让你知道这个项目为什么能跑起来、从哪里启动、入口是谁、目录为什么这样组织。
