'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils/cn'

interface ModalProps {
  abierto: boolean
  onClose: () => void
  titulo?: string
  children: React.ReactNode
  className?: string
}

export default function Modal({ abierto, onClose, titulo, children, className }: ModalProps) {
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [abierto])

  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-inverse-surface/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative bg-surface z-10 w-full max-w-lg mx-4 shadow-tectonic max-h-[90vh] overflow-y-auto scrollbar-thin',
          className
        )}
      >
        {titulo && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
            <h2 className="font-headline font-bold text-lg text-on-surface">{titulo}</h2>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-on-surface transition-colors p-1"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
