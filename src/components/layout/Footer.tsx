import Link from 'next/link'
import Logo from '@/components/ui/Logo'

const CATEGORIAS = [
  'Cemento y Hormigón',
  'Hierros y Aceros',
  'Pinturas',
  'Sanitarios',
  'Herramientas',
  'Maderas',
]

export default function Footer() {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo + desc */}
          <div className="md:col-span-1">
            <Logo invertido />
            <p className="mt-4 text-sm text-inverse-on-surface/60 font-body leading-relaxed">
              Materiales de construcción de calidad para profesionales y particulares en Tucumán.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="tel:+543814012380" className="text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors text-sm">
                +54 381 401-2380
              </a>
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="font-headline font-bold text-sm uppercase tracking-wider mb-4 text-inverse-on-surface/70">
              Navegación
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/catalogo', label: 'Catálogo' },
                { href: '/calculadora', label: 'Calculadora' },
                { href: '/contacto', label: 'Contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-body text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorías */}
          <div>
            <h4 className="font-headline font-bold text-sm uppercase tracking-wider mb-4 text-inverse-on-surface/70">
              Categorías
            </h4>
            <ul className="space-y-2">
              {CATEGORIAS.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/catalogo?categoria=${encodeURIComponent(cat)}`}
                    className="text-sm font-body text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-headline font-bold text-sm uppercase tracking-wider mb-4 text-inverse-on-surface/70">
              Contacto
            </h4>
            <address className="not-italic space-y-2 text-sm font-body text-inverse-on-surface/60">
              <p>Av. Aconquija 1850</p>
              <p>Yerba Buena, Tucumán</p>
              <p className="mt-3">
                <a href="mailto:ignacio@ignacio.cloud" className="hover:text-inverse-on-surface transition-colors">
                  ignacio@ignacio.cloud
                </a>
              </p>
              <p className="mt-3 font-medium text-inverse-on-surface/80">Horarios</p>
              <p>Lun–Vie: 7:30–18:00</p>
              <p>Sáb: 8:00–13:00</p>
            </address>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-inverse-on-surface/10 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-inverse-on-surface/40 font-body">
            © {new Date().getFullYear()} Corralón Don Fierro. Todos los derechos reservados.
          </p>
          <p className="text-xs text-inverse-on-surface/40 font-body">
            Yerba Buena, Tucumán, Argentina
          </p>
        </div>
      </div>
    </footer>
  )
}
