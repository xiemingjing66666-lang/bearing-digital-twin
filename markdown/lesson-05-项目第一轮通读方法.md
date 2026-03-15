# 第 5 课：项目第一轮通读方法

## 1. 本课定位

前 4 课我们已经建立了这些基础认知：

- 这个项目是什么
- 它的工程结构怎样组织
- `App.tsx` 为什么是总装配层
- 页面为什么要按不同模块分区

但到这里，还差一个很关键的能力：

**当你面对一个真实项目时，到底应该怎么开始读？**

很多人在学习项目时最常见的问题不是“不努力”，而是“方法不对”。

典型表现包括：

- 一上来就逐行看代码
- 同时打开很多文件，最后越看越乱
- 看完某个组件后，不知道它在全局中的位置
- 记住了一些局部细节，却没有建立系统地图

所以第 5 课的目标，是教你一套适合当前项目的“第一轮通读方法”。

这一课非常重要，因为它会决定你后面 20 多节课的学习效率。

---

## 2. 学习目标

学完这一课，你应该能够做到：

- 理解为什么真实项目不能一上来逐行啃代码
- 建立一套适合本项目的第一轮通读顺序
- 知道应该先看哪些文件、后看哪些文件
- 学会从入口、类型、服务、Hook、组件五个角度建立项目地图
- 学会区分“第一轮通读”和“深入研究”的不同目标
- 能独立完成对本项目的第一轮整体阅读

---

## 3. 为什么不能一上来逐行看代码

这个问题非常重要。

### 3.1 真实项目不是算法题

算法题通常是：

- 文件短
- 目标明确
- 输入输出简单

但真实前端项目不是这样。  
真实项目通常有：

- 多个目录
- 多个层次
- 数据流
- 组件关系
- 配置逻辑
- 工具链和业务逻辑混合存在

如果你一开始就逐行啃代码，很容易出现一个问题：

**你知道很多细节，但不知道这些细节为什么存在。**

### 3.2 没有全局地图，局部细节会变得很难理解

比如你直接去看 [src/components/STLModel.tsx](/E:/code/bearing-digital-twin/src/components/STLModel.tsx)，可能会看到：

- 几何体
- 顶点颜色
- 包围盒
- 角度映射

这些内容本来就不简单。  
如果你还不知道：

- 数据从哪里来
- 当前在显示什么
- `viewMode` 为什么存在
- `fieldData` 的业务意义是什么

那你会非常容易卡住。

### 3.3 第一轮通读的目标不是“看懂所有细节”

这是你必须记住的一点。

第一轮通读的目标是：

- 建立整体结构感
- 明确模块职责
- 看清数据主线
- 找出后续学习路线

而不是：

- 一次性吃透每一个函数
- 一次性背下所有代码

---

## 4. 第一轮通读到底在读什么

你可以把第一轮通读理解成：

**先给项目画一张地图，而不是先研究每一块砖头。**

在这个阶段，你最需要回答的其实是下面几个问题：

- 项目入口在哪里
- 应用主界面在哪里
- 核心业务数据是什么
- 数据从哪里来
- 数据怎么流到界面上
- 哪些组件负责展示
- 哪些模块负责配置和交互

只要这几个问题清楚了，后面的深入学习就会轻松很多。

---

## 5. 本项目最适合的第一轮通读顺序

结合当前这个滑动轴承数字孪生前端项目，我建议你按下面这个顺序来。

### 第一步：先看项目入口和工程说明

建议阅读：

- [package.json](/E:/code/bearing-digital-twin/package.json)
- [src/main.tsx](/E:/code/bearing-digital-twin/src/main.tsx)
- [index.html](/E:/code/bearing-digital-twin/index.html)

这一轮你只需要弄清楚：

- 项目怎么启动
- React 应用从哪里进入
- `main.tsx` 和 `App.tsx` 的关系是什么

### 第二步：看顶层装配层

建议阅读：

- [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)

这一轮重点是：

- 页面分成几个区域
- 顶层有哪些状态
- 顶层连接了哪些模块
- 主要 props 是怎么传的

### 第三步：看核心类型

建议阅读：

- [src/services/types.ts](/E:/code/bearing-digital-twin/src/services/types.ts)
- [src/types/app.ts](/E:/code/bearing-digital-twin/src/types/app.ts)

这一轮你要重点理解：

- 业务数据长什么样
- 配置数据长什么样
- 事件和趋势数据怎么建模

这一步非常关键，因为它决定你后面是否能看懂服务层和 3D 场景层。

### 第四步：看数据来源和服务层

建议阅读：

- [src/services/telemetryContract.ts](/E:/code/bearing-digital-twin/src/services/telemetryContract.ts)
- [src/services/telemetryService.ts](/E:/code/bearing-digital-twin/src/services/telemetryService.ts)
- [src/services/MockDataService.ts](/E:/code/bearing-digital-twin/src/services/MockDataService.ts)
- [src/services/WebSocketTelemetryService.ts](/E:/code/bearing-digital-twin/src/services/WebSocketTelemetryService.ts)

这一轮你要回答：

- 数据是 mock 的还是 websocket 的
- 为什么要抽象服务接口
- 模拟数据是怎么持续生成的

### 第五步：看 Hook 层

建议阅读：

- [src/hooks/useTelemetry.ts](/E:/code/bearing-digital-twin/src/hooks/useTelemetry.ts)

这一轮重点理解：

- 原始数据怎么加工成趋势图数据
- 告警日志是怎么形成的
- 当前系统状态是怎么派生出来的

### 第六步：看界面组件层

建议阅读：

- [src/components/dashboard/TopBar.tsx](/E:/code/bearing-digital-twin/src/components/dashboard/TopBar.tsx)
- [src/components/dashboard/LeftPanel.tsx](/E:/code/bearing-digital-twin/src/components/dashboard/LeftPanel.tsx)
- [src/components/dashboard/RightPanel.tsx](/E:/code/bearing-digital-twin/src/components/dashboard/RightPanel.tsx)
- [src/components/dashboard/BottomPanel.tsx](/E:/code/bearing-digital-twin/src/components/dashboard/BottomPanel.tsx)
- [src/components/SettingsPanel.tsx](/E:/code/bearing-digital-twin/src/components/SettingsPanel.tsx)

这一轮重点不是研究样式，而是理解：

- 每个组件负责展示什么
- 它拿到哪些 props
- 它在整个页面中扮演什么角色

### 第七步：最后看三维场景层

建议阅读：

- [src/scenes/BearingScene.tsx](/E:/code/bearing-digital-twin/src/scenes/BearingScene.tsx)
- [src/components/STLModel.tsx](/E:/code/bearing-digital-twin/src/components/STLModel.tsx)
- [src/utils/colormap.ts](/E:/code/bearing-digital-twin/src/utils/colormap.ts)

把 3D 放在最后不是因为它不重要，而是因为：

- 它相对更复杂
- 它依赖你对前面数据流和业务字段已经有认识

这个顺序非常适合你当前这个项目。

---

## 6. 第一轮通读时应该重点关注哪五个角度

这一课最核心的方法论就是这五个角度。

你以后读真实项目时，也可以复用这套方法。

### 6.1 角度一：入口

你要看：

- 项目从哪里启动
- 应用从哪里挂载
- 主界面组件是谁

在这个项目中，对应的主要文件是：

- [src/main.tsx](/E:/code/bearing-digital-twin/src/main.tsx)
- [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)

### 6.2 角度二：类型

你要看：

- 系统里有哪些核心数据对象
- 哪些是业务数据
- 哪些是配置数据
- 哪些是事件或趋势数据

在这个项目中，对应：

- [src/services/types.ts](/E:/code/bearing-digital-twin/src/services/types.ts)
- [src/types/app.ts](/E:/code/bearing-digital-twin/src/types/app.ts)

### 6.3 角度三：服务

你要看：

- 数据从哪里来
- 是否有 mock 和真实数据两套来源
- 服务接口如何抽象

对应文件：

- [src/services/telemetryContract.ts](/E:/code/bearing-digital-twin/src/services/telemetryContract.ts)
- [src/services/telemetryService.ts](/E:/code/bearing-digital-twin/src/services/telemetryService.ts)
- [src/services/MockDataService.ts](/E:/code/bearing-digital-twin/src/services/MockDataService.ts)
- [src/services/WebSocketTelemetryService.ts](/E:/code/bearing-digital-twin/src/services/WebSocketTelemetryService.ts)

### 6.4 角度四：Hook

你要看：

- 业务状态如何被加工
- 哪些数据是原始数据
- 哪些数据是派生状态

对应文件：

- [src/hooks/useTelemetry.ts](/E:/code/bearing-digital-twin/src/hooks/useTelemetry.ts)

### 6.5 角度五：组件

你要看：

- 页面拆成了哪些组件
- 它们分别负责展示什么
- props 如何流动

对应文件：

- `components/dashboard/*`
- [src/components/SettingsPanel.tsx](/E:/code/bearing-digital-twin/src/components/SettingsPanel.tsx)
- [src/scenes/BearingScene.tsx](/E:/code/bearing-digital-twin/src/scenes/BearingScene.tsx)

这五个角度加起来，基本就构成了第一轮通读的骨架。

---

## 7. 第一轮通读时不应该做什么

知道该做什么很重要，知道不该做什么同样重要。

### 7.1 不要一开始就钻进样式细节

像：

- `padding`
- `margin`
- 颜色
- 动画

这些内容在第一轮通读时都不是重点。  
因为它们不会帮助你建立系统地图。

### 7.2 不要在一个复杂函数里卡太久

比如某段 3D 映射逻辑看不懂，第一轮完全可以先记一个问题：

- 这里在做热力图映射，后面专门学

不要在第一轮就耗掉大量时间。

### 7.3 不要同时打开过多文件

如果你一次开十几个文件，很容易信息过载。  
更好的方式是按阶段分批看。

### 7.4 不要试图一次记住所有细节

第一轮更重要的是：

- 认识关系
- 标记问题
- 建立顺序

而不是背代码。

---

## 8. 第一轮通读最好的产出是什么

如果你只是“看过”，很快会忘。  
最好的办法是让第一轮通读产生一些可复用成果。

建议你至少做出下面这些产出。

### 8.1 一张模块结构图

例如写清楚：

- `App`
- `services`
- `hooks`
- `dashboard`
- `scene`
- `settings`

它们之间是什么关系。

### 8.2 一张数据流图

例如：

`Mock/WebSocket -> telemetryService -> useTelemetry -> App -> Panels / Scene`

这张图非常重要。

### 8.3 一份核心类型表

比如列出：

- `BearingTelemetry`
- `AlertEvent`
- `TrendPoint`
- `AppConfig`

然后简单写每个类型的职责。

### 8.4 一份“暂时不懂的问题清单”

例如：

- 为什么热力图可以映射到 STL 模型表面
- 为什么 `useTelemetry` 里要区分日志和当前告警
- 为什么 `config` 和 `telemetry` 不能混在一起

这会帮助你把“看不懂”转化成“后续学习任务”。

---

## 9. 第一轮通读和后续深入研究有什么区别

这一点很多人会混淆。

### 9.1 第一轮通读关注“全局”

重点是：

- 谁负责什么
- 数据从哪到哪
- 页面怎么拼起来

### 9.2 深入研究关注“细节”

重点是：

- 某个 Hook 为什么这么写
- 某个算法为什么这样算
- 某个组件内部状态如何组织
- 某个 3D 映射如何实现

所以你要接受这样一个学习节奏：

**第一轮允许不完全懂，第二轮和后续课程才逐步吃透。**

这不是退让，而是更合理的学习策略。

---

## 10. 针对当前项目的一套实用通读清单

如果你现在就要自己做第一轮通读，可以按下面这个清单执行。

### 第一步：看入口

文件：

- [package.json](/E:/code/bearing-digital-twin/package.json)
- [src/main.tsx](/E:/code/bearing-digital-twin/src/main.tsx)
- [index.html](/E:/code/bearing-digital-twin/index.html)

目标：

- 知道项目如何运行
- 知道应用从哪里进入

### 第二步：看总装配

文件：

- [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)

目标：

- 知道页面有哪些区域
- 知道顶层有哪些共享状态

### 第三步：看核心数据模型

文件：

- [src/services/types.ts](/E:/code/bearing-digital-twin/src/services/types.ts)
- [src/types/app.ts](/E:/code/bearing-digital-twin/src/types/app.ts)

目标：

- 知道核心业务对象和配置对象是什么

### 第四步：看数据源和服务层

文件：

- `services` 目录相关文件

目标：

- 知道数据怎么来

### 第五步：看数据加工

文件：

- [src/hooks/useTelemetry.ts](/E:/code/bearing-digital-twin/src/hooks/useTelemetry.ts)

目标：

- 知道数据怎么变成日志、趋势和状态

### 第六步：看展示组件

文件：

- `components/dashboard` 目录

目标：

- 知道哪些组件展示当前值、哪些展示趋势、哪些展示日志

### 第七步：看 3D 层

文件：

- [src/scenes/BearingScene.tsx](/E:/code/bearing-digital-twin/src/scenes/BearingScene.tsx)
- [src/components/STLModel.tsx](/E:/code/bearing-digital-twin/src/components/STLModel.tsx)

目标：

- 知道数据如何映射到模型

这套清单非常适合你当前阶段。

---

## 11. 本课代码导读建议

这一课不是单文件课，而是一节方法课。  
所以建议你按“阶段浏览”的方式去复习前面已经接触过的文件。

重点文件包括：

- [package.json](/E:/code/bearing-digital-twin/package.json)
- [src/main.tsx](/E:/code/bearing-digital-twin/src/main.tsx)
- [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)
- [src/services/types.ts](/E:/code/bearing-digital-twin/src/services/types.ts)
- [src/types/app.ts](/E:/code/bearing-digital-twin/src/types/app.ts)
- [src/services/telemetryService.ts](/E:/code/bearing-digital-twin/src/services/telemetryService.ts)
- [src/services/MockDataService.ts](/E:/code/bearing-digital-twin/src/services/MockDataService.ts)
- [src/hooks/useTelemetry.ts](/E:/code/bearing-digital-twin/src/hooks/useTelemetry.ts)
- [src/scenes/BearingScene.tsx](/E:/code/bearing-digital-twin/src/scenes/BearingScene.tsx)

阅读时请重点问自己：

- 这个文件属于入口、类型、服务、Hook 还是组件
- 它在整个项目里负责什么
- 它和前后模块的关系是什么

---

## 12. 本课知识小结

这一课最重要的结论有 6 个。

### 结论 1：第一轮通读不是逐行精读

它的目标是建立整体地图，不是一次性吃透所有实现细节。

### 结论 2：真实项目要按层次读

当前项目最适合按：

- 入口
- 顶层装配
- 类型
- 服务
- Hook
- 组件
- 3D

这个顺序推进。

### 结论 3：入口、类型、服务、Hook、组件是最核心的五个观察角度

这五个角度能帮你快速建立项目全貌。

### 结论 4：第一轮要先看关系，再看细节

先看模块职责、数据流向和页面结构，再深入复杂实现。

### 结论 5：不懂的地方先标记，不必硬啃

把问题记录下来，后续分阶段解决，比第一轮卡死在局部更有效。

### 结论 6：通读最好有产出

结构图、数据流图、类型表和问题清单，都会让你的学习更扎实。

---

## 13. 本课作业

请你完成下面 4 个作业。

### 作业 1：写出你的第一轮通读顺序

要求：

- 至少列出 6 步
- 每一步写明要看哪些文件
- 每一步写一句主要目标

### 作业 2：按五个角度给项目分类

要求：

- 入口
- 类型
- 服务
- Hook
- 组件

每个角度至少列出 1 到 3 个对应文件。

### 作业 3：列出你当前第一轮阅读中的 5 个疑问

要求：

- 必须和当前项目相关
- 不要求马上解答
- 重点是形成问题意识

### 作业 4：画一张初版数据流图

要求：

- 至少包含数据源、服务层、Hook、App、面板、场景
- 可以用文字箭头表示

---

## 14. 下节课预告

第 6 课我们会正式进入：

**TypeScript 基础在本项目中的作用**

你会开始系统理解：

- 为什么这个项目需要 TypeScript
- `interface` 和 `type` 有什么实际价值
- 类型系统是如何帮助这个项目管理复杂数据结构的

从这里开始，我们会进入“类型与数据建模”阶段。

---

## 15. 一句话总结

第 5 课的核心任务，是帮你建立一套适合真实项目的第一轮通读方法，让你先看清入口、结构、类型、数据流和模块关系，再逐步深入细节。
