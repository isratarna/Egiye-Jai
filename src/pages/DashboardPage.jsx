import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Clock, CheckCircle, XCircle, AlertCircle, Trophy, Star, Leaf, Upload, Camera, Edit2, Save, X, LogOut } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#f59e0b', bg: '#fef3c7', icon: <AlertCircle className="h-4 w-4" /> },
  approved:  { label: 'Approved',  color: '#10b981', bg: '#d1fae5', icon: <CheckCircle className="h-4 w-4" /> },
  rejected:  { label: 'Rejected',  color: '#ef4444', bg: '#fee2e2', icon: <XCircle className="h-4 w-4" /> },
  completed: { label: 'Completed', color: '#3d8b7a', bg: '#e8f5f2', icon: <Star className="h-4 w-4" /> },
}

const TABS = ['Overview', 'My Applications', 'Badges', 'Settings']

export default function DashboardPage() {
  const { user, logout, refreshUser } = useAuth()
  const [tab, setTab] = useState('Overview')
  const [profile, setProfile] = useState(null)
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  // Edit / Avatar States
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/users/profile')
      setProfile(data.user)
      setApplications(data.applications || [])
      setStats(data.stats || {})
      setEditForm({
        name: data.user.name,
        phone: data.user.phone,
        location: data.user.location,
        bio: data.user.bio,
        skills: data.user.skills?.join(', ') || '',
        interests: data.user.interests?.join(', ') || '',
      })
    } catch {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/users/profile', {
        ...editForm,
        skills: editForm.skills ? editForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        interests: editForm.interests ? editForm.interests.split(',').map(s => s.trim()).filter(Boolean) : [],
      })
      await fetchProfile()
      await refreshUser()
      setEditMode(false)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('avatar', file)
    setAvatarUploading(true)
    try {
      await api.post('/users/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      await fetchProfile()
      await refreshUser()
      toast.success('Profile photo updated!')
    } catch {
      toast.error('Avatar upload failed')
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/') }

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center"><div className="w-12 h-12 border-4 border-teal/30 border-t-teal rounded-full animate-spin mx-auto mb-4" /><p className="text-warm-gray">Loading your dashboard...</p></div>
    </div>
  )

  const joinedDate = new Date(profile?.joinedAt || profile?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Profile Header */}
      <section className="pt-24 pb-0 px-6" style={{ background: 'linear-gradient(135deg, #2a6357 0%, #3d8b7a 60%, #5a8a4a 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 pb-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white/30 shadow-lg bg-teal-dk flex items-center justify-center">
                {profile?.avatar ? <img src={profile.avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-4xl font-bold text-white">{profile?.name?.charAt(0)}</span>}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-6 w-6 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
              {avatarUploading && <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl"><div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /></div>}
            </div>

            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">🌿 Volunteer</span>
                <span className="text-xs text-white/60">Joined {joinedDate}</span>
              </div>
              <h1 className="font-serif text-3xl font-bold">{profile?.name}</h1>
              <p className="text-white/75">{profile?.email} {profile?.location && `• ${profile.location}`}</p>
              {profile?.bio && <p className="text-white/60 text-sm mt-1 max-w-lg">{profile.bio}</p>}
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Completed', value: stats.completed || 0, icon: '🏅' },
                { label: 'Hours', value: profile?.totalHours || 0, icon: '⏱️' },
                { label: 'Badges', value: profile?.badges?.length || 0, icon: '🏆' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="bg-white/15 backdrop-blur rounded-2xl p-3 text-center text-white min-w-[70px]">
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="font-bold text-xl">{value}</div>
                  <div className="text-xs text-white/70">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white/10 rounded-2xl p-1 w-fit">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t ? 'bg-white text-teal' : 'text-white/70 hover:text-white'}`}>{t}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Overview Tab */}
          {tab === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Stats cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Applied', value: stats.totalApplications || 0, color: '#3d8b7a', bg: '#e8f5f2' },
                    { label: 'Pending', value: stats.pending || 0, color: '#f59e0b', bg: '#fef3c7' },
                    { label: 'Approved', value: stats.approved || 0, color: '#10b981', bg: '#d1fae5' },
                    { label: 'Completed', value: stats.completed || 0, color: '#3d8b7a', bg: '#e8f5f2' },
                  ].map(({ label, value, color, bg }) => (
                    <div key={label} className="bg-white rounded-2xl p-5 shadow-soft border border-earth-lt/50 text-center">
                      <div className="text-3xl font-bold font-serif" style={{ color }}>{value}</div>
                      <div className="text-xs text-warm-gray mt-1">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent Applications */}
                <div className="bg-white rounded-3xl p-6 shadow-soft border border-earth-lt/50">
                  <h3 className="font-serif text-lg font-bold text-charcoal mb-4">Recent Applications</h3>
                  {applications.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🌱</div>
                      <p className="text-warm-gray text-sm">No applications yet. <Link to="/opportunities" className="text-teal font-semibold">Explore opportunities</Link></p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {applications.slice(0, 4).map(app => {
                        const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending
                        return (
                          <div key={app._id} className="flex items-center gap-4 p-4 rounded-2xl border border-earth-lt/50 hover:bg-earth-lt/20 transition-colors">
                            {app.opportunity?.image ? <img src={app.opportunity.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" /> : <div className="w-12 h-12 rounded-xl bg-teal-pale flex items-center justify-center flex-shrink-0 text-xl">🌿</div>}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-charcoal text-sm truncate">{app.opportunity?.title}</p>
                              <p className="text-xs text-warm-gray">{app.opportunity?.organization} • {app.opportunity?.category}</p>
                            </div>
                            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0" style={{ color: cfg.color, background: cfg.bg }}>
                              {cfg.icon}{cfg.label}
                            </span>
                          </div>
                        )
                      })}
                      {applications.length > 4 && <button onClick={() => setTab('My Applications')} className="text-sm text-teal font-semibold hover:underline">View all {applications.length} applications →</button>}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                {/* Quick actions */}
                <div className="bg-white rounded-3xl p-6 shadow-soft border border-earth-lt/50">
                  <h3 className="font-serif text-base font-bold text-charcoal mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Link to="/opportunities" className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-pale transition-colors text-sm font-medium text-charcoal"><Leaf className="h-4 w-4 text-teal" />Browse Opportunities</Link>
                    <button onClick={() => setTab('Settings')} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-teal-pale transition-colors text-sm font-medium text-charcoal text-left"><Edit2 className="h-4 w-4 text-teal" />Edit Profile</button>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium text-red-600 text-left"><LogOut className="h-4 w-4" />Sign Out</button>
                  </div>
                </div>

                {/* Badges Preview */}
                {profile?.badges?.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 shadow-soft border border-earth-lt/50">
                    <h3 className="font-serif text-base font-bold text-charcoal mb-3">Your Badges</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.badges.map(b => (
                        <span key={b.name} title={b.name} className="flex items-center gap-1.5 bg-teal-pale rounded-full px-3 py-1.5 text-xs font-semibold text-teal">
                          {b.icon} {b.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Impact */}
                <div className="rounded-3xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #2a6357, #5a8a4a)' }}>
                  <h3 className="font-serif text-base font-bold mb-1">Your Impact</h3>
                  <p className="text-white/70 text-xs mb-4">You're making Bangladesh a better place.</p>
                  <div className="text-3xl font-bold font-serif">{stats.totalHours || 0}h</div>
                  <p className="text-white/70 text-xs">Total volunteer hours</p>
                </div>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {tab === 'My Applications' && (
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-earth-lt/50">
              <h3 className="font-serif text-xl font-bold text-charcoal mb-6">All Applications</h3>
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">📋</div>
                  <h4 className="font-serif text-lg text-charcoal mb-2">No applications yet</h4>
                  <p className="text-warm-gray mb-4">Start making a difference by applying to a volunteer opportunity</p>
                  <Link to="/opportunities" className="btn-primary">Browse Opportunities</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map(app => {
                    const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending
                    return (
                      <div key={app._id} className="rounded-2xl border border-earth-lt p-5 hover:shadow-soft transition-shadow">
                        <div className="flex items-start gap-4">
                          {app.opportunity?.image ? <img src={app.opportunity.image} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" /> : <div className="w-16 h-16 rounded-xl bg-teal-pale flex items-center justify-center text-2xl flex-shrink-0">🌿</div>}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <div>
                                <h4 className="font-semibold text-charcoal">{app.opportunity?.title}</h4>
                                <p className="text-sm text-warm-gray">{app.opportunity?.organization} • {app.opportunity?.category}</p>
                                <p className="text-xs text-warm-gray mt-1">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                              </div>
                              <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ color: cfg.color, background: cfg.bg }}>
                                {cfg.icon}{cfg.label}
                              </span>
                            </div>
                            {app.adminNote && <div className="mt-3 p-3 bg-earth-lt/30 rounded-xl text-xs text-charcoal"><span className="font-semibold">Admin note: </span>{app.adminNote}</div>}
                            {app.status === 'completed' && app.hoursLogged > 0 && <p className="text-xs text-teal font-semibold mt-2">⏱️ {app.hoursLogged} hours logged</p>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Badges Tab */}
          {tab === 'Badges' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-soft border border-earth-lt/50">
                <h3 className="font-serif text-xl font-bold text-charcoal mb-6">Your Earned Badges</h3>
                {(profile?.badges || []).length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-5xl mb-3">🎯</div>
                    <p className="text-warm-gray text-sm">Complete volunteer opportunities to earn badges!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {profile.badges.map(b => (
                      <div key={b.name} className="rounded-2xl border border-teal/20 p-4 text-center bg-teal-pale">
                        <div className="text-3xl mb-2">{b.icon}</div>
                        <p className="font-semibold text-charcoal text-sm">{b.name}</p>
                        <p className="text-xs text-warm-gray mt-1">{new Date(b.earnedAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-soft border border-earth-lt/50">
                <h3 className="font-serif text-xl font-bold text-charcoal mb-6">All Badges to Unlock</h3>
                <div className="space-y-3">
                  {[
                    { name: 'First Step', icon: '🌱', desc: 'Complete 1 volunteer opportunity', req: 1 },
                    { name: 'Rising Star', icon: '⭐', desc: 'Complete 3 opportunities', req: 3 },
                    { name: 'Dedicated Volunteer', icon: '🏅', desc: 'Complete 5 opportunities', req: 5 },
                    { name: 'Community Champion', icon: '🏆', desc: 'Complete 10 opportunities', req: 10 },
                    { name: 'Legend', icon: '🌟', desc: 'Complete 20 opportunities', req: 20 },
                  ].map(b => {
                    const earned = profile?.badges?.some(ub => ub.name === b.name)
                    return (
                      <div key={b.name} className={`flex items-center gap-3 p-3 rounded-xl border ${earned ? 'border-teal/30 bg-teal-pale' : 'border-earth-lt bg-earth-lt/20'}`}>
                        <span className={`text-2xl ${!earned ? 'grayscale opacity-40' : ''}`}>{b.icon}</span>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${earned ? 'text-teal' : 'text-warm-gray'}`}>{b.name}</p>
                          <p className="text-xs text-warm-gray">{b.desc}</p>
                        </div>
                        {earned && <CheckCircle className="h-5 w-5 text-teal flex-shrink-0" />}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {tab === 'Settings' && (
            <div className="max-w-2xl">
              <div className="bg-white rounded-3xl p-8 shadow-soft border border-earth-lt/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl font-bold text-charcoal">Edit Profile</h3>
                  {!editMode ? (
                    <button onClick={() => setEditMode(true)} className="flex items-center gap-2 btn-outline text-sm px-4 py-2"><Edit2 className="h-4 w-4" />Edit</button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setEditMode(false)} className="flex items-center gap-1 text-sm px-4 py-2 rounded-full border border-earth-lt text-warm-gray hover:bg-earth-lt/40"><X className="h-4 w-4" />Cancel</button>
                      <button onClick={handleSave} disabled={saving} className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
                        {saving ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="h-4 w-4" />}
                        Save
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  {[
                    { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name' },
                    { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+880 ...' },
                    { label: 'Location', key: 'location', type: 'text', placeholder: 'Dhaka, Bangladesh' },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-charcoal mb-1.5">{label}</label>
                      <input type={type} disabled={!editMode} className={`input-field ${!editMode ? 'opacity-60 cursor-not-allowed' : ''}`} placeholder={placeholder} value={editForm[key] || ''} onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">Bio</label>
                    <textarea disabled={!editMode} rows={3} className={`input-field resize-none ${!editMode ? 'opacity-60 cursor-not-allowed' : ''}`} placeholder="Tell others about yourself..." value={editForm.bio || ''} onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">Skills <span className="text-warm-gray font-normal">(comma separated)</span></label>
                    <input disabled={!editMode} className={`input-field ${!editMode ? 'opacity-60 cursor-not-allowed' : ''}`} placeholder="Teaching, First Aid, Cooking..." value={editForm.skills || ''} onChange={e => setEditForm(p => ({ ...p, skills: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">Interests <span className="text-warm-gray font-normal">(comma separated)</span></label>
                    <input disabled={!editMode} className={`input-field ${!editMode ? 'opacity-60 cursor-not-allowed' : ''}`} placeholder="Environment, Education, Healthcare..." value={editForm.interests || ''} onChange={e => setEditForm(p => ({ ...p, interests: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
