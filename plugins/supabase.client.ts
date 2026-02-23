import { createClient } from '@supabase/supabase-js'

let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabase = () => {
    if (!supabaseInstance) {
        const config = useRuntimeConfig()
        const url = config.public.supabaseUrl as string
        const key = config.public.supabaseKey as string

        if (!url || !key) {
            throw new Error('Supabase não configurado. Verifique as variáveis de ambiente (SUPABASE_URL e SUPABASE_KEY).')
        }

        supabaseInstance = createClient(url, key)
    }
    return supabaseInstance
}

export default defineNuxtPlugin(() => {
    const supabase = getSupabase()
    return {
        provide: { supabase },
    }
})
