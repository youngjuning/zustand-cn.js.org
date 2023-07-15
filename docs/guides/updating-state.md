---
order: 0
title: 状态更新 - Zustand
description: 使用 Zustand 更新状态非常简单！使用提供的 set 函数调用新状态，它将与 Store 中的现有状态进行浅合并。
keywords: [Zustand, React, Hooks, 状态管理, Store]
nav:
  title: 指南
  order: 1
---

## 扁平化更新

使用 Zustand 更新状态非常简单！调用提供的 `set` 函数并传入新状态，它将与 Store 中的现有状态进行浅合并。请注意，有关嵌套状态，请参见下一节。

```tsx | pure
type State = {
  firstName: string
  lastName: string
}

type Action = {
  updateFirstName: (firstName: State['firstName']) => void
  updateLastName: (lastName: State['lastName']) => void
}

// Create your store, which includes both state and (optionally) actions
const useStore = create<State & Action>((set) => ({
  firstName: '',
  lastName: '',
  updateFirstName: (firstName) => set(() => ({ firstName: firstName })),
  updateLastName: (lastName) => set(() => ({ lastName: lastName })),
}))

// In consuming app
// In consuming app
function App() {
  // "select" the needed state and actions, in this case, the firstName value
  // and the action updateFirstName
  const [firstName, updateFirstName] = useStore(
    (state) => [state.firstName, state.updateFirstName],
    shallow
  )

  return (
    <main>
      <label>
        First name
        <input
          // Update the "firstName" state
          onChange={(e) => updateFirstName(e.currentTarget.value)}
          value={firstName}
        />
      </label>

      <p>
        Hello, <strong>{firstName}!</strong>
      </p>
    </main>
  )
}
```

## 深度嵌套的对象

如果你有一个像这样的深层状态对象：

```ts
type State = {
  deep: {
    nested: {
      obj: { count: number }
    }
  }
}
```

更新嵌套状态需要一些努力来确保过程是完全不可变的。

### 常规方法

与 React 或 Redux 类似，正常的方法是复制每个级别的 state 对象。这是通过使用扩展运算符 `...` 并手动合并新状态值来完成的。就像这样：

```tsx | pure
normalInc: () =>
  set((state) => ({
    deep: {
      ...state.deep,
      nested: {
        ...state.deep.nested,
        obj: {
          ...state.deep.nested.obj,
          count: state.deep.nested.obj.count + 1
        }
      }
    }
  })),
```

这是非常长的！让我们探索一些替代方案，让你的生活更轻松。

### 使用 Immer

许多人使用 [Immer](https://github.com/immerjs/immer) 更新嵌套值。无论是在 React、Redux 还是当然的 Zustand 中，都可以随时使用 Immer 来更新嵌套状态！您可以使用 Immer 来缩短深度嵌套对象的状态更新。让我们看一个例子：

```ts
immerInc: () =>
  set(produce((state: State) => { ++state.deep.nested.obj.count })),
```
