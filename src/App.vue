<script setup lang="ts">
import { RouterView, useRouter, useRoute } from 'vue-router'

const router = useRouter()
const currentRoute = useRoute()

const goToVue3Counter = () => {
  router.push('/vue3')
}

const goToVue2Counter = () => {
  router.push('/vue2')
}
</script>

<template>
  <div class="app-container">
    <RouterView v-if="currentRoute.path !== '/'" />
    <div v-else class="button-container">
      <h1>Vue Counter Examples</h1>
      <div class="buttons">
        <button class="counter-button vue3" @click="goToVue3Counter">
          CompositionAPI(Vue3) Counter
        </button>
        <button class="counter-button vue2" @click="goToVue2Counter">
          OptionsAPI(Vue2) Counter
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-container {
  text-align: center;

  h1 {
    margin-bottom: 30px;
    color: #333;
  }

  .buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
  }
}

.counter-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }

  &.vue2 {
    background-color: #2196f3;

    &:hover {
      background-color: #0b7dda;
    }
  }
}
</style>
