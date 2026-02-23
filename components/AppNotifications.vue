<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
    <TransitionGroup name="notif">
      <div
        v-for="n in notifications"
        :key="n.id"
        :class="[
          'flex items-start gap-3 p-3 rounded-xl shadow-xl border text-sm font-medium cursor-pointer',
          n.type === 'success' ? 'bg-green-900/90 border-green-700 text-green-100' :
          n.type === 'error'   ? 'bg-red-900/90 border-red-700 text-red-100' :
          n.type === 'warning' ? 'bg-amber-900/90 border-amber-700 text-amber-100' :
                                 'bg-gray-800/90 border-gray-700 text-gray-100',
        ]"
        @click="appStore.dismissNotification(n.id)"
      >
        <span class="text-base shrink-0">
          {{ n.type === 'success' ? '✓' : n.type === 'error' ? '✕' : n.type === 'warning' ? '⚠' : 'ℹ' }}
        </span>
        <span class="flex-1">{{ n.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const appStore = useAppStore()
const notifications = computed(() => appStore.notifications)
</script>

<style scoped>
.notif-enter-active { transition: all 0.3s ease; }
.notif-leave-active { transition: all 0.2s ease; }
.notif-enter-from { opacity: 0; transform: translateX(100%); }
.notif-leave-to   { opacity: 0; transform: translateX(100%); }
</style>
