# 手写代码

这里收纳常见面试手写题。每道题按同一结构整理：**先思路，再代码链接**（实现/测试）。

## Contents

- [自定义 Promise](#自定义-promise)
- [防抖与节流](#防抖与节流)
- [深拷贝 deepClone](#深拷贝-deepclone)
- [数组扁平化 flatten](#数组扁平化-flatten)
- [并发控制 ConcurrentControl](#并发控制-concurrentcontrol)
- [TypeScript 实战：实现 get(obj, 'a.b.c')](#typescript-实战实现-getobja-b-c)

## 自定义 Promise

### 思路

- **状态机**：Promise 只有 `pending/fulfilled/rejected` 三种状态，且一旦从 `pending` 迁移就不可逆。
- **异步回调**：`then/catch/finally` 的回调需要异步执行。这里用 `queueMicrotask` 把回调放进微任务队列，保证行为与原生 Promise 更接近。
- **链式调用**：`then` 必须返回一个新的 Promise；回调的返回值需要经过「Promise 解析过程」来决定新 Promise 的状态和值。
- **值透传/错误冒泡**：`then` 的参数如果不是函数，要提供默认处理（fulfilled 值透传；rejected 抛出错误），这样链路上没有显式处理也能正确传递。
- **常见边界**：循环引用、回调抛错、返回值为 Promise/thenable、`all/race/allSettled` 的收敛逻辑。

### 代码链接

- **实现**：[`promise.js`](./promise.js)
- **测试**：[`__tests__/promise.test.js`](./__tests__/promise.test.js)

## 防抖与节流

### 思路

- **防抖（debounce）**：触发后延迟执行；在延迟期间重复触发会重置计时器。适合输入框联想、窗口 resize 等「只关心最后一次」的场景。
- **节流（throttle）**：单位时间内最多执行一次；适合滚动监听、拖拽等高频触发场景。
- **实现要点**：
  - 通过闭包保存 `timer/lastRunTime` 等状态。
  - 用 `fn.apply(this, args)` 保留调用方的 `this` 与参数。
  - `immediate` 语义需要清晰：是否首触发立刻执行、以及后续是否还走定时逻辑。

### 代码链接

- **实现**：[`debounce-throttle.js`](./debounce-throttle.js)
- **测试**：[`__tests__/debounce.throttle.test.js`](./__tests__/debounce.throttle.test.js)

## 深拷贝 deepClone

### 思路

- **基本类型直接返回**：`null/undefined/string/number/boolean/symbol/bigint` 不需要拷贝结构。
- **循环引用处理**：用 `WeakMap` 做缓存（key 为源对象，value 为拷贝结果），命中就直接返回，避免递归爆栈/爆内存。
- **按类型分发**：对 `Date/RegExp/Map/Set/Array/Object` 采用不同策略；复杂结构递归拷贝子元素/子属性。
- **遍历键**：用 `Reflect.ownKeys` 覆盖 string key + symbol key，只遍历自身属性。

### 代码链接

- **实现**：[`deepClone.js`](./deepClone.js)
- **测试**：[`__tests__/deepClone.test.js`](./__tests__/deepClone.test.js)

## 数组扁平化 flatten

### 思路

- **递归展开**：遍历数组元素，遇到子数组则递归，把结果拼回同一个数组。
- **复杂度**：时间复杂度 O(n)（每个元素处理一次），空间复杂度与递归深度相关。
- **可扩展点**：如果需要对齐 `Array.prototype.flat(depth)`，可以加入 `depth` 参数控制展开层数；也可以用栈实现以避免深递归。

### 代码链接

- **实现**：[`flatten.js`](./flatten.js)
- **测试**：[`__tests__/flatten.test.js`](./__tests__/flatten.test.js)

## 并发控制 ConcurrentControl

### 思路

- **场景**：限制同一时间执行的任务数量，常用于控制并发请求数、避免资源耗尽。
- **实现要点**：
  - 用队列保存待执行任务，用计数器记录当前运行数量。
  - 每次取任务时检查是否已达上限，未达则启动新任务。
  - 任务完成后从队列取下一个任务执行，形成链式调用。
- **类型设计**：使用泛型支持不同返回值类型，保持 API 简洁。

### 代码链接

- **实现**：[`concurrentControl.ts`](./concurrentControl.ts)
- **测试**：[`__tests__/concurrentControl.test.js`](./__tests__/concurrentControl.test.js)

## TypeScript 实战：实现 get(obj, 'a.b.c')

### 思路

- **路径解析**：将 `'a.b.c'` 按 `.` 切分为 keys，逐层向下取值。
- **空值短路**：中间层级一旦为 `null/undefined` 就停止并返回 `undefined`（或约定的默认值）。
- **返回类型**：如果想做「类型体操」，可以用泛型 + 字符串字面量路径推导返回值类型；面试中也可先实现运行时版本，再讨论如何增强类型。

### 代码链接

- **实现**：[`get.ts`](./get.ts)
- **测试**：[`__tests__/get.test.js`](./__tests__/get.test.js)
