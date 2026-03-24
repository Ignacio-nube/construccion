'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Credenciales incorrectas')
      } else {
        router.push('/admin')
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-inverse-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo invertido />
        </div>
        <div className="bg-surface p-8 shadow-tectonic">
          <h1 className="font-headline font-black text-xl text-on-surface mb-1">Panel Admin</h1>
          <p className="text-on-surface-variant font-body text-sm mb-6">Iniciá sesión para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-body font-semibold text-on-surface mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@corralondonfierra.com.ar"
                className="w-full px-3 py-2.5 border border-outline-variant bg-surface text-on-surface text-sm font-body focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-body font-semibold text-on-surface mb-1.5">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-outline-variant bg-surface text-on-surface text-sm font-body focus:outline-none focus:border-primary"
              />
            </div>
            <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
              Iniciar sesión →
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
