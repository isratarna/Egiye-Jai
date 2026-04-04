import { useState, useEffect } from 'react'
import { Search, UserX, UserCheck, Trash2, Filter } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [manageUser, setManageUser] = useState(null)
  const [manageForm, setManageForm] = useState({ totalHours: 0, badgeName: '', badgeIcon: '' })
  
  const EMOJI_PRESETS = ['⭐', '🏆', '🏅', '🎖️', '🦸', '🌿', '🌍']

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async (q = '') => {
    setLoading(true)
    try {
      const { data } = await api.get('/admin/users', { params: { search: q, role: 'volunteer', limit: 50 } })
      setUsers(data.users || [])
      setTotal(data.total || 0)
    } catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }

  const handleSearch = (e) => { e.preventDefault(); fetchUsers(search) }

  const toggleStatus = async (id) => {
    try {
      const { data } = await api.patch(`/admin/users/${id}/toggle`)
      setUsers(us => us.map(u => u._id === id ? data.user : u))
      toast.success(data.user.isActive ? 'User activated' : 'User suspended')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/users/${deleteId}`)
      toast.success('User deleted')
      setDeleteId(null)
      fetchUsers(search)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  const handleManageSave = async (e) => {
    e.preventDefault()
    try {
      const payload = { 
        totalHours: Number(manageForm.totalHours)
      }
      if (manageForm.badgeName && manageForm.badgeIcon) {
        payload.badgeName = manageForm.badgeName;
        payload.badgeIcon = manageForm.badgeIcon;
      }
      
      const { data } = await api.patch(`/admin/users/${manageUser._id}/manage`, payload)
      toast.success('User updated successfully')
      setUsers(us => us.map(u => u._id === manageUser._id ? data.user : u))
      setManageUser(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    }
  }

  const openManageModal = (u) => {
    setManageUser(u)
    setManageForm({ 
      totalHours: u.totalHours || 0, 
      badgeName: '', 
      badgeIcon: '' 
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-serif">Volunteers</h2>
          <p className="text-gray-500 text-sm">{total} registered volunteers</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-teal" />
            </div>
            <button type="submit" className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #3d8b7a, #5a8a4a)' }}>Search</button>
            <button type="button" onClick={() => { setSearch(''); fetchUsers('') }} className="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Clear</button>
          </form>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-teal/30 border-t-teal rounded-full animate-spin mx-auto" /></div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No volunteers found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Volunteer', 'Location', 'Hours', 'Badges', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal-pale flex items-center justify-center text-teal font-bold text-sm flex-shrink-0">
                          {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover rounded-full" /> : u.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{u.location || '—'}</td>
                    <td className="px-4 py-3 text-gray-700 font-semibold">{u.totalHours || 0}h</td>
                    <td className="px-4 py-3 text-gray-700">{u.badges?.length || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openManageModal(u)} title="Manage details" className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                          <Filter className="h-4 w-4" />
                        </button>
                        <button onClick={() => toggleStatus(u._id)} title={u.isActive ? 'Suspend' : 'Activate'} className={`p-1.5 rounded-lg transition-colors ${u.isActive ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}>
                          {u.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                        <button onClick={() => setDeleteId(u._id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="font-semibold text-gray-800 mb-2">Delete this volunteer?</h3>
            <p className="text-sm text-gray-500 mb-5">All their applications will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage User Modal */}
      {manageUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-serif font-bold text-lg mb-4 text-gray-800">Manage {manageUser.name}</h3>
            <form onSubmit={handleManageSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Total Hours</label>
                <input type="number" min="0" value={manageForm.totalHours} onChange={e => setManageForm(prev => ({ ...prev, totalHours: e.target.value }))} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-teal" />
              </div>
              <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase">Award New Badge</p>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Badge Icon (Emoji)</label>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {EMOJI_PRESETS.map(emoji => (
                      <button type="button" key={emoji} onClick={() => setManageForm(prev => ({ ...prev, badgeIcon: emoji }))} className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-colors ${manageForm.badgeIcon === emoji ? 'bg-teal/20 border border-teal' : 'bg-white border border-gray-200 hover:bg-gray-100'}`}>
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <input type="text" placeholder="Or type a custom emoji here" maxLength={2} value={manageForm.badgeIcon} onChange={e => setManageForm(prev => ({ ...prev, badgeIcon: e.target.value }))} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-teal text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Badge Name</label>
                  <input type="text" placeholder="e.g. Rising Star" value={manageForm.badgeName} onChange={e => setManageForm(prev => ({ ...prev, badgeName: e.target.value }))} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-teal text-sm" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setManageUser(null)} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dk">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
