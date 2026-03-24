'use client'

import { useState, useEffect, useCallback } from 'react'
import type { MensajeContacto } from '@/types'
import { formatFecha } from '@/lib/utils/formato'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import toast from 'react-hot-toast'
import { fetchMensajes, marcarMensajeLeido, eliminarMensaje } from './actions'

export default function AdminMensajesPage() {
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([])
  const [loading, setLoading] = useState(true)
  const [seleccionado, setSeleccionado] = useState<MensajeContacto | null>(null)
  const [confirmEliminar, setConfirmEliminar] = useState<string | null>(null)
  const [eliminando, setEliminando] = useState(false)

  const cargar = useCallback(async () => {
    setLoading(true)
    const data = await fetchMensajes()
    setMensajes(data)
    setLoading(false)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const handleAbrir = async (msg: MensajeContacto) => {
    setSeleccionado(msg)
    if (!msg.leido) {
      await marcarMensajeLeido(msg.id)
      cargar()
    }
  }

  const handleEliminar = async () => {
    if (!confirmEliminar) return
    setEliminando(true)
    const result = await eliminarMensaje(confirmEliminar)
    setEliminando(false)
    setConfirmEliminar(null)
    if (!result.ok) { toast.error('Error al eliminar'); return }
    toast.success('Mensaje eliminado')
    setSeleccionado(null)
    cargar()
  }

  const noLeidos = mensajes.filter((m) => !m.leido).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline font-black text-2xl text-on-surface">
          Mensajes
          {noLeidos > 0 && (
            <span className="ml-3 text-sm bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full font-body font-bold">
              {noLeidos} sin leer
            </span>
          )}
        </h1>
      </div>

      <div className="bg-white border border-outline-variant/40 overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead className="bg-gray-50 border-b border-outline-variant/30">
            <tr>
              {['', 'Nombre', 'Email', 'Mensaje', 'Fecha', 'Acciones'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Cargando...</td></tr>
            ) : mensajes.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Sin mensajes</td></tr>
            ) : (
              mensajes.map((m) => (
                <tr
                  key={m.id}
                  className={`border-t border-outline-variant/20 hover:bg-gray-50 transition-colors cursor-pointer ${!m.leido ? 'bg-blue-50/30' : ''}`}
                  onClick={() => handleAbrir(m)}
                >
                  <td className="px-4 py-3 w-6">
                    {!m.leido && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  </td>
                  <td className="px-4 py-3">
                    <p className={!m.leido ? 'font-semibold text-on-surface' : 'text-gray-600'}>{m.nombre}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{m.email}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs">
                    <p className="truncate">{m.mensaje}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{formatFecha(m.created_at)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmEliminar(m.id) }}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal detalle mensaje */}
      <Modal abierto={!!seleccionado} onClose={() => setSeleccionado(null)} titulo="Mensaje de contacto">
        {seleccionado && (
          <div className="space-y-4">
            <div>
              <p className="text-xl font-headline font-bold text-on-surface">{seleccionado.nombre}</p>
              <a href={`mailto:${seleccionado.email}`} className="text-sm text-[#E8500A] hover:underline">{seleccionado.email}</a>
            </div>
            <p className="text-xs text-gray-400">
              {new Date(seleccionado.created_at).toLocaleDateString('es-AR', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-body text-on-surface leading-relaxed whitespace-pre-wrap">{seleccionado.mensaje}</p>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-2">
                <a href={`mailto:${seleccionado.email}`}>
                  <Button variant="secondary" size="sm">Responder por email</Button>
                </a>
              </div>
              <div className="flex gap-2">
                <Button variant="danger" size="sm" onClick={() => { setSeleccionado(null); setConfirmEliminar(seleccionado.id) }}>
                  Eliminar
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setSeleccionado(null)}>Cerrar</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal confirmación eliminar */}
      <Modal abierto={!!confirmEliminar} onClose={() => setConfirmEliminar(null)} titulo="Confirmar eliminación">
        <div className="space-y-4">
          <p className="text-sm font-body text-on-surface">¿Eliminar este mensaje? Esta acción no se puede deshacer.</p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setConfirmEliminar(null)}>Cancelar</Button>
            <Button variant="danger" onClick={handleEliminar} loading={eliminando}>Eliminar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
