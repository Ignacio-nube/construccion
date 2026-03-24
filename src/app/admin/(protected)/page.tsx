import { createServerClient } from '@/lib/insforge'
import { getAccessToken } from '@/lib/auth-cookies'
import { formatPrecio, formatFecha } from '@/lib/utils/formato'
import type { Pedido } from '@/types'
import VentasChart from '@/components/admin/VentasChart'
import DashboardClient from '@/components/admin/DashboardClient'

async function getDashboardData() {
  const token = await getAccessToken()
  const insforge = createServerClient(token)

  const ahora = new Date()
  const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()).toISOString()
  const inicioSemana = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString()

  const [todosRes, hoyRes, semanaRes, mesRes, stockRes, ultimosRes] = await Promise.all([
    insforge.database.from('pedidos').select('total, created_at'),
    insforge.database.from('pedidos').select('id').gte('created_at', inicioHoy),
    insforge.database.from('pedidos').select('id').gte('created_at', inicioSemana),
    insforge.database.from('pedidos').select('id').gte('created_at', inicioMes),
    insforge.database.from('productos').select('id, nombre, stock').lt('stock', 5).eq('activo', true),
    insforge.database.from('pedidos').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  const todos = (todosRes.data as { total: number; created_at: string }[]) ?? []
  const ingresoTotal = todos.reduce((a, p) => a + Number(p.total), 0)

  const ventasPorDia: { dia: string; total: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date(ahora.getTime() - i * 24 * 60 * 60 * 1000)
    const label = fecha.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' })
    const total = todos
      .filter((p) => {
        const d = new Date(p.created_at)
        return d.getDate() === fecha.getDate() && d.getMonth() === fecha.getMonth()
      })
      .reduce((a, p) => a + Number(p.total), 0)
    ventasPorDia.push({ dia: label, total })
  }

  const totalSemana = ventasPorDia.reduce((a, d) => a + d.total, 0)

  return {
    pedidosHoy: (hoyRes.data ?? []).length,
    pedidosSemana: (semanaRes.data ?? []).length,
    pedidosMes: (mesRes.data ?? []).length,
    ingresoTotal,
    stockBajo: (stockRes.data ?? []) as { id: string; nombre: string; stock: number }[],
    ultimosPedidos: (ultimosRes.data ?? []) as Pedido[],
    ventasPorDia,
    totalSemana,
  }
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData()

  return (
    <DashboardClient
      pedidosHoy={data.pedidosHoy}
      pedidosSemana={data.pedidosSemana}
      pedidosMes={data.pedidosMes}
      ingresoTotal={data.ingresoTotal}
      stockBajo={data.stockBajo}
      ultimosPedidos={data.ultimosPedidos}
      ventasPorDia={data.ventasPorDia}
      totalSemana={data.totalSemana}
    />
  )
}
