// https://nuxt.com/docs/api/configuration/nuxt-config
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

const AgrovetPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{green.50}',
      100: '{green.100}',
      200: '{green.200}',
      300: '{green.300}',
      400: '{green.400}',
      500: '{green.500}',
      600: '{green.600}',
      700: '{green.700}',
      800: '{green.800}',
      900: '{green.900}',
      950: '{green.950}',
    }
  }
})

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: false,

  srcDir: '.',
  css: ['~/assets/css/main.css'],

  imports: {
    dirs: ['stores'],
  },

  modules: [
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
  ],

  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: AgrovetPreset,
        options: {
          prefix: 'p',
          darkModeSelector: '.app-dark',
          cssLayer: false,
        }
      }
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Agrovet - Sistema Veterinário',
      short_name: 'Agrovet',
      description: 'Sistema de gestão veterinária com suporte offline',
      theme_color: '#16a34a',
      background_color: '#052e16',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\//],
      type: 'module',
    },
  },

  app: {
    head: {
      title: 'Agrovet - Sistema Veterinário',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sistema veterinário para gestão de IATF e animais' },
        { name: 'theme-color', content: '#16a34a' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      appVersion: '2.0.0',
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || '',
    },
  },
})
