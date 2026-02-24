<template>
  <div>
    <!-- Header -->
    <div class="ag-dashboard-header">
      <div style="max-width:860px; margin:0 auto;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <p style="color:var(--ag-primary); font-size:0.8125rem; font-weight:500; margin:0;">Bem-vindo,</p>
            <h1 style="font-size:1.375rem; font-weight:700; color:var(--ag-text); margin:0.1rem 0 0;">{{ auth.currentUser?.name }}</h1>
          </div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span v-if="appStore.syncPending > 0" class="ag-badge ag-badge-yellow">
              {{ appStore.syncPending }} pendente{{ appStore.syncPending > 1 ? 's' : '' }}
            </span>
            <ThemeToggle />
            <button
              style="display:flex; align-items:center; justify-content:center; width:34px; height:34px; border-radius:0.5rem; border:1px solid var(--ag-border); background:var(--ag-bg-2); color:var(--ag-text-2); cursor:pointer; transition:all .2s;"
              @click="handleLogout"
              title="Sair"
            >
              <svg style="width:1rem;height:1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
        <!-- Status -->
        <div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.75rem; font-size:0.75rem;">
          <span :style="`width:8px; height:8px; border-radius:9999px; background:${isOnline ? '#16a34a' : '#d97706'}; display:inline-block;`" />
          <span :style="`color:${isOnline ? '#16a34a' : '#d97706'};`">{{ isOnline ? 'Online' : 'Offline' }}</span>
          <span style="color:var(--ag-text-3);">•</span>
          <span style="color:var(--ag-text-3);">{{ new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) }}</span>
        </div>
      </div>
    </div>

    <div class="page-container">
      <!-- Stats Grid -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.25rem;">
        <div
          v-for="stat in stats" :key="stat.label"
          class="ag-stat-card"
          @click="navigateTo(stat.route)"
        >
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.375rem;">
            <span style="font-size:1.5rem;">{{ stat.icon }}</span>
            <span class="ag-badge ag-badge-green" style="font-size:0.65rem;">{{ stat.badge }}</span>
          </div>
          <p style="font-size:1.625rem; font-weight:700; color:var(--ag-text); margin:0 0 .125rem;">{{ stat.value }}</p>
          <p style="font-size:0.75rem; color:var(--ag-text-3); margin:0;">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div style="margin-bottom:1.25rem;">
        <p class="ag-section-title">Ações Rápidas</p>
        <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:0.5rem;">
          <NuxtLink to="/iatf/novo" class="ag-quick-action">
            <div class="ag-quick-action-icon">
              <svg style="width:1.125rem;height:1.125rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            </div>
            <span style="font-size:0.7rem; font-weight:600;">IATF</span>
          </NuxtLink>
          <NuxtLink to="/propriedades" class="ag-quick-action">
            <div class="ag-quick-action-icon">
              <svg style="width:1.125rem;height:1.125rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16H3m14 0h2m-2 0h-5m-9 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <span style="font-size:0.7rem; font-weight:600;">Fazendas</span>
          </NuxtLink>
          <NuxtLink to="/lotes" class="ag-quick-action">
            <div class="ag-quick-action-icon">
              <svg style="width:1.125rem;height:1.125rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            </div>
            <span style="font-size:0.7rem; font-weight:600;">Lotes</span>
          </NuxtLink>
          <NuxtLink to="/animais" class="ag-quick-action">
            <div class="ag-quick-action-icon">
              <svg style="width:1.125rem;height:1.125rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </div>
            <span style="font-size:0.7rem; font-weight:600;">Animais</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Pending Events -->
      <div v-if="mounted && pendingEvents.length > 0" style="margin-bottom:1.25rem;">
        <p class="ag-section-title">
          <svg style="width:1.125rem;height:1.125rem;color:#d97706;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          Próximos Eventos
        </p>
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          <div v-for="(event, idx) in pendingEvents" :key="idx" class="ag-event-card">
            <div>
              <p style="font-size:0.875rem; font-weight:700; color:var(--ag-text); margin:0;">
                {{ event.type }}
                <span style="font-size:0.75rem; font-weight:400; color:var(--ag-text-3); margin-left:0.375rem;">
                  {{ new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(event.date) }}
                </span>
              </p>
              <p style="font-size:0.75rem; color:var(--ag-text-2); margin:0.2rem 0 0;">{{ event.description }}</p>
            </div>
            <span
              class="ag-badge"
              :style="`background: ${event.daysLeft === 0 ? 'color-mix(in srgb,#dc2626 12%,transparent)' : event.daysLeft <= 3 ? 'color-mix(in srgb,#d97706 12%,transparent)' : 'color-mix(in srgb,#16a34a 12%,transparent)'}; color: ${event.daysLeft === 0 ? '#dc2626' : event.daysLeft <= 3 ? '#d97706' : '#16a34a'}; border-color: ${event.daysLeft === 0 ? 'color-mix(in srgb,#dc2626 30%,transparent)' : event.daysLeft <= 3 ? 'color-mix(in srgb,#d97706 30%,transparent)' : 'color-mix(in srgb,#16a34a 30%,transparent)'}; white-space:nowrap;`"
            >
              {{ event.daysLeft === 0 ? '🚨 HOJE' : `Em ${event.daysLeft} dias` }}
            </span>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div v-if="mounted" style="display:grid; grid-template-columns:1fr; gap:0.75rem; margin-bottom:1.25rem;">
        <div class="ag-card" v-if="chartDataCategorias.datasets[0]!.data.length > 0">
          <p style="font-size:0.8125rem; font-weight:600; color:var(--ag-text-2); margin:0 0 1rem;">Animais por Categoria</p>
          <div style="height:11rem; display:flex; justify-content:center; align-items:center;">
            <Doughnut :data="chartDataCategorias" :options="chartOptionsDoughnut" />
          </div>
        </div>
        <div class="ag-card" v-if="chartDataPrenhez.datasets[0]!.data.some(v => v > 0)">
          <p style="font-size:0.8125rem; font-weight:600; color:var(--ag-text-2); margin:0 0 1rem;">Controle de Prenhez</p>
          <div style="height:11rem; display:flex; justify-content:center; align-items:center;">
            <Bar :data="chartDataPrenhez" :options="chartOptionsBar" />
          </div>
        </div>
      </div>

      <!-- Recent IATF -->
      <div>
        <p class="ag-section-title">Protocolos Recentes</p>
        <div v-if="recentIatf.length === 0" class="ag-card" style="text-align:center; padding:2.5rem 1rem; color:var(--ag-text-3); font-size:0.875rem;">
          Nenhum protocolo IATF cadastrado ainda.
          <NuxtLink to="/iatf/novo" style="display:block; margin-top:0.5rem; color:var(--ag-primary); font-weight:600; text-decoration:none;">+ Criar primeiro protocolo</NuxtLink>
        </div>
        <div v-else style="display:flex; flex-direction:column; gap:0.5rem;">
          <NuxtLink
            v-for="iatf in recentIatf" :key="iatf.id"
            :to="`/iatf/${iatf.id}`"
            class="ag-card"
            style="display:flex; align-items:center; justify-content:space-between; text-decoration:none; cursor:pointer;"
          >
            <div>
              <p style="font-size:0.875rem; font-weight:600; color:var(--ag-text); margin:0;">{{ iatf.propriedade }}</p>
              <p style="font-size:0.75rem; color:var(--ag-text-3); margin:0.15rem 0 0;">{{ iatf.lote }} • {{ iatf.tipoInseminacao }}</p>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span :class="['ag-badge', iatf.synced ? 'ag-badge-green' : 'ag-badge-yellow']">
                {{ iatf.synced ? 'Sync' : 'Pendente' }}
              </span>
              <svg style="width:1rem;height:1rem;color:var(--ag-text-3);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { db } from '~/plugins/dexie.client'
import { Doughnut, Bar } from 'vue-chartjs'

definePageMeta({ layout: 'default' })

const auth = useAuthStore()
const appStore = useAppStore()
const { isOnline } = useNetwork()

const stats = ref([
  { label: 'Fazendas', value: 0, icon: '🏡', badge: 'Total', route: '/propriedades' },
  { label: 'Lotes', value: 0, icon: '📦', badge: 'Ativos', route: '/lotes' },
  { label: 'Protocolos IATF', value: 0, icon: '💉', badge: 'Total', route: '/iatf' },
  { label: 'Animais', value: 0, icon: '🐄', badge: 'Total', route: '/animais' },
])

const mounted = ref(false)

const chartDataCategorias = ref({
  labels: [] as string[],
  datasets: [{ data: [] as number[], backgroundColor: ['#16a34a','#3b82f6','#f59e0b','#8b5cf6'], borderWidth: 0, hoverOffset: 4 }]
})
const chartDataPrenhez = ref({
  labels: ['Prenhes', 'Vazias'],
  datasets: [{ label: 'Qtd.', data: [0, 0], backgroundColor: ['#16a34a','#f43f5e'], borderRadius: 4 }]
})
const chartOptionsDoughnut = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' as const, labels: { color: '#94a3b8', font: { size: 11 } } } }, cutout: '70%' }
const chartOptionsBar = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#e2e8f0', display: false }, ticks: { color: '#94a3b8', stepSize: 1 } }, x: { grid: { display: false }, ticks: { color: '#94a3b8' } } } }

const recentIatf = ref<any[]>([])
const pendingEvents = ref<{ date: Date; type: string; description: string; daysLeft: number }[]>([])

const handleLogout = async () => {
  await auth.logout()
  await navigateTo('/login')
}

onMounted(async () => {
  if (!import.meta.client) return
  mounted.value = true
  try {
    if (stats.value[0]) stats.value[0].value = await db.propriedades.count()
    if (stats.value[1]) stats.value[1].value = await db.lotes.count()
    if (stats.value[2]) stats.value[2].value = await db.iatfRecords.count()
    if (stats.value[3]) stats.value[3].value = await db.animais.count()

    const iatfList = await db.iatfRecords.orderBy('createdAt').reverse().toArray()
    recentIatf.value = iatfList.slice(0, 5)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const upcoming: { date: Date; type: string; description: string; daysLeft: number }[] = []

    iatfList.forEach((iatf) => {
      if (iatf.dataPrimeiraIa) {
        const base = new Date(iatf.dataPrimeiraIa + 'T12:00:00')
        const addDays = (d: Date, days: number) => {
          const res = new Date(d)
          res.setDate(res.getDate() + days)
          res.setHours(0, 0, 0, 0)
          return res
        }
        const partoDate = addDays(base, 285)
        const daysToParto = Math.floor((partoDate.getTime() - today.getTime()) / 86400000)
        if (daysToParto >= 0 && daysToParto <= 20) {
          upcoming.push({ date: partoDate, type: 'Parto', description: `Previsão de partos no lote ${iatf.lote} (${iatf.propriedade})`, daysLeft: daysToParto })
        }
        const secagemDate = addDays(base, 225)
        const daysToSecagem = Math.floor((secagemDate.getTime() - today.getTime()) / 86400000)
        if (daysToSecagem >= 0 && daysToSecagem <= 15) {
          upcoming.push({ date: secagemDate, type: 'Secagem', description: `Secagem/Vacina pré-parto no lote ${iatf.lote}`, daysLeft: daysToSecagem })
        }
      }
      let pendingDg = 0
      const dgDates = new Set<string>()
      iatf.animais.forEach((a: any) => {
        if (a.dg35 && !a.dg_status) {
          const d = new Date(a.dg35 + 'T12:00:00')
          d.setHours(0, 0, 0, 0)
          const daysToDg = Math.floor((d.getTime() - today.getTime()) / 86400000)
          if (daysToDg >= 0 && daysToDg <= 10) {
            pendingDg++
            dgDates.add(a.dg35)
          }
        }
      })
      if (pendingDg > 0) {
        const earliest = new Date(Array.from(dgDates).sort()[0] + 'T12:00:00')
        earliest.setHours(0, 0, 0, 0)
        const daysLeft = Math.floor((earliest.getTime() - today.getTime()) / 86400000)
        upcoming.push({ date: earliest, type: 'Avaliação de DG', description: `${pendingDg} fêmeas aguardando DG do Lote ${iatf.lote}`, daysLeft })
      }
    })

    upcoming.sort((a, b) => a.daysLeft - b.daysLeft)
    pendingEvents.value = upcoming.slice(0, 5)

    const animais = await db.animais.toArray()
    if (animais.length > 0) {
      const cats: Record<string, number> = {}
      let prenhes = 0, vazias = 0
      animais.forEach((a) => {
        const c = a.categoria || 'Sem categoria'
        cats[c] = (cats[c] || 0) + 1
        if (a.status_prenhez === 'Prenhe') prenhes++
        else vazias++
      })
      chartDataCategorias.value.labels = Object.keys(cats)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      chartDataCategorias.value.datasets[0]!.data = Object.values(cats)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      chartDataPrenhez.value.datasets[0]!.data = [prenhes, vazias]
    }
  } catch {}
})
</script>
