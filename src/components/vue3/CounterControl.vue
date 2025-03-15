<script setup lang="ts">
import {
  computed,
  defineEmits,
  defineExpose,
  defineModel,
  defineProps,
  onMounted,
  ref,
  useSlots,
  useTemplateRef,
} from 'vue'

const footerRef = useTemplateRef('footer')

// this.$slots 見たいならこんな感じ
const slots = useSlots()
onMounted(() => {
  if (slots.footer && footerRef) {
    footerRef.value?.insertAdjacentText('afterbegin', 'Footer!')
  }
})

// 親からv-modelで呼びたいなら、defineModel()
// v-model:message の右側が指定されてたら、引数に'message'指定
const message = defineModel<string>('message')

// 分割代入して、default指定できる
const { total, step = 1 } = defineProps<{
  total: number
  step?: number
}>()
const emit = defineEmits<{
  increment: [value: number]
  decrement: [value: number]
  reset: []
}>()

const clickedCount = ref(0)
const doubleClickedCount = computed(() => clickedCount.value * 2)

const increment = () => {
  clickedCount.value++
  emit('increment', step)
}
const decrement = () => {
  clickedCount.value++
  emit('decrement', step)
}
const resetClickedCount = () => (clickedCount.value = 0)
const resetAll = () => {
  resetClickedCount()
  emit('reset')
}

// 親からuseTemplateRef()で呼びたいなら、defineExpose()忘れず
defineExpose({
  resetClickedCount,
  doubleClickedCount,
})
</script>

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
    <textarea v-model="message" />

    <div class="info">
      <slot />
    </div>

    <div v-if="$slots.footer" ref="footer" class="footer">
      <slot name="footer" :double-clicked-count="doubleClickedCount" />
    </div>
  </div>
</template>

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
