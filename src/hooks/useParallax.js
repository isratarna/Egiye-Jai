import { useState, useEffect, useRef } from 'react'

/**
 * useParallax – returns a ref to attach to a DOM element.
 * The element will translate on scroll at `speed` factor.
 * @param {number} speed – fraction of scroll offset (e.g. 0.2)
 */
export function useParallax(speed = 0.2) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handle = () => {
      const rect = el.getBoundingClientRect()
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed
      el.style.transform = `translateY(${offset}px)`
    }

    window.addEventListener('scroll', handle, { passive: true })
    handle() // initial position
    return () => window.removeEventListener('scroll', handle)
  }, [speed])

  return ref
}

/**
 * useAnimatedCounter – returns a display string that counts up to `target`.
 * Only starts when `inView` is true.
 */
export function useAnimatedCounter(target, suffix = '', inView = false, duration = 1800) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])

  return count.toLocaleString() + suffix
}
