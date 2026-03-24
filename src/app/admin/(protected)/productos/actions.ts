'use server'

import { getAccessToken } from '@/lib/auth-cookies'
import { createServerClient } from '@/lib/insforge'
import type { CategoriaProducto } from '@/types'

interface ProductoPayload {
  nombre: string
  descripcion: string | null
  precio: number
  categoria: CategoriaProducto
  imagen_url: string | null
  stock: number
  activo: boolean
}

export async function crearProducto(payload: ProductoPayload): Promise<{ ok: boolean; error?: string }> {
  const token = await getAccessToken()
  if (!token) return { ok: false, error: 'No autorizado' }
  const insforge = createServerClient(token)
  const { error } = await insforge.database.from('productos').insert([payload])
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function actualizarProducto(id: string, payload: ProductoPayload): Promise<{ ok: boolean; error?: string }> {
  const token = await getAccessToken()
  if (!token) return { ok: false, error: 'No autorizado' }
  const insforge = createServerClient(token)
  const { error } = await insforge.database.from('productos').update(payload).eq('id', id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function eliminarProducto(id: string): Promise<{ ok: boolean }> {
  const token = await getAccessToken()
  if (!token) return { ok: false }
  const insforge = createServerClient(token)
  const { error } = await insforge.database.from('productos').delete().eq('id', id)
  return { ok: !error }
}
