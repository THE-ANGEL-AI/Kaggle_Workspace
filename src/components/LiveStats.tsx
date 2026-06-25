import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ShieldCheck, Settings, RefreshCw } from 'lucide-react';

const tiles = [
  { icon: Clock, label: 'часов GPU в неделю (free tier)', unit: 'h', tone: 'cyan' },
  { icon: ShieldCheck, label: 'идемпотентность скриптов', unit: '%', tone: 'magenta' },
  { icon: Settings, label: 'этапов без переустановки', unit: '', tone: 'violet' },
  { icon: RefreshCw, label: 'секунд до авто-восстановления', unit: 's', tone: 'yellow' },
];

const toneStyles: Record<string, string> = {
  cyan: 'border-cyan/25 shadow-[0_0_24px_rgba(0,240,255,0.06)] hover:border-cyan/50',
  magenta: 'border-magenta/25 shadow-[0_0_24px_rgba(255,0,122,0.06)] hover:border-magenta/50',
  violet: 'border-violet/25 shadow-[0_0_24px_rgba(139,47,255,0.06)] hover:border-violet/50',
  yellow: 'border-yellow/25 shadow-[0_0_24px_rgba(252,238,10,0.06)] hover:border-yellow/50',
};
const valueStyles: Record<string, string> = {
  cyan: 'text-cyan drop-shadow-[0_0_14px_var(--color-glow-cyan)]',
  magenta: 'text-magenta drop-shadow-[0_0_14px_var(--color-glow-magenta)]',
  violet: 'text-violet drop-shadow-[0_0_14px_var(--color-glow-violet)]',
  yellow: 'text-yellow drop-shadow-[0_0_14px_rgba(252,238,10,0.45)]',
};

export function LiveStats() {
  const [stats, setStats] = useState({ gpuHours: 42, idempotent: 99, stagesOkoted: 12, recovery: 12 });

  useEffect(() => {
    const t = setInterval(() => {
      setStats((prev) => ({
        gpuHours: prev.gpuHours + (Math.random() > 0.6 ? 1 : 0),
        idempotent: Math.min(99.9, prev.idempotent + (Math.random() > 0.95 ? 0.1 : 0)),
        stagesOkoted: prev.stagesOkoted,
        recovery: Math.max(11, Math.min(14, prev.recovery + (Math.random() > 0.7 ? 1 : -1))),
      }));
    }, 1800);
    return () => clearInterval(t);
  }, []);

  const values = [stats.gpuHours.toString(), stats.idempotent.toFixed(1), stats.stagesOkoted.toString(), stats.recovery.toString()];

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20">
      <div className="text-center mb-14">
        <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-cyan bg-cyan/8 px-3.5 py-1.5 rounded-full mb-5 border border-cyan/20">Live</span>
        <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-display font-extrabold text-text-bright mb-3">Live дашборд</h2>
        <p className="text-text-muted text-[1.08rem] max-w-[660px] mx-auto leading-relaxed">Атмосферный тикер. Цифры обновляются каждые ~2 секунды.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[980px] mx-auto">
        {tiles.map((t, i) => {
          const Icon = t.icon;
          return (
            <motion.div
              key={t.label}
              className={`relative p-5 sm:p-6 bg-glass backdrop-blur-md border rounded-[20px] ${toneStyles[t.tone]} hover:-translate-y-0.5 transition-all duration-280`}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.8, times: [0, 0.5, 1], repeat: Infinity, repeatDelay: 4 }}
            >
              <Icon className="w-6 h-6 text-text-dim mb-2" />
              <div className="font-mono text-[2.4rem] font-extrabold tracking-wide flex items-baseline gap-1">
                <span className={valueStyles[t.tone]}>{values[i]}</span>
                {t.unit && <span className="text-sm font-semibold text-text-dim">{t.unit}</span>}
              </div>
              <div className="text-sm text-text-muted mt-1">{t.label}</div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
