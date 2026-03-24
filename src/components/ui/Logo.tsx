import { cn } from '@/lib/utils/cn'

interface LogoProps {
  className?: string
  invertido?: boolean
}

export default function Logo({ className, invertido }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="flex-shrink-0 w-9 h-9 bg-primary-container flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="10" width="18" height="3" fill="#532000" />
          <rect x="9" y="2" width="4" height="18" fill="#532000" />
          <rect x="2" y="2" width="6" height="6" fill="#532000" opacity="0.5" />
          <rect x="14" y="14" width="6" height="6" fill="#532000" opacity="0.5" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            'text-[10px] font-body font-semibold tracking-[0.12em] uppercase',
            invertido ? 'text-inverse-on-surface/70' : 'text-on-surface-variant'
          )}
        >
          CORRALÓN
        </span>
        <span
          className={cn(
            'text-lg font-headline font-black tracking-tight leading-none',
            invertido ? 'text-inverse-on-surface' : 'text-on-surface'
          )}
        >
          DON FIERRO
        </span>
      </div>
    </div>
  )
}
