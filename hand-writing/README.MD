# Contents
## [自定义promise](./promise.js)

特性解析: 
1. Promise状态不可逆，并且有三个 Pending/fulfilled/rejected
2. 异步执行，then/catch 的回调会加入微任务队列，按照事件循环顺序执行
3. 链式调用，then会返回新的Promise实例
4. 值透传/错误冒泡，未处理的回调会进行透传，错误会按照链式调用冒泡


测试用例:
[promise.test.js](./__tests__/promise.test.js)
