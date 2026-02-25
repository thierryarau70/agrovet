<template>
  <div>
    <!-- Criar Modal -->
    <AppModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" title="Novo Animal">
      <form @submit.prevent="askCreate" style="display:flex; flex-direction:column; gap:1rem;">
        <div>
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Lote *</label>
          <Select v-model="form.loteId" :options="lotes" :option-label="(l) => `${l.nome} (${getNomeFazenda(l.propriedadeId)})`" optionValue="id" placeholder="Selecione o lote..." style="width:100%;" required appendTo="body" />
        </div>
        <div>
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Identificação (Fêmea) *</label>
          <InputText v-model="form.femea" placeholder="Ex: 123, TAG-456" required style="width:100%;" />
        </div>
        <div>
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Categoria</label>
          <Select v-model="form.categoria" :options="['Novilha','Vaca','Matriz','Bezerra']" placeholder="Selecione..." style="width:100%;" appendTo="body" />
        </div>
        <div>
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Observação</label>
          <Textarea v-model="form.observacao" rows="2" placeholder="Opcional..." style="width:100%;" />
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
      title="Cadastrar Animal?"
      :message="`Deseja cadastrar a fêmea &quot;${form.femea}&quot; (${form.categoria})?`"
      type="success"
      confirm-label="Cadastrar"
      @confirm="saveAnimal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { db } from '~/plugins/dexie.client'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'saved'])

const appStore = useAppStore()
const { addToQueue } = useSync()

const saving = ref(false)
const confirmCreate = ref(false)
const lotes = ref<any[]>([])
const propriedades = ref<any[]>([])

const form = reactive({ loteId: '' as any, femea: '', categoria: 'Novilha', observacao: '' })

const getNomeFazenda = (id: number) => propriedades.value.find(p => p.id === id)?.nome ?? '—'

const loadDados = async () => {
  lotes.value = await db.lotes.toArray()
  propriedades.value = await db.propriedades.toArray()
}

watch(() => props.modelValue, async (val) => {
  if (val) {
    Object.assign(form, { loteId: '', femea: '', categoria: 'Novilha', observacao: '' })
    await loadDados()
  }
})

onMounted(loadDados)

const askCreate = () => {
  if (!form.loteId) { appStore.notify('Selecione um lote.', 'error'); return }
  if (!form.femea) { appStore.notify('Informe a identificação da fêmea.', 'error'); return }
  confirmCreate.value = true
}

const saveAnimal = async () => {
  saving.value = true
  emit('update:modelValue', false)
  try {
    const now = new Date().toISOString()
    const loteId = Number(form.loteId)
    const count = await db.animais.where('loteId').equals(loteId).count()
    const genId = Date.now() + Math.floor(Math.random() * 1000)
    const dataToSave = { id: genId, ...form, loteId, ord: count + 1, createdAt: now, updatedAt: now, synced: false }
    const id = await db.animais.add(dataToSave)
    await addToQueue('create', 'animais', id as number, dataToSave)
    appStore.notify('Animal salvo!', 'success')
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script
