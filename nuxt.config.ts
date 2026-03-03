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

  // SPA/SSR hybride : pages auth + index (permissions client-side) en SPA
  routeRules: {
    '/': { ssr: false },
    '/login': { ssr: false },
    '/change-password': { ssr: false },
    '/parametres/**': { ssr: false },
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