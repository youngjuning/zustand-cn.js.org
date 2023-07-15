---
order: 4
title: 无 store 的 action - Zustand
description: 建议的用法是将操作和状态放置在 store 内。
keywords: [Zustand, React, Hooks, 状态管理, Store]
---

推荐的用法是将 action 和状态置于 store 中（让您的 action 与 state 放在一起）。

例如：

```ts
export const useBoundStore = create((set) => ({
  count: 0,
  text: 'hello',
  inc: () => set((state) => ({ count: state.count + 1 })),
  setText: (text) => set({ text }),
}))
```

这创建了一个自包含的 store，将 data 和 action 放在一起。

一种替代方法是在模块级别定义 action，也就是放在 store 外部。

```ts
export const useBoundStore = create(() => ({
  count: 0,
  text: 'hello',
}))

export const inc = () =>
  useBoundStore.setState((state) => ({ count: state.count + 1 }))

export const setText = (text) => useBoundStore.setState({ text })
```

这种模式有一些优点：

- 它不需要 hook 来调用 action；
- 它有助于代码拆分。

虽然这种模式没有任何缺点，但由于其封装的特性，一些人可能更喜欢放置在一起。
