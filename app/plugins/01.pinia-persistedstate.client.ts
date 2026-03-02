/**
 * Plugin Pinia persistedstate pour la persistance offline.
 * Persiste auth, forms, submissions dans localStorage.
 */
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia as { use: (plugin: unknown) => void }
  pinia.use(piniaPluginPersistedstate)
})
