import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { navItems } from '../../data/content'
import logo from '../../assets/egiyejai-logo.png'

const Logo = () => (
  <img src={logo} alt="EgiyeJai Logo" className="h-11 w-auto object-contain" />
)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`navbar-enter fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-earth-lt/70 bg-cream/90 backdrop-blur-md shadow-[0_8px_24px_rgba(61,139,122,0.12)]'
          : 'border-b border-earth-lt/70 bg-cream'
      }`}
    >
      <nav className="mx-auto flex h-20 w-full max-w-[1200px] items-center justify-between px-6">
        <Logo />

        <div className="hidden items-center gap-7 xl:flex">
          {navItems.map((item) => (
            <button key={item} className="nav-link">
              {item}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <button className="auth-button">Login</button>
          <button className="auth-button">Sign Up</button>
        </div>

        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-earth bg-white text-teal-dk xl:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-earth-lt bg-cream px-6 pb-4 pt-2 xl:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium tracking-[0.01em] text-charcoal transition hover:bg-earth-lt/40"
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="auth-button w-full">Login</button>
            <button className="auth-button w-full">Sign Up</button>
          </div>
        </div>
      )}
    </header>
  )
}
