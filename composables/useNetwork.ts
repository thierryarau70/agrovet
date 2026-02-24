// composables/useNetwork.ts
// Composable global para monitorar o status de conexão
export const useNetwork = () => {
    const isOnline = ref(true)

    onMounted(() => {
        isOnline.value = navigator.onLine

        const handleOnline = () => {
            isOnline.value = true
        }
        const handleOffline = () => {
            isOnline.value = false
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        onUnmounted(() => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        })
    })

    return { isOnline }
}
