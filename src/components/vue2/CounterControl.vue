<template>
  <div class="counter-control">
    <slot name="header" />

    <h3>(from child) total: {{ total }}</h3>
    <h3>(from child) clicked: {{ clickedCount }}</h3>

    <div class="controls">
      <button @click="decrement">(from child) -{{ step }}</button>
      <button @click="increment">(from child) +{{ step }}</button>
      <button class="reset-btn" @click="resetAll">(from child) reset total / clicked</button>
    </div>

    <h3>(from child) message</h3>
    <!-- vue3で、value=>modelValue,@input->update:modelValue の変更があった -->
    <!-- compatでは互換性あり -->
    <textarea :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />

    <div class="info">
      <slot />
    </div>

    <div v-if="$slots.footer" ref="footer" class="footer">
      <slot name="footer" :double-clicked-count="doubleClickedCount" />
    </div>
  </div>
</template>

<script>
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
  data() {
    return {
      clickedCount: 0,
      message: this.value,
    }
  },
  computed: {
    doubleClickedCount() {
      return this.clickedCount * 2
    },
  },
  methods: {
    increment() {
      this.clickedCount++
      this.$emit('increment', this.step)
    },
    decrement() {
      this.clickedCount++
      this.$emit('decrement', this.step)
    },
    resetClickedCount() {
      this.clickedCount = 0
    },
    resetAll() {
      this.resetClickedCount()
      this.$emit('reset')
    },
  },
  mounted() {
    if (this.$slots.footer && this.$refs.footer) {
      this.$refs.footer.insertAdjacentText('afterbegin', 'Footer!')
    }
  },
}
</script>

<style scoped lang="scss">
.counter-control {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;

  .counter-display-wrapper {
    margin: 20px 0;
  }

  .controls {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 15px;

    button {
      background-color: #4caf50;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;

      &:hover {
        background-color: #45a049;
      }

      &.reset-btn {
        background-color: #f44336;

        &:hover {
          background-color: #d32f2f;
        }
      }
    }
  }

  .info {
    margin: 15px 0;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 4px;
  }

  .footer {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
    font-style: italic;
  }
}
</style>
