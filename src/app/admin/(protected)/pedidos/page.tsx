'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Clock, CheckCircle, Package, Truck, CheckCircle2, XCircle } from 'lucide-react'
import type { Pedido, EstadoPedido } from '@/types'
import { fetchPedidos, actualizarEstadoPedido } from './actions'
import { formatPrecio, formatFecha } from '@/lib/utils/formato'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

const ESTADOS: EstadoPedido[] = ['pendiente', 'confirmado', 'en preparación', 'enviado', 'entregado']

const ESTADO_CFG: Record<string, { bg: string; text: string; Icon: React.ElementType }> = {
  pendiente:       { bg: 'bg-yellow-100',  text: 'text-yellow-800', Icon: Clock },
  confirmado:      { bg: 'bg-green-100',   text: 'text-green-700',  Icon: CheckCircle },
  'en preparación':{ bg: 'bg-blue-100',    text: 'text-blue-800',   Icon: Package },
  enviado:         { bg: 'bg-indigo-100',  text: 'text-indigo-800', Icon: Truck },
  entregado:       { bg: 'bg-emerald-100', text: 'text-emerald-800',Icon: CheckCircle2 },
  cancelado:       { bg: 'bg-red-100',     text: 'text-red-700',    Icon: XCircle },
}

const TIMELINE_STEPS = ['pendiente', 'en preparación', 'enviado', 'entregado']

function StatusBadge({ pedido, onCambiar }: { pedido: Pedido; onCambiar: (id: string, estado: EstadoPedido) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const cfg = ESTADO_CFG[pedido.estado] ?? ESTADO_CFG.pendiente

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide transition-opacity hover:opacity-80 ${cfg.bg} ${cfg.text}`}
      >
        <cfg.Icon size={11} strokeWidth={2.5} />
        {pedido.estado}
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]">
          {ESTADOS.map((e) => {
            const c = ESTADO_CFG[e] ?? ESTADO_CFG.pendiente
            return (
              <button
                key={e}
                onClick={(ev) => { ev.stopPropagation(); setOpen(false); onCambiar(pedido.id, e) }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-body hover:bg-gray-50 transition-colors ${pedido.estado === e ? 'font-bold' : ''}`}
              >
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${c.bg} ${c.text}`}>
                  <c.Icon size={10} strokeWidth={2.5} />
                  {e}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function PedidoModal({ pedido, onClose, onCambiarEstado }: {
  pedido: Pedido; onClose: () => void; onCambiarEstado: (id: string, estado: EstadoPedido) => void
}) {
  const cfg = ESTADO_CFG[pedido.estado] ?? ESTADO_CFG.pendiente
  const stepIdx = TIMELINE_STEPS.indexOf(pedido.estado)

  return (
    <div className="space-y-5 text-sm font-body">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-mono font-bold text-lg text-on-surface">{pedido.numero_pedido}</span>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${cfg.bg} ${cfg.text}`}>
          <cfg.Icon size={11} strokeWidth={2.5} />
          {pedido.estado}
        </span>
      </div>

      {/* Cliente */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Cliente</p>
        <div className="grid grid-cols-2 gap-3">
          <div><p className="text-[10px] text-gray-400">Nombre</p><p className="font-semibold">{pedido.cliente_nombre}</p></div>
          <div><p className="text-[10px] text-gray-400">Email</p><p>{pedido.cliente_email}</p></div>
          <div><p className="text-[10px] text-gray-400">Teléfono</p><p>{pedido.cliente_telefono ?? '—'}</p></div>
          <div><p className="text-[10px] text-gray-400">Fecha</p><p>{formatFecha(pedido.created_at)}</p></div>
        </div>
      </div>

      {/* Entrega */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Entrega</p>
        <p className="text-on-surface">{pedido.direccion_entrega}</p>
      </div>

      {/* Items */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Productos</p>
        <div className="space-y-2">
          {pedido.items.map((item, i) => (
            <div key={i} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
              <span className="text-gray-700">{item.producto.nombre} <span className="text-gray-400">×{item.cantidad}</span></span>
              <span className="font-semibold">{formatPrecio(item.producto.precio * item.cantidad)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 font-bold">
            <span>Total</span>
            <span className="font-headline font-black text-xl">{formatPrecio(pedido.total)}</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Estado del pedido</p>
        <div className="space-y-2">
          {TIMELINE_STEPS.map((step, i) => {
            const done = i <= stepIdx
            return (
              <div key={step} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-[#E8500A] text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {done ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                </div>
                <span className={`text-sm capitalize ${done ? 'text-on-surface font-semibold' : 'text-gray-400'}`}>{step}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 pt-2 border-t border-gray-100">
        <Button variant="secondary" onClick={onClose} size="sm">Cerrar</Button>
      </div>
    </div>
  )
}

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [pedidoDetalle, setPedidoDetalle] = useState<Pedido | null>(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    const data = await fetchPedidos(filtroEstado || undefined)
    setPedidos(data)
    setLoading(false)
  }, [filtroEstado])

  useEffect(() => { cargar() }, [cargar])

  const cambiarEstado = async (id: string, estado: EstadoPedido) => {
    // Optimistic update
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado } : p))
    if (pedidoDetalle?.id === id) setPedidoDetalle(prev => prev ? { ...prev, estado } : null)
    const result = await actualizarEstadoPedido(id, estado)
    if (!result.ok) {
      toast.error('Error al actualizar estado')
      cargar() // Revert
    } else {
      toast.success('Estado actualizado')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline font-black text-2xl text-on-surface">Pedidos</h1>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="px-3 py-2 border border-outline-variant bg-white text-sm font-body focus:outline-none focus:border-primary"
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      <div className="bg-white border border-outline-variant/40 overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead className="bg-gray-50 border-b border-outline-variant/30">
            <tr>
              {['N° Pedido', 'Cliente', 'Total', 'Estado', 'Fecha', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Cargando...</td></tr>
            ) : pedidos.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Sin pedidos</td></tr>
            ) : (
              pedidos.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-outline-variant/20 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setPedidoDetalle(p)}
                >
                  <td className="px-4 py-3 font-mono font-semibold text-on-surface">{p.numero_pedido}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-on-surface">{p.cliente_nombre}</p>
                    <p className="text-xs text-gray-400">{p.cliente_email}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-on-surface">{formatPrecio(p.total)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge pedido={p} onCambiar={cambiarEstado} />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{formatFecha(p.created_at)}</td>
                  <td className="px-4 py-3 text-xs text-[#E8500A] font-semibold">Ver →</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        abierto={!!pedidoDetalle}
        onClose={() => setPedidoDetalle(null)}
        titulo="Detalle del pedido"
        className="max-w-2xl"
      >
        {pedidoDetalle && (
          <PedidoModal
            pedido={pedidoDetalle}
            onClose={() => setPedidoDetalle(null)}
            onCambiarEstado={cambiarEstado}
          />
        )}
      </Modal>
    </div>
  )
}
