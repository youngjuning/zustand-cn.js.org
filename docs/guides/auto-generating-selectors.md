---
order: 3
title: 自动生成 Selector
description: 我们建议在使用 store 的属性或操作时使用 selector。
keywords: [zustand, React, Hooks, 状态管理, Store]
toc: content
---

我们建议在使用 store 的属性或操作时使用 selector。您可以像这样访问 store 中的值：

```ts
const bears = useBearStore((state) => state.bears)
```

然而，编写这些可能会很繁琐。如果你也是这种情况，你可以自动生成你的 selector。

## 创建 `createSelectors` 函数

```ts
import { StoreApi, UseBoundStore } from 'zustand'

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (let k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}
```

如果你有这样的 store：

```ts
interface BearState {
  bears: number
  increase: (by: number) => void
  increment: () => void
}

const useBearStoreBase = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  increment: () => set((state) => ({ bears: state.bears + 1 })),
}))
```

将该函数应用到你的 store：

```ts
const useBearStore = createSelectors(useBearStoreBase)
```

现在 selector 是自动生成的，您可以直接访问它们：

```ts
// get the property
const bears = useBearStore.use.bears()

// get the action
const increase = useBearStore.use.increment()
```

## 第三方库

- [auto-zustand-selectors-hook](https://github.com/Albert-Gao/auto-zustand-selectors-hook)
- [react-hooks-global-state](https://github.com/dai-shi/react-hooks-global-state)
- [zustood](https://github.com/udecode/zustood)
