import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Heart, Home, RotateCcw } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/Footer'

export default function DonationResultPage() {
  const [params] = useSearchParams()
  const status = params.get('status')
  const amount = params.get('amount')
  const tran_id = params.get('tran_id')

  const isSuccess = status === 'success'
  const isCancelled = status === 'cancel'

  const config = isSuccess
    ? {
        icon: <CheckCircle size={72} className="text-emerald-500" />,
        title: 'Thank You!',
        subtitle: 'Your donation was successful.',
        desc: `You donated ৳${Number(amount).toLocaleString()} to EgiyeJai. Your generosity helps us connect volunteers with meaningful causes across Bangladesh.`,
        bg: 'from-emerald-50 to-teal-50',
        border: 'border-emerald-200',
      }
    : isCancelled
    ? {
        icon: <AlertCircle size={72} className="text-yellow-500" />,
        title: 'Donation Cancelled',
        subtitle: 'You cancelled the payment.',
        desc: 'No worries — your donation was not processed. You can try again anytime.',
        bg: 'from-yellow-50 to-amber-50',
        border: 'border-yellow-200',
      }
    : {
        icon: <XCircle size={72} className="text-red-500" />,
        title: 'Payment Failed',
        subtitle: 'Something went wrong.',
        desc: 'Your payment could not be processed. Please try again or use a different payment method.',
        bg: 'from-red-50 to-pink-50',
        border: 'border-red-200',
      }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`max-w-md w-full bg-gradient-to-br ${config.bg} border ${config.border} rounded-2xl shadow-xl p-10 text-center`}
        >
          <div className="flex justify-center mb-4">{config.icon}</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{config.title}</h1>
          <p className="text-gray-500 font-medium mb-4">{config.subtitle}</p>
          <p className="text-gray-600 mb-6 leading-relaxed">{config.desc}</p>

          {tran_id && (
            <div className="bg-white/70 rounded-xl px-4 py-3 mb-6 text-sm text-gray-500">
              Transaction ID: <span className="font-mono font-semibold text-gray-700">{tran_id}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-xl font-semibold transition-colors"
            >
              <Home size={18} /> Go Home
            </Link>
            {!isSuccess && (
              <Link
                to="/donate"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
              >
                <RotateCcw size={18} /> Try Again
              </Link>
            )}
            {isSuccess && (
              <Link
                to="/donate"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
              >
                <Heart size={18} /> Donate Again
              </Link>
            )}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
