<template>
  <div>
    <!-- Header -->
    <div class="bg-gradient-to-br from-brand-900/50 to-gray-900 px-4 pt-6 pb-8 border-b border-gray-800">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-brand-400 text-sm font-medium">Bem-vindo,</p>
            <h1 class="text-2xl font-bold text-white">{{ auth.currentUser?.name }}</h1>
          </div>
          <div class="flex items-center gap-3">
            <div v-if="appStore.syncPending > 0" class="badge badge-yellow">
              {{ appStore.syncPending }} pendente{{ appStore.syncPending > 1 ? 's' : '' }}
            </div>
            <button
              class="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              @click="handleLogout"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Status bar -->
        <div class="flex items-center gap-2 text-xs">
          <span :class="['w-2 h-2 rounded-full', isOnline ? 'bg-green-400 animate-pulse' : 'bg-amber-400']" />
          <span :class="isOnline ? 'text-green-400' : 'text-amber-400'">
            {{ isOnline ? 'Online' : 'Offline' }}
          </span>
          <span class="text-gray-600">•</span>
          <span class="text-gray-500">{{ new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) }}</span>
        </div>
      </div>
    </div>

    <div class="page-container">
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-3 mb-6 mt-2 animate-fade-in">
        <div
          v-for="stat in stats" :key="stat.label"
          class="card flex flex-col gap-1 hover:border-brand-800 transition-colors cursor-pointer"
          @click="navigateTo(stat.route)"
        >
          <div class="flex items-center justify-between mb-1">
            <span class="text-2xl">{{ stat.icon }}</span>
            <span class="badge badge-green text-xs">{{ stat.badge }}</span>
          </div>
          <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
          <p class="text-xs text-gray-500">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mb-6">
        <h2 class="section-title">Ações Rápidas</h2>
        <div class="grid grid-cols-2 gap-3">
          <NuxtLink to="/iatf/novo" class="card flex flex-col items-center gap-2 py-5 hover:border-brand-600 transition-all group cursor-pointer text-center">
            <div class="w-12 h-12 bg-brand-900/60 rounded-xl flex items-center justify-center group-hover:bg-brand-700/40 transition-colors">
              <svg class="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-200">Novo IATF</span>
          </NuxtLink>
          <NuxtLink to="/propriedades" class="card flex flex-col items-center gap-2 py-5 hover:border-brand-600 transition-all group cursor-pointer text-center">
            <div class="w-12 h-12 bg-brand-900/60 rounded-xl flex items-center justify-center group-hover:bg-brand-700/40 transition-colors">
              <svg class="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-200">Fazendas</span>
          </NuxtLink>
          <NuxtLink to="/lotes" class="card flex flex-col items-center gap-2 py-5 hover:border-brand-600 transition-all group cursor-pointer text-center">
            <div class="w-12 h-12 bg-brand-900/60 rounded-xl flex items-center justify-center group-hover:bg-brand-700/40 transition-colors">
              <svg class="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-200">Lotes</span>
          </NuxtLink>
          <NuxtLink to="/animais" class="card flex flex-col items-center gap-2 py-5 hover:border-brand-600 transition-all group cursor-pointer text-center">
            <div class="w-12 h-12 bg-brand-900/60 rounded-xl flex items-center justify-center group-hover:bg-brand-700/40 transition-colors">
              <svg class="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-200">Animais</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Recent IATF -->
      <div>
        <h2 class="section-title">Protocolos Recentes</h2>
        <div v-if="recentIatf.length === 0" class="card text-center py-8 text-gray-500 text-sm">
          Nenhum protocolo IATF cadastrado ainda.
          <NuxtLink to="/iatf/novo" class="block mt-2 text-brand-400 hover:text-brand-300 font-medium">+ Criar primeiro protocolo</NuxtLink>
        </div>
        <div v-else class="space-y-2">
          <NuxtLink
            v-for="iatf in recentIatf" :key="iatf.id"
            :to="`/iatf/${iatf.id}`"
            class="card flex items-center justify-between hover:border-brand-800 transition-colors"
          >
            <div>
              <p class="text-sm font-medium text-white">{{ iatf.propriedade }}</p>
              <p class="text-xs text-gray-500">{{ iatf.lote }} • {{ iatf.tipoInseminacao }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span :class="['badge', iatf.synced ? 'badge-green' : 'badge-yellow']">
                {{ iatf.synced ? 'Sincronizado' : 'Pendente' }}
              </span>
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { db } from '~/plugins/dexie.client'

definePageMeta({ layout: 'default' })

const auth = useAuthStore()
const appStore = useAppStore()
const { isOnline } = useNetwork()

const stats = ref([
  { label: 'Fazendas', value: 0, icon: '🏡', badge: 'Total', route: '/propriedades' },
  { label: 'Lotes', value: 0, icon: '📦', badge: 'Ativos', route: '/lotes' },
  { label: 'Protocolos IATF', value: 0, icon: '💉', badge: 'Total', route: '/iatf' },
  { label: 'Animais', value: 0, icon: '🐄', badge: 'Total', route: '/animais' },
])

const recentIatf = ref<any[]>([])

const handleLogout = async () => {
  await auth.logout()
  await navigateTo('/login')
}

onMounted(async () => {
  if (!import.meta.client) return
  try {
    if (stats.value[0]) stats.value[0].value = await db.propriedades.count()
    if (stats.value[1]) stats.value[1].value = await db.lotes.count()
    if (stats.value[2]) stats.value[2].value = await db.iatfRecords.count()
    if (stats.value[3]) stats.value[3].value = await db.animais.count()
    recentIatf.value = await db.iatfRecords.orderBy('createdAt').reverse().limit(5).toArray()
  } catch {}
})
</script>
