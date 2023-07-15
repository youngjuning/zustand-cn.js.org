---
order: 10
title: 使用 props 初始化状态。 - Zustand
description: 使用 props 初始化状态。
keywords: [Zustand, React, Hooks, 状态管理, Store, Typescript]
---

在需要依赖注入的情况下，比如一个 store 需要用来自组件的 props 进行初始化，建议使用带有 `React.context` 的原始 store。

## 使用 createStore 创建 store

```ts
import { createStore } from 'zustand'

interface BearProps {
  bears: number
}

interface BearState extends BearProps {
  addBear: () => void
}

type BearStore = ReturnType<typeof createBearStore>

const createBearStore = (initProps?: Partial<BearProps>) => {
  const DEFAULT_PROPS: BearProps = {
    bears: 0,
  }
  return createStore<BearState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    addBear: () => set((state) => ({ bears: ++state.bears })),
  }))
}
```

## 使用 `React.createContext` 创建上下文。

```ts
import { createContext } from 'react'

export const BearContext = createContext<BearStore | null>(null)
```

## 基础组件使用

```ts
// Provider 实现
import { useRef } from 'react'

function App() {
  const store = useRef(createBearStore()).current
  return (
    <BearContext.Provider value={store}>
      <BasicConsumer />
    </BearContext.Provider>
  )
}
```

```ts
// Consumer 组件
import { useContext } from 'react'
import { useStore } from 'zustand'

function BasicConsumer() {
  const store = useContext(BearContext)
  if (!store) throw new Error('Missing BearContext.Provider in the tree')
  const bears = useStore(store, (s) => s.bears)
  const addBear = useStore(store, (s) => s.addBear)
  return (
    <>
      <div>{bears} Bears.</div>
      <button onClick={addBear}>Add bear</button>
    </>
  )
}
```

## 通用模式

### 包装上下文提供者

```ts
// Provider wrapper
import { useRef } from 'react'

type BearProviderProps = React.PropsWithChildren<BearProps>

function BearProvider({ children, ...props }: BearProviderProps) {
  const storeRef = useRef<BearStore>()
  if (!storeRef.current) {
    storeRef.current = createBearStore(props)
  }
  return (
    <BearContext.Provider value={storeRef.current}>
      {children}
    </BearContext.Provider>
  )
}
```

### 将上下文逻辑提取到自定义 hook 中

```ts
// Mimic the hook returned by `create`
import { useContext } from 'react'
import { useStore } from 'zustand'

function useBearContext<T>(
  selector: (state: BearState) => T,
  equalityFn?: (left: T, right: T) => boolean
): T {
  const store = useContext(BearContext)
  if (!store) throw new Error('Missing BearContext.Provider in the tree')
  return useStore(store, selector, equalityFn)
}
```

```ts
// Consumer usage of the custom hook
function CommonConsumer() {
  const bears = useBearContext((s) => s.bears)
  const addBear = useBearContext((s) => s.addBear)
  return (
    <>
      <div>{bears} Bears.</div>
      <button onClick={addBear}>Add bear</button>
    </>
  )
}
```

### 复杂示例

```ts
// Provider wrapper & custom hook consumer
function App2() {
  return (
    <BearProvider bears={2}>
      <HookConsumer />
    </BearProvider>
  )
}
```
