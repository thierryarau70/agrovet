export default defineNuxtRouteMiddleware((to) => {
    if (import.meta.server) return

    const auth = useAuthStore()
    auth.restoreSession()

    const publicRoutes = ['/login', '/register']

    if (!publicRoutes.includes(to.path) && !auth.isLoggedIn) {
        return navigateTo('/login')
    }

    if (publicRoutes.includes(to.path) && auth.isLoggedIn) {
        return navigateTo('/')
    }
})
