# vue 相关知识

1. keep-alive 组件

基础原理: 通过一个Object来存储组件，key为cid+componentName, value为vnode,同时通过一个叫keys的数组来存储缓存的组件名，模拟LRU策略

特点: 切换时不会触发created/mounted, 触发activated/deactivated

流程: 渲染 -> 判断是否匹配include / exclude -> 缓存 -> 标记keepAlive = true -> 返回vnode 

```mermaid
graph TD
A[渲染keep-alive] --> B[获取子组件vnode]
B --> C{判断是否匹配include/exclude}
C -->|不匹配| D[直接返回vnode，不缓存]
C -->|匹配| E{缓存中是否有该key}
E -->|有（命中）| F[复用组件实例，更新LRU]
E -->|无（未命中）| G[存入缓存，检查max上限]
G --> H{超过max?}
H -->|是| I[删除最久未使用的缓存]
H -->|否| J[完成缓存]
F & J --> K[标记vnode.keepAlive=true]
K --> L[返回vnode]
```

淘汰策略: 模拟LRU策略，命中缓存时会把命中的组件放到末尾，达到组件设置的max时，淘汰第一个

