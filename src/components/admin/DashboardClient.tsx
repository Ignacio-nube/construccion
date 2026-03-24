'use client'

import { useState } from 'react'
import { ShoppingBag, Calendar, TrendingUp, DollarSign } from 'lucide-react'
import { formatPrecio, formatFecha } from '@/lib/utils/formato'
import type { Pedido, EstadoPedido } from '@/types'
import VentasChart from '@/components/admin/VentasChart'
import Modal from '@/components/ui/Modal'

const ESTADO_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  pendiente:          { bg: 'bg-yellow-100',  text: 'text-yellow-800',  label: 'Pendiente' },
  confirmado:         { bg: 'bg-green-100',   text: 'text-green-700',   label: 'Confirmado' },
  'en preparación':   { bg: 'bg-blue-100',    text: 'text-blue-800',    label: 'En preparación' },
  enviado:            { bg: 'bg-indigo-100',  text: 'text-indigo-800',  label: 'Enviado' },
  entregado:          { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Entregado' },
  cancelado:          { bg: 'bg-red-100',     text: 'text-red-700',     label: 'Cancelado' },
}

const FALLBACK_ESTADO = { bg: 'bg-gray-100', text: 'text-gray-700', label: '—' }

interface Props {
  pedidosHoy: number
  pedidosSemana: number
  pedidosMes: number
  ingresoTotal: number
  stockBajo: { id: string; nombre: string; stock: number }[]
  ultimosPedidos: Pedido[]
  ventasPorDia: { dia: string; total: number }[]
  totalSemana: number
}

export default function DashboardClient({
  pedidosHoy, pedidosSemana, pedidosMes, ingresoTotal,
  stockBajo, ultimosPedidos, ventasPorDia, totalSemana,
}: Props) {
  const [pedidoDetalle, setPedidoDetalle] = useState<Pedido | null>(null)

  const stats = [
    { label: 'Pedidos hoy', valor: pedidosHoy, Icon: ShoppingBag, vacio: pedidosHoy === 0 },
    { label: 'Esta semana', valor: pedidosSemana, Icon: Calendar, vacio: false },
    { label: 'Este mes', valor: pedidosMes, Icon: TrendingUp, vacio: false },
    { label: 'Ingresos totales', valor: formatPrecio(ingresoTotal), Icon: DollarSign, vacio: false, grande: true },
  ]

  return (
    <div>
      <h1 className="font-headline font-black text-2xl text-on-surface mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`relative p-5 border border-outline-variant/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-default ${
              stat.vacio ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <div className="flex flex-col">
              <p className="text-sm font-body text-gray-500 mb-1">{stat.label}</p>
              <p className={`font-headline font-black text-on-surface ${stat.grande ? 'text-xl' : 'text-[2.5rem] leading-none'}`}>
                {stat.valor}
              </p>
            </div>
            <div className="absolute top-4 right-4 w-12 h-12 rounded-lg bg-[#E8500A]/10 flex items-center justify-center">
              <stat.Icon size={22} className="text-[#E8500A]" strokeWidth={1.75} />
            </div>
          </div>
        ))}
      </div>

      {/* Alerta stock bajo */}
      {stockBajo.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 mb-8 rounded-sm">
          <p className="text-sm font-body font-semibold text-red-800 mb-2">
            ⚠ {stockBajo.length} producto(s) con stock bajo (&lt;5 unidades)
          </p>
          <div className="flex flex-wrap gap-2">
            {stockBajo.map((p) => (
              <span key={p.id} className="text-xs bg-red-100 text-red-700 px-2 py-1 font-body rounded">
                {p.nombre} ({p.stock})
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico */}
        <div className="bg-white border border-outline-variant/40 p-5">
          <div className="mb-4">
            <h2 className="font-headline font-bold text-base text-on-surface">Ventas últimos 7 días</h2>
            <p className="text-xs text-gray-400 font-body mt-0.5">Total: {formatPrecio(totalSemana)}</p>
          </div>
          <VentasChart datos={ventasPorDia} />
        </div>

        {/* Últimos pedidos */}
        <div className="bg-white border border-outline-variant/40 p-5">
          <h2 className="font-headline font-bold text-base text-on-surface mb-4">Últimos pedidos</h2>
          <div className="space-y-1">
            {ultimosPedidos.length === 0 ? (
              <p className="text-sm font-body text-on-surface-variant">Sin pedidos aún.</p>
            ) : (
              ultimosPedidos.map((p) => {
                const cfg = ESTADO_CONFIG[p.estado] ?? FALLBACK_ESTADO
                return (
                  <button
                    key={p.id}
                    onClick={() => setPedidoDetalle(p)}
                    className="w-full flex items-center justify-between py-2.5 px-2 border-b border-outline-variant/20 last:border-0 hover:bg-gray-50 rounded transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-body font-semibold text-on-surface">{p.numero_pedido}</p>
                      <p className="text-xs text-on-surface-variant font-body">{p.cliente_nombre} · {formatFecha(p.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-headline font-bold text-on-surface">{formatPrecio(p.total)}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${cfg.bg} ${cfg.text}`}>
                        {cfg.label}
                      </span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal detalle pedido */}
      <Modal
        abierto={!!pedidoDetalle}
        onClose={() => setPedidoDetalle(null)}
        titulo={`Pedido ${pedidoDetalle?.numero_pedido ?? ''}`}
        className="max-w-2xl"
      >
        {pedidoDetalle && (
          <div className="space-y-4 text-sm font-body">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Cliente</p>
                <p className="font-semibold">{pedidoDetalle.cliente_nombre}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Email</p>
                <p>{pedidoDetalle.cliente_email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Teléfono</p>
                <p>{pedidoDetalle.cliente_telefono ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Estado</p>
                {(() => {
                  const cfg = ESTADO_CONFIG[pedidoDetalle.estado] ?? FALLBACK_ESTADO
                  return (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${cfg.bg} ${cfg.text}`}>
                      {cfg.label}
                    </span>
                  )
                })()}
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400 mb-0.5">Dirección</p>
                <p>{pedidoDetalle.direccion_entrega}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Items</p>
              {pedidoDetalle.items.map((item, i) => (
                <div key={i} className="flex justify-between py-1">
                  <span className="text-gray-600">{item.producto.nombre} ×{item.cantidad}</span>
                  <span className="font-semibold">{formatPrecio(item.producto.precio * item.cantidad)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-3 border-t mt-2">
                <span>Total</span>
                <span className="font-headline font-black text-xl">{formatPrecio(pedidoDetalle.total)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
