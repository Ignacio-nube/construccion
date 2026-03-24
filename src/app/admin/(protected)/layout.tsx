import { redirect } from 'next/navigation'
import { getAccessToken } from '@/lib/auth-cookies'
import { createServerClient } from '@/lib/insforge'
import Sidebar from '@/components/admin/Sidebar'
import type { MensajeContacto } from '@/types'

async function getMensajesNoLeidos(): Promise<number> {
  try {
    const token = await getAccessToken()
    if (!token) return 0
    const insforge = createServerClient(token)
    const { data } = await insforge.database
      .from('mensajes_contacto')
      .select('id')
      .eq('leido', false)
    return (data as MensajeContacto[])?.length ?? 0
  } catch {
    return 0
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = await getAccessToken()
  if (!token) {
    redirect('/admin/login')
  }

  // Verificar sesión
  try {
    const insforge = createServerClient(token)
    const { error } = await insforge.auth.getCurrentUser()
    if (error) redirect('/admin/login')
  } catch {
    redirect('/admin/login')
  }

  const mensajesNoLeidos = await getMensajesNoLeidos()

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar mensajesNoLeidos={mensajesNoLeidos} />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
