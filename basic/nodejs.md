# nodejs 相关知识点
1. 事件循环
特点: 浏览器时间循环是 执行一个宏任务 -> 清空微任务 -> 触发渲染  依次循环 
nodejs的时间循环底层基于libuv实现，分为: timer -> io callback -> idel -> poll -> check -> closecalback  v11之前会完整的进行所有宏任务循环，再执行微任务。 v11之后会执行一个宏任务，清空微任务
差异: nodejs中nextTick不属于微任务，高于微任务，会在微任务执行前进行


/ [object Object] 
{
  "a.b": 1,
  "a.c": 2,
  "a.d.e": 5,
  "b.0": 1,
  "b.1": 3,
  "b.2.a": 2,
  "b.2.b": 3,
  "c": 3
}



