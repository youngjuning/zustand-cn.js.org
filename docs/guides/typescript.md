---
order: 5
title: Typescript 指南
description: TypeScript Guide
keywords: [Zustand, React, Hooks, 状态管理, Store, Typescript]
---

## 基础使用

使用 TypeScript 时的区别在于，您必须编写 `create<T>()(...)`（注意多余的括号 `()` 和类型参数 `T`），而不是编写`create(...)`，其中 `T` 是状态类型以进行注释。例如：

```ts
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))
```

<details>
  <summary>为什么我们不能仅从初始状态推断类型？</summary>

  <br/>

**简而言之**：因为状态泛型 T 是不变的。

考虑这个最小版本的 `create`：

```ts
declare const create: <T>(f: (get: () => T) => T) => T

const x = create((get) => ({
  foo: 0,
  bar: () => get(),
}))
// `x` is inferred as `unknown` instead of
// interface X {
//   foo: number,
//   bar: () => X
// }
```

在这里，如果你看一下 `create` 函数中 `f` 的类型，即 `(get: () => T) => T` ，它通过 `return` 提供 `T`（使其具有协变性），但它也通过 `get` 接收 `T`（使其具有逆变性）。 TypeScript 想知道 "T 是从哪里来的？" 这就像那个鸡和蛋的问题。最终 TypeScript 放弃了，并将 `T` 推断为 `unknown`。

因此，只要要推断的泛型是不变的（即既协变又逆变），TypeScript 就无法推断它。另一个简单的例子是这样的：

```ts
const createFoo = {} as <T>(f: (t: T) => T) => T
const x = createFoo((_) => 'hello')
```

这里，x 是 `unknown`，而不是 `string`。

  <details>
    <summary>更多关于推断（仅限于对 TypeScript 感兴趣的人）</summary>

在某种意义上，这种推理失败并不是一个问题，因为无法编写类型为 `<T>(f: (t: T) => T) => T` 的值。也就是说，你无法编写 `createFoo` 的真实运行时实现。让我们试试：

```js
const createFoo = (f) => f(/* ? */)
```

`createFoo` 需要返回 `f` 的返回值。为了做到这一点，我们首先必须调用 `f`。为了调用它，我们必须传递一个类型为 `T` 的值。为了传递一个类型为 `T` 的值，我们首先必须生成它。但是当我们甚至不知道 `T` 是什么时，我们如何生成一个类型为 `T` 的值呢？生成类型为 `T` 的值的唯一方法是调用 `f`，但是要调用 `f` 本身，我们需要一个类型为 `T` 的值。所以你看，实际上写 `createFoo` 是不可能的。

所以我们要说的是，`createFoo` 的推断失败并不是真正的问题，因为实现 `createFoo` 是不可能的。但是 `create` 的推断失败呢？这也不是真正的问题，因为实现 `create` 也是不可能的。等一下，如果实现 `create` 是不可能的，那么 Zustand 如何实现它呢？答案是，它没有实现。

Zustand 声称它实现了 `create` 的类型，但它只实现了其中的大部分。以下是一个简单的证明，通过展示不完备性。考虑以下代码：

```ts
import { create } from 'zustand'

const useBoundStore = create<{ foo: number }>()((_, get) => ({
  foo: get().foo,
}))
```

这段代码可以编译通过。但是如果我们运行它，会出现一个异常："未捕获的类型错误：无法读取未定义属性（'foo'）。" 这是因为在创建初始状态之前，`get` 将返回 `undefined`（因此在创建初始状态时不应调用 `get`）。类型保证 `get` 永远不会返回 `undefined`，但最初它确实返回了，这意味着 Zustand 未能实现它。

当然，Zustand 失败了，因为按照类型的承诺实现 `create` 是不可能的（就像无法实现 `createFoo` 一样）。换句话说，我们没有一种类型来表达我们实现的实际 `create`。我们无法将 `get` 类型为 `() => T | undefined`，因为这会导致不便，并且它仍然不正确，因为 `get` 确实是 `() => T`，只是如果同步调用它，则会是 `() => undefined`。我们需要一些 TypeScript 特性，允许我们将 `get` 类型化为 `(() => T) & WhenSync<() => undefined>`，这当然是极其牵强的。

所以我们有两个问题：推断不足和不安全性。如果 TypeScript 可以改进它对不变量的推断，那么推断不足就可以解决。如果 TypeScript 引入类似 WhenSync 的东西，那么不安全性就可以解决。为了解决推断不足，我们手动注释状态类型。而我们无法解决不安全性，但这并不是什么大问题，因为同步调用 `get` 没有意义。

</details>

</details>

<details>
  <summary>为什么使用函数柯里化 `()(...)`？</summary>

  <br/>

**简而言之**: 为了解决 [microsoft/TypeScript#10571](https://github.com/microsoft/TypeScript/issues/10571).

想象一下你有这样的情景：

```ts
declare const withError: <T, E>(
  p: Promise<T>
) => Promise<[error: undefined, value: T] | [error: E, value: undefined]>
declare const doSomething: () => Promise<string>

const main = async () => {
  let [error, value] = await withError(doSomething())
}
```

在这里，`T` 被推断为字符串，`E` 被推断为 `unknown`。你可能想将 `E` 注释为 `Foo`，因为你确定 `doSomething()` 会抛出的错误的形状。然而，你不能这样做。你只能传递所有的泛型或者不传递。除了将 `E` 注释为 `Foo`，你还必须将 `T` 注释为字符串，即使它已经被推断出来了。解决方案是创建一个柯里化版本的 `withError`，在运行时不执行任何操作。它的目的只是允许你注释 `E`。

```ts
declare const withError: {
  <E>(): <T>(
    p: Promise<T>
  ) => Promise<[error: undefined, value: T] | [error: E, value: undefined]>
  <T, E>(p: Promise<T>): Promise<
    [error: undefined, value: T] | [error: E, value: undefined]
  >
}
declare const doSomething: () => Promise<string>
interface Foo {
  bar: string
}

const main = async () => {
  let [error, value] = await withError<Foo>()(doSomething())
}
```

这样，`T` 就可以被推断出来，而你可以注释 `E`。当我们想要注释状态（第一个类型参数），但允许其他参数被推断时，Zustand 有相同的用例。

</details>

或者，您也可以使用 `combine`，它会推断状态，这样您就不需要输入它。

```ts
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

const useBearStore = create(
  combine({ bears: 0 }, (set) => ({
    increase: (by: number) => set((state) => ({ bears: state.bears + by })),
  }))
)
```

<details>
  <summary>但要小心一点。</summary>

  <br/>

我们通过在 `set`、`get` 和 `store` 的类型中进行一些小的修改来实现推理。这个小小的修改是将它们的类型定义为状态是第一个参数，但实际上状态是第一个参数和第二个参数返回值的浅合并 `({ ...a，...b })`。例如，来自第二个参数的 `get` 类型为`() => { bears: number }`，这是一个谎言，因为它应该是 `() => { bears: number，increase: (by: number) => void }`。而 `useBearStore` 仍然具有正确的类型；例如，`useBearStore.getState` 的类型为 `() => { bears: number，increase: (by: number) => void }`。

这并不是真正的谎言，因为 `{ bears: number }` 仍然是 `{ bears: number，increase: (by: number) => void }` 的子类型。因此，在大多数情况下不会有问题。

- 您只需要在使用 `replace` 时小心。例如，`set({ bears: 0 }, true)` 会编译通过，但不安全，因为它将删除 `increase` 函数。
- 另一个需要小心的地方是如果您使用 `Object.keys`。`Object.keys(get())` 将返回 `["bears"，"increase"]` 而不是 `["bears"]`。`get` 的返回类型可能会让您犯这些错误。

`combine` 为方便起见牺牲了一些类型安全性，以避免为状态编写类型。因此，您应该相应地使用 `combine`。在大多数情况下都可以使用它，并且可以方便地使用它。
</details>

请注意，当使用 `combine` 时，我们不使用柯里化版本，因为 `combine` "创建" 状态。当使用创建状态的中间件时，不需要使用柯里化版本，因为现在可以推断出状态。另一个创建状态的中间件是 redux。因此，在使用 `combine`、`redux` 或任何其他创建状态的自定义中间件时，我们不建议使用柯里化版本。

## 使用中间件

你不需要做任何特殊的事情来在 TypeScript 中使用中间件。

```ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()(
  devtools(
    persist((set) => ({
      bears: 0,
      increase: (by) => set((state) => ({ bears: state.bears + by })),
    }))
  )
)
```

请确保您立即在 `create` 中使用它们，以使上下文推断起作用。进行任何稍微复杂的操作，例如以下的 myMiddlewares，都需要更高级的类型。

```ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const myMiddlewares = (f) => devtools(persist(f))

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()(
  myMiddlewares((set) => ({
    bears: 0,
    increase: (by) => set((state) => ({ bears: state.bears + by })),
  }))
)
```

此外，我们建议尽可能将 `devtools` 中间件放在最后。例如，当您将其与 `immer` 一起使用时，应该是 `immer(devtools(...))` 而不是 `devtools(immer(...))`。这是因为 `devtools` 改变了 `setState` 并添加了一个类型参数，如果其他中间件（如 `immer`）在 `devtools` 之前也改变了 `setState`，这些参数可能会丢失。因此，在最后使用 `devtools` 可以确保在它之前没有中间件改变了 `setState`。

## 编写中间件和高级用法

想象一下，如果你必须编写这个假设的中间件。

```ts
import { create } from 'zustand'

const foo = (f, bar) => (set, get, store) => {
  store.foo = bar
  return f(set, get, store)
}

const useBearStore = create(foo(() => ({ bears: 0 }), 'hello'))
console.log(useBearStore.foo.toUpperCase())
```

Zustand 中间件可以改变存储状态。但是我们如何在类型层面上编码这种变化呢？换句话说，我们如何定义 `foo` 的类型，使得下面的代码可以编译通过？

对于通常的静态类型语言来说，这是不可能的。但是幸运的是，TypeScript 中的 Zustand 有一个叫做“高级变异器”的东西，使得这种操作成为可能。如果你正在处理复杂的类型问题，比如对中间件进行类型定义或使用 `StateCreator` 类型，你就需要理解这个实现细节。关于这一点，你可以查看 [#710](https://github.com/pmndrs/zustand/issues/710) 。

如果你急于想知道这个问题的答案，那么你可以[在这里看到它](https://docs.pmnd.rs/zustand/guides/typescript#middleware-that-changes-the-store-type)。

## 常见食谱

### 不改变 store 类型的中间件

```ts
import { create, State, StateCreator, StoreMutatorIdentifier } from 'zustand'

type Logger = <
  T extends State,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string
) => StateCreator<T, Mps, Mcs>

type LoggerImpl = <T extends State>(
  f: StateCreator<T, [], []>,
  name?: string
) => StateCreator<T, [], []>

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
  type T = ReturnType<typeof f>
  const loggedSet: typeof set = (...a) => {
    set(...a)
    console.log(...(name ? [`${name}:`] : []), get())
  }
  store.setState = loggedSet

  return f(loggedSet, get, store)
}

export const logger = loggerImpl as unknown as Logger

// ---

const useBearStore = create<BearState>()(
  logger(
    (set) => ({
      bears: 0,
      increase: (by) => set((state) => ({ bears: state.bears + by })),
    }),
    'bear-store'
  )
)
```

### 可以改变 store 类型的中间件。

```ts
import {
  create,
  State,
  StateCreator,
  StoreMutatorIdentifier,
  Mutate,
  StoreApi,
} from 'zustand'

type Foo = <
  T extends State,
  A,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, [...Mps, ['foo', A]], Mcs>,
  bar: A
) => StateCreator<T, Mps, [['foo', A], ...Mcs]>

declare module 'zustand' {
  interface StoreMutators<S, A> {
    foo: Write<Cast<S, object>, { foo: A }>
  }
}

type FooImpl = <T extends State, A>(
  f: StateCreator<T, [], []>,
  bar: A
) => StateCreator<T, [], []>

const fooImpl: FooImpl = (f, bar) => (set, get, _store) => {
  type T = ReturnType<typeof f>
  type A = typeof bar

  const store = _store as Mutate<StoreApi<T>, [['foo', A]]>
  store.foo = bar
  return f(set, get, _store)
}

export const foo = fooImpl as unknown as Foo

type Write<T extends object, U extends object> = Omit<T, keyof U> & U

type Cast<T, U> = T extends U ? T : U

// ---

const useBearStore = create(foo(() => ({ bears: 0 }), 'hello'))
console.log(useBearStore.foo.toUpperCase())
```

### 没有柯里化的 `create` 函数

推荐使用柯里化解决方案的方式来使用 `create`，例如：`create<T>()(...)`。这是因为它使您能够推断出 store 类型。但是，如果出于某种原因您不想使用此解决方法，可以像以下示例一样传递类型参数。请注意，在某些情况下，它作为断言而不是注释，因此我们不建议这样做。

```ts
import { create } from "zustand"

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<
  BearState,
  [
    ['zustand/persist', BearState],
    ['zustand/devtools', never]
  ]
>(devtools(persist((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
})))
```

### 切片模式

```ts
import { create, StateCreator } from 'zustand'

interface BearSlice {
  bears: number
  addBear: () => void
  eatFish: () => void
}

interface FishSlice {
  fishes: number
  addFish: () => void
}

const createBearSlice: StateCreator<
  BearSlice & FishSlice,
  [],
  [],
  BearSlice
> = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
})

const createFishSlice: StateCreator<
  BearSlice & FishSlice,
  [],
  [],
  FishSlice
> = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})

const useBoundStore = create<BearSlice & FishSlice>()((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
}))
```

关于 slices 模式的详细解释可以[在这里找到](/guides/slices-pattern)。如果您有一些中间件，请用 `StateCreator<MyState，Mutators，[]，MySlice>` 替换 `StateCreator<MyState，[]，[]，MySlice>`。例如，如果您正在使用 devtools，则应为 `StateCreator<MyState，[["zustand/devtools"，never]]，[]，MySlice>`。

## vanilla stores 的有界 useStore hook

```ts
import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const bearStore = createStore<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))

function useBearStore(): BearState
function useBearStore<T>(
  selector: (state: BearState) => T,
  equals?: (a: T, b: T) => boolean
): T
function useBearStore<T>(
  selector?: (state: BearState) => T,
  equals?: (a: T, b: T) => boolean
) {
  return useStore(bearStore, selector!, equals)
}
```

如果您经常需要创建有界的 useStore 钩子并希望将其 DRY 化，您还可以创建一个抽象的 `createBoundedUseStore` 函数...

```ts
import { useStore, StoreApi } from 'zustand'
import { createStore } from 'zustand/vanilla'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const bearStore = createStore<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))

const createBoundedUseStore = ((store) => (selector, equals) =>
  useStore(store, selector as never, equals)) as <S extends StoreApi<unknown>>(
  store: S
) => {
  (): ExtractState<S>
  <T>(
    selector: (state: ExtractState<S>) => T,
    equals?: (a: T, b: T) => boolean
  ): T
}

type ExtractState<S> = S extends { getState: () => infer X } ? X : never

const useBearStore = createBoundedUseStore(bearStore)
```

## 中间件及其 mutators 参考

- `devtools` — `["zustand/devtools", never]`
- `persist` — `["zustand/persist", YourPersistedState]`
  `YourPersistedState` 是你将要持久化的状态类型，即 `options.partialize` 的返回类型。如果你没有传递 `partialize` `选项，YourPersistedState` 将变成 `Partial<YourState>`。有时候传递实际的 `PersistedState` 不起作用。在这些情况下，请尝试传递 `unknown`。
- immer — `["zustand/immer", never]`
- subscribeWithSelector — `["zustand/subscribeWithSelector", never]`
- redux — `["zustand/redux", YourAction]`
- combine — 没有 mutator，因为 `combine` 不会改变存储。
