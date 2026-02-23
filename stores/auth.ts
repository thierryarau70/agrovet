import { defineStore } from 'pinia'

interface User {
    id: number
    name: string
    email: string
    role: 'admin' | 'veterinario' | 'operador'
}

interface AuthState {
    user: User | null
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
    },

    actions: {
        async login(email: string, password: string) {
            // Simulate auth – replace with real API call
            const validUsers = [
                { id: 1, email: 'admin@agrovet.com', password: 'admin123', name: 'Administrador', role: 'admin' as const },
                { id: 2, email: 'vet@agrovet.com', password: 'vet123', name: 'Dr. Veterinário', role: 'veterinario' as const },
                { id: 3, email: 'op@agrovet.com', password: 'op123', name: 'Operador Campo', role: 'operador' as const },
            ]

            const found = validUsers.find(u => u.email === email && u.password === password)
            if (!found) throw new Error('Email ou senha inválidos')

            const { password: _, ...user } = found
            this.user = user
            this.token = `mock-token-${user.id}-${Date.now()}`
            this.isAuthenticated = true

            if (import.meta.client) {
                localStorage.setItem('agrovet_token', this.token)
                localStorage.setItem('agrovet_user', JSON.stringify(this.user))
            }
        },

        logout() {
            this.user = null
            this.token = null
            this.isAuthenticated = false
            if (import.meta.client) {
                localStorage.removeItem('agrovet_token')
                localStorage.removeItem('agrovet_user')
            }
        },

        restoreSession() {
            if (!import.meta.client) return
            const token = localStorage.getItem('agrovet_token')
            const userStr = localStorage.getItem('agrovet_user')
            if (token && userStr) {
                this.token = token
                this.user = JSON.parse(userStr)
                this.isAuthenticated = true
            }
        },
    },
})
