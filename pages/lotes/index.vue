<template>
  <div>
    <PageHeader title="Lotes" :subtitle="`${lotes.length} cadastrado(s)`" back="/">
      <template #actions>
        <Button size="small" label="+ Novo" @click="openModal" />
      </template>
    </PageHeader>

    <div class="page-container">
      <div v-if="lotes.length === 0" class="ag-card" style="text-align:center; padding:2.5rem 1rem; color:var(--ag-text-3);">
        <span style="font-size:2.5rem; display:block; margin-bottom:0.75rem;">📦</span>
        Nenhum lote cadastrado.
        <button @click="openModal" style="display:block; margin:0.5rem auto 0; color:var(--ag-primary); font-weight:600; background:none; border:none; cursor:pointer; font-size:0.875rem;">+ Cadastrar lote</button>
      </div>

      <div v-else style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.5rem;">
        <div v-for="l in lotes" :key="l.id" class="ag-card" style="display:flex; align-items:center; justify-content:space-between;">
          <div>
            <p style="font-weight:600; color:var(--ag-text); margin:0; font-size:0.9375rem;">{{ l.nome }}</p>
            <p style="font-size:0.75rem; color:var(--ag-text-3); margin:0.15rem 0 0;">{{ getNomeFazenda(l.propriedadeId) }} • {{ l.categoria }} • {{ l.retiro || '—' }}</p>
          </div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span :class="['ag-badge', l.synced ? 'ag-badge-green' : 'ag-badge-yellow']">{{ l.synced ? '✓' : '⏳' }}</span>
            <button
              style="background:none; border:none; cursor:pointer; color:var(--ag-text-3); padding:0.25rem;"
              @click="askDelete(l)"
              onmouseover="this.style.color='#dc2626'"
              onmouseout="this.style.color='var(--ag-text-3)'"
            >
              <svg style="width:1rem;height:1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Criar Modal -->
    <LoteModal v-model="showModal" @saved="load" />
  </div>
</template>

<script setup lang="ts">
import { db } from '~/plugins/dexie.client'
import Button from 'primevue/button'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

definePageMeta({ layout: 'default' })

const appStore = useAppStore()
const confirm = useConfirm()
const toast = useToast()

const showModal = ref(false)
const lotes = ref<any[]>([])
const propriedades = ref<any[]>([])

const getNomeFazenda = (id: number) => propriedades.value.find(p => p.id === id)?.nome ?? '—'

const load = async () => {
  lotes.value = await db.lotes.toArray()
  propriedades.value = await db.propriedades.toArray()
}

const openModal = () => {
  showModal.value = true
}

const askDelete = (l: any) => {
  confirm.require({
    message: `Tem certeza que deseja excluir o lote "${l.nome}"? Esta ação não pode ser desfeita e excluirá também todos os animais vinculados.`,
    header: 'Excluir Lote?',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    acceptLabel: 'Excluir',
    rejectLabel: 'Cancelar',
    accept: async () => {
      try {
        await db.lotes.delete(l.id)
        await load()
        appStore.notify('Lote excluído.', 'info')
      } catch (e) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível excluir o lote.' })
      }
    }
  })
}

onMounted(load)
</script>

