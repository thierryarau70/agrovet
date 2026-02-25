<template>
  <div>
    <!-- Criar Modal -->
    <AppModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" title="Nova Fazenda">
      <form @submit.prevent="askCreate" style="display:flex; flex-direction:column; gap:1rem;">
        <div>
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Nome da Fazenda *</label>
          <InputText v-model="form.nome" placeholder="Ex: Fazenda São João" required maxlength="50" style="width:100%;" />
        </div>
        <div>
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Proprietário *</label>
          <InputText v-model="form.proprietario" placeholder="Nome completo" required maxlength="50" style="width:100%;" />
        </div>
        <div style="display:grid; grid-template-columns:1fr 80px; gap:0.75rem;">
          <div>
            <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Município</label>
            <InputText v-model="form.municipio" placeholder="Cidade" maxlength="50" style="width:100%;" />
          </div>
          <div>
            <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Estado</label>
            <InputText v-model="form.estado" v-maska="'@@'" placeholder="UF" maxlength="2" style="width:100%; text-transform:uppercase;" />
          </div>
        </div>
      </form>
      <template #footer>
        <div style="display:flex; gap:0.75rem;">
          <Button label="Cancelar" severity="secondary" outlined style="flex:1;" @click="$emit('update:modelValue', false)" />
          <Button label="Salvar" style="flex:1;" @click="askCreate" :disabled="saving" />
        </div>
      </template>
    </AppModal>

    <!-- Confirmação Criar -->
    <AppConfirmModal
      v-model="confirmCreate"
      title="Salvar Fazenda?"
      :message="`Deseja cadastrar a fazenda &quot;${form.nome}&quot; para ${form.proprietario}?`"
      type="success"
      confirm-label="Cadastrar"
      @confirm="saveProp"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { db } from '~/plugins/dexie.client'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'saved'])

const appStore = useAppStore()
const { addToQueue } = useSync()

const saving = ref(false)
const confirmCreate = ref(false)
const form = reactive({ nome: '', proprietario: '', municipio: '', estado: '' })

watch(() => props.modelValue, (val) => {
  if (val) {
    Object.assign(form, { nome: '', proprietario: '', municipio: '', estado: '' })
  }
})

const askCreate = () => {
  if (!form.nome) { appStore.notify('Informe o nome da fazenda.', 'error'); return }
  if (!form.proprietario) { appStore.notify('Informe o proprietário.', 'error'); return }
  confirmCreate.value = true
}

const saveProp = async () => {
  saving.value = true
  emit('update:modelValue', false)
  try {
    const now = new Date().toISOString()
    const genId = Date.now() + Math.floor(Math.random() * 1000)
    const dataToSave = { id: genId, ...form, createdAt: now, updatedAt: now, synced: false }
    const id = await db.propriedades.add(dataToSave)
    await addToQueue('create', 'propriedades', id as number, dataToSave)
    appStore.notify('Fazenda salva com sucesso!', 'success')
    Object.assign(form, { nome: '', proprietario: '', municipio: '', estado: '' })
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script>
