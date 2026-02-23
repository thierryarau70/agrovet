<template>
  <div class="font-sans bg-gray-950 min-h-screen">
    <!-- Offline Banner -->
    <OfflineBanner />

    <!-- Toast Notifications -->
    <AppNotifications />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'pt-BR' },
})

const appStore = useAppStore()
const authStore = useAuthStore()

onMounted(async () => {
  await appStore.updateSyncCount()
  
  // Pull data from server once when app opens, if logged in
  if (authStore.isLoggedIn) {
    const { useSync } = await import('~/composables/useSync')
    const { pullFromServer } = useSync()
    pullFromServer()
  }
})
</script>
