import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/contact', form)
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      toast.success('Message sent! We\'ll be in touch soon 💚')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6" style={{ background: 'linear-gradient(135deg, #2a6357 0%, #3d8b7a 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="section-badge bg-white/20 text-white text-xs">💬 Get in Touch</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mt-4 mb-4">Contact Us</h1>
          <p className="text-white/80 text-lg">Have a question, idea, or want to partner with us? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Info Column */}
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-charcoal mb-6">Find Us</h2>
                {[
                  { icon: <MapPin className="h-5 w-5" />, label: 'Address', value: 'House 12, Road 4, Dhanmondi\nDhaka 1205, Bangladesh' },
                  { icon: <Phone className="h-5 w-5" />, label: 'Phone', value: '+880 1700-123456' },
                  { icon: <Mail className="h-5 w-5" />, label: 'Email', value: 'hello@egiyejai.org' },
                  { icon: <Clock className="h-5 w-5" />, label: 'Office Hours', value: 'Sun – Thu: 9am – 6pm\nFri: Closed' },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex gap-4 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-teal bg-teal-pale">{icon}</div>
                    <div>
                      <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-sm text-charcoal whitespace-pre-line">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="bg-teal-pale rounded-2xl p-5">
                <h4 className="font-semibold text-charcoal mb-3">Follow Our Journey</h4>
                <div className="flex gap-3">
                  {[['Facebook', '🇫'], ['Instagram', '📷'], ['Twitter', '𝕏'], ['YouTube', '▶']].map(([name, icon]) => (
                    <button key={name} className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-teal text-sm hover:bg-teal hover:text-white transition-all shadow-soft">{icon}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Map + Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Embedded Map */}
              <div className="rounded-3xl overflow-hidden shadow-soft border border-earth-lt h-64">
                <iframe
                  title="EgiyeJai Location - Dhanmondi, Dhaka"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.2745440939957!2d90.37388431498375!3d23.746937884590437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9001b0abae5%3A0x7c5cf65b57d88cf!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                />
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-3xl p-8 shadow-soft border border-earth-lt/50">
                <h3 className="font-serif text-xl font-bold text-charcoal mb-6">Send Us a Message</h3>
                {sent ? (
                  <div className="text-center py-10">
                    <CheckCircle className="h-16 w-16 text-teal mx-auto mb-4" />
                    <h4 className="font-serif text-xl font-bold text-charcoal mb-2">Message Received!</h4>
                    <p className="text-warm-gray mb-6">Thank you for reaching out. Our team will respond within 24 hours.</p>
                    <button onClick={() => setSent(false)} className="btn-outline">Send Another Message</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-charcoal mb-1.5">Your Name *</label>
                        <input required className="input-field" placeholder="Full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-charcoal mb-1.5">Email Address *</label>
                        <input required type="email" className="input-field" placeholder="your@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-1.5">Subject *</label>
                      <input required className="input-field" placeholder="What is this about?" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-1.5">Message *</label>
                      <textarea required rows={5} className="input-field resize-none" placeholder="Tell us more..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                      {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="h-4 w-4" />}
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
