<template>
  <div class="ag-card" style="position:relative; overflow:hidden;">
    <!-- Glow accent -->
    <div style="position:absolute; top:-40px; right:-40px; width:120px; height:120px; background:color-mix(in srgb,var(--ag-primary) 10%,transparent); border-radius:9999px; filter:blur(40px); pointer-events:none;"></div>

    <h3 style="font-size:0.75rem; font-weight:700; color:var(--ag-primary); text-transform:uppercase; letter-spacing:.08em; margin:0 0 1.5rem; display:flex; align-items:center; gap:0.5rem;">
      <svg style="width:1rem;height:1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Cronograma Preditivo (A partir da 1ª IA)
    </h3>

    <div v-if="!baseDate" style="color:var(--ag-text-3); font-size:0.875rem; font-style:italic; text-align:center; padding:1rem 0;">
      Preencha a "Data 1ª IA" acima para gerar as previsões do rebanho.
    </div>

    <div v-else style="position:relative;">
      <!-- Progress bar base -->
      <div style="position:absolute; top:18px; left:18px; right:18px; height:3px; background:var(--ag-border); border-radius:4px;"></div>
      <!-- Progress bar fill -->
      <div :style="`position:absolute; top:18px; left:18px; height:3px; border-radius:4px; background:var(--ag-primary); transition:width 1s ease; width:calc((${progressPercentage}%) * (100% - 36px) / 100);`"></div>

      <!-- Steps -->
      <div style="display:flex; justify-content:space-between; position:relative;">
        <div
          v-for="(step, index) in steps"
          :key="index"
          style="display:flex; flex-direction:column; align-items:center; width:5.5rem; position:relative; z-index:1;"
          :style="step.isPast ? '' : 'opacity:0.55;'"
        >
          <!-- Circle -->
          <div
            :style="`width:2.25rem; height:2.25rem; border-radius:9999px; display:flex; align-items:center; justify-content:center; font-size:0.6875rem; font-weight:700; border:3px solid var(--ag-surface); color:#fff; background:${step.isToday ? 'var(--ag-primary)' : step.isPast ? 'var(--ag-primary)' : 'var(--ag-border-strong)'}; ${step.isToday ? 'box-shadow:0 0 10px color-mix(in srgb,var(--ag-primary) 50%,transparent);' : ''}`"
          >
            {{ step.dayLabel }}
          </div>
          <!-- Title -->
          <span style="margin-top:0.625rem; font-size:0.6rem; font-weight:700; text-align:center; text-transform:uppercase; letter-spacing:.04em; color:var(--ag-text-2); height:2rem; display:flex; align-items:center;">
            {{ step.title }}
          </span>
          <!-- Date -->
          <span :style="`font-size:0.7rem; margin-top:0.25rem; font-weight:600; color:${step.isToday ? 'var(--ag-primary)' : 'var(--ag-text-3)'};`">
            {{ formatDate(step.date) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ protocol: any }>()

const baseDate = computed(() =>
  props.protocol?.dataPrimeiraIa
    ? new Date(props.protocol.dataPrimeiraIa + 'T12:00:00')
    : null
)

const today = computed(() => {
  const t = new Date()
  t.setHours(0, 0, 0, 0)
  return t
})

const steps = computed(() => {
  if (!baseDate.value) return []
  const ia = baseDate.value
  const mk = (title: string, days: number, label: string) => {
    const d = new Date(ia.getTime() + days * 864e5)
    d.setHours(0, 0, 0, 0)
    return { title, date: d, dayLabel: label, isPast: d <= today.value, isToday: d.getTime() === today.value.getTime() }
  }
  return [
    mk('1ª IA', 0, 'IA'),
    mk('DG 35', 35, '+35'),
    mk('Secagem', 225, '+225'),
    mk('Parto', 285, '+285'),
  ]
})

const progressPercentage = computed(() => {
  if (!baseDate.value || steps.value.length === 0) return 0
  const first = steps.value[0]!
  const last = steps.value[steps.value.length - 1]!
  const total = last.date.getTime() - first.date.getTime()
  const passed = today.value.getTime() - first.date.getTime()
  if (passed < 0) return 0
  if (passed > total) return 100
  return (passed / total) * 100
})

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(date)
</script>
