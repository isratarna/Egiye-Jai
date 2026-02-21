import { motion } from 'framer-motion'
import { useParallax } from '../hooks/useParallax'
import { aboutImages } from '../data/content'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay, ease: 'easeOut' },
})

export default function AboutSection() {
  const imgParallaxRef = useParallax(0.18)

  return (
    <section className="relative py-24 overflow-hidden bg-white">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row gap-16 items-center">

        {/* ── Image collage ── */}
        <div className="relative flex-1 min-w-[280px] h-[460px] lg:h-[520px]">
          <div ref={imgParallaxRef} className="absolute inset-0">
            {/* Main photo */}
            <motion.img
              src={aboutImages.main}
              alt="Volunteers working together"
              className="absolute top-0 left-0 w-[74%] h-[72%] object-cover rounded-3xl shadow-lg-soft"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
            />
            {/* Secondary photo */}
            <motion.img
              src={aboutImages.secondary}
              alt="Volunteer hands"
              className="absolute bottom-0 right-0 w-[52%] h-[50%] object-cover rounded-2xl shadow-lg-soft"
              style={{ border: '5px solid white' }}
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.18, ease: 'easeOut' }}
            />
            {/* Floating stat pill */}
            <motion.div
              className="absolute bg-teal text-white rounded-2xl px-5 py-3 shadow-soft text-sm font-bold leading-snug"
              style={{ bottom: '30%', left: '56%' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              🌍 Since 2010
              <br />
              <span className="font-normal text-xs text-white/80">15 yrs of impact</span>
            </motion.div>

            {/* Decorative dots */}
            <div
              className="absolute -top-6 -right-6 w-24 h-24 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #3d8b7a 1.5px, transparent 1.5px)',
                backgroundSize: '12px 12px',
              }}
            />
          </div>
        </div>

        {/* ── Text content ── */}
        <div className="flex-1 min-w-[280px]">
          <motion.span
            className="section-badge bg-green-lt text-green"
            {...fadeUp(0)}
          >
            Our Story
          </motion.span>

          <motion.h2 className="section-heading mt-1 mb-6" {...fadeUp(0.1)}>
            We believe every person{' '}
            <em className="text-gradient not-italic">has the power</em> to change
            the world
          </motion.h2>

          <motion.p
            className="text-warm-gray leading-relaxed mb-4"
            {...fadeUp(0.2)}
          >
            Founded in 2010 by a small group of passionate changemakers,
            EgiyeJai began with a single food drive in Dhaka. Today, we're a
            domestic movement spanning 29 districts, connecting volunteers with the
            causes that matter most.
          </motion.p>

          <motion.p
            className="text-warm-gray leading-relaxed mb-8"
            {...fadeUp(0.28)}
          >
            Our platform bridges compassion with action — making it effortless
            for anyone to find their purpose, contribute meaningfully, and be
            part of something far greater than themselves.
          </motion.p>

          {/* Values row */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-10"
            {...fadeUp(0.35)}
          >
            {[
              { icon: '💚', label: 'Community First' },
              { icon: '🌿', label: 'Sustainable Impact' },
              { icon: '🤝', label: 'Radical Inclusion' },
              { icon: '✨', label: 'Transparent & Trusted' },
            ].map(v => (
              <div key={v.label} className="flex items-center gap-2 text-sm text-charcoal font-medium">
                <span>{v.icon}</span> {v.label}
              </div>
            ))}
          </motion.div>

          <motion.div className="flex gap-4 flex-wrap" {...fadeUp(0.42)}>
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Our Mission
            </motion.button>
            <motion.button
              className="btn-outline"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Meet the Team
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
