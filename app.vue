<template>
  <div @click="onUserActivity" @keydown="onUserActivity" @touchstart="onUserActivity">
    <OfflineBanner />
    <AppNotifications />
    <ConfirmDialog />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import ConfirmDialog from 'primevue/confirmdialog'

useHead({
  htmlAttrs: { lang: 'pt-BR' },
})

const appStore = useAppStore()
const authStore = useAuthStore()
const { isOnline } = useNetwork()

// ─── Dark mode (persisted in localStorage) ───────────────────────
const isDark = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('ag-theme')
  isDark.value = saved ? saved === 'dark' : false
  applyTheme(isDark.value)
})

function applyTheme(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add('app-dark')
  } else {
    document.documentElement.classList.remove('app-dark')
  }
}

function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
  localStorage.setItem('ag-theme', isDark.value ? 'dark' : 'light')
}

provide('toggleTheme', toggleTheme)
provide('isDark', isDark)

// ─── Session activity — refresh 2h expiry on any user interaction ─
let activityThrottle: ReturnType<typeof setTimeout> | null = null
function onUserActivity() {
  if (activityThrottle) return
  // Throttle to at most once every 5 minutes
  activityThrottle = setTimeout(() => {
    activityThrottle = null
  }, 5 * 60 * 1000)
  authStore.refreshSessionExpiry()
}

// ─── Sync on mount ───────────────────────────────────────────────
onMounted(async () => {
  await appStore.updateSyncCount()

  if (authStore.isLoggedIn) {
    // Background async Supabase session refresh (non-blocking for route guard)
    authStore.restoreSession().catch(() => {})

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
