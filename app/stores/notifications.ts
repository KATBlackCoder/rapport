/**
 * Store notifications : notifications non lues.
 */
import type { Database } from '~/types/database.types'

type NotificationRow = Database['public']['Tables']['notifications']['Row']

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as NotificationRow[],
  }),

  getters: {
    unreadCount: (state) => state.notifications.filter((n) => !n.is_read).length,
  },

  actions: {
    setNotifications(notifications: NotificationRow[]) {
      this.notifications = notifications
    },

    async fetchUserNotifications(userId: string) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      this.setNotifications(data ?? [])
      return data
    },

    async markAsRead(id: string) {
      const supabase = useSupabaseClient()
      await supabase.from('notifications').update({ is_read: true }).eq('id', id)
      const n = this.notifications.find((x) => x.id === id)
      if (n) n.is_read = true
    },
  },
})
