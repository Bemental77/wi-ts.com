import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let instance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return instance;
}

export function initSmoothScroll() {
  if (instance) return instance;
  if (typeof window === 'undefined') return null;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return null;

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    lerp: 0.1,
  });

  document.documentElement.classList.add('lenis-active');

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  instance = lenis;
  return lenis;
}
