import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ItemCarrito, Producto } from '@/types'

interface CarritoStore {
  items: ItemCarrito[]
  drawerAbierto: boolean
  agregar: (producto: Producto) => void
  remover: (productoId: string) => void
  actualizarCantidad: (productoId: string, cantidad: number) => void
  vaciar: () => void
  toggleDrawer: () => void
  totalItems: () => number
  subtotal: () => number
}

export const useCarrito = create<CarritoStore>()(
  persist(
    (set, get) => ({
      items: [],
      drawerAbierto: false,

      agregar: (producto) => {
        set((state) => {
          const existente = state.items.find((i) => i.producto.id === producto.id)
          if (existente) {
            return {
              items: state.items.map((i) =>
                i.producto.id === producto.id
                  ? { ...i, cantidad: i.cantidad + 1 }
                  : i
              ),
            }
          }
          return { items: [...state.items, { producto, cantidad: 1 }] }
        })
      },

      remover: (productoId) => {
        set((state) => ({
          items: state.items.filter((i) => i.producto.id !== productoId),
        }))
      },

      actualizarCantidad: (productoId, cantidad) => {
        if (cantidad <= 0) {
          get().remover(productoId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.producto.id === productoId ? { ...i, cantidad } : i
          ),
        }))
      },

      vaciar: () => set({ items: [] }),

      toggleDrawer: () => set((state) => ({ drawerAbierto: !state.drawerAbierto })),

      totalItems: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),

      subtotal: () =>
        get().items.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0),
    }),
    {
      name: 'carrito-don-fierro',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
