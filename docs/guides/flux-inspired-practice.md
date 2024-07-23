---
order: 2
title: Flux 模式实践
description: 尽管 zustand 是一个无偏见的库，这里是我们推荐的一些模式。
keywords: [Zustand, React, Hooks, 状态管理, Store]
---

尽管 zustand 是一个没有偏见的库，但我们推荐以下一些模式：

- 创建一个单一的 store；
- 始终使用set来定义存储；
- 在 store 的根级别定义您的 dispatch 函数，以更新一个或多个 store 切片

```ts
const useBoundStore = create((set) => ({
  storeSliceA: ...,
  storeSliceB: ...,
  storeSliceC: ...,
  dispatchX: () => set(...),
  dispatchY: () => set(...),
}))
```

请参阅[将 store 拆分为单独的切片](/guides/slices-pattern)以了解如何定义具有单独切片的存储。

## 类似于 Flux 的模式 / `dispatching` 操作

如果您不能没有类似于 redux 的 reducer，您可以在存储的根级别上定义一个 dispatch 函数，如下所示：

```ts
const types = { increase: 'INCREASE', decrease: 'DECREASE' }

const reducer = (state, { type, by = 1 }) => {
  switch (type) {
    case types.increase:
      return { grumpiness: state.grumpiness + by }
    case types.decrease:
      return { grumpiness: state.grumpiness - by }
  }
}

const useGrumpyStore = create((set) => ({
  grumpiness: 0,
  dispatch: (args) => set((state) => reducer(state, args)),
}))

const dispatch = useGrumpyStore((state) => state.dispatch)
dispatch({ type: types.increase, by: 2 })
```

你还可以使用我们的 redux 中间件。它会连接你的主 reducer，设置初始状态，并将一个 dispatch 函数添加到状态本身和原生 api 中。

```ts
import { redux } from 'zustand/middleware'

const useReduxStore = create(redux(reducer, initialState))
```

更新 store 的另一种方法是通过包装状态函数的函数。这些函数也可以处理操作的副作用。例如，使用 HTTP 调用。要以非响应式方式使用 Zustand：

```ts
const useDogStore = create(() => ({ paw: true, snout: true, fur: true }))

// Getting non-reactive fresh state
const paw = useDogStore.getState().paw
// Listening to all changes, fires synchronously on every change
const unsub1 = useDogStore.subscribe(console.log)
// Updating state, will trigger listeners
useDogStore.setState({ paw: false })
// Unsubscribe listeners
unsub1()

// You can of course use the hook as you always would
const Component = () => {
  const paw = useDogStore((state) => state.paw)
  ...
```
