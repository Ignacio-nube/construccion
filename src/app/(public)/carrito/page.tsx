'use client'

import { useCarrito } from '@/lib/store/carrito'
import { formatPrecio } from '@/lib/utils/formato'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import Link from 'next/link'

export default function CarritoPage() {
  const { items, remover, actualizarCantidad, subtotal } = useCarrito()
  const total = subtotal()

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-surface-variant flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-variant">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <h1 className="font-headline font-black text-2xl text-on-surface mb-2">
          Tu carrito está vacío
        </h1>
        <p className="text-on-surface-variant font-body text-sm mb-6">
          Explorá nuestro catálogo y agregá productos.
        </p>
        <Link href="/catalogo">
          <Button size="lg">Ver catálogo</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-headline font-black text-3xl text-on-surface mb-8">
        Carrito ({items.length} producto{items.length !== 1 ? 's' : ''})
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.producto.id} className="bg-surface border border-outline-variant/40 p-4 flex gap-4">
              <div className="relative w-20 h-20 flex-shrink-0 bg-surface-variant overflow-hidden">
                {item.producto.imagen_url && (
                  <Image
                    src={item.producto.imagen_url}
                    alt={item.producto.nombre}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-body font-semibold text-on-surface">{item.producto.nombre}</p>
                <p className="text-xs text-on-surface-variant font-body mb-3">{item.producto.categoria}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                      className="w-8 h-8 border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-body font-semibold">{item.cantidad}</span>
                    <button
                      onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                      className="w-8 h-8 border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-headline font-bold text-lg text-on-surface">
                      {formatPrecio(item.producto.precio * item.cantidad)}
                    </span>
                    <button
                      onClick={() => remover(item.producto.id)}
                      className="text-error hover:text-on-error-container text-xs font-body"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-surface border border-outline-variant/40 p-6 sticky top-20">
            <h2 className="font-headline font-bold text-lg text-on-surface mb-4">Resumen</h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.producto.id} className="flex justify-between text-sm font-body text-on-surface-variant">
                  <span className="truncate mr-2">{item.producto.nombre} ×{item.cantidad}</span>
                  <span className="flex-shrink-0">{formatPrecio(item.producto.precio * item.cantidad)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
              <span className="font-body font-bold text-on-surface">Total</span>
              <span className="font-headline font-black text-2xl text-on-surface">{formatPrecio(total)}</span>
            </div>
            <Link href="/checkout" className="block mt-4">
              <Button size="lg" className="w-full">Finalizar compra →</Button>
            </Link>
            <Link href="/catalogo" className="block text-center mt-3 text-sm font-body text-on-surface-variant hover:text-on-surface transition-colors">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
