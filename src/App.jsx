import HorizontalScroll from './components/home/HorizontalScroll'
import Navbar from './components/layout/Navbar'
import Footer from './components/Footer'
import OpportunitiesSection from './components/OpportunitiesSection'
import RecognitionSection from './components/RecognitionSection'
import StatsSection from './components/StatsSection'
import FeaturedOnSection    from './components/FeaturedOnSection'
import AboutSection         from './components/AboutSection'
import DonateSection        from './components/DonateSection'
import ContactSection       from './components/ContactSection'

export default function App() {
  return (
    <main className="site-shell min-h-screen bg-cream text-charcoal">
      <Navbar />
      <div className="pt-20">
        <HorizontalScroll />
      </div>

      <OpportunitiesSection />
      <StatsSection />
      <RecognitionSection />
      <FeaturedOnSection />
      <AboutSection />
      <DonateSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
