<template>
  <div class="ag-page-header">
    <div style="display:flex; align-items:center; gap:0.625rem; flex:1; min-width:0;">
      <!-- Back Button -->
      <button
        v-if="back"
        class="ag-page-header-back"
        :aria-label="`Voltar`"
        @click="goBack"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Title + Subtitle -->
      <div style="flex:1; min-width:0;">
        <h1 style="font-size:1.0625rem; font-weight:700; color:var(--ag-text); line-height:1.3; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
          {{ title }}
        </h1>
        <p v-if="subtitle" style="font-size:0.7rem; color:var(--ag-text-3); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
          {{ subtitle }}
        </p>
      </div>
    </div>

    <!-- Right slot (actions) -->
    <div style="display:flex; align-items:center; gap:0.5rem; flex-shrink:0;">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  subtitle?: string
  back?: string
}>()

const router = useRouter()

const goBack = () => {
  if (props.back) {
    router.push(props.back)
  } else {
    router.back()
  }
}
</script>
