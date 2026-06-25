import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  gpuPlatforms,
  calcMonthlyCost,
  calcYearlySavings,
  gpuSpecs,
  type GpuPlatform,
} from '../data/gpuCosts';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  DollarSign,
  PiggyBank,
  TrendingDown,
} from 'lucide-react';

/* ── Animated count-up ── */
function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const display = useMemo(() => {
    const n = value.toFixed(decimals);
    const parts = n.split('.');
    const intPart = parts[0]!;
    const decPart = decimals > 0 ? `.${parts[1]}` : '';
    // Add commas
    const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${prefix}${formatted}${decPart}${suffix}`;
  }, [value, prefix, suffix, decimals]);

  return (
    <motion.span
      className="tabular-nums"
      key={display}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {display}
    </motion.span>
  );
}

/* ── Platform cost card ── */
function PlatformCard({
  platform,
  monthlyCost,
  isFree,
  hoursPerWeek,
  index,
}: {
  platform: GpuPlatform;
  monthlyCost: number;
  isFree: boolean;
  hoursPerWeek: number;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="relative glass rounded-2xl border backdrop-blur-xl overflow-hidden transition-all"
      style={{
        borderColor: isFree ? `${platform.color}40` : 'var(--color-border)',
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${platform.color}, ${platform.color}66)` }}
      />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{platform.icon}</span>
            <div>
              <h3 className="font-display font-bold text-sm text-text-bright">
                {platform.name}
              </h3>
              <span
                className="font-mono text-[0.55rem] tracking-wider uppercase font-bold"
                style={{ color: platform.color }}
              >
                {platform.gpuCount}× T4
              </span>
            </div>
          </div>

          {/* Cost */}
          <div className="text-right">
            {isFree ? (
              <div className="font-display text-2xl font-black text-green drop-shadow-[0_0_12px_rgba(0,255,179,0.5)]">
                $0
              </div>
            ) : (
              <div className="font-display text-2xl font-black" style={{ color: platform.color }}>
                ~$<AnimatedNumber value={monthlyCost} decimals={0} />
              </div>
            )}
            <div className="text-[0.55rem] font-mono text-text-muted tracking-wider mt-0.5">
              /мес
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-text-muted text-xs leading-relaxed mb-3">{platform.description}</p>

        {/* Pros/Cons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="space-y-1">
            {platform.pros.map((p, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[0.6rem] text-text-dim">
                <span className="text-green shrink-0 mt-0.5">+</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1">
            {platform.cons.map((c, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[0.6rem] text-text-dim">
                <span className="text-magenta shrink-0 mt-0.5">−</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly bar chart */}
        {!isFree && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-[0.55rem] font-mono text-text-muted mb-1">
              <span>Стоимость за {hoursPerWeek} ч/нед</span>
              <span>${monthlyCost.toFixed(0)}</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${platform.color}, ${platform.color}88)`,
                  width: `${Math.min((monthlyCost / 200) * 100, 100)}%`,
                }}
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min((monthlyCost / 200) * 100, 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
              />
            </div>
          </div>
        )}

        {/* Savings badge for Kaggle */}
        {isFree && (
          <div className="flex items-center gap-2 bg-green/8 border border-green/20 rounded-lg px-3 py-2 mb-3">
            <PiggyBank size={14} className="text-green shrink-0" />
            <span className="text-[0.6rem] font-bold text-green tracking-wider">
              ЭКОНОМИЯ ДО $100+/МЕС
            </span>
          </div>
        )}

        {/* Expand button */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 font-mono text-[0.6rem] font-bold tracking-wider text-text-dim hover:text-cyan transition-colors w-full"
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? 'Скрыть детали' : 'Подробнее'}
        </button>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              className="mt-3 pt-3 border-t border-border space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-2 gap-2 text-[0.6rem] font-mono">
                <div className="bg-white/[0.03] rounded-lg p-2.5">
                  <span className="text-text-muted">GPU</span>
                  <div className="text-text-bright font-bold mt-0.5">{platform.gpuCount}× T4</div>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-2.5">
                  <span className="text-text-muted">Ставка</span>
                  <div className="text-text-bright font-bold mt-0.5">
                    ${platform.ratePerHourT4}/h
                  </div>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-2.5">
                  <span className="text-text-muted">Лимит/нед</span>
                  <div className="text-text-bright font-bold mt-0.5">
                    {platform.freeHoursPerWeek > 0 ? `${platform.freeHoursPerWeek}h` : '—'}
                  </div>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-2.5">
                  <span className="text-text-muted">Подписка</span>
                  <div className="text-text-bright font-bold mt-0.5">
                    ${platform.monthlySub}/мес
                  </div>
                </div>
              </div>

              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] font-bold text-cyan hover:text-text-bright transition-colors"
              >
                <ExternalLink size={10} />
                Открыть {platform.name}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ── Savings highlight bar ── */
function SavingsBar({
  platform,
  savings,
  index,
}: {
  platform: GpuPlatform;
  savings: number;
  index: number;
}) {
  const maxSavings = 2000;
  const pct = Math.min((savings / maxSavings) * 100, 100);

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <span className="text-lg shrink-0 w-8 text-center">{platform.icon}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between text-[0.6rem] font-mono text-text-muted mb-1">
          <span style={{ color: platform.color }} className="font-bold">
            {platform.name}
          </span>
          <span className="text-green font-bold">
            +$<AnimatedNumber value={savings} decimals={0} /> /год
          </span>
        </div>
        <div className="h-3 rounded-full bg-white/[0.05] overflow-hidden relative">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${platform.color}, ${platform.color}66)`,
            }}
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 + 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)`,
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['100% 0', '-100% 0'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ── GPU Specs table ── */
function GpuSpecsTable() {
  return (
    <div className="glass rounded-2xl border border-border backdrop-blur-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border bg-white/[0.02]">
        <span className="font-display font-bold text-sm text-text-bright">Характеристики GPU</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[0.65rem] font-mono">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-2.5 text-text-muted font-bold tracking-wider">Модель</th>
              <th className="text-left px-4 py-2.5 text-text-muted font-bold tracking-wider">VRAM</th>
              <th className="text-left px-4 py-2.5 text-text-muted font-bold tracking-wider">Архитектура</th>
              <th className="text-left px-4 py-2.5 text-text-muted font-bold tracking-wider">FP16 TFLOPS</th>
            </tr>
          </thead>
          <tbody>
            {gpuSpecs.map((spec, i) => (
              <tr key={spec.name} className={i < gpuSpecs.length - 1 ? 'border-b border-border/50' : ''}>
                <td className="px-5 py-2.5 text-text-bright font-bold">{spec.name}</td>
                <td className="px-4 py-2.5 text-text-dim">{spec.vram}</td>
                <td className="px-4 py-2.5 text-text-dim">{spec.architecture}</td>
                <td className="px-4 py-2.5 text-cyan">{spec.fp16Tflops}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Main component ── */
export function GPUCostCalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState(30);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setHoursPerWeek(Number(e.target.value));
  }, []);

  const monthlyCosts = useMemo(
    () =>
      gpuPlatforms.map((p) => ({
        platform: p,
        cost: calcMonthlyCost(p, hoursPerWeek),
        isFree: p.id === 'kaggle',
      })),
    [hoursPerWeek],
  );

  const yearlySavings = useMemo(
    () =>
      gpuPlatforms
        .filter((p) => p.id !== 'kaggle')
        .map((p) => ({
          platform: p,
          savings: calcYearlySavings(hoursPerWeek, p),
        })),
    [hoursPerWeek],
  );

  // Which non-free platform is cheapest
  const cheapestPaid = useMemo(() => {
    const paid = monthlyCosts.filter((m) => !m.isFree);
    return paid.reduce((min, curr) => (curr.cost < min.cost ? curr : min), paid[0]!);
  }, [monthlyCosts]);

  const savingsVsCheapest = cheapestPaid.cost * 12;

  return (
    <section className="relative max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-cyan bg-cyan/8 px-3.5 py-1.5 rounded-full mb-5 border border-cyan/20">
          Калькулятор
        </span>
        <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-display font-extrabold text-text-bright mb-3">
          GPU Cost Calculator
        </h2>
        <p className="text-text-muted text-[1.08rem] max-w-[620px] mx-auto leading-relaxed">
          Сравни стоимость GPU-облаков. Двигай слайдер — смотри, сколько экономишь с Kaggle.
        </p>
      </div>

      {/* Slider */}
      <div className="max-w-[600px] mx-auto mb-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-cyan" />
            <span className="font-display font-bold text-sm text-text-bright">
              Часов в неделю
            </span>
          </div>
          <span className="font-mono text-2xl font-extrabold text-cyan drop-shadow-[0_0_10px_var(--color-glow-cyan)]">
            {hoursPerWeek}
          </span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={1}
            max={168}
            value={hoursPerWeek}
            onChange={handleSliderChange}
            aria-label="Часов в неделю"
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/[0.08] outline-none
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-cyan
              [&::-webkit-slider-thumb]:shadow-[0_0_12px_var(--color-glow-cyan),0_0_24px_var(--color-glow-cyan)]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:w-5
              [&::-moz-range-thumb]:h-5
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-cyan
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:shadow-[0_0_12px_var(--color-glow-cyan)]
              [&::-moz-range-thumb]:cursor-pointer
              [&::-moz-range-track]:bg-white/[0.08]
              [&::-moz-range-track]:rounded-full
              [&::-moz-range-track]:h-2"
            style={{
              background: `linear-gradient(90deg, #00F5FF ${(hoursPerWeek / 168) * 100}%, rgba(255,255,255,0.08) ${(hoursPerWeek / 168) * 100}%)`,
            }}
          />
          {/* Tick marks */}
          <div className="flex justify-between mt-1.5 px-0.5">
            {[1, 30, 60, 90, 120, 168].map((v) => (
              <span
                key={v}
                className={`font-mono text-[0.5rem] ${hoursPerWeek >= v ? 'text-cyan/60' : 'text-text-muted'}`}
              >
                {v}h
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Platform cards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
        {monthlyCosts.map(({ platform, cost, isFree }, i) => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            monthlyCost={cost}
            isFree={isFree}
            hoursPerWeek={hoursPerWeek}
            index={i}
          />
        ))}
      </div>

      {/* Summary row */}
      <motion.div
        className="grid sm:grid-cols-3 gap-4 mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="glass rounded-2xl border border-border backdrop-blur-xl p-5 text-center">
          <TrendingDown size={20} className="text-green mx-auto mb-2" />
          <div className="font-mono text-2xl font-extrabold text-green drop-shadow-[0_0_10px_rgba(0,255,179,0.3)]">
            $0
          </div>
          <div className="text-[0.6rem] font-mono text-text-muted tracking-wider mt-1">
            Стоимость Kaggle / мес
          </div>
        </div>

        <div className="glass rounded-2xl border border-border backdrop-blur-xl p-5 text-center">
          <DollarSign size={20} className="text-magenta mx-auto mb-2" />
          <div className="font-mono text-2xl font-extrabold text-magenta drop-shadow-[0_0_10px_var(--color-glow-magenta)]">
            ~$<AnimatedNumber value={cheapestPaid.cost} decimals={0} />
          </div>
          <div className="text-[0.6rem] font-mono text-text-muted tracking-wider mt-1">
            Дешёвая альтернатива / мес
          </div>
        </div>

        <div className="glass rounded-2xl border border-border backdrop-blur-xl p-5 text-center">
          <PiggyBank size={20} className="text-yellow mx-auto mb-2" />
          <div className="font-mono text-2xl font-extrabold text-yellow drop-shadow-[0_0_10px_rgba(252,238,10,0.3)]">
            ~$<AnimatedNumber value={savingsVsCheapest} decimals={0} />
          </div>
          <div className="text-[0.6rem] font-mono text-text-muted tracking-wider mt-1">
            Экономия в год с Kaggle
          </div>
        </div>
      </motion.div>

      {/* Savings comparison bars */}
      <motion.div
        className="glass rounded-2xl border border-border backdrop-blur-xl p-5 sm:p-6 mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-5">
          <PiggyBank size={18} className="text-green" />
          <h3 className="font-display font-bold text-sm text-text-bright">
            Годовая экономия — Kaggle vs альтернативы
          </h3>
        </div>
        <div className="space-y-3">
          {yearlySavings.map(({ platform, savings }, i) => (
            <SavingsBar key={platform.id} platform={platform} savings={savings} index={i} />
          ))}
        </div>
      </motion.div>

      {/* GPU Specs table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <GpuSpecsTable />
      </motion.div>

      <p className="mt-4 text-center text-[0.6rem] font-mono text-text-muted">
        Цены указаны на июнь 2026 и могут меняться. Всегда проверяйте актуальные тарифы на сайтах платформ.
      </p>
    </section>
  );
}
