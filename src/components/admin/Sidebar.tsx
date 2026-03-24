'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, LogOut, Menu, X } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { cn } from '@/lib/utils/cn'

interface SidebarProps {
  mensajesNoLeidos?: number
}

const links = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { href: '/admin/productos', label: 'Productos', Icon: Package },
  { href: '/admin/pedidos', label: 'Pedidos', Icon: ShoppingCart },
  { href: '/admin/mensajes', label: 'Mensajes', Icon: MessageSquare },
]

function NavLinks({ pathname, mensajesNoLeidos, onNavigate }: {
  pathname: string
  mensajesNoLeidos: number
  onNavigate?: () => void
}) {
  return (
    <nav className="flex-1 px-2 py-4 space-y-0.5">
      {links.map((link) => {
        const activo = link.exact ? pathname === link.href : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 text-sm font-body font-medium rounded-md transition-colors duration-150',
              activo
                ? 'bg-[#E8500A] text-white border-l-2 border-[#b83d05]'
                : 'text-white/60 hover:bg-white/[0.08] hover:text-white'
            )}
          >
            <link.Icon size={16} strokeWidth={1.75} />
            <span>{link.label}</span>
            {link.label === 'Mensajes' && mensajesNoLeidos > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                {mensajesNoLeidos}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

export default function Sidebar({ mensajesNoLeidos = 0 }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-[#1a1a1a] min-h-screen shrink-0">
        <div className="px-4 py-5 border-b border-white/10">
          <Logo invertido />
          <p className="text-[10px] font-normal text-white/30 mt-1 uppercase tracking-widest">
            Panel Admin
          </p>
        </div>
        <NavLinks pathname={pathname} mensajesNoLeidos={mensajesNoLeidos} />
        <div className="px-2 pb-5 border-t border-white/10 pt-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-body text-white/40 hover:text-red-400 hover:bg-white/[0.08] rounded-md transition-colors duration-150"
          >
            <LogOut size={16} strokeWidth={1.75} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-white/10">
        <Logo invertido />
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="p-2 text-white/60 hover:text-white transition-colors"
        >
          {menuAbierto ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {menuAbierto && (
        <div className="lg:hidden bg-[#1a1a1a] border-b border-white/10">
          <NavLinks
            pathname={pathname}
            mensajesNoLeidos={mensajesNoLeidos}
            onNavigate={() => setMenuAbierto(false)}
          />
          <div className="px-2 pb-4 border-t border-white/10 pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-body text-white/40 hover:text-red-400 transition-colors rounded-md"
            >
              <LogOut size={16} strokeWidth={1.75} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
