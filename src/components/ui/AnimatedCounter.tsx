import { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  /** Easing power: 3 = cubic, 4 = quartic, etc. */
  easePower?: number;
  /** Intersection threshold to start animation */
  threshold?: number;
  className?: string;
  /** Locale for number formatting (e.g. 'ru-RU') */
  locale?: string;
}

/**
 * IntersectionObserver-driven animated counter.
 * Starts counting up once the element scrolls into view.
 */
export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2000,
  easePower = 3,
  threshold = 0.3,
  className = '',
  locale,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    if (!ref.current || counted.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, easePower);
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration, easePower, threshold]);

  const display = locale ? count.toLocaleString(locale) : String(count);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
