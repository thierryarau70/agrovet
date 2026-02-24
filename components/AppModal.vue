<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="app-modal-overlay" @mousedown.self="$emit('update:modelValue', false)">
        <Transition name="modal-scale">
          <div v-if="modelValue" class="app-modal-panel">
            <!-- Header -->
            <div class="app-modal-header">
              <h2 class="app-modal-title">{{ title }}</h2>
              <button class="app-modal-close" @click="$emit('update:modelValue', false)" aria-label="Fechar">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div class="app-modal-body">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="app-modal-footer">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean; title: string }>()
defineEmits(['update:modelValue'])
</script>

<style scoped>
.app-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
}

@media (min-width: 480px) {
  .app-modal-overlay {
    align-items: center;
    padding: 1rem;
  }
}

.app-modal-panel {
  position: relative;
  width: 100%;
  max-width: 480px;
  max-height: 90dvh;
  background: var(--ag-surface);
  border: 1px solid var(--ag-border);
  border-radius: 1.25rem 1.25rem 0 0;
  box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@media (min-width: 480px) {
  .app-modal-panel {
    border-radius: 1.25rem;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
  }
}

.app-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 1.25rem;
  border-bottom: 1px solid var(--ag-border);
  flex-shrink: 0;
}

.app-modal-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--ag-text);
  margin: 0;
}

.app-modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 0.5rem;
  border: 1px solid var(--ag-border);
  background: var(--ag-bg-2);
  color: var(--ag-text-3);
  cursor: pointer;
  transition: all 0.15s;
}
.app-modal-close:hover {
  background: var(--ag-border);
  color: var(--ag-text);
}

.app-modal-body {
  overflow-y: auto;
  padding: 1.25rem;
  flex: 1;
}

.app-modal-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--ag-border);
  flex-shrink: 0;
}

/* Overlay transition */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* Panel slide-up on mobile, scale on desktop */
.modal-scale-enter-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.modal-scale-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.modal-scale-enter-from { opacity: 0; transform: translateY(24px); }
.modal-scale-leave-to   { opacity: 0; transform: translateY(16px); }
</style>
