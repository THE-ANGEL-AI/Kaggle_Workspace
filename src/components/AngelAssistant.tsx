import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hints, welcomeMessage, recommendations, detectSection, type AssistantHint } from '../data/assistantHints';
import { X, Sparkles, ChevronRight, MessageCircle, Heart } from 'lucide-react';

/* ── SVG Angel Mascot ── */
function AngelMascot({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Halo */}
      <ellipse cx="24" cy="8" rx="10" ry="3" fill="#00F5FF" opacity="0.5" />
      <ellipse cx="24" cy="8" rx="8" ry="2" fill="#00F5FF" opacity="0.8" />

      {/* Wings */}
      <path d="M10 28 C5 22, 3 16, 8 12 C12 16, 14 22, 10 28Z" fill="#A855F7" opacity="0.5" />
      <path d="M38 28 C43 22, 45 16, 40 12 C36 16, 34 22, 38 28Z" fill="#A855F7" opacity="0.5" />

      {/* Body */}
      <ellipse cx="24" cy="30" rx="10" ry="12" fill="#7B61FF" opacity="0.3" />
      <ellipse cx="24" cy="30" rx="8" ry="10" fill="#7B61FF" opacity="0.3" />

      {/* Head */}
      <circle cx="24" cy="18" r="8" fill="#1a1a2e" stroke="#7B61FF" strokeWidth="1" />

      {/* Eyes */}
      <ellipse cx="21" cy="17" rx="1.8" ry="2" fill="#00F5FF" />
      <ellipse cx="27" cy="17" rx="1.8" ry="2" fill="#00F5FF" />
      <circle cx="21" cy="16.5" r="0.8" fill="#0A0A0A" />
      <circle cx="27" cy="16.5" r="0.8" fill="#0A0A0A" />

      {/* Blush */}
      <ellipse cx="19" cy="20.5" rx="2" ry="1" fill="#FF007A" opacity="0.3" />
      <ellipse cx="29" cy="20.5" rx="2" ry="1" fill="#FF007A" opacity="0.3" />

      {/* Mouth */}
      <path d="M22 21 Q24 23 26 21" stroke="#7B61FF" strokeWidth="0.8" fill="none" />

      {/* Cyber lines on face */}
      <path d="M16 18 L18 18.5" stroke="#00F5FF" strokeWidth="0.5" opacity="0.5" />
      <path d="M30 18.5 L32 18" stroke="#00F5FF" strokeWidth="0.5" opacity="0.5" />

      {/* Neon glow ring */}
      <circle cx="24" cy="24" r="22" stroke="#00F5FF" strokeWidth="0.5" opacity="0.2" />
    </svg>
  );
}

/* ── Hint card ── */
function HintCard({
  hint,
  onAction,
}: {
  hint: AssistantHint;
  onAction: (link: string) => void;
}) {
  return (
    <motion.div
      className="glass rounded-xl border border-cyan/20 backdrop-blur-xl p-3.5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-start gap-2.5">
        <span className="text-lg shrink-0 mt-0.5">{hint.icon}</span>
        <div className="min-w-0">
          <h4 className="font-display font-bold text-xs text-text-bright">{hint.title}</h4>
          <p className="text-text-muted text-[0.7rem] leading-relaxed mt-0.5">{hint.message}</p>
          {hint.action && (
            <button
              onClick={() => onAction(hint.actionLink || '#')}
              className="inline-flex items-center gap-1 font-mono text-[0.55rem] font-bold tracking-wider text-cyan hover:text-text-bright transition-colors mt-1.5"
            >
              {hint.action} <ChevronRight size={10} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Recommendation chip ── */
function RecommendationChip({
  rec,
  onClick,
}: {
  rec: (typeof recommendations)[0];
  onClick: (link: string) => void;
}) {
  return (
    <button
      onClick={() => onClick(rec.link)}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-left group"
      style={{
        borderColor: `${rec.color}20`,
        background: `${rec.color}06`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${rec.color}50`;
        e.currentTarget.style.background = `${rec.color}12`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${rec.color}20`;
        e.currentTarget.style.background = `${rec.color}06`;
      }}
    >
      <span className="text-base">{rec.icon}</span>
      <div className="min-w-0">
        <div className="font-display font-bold text-[0.6rem] text-text-bright">{rec.title}</div>
        <div className="text-[0.55rem] text-text-muted">{rec.description}</div>
      </div>
    </button>
  );
}

/* ── Main component ── */
export function AngelAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentHint, setCurrentHint] = useState<AssistantHint>(hints[0]!);
  const [showWelcome, setShowWelcome] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Welcome: show after 3 seconds on first visit
  useEffect(() => {
    let welcomed: string | null = null;
    try { welcomed = sessionStorage.getItem('angel-welcomed'); } catch {}
    if (!welcomed) {
      timeoutRef.current = setTimeout(() => {
        setShowWelcome(true);
        try { sessionStorage.setItem('angel-welcomed', 'true'); } catch {}
      }, 3000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Track scroll to update contextual hints
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      const section = detectSection();
      const hint = hints.find((h) => h.section === section);
      if (hint) setCurrentHint(hint);
    };

    handleScroll(); // Initial
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setShowWelcome(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const toggle = useCallback(() => {
    setIsOpen((v) => !v);
    setShowWelcome(false);
  }, []);

  const handleAction = useCallback((link: string) => {
    setIsOpen(false);
    if (link.startsWith('http')) {
      window.open(link, '_blank', 'noopener');
    } else {
      const el = document.querySelector(link);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const closeWelcome = useCallback(() => {
    setShowWelcome(false);
    setIsOpen(true);
  }, []);

  return (
    <>
      {/* Welcome toast */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="fixed bottom-24 right-4 sm:right-6 z-[9998] max-w-[320px] sm:max-w-[360px]"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="glass rounded-2xl border border-cyan/25 backdrop-blur-xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.50),0_0_30px_rgba(0,245,255,0.08)]">
              <div className="flex items-start gap-3">
                <AngelMascot size={40} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-sm text-text-bright">
                    {welcomeMessage.title}
                  </h3>
                  <p className="text-text-muted text-xs leading-relaxed mt-1">
                    {welcomeMessage.message}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={closeWelcome}
                      className="px-4 py-1.5 rounded-lg font-bold text-[0.65rem] bg-cyan text-bg-deep hover:shadow-[0_0_16px_var(--color-glow-cyan)] transition-all"
                    >
                      Начать
                    </button>
                    <button
                      onClick={() => setShowWelcome(false)}
                      className="px-3 py-1.5 rounded-lg font-bold text-[0.65rem] text-text-dim hover:text-text-bright transition-colors"
                    >
                      Позже
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowWelcome(false)}
                  className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
                  aria-label="Закрыть"
                >
                  <X size={12} className="text-text-dim" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={toggle}
        className="fixed bottom-6 right-4 sm:right-6 z-[9999] w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_var(--color-glow-cyan),0_0_40px_var(--color-glow-cyan)] transition-all cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #00F5FF, #7B61FF)',
        }}
        whileHover={{ scale: 1.1, boxShadow: '0 0 30px var(--color-glow-cyan), 0 0 60px var(--color-glow-cyan)' }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Закрыть помощника' : 'Открыть помощника'}
      >
        {isOpen ? (
          <X size={22} className="text-bg-deep" />
        ) : (
          <AngelMascot size={32} />
        )}
        {/* Pulse ring */}
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ border: '1px solid rgba(0,245,255,0.3)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.button>

      {/* Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[9997]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              ref={panelRef}
              className="fixed bottom-24 right-4 sm:right-6 z-[9998] w-[calc(100%-32px)] sm:w-[380px] max-h-[60vh] glass rounded-2xl border border-border backdrop-blur-2xl overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.55),0_0_40px_rgba(0,245,255,0.06)]"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'bottom right' }}
            >
              {/* Header */}
              <div
                className="flex items-center gap-3 px-4 py-3.5 border-b border-border"
                style={{ background: 'linear-gradient(135deg, rgba(0,245,255,0.06), rgba(123,97,255,0.06))' }}
              >
                <AngelMascot size={36} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-sm text-text-bright">
                    THE ANGEL AI
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green shadow-[0_0_6px_rgba(0,255,179,0.8)]" />
                    <span className="font-mono text-[0.55rem] text-green tracking-wider">ONLINE</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
                  aria-label="Закрыть"
                >
                  <X size={14} className="text-text-dim" />
                </button>
              </div>

              {/* Scrollable content */}
              <div
                className="p-4 overflow-y-auto space-y-3"
                style={{ maxHeight: 'calc(60vh - 60px)' }}
              >
                {/* Current hint */}
                <HintCard hint={currentHint} onAction={handleAction} />

                {/* Divider */}
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                  <Sparkles size={12} className="text-text-muted shrink-0" />
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-display font-bold text-[0.65rem] tracking-wider text-text-dim mb-2 flex items-center gap-1.5">
                    <Heart size={10} className="text-magenta" />
                    Рекомендации
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {recommendations.map((rec, i) => (
                      <RecommendationChip key={i} rec={rec} onClick={handleAction} />
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between text-[0.55rem] font-mono text-text-muted pt-1 border-t border-border/50">
                  <span className="flex items-center gap-1">
                    <MessageCircle size={10} />
                    Контекстный режим
                  </span>
                  <span>v2.0</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
