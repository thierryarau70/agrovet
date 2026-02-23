<template>
  <div class="bg-gray-900 border-b border-gray-800 px-4 py-3 sticky top-0 z-30">
    <div class="max-w-2xl mx-auto flex items-center gap-3">
      <!-- Back Button -->
      <button
        v-if="back"
        class="shrink-0 p-2 rounded-xl bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-gray-400 hover:text-white transition-all duration-150"
        :aria-label="`Voltar para ${back}`"
        @click="goBack"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Title + Subtitle -->
      <div class="flex-1 min-w-0">
        <h1 class="text-lg font-bold text-white leading-tight truncate">{{ title }}</h1>
        <p v-if="subtitle" class="text-xs text-gray-500 truncate">{{ subtitle }}</p>
      </div>

      <!-- Right slot (actions) -->
      <div class="shrink-0 flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  subtitle?: string
  /** Route to navigate back to, e.g. '/iatf'. Falls back to router.back() if not provided. */
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
