<template>
  <div class="landing-page">
    <!-- Navbar -->
    <nav class="landing-nav">
      <div class="nav-container">
        <div class="logo-group">
          <div class="logo-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span class="logo-text">Agrovet v2.0</span>
        </div>
        <div class="nav-actions">
          <ThemeToggle />
          <NuxtLink to="/login" class="btn-login">Entrar</NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="badge-new">
          <span class="pulse-dot"></span>
          Agora com suporte Offline 📶
        </div>
        <h1 class="hero-title">
          O Futuro da Gestão <br/>
          <span class="text-gradient">Reprodutiva Bovina</span>
        </h1>
        <p class="hero-subtitle">
          Gerencie fazendas, lotes, animais e protocolos IATF com sincronização na nuvem e design de ponta. Tenha o controle do seu rebanho na palma da mão.
        </p>
        <div class="hero-cta">
          <NuxtLink to="/register" class="btn-primary">Criar Conta Grátis</NuxtLink>
          <NuxtLink to="/login" class="btn-secondary">Acessar Sistema</NuxtLink>
        </div>
      </div>
      
      <!-- Decorative Background Elements -->
      <div class="bg-blur-blob blob-1"></div>
      <div class="bg-blur-blob blob-2"></div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="features-container">
        <h2 class="section-title">Um ecossistema feito para o campo</h2>
        
        <div class="features-grid">
          <!-- Card 1 -->
          <div class="feature-card">
            <div class="feature-icon bg-green">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h3>Offline First</h3>
            <p>Trabalhe no pasto sem internet. O sistema salva os dados localmente e sincroniza quando você chegar na sede.</p>
          </div>
          
          <!-- Card 2 -->
          <div class="feature-card">
            <div class="feature-icon bg-blue">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
            </div>
            <h3>Assistente IATF</h3>
            <p>Criação de protocolos passo-a-passo. Reduz erros e unifica manejo, doses de sêmen e datas em um painel simples.</p>
          </div>
          
          <!-- Card 3 -->
          <div class="feature-card">
            <div class="feature-icon bg-purple">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <h3>Calendário Inteligente</h3>
            <p>Seus protocolos geram automaticamente as datas de D-0, confirmação de DG, previsão de partos e vacinas.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="landing-footer">
      <p>© {{ new Date().getFullYear() }} Agrovet. Todos os direitos reservados.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const auth = useAuthStore()
const router = useRouter()

// If already logged in when visiting this page, redirect to dashboard
onMounted(() => {
  if (auth.isLoggedIn) {
    router.push('/')
  }
})
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: var(--ag-bg);
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Nav */
.landing-nav {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 1rem 0;
  background: rgba(var(--ag-surface-rgb), 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid color-mix(in srgb, var(--ag-border) 40%, transparent);
  z-index: 50;
}
.nav-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #16a34a, #15803d);
  color: #fff;
}
.logo-icon svg { width: 1.25rem; height: 1.25rem; }
.logo-text {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--ag-text);
  letter-spacing: -0.02em;
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.btn-login {
  padding: 0.5rem 1.25rem;
  border-radius: 2rem;
  background: var(--ag-bg-2);
  color: var(--ag-text);
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  border: 1px solid var(--ag-border);
  transition: all 0.2s;
}
.btn-login:hover {
  background: var(--ag-primary-light);
  color: var(--ag-primary);
  border-color: var(--ag-primary);
}

/* Hero */
.hero-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rem 1.5rem 5rem;
  position: relative;
  text-align: center;
}
.hero-content {
  max-width: 768px;
  position: relative;
  z-index: 10;
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.badge-new {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: color-mix(in srgb, var(--ag-primary) 10%, transparent);
  color: var(--ag-primary);
  border-radius: 2rem;
  font-size: 0.8125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  border: 1px solid color-mix(in srgb, var(--ag-primary) 20%, transparent);
}
.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ag-primary);
  box-shadow: 0 0 0 rgba(22, 163, 74, 0.4);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(22, 163, 74, 0); }
  100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  color: var(--ag-text);
  margin: 0 0 1.25rem;
  letter-spacing: -0.03em;
}
.text-gradient {
  background: linear-gradient(135deg, #16a34a, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--ag-text-2);
  line-height: 1.6;
  margin: 0 auto 2.5rem;
  max-width: 600px;
}

.hero-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
@media (max-width: 500px) {
  .hero-cta { flex-direction: column; }
  .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  padding: 0.875rem 2rem;
  background: var(--ag-primary);
  color: #fff;
  border-radius: 2rem;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  box-shadow: 0 10px 25px -5px rgba(22, 163, 74, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(22, 163, 74, 0.5);
}
.btn-secondary {
  display: inline-flex;
  align-items: center;
  padding: 0.875rem 2rem;
  background: var(--ag-surface);
  color: var(--ag-text);
  border: 1px solid var(--ag-border);
  border-radius: 2rem;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-secondary:hover {
  background: var(--ag-bg-2);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

/* Background Blobs */
.bg-blur-blob {
  position: absolute;
  filter: blur(80px);
  z-index: 1;
  opacity: 0.3;
  border-radius: 50%;
  pointer-events: none;
}
:root[data-theme="dark"] .bg-blur-blob { opacity: 0.15; }
.blob-1 {
  width: 400px;
  height: 400px;
  background: #16a34a;
  top: -100px;
  left: -100px;
}
.blob-2 {
  width: 300px;
  height: 300px;
  background: #3b82f6;
  bottom: -50px;
  right: -50px;
}

/* Features */
.features-section {
  padding: 5rem 1.5rem;
  background: color-mix(in srgb, var(--ag-bg-2) 50%, transparent);
  border-top: 1px solid var(--ag-border);
}
.features-container {
  max-width: 1100px;
  margin: 0 auto;
}
.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  color: var(--ag-text);
  margin-bottom: 3rem;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
.feature-card {
  padding: 2rem;
  background: var(--ag-surface);
  border-radius: 1.5rem;
  border: 1px solid color-mix(in srgb, var(--ag-border) 60%, transparent);
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.02);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s;
}
.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08);
}
.feature-icon {
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  color: #fff;
}
.feature-icon svg { width: 1.75rem; height: 1.75rem; }
.bg-green { background: linear-gradient(135deg, #10b981, #059669); }
.bg-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.bg-purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--ag-text);
  margin: 0 0 0.75rem;
}
.feature-card p {
  font-size: 0.9375rem;
  color: var(--ag-text-2);
  line-height: 1.6;
  margin: 0;
}

/* Footer */
.landing-footer {
  padding: 2rem 1.5rem;
  text-align: center;
  color: var(--ag-text-3);
  font-size: 0.8125rem;
  border-top: 1px solid var(--ag-border);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
