import { defineStore } from 'pinia'
import { getSupabase } from '~/plugins/supabase.client'

const SESSION_DURATION_MS = 2 * 60 * 60 * 1000 // 2 hours in milliseconds

interface Profile {
    id: string
    name: string
    email: string
    role: 'admin' | 'veterinario' | 'operador'
}

interface AuthState {
    user: Profile | null
    token: string | null
    isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        token: null,
        isAuthenticated: false,
    }),

    getters: {
        currentUser: (state) => state.user,
        isLoggedIn: (state) => state.isAuthenticated && !!state.token,
        isAdmin: (state) => state.user?.role === 'admin',
    },

    actions: {
        /** Persists auth data to localStorage with a 2-hour expiry timestamp. */
        _saveToStorage(user: Profile, token: string) {
            if (!import.meta.client) return
            const expiry = Date.now() + SESSION_DURATION_MS
            localStorage.setItem('agrovet_user', JSON.stringify(user))
            localStorage.setItem('agrovet_token', token)
            localStorage.setItem('agrovet_token_expiry', String(expiry))
        },

        /** Refreshes the session expiry (call on user activity). */
        refreshSessionExpiry() {
            if (!import.meta.client) return
            const token = localStorage.getItem('agrovet_token')
            const user = localStorage.getItem('agrovet_user')
            if (token && user && this.isAuthenticated) {
                const expiry = Date.now() + SESSION_DURATION_MS
                localStorage.setItem('agrovet_token_expiry', String(expiry))
            }
        },

        async login(email: string, password: string) {
            const supabase = getSupabase()
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw new Error(error.message)

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single()

            if (profileError) throw new Error('Perfil não encontrado. Contacte o administrador.')

            this.user = profile as Profile
            this.token = data.session?.access_token || null
            this.isAuthenticated = true

            if (import.meta.client) {
                // Save with 2-hour expiry
                this._saveToStorage(this.user!, this.token || '')

                // Clear local DB and pull fresh data for this user
                const { db } = await import('~/plugins/dexie.client')
                await Promise.all([
                    db.propriedades.clear(),
                    db.lotes.clear(),
                    db.animais.clear(),
                    db.iatfRecords.clear(),
                    db.syncQueue.clear(),
                ])
                const { useSync } = await import('~/composables/useSync')
                const { pullFromServer } = useSync()
                await pullFromServer()
            }
        },

        async register(name: string, email: string, password: string) {
            const supabase = getSupabase()
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { name } },
            })
            if (error) throw new Error(error.message)
        },

        async logout() {
            const supabase = getSupabase()
            await supabase.auth.signOut()
            this.user = null
            this.token = null
            this.isAuthenticated = false
            if (import.meta.client) {
                localStorage.removeItem('agrovet_token')
                localStorage.removeItem('agrovet_user')
                localStorage.removeItem('agrovet_token_expiry')

                // Wipe all local data for privacy and multi-user support
                const { db } = await import('~/plugins/dexie.client')
                await Promise.all([
                    db.propriedades.clear(),
                    db.lotes.clear(),
                    db.animais.clear(),
                    db.iatfRecords.clear(),
                    db.syncQueue.clear(),
                ])

                const appStore = useAppStore()
                await appStore.updateSyncCount()
            }
        },

        /** Async background restore via Supabase (not used for route guarding). */
        async restoreSession() {
            if (!import.meta.client) return
            try {
                const supabase = getSupabase()
                const { data: { session } } = await supabase.auth.getSession()
                if (!session) return

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()

                if (profile) {
                    this.user = profile as Profile
                    this.token = session.access_token
                    this.isAuthenticated = true
                    // Refresh the localStorage expiry since Supabase confirmed it's valid
                    this._saveToStorage(this.user!, this.token!)
                }
            } catch { }
        },
    },
})
