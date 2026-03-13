# Contents
## [自定义promise](./promise.js)

特性解析: 
1. Promise状态不可逆，并且有三个 Pending/fulfilled/rejected
2. 异步执行，then/catch 的回调会加入微任务队列，按照事件循环顺序执行
3. 链式调用，then会返回新的Promise实例
4. 值透传/错误冒泡，未处理的回调会进行透传，错误会按照链式调用冒泡


测试用例:
[promise.test.js](./__tests__/promise.test.js)


## 函数编写
1. TS实战题:使用TypeScript实现一个get函数,用于获取对象的属性值,支持嵌套属性获取,示 例:const data = { name: 'tom', age: 18, address: { city: 'beijing' } },get(data, 'address.city') 应 返回 'beijing',需处理属性不存在的情况｡(石墨三面高频编程题)