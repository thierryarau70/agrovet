<template>
  <div class="ag-login-bg">
    <!-- Logo -->
    <div style="text-align:center; margin-bottom:2rem;">
      <div style="display:inline-flex; align-items:center; justify-content:center; width:5rem; height:5rem; border-radius:1.25rem; background:linear-gradient(135deg,#16a34a,#15803d); box-shadow:0 8px 24px rgba(22,163,74,.35); margin-bottom:1rem;">
        <svg style="width:2.5rem;height:2.5rem;color:#fff;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <h1 style="font-size:1.875rem; font-weight:700; color:var(--ag-text); margin:0;">Agrovet</h1>
      <p style="color:var(--ag-primary); font-size:0.875rem; margin-top:0.25rem;">Sistema Veterinário IATF</p>
    </div>

    <!-- Login Card -->
    <div class="ag-login-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
        <h2 style="font-size:1.125rem; font-weight:600; color:var(--ag-text); margin:0;">Entrar na conta</h2>
        <ThemeToggle />
      </div>

      <form @submit.prevent="handleLogin" style="display:flex; flex-direction:column; gap:1rem;">
        <!-- Email -->
        <div class="p-field">
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">E-mail</label>
          <InputText
            v-model="form.email"
            type="email"
            placeholder="seu@email.com"
            autocomplete="email"
            required
            style="width:100%;"
          />
        </div>

        <!-- Password -->
        <div class="p-field">
          <label style="display:block; font-size:0.8125rem; font-weight:500; color:var(--ag-text-2); margin-bottom:0.375rem;">Senha</label>
          <Password
            v-model="form.password"
            placeholder="Sua senha"
            :feedback="false"
            toggle-mask
            style="width:100%;"
            input-style="width:100%;"
            autocomplete="current-password"
          />
        </div>

        <!-- Error -->
        <Message v-if="error" severity="error" :closable="false" style="margin:0;">
          {{ error }}
        </Message>

        <!-- Submit -->
        <Button
          type="submit"
          :loading="loading"
          label="Entrar"
          :disabled="loading"
          style="width:100%; margin-top:0.5rem;"
        />
      </form>

      <div style="margin-top:1.25rem; text-align:center;">
        <span style="font-size:0.875rem; color:var(--ag-text-3);">
          Não tem conta?
          <NuxtLink to="/register" style="color:var(--ag-primary); font-weight:600; text-decoration:none;">
            Cadastrar-se
          </NuxtLink>
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
const router = useRouter()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try {
    await auth.login(form.email, form.password)
    await router.push('/')
  } catch (e: any) {
    error.value = e.message || 'Erro ao entrar'
  } finally {
    loading.value = false
  }
}
</script>

