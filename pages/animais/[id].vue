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
          <span :class="['ag-badge', animal.status_prenhez === 'Prenhe' ? 'ag-badge-green' : (animal.status_prenhez === 'Vazia' ? 'ag-badge-yellow' : 'ag-badge-gray')]" style="font-size:0.75rem; padding:0.2rem 0.6rem; background: var(--ag-bg-2); color: var(--ag-text-2); border-color: var(--ag-border);">
            {{ animal.status_prenhez || 'S/ Diagnóstico' }}
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

      <!-- Tabs -->
      <div style="display:flex; gap:1rem; border-bottom:1px solid var(--ag-border); margin-bottom:1.25rem;">
        <button 
          :class="['ag-tab-btn', activeTab === 'reprodutivo' ? 'active' : '']"
          @click="activeTab = 'reprodutivo'"
        >
          Reprodutivo
        </button>
        <button 
          :class="['ag-tab-btn', activeTab === 'sanidade' ? 'active' : '']"
          @click="activeTab = 'sanidade'"
        >
          Sanidade
        </button>
      </div>

      <!-- Tab Content: Reprodutivo -->
      <div v-if="activeTab === 'reprodutivo'">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:0.5rem;">
          <p class="ag-section-title" style="margin:0;">Participações em IATF</p>
        </div>
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

      <!-- Tab Content: Sanidade -->
      <div v-if="activeTab === 'sanidade'">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:0.5rem;">
          <p class="ag-section-title" style="margin:0;">Registros de Saúde</p>
          <Button size="small" icon="pi pi-plus" label="Novo" @click="showSanidadeModal = true" />
        </div>
        
        <div v-if="registrosSanidade.length === 0" class="ag-card" style="text-align:center; padding:2rem 1rem; color:var(--ag-text-3); font-size:0.875rem;">
          Nenhum registro de saúde cadastrado para esta fêmea.
        </div>
        
        <div v-else style="display:flex; flex-direction:column; gap:0.75rem;">
          <div v-for="reg in registrosSanidade" :key="reg.id" class="ag-card" style="display:flex; flex-direction:column; gap:0.5rem; border-left:4px solid var(--ag-primary);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <span class="ag-badge" style="background:var(--ag-primary-light); color:var(--ag-primary);">{{ reg.tipo }}</span>
              <span style="font-size:0.75rem; color:var(--ag-text-3); font-weight:600;">{{ formatData(reg.data) }}</span>
            </div>
            <p style="font-size:0.875rem; color:var(--ag-text); margin:0;">{{ reg.descricao }}</p>
            <div v-if="reg.custo" style="font-size:0.75rem; font-weight:600; color:var(--ag-text-2); margin-top:0.25rem;">
              Custo: R$ {{ reg.custo.toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal Sanidade -->
    <AppModal v-model="showSanidadeModal" title="Novo Registro de Saúde">
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          <label class="ag-label" style="margin:0;">Tipo de Manejo</label>
          <Select v-model="formSanidade.tipo" :options="['Vacina', 'Vermífugo', 'Tratamento', 'Outro']" placeholder="Selecione..." style="width:100%" />
        </div>
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          <label class="ag-label" style="margin:0;">Data</label>
          <InputText v-model="formSanidade.data" type="date" style="width:100%" />
        </div>
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          <label class="ag-label" style="margin:0;">Descrição (Medicamento, dosagem...)</label>
          <InputText v-model="formSanidade.descricao" type="text" placeholder="Ex: Ivermectina 1%" style="width:100%" />
        </div>
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          <label class="ag-label" style="margin:0;">Custo (Opcional - R$)</label>
          <InputText v-model="formSanidade.custo" type="number" step="0.01" placeholder="0.00" style="width:100%" />
        </div>
      </div>
      <template #footer>
        <div style="display:flex; gap:1rem; width:100%; margin-top:1rem;">
          <Button label="Cancelar" outlined @click="showSanidadeModal = false" style="flex:1" severity="secondary" />
          <Button label="Salvar" :loading="saving" @click="salvarSanidade" style="flex:1" />
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { db } from '~/plugins/dexie.client'
import Button from 'primevue/button'
import AppModal from '~/components/AppModal.vue'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { useSync } from '~/composables/useSync'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const { addToQueue } = useSync()
const appStore = useAppStore()

const animal = ref<any>(null)
const lotes = ref<any[]>([])
const propriedades = ref<any[]>([])
const historico = ref<any[]>([])

// Sanidade Refs
const activeTab = ref('reprodutivo')
const showSanidadeModal = ref(false)
const saving = ref(false)
const registrosSanidade = ref<any[]>([])
const formSanidade = ref({
  tipo: '',
  data: new Date().toISOString().split('T')[0],
  descricao: '',
  custo: ''
})

const getNomeLote = (id: number) => lotes.value.find(l => l.id === id)?.nome ?? '—'
const getNomeFazenda = (id: number) => propriedades.value.find(p => p.id === id)?.nome ?? '—'

const formatData = (isoDate: string) => {
  if (!isoDate) return ''
  const [y, m, d] = isoDate.split('-')
  return `${d}/${m}/${y}`
}

const loadSanidade = async (animalId: number) => {
  const registros = await db.sanidade.where('animalId').equals(animalId).toArray()
  // Ordenar mais recente primeiro
  registrosSanidade.value = registros.sort((a,b) => new Date(b.data).getTime() - new Date(a.data).getTime())
}

const salvarSanidade = async () => {
  if (!formSanidade.value.tipo || !formSanidade.value.data || !formSanidade.value.descricao) {
    appStore.notify('Preencha os campos obrigatórios (Tipo, Data, Descrição).', 'warning')
    return
  }
  
  saving.value = true
  try {
    const novoRegistro = {
      animalId: animal.value.id,
      tipo: formSanidade.value.tipo as any,
      data: formSanidade.value.data,
      descricao: formSanidade.value.descricao,
      custo: formSanidade.value.custo ? Number(formSanidade.value.custo) : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: false
    }
    
    const id = await db.sanidade.add(novoRegistro)
    await addToQueue('create', 'sanidade', id as number, novoRegistro)
    
    await loadSanidade(animal.value.id)
    showSanidadeModal.value = false
    formSanidade.value = {
      tipo: '',
      data: new Date().toISOString().split('T')[0],
      descricao: '',
      custo: ''
    }
    appStore.notify('Registro salvo com sucesso!', 'success')
  } catch (e) {
    console.error(e)
    appStore.notify('Erro ao salvar registro de saúde.', 'error')
  } finally {
    saving.value = false
  }
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
  
  await loadSanidade(animal.value.id)
})
</script>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
