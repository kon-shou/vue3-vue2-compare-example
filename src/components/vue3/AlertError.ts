import { ref } from 'vue'

// composableは先頭に「use」つける
export function useAlertError() {
  const latestError = ref('')
  const alertError = (error: string) => {
    latestError.value = error
    if (error !== '') {
      window.alert(error)
    }
  }
  return {
    latestError,
    alertError,
  }
}
