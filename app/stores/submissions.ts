/**
 * Store submissions : soumissions en cours, file d'attente offline.
 * Persisté pour envoi à la reconnexion.
 */
export interface PendingSubmission {
  formId: string
  rows: Array<Record<string, unknown>>
  photoQueue: Array<{ rowIndex: number; base64: string }>
  createdAt: number
}

export const useSubmissionsStore = defineStore('submissions', {
  state: () => ({
    pending: [] as PendingSubmission[],
  }),

  actions: {
    addPending(submission: PendingSubmission) {
      this.pending.push(submission)
    },

    removePending(index: number) {
      this.pending.splice(index, 1)
    },

    clearPending() {
      this.pending = []
    },
  },

  persist: {
    key: 'submissions-pending',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  },
})
