# Node.js 相关知识点

## 事件循环（Event Loop）

### 浏览器 vs Node.js 的核心差异

- **浏览器事件循环**通常可以粗略理解为：执行一个宏任务（task）→ 清空微任务（microtask）→ 进行一次渲染（若需要）→ 进入下一轮循环。
- **Node.js 事件循环**底层基于 **libuv**，每一轮循环会在多个阶段（phase）之间流转。常见阶段可以记成：
  - `timers` → `pending callbacks` → `idle/prepare` → `poll` → `check` → `close callbacks`

### Node.js 版本差异（宏/微任务）

在不同 Node 版本中，宏任务与微任务的执行时机存在过演进；面试回答时更重要的是抓住**规律**：

- **微任务**（如 Promise 的 `then/catch/finally`）会在合适的时机被清空执行，以保证异步回调的可预测性。
- 在 Node.js 中还存在一个更高优先级的队列：`process.nextTick`。

### `process.nextTick` 的特殊性

- `process.nextTick` **不属于标准微任务队列**（不是 Promise microtask），它有一个独立队列，并且在很多场景下会**优先于 Promise 微任务执行**。
- 因为优先级更高，如果递归地不断塞入 `nextTick`，可能导致 I/O 或 timers 长时间得不到机会执行，引发“饿死”问题。

> 这份笔记只做面试表达层面的梳理；如果需要，我也可以在这里补一段可运行的示例代码，用输出顺序来验证宏任务/微任务/nextTick 的优先级差异。
