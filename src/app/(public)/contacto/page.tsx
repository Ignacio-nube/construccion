'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Button from '@/components/ui/Button'
import { enviarMensaje } from './actions'
import toast from 'react-hot-toast'

const MapboxMapa = dynamic(() => import('@/components/checkout/MapboxMapa'), { ssr: false })

export default function ContactoPage() {
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await enviarMensaje(formData)
    setLoading(false)
    if (res.ok) {
      setEnviado(true)
      toast.success('Mensaje enviado correctamente')
    } else {
      toast.error(res.error ?? 'Error al enviar')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-headline font-black text-3xl text-on-surface mb-2">Contacto</h1>
      <p className="text-on-surface-variant font-body text-sm mb-10">
        Estamos en Yerba Buena. Escribinos o visitanos.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Formulario */}
        <div>
          <div className="bg-surface border border-outline-variant/40 p-6">
            {enviado ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-primary-container flex items-center justify-center mx-auto mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#532000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <h3 className="font-headline font-bold text-xl text-on-surface mb-2">
                  ¡Mensaje enviado!
                </h3>
                <p className="text-on-surface-variant font-body text-sm">
                  Te responderemos a la brevedad.
                </p>
                <button
                  onClick={() => setEnviado(false)}
                  className="mt-4 text-primary font-semibold text-sm font-body hover:underline"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-body font-semibold text-on-surface mb-1.5">
                    Nombre *
                  </label>
                  <input
                    name="nombre"
                    required
                    className="w-full px-3 py-2.5 border border-outline-variant bg-surface text-on-surface text-sm font-body focus:outline-none focus:border-primary"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body font-semibold text-on-surface mb-1.5">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-3 py-2.5 border border-outline-variant bg-surface text-on-surface text-sm font-body focus:outline-none focus:border-primary"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body font-semibold text-on-surface mb-1.5">
                    Mensaje *
                  </label>
                  <textarea
                    name="mensaje"
                    required
                    rows={5}
                    className="w-full px-3 py-2.5 border border-outline-variant bg-surface text-on-surface text-sm font-body focus:outline-none focus:border-primary resize-none"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>
                <Button type="submit" loading={loading} size="lg" className="w-full">
                  Enviar mensaje
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="bg-surface border border-outline-variant/40 overflow-hidden">
            <MapboxMapa />
            <div className="p-5">
              <address className="not-italic text-sm font-body text-on-surface-variant space-y-1">
                <p className="font-semibold text-on-surface">Corralón Don Fierro</p>
                <p>Av. Aconquija 1850, Yerba Buena, Tucumán (CP 4107)</p>
              </address>
            </div>
          </div>

          <div className="bg-surface border border-outline-variant/40 p-6">
            <h3 className="font-headline font-bold text-lg text-on-surface mb-4">Datos de contacto</h3>
            <div className="space-y-3 text-sm font-body text-on-surface-variant">
              <div className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-primary">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.38 2 2 0 0 1 3.59 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href="tel:+543814012380" className="hover:text-on-surface transition-colors">
                  +54 381 401-2380
                </a>
              </div>
              <div className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-primary">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a href="mailto:ignacio@ignacio.cloud" className="hover:text-on-surface transition-colors">
                  ignacio@ignacio.cloud
                </a>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-outline-variant/40 p-6">
            <h3 className="font-headline font-bold text-lg text-on-surface mb-4">Horarios</h3>
            <table className="w-full text-sm font-body">
              <tbody>
                {[
                  { dia: 'Lunes a Viernes', horario: '7:30 – 18:00' },
                  { dia: 'Sábado', horario: '8:00 – 13:00' },
                  { dia: 'Domingo', horario: 'Cerrado' },
                ].map(({ dia, horario }) => (
                  <tr key={dia} className="border-b border-outline-variant/30 last:border-0">
                    <td className="py-2 text-on-surface-variant">{dia}</td>
                    <td className="py-2 text-on-surface font-semibold text-right">{horario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
