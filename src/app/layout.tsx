import type { Metadata } from 'next'
import { Epilogue, Manrope } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const epilogue = Epilogue({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
  variable: '--font-epilogue',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Corralón Don Fierro | Materiales de Construcción - Tucumán',
  description:
    'Cemento, hierros, pinturas, sanitarios, herramientas y maderas. Entrega en Yerba Buena y alrededores.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${epilogue.variable} ${manrope.variable}`}>
      <body className="bg-background text-on-surface antialiased font-body min-h-screen flex flex-col">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#303030',
              color: '#f3f0ef',
              fontFamily: 'var(--font-manrope)',
              fontSize: '14px',
              borderRadius: '0.125rem',
            },
          }}
        />
      </body>
    </html>
  )
}
