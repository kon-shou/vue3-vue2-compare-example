<template>
  <div class="counter-app">
    <p v-if="latestError">Latest error: {{ latestError }}</p>

    <h1>Vue 2 Counter Example</h1>

    <h3>(from parent) firstMessage: {{ firstMessage }}</h3>
    <h3>(from parent) secondMessage: {{ secondMessage }}</h3>

    <CounterControl
      ref="counterControlRef1"
      v-model="firstMessage"
      :total="total"
      @increment="handleIncrement"
      @decrement="handleDecrement"
      @reset="resetCounter"
    >
      <template #header>
        <h2>1st Counter</h2>
      </template>

      <button @click="firstMessage = ''">(from parent) Reset 1st Message</button>
      <button @click="$refs.counterControlRef1.resetClickedCount()">
        (from parent) Reset 1st ClickedCount
      </button>
      <button @click="alertError(firstMessage)">(from parent) Alert 1st message</button>
      <template #footer="{ doubleClickedCount }">
        <p>(from parent) 1st doubleClickedCount: {{ doubleClickedCount }}</p>
      </template>
    </CounterControl>

    <CounterControl
      ref="counterControlRef2"
      v-model="secondMessage"
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
      <button @click="$refs.counterControlRef2.resetClickedCount()">
        (from parent) Reset 2nd ClickedCount
      </button>
      <button @click="alertError(secondMessage)">(from parent) Alert 2nd message</button>
    </CounterControl>

    <button @click="resetAll">(from parent) reset All</button>
  </div>
</template>

<script>
import CounterControl from './CounterControl.vue'
import { AlertErrorMixin } from './AlertError'

export default {
  components: {
    CounterControl
  },
  mixins: [AlertErrorMixin],
  data() {
    return {
      total: 0,
      firstMessage: '',
      secondMessage: ''
    }
  },
  methods: {
    handleIncrement(amount) {
      this.total += amount
    },
    handleDecrement(amount) {
      this.total -= amount
    },
    resetCounter() {
      this.total = 0
    },
    resetAll() {
      this.resetCounter()
      this.firstMessage = ''
      this.secondMessage = ''
      this.alertError('')
    },
  },
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
</script>

<style scoped lang="scss">
.counter-app {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;

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
