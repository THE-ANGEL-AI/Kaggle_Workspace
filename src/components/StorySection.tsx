import { memo, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const chapterColors = ['#00F5FF', '#7B61FF', '#A855F7', '#00FFB3', '#FF007A', '#FCEE0A'];

interface StorySectionProps {
  /** 1-based chapter number */
  chapter: number;
  /** Short label shown above the title (e.g. "Глава 1") */
  label: string;
  /** Section title */
  title: string;
  /** Title accent portion rendered in gradient */
  accent?: string;
  /** Body paragraphs */
  children: React.ReactNode;
  /** Optional decorative element (icon / stats / list) */
  aside?: React.ReactNode;
  /** Reversed layout (aside first, then text) */
  reversed?: boolean;
  /** Custom gradient colors for this chapter */
  colors?: [string, string];
}

function StorySectionComponent({
  chapter,
  label,
  title,
  accent,
  children,
  aside,
  reversed = false,
  colors,
}: StorySectionProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Parallax scroll progress within this section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Parallax offsets
  const textY = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 40, reduced ? 0 : -40]);
  const bgY = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : -30, reduced ? 0 : 30]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.4, 1, 1, 0.4]);

  const c1 = colors?.[0] ?? chapterColors[(chapter - 1) % chapterColors.length]!;
  const c2 = colors?.[1] ?? chapterColors[(chapter) % chapterColors.length]!;

  // Split title into regular + accent parts
  const titleParts = useMemo(() => (accent ? title.split(accent) : [title]), [accent, title]);

  return (
    <motion.section
      ref={ref}
      className="relative z-10 px-4 sm:px-8 py-20 sm:py-28 overflow-hidden"
      style={{ opacity, willChange: 'transform, opacity' }}
    >
      {/* Parallax background glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY, willChange: 'transform' }}
      >
        <div
          className="absolute top-[20%] left-[5%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.04]"
          style={{ background: c1 }}
        />
        <div
          className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.03]"
          style={{ background: c2 }}
        />
      </motion.div>

      <div className="relative max-w-[1200px] mx-auto">
        {/* Chapter number — large decorative, absolute so it doesn't push layout */}
        <motion.div
          className="absolute top-0 left-0 z-0 font-display text-[clamp(4rem,12vw,10rem)] font-black leading-[0.8] select-none pointer-events-none -translate-y-1/4"
          style={{
            color: `${c1}0D`,
            WebkitTextStroke: `1px ${c1}20`,
            willChange: 'transform, opacity',
          } as React.CSSProperties}
          initial={{ opacity: 0, x: reversed ? 100 : -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {String(chapter).padStart(2, '0')}
        </motion.div>

        <div
          className="relative grid gap-8 md:gap-16 items-center pt-24 sm:pt-32"
          style={{
            gridTemplateColumns: aside
              ? '5fr 4fr'
              : '1fr',
          } as React.CSSProperties}
        >
          {/* Text column */}
          <motion.div
            className="relative z-10"
            style={{ y: textY, willChange: 'transform' }}
            initial={{ opacity: 0, y: reduced ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Label */}
            <span
              className="inline-block text-[0.65rem] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border mb-5"
              style={{
                color: c1,
                borderColor: `${c1}40`,
                background: `${c1}08`,
              }}
            >
              {label}
            </span>

            {/* Title */}
            <h2 className="text-[clamp(2rem,4.5vw,3.2rem)] font-display font-extrabold leading-[1.08] -tracking-[0.03em] text-text-bright mb-6">
              {accent ? (
                <>
                  {titleParts[0]}
                  {titleParts.length > 1 && (
                    <span
                      className="bg-clip-text text-transparent bg-gradient-to-r"
                      style={{ backgroundImage: `linear-gradient(135deg, ${c1}, ${c2})` }}
                    >
                      {accent}
                    </span>
                  )}
                  {titleParts[1] ?? ''}
                </>
              ) : (
                title
              )}
            </h2>

            {/* Content */}
            <div className="text-text-dim text-[1.05rem] leading-relaxed space-y-4 max-w-[640px]">
              {children}
            </div>
          </motion.div>

          {/* Aside (if present) */}
          {aside && (
            <motion.div
              className="relative"
              style={{ willChange: 'transform, opacity' }}
              initial={{ opacity: 0, x: reversed ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {aside}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom glow divider */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${c1}, ${c2}, transparent)`,
        }}
      />
    </motion.section>
  );
}

export const StorySection = memo(StorySectionComponent);
