// composables/useNetwork.ts
import { ref } from 'vue'

const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)
let listenersAdded = false

export const useNetwork = () => {
    if (import.meta.client && !listenersAdded) {
        listenersAdded = true
        window.addEventListener('online', () => { isOnline.value = true })
        window.addEventListener('offline', () => { isOnline.value = false })
    }

    return { isOnline }
}
