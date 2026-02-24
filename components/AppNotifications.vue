<template>
  <div class="ag-toast">
    <TransitionGroup name="notif">
      <div
        v-for="n in notifications"
        :key="n.id"
        class="ag-toast-item"
        :class="n.type"
        @click="appStore.dismissNotification(n.id)"
      >
        <span class="shrink-0" style="font-size:1rem;">
          {{ n.type === 'success' ? '✓' : n.type === 'error' ? '✕' : n.type === 'warning' ? '⚠' : 'ℹ' }}
        </span>
        <span>{{ n.message }}</span>
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
.notif-enter-from { opacity: 0; transform: translateX(2rem); }
.notif-leave-to   { opacity: 0; transform: translateX(2rem); }
</style>
