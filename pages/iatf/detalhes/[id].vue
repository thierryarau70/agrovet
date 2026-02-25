<template>
  <div style="padding-bottom:6rem;">
    <!-- Header -->
    <PageHeader
      title="Detalhes do Protocolo"
      :subtitle="record ? `${record.propriedade} • Lote: ${record.lote}` : 'Carregando...'"
      back="/iatf"
    >
      <template #actions>
        <ThemeToggle />
        <Button v-if="record" size="small" label="Apagar" @click="confirmDelete" severity="danger" outlined />
        <Button v-if="record" size="small" label="Editar" @click="goToEdit" severity="secondary" outlined />
      </template>
    </PageHeader>

    <div v-if="!record" class="page-container loading-state">
      <svg class="loading-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
      <p>Carregando protocolo...</p>
    </div>

    <div v-else class="page-container content-grid">
      
      <!-- Timeline Visual -->
      <div class="stagger-1">
        <IatfTimeline :protocol="record" />
      </div>

      <div class="cards-grid stagger-2">
        <!-- Card: Informações Gerais -->
        <div class="ag-card premium-card">
          <div class="card-header">
            <div class="icon-wrapper bg-primary-light text-primary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16H3m14 0h2m-2 0h-5m-9 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <h2>Informações Gerais</h2>
          </div>
          <div class="info-grid">
            <div class="info-item"><span class="label">Propriedade</span><span class="value">{{ record.propriedade || '—' }}</span></div>
            <div class="info-item"><span class="label">Proprietário</span><span class="value">{{ record.proprietario || '—' }}</span></div>
            <div class="info-item"><span class="label">Lote</span><span class="value">{{ record.lote || '—' }}</span></div>
            <div class="info-item"><span class="label">Categoria</span><span class="value">{{ record.categoria || '—' }}</span></div>
            <div class="info-item"><span class="label">Retiro</span><span class="value">{{ record.retiro || '—' }}</span></div>
          </div>
        </div>

        <!-- Card: Manejo e Tratamento -->
        <div class="ag-card premium-card">
          <div class="card-header">
            <div class="icon-wrapper bg-secondary-light text-secondary">
               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
            </div>
            <h2>Manejo e Tratamento</h2>
          </div>
          <div class="info-grid">
            <div class="info-item"><span class="label">Inseminação</span><span class="value">{{ record.tipoInseminacao || '—' }}</span></div>
            <div class="info-item"><span class="label">Vacina Reprod.?</span><span class="value">{{ record.vacinaReprodutiva ? 'Sim' : 'Não' }}</span></div>
            <div class="info-item"><span class="label">Descongelamento</span><span class="value capitalize">{{ record.tipoDescongelamento || '—' }}</span></div>
            <div class="info-item"><span class="label">Progesterona</span><span class="value">{{ record.diasProgesterona ? record.diasProgesterona + ' dias' : '—' }}</span></div>
            <div class="info-item"><span class="label">Estímulo Ovulatório</span><span class="value">{{ record.estimuloOvulatorio || '—' }}</span></div>
          </div>
        </div>
      </div>

      <!-- Animais -->
      <div class="ag-card table-card stagger-3">
        <div class="table-header">
          <span>
            ANIMAIS
            <span class="badge">{{ record.animais?.length || 0 }}</span>
          </span>
          <div class="scroll-hint">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </div>
        <div class="table-wrapper custom-scrollbar">
          <table class="ag-table">
            <thead>
              <tr>
                <th class="w-ord">ORD</th>
                <th>Fêmea</th>
                <th>Res. DG</th>
                <th class="text-primary">D-0+DG</th>
                <th class="text-primary">DG 35</th>
                <th class="text-primary">D-8</th>
                <th class="text-primary">GnRH</th>
                <th>Touro</th>
                <th>Partida</th>
                <th>Obs</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!record.animais || record.animais.length === 0">
                <td colspan="10" class="empty-state">
                  Nenhum animal neste protocolo.
                </td>
              </tr>
              <tr v-for="(animal, i) in record.animais" :key="i">
                <td class="col-ord">{{ animal.ord }}</td>
                <td class="col-femea">{{ animal.femea || '—' }}</td>
                <td class="col-resp">
                  <span v-if="animal.dg_status" :class="['status-badge', animal.dg_status.toLowerCase() == 'prenhe' ? 'prenhe' : 'vazio']">{{ animal.dg_status.toUpperCase() }}</span>
                  <span v-else class="empty-dash">—</span>
                </td>
                <td class="col-date">{{ formatDate(animal.d0dg) }}</td>
                <td class="col-date">{{ formatDate(animal.dg35) }}</td>
                <td class="col-date">{{ formatDate(animal.d8) }}</td>
                <td class="col-date">{{ formatDate(animal.gnrh) }}</td>
                <td class="col-text">{{ animal.touro || '—' }}</td>
                <td class="col-text">{{ animal.partida || '—' }}</td>
                <td class="col-text">{{ animal.obs || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { db } from '~/plugins/dexie.client'
import Button from 'primevue/button'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useSync } from '~/composables/useSync'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()
const { addToQueue } = useSync()

const record = ref<any>(null)

const formatDate = (isoDate: string) => {
  if (!isoDate) return '—'
  const [y, m, d] = isoDate.split('-')
  return `${d}/${m}/${y}`
}

const goToEdit = () => {
  router.push(`/iatf/${record.value.id}`)
}

const confirmDelete = () => {
  confirm.require({
    message: 'Tem certeza que deseja apagar este protocolo? Esta ação não pode ser desfeita e os dados individuais dos animais não serão alterados.',
    header: 'Confirmar Exclusão',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    acceptLabel: 'Sim, Apagar',
    rejectLabel: 'Cancelar',
    accept: async () => {
      try {
        const idToDelete = record.value.id
        await db.iatfRecords.delete(idToDelete)
        await addToQueue('delete', 'iatfRecords', idToDelete, null)
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Protocolo IATF apagado', life: 3000 })
        router.push('/iatf')
      } catch (e) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível apagar o protocolo', life: 3000 })
      }
    }
  })
}

onMounted(async () => {
  const id = Number(route.params.id)
  record.value = await db.iatfRecords.get(id)
})
</script>

<style scoped>
/* Loading State */
.loading-state {
  text-align: center;
  padding-top: 3rem;
  color: var(--ag-text-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.loading-icon {
  width: 2rem;
  height: 2rem;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Animations Grid */
.content-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.stagger-1 { animation: slideUp 0.4s ease-out forwards; opacity: 0; transform: translateY(10px); }
.stagger-2 { animation: slideUp 0.4s ease-out 0.1s forwards; opacity: 0; transform: translateY(10px); }
.stagger-3 { animation: slideUp 0.4s ease-out 0.2s forwards; opacity: 0; transform: translateY(10px); }

@keyframes slideUp {
  to { opacity: 1; transform: translateY(0); }
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

/* Premium Card */
.premium-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 1rem;
}
.premium-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
}
.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--ag-border);
  padding-bottom: 0.75rem;
}
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
}
.icon-wrapper svg {
  width: 1.25rem;
  height: 1.25rem;
}
.bg-primary-light { background: var(--ag-primary-light); }
.text-primary { color: var(--ag-primary); }
.bg-secondary-light { background: var(--ag-bg-2); }
.text-secondary { color: var(--ag-text-2); }
.card-header h2 {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--ag-text);
  margin: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.875rem;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.info-item .label {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--ag-text-3);
  text-transform: uppercase;
}
.info-item .value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ag-text);
}
.capitalize { text-transform: capitalize; }

/* Table Card */
.table-card {
  padding: 0;
  overflow: hidden;
  border-radius: 1rem;
}
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  background: color-mix(in srgb, var(--ag-primary) 8%, transparent);
  border-bottom: 1px solid var(--ag-border);
}
.table-header span.badge {
  background: var(--ag-primary);
  color: #fff;
  border-radius: 9999px;
  font-size: 0.65rem;
  padding: 0.1rem 0.5rem;
  margin-left: 0.5rem;
  font-weight: 800;
}
.table-header > span {
  font-weight: 700;
  color: var(--ag-primary);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  display: flex;
  align-items: center;
}
.scroll-hint {
  display: none;
  color: var(--ag-primary);
  animation: bounceX 2s infinite;
}
.scroll-hint svg {
  width: 1.25rem;
  height: 1.25rem;
}
@keyframes bounceX {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5px); }
}
@media (max-width: 768px) {
  .scroll-hint { display: block; }
}

.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--ag-bg-2);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--ag-border);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--ag-text-3);
}

.ag-table {
  min-width: 800px;
  width: 100%;
}
.text-primary { color: var(--ag-primary) !important; }
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--ag-text-3);
  font-size: 0.875rem;
}

/* Table Cells */
.w-ord { width: 3rem; }
.col-ord { text-align: center; font-weight: 700; color: var(--ag-text-3); font-size: 0.75rem; }
.col-femea { font-weight: 600; text-align: center; }
.col-resp { text-align: center; }
.col-date { text-align: center; font-size: 0.75rem; color: var(--ag-text-2); font-variant-numeric: tabular-nums; }
.col-text { text-align: center; font-size: 0.75rem; color: var(--ag-text-2); }

.status-badge {
  font-weight: 700;
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 0.25rem;
}
.status-badge.prenhe {
  background: #dcfce7;
  color: #166534;
}
.status-badge.vazio {
  background: #fee2e2;
  color: #991b1b;
}
.empty-dash { color: var(--ag-text-3); }

/* Dark mode overwrites for status badge */
:root[data-theme="dark"] .status-badge.prenhe { background: rgba(22, 163, 74, 0.2); color: #4ade80; }
:root[data-theme="dark"] .status-badge.vazio { background: rgba(220, 38, 38, 0.2); color: #f87171; }
</style>
