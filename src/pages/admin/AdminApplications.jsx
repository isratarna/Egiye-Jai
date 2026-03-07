import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, Star, ChevronDown, ChevronUp } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const STATUS_TABS = ['all', 'pending', 'approved', 'rejected', 'completed']
const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#f59e0b', bg: '#fef3c7' },
  approved:  { label: 'Approved',  color: '#10b981', bg: '#d1fae5' },
  rejected:  { label: 'Rejected',  color: '#ef4444', bg: '#fee2e2' },
  completed: { label: 'Completed', color: '#3d8b7a', bg: '#e8f5f2' },
}

export default function AdminApplications() {
  const [apps, setApps] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [reviewModal, setReviewModal] = useState(null)
  const [reviewForm, setReviewForm] = useState({ status: '', adminNote: '', hoursLogged: 0 })
  const [reviewing, setReviewing] = useState(false)

  useEffect(() => { fetchApps() }, [statusFilter])

  const fetchApps = async () => {
    setLoading(true)
    try {
      const params = { limit: 50 }
      if (statusFilter !== 'all') params.status = statusFilter
      const { data } = await api.get('/admin/applications', { params })
      setApps(data.applications || [])
      setTotal(data.total || 0)
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  const openReview = (app, newStatus) => {
    setReviewModal(app)
    setReviewForm({ status: newStatus, adminNote: app.adminNote || '', hoursLogged: app.hoursLogged || 0 })
  }

  const handleReview = async (e) => {
    e.preventDefault()
    setReviewing(true)
    try {
      await api.patch(`/applications/${reviewModal._id}/status`, reviewForm)
      toast.success(`Application ${reviewForm.status}!`)
      setReviewModal(null)
      fetchApps()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    } finally {
      setReviewing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 font-serif">Applications</h2>
        <p className="text-gray-500 text-sm">{total} total applications</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {STATUS_TABS.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${statusFilter === s ? 'text-white' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}
            style={statusFilter === s ? { background: 'linear-gradient(135deg, #3d8b7a, #5a8a4a)' } : {}}>
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-teal/30 border-t-teal rounded-full animate-spin mx-auto" /></div>
        ) : apps.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No applications found</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {apps.map(app => {
              const cfg = STATUS_CONFIG[app.status]
              const isExpanded = expanded === app._id
              return (
                <div key={app._id} className="p-5">
                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Volunteer */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-teal-pale flex items-center justify-center text-teal font-bold text-sm flex-shrink-0">
                        {app.user?.avatar ? <img src={app.user.avatar} alt="" className="w-full h-full object-cover rounded-full" /> : app.user?.name?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm">{app.user?.name}</p>
                        <p className="text-xs text-gray-400">{app.user?.email}</p>
                      </div>
                    </div>

                    {/* Opportunity */}
                    <div className="flex-1 min-w-[150px]">
                      <p className="text-sm font-medium text-gray-700 line-clamp-1">{app.opportunity?.title}</p>
                      <p className="text-xs text-gray-400">{app.opportunity?.category} • {app.opportunity?.organization}</p>
                    </div>

                    {/* Date */}
                    <p className="text-xs text-gray-400 hidden sm:block">{new Date(app.appliedAt).toLocaleDateString()}</p>

                    {/* Status */}
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0" style={{ color: cfg?.color, background: cfg?.bg }}>{cfg?.label}</span>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      {app.status === 'pending' && (
                        <>
                          <button onClick={() => openReview(app, 'approved')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200">
                            <CheckCircle className="h-3.5 w-3.5" />Approve
                          </button>
                          <button onClick={() => openReview(app, 'rejected')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-xs font-semibold hover:bg-red-200">
                            <XCircle className="h-3.5 w-3.5" />Reject
                          </button>
                        </>
                      )}
                      {app.status === 'approved' && (
                        <button onClick={() => openReview(app, 'completed')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-pale text-teal text-xs font-semibold hover:bg-teal/20">
                          <Star className="h-3.5 w-3.5" />Mark Complete
                        </button>
                      )}
                      <button onClick={() => setExpanded(isExpanded ? null : app._id)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl text-sm space-y-2">
                      <div><span className="font-semibold text-gray-600">Motivation: </span><span className="text-gray-700">{app.motivation}</span></div>
                      {app.experience && <div><span className="font-semibold text-gray-600">Experience: </span><span className="text-gray-700">{app.experience}</span></div>}
                      <div><span className="font-semibold text-gray-600">Availability: </span><span className="text-gray-700">{app.availability}</span></div>
                      {app.adminNote && <div><span className="font-semibold text-gray-600">Admin Note: </span><span className="text-gray-700">{app.adminNote}</span></div>}
                      {app.status === 'completed' && app.hoursLogged > 0 && <div><span className="font-semibold text-teal">⏱️ Hours Logged: {app.hoursLogged}</span></div>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-semibold text-gray-800 mb-1">
              {reviewForm.status === 'approved' ? '✅ Approve Application' : reviewForm.status === 'rejected' ? '❌ Reject Application' : '⭐ Mark as Completed'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">For: <span className="font-medium text-gray-700">{reviewModal.opportunity?.title}</span></p>
            <form onSubmit={handleReview} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Note to volunteer (optional)</label>
                <textarea rows={3} className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-teal resize-none" placeholder="Add a note..." value={reviewForm.adminNote} onChange={e => setReviewForm(p => ({ ...p, adminNote: e.target.value }))} />
              </div>
              {reviewForm.status === 'completed' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Hours Volunteered</label>
                  <input type="number" min="0" className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-teal" value={reviewForm.hoursLogged} onChange={e => setReviewForm(p => ({ ...p, hoursLogged: Number(e.target.value) }))} />
                </div>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setReviewModal(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={reviewing} className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 ${reviewForm.status === 'rejected' ? 'bg-red-500 hover:bg-red-600' : ''}`}
                  style={reviewForm.status !== 'rejected' ? { background: 'linear-gradient(135deg, #3d8b7a, #5a8a4a)' } : {}}>
                  {reviewing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  {reviewing ? 'Submitting...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
