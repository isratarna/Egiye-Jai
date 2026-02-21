import { motion } from 'framer-motion'
import { pressLogos } from '../data/content'

export default function FeaturedOnSection() {
  return (
    <section className="py-16 bg-cream border-t border-earth-lt">
      <div className="max-w-[1100px] mx-auto px-6">
        <motion.p
          className="text-center text-warm-gray text-xs tracking-[0.18em] uppercase font-bold mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          As Featured In
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {pressLogos.map((logo, i) => (
            <motion.div
              key={logo.name}
              className="press-logo px-4 py-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <img
                src={logo.logo}
                alt={logo.name}
                className="h-8 object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
