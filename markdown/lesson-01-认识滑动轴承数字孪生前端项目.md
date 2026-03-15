# 第 1 课：认识滑动轴承数字孪生前端项目

## 1. 本课定位

这是整套课程的第一课。  
这一课不急着深入代码细节，而是先建立对整个项目的整体认识。

很多人在学习真实项目时，最容易出现的问题是：

- 一上来就逐行看代码
- 看了很多文件，但不知道项目整体在做什么
- 能看懂局部语法，却抓不住系统主线

所以第一课的目标很明确：

- 先搞清楚这个项目“是什么”
- 再搞清楚这个项目“由哪些部分组成”
- 最后搞清楚你后面应该“按什么顺序学”

如果这一课学扎实，后面的内容就会顺很多。

---

## 2. 学习目标

学完这一课，你应该能够做到：

- 用自己的话说明这个项目是做什么的
- 区分“数字孪生前端”和“普通后台前端”的差别
- 说出当前项目的几个核心模块
- 初步理解“业务数据 + 可视化 + 交互”是如何结合在一起的
- 知道后续学习应该先看什么、后看什么

---

## 3. 先理解项目名称

项目名称可以拆成四个关键词：

- 滑动轴承
- 数字孪生
- 前端
- 项目

### 3.1 什么是滑动轴承

滑动轴承是一类机械部件，用来支撑旋转轴，并通过润滑油膜减少摩擦和磨损。  
在工业设备中，滑动轴承的运行状态通常会受到很多因素影响，比如：

- 转速
- 载荷
- 载荷方向
- 温度
- 油膜厚度
- 压力分布
- 振动情况

这些量如果异常，设备可能会出现性能下降、磨损加剧，甚至故障。

### 3.2 什么是数字孪生

数字孪生可以简单理解为：

**用一个数字化、可视化、可交互的虚拟模型，去映射现实设备的状态。**

这里有三个重点：

- 它不是一张静态图，而是一个动态系统
- 它要反映真实设备的状态变化
- 它通常结合实时数据、模型、图表和交互控制

所以数字孪生前端通常不只是“页面展示”，而是要承担：

- 状态监测
- 趋势分析
- 异常告警
- 3D 场景展示
- 数据与模型联动

### 3.3 什么是数字孪生前端

如果是普通管理后台前端，常见内容通常是：

- 表格
- 表单
- 查询条件
- 统计卡片
- 权限管理

而数字孪生前端更强调：

- 实时性
- 可视化
- 场景感
- 交互联动
- 业务状态表达

也就是说，这类前端更接近“监控大屏 + 业务分析 + 3D 场景”的结合体。

---

## 4. 这个项目在做什么

结合当前项目代码，我们可以先给它一个直白定义：

**这是一个用于展示滑动轴承运行状态的数字孪生前端项目。**

它的主要工作包括：

- 接收或模拟轴承运行数据
- 在界面上展示关键指标
- 生成趋势图和告警信息
- 在 3D 模型上展示压力、温度、油膜厚度等分布效果
- 允许用户加载模型、调整配置、切换可视化模式

从这个定义里，你已经可以看到它至少包含 4 类能力：

- 业务数据表达能力
- 前端界面组织能力
- 实时数据处理能力
- 三维可视化能力

这也是为什么这个项目特别适合深入学习。

---

## 5. 项目整体结构初识

虽然我们后面会详细拆解，但第一课先建立一个整体印象。

根据当前项目结构，主要可以分成这些区域：

### 5.1 顶层装配层

核心文件：

- [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)

它的作用类似“总控制台”或“总装配台”，负责：

- 组织页面布局
- 挂载不同面板和 3D 场景
- 管理配置状态
- 连接实时数据 Hook
- 处理文件上传、项目保存、项目打开等行为

你可以先把它理解成：

**整个应用的总入口组件。**

### 5.2 实时数据层

核心文件：

- [src/hooks/useTelemetry.ts](/E:/code/bearing-digital-twin/src/hooks/useTelemetry.ts)
- [src/services/MockDataService.ts](/E:/code/bearing-digital-twin/src/services/MockDataService.ts)
- [src/services/WebSocketTelemetryService.ts](/E:/code/bearing-digital-twin/src/services/WebSocketTelemetryService.ts)
- [src/services/telemetryService.ts](/E:/code/bearing-digital-twin/src/services/telemetryService.ts)

这一层负责：

- 数据来源接入
- 订阅实时数据
- 把原始数据加工成趋势、告警、系统状态

你后面会发现，这一层是这个项目的“业务中枢”。

### 5.3 仪表盘界面层

核心文件：

- [src/components/dashboard/TopBar.tsx](/E:/code/bearing-digital-twin/src/components/dashboard/TopBar.tsx)
- [src/components/dashboard/LeftPanel.tsx](/E:/code/bearing-digital-twin/src/components/dashboard/LeftPanel.tsx)
- [src/components/dashboard/RightPanel.tsx](/E:/code/bearing-digital-twin/src/components/dashboard/RightPanel.tsx)
- [src/components/dashboard/BottomPanel.tsx](/E:/code/bearing-digital-twin/src/components/dashboard/BottomPanel.tsx)

这一层主要负责：

- 展示关键指标
- 展示系统状态
- 展示告警日志
- 展示趋势图

你可以把它理解成“监测界面”。

### 5.4 三维场景层

核心文件：

- [src/scenes/BearingScene.tsx](/E:/code/bearing-digital-twin/src/scenes/BearingScene.tsx)
- [src/components/STLModel.tsx](/E:/code/bearing-digital-twin/src/components/STLModel.tsx)

这一层负责：

- 加载 3D 模型
- 配置相机、灯光、控制器
- 将业务数据映射为模型表面的颜色变化

这是项目里最有“数字孪生味道”的部分。

### 5.5 配置与文件操作层

核心文件：

- [src/components/SettingsPanel.tsx](/E:/code/bearing-digital-twin/src/components/SettingsPanel.tsx)
- [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)

这一层负责：

- 上传模型文件
- 调整模型配置
- 保存和打开项目

这部分体现了一个真实应用的工程能力，不只是展示。

---

## 6. 当前项目的核心页面逻辑

如果用一句话概括当前页面逻辑，可以写成：

**左边看指标，右边看日志，下面看趋势，中间看 3D，顶部看总体状态。**

这种布局是很典型的监测型数字孪生界面布局。  
因为它兼顾了四件事：

- 全局状态
- 关键数值
- 时间趋势
- 空间分布

普通管理后台通常只强调“数据表”和“业务流程”，而这个项目更强调“状态感知”。

---

## 7. 第一眼应该关注哪些业务量

这个项目中，有几个字段会反复出现。你现在先认识它们，不需要一次理解透。

核心业务量包括：

- `rpm`
- `load`
- `loadDirection`
- `temperature`
- `vibrationAmp`
- `maxPressure`
- `minFilmThickness`

这些字段定义在：

- [src/services/types.ts](/E:/code/bearing-digital-twin/src/services/types.ts)

你现在只需要建立最初印象：

- `rpm` 表示转速
- `load` 表示载荷
- `loadDirection` 表示载荷方向
- `temperature` 表示温度
- `vibrationAmp` 表示振动幅值
- `maxPressure` 表示最大油膜压力
- `minFilmThickness` 表示最小油膜厚度

这几个量几乎就是后面所有学习内容的“主角”。

---

## 8. 数字孪生项目为什么比普通前端更值得学

如果你能学透这个项目，你学到的不会只是 React 语法，而是一整套更接近真实工程的能力。

### 8.1 你会学到前端工程结构

比如：

- 组件如何拆分
- 状态如何组织
- 服务层如何设计
- 类型如何建模

### 8.2 你会学到实时数据处理思维

比如：

- 实时订阅如何做
- 原始数据如何加工
- 趋势和告警如何生成
- 当前状态和历史事件如何区分

### 8.3 你会学到三维可视化思维

比如：

- 模型如何加载
- 视图如何组织
- 业务数据如何映射为颜色
- 为什么同一个模型能承载多个视图模式

### 8.4 你会学到业务与技术结合的方式

你会慢慢从“看代码”进步到“能解释代码背后的业务含义”。  
这是非常关键的一步。

---

## 9. 学这个项目时最容易犯的错误

下面这几个坑非常常见，你提前避开会轻松很多。

### 9.1 只盯着界面，不看数据流

如果只看组件长什么样，很容易觉得项目只是一些面板拼起来。  
但这个项目真正的核心是：

- 数据从哪里来
- 怎么加工
- 怎么驱动界面和 3D 场景

### 9.2 一上来就看 3D 细节

3D 很吸引人，但如果你还没看懂数据结构和页面组织，直接啃 `STLModel.tsx` 会非常吃力。  
正确顺序应该是：

- 先认识项目
- 再看类型和数据流
- 最后再深入 3D

### 9.3 把所有内容一起学

真实项目内容很多，如果同时学 React、TypeScript、业务、Three.js，很容易乱。  
更好的方法是分阶段：

- 第一阶段看整体
- 第二阶段看类型和数据
- 第三阶段看 React 状态
- 第四阶段看服务层
- 第五阶段看仪表盘
- 第六阶段看 3D

---

## 10. 本项目推荐学习顺序

基于当前代码，我建议你按这个顺序推进：

1. 先看 [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)，理解项目由哪些模块组成
2. 再看 [src/services/types.ts](/E:/code/bearing-digital-twin/src/services/types.ts)，理解数据形状
3. 再看 [src/hooks/useTelemetry.ts](/E:/code/bearing-digital-twin/src/hooks/useTelemetry.ts)，理解数据如何加工
4. 再看服务层文件，理解数据从哪里来
5. 再看 dashboard 组件，理解界面如何消费数据
6. 最后深入 [src/scenes/BearingScene.tsx](/E:/code/bearing-digital-twin/src/scenes/BearingScene.tsx) 和 [src/components/STLModel.tsx](/E:/code/bearing-digital-twin/src/components/STLModel.tsx)

这个顺序的核心思想是：

**先看系统主线，再看局部实现。**

---

## 11. 本课代码导读

这一课建议你只做“轻量导读”，不要试图一次读透所有细节。

### 建议阅读文件

- [README.md](/E:/code/bearing-digital-twin/README.md)
- [package.json](/E:/code/bearing-digital-twin/package.json)
- [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)
- [src/services/types.ts](/E:/code/bearing-digital-twin/src/services/types.ts)

### 阅读目标

读完以后，你应该能回答：

- 这个项目是做什么的
- 这个项目用了哪些主要技术
- 这个项目的页面大致怎么分区
- 这个项目有哪些核心业务数据

如果你现在回答还不够完整，也没关系。  
第一课的目标本来就不是“彻底搞懂”，而是“建立全局地图”。

---

## 12. 本课知识小结

这一课最重要的收获，不是记住多少细节，而是建立三个认知：

### 第一，项目不是单纯的页面展示

它是一个结合了：

- 实时数据
- 仪表盘
- 3D 场景
- 模型配置

的综合型前端项目。

### 第二，数字孪生前端的重点是“状态表达”

它不仅展示静态信息，更强调：

- 当前状态
- 变化趋势
- 告警事件
- 空间分布

### 第三，学习必须讲顺序

你接下来要坚持一个原则：

**从整体到局部，从数据到界面，从基础到三维。**

只要顺序对，难度会下降很多。

---

## 13. 本课作业

请你完成下面 3 个作业。

### 作业 1：用自己的话描述项目

要求：

- 不少于 100 字
- 不要照抄文档
- 尽量说明“它解决什么问题”

### 作业 2：画一张项目模块草图

要求：

- 画出顶部、左侧、右侧、中间、底部几个区域
- 标出每个区域大概负责什么

### 作业 3：列出你当前最想搞懂的 5 个问题

示例：

- `useTelemetry` 到底做了什么
- 3D 热力图是怎么画上去的
- 为什么需要 Mock 数据服务

这个作业非常重要，因为它会帮你形成后续学习的主动问题意识。

---

## 14. 下节课预告

第 2 课我们会进入：

**项目运行环境与工程结构**

你会开始系统认识：

- `package.json` 到底怎么看
- Vite 项目是怎么启动的
- `main.tsx` 和 `App.tsx` 分别负责什么
- 一个前端工程的目录为什么这样组织

这会帮助你把“整体印象”进一步落到真实工程结构上。

---

## 15. 一句话总结

第 1 课的核心任务不是深入细节，而是先建立对这个滑动轴承数字孪生前端项目的整体地图：知道它是什么、包含什么、为什么值得学，以及后面应该按什么顺序学。
