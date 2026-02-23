<template>
  <div>
    <PageHeader title="Lotes" :subtitle="`${lotes.length} cadastrado(s)`" back="/">
      <template #actions>
        <button class="btn-primary btn-sm" @click="openModal">+ Novo</button>
      </template>
    </PageHeader>

    <div class="page-container">
      <div v-if="lotes.length === 0" class="card text-center py-10 text-gray-500 text-sm mt-4">
        <span class="text-4xl block mb-3">📦</span>
        Nenhum lote cadastrado.
        <button class="block mt-2 text-brand-400 mx-auto" @click="openModal">+ Cadastrar lote</button>
      </div>

      <div v-else class="space-y-2 mt-2">
        <div
          v-for="l in lotes" :key="l.id"
          class="card flex items-center justify-between hover:border-brand-800 transition-colors"
        >
          <div>
            <p class="font-medium text-white">{{ l.nome }}</p>
            <p class="text-xs text-gray-500">
              {{ getNomeFazenda(l.propriedadeId) }} •
              Categoria: {{ l.categoria }} •
              Retiro: {{ l.retiro || '—' }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span :class="['badge', l.synced ? 'badge-green' : 'badge-yellow']">
              {{ l.synced ? '✓' : '⏳' }}
            </span>
            <button class="text-gray-600 hover:text-red-400 transition-colors p-1" @click="deleteLote(l.id!)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <AppModal v-model="showModal" title="Novo Lote">
      <form @submit.prevent="saveLote" class="space-y-4">
        <div>
          <label class="label">Fazenda *</label>
          <select v-model="form.propriedadeId" class="input-field" required>
            <option value="" disabled>Selecione...</option>
            <option v-for="p in propriedades" :key="p.id" :value="p.id">{{ p.nome }}</option>
          </select>
        </div>
        <div>
          <label class="label">Nome do Lote *</label>
          <input v-model="form.nome" class="input-field" placeholder="Ex: Lote A1" required />
        </div>
        <div>
          <label class="label">Categoria *</label>
          <select v-model="form.categoria" class="input-field" required>
            <option value="" disabled>Selecione...</option>
            <option>Novilhas</option>
            <option>Vacas</option>
            <option>Matrizes</option>
            <option>Bezerra</option>
            <option>Outro</option>
          </select>
        </div>
        <div>
          <label class="label">Retiro</label>
          <input v-model="form.retiro" class="input-field" placeholder="Nome do retiro (opcional)" />
        </div>
      </form>
      <template #footer>
        <div class="flex gap-3">
          <button class="btn-secondary flex-1" @click="showModal = false">Cancelar</button>
          <button class="btn-primary flex-1" :disabled="saving" @click="saveLote">
            {{ saving ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { db } from '~/plugins/dexie.client'

definePageMeta({ layout: 'default' })

const appStore = useAppStore()
const { addToQueue } = useSync()

const showModal = ref(false)
const saving = ref(false)
const lotes = ref<any[]>([])
const propriedades = ref<any[]>([])

const form = reactive({ propriedadeId: '' as any, nome: '', categoria: '', retiro: '' })

const getNomeFazenda = (id: number) => propriedades.value.find(p => p.id === id)?.nome ?? '—'

const load = async () => {
  lotes.value = await db.lotes.toArray()
  propriedades.value = await db.propriedades.toArray()
}

const openModal = () => {
  Object.assign(form, { propriedadeId: '', nome: '', categoria: '', retiro: '' })
  showModal.value = true
}

const saveLote = async () => {
  if (!form.propriedadeId || !form.nome || !form.categoria) return
  saving.value = true
  try {
    const now = new Date().toISOString()
    const dataToSave = { 
      ...form, 
      propriedadeId: Number(form.propriedadeId),
      createdAt: now, 
      updatedAt: now, 
      synced: false 
    }
    const id = await db.lotes.add(dataToSave)
    await addToQueue('create', 'lotes', id as number, dataToSave)
    appStore.notify('Lote salvo!', 'success')
    showModal.value = false
    await load()
  } finally {
    saving.value = false
  }
}

const deleteLote = async (id: number) => {
  if (!confirm('Excluir este lote?')) return
  await db.lotes.delete(id)
  await load()
}

onMounted(load)
</script>
