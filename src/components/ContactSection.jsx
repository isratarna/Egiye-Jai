import { useState } from 'react'
import { motion } from 'framer-motion'

const SUBJECTS = [
  'Volunteer Inquiry',
  'Donation Question',
  'Partnership',
  'Media & Press',
  'Other',
]

const contactInfo = [
  { icon: '📧', label: 'Email',   value: 'info@egiyejai.org'          },
  { icon: '📞', label: 'Phone',   value: '+8801312345661'            },
  { icon: '📍', label: 'HQ',      value: '23 Green Lane, Gulshan, Dhaka' },
  { icon: '🕐', label: 'Hours',   value: 'Mon–Fri, 9 AM – 6 PM BST'     },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
})

export default function ContactSection() {
  const [form, setForm]  = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent]  = useState(false)
  const [error, setError] = useState('')

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in name, email, and message.')
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <section className="relative py-24 overflow-hidden bg-white">
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #3d8b7a 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative max-w-[1100px] mx-auto px-6 flex flex-col lg:flex-row gap-14 items-start">

        {/* ── Left info panel ── */}
        <div className="flex-1 min-w-[260px]">
          <motion.span className="section-badge bg-green-lt text-green" {...fadeUp(0)}>
            Get in Touch
          </motion.span>

          <motion.h2 className="section-heading mt-1 mb-5" {...fadeUp(0.1)}>
            We'd love to{' '}
            <em className="text-gradient not-italic">hear from you</em>
          </motion.h2>

          <motion.p className="text-warm-gray leading-relaxed mb-10" {...fadeUp(0.18)}>
            Whether you're a volunteer, donor, partner, or just curious — our
            team is here to help you take the next step.
          </motion.p>

          <div className="flex flex-col gap-5">
            {contactInfo.map((c, i) => (
              <motion.div
                key={c.label}
                className="flex items-center gap-4"
                {...fadeUp(0.22 + i * 0.07)}
              >
                <div className="w-12 h-12 rounded-2xl bg-green-lt flex items-center justify-center text-xl flex-shrink-0">
                  {c.icon}
                </div>
                <div>
                  <p className="text-xs text-warm-gray font-bold tracking-widest uppercase">
                    {c.label}
                  </p>
                  <p className="text-charcoal font-medium">{c.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Form card ── */}
        <motion.div
          className="flex-1 min-w-[280px] bg-cream rounded-[2rem] p-8 md:p-10 shadow-soft"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {sent ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl mb-4">💚</div>
              <h3 className="font-serif text-2xl text-teal mb-3">Message Sent!</h3>
              <p className="text-warm-gray">We'll get back to you within 24 hours.</p>
              <button
                className="btn-outline mt-8"
                onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }) }}
              >
                Send Another
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-4">
              <h3 className="font-serif text-2xl text-charcoal mb-1">Send us a message</h3>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl">{error}</p>
              )}

              {/* Name + Email row */}
              <div className="flex gap-3 flex-wrap">
                <input
                  className="input-field flex-1 min-w-[120px]"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                />
                <input
                  className="input-field flex-1 min-w-[160px]"
                  placeholder="Email Address"
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                />
              </div>

              {/* Subject */}
              <select
                className="input-field"
                value={form.subject}
                onChange={e => update('subject', e.target.value)}
              >
                <option value="">Select a subject…</option>
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>

              {/* Message */}
              <textarea
                className="input-field resize-y"
                placeholder="Your message…"
                rows={5}
                value={form.message}
                onChange={e => update('message', e.target.value)}
              />

              <motion.button
                className="btn-primary w-full text-center justify-center"
                style={{ background: 'linear-gradient(135deg, #3d8b7a 0%, #5a8a4a 100%)' }}
                onClick={handleSubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Send Message →
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
