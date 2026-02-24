<template>
  <div style="padding-bottom:6rem;">
    <!-- Header -->
    <PageHeader
      :title="isNew ? 'Novo Protocolo IATF' : 'Editar Protocolo'"
      subtitle="PLANILHA DE IATF"
      back="/iatf"
    >
      <template #actions>
        <ThemeToggle />
        <Button size="small" :loading="saving" label="Salvar" @click="saveRecord" />
      </template>
    </PageHeader>

    <!-- ═══ PLANILHA ═══ -->
    <div class="iatf-spreadsheet" style="margin:0.75rem; border-radius:0.625rem;">

      <!-- Green Header Bar -->
      <div class="iatf-header-bar">Planilha de IATF</div>

      <!-- Logo + Info Grid -->
      <div style="display:grid; grid-template-columns:140px 1fr; border-bottom:1px solid var(--ag-border);">
        <!-- Logo -->
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:1rem; border-right:1px solid var(--ag-border); background:color-mix(in srgb,var(--ag-primary) 5%,transparent);">
          <svg style="width:3rem;height:3rem;color:var(--ag-primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          <span style="font-weight:800; font-size:0.875rem; color:var(--ag-primary); margin-top:0.375rem;">AGROVET</span>
          <span style="font-size:0.6rem; color:var(--ag-text-3); letter-spacing:0.1em;">REPRODUÇÃO</span>
        </div>

        <!-- Right side info -->
        <div style="display:flex; flex-direction:column;">
          <!-- Row: Proprietário + Propriedade -->
          <div style="display:grid; grid-template-columns:1fr 1fr; border-bottom:1px solid var(--ag-border);">
            <div class="iatf-row" style="border-right:1px solid var(--ag-border);">
              <span class="iatf-label">Proprietário:</span>
              <div class="iatf-value" style="flex:1;">
                <input v-model="form.proprietario" placeholder="Digite..." />
              </div>
            </div>
            <div class="iatf-row">
              <span class="iatf-label">Propriedade:</span>
              <div class="iatf-value" style="flex:1;">
                <select v-model="form.propriedadeId" @change="onFazendaChange" style="width:100%; background:transparent; border:none; outline:none; color:var(--ag-text); padding:0.5rem 0.75rem; font-size:0.8125rem; cursor:pointer;">
                  <option value="" disabled>Selecione...</option>
                  <option v-for="p in propriedades" :key="p.id" :value="p.id">{{ p.nome }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Row: Inseminação -->
          <div class="iatf-row" style="padding:0.5rem 0.75rem; border-bottom:1px solid var(--ag-border); flex-wrap:wrap; gap:0.625rem;">
            <span class="iatf-label" style="padding:0;">Inseminação:</span>
            <label v-for="tipo in tiposInseminacao" :key="tipo" class="ag-radio-label">
              <input type="radio" :value="tipo" v-model="form.tipoInseminacao" />
              <span>{{ tipo }}</span>
            </label>
          </div>

          <!-- Row: Vacina -->
          <div class="iatf-row" style="padding:0.5rem 0.75rem; border-bottom:1px solid var(--ag-border); flex-wrap:wrap; gap:0.625rem;">
            <span class="iatf-label" style="padding:0;">Vacina reprodutiva:</span>
            <label class="ag-radio-label"><input type="radio" :value="true" v-model="form.vacinaReprodutiva" /><span>SIM</span></label>
            <label class="ag-radio-label"><input type="radio" :value="false" v-model="form.vacinaReprodutiva" /><span>NÃO</span></label>
          </div>

          <!-- Row: Descongelamento -->
          <div class="iatf-row" style="padding:0.5rem 0.75rem; border-bottom:1px solid var(--ag-border); flex-wrap:wrap; gap:0.625rem;">
            <span class="iatf-label" style="padding:0;">Descongelamento:</span>
            <label v-for="opt in descongelamentoOpts" :key="opt.value" class="ag-radio-label">
              <input type="radio" :value="opt.value" v-model="form.tipoDescongelamento" />
              <span>{{ opt.label }}</span>
            </label>
          </div>

          <!-- Row: Progesterona + Estímulo -->
          <div style="display:grid; grid-template-columns:1fr 1fr;">
            <div class="iatf-row" style="padding:0.5rem 0.75rem; border-right:1px solid var(--ag-border); flex-wrap:wrap; gap:0.625rem;">
              <span class="iatf-label" style="padding:0;">Progesterona:</span>
              <label v-for="d in [7, 8, 9]" :key="d" class="ag-radio-label">
                <input type="radio" :value="d" v-model="form.diasProgesterona" />
                <span>{{ d }}d</span>
              </label>
            </div>
            <div class="iatf-row" style="padding:0.5rem 0.75rem; flex-wrap:wrap; gap:0.625rem;">
              <span class="iatf-label" style="padding:0;">Estímulo:</span>
              <label v-for="e in ['CE','BE']" :key="e" class="ag-radio-label">
                <input type="radio" :value="e" v-model="form.estimuloOvulatorio" />
                <span>{{ e }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Lote / Categoria / Retiro Row -->
      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; border-bottom:1px solid var(--ag-border);">
        <div class="iatf-row" style="border-right:1px solid var(--ag-border);">
          <span class="iatf-label">LOTE:</span>
          <div class="iatf-value" style="flex:1;">
            <select v-model="form.loteId" @change="onLoteChange" style="width:100%; background:transparent; border:none; outline:none; color:var(--ag-text); padding:0.5rem 0.75rem; font-size:0.8125rem;">
              <option value="" disabled>Selecione...</option>
              <option v-for="l in lotesFiltered" :key="l.id" :value="l.id">{{ l.nome }}</option>
            </select>
          </div>
        </div>
        <div class="iatf-row" style="border-right:1px solid var(--ag-border);">
          <span class="iatf-label">CATEGORIA:</span>
          <div class="iatf-value" style="flex:1;"><input v-model="form.categoria" placeholder="Ex: Novilhas" /></div>
        </div>
        <div class="iatf-row">
          <span class="iatf-label">RETIRO:</span>
          <div class="iatf-value" style="flex:1;"><input v-model="form.retiro" placeholder="Ex: Pasto 1" /></div>
        </div>
      </div>

      <!-- Dates Row -->
      <div style="display:grid; grid-template-columns:repeat(4,1fr); border-bottom:1px solid var(--ag-border);">
        <!-- D-0 Implante -->
        <div style="border-right:1px solid var(--ag-border); padding:0.5rem;">
          <div style="font-size:0.6875rem; font-weight:700; color:var(--ag-text-3); text-transform:uppercase; letter-spacing:.04em; margin-bottom:0.375rem;">DATA IMPLANTE (D-0)</div>
          <div style="display:flex; flex-direction:column; gap:0.25rem;">
            <div style="display:flex; align-items:center; gap:0.25rem;">
              <span style="font-size:0.7rem; color:var(--ag-text-3); width:24px;">Ini:</span>
              <input type="date" v-model="form.dataImplante" style="flex:1; background:transparent; border:none; outline:none; color:var(--ag-text); font-size:0.75rem; padding:0.2rem;" />
            </div>
            <div style="display:flex; align-items:center; gap:0.25rem;">
              <span style="font-size:0.7rem; color:var(--ag-text-3); width:24px;">Fim:</span>
              <input type="date" v-model="form.dataImplanteTermino" style="flex:1; background:transparent; border:none; outline:none; color:var(--ag-text); font-size:0.75rem; padding:0.2rem;" />
            </div>
            <div style="display:flex; align-items:center; gap:0.25rem;">
              <span style="font-size:0.7rem; color:var(--ag-text-3); width:24px;">♂:</span>
              <input v-model="form.touroImplante" placeholder="Nome/ID" style="flex:1; background:transparent; border:none; outline:none; color:var(--ag-text); font-size:0.75rem; padding:0.2rem;" />
            </div>
          </div>
        </div>
        <!-- Retirada D-8 -->
        <div style="border-right:1px solid var(--ag-border); padding:0.5rem;">
          <div style="font-size:0.6875rem; font-weight:700; color:var(--ag-text-3); text-transform:uppercase; letter-spacing:.04em; margin-bottom:0.375rem;">DATA RETIRADA</div>
          <div style="display:flex; flex-direction:column; gap:0.25rem;">
            <div style="display:flex; align-items:center; gap:0.25rem;">
              <span style="font-size:0.7rem; color:var(--ag-text-3); width:32px;">Data:</span>
              <input type="date" v-model="form.dataRetirada" style="flex:1; background:transparent; border:none; outline:none; color:var(--ag-text); font-size:0.75rem; padding:0.2rem;" />
            </div>
            <div style="display:flex; align-items:center; gap:0.25rem;">
              <span style="font-size:0.7rem; color:var(--ag-text-3); width:32px;">Hora:</span>
              <input type="time" v-model="form.horarioRetirada" style="flex:1; background:transparent; border:none; outline:none; color:var(--ag-text); font-size:0.75rem; padding:0.2rem;" />
            </div>
          </div>
        </div>
        <!-- 1ª IA -->
        <div style="border-right:1px solid var(--ag-border); padding:0.5rem;">
          <div style="font-size:0.6875rem; font-weight:700; color:var(--ag-text-3); text-transform:uppercase; letter-spacing:.04em; margin-bottom:0.375rem;">DATA 1ª IA</div>
          <input type="date" v-model="form.dataPrimeiraIa" style="width:100%; background:transparent; border:none; outline:none; color:var(--ag-text); font-size:0.8125rem; padding:0.25rem 0;" />
        </div>
        <!-- DG -->
        <div style="padding:0.5rem;">
          <div style="font-size:0.6875rem; font-weight:700; color:var(--ag-text-3); text-transform:uppercase; letter-spacing:.04em; margin-bottom:0.375rem;">DATA DG</div>
          <input type="date" v-model="form.dataDg" style="width:100%; background:transparent; border:none; outline:none; color:var(--ag-text); font-size:0.8125rem; padding:0.25rem 0;" />
        </div>
      </div>

      <!-- Animals Section Header -->
      <div style="display:flex; align-items:center; justify-content:space-between; padding:0.5rem 0.75rem; background:color-mix(in srgb,var(--ag-primary) 8%,transparent); border-bottom:1px solid var(--ag-border);">
        <span style="font-weight:700; color:var(--ag-primary); font-size:0.8125rem; text-transform:uppercase; letter-spacing:0.06em;">
          ANIMAIS
          <span style="background:var(--ag-primary); color:#fff; border-radius:9999px; font-size:0.65rem; padding:0.1rem 0.4rem; margin-left:0.25rem;">{{ form.animais.length }}</span>
        </span>
        <Button size="small" label="+ Adicionar" @click="addAnimal" />
      </div>

      <!-- Animals Table -->
      <div style="overflow-x:auto;">
        <table class="ag-table" style="min-width:680px;">
          <thead>
            <tr>
              <th style="width:2.5rem;">ORD</th>
              <th>Fêmea</th>
              <th>Res. DG</th>
              <th style="color:var(--ag-primary);">D-0+DG</th>
              <th style="color:var(--ag-primary);">DG 35</th>
              <th style="color:var(--ag-primary);">D-8</th>
              <th style="color:var(--ag-primary);">GnRH</th>
              <th>Touro</th>
              <th>Partida</th>
              <th>Obs</th>
              <th style="width:2rem;"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="form.animais.length === 0">
              <td colspan="11" style="text-align:center; padding:1.5rem; color:var(--ag-text-3); font-size:0.8125rem;">
                Nenhum animal adicionado.
              </td>
            </tr>
            <tr v-for="(animal, i) in form.animais" :key="i">
              <td style="text-align:center; font-weight:600; color:var(--ag-text-3); font-size:0.75rem;">{{ animal.ord }}</td>
              <td><input v-model="animal.femea" placeholder="ID/Tag" /></td>
              <td style="padding:0;">
                <button
                  class="ag-dg-btn"
                  :class="animal.dg_status === 'Prenhe' ? 'prenhe' : animal.dg_status === 'Vazia' ? 'vazia' : ''"
                  @click="animal.dg_status = animal.dg_status === 'Prenhe' ? 'Vazia' : (animal.dg_status === 'Vazia' ? undefined : 'Prenhe')"
                >
                  {{ animal.dg_status === 'Prenhe' ? 'PRENHE' : animal.dg_status === 'Vazia' ? 'VAZIA' : '...' }}
                </button>
              </td>
              <td><input type="date" v-model="animal.d0dg" /></td>
              <td><input type="date" v-model="animal.dg35" /></td>
              <td><input type="date" v-model="animal.d8" /></td>
              <td><input type="date" v-model="animal.gnrh" /></td>
              <td><input v-model="animal.touro" placeholder="Tag" /></td>
              <td><input v-model="animal.partida" placeholder="Nº" /></td>
              <td><input v-model="animal.obs" placeholder="..." /></td>
              <td style="text-align:center;">
                <button @click="removeAnimal(i)" style="background:none; border:none; cursor:pointer; color:var(--ag-text-3); padding:0.25rem; font-size:0.75rem;"
                  onmouseover="this.style.color='#dc2626'" onmouseout="this.style.color='var(--ag-text-3)'">✕</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Bulk Add -->
      <div style="display:flex; align-items:center; gap:0.5rem; padding:0.625rem 0.75rem; border-top:1px solid var(--ag-border); background:var(--ag-bg-2);">
        <input
          type="number" v-model="bulkCount" min="1" max="200"
          style="width:60px; background:var(--ag-surface); border:1px solid var(--ag-border); border-radius:0.375rem; padding:0.25rem 0.5rem; font-size:0.8125rem; color:var(--ag-text); outline:none; text-align:center;"
        />
        <span style="font-size:0.8125rem; color:var(--ag-text-2);">linhas</span>
        <Button size="small" severity="secondary" label="Adicionar linhas rápidas" @click="bulkAddAnimals" />
      </div>
    </div>

    <!-- Predictive Timeline -->
    <div style="margin:0.75rem;">
      <IatfTimeline :protocol="form" />
    </div>

    <!-- Save button (bottom) -->
    <div style="position:fixed; bottom:5rem; left:0; right:0; display:flex; justify-content:center; pointer-events:none;">
      <Button
        :loading="saving"
        label="💾 Salvar Protocolo"
        @click="saveRecord"
        style="pointer-events:all; box-shadow:0 4px 16px rgba(22,163,74,.4); padding:0.75rem 2rem; font-size:1rem;"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { db } from '~/plugins/dexie.client'
import type { IatfAnimal } from '~/plugins/dexie.client'
import Button from 'primevue/button'

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
const descongelamentoOpts = [{ value: 'comum', label: 'Comum' }, { value: 'eletronico', label: 'Eletrônico' }]
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
  if (p) { form.proprietario = p.proprietario; form.propriedade = p.nome }
  form.loteId = ''; form.lote = ''
}

const onLoteChange = () => {
  const l = lotes.value.find(l => l.id === Number(form.loteId))
  if (l) { form.lote = l.nome; form.categoria = l.categoria; form.retiro = l.retiro || '' }
}

const addAnimal = () => form.animais.push({ ord: form.animais.length + 1, femea: '', d0dg: '', dg35: '', d8: '', gnrh: '', touro: '', partida: '', obs: '', dg_status: undefined })

const bulkAddAnimals = () => {
  const count = Number(bulkCount.value) || 0
  const start = form.animais.length
  for (let i = 0; i < count; i++) {
    form.animais.push({ ord: start + i + 1, femea: String(start + i + 1), d0dg: '', dg35: '', d8: '', gnrh: '', touro: '', partida: '', obs: '', dg_status: undefined })
  }
}

const removeAnimal = (index: number) => {
  form.animais.splice(index, 1)
  form.animais.forEach((a, i) => (a.ord = i + 1))
}

const saveRecord = async () => {
  if (!form.proprietario) { appStore.notify('Preencha o proprietário.', 'error'); return }
  saving.value = true
  try {
    const now = new Date().toISOString()
    const data = JSON.parse(JSON.stringify({ ...form, propriedadeId: Number(form.propriedadeId) || 0, loteId: Number(form.loteId) || 0, createdAt: now, updatedAt: now, synced: false }))

    if (isNew.value) {
      const id = await db.iatfRecords.add(data)
      await addToQueue('create', 'iatfRecords', id as number, data)
      appStore.notify('Protocolo IATF salvo! ✓', 'success')
      await router.push(`/iatf/${id}`)
    } else {
      const id = Number(route.params.id)
      await db.iatfRecords.update(id, { ...data, updatedAt: now })
      await addToQueue('update', 'iatfRecords', id, data)
      appStore.notify('Protocolo atualizado! ✓', 'success')
    }

    const animaisNoLote = await db.animais.where('loteId').equals(Number(form.loteId)).toArray()
    const toUpdate: any[] = [], toCreate: any[] = []
    for (const a of data.animais) {
      if (!a.femea) continue
      const match = animaisNoLote.find(dbA => String(dbA.femea).trim() === String(a.femea).trim())
      if (match) {
        if (a.dg_status && match.status_prenhez !== a.dg_status) {
          match.status_prenhez = a.dg_status; match.updatedAt = now; toUpdate.push(match)
        }
      } else {
        toCreate.push({ loteId: Number(form.loteId), femea: String(a.femea).trim(), categoria: form.categoria || 'Não definida', ord: Number(a.ord) || 0, observacao: a.obs || '', status_prenhez: a.dg_status || 'Vazia', createdAt: now, updatedAt: now, synced: false })
      }
    }
    if (toUpdate.length > 0) { await db.animais.bulkPut(toUpdate); for (const u of toUpdate) await addToQueue('update', 'animais', u.id, u) }
    if (toCreate.length > 0) { for (const n of toCreate) { const nid = await db.animais.add(n); await addToQueue('create', 'animais', nid as number, n) } }
  } catch { appStore.notify('Erro ao salvar. Tente novamente.', 'error') }
  finally { saving.value = false }
}

onMounted(async () => {
  propriedades.value = await db.propriedades.toArray()
  lotes.value = await db.lotes.toArray()
  if (!isNew.value) {
    const record = await db.iatfRecords.get(Number(route.params.id))
    if (record) Object.assign(form, record)
  }
})
</script>

<style>
.ag-radio-label {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: var(--ag-text-2);
  cursor: pointer;
  white-space: nowrap;
}
.ag-radio-label input[type="radio"] {
  accent-color: var(--ag-primary);
}
</style>
