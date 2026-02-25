<template>
  <div>
    <!-- Botão de disparo (usado pelos cabeçalhos) -->
    <button
      class="ag-search-trigger"
      @click="openSearch"
      title="Buscar Animal"
    >
      <svg style="width:1.25rem;height:1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>

    <!-- Modal de Busca -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isOpen" class="ag-search-overlay" @click.self="closeSearch">
          <div class="ag-search-modal">
            <div class="ag-search-header">
              <svg style="width:1.25rem;height:1.25rem; color:var(--ag-text-3);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref="searchInput"
                v-model="query"
                type="text"
                class="ag-search-input"
                placeholder="Buscar brinco, nome..."
                @keyup.esc="closeSearch"
              />
              <button class="ag-search-close" @click="closeSearch">
                <svg style="width:1.5rem;height:1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="ag-search-results">
              <div v-if="query.length < 2" style="padding:2rem 1rem; text-align:center; color:var(--ag-text-3); font-size:0.875rem;">
                Digite ao menos 2 caracteres para buscar.
              </div>
              <div v-else-if="results.length === 0" style="padding:2rem 1rem; text-align:center; color:var(--ag-text-3); font-size:0.875rem;">
                Nenhum animal encontrado para "{{ query }}".
              </div>
              <div v-else style="display:flex; flex-direction:column; gap:0.5rem; padding:0.5rem;">
                <div
                  v-for="a in results" :key="a.id"
                  class="ag-search-item"
                  @click="goToAnimal(a.id)"
                >
                  <div>
                    <p style="font-weight:600; color:var(--ag-text); margin:0; font-size:0.9375rem;">Tag: {{ a.femea }}</p>
                    <p style="font-size:0.75rem; color:var(--ag-text-3); margin:0.15rem 0 0;">Lote ID: {{ a.loteId }} • {{ a.categoria }}</p>
                  </div>
                  <svg style="width:1rem;height:1rem;color:var(--ag-text-3);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { db } from '~/plugins/dexie.client'

const isOpen = ref(false)
const query = ref('')
const results = ref<any[]>([])
const searchInput = ref<HTMLInputElement | null>(null)
const router = useRouter()

const openSearch = () => {
  isOpen.value = true
  query.value = ''
  results.value = []
  setTimeout(() => searchInput.value?.focus(), 100)
}

const closeSearch = () => {
  isOpen.value = false
}

const goToAnimal = (id: number) => {
  closeSearch()
  router.push(`/animais/${id}`)
}

watch(query, async (val) => {
  if (val.length < 2) {
    results.value = []
    return
  }
  const searchLower = val.toLowerCase()
  const all = await db.animais.toArray()
  results.value = all.filter(a => String(a.femea).toLowerCase().includes(searchLower)).slice(0, 5)
})
</script>

<style scoped>
.ag-search-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 0.5rem;
  border: 1px solid var(--ag-border);
  background: var(--ag-surface);
  color: var(--ag-text-2);
  cursor: pointer;
  transition: all .2s;
}
.ag-search-trigger:hover {
  background: var(--ag-bg-2);
  color: var(--ag-text);
}

.ag-search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1rem;
}

.ag-search-modal {
  width: 100%;
  max-width: 600px;
  background: var(--ag-surface);
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
  overflow: hidden;
  margin-top: 2rem;
}

.ag-search-header {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--ag-border);
  gap: 0.75rem;
}

.ag-search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 1rem;
  font-family: inherit;
  color: var(--ag-text);
  font-weight: 500;
}

.ag-search-close {
  background: none;
  border: none;
  color: var(--ag-text-3);
  cursor: pointer;
  padding: 0.25rem;
}

.ag-search-results {
  max-height: 400px;
  overflow-y: auto;
}

.ag-search-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--ag-surface);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}
.ag-search-item:hover {
  background: var(--ag-bg-2);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
