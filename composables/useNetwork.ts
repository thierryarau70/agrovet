// composables/useNetwork.ts
export const useNetwork = () => {
    const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)

    if (import.meta.client) {
        useEventListener(window, 'online', () => { isOnline.value = true })
        useEventListener(window, 'offline', () => { isOnline.value = false })
    }

    return { isOnline }
}
