import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react'

import slider01 from '../../assets/slider/vbd-slider-1.jpg'
import slider02 from '../../assets/slider/vbd-slider-2.jpg'
import slider03 from '../../assets/slider/vbd-slider-3.jpg'
import slider04 from '../../assets/slider/vbd-slider-4.jpg'

const slides = [
  {
    id: 1,
    image: slider02,
    overlay: 'bg-charcoal-deep/60',
    title: 'Join Volunteer for Bangladesh',
    description: 'Take action in your community and help build a stronger, safer, and more inclusive Bangladesh.',
  },
  {
    id: 2,
    image: slider01,
    overlay: 'bg-charcoal/55',
    title: 'Join the Movement',
    description: 'Do not wait for change. Become the change and lead impact with your local team.',
  },
  {
    id: 3,
    image: slider03,
    overlay: 'bg-earth-dk/55',
    title: 'Volunteer for Bangladesh Turns 14',
    description: 'Fourteen years of youth-led impact, and this is just the beginning.',
  },
  {
    id: 4,
    image: slider04,
    overlay: 'bg-charcoal-deep/62',
    title: 'Rebuild Our Nation Together',
    description: 'Join initiatives that transform lives and support families when they need it most.',
  },
]

export default function HorizontalScroll() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return undefined

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [paused])

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length)
  }

  return (
    <section
      className="reveal-up reveal-delay-1 relative h-[72vh] min-h-[520px] w-full overflow-hidden md:h-[84vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, index) => (
        <article
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            activeIndex === index ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
          <div className={`absolute inset-0 ${slide.overlay}`} />

          <div className="absolute inset-0 z-10 mx-auto flex h-full w-full max-w-[1200px] items-center px-6">
            <div className={`max-w-3xl text-white ${activeIndex === index ? 'hero-copy-enter' : ''}`}>
              <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl xl:text-7xl">
                {slide.title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm text-white/90 md:text-lg">
                {slide.description}
              </p>

              <div className="hero-actions mt-7 flex flex-wrap items-center gap-3">
                <button className="auth-button !px-6 !py-3 text-sm">
                  Make an Impact
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-earth-lt/80 bg-earth/20 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-earth-lt hover:text-charcoal-deep">
                  <PlayCircle className="h-4 w-4" />
                  Watch Video
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              activeIndex === index ? 'w-9 bg-teal-lt' : 'w-2.5 bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 md:bottom-7 md:right-8">
        <button
          onClick={prevSlide}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-earth-lt/75 bg-charcoal-deep/35 text-white transition hover:bg-earth-lt hover:text-charcoal-deep"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-earth-lt/75 bg-charcoal-deep/35 text-white transition hover:bg-earth-lt hover:text-charcoal-deep"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  )
}
