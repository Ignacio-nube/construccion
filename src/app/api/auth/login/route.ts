import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/insforge'
import { setAuthCookies } from '@/lib/auth-cookies'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  const insforge = createServerClient()
  const { data, error } = await insforge.auth.signInWithPassword({ email, password })

  if (error || !data?.accessToken || !data?.refreshToken) {
    return NextResponse.json({ error: error?.message ?? 'Credenciales incorrectas' }, { status: 401 })
  }

  await setAuthCookies(data.accessToken, data.refreshToken)
  return NextResponse.json({ ok: true })
}
