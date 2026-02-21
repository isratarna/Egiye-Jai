import { useState } from 'react'
import { motion } from 'framer-motion'
import { footerLinks } from '../data/content'

const SOCIALS = [
  { icon: '𝕏',  label: 'Twitter'   },
  { icon: 'f',  label: 'Facebook'  },
  { icon: 'in', label: 'LinkedIn'  },
  { icon: '▶',  label: 'YouTube'   },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subbed, setSubbed] = useState(false)

  return (
    <footer className="bg-charcoal text-white/65">
      {/* Wave topper */}
      <div className="overflow-hidden leading-none -mb-1">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="block w-full">
          <path
            d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-0">
        <div className="flex flex-wrap gap-10 mb-14">

          {/* Brand column */}
          <div className="flex-1 min-w-[240px]">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'linear-gradient(135deg, #3d8b7a, #5a8a4a)' }}>
                🌿
              </div>
              <span className="font-serif text-2xl text-white font-bold">EgiyeJai</span>
            </div>

            <p className="text-sm leading-relaxed max-w-[270px] mb-6">
              Connecting compassionate people with meaningful causes since 2026.
              Together we've built a kinder, greener world.
            </p>

            {/* Social buttons */}
            <div className="flex gap-2">
              {SOCIALS.map(s => (
                <motion.button
                  key={s.label}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm cursor-pointer transition-colors duration-300 border-0"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                  whileHover={{ scale: 1.12, backgroundColor: '#3d8b7a' }}
                  whileTap={{ scale: 0.93 }}
                >
                  {s.icon}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([cat, items]) => (
            <div key={cat} className="flex-1 min-w-[130px]">
              <h4 className="font-sans text-xs font-bold tracking-[0.1em] uppercase text-white mb-5">
                {cat}
              </h4>
              <ul className="flex flex-col gap-3">
                {items.map(item => (
                  <li key={item}>
                    <motion.a
                      href="#"
                      className="text-sm text-white/55 no-underline transition-colors duration-300"
                      whileHover={{ color: '#7fc4b5', x: 3 }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="flex-1 min-w-[210px]">
            <h4 className="font-sans text-xs font-bold tracking-[0.1em] uppercase text-white mb-5">
              Newsletter
            </h4>
            <p className="text-sm leading-relaxed mb-5">
              Inspiring stories &amp; opportunities, straight to your inbox.
            </p>
            {subbed ? (
              <motion.p
                className="text-teal-lt font-semibold text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                🎉 You're subscribed!
              </motion.p>
            ) : (
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="px-4 py-3 rounded-xl text-sm font-sans text-white bg-white/10 border border-white/15 placeholder:text-white/40 focus:outline-none focus:border-teal-lt transition-colors"
                />
                <motion.button
                  className="py-3 rounded-xl text-sm font-bold text-white cursor-pointer border-0 font-sans"
                  style={{ background: 'linear-gradient(135deg, #3d8b7a, #5a8a4a)' }}
                  onClick={() => email && setSubbed(true)}
                  whileHover={{ scale: 1.02, opacity: 0.92 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Subscribe →
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>© {new Date().getFullYear()} EgiyeJai. All rights reserved. Made with 💚</span>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Use', 'Cookie Settings'].map(l => (
              <motion.a
                key={l}
                href="#"
                className="no-underline transition-colors duration-300"
                style={{ color: 'rgba(255,255,255,0.4)' }}
                whileHover={{ color: '#7fc4b5' }}
              >
                {l}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
