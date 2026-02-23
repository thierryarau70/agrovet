<template>
  <div class="pb-28">
    <!-- Header -->
    <PageHeader
      :title="isNew ? 'Novo Protocolo IATF' : 'Editar Protocolo'"
      subtitle="PLANILHA DE IATF"
      back="/iatf"
    >
      <template #actions>
        <button class="btn-primary btn-sm" :disabled="saving" @click="saveRecord">
          <svg v-if="saving" class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ saving ? 'Salvando...' : 'Salvar' }}
        </button>
      </template>
    </PageHeader>
    <div class="max-w-4xl mx-auto px-4 pt-4 space-y-4">      <!-- ═══ SEÇÃO 1: CABEÇALHO ═══ -->
      <div class="card space-y-4">
        <h2 class="section-title flex items-center gap-2">
          <span class="w-6 h-6 bg-brand-800 rounded text-xs flex items-center justify-center text-brand-300 font-bold">1</span>
          Identificação
        </h2>

        <div class="grid grid-cols-1 gap-3">
          <div class="input-wrapper">
            <input id="proprietario" v-model="form.proprietario" class="peer input-prime" placeholder="Proprietário *" required />
            <label for="proprietario" class="label-prime">Proprietário *</label>
          </div>
          <div>
            <label class="label">Propriedade *</label>
            <select v-model="form.propriedadeId" class="input-field" @change="onFazendaChange">
              <option value="" disabled>Selecione a fazenda...</option>
              <option v-for="p in propriedades" :key="p.id" :value="p.id">{{ p.nome }}</option>
            </select>
          </div>
        </div>

        <!-- Inseminação -->
        <div>
          <label class="label">Inseminação</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tipo in tiposInseminacao" :key="tipo"
              type="button"
              :class="['px-4 py-2 rounded-xl text-sm font-medium border transition-all', form.tipoInseminacao === tipo ? 'bg-brand-700 border-brand-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600']"
              @click="form.tipoInseminacao = tipo"
            >
              {{ tipo }}
            </button>
          </div>
        </div>

        <!-- Vacina -->
        <div>
          <label class="label">Vacina Reprodutiva</label>
          <div class="flex gap-3">
            <button
              v-for="opt in ['SIM', 'NÃO']" :key="opt"
              type="button"
              :class="['flex-1 py-2 rounded-xl text-sm font-medium border transition-all', (form.vacinaReprodutiva ? 'SIM' : 'NÃO') === opt ? 'bg-brand-700 border-brand-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400']"
              @click="form.vacinaReprodutiva = opt === 'SIM'"
            >
              {{ opt }}
            </button>
          </div>
        </div>

        <!-- Descongelamento -->
        <div>
          <label class="label">Descongelamento</label>
          <div class="flex gap-3">
            <button
              v-for="opt in descongelamentoOpts" :key="opt.value"
              type="button"
              :class="['flex-1 py-2 rounded-xl text-sm font-medium border transition-all', form.tipoDescongelamento === opt.value ? 'bg-brand-700 border-brand-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400']"
              @click="form.tipoDescongelamento = opt.value as 'comum' | 'eletronico'"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Progesterona -->
        <div>
          <label class="label">Progesterona (dias)</label>
          <div class="flex gap-2">
            <button
              v-for="d in [7, 8, 9]" :key="d"
              type="button"
              :class="['flex-1 py-2 rounded-xl text-sm font-medium border transition-all', form.diasProgesterona === d ? 'bg-brand-700 border-brand-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400']"
              @click="form.diasProgesterona = d as 7 | 8 | 9"
            >
              {{ d }} dias
            </button>
          </div>
        </div>

        <!-- Estimulo Ovulatório -->
        <div>
          <label class="label">Estímulo Ovulatório</label>
          <div class="flex gap-3">
            <button
              v-for="opt in ['CE', 'BE']" :key="opt"
              type="button"
              :class="['flex-1 py-2 rounded-xl text-sm font-medium border transition-all', form.estimuloOvulatorio === opt ? 'bg-brand-700 border-brand-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400']"
              @click="form.estimuloOvulatorio = opt as 'CE' | 'BE'"
            >
              {{ opt }}
            </button>
          </div>
        </div>
      </div>

      <!-- ═══ SEÇÃO 2: LOTE ═══ -->
      <div class="card space-y-3">
        <h2 class="section-title flex items-center gap-2">
          <span class="w-6 h-6 bg-brand-800 rounded text-xs flex items-center justify-center text-brand-300 font-bold">2</span>
          Lote
        </h2>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="label">Lote</label>
            <select v-model="form.loteId" class="input-field" @change="onLoteChange">
              <option value="" disabled>Lote...</option>
              <option v-for="l in lotesFiltered" :key="l.id" :value="l.id">{{ l.nome }}</option>
            </select>
          </div>
          <div class="input-wrapper">
            <input id="categoria" v-model="form.categoria" class="peer input-prime" placeholder="Categoria" />
            <label for="categoria" class="label-prime">Categoria</label>
          </div>
          <div class="input-wrapper">
            <input id="retiro" v-model="form.retiro" class="peer input-prime" placeholder="Retiro" />
            <label for="retiro" class="label-prime">Retiro</label>
          </div>
        </div>
      </div>

      <!-- ═══ SEÇÃO 3: DATAS ═══ -->
      <div class="card space-y-3">
        <h2 class="section-title flex items-center gap-2">
          <span class="w-6 h-6 bg-brand-800 rounded text-xs flex items-center justify-center text-brand-300 font-bold">3</span>
          Datas do Protocolo
        </h2>
        <!-- Data Implante -->
        <div class="bg-gray-800/50 rounded-xl p-3">
          <p class="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Data Implante (D-0)</p>
          <div class="grid grid-cols-3 gap-2">
            <div class="input-wrapper">
              <input id="d-inicio" v-model="form.dataImplante" type="date" class="peer input-prime py-2 text-sm" placeholder="Início" />
              <label for="d-inicio" class="label-prime">Início</label>
            </div>
            <div class="input-wrapper">
              <input id="d-term" v-model="form.dataImplanteTermino" type="date" class="peer input-prime py-2 text-sm" placeholder="Término" />
              <label for="d-term" class="label-prime">Término</label>
            </div>
            <div class="input-wrapper">
              <input id="d-touro" v-model="form.touroImplante" class="peer input-prime py-2 text-sm" placeholder="Touro" />
              <label for="d-touro" class="label-prime">Touro</label>
            </div>
          </div>
        </div>
        <!-- Data Retirada -->
        <div class="bg-gray-800/50 rounded-xl p-3">
          <p class="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Data Retirada</p>
          <div class="grid grid-cols-2 gap-2">
            <div class="input-wrapper">
              <input id="d-ret" v-model="form.dataRetirada" type="date" class="peer input-prime py-2 text-sm" placeholder="Data" />
              <label for="d-ret" class="label-prime">Data</label>
            </div>
            <div class="input-wrapper">
              <input id="h-ret" v-model="form.horarioRetirada" type="time" class="peer input-prime py-2 text-sm" placeholder="Horário" />
              <label for="h-ret" class="label-prime">Horário</label>
            </div>
          </div>
        </div>
        <!-- 1ª IA e DG -->
        <div class="grid grid-cols-2 gap-3">
          <div class="input-wrapper">
            <input id="d1ia" v-model="form.dataPrimeiraIa" type="date" class="peer input-prime" placeholder="Data 1ª IA" />
            <label for="d1ia" class="label-prime">Data 1ª IA</label>
          </div>
          <div class="input-wrapper">
            <input id="ddg" v-model="form.dataDg" type="date" class="peer input-prime" placeholder="Data DG" />
            <label for="ddg" class="label-prime">Data DG</label>
          </div>
        </div>
      </div>

      <!-- ═══ SEÇÃO 4: TABELA DE ANIMAIS ═══ -->
      <div class="card p-0 overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h2 class="section-title mb-0 flex items-center gap-2">
            <span class="w-6 h-6 bg-brand-800 rounded text-xs flex items-center justify-center text-brand-300 font-bold">4</span>
            Animais ({{ form.animais.length }})
          </h2>
          <button class="btn-primary btn-sm" type="button" @click="addAnimal">+ Animal</button>
        </div>

        <!-- Scrollable table -->
        <div class="overflow-x-auto">
          <table class="w-full min-w-[680px] text-xs">
            <thead>
              <tr>
                <th class="table-header w-10 text-center">ORD</th>
                <th class="table-header">Fêmea</th>
                <th class="table-header text-center">Res. DG</th>
                <th class="table-header text-center">D-0+DG</th>
                <th class="table-header text-center">DG 35</th>
                <th class="table-header text-center">D-8</th>
                <th class="table-header text-center">GnRH</th>
                <th class="table-header">TOURO</th>
                <th class="table-header">Partida</th>
                <th class="table-header">Obs</th>
                <th class="table-header w-8"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="form.animais.length === 0">
                <td colspan="10" class="table-cell text-center text-gray-600 py-6">
                  Nenhum animal adicionado. Clique em "+ Animal" para começar.
                </td>
              </tr>
              <tr
                v-for="(animal, i) in form.animais"
                :key="i"
                :class="['hover:bg-gray-800/40 transition-colors', i % 2 === 0 ? '' : 'bg-gray-800/20']"
              >
                <td class="table-cell text-center font-semibold text-brand-400">{{ animal.ord }}</td>
                <td class="table-cell">
                  <input v-model="animal.femea" class="table-input w-20" placeholder="ID/Tag" />
                </td>
                <td class="table-cell text-center">
                  <select v-model="animal.dg_status" class="table-input w-24">
                    <option :value="undefined">---</option>
                    <option value="Prenhe">Prenhe</option>
                    <option value="Vazia">Vazia</option>
                  </select>
                </td>
                <td class="table-cell text-center">
                  <input v-model="animal.d0dg" class="table-input w-16 text-center" type="date" />
                </td>
                <td class="table-cell text-center">
                  <input v-model="animal.dg35" class="table-input w-16 text-center" type="date" />
                </td>
                <td class="table-cell text-center">
                  <input v-model="animal.d8" class="table-input w-16 text-center" type="date" />
                </td>
                <td class="table-cell text-center">
                  <input v-model="animal.gnrh" class="table-input w-16 text-center" type="date" />
                </td>
                <td class="table-cell">
                  <input v-model="animal.touro" class="table-input w-20" placeholder="Tag" />
                </td>
                <td class="table-cell">
                  <input v-model="animal.partida" class="table-input w-16" placeholder="Nº" />
                </td>
                <td class="table-cell">
                  <input v-model="animal.obs" class="table-input w-20" placeholder="..." />
                </td>
                <td class="table-cell">
                  <button type="button" class="text-gray-600 hover:text-red-400 transition-colors p-0.5" @click="removeAnimal(i)">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Bulk add -->
        <div class="px-4 py-3 border-t border-gray-800 flex items-center gap-3">
          <input
            v-model.number="bulkCount"
            type="number"
            min="1"
            max="200"
            class="input-field w-24 py-2 text-sm"
            placeholder="Qtd"
          />
          <button type="button" class="btn-secondary btn-sm" @click="bulkAddAnimals">
            Adicionar {{ bulkCount || 0 }} animais
          </button>
        </div>
      </div>

      <!-- Save button (bottom) -->
      <button class="btn-primary w-full py-4 text-base" :disabled="saving" @click="saveRecord">
        <svg v-if="saving" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        {{ saving ? 'Salvando...' : '💾 Salvar Protocolo IATF' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { db } from '~/plugins/dexie.client'
import type { IatfAnimal } from '~/plugins/dexie.client'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const { addToQueue } = useSync()

const isNew = computed(() => route.params.id === 'novo')
const saving = ref(false)

const propriedades = ref<any[]>([])
const lotes = ref<any[]>([])
const lotesFiltered = computed(() =>
  form.propriedadeId
    ? lotes.value.filter(l => l.propriedadeId === Number(form.propriedadeId))
    : lotes.value
)

const tiposInseminacao = ['1 IATF', 'Ressinc1', 'Ressinc2'] as const
const descongelamentoOpts = [
  { value: 'comum', label: 'Comum' },
  { value: 'eletronico', label: 'Eletrônico' },
]

const bulkCount = ref(10)

const form = reactive({
  propriedadeId: '' as any,
  loteId: '' as any,
  proprietario: '',
  propriedade: '',
  tipoInseminacao: '1 IATF' as '1 IATF' | 'Ressinc1' | 'Ressinc2',
  vacinaReprodutiva: false,
  tipoDescongelamento: 'comum' as 'comum' | 'eletronico',
  diasProgesterona: 8 as 7 | 8 | 9,
  estimuloOvulatorio: 'CE' as 'CE' | 'BE',
  lote: '',
  categoria: '',
  retiro: '',
  dataImplante: '',
  dataImplanteTermino: '',
  touroImplante: '',
  dataRetirada: '',
  horarioRetirada: '',
  dataPrimeiraIa: '',
  dataDg: '',
  animais: [] as IatfAnimal[],
})

const onFazendaChange = () => {
  const p = propriedades.value.find(p => p.id === Number(form.propriedadeId))
  if (p) {
    form.proprietario = p.proprietario
    form.propriedade = p.nome
  }
  form.loteId = ''
  form.lote = ''
}

const onLoteChange = () => {
  const l = lotes.value.find(l => l.id === Number(form.loteId))
  if (l) {
    form.lote = l.nome
    form.categoria = l.categoria
    form.retiro = l.retiro || ''
  }
}

const addAnimal = () => {
  form.animais.push({
    ord: form.animais.length + 1,
    femea: '',
    d0dg: '',
    dg35: '',
    d8: '',
    gnrh: '',
    touro: '',
    partida: '',
    obs: '',
    dg_status: undefined,
  })
}

const bulkAddAnimals = () => {
  const count = Number(bulkCount.value) || 0
  const start = form.animais.length
  for (let i = 0; i < count; i++) {
    form.animais.push({
      ord: start + i + 1,
      femea: String(start + i + 1),
      d0dg: '',
      dg35: '',
      d8: '',
      gnrh: '',
      touro: '',
      partida: '',
      obs: '',
      dg_status: undefined,
    })
  }
}

const removeAnimal = (index: number) => {
  form.animais.splice(index, 1)
  form.animais.forEach((a, i) => (a.ord = i + 1))
}

const saveRecord = async () => {
  if (!form.proprietario) {
    appStore.notify('Preencha o proprietário.', 'error')
    return
  }
  saving.value = true
  try {
    const now = new Date().toISOString()
    // Convert reactive proxy to plain object for IndexedDB (prevents DataCloneError)
    const data = JSON.parse(JSON.stringify({
      ...form,
      propriedadeId: Number(form.propriedadeId) || 0,
      loteId: Number(form.loteId) || 0,
      createdAt: now,
      updatedAt: now,
      synced: false,
    }))

    if (isNew.value) {
      const id = await db.iatfRecords.add(data)
      await addToQueue('create', 'iatfRecords', id as number, data)
      appStore.notify('Protocolo IATF salvo com sucesso! ✓', 'success')
      await router.push(`/iatf/${id}`)
    } else {
      const id = Number(route.params.id)
      await db.iatfRecords.update(id, { ...data, updatedAt: now })
      await addToQueue('update', 'iatfRecords', id, data)
      appStore.notify('Protocolo atualizado! ✓', 'success')
    }

    // Update animals pregnancy status or create new animals
    const animaisNoLote = await db.animais.where('loteId').equals(Number(form.loteId)).toArray()
    const animaisToUpdate: any[] = []
    const animaisToCreate: any[] = []

    for (const a of data.animais) {
      if (!a.femea) continue // Ignorar linhas vazias

      const match = animaisNoLote.find(dbA => String(dbA.femea).trim() === String(a.femea).trim())

      if (match) {
        // Atualizar se o status_prenhez tiver mudado (e o campo DG foi preenchido)
        if (a.dg_status && match.status_prenhez !== a.dg_status) {
          match.status_prenhez = a.dg_status
          match.updatedAt = now
          animaisToUpdate.push(match)
        }
      } else {
        // Animal não existe no lote, cria automaticamente
        animaisToCreate.push({
          loteId: Number(form.loteId),
          femea: String(a.femea).trim(),
          categoria: form.categoria || 'Não definida',
          ord: Number(a.ord) || 0,
          observacao: a.obs || '',
          status_prenhez: a.dg_status || 'Vazia',
          createdAt: now,
          updatedAt: now,
          synced: false
        })
      }
    }

    if (animaisToUpdate.length > 0) {
      await db.animais.bulkPut(animaisToUpdate)
      for (const updatedAnimal of animaisToUpdate) {
         await addToQueue('update', 'animais', updatedAnimal.id, updatedAnimal)
      }
    }

    if (animaisToCreate.length > 0) {
      for (const newAnimal of animaisToCreate) {
        const newId = await db.animais.add(newAnimal)
        await addToQueue('create', 'animais', newId as number, newAnimal)
      }
    }
  } catch (e) {
    appStore.notify('Erro ao salvar. Tente novamente.', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  propriedades.value = await db.propriedades.toArray()
  lotes.value = await db.lotes.toArray()

  if (!isNew.value) {
    const id = Number(route.params.id)
    const record = await db.iatfRecords.get(id)
    if (record) {
      Object.assign(form, record)
    }
  }
})
</script>
