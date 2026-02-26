<template>
  <div>
    <PageHeader 
      :title="propriedade ? propriedade.nome : 'Carregando...'" 
      :subtitle="propriedade ? `${propriedade.municipio}/${propriedade.estado}` : ''" 
      back="/propriedades"
    >
      <template #actions>
        <Button size="small" label="+ Lote" @click="showLoteModal = true" />
      </template>
    </PageHeader>

    <div class="page-container" v-if="propriedade">
      <!-- Propriedade Info -->
      <div class="ag-card" style="margin-bottom:1rem;">
        <p style="font-size:0.8125rem; font-weight:600; color:var(--ag-text-2); margin:0 0 0.5rem;">Informações</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
          <div>
            <p style="font-size:0.75rem; color:var(--ag-text-3); margin:0;">Proprietário</p>
            <p style="font-size:0.875rem; font-weight:600; color:var(--ag-text); margin:0.1rem 0 0;">{{ propriedade.proprietario }}</p>
          </div>
          <div>
            <p style="font-size:0.75rem; color:var(--ag-text-3); margin:0;">Sincronização</p>
            <p style="font-size:0.875rem; font-weight:600; color:var(--ag-text); margin:0.1rem 0 0;">
              <span :class="['ag-badge', propriedade.synced ? 'ag-badge-green' : 'ag-badge-yellow']">{{ propriedade.synced ? 'Sincronizado' : 'Pendente' }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Relacionados: Lotes -->
      <div>
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
          <p class="ag-section-title" style="margin:0;">Lotes nesta Fazenda ({{ lotes.length }})</p>
        </div>

        <div v-if="lotes.length === 0" class="ag-card" style="text-align:center; padding:2.5rem 1rem; color:var(--ag-text-3);">
          <span style="font-size:2rem; display:block; margin-bottom:0.5rem;">📦</span>
          Nenhum lote vinculado.
        </div>

        <div v-else style="display:flex; flex-direction:column; gap:0.5rem;">
          <div v-for="l in lotes" :key="l.id" class="ag-card" style="display:flex; align-items:center; justify-content:space-between; cursor:pointer;" @click="useRouter().push(`/lotes/${l.id}`)">
            <div>
              <p style="font-weight:600; color:var(--ag-text); margin:0; font-size:0.9375rem;">{{ l.nome }}</p>
              <p style="font-size:0.75rem; color:var(--ag-text-3); margin:0.15rem 0 0;">{{ l.categoria }} • {{ l.retiro || '—' }}</p>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span :class="['ag-badge', l.synced ? 'ag-badge-green' : 'ag-badge-yellow']">{{ l.synced ? '✓' : '⏳' }}</span>
              <svg style="width:1rem;height:1rem;color:var(--ag-text-3);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="page-container" style="text-align:center; padding:3rem; color:var(--ag-text-3);">
      Carregando detalhes...
    </div>

    <!-- Criar Lote Modal -->
    <LoteModal v-model="showLoteModal" :initialPropriedadeId="propriedade?.id" @saved="load" />
  </div>
</template>

<script setup lang="ts">
import { db } from '~/plugins/dexie.client'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'

definePageMeta({ layout: 'default' })

const route = useRoute()
const showLoteModal = ref(false)
const propriedade = ref<any>(null)
const lotes = ref<any[]>([])

const load = async () => {
  const pId = Number(route.params.id)
  if (!pId) return
  
  propriedade.value = await db.propriedades.get(pId)
  if (propriedade.value) {
    lotes.value = await db.lotes.where('propriedadeId').equals(pId).toArray()
  }
}

onMounted(load)
</script>
