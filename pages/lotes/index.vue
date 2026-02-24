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
    <AppModal v-model="showModal" title="Novo Lote">
      <form @submit.prevent="askCreate" style="display:flex; flex-direction:column; gap:1rem;">
        <div>
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Fazenda *</label>
          <Select v-model="form.propriedadeId" :options="propriedades" optionLabel="nome" optionValue="id" placeholder="Selecione..." style="width:100%;" required />
        </div>
        <div>
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Nome do Lote *</label>
          <InputText v-model="form.nome" placeholder="Ex: Lote A1" required style="width:100%;" />
        </div>
        <div>
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Categoria *</label>
          <Select v-model="form.categoria" :options="['Novilhas','Vacas','Matrizes','Bezerra','Outro']" placeholder="Selecione..." style="width:100%;" required />
        </div>
        <div>
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Retiro</label>
          <InputText v-model="form.retiro" placeholder="Nome do retiro (opcional)" style="width:100%;" />
        </div>
      </form>
      <template #footer>
        <div style="display:flex; gap:0.75rem;">
          <Button label="Cancelar" severity="secondary" outlined style="flex:1;" @click="showModal = false" />
          <Button label="Salvar" style="flex:1;" @click="askCreate" />
        </div>
      </template>
    </AppModal>

    <!-- Confirmação Criar -->
    <AppConfirmModal
      v-model="confirmCreate"
      title="Salvar Lote?"
      :message="`Deseja cadastrar o lote &quot;${form.nome}&quot; (${form.categoria})?`"
      type="success"
      confirm-label="Cadastrar"
      @confirm="saveLote"
    />

    <!-- Confirmação Deletar -->
    <AppConfirmModal
      v-model="confirmDelete"
      title="Excluir Lote?"
      :message="`Tem certeza que deseja excluir o lote &quot;${targetToDelete?.nome}&quot;? Esta ação não pode ser desfeita.`"
      type="danger"
      confirm-label="Excluir"
      @confirm="doDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { db } from '~/plugins/dexie.client'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'

definePageMeta({ layout: 'default' })

const appStore = useAppStore()
const { addToQueue } = useSync()

const showModal = ref(false)
const saving = ref(false)
const lotes = ref<any[]>([])
const propriedades = ref<any[]>([])
const form = reactive({ propriedadeId: '' as any, nome: '', categoria: '', retiro: '' })

const confirmCreate = ref(false)
const confirmDelete = ref(false)
const targetToDelete = ref<any>(null)

const getNomeFazenda = (id: number) => propriedades.value.find(p => p.id === id)?.nome ?? '—'

const load = async () => {
  lotes.value = await db.lotes.toArray()
  propriedades.value = await db.propriedades.toArray()
}

const openModal = () => {
  Object.assign(form, { propriedadeId: '', nome: '', categoria: '', retiro: '' })
  showModal.value = true
}

const askCreate = () => {
  if (!form.propriedadeId) { appStore.notify('Selecione uma fazenda.', 'error'); return }
  if (!form.nome) { appStore.notify('Informe o nome do lote.', 'error'); return }
  if (!form.categoria) { appStore.notify('Selecione a categoria.', 'error'); return }
  confirmCreate.value = true
}

const saveLote = async () => {
  saving.value = true
  showModal.value = false
  try {
    const now = new Date().toISOString()
    const dataToSave = { ...form, propriedadeId: Number(form.propriedadeId), createdAt: now, updatedAt: now, synced: false }
    const id = await db.lotes.add(dataToSave)
    await addToQueue('create', 'lotes', id as number, dataToSave)
    appStore.notify('Lote salvo!', 'success')
    await load()
  } finally { saving.value = false }
}

const askDelete = (l: any) => {
  targetToDelete.value = l
  confirmDelete.value = true
}

const doDelete = async () => {
  if (!targetToDelete.value) return
  await db.lotes.delete(targetToDelete.value.id)
  await load()
  appStore.notify('Lote excluído.', 'info')
  targetToDelete.value = null
}

onMounted(load)
</script>

