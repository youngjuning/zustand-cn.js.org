---
order: 11
title: Slice 模式
description: Slice 模式
keywords: [Zustand, React, Hooks, 状态管理, Store, Typescript]
---

## 将 store 分割成更小的 store

您的 store 随着添加更多功能会变得越来越大、越来越难以维护。

您可以将主 store 分成更小的个体 store，以实现模块化。这在 Zustand 中非常简单！

第一个个体 store：

```ts
export const createFishSlice = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})
```

另一个个体 store：

```ts
export const createBearSlice = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
})
```

现在，您可以将这两个 store 合并成一个有界 store：

```ts
import { create } from 'zustand'
import { createBearSlice } from './bearSlice'
import { createFishSlice } from './fishSlice'

export const useBoundStore = create((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
}))
```

### 在 React 组件中的使用方法

```ts
import { useBoundStore } from './stores/useBoundStore'

function App() {
  const bears = useBoundStore((state) => state.bears)
  const fishes = useBoundStore((state) => state.fishes)
  const addBear = useBoundStore((state) => state.addBear)
  return (
    <div>
      <h2>Number of bears: {bears}</h2>
      <h2>Number of fishes: {fishes}</h2>
      <button onClick={() => addBear()}>Add a bear</button>
    </div>
  )
}

export default App
```

### 更新多个 store

你可以在一个函数中同时更新多个 store。

```ts
import { createBearSlice } from './bearSlice'
import { createFishSlice } from './fishSlice'

export const createBearFishSlice = (set) => ({
  addBearAndFish: () => {
    createBearSlice(set).addBear()
    createFishSlice(set).addFish()
  },
})
```

将所有 store 合并在一起与以前相同。

```ts
import { create } from 'zustand'
import { createBearSlice } from './bearSlice'
import { createFishSlice } from './fishSlice'
import { createBearFishSlice } from './createBearFishSlice'

export const useBoundStore = create((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
  ...createBearFishSlice(...a),
}))
```

## 添加中间件

将中间件添加到合并后的 store 与其他普通 store 相同。

将 `persist` 中间件添加到我们的 `useBoundStore`：

```ts
import { create } from 'zustand'
import { createBearSlice } from './bearSlice'
import { createFishSlice } from './fishSlice'
import { persist } from 'zustand/middleware'

export const useBoundStore = create(
  persist(
    (...a) => ({
      ...createBearSlice(...a),
      ...createFishSlice(...a),
    }),
    { name: 'bound-store' }
  )
)
```
