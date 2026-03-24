'use client'

import { useState } from 'react'
import { useCarrito } from '@/lib/store/carrito'
import { insforge } from '@/lib/insforge'
import type { TipoCalculo, Producto } from '@/types'
import toast from 'react-hot-toast'

interface MaterialCalculado {
  nombre: string
  cantidad: number
  unidad: string
  buscarNombre: string
}

const TIPOS_CALCULO: { valor: TipoCalculo; label: string; desc: string }[] = [
  { valor: 'revoque', label: 'Revoque', desc: 'Cemento + arena fina' },
  { valor: 'contrapiso', label: 'Contrapiso', desc: 'Cemento + arena + hormigón' },
  { valor: 'pintura', label: 'Pintura', desc: 'Pintura látex interior' },
  { valor: 'estructura', label: 'Estructura', desc: 'Hierros por metro lineal' },
]

function calcular(tipo: TipoCalculo, superficie: number): MaterialCalculado[] {
  switch (tipo) {
    case 'revoque':
      return [
        {
          nombre: 'Cemento Portland 50kg',
          cantidad: Math.ceil((superficie / 10) * 25 / 50) * 2,
          unidad: 'bolsas',
          buscarNombre: 'Cemento Portland',
        },
        {
          nombre: 'Arena Fina x Bolsa 25kg',
          cantidad: Math.ceil((superficie / 10) * 50 / 25) * 2,
          unidad: 'bolsas',
          buscarNombre: 'Arena Fina',
        },
      ]
    case 'contrapiso':
      return [
        {
          nombre: 'Cemento Portland 50kg',
          cantidad: Math.ceil((superficie / 10) * 50 / 50) * 2,
          unidad: 'bolsas',
          buscarNombre: 'Cemento Portland',
        },
        {
          nombre: 'Arena Gruesa x m³',
          cantidad: Math.ceil(superficie * 0.1),
          unidad: 'm³',
          buscarNombre: 'Arena Gruesa',
        },
        {
          nombre: 'Hormigón Premezclado H17 x m³',
          cantidad: Math.ceil(superficie * 0.1),
          unidad: 'm³',
          buscarNombre: 'Hormigón',
        },
      ]
    case 'pintura':
      return [
        {
          nombre: 'Pintura Látex Interior 20L',
          cantidad: Math.ceil(superficie / 25),
          unidad: 'unidades',
          buscarNombre: 'Pintura Látex',
        },
      ]
    case 'estructura':
      return [
        {
          nombre: 'Hierro Redondo 12mm x 12m',
          cantidad: Math.ceil(superficie * 2),
          unidad: 'barras',
          buscarNombre: 'Hierro Redondo 12mm',
        },
        {
          nombre: 'Hierro Redondo 8mm x 12m',
          cantidad: Math.ceil(superficie * 2),
          unidad: 'barras',
          buscarNombre: 'Hierro Redondo 8mm',
        },
      ]
  }
}

export default function CalculadoraPage() {
  const [tipo, setTipo] = useState<TipoCalculo>('revoque')
  const [superficie, setSuperficie] = useState('')
  const [resultado, setResultado] = useState<MaterialCalculado[] | null>(null)
  const [cargando, setCargando] = useState(false)
  const agregar = useCarrito((s) => s.agregar)
  const toggleDrawer = useCarrito((s) => s.toggleDrawer)

  const handleCalcular = () => {
    const sup = parseFloat(superficie)
    if (!sup || sup <= 0) {
      toast.error('Ingresá una superficie válida')
      return
    }
    setResultado(calcular(tipo, sup))
  }

  const handleAgregarTodo = async () => {
    if (!resultado) return
    setCargando(true)
    let agregados = 0

    for (const mat of resultado) {
      const { data, error } = await insforge.database
        .from('productos')
        .select('*')
        .ilike('nombre', `%${mat.buscarNombre}%`)
        .eq('activo', true)
        .limit(1)

      if (error) {
        console.error('DB error al buscar:', mat.buscarNombre, error)
        continue
      }

      if (data && data.length > 0) {
        const prod = data[0] as Producto
        // Agregar la cantidad exacta
        for (let i = 0; i < mat.cantidad; i++) {
          agregar(prod)
        }
        agregados++
      } else {
        console.warn('No encontrado en DB:', mat.buscarNombre)
      }
    }

    setCargando(false)
    if (agregados > 0) {
      toast.success(`${agregados} material(es) agregado(s) al carrito`)
      toggleDrawer()
    } else {
      toast.error('No se encontraron productos en la base de datos')
    }
  }

  const tipoActual = TIPOS_CALCULO.find((t) => t.valor === tipo)

  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Encabezado */}
      <div className="bg-surface-container-low border-b border-outline-variant/30 pt-28 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Herramienta
          </span>
          <h1 className="text-5xl font-black font-headline tracking-tighter text-on-background uppercase mt-2">
            Calculadora
          </h1>
          <p className="text-sm font-body text-on-surface-variant mt-2">
            Estimá la cantidad de materiales para tu obra.
          </p>
        </div>
      </div>

      {/* Layout 12 cols */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Panel formulario — 7 cols */}
          <div className="lg:col-span-7 space-y-8">

            {/* Tipo de trabajo */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                Tipo de trabajo
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TIPOS_CALCULO.map((t) => (
                  <button
                    key={t.valor}
                    onClick={() => {
                      setTipo(t.valor)
                      setResultado(null)
                    }}
                    className={`text-left px-4 py-4 transition-all ${
                      tipo === t.valor
                        ? 'bg-on-background text-white'
                        : 'bg-surface-container-highest text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <p className="font-headline font-bold text-sm uppercase tracking-tight">
                      {t.label}
                    </p>
                    <p className={`text-[10px] uppercase tracking-widest mt-0.5 ${
                      tipo === t.valor ? 'text-white/60' : 'text-on-surface-variant'
                    }`}>
                      {t.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Superficie */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                {tipo === 'estructura' ? 'Metros lineales' : 'Superficie en m²'}
              </label>
              <input
                type="number"
                value={superficie}
                onChange={(e) => {
                  setSuperficie(e.target.value)
                  setResultado(null)
                }}
                min="1"
                placeholder={tipo === 'estructura' ? 'Ej: 10' : 'Ej: 50'}
                className="bg-surface-container-highest border-none focus:ring-0 px-4 py-4 font-body text-lg w-full text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-b-2 focus:border-primary"
              />
            </div>

            {/* Botón calcular */}
            <button
              onClick={handleCalcular}
              className="w-full bg-primary-container text-on-primary-container font-bold uppercase tracking-widest text-sm py-4 hover:bg-primary hover:text-white transition-colors"
            >
              Calcular materiales
            </button>

            {/* Nota */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              * Estimación con 10% de desperdicio incluido. Los valores son aproximados.
            </p>
          </div>

          {/* Panel resultados dark — 5 cols */}
          <div className="lg:col-span-5">
            <div className="bg-stone-900 text-white p-8 min-h-[400px] flex flex-col">
              <div className="mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Resultado estimado
                </span>
                <h2 className="font-headline font-black text-2xl tracking-tighter mt-1">
                  {tipoActual?.label ?? 'Seleccioná un tipo'}
                </h2>
                {superficie && (
                  <p className="text-white/60 text-xs font-body mt-1">
                    Para {superficie} {tipo === 'estructura' ? 'm lineales' : 'm²'}
                  </p>
                )}
              </div>

              {resultado ? (
                <>
                  <div className="space-y-4 flex-1">
                    {resultado.map((mat) => (
                      <div
                        key={mat.nombre}
                        className="border-b border-white/10 pb-4 last:border-0"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-body font-semibold text-sm text-white leading-snug">
                              {mat.nombre}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-0.5">
                              {mat.unidad}
                            </p>
                          </div>
                          <p className="font-headline text-3xl font-black text-primary-container leading-none">
                            ×{mat.cantidad}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleAgregarTodo}
                    disabled={cargando}
                    className="mt-8 w-full bg-primary-container text-on-primary-container font-bold uppercase tracking-widest text-sm py-4 hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cargando ? 'Buscando productos...' : 'Agregar todo al carrito →'}
                  </button>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-headline font-black text-6xl text-white/10 mb-3">m²</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                      Completá el formulario y calculá
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
