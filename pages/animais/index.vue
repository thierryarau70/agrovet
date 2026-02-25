<template>
  <div>
    <PageHeader title="Animais" :subtitle="`${animais.length} cadastrado(s)`" back="/">
      <template #actions>
        <Button size="small" label="+ Novo" @click="openModal" />
      </template>
    </PageHeader>

    <!-- Search -->
    <div style="max-width:860px; margin:0 auto; padding:0.75rem 1rem 0;">
      <InputText v-model="search" placeholder="🔍 Buscar fêmea, categoria..." style="width:100%;" />
    </div>

    <div class="page-container">
      <div v-if="filtered.length === 0" class="ag-card" style="text-align:center; padding:2.5rem 1rem; color:var(--ag-text-3); margin-top:0.5rem;">
        <span style="font-size:2.5rem; display:block; margin-bottom:0.75rem;">🐄</span>
        {{ search ? 'Nenhum animal encontrado.' : 'Nenhum animal cadastrado.' }}
        <button v-if="!search" @click="openModal" style="display:block; margin:0.5rem auto 0; color:var(--ag-primary); font-weight:600; background:none; border:none; cursor:pointer; font-size:0.875rem;">+ Cadastrar animal</button>
      </div>

      <div v-else style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.5rem;">
        <div v-for="a in filtered" :key="a.id" class="ag-card" style="display:flex; align-items:center; justify-content:space-between; cursor:pointer;" @click="useRouter().push(`/animais/${a.id}`)">
          <div>
            <p style="font-weight:600; color:var(--ag-text); margin:0; font-size:0.9375rem;">{{ a.femea }}</p>
            <p style="font-size:0.75rem; color:var(--ag-text-3); margin:0.15rem 0 0;">{{ getNomeLote(a.loteId) }} • {{ a.categoria }}</p>
          </div>
          <div style="display:flex; align-items:center; gap:0.5rem;" @click.stop>
            <span v-if="a.status_prenhez" :class="['ag-badge', a.status_prenhez === 'Prenhe' ? 'ag-badge-green' : '']"
              :style="a.status_prenhez !== 'Prenhe' ? 'background:rgba(220,38,38,.12);color:#dc2626;border-color:rgba(220,38,38,.3);' : ''">
              {{ a.status_prenhez }}
            </span>
            <span :class="['ag-badge', a.synced ? 'ag-badge-green' : 'ag-badge-yellow']">{{ a.synced ? '✓' : '⏳' }}</span>
            <button
              style="background:none; border:none; cursor:pointer; color:var(--ag-text-3); padding:0.25rem;"
              @click.stop="askDelete(a)"
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
    <AnimalModal v-model="showModal" @saved="load" />

    <!-- Confirmação Deletar -->
    <AppConfirmModal
      v-model="confirmDelete"
      title="Excluir Animal?"
      :message="`Tem certeza que deseja excluir a fêmea &quot;${targetToDelete?.femea}&quot;? Esta ação não pode ser desfeita.`"
      type="danger"
      confirm-label="Excluir"
      @confirm="doDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { db } from '~/plugins/dexie.client'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

definePageMeta({ layout: 'default' })

const appStore = useAppStore()

const showModal = ref(false)
const animais = ref<any[]>([])
const lotes = ref<any[]>([])
const propriedades = ref<any[]>([])
const search = ref('')

const confirmDelete = ref(false)
const targetToDelete = ref<any>(null)

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
  showModal.value = true
}

const askDelete = (a: any) => {
  targetToDelete.value = a
  confirmDelete.value = true
}

const doDelete = async () => {
  if (!targetToDelete.value) return
  await db.animais.delete(targetToDelete.value.id)
  await load()
  appStore.notify('Animal excluído.', 'info')
  targetToDelete.value = null
}

onMounted(load)
</script>

