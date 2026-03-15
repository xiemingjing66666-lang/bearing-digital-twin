# 第 6 课：TypeScript 基础在本项目中的作用

## 1. 本课定位

从这一课开始，我们正式进入第二阶段：

**TypeScript 与业务数据建模**

前 5 课你已经建立了这些基础：

- 知道项目整体在做什么
- 知道工程结构和入口关系
- 知道 `App.tsx` 是总装配层
- 知道界面为什么分区
- 知道第一轮应该怎么通读项目

接下来要解决一个更底层、更关键的问题：

**为什么这个项目要用 TypeScript，它到底帮了什么忙？**

很多初学者刚接触 TypeScript 时，容易把它理解成：

- 多写一些类型
- 给变量加点注解
- 让代码更“严格”

这些理解不能说错，但都不够深。

在真实项目里，TypeScript 更重要的价值是：

- 约束数据结构
- 明确模块边界
- 提前发现错误
- 提升协作效率
- 帮助你读懂系统

对于当前这个滑动轴承数字孪生前端项目来说，TypeScript 尤其重要，因为它里面的数据并不简单。

---

## 2. 学习目标

学完这一课，你应该能够做到：

- 理解 TypeScript 在这个项目中的核心价值
- 区分 `interface`、`type`、联合类型等基础概念
- 知道类型为什么能帮助你读懂真实项目
- 明白类型系统如何保护实时数据、配置数据和组件 props
- 看懂当前项目中几类关键类型的作用
- 建立“先看类型再看实现”的阅读习惯

---

## 3. 为什么这个项目特别需要 TypeScript

先不要从语法开始，我们先从项目实际需求出发。

当前项目至少包含下面这些复杂内容：

- 实时遥测数据
- 告警事件
- 趋势数据
- 3D 模型配置
- 组件 props
- 文件保存与恢复的数据结构

如果不用类型系统，你会很容易遇到这些问题：

- 不知道某个字段到底叫啥
- 不知道某个值是数字、字符串还是数组
- 不知道某个对象里应该有哪些属性
- 组件之间传参容易传错
- WebSocket 或 Mock 数据结构一旦不一致，很难快速发现

而 TypeScript 的作用，就是把这些“不确定”尽量提前变成“确定”。

也就是说：

**TypeScript 不是为了让代码更难写，而是为了让复杂项目更可控。**

---

## 4. 先建立一个最重要的认知：类型是系统说明书

这是这一课最重要的一句话。

很多人把类型理解成“额外负担”，但在真实项目里，类型其实是非常高价值的文档。

比如你看到 [src/services/types.ts](/E:/code/bearing-digital-twin/src/services/types.ts) 里的：

- `BearingTelemetry`
- `AlertEvent`
- `TrendPoint`

即使还没看具体实现，你已经能大概猜到：

- 系统有实时遥测数据
- 系统有告警事件流
- 系统有趋势图数据

也就是说，类型会直接告诉你：

- 系统里有什么数据
- 数据长什么样
- 哪些模块可能依赖这些数据

这就是为什么我一直建议你：

**读真实项目时，要先看类型。**

---

## 5. TypeScript 在这个项目里主要保护什么

结合当前代码，你可以把 TypeScript 的作用分成 4 类。

### 5.1 保护业务数据结构

比如：

- 遥测数据 `BearingTelemetry`
- 告警事件 `AlertEvent`
- 趋势点 `TrendPoint`

这些数据一旦结构错了，整个界面都会出问题。

### 5.2 保护配置数据结构

比如：

- 模型 URL
- 材质配置
- 位姿变换
- 热力图方向

这些配置如果字段名乱了、类型错了，3D 场景就会不稳定。

### 5.3 保护组件之间的传参

比如：

- `telemetry` 传给谁
- `viewMode` 是什么类型
- `onViewModeChange` 应该接收什么参数

类型可以帮助你确认父组件和子组件之间的契约是否一致。

### 5.4 保护服务层和界面层之间的契约

比如：

- Mock 服务发出的数据
- WebSocket 收到的数据
- Hook 接收和加工的数据

它们如果不统一，项目就会出现很隐蔽的问题。

---

## 6. 本项目里最常见的几种 TypeScript 形式

这一课我们不追求完整语法大全，只讲你在这个项目里最常遇到的。

### 6.1 `interface`

`interface` 通常用来描述“对象结构”。

比如：

```ts
export interface TrendPoint {
  timestamp: number;
  maxPressure: number;
  minFilmThickness: number;
  temperature: number;
}
```

这表示一个 `TrendPoint` 对象必须具备这些字段，而且每个字段的类型都已经确定。

在这个项目里，`interface` 很适合描述：

- 遥测对象
- 配置对象
- 组件 props 对象

### 6.2 `type`

`type` 的用途更灵活，既可以表示对象，也可以表示联合类型、字面量类型等。

比如：

```ts
export type AlertMetric = 'maxPressure' | 'temperature' | 'minFilmThickness';
```

这里的意思是：

`AlertMetric` 只能是这三个字符串之一。

这就非常适合表达“有限取值集合”。

### 6.3 联合类型

例如：

```ts
type AlertLevel = 'warning' | 'critical';
```

这表示某个值不是任意字符串，而只能在几个候选项中取值。

这类写法在当前项目里非常有用，因为很多状态都不是无限开放的，而是有限模式。

比如：

- 告警级别
- 视图模式
- 系统状态

### 6.4 类型导入

你会在项目里经常看到：

```ts
import type { BearingTelemetry } from '../services/types';
```

这表示这里只导入类型，不导入运行时值。  
这是一种比较清晰的 TypeScript 写法，也有助于减少混淆。

---

## 7. 用当前项目来理解 interface 和 type

这部分非常关键，因为你不能只记定义，要学会在项目里感受它们为什么这样用。

### 7.1 `interface` 更像“对象蓝图”

在 [src/services/types.ts](/E:/code/bearing-digital-twin/src/services/types.ts) 中：

- `BearingTelemetry`
- `AlertEvent`
- `TrendPoint`

这些都非常适合用 `interface`，因为它们本质上是在描述：

- 一个对象里面应该有哪些字段
- 每个字段是什么类型

### 7.2 `type` 更像“类型组合器”

比如：

- `AlertMetric`
- `AlertLevel`

这些都不是在描述复杂对象，而是在描述：

- 某个值的可选范围

所以它们用 `type` 非常自然。

你现在可以先形成一个实用层面的理解：

- 遇到对象结构，优先联想到 `interface`
- 遇到固定取值范围，优先联想到 `type`

这不是绝对规则，但对当前项目足够实用。

---

## 8. TypeScript 为什么能帮助你减少错误

这一点一定要结合真实场景理解。

### 8.1 字段名写错时

假设你本来应该写：

```ts
telemetry.scalars.temperature
```

如果你误写成别的名字，类型系统往往会第一时间提醒你。

这比运行时才发现问题要好得多。

### 8.2 值类型写错时

比如某个字段应该是 `number[]`，你却传成了字符串数组或单个数字。  
类型系统会尽早阻止这类问题。

### 8.3 组件传参不一致时

例如子组件要求：

- `viewMode` 必须是某几个固定值之一

如果父组件乱传，类型系统会帮你识别问题。

### 8.4 服务数据结构不一致时

如果 Mock 数据生成的是一种结构，而 WebSocket 数据解析出来是另一种结构，类型系统会迫使你尽快统一它们。

这对于实时监测项目尤其重要。

---

## 9. TypeScript 如何帮助你读 props

你前面已经问过 props 是什么，现在正好把类型和 props 结合起来理解。

在真实项目里，props 最怕的问题是：

- 父组件传了什么不清楚
- 子组件需要什么不清楚
- 某个函数 prop 该接收什么参数不清楚

这时候 props 类型定义就很有价值。

比如一个组件通常会写成这种形式：

```ts
interface SceneProps {
  config: AppConfig;
  viewMode: ViewMode;
  telemetry: BearingTelemetry | null;
}
```

这等于直接告诉你：

- 这个组件需要配置对象
- 需要当前视图模式
- 需要当前遥测数据

哪怕你还没看组件内部逻辑，也已经知道它依赖什么输入。

所以你以后看组件时，可以养成一个非常好的习惯：

**先看 props 类型，再看 JSX。**

---

## 10. TypeScript 如何帮助你理解状态设计

当前项目里还有一个很值得学习的点：

类型会帮助你看清哪些状态是“随便写的”，哪些状态是“被约束的”。

例如：

- `viewMode` 不是任意字符串
- `AlertLevel` 不是任意文字
- `AlertMetric` 不是随便填什么都行

这说明系统设计者其实已经在通过类型表达业务规则。

比如当你看到：

```ts
type AlertMetric = 'maxPressure' | 'temperature' | 'minFilmThickness';
```

你就应该意识到：

- 这个系统当前只监控这几类告警指标
- 告警逻辑也是围绕这些指标组织的

也就是说，类型不仅约束代码，还在表达业务边界。

---

## 11. 当前项目里最值得你重点看的类型文件

从这一课开始，你要真正重视类型文件。

建议重点阅读：

- [src/services/types.ts](/E:/code/bearing-digital-twin/src/services/types.ts)
- [src/types/app.ts](/E:/code/bearing-digital-twin/src/types/app.ts)

你可以先这样分工理解：

### 11.1 `src/services/types.ts`

更偏业务数据和监测数据：

- 遥测数据
- 告警事件
- 趋势点

### 11.2 `src/types/app.ts`

更偏应用配置和场景配置：

- 模型配置
- 材质配置
- 变换配置
- 视图模式

这两个文件合起来，基本就构成了这个项目最重要的数据边界。

---

## 12. 读类型时你应该问哪些问题

这是一套非常实用的方法。

以后你看到一个类型定义，不要只机械看字段，要主动问：

### 12.1 它描述的是哪一类对象

比如：

- 实时数据
- 历史事件
- 页面配置
- 组件输入

### 12.2 这个对象会被谁使用

比如：

- Hook
- 组件
- 服务层
- 场景层

### 12.3 这个对象的字段是否能反映业务含义

比如：

- `temperature`
- `maxPressure`
- `minFilmThickness`

这些字段其实都带着业务语义。

### 12.4 它为什么要这样约束

比如：

- 为什么某些值必须是联合类型
- 为什么某些字段是可选的
- 为什么某些对象要分层嵌套

当你这样读类型时，你会比只看实现代码更容易抓住系统本质。

---

## 13. 本课代码导读建议

这一课建议你重点阅读：

- [src/services/types.ts](/E:/code/bearing-digital-twin/src/services/types.ts)
- [src/types/app.ts](/E:/code/bearing-digital-twin/src/types/app.ts)

辅助阅读：

- [src/App.tsx](/E:/code/bearing-digital-twin/src/App.tsx)
- [src/hooks/useTelemetry.ts](/E:/code/bearing-digital-twin/src/hooks/useTelemetry.ts)
- [src/scenes/BearingScene.tsx](/E:/code/bearing-digital-twin/src/scenes/BearingScene.tsx)

阅读时请重点回答下面几个问题：

- 哪些类型是业务数据类型
- 哪些类型是配置类型
- 哪些类型是 props 类型
- 哪些字段在表达业务规则
- 哪些类型帮助限制了错误输入

---

## 14. 本课知识小结

这一课最重要的结论有 6 个。

### 结论 1：TypeScript 不是语法负担，而是工程保护层

它帮助复杂项目减少错误、明确边界、提升可维护性。

### 结论 2：类型本身就是系统说明书

你可以通过类型快速看懂系统里有哪些核心数据对象。

### 结论 3：`interface` 适合描述对象结构

在当前项目里，很多业务对象和 props 对象都适合用 `interface`。

### 结论 4：`type` 很适合表达有限取值范围

像告警级别、告警指标、视图模式这种内容，用 `type` 很自然。

### 结论 5：类型不仅约束代码，也表达业务边界

很多类型定义其实已经在告诉你系统允许什么、不允许什么。

### 结论 6：读真实项目时，先看类型会让你更快进入状态

先看类型，再看实现，是非常高效的阅读习惯。

---

## 15. 本课作业

请你完成下面 4 个作业。

### 作业 1：解释 TypeScript 在这个项目中的价值

要求：

- 不少于 120 字
- 不要只写“防止报错”
- 尽量结合业务数据、props、配置三个角度说明

### 作业 2：找出 5 个关键类型

要求：

- 至少从 [src/services/types.ts](/E:/code/bearing-digital-twin/src/services/types.ts) 和 [src/types/app.ts](/E:/code/bearing-digital-twin/src/types/app.ts) 中各找一些
- 每个类型写一句作用说明

### 作业 3：区分 interface 和 type

要求：

- 各举 2 个当前项目中的例子
- 说明为什么这里这样设计

### 作业 4：找出 3 个“表达业务边界”的类型定义

例如：

- 联合类型
- 限定模式值
- 可选字段

要求：

- 不只写名字，还要写出它限制了什么

---

## 16. 下节课预告

第 7 课我们会正式深入：

**核心遥测数据结构设计**

你会开始围绕 [src/services/types.ts](E:/code/bearing-digital-twin/src/services/types.ts) 详细理解：

- `BearingTelemetry` 为什么这样设计
- `scalars` 和 `fieldData` 的区别是什么
- 为什么这个项目既要有整体指标，又要有分布数组

从这一课开始，数据模型会真正进入项目主线。

---

## 17. 一句话总结

第 6 课的核心任务，是理解 TypeScript 在这个项目里承担的是“系统边界说明书”和“工程保护层”的角色，而不是简单的语法装饰。
