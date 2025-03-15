<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import CounterControl from './CounterControl.vue'
import { useAlertError } from './AlertError'

// mixinは、こんな感じにuseXxx()の関数呼び出しに
const { latestError, alertError } = useAlertError()

// ref() vs reactive() は、特別な理由がないならref()
const total = ref(0)
const firstMessage = ref('')
const secondMessage = ref('')

// 'this.$refs.xxx'したいなら、useTemplateRef()
const firstCounterControlRef = useTemplateRef('counterControlRef1')
const secondCounterControlRef = useTemplateRef('counterControlRef2')

const handleIncrement = (amount: number) => {
  total.value += amount
}
const handleDecrement = (amount: number) => {
  total.value -= amount
}
const resetCounter = () => {
  total.value = 0
}
const resetAll = () => {
  resetCounter()
  firstMessage.value = ''
  secondMessage.value = ''
  alertError('')
}

// ライフサイクルフック。createdは消えたけど、多分そのうちトップレベルawaitでやれば良くなる。
// （今もSuspenseで可能かも？）
onMounted(() => {
  console.log('CounterApp component mounted')
  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      handleIncrement(1)
    } else if (event.key === 'ArrowLeft') {
      handleDecrement(1)
    }
  })
})
</script>

<template>
  <div class="counter-app">
    <div class="navigation-links">
      <router-link to="/vue2" class="nav-link">Go to Vue2</router-link>
    </div>

    <p v-if="latestError">Latest error: {{ latestError }}</p>

    <h1>Vue 3 Counter Example</h1>

    <h3>(from parent) firstMessage: {{ firstMessage }}</h3>
    <h3>(from parent) secondMessage: {{ secondMessage }}</h3>

    <CounterControl
      ref="counterControlRef1"
      v-model:message="firstMessage"
      :total="total"
      @increment="handleIncrement"
      @decrement="handleDecrement"
      @reset="resetCounter"
    >
      <template #header>
        <h2>1st Counter</h2>
      </template>

      <button @click="firstMessage = ''">(from parent) Reset 1st Message</button>
      <button @click="firstCounterControlRef?.resetClickedCount()">
        (from parent) Reset 1st ClickedCount
      </button>
      <button @click="alertError(firstMessage)">(from parent) Alert 1st message</button>
      <template #footer="{ doubleClickedCount }">
        <p>(from parent) 1st doubleClickedCount: {{ doubleClickedCount }}</p>
      </template>
    </CounterControl>

    <CounterControl
      ref="counterControlRef2"
      v-model:message="secondMessage"
      :total="total"
      :step="2"
      @increment="handleIncrement"
      @decrement="handleDecrement"
      @reset="resetCounter"
    >
      <template #header>
        <h2>2nd Counter</h2>
      </template>

      <button @click="secondMessage = ''">(from parent) Reset 2nd Message</button>
      <button @click="secondCounterControlRef?.resetClickedCount()">
        (from parent) Reset 2nd ClickedCount
      </button>
      <button @click="alertError(secondMessage)">(from parent) Alert 2nd message</button>
    </CounterControl>

    <button @click="resetAll">(from parent) reset All</button>
  </div>
</template>

<style scoped lang="scss">
.counter-app {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;

  .navigation-links {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    gap: 20px;
    
    .nav-link {
      color: #2196F3;
      text-decoration: none;
      font-weight: bold;
      
      &:hover {
        text-decoration: underline;
      }
    }
    
    .current-page {
      color: #333;
      font-weight: bold;
    }
  }

  h1 {
    color: #333;
    text-align: center;
  }

  .step-control {
    margin: 20px 0;
    display: flex;
    align-items: center;
    gap: 10px;

    input {
      padding: 5px;
      width: 60px;
    }
  }

  button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #45a049;
    }
  }
}
</style>
