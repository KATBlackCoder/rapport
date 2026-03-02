// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@nuxt/ui',
    '@vite-pwa/nuxt',
  ],
  css: ['~/assets/css/main.css'],

  // TypeScript strict (skill nuxt-config)
  typescript: {
    strict: true,
    typeCheck: false, // exécuter manuellement : pnpm exec nuxi typecheck
  },

  // SPA/SSR hybride : pages auth en SPA (offline), reste en SSR
  routeRules: {
    '/login': { ssr: false },
    '/change-password': { ssr: false },
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    serviceKey: process.env.SUPABASE_SECRET_KEY,
    redirect: false,
  },

  pinia: {
    storesDirs: ['./app/stores'],
  },
})