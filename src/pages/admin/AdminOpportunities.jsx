import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Upload, Eye, EyeOff } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const CATEGORIES = ['Education', 'Environment', 'Healthcare', 'Food Relief', 'Elderly Care', 'Animal Rescue', 'Disaster Relief', 'Community', 'Other']
const EMPTY_FORM = { title: '', description: '', category: 'Education', organization: '', location: '', duration: '', spots: 1, color: '#3d8b7a', requirements: '', benefits: '', isActive: true, isFeatured: false }

export default function AdminOpportunities() {
  const [opps, setOpps] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => { fetchOpps() }, [])

  const fetchOpps = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/opportunities', { params: { limit: 100 } })
      setOpps(data.opportunities || [])
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setImageFile(null); setImagePreview(''); setModal(true) }

  const openEdit = (opp) => {
    setForm({ title: opp.title, description: opp.description, category: opp.category, organization: opp.organization, location: opp.location, duration: opp.duration, spots: opp.spots, color: opp.color || '#3d8b7a', requirements: (opp.requirements || []).join(', '), benefits: (opp.benefits || []).join(', '), isActive: opp.isActive, isFeatured: opp.isFeatured })
    setImagePreview(opp.image || '')
    setEditId(opp._id)
    setModal(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (imageFile) fd.append('image', imageFile)
      if (editId) {
        await api.put(`/opportunities/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Opportunity updated!')
      } else {
        await api.post('/opportunities', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Opportunity created!')
      }
      setModal(false)
      fetchOpps()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/opportunities/${deleteId}`)
      toast.success('Opportunity deleted')
      setDeleteId(null)
      fetchOpps()
    } catch { toast.error('Delete failed') }
  }

  const toggleActive = async (opp) => {
    try {
      await api.put(`/opportunities/${opp._id}`, { isActive: !opp.isActive })
      fetchOpps()
    } catch { toast.error('Update failed') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-serif">Opportunities</h2>
          <p className="text-gray-500 text-sm">{opps.length} total opportunities</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #3d8b7a, #5a8a4a)' }}>
          <Plus className="h-4 w-4" />Add Opportunity
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : opps.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
          <div className="text-5xl mb-3">🌱</div>
          <h3 className="font-semibold text-gray-700 mb-1">No opportunities yet</h3>
          <button onClick={openCreate} className="mt-4 btn-primary text-sm">Create First Opportunity</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {opps.map(opp => (
            <div key={opp._id} className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-opacity ${opp.isActive ? 'border-gray-100' : 'border-dashed border-gray-300 opacity-60'}`}>
              <div className="h-32 relative overflow-hidden">
                {opp.image ? <img src={opp.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center" style={{ background: `${opp.color}22` }}><span className="text-4xl">🌿</span></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-2 left-3">
                  <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ background: opp.color || '#3d8b7a' }}>{opp.category}</span>
                  {opp.isFeatured && <span className="ml-1 text-xs font-bold text-amber-900 bg-amber-300 px-2 py-0.5 rounded-full">⭐ Featured</span>}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 text-sm line-clamp-1 mb-1">{opp.title}</h4>
                <p className="text-xs text-gray-500 mb-3">{opp.organization} • {opp.spotsRemaining}/{opp.spots} spots</p>
                <div className="flex gap-2">
                  <button onClick={() => toggleActive(opp)} className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${opp.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {opp.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {opp.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button onClick={() => openEdit(opp)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium">
                    <Edit2 className="h-3 w-3" />Edit
                  </button>
                  <button onClick={() => setDeleteId(opp._id)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium ml-auto">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">{editId ? 'Edit Opportunity' : 'New Opportunity'}</h3>
              <button onClick={() => setModal(false)}><X className="h-5 w-5 text-gray-400 hover:text-gray-700" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-teal/30">
                      <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                      <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                        <Upload className="h-6 w-6 text-white" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-teal hover:bg-teal-pale/20 transition-colors">
                      <Upload className="h-6 w-6 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">Click to upload image</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
                  <input required className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-teal" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Opportunity title" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                  <select required className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-teal" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Organization *</label>
                  <input required className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-teal" value={form.organization} onChange={e => setForm(p => ({ ...p, organization: e.target.value }))} placeholder="Organization name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Location *</label>
                  <input required className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-teal" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Dhaka, Bangladesh" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Duration *</label>
                  <input required className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-teal" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. Weekends" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Total Spots *</label>
                  <input required type="number" min="1" className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-teal" value={form.spots} onChange={e => setForm(p => ({ ...p, spots: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} className="w-10 h-10 rounded-xl border-2 border-gray-200 cursor-pointer" />
                    <span className="text-xs text-gray-500">Card accent color</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                <textarea required rows={3} className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-teal resize-none" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the volunteer opportunity..." />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Requirements <span className="font-normal text-gray-400">(comma separated)</span></label>
                <input className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-teal" value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))} placeholder="e.g. 18+, Bangladesh citizen, Basic English" />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="rounded" />
                  <span className="text-sm font-medium text-gray-700">Active (visible to public)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} className="rounded" />
                  <span className="text-sm font-medium text-gray-700">⭐ Featured</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #3d8b7a, #5a8a4a)' }}>
                  {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  {saving ? 'Saving...' : editId ? 'Update' : 'Create Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="font-semibold text-gray-800 mb-2">Delete Opportunity?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone. All related applications will also be affected.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
