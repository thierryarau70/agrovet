import { db } from '~/plugins/dexie.client'

export const useSync = () => {
    const appStore = useAppStore()
    const { isOnline } = useNetwork()

    const syncToServer = async () => {
        if (!isOnline.value) return
        const queue = await db.syncQueue.toArray()
        if (queue.length === 0) return

        appStore.isSyncing = true
        let synced = 0

        for (const item of queue) {
            try {
                // Mark the original record as synced
                if (item.table === 'propriedades') {
                    await db.propriedades.update(item.recordId, { synced: true })
                } else if (item.table === 'lotes') {
                    await db.lotes.update(item.recordId, { synced: true })
                } else if (item.table === 'animais') {
                    await db.animais.update(item.recordId, { synced: true })
                } else if (item.table === 'iatfRecords') {
                    await db.iatfRecords.update(item.recordId, { synced: true })
                }
                await db.syncQueue.delete(item.id!)
                synced++
            } catch (e) {
                await db.syncQueue.update(item.id!, { attempts: item.attempts + 1 })
            }
        }

        appStore.isSyncing = false
        await appStore.updateSyncCount()

        if (synced > 0) {
            appStore.notify(`${synced} registro(s) sincronizado(s) com sucesso! ✓`, 'success')
        }
    }

    const addToQueue = async (action: 'create' | 'update' | 'delete', table: string, recordId: number, data: any) => {
        await db.syncQueue.add({
            action,
            table,
            recordId,
            data,
            timestamp: new Date().toISOString(),
            attempts: 0,
        })
        await appStore.updateSyncCount()
    }

    // Watch online status
    watch(isOnline, async (online) => {
        appStore.setOnline(online)
        if (online) {
            appStore.notify('Conexão restaurada! Sincronizando dados...', 'info')
            await syncToServer()
        } else {
            appStore.notify('Sem conexão. Dados serão salvos localmente.', 'warning')
        }
    })

    return { syncToServer, addToQueue, isOnline }
}
