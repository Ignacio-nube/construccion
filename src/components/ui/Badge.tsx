import { cn } from '@/lib/utils/cn'
import type { CategoriaProducto, EstadoPedido } from '@/types'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'categoria' | 'estado' | 'stock'
  estado?: EstadoPedido
  categoria?: CategoriaProducto
  className?: string
}

const estadoClases: Record<EstadoPedido, string> = {
  pendiente: 'bg-surface-variant text-on-surface-variant',
  confirmado: 'bg-tertiary-container text-on-tertiary-container',
  'en preparación': 'bg-primary-fixed text-on-primary-fixed',
  enviado: 'bg-secondary-container text-on-secondary-container',
  entregado: 'bg-[#c8e6c9] text-[#1b5e20]',
}

export default function Badge({ children, variant = 'default', estado, className }: BadgeProps) {
  const base = 'inline-flex items-center px-2 py-0.5 text-xs font-semibold font-body'

  const clases =
    variant === 'estado' && estado
      ? estadoClases[estado]
      : variant === 'stock'
      ? 'bg-error-container text-on-error-container'
      : 'bg-surface-variant text-on-surface-variant'

  return <span className={cn(base, clases, className)}>{children}</span>
}
