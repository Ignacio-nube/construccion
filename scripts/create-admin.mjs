import { createClient } from '@insforge/sdk'

const insforge = createClient({
  baseUrl: 'https://5x7qhhm9.us-east.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTc0NDN9.coB9k9yXHB4wdH9gR4NwLqwmfoFT5hOFXykY_n4iy34',
})

const email = 'admin@corralondonfierra.com.ar'
const password = 'Admin1234!'

console.log(`Creando usuario admin: ${email}`)

const { data, error } = await insforge.auth.signUp({ email, password, name: 'Admin Don Fierro' })

if (error) {
  if (error.message?.includes('already')) {
    console.log('El usuario ya existe. Intentando sign in...')
    const { data: loginData, error: loginError } = await insforge.auth.signInWithPassword({ email, password })
    if (loginError) {
      console.error('Error al iniciar sesión:', loginError.message)
    } else {
      console.log('Login exitoso:', loginData?.user?.email)
    }
  } else {
    console.error('Error al crear usuario:', error.message)
  }
} else {
  console.log('Usuario creado:', data)
  if (data?.requireEmailVerification) {
    console.log('⚠️  REQUIERE VERIFICACIÓN DE EMAIL')
    console.log('Revisá el email y verificá con el código OTP')
    console.log('O desactivá la verificación de email desde el dashboard de InsForge')
  }
}
