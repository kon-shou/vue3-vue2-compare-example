# 前置き
最近、Vue3をCompositionAPIで書く機会が増えてきたのですが、自分はVue2のOptionsAPIに書き慣れていたので、あらためてCompositionAPIとOptionsAPIの書き方の違いを、サンプルアプリを用いてまとめました。

実行環境はVue3.5を想定しています。

サンプルコードは下記
https://github.com/kon-shou/vue3-vue2-compare-example

# サンプルアプリについて

画面はこのようになります。
![](https://storage.googleapis.com/zenn-user-upload/d4ff1c816d8c-20250403.png)


パット見、ゴチャゴチャでさっぱりわかりませんが、やってることは

- 親子でコンポーネントを実装して、それぞれで状態を持ち、それぞれで変更できるようにする

だけです。

# OptionsAPI と CompositionAPI の書き方の比較
## コンポーネントの基本構造

### OptionsAPI

OptionsAPI では、コンポーネントはオブジェクトとして定義され、`data`、`methods`、`computed`、`watch` などの特定のオプションに機能を分類します。

```js
export default {
  components: { ... },
  mixins: [ ... ],
  data() {
    return { ... }
  },
  methods: { ... },
  computed: { ... },
  watch: { ... },
  mounted() { ... }
}
```

### CompositionAPI

一方、CompositionAPI では、`<script setup>` 構文を使用し、関数やコンポーザブルを使って機能を整理します。

```ts
import { ref, computed, onMounted } from 'vue'

// ステート、メソッド、計算プロパティなどをトップレベルで定義
const count = ref(0)
const doubleCount = computed(() => count.value * 2)

function increment() {
  count.value++
}

onMounted(() => {
  // マウント時の処理
})
```

OptionsAPIでは、それぞれ専用の `components` 等のキー名・メソッド名が割り振られていたのが、CompositionAPIでは

- `data()` -> `ref()` or `reactive()`
- `computed: {}` -> `computed(() => {})`
- `methods: {}` -> (通常の関数)
- `watch: {}` -> `watch(() => {})`
- `mounted()` -> `onMounted(() => {})`

のような変更がされ、それぞれ `<script setup> `内で記述するようになりました。

また、ライフサイクルフックの話になったので言及するのですが、OptionsAPIでの `async created()` を、そのままCompositionAPIで書くには工夫が必要です。

[Suspenseを使う](https://ja.vuejs.org/guide/built-ins/suspense) というのも手ですが、そちらはまだExperimentalということもあり「<script>のトップレベルで await 無しで呼び出す」が筋が良いのではないかと思っています（要調査）

## コンポーネント内の状態管理

### OptionsAPI

```js
export default {
  data() {
    return {
      total: 0,
    }
  },
  methods: {
    handleIncrement(amount) {
      this.total += amount
    }
  }
}
```

### CompositionAPI

```ts
import { ref } from 'vue'

const total = ref(0)

const handleIncrement = (amount) => {
  total.value += amount
}
```

「dataは `ref()` になり、methodsは普通の関数になる」という変更になります。

また個人的な見解ですが「 `ref()` vs `reactive()` 」の話は、基本的には `ref()` を使っていくのが良いと思います。
`ref()`の返り値がRefオブジェクトになることで、<script>内で `.value` 参照しなくてはいけないのが煩わしい、という意見もありますが、裏を返せば「Refオブジェクトと非リアクティブなオブジェクトを区別できる」ことが利点であるためです。


## プロパティとイベントの定義

### OptionsAPI

```js
export default {
  props: {
    total: {
      type: Number,
      required: true,
    },
    step: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    increment() {
      this.$emit('increment', this.step)
    },
  },
}
```

### CompositionAPI

```ts
import { defineProps, defineEmits, defineModel } from 'vue'

const { total, step = 1 } = defineProps<{
  total: number
  step?: number
}>()

const emit = defineEmits<{
  increment: [value: number]
}>()

const increment = () => {
  emit('increment', step)
}
```
CompositionAPI では、`defineProps`、`defineEmits` を使用してプロパティとイベントを定義できるようになりました。

- `defineProps` は、Vue3.5で [リアクティブな props の分割代入](https://ja.vuejs.org/guide/components/props#reactive-props-destructure)
- `defineEmits` は、Vue3.3で [名前付きタプル構文](https://ja.vuejs.org/api/sfc-script-setup#type-only-props-emit-declarations) 、

がそれぞれ書けるようになりました。

## ミックスインとコンポーザブル

### OptionsAPI - ミックスイン

```js
// mixin
export const AlertErrorMixin = {
  data() {
    return {
      latestError: '',
    }
  },
  methods: {
    alertError(error) {
      this.latestError = error
      if (error) {
        alert(error)
      }
    },
  },
}
```

```js
// 呼び出し側
export default {
  mixins: [AlertErrorMixin],
  // ...
}
```

### CompositionAPI - コンポーザブル

```ts
// Composable
import { ref } from 'vue'

export function useAlertError() {
  const latestError = ref('')

  function alertError(error: string) {
    latestError.value = error
    if (error) {
      alert(error)
    }
  }

  return { latestError, alertError }
}
```

```ts
// 呼び出し側
import { useAlertError } from './AlertError'

const { latestError, alertError } = useAlertError()
```

OptionsAPIでは「mixinはコンポーネントと同等の状態やメソッドを持っていて、呼び出し側コンポーネントにマージされる」だったのが、CompositionAPIだと「composableは、返り値を返す関数で、呼び出し側はその関数を呼ぶ」となりました。

（具体的な理由の説明が難しいので割愛するのですが...）これにより、ロジックの共通化において、取り回しが良くなりました。

なお、CompositionAPIのcomposableは、「メソッド名の先頭の `use` をつける」という取り決めになっています。

## テンプレート参照（Refs）によるメソッド呼び出し

### OptionsAPI

親コンポーネント

```html
<template>
  <CounterControl
    ref="counterControlRef2"
  >
    <button @click="resetCounterControlRef2ClickedCount">
      (from parent) Reset 2nd ClickedCount
    </button>
  </CounterControl>
</template>

<script>
  export default {
    methods: {
      resetCounterControlRef2ClickedCount() {
        this.$refs.counterControlRef2.resetClickedCount()
      },
    },
  }
</script>
```

子コンポーネント(CounterControl)

```html
<template>
  <slot />
</template>

<script>
  export default {
    data() {
      return {
        clickedCount: 0,
      }
    },
    methods: {
      resetClickedCount() {
        this.clickedCount = 0
      },
    },
  }
</script>
```

### CompositionAPI

親コンポーネント

```html
<script setup>
  import { useTemplateRef } from 'vue'

  const secondCounterControlRef = useTemplateRef('counterControlRef2')

  const resetCounterControlRef2ClickedCount = () => {
    secondCounterControlRef.value?.resetClickedCount()
  }
</script>

<template>
  <CounterControl
    ref="counterControlRef2"
  >
    <button @click="resetCounterControlRef2ClickedCount">
      (from parent) Reset 2nd ClickedCount
    </button>
  </CounterControl>
</template>
```

子コンポーネント(CounterControl)
```html
<script setup>
  const clickedCount = ref(0)

  const resetClickedCount = () => (clickedCount.value = 0)

  defineExpose({
    resetClickedCount,
  })
</script>

<template>
  <slot />
</template>
```

OptionsAPIでは、 `ref="xxx"` が記述されていたら `this.$refs.xxx` で任意のメソッドにアクセスできていたのが、CompositionAPIでは下記の記述が求められるようになりました。

- 親コンポーネント： `useTemplateRef('xxx')`
- 子コンポーネント： `defineExpose()`

これにより、親子間で露出されるメソッドや状態が、明示的になりました。

なお、Vue3.5より前では、 `useTemplateRef()` でなく、下記のように `ref()` を使っていたのが、最新ではその必要がなくなりました。

```js
// 要素の参照を保持する ref を宣言します。
// 名前は、テンプレートの ref の値に一致させる必要があります。
const input = ref(null)
```

## v-modelの定義

### OptionsAPI

親コンポーネント

```html
<template>
  <CounterControl v-model="firstMessage" />
</template>

<script>
export default {
  data() {
    return {
      firstMessage: '',
    }
  },
}
</script>
```

子コンポーネント（CounterControl）

```html
<template>
  <textarea :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
</template>

<script>
export default {
  props: {
    // （ちなみに、vue2時点では「value」だった）
    modelValue: {
      type: String,
      default: '',
    },
  },
}
</script>
```

### CompositionAPI

親コンポーネント

```html
<script setup>
const firstMessage = ref('')
</script>

<template>
  <CounterControl v-model:message="firstMessage" />
</template>
```

子コンポーネント（CounterControl）

```html
<script setup>
const message = defineModel<string>('message')
</script>

<template>
  <textarea v-model="message" />
</template>
```

CompositionAPI では、`defineModel` を使用することで、簡単に実装できるようになりました。
また `v-model:message` のように変数名を追加することで、複数の v-model を使用するが可能になりました。

# 参考URL
- https://ja.vuejs.org/