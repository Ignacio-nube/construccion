'use server'

import { createServerClient } from '@/lib/insforge'
import { z } from 'zod'

const schema = z.object({
  nombre: z.string().min(2, 'El nombre es muy corto'),
  email: z.string().email('Email inválido'),
  mensaje: z.string().min(10, 'El mensaje es muy corto'),
})

export async function enviarMensaje(formData: FormData) {
  const parsed = schema.safeParse({
    nombre: formData.get('nombre'),
    email: formData.get('email'),
    mensaje: formData.get('mensaje'),
  })

  if (!parsed.success) {
    const issues = parsed.error.issues
    return { ok: false, error: issues[0]?.message ?? 'Error de validación' }
  }

  try {
    const insforge = createServerClient()
    const { error } = await insforge.database
      .from('mensajes_contacto')
      .insert([parsed.data])

    if (error) {
      return { ok: false, error: 'Error al enviar el mensaje. Intente nuevamente.' }
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Error de conexión. Intente nuevamente.' }
  }
}
