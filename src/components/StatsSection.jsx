import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useParallax, useAnimatedCounter } from '../hooks/useParallax'
import { stats } from '../data/content'

function StatCard({ stat, inView, index }) {
  const display = useAnimatedCounter(stat.value, stat.suffix, inView)

  return (
    <motion.div
      className="flex-1 min-w-[160px] text-center px-6 py-8 rounded-3xl"
      style={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.18)',
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.12, ease: 'easeOut' }}
    >
      <div
        className="font-serif font-bold text-white leading-none mb-2"
        style={{ fontSize: 'clamp(2.4rem,5vw,3.6rem)' }}
      >
        {display}
      </div>
      <div className="text-white/75 text-sm tracking-wide">{stat.label}</div>
    </motion.div>
  )
}

export default function StatsSection() {
  const bgRef = useParallax(0.28)
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

  return (
    <section
      ref={ref}
      className="relative py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #2a6357 0%, #3d8b7a 55%, #5a8a4a 100%)',
      }}
    >
      {/* Parallax photo overlay */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'url("https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1400")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.07,
        }}
      />

      {/* Decorative ring */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full pointer-events-none"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
      />

      <div className="relative max-w-[1100px] mx-auto px-6">
        <motion.p
          className="text-center text-white/60 text-xs tracking-[0.18em] uppercase font-semibold mb-10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Our Impact in Numbers
        </motion.p>

        <div className="flex flex-wrap gap-4 justify-center">
          {stats.map((s, i) => (
            <StatCard key={s.label} stat={s} inView={inView} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
