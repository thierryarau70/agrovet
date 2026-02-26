<template>
  <div>
    <!-- Criar Modal -->
    <AppModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" title="Nova Transação">
      <form @submit.prevent="askCreate" style="display:flex; flex-direction:column; gap:1rem;">
        <!-- Header / Tabs -->
        <div style="display:flex; padding: 0.25rem; background: var(--ag-bg-2); border-radius: 0.5rem; margin-bottom: 0.5rem;">
          <button type="button" 
                  @click="form.tipo = 'Receita'" 
                  :style="form.tipo === 'Receita' ? 'background:var(--ag-surface); color:var(--ag-primary); box-shadow:var(--ag-shadow);' : 'color:var(--ag-text-2);'" 
                  style="flex:1; border:none; padding:0.5rem; font-size:0.875rem; font-weight:600; border-radius:0.375rem; transition:all 0.2s; cursor:pointer;">
            Receita
          </button>
          <button type="button" 
                  @click="form.tipo = 'Despesa'" 
                  :style="form.tipo === 'Despesa' ? 'background:var(--ag-surface); color:#dc2626; box-shadow:var(--ag-shadow);' : 'color:var(--ag-text-2);'" 
                  style="flex:1; border:none; padding:0.5rem; font-size:0.875rem; font-weight:600; border-radius:0.375rem; transition:all 0.2s; cursor:pointer;">
            Despesa
          </button>
        </div>

        <div style="background:var(--ag-surface); border:1px solid var(--ag-border); border-radius:0.5rem; padding:1rem; display:flex; flex-direction:column; gap:1rem;">
          
          <div>
            <label style="display:block; font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:var(--ag-text-2); margin-bottom:0.5rem;">Fazenda *</label>
            <Select v-model="form.propriedadeId" :options="propriedades" optionLabel="nome" optionValue="id" placeholder="Selecione..." class="ag-input-neat w-full" style="width:100%;" required appendTo="body" />
          </div>

          <div style="display:flex; gap:1rem;">
            <div style="flex:1;">
              <label style="display:block; font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:var(--ag-text-2); margin-bottom:0.5rem;">Data *</label>
              <InputText type="date" v-model="form.data" class="ag-input-neat w-full" style="width:100%;" required />
            </div>
            <div style="flex:1;">
              <label style="display:block; font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:var(--ag-text-2); margin-bottom:0.5rem;">Valor (R$) *</label>
              <InputNumber v-model="form.valor" mode="currency" currency="BRL" locale="pt-BR" inputClass="ag-input-neat w-full" style="width:100%;" required />
            </div>
          </div>

          <div>
            <label style="display:block; font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:var(--ag-text-2); margin-bottom:0.5rem;">Categoria *</label>
            <Select v-model="form.categoria" :options="categoriasAtuais" placeholder="Selecione..." class="ag-input-neat w-full" style="width:100%;" required appendTo="body" />
          </div>

          <div>
            <label style="display:block; font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:var(--ag-text-2); margin-bottom:0.5rem;">Descrição</label>
            <InputText v-model="form.descricao" placeholder="Detalhes (opcional)" maxlength="50" class="ag-input-neat w-full" style="width:100%;" />
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
      title="Salvar Transação?"
      :message="`Confirmar o lançamento de R$ ${form.valor || 0} como ${form.tipo}?`"
      type="success"
      confirm-label="Confirmar"
      @confirm="saveTransacao"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { db } from '~/plugins/dexie.client'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import Button from 'primevue/button'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'saved'])

const appStore = useAppStore()
const { addToQueue } = useSync()

const saving = ref(false)
const confirmCreate = ref(false)

const form = reactive({
  propriedadeId: null as number | null,
  tipo: 'Despesa' as 'Receita' | 'Despesa',
  valor: null as number | null,
  data: new Date().toISOString().split('T')[0],
  categoria: '',
  descricao: ''
})

const propriedades = ref<{ id?: number; nome: string }[]>([])

// Categorias Dinâmicas
const catReceitas = ['Venda de Leite', 'Venda de Animais (Lote)', 'Leilão', 'Serviços Prestados', 'Subsídios/Empréstimos', 'Outras Receitas']
const catDespesas = [
  'Alimentação (Ração, Sal, Suplementos)', 
  'Sanidade (Vacinas, Medicamentos)', 
  'Reprodução (Sêmen, IATF, Embrião)',
  'Mão de Obra (Salários, Encargos)', 
  'Manutenção (Máquinas, Cercas, Instalações)', 
  'Combustível e Energia', 
  'Aquisição de Animais',
  'Impostos e Taxas',
  'Outras Despesas'
]

const categoriasAtuais = computed(() => form.tipo === 'Receita' ? catReceitas : catDespesas)

// Limpar categoria se mudar o tipo
watch(() => form.tipo, () => {
  form.categoria = ''
})

async function fetchPropriedades() {
  propriedades.value = await db.propriedades.toArray()
}

onMounted(() => {
  if (props.modelValue) fetchPropriedades()
})

watch(() => props.modelValue, (val) => {
  if (val) {
    fetchPropriedades()
    // Reset
    form.propriedadeId = propriedades.value.length === 1 ? propriedades.value[0]?.id || null : null
    form.tipo = 'Despesa'
    form.valor = null
    form.data = new Date().toISOString().split('T')[0]
    form.categoria = ''
    form.descricao = ''
  }
})

function askCreate() {
  if (!form.propriedadeId || !form.valor || !form.data || !form.categoria) {
    appStore.notify('Preencha os campos obrigatórios', 'error')
    return
  }
  confirmCreate.value = true
}

async function saveTransacao() {
  saving.value = true
  try {
    const now = new Date().toISOString()
    const genId = Date.now() + Math.floor(Math.random() * 1000)
    
    const dataToSave = { 
      id: genId, 
      ...form, 
      valor: form.valor || 0,
      data: (form.data || now.split('T')[0]) as string,
      propriedadeId: Number(form.propriedadeId), 
      createdAt: now, 
      updatedAt: now, 
      synced: false 
    }
    
    const id = await db.financeiro.add(dataToSave)
    await addToQueue('create', 'financeiro', id as number, dataToSave)
    
    appStore.notify('Transação salva!', 'success')
    emit('saved')
    emit('update:modelValue', false)
  } catch (error) {
    console.error('Save error', error)
    appStore.notify('Erro ao salvar', 'error')
  } finally {
    saving.value = false
    confirmCreate.value = false
  }
}
</script>
