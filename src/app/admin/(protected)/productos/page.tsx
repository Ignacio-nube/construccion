'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Search, Plus, Pencil, Trash2, Package } from 'lucide-react'
import { insforge } from '@/lib/insforge'
import type { Producto, CategoriaProducto } from '@/types'
import { crearProducto, actualizarProducto, eliminarProducto } from './actions'
import { formatPrecio } from '@/lib/utils/formato'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import toast from 'react-hot-toast'

const CATEGORIAS: CategoriaProducto[] = [
  'Cemento y Hormigón', 'Hierros y Aceros', 'Pinturas', 'Sanitarios', 'Herramientas', 'Maderas',
]

const PAGE_SIZE = 10

interface FormData {
  nombre: string; descripcion: string; precio: string
  categoria: CategoriaProducto; imagen_url: string; stock: string; activo: boolean
}

const formInicial: FormData = {
  nombre: '', descripcion: '', precio: '', categoria: 'Cemento y Hormigón',
  imagen_url: '', stock: '0', activo: true,
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return (
    <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
      Sin stock
    </span>
  )
  if (stock < 10) return (
    <span className="inline-flex items-center gap-1 text-sm text-on-surface">
      {stock}
      <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">⚠ Stock bajo</span>
    </span>
  )
  return <span className="text-sm text-on-surface">{stock}</span>
}

function Thumbnail({ src, nombre }: { src?: string | null; nombre: string }) {
  const [error, setError] = useState(false)
  const isPlaceholder = !src || src.includes('picsum.photos') || error
  if (isPlaceholder) return (
    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
      <Package size={20} className="text-gray-400" />
    </div>
  )
  return (
    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
      <Image src={src!} alt={nombre} fill className="object-cover" sizes="56px" onError={() => setError(true)} />
    </div>
  )
}

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(0)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Producto | null>(null)
  const [form, setForm] = useState<FormData>(formInicial)
  const [guardando, setGuardando] = useState(false)
  const [loading, setLoading] = useState(true)
  const [confirmEliminar, setConfirmEliminar] = useState<{ id: string; nombre: string } | null>(null)
  const [eliminando, setEliminando] = useState(false)

  const cargar = useCallback(async () => {
    setLoading(true)
    let query = insforge.database.from('productos').select('*', { count: 'exact' })
      .order('nombre').range(pagina * PAGE_SIZE, (pagina + 1) * PAGE_SIZE - 1)
    if (busqueda) query = query.ilike('nombre', `%${busqueda}%`)
    if (categoriaFiltro) query = query.eq('categoria', categoriaFiltro)
    const { data, count } = await query
    setProductos((data as Producto[]) ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }, [pagina, busqueda, categoriaFiltro])

  useEffect(() => { cargar() }, [cargar])

  const abrirNuevo = () => { setEditando(null); setForm(formInicial); setModalAbierto(true) }
  const abrirEditar = (p: Producto) => {
    setEditando(p)
    setForm({ nombre: p.nombre, descripcion: p.descripcion ?? '', precio: String(p.precio),
      categoria: p.categoria, imagen_url: p.imagen_url ?? '', stock: String(p.stock), activo: p.activo })
    setModalAbierto(true)
  }

  const handleGuardar = async () => {
    if (!form.nombre || !form.precio) { toast.error('Nombre y precio son obligatorios'); return }
    setGuardando(true)
    const payload = { nombre: form.nombre, descripcion: form.descripcion || null,
      precio: parseFloat(form.precio), categoria: form.categoria,
      imagen_url: form.imagen_url || null, stock: parseInt(form.stock) || 0, activo: form.activo }
    if (editando) {
      const result = await actualizarProducto(editando.id, payload)
      if (!result.ok) { toast.error('Error al guardar'); setGuardando(false); return }
      toast.success('Producto actualizado')
    } else {
      const result = await crearProducto(payload)
      if (!result.ok) { toast.error('Error al crear'); setGuardando(false); return }
      toast.success('Producto creado')
    }
    setGuardando(false); setModalAbierto(false); cargar()
  }

  const confirmarEliminar = async () => {
    if (!confirmEliminar) return
    setEliminando(true)
    const result = await eliminarProducto(confirmEliminar.id)
    setEliminando(false)
    setConfirmEliminar(null)
    if (!result.ok) { toast.error('Error al eliminar'); return }
    toast.success('Producto eliminado'); cargar()
  }

  const totalPaginas = Math.ceil(total / PAGE_SIZE)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline font-black text-2xl text-on-surface">Productos</h1>
        <button
          onClick={abrirNuevo}
          className="flex items-center gap-2 bg-[#E8500A] hover:bg-[#c4440a] text-white px-4 py-2 text-sm font-body font-bold uppercase tracking-wide transition-colors"
        >
          <Plus size={16} />
          Nuevo producto
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPagina(0) }}
            placeholder="Buscar producto..."
            className="pl-9 pr-3 py-2 border border-outline-variant bg-surface text-sm font-body focus:outline-none focus:border-primary w-52"
          />
        </div>
        <select
          value={categoriaFiltro}
          onChange={(e) => { setCategoriaFiltro(e.target.value); setPagina(0) }}
          className="px-3 py-2 border border-outline-variant bg-surface text-sm font-body focus:outline-none focus:border-primary"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-outline-variant/40 overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead className="bg-gray-50 border-b border-outline-variant/30">
            <tr>
              {['Imagen', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Acciones'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Cargando...</td></tr>
            ) : productos.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Sin resultados</td></tr>
            ) : (
              productos.map((p) => (
                <tr
                  key={p.id}
                  className={`border-t border-outline-variant/20 hover:bg-gray-50 transition-colors ${p.stock === 0 ? 'bg-red-50/40' : ''}`}
                >
                  <td className="px-4 py-3">
                    <Thumbnail src={p.imagen_url} nombre={p.nombre} />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-on-surface max-w-[200px] truncate">{p.nombre}</p>
                    {!p.activo && <span className="text-xs text-red-500">Inactivo</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">{p.categoria}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-on-surface">{formatPrecio(p.precio)}</td>
                  <td className="px-4 py-3"><StockBadge stock={p.stock} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => abrirEditar(p)}
                        title="Editar producto"
                        className="p-1.5 border border-gray-200 rounded hover:border-[#E8500A] hover:text-[#E8500A] text-gray-500 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setConfirmEliminar({ id: p.id, nombre: p.nombre })}
                        title="Eliminar producto"
                        className="p-1.5 border border-gray-200 rounded hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex items-center gap-2 mt-4">
          <Button variant="secondary" size="sm" disabled={pagina === 0} onClick={() => setPagina(p => p - 1)}>← Anterior</Button>
          <span className="text-sm font-body text-on-surface-variant">Página {pagina + 1} de {totalPaginas}</span>
          <Button variant="secondary" size="sm" disabled={pagina >= totalPaginas - 1} onClick={() => setPagina(p => p + 1)}>Siguiente →</Button>
        </div>
      )}

      {/* Modal crear/editar */}
      <Modal abierto={modalAbierto} onClose={() => setModalAbierto(false)} titulo={editando ? 'Editar producto' : 'Nuevo producto'} className="max-w-2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-on-surface mb-1">Nombre *</label>
              <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                className="w-full px-3 py-2.5 border border-outline-variant bg-surface text-sm font-body focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">Precio (ARS) *</label>
              <input type="number" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))}
                className="w-full px-3 py-2.5 border border-outline-variant bg-surface text-sm font-body focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                className="w-full px-3 py-2.5 border border-outline-variant bg-surface text-sm font-body focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">Categoría</label>
              <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value as CategoriaProducto }))}
                className="w-full px-3 py-2.5 border border-outline-variant bg-surface text-sm font-body focus:outline-none focus:border-primary">
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">Imagen URL</label>
              <input value={form.imagen_url} onChange={e => setForm(f => ({ ...f, imagen_url: e.target.value }))}
                placeholder="https://..."
                className="w-full px-3 py-2.5 border border-outline-variant bg-surface text-sm font-body focus:outline-none focus:border-primary" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-on-surface mb-1">Descripción</label>
              <textarea value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} rows={3}
                className="w-full px-3 py-2.5 border border-outline-variant bg-surface text-sm font-body focus:outline-none focus:border-primary resize-none" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="activo" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} className="w-4 h-4" />
              <label htmlFor="activo" className="text-sm font-body text-on-surface">Producto activo</label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalAbierto(false)}>Cancelar</Button>
            <Button onClick={handleGuardar} loading={guardando}>{editando ? 'Guardar cambios' : 'Crear producto'}</Button>
          </div>
        </div>
      </Modal>

      {/* Modal confirmación eliminar */}
      <Modal abierto={!!confirmEliminar} onClose={() => setConfirmEliminar(null)} titulo="Confirmar eliminación">
        <div className="space-y-4">
          <p className="text-sm font-body text-on-surface">
            ¿Eliminar <strong>&ldquo;{confirmEliminar?.nombre}&rdquo;</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setConfirmEliminar(null)}>Cancelar</Button>
            <Button variant="danger" onClick={confirmarEliminar} loading={eliminando}>Eliminar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
