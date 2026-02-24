<template>
  <Teleport to="body">
    <Transition name="confirm-fade">
      <div v-if="modelValue" class="confirm-overlay" @mousedown.self="onCancel">

        <Transition name="confirm-scale">
          <div v-if="modelValue" class="confirm-panel" role="dialog" :aria-label="title">

            <!-- Header -->
            <div class="confirm-header">
              <!-- Icon -->
              <div class="confirm-icon" :class="`confirm-icon--${type}`">
                <!-- Danger: trash -->
                <svg v-if="type === 'danger'" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <!-- Warning: logout/exit -->
                <svg v-else-if="type === 'warning'" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <!-- Success: checkmark -->
                <svg v-else width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="confirm-title">{{ title }}</span>
            </div>

            <!-- Body -->
            <p class="confirm-message">{{ message }}</p>

            <!-- Footer -->
            <div class="confirm-footer">
              <button class="confirm-btn confirm-btn--cancel" @click="onCancel">Cancelar</button>
              <button class="confirm-btn" :class="`confirm-btn--${type}`" @click="onConfirm">
                {{ confirmLabel }}
              </button>
            </div>
          </div>
        </Transition>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: boolean
  title: string
  message: string
  type?: 'danger' | 'warning' | 'success'
  confirmLabel?: string
}>(), {
  type: 'success',
  confirmLabel: 'Confirmar',
})

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  'confirm': []
  'cancel': []
}>()

function onConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}

function onCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}

</script>

<style scoped>
/* Overlay */
.confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* Panel */
.confirm-panel {
  background: var(--ag-surface);
  border: 1px solid var(--ag-border);
  border-radius: 1rem;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35), 0 4px 16px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 380px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Header */
.confirm-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.confirm-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.confirm-icon--danger  { background: rgba(220, 38, 38, 0.12); color: #dc2626; }
.confirm-icon--warning { background: rgba(217, 119, 6, 0.12); color: #d97706; }
.confirm-icon--success { background: rgba(22, 163, 74, 0.12); color: #16a34a; }

.confirm-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--ag-text);
  line-height: 1.3;
}

/* Message */
.confirm-message {
  font-size: 0.875rem;
  color: var(--ag-text-2);
  line-height: 1.65;
  margin: 0;
}

/* Footer */
.confirm-footer {
  display: flex;
  gap: 0.625rem;
  justify-content: flex-end;
  margin-top: 0.25rem;
}
.confirm-btn {
  padding: 0.5rem 1.125rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease;
  min-width: 80px;
}
.confirm-btn--cancel {
  background: var(--ag-bg-2);
  border: 1px solid var(--ag-border);
  color: var(--ag-text-2);
}
.confirm-btn--cancel:hover { border-color: var(--ag-border-strong); color: var(--ag-text); }

.confirm-btn--danger  { background: #dc2626; color: #fff; }
.confirm-btn--danger:hover  { background: #b91c1c; }
.confirm-btn--warning { background: #d97706; color: #fff; }
.confirm-btn--warning:hover { background: #b45309; }
.confirm-btn--success { background: #16a34a; color: #fff; }
.confirm-btn--success:hover { background: #15803d; }

/* Overlay transition */
.confirm-fade-enter-active, .confirm-fade-leave-active { transition: opacity 0.2s ease; }
.confirm-fade-enter-from, .confirm-fade-leave-to { opacity: 0; }

/* Panel transition */
.confirm-scale-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.confirm-scale-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.confirm-scale-enter-from { opacity: 0; transform: scale(0.92) translateY(-8px); }
.confirm-scale-leave-to  { opacity: 0; transform: scale(0.96) translateY(4px); }
</style>
