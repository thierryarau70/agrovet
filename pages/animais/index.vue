<template>
  <div>
    <PageHeader title="Animais" :subtitle="`${animais.length} cadastrado(s)`" back="/">
      <template #actions>
        <button class="btn-primary btn-sm" @click="openModal">+ Novo</button>
      </template>
    </PageHeader>

    <!-- Search -->
    <div class="max-w-2xl mx-auto px-4 pt-3">
      <input
        v-model="search"
        type="search"
        class="input-field"
        placeholder="🔍 Buscar fêmea, categoria..."
      />
    </div>

    <div class="page-container">
      <div v-if="filtered.length === 0" class="card text-center py-10 text-gray-500 text-sm mt-2">
        <span class="text-4xl block mb-3">🐄</span>
        {{ search ? 'Nenhum animal encontrado.' : 'Nenhum animal cadastrado.' }}
        <button v-if="!search" class="block mt-2 text-brand-400 mx-auto" @click="openModal">+ Cadastrar animal</button>
      </div>

      <div v-else class="space-y-2 mt-2">
        <div
          v-for="a in filtered" :key="a.id"
          class="card flex items-center justify-between"
        >
          <div>
            <p class="font-medium text-white">{{ a.femea }}</p>
            <p class="text-xs text-gray-500">
              {{ getNomeLote(a.loteId) }} • {{ a.categoria }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span :class="['badge', a.synced ? 'badge-green' : 'badge-yellow']">
              {{ a.synced ? '✓' : '⏳' }}
            </span>
            <button class="text-gray-600 hover:text-red-400 p-1" @click="deleteAnimal(a.id!)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <AppModal v-model="showModal" title="Novo Animal">
      <form @submit.prevent="saveAnimal" class="space-y-4">
        <div>
          <label class="label">Lote *</label>
          <select v-model="form.loteId" class="input-field" required>
            <option value="" disabled>Selecione o lote...</option>
            <option v-for="l in lotes" :key="l.id" :value="l.id">{{ l.nome }} ({{ getNomeFazenda(l.propriedadeId) }})</option>
          </select>
        </div>
        <div>
          <label class="label">Identificação (Fêmea) *</label>
          <input v-model="form.femea" class="input-field" placeholder="Ex: 123, TAG-456" required />
        </div>
        <div>
          <label class="label">Categoria</label>
          <select v-model="form.categoria" class="input-field">
            <option>Novilha</option>
            <option>Vaca</option>
            <option>Matriz</option>
            <option>Bezerra</option>
          </select>
        </div>
        <div>
          <label class="label">Observação</label>
          <textarea v-model="form.observacao" class="input-field" rows="2" placeholder="Opcional..." />
        </div>
      </form>
      <template #footer>
        <div class="flex gap-3">
          <button class="btn-secondary flex-1" @click="showModal = false">Cancelar</button>
          <button class="btn-primary flex-1" :disabled="saving" @click="saveAnimal">
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
const animais = ref<any[]>([])
const lotes = ref<any[]>([])
const propriedades = ref<any[]>([])
const search = ref('')

const form = reactive({ loteId: '' as any, femea: '', categoria: 'Novilha', observacao: '' })

const filtered = computed(() =>
  animais.value.filter(a =>
    !search.value ||
    a.femea.toLowerCase().includes(search.value.toLowerCase()) ||
    a.categoria.toLowerCase().includes(search.value.toLowerCase())
  )
)

const getNomeLote = (id: number) => lotes.value.find(l => l.id === id)?.nome ?? '—'
const getNomeFazenda = (id: number) => propriedades.value.find(p => p.id === id)?.nome ?? '—'

const load = async () => {
  animais.value = await db.animais.toArray()
  lotes.value = await db.lotes.toArray()
  propriedades.value = await db.propriedades.toArray()
}

const openModal = () => {
  Object.assign(form, { loteId: '', femea: '', categoria: 'Novilha', observacao: '' })
  showModal.value = true
}

const saveAnimal = async () => {
  if (!form.loteId || !form.femea) return
  saving.value = true
  try {
    const now = new Date().toISOString()
    const loteId = Number(form.loteId)
    const count = await db.animais.where('loteId').equals(loteId).count()
    const dataToSave = { ...form, loteId, ord: count + 1, createdAt: now, updatedAt: now, synced: false }
    const id = await db.animais.add(dataToSave)
    await addToQueue('create', 'animais', id as number, dataToSave)
    appStore.notify('Animal salvo!', 'success')
    showModal.value = false
    await load()
  } finally {
    saving.value = false
  }
}

const deleteAnimal = async (id: number) => {
  if (!confirm('Excluir este animal?')) return
  await db.animais.delete(id)
  await load()
}

onMounted(load)
</script>
