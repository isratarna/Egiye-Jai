import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LayoutDashboard, Shield, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/egiyejai-logo.png'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Volunteer Opportunities', to: '/opportunities' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false); setDropdownOpen(false) }, [location.pathname])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <header className={`navbar-enter fixed left-0 top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'border-b border-earth-lt/70 bg-cream/90 backdrop-blur-md shadow-[0_8px_24px_rgba(61,139,122,0.12)]' : 'border-b border-earth-lt/70 bg-cream'}`}>
      <nav className="mx-auto flex h-20 w-full max-w-[1200px] items-center justify-between px-6">
        <Link to="/"><img src={logo} alt="EgiyeJai" className="h-11 w-auto object-contain" /></Link>

        <div className="hidden items-center gap-7 xl:flex">
          {navLinks.map(({ label, to }) => (
            <Link key={to} to={to} className={`nav-link ${location.pathname === to ? 'text-teal font-semibold' : ''}`}>{label}</Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          {user ? (
            <div className="relative">
              <button onClick={() => setDropdownOpen(p => !p)} className="flex items-center gap-2 rounded-full border border-teal/30 bg-teal/5 px-4 py-2 text-sm font-semibold text-teal transition-all hover:bg-teal/10">
                {user.avatar ? <img src={user.avatar} alt="" className="h-7 w-7 rounded-full object-cover" /> : <div className="h-7 w-7 rounded-full bg-teal flex items-center justify-center text-white text-xs font-bold">{user.name?.charAt(0).toUpperCase()}</div>}
                <span>{user.name?.split(' ')[0]}</span>
                <span className="text-xs opacity-60">▾</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-earth-lt bg-white shadow-lg-soft overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-earth-lt/50">
                    <p className="text-xs text-warm-gray">Signed in as</p>
                    <p className="text-sm font-semibold text-charcoal truncate">{user.email}</p>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-teal-pale text-teal'}`}>
                      {user.role === 'admin' ? '🛡️ Admin' : '🌿 Volunteer'}
                    </span>
                  </div>
                  {user.role === 'admin' ? (
                    <Link to="/admin" className="flex items-center gap-2 px-4 py-3 text-sm text-charcoal hover:bg-earth-lt/40 transition-colors"><Shield className="h-4 w-4 text-purple-600" />Admin Panel</Link>
                  ) : (
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm text-charcoal hover:bg-earth-lt/40 transition-colors"><LayoutDashboard className="h-4 w-4 text-teal" />My Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-earth-lt/50">
                    <LogOut className="h-4 w-4" />Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="auth-button">Login</Link>
              <Link to="/signup" className="auth-button" style={{ background: 'linear-gradient(135deg,#5a8a4a,#3d8b7a)' }}>Sign Up</Link>
            </>
          )}
        </div>

        <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-earth bg-white text-teal-dk xl:hidden" onClick={() => setMobileOpen(p => !p)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-earth-lt bg-cream px-6 pb-4 pt-2 xl:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map(({ label, to }) => (
              <Link key={to} to={to} className="rounded-lg px-3 py-2 text-sm font-medium text-charcoal hover:bg-earth-lt/40 transition-colors">{label}</Link>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="auth-button text-center text-sm">{user.role === 'admin' ? 'Admin' : 'Dashboard'}</Link>
                <button onClick={handleLogout} className="auth-button text-sm" style={{ background: '#dc2626', borderColor: '#dc2626' }}>Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-button text-center">Login</Link>
                <Link to="/signup" className="auth-button text-center" style={{ background: 'linear-gradient(135deg,#5a8a4a,#3d8b7a)' }}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
