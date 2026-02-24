<template>
  <div class="ag-login-bg">
    <!-- Logo -->
    <div style="text-align:center; margin-bottom:1.5rem;">
      <div style="display:inline-flex; align-items:center; justify-content:center; width:4rem; height:4rem; border-radius:1rem; background:linear-gradient(135deg,#16a34a,#15803d); box-shadow:0 8px 24px rgba(22,163,74,.35); margin-bottom:0.75rem;">
        <svg style="width:2rem;height:2rem;color:#fff;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <h1 style="font-size:1.75rem; font-weight:700; color:var(--ag-text); margin:0;">Agrovet</h1>
      <p style="color:var(--ag-primary); font-size:0.875rem; margin-top:0.25rem;">Criar nova conta</p>
    </div>

    <!-- Card -->
    <div class="ag-login-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
        <h2 style="font-size:1.125rem; font-weight:600; color:var(--ag-text); margin:0;">Cadastro</h2>
        <ThemeToggle />
      </div>

      <!-- Success state -->
      <div v-if="success" style="background: color-mix(in srgb, var(--ag-primary) 10%, transparent); border: 1px solid var(--ag-primary); border-radius:0.75rem; padding:1rem; color:var(--ag-text);">
        <p style="font-weight:600; margin:0 0 0.25rem;">✓ Conta criada com sucesso!</p>
        <p style="font-size:0.8125rem; color:var(--ag-text-2); margin:0 0 0.75rem;">Verifique seu e-mail para confirmar a conta.</p>
        <Button as="a" href="/login" label="Ir para o login" style="width:100%;" />
      </div>

      <form v-if="!success" @submit.prevent="handleRegister" style="display:flex; flex-direction:column; gap:1rem;">
        <div class="p-field">
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Nome completo *</label>
          <InputText v-model="form.name" type="text" placeholder="Seu nome" required style="width:100%;" />
        </div>

        <div class="p-field">
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">E-mail *</label>
          <InputText v-model="form.email" type="email" placeholder="seu@email.com" required style="width:100%;" autocomplete="email" />
        </div>

        <div class="p-field">
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Senha *</label>
          <Password v-model="form.password" placeholder="Mínimo 6 caracteres" :feedback="false" toggle-mask style="width:100%;" input-style="width:100%;" autocomplete="new-password" />
        </div>

        <div class="p-field">
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Confirmar senha *</label>
          <Password v-model="form.confirmPassword" placeholder="Repetir senha" :feedback="false" toggle-mask style="width:100%;" input-style="width:100%;" autocomplete="new-password" />
          <small v-if="form.confirmPassword && form.password !== form.confirmPassword" style="color:#dc2626; font-size:0.75rem;">As senhas não coincidem.</small>
        </div>

        <Message v-if="error" severity="error" :closable="false" style="margin:0;">{{ error }}</Message>

        <Button
          type="submit"
          :loading="loading"
          label="Criar conta"
          :disabled="loading || form.password !== form.confirmPassword"
          style="width:100%; margin-top:0.25rem;"
        />
      </form>

      <div style="margin-top:1.25rem; text-align:center;">
        <span style="font-size:0.875rem; color:var(--ag-text-3);">
          Já tem conta?
          <NuxtLink to="/login" style="color:var(--ag-primary); font-weight:600; text-decoration:none;">Entrar</NuxtLink>
        </span>
      </div>
    </div>

    <p style="color:var(--ag-text-3); font-size:0.75rem; margin-top:1.5rem;">Agrovet v2.0 • Funciona offline</p>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

definePageMeta({ layout: false })

const auth = useAuthStore()

const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) return
  if (loading.value) return
  loading.value = true
  error.value = ''
  try {
    await auth.register(form.name, form.email, form.password)
    success.value = true
  } catch (e: any) {
    error.value = e.message || 'Erro ao cadastrar. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

