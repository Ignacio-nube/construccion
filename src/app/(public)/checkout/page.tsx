'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useCarrito } from '@/lib/store/carrito'
import { insforge } from '@/lib/insforge'
import { formatPrecio, generarNumeroPedido } from '@/lib/utils/formato'
import { geocodificarDireccion, calcularRuta } from '@/lib/mapbox'
import Button from '@/components/ui/Button'
import type { DatosCheckout } from '@/types'
import toast from 'react-hot-toast'

const MapboxMapa = dynamic(() => import('@/components/checkout/MapboxMapa'), { ssr: false })

type Paso = 1 | 2 | 3

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, vaciar } = useCarrito()
  const total = subtotal()
  const [paso, setPaso] = useState<Paso>(1)
  const [datos, setDatos] = useState<DatosCheckout>({
    nombre: '', apellido: '', telefono: '', email: '', direccion: '',
  })
  const [coordsCliente, setCoordsCliente] = useState<{ lng: number; lat: number } | null>(null)
  const [ruta, setRuta] = useState<{ distanciaKm: number; duracionMin: number; geojson: unknown } | null>(null)
  const [geocodificando, setGeocodificando] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [tarjeta, setTarjeta] = useState({ numero: '', nombre: '', vencimiento: '', cvv: '' })

  useEffect(() => {
    if (items.length === 0) router.push('/catalogo')
  }, [items, router])

  const handleGeocoding = async () => {
    if (!datos.direccion.trim()) {
      toast.error('Ingresá una dirección')
      return
    }
    setGeocodificando(true)
    const coords = await geocodificarDireccion(datos.direccion)
    if (coords) {
      setCoordsCliente(coords)
      const r = await calcularRuta({ lng: -65.2577, lat: -26.7936 }, coords)
      setRuta(r)
      toast.success('Dirección encontrada')
    } else {
      toast.error('No se pudo geocodificar la dirección')
    }
    setGeocodificando(false)
  }

  const handleConfirmar = async () => {
    setEnviando(true)
    const numeroPedido = generarNumeroPedido()

    // Guardar en Supabase (best-effort — no bloquea la confirmación)
    try {
      await insforge.database.from('pedidos').insert([
        {
          numero_pedido: numeroPedido,
          cliente_nombre: `${datos.nombre} ${datos.apellido}`.trim(),
          cliente_email: datos.email,
          cliente_telefono: datos.telefono || null,
          direccion_entrega: datos.direccion,
          items: items,
          subtotal: total,
          total: total,
          estado: 'pendiente',
        },
      ])
    } catch {
      // Continuar aunque falle el guardado
    }

    // Delay visual de procesamiento
    await new Promise((r) => setTimeout(r, 1500))

    vaciar()

    const params = new URLSearchParams({
      pedido: numeroPedido,
      nombre: `${datos.nombre} ${datos.apellido}`.trim(),
      email: datos.email,
      direccion: datos.direccion,
      total: String(total),
    })
    router.push(`/checkout/exito?${params.toString()}`)
  }

  if (items.length === 0) return null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-headline font-black text-3xl text-on-surface mb-8">Finalizar compra</h1>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {([1, 2, 3] as Paso[]).map((p, i) => (
          <div key={p} className="flex items-center flex-1 last:flex-none">
            <div className={`w-8 h-8 flex items-center justify-center text-sm font-headline font-bold flex-shrink-0 ${
              paso >= p ? 'bg-primary-container text-on-primary-container' : 'bg-surface-variant text-on-surface-variant'
            }`}>
              {p}
            </div>
            <span className={`ml-2 text-xs font-body hidden sm:block ${paso >= p ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>
              {p === 1 ? 'Datos' : p === 2 ? 'Entrega' : 'Pago'}
            </span>
            {i < 2 && <div className={`flex-1 h-px mx-3 ${paso > p ? 'bg-primary-container' : 'bg-outline-variant'}`} />}
          </div>
        ))}
      </div>

      {/* Paso 1: Datos — siempre en el DOM para evitar errores de extensiones del browser */}
      <div className={paso !== 1 ? 'hidden' : ''}>
        <div className="bg-surface border border-outline-variant/40 p-6">
          <h2 className="font-headline font-bold text-lg text-on-surface mb-5">Tus datos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              { key: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Juan' },
              { key: 'apellido', label: 'Apellido', type: 'text', placeholder: 'Pérez' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'juan@email.com' },
              { key: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '+54 381 ...' },
            ] as const).map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-body font-semibold text-on-surface mb-1.5">{label}</label>
                <input
                  type={type}
                  value={datos[key as keyof DatosCheckout]}
                  onChange={(e) => setDatos((d) => ({ ...d, [key]: e.target.value }))}
                  placeholder={placeholder}
                  required={key !== 'telefono'}
                  spellCheck={false}
                  data-gramm="false"
                  data-gramm_editor="false"
                  data-enable-grammarly="false"
                  className="w-full px-3 py-2.5 border border-outline-variant bg-surface text-on-surface text-sm font-body focus:outline-none focus:border-primary"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-sm font-body font-semibold text-on-surface mb-1.5">
                Dirección de entrega
              </label>
              <input
                type="text"
                value={datos.direccion}
                onChange={(e) => setDatos((d) => ({ ...d, direccion: e.target.value }))}
                placeholder="Ej: Av. Belgrano 1500, San Miguel de Tucumán"
                required
                spellCheck={false}
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
                className="w-full px-3 py-2.5 border border-outline-variant bg-surface text-on-surface text-sm font-body focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <Button
            className="mt-6 w-full sm:w-auto"
            size="lg"
            onClick={() => {
              if (!datos.nombre || !datos.apellido || !datos.email || !datos.direccion) {
                toast.error('Completá todos los campos obligatorios')
                return
              }
              setPaso(2)
            }}
          >
            Continuar →
          </Button>
        </div>
      </div>

      {/* Paso 2: Mapa — se monta al llegar y permanece en DOM */}
      {paso >= 2 && (
        <div className={paso !== 2 ? 'hidden' : ''}>
        <div className="bg-surface border border-outline-variant/40 p-6">
          <h2 className="font-headline font-bold text-lg text-on-surface mb-1">Confirmar entrega</h2>
          <p className="text-sm font-body text-on-surface-variant mb-4">
            Dirección: <strong className="text-on-surface">{datos.direccion}</strong>
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <Button onClick={handleGeocoding} loading={geocodificando} variant="secondary" size="sm">
              {coordsCliente ? 'Buscar por dirección' : 'Verificar dirección en mapa'}
            </Button>
            {coordsCliente && (
              <p className="text-xs font-body text-on-surface-variant self-center">
                O arrastá el marcador azul para ajustar la ubicación
              </p>
            )}
          </div>

          <MapboxMapa
            coordsCliente={coordsCliente}
            rutaGeojson={ruta?.geojson}
            distanciaKm={ruta?.distanciaKm}
            duracionMin={ruta?.duracionMin}
            interactivo={true}
            onCoordsChange={async (coords) => {
              setCoordsCliente(coords)
              const r = await calcularRuta({ lng: -65.2577, lat: -26.7936 }, coords)
              setRuta(r)
            }}
          />

          <div className="flex gap-3 mt-6">
            <Button variant="secondary" onClick={() => setPaso(1)}>← Volver</Button>
            <Button onClick={() => setPaso(3)} size="lg">Continuar →</Button>
          </div>
        </div>
        </div>
      )}

      {/* Paso 3: Pago simulado */}
      {paso >= 3 && (
        <div className="bg-surface border border-outline-variant/40 p-6">
          <h2 className="font-headline font-bold text-lg text-on-surface mb-5">Pago (simulado)</h2>

          <div className="bg-surface-variant/50 p-4 mb-5 flex justify-between items-center">
            <span className="font-body text-on-surface-variant text-sm">Total a pagar</span>
            <span className="font-headline font-black text-2xl text-on-surface">{formatPrecio(total)}</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-body font-semibold text-on-surface mb-1.5">
                Número de tarjeta
              </label>
              <input
                value={tarjeta.numero}
                onChange={(e) => setTarjeta((t) => ({ ...t, numero: e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim() }))}
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2.5 border border-outline-variant bg-surface text-on-surface text-sm font-body focus:outline-none focus:border-primary tracking-widest"
              />
            </div>
            <div>
              <label className="block text-sm font-body font-semibold text-on-surface mb-1.5">
                Titular de la tarjeta
              </label>
              <input
                value={tarjeta.nombre}
                onChange={(e) => setTarjeta((t) => ({ ...t, nombre: e.target.value.toUpperCase() }))}
                placeholder="JUAN PÉREZ"
                className="w-full px-3 py-2.5 border border-outline-variant bg-surface text-on-surface text-sm font-body focus:outline-none focus:border-primary uppercase"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-body font-semibold text-on-surface mb-1.5">Vencimiento</label>
                <input
                  value={tarjeta.vencimiento}
                  onChange={(e) => setTarjeta((t) => ({ ...t, vencimiento: e.target.value }))}
                  placeholder="MM/AA"
                  className="w-full px-3 py-2.5 border border-outline-variant bg-surface text-on-surface text-sm font-body focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-body font-semibold text-on-surface mb-1.5">CVV</label>
                <input
                  type="password"
                  value={tarjeta.cvv}
                  onChange={(e) => setTarjeta((t) => ({ ...t, cvv: e.target.value.slice(0, 4) }))}
                  placeholder="•••"
                  className="w-full px-3 py-2.5 border border-outline-variant bg-surface text-on-surface text-sm font-body focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="bg-primary-fixed/40 p-3 mt-4 text-xs font-body text-on-surface-variant">
            Pago simulado. No se procesará ningún cobro real.
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="secondary" onClick={() => setPaso(2)}>← Volver</Button>
            <Button onClick={handleConfirmar} loading={enviando} size="lg" className="flex-1">
              {enviando ? 'Procesando...' : 'Confirmar pedido →'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
