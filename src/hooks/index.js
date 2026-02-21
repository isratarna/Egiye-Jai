import { useEffect, useRef, useState } from 'react';

// ─── Scroll Reveal ─── triggers .reveal classes
export function useScrollReveal() {
  useEffect(() => {
    const selectors = ['.reveal', '.reveal-left', '.reveal-right'];
    const elements = document.querySelectorAll(selectors.join(', '));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

// ─── Parallax on scroll for a ref element ───
export function useParallax(speed = 0.25) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const offset =
        (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // init position
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return ref;
}

// ─── Animated Counter ───
export function useCounter(target, suffix = '', inView = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 1800;
    const totalSteps = duration / 16;
    const step = target / totalSteps;

    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, target]);

  return count.toLocaleString() + suffix;
}

// ─── InView detector for a ref element ───
export function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // fire once
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ─── Auto-cycle through items ───
export function useAutoCycle(length, interval = 5000) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((prev) => (prev + 1) % length);
    }, interval);
    return () => clearInterval(t);
  }, [length, interval]);

  return [active, setActive];
}
