# Vue 2 の Options API と Vue 3.5 の Composition API の比較

このドキュメントでは、Vue 2 の Options API と Vue 3.5 の Composition API の主な違いを、実際のコード例を用いて解説します。

## 1. コンポーネントの基本構造

### Options API (Vue 2)

Options API では、コンポーネントはオブジェクトとして定義され、`data`、`methods`、`computed`、`watch` などの特定のオプションに機能を分類します。

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

### Composition API (Vue 3.5)

Composition API では、`<script setup>` 構文を使用し、関数やコンポーザブルを使って機能を整理します。
どこかで「ref() vs reactive()」を見たかもしれないですが、基本的には、ref()を推奨します

```js
<script setup>
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
</script>
```

## 2. データ管理の違い

### Options API (Vue 2)

```js
// CounterApp.vue
export default {
  data() {
    return {
      total: 0,
      firstMessage: '',
      secondMessage: ''
    }
  }
}
```

データにアクセスする際は `this` を使用します：

```js
methods: {
  handleIncrement(amount) {
    this.total += amount
  }
}
```

### Composition API (Vue 3.5)

```js
// CounterApp.vue
import { ref } from 'vue'

const total = ref(0)
const firstMessage = ref('')
const secondMessage = ref('')

const handleIncrement = (amount) => {
  total.value += amount
}
```

`ref()` で作成したリアクティブな値にアクセスする際は `.value` プロパティを使用します。ただし、テンプレート内では自動的に展開されるため `.value` は不要です。

## 3. ライフサイクルフックの違い

### Options API (Vue 2)

```js
export default {
  mounted() {
    console.log('CounterApp component mounted')
    window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        this.handleIncrement(1)
      } else if (event.key === 'ArrowLeft') {
        this.handleDecrement(1)
      }
    })
  }
}
```

### Composition API (Vue 3.5)

```js
import { onMounted } from 'vue'

onMounted(() => {
  console.log('CounterApp component mounted')
  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      handleIncrement(1)
    } else if (event.key === 'ArrowLeft') {
      handleDecrement(1)
    }
  })
})
```

Vue 3.5 では、各ライフサイクルフックは個別の関数としてインポートされ、コンポーネントのセットアップ中に呼び出されます。
おそらく `async created()` は、現時点では、そのまま Vue 3.5 で書くのは難しいので、別のライフサイクルを検討してくだい（要調査）

## 4. プロパティとイベントの定義

### Options API (Vue 2)

```js
// CounterControl.vue
export default {
  name: 'CounterControl',
  props: {
    total: {
      type: Number,
      required: true,
    },
    step: {
      type: Number,
      default: 1,
    },
    modelValue: {
      type: String,
      default: '',
    },
  },
  methods: {
    increment() {
      this.clickedCount++
      this.$emit('increment', this.step)
    }
  }
}
```

### Composition API (Vue 3.5)

```js
// CounterControl.vue
import { defineProps, defineEmits, defineModel } from 'vue'

// v-modelのための値
const message = defineModel('message')

// プロパティの定義（TypeScriptの型を活用）
const { total, step = 1 } = defineProps<{
  total: number
  step?: number
}>()

// イベントの定義（TypeScriptの型を活用）
const emit = defineEmits<{
  increment: [value: number]
  decrement: [value: number]
  reset: []
}>()

const increment = () => {
  clickedCount.value++
  emit('increment', step)
}
```

Vue 3.5 では、`defineProps`、`defineEmits`、`defineModel` などのコンパイラマクロを使用してプロパティとイベントを定義します。TypeScriptと組み合わせることで、型安全性が向上します。
特に `defineProps` は、Vue 3.5 で [リアクティブな props の分割代入](https://ja.vuejs.org/guide/components/props#reactive-props-destructure) が導入されて、書き心地が良くなりました。

## 5. 算出プロパティ（Computed Properties）

### Options API (Vue 2)

```js
export default {
  computed: {
    doubleClickedCount() {
      return this.clickedCount * 2
    }
  }
}
```

### Composition API (Vue 3.5)

```js
import { computed } from 'vue'

const doubleClickedCount = computed(() => clickedCount.value * 2)
```

## 6. ミックスインとコンポーザブル

### Options API (Vue 2) - ミックスイン

```js
// AlertError.js
export const AlertErrorMixin = {
  data() {
    return {
      latestError: ''
    }
  },
  methods: {
    alertError(error) {
      this.latestError = error
      if (error) {
        alert(error)
      }
    }
  }
}

// 使用側
export default {
  mixins: [AlertErrorMixin],
  // ...
}
```

### Composition API (Vue 3.5) - コンポーザブル

```js
// AlertError.ts
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

// 使用側
import { useAlertError } from './AlertError'

const { latestError, alertError } = useAlertError()
```

コンポーザブルは、ミックスインよりも明示的で再利用しやすいアプローチを提供します。名前空間の衝突を避け、使用する機能を明確に選択できます。

## 7. テンプレート参照（Refs）

### Options API (Vue 2)

```html
<template>
  <div ref="footer" class="footer">...</div>
</template>

<script>
export default {
  mounted() {
    if (this.$slots.footer && this.$refs.footer) {
      this.$refs.footer.insertAdjacentText('afterbegin', 'Footer!')
    }
  }
}
</script>
```

### Composition API (Vue 3.5)

```html
<template>
  <div ref="footer" class="footer">...</div>
</template>

<script setup>
import { useTemplateRef } from 'vue'

const footerRef = useTemplateRef('footer')

onMounted(() => {
  if (slots.footer && footerRef.value) {
    footerRef.value.insertAdjacentText('afterbegin', 'Footer!')
  }
})
</script>
```

## 8. 子コンポーネントのメソッド呼び出し

### Options API (Vue 2)

```html
<template>
  <button @click="$refs.counterControlRef1.resetClickedCount()">
    Reset ClickedCount
  </button>
</template>

<script>
export default {
  methods: {
    resetFirstClickedCount() {
      this.$refs.counterControlRef1.resetClickedCount()
    }
  }
}
</script>
```

### Composition API (Vue 3.5)

```html
<template>
  <button @click="firstCounterControlRef?.resetClickedCount()">
    Reset ClickedCount
  </button>
</template>

<script setup>
import { useTemplateRef } from 'vue'

const firstCounterControlRef = useTemplateRef('counterControlRef1')

// 子コンポーネント側では、メソッドを公開するために defineExpose() が必要
defineExpose({
  resetClickedCount,
  doubleClickedCount
})
</script>
```

## 9. v-model の違い

### Options API (Vue 2)

```html
<!-- 親コンポーネント -->
<CounterControl v-model="firstMessage" />

<!-- 子コンポーネント -->
<template>
  <textarea :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  }
}
</script>
```

### Composition API (Vue 3.5)

```html
<!-- 親コンポーネント -->
<CounterControl v-model:message="firstMessage" />

<!-- 子コンポーネント -->
<template>
  <textarea v-model="message" />
</template>

<script setup>
import { defineModel } from 'vue'

// 'message'という名前でモデルを定義
const message = defineModel('message')
</script>
```

Vue 3.5 では、`defineModel` マクロを使用して双方向バインディングを簡単に実装できます。また、複数の v-model を使用する場合も名前を指定できます。

## 10. TypeScript サポート

### Options API (Vue 2)

TypeScript との統合は複雑で、多くの場合、型の恩恵を十分に受けられません。

```js
export default {
  data() {
    return {
      total: 0 // 型情報が明示的でない
    }
  },
  methods: {
    handleIncrement(amount) { // パラメータの型が不明確
      this.total += amount
    }
  }
}
```

### Composition API (Vue 3.5)

TypeScript との統合が自然で、型の恩恵を最大限に活用できます。

```ts
import { ref } from 'vue'

const total = ref<number>(0) // 明示的な型
const firstMessage = ref<string>('')

const handleIncrement = (amount: number) => { // パラメータに型アノテーション
  total.value += amount
}

// defineProps と defineEmits でも型を活用
const props = defineProps<{
  total: number
  step?: number // オプショナルなプロパティ
}>()
```

## まとめ

Vue 3.5 の Composition API は、以下の点で Vue 2 の Options API と比較して優れています：

1. **関連する機能をまとめられる**: Options API では機能ごとに分散していたコードを、Composition API では論理的にグループ化できます。
2. **再利用性の向上**: コンポーザブル関数を使用することで、コードの再利用が容易になります。
3. **TypeScript との統合**: 型安全性が向上し、開発体験が向上します。
4. **より明示的なコード**: 依存関係が明確になり、コードの理解が容易になります。
5. **テスト容易性**: 個々の関数をより簡単に分離してテストできます。

ただし、小規模なコンポーネントや、Vue 2 に慣れている開発者にとっては、Options API の方が直感的に感じられる場合もあります。Vue 3.5 は両方の API スタイルをサポートしているため、プロジェクトやチームのニーズに合わせて選択できます。
