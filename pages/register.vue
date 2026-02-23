<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-950 via-brand-950 to-gray-950 flex flex-col items-center justify-center px-4 py-10">
    <!-- Logo -->
    <div class="mb-8 text-center animate-fade-in">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 shadow-2xl shadow-brand-900/50 mb-4">
        <svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-white">Agrovet</h1>
      <p class="text-brand-400 text-sm mt-1">Criar nova conta</p>
    </div>

    <!-- Card -->
    <div class="w-full max-w-sm floating-card animate-slide-up">
      <h2 class="text-xl font-semibold text-white mb-6">Cadastro</h2>

      <!-- Success state -->
      <Transition name="slide-up">
        <div v-if="success" class="bg-brand-900/60 border border-brand-700 rounded-xl px-4 py-4 text-brand-200 text-sm">
          <p class="font-semibold mb-1">✓ Conta criada com sucesso!</p>
          <p class="text-brand-400 text-xs">Verifique seu e-mail para confirmar a conta, depois faça login.</p>
          <NuxtLink to="/login" class="mt-3 btn-primary w-full btn-sm block text-center">Ir para o login</NuxtLink>
        </div>
      </Transition>

      <form v-if="!success" @submit.prevent="handleRegister" class="space-y-4">
        <!-- Name -->
        <div>
          <label for="name" class="label">Nome completo *</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            autocomplete="name"
            placeholder="Seu nome"
            class="input-field"
            required
          />
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="label">E-mail *</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            placeholder="seu@email.com"
            class="input-field"
            required
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="label">Senha *</label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="Mínimo 6 caracteres"
              class="input-field pr-12"
              minlength="6"
              required
            />
            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300" @click="showPassword = !showPassword">
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="label">Confirmar senha *</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="Repita a senha"
            class="input-field"
            required
          />
          <p v-if="form.confirmPassword && form.password !== form.confirmPassword" class="text-red-400 text-xs mt-1">
            As senhas não coincidem.
          </p>
        </div>

        <!-- Error -->
        <Transition name="slide-up">
          <div v-if="error" class="bg-red-900/60 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm">
            {{ error }}
          </div>
        </Transition>

        <!-- Submit -->
        <button
          type="submit"
          class="btn-primary w-full mt-2"
          :disabled="loading || form.password !== form.confirmPassword"
        >
          <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ loading ? 'Cadastrando...' : 'Criar conta' }}
        </button>
      </form>

      <div class="mt-5 text-center">
        <p class="text-gray-500 text-sm">
          Já tem conta?
          <NuxtLink to="/login" class="text-brand-400 hover:text-brand-300 font-medium">Entrar</NuxtLink>
        </p>
      </div>
    </div>

    <p class="text-gray-600 text-xs mt-6">Agrovet v2.0 • Funciona offline</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const auth = useAuthStore()

const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const showPassword = ref(false)
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
