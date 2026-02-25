<template>
  <div style="padding-bottom:6rem;">
    <PageHeader title="Calendário de Eventos" subtitle="Planejamento reprodutivo" back="/">
      <template #actions>
        <ThemeToggle />
      </template>
    </PageHeader>

    <div class="page-container">
      <div class="ag-card" style="padding:0; overflow:hidden;">
        <!-- Calendar Header Controls -->
        <div style="display:flex; align-items:center; justify-content:space-between; padding:1rem; border-bottom:1px solid var(--ag-border); background:var(--ag-surface);">
          <button class="ag-cal-btn" @click="prevMonth">
            <svg style="width:1.25rem;height:1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div style="text-align:center;">
            <p style="font-size:1.125rem; font-weight:700; color:var(--ag-text); margin:0; text-transform:capitalize;">{{ monthName }}</p>
            <p style="font-size:0.75rem; color:var(--ag-text-3); margin:0;">{{ currentYear }}</p>
          </div>
          <button class="ag-cal-btn" @click="nextMonth">
            <svg style="width:1.25rem;height:1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        <!-- Calendar Grid -->
        <div class="ag-cal-grid-header">
          <div v-for="d in daysOfWeek" :key="d" class="ag-cal-dow">{{ d }}</div>
        </div>
        <div class="ag-cal-grid">
          <div
            v-for="(day, idx) in calendarDays" :key="idx"
            class="ag-cal-day"
            :class="{
              'is-empty': !day.date,
              'is-today': isToday(day.date),
              'has-events': day.events.length > 0
            }"
            @click="day.events.length > 0 ? openDayModal(day) : null"
          >
            <span v-if="day.date" class="ag-cal-date-num">{{ day.date.getDate() }}</span>
            <div v-if="day.events.length > 0" class="ag-cal-indicators">
              <span v-for="(ev, i) in day.events.slice(0, 3)" :key="i" class="ag-cal-dot" :style="{background: ev.color}"></span>
              <span v-if="day.events.length > 3" class="ag-cal-dot-more">+</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Day Events Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="selectedDay" class="ag-cal-modal-overlay" @click.self="selectedDay = null">
          <div class="ag-cal-modal-content">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--ag-border); padding:1rem 1.25rem;">
              <h3 style="font-size:1.125rem; font-weight:700; color:var(--ag-text); margin:0;">
                {{ selectedDay.date?.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) }}
              </h3>
              <button @click="selectedDay = null" style="background:none; border:none; color:var(--ag-text-3); cursor:pointer;">
                <svg style="width:1.5rem;height:1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div style="max-height:60vh; overflow-y:auto; padding:1.25rem; display:flex; flex-direction:column; gap:0.75rem;">
              <div
                v-for="(ev, idx) in selectedDay.events" :key="idx"
                class="ag-card"
                style="display:flex; align-items:center; gap:0.75rem; border-left:4px solid; padding:0.75rem;"
                :style="{ borderLeftColor: ev.color }"
                @click="goToEvent(ev)"
              >
                <div style="flex:1;">
                  <p style="font-size:0.875rem; font-weight:700; color:var(--ag-text); margin:0 0 0.15rem;">{{ ev.title }}</p>
                  <p style="font-size:0.75rem; color:var(--ag-text-2); margin:0;">{{ ev.description }}</p>
                </div>
                <svg style="width:1rem;height:1rem;color:var(--ag-text-3);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { db } from '~/plugins/dexie.client'

definePageMeta({ layout: 'default' })

const router = useRouter()
const currentDate = ref(new Date())
const events = ref<any[]>([])
const selectedDay = ref<any>(null)

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())
const monthName = computed(() => currentDate.value.toLocaleString('pt-BR', { month: 'long' }))

const calendarDays = computed(() => {
  const d = new Date(currentYear.value, currentMonth.value, 1)
  const days: any[] = []
  
  // Fill empty days before 1st of month
  const firstDayIndex = d.getDay()
  for (let i = 0; i < firstDayIndex; i++) {
    days.push({ date: null, events: [] })
  }
  
  // Fill actual days
  while (d.getMonth() === currentMonth.value) {
    const dCopy = new Date(d)
    const dayEvents = events.value.filter(e => {
      return e.date.getDate() === dCopy.getDate() &&
             e.date.getMonth() === dCopy.getMonth() &&
             e.date.getFullYear() === dCopy.getFullYear()
    })
    
    // Sort events by priority/type
    dayEvents.sort((a,b) => a.title.localeCompare(b.title))
    
    days.push({ date: dCopy, events: dayEvents })
    d.setDate(d.getDate() + 1)
  }
  
  // Fill remaining days to complete grid (42 cells max for 6 rows)
  const remaining = (7 - (days.length % 7)) % 7
  for (let i = 0; i < remaining; i++) {
    days.push({ date: null, events: [] })
  }
  
  return days
})

const isToday = (d: Date | null) => {
  if (!d) return false
  const today = new Date()
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear()
}

const prevMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

const openDayModal = (day: any) => {
  selectedDay.value = day
}

const goToEvent = (ev: any) => {
  selectedDay.value = null
  router.push(ev.route)
}

const loadEvents = async () => {
  const allIatf = await db.iatfRecords.toArray()
  const evs: any[] = []
  
  const addEvent = (dateStr: string, title: string, color: string, iatf: any, extraDesc: string = '') => {
    if (!dateStr) return
    const [y, m, d] = dateStr.split('T')[0].split('-')
    if (!y || !m || !d) return
    const date = new Date(Number(y), Number(m)-1, Number(d))
    evs.push({
      date,
      title,
      description: `${iatf.propriedade} • Lote: ${iatf.lote} ${extraDesc ? '• ' + extraDesc : ''}`,
      color,
      route: `/iatf/detalhes/${iatf.id}`
    })
  }
  
  allIatf.forEach(iatf => {
    // Protocol base dates if filled
    if (iatf.dataImplante) addEvent(iatf.dataImplante, 'D-0 (Implante)', '#3b82f6', iatf)
    if (iatf.dataRetirada) addEvent(iatf.dataRetirada, 'D-8 (Retirada)', '#6366f1', iatf)
    if (iatf.dataPrimeiraIa) addEvent(iatf.dataPrimeiraIa, 'IA (Inseminação)', '#8b5cf6', iatf)
    
    // Predicted events based on IA
    if (iatf.dataPrimeiraIa) {
      const baseDate = new Date(iatf.dataPrimeiraIa + 'T12:00:00')
      
      const partoDate = new Date(baseDate)
      partoDate.setDate(partoDate.getDate() + 285)
      addEvent(partoDate.toISOString(), 'Parto (Previsto)', '#dc2626', iatf)
      
      const secagemDate = new Date(baseDate)
      secagemDate.setDate(secagemDate.getDate() + 225)
      addEvent(secagemDate.toISOString(), 'Secagem/Vacina', '#f59e0b', iatf)
    }
    
    // Animal specific DG dates
    if (iatf.animais && iatf.animais.length > 0) {
      const d0Dates = new Set<string>()
      const dg35Dates = new Set<string>()
      
      iatf.animais.forEach((a: any) => {
        if (a.d0dg) d0Dates.add(a.d0dg)
        if (a.dg35) dg35Dates.add(a.dg35)
      })
      
      d0Dates.forEach(d => addEvent(d, 'Avaliação D-0+DG', '#14b8a6', iatf, 'Diagnóstico precoce'))
      dg35Dates.forEach(d => addEvent(d, 'DG 35 Dias', '#10b981', iatf, 'Confirmação'))
    }
  })
  
  events.value = evs
}

onMounted(loadEvents)
</script>

<style scoped>
.ag-cal-btn {
  background: var(--ag-bg-2);
  border: 1px solid var(--ag-border);
  color: var(--ag-text-2);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.ag-cal-btn:hover { background: var(--ag-border); }

.ag-cal-grid-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: var(--ag-bg-2);
  border-bottom: 1px solid var(--ag-border);
}
.ag-cal-dow {
  text-align: center;
  padding: 0.5rem 0;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--ag-text-3);
}

.ag-cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: var(--ag-border);
  gap: 1px;
}

.ag-cal-day {
  background: var(--ag-surface);
  min-height: 4.5rem;
  padding: 0.375rem;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: background 0.2s;
}
.ag-cal-day.is-empty {
  background: color-mix(in srgb, var(--ag-surface) 40%, var(--ag-bg-2));
}
.ag-cal-day.has-events {
  cursor: pointer;
}
.ag-cal-day.has-events:hover {
  background: var(--ag-bg-2);
}
.ag-cal-day.is-today .ag-cal-date-num {
  background: var(--ag-primary);
  color: #fff;
}

.ag-cal-date-num {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--ag-text);
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: auto;
}

.ag-cal-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  justify-content: center;
  margin-top: 0.25rem;
}
.ag-cal-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.ag-cal-dot-more {
  font-size: 0.55rem;
  font-weight: 800;
  color: var(--ag-text-3);
  line-height: 6px;
}

.ag-cal-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(2px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.ag-cal-modal-content {
  background: var(--ag-surface);
  border-radius: 1rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
