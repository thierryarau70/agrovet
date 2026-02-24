<template>
  <Dialog
    v-model:visible="visible"
    :header="title"
    :modal="true"
    :dismissable-mask="true"
    :draggable="false"
    :style="{ width: '90vw', maxWidth: '480px' }"
    :pt="{
      root: { class: 'ag-dialog-root' },
      mask: { class: 'ag-dialog-mask' }
    }"
  >
    <slot />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog'

const props = defineProps<{ modelValue: boolean; title: string }>()
const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

<style>
.ag-dialog-mask {
  backdrop-filter: blur(4px) !important;
}
</style>
