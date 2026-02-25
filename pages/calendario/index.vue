<template>
  <div style="padding-bottom:6rem;">
    <PageHeader title="Calendário de Eventos" subtitle="Planejamento reprodutivo" back="/">
      <template #actions>
        <ThemeToggle />
      </template>
    </PageHeader>

    <div class="page-container enter-anim">
      <div class="ag-card calendar-card">
        <!-- Calendar Header Controls -->
        <div class="calendar-header">
          <button class="ag-cal-btn" @click="prevMonth">
            <svg style="width:1.25rem;height:1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div class="calendar-title-group">
            <p class="month-title">{{ monthName }}</p>
            <p class="year-subtitle">{{ currentYear }}</p>
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
              'has-events': day.events && day.events.length > 0
            }"
            @click="day.events && day.events.length > 0 ? openDayModal(day) : null"
          >
            <span v-if="day.date" class="ag-cal-date-num">{{ day.date.getDate() }}</span>
            <div v-if="day.events && day.events.length > 0" class="ag-cal-indicators">
              <span v-for="(ev, i) in day.events.slice(0, 3)" :key="i" class="ag-cal-dot" :style="{background: ev.color}"></span>
              <span v-if="day.events.length > 3" class="ag-cal-dot-more">+</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Day Events Modal -->
    <Teleport to="body">
      <Transition name="fade-glass">
        <div v-if="selectedDay" class="ag-cal-modal-overlay" @click.self="selectedDay = null">
          <div class="ag-cal-modal-content">
            <div class="modal-header">
              <h3 class="modal-title">
                {{ selectedDay.date?.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) }}
              </h3>
              <button class="close-btn" @click="selectedDay = null">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="modal-body custom-scrollbar">
              <div
                v-for="(ev, idx) in selectedDay.events" :key="idx"
                class="ag-card event-card"
                :style="{ borderLeftColor: ev.color }"
                @click="goToEvent(ev)"
              >
                <div class="event-info">
                  <p class="event-title">{{ ev.title }}</p>
                  <p class="event-desc">{{ ev.description }}</p>
                </div>
                <div class="event-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </div>
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
  try {
    const allIatf = await db.iatfRecords.toArray()
    const evs: any[] = []
    
    const addEvent = (dateStr: string | Date | undefined | null, title: string, color: string, iatf: any, extraDesc: string = '') => {
      if (!dateStr) return
      // Extract the 'yyyy-mm-dd' portion regardless of input type
      let str = dateStr instanceof Date ? dateStr.toISOString() : String(dateStr)
      const baseStr = str.split('T')[0]
      if (!baseStr) return
      const parts = baseStr.split('-')
      if (parts.length !== 3) return
      const [y, m, d] = parts
      const date = new Date(Number(y), Number(m)-1, Number(d))
      
      // Ensure date is valid before adding
      if (!isNaN(date.getTime())) {
        evs.push({
          date,
          title,
          description: `${iatf.propriedade} • Lote: ${iatf.lote} ${extraDesc ? '• ' + extraDesc : ''}`,
          color,
          route: `/iatf/detalhes/${iatf.id}`
        })
      }
    }
    
    allIatf.forEach(iatf => {
      // Protocol base dates if filled
      if (iatf.dataImplante) addEvent(iatf.dataImplante, 'D-0 (Implante)', '#3b82f6', iatf)
      if (iatf.dataRetirada) addEvent(iatf.dataRetirada, 'D-8 (Retirada)', '#6366f1', iatf)
      if (iatf.dataPrimeiraIa) addEvent(iatf.dataPrimeiraIa, 'IA (Inseminação)', '#8b5cf6', iatf)
      
      // Predicted events based on IA
      if (iatf.dataPrimeiraIa) {
        try {
          // Robust parsing of base date strings
          const cleanIaDate = String(iatf.dataPrimeiraIa).split('T')[0]
          if (cleanIaDate) {
            const [y, m, d] = cleanIaDate.split('-')
            const baseDate = new Date(Number(y), Number(m)-1, Number(d), 12, 0, 0)
            
            if (!isNaN(baseDate.getTime())) {
              const partoDate = new Date(baseDate)
              partoDate.setDate(partoDate.getDate() + 285)
              addEvent(partoDate, 'Parto (Previsto)', '#dc2626', iatf)
              
              const secagemDate = new Date(baseDate)
              secagemDate.setDate(secagemDate.getDate() + 225)
              addEvent(secagemDate, 'Secagem/Vacina', '#f59e0b', iatf)
            }
          }
        } catch (e) {
          console.error("Error generating predicted events for IA:", e)
        }
      }
      
      // Animal specific DG dates
      if (iatf.animais && Array.isArray(iatf.animais) && iatf.animais.length > 0) {
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
  } catch (err) {
    console.error("Error loading events in calendar:", err)
  }
}

onMounted(loadEvents)
</script>

<style scoped>
/* Page Animations */
.enter-anim {
  animation: slideUp 0.4s ease-out forwards;
  opacity: 0;
  transform: translateY(10px);
}
@keyframes slideUp {
  to { opacity: 1; transform: translateY(0); }
}

/* Calendar Card */
.calendar-card {
  padding: 0;
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  border-bottom: 1px solid var(--ag-border);
  background: var(--ag-surface);
}

.calendar-title-group {
  text-align: center;
}
.month-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--ag-text);
  margin: 0;
  text-transform: capitalize;
}
.year-subtitle {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--ag-primary);
  margin: 0;
}

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
  transition: all 0.2s;
}
.ag-cal-btn:hover {
  background: var(--ag-primary-light);
  color: var(--ag-primary);
  border-color: var(--ag-primary);
}

.ag-cal-grid-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: color-mix(in srgb, var(--ag-surface) 50%, var(--ag-bg-2));
  border-bottom: 1px solid var(--ag-border);
}
.ag-cal-dow {
  text-align: center;
  padding: 0.75rem 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--ag-text-3);
  letter-spacing: 0.05em;
}

.ag-cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: var(--ag-border);
  gap: 1px;
}

.ag-cal-day {
  background: var(--ag-surface);
  min-height: 5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: background 0.2s, transform 0.2s;
}
@media (max-width: 768px) {
  .ag-cal-day { min-height: 4rem; padding: 0.25rem; }
}

.ag-cal-day.is-empty {
  background: color-mix(in srgb, var(--ag-surface) 40%, var(--ag-bg-2));
}
.ag-cal-day.has-events {
  cursor: pointer;
}
.ag-cal-day.has-events:hover {
  background: var(--ag-primary-light);
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
  gap: 3px;
  justify-content: flex-start;
  margin-top: 0.375rem;
  padding: 0 0.125rem;
}
@media (max-width: 768px) {
  .ag-cal-indicators { justify-content: center; }
  .ag-cal-date-num { margin: 0 auto auto auto; }
}

.ag-cal-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
.ag-cal-dot-more {
  font-size: 0.6rem;
  font-weight: 800;
  color: var(--ag-text-3);
  line-height: 8px;
}

/* Glassmorphism Modal */
.ag-cal-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(8px);
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
  max-width: 440px;
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.2);
  border: 1px solid var(--ag-border);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid color-mix(in srgb, var(--ag-border) 40%, transparent);
  padding: 1.25rem 1.5rem;
}
.modal-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--ag-text);
  margin: 0;
  text-transform: capitalize;
}
.close-btn {
  background: var(--ag-bg-2);
  border: none;
  color: var(--ag-text-2);
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.close-btn:hover {
  background: var(--ag-border);
  color: var(--ag-text);
}
.close-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-body {
  max-height: 60vh;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-left: 4px solid;
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
  border-radius: 0.75rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.02);
}
.event-card:hover {
  transform: translateX(4px);
  background: var(--ag-bg-2);
  box-shadow: 0 6px 12px rgba(0,0,0,0.05);
}
.event-info {
  flex: 1;
}
.event-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--ag-text);
  margin: 0 0 0.25rem;
}
.event-desc {
  font-size: 0.75rem;
  color: var(--ag-text-2);
  margin: 0;
  line-height: 1.4;
}
.event-icon svg {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--ag-primary);
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.2s;
}
.event-card:hover .event-icon svg {
  opacity: 1;
  transform: translateX(0);
}

/* Custom Scrollbar for Modal */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: var(--ag-border); border-radius: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--ag-text-3); }

/* Glass Fade Transition */
.fade-glass-enter-active, .fade-glass-leave-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.fade-glass-enter-from, .fade-glass-leave-to { opacity: 0; transform: scale(0.95); }
</style>
