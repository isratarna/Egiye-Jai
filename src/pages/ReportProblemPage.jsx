import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, UploadCloud } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const DIVISIONS = ['Dhaka', 'Rajshahi', 'Sylhet', 'Chittagong', 'Barisal', 'Khulna', 'Rangpur']

export default function ReportProblemPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [reportForm, setReportForm] = useState({ title: '', description: '', location: 'Dhaka', images: [] })

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    const toastId = toast.loading('Uploading image...')
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (data.success) {
        setReportForm(prev => ({ ...prev, images: [data.url] }))
        toast.success('Image uploaded successfully', { id: toastId })
      }
    } catch {
      toast.error('Failed to upload image', { id: toastId })
    }
  }

  const handleReportSubmit = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Please log in to report a problem')
    if (reportForm.images.length === 0) return toast.error('Please upload an image showing the problem.')

    try {
      const { data } = await api.post('/problems', reportForm)
      if (data.success) {
        toast.success('Problem reported successfully')
        navigate('/problems')
      }
    } catch {
      toast.error('Failed to submit report')
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 px-6 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl bg-white border border-earth-lt/50 shadow-soft rounded-[2rem] p-8 sm:p-12 h-fit"
        >
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal mb-4">Report an Issue</h1>
            <p className="text-warm-gray text-sm sm:text-base">Help improve your community by reporting civic problems, safety hazards, or public needs with photographic evidence.</p>
          </div>

          <form onSubmit={handleReportSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Issue Title</label>
              <input required type="text" className="input-field w-full py-3" placeholder="e.g. Broken street light on Main St." value={reportForm.title} onChange={e => setReportForm(f => ({...f, title: e.target.value}))} />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Division</label>
              <select className="input-field w-full py-3 bg-white" value={reportForm.location} onChange={e => setReportForm(f => ({...f, location: e.target.value}))}>
                {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Description</label>
              <textarea required className="input-field w-full py-3" rows={5} placeholder="Provide details about the exact location, the severity of the problem, and why it needs attention..." value={reportForm.description} onChange={e => setReportForm(f => ({...f, description: e.target.value}))} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Upload Photo Evidence</label>
              <div className="relative border-2 border-dashed border-earth-lt rounded-2xl bg-[#fafcfb] flex flex-col items-center py-10 transition-colors hover:bg-teal-pale overflow-hidden group">
                <input required={reportForm.images.length === 0} type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                
                {reportForm.images[0] ? (
                  <div className="absolute inset-0 z-0">
                    <img src={reportForm.images[0]} alt="Uploaded" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 text-green-700 font-semibold text-sm">
                        <CheckCircle className="w-4 h-4" /> Photo Uploaded (Click to change)
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-teal mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-charcoal">Click or drag an image here</p>
                    <p className="text-xs text-warm-gray mt-1">PNG, JPG, up to 5MB</p>
                  </>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className="btn-primary w-full py-4 text-base font-bold shadow-md shadow-teal/20">Submit Problem Report</button>
            </div>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
