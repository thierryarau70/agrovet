<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />
        <!-- Panel -->
        <div class="relative w-full sm:max-w-lg bg-gray-900 rounded-t-2xl sm:rounded-2xl border border-gray-800 shadow-2xl max-h-[90vh] flex flex-col animate-slide-up">
          <!-- Header -->
          <div class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-800">
            <h2 class="text-lg font-semibold text-white">{{ title }}</h2>
            <button
              class="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              @click="$emit('update:modelValue', false)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <!-- Content -->
          <div class="overflow-y-auto flex-1 px-5 py-4">
            <slot />
          </div>
          <!-- Footer -->
          <div v-if="$slots.footer" class="px-5 pb-5 pt-3 border-t border-gray-800">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean; title: string }>()
defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
