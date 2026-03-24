'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { formatPrecio } from '@/lib/utils/formato'

function ExitoContent() {
  const params = useSearchParams()
  const numeroPedido = params.get('pedido') ?? '—'
  const email        = params.get('email') ?? ''
  const nombre       = params.get('nombre') ?? ''
  const direccion    = params.get('direccion') ?? ''
  const totalRaw     = params.get('total')
  const total        = totalRaw ? Number(totalRaw) : null

  const pasos = [
    { emoji: '📋', titulo: 'Revisamos tu pedido',       desc: 'En las próximas 2 horas' },
    { emoji: '📦', titulo: 'Preparamos los materiales', desc: 'El mismo día' },
    { emoji: '🚛', titulo: 'Entrega en tu dirección',   desc: 'Dentro de 48 horas hábiles' },
  ]

  return (
    <div className="min-h-screen bg-surface-container-low py-14 px-4">
      <div className="max-w-xl mx-auto">

        {/* Check animado */}
        <div className="flex flex-col items-center mb-10">
          <div className="anim-scale-bounce w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6 shadow-[0_8px_32px_rgba(232,80,10,0.35)]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline className="anim-draw-check" points="20,6 9,17 4,12" />
            </svg>
          </div>
          <h1 className="anim-fade-up font-headline font-black text-4xl text-on-surface tracking-tight mb-2 text-center">
            ¡Pedido confirmado!
          </h1>
          {email && (
            <p className="anim-fade-up-2 text-on-surface-variant font-body text-sm text-center">
              Te enviamos los detalles a <strong className="text-on-surface">{email}</strong>
            </p>
          )}
        </div>

        {/* Card resumen */}
        <div className="anim-fade-up-2 bg-surface border border-outline-variant/40 overflow-hidden mb-5">
          {/* Número de pedido destacado */}
          <div className="bg-inverse-surface px-6 py-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-inverse-on-surface/50 mb-1">
                Número de pedido
              </p>
              <p className="font-headline font-black text-2xl text-primary-container tracking-[0.12em]">
                {numeroPedido}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-inverse-on-surface/50 mb-1">
                Estado
              </p>
              <span className="inline-block bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                Recibido
              </span>
            </div>
          </div>

          {/* Detalles */}
          <div className="px-6 py-5 space-y-3">
            {nombre && (
              <div className="flex justify-between text-sm font-body">
                <span className="text-on-surface-variant">Cliente</span>
                <span className="text-on-surface font-semibold">{nombre}</span>
              </div>
            )}
            {direccion && (
              <div className="flex justify-between text-sm font-body gap-4">
                <span className="text-on-surface-variant flex-shrink-0">Dirección</span>
                <span className="text-on-surface font-semibold text-right">{direccion}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-body">
              <span className="text-on-surface-variant">Entrega estimada</span>
              <span className="text-on-surface font-semibold">48 horas hábiles</span>
            </div>
            {total !== null && (
              <div className="flex justify-between items-center pt-3 border-t border-outline-variant/40">
                <span className="text-sm font-body text-on-surface-variant font-semibold uppercase tracking-wide">Total pagado</span>
                <span className="font-headline font-black text-2xl text-on-surface">{formatPrecio(total)}</span>
              </div>
            )}
          </div>
        </div>

        {/* ¿Qué sigue? */}
        <div className="anim-fade-up-3 bg-surface border border-outline-variant/40 p-6 mb-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-5">
            ¿Qué sigue?
          </p>
          <div className="grid grid-cols-3 gap-3">
            {pasos.map((p, i) => (
              <div key={p.titulo} className="text-center">
                <div className="text-3xl mb-2">{p.emoji}</div>
                <p className="text-xs font-body font-bold text-on-surface leading-tight mb-1">{p.titulo}</p>
                <p className="text-[10px] font-body text-on-surface-variant leading-tight">{p.desc}</p>
                {i < pasos.length - 1 && (
                  <div className="hidden" />
                )}
              </div>
            ))}
          </div>
          {/* Línea de progreso */}
          <div className="flex items-center gap-0 mt-5">
            {pasos.map((_, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${
                  i === 0 ? 'bg-primary text-white' : 'bg-surface-variant text-on-surface-variant'
                }`}>
                  {i === 0 ? '✓' : i + 1}
                </div>
                {i < pasos.length - 1 && (
                  <div className={`flex-1 h-px ${i === 0 ? 'bg-primary/40' : 'bg-outline-variant/40'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp */}
        <div className="anim-fade-up-3 bg-surface border border-outline-variant/40 px-5 py-4 mb-6 flex items-center justify-between">
          <p className="text-sm font-body text-on-surface-variant">¿Dudas con tu pedido?</p>
          <a
            href="https://wa.me/5493814012380?text=Hola%2C%20tengo%20una%20consulta%20sobre%20mi%20pedido"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-body font-semibold text-on-surface hover:text-primary transition-colors"
          >
            <span className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </span>
            Consultanos por WhatsApp
          </a>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/catalogo" className="flex-1">
            <Button size="lg" className="w-full">Ver más productos →</Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="secondary" size="lg" className="w-full">Volver al inicio</Button>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default function CheckoutExitoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface-container-low flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ExitoContent />
    </Suspense>
  )
}
