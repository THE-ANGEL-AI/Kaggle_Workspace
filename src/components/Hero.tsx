import { useState, useCallback, useRef, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Zap, Sparkles, ChevronDown } from 'lucide-react';
import { BootSequence } from './HeroBootSequence';
import { useMousePosition } from '../hooks/useMousePosition';

// HeroScene (R3F + three.js, ~305 KB gzip) грузится отдельным чанком — иначе
// главный bundle раздувается на 1 МБ. Suspense-обёртка нужна для ленивого children.
const HeroScene = lazy(() =>
  import('../scenes/HeroScene').then((m) => ({ default: m.HeroScene })),
);

/** Fallback пока грузится R3F-сцена: статичный радиальный glow в духе дизайна. */
function HeroSceneFallback() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style={{
        background: `
          radial-gradient(ellipse 70% 60% at 30% 50%, rgba(0,245,255,0.10) 0%, transparent 60%),
          radial-gradient(ellipse 50% 50% at 75% 60%, rgba(123,97,255,0.08) 0%, transparent 55%),
          radial-gradient(ellipse 40% 40% at 50% 10%, rgba(168,85,247,0.06) 0%, transparent 50%)
        `,
      }}
    />
  );
}

/* ── Magnetic button wrapper ── */
function MagneticButton({
  children,
  href,
  className = '',
  onClick,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleMouse = (e: React.MouseEvent) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const handleLeave = () => {
    const btn = btnRef.current;
    if (!btn) return;
    btn.style.transform = 'translate(0, 0)';
  };

  return (
    <a
      ref={btnRef}
      href={href}
      target={href.startsWith('#') ? undefined : '_blank'}
      rel={href.startsWith('#') ? undefined : 'noopener noreferrer'}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className={`magnetic-btn ${className}`}
    >
      {children}
    </a>
  );
}

/* ── Tag pill ── */
function TagPill({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      className={`px-3 py-1 text-[0.65rem] font-bold tracking-[0.15em] uppercase rounded-full border whitespace-nowrap transition-all duration-300 ${
        active
          ? 'bg-cyan text-bg-deep border-cyan shadow-[0_0_12px_var(--color-glow-cyan)]'
          : 'text-text-dim bg-white/[0.03] border-white/[0.08] hover:text-cyan hover:border-cyan/30 hover:bg-cyan/[0.06]'
      }`}
    >
      {children}
    </span>
  );
}

/* ── Hero ── */
export function Hero() {
  const [bootDone, setBootDone] = useState(false);
  const pos = useMousePosition();
  const handleBootComplete = useCallback(() => {
    setBootDone(true);
  }, []);

  const skipBoot = useCallback(() => {
    setBootDone(true);
  }, []);

  // Parallax values for 3D scene
  const parallaxX = (pos.x - 50) * 0.02;
  const parallaxY = (pos.y - 50) * 0.02;

  return (
    <header
      className="relative z-10 min-h-[90vh] sm:min-h-screen flex items-center px-4 sm:px-8 pt-20 pb-12 sm:pb-20 overflow-hidden bg-bg-deep"
      style={{
        '--parallax-x': `${parallaxX}px`,
        '--parallax-y': `${parallaxY}px`,
      } as React.CSSProperties}
    >
      {/* 3D Scene Background — lazy-чанк (~305 KB gzip) */}
      <Suspense fallback={<HeroSceneFallback />}>
        <HeroScene />
      </Suspense>

      {/* Ambient gradient overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 20% 40%, rgba(0,245,255,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 80% 60%, rgba(123,97,255,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 50% 10%, rgba(168,85,247,0.08) 0%, transparent 50%)
          `,
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-grid" />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 z-[2] pointer-events-none bg-gradient-to-t from-bg-deep to-transparent" />

      {/* ── Boot overlay ── */}
      {!bootDone && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-bg-deep">
          <div className="max-w-[600px] w-full px-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_10px_var(--color-cyan),0_0_20px_var(--color-glow-cyan)] animate-pulse" />
              <span className="font-mono text-[0.65rem] tracking-[0.3em] text-cyan uppercase font-bold">
                THE ANGEL AI — System Startup
              </span>
            </div>
            <div className="bg-bg-panel/80 border border-border rounded-xl p-4 sm:p-6 backdrop-blur-md">
              <BootSequence onComplete={handleBootComplete} />
            </div>
            <button
              onClick={skipBoot}
              className="mt-4 font-mono text-[0.7rem] text-text-muted hover:text-text-dim transition-colors"
            >
              [Нажмите Esc / Space — или кликните, чтобы пропустить]
            </button>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div
        className="relative z-10 w-full max-w-[1340px] mx-auto"
        style={{
          opacity: bootDone ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        <div className="grid md:grid-cols-[1.3fr_1fr] items-center gap-8 md:gap-16">
          {/* Left: Text */}
          <div>
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan to-purple flex items-center justify-center shadow-[0_0_20px_var(--color-glow-cyan)]">
                  <Sparkles size={22} className="text-bg-deep" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-cyan to-purple opacity-30 blur-md -z-10" />
              </div>
              <div>
                <div className="font-display font-bold text-sm tracking-widest text-text-bright">
                  THE ANGEL AI
                </div>
                <div className="font-mono text-[0.6rem] tracking-[0.25em] text-text-muted uppercase">
                  Laboratory of the Future
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-[clamp(2.6rem,7.5vw,5.2rem)] font-display font-black leading-[1.02] -tracking-[0.04em] mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              ComfyUI на
              <br />
              <span className="text-gradient-full animate-[grad-shift_6s_ease-in-out_infinite_alternate] bg-[length:200%_200%]">
                двух Tesla T4
              </span>
              <span className="block w-20 h-1 mt-3 bg-gradient-to-r from-cyan to-purple rounded-full shadow-[0_0_20px_var(--color-glow-cyan)]" />
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-text-dim text-[clamp(1.05rem,1.6vw,1.25rem)] max-w-[580px] mb-6 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Запускай Flux2 GGUF, LTX 2.3 Video, TTS — бесплатно, без своего GPU.
              Скрипты из коробки с идемпотентностью и Cloudflare-туннелем.
            </motion.p>

            {/* Tags */}
            <motion.div
              className="flex flex-wrap gap-2 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <TagPill active>2× Tesla T4</TagPill>
              <TagPill>Python 3.12</TagPill>
              <TagPill>torch cu130</TagPill>
              <TagPill>ComfyUI 0.24+</TagPill>
              <TagPill>Flux2 GGUF</TagPill>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <MagneticButton
                href="https://github.com/THE-ANGEL-AI/Kaggle_Workspace_FreeGPU"
                className="bg-cyan text-bg-deep hover:neon-glow-cyan hover:-translate-y-0.5 active:scale-[0.97] transition-all"
              >
                <GitBranch size={18} />
                GitHub Repository
              </MagneticButton>
              <MagneticButton
                href="#start"
                className="border border-cyan/30 text-cyan bg-white/[0.03] hover:bg-cyan/10 hover:border-cyan/50 hover:-translate-y-0.5 active:scale-[0.97] transition-all"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  document.querySelector('#start')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Zap size={18} />
                Quick Start
              </MagneticButton>
              <MagneticButton
                href="https://boosty.to/the_angel/donate"
                className="border border-purple/30 text-purple bg-white/[0.02] hover:bg-purple hover:text-bg-deep hover:shadow-[0_0_24px_var(--color-glow-purple),0_0_60px_var(--color-glow-purple)] hover:-translate-y-0.5 active:scale-[0.97] transition-all"
              >
                💖 Boosty
              </MagneticButton>
            </motion.div>
          </div>

          {/* Right: decorative 3D space is already behind */}
          <div className="hidden md:block" />
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="font-mono text-[0.55rem] tracking-[0.25em] text-text-muted uppercase">
            Scroll
          </span>
          <ChevronDown size={16} className="text-text-muted animate-bounce" />
        </motion.div>
      </div>

      {/* Glow line divider */}
      <div className="absolute left-1/2 -bottom-px -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan via-50% to-purple to-80% to-transparent shadow-[0_0_30px_var(--color-glow-cyan),0_0_60px_var(--color-glow-purple)] z-10" />
    </header>
  );
}
