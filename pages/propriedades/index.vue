<template>
  <div>
    <PageHeader title="Fazendas" :subtitle="`${propriedades.length} cadastrada(s)`" back="/">
      <template #actions>
        <Button size="small" label="+ Nova" @click="showModal = true" />
      </template>
    </PageHeader>

    <div class="page-container">
      <div v-if="propriedades.length === 0" class="ag-card" style="text-align:center; padding:2.5rem 1rem; color:var(--ag-text-3);">
        <span style="font-size:2.5rem; display:block; margin-bottom:0.75rem;">🏡</span>
        Nenhuma fazenda cadastrada.
        <button @click="showModal = true" style="display:block; margin:0.5rem auto 0; color:var(--ag-primary); font-weight:600; background:none; border:none; cursor:pointer; font-size:0.875rem;">+ Cadastrar fazenda</button>
      </div>

      <div v-else style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.5rem;">
        <div
          v-for="p in propriedades" :key="p.id"
          class="ag-card"
          style="display:flex; align-items:center; justify-content:space-between;"
        >
          <div>
            <p style="font-weight:600; color:var(--ag-text); margin:0; font-size:0.9375rem;">{{ p.nome }}</p>
            <p style="font-size:0.75rem; color:var(--ag-text-3); margin:0.15rem 0 0;">{{ p.proprietario }} • {{ p.municipio }}/{{ p.estado }}</p>
          </div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span :class="['ag-badge', p.synced ? 'ag-badge-green' : 'ag-badge-yellow']">{{ p.synced ? '✓ Sync' : '⏳' }}</span>
            <button style="background:none; border:none; cursor:pointer; color:var(--ag-text-3); padding:0.25rem; border-radius:0.375rem; transition:color .2s;" @click="deleteProp(p.id!)"
              onmouseover="this.style.color='#dc2626'" onmouseout="this.style.color='var(--ag-text-3)'">
              <svg style="width:1rem;height:1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <AppModal v-model="showModal" title="Nova Fazenda">
      <form @submit.prevent="saveProp" style="display:flex; flex-direction:column; gap:1rem;">
        <div>
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Nome da Fazenda *</label>
          <InputText v-model="form.nome" placeholder="Ex: Fazenda São João" required style="width:100%;" />
        </div>
        <div>
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Proprietário *</label>
          <InputText v-model="form.proprietario" placeholder="Nome completo" required style="width:100%;" />
        </div>
        <div style="display:grid; grid-template-columns:1fr 80px; gap:0.75rem;">
          <div>
            <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Município</label>
            <InputText v-model="form.municipio" placeholder="Cidade" style="width:100%;" />
          </div>
          <div>
            <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Estado</label>
            <InputText v-model="form.estado" v-maska="'@@'" placeholder="UF" style="width:100%; text-transform:uppercase;" />
          </div>
        </div>
      </form>
      <template #footer>
        <div style="display:flex; gap:0.75rem;">
          <Button label="Cancelar" severity="secondary" outlined style="flex:1;" @click="showModal = false" />
          <Button label="Salvar" :loading="saving" style="flex:1;" @click="saveProp" />
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { db } from '~/plugins/dexie.client'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

definePageMeta({ layout: 'default' })

const appStore = useAppStore()
const { addToQueue } = useSync()

const showModal = ref(false)
const saving = ref(false)
const propriedades = ref<any[]>([])
const form = reactive({ nome: '', proprietario: '', municipio: '', estado: '' })

const load = async () => { propriedades.value = await db.propriedades.toArray() }

const saveProp = async () => {
  if (!form.nome || !form.proprietario) return
  saving.value = true
  try {
    const now = new Date().toISOString()
    const id = await db.propriedades.add({ ...form, createdAt: now, updatedAt: now, synced: false })
    await addToQueue('create', 'propriedades', id as number, { ...form })
    appStore.notify('Fazenda salva com sucesso!', 'success')
    Object.assign(form, { nome: '', proprietario: '', municipio: '', estado: '' })
    showModal.value = false
    await load()
  } finally { saving.value = false }
}

const deleteProp = async (id: number) => {
  if (!confirm('Excluir esta fazenda?')) return
  await db.propriedades.delete(id)
  await load()
  appStore.notify('Fazenda excluída.', 'info')
}

onMounted(load)
</script>
