import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Filter, MapPin, Clock, Users, X, ChevronRight } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

const CATEGORIES = ['All', 'Education', 'Environment', 'Healthcare', 'Food Relief', 'Elderly Care', 'Animal Rescue', 'Disaster Relief', 'Community', 'Other']

const categoryColors = {
  Education: '#5a8a4a', Environment: '#3d8b7a', Healthcare: '#e74c3c',
  'Food Relief': '#e67e22', 'Elderly Care': '#9b59b6', 'Animal Rescue': '#1abc9c',
  'Disaster Relief': '#c0392b', Community: '#2980b9', Other: '#7f8c8d',
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [applyModal, setApplyModal] = useState(false)
  const [applyForm, setApplyForm] = useState({ motivation: '', experience: '', availability: '' })
  const [applying, setApplying] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const fetchOpportunities = async () => {
    setLoading(true)
    try {
      const params = {}
      if (category !== 'All') params.category = category
      if (search) params.search = search
      const { data } = await api.get('/opportunities', { params })
      setOpportunities(data.opportunities || [])
    } catch {
      toast.error('Failed to load opportunities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOpportunities() }, [category])

  const handleSearch = (e) => { e.preventDefault(); fetchOpportunities() }

  const handleApply = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    setApplying(true)
    try {
      await api.post('/applications', { opportunityId: selected._id, ...applyForm })
      toast.success('Application submitted! The admin will review it soon. 🌿')
      setApplyModal(false)
      setApplyForm({ motivation: '', experience: '', availability: '' })
      fetchOpportunities()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed')
    } finally {
      setApplying(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6" style={{ background: 'linear-gradient(135deg, #2a6357 0%, #3d8b7a 60%, #5a8a4a 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="section-badge bg-white/20 text-white text-xs mb-4">🌿 Make a Difference</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Volunteer Opportunities</h1>
          <p className="text-white/80 text-lg mb-8">Find a cause close to your heart and start making an impact today.</p>
          <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-gray" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search opportunities..." className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-0 bg-white text-charcoal placeholder:text-warm-gray focus:outline-none focus:ring-2 focus:ring-teal-lt text-sm" />
            </div>
            <button type="submit" className="btn-primary px-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)' }}>Search</button>
          </form>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-6 border-b border-earth-lt bg-white sticky top-20 z-30">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${category === cat ? 'text-white shadow-soft' : 'bg-earth-lt/40 text-warm-gray hover:bg-earth-lt'}`}
              style={category === cat ? { background: categoryColors[cat] || '#3d8b7a' } : {}}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Cards */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-earth-lt/40 rounded-3xl animate-pulse" />)}
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="font-serif text-xl text-charcoal mb-2">No opportunities found</h3>
              <p className="text-warm-gray">Try a different category or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map(opp => (
                <div key={opp._id} className="card group cursor-pointer" onClick={() => setSelected(opp)}>
                  <div className="h-48 relative overflow-hidden">
                    {opp.image ? (
                      <img src={opp.image} alt={opp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${opp.color || '#3d8b7a'}22, ${opp.color || '#3d8b7a'}44)` }}>
                        <span className="text-5xl">🌿</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: categoryColors[opp.category] || '#3d8b7a' }}>{opp.category}</span>
                    </div>
                    {opp.isFeatured && <div className="absolute top-3 right-3"><span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-400 text-amber-900">⭐ Featured</span></div>}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-warm-gray font-medium mb-1">{opp.organization}</p>
                    <h3 className="font-serif text-lg font-bold text-charcoal mb-2 line-clamp-2">{opp.title}</h3>
                    <p className="text-sm text-warm-gray mb-4 line-clamp-2">{opp.description}</p>
                    <div className="flex items-center gap-4 text-xs text-warm-gray mb-4">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{opp.location}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{opp.duration}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{opp.spotsRemaining} spots</span>
                    </div>
                    <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: `linear-gradient(135deg, ${opp.color || '#3d8b7a'}, #3d8b7a)` }}>
                      View & Apply →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {selected.image && <img src={selected.image} alt="" className="w-full h-56 object-cover rounded-t-3xl" />}
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full text-white mb-2 inline-block" style={{ background: categoryColors[selected.category] || '#3d8b7a' }}>{selected.category}</span>
                  <h2 className="font-serif text-2xl font-bold text-charcoal">{selected.title}</h2>
                  <p className="text-teal font-medium mt-1">{selected.organization}</p>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-full hover:bg-earth-lt transition-colors"><X className="h-5 w-5 text-warm-gray" /></button>
              </div>

              <p className="text-charcoal/80 mb-6 leading-relaxed">{selected.description}</p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[['📍 Location', selected.location], ['⏱️ Duration', selected.duration], ['👥 Spots Left', selected.spotsRemaining]].map(([label, val]) => (
                  <div key={label} className="bg-teal-pale rounded-2xl p-3 text-center">
                    <p className="text-xs text-warm-gray">{label}</p>
                    <p className="font-semibold text-charcoal text-sm mt-0.5">{val}</p>
                  </div>
                ))}
              </div>

              {selected.requirements?.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-charcoal mb-2">Requirements</h4>
                  <ul className="space-y-1">{selected.requirements.map(r => <li key={r} className="flex items-center gap-2 text-sm text-warm-gray"><ChevronRight className="h-3 w-3 text-teal" />{r}</li>)}</ul>
                </div>
              )}

              {selected.spotsRemaining > 0 ? (
                <button onClick={() => { if (!user) navigate('/login'); else setApplyModal(true) }} className="btn-primary w-full text-center mt-4">
                  {user ? 'Apply Now 🌿' : 'Login to Apply'}
                </button>
              ) : (
                <div className="mt-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-center text-sm text-red-600 font-semibold">All spots filled</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {applyModal && selected && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-bold text-charcoal">Apply for Opportunity</h3>
              <button onClick={() => setApplyModal(false)} className="p-2 rounded-full hover:bg-earth-lt"><X className="h-4 w-4 text-warm-gray" /></button>
            </div>
            <p className="text-sm text-warm-gray mb-6 bg-teal-pale rounded-xl p-3">Applying to: <span className="font-semibold text-teal">{selected.title}</span></p>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">Why do you want to volunteer here? *</label>
                <textarea required rows={3} className="input-field resize-none" placeholder="Tell us your motivation..." value={applyForm.motivation} onChange={e => setApplyForm(p => ({ ...p, motivation: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">Relevant experience (optional)</label>
                <textarea rows={2} className="input-field resize-none" placeholder="Any past volunteer or related experience..." value={applyForm.experience} onChange={e => setApplyForm(p => ({ ...p, experience: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">Your availability *</label>
                <input required className="input-field" placeholder="e.g. Weekends, Mon-Wed evenings..." value={applyForm.availability} onChange={e => setApplyForm(p => ({ ...p, availability: e.target.value }))} />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setApplyModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={applying} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {applying ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
