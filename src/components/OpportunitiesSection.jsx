import { motion } from 'framer-motion'
import { useParallax } from '../hooks/useParallax'
import { opportunities } from '../data/content'

function OpportunityCard({ opp, index }) {
  return (
    <motion.div
      className="card flex flex-col"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -12, boxShadow: '0 24px 64px rgba(61,139,122,0.2)' }}
    >
      <div className="relative h-52 overflow-hidden">
        <motion.img
          src={opp.img}
          alt={opp.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
        <span
          className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide"
          style={{ backgroundColor: opp.color }}
        >
          {opp.tag}
        </span>
        <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
          🕐 {opp.duration}
        </span>
      </div>
      <div className="flex flex-col flex-grow p-6 gap-3">
        <h3 className="font-serif text-xl text-charcoal">{opp.title}</h3>
        <p className="text-warm-gray text-sm leading-relaxed flex-grow">{opp.desc}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-semibold" style={{ color: opp.color }}>
            📍 {opp.spots} spots left
          </span>
          <motion.button
            className="btn-primary !px-5 !py-2 text-sm"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Apply Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function OpportunitiesSection() {
  const blobRef = useParallax(0.15)

  return (
    <section className="relative py-24 overflow-hidden bg-cream">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {opportunities.map((opp, i) => (
            <OpportunityCard key={opp.title} opp={opp} index={i} />
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button className="btn-outline">Explore All Programs</button>
        </motion.div>
      </div>
    </section>
  )
}
