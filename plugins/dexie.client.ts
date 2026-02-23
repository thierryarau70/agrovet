import Dexie, { type Table } from 'dexie'

export interface Propriedade {
    id?: number
    nome: string
    proprietario: string
    municipio: string
    estado: string
    createdAt: string
    updatedAt: string
    synced: boolean
}

export interface Lote {
    id?: number
    propriedadeId: number
    nome: string
    categoria: string
    retiro: string
    createdAt: string
    updatedAt: string
    synced: boolean
}

export interface Animal {
    id?: number
    loteId: number
    ord: number
    femea: string
    categoria: string
    observacao?: string
    status_prenhez?: 'Prenhe' | 'Vazia'
    createdAt: string
    updatedAt: string
    synced: boolean
}

export interface IatfRecord {
    id?: number
    loteId: number
    propriedadeId: number
    // Header
    proprietario: string
    propriedade: string
    tipoInseminacao: '1 IATF' | 'Ressinc1' | 'Ressinc2'
    vacinaReprodutiva: boolean
    tipoDescongelamento: 'comum' | 'eletronico'
    diasProgesterona: 7 | 8 | 9
    estimuloOvulatorio: 'CE' | 'BE'
    // Lote info
    lote: string
    categoria: string
    retiro: string
    // Dates
    dataImplante: string
    dataImplanteTermino: string
    touroImplante: string
    dataRetirada: string
    horarioRetirada: string
    dataPrimeiraIa: string
    dataDg: string
    // Animals table
    animais: IatfAnimal[]
    createdAt: string
    updatedAt: string
    synced: boolean
}

export interface IatfAnimal {
    ord: number
    femea: string
    d0dg: string
    dg35: string
    d8: string
    gnrh: string
    touro: string
    partida: string
    obs: string
    dg_status?: 'Prenhe' | 'Vazia'
}

export interface SyncQueueItem {
    id?: number
    action: 'create' | 'update' | 'delete'
    table: string
    recordId: number
    data: any
    timestamp: string
    attempts: number
}

class AgrovetDB extends Dexie {
    propriedades!: Table<Propriedade>
    lotes!: Table<Lote>
    animais!: Table<Animal>
    iatfRecords!: Table<IatfRecord>
    syncQueue!: Table<SyncQueueItem>

    constructor() {
        super('agrovet_db')
        this.version(1).stores({
            propriedades: '++id, nome, proprietario, synced',
            lotes: '++id, propriedadeId, nome, categoria, synced',
            animais: '++id, loteId, femea, synced',
            iatfRecords: '++id, loteId, propriedadeId, synced, createdAt',
            syncQueue: '++id, action, table, recordId, timestamp',
        })
    }
}

export const db = new AgrovetDB()

export default defineNuxtPlugin(() => {
    return {
        provide: {
            db,
        },
    }
})
