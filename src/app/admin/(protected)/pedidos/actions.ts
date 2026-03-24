'use server'

import { getAccessToken } from '@/lib/auth-cookies'
import { createServerClient } from '@/lib/insforge'
import type { Pedido, EstadoPedido } from '@/types'

export async function fetchPedidos(filtroEstado?: string): Promise<Pedido[]> {
  try {
    const token = await getAccessToken()
    if (!token) return []
    const insforge = createServerClient(token)
    let query = insforge.database
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false })
    if (filtroEstado) query = query.eq('estado', filtroEstado)
    const { data } = await query
    return (data as Pedido[]) ?? []
  } catch {
    return []
  }
}

export async function actualizarEstadoPedido(id: string, estado: EstadoPedido): Promise<{ ok: boolean }> {
  const token = await getAccessToken()
  if (!token) return { ok: false }
  const insforge = createServerClient(token)
  const { error } = await insforge.database
    .from('pedidos')
    .update({ estado })
    .eq('id', id)
  return { ok: !error }
}
