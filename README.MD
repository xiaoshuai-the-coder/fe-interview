# FE Interview / Practice

这个仓库用于**准备前端面试**与**日常练习**，内容按三个方向组织：

- **基础（八股文）**：常见知识点与常问问题的梳理（`basic/`）
- **手写代码**：先整理思路，再给出实现与测试（`hand-writing/`）
- **算法**：算法与数据结构练习（`algorithm/`）

## 基础（八股文）

- **JavaScript**：[`basic/js.md`](./basic/js.md)
- **Node.js**：[`basic/nodejs.md`](./basic/nodejs.md)
- **Vue**：[`basic/vue.md`](./basic/vue.md)
- **Java**：[`basic/java.md`](./basic/java.md)
- **架构设计**：[`basic/architect.md`](./basic/architect.md)

## 手写代码

手写题统一放在 `hand-writing/`，每个题目文档遵循：

1. **思路**：边界条件、复杂度、常见坑
2. **代码链接**：实现文件与（若有）测试用例链接

入口文档：[`hand-writing/README.MD`](./hand-writing/README.MD)

## 算法

（暂未整理，后续计划按分类补充高频面试算法题。）

## 本地运行

本仓库使用 Jest 做测试：

```bash
npm test
```

常用命令：

```bash
npm run test:watch
npm run test:coverage
```