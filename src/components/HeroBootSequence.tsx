import { useState, useEffect, useCallback, useRef } from 'react';

interface BootLine {
  text: string;
  done: boolean;
}

const bootLines = [
  { text: 'INITIALIZING THE ANGEL AI CORE...', duration: 600 },
  { text: 'LOADING NEURAL NETWORK MATRIX...', duration: 500 },
  { text: 'CONNECTING TO KAGGLE WORKSPACE...', duration: 700 },
  { text: 'SCANNING AVAILABLE GPU RESOURCES...', duration: 550 },
  { text: '  2× Tesla T4 detected — 16GB VRAM each', duration: 400 },
  { text: 'CALIBRATING CUDA 12.4 + torch cu130...', duration: 600 },
  { text: '  SDPA optimized for Turing architecture', duration: 350 },
  { text: 'ESTABLISHING SECURE TUNNEL...', duration: 450 },
  { text: '  Cloudflare tunnel: ACTIVE', duration: 300 },
  { text: 'SYSTEM READY — AI LABORATORY ONLINE', duration: 800 },
];

interface BootSequenceProps {
  onComplete?: () => void;
}

/**
 * Boot-анимация при первом заходе на сайт (декоративная).
 *
 * PHASE 19 — a11y:
 *  - `role="status"` + `aria-live="polite"` — screen reader проговорит последнюю строку
 *  - Escape/Space/Enter пропускают анимацию
 *  - `prefers-reduced-motion` обрабатывается на уровне родителя (Hero.tsx):
 *    boot просто не запускается, onComplete зовётся сразу
 */
export function BootSequence({ onComplete }: BootSequenceProps) {
  const [lines, setLines] = useState<BootLine[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const mountedRef = useRef(true);

  const safeTimeout = (fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      if (mountedRef.current) fn();
    }, ms);
    return id;
  };

  const addNextLine = useCallback(() => {
    if (!mountedRef.current) return;
    if (currentIndex >= bootLines.length) {
      setShowCursor(false);
      safeTimeout(() => onComplete?.(), 500);
      return;
    }
    const line = bootLines[currentIndex]!;
    setLines((prev) => [...prev, { text: line.text, done: false }]);

    safeTimeout(() => {
      if (!mountedRef.current) return;
      setLines((prev) =>
        prev.map((l, i) => (i === prev.length - 1 ? { ...l, done: true } : l)),
      );
      setCurrentIndex((prev) => prev + 1);
    }, line.duration);
  }, [currentIndex, onComplete]);

  // Пропуск анимации — Escape / Space / Enter
  const skip = useCallback(() => {
    if (!mountedRef.current) return;
    if (currentIndex >= bootLines.length) return; // уже завершено
    setShowCursor(false);
    setLines(bootLines.map((l) => ({ text: l.text, done: true })));
    setCurrentIndex(bootLines.length);
    safeTimeout(() => onComplete?.(), 50);
  }, [currentIndex, onComplete]);

  useEffect(() => {
    const timer = setTimeout(addNextLine, currentIndex === 0 ? 400 : 150);
    return () => {
      clearTimeout(timer);
      mountedRef.current = false;
    };
  }, [addNextLine, currentIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        skip();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [skip]);

  // Cursor blink
  useEffect(() => {
    if (!showCursor) return;
    const interval = setInterval(() => {
      setShowCursor((v) => !v);
    }, 500);
    return () => clearInterval(interval);
  }, [showCursor]);

  return (
    <div
      className="font-mono text-xs sm:text-sm leading-relaxed space-y-0.5"
      role="status"
      aria-live="polite"
      aria-label="Загрузка системы — нажмите Escape для пропуска"
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className="animate-[boot-fade-in_0.2s_ease-out]"
        >
          <span className={line.done ? 'text-cyan' : 'text-cyan/60'}>
            {'> '}
          </span>
          <span
            className={
              line.text.startsWith('  ')
                ? 'text-text-dim'
                : 'text-text-bright'
            }
          >
            {line.text}
          </span>
          {line.text.includes('ACTIVE') || line.text.includes('ONLINE') ? (
            <span className="inline-block ml-2 w-2 h-2 rounded-full bg-green shadow-[0_0_8px_rgba(0,255,179,0.8)] animate-pulse" />
          ) : line.text.includes('Tesla T4') ? (
            <span className="inline-block ml-2 w-2 h-2 rounded-full bg-cyan shadow-[0_0_8px_var(--color-glow-cyan)]" />
          ) : null}
        </div>
      ))}
      {showCursor && (
        <span className="text-cyan animate-[boot-blink_0.5s_step-end_infinite]">
          ▊
        </span>
      )}
    </div>
  );
}
