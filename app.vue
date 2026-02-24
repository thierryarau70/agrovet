<template>
  <div>
    <OfflineBanner />
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
const { isOnline } = useNetwork()

// Dark mode state — persisted in localStorage
const isDark = ref(false)

onMounted(() => {
  // restore preference from localStorage
  const saved = localStorage.getItem('ag-theme')
  isDark.value = saved ? saved === 'dark' : false
  applyTheme(isDark.value)
})

function applyTheme(dark: boolean) {
  const html = document.documentElement
  if (dark) {
    html.classList.add('app-dark')
  } else {
    html.classList.remove('app-dark')
  }
}

function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
  localStorage.setItem('ag-theme', isDark.value ? 'dark' : 'light')
}

// Expose globally so any component can call it
provide('toggleTheme', toggleTheme)
provide('isDark', isDark)

// Sync + update count on app start
onMounted(async () => {
  await appStore.updateSyncCount()

  if (authStore.isLoggedIn) {
    const { useSync } = await import('~/composables/useSync')
    const { pullFromServer, syncToServer } = useSync()
    pullFromServer()
    if (isOnline.value) syncToServer()
  }
})

watch(isOnline, async (online) => {
  appStore.setOnline(online)
  if (online && authStore.isLoggedIn) {
    appStore.notify('✅ Conexão restaurada! Sincronizando...', 'success')
    const { useSync } = await import('~/composables/useSync')
    const { syncToServer } = useSync()
    await syncToServer()
    await appStore.updateSyncCount()
  } else if (!online) {
    appStore.notify('⚠️ Sem conexão. Dados sendo salvos localmente.', 'warning')
  }
})
</script>
