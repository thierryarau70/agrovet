<template>
  <div class="ag-anim-fade-in" style="margin-bottom: 2rem;">
    <!-- Title -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
      <h1 style="font-size:1.5rem; font-weight:700; color:var(--ag-text);">📊 Financeiro</h1>
      <Button icon="pi pi-plus" label="Nova Transação" @click="showTransacaoModal = true" class="p-button-primary" size="small" />
    </div>

    <!-- Cards de Resumo -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem; margin-bottom:2rem;">
      <div class="ag-card" style="padding:1.5rem; background: linear-gradient(145deg, var(--ag-surface), var(--ag-bg-2)); border: 1px solid var(--ag-border); display:flex; flex-direction:column; justify-content:center;">
        <div style="font-size:0.875rem; color:var(--ag-text-2); font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">
          <i class="pi pi-wallet" style="color:var(--ag-text-3);"></i> Saldo Atual
        </div>
        <div :style="{ color: saldo >= 0 ? 'var(--ag-primary)' : '#dc2626' }" style="font-size:2rem; font-weight:800; letter-spacing:-0.5px;">
          R$ {{ saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
        </div>
      </div>
      
      <div class="ag-card" style="padding:1.5rem; display:flex; gap:1.5rem; background:color-mix(in srgb, var(--ag-primary) 4%, transparent); border: 1px solid color-mix(in srgb, var(--ag-primary) 15%, transparent);">
        <div style="flex:1;">
          <div style="font-size:0.8125rem; color:var(--ag-text-2); font-weight:600; text-transform:uppercase; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.35rem;">
            <div style="width:24px; height:24px; border-radius:50%; background:color-mix(in srgb, var(--ag-primary) 15%, transparent); display:flex; align-items:center; justify-content:center;">
               <i class="pi pi-arrow-up-right" style="color:var(--ag-primary); font-size:0.75rem;"></i>
            </div>
            Receitas
          </div>
          <div style="font-size:1.5rem; font-weight:800; color:var(--ag-text);">R$ {{ totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</div>
        </div>
        <div style="width:1px; background:color-mix(in srgb, var(--ag-border) 80%, transparent);"></div>
        <div style="flex:1;">
          <div style="font-size:0.8125rem; color:var(--ag-text-2); font-weight:600; text-transform:uppercase; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.35rem;">
            <div style="width:24px; height:24px; border-radius:50%; background:color-mix(in srgb, #dc2626 10%, transparent); display:flex; align-items:center; justify-content:center;">
               <i class="pi pi-arrow-down-right" style="color:#dc2626; font-size:0.75rem;"></i>
            </div>
            Despesas
          </div>
          <div style="font-size:1.5rem; font-weight:800; color:var(--ag-text);">R$ {{ totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</div>
        </div>
      </div>
    </div>

    <!-- Tabela Historico -->
    <div class="ag-card" style="margin-bottom:2rem;">
      <h2 style="font-size:1.125rem; font-weight:600; color:var(--ag-text); padding:1.25rem; border-bottom:1px solid var(--ag-border); margin:0;">
        Histórico de Transações
      </h2>
      <div v-if="loading" style="padding:4rem; text-align:center;">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color:var(--ag-primary);"></i>
      </div>
      <div v-else-if="transacoesV.length === 0" style="padding:4rem; text-align:center; display:flex; flex-direction:column; align-items:center; gap:1rem;">
        <div style="width:64px; height:64px; border-radius:50%; background:var(--ag-bg-2); display:flex; justify-content:center; align-items:center;">
          <i class="pi pi-receipt" style="font-size:1.5rem; color:var(--ag-text-3);"></i>
        </div>
        <div style="color:var(--ag-text-2); font-weight:500;">Nenhuma transação registrada ainda no período.</div>
        <Button label="Registrar Transação" severity="secondary" outlined size="small" @click="showTransacaoModal = true" />
      </div>
      <DataTable v-else :value="transacoesV" responsiveLayout="scroll" :paginator="true" :rows="10">
        <Column header="Data" sortable>
          <template #body="{ data }">
            <span style="white-space:nowrap; font-weight: 500;">{{ formatDate(data.data) }}</span>
          </template>
        </Column>
        <Column header="Tipo" sortable>
          <template #body="{ data }">
             <Tag :value="data.tipo" :severity="data.tipo === 'Receita' ? 'success' : 'danger'" rounded />
          </template>
        </Column>
        <Column field="categoria" header="Categoria" sortable>
          <template #body="{ data }">
            <div style="font-weight:600; color:var(--ag-text);">{{ data.categoria }}</div>
            <div v-if="data.descricao" style="font-size:0.75rem; color:var(--ag-text-3); margin-top:0.2rem;">{{ data.descricao }}</div>
          </template>
        </Column>
        <Column header="Valor" sortable>
          <template #body="{ data }">
            <span :style="{ color: data.tipo === 'Receita' ? 'var(--ag-primary)' : '#dc2626', fontWeight: 600 }">
              {{ data.tipo === 'Receita' ? '+' : '-' }} R$ {{ data.valor.toLocaleString('pt-BR', { minimumFractionDigits:2 }) }}
            </span>
          </template>
        </Column>
        <Column>
          <template #body="{ data }">
            <div style="display:flex; justify-content:flex-end; gap:0.5rem; width:100%;">
              <i v-if="!data.synced" class="pi pi-cloud-upload" style="color:var(--ag-text-3); font-size:1rem; margin-right: 0.5rem; align-self:center;" title="Pendente de envio"></i>
              <Button icon="pi pi-trash" severity="danger" text rounded aria-label="Apagar" @click.prevent="apagar(data.id)" style="width:2rem; height:2rem; padding:0;" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modals -->
    <TransacaoModal v-model="showTransacaoModal" @saved="loadTransacoes" />

    <AppConfirmModal
      v-model="confirmDeleteModal"
      title="Apagar Transação"
      message="Tem certeza que deseja apagar essa transação permanentemente?"
      type="danger"
      confirm-label="Apagar"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { db } from '~/plugins/dexie.client'
import type { TransacaoFinanceira } from '~/plugins/dexie.client'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

useHead({ title: 'Financeiro | Agrovet' })

const appStore = useAppStore()
const { addToQueue } = useSync() 
const transacoes = ref<TransacaoFinanceira[]>([])
const loading = ref(true)

const showTransacaoModal = ref(false)

const confirmDeleteModal = ref(false)
const idToDelete = ref<number | null>(null)

onMounted(async () => {
  await loadTransacoes()
})

async function loadTransacoes() {
  loading.value = true
  transacoes.value = await db.financeiro.orderBy('data').reverse().toArray()
  loading.value = false
}

// Watch sync store changes in case data refetches
watch(() => appStore.isSyncing, (syncing) => {
  if (!syncing) loadTransacoes()
})

const transacoesV = computed(() => {
  return transacoes.value
})

const totalReceitas = computed(() => {
  return transacoes.value
    .filter(t => t.tipo === 'Receita')
    .reduce((sum, t) => sum + Number(t.valor), 0)
})

const totalDespesas = computed(() => {
  return transacoes.value
    .filter(t => t.tipo === 'Despesa')
    .reduce((sum, t) => sum + Number(t.valor), 0)
})

const saldo = computed(() => totalReceitas.value - totalDespesas.value)

function apagar(id: number) {
  idToDelete.value = id
  confirmDeleteModal.value = true
}

async function executeDelete() {
  if (!idToDelete.value) return
  try {
    const trx = await db.financeiro.get(idToDelete.value)
    if (trx) {
      await db.financeiro.delete(idToDelete.value)
      if (trx) await addToQueue('delete', 'financeiro', idToDelete.value, trx)
      appStore.notify('Transação apagada.', 'success')
      await loadTransacoes()
    }
  } catch(e) {
    appStore.notify('Erro ao apagar.', 'error')
  } finally {
    confirmDeleteModal.value = false
    idToDelete.value = null
  }
}

function formatDate(isoDate: string) {
  if (!isoDate) return '-'
  try {
     // The date string might just be 'YYYY-MM-DD', treat it directly to avoid timezone shift
     const [year, month, day] = isoDate.split('T')[0].split('-')
     if (day && month && year) return `${day}/${month}/${year}`
     return new Date(isoDate).toLocaleDateString('pt-BR')
  } catch {
    return isoDate
  }
}
</script>
