---
order: 6
title: 测试
description: Testing
keywords: [zustand, React, Hooks, 状态管理, Store, Typescript]
toc: content
---

## 在 react-dom 中在测试期间重置状态。

在运行测试时，store 不会在每次测试运行之前自动重置。因此，可能存在一个测试的状态会影响另一个测试的情况。为确保所有测试都使用原始的 store 状态运行，您可以在测试期间模拟 zustand，并使用以下代码创建 store：

```ts
import { create as actualCreate } from 'zustand'
// const { create: actualCreate } = jest.requireActual('zustand') // 如果使用 jest
import { act } from 'react-dom/test-utils'

// 一个变量用于保存应用程序中所有 store 的重置函数。
const storeResetFns = new Set()

// 创建一个 store 时，我们获取它的初始状态，创建一个重置函数并将其添加到集合中。
export const create = (createState) => {
  const store = actualCreate(createState)
  const initialState = store.getState()
  storeResetFns.add(() => store.setState(initialState, true))
  return store
}

// Reset all stores after each test run
beforeEach(() => {
  act(() => storeResetFns.forEach((resetFn) => resetFn()))
})
```

你如何模拟依赖取决于你的测试运行器/库。

你如何模拟一个依赖取决于你使用的测试运行器/库。在 Jest 中，你可以创建一个 `__mocks__/zustand.js` 文件并将代码放在其中。如果你的应用程序使用的是 `zustand/vanilla` 而不是 `zustand`，则你需要将上述代码放在 `__mocks__/zustand/vanilla.js` 中。

## TypeScript 示例

如果你正在使用 zustand，就像 [TypeScript 指南](/guides/typescript)中所述，使用以下代码：

```ts
import { create as actualCreate, StateCreator } from 'zustand'
// if using Jest:
// import { StateCreator } from 'zustand';
// const { create: actualCreate } = jest.requireActual<typeof import('zustand')>('zustand');
import { act } from 'react-dom/test-utils'

// a variable to hold reset functions for all stores declared in the app
const storeResetFns = new Set<() => void>()

// when creating a store, we get its initial state, create a reset function and add it in the set
const create =
  () =>
  <S>(createState: StateCreator<S>) => {
    const store = actualCreate(createState)
    const initialState = store.getState()
    storeResetFns.add(() => store.setState(initialState, true))
    return store
  }

// Reset all stores after each test run
beforeEach(() => {
  act(() => storeResetFns.forEach((resetFn) => resetFn()))
})
```

## 在 react-native 和 jest 中重置测试之间的状态

你应该在 `__mocks__/zustand.js` 文件中使用以下代码（`__mocks__` 目录应该与 `node_modules` 相邻，放置在与 `node_modules` 相同的文件夹中，除非你配置了 roots 指向项目根目录以外的文件夹，[jest 文档：模拟 node 模块](https://jestjs.io/docs/manual-mocks#mocking-node-modules)）。

```ts
import { act } from '@testing-library/react-native'
const { create: actualCreate } = jest.requireActual('zustand')

// a variable to hold reset functions for all stores declared in the app
const storeResetFns = new Set()

// when creating a store, we get its initial state, create a reset function and add it in the set
export const create = (createState) => {
  const store = actualCreate(createState)
  const initialState = store.getState()
  storeResetFns.add(() => store.setState(initialState, true))
  return store
}

// Reset all stores after each test run
beforeEach(() => {
  act(() => storeResetFns.forEach((resetFn) => resetFn()))
})
```

如果 `jest.config.js` 中的 `automock` 为 `false`，则需要在 `jest.setup.js` 中执行以下操作：

```ts
jest.mock('zustand')
```
