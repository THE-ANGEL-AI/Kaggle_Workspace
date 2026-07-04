import { memo } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  amount?: number;
}

function FadeInComponent({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  y = 20,
  once = true,
  amount = 0.2,
}: FadeInProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={{ willChange: 'transform, opacity' }}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export const FadeIn = memo(FadeInComponent);
