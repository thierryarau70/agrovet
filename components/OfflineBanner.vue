<template>
  <Transition name="slide-down">
    <div
      v-if="!isOnline"
      class="fixed top-0 left-0 right-0 z-50 bg-amber-600 text-white text-sm font-medium px-4 py-2 flex items-center justify-center gap-2 shadow-lg"
    >
      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M18.364 5.636a9 9 0 010 12.728M15.536 8.464a5 5 0 010 7.072M12 12h.01M8.464 15.536a5 5 0 010-7.072M5.636 18.364a9 9 0 010-12.728" />
      </svg>
      <span>Modo offline — dados salvos localmente</span>
      <span v-if="syncPending > 0" class="bg-amber-800/60 rounded-full px-2 py-0.5 text-xs">
        {{ syncPending }} pendente(s)
      </span>
    </div>
  </Transition>
  <div v-if="!isOnline" class="h-9" />
</template>

<script setup lang="ts">
const appStore = useAppStore()
const { isOnline } = useNetwork()
const syncPending = computed(() => appStore.syncPending)
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
