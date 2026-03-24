import Link from 'next/link'
import Image from 'next/image'
import { createServerClient } from '@/lib/insforge'
import type { Producto } from '@/types'
import ProductoCard from '@/components/productos/ProductoCard'

const CATEGORIAS = [
  {
    nombre: 'Áridos y Cemento',
    slug: 'Cemento y Hormigón',
    imagen: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=75&auto=format&fit=crop',
  },
  {
    nombre: 'Hierros y Aceros',
    slug: 'Hierros y Aceros',
    imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=75&auto=format&fit=crop',
  },
  {
    nombre: 'Pinturas',
    slug: 'Pinturas',
    imagen: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=800&q=75&auto=format&fit=crop',
  },
  {
    nombre: 'Sanitarios',
    slug: 'Sanitarios',
    imagen: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=75&auto=format&fit=crop',
  },
  {
    nombre: 'Herramientas',
    slug: 'Herramientas',
    imagen: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=75&auto=format&fit=crop',
  },
  {
    nombre: 'Maderas',
    slug: 'Maderas',
    imagen: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=800&q=75&auto=format&fit=crop',
  },
]

async function getProductosDestacados(): Promise<Producto[]> {
  try {
    const insforge = createServerClient()
    const { data } = await insforge.database
      .from('productos')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: false })
      .limit(4)
    return (data as Producto[]) ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const productos = await getProductosDestacados()

  return (
    <>
      {/* Hero */}
      <section className="relative bg-surface-container-low min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=75&auto=format&fit=crop"
            alt="Materiales de construcción"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-primary text-on-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
              Yerba Buena · Tucumán
            </span>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-headline tracking-tighter leading-none text-on-background mb-6">
              Materiales<br />
              para construir<br />
              <span className="text-primary">en serio.</span>
            </h1>

            <p className="text-on-surface-variant font-body text-lg mb-10 leading-relaxed max-w-xl">
              Cemento, hierros, pinturas y más. Entrega en toda el área metropolitana de Tucumán.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Link
                href="/catalogo"
                className="bg-primary-container text-on-primary-container font-bold uppercase tracking-widest text-sm px-8 py-4 hover:bg-primary hover:text-white transition-colors"
              >
                Ver catálogo completo
              </Link>
              <Link
                href="/calculadora"
                className="flex items-center gap-2 border-2 border-on-surface/40 text-on-surface font-bold uppercase tracking-widest text-sm px-8 py-4 hover:border-on-surface hover:bg-on-surface hover:text-surface transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <line x1="8" y1="6" x2="16" y2="6" />
                  <line x1="8" y1="10" x2="10" y2="10" />
                  <line x1="12" y1="10" x2="14" y2="10" />
                  <line x1="16" y1="10" x2="16" y2="10" />
                  <line x1="8" y1="14" x2="10" y2="14" />
                  <line x1="12" y1="14" x2="14" y2="14" />
                  <line x1="16" y1="14" x2="16" y2="14" />
                  <line x1="8" y1="18" x2="10" y2="18" />
                  <line x1="12" y1="18" x2="14" y2="18" />
                  <line x1="16" y1="18" x2="16" y2="18" />
                </svg>
                Calculadora de materiales
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8">
              {[
                '+200 productos',
                'Entrega en todo el Gran Tucumán',
                '+15 años de experiencia',
              ].map((stat, i) => (
                <div key={stat} className="flex items-center gap-6">
                  {i > 0 && <span className="hidden sm:block w-px h-4 bg-outline-variant/60" />}
                  <span className="text-sm font-body text-on-surface-variant font-medium">{stat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categorías — grilla uniforme 3×2 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Explorar por categoría
          </span>
          <h2 className="font-headline font-black text-4xl md:text-5xl text-on-background tracking-tighter mt-2">
            ¿Qué necesitás?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORIAS.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalogo?categoria=${encodeURIComponent(cat.slug)}`}
              className="group relative aspect-[4/3] overflow-hidden"
            >
              <Image
                src={cat.imagen}
                alt={cat.nombre}
                fill
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">
                  Ver stock →
                </p>
                <h3 className="font-headline font-black text-xl md:text-2xl text-white tracking-tight">
                  {cat.nombre}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="bg-surface-container py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Lo más pedido
              </span>
              <h2 className="font-headline font-black text-4xl md:text-5xl text-on-background tracking-tighter mt-2">
                Destacados
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="text-sm font-bold uppercase tracking-widest text-primary hover:text-on-surface transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          {productos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {productos.map((p) => (
                <ProductoCard key={p.id} producto={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-on-surface-variant font-body">
              <p className="text-lg font-semibold mb-4">No hay productos disponibles aún.</p>
              <Link
                href="/catalogo"
                className="inline-block bg-primary-container text-on-primary-container font-bold uppercase tracking-widest text-sm px-8 py-4 hover:bg-primary hover:text-white transition-colors"
              >
                Ver catálogo
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="bg-on-background py-20 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <svg width="600" height="400" viewBox="0 0 24 24" fill="white">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-container">
              Por qué elegirnos
            </span>
            <h2 className="font-headline font-black text-4xl md:text-5xl text-white tracking-tighter mt-2">
              Construí con confianza.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {[
              { titulo: 'Entrega en 48hs', desc: 'Llevamos los materiales a tu obra en toda el área metropolitana de Tucumán.', num: '01' },
              { titulo: 'Stock garantizado', desc: 'Más de 200 productos disponibles. Consultá disponibilidad antes de tu pedido.', num: '02' },
              { titulo: 'Calidad certificada', desc: 'Solo trabajamos con marcas líderes del mercado. Productos con garantía.', num: '03' },
            ].map((item) => (
              <div key={item.titulo} className="bg-on-background p-8 md:p-10">
                <p className="font-headline font-black text-6xl text-white/10 mb-4 leading-none">{item.num}</p>
                <h3 className="font-headline font-bold text-xl text-white mb-3 uppercase tracking-tight">{item.titulo}</h3>
                <p className="text-sm font-body text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
