import { useState, useEffect } from 'react'
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [unreadOnly, setUnreadOnly] = useState(false)

  useEffect(() => { fetchMessages() }, [unreadOnly])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/contact', { params: { limit: 50, unread: unreadOnly || undefined } })
      setMessages(data.messages || [])
      setTotal(data.total || 0)
    } catch { toast.error('Failed to load messages') }
    finally { setLoading(false) }
  }

  const markRead = async (id) => {
    try {
      await api.patch(`/contact/${id}/read`)
      setMessages(ms => ms.map(m => m._id === id ? { ...m, isRead: true } : m))
    } catch {}
  }

  const handleExpand = (id) => {
    setExpanded(expanded === id ? null : id)
    const msg = messages.find(m => m._id === id)
    if (msg && !msg.isRead) markRead(id)
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/contact/${deleteId}`)
      toast.success('Message deleted')
      setDeleteId(null)
      fetchMessages()
    } catch { toast.error('Delete failed') }
  }

  const unreadCount = messages.filter(m => !m.isRead).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-serif">Messages</h2>
          <p className="text-gray-500 text-sm">{unreadCount} unread of {total} total</p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <div className={`relative w-10 h-5 rounded-full transition-colors ${unreadOnly ? 'bg-teal' : 'bg-gray-300'}`} onClick={() => setUnreadOnly(p => !p)}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${unreadOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
          <span className="text-sm text-gray-600">Unread only</span>
        </label>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-teal/30 border-t-teal rounded-full animate-spin mx-auto" /></div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No messages yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {messages.map(msg => (
              <div key={msg._id} className={`transition-colors ${!msg.isRead ? 'bg-teal-pale/30' : ''}`}>
                <div className="flex items-center gap-4 p-5 cursor-pointer" onClick={() => handleExpand(msg._id)}>
                  <div className="flex-shrink-0">
                    {msg.isRead ? <MailOpen className="h-5 w-5 text-gray-400" /> : <Mail className="h-5 w-5 text-teal" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-semibold text-sm ${msg.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{msg.name}</p>
                      <span className="text-xs text-gray-400">{msg.email}</span>
                      {!msg.isRead && <span className="text-xs bg-teal text-white px-2 py-0.5 rounded-full font-semibold">New</span>}
                    </div>
                    <p className={`text-sm mt-0.5 ${msg.isRead ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>{msg.subject}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="text-xs text-gray-400 hidden sm:block">{new Date(msg.createdAt).toLocaleDateString()}</p>
                    <button onClick={e => { e.stopPropagation(); setDeleteId(msg._id) }} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {expanded === msg._id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                  </div>
                </div>
                {expanded === msg._id && (
                  <div className="px-5 pb-5">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 flex-wrap">
                        <span>From: <span className="font-medium text-gray-700">{msg.name}</span></span>
                        <span>Email: <a href={`mailto:${msg.email}`} className="text-teal hover:underline">{msg.email}</a></span>
                        <span>Received: {new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">Subject: {msg.subject}</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                      <div className="mt-4">
                        <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #3d8b7a, #5a8a4a)' }}>
                          Reply via Email →
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <Trash2 className="h-12 w-12 text-red-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Delete this message?</h3>
            <p className="text-sm text-gray-500 mb-5">This action is permanent and cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
