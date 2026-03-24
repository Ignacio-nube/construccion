'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useCarrito } from '@/lib/store/carrito'
import { formatPrecio } from '@/lib/utils/formato'
import type { Producto, CategoriaProducto } from '@/types'
import toast from 'react-hot-toast'

interface ProductoCardProps {
  producto: Producto
}

const FALLBACK_IMAGENES: Record<CategoriaProducto, string> = {
  'Cemento y Hormigón': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=75&auto=format&fit=crop',
  'Hierros y Aceros':   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75&auto=format&fit=crop',
  'Pinturas':           'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=75&auto=format&fit=crop',
  'Sanitarios':         'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=75&auto=format&fit=crop',
  'Herramientas':       'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&q=75&auto=format&fit=crop',
  'Maderas':            'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400&q=75&auto=format&fit=crop',
}

export default function ProductoCard({ producto }: ProductoCardProps) {
  const agregar = useCarrito((s) => s.agregar)
  const [imgError, setImgError] = useState(false)

  const handleAgregar = () => {
    agregar(producto)
    toast.success(`${producto.nombre} agregado al carrito`)
  }

  const isPlaceholder = !producto.imagen_url || producto.imagen_url.includes('picsum.photos')
  const fallback = FALLBACK_IMAGENES[producto.categoria] ?? FALLBACK_IMAGENES['Cemento y Hormigón']
  const imgSrc: string = (isPlaceholder || imgError || !producto.imagen_url)
    ? fallback
    : producto.imagen_url

  return (
    <article className="group flex flex-col bg-surface-container-lowest overflow-hidden tectonic-shadow hover:-translate-y-1 hover:shadow-tectonic-hover transition-all duration-250">
      {/* Imagen */}
      <div className="aspect-[4/3] bg-surface-container-high relative overflow-hidden">
        <Image
          src={imgSrc}
          alt={producto.nombre}
          fill
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          onError={() => setImgError(true)}
        />

        {/* Badge categoría */}
        <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-black px-2 py-1 tracking-tighter uppercase z-10">
          {producto.categoria}
        </span>

        {/* Badge entrega / stock bajo */}
        {producto.stock === 0 ? null : producto.stock < 5 ? (
          <span className="absolute top-3 right-3 bg-error-container text-on-error-container text-[10px] font-black px-2 py-1 uppercase tracking-tighter z-10">
            ¡Últimas {producto.stock}!
          </span>
        ) : (
          <span className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-tighter z-10">
            📦 Entrega 48hs
          </span>
        )}

        {/* Sin stock overlay */}
        {producto.stock === 0 && (
          <div className="absolute inset-0 bg-on-background/60 flex items-center justify-center z-10">
            <span className="bg-error-container text-on-error-container text-[10px] font-black px-3 py-1.5 uppercase tracking-widest">
              Sin Stock
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5 flex-grow flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
          {producto.categoria}
        </span>

        <h3 className="font-headline font-bold text-lg uppercase tracking-tight text-on-background mb-1 leading-snug">
          {producto.nombre}
        </h3>

        {producto.descripcion && (
          <p className="text-xs text-on-surface-variant font-body mb-3 leading-relaxed line-clamp-2">
            {producto.descripcion}
          </p>
        )}

        <div className="mt-auto">
          <p className="font-headline font-black text-2xl text-on-surface">
            {formatPrecio(producto.precio)}
          </p>
          <button
            onClick={handleAgregar}
            disabled={producto.stock === 0}
            className="w-full mt-3 bg-secondary-container text-on-surface py-3 text-xs font-bold uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed disabled:group-hover:bg-secondary-container disabled:group-hover:text-on-surface"
          >
            {producto.stock === 0 ? 'Sin stock' : 'Añadir al carrito'}
          </button>
        </div>
      </div>
    </article>
  )
}
