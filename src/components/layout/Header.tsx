'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useCarrito } from '@/lib/store/carrito'
import Logo from '@/components/ui/Logo'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/calculadora', label: 'Calculadora' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const pathname = usePathname()
  const totalItems = useCarrito((s) => s.items.reduce((acc, i) => acc + i.cantidad, 0))
  const toggleDrawer = useCarrito((s) => s.toggleDrawer)

  useEffect(() => {
    setMounted(true)
  }, [])

  const itemCount = mounted ? totalItems : 0

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Logo />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-headline font-bold tracking-tight text-sm transition-colors ${
                      isActive
                        ? 'text-primary border-b-2 border-primary pb-0.5'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-4">
              {/* Ubicación */}
              <span className="hidden lg:flex items-center gap-1.5 text-xs font-body text-on-surface-variant">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-primary flex-shrink-0">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Yerba Buena, Tucumán
              </span>

              {/* Botón carrito */}
              <button
                onClick={toggleDrawer}
                className="relative p-2 text-on-surface-variant hover:text-on-surface transition-colors"
                aria-label="Abrir carrito"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 text-on-surface-variant hover:text-on-surface"
                onClick={() => setMenuAbierto(!menuAbierto)}
                aria-label="Menú"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {menuAbierto ? (
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  ) : (
                    <>
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Separador sutil */}
        <div className="h-px bg-stone-100" />

        {/* Mobile menu */}
        {menuAbierto && (
          <nav className="md:hidden bg-white border-t border-stone-100 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block py-2.5 px-3 font-headline font-bold text-sm tracking-tight transition-colors ${
                      isActive
                        ? 'text-primary bg-orange-50'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                    }`}
                    onClick={() => setMenuAbierto(false)}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </nav>
        )}
      </header>
    </>
  )
}
