import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Leaf, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login(form.email, form.password)
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}! 🌿`)
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2a6357 0%, #3d8b7a 50%, #5a8a4a 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute rounded-full" style={{
              width: Math.random() * 120 + 20,
              height: Math.random() * 120 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: 'rgba(255,255,255,0.15)',
              transform: 'translate(-50%,-50%)'
            }} />
          ))}
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🌿</div>
            <span className="font-serif text-3xl font-bold">EgiyeJai</span>
          </div>
          <h2 className="font-serif text-4xl font-bold mb-4 leading-tight">Welcome<br />back, friend.</h2>
          <p className="text-white/75 text-lg leading-relaxed mb-10">
            The world needs more compassionate people like you. Log in to continue making a difference.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[['5,400+', 'Volunteers'], ['70+', 'Programs'], ['32,000+', 'Lives Impacted']].map(([val, label]) => (
              <div key={label} className="bg-white/15 rounded-2xl p-4 text-center">
                <div className="font-serif text-2xl font-bold">{val}</div>
                <div className="text-xs text-white/70 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-warm-gray hover:text-teal transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <div className="flex items-center gap-2 mb-2 lg:hidden">
            <Leaf className="h-6 w-6 text-teal" />
            <span className="font-serif text-2xl font-bold text-charcoal">EgiyeJai</span>
          </div>

          <h1 className="font-serif text-3xl font-bold text-charcoal mb-2">Sign in to your account</h1>
          <p className="text-warm-gray mb-8">Don't have an account? <Link to="/signup" className="text-teal font-semibold hover:underline">Create one free</Link></p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Email Address</label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pr-12"
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray hover:text-teal transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-teal-pale rounded-2xl border border-teal/20">
            <p className="text-xs text-teal font-semibold mb-1">🛡️ Admin credentials (for demo)</p>
            <p className="text-xs text-warm-gray">Email: admin@egiyejai.org</p>
            <p className="text-xs text-warm-gray">Password: Admin@EgiyeJai2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}
