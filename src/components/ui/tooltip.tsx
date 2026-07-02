import { useState, useRef, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  text: string;
  children: ReactNode;
  /** Позиция tooltip'а относительно элемента */
  side?: 'top' | 'bottom';
  /** Доп. класс для обёртки (например, для absolute-позиционирования) */
  className?: string;
  /** Задержка появления в мс */
  delay?: number;
}

/**
 * Лёгкий tooltip поверх любого интерактивного элемента.
 * Используется вместо нативного `title=` — даёт стилизованный cyberpunk-вид
 * и работает корректно на touch-устройствах (показ по tap).
 */
export function Tooltip({
  text,
  children,
  side = 'top',
  className = '',
  delay = 250,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);

  const show = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setOpen(false);
  };

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const positionClass =
    side === 'top'
      ? 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      : 'top-full left-1/2 -translate-x-1/2 mt-2';

  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onClick={() => setOpen((v) => !v)}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            className={`absolute z-50 ${positionClass} pointer-events-none`}
            initial={{ opacity: 0, y: side === 'top' ? 4 : -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === 'top' ? 4 : -4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <span className="block whitespace-nowrap font-mono text-[0.6rem] tracking-wider uppercase px-2.5 py-1 rounded-md bg-bg-deep/95 border border-cyan/30 text-cyan shadow-[0_0_16px_rgba(0,245,255,0.2)] backdrop-blur-md">
              {text}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}