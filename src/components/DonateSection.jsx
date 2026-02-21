import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParallax } from '../hooks/useParallax'
import { donateBg, donateImpact } from '../data/content'

const PRESETS = [1000, 2500, 5000, 10000]
const FREQS   = ['once', 'monthly', 'yearly']

function getImpact(amount) {
  const key = PRESETS.reduce((prev, curr) =>
    amount >= curr ? curr : prev, 10)
  return donateImpact[key] ?? 'make a meaningful difference'
}

export default function DonateSection() {
  const [amount, setAmount]   = useState(1000)
  const [custom, setCustom]   = useState('')
  const [freq, setFreq]       = useState('monthly')
  const bgRef                 = useParallax(0.28)

  const displayAmount = custom ? Number(custom) : amount

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Parallax BG photo */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("TK{donateBg}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(42,99,87,0.93) 0%, rgba(61,139,122,0.88) 100%)' }}
      />

      <div className="relative max-w-[860px] mx-auto px-6 text-center">
        {/* Heading */}
        <motion.span
          className="inline-block text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-4"
          style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Make a Difference
        </motion.span>

        <motion.h2
          className="font-serif text-white mb-4"
          style={{ fontSize: 'clamp(2rem,5vw,3rem)' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Your Gift <em>Transforms Lives</em>
        </motion.h2>

        <motion.p
          className="text-white/75 max-w-md mx-auto leading-relaxed mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.18 }}
        >
          100% of your donation goes directly to programs supporting communities
          in need — no admin overhead, just impact.
        </motion.p>

        {/* Donation widget */}
        <motion.div
          className="bg-white/97 rounded-[2rem] p-8 md:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.22)] text-left"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.65 }}
        >
          {/* Frequency toggle */}
          <div className="flex bg-cream rounded-full p-1 mb-8 w-fit mx-auto">
            {FREQS.map(f => (
              <button
                key={f}
                onClick={() => setFreq(f)}
                className="px-6 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-300 cursor-pointer border-0 font-sans"
                style={{
                  background: freq === f ? '#3d8b7a' : 'transparent',
                  color:      freq === f ? '#fff' : '#8a7e74',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Amount presets */}
          <div className="flex flex-wrap gap-3 justify-center mb-5">
            {PRESETS.map(p => (
              <motion.button
                key={p}
                onClick={() => { setAmount(p); setCustom('') }}
                className="font-serif text-lg font-bold px-7 py-3 rounded-xl border-2 transition-all duration-300 cursor-pointer"
                style={{
                  background:   amount === p && !custom ? '#3d8b7a' : '#faf7f2',
                  color:        amount === p && !custom ? '#fff'     : '#2c2c2c',
                  borderColor:  amount === p && !custom ? '#3d8b7a' : '#e8d8c0',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                ৳{p}
              </motion.button>
            ))}

            {/* Custom input */}
            <input
              type="number"
              placeholder="Custom ৳"
              value={custom}
              onChange={e => { setCustom(e.target.value); setAmount(0) }}
              className="input-field !w-28 text-center text-sm"
              style={{ borderColor: custom ? '#3d8b7a' : '#e8d8c0' }}
            />
          </div>

          {/* Impact line */}
          <p className="text-white/75 max-w-md mx-auto leading_relaxed mb-10">
            ৳{displayAmount || 0}{' '}
            {freq !== 'once' ? `/ ${freq}` : ''} can{' '}
            <strong className="text-white/75 max-w-md mx-auto leading_relaxed mb-10">{getImpact(displayAmount)}</strong>
          </p>

          {/* CTA */}
          <div className="flex justify-center">
            <motion.button
              className="pulse-btn btn-primary !px-14 !py-4 text-base tracking-wide"
              style={{ background: 'linear-gradient(135deg, #3d8b7a 0%, #5a8a4a 100%)' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Donate ৳{displayAmount || 0}
              {freq !== 'once' ? ` / ${freq}` : ''} →
            </motion.button>
          </div>



          <p className="text-white/75 max-w-md mx-auto leading-relaxed mb-10">

            🔒 Secure payment &nbsp;·&nbsp; Tax deductible &nbsp;·&nbsp; Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  )
}
