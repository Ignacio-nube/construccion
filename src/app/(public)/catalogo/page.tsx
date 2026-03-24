import { createServerClient } from '@/lib/insforge'
import type { Producto, CategoriaProducto } from '@/types'
import ProductoCard from '@/components/productos/ProductoCard'
import Link from 'next/link'

const CATEGORIAS: CategoriaProducto[] = [
  'Cemento y Hormigón',
  'Hierros y Aceros',
  'Pinturas',
  'Sanitarios',
  'Herramientas',
  'Maderas',
]

interface SearchParams {
  categoria?: string
  q?: string
  orden?: string
}

async function getProductos(params: SearchParams): Promise<Producto[]> {
  try {
    const insforge = createServerClient()
    let query = insforge.database
      .from('productos')
      .select('*')
      .eq('activo', true)

    if (params.categoria) {
      query = query.eq('categoria', params.categoria)
    }
    if (params.q) {
      query = query.ilike('nombre', `%${params.q}%`)
    }

    const ordenDir = params.orden === 'precio_asc' || params.orden === 'precio_desc'
    if (ordenDir) {
      query = query.order('precio', { ascending: params.orden === 'precio_asc' })
    } else {
      query = query.order('nombre', { ascending: true })
    }

    const { data } = await query
    return (data as Producto[]) ?? []
  } catch {
    return []
  }
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const productos = await getProductos(searchParams)
  const categoriaActiva = searchParams.categoria
  const ordenActivo = searchParams.orden ?? ''

  return (
    <div className="min-h-screen">
      {/* Encabezado sección */}
      <div className="bg-surface-container-low border-b border-outline-variant/30 pt-20 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            {categoriaActiva ?? 'Todos los productos'}
          </span>
          <h1 className="text-5xl font-black font-headline tracking-tighter text-on-background uppercase mt-2">
            Catálogo
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-3">
            Mostrando {productos.length} de {productos.length} producto{productos.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Barra de filtros superior */}
        <div className="flex flex-wrap gap-3 mb-8 items-center justify-between">
          {/* Buscador inline */}
          <form method="GET" className="flex gap-0 flex-1 max-w-md">
            {categoriaActiva && (
              <input type="hidden" name="categoria" value={categoriaActiva} />
            )}
            <input
              name="q"
              defaultValue={searchParams.q}
              type="search"
              placeholder="Buscar productos..."
              className="flex-1 px-4 py-3 bg-surface-container-highest border-none focus:outline-none focus:ring-0 focus:border-b-2 focus:border-primary font-body text-sm text-on-surface placeholder:text-on-surface-variant/60"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-on-background text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-colors"
            >
              Buscar
            </button>
          </form>

          {/* Ordenar por */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Ordenar por:
            </span>
            <div className="flex gap-1">
              {[
                { valor: '', label: 'Nombre' },
                { valor: 'precio_asc', label: 'Menor precio' },
                { valor: 'precio_desc', label: 'Mayor precio' },
              ].map((opt) => {
                const href = categoriaActiva
                  ? `/catalogo?categoria=${encodeURIComponent(categoriaActiva)}&orden=${opt.valor}`
                  : `/catalogo?orden=${opt.valor}`
                return (
                  <Link
                    key={opt.valor}
                    href={href}
                    scroll={false}
                    className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                      ordenActivo === opt.valor
                        ? 'bg-on-background text-white'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {opt.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-60 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="font-headline font-semibold text-sm uppercase tracking-widest text-on-surface-variant mb-4">
                Filtrar por categoría
              </h3>
              <nav className="space-y-0.5">
                <Link
                  href="/catalogo"
                  scroll={false}
                  className={`flex items-center justify-between px-4 py-3 text-sm font-body transition-colors ${
                    !categoriaActiva
                      ? 'bg-orange-50 text-orange-700 border-r-4 border-orange-600 font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  <span>Todas las categorías</span>
                </Link>
                {CATEGORIAS.map((cat) => (
                  <Link
                    key={cat}
                    href={`/catalogo?categoria=${encodeURIComponent(cat)}`}
                    scroll={false}
                    className={`flex items-center justify-between px-4 py-3 text-sm font-body transition-colors ${
                      categoriaActiva === cat
                        ? 'bg-orange-50 text-orange-700 border-r-4 border-orange-600 font-semibold'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                    }`}
                  >
                    <span>{cat}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Grid productos */}
          <div className="flex-1">
            {productos.length === 0 ? (
              <div className="text-center py-20 text-on-surface-variant font-body">
                <p className="font-headline font-black text-3xl text-on-background uppercase tracking-tight mb-4">
                  Sin resultados
                </p>
                <p className="text-sm mb-6">Probá con otros filtros o términos de búsqueda.</p>
                <Link
                  href="/catalogo"
                  className="inline-block bg-primary-container text-on-primary-container font-bold uppercase tracking-widest text-sm px-8 py-4 hover:bg-primary hover:text-white transition-colors"
                >
                  Ver todos los productos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {productos.map((p) => (
                  <ProductoCard key={p.id} producto={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
