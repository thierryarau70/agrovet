export default defineNuxtRouteMiddleware((to) => {
    if (import.meta.server) return

    const auth = useAuthStore()
    auth.restoreSession()

    if (to.path !== '/login' && !auth.isLoggedIn) {
        return navigateTo('/login')
    }

    if (to.path === '/login' && auth.isLoggedIn) {
        return navigateTo('/')
    }
})
