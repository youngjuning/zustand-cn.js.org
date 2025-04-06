---
order: 0
title: 介绍
description: 如何使用 Zustand
keywords: [zustand, React, Hooks, 状态管理, Store]
nav:
  title: 开始
  order: 0
toc: content
---

一个小巧、快速、可扩展的熊骨状态管理解决方案。Zustand 有一个基于 Hooks 的易用的 API。它既没有模板化，也没有主观臆断，但却有足够的约定俗成的明确性和可变性。

不要因为它可爱而忽视它。它有很多爪子，很多时间花在处理常见的陷阱上，比如可怕的[僵尸孩子问题](https://react-redux.js.org/api/hooks#stale-props-and-zombie-children)、[反应并发](https://github.com/bvaughn/rfcs/blob/useMutableSource/text/0000-use-mutable-source.md)和混合渲染器之间的[上下文丢失](https://github.com/facebook/react/issues/13332)。它可能是 React 空间中的唯一状态管理器，可以正确处理所有这些问题。

## 安装

Zustand 可作为 NPM 包供使用：

```bash
# NPM
npm install zustand

# Yarn
yarn add zustand
```

## 首先创建一个 Store

你的 store 就像一个 Hook！你可以把任何东西放进去：原始值、对象、函数。`set` 函数会合并状态。

```ts
import { create } from 'zustand'

const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}))
```

## 然后绑定您的组件，就完成了！

您可以在任何地方使用钩子，无需提供 Provider。选择您的状态，当状态改变时，使用该状态的组件将重新渲染。

```tsx
/**
 * defaultShowCode: true
 */
import { Button, Space } from 'antd'
import { create } from 'zustand'

const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}))

function BearCounter() {
  const bears = useStore((state) => state.bears)
  return <h1>{bears} around here ...</h1>
}

function Controls() {
  const bears = useStore((state) => state.bears)
  const increasePopulation = useStore((state) => state.increasePopulation)
  const removeAllBears = useStore((state) => state.removeAllBears)

  return (
    <Space size="large">
      <Button type="primary" onClick={increasePopulation}>one up</Button>
      {bears > 0 && <Button type="primary" danger onClick={removeAllBears}>clear</Button>}
    </Space>
  )
}

export default () => {
  return (
    <>
      <BearCounter />
      <Controls />
    </>
  )
}
```
