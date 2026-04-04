import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Loader2,
  Search,
  RefreshCw,
} from 'lucide-react'
import { useParallax } from '../hooks/useParallax'
import api from '../utils/api'

// Category → accent colour mapping (mirrors admin panel)
const CATEGORY_COLORS = {
  Education:       '#5a8a4a',
  Environment:     '#3d8b7a',
  Healthcare:      '#e74c3c',
  'Food Relief':   '#e67e22',
  'Elderly Care':  '#9b59b6',
  'Animal Rescue': '#1abc9c',
  'Disaster Relief':'#c0392b',
  Community:       '#2980b9',
  Other:           '#7f8c8d',
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="card flex flex-col animate-pulse">
      <div className="h-52 bg-earth-lt/60 rounded-t-2xl" />
      <div className="flex flex-col flex-grow p-6 gap-3">
        <div className="h-5 bg-earth-lt/60 rounded-full w-3/4" />
        <div className="h-3 bg-earth-lt/40 rounded-full w-full" />
        <div className="h-3 bg-earth-lt/40 rounded-full w-5/6" />
        <div className="mt-auto flex items-center justify-between">
          <div className="h-3 bg-earth-lt/40 rounded-full w-1/3" />
          <div className="h-8 bg-earth-lt/60 rounded-full w-24" />
        </div>
      </div>
    </div>
  )
}

// ─── Single opportunity card ──────────────────────────────────────────────────
function OpportunityCard({ opp, index, onApply }) {
  const accentColor = opp.color || CATEGORY_COLORS[opp.category] || '#3d8b7a'

  return (
    <motion.div
      className="card flex flex-col"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -12, boxShadow: '0 24px 64px rgba(61,139,122,0.2)' }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {opp.image ? (
          <motion.img
            src={opp.image}
            alt={opp.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
        ) : (
          // Fallback gradient when no image uploaded
          <div
            className="w-full h-full flex items-center justify-center text-5xl"
            style={{ background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}44)` }}
          >
            🌿
          </div>
        )}
        <span
          className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide"
          style={{ backgroundColor: accentColor }}
        >
          {opp.category}
        </span>
        <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
          🕐 {opp.duration}
        </span>
        {opp.isFeatured && (
          <span className="absolute bottom-3 right-3 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full">
            ⭐ Featured
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-grow p-6 gap-3">
        <p className="text-xs text-warm-gray font-medium">{opp.organization}</p>
        <h3 className="font-serif text-xl text-charcoal leading-snug">{opp.title}</h3>
        <p className="text-warm-gray text-sm leading-relaxed flex-grow line-clamp-3">{opp.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-semibold" style={{ color: accentColor }}>
            📍 {opp.spotsRemaining ?? opp.spots} spots left
          </span>
          <motion.button
            className="btn-primary !px-5 !py-2 text-sm"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onApply(opp)}
          >
            Apply Now
          </motion.button>
        </div>
        {/* Location badge */}
        {opp.location && (
          <p className="text-xs text-warm-gray">📌 {opp.location}</p>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function OpportunitiesSection() {
  const blobRef = useParallax(0.15)
  const navigate  = useNavigate()

  // ── Data state ──────────────────────────────────────────────────────────────
  const [opportunities, setOpportunities]   = useState([])
  const [categories, setCategories]         = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [stats, setStats]                   = useState({ total: 0, resolved: 0 })
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState(null)

  // ── Fetch public stats (categories + application counts) ───────────────────
  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/opportunities/public-stats')
      if (data.success) {
        setStats({ total: data.total, resolved: data.resolved })
        setCategories(['All', ...(data.categories || [])])
      }
    } catch {
      // non-critical, silently ignore
    }
  }, [])

  // ── Fetch opportunity cards ────────────────────────────────────────────────
  const fetchOpportunities = useCallback(async (category = 'All') => {
    setLoading(true)
    setError(null)
    try {
      const params = { limit: 6 }                       // homepage shows 6 max
      if (category !== 'All') params.category = category
      const { data } = await api.get('/opportunities', { params })
      setOpportunities(data.opportunities || [])
    } catch (err) {
      setError('Could not load opportunities. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchStats()
    fetchOpportunities('All')
  }, [fetchStats, fetchOpportunities])

  // Category filter change
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    fetchOpportunities(cat)
  }

  // Apply → navigate to full page (pre-filter to that opp)
  const handleApply = (opp) => {
    navigate('/opportunities')
  }

  return (
    <section className="relative py-24 overflow-hidden bg-cream">
      {/* Background blobs */}
      <div
        ref={blobRef}
        className="pointer-events-none absolute -top-24 -right-28 w-[440px] h-[440px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(127,196,181,0.22) 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute bottom-0 -left-20 w-[320px] h-[320px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(90,138,74,0.12) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6">

        {/* ── Toolbar row ─────────────────────────────────────────────────── */}
        <motion.div
          className="max-w-5xl mx-auto mb-8 space-y-4"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-4">

            {/* Category filter — populated from DB */}
            <div className="bg-white border border-earth-lt rounded-[1.45rem] px-5 py-4 shadow-soft">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 text-charcoal font-medium">
                  <Search className="w-4 h-4 text-teal" />
                  filter by category:
                </span>
                {categories.length === 0
                  ? ['All', 'Education', 'Environment', 'Healthcare'].map(c => (
                      <span key={c} className="h-7 w-20 rounded-full bg-earth-lt/40 animate-pulse" />
                    ))
                  : categories.map(cat => (
                      <motion.button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryChange(cat)}
                        className={`text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full border transition-colors ${
                          activeCategory === cat
                            ? 'bg-teal text-white border-teal'
                            : 'border-transparent bg-[#dbe9e3] text-teal-dk hover:bg-[#cfe2db]'
                        }`}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {cat}
                      </motion.button>
                    ))
                }
              </div>
            </div>

            {/* Live stats from DB */}
            <div className="bg-white border border-earth-lt rounded-[1.45rem] px-5 py-4 shadow-soft">
              <div className="h-full flex items-center text-charcoal">
                <BarChart3 className="w-4 h-4 text-teal mr-2.5 flex-shrink-0" />
                <p className="text-sm sm:text-[1.02rem] leading-none">
                  analytics:{' '}
                  <span className="font-semibold">
                    {stats.total > 0 ? `${stats.total} total` : <span className="inline-block h-4 w-16 bg-earth-lt/40 rounded animate-pulse align-middle" />}
                  </span>{' '}
                  –{' '}
                  <span className="font-semibold">
                    {stats.total > 0 ? `${stats.resolved} resolved` : <span className="inline-block h-4 w-16 bg-earth-lt/40 rounded animate-pulse align-middle" />}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Section heading ──────────────────────────────────────────────── */}
        <div className="text-center mb-14">
          <motion.span
            className="section-badge bg-green-lt text-green"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Get Involved
          </motion.span>
          <motion.h2
            className="section-heading mt-1 block"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Volunteering{' '}
            <em className="text-gradient not-italic">Opportunities</em>
          </motion.h2>
          <motion.p
            className="text-warm-gray max-w-lg mx-auto leading-relaxed mt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Choose a cause close to your heart and start making a real difference today.
          </motion.p>
        </div>

        {/* ── Cards grid ───────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <p className="text-warm-gray mb-4">{error}</p>
              <button
                onClick={() => fetchOpportunities(activeCategory)}
                className="inline-flex items-center gap-2 btn-outline"
              >
                <RefreshCw className="w-4 h-4" /> Try again
              </button>
            </motion.div>
          ) : loading ? (
            <motion.div
              key="skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
            >
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </motion.div>
          ) : opportunities.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="text-5xl mb-3">🌱</div>
              <p className="text-warm-gray text-lg font-medium mb-1">No opportunities in this category yet</p>
              <p className="text-warm-gray text-sm">Check back soon — new programs are added regularly.</p>
            </motion.div>
          ) : (
            <motion.div
              key={`cards-${activeCategory}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
            >
              {opportunities.map((opp, i) => (
                <OpportunityCard key={opp._id} opp={opp} index={i} onApply={handleApply} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Explore all CTA ──────────────────────────────────────────────── */}
        {!loading && !error && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              className="btn-outline"
              onClick={() => navigate('/opportunities')}
            >
              Explore All Programs
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
