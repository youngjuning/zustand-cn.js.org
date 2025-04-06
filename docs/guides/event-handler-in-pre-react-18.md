---
order: 7
title: 在 React 18 之前，在 React 事件处理程序之外调用操作。
description: 在 React 18 之前，在 React 事件处理程序之外调用操作。
keywords: [zustand, React, Hooks, 状态管理, Store, Typescript]
toc: content
---

因为 React 在事件处理程序外部处理 `setState` 同步，如果在事件处理程序外部更新状态，将强制 React 同步更新组件。因此，有遇到僵尸子组件效应的风险。为了解决这个问题，需要将操作包装在 `unstable_batchedUpdates` 中，像这样：

```ts
import { unstable_batchedUpdates } from 'react-dom' // or 'react-native'

const useFishStore = create((set) => ({
  fishes: 0,
  increaseFishes: () => set((prev) => ({ fishes: prev.fishes + 1 })),
}))

const nonReactCallback = () => {
  unstable_batchedUpdates(() => {
    useFishStore.getState().increaseFishes()
  })
}
```

更多细节：<https://github.com/pmndrs/zustand/issues/302>
