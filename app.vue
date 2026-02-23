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

onMounted(async () => {
  await appStore.updateSyncCount()
})
</script>
