---
order: 1
title: 不可变状态和合并 - Zustand
description: 就像在 React 中使用的 useState 一样，我们需要以不可变的方式更新状态。
keywords: [Zustand, React, Hooks, 状态管理, Store]
---

就像 React 的 useState 一样，我们需要以不可变的方式更新状态。

这是一个典型的例子：

```tsx | pure
import { create } from 'zustand'

const useCountStore = create(set => ({
  count: 0,
  inc: () => set(state => ({ count: state.count + 1 })),
}))
```

`set` 函数是用来更新 store 中的状态的。由于状态是不可变的，应该像这样：

```tsx | pure
set((state) => ({ ...state, count: state.count + 1 }))
```

然而，由于这是一种常见模式，`set` 实际上合并了状态，因此我们可以跳过 `...state` 的部分：

```tsx | pure
set((state) => ({ count: state.count + 1 }))
```

## 嵌套对象

`set` 函数仅合并一个级别的状态。如果您有一个嵌套的对象，您需要显式地合并它们。您将使用展开运算符模式，如下所示：

```tsx | pure
import { create } from 'zustand'

const useCountStore = create((set) => ({
  nested: { count: 0 },
  inc: () =>
    set((state) => ({
      nested: { ...state.nested, count: state.nested.count + 1 },
    })),
}))
```

对于复杂的用例，考虑使用一些帮助进行不可变更新的库。您可以参考[更新嵌套状态对象值](/guides/updating-state#深度嵌套的对象)。

## Replace flag

要禁用合并行为，您可以为 `set` 指定一个 `replace` 布尔值，如下所示：

```ts
set((state) => newState, true)
```
