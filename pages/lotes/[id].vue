<template>
  <div>
    <PageHeader 
      :title="lote ? lote.nome : 'Carregando...'" 
      :subtitle="propriedadeNome" 
      back="/lotes"
    >
      <template #actions>
        <Button size="small" label="+ Animal" @click="showAnimalModal = true" />
      </template>
    </PageHeader>

    <div class="page-container" v-if="lote">
      <!-- Lote Info -->
      <div class="ag-card" style="margin-bottom:1rem;">
        <p style="font-size:0.8125rem; font-weight:600; color:var(--ag-text-2); margin:0 0 0.5rem;">Informações</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
          <div>
            <p style="font-size:0.75rem; color:var(--ag-text-3); margin:0;">Categoria</p>
            <p style="font-size:0.875rem; font-weight:600; color:var(--ag-text); margin:0.1rem 0 0;">{{ lote.categoria }}</p>
          </div>
          <div>
            <p style="font-size:0.75rem; color:var(--ag-text-3); margin:0;">Retiro</p>
            <p style="font-size:0.875rem; font-weight:600; color:var(--ag-text); margin:0.1rem 0 0;">{{ lote.retiro || '—' }}</p>
          </div>
        </div>
      </div>

      <!-- Relacionados: Animais -->
      <div>
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
          <p class="ag-section-title" style="margin:0;">Animais neste Lote ({{ animais.length }})</p>
        </div>

        <div v-if="animais.length === 0" class="ag-card" style="text-align:center; padding:2.5rem 1rem; color:var(--ag-text-3);">
          <span style="font-size:2rem; display:block; margin-bottom:0.5rem;">🐄</span>
          Nenhum animal vinculado.
        </div>

        <div v-else style="display:flex; flex-direction:column; gap:0.5rem;">
          <div v-for="a in animais" :key="a.id" class="ag-card" style="display:flex; align-items:center; justify-content:space-between; cursor:pointer;" @click="useRouter().push(`/animais/${a.id}`)">
            <div>
              <p style="font-weight:600; color:var(--ag-text); margin:0; font-size:0.9375rem;">{{ a.femea }}</p>
              <p style="font-size:0.75rem; color:var(--ag-text-3); margin:0.15rem 0 0;">{{ a.categoria }}</p>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span v-if="a.status_prenhez" :class="['ag-badge', a.status_prenhez === 'Prenhe' ? 'ag-badge-green' : '']"
                  :style="a.status_prenhez !== 'Prenhe' ? 'background:rgba(220,38,38,.12);color:#dc2626;border-color:rgba(220,38,38,.3);' : ''">
                  {{ a.status_prenhez }}
              </span>
              <span :class="['ag-badge', a.synced ? 'ag-badge-green' : 'ag-badge-yellow']">{{ a.synced ? '✓' : '⏳' }}</span>
              <svg style="width:1rem;height:1rem;color:var(--ag-text-3);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="page-container" style="text-align:center; padding:3rem; color:var(--ag-text-3);">
      Carregando detalhes...
    </div>

    <!-- Criar Animal Modal -->
    <AnimalModal v-model="showAnimalModal" :initialLoteId="lote?.id" @saved="load" />
  </div>
</template>

<script setup lang="ts">
import { db } from '~/plugins/dexie.client'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'

definePageMeta({ layout: 'default' })

const route = useRoute()
const showAnimalModal = ref(false)
const lote = ref<any>(null)
const propriedadeNome = ref('—')
const animais = ref<any[]>([])

const load = async () => {
  const lId = Number(route.params.id)
  if (!lId) return
  
  lote.value = await db.lotes.get(lId)
  if (lote.value) {
    animais.value = await db.animais.where('loteId').equals(lId).toArray()
    const p = await db.propriedades.get(lote.value.propriedadeId)
    if (p) {
      propriedadeNome.value = p.nome
    }
  }
}

onMounted(load)
</script>
