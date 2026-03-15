# 滑动轴承数字孪生前端项目 30 课课程大纲

## 课程说明

这套课程以当前项目为学习载体，目标是用大约 30 节课，循序渐进地覆盖以下核心知识点：

- React 前端基础
- TypeScript 类型系统
- 工程化项目结构理解
- 实时遥测数据流设计
- 仪表盘界面组织
- Three.js 与 React Three Fiber 基础
- STL 模型加载与显示
- 业务数据与三维热力图映射
- WebSocket 实时通信
- 数字孪生前端的综合实践能力

课程设计遵循以下原则：

- 从易到难，先建立全局认知，再深入关键模块
- 从静态界面到动态数据，再到三维可视化
- 每个阶段都有配套练习，避免只看不做
- 每节课尽量围绕当前项目中的真实文件展开

---

## 第一阶段：建立项目整体认知（第 1-5 课）

### 第 1 课：认识滑动轴承数字孪生前端项目

学习目标：

- 理解这个项目在做什么
- 明确数字孪生前端和普通管理后台前端的区别
- 建立对“业务数据 + 可视化 + 交互”三位一体结构的初步认识

核心内容：

- 什么是滑动轴承数字孪生
- 前端在数字孪生系统中的职责
- 当前项目的主要功能区划分
- 整体界面和模块概览

建议阅读：

- [README.md](/E:/code/bearing-digital-twin/README.md)
- [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)

课后练习：

- 用自己的话描述这个项目的用途
- 画出界面主要区域分布图

### 第 2 课：项目运行环境与工程结构

学习目标：

- 理解项目如何运行
- 认识 Vite + React + TypeScript 工程结构

核心内容：

- `package.json` 的作用
- `vite`、`build`、`lint` 脚本含义
- `src`、`public`、`markdown` 等目录作用
- 前端项目入口与构建流程

建议阅读：

- [package.json](/E:/code/bearing-digital-twin/package.json)
- [src/main.tsx](/E:/code/bearing-digital-twin/src/main.tsx)

课后练习：

- 说清楚项目从启动到页面展示的大致流程
- 自己梳理目录树并标注职责

### 第 3 课：React 项目的入口与组件装配

学习目标：

- 看懂应用入口如何组织
- 理解顶层组件的“装配层”职责

核心内容：

- `App.tsx` 的角色
- 状态、事件、配置、数据如何在顶层汇总
- 组件树与 props 流向

建议阅读：

- [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)

课后练习：

- 画出 `App.tsx` 的主要组件关系图
- 标出哪些数据是配置类，哪些数据是实时类

### 第 4 课：理解数字孪生界面的模块划分

学习目标：

- 理解为什么项目要拆成多个面板和场景模块
- 建立 UI 分层意识

核心内容：

- 顶部栏、左侧状态、右侧日志、底部趋势、中心场景的职责
- 展示组件与控制组件的区别
- 为什么设置面板要独立管理

建议阅读：

- [src/components/dashboard/TopBar.tsx](/E:/code/bearing-digital-twin/src/components/dashboard/TopBar.tsx)
- [src/components/dashboard/LeftPanel.tsx](/E:/code/bearing-digital-twin/src/components/dashboard/LeftPanel.tsx)
- [src/components/dashboard/RightPanel.tsx](/E:/code/bearing-digital-twin/src/components/dashboard/RightPanel.tsx)
- [src/components/dashboard/BottomPanel.tsx](/E:/code/bearing-digital-twin/src/components/dashboard/BottomPanel.tsx)

课后练习：

- 总结每个面板负责展示什么信息

### 第 5 课：项目第一轮通读方法

学习目标：

- 学会如何高效阅读一个真实项目
- 不陷入“逐行看代码但抓不住主线”的困境

核心内容：

- 从入口、类型、服务、Hook、组件五个角度读项目
- 如何先看数据，再看界面
- 如何先看结构，再看细节

课后练习：

- 自己列一版“这个项目我下一步先看哪些文件”

---

## 第二阶段：TypeScript 与业务数据建模（第 6-10 课）

### 第 6 课：TypeScript 基础在本项目中的作用

学习目标：

- 理解为什么这个项目要使用 TypeScript
- 认识接口、类型别名、联合类型的实际价值

核心内容：

- `interface` 和 `type` 的使用场景
- 类型约束如何减少前端错误
- 类型系统如何帮助多人协作

建议阅读：

- [src/services/types.ts](/E:/code/bearing-digital-twin/src/services/types.ts)
- [src/types/app.ts](/E:/code/bearing-digital-twin/src/types/app.ts)

课后练习：

- 找出项目中至少 5 个关键类型并解释其作用

### 第 7 课：核心遥测数据结构设计

学习目标：

- 深入理解 `BearingTelemetry`
- 明白标量数据和分布数据的差异

核心内容：

- `timestamp` 的意义
- `scalars` 中各字段含义
- `fieldData` 为什么是数组
- 数据结构如何服务于图表和 3D 热力图

建议阅读：

- [src/services/types.ts](/E:/code/bearing-digital-twin/src/services/types.ts)

课后练习：

- 解释 `rpm`、`load`、`temperature`、`maxPressure`、`minFilmThickness` 的含义
- 解释为什么压力分布数据适合做热力图

### 第 8 课：告警事件与趋势数据建模

学习目标：

- 理解告警与趋势的建模思路
- 看懂历史记录和当前状态的区别

核心内容：

- `AlertEvent` 的字段设计
- `TrendPoint` 的用途
- 历史日志与当前告警的不同职责

建议阅读：

- [src/services/types.ts](/E:/code/bearing-digital-twin/src/services/types.ts)
- [src/hooks/useTelemetry.ts](/E:/code/bearing-digital-twin/src/hooks/useTelemetry.ts)

课后练习：

- 用自己的话解释“事件流”和“状态”的区别

### 第 9 课：配置对象与模型参数设计

学习目标：

- 理解项目中的配置型数据如何组织
- 看懂模型、材质、变换参数的类型设计

核心内容：

- 模型 URL、变换、材质配置的意义
- 站台、轴承、轴三类对象为什么分开建模
- 配置数据与实时数据的边界

建议阅读：

- [src/types/app.ts](/E:/code/bearing-digital-twin/src/types/app.ts)
- [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)

课后练习：

- 说明 `config` 为什么不能和 `telemetry` 混在一起管理

### 第 10 课：从类型设计反推系统结构

学习目标：

- 学会通过类型定义反向理解业务系统
- 建立“先看类型后看实现”的习惯

核心内容：

- 类型是系统边界的说明书
- 如何从类型看出模块职责
- 如何根据类型预测组件输入输出

课后练习：

- 根据类型文件画出系统中的几类核心数据对象

---

## 第三阶段：React 基础与状态管理（第 11-15 课）

### 第 11 课：React 组件与 props 流

学习目标：

- 理解 React 组件之间如何传递数据
- 认识顶层组件和子组件协作模式

核心内容：

- props 的基本思想
- 单向数据流
- 父组件管理状态、子组件负责展示和交互回调

建议阅读：

- [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)

课后练习：

- 找出 `App.tsx` 传给子组件的主要 props

### 第 12 课：useState 与界面状态组织

学习目标：

- 理解页面配置、弹窗显示、视图模式等状态管理方式

核心内容：

- `useState` 的使用
- 什么状态应该放在顶层
- 什么状态应该局部管理

建议阅读：

- [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)
- [src/components/SettingsPanel.tsx](/E:/code/bearing-digital-twin/src/components/SettingsPanel.tsx)

课后练习：

- 列出项目里有哪些典型状态

### 第 13 课：useEffect 与副作用管理

学习目标：

- 理解副作用是什么
- 理解为什么遥测服务的启动和停止要放在 `useEffect` 中

核心内容：

- 组件挂载与卸载
- 订阅与清理
- 定时器、动画帧、WebSocket 连接的生命周期

建议阅读：

- [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)
- [src/hooks/useTelemetry.ts](/E:/code/bearing-digital-twin/src/hooks/useTelemetry.ts)

课后练习：

- 解释 `telemetryService.start()` 为什么不能直接写在组件函数体里

### 第 14 课：useMemo 与派生数据

学习目标：

- 理解什么是派生状态
- 学会区分原始数据和加工结果

核心内容：

- 当前告警状态的派生过程
- 系统状态 `ONLINE` / `ALARM` 的派生逻辑
- 何时需要 `useMemo`

建议阅读：

- [src/hooks/useTelemetry.ts](/E:/code/bearing-digital-twin/src/hooks/useTelemetry.ts)

课后练习：

- 说明 `activeAlerts` 为什么不直接存在原始数据里

### 第 15 课：用 Hook 封装业务状态

学习目标：

- 理解为什么要把遥测逻辑封装成 `useTelemetry`
- 学会区分 UI 代码与业务状态逻辑

核心内容：

- 自定义 Hook 的价值
- Hook 作为“状态加工层”的作用
- 逻辑复用与组件解耦

建议阅读：

- [src/hooks/useTelemetry.ts](/E:/code/bearing-digital-twin/src/hooks/useTelemetry.ts)

课后练习：

- 用自己的话总结 `useTelemetry` 的输入、输出和职责

---

## 第四阶段：实时数据流与服务层设计（第 16-20 课）

### 第 16 课：服务层的职责与接口抽象

学习目标：

- 理解服务层为什么存在
- 认识接口抽象对数据源切换的意义

核心内容：

- `TelemetryProvider` 的设计思想
- 面向接口而不是面向具体实现
- mock 与 websocket 的统一调用方式

建议阅读：

- [src/services/telemetryContract.ts](/E:/code/bearing-digital-twin/src/services/telemetryContract.ts)
- [src/services/telemetryService.ts](/E:/code/bearing-digital-twin/src/services/telemetryService.ts)

课后练习：

- 总结统一服务接口带来的好处

### 第 17 课：Mock 数据服务的设计方法

学习目标：

- 理解模拟数据如何支持前端开发
- 看懂实时变化数据的生成逻辑

核心内容：

- `MockDataService` 的成员结构
- 动画帧更新循环
- 参数更新、订阅通知机制
- 平滑、抖动、限制区间等数据处理方法

建议阅读：

- [src/services/MockDataService.ts](/E:/code/bearing-digital-twin/src/services/MockDataService.ts)

课后练习：

- 总结模拟数据为什么比写死常量更有价值

### 第 18 课：业务规律如何映射为前端模拟逻辑

学习目标：

- 理解当前 Mock 服务并不是“乱造数据”
- 感受物理趋势在代码中的简化表达

核心内容：

- 转速、载荷与压力、温度、油膜厚度之间的关系
- 偏心率、姿态角、相位等概念的程序表达
- 为什么要有 `pressureDistribution` 等分布数组

建议阅读：

- [src/services/MockDataService.ts](/E:/code/bearing-digital-twin/src/services/MockDataService.ts)

课后练习：

- 解释当前模拟逻辑中哪些部分体现了业务规律

### 第 19 课：WebSocket 数据接入机制

学习目标：

- 理解实时数据流在前端中的接入方式
- 看懂 WebSocket 服务封装

核心内容：

- WebSocket 连接生命周期
- 消息解析与订阅分发
- 错误容忍与服务健壮性

建议阅读：

- [src/services/WebSocketTelemetryService.ts](/E:/code/bearing-digital-twin/src/services/WebSocketTelemetryService.ts)

课后练习：

- 说清楚 WebSocket 服务和 Mock 服务的共同点与差异

### 第 20 课：从数据源到界面的完整链路

学习目标：

- 将服务层、Hook、界面彻底串起来
- 建立完整的数据流视角

核心内容：

- 数据源切换机制
- 订阅到状态更新的流程
- 状态如何驱动图表、日志和 3D 场景

课后练习：

- 自己画出一张完整数据流图

---

## 第五阶段：仪表盘与业务界面实现（第 21-24 课）

### 第 21 课：顶部栏与系统状态表达

学习目标：

- 理解系统状态如何被前端表达
- 看懂状态信息如何汇总到顶部栏

核心内容：

- 顶部信息展示的设计目的
- `ONLINE` 与 `ALARM` 状态表达
- 页面级操作入口的设计

建议阅读：

- [src/components/dashboard/TopBar.tsx](/E:/code/bearing-digital-twin/src/components/dashboard/TopBar.tsx)
- [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)

### 第 22 课：左侧监测面板与关键指标展示

学习目标：

- 理解关键运行指标的展示逻辑

核心内容：

- 标量数据的展示方式
- 视图模式切换与指标关联
- 关键业务指标的可视化表达

建议阅读：

- [src/components/dashboard/LeftPanel.tsx](/E:/code/bearing-digital-twin/src/components/dashboard/LeftPanel.tsx)

### 第 23 课：右侧告警与日志面板

学习目标：

- 理解事件型信息如何展示
- 认识当前状态与历史事件的区别

核心内容：

- 告警事件列表组织
- 告警触发与恢复的展示方式
- 日志型 UI 的信息结构

建议阅读：

- [src/components/dashboard/RightPanel.tsx](/E:/code/bearing-digital-twin/src/components/dashboard/RightPanel.tsx)
- [src/hooks/useTelemetry.ts](/E:/code/bearing-digital-twin/src/hooks/useTelemetry.ts)

### 第 24 课：底部趋势图与时间序列展示

学习目标：

- 理解趋势图在监测系统中的价值
- 看懂时间序列数据如何组织

核心内容：

- `TrendPoint` 的使用方式
- 滑动窗口思想
- 趋势图和实时快照的区别

建议阅读：

- [src/components/dashboard/BottomPanel.tsx](/E:/code/bearing-digital-twin/src/components/dashboard/BottomPanel.tsx)
- [src/hooks/useTelemetry.ts](/E:/code/bearing-digital-twin/src/hooks/useTelemetry.ts)

课后练习：

- 总结为什么趋势图不能只显示当前值

---

## 第六阶段：三维场景与模型可视化（第 25-28 课）

### 第 25 课：React Three Fiber 入门

学习目标：

- 理解为什么在 React 中可以写 Three.js 场景
- 看懂场景的基本组成

核心内容：

- `Canvas` 的作用
- 相机、背景、灯光、控制器
- React Three Fiber 的声明式写法

建议阅读：

- [src/scenes/BearingScene.tsx](/E:/code/bearing-digital-twin/src/scenes/BearingScene.tsx)

### 第 26 课：STL 模型加载与场景装配

学习目标：

- 理解三维模型如何被加载和渲染
- 认识模型组件封装思路

核心内容：

- `STLLoader` 的作用
- `useLoader` 的使用
- 模型 URL、变换、材质属性传递
- 基座、轴承、轴的装配逻辑

建议阅读：

- [src/components/STLModel.tsx](/E:/code/bearing-digital-twin/src/components/STLModel.tsx)
- [src/scenes/BearingScene.tsx](/E:/code/bearing-digital-twin/src/scenes/BearingScene.tsx)

### 第 27 课：热力图颜色映射原理

学习目标：

- 理解业务数据如何映射到模型表面颜色
- 看懂顶点颜色生成过程

核心内容：

- 包围盒、中心点、轴向距离、角度计算
- 分布数组与模型表面坐标的对应关系
- 数据归一化与颜色映射
- `colormap` 工具函数的作用

建议阅读：

- [src/components/STLModel.tsx](/E:/code/bearing-digital-twin/src/components/STLModel.tsx)
- [src/utils/colormap.ts](/E:/code/bearing-digital-twin/src/utils/colormap.ts)

课后练习：

- 用自己的话解释“为什么数组数据能涂到三维模型表面上”

### 第 28 课：视图模式切换与业务可视化联动

学习目标：

- 理解压力、厚度、温度视图切换的实现思路
- 看懂同一模型如何承载不同业务视图

核心内容：

- `viewMode` 的作用
- 场景中 `activeFieldData` 的选择逻辑
- 数据范围 `dataRange` 为什么重要

建议阅读：

- [src/scenes/BearingScene.tsx](/E:/code/bearing-digital-twin/src/scenes/BearingScene.tsx)
- [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)

---

## 第七阶段：配置、持久化与综合实战（第 29-30 课）

### 第 29 课：设置面板、文件上传与项目保存

学习目标：

- 理解前端如何管理模型配置和项目持久化
- 看懂文件上传与 JSON 保存逻辑

核心内容：

- 设置面板的职责
- STL 文件 URL 管理
- `Blob`、Base64、JSON 保存与恢复
- 为什么需要 `PersistedConfig`

建议阅读：

- [src/components/SettingsPanel.tsx](/E:/code/bearing-digital-twin/src/components/SettingsPanel.tsx)
- [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)

课后练习：

- 总结“项目配置保存”和“实时数据订阅”有什么本质区别

### 第 30 课：综合项目实践与能力跃迁

学习目标：

- 将整个项目知识体系串成闭环
- 从“能看懂”迈向“能扩展”

核心内容：

- 回顾整个项目的技术主线
- 数字孪生前端的典型能力模型
- 后续可扩展方向

综合实战建议：

- 增加一个新的遥测字段并接入界面
- 新增一个趋势图序列
- 为 WebSocket 增加重连机制
- 为 3D 场景增加一个新交互功能
- 增加一个新的工况模拟模式

课程收官目标：

- 能独立读懂当前项目
- 能解释核心数据流
- 能说清 3D 热力图的基本实现原理
- 能独立完成中小型功能改造

---

## 附：推荐学习节奏

如果你按每周 3 到 5 节课推进，这 30 节课大致可以覆盖 6 到 10 周的系统学习。

推荐节奏：

- 前 2 周：建立整体认知，吃透类型和 React 基础
- 中间 3 周：搞懂服务层、数据流、仪表盘展示
- 后 2 到 3 周：重点突破 3D 场景、热力图映射与综合实践

---

## 附：建议的学习产出

为了避免“学过就忘”，建议你每学完几节课，都留下可复用的产出：

- 一张模块结构图
- 一张数据流图
- 一份核心类型说明
- 一份 3D 场景渲染流程笔记
- 一次真实的小功能改造记录

这样学完 30 节课后，你不仅看懂了项目，还会积累一套真正属于自己的项目理解资料。
