<template>
  <div>
    <PageHeader title="Protocolos IATF" :subtitle="`${records.length} protocolo(s)`" back="/">
      <template #actions>
        <NuxtLink to="/iatf/novo" class="btn-primary btn-sm">+ Novo</NuxtLink>
      </template>
    </PageHeader>

    <div class="page-container">
      <div v-if="records.length === 0" class="card text-center py-10 text-gray-500 text-sm mt-4">
        <span class="text-4xl block mb-3">💉</span>
        Nenhum protocolo IATF cadastrado.
        <NuxtLink to="/iatf/novo" class="block mt-2 text-brand-400">+ Criar protocolo</NuxtLink>
      </div>

      <div v-else class="space-y-2 mt-2">
        <NuxtLink
          v-for="r in records" :key="r.id"
          :to="`/iatf/${r.id}`"
          class="card block hover:border-brand-700 transition-colors"
        >
          <div class="flex items-start justify-between mb-2">
            <div>
              <p class="font-semibold text-white">{{ r.propriedade }}</p>
              <p class="text-xs text-gray-500">Proprietário: {{ r.proprietario }}</p>
            </div>
            <span :class="['badge', r.synced ? 'badge-green' : 'badge-yellow']">
              {{ r.synced ? '✓ Sync' : '⏳ Pendente' }}
            </span>
          </div>
          <div class="flex flex-wrap gap-2 text-xs text-gray-400">
            <span class="bg-gray-800 rounded px-2 py-0.5">{{ r.tipoInseminacao }}</span>
            <span class="bg-gray-800 rounded px-2 py-0.5">Lote: {{ r.lote }}</span>
            <span class="bg-gray-800 rounded px-2 py-0.5">{{ r.animais?.length ?? 0 }} animais</span>
            <span class="bg-gray-800 rounded px-2 py-0.5">{{ formatDate(r.createdAt) }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { db } from '~/plugins/dexie.client'

definePageMeta({ layout: 'default' })

const records = ref<any[]>([])

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })

onMounted(async () => {
  records.value = await db.iatfRecords.orderBy('createdAt').reverse().toArray()
})
</script>
