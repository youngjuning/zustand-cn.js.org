---
title: 一个小型、快速、可扩展的基本状态管理解决方案
description: 一个小型、快速、可扩展的基本状态管理解决方案。Zustand 有一个基于 hooks 的舒适 API。它不是样板文件，也没有倾向，但有足够的约定来明确和流量一样。
keywords: [Zustand, React, Hooks, 状态管理, Store]
hero:
  title: Zustand
  description: 一个小型、快速、可扩展的基本状态管理解决方案
  actions:
    - text: 开始
      link: /getting-started
    - text: World
      link: /
features:
  - title: React
    emoji: 💎
    description: 简单而不固执己见
  - title: Hooks
    emoji: 🌈
    description: 使 Hooks 成为消费状态的主要方式
  - title: 'Context'
    emoji: 🚀
    description: 不将您的应用包装在上下文提供者中
---

使用简化的通量原理的小型、快速和可扩展的 bearbones 状态管理解决方案。有一个基于钩子的舒适 API，不是样板式的或固执己见的。

不要因为它可爱而忽视它。它有很多爪子，很多时间花在处理常见的陷阱上，比如可怕的[僵尸孩子问题](https://react-redux.js.org/api/hooks#stale-props-and-zombie-children)、[反应并发](https://github.com/bvaughn/rfcs/blob/useMutableSource/text/0000-use-mutable-source.md)和混合渲染器之间的[上下文丢失](https://github.com/facebook/react/issues/13332)。它可能是 React 空间中的唯一状态管理器，可以正确处理所有这些问题。

## 安装

```bash
# NPM
npm install zustand

# Yarn
yarn add zustand
```

## 计数器

```tsx
/**
 * defaultShowCode: true
 */
import { Button, Avatar, Badge, Space, Image } from 'antd'
import { create } from 'zustand'

type Store = {
  count: number
  inc: () => void
}

const useStore = create<Store>()((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}))

function Counter() {
  const { count, inc } = useStore()

  return (
    <Space size="large">
      <Badge count={count}>
        <Image src="https://docs.pmnd.rs/zustand.ico" style={{ width: '60px', height: '60px' }} preview={false} />
      </Badge>
      <Button type="primary" onClick={inc}>one up</Button>
    </Space>
  )
}

export default Counter
```
