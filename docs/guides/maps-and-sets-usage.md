---
order: 8
title: Map and Set 示例 - Zustand
description: Map and Set 示例
keywords: [Zustand, React, Hooks, 状态管理, Store, Typescript]
---

你需要将 `Maps` 和 `Sets` 包装在一个对象中。当你想要它的更新被反映出来（例如在 React 中），你需要通过调用它的 `setState` 方法来实现：

```ts
import { create } from 'zustand'

const useFooBar = create(() => ({ foo: new Map(), bar: new Set() }))

function doSomething() {
  // doing something...

  // 如果你想更新一些使用了 `useFooBar` 的 React 组件，你必须调用 setState 来让 React 知道更新发生了。
  // 遵循 React 的最佳实践，当更新它们时，应该创建一个新的 Map/Set：
  useFooBar.setState((prev) => ({
    foo: new Map(prev.foo).set('newKey', 'newValue'),
    bar: new Set(prev.bar).add('newKey'),
  }))
}
```
