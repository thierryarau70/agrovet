import { getSupabase } from '~/plugins/supabase.client'
import { db } from '~/plugins/dexie.client'

// Use `any` cast for Supabase client since we don't have generated types yet
/* eslint-disable @typescript-eslint/no-explicit-any */

export const useSync = () => {
    const appStore = useAppStore()
    const auth = useAuthStore()
    const { isOnline } = useNetwork()

    const syncToServer = async () => {
        if (!isOnline.value || !auth.isLoggedIn) return
        const sb = getSupabase() as any
        const queue = await db.syncQueue.toArray()
        if (queue.length === 0) return

        appStore.isSyncing = true
        let synced = 0

        for (const item of queue) {
            try {
                const userId = auth.user?.id

                if (item.table === 'propriedades') {
                    await sb.from('propriedades').upsert({ ...item.data, user_id: userId, id: item.recordId })
                    await db.propriedades.update(item.recordId, { synced: true })
                }
                else if (item.table === 'lotes') {
                    await sb.from('lotes').upsert({ ...item.data, user_id: userId, id: item.recordId })
                    await db.lotes.update(item.recordId, { synced: true })
                }
                else if (item.table === 'animais') {
                    await sb.from('animais').upsert({ ...item.data, user_id: userId, id: item.recordId })
                    await db.animais.update(item.recordId, { synced: true })
                }
                else if (item.table === 'iatfRecords') {
                    await sb.from('iatf_records').upsert({
                        id: item.recordId,
                        user_id: userId,
                        lote_id: item.data.loteId || null,
                        propriedade_id: item.data.propriedadeId || null,
                        data: item.data,
                    })
                    await db.iatfRecords.update(item.recordId, { synced: true })
                }

                await db.syncQueue.delete(item.id!)
                synced++
            }
            catch {
                await db.syncQueue.update(item.id!, { attempts: item.attempts + 1 })
            }
        }

        appStore.isSyncing = false
        await appStore.updateSyncCount()

        if (synced > 0) {
            appStore.notify(`${synced} registro(s) sincronizado(s) com sucesso! ✓`, 'success')
        }
    }

    const pullFromServer = async () => {
        if (!isOnline.value || !auth.isLoggedIn) return
        const sb = getSupabase() as any
        appStore.isSyncing = true
        try {
            // Fetch all user data
            const [resProp, resLotes, resAnimais, resIatf] = await Promise.all([
                sb.from('propriedades').select('*'),
                sb.from('lotes').select('*'),
                sb.from('animais').select('*'),
                sb.from('iatf_records').select('*'),
            ])

            // Overwrite local indexedDB with user data from Supabase
            await db.transaction('rw', db.propriedades, db.lotes, db.animais, db.iatfRecords, async () => {
                if (resProp.data) {
                    await db.propriedades.clear()
                    await db.propriedades.bulkAdd(resProp.data.map((d: any) => ({ ...d, synced: true })))
                }
                if (resLotes.data) {
                    await db.lotes.clear()
                    await db.lotes.bulkAdd(resLotes.data.map((d: any) => ({ ...d, synced: true })))
                }
                if (resAnimais.data) {
                    await db.animais.clear()
                    await db.animais.bulkAdd(resAnimais.data.map((d: any) => ({ ...d, synced: true })))
                }
                if (resIatf.data) {
                    await db.iatfRecords.clear()
                    await db.iatfRecords.bulkAdd(resIatf.data.map((r: any) => ({
                        id: r.id,
                        loteId: r.lote_id,
                        propriedadeId: r.propriedade_id,
                        ...r.data,
                        synced: true,
                    })))
                }
            })
            appStore.notify('Dados atualizados da nuvem ✓', 'success')
        } catch (e) {
            console.error('Error pulling from server:', e)
        } finally {
            appStore.isSyncing = false
        }
    }

    const addToQueue = async (
        action: 'create' | 'update' | 'delete',
        table: string,
        recordId: number,
        data: any,
    ) => {
        await db.syncQueue.add({
            action,
            table,
            recordId,
            data,
            timestamp: new Date().toISOString(),
            attempts: 0,
        })
        await appStore.updateSyncCount()
        if (isOnline.value && auth.isLoggedIn) {
            await syncToServer()
        }
    }

    watch(isOnline, async (online) => {
        appStore.setOnline(online)
        if (online) {
            appStore.notify('Conexão restaurada! Sincronizando dados...', 'info')
            await syncToServer()
        }
        else {
            appStore.notify('Sem conexão. Dados salvos localmente.', 'warning')
        }
    })

    return { syncToServer, addToQueue, pullFromServer, isOnline }
}
