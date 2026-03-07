import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Briefcase, ClipboardList, MessageSquare, Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import api from '../../utils/api'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const COLORS = ['#3d8b7a', '#5a8a4a', '#7fc4b5', '#c8a97e', '#e67e22', '#9b59b6', '#1abc9c', '#e74c3c']

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard').then(res => { setData(res.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-teal/30 border-t-teal rounded-full animate-spin" /></div>
  if (!data) return <p className="text-red-500">Failed to load dashboard data.</p>

  const { stats, recentUsers, recentApps, monthlySignups, categoryStats } = data

  const chartData = monthlySignups.map(m => ({
    name: MONTH_NAMES[m._id.month - 1],
    volunteers: m.count,
  }))

  const pieData = (categoryStats || []).slice(0, 8).map(c => ({ name: c._id, value: c.count }))

  const statCards = [
    { label: 'Total Volunteers', value: stats.totalVolunteers, icon: <Users className="h-6 w-6" />, color: '#3d8b7a', bg: '#e8f5f2', link: '/admin/users' },
    { label: 'Active Opportunities', value: stats.totalOpportunities, icon: <Briefcase className="h-6 w-6" />, color: '#5a8a4a', bg: '#d4e8cc', link: '/admin/opportunities' },
    { label: 'Total Applications', value: stats.totalApplications, icon: <ClipboardList className="h-6 w-6" />, color: '#c8a97e', bg: '#f5ede0', link: '/admin/applications' },
    { label: 'Pending Review', value: stats.pendingApplications, icon: <AlertCircle className="h-6 w-6" />, color: '#f59e0b', bg: '#fef3c7', link: '/admin/applications' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: <MessageSquare className="h-6 w-6" />, color: '#e74c3c', bg: '#fee2e2', link: '/admin/messages' },
    { label: 'Volunteer Hours', value: stats.totalHours, icon: <Clock className="h-6 w-6" />, color: '#9b59b6', bg: '#f5eeff', link: '/admin/applications' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 font-serif">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening with EgiyeJai.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map(({ label, value, icon, color, bg, link }) => (
          <Link key={label} to={link} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: bg, color }}>
              {icon}
            </div>
            <div className="text-2xl font-bold text-gray-800 font-serif">{value?.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">New Volunteers (Last 6 Months)</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="volunteers" fill="#3d8b7a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-12">No data yet</p>}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Opportunities by Category</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-12">No data yet</p>}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recent Volunteers</h3>
            <Link to="/admin/users" className="text-xs text-teal font-semibold hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {(recentUsers || []).map(u => (
              <div key={u._id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-pale flex items-center justify-center text-teal font-bold text-sm flex-shrink-0">
                  {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover rounded-full" /> : u.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                <span className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
            {!recentUsers?.length && <p className="text-gray-400 text-sm">No volunteers yet</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recent Applications</h3>
            <Link to="/admin/applications" className="text-xs text-teal font-semibold hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {(recentApps || []).map(a => (
              <div key={a._id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm flex-shrink-0">
                  {a.user?.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{a.user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{a.opportunity?.title}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${a.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : a.status === 'approved' ? 'bg-green-100 text-green-700' : a.status === 'completed' ? 'bg-teal-pale text-teal' : 'bg-red-100 text-red-600'}`}>
                  {a.status}
                </span>
              </div>
            ))}
            {!recentApps?.length && <p className="text-gray-400 text-sm">No applications yet</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
