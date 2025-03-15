import { createRouter, createWebHistory } from 'vue-router'
import CounterApp from '../components/vue3/CounterApp.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../components/TheWelcome.vue')
    },
    {
      path: '/vue3',
      name: 'vue3',
      component: CounterApp
    }
  ]
})

export default router
