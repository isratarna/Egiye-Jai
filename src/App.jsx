import HorizontalScroll from './components/home/HorizontalScroll'
import Navbar from './components/layout/Navbar'

export default function App() {
  return (
    <main className="site-shell min-h-screen bg-cream text-charcoal">
      <Navbar />
      <div className="pt-20">
        <HorizontalScroll />
      </div>
    </main>
  )
}

