import { db } from '~/plugins/dexie.client'

export const useAppStore = defineStore('app', {
    state: () => ({
        notifications: [] as { id: number; type: 'success' | 'error' | 'warning' | 'info'; message: string }[],
        isOnline: true,
        syncPending: 0,
        isSyncing: false,
    }),

    actions: {
        notify(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
            const id = Date.now()
            this.notifications.push({ id, type, message })
            setTimeout(() => {
                this.notifications = this.notifications.filter(n => n.id !== id)
            }, 4000)
        },

        dismissNotification(id: number) {
            this.notifications = this.notifications.filter(n => n.id !== id)
        },

        setOnline(val: boolean) {
            this.isOnline = val
        },

        async updateSyncCount() {
            if (!import.meta.client) return
            try {
                this.syncPending = await db.syncQueue.count()
            } catch { }
        },
    },
})
