'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { getClientAuth } from '@/lib/firebase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user } = await signInWithEmailAndPassword(getClientAuth(), email, password)
      const idToken = await user.getIdToken()

      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })

      if (!res.ok) throw new Error('Failed to create session')

      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign-in failed'
      setError(msg.includes('invalid-credential') ? 'Incorrect email or password' : msg)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-navy mb-4">
            <span className="text-2xl font-bold text-teal">L</span>
          </div>
          <h1 className="text-2xl font-bold text-navy">IEL Pioneer Tracker</h1>
          <p className="text-gray-600 mt-1 text-sm">Sign in to access your reflection</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-navy text-white font-semibold rounded-xl hover:bg-navy-mid transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Contact your administrator if you need access.
        </p>
      </div>
    </div>
  )
}
