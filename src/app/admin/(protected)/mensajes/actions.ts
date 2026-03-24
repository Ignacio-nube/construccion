'use server'

import { getAccessToken } from '@/lib/auth-cookies'
import { createServerClient } from '@/lib/insforge'
import type { MensajeContacto } from '@/types'

export async function fetchMensajes(): Promise<MensajeContacto[]> {
  try {
    const token = await getAccessToken()
    if (!token) return []
    const insforge = createServerClient(token)
    const { data } = await insforge.database
      .from('mensajes_contacto')
      .select('*')
      .order('created_at', { ascending: false })
    return (data as MensajeContacto[]) ?? []
  } catch {
    return []
  }
}

export async function marcarMensajeLeido(id: string): Promise<void> {
  const token = await getAccessToken()
  if (!token) return
  const insforge = createServerClient(token)
  await insforge.database
    .from('mensajes_contacto')
    .update({ leido: true })
    .eq('id', id)
}

export async function eliminarMensaje(id: string): Promise<{ ok: boolean }> {
  const token = await getAccessToken()
  if (!token) return { ok: false }
  const insforge = createServerClient(token)
  const { error } = await insforge.database
    .from('mensajes_contacto')
    .delete()
    .eq('id', id)
  return { ok: !error }
}
