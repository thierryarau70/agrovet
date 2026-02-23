<template>
  <div>
    <PageHeader title="Fazendas" :subtitle="`${propriedades.length} cadastrada(s)`" back="/">
      <template #actions>
        <button class="btn-primary btn-sm" @click="showModal = true">+ Nova</button>
      </template>
    </PageHeader>

    <div class="page-container">
      <div v-if="propriedades.length === 0" class="card text-center py-10 text-gray-500 text-sm mt-4">
        <span class="text-4xl block mb-3">🏡</span>
        Nenhuma fazenda cadastrada.
        <button class="block mt-2 text-brand-400 mx-auto" @click="showModal = true">+ Cadastrar fazenda</button>
      </div>

      <div v-else class="space-y-2 mt-2">
        <div
          v-for="p in propriedades" :key="p.id"
          class="card flex items-center justify-between hover:border-brand-800 transition-colors"
        >
          <div>
            <p class="font-medium text-white">{{ p.nome }}</p>
            <p class="text-xs text-gray-500">{{ p.proprietario }} • {{ p.municipio }}/{{ p.estado }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span :class="['badge', p.synced ? 'badge-green' : 'badge-yellow']">
              {{ p.synced ? '✓ Sync' : '⏳' }}
            </span>
            <button class="text-gray-600 hover:text-red-400 transition-colors p-1" @click="deleteProp(p.id!)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <AppModal v-model="showModal" title="Nova Fazenda">
      <form @submit.prevent="saveProp" class="space-y-4">
        <div>
          <label class="label">Nome da Fazenda *</label>
          <input v-model="form.nome" class="input-field" placeholder="Ex: Fazenda São João" required />
        </div>
        <div>
          <label class="label">Proprietário *</label>
          <input v-model="form.proprietario" class="input-field" placeholder="Nome completo" required />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Município</label>
            <input v-model="form.municipio" class="input-field" placeholder="Cidade" />
          </div>
          <div>
            <label class="label">Estado</label>
            <input v-model="form.estado" class="input-field" placeholder="PR" maxlength="2" />
          </div>
        </div>
      </form>
      <template #footer>
        <div class="flex gap-3">
          <button class="btn-secondary flex-1" @click="showModal = false">Cancelar</button>
          <button class="btn-primary flex-1" :disabled="saving" @click="saveProp">
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
const propriedades = ref<any[]>([])

const form = reactive({ nome: '', proprietario: '', municipio: '', estado: '' })

const load = async () => {
  propriedades.value = await db.propriedades.toArray()
}

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
  } finally {
    saving.value = false
  }
}

const deleteProp = async (id: number) => {
  if (!confirm('Excluir esta fazenda?')) return
  await db.propriedades.delete(id)
  await load()
  appStore.notify('Fazenda excluída.', 'info')
}

onMounted(load)
</script>
