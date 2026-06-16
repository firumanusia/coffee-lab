import type { DataProvider } from 'react-admin'
import { http } from './http'

type Rec = { id: string } & Record<string, any>

/** Client-side list (our API returns full arrays); handles q-search, sort, paginate. */
function processList(rows: Rec[], params: any) {
  let data = [...rows]
  const filter = params.filter ?? {}
  const q = (filter.q ?? '').toString().toLowerCase()
  if (q) data = data.filter((r) => JSON.stringify(r).toLowerCase().includes(q))
  for (const [k, v] of Object.entries(filter)) {
    if (k === 'q' || v === undefined || v === '') continue
    data = data.filter((r) => String(r[k]) === String(v))
  }
  const { field = 'id', order = 'ASC' } = params.sort ?? {}
  data.sort((a, b) => {
    const av = a[field], bv = b[field]
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return order === 'ASC' ? cmp : -cmp
  })
  const total = data.length
  const { page = 1, perPage = 25 } = params.pagination ?? {}
  return { data: data.slice((page - 1) * perPage, page * perPage), total }
}

export const dataProvider = {
  getList: async (resource: string, params: any) => processList(await http<Rec[]>(`/admin/${resource}`), params),
  getOne: async (resource: string, params: any) => ({ data: await http<Rec>(`/admin/${resource}/${params.id}`) }),
  getMany: async (resource: string, params: any) => {
    const all = await http<Rec[]>(`/admin/${resource}`)
    return { data: all.filter((r) => params.ids.map(String).includes(String(r.id))) }
  },
  getManyReference: async (resource: string, params: any) => processList(await http<Rec[]>(`/admin/${resource}`), params),
  create: async (resource: string, params: any) => ({ data: await http<Rec>(`/admin/${resource}`, { method: 'POST', body: JSON.stringify(params.data) }) }),
  update: async (resource: string, params: any) => ({ data: await http<Rec>(`/admin/${resource}/${params.id}`, { method: 'PUT', body: JSON.stringify(params.data) }) }),
  updateMany: async (resource: string, params: any) => {
    await Promise.all(params.ids.map((id: string) => http(`/admin/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(params.data) })))
    return { data: params.ids }
  },
  delete: async (resource: string, params: any) => {
    await http(`/admin/${resource}/${params.id}`, { method: 'DELETE' })
    return { data: params.previousData as Rec }
  },
  deleteMany: async (resource: string, params: any) => {
    await Promise.all(params.ids.map((id: string) => http(`/admin/${resource}/${id}`, { method: 'DELETE' })))
    return { data: params.ids }
  },
} as unknown as DataProvider
