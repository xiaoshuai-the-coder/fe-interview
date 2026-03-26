# TypeScript

## 泛型

泛型允许一段代码支持多种数据类型，同时保留类型检查。

**核心作用**：
- **代码复用**：一套实现可适用于多种类型
- **类型安全**：相比 `any`，不会丢失类型信息，编译期即可发现问题

```typescript
function identity<T>(arg: T): T {
  return arg;
}
```

## 逆变与协变

- **协变**：父类型可以赋值给子类型。在 TypeScript 中，函数返回类型默认协变。
- **逆变**：子类型可以赋值给父类型。函数参数类型默认逆变。
- **双向协变**：非严格模式下，函数参数既可协变也可逆变，会破坏类型安全，面试中应说明其风险。

```typescript
type Parent = { a: number };
type Child = { a: number; b: string };

// 协变：子类型赋值给父类型
const child: Child = { a: 1, b: 'x' };
const parent: Parent = child; // OK

// 逆变：父类型赋值给子类型（仅在函数参数）
type FnParent = (p: Parent) => void;
type FnChild = (c: Child) => void;
const fnParent: FnParent = (p) => {};
const fnChild: FnChild = fnParent; // 逆变
```

## 映射类型

基于已有类型批量生成新类型，是 `Partial`、`Required`、`Readonly` 的底层实现。

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// 使用 -? 移除可选修饰符
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

## 条件类型

根据输入类型动态返回不同的类型，类似三元运算符。

```typescript
type IsString<T> = T extends string ? true : false;
type Result = IsString<'hello'>; // true

// 推断类型
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
type Num = UnpackPromise<Promise<number>>; // number
```

## 内置工具类型

| 工具类型 | 作用 |
|---------|------|
| `Partial<T>` | 所有属性变为可选 |
| `Required<T>` | 所有属性变为必填 |
| `Readonly<T>` | 所有属性变为只读 |
| `Pick<T, K>` | 从 T 中选取 K |
| `Omit<T, K>` | 从 T 中排除 K |
| `Exclude<T, U>` | 从 T 中排除属于 U 的类型 |
| `Extract<T, U>` | 从 T 中提取属于 U 的类型 |
| `NonNullable<T>` | 去掉 null 和 undefined |
| `Record<K, T>` | 创建键类型为 K、值类型为 T 的对象 |
| `Parameters<T>` | 获取函数参数类型 |
| `ReturnType<T>` | 获取函数返回值类型 |
| `Awaited<T>` | 解开 Promise 类型 |