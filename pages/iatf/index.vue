<template>
  <div>
    <PageHeader title="Protocolos IATF" :subtitle="`${records.length} protocolo(s)`" back="/">
      <template #actions>
        <Button size="small" label="+ Novo" as="a" href="/iatf/novo" />
      </template>
    </PageHeader>

    <div class="page-container">
      <div v-if="records.length === 0" class="ag-card" style="text-align:center; padding:2.5rem 1rem; color:var(--ag-text-3); margin-top:0.5rem;">
        <span style="font-size:2.5rem; display:block; margin-bottom:0.75rem;">💉</span>
        Nenhum protocolo IATF cadastrado.
        <NuxtLink to="/iatf/novo" style="display:block; margin-top:0.5rem; color:var(--ag-primary); font-weight:600; text-decoration:none;">+ Criar protocolo</NuxtLink>
      </div>

      <div v-else style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.5rem;">
        <NuxtLink
          v-for="r in records" :key="r.id"
          :to="`/iatf/detalhes/${r.id}`"
          class="ag-card"
          style="display:block; text-decoration:none;"
        >
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
            <div>
              <p style="font-weight:600; color:var(--ag-text); margin:0; font-size:0.9375rem;">{{ r.propriedade }}</p>
              <p style="font-size:0.75rem; color:var(--ag-text-3); margin:0.1rem 0 0;">Proprietário: {{ r.proprietario }}</p>
            </div>
            <div style="display:flex; gap:0.5rem; align-items:center;">
              <span :class="['ag-badge', r.synced ? 'ag-badge-green' : 'ag-badge-yellow']">{{ r.synced ? '✓ Sync' : '⏳' }}</span>
              <Button icon="pi pi-trash" severity="danger" text rounded aria-label="Apagar" @click.prevent="apagarProtocolo(r.id)" style="width:2rem; height:2rem; padding:0;" />
            </div>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:0.375rem;">
            <span v-for="chip in [r.tipoInseminacao, `Lote: ${r.lote}`, `${r.animais?.length ?? 0} animais`, formatDate(r.createdAt)]" :key="chip"
              style="background:var(--ag-bg-2); border:1px solid var(--ag-border); border-radius:0.375rem; padding:0.125rem 0.5rem; font-size:0.7rem; color:var(--ag-text-2);">
              {{ chip }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { db } from '~/plugins/dexie.client'
import Button from 'primevue/button'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useSync } from '~/composables/useSync'

definePageMeta({ layout: 'default' })

const records = ref<any[]>([])
const formatDate = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })

const confirm = useConfirm()
const toast = useToast()
const { addToQueue } = useSync()

const loadRecords = async () => {
  records.value = await db.iatfRecords.orderBy('createdAt').reverse().toArray()
}

const apagarProtocolo = (id: number) => {
  confirm.require({
    message: 'Tem certeza que deseja apagar este protocolo? Esta ação não pode ser desfeita e os dados individuais dos animais não serão alterados.',
    header: 'Confirmar Exclusão',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    acceptLabel: 'Sim, Apagar',
    rejectLabel: 'Cancelar',
    accept: async () => {
      try {
        await db.iatfRecords.delete(id)
        await addToQueue('delete', 'iatfRecords', id, null)
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Protocolo IATF apagado', life: 3000 })
        await loadRecords()
      } catch (e) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível apagar o protocolo', life: 3000 })
      }
    }
  })
}

onMounted(loadRecords)
</script>

