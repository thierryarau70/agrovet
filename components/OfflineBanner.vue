<template>
  <div v-if="!isOnline" class="ag-offline-banner">
    📵 Sem conexão — dados salvos localmente
  </div>
</template>

<script setup lang="ts">
const { isOnline } = useNetwork()
</script>
