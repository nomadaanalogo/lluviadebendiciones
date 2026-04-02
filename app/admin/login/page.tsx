'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, LogIn } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/admin/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })

      if (authError) {
        setError('Correo o contraseña incorrectos. Verifica tus datos.')
        return
      }

      router.push(redirectTo)
      router.refresh()
    } catch {
      setError('Error al iniciar sesión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-bordo/10 blur-2xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-gold text-5xl mb-3">✝</div>
          <h1 className="font-playfair text-2xl font-bold text-gold">
            Lluvia de Bendiciones
          </h1>
          <p className="text-cream/50 text-sm mt-1">Panel de Administración</p>
        </div>

        {/* Login card */}
        <div className="bg-white/5 backdrop-blur-sm border border-gold/20 rounded-2xl p-8">
          <h2 className="font-playfair text-xl font-bold text-cream mb-6 text-center">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-cream/70 text-sm font-medium mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Mail size={18} className="text-cream/30" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full bg-white/10 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                  placeholder="admin@lluviadebendiciones.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-cream/70 text-sm font-medium mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock size={18} className="text-cream/30" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full bg-white/10 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold flex items-center justify-center gap-2 py-3 text-base font-bold disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <p className="text-center text-cream/30 text-xs mt-6">
            Acceso restringido al personal autorizado
          </p>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <a href="/" className="text-cream/30 hover:text-cream/60 text-xs transition-colors">
            ← Volver al sitio web
          </a>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
