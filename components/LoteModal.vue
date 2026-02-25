<template>
  <div>
    <!-- Criar Modal -->
    <AppModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" title="Novo Lote">
      <form @submit.prevent="askCreate" style="display:flex; flex-direction:column; gap:1rem;">
        <div>
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Fazenda *</label>
          <Select v-model="form.propriedadeId" :options="propriedades" optionLabel="nome" optionValue="id" placeholder="Selecione..." style="width:100%;" required appendTo="body" />
        </div>
        <div>
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Nome do Lote *</label>
          <InputText v-model="form.nome" placeholder="Ex: Lote A1" required maxlength="50" style="width:100%;" />
        </div>
        <div>
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Categoria *</label>
          <Select v-model="form.categoria" :options="['Novilhas','Vacas','Matrizes','Bezerra','Outro']" placeholder="Selecione..." style="width:100%;" required appendTo="body" />
        </div>
        <div>
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Retiro</label>
          <InputText v-model="form.retiro" placeholder="Nome do retiro (opcional)" maxlength="50" style="width:100%;" />
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
      title="Salvar Lote?"
      :message="`Deseja cadastrar o lote &quot;${form.nome}&quot; (${form.categoria})?`"
      type="success"
      confirm-label="Cadastrar"
      @confirm="saveLote"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { db } from '~/plugins/dexie.client'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'saved'])

const appStore = useAppStore()
const { addToQueue } = useSync()

const saving = ref(false)
const confirmCreate = ref(false)
const propriedades = ref<any[]>([])
const form = reactive({ propriedadeId: '' as any, nome: '', categoria: '', retiro: '' })

const loadDados = async () => {
  propriedades.value = await db.propriedades.toArray()
}

watch(() => props.modelValue, async (val) => {
  if (val) {
    Object.assign(form, { propriedadeId: '', nome: '', categoria: '', retiro: '' })
    await loadDados()
  }
})

onMounted(loadDados)

const askCreate = () => {
  if (!form.propriedadeId) { appStore.notify('Selecione uma fazenda.', 'error'); return }
  if (!form.nome) { appStore.notify('Informe o nome do lote.', 'error'); return }
  if (!form.categoria) { appStore.notify('Selecione a categoria.', 'error'); return }
  confirmCreate.value = true
}

const saveLote = async () => {
  saving.value = true
  emit('update:modelValue', false)
  try {
    const now = new Date().toISOString()
    const genId = Date.now() + Math.floor(Math.random() * 1000)
    const dataToSave = { id: genId, ...form, propriedadeId: Number(form.propriedadeId), createdAt: now, updatedAt: now, synced: false }
    const id = await db.lotes.add(dataToSave)
    await addToQueue('create', 'lotes', id as number, dataToSave)
    appStore.notify('Lote salvo!', 'success')
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script>
