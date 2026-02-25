<template>
  <div style="padding-bottom:6rem;">
    <!-- Header -->
    <PageHeader
      title="Histórico do Animal"
      :subtitle="animal ? `Tag: ${animal.femea}` : 'Carregando...'"
      back="/animais"
    />

    <div v-if="!animal" class="page-container" style="text-align:center; padding-top:3rem; color:var(--ag-text-3);">
      <svg style="width:2rem;height:2rem; animation:spin 1s linear infinite;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
      <p style="margin-top:0.5rem;">Carregando dados...</p>
    </div>

    <div v-else class="page-container">
      <!-- Info Card -->
      <div class="ag-card" style="margin-bottom:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
          <div>
            <h2 style="font-size:1.25rem; font-weight:700; color:var(--ag-text); margin:0;">Fêmea: {{ animal.femea }}</h2>
            <p style="font-size:0.8125rem; color:var(--ag-text-2); margin:0.25rem 0 0;">Lote: {{ getNomeLote(animal.loteId) }}</p>
          </div>
          <span v-if="animal.status_prenhez" :class="['ag-badge', animal.status_prenhez === 'Prenhe' ? 'ag-badge-green' : 'ag-badge-yellow']" style="font-size:0.75rem; padding:0.2rem 0.6rem;">
            {{ animal.status_prenhez }}
          </span>
        </div>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; border-top:1px solid var(--ag-border); padding-top:1rem;">
          <div>
            <p style="font-size:0.65rem; font-weight:700; color:var(--ag-text-3); text-transform:uppercase; margin:0 0 0.25rem;">Categoria</p>
            <p style="font-size:0.875rem; font-weight:600; color:var(--ag-text); margin:0;">{{ animal.categoria || 'Não definida' }}</p>
          </div>
          <div>
            <p style="font-size:0.65rem; font-weight:700; color:var(--ag-text-3); text-transform:uppercase; margin:0 0 0.25rem;">Observação</p>
            <p style="font-size:0.875rem; font-weight:500; color:var(--ag-text-2); margin:0;">{{ animal.observacao || '—' }}</p>
          </div>
        </div>
      </div>

      <!-- Timeline de Protocolos -->
      <div>
        <p class="ag-section-title">Participações em IATF</p>
        <div v-if="historico.length === 0" class="ag-card" style="text-align:center; padding:2rem 1rem; color:var(--ag-text-3); font-size:0.875rem;">
          Este animal não participou de nenhum protocolo ainda.
        </div>
        
        <div v-else style="display:flex; flex-direction:column; gap:1rem; position:relative;">
          <!-- Timeline line background -->
          <div style="position:absolute; top:0; bottom:0; left:1.25rem; width:2px; background:var(--ag-border); z-index:0;"></div>
          
          <div v-for="(item, idx) in historico" :key="idx" style="position:relative; z-index:1; display:flex; gap:1rem;">
            <div style="width:2.5rem; height:2.5rem; border-radius:50%; background:var(--ag-surface); border:2px solid var(--ag-primary); display:flex; align-items:center; justify-content:center; flex-shrink:0; color:var(--ag-primary);">
              <svg style="width:1.2rem; height:1.2rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </div>
            <div class="ag-card" style="flex:1; cursor:pointer;" @click="router.push(`/iatf/${item.protocoloId}`)">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <p style="font-size:0.8125rem; font-weight:700; color:var(--ag-text); margin:0 0 0.25rem;">Protocolo em {{ getNomeFazenda(item.protocolo.propriedadeId) }}</p>
                <span class="ag-badge" style="background:var(--ag-bg-2); color:var(--ag-text-2);">{{ new Date(item.protocolo.createdAt).toLocaleDateString('pt-BR') }}</span>
              </div>
              <p style="font-size:0.75rem; color:var(--ag-text-3); margin:0 0 0.75rem;">Lote: {{ item.protocolo.lote }} • {{ item.protocolo.tipoInseminacao }}</p>
              
              <div style="background:var(--ag-bg-2); border-radius:0.5rem; padding:0.75rem;">
                <p style="font-size:0.7rem; font-weight:600; color:var(--ag-text-2); margin:0 0 0.5rem;">DADOS NO PROTOCOLO</p>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; font-size:0.75rem;">
                  <div v-if="item.dados.dg_status"><strong>Res. DG:</strong> <span :style="{color: item.dados.dg_status === 'Prenhe' ? '#16a34a' : '#dc2626'}">{{ item.dados.dg_status }}</span></div>
                  <div v-if="item.dados.touro"><strong>Touro:</strong> {{ item.dados.touro }}</div>
                  <div v-if="item.dados.d0dg"><strong>D-0+DG:</strong> {{ formatData(item.dados.d0dg) }}</div>
                  <div v-if="item.dados.dg35"><strong>DG 35:</strong> {{ formatData(item.dados.dg35) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { db } from '~/plugins/dexie.client'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()

const animal = ref<any>(null)
const lotes = ref<any[]>([])
const propriedades = ref<any[]>([])
const historico = ref<any[]>([])

const getNomeLote = (id: number) => lotes.value.find(l => l.id === id)?.nome ?? '—'
const getNomeFazenda = (id: number) => propriedades.value.find(p => p.id === id)?.nome ?? '—'

const formatData = (isoDate: string) => {
  if (!isoDate) return ''
  const [y, m, d] = isoDate.split('-')
  return `${d}/${m}/${y}`
}

onMounted(async () => {
  const id = Number(route.params.id)
  animal.value = await db.animais.get(id)
  if (!animal.value) return

  lotes.value = await db.lotes.toArray()
  propriedades.value = await db.propriedades.toArray()

  // Buscar todos os IATFs
  const todosIatfs = await db.iatfRecords.toArray()
  
  // Filtrar os que possuem esse animal
  const participacoes: any[] = []
  
  todosIatfs.forEach(p => {
    const dadosNoProtocolo = p.animais?.find((a: any) => String(a.femea).trim() === String(animal.value.femea).trim())
    if (dadosNoProtocolo) {
      participacoes.push({
        protocoloId: p.id,
        protocolo: p,
        dados: dadosNoProtocolo
      })
    }
  })
  
  // Ordenar por data (mais recente primeiro)
  participacoes.sort((a, b) => new Date(b.protocolo.createdAt).getTime() - new Date(a.protocolo.createdAt).getTime())
  
  historico.value = participacoes
})
</script>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
