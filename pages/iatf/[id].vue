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
        <Button size="small" :loading="saving" label="Salvar" @click="askSave" />
      </template>
    </PageHeader>

    <!-- ═══ PLANILHA CARDS ═══ -->
    <div style="display:flex; flex-direction:column; gap:1rem; padding:0 1rem;">
      
      <!-- Card 1: Info Gerais -->
      <div class="ag-card">
        <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem; border-bottom:1px solid var(--ag-border); padding-bottom:0.75rem;">
          <div style="display:flex; align-items:center; justify-content:center; width:2rem; height:2rem; border-radius:0.5rem; background:var(--ag-primary-light); color:var(--ag-primary);">
            <svg style="width:1.25rem;height:1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16H3m14 0h2m-2 0h-5m-9 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <h2 style="font-size:1rem; font-weight:700; color:var(--ag-text); margin:0;">Informações Gerais</h2>
        </div>
        
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem;">
          <div>
            <label style="display:block; font-size:0.75rem; font-weight:600; color:var(--ag-text-2); margin-bottom:0.375rem;">Proprietário</label>
            <InputText v-model="form.proprietario" placeholder="Digite..." style="width:100%;" />
          </div>
          <div>
            <label style="display:block; font-size:0.75rem; font-weight:600; color:var(--ag-text-2); margin-bottom:0.375rem;">Propriedade</label>
            <Select v-model="form.propriedadeId" :options="propriedades" optionLabel="nome" optionValue="id" @change="onFazendaChange" placeholder="Selecione..." style="width:100%;" />
          </div>
          <div>
            <label style="display:block; font-size:0.75rem; font-weight:600; color:var(--ag-text-2); margin-bottom:0.375rem;">Lote</label>
            <Select v-model="form.loteId" :options="lotesFiltered" optionLabel="nome" optionValue="id" @change="onLoteChange" placeholder="Selecione..." style="width:100%;" :disabled="!form.propriedadeId" />
          </div>
          <div>
            <label style="display:block; font-size:0.75rem; font-weight:600; color:var(--ag-text-2); margin-bottom:0.375rem;">Categoria</label>
            <InputText v-model="form.categoria" placeholder="Ex: Novilhas" style="width:100%;" />
          </div>
          <div>
            <label style="display:block; font-size:0.75rem; font-weight:600; color:var(--ag-text-2); margin-bottom:0.375rem;">Retiro</label>
            <InputText v-model="form.retiro" placeholder="Pasto 1" style="width:100%;" />
          </div>
        </div>
      </div>

      <!-- Card 2: Detalhes do Protocolo -->
      <div class="ag-card">
        <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem; border-bottom:1px solid var(--ag-border); padding-bottom:0.75rem;">
          <div style="display:flex; align-items:center; justify-content:center; width:2rem; height:2rem; border-radius:0.5rem; background:var(--ag-primary-light); color:var(--ag-primary);">
            <svg style="width:1.25rem;height:1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
          </div>
          <h2 style="font-size:1rem; font-weight:700; color:var(--ag-text); margin:0;">Manejo e Tratamento</h2>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem;">
          <div>
            <label style="display:block; font-size:0.75rem; font-weight:600; color:var(--ag-text-2); margin-bottom:0.5rem;">Inseminação</label>
            <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
              <label v-for="tipo in tiposInseminacao" :key="tipo" class="ag-radio-box" :class="{ active: form.tipoInseminacao === tipo }">
                <input type="radio" :value="tipo" v-model="form.tipoInseminacao" style="display:none;" />
                {{ tipo }}
              </label>
            </div>
          </div>
          
          <div>
            <label style="display:block; font-size:0.75rem; font-weight:600; color:var(--ag-text-2); margin-bottom:0.5rem;">Vacina Reprodutiva?</label>
            <div style="display:flex; gap:0.5rem;">
              <label class="ag-radio-box" :class="{ active: form.vacinaReprodutiva === true }">
                <input type="radio" :value="true" v-model="form.vacinaReprodutiva" style="display:none;" />
                SIM
              </label>
              <label class="ag-radio-box" :class="{ active: form.vacinaReprodutiva === false }">
                <input type="radio" :value="false" v-model="form.vacinaReprodutiva" style="display:none;" />
                NÃO
              </label>
            </div>
          </div>

          <div>
            <label style="display:block; font-size:0.75rem; font-weight:600; color:var(--ag-text-2); margin-bottom:0.5rem;">Descongelamento</label>
            <div style="display:flex; gap:0.5rem;">
               <label v-for="opt in descongelamentoOpts" :key="opt.value" class="ag-radio-box" :class="{ active: form.tipoDescongelamento === opt.value }">
                <input type="radio" :value="opt.value" v-model="form.tipoDescongelamento" style="display:none;" />
                {{ opt.label }}
              </label>
            </div>
          </div>

          <div>
            <label style="display:block; font-size:0.75rem; font-weight:600; color:var(--ag-text-2); margin-bottom:0.5rem;">Progesterona (dias)</label>
            <div style="display:flex; gap:0.5rem;">
              <label v-for="d in [7, 8, 9]" :key="d" class="ag-radio-box" :class="{ active: form.diasProgesterona === d }">
                <input type="radio" :value="d" v-model="form.diasProgesterona" style="display:none;" />
                {{ d }}d
              </label>
            </div>
          </div>

          <div>
            <label style="display:block; font-size:0.75rem; font-weight:600; color:var(--ag-text-2); margin-bottom:0.5rem;">Estímulo</label>
            <div style="display:flex; gap:0.5rem;">
               <label v-for="e in ['CE','BE']" :key="e" class="ag-radio-box" :class="{ active: form.estimuloOvulatorio === e }">
                <input type="radio" :value="e" v-model="form.estimuloOvulatorio" style="display:none;" />
                {{ e }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 3: Datas -->
      <div class="ag-card">
        <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem; border-bottom:1px solid var(--ag-border); padding-bottom:0.75rem;">
          <div style="display:flex; align-items:center; justify-content:center; width:2rem; height:2rem; border-radius:0.5rem; background:color-mix(in srgb,#f59e0b 15%,transparent); color:#f59e0b;">
            <svg style="width:1.25rem;height:1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
          <h2 style="font-size:1rem; font-weight:700; color:var(--ag-text); margin:0;">Datas Importantes</h2>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem;">
          <!-- D-0 -->
          <div style="padding:0.75rem; border:1px solid var(--ag-border); border-radius:0.5rem; background:var(--ag-surface);">
             <span style="display:block; font-size:0.65rem; font-weight:800; color:#3b82f6; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem;">Implate (D-0)</span>
             <div style="display:flex; flex-direction:column; gap:0.5rem;">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span style="font-size:0.7rem; color:var(--ag-text-3); width:28px;">Ini:</span>
                  <input type="date" v-model="form.dataImplante" class="ag-input-neat" style="padding:0.3rem 0.5rem;" />
                </div>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span style="font-size:0.7rem; color:var(--ag-text-3); width:28px;">Fim:</span>
                  <input type="date" v-model="form.dataImplanteTermino" class="ag-input-neat" style="padding:0.3rem 0.5rem;" />
                </div>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span style="font-size:0.7rem; color:var(--ag-text-3); width:28px;">♂:</span>
                  <input v-model="form.touroImplante" placeholder="Nome/ID Touro" class="ag-input-neat" style="padding:0.3rem 0.5rem;" />
                </div>
             </div>
          </div>
          
          <!-- D-8 -->
          <div style="padding:0.75rem; border:1px solid var(--ag-border); border-radius:0.5rem; background:var(--ag-surface);">
             <span style="display:block; font-size:0.65rem; font-weight:800; color:#8b5cf6; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem;">Retirada (D-8)</span>
             <div style="display:flex; flex-direction:column; gap:0.5rem;">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span style="font-size:0.7rem; color:var(--ag-text-3); width:28px;">Dia:</span>
                  <input type="date" v-model="form.dataRetirada" class="ag-input-neat" style="padding:0.3rem 0.5rem;" />
                </div>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span style="font-size:0.7rem; color:var(--ag-text-3); width:28px;">Hora:</span>
                  <input type="time" v-model="form.horarioRetirada" class="ag-input-neat" style="padding:0.3rem 0.5rem;" />
                </div>
             </div>
          </div>

          <!-- 1a IA & DG -->
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div style="padding:0.75rem; border:1px solid var(--ag-border); border-radius:0.5rem; background:var(--ag-surface);">
              <span style="display:block; font-size:0.65rem; font-weight:800; color:#ec4899; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem;">Data 1ª IA</span>
              <input type="date" v-model="form.dataPrimeiraIa" class="ag-input-neat" style="padding:0.3rem 0.5rem;" />
            </div>
            <div style="padding:0.75rem; border:1px solid var(--ag-border); border-radius:0.5rem; background:var(--ag-surface);">
              <span style="display:block; font-size:0.65rem; font-weight:800; color:#14b8a6; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem;">Data DG Prevista</span>
              <input type="date" v-model="form.dataDg" class="ag-input-neat" style="padding:0.3rem 0.5rem;" />
            </div>
          </div>
        </div>
      </div>

      <!-- Card 4: Animais Table -->
      <div class="ag-card" style="padding:0; overflow:hidden;">
        <!-- Animals Section Header -->
        <div style="display:flex; align-items:center; justify-content:space-between; padding:0.75rem 1rem; background:color-mix(in srgb,var(--ag-primary) 8%,transparent); border-bottom:1px solid var(--ag-border);">
          <span style="font-weight:700; color:var(--ag-primary); font-size:0.8125rem; text-transform:uppercase; letter-spacing:0.06em;">
            ANIMAIS
            <span style="background:var(--ag-primary); color:#fff; border-radius:9999px; font-size:0.65rem; padding:0.1rem 0.4rem; margin-left:0.25rem;">{{ form.animais.length }}</span>
          </span>
          <Button size="small" label="+ Adicionar Animal" @click="addAnimal" />
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
                <td colspan="11" style="text-align:center; padding:2rem; color:var(--ag-text-3); font-size:0.8125rem;">
                  Nenhum animal adicionado. <span @click="addAnimal" style="color:var(--ag-primary); cursor:pointer; font-weight:600;">Adicionar agora</span>
                </td>
              </tr>
              <tr v-for="(animal, i) in form.animais" :key="i">
                <td style="text-align:center; font-weight:700; color:var(--ag-text-3); font-size:0.75rem;">{{ animal.ord }}</td>
                <td><input v-model="animal.femea" placeholder="ID/Tag" class="ag-input-neat" style="padding:0.4rem; font-weight:600; text-align:center;" /></td>
                <td style="padding:0;">
                  <button
                    class="ag-dg-btn"
                    :class="animal.dg_status === 'Prenhe' ? 'prenhe' : animal.dg_status === 'Vazia' ? 'vazia' : ''"
                    @click="animal.dg_status = animal.dg_status === 'Prenhe' ? 'Vazia' : (animal.dg_status === 'Vazia' ? undefined : 'Prenhe')"
                  >
                    {{ animal.dg_status === 'Prenhe' ? 'PRENHE' : animal.dg_status === 'Vazia' ? 'VAZIA' : '...' }}
                  </button>
                </td>
                <td><input type="date" v-model="animal.d0dg" class="ag-input-neat" style="padding:0.4rem;" /></td>
                <td><input type="date" v-model="animal.dg35" class="ag-input-neat" style="padding:0.4rem;" /></td>
                <td><input type="date" v-model="animal.d8" class="ag-input-neat" style="padding:0.4rem;" /></td>
                <td><input type="date" v-model="animal.gnrh" class="ag-input-neat" style="padding:0.4rem;" /></td>
                <td><input v-model="animal.touro" placeholder="Tag" class="ag-input-neat" style="padding:0.4rem; text-align:center;" /></td>
                <td><input v-model="animal.partida" placeholder="Nº" class="ag-input-neat" style="padding:0.4rem; text-align:center;" /></td>
                <td><input v-model="animal.obs" placeholder="..." class="ag-input-neat" style="padding:0.4rem;" /></td>
                <td style="text-align:center;">
                  <button @click="removeAnimal(i)" style="background:none; border:none; cursor:pointer; color:var(--ag-text-3); padding:0.25rem; font-size:0.75rem; transition:color 0.2s;"
                    onmouseover="this.style.color='#dc2626'" onmouseout="this.style.color='var(--ag-text-3)'">
                    <svg style="width:1.25rem; height:1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Bulk Add -->
        <div style="display:flex; align-items:center; gap:0.5rem; padding:0.625rem 0.75rem; border-top:1px solid var(--ag-border); background:var(--ag-bg-2);">
          <input
            type="number" v-model="bulkCount" min="1" max="200"
            class="ag-input-neat"
            style="width:80px; text-align:center; padding:0.4rem;"
          />
          <span style="font-size:0.8125rem; color:var(--ag-text-2); margin-right:auto;">linhas</span>
          <Button size="small" severity="secondary" outlined label="Adicionar linhas em lote" @click="bulkAddAnimals" />
        </div>
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
        @click="askSave"
        style="pointer-events:all; box-shadow:0 4px 16px rgba(22,163,74,.4); padding:0.75rem 2rem; font-size:1rem;"
      />
    </div>

    <!-- Confirm Save -->
    <AppConfirmModal
      v-model="confirmSave"
      :title="isNew ? 'Salvar novo protocolo?' : 'Atualizar protocolo?'"
      :message="isNew
        ? `Deseja criar um novo protocolo IATF para ${form.propriedade || 'a fazenda selecionada'} com ${form.animais.length} animal(is)?`
        : `Deseja salvar as alterações no protocolo de ${form.propriedade || 'a fazenda selecionada'} (${form.animais.length} animais)?`
      "
      type="success"
      :confirm-label="isNew ? 'Criar Protocolo' : 'Salvar Alterações'"
      @confirm="saveRecord"
    />
  </div>
</template>

<script setup lang="ts">
import { db } from '~/plugins/dexie.client'
import type { IatfAnimal } from '~/plugins/dexie.client'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const { addToQueue } = useSync()

const isNew = computed(() => route.params.id === 'novo')
const saving = ref(false)
const confirmSave = ref(false)

const askSave = () => {
  if (!form.proprietario) { appStore.notify('Preencha o proprietário.', 'error'); return }
  confirmSave.value = true
}

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
.ag-radio-box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid var(--ag-border);
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ag-text-2);
  background: var(--ag-bg-2);
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}
.ag-radio-box:hover {
  border-color: var(--ag-border-strong);
}
.ag-radio-box.active {
  background: color-mix(in srgb, var(--ag-primary) 10%, transparent);
  border-color: var(--ag-primary);
  color: var(--ag-primary);
}
.app-dark .ag-radio-box {
    background: #111827;
}
</style>
