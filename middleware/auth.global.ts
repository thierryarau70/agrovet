export default defineNuxtRouteMiddleware(async (to) => {
    if (import.meta.server) return

    const auth = useAuthStore()
    const publicRoutes = ['/login', '/register']

    // If not logged in, try to restore session from localStorage token first (instant)
    // then also trigger async Supabase session restore in background
    if (!auth.isLoggedIn) {
        // Fast local restore — read from localStorage synchronously
        if (import.meta.client) {
            const savedUser = localStorage.getItem('agrovet_user')
            const savedToken = localStorage.getItem('agrovet_token')
            const savedExpiry = localStorage.getItem('agrovet_token_expiry')

            if (savedUser && savedToken && savedExpiry) {
                const expiryTime = parseInt(savedExpiry, 10)
                const now = Date.now()

                if (now < expiryTime) {
                    // Session still valid — restore immediately without network call
                    try {
                        auth.$patch({
                            user: JSON.parse(savedUser),
                            token: savedToken,
                            isAuthenticated: true,
                        })
                    } catch { /* ignore parse errors */ }
                } else {
                    // Session expired — clear storage and redirect
                    localStorage.removeItem('agrovet_user')
                    localStorage.removeItem('agrovet_token')
                    localStorage.removeItem('agrovet_token_expiry')
                }
            }
        }
    }

    // Route guard using current state (already restored above)
    if (!publicRoutes.includes(to.path) && !auth.isLoggedIn) {
        return navigateTo('/login')
    }

    if (publicRoutes.includes(to.path) && auth.isLoggedIn) {
        return navigateTo('/')
    }
})
