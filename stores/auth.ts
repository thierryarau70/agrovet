import { defineStore } from 'pinia'
import { getSupabase } from '~/plugins/supabase.client'

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
                localStorage.setItem('agrovet_user', JSON.stringify(this.user))
                localStorage.setItem('agrovet_token', this.token || '')
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
            }
        },

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
                }
            } catch { }
        },
    },
})
