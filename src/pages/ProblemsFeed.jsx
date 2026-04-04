import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MapPin, MessageSquare, ThumbsUp, Camera, CheckCircle, Search, Upload } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'
import toast from 'react-hot-toast'

const DIVISIONS = ['All', 'Dhaka', 'Rajshahi', 'Sylhet', 'Chittagong', 'Barisal', 'Khulna', 'Rangpur']

export default function ProblemsFeed() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterDivision, setFilterDivision] = useState('All')
  
  // Solution Form
  const [solvingId, setSolvingId] = useState(null)
  const [solutionForm, setSolutionForm] = useState({ proofImage: '', description: '' })

  // Comment Form
  const [commentingId, setCommentingId] = useState(null)
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    fetchProblems()
  }, [filterDivision])
  
  const fetchProblems = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/problems', {
        params: filterDivision === 'All' ? {} : { division: filterDivision }
      })
      if (data.success) {
        setProblems(data.problems)
      }
    } catch {
      toast.error('Failed to load problems feed')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (id) => {
    if (!user) return toast.error('Please log in to like')
    try {
      const { data } = await api.post(`/problems/${id}/like`)
      if (data.success) fetchProblems() // or optimistically update
    } catch {
      toast.error('Failed to like')
    }
  }

  const handleCommentSubmit = async (e, id) => {
    e.preventDefault()
    if (!user) return toast.error('Please log in to comment')
    try {
      const { data } = await api.post(`/problems/${id}/comment`, { text: commentText })
      if (data.success) {
        toast.success('Comment added')
        setCommentText('')
        setCommentingId(null)
        fetchProblems()
      }
    } catch {
      toast.error('Failed to add comment')
    }
  }

  const handleSolutionSubmit = async (e, id) => {
    e.preventDefault()
    if (!user) return toast.error('Please log in to submit a solution')
    if (!solutionForm.proofImage) return toast.error('Proof image is required, please upload one.')
    try {
      const { data } = await api.post(`/problems/${id}/solve`, solutionForm)
      if (data.success) {
        toast.success('Solution submitted for admin review')
        setSolvingId(null)
        setSolutionForm({ proofImage: '', description: '' })
        fetchProblems()
      }
    } catch {
      toast.error('Failed to submit solution')
    }
  }

  const handleImageUpload = async (e, formType) => {
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
        setSolutionForm(prev => ({ ...prev, proofImage: data.url }))
        toast.success('Image uploaded successfully', { id: toastId })
      }
    } catch {
      toast.error('Failed to upload image', { id: toastId })
    }
  }

  const handleAcceptSolution = async (problemId, solutionId) => {
    try {
      const { data } = await api.patch(`/admin/problems/${problemId}/solutions/${solutionId}/accept`)
      if (data.success) {
        toast.success('Proof accepted! Points awarded.')
        fetchProblems()
      }
    } catch {
      toast.error('Failed to accept proof')
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <section className="pt-28 pb-10 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header & Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold text-charcoal">Problems Feed</h1>
              <p className="text-warm-gray text-sm mt-1">See what needs fixing in your community and act on verified issues.</p>
            </div>
            <button
              onClick={() => navigate('/report-problem')}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" /> Report an Issue
            </button>
          </div>

          {/* Division Filter */}
          <div className="bg-white rounded-2xl p-4 shadow-soft mb-8 flex items-center gap-4 overflow-x-auto">
            <span className="text-sm font-semibold text-charcoal flex items-center gap-2 whitespace-nowrap">
              <MapPin className="w-4 h-4 text-teal" /> Filter by:
            </span>
            {DIVISIONS.map(div => (
              <button 
                key={div} 
                onClick={() => setFilterDivision(div)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${filterDivision === div ? 'bg-teal text-white border-transparent' : 'bg-[#edf6f2] text-teal-dk border border-[#dbe9e3] hover:bg-[#dff0e9]'}`}
              >
                {div}
              </button>
            ))}
          </div>

          {/* Feed List */}
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-teal border-t-white rounded-full animate-spin" /></div>
          ) : problems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-earth-lt">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="font-serif text-xl font-bold">No problems reported here!</h3>
              <p className="text-warm-gray mt-2">Looks like this area is clean and safe.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {problems.map(prob => {
                const userLiked = user && prob.likes.includes(user._id)
                const acceptedSolution = prob.solutions.find(s => s.status === 'accepted')
                
                return (
                  <div key={prob._id} className="bg-white rounded-3xl p-6 shadow-soft border border-earth-lt/50">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-pale flex items-center justify-center text-teal font-bold overflow-hidden">
                          {prob.reportedBy?.avatar ? <img src={prob.reportedBy.avatar} className="w-full h-full object-cover" onError={e => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${prob.reportedBy?.name || 'U'}&background=c5efde&color=2c6858`}}/> : prob.reportedBy?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-charcoal">{prob.reportedBy?.name}</p>
                          <p className="text-xs text-warm-gray">{new Date(prob.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${prob.isSolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {prob.isSolved ? 'Resolved' : prob.status}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold mb-2">{prob.title}</h3>
                    <p className="text-charcoal mb-4 text-sm leading-relaxed">{prob.description}</p>
                    
                    {prob.images && prob.images.length > 0 && (
                      <div className="mb-4 rounded-xl overflow-hidden border border-earth-lt/50">
                        <img src={prob.images[0]} alt="Problem visual" className="w-full max-h-[400px] object-cover" onError={e => e.target.style.display = 'none'} />
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {prob.location}
                      </span>
                    </div>

                    {prob.isSolved && acceptedSolution && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-3 mb-3">
                          <CheckCircle className="text-green-600" />
                          <div>
                            <p className="text-sm font-semibold text-green-800">This problem has been solved!</p>
                            <p className="text-xs text-green-600">Solved by community hero: <span className="font-bold">{acceptedSolution.solvedBy?.name || 'Anonymous'}</span></p>
                          </div>
                        </div>
                        {acceptedSolution.proofImage && (
                          <div className="mt-3 rounded-xl overflow-hidden border border-green-100">
                            <img src={acceptedSolution.proofImage} alt="Solution Proof" className="w-full max-h-64 object-cover" onError={e => e.target.style.display = 'none'} />
                          </div>
                        )}
                        {acceptedSolution.description && (
                          <p className="text-sm text-green-900 mt-2 bg-green-100/50 p-3 rounded-lg">
                            "{acceptedSolution.description}"
                          </p>
                        )}
                      </div>
                    )}

                    {/* Admin Proof Review block */}
                    {user?.role === 'admin' && prob.solutions.length > 0 && !prob.isSolved && (
                      <div className="bg-amber-50 rounded-xl p-4 mb-4 border border-amber-200">
                        <h4 className="font-semibold text-sm text-amber-900 mb-2">Admin Review: Pending Proofs</h4>
                        <div className="space-y-4">
                          {prob.solutions.map(sol => (
                            <div key={sol._id} className="bg-white p-3 rounded-lg border border-amber-100 flex gap-4">
                              <img src={sol.proofImage} alt="proof" className="w-16 h-16 object-cover rounded-md flex-shrink-0" onError={e => e.target.style.display = 'none'} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-warm-gray">Submitted by: <span className="font-semibold text-charcoal">{sol.solvedBy?.name}</span></p>
                                <p className="text-sm text-charcoal my-1">{sol.description}</p>
                                {sol.status === 'pending' && (
                                  <button onClick={() => handleAcceptSolution(prob._id, sol._id)} className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-full transition-colors mt-2">
                                    Accept Proof
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-6 border-t border-earth-lt/50 mt-4 pt-4">
                      <button onClick={() => handleLike(prob._id)} className={`flex items-center gap-2 text-sm font-semibold transition-colors ${userLiked ? 'text-teal' : 'text-warm-gray hover:text-charcoal'}`}>
                        <ThumbsUp className={`w-4 h-4 ${userLiked ? 'fill-teal' : ''}`} /> {prob.likes.length}
                      </button>
                      <button onClick={() => setCommentingId(commentingId === prob._id ? null : prob._id)} className="flex items-center gap-2 text-sm font-semibold text-warm-gray hover:text-charcoal transition-colors">
                        <MessageSquare className="w-4 h-4" /> {prob.comments.length}
                      </button>
                      
                      {!prob.isSolved && (
                        <button onClick={() => setSolvingId(prob._id)} className="ml-auto text-sm font-semibold text-teal hover:underline flex items-center gap-1">
                          Solve this <Upload className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Solve Form */}
                    {solvingId === prob._id && (
                      <form onSubmit={e => handleSolutionSubmit(e, prob._id)} className="mt-4 p-4 bg-teal-pale rounded-xl border border-teal/20">
                        <h4 className="font-semibold text-sm mb-3">Submit Proof of Solution</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold mb-1 text-gray-700">Upload Proof Photo</label>
                            <input required={!solutionForm.proofImage} type="file" accept="image/*" className="input-field text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-teal file:text-white" onChange={e => handleImageUpload(e, 'solution')} />
                            {solutionForm.proofImage && (
                              <div className="mt-2 text-xs text-green-600 flex items-center gap-1 font-semibold">
                                <CheckCircle className="w-3 h-3" /> Image Uploaded
                              </div>
                            )}
                          </div>
                          <textarea className="input-field text-sm" placeholder="How did you solve it?" rows={2} value={solutionForm.description} onChange={e => setSolutionForm(f => ({...f, description: e.target.value}))} />
                          <div className="flex gap-2">
                            <button type="submit" className="btn-primary py-2 px-4 text-xs">Submit for Review</button>
                            <button type="button" onClick={() => setSolvingId(null)} className="py-2 px-4 text-xs border border-earth-lt rounded-full text-warm-gray font-semibold hover:bg-white inline-block">Cancel</button>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* Comments Section */}
                    {commentingId === prob._id && (
                      <div className="mt-4 bg-gray-50 rounded-xl p-4">
                        <form onSubmit={(e) => handleCommentSubmit(e, prob._id)} className="flex gap-2 mb-4">
                          <input required type="text" className="flex-1 input-field py-2 text-sm" placeholder="Write a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} />
                          <button type="submit" className="btn-primary py-2 px-4 text-xs">Post</button>
                        </form>
                        <div className="space-y-3">
                          {prob.comments.map(c => (
                            <div key={c._id} className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-earth-lt/50 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                                {c.user?.avatar ? <img src={c.user.avatar} className="w-full h-full object-cover" onError={e => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${c.user?.name || 'U'}&background=e2e8f0&color=475569`}} /> : c.user?.name?.charAt(0)}
                              </div>
                              <div className="bg-white border border-earth-lt/50 rounded-xl p-2 px-3 flex-1 text-sm text-charcoal">
                                <span className="font-semibold mr-2">{c.user?.name}</span>
                                {c.text}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
