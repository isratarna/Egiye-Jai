import { useState, useEffect } from 'react' // usestate componnet er state ar effect timer auto rotation eshob
import { motion, AnimatePresence } from 'framer-motion' //motion for animation elemnt, presence holo jeshob elemnt ashe abar jay oder ashajawa hanfle kore
import { useParallax } from '../hooks/useParallax'
import { volunteers } from '../data/content'

export default function RecognitionSection() {
  const [active, setActive] = useState(0) // eta diye track rakhe kon volunteer ekhon highlighted
  const blobRef = useParallax(0.2) // ektu slow korte parallax effect diye blob ke scroll er sathe move korano

  // Auto-rotate every 5 s
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % volunteers.length), 5000)
    return () => clearInterval(t)
  }, [])

  const vol = volunteers[active] // current volunteer data, jeta selector button click kore change hobe, ar auto-rotate o change korbe

  return (
    <section className="relative py-24 overflow-hidden bg-white">
      {/* Parallax decorative blob */}
      <div
        ref={blobRef}
        className="pointer-events-none absolute -bottom-20 -left-24 w-[480px] h-[480px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(90,138,74,0.09) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            className="section-badge bg-[#f5ead8] text-[#8a6940]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Hall of Heart
          </motion.span>
          <motion.h2
            className="section-heading mt-1"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Volunteer{' '}
            <em className="text-gradient not-italic">Recognition</em>
          </motion.h2>
        </div>

        {/* Spotlight card */}
        <motion.div
          className="relative bg-cream rounded-[2rem] p-10 flex flex-col md:flex-row gap-10 items-center shadow-soft mb-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          {/* Badge */}
          <span
            className="absolute top-6 right-6 text-white text-xs font-bold px-4 py-1.5 rounded-full"
            style={{ backgroundColor: vol.badgeColor }}
          >
            {vol.badge}
          </span>

          {/* Avatar * , animaete presence use kori element diassapear reappear howar shomoy j in and out hoy shetar jonno*/}
          {/* jokhon wait mane 5 secdhore current ke dekachhe*/ }
          <AnimatePresence mode="wait">
            <motion.img
              key={vol.name + '-img'}
              src={vol.img}
              alt={vol.name}
              className="w-36 h-36 rounded-full object-cover flex-shrink-0 ring-4 ring-teal-lt shadow-lg-soft"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.45 }}
            />
          </AnimatePresence>

          {/* Quote right to left animate korse so exit er somoy -20 x  */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={vol.name + '-quote'}
                className="font-serif text-xl italic text-charcoal leading-relaxed mb-5 pl-5"
                style={{ borderLeft: '4px solid #3d8b7a' }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.45 }}
              >
                "{vol.quote}"
              </motion.blockquote>
            </AnimatePresence>
            {/*volunteer er name role hours*/}
            <AnimatePresence mode="wait">
              <motion.div
                key={vol.name + '-meta'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <p className="font-bold text-teal text-lg">{vol.name}</p>
                <p className="text-warm-gray text-sm">
                  {vol.role} &nbsp;·&nbsp; {vol.hours} hrs volunteered
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Selector buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          {volunteers.map((v, i) => (
            <motion.button
              key={v.name}
              onClick={() => setActive(i)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border-2 cursor-pointer"
              style={{
                background: i === active ? '#3d8b7a' : '#fff',
                borderColor: i === active ? '#3d8b7a' : '#e8d8c0',
                color: i === active ? '#fff' : '#8a7e74',
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <img
                src={v.img}
                alt={v.name}
                className="w-7 h-7 rounded-full object-cover flex-shrink-0"
              />
              {v.name}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
