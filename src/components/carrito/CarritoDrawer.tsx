'use client'

import { useCarrito } from '@/lib/store/carrito'
import { formatPrecio } from '@/lib/utils/formato'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import Image from 'next/image'

export default function CarritoDrawer() {
  const { items, drawerAbierto, toggleDrawer, remover, actualizarCantidad, subtotal } = useCarrito()
  const total = subtotal()

  if (!drawerAbierto) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-inverse-surface/40 z-40 backdrop-blur-sm"
        onClick={toggleDrawer}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-surface z-50 shadow-tectonic flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant">
          <h2 className="font-headline font-bold text-lg text-on-surface">
            Carrito ({items.length})
          </h2>
          <button
            onClick={toggleDrawer}
            className="p-1 text-on-surface-variant hover:text-on-surface"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 bg-surface-variant flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-on-surface-variant">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <p className="font-body text-on-surface-variant text-sm">Tu carrito está vacío</p>
              <button
                onClick={toggleDrawer}
                className="mt-4 text-primary text-sm font-semibold font-body hover:underline"
              >
                Ver catálogo →
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.producto.id} className="flex gap-3">
                <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden bg-surface-variant">
                  {item.producto.imagen_url ? (
                    <Image
                      src={item.producto.imagen_url}
                      alt={item.producto.nombre}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full bg-outline-variant/20" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-medium text-on-surface truncate">
                    {item.producto.nombre}
                  </p>
                  <p className="text-xs text-on-surface-variant font-body">
                    {formatPrecio(item.producto.precio)}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                      className="w-6 h-6 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-variant text-sm"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-body font-medium">{item.cantidad}</span>
                    <button
                      onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                      className="w-6 h-6 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-variant text-sm"
                    >
                      +
                    </button>
                    <button
                      onClick={() => remover(item.producto.id)}
                      className="ml-auto text-error hover:text-on-error-container transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6" />
                        <path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6" />
                        <path d="M10,11v6M14,11v6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-outline-variant bg-surface">
            <div className="flex justify-between items-center mb-4">
              <span className="font-body font-semibold text-on-surface">Subtotal</span>
              <span className="font-headline font-bold text-xl text-on-surface">{formatPrecio(total)}</span>
            </div>
            <Link href="/checkout" onClick={toggleDrawer}>
              <Button className="w-full" size="lg">
                Finalizar compra →
              </Button>
            </Link>
            <Link href="/carrito" onClick={toggleDrawer} className="block text-center mt-2 text-sm font-body text-on-surface-variant hover:text-on-surface transition-colors">
              Ver carrito completo
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
