import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Leaf, ArrowLeft, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', location: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const data = await signup(form.name, form.email, form.password, form.phone, form.location)
      toast.success(`Welcome to EgiyeJai, ${data.user.name.split(' ')[0]}! 🌿`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const perks = ['Instant access to all volunteer opportunities', 'Personal impact dashboard & badges', 'Track your volunteer hours & history', 'Join 5,400+ changemakers across Bangladesh']

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left decorative */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #5a8a4a 0%, #3d8b7a 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white/20" style={{ width: Math.random() * 100 + 30, height: Math.random() * 100 + 30, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, transform: 'translate(-50%,-50%)' }} />
          ))}
        </div>
        <div className="relative z-10 flex flex-col justify-center px-10 text-white">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🌿</div>
            <span className="font-serif text-2xl font-bold">EgiyeJai</span>
          </div>
          <h2 className="font-serif text-3xl font-bold mb-4">Start your journey of impact</h2>
          <p className="text-white/75 mb-8 leading-relaxed">Every volunteer who joins brings us closer to a better Bangladesh.</p>
          <div className="space-y-3">
            {perks.map(p => (
              <div key={p} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-200 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/85">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 lg:px-14 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-warm-gray hover:text-teal transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <div className="flex items-center gap-2 mb-2 lg:hidden">
            <Leaf className="h-6 w-6 text-teal" />
            <span className="font-serif text-xl font-bold text-charcoal">EgiyeJai</span>
          </div>

          <h1 className="font-serif text-3xl font-bold text-charcoal mb-1">Create your account</h1>
          <p className="text-warm-gray mb-6">Already a volunteer? <Link to="/login" className="text-teal font-semibold hover:underline">Sign in</Link></p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-charcoal mb-1.5">Full Name *</label>
                <input type="text" required className="input-field" placeholder="Your full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-charcoal mb-1.5">Email Address *</label>
                <input type="email" required className="input-field" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">Phone</label>
                <input type="tel" className="input-field" placeholder="+880 ..." value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">Location</label>
                <input type="text" className="input-field" placeholder="Dhaka, BD" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">Password *</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} required className="input-field pr-10" placeholder="Min. 6 chars" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                  <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray hover:text-teal">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">Confirm Password *</label>
                <input type="password" required className="input-field" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} />
              </div>
            </div>

            <div className="bg-green-lt/40 rounded-xl p-3 flex items-start gap-2">
              <Leaf className="h-4 w-4 text-green mt-0.5 flex-shrink-0" />
              <p className="text-xs text-green-dk">By signing up, you automatically become a volunteer and gain access to all opportunities on the platform.</p>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              {loading ? 'Creating account...' : 'Create Free Account 🌿'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
