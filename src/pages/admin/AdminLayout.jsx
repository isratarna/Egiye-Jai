import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Briefcase, Users, ClipboardList, MessageSquare, Menu, X, LogOut, Shield, Leaf, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, exact: true },
  { to: '/admin/opportunities', label: 'Opportunities', icon: <Briefcase className="h-5 w-5" /> },
  { to: '/admin/users', label: 'Volunteers', icon: <Users className="h-5 w-5" /> },
  { to: '/admin/applications', label: 'Applications', icon: <ClipboardList className="h-5 w-5" /> },
  { to: '/admin/messages', label: 'Messages', icon: <MessageSquare className="h-5 w-5" /> },
  { to: '/problems', label: 'Manage Problems', icon: <AlertTriangle className="h-5 w-5" /> },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname.startsWith(to)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-charcoal-deep text-white flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block`}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3d8b7a, #5a8a4a)' }}>
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-serif font-bold text-white">EgiyeJai</span>
            <p className="text-xs text-white/40">Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/60 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Admin badge */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 flex items-center justify-center">
              {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-xl" /> : <Shield className="h-4 w-4 text-purple-300" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-white/40 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon, exact }) => (
            <Link key={to} to={to} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(to, exact) ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
              style={isActive(to, exact) ? { background: 'linear-gradient(135deg, rgba(61,139,122,0.3), rgba(90,138,74,0.3))', borderLeft: '3px solid #3d8b7a' } : {}}>
              {icon}{label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <Link to="/" className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors mb-2 px-2">
            ← View Public Site
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
            <LogOut className="h-4 w-4" />Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-800">
            <Menu className="h-6 w-6" />
          </button>
          <div>
            <h1 className="font-semibold text-gray-800 text-sm">{navItems.find(n => isActive(n.to, n.exact))?.label || 'Admin'}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-400">Admin</span>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
