import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Bell,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  Loader2,
  Mail,
  Search,
  ShieldCheck,
  UserPlus,
} from 'lucide-react'
import { useParallax } from '../hooks/useParallax'
import { opportunities } from '../data/content'

const reportFlow = [
  {
    title: 'Submitted',
    subtitle: 'Citizen submits issue with location and evidence',
    Icon: FileText,
  },
  {
    title: 'Verified',
    subtitle: 'Admin validates the report and category',
    Icon: ShieldCheck,
  },
  {
    title: 'In Progress',
    subtitle: 'Organization or authority executes the response',
    Icon: Clock3,
  },
  {
    title: 'Resolved',
    subtitle: 'Issue closed with transparent public status',
    Icon: CheckCircle2,
  },
]
const reportCategories = ['waste', 'roads', 'health', 'education']
const notificationActions = [Mail, ClipboardCheck, CheckCircle2, UserPlus]

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
  const [activePhase, setActivePhase] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePhase(prev => (prev + 1) % reportFlow.length)
    }, 2600)

    return () => clearInterval(timer)
  }, [])

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
        <motion.div
          className="max-w-5xl mx-auto mb-8 space-y-4"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-4">
            <div className="bg-white border border-earth-lt rounded-[1.45rem] px-5 py-4 shadow-soft">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 text-charcoal font-medium">
                  <Search className="w-4 h-4 text-teal" />
                  filter by category:
                </span>
                {reportCategories.map(category => (
                  <motion.button
                    key={category}
                    type="button"
                    className="text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full border border-transparent bg-[#dbe9e3] text-teal-dk"
                    whileHover={{ y: -1, backgroundColor: '#cfe2db' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-earth-lt rounded-[1.45rem] px-5 py-4 shadow-soft">
              <div className="h-full flex items-center text-charcoal">
                <BarChart3 className="w-4 h-4 text-teal mr-2.5" />
                <p className="text-sm sm:text-[1.02rem] leading-none">
                  analytics dashboard: <span className="font-semibold">147 total</span> -{' '}
                  <span className="font-semibold">89 resolved</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-earth-lt rounded-[1.45rem] px-5 py-4 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="inline-flex items-center gap-2 text-charcoal text-xl font-semibold">
                <Bell className="w-4 h-4 text-teal" />
                <span className="text-base">notifications</span>
              </p>

              <div className="flex items-center gap-2.5">
                {notificationActions.map((Icon, idx) => (
                  <span
                    key={idx}
                    className="w-8 h-8 rounded-full bg-[#edf6f2] text-teal-dk flex items-center justify-center border border-[#dbe9e3] cursor-pointer transition-colors duration-200 hover:bg-[#dff0e9]"
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                ))}
              </div>

              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium bg-[#edf6f2] text-teal-dk border border-[#dbe9e3] w-fit cursor-pointer transition-colors duration-200 hover:bg-[#dff0e9]">
                <Mail className="w-3.5 h-3.5" />
                3 unread
              </span>
            </div>
          </div>

          <div className="h-px bg-teal-lt/70 mx-2 sm:mx-4" />
        </motion.div>

        <motion.div
          className="relative max-w-5xl mx-auto mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-[2.2rem] blur-2xl opacity-70"
            style={{
              background:
                'linear-gradient(120deg, rgba(61,139,122,0.16) 0%, rgba(90,138,74,0.14) 45%, rgba(200,169,126,0.14) 100%)',
            }}
          />
          <div className="relative overflow-hidden rounded-[2.2rem] border border-earth-lt bg-white/95 shadow-lg-soft">
            <div
              className="pointer-events-none absolute -top-20 -right-14 w-56 h-56 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(127,196,181,0.28) 0%, transparent 70%)' }}
            />
            <div
              className="pointer-events-none absolute -bottom-28 -left-20 w-64 h-64 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(90,138,74,0.16) 0%, transparent 70%)' }}
            />

            <div className="relative px-6 sm:px-8 py-7 sm:py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="max-w-3xl">
                  <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full bg-[#f5ead8] text-[#8a6940]">
                    Important Feature
                  </span>
                  <h3 className="font-serif text-charcoal mt-3 text-2xl sm:text-[1.9rem] leading-tight">
                    Social Problem Reporting
                  </h3>
                  <p className="text-warm-gray text-sm sm:text-base leading-relaxed mt-3">
                    Report civic and social issues like waste, unsafe roads, safety risks, and health concerns with location and evidence. Each report follows a transparent flow: Submitted, Verified, In Progress, and Resolved.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2.5 rounded-full bg-[#edf6f2] border border-[#d7e9e2] px-4 py-2 text-sm text-teal-dk font-medium">
                    <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                    Live phase: {reportFlow[activePhase].title}
                  </div>
                </div>

                <motion.a
                  href="mailto:complaints@egiyejai.org?subject=Social%20Problem%20Report"
                  className="btn-primary !px-7 !py-3 text-sm sm:text-base no-underline whitespace-nowrap self-start lg:self-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Report a Problem
                </motion.a>
              </div>

              <div className="mt-7">
                <div className="hidden lg:block relative mb-4">
                  <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-earth-lt" />
                  <motion.div
                    className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-gradient-to-r from-teal via-teal-lt to-green rounded-full"
                    initial={false}
                    animate={{
                      width: `${(activePhase / (reportFlow.length - 1)) * 100}%`,
                    }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {reportFlow.map((step, i) => {
                    const isActive = i === activePhase
                    const isCompleted = i < activePhase
                    const StepIcon = step.Icon

                    return (
                      <motion.div
                        key={step.title}
                        className={`rounded-2xl border px-4 py-3.5 ${
                          isActive
                            ? 'bg-white border-teal shadow-soft'
                            : isCompleted
                              ? 'bg-[#f0f8f4] border-[#cfe3db]'
                              : 'bg-cream/85 border-earth-lt'
                        }`}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isActive ? 'bg-teal text-white' : 'bg-[#e6f2ed] text-teal-dk'
                            }`}
                          >
                            {isActive && step.title === 'In Progress' ? (
                              <Loader2 className="w-[18px] h-[18px] animate-spin" />
                            ) : (
                              <StepIcon className="w-[18px] h-[18px]" />
                            )}
                          </span>

                          <div className="min-w-0">
                            <p className="text-charcoal text-sm font-semibold leading-none">
                              {i + 1}. {step.title}
                            </p>
                            <p className="mt-1.5 text-[11px] sm:text-xs text-warm-gray leading-snug">
                              {step.subtitle}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`mt-3 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            isActive
                              ? 'bg-teal/10 text-teal'
                              : isCompleted
                                ? 'bg-[#dff0e9] text-teal-dk'
                                : 'bg-[#f2ece3] text-[#8a7e74]'
                          }`}
                        >
                          {isActive ? 'Live now' : isCompleted ? 'Completed' : 'Queued'}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

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
