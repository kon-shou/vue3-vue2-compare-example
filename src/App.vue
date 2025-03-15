<script setup lang="ts">
import { RouterView, useRouter, useRoute } from 'vue-router'

const router = useRouter()
const currentRoute = useRoute()

const goToCounter = () => {
  router.push('/vue3')
}
</script>

<template>
  <div class="app-container">
    <RouterView v-if="currentRoute.path !== '/'" />
    <div v-else class="button-container">
      <button class="counter-button" @click="goToCounter">
        Vue 3 Counter
      </button>
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
}
</style>
