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
        <Button v-if="record" size="small" label="Editar" @click="goToEdit" severity="secondary" outlined />
      </template>
    </PageHeader>

    <div v-if="!record" class="page-container" style="text-align:center; padding-top:3rem; color:var(--ag-text-3);">
      <svg style="width:2rem;height:2rem; animation:spin 1s linear infinite;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
      <p style="margin-top:0.5rem;">Carregando protocolo...</p>
    </div>

    <div v-else class="page-container">
      
      <!-- Timeline Visual -->
      <div style="margin-bottom:1.5rem;">
        <IatfTimeline :protocol="record" />
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
        <!-- Card: Informações Gerais -->
        <div class="ag-card">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem; border-bottom:1px solid var(--ag-border); padding-bottom:0.75rem;">
            <div style="display:flex; align-items:center; justify-content:center; width:2rem; height:2rem; border-radius:0.5rem; background:var(--ag-primary-light); color:var(--ag-primary);">
              <svg style="width:1.25rem;height:1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16H3m14 0h2m-2 0h-5m-9 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <h2 style="font-size:0.9375rem; font-weight:700; color:var(--ag-text); margin:0;">Informações Gerais</h2>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div><p style="font-size:0.65rem; font-weight:700; color:var(--ag-text-3); text-transform:uppercase; margin:0 0 0.15rem;">Propriedade</p><p style="font-size:0.875rem; font-weight:600; color:var(--ag-text); margin:0;">{{ record.propriedade || '—' }}</p></div>
            <div><p style="font-size:0.65rem; font-weight:700; color:var(--ag-text-3); text-transform:uppercase; margin:0 0 0.15rem;">Proprietário</p><p style="font-size:0.875rem; font-weight:600; color:var(--ag-text); margin:0;">{{ record.proprietario || '—' }}</p></div>
            <div><p style="font-size:0.65rem; font-weight:700; color:var(--ag-text-3); text-transform:uppercase; margin:0 0 0.15rem;">Lote</p><p style="font-size:0.875rem; font-weight:600; color:var(--ag-text); margin:0;">{{ record.lote || '—' }}</p></div>
            <div><p style="font-size:0.65rem; font-weight:700; color:var(--ag-text-3); text-transform:uppercase; margin:0 0 0.15rem;">Categoria</p><p style="font-size:0.875rem; font-weight:600; color:var(--ag-text); margin:0;">{{ record.categoria || '—' }}</p></div>
            <div><p style="font-size:0.65rem; font-weight:700; color:var(--ag-text-3); text-transform:uppercase; margin:0 0 0.15rem;">Retiro</p><p style="font-size:0.875rem; font-weight:600; color:var(--ag-text); margin:0;">{{ record.retiro || '—' }}</p></div>
          </div>
        </div>

        <!-- Card: Manejo e Tratamento -->
        <div class="ag-card">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem; border-bottom:1px solid var(--ag-border); padding-bottom:0.75rem;">
            <div style="display:flex; align-items:center; justify-content:center; width:2rem; height:2rem; border-radius:0.5rem; background:var(--ag-bg-2); color:var(--ag-text-2);">
               <svg style="width:1.25rem;height:1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
            </div>
            <h2 style="font-size:0.9375rem; font-weight:700; color:var(--ag-text); margin:0;">Manejo e Tratamento</h2>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div><p style="font-size:0.65rem; font-weight:700; color:var(--ag-text-3); text-transform:uppercase; margin:0 0 0.15rem;">Inseminação</p><p style="font-size:0.875rem; font-weight:600; color:var(--ag-text); margin:0;">{{ record.tipoInseminacao || '—' }}</p></div>
            <div><p style="font-size:0.65rem; font-weight:700; color:var(--ag-text-3); text-transform:uppercase; margin:0 0 0.15rem;">Vacina Reprod.?</p><p style="font-size:0.875rem; font-weight:600; color:var(--ag-text); margin:0;">{{ record.vacinaReprodutiva ? 'Sim' : 'Não' }}</p></div>
            <div><p style="font-size:0.65rem; font-weight:700; color:var(--ag-text-3); text-transform:uppercase; margin:0 0 0.15rem;">Descongelamento</p><p style="font-size:0.875rem; font-weight:600; color:var(--ag-text); text-transform: capitalize; margin:0;">{{ record.tipoDescongelamento || '—' }}</p></div>
            <div><p style="font-size:0.65rem; font-weight:700; color:var(--ag-text-3); text-transform:uppercase; margin:0 0 0.15rem;">Progesterona</p><p style="font-size:0.875rem; font-weight:600; color:var(--ag-text); margin:0;">{{ record.diasProgesterona ? record.diasProgesterona + ' dias' : '—' }}</p></div>
            <div><p style="font-size:0.65rem; font-weight:700; color:var(--ag-text-3); text-transform:uppercase; margin:0 0 0.15rem;">Estímulo Ovulatório</p><p style="font-size:0.875rem; font-weight:600; color:var(--ag-text); margin:0;">{{ record.estimuloOvulatorio || '—' }}</p></div>
          </div>
        </div>
      </div>

      <!-- Animais -->
      <div class="ag-card" style="padding:0; overflow:hidden;">
        <div style="display:flex; align-items:center; justify-content:space-between; padding:0.75rem 1rem; background:color-mix(in srgb,var(--ag-primary) 8%,transparent); border-bottom:1px solid var(--ag-border);">
          <span style="font-weight:700; color:var(--ag-primary); font-size:0.8125rem; text-transform:uppercase; letter-spacing:0.06em;">
            ANIMAIS
            <span style="background:var(--ag-primary); color:#fff; border-radius:9999px; font-size:0.65rem; padding:0.1rem 0.4rem; margin-left:0.25rem;">{{ record.animais?.length || 0 }}</span>
          </span>
        </div>
        <div style="overflow-x:auto;">
          <table class="ag-table" style="min-width:680px;">
            <thead>
              <tr>
                <th style="width:2.5rem;">ORD</th>
                <th>Fêmea</th>
                <th>Res. DG</th>
                <th style="color:var(--ag-primary);">D-0+DG</th>
                <th style="color:var(--ag-primary);">DG 35</th>
                <th style="color:var(--ag-primary);">D-8</th>
                <th style="color:var(--ag-primary);">GnRH</th>
                <th>Touro</th>
                <th>Partida</th>
                <th>Obs</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!record.animais || record.animais.length === 0">
                <td colspan="10" style="text-align:center; padding:2rem; color:var(--ag-text-3); font-size:0.8125rem;">
                  Nenhum animal neste protocolo.
                </td>
              </tr>
              <tr v-for="(animal, i) in record.animais" :key="i">
                <td style="text-align:center; font-weight:700; color:var(--ag-text-3); font-size:0.75rem;">{{ animal.ord }}</td>
                <td style="font-weight:600; text-align:center;">{{ animal.femea || '—' }}</td>
                <td style="text-align:center;">
                  <span v-if="animal.dg_status" :style="{color: animal.dg_status === 'Prenhe' ? '#16a34a' : '#dc2626', fontWeight:'700', fontSize:'0.75rem'}">{{ animal.dg_status.toUpperCase() }}</span>
                  <span v-else style="color:var(--ag-text-3);">—</span>
                </td>
                <td style="text-align:center; font-size:0.75rem;">{{ formatDate(animal.d0dg) }}</td>
                <td style="text-align:center; font-size:0.75rem;">{{ formatDate(animal.dg35) }}</td>
                <td style="text-align:center; font-size:0.75rem;">{{ formatDate(animal.d8) }}</td>
                <td style="text-align:center; font-size:0.75rem;">{{ formatDate(animal.gnrh) }}</td>
                <td style="text-align:center; font-size:0.75rem;">{{ animal.touro || '—' }}</td>
                <td style="text-align:center; font-size:0.75rem;">{{ animal.partida || '—' }}</td>
                <td style="text-align:center; font-size:0.75rem;">{{ animal.obs || '—' }}</td>
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

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const record = ref<any>(null)

const formatDate = (isoDate: string) => {
  if (!isoDate) return '—'
  const [y, m, d] = isoDate.split('-')
  return `${d}/${m}/${y}`
}

const goToEdit = () => {
  router.push(`/iatf/${record.value.id}`)
}

onMounted(async () => {
  const id = Number(route.params.id)
  record.value = await db.iatfRecords.get(id)
})
</script>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
