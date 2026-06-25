import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  milestones,
  phaseColors,
  getProgress,
  type Milestone,
  type MilestoneStatus,
} from '../data/roadmap';
import {
  CheckCircle,
  Circle,
  Sparkles,
  Filter,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

/* ── Filter buttons ── */
interface FilterOption {
  id: MilestoneStatus | 'all';
  label: string;
  color: string;
}

const filters: FilterOption[] = [
  { id: 'all', label: 'Все', color: '#00F5FF' },
  { id: 'done', label: 'Завершено', color: '#00FFB3' },
  { id: 'current', label: 'В работе', color: '#00F5FF' },
  { id: 'planned', label: 'Запланировано', color: '#7B61FF' },
  { id: 'future', label: 'В будущем', color: 'rgba(255,255,255,0.25)' },
];

/* ── Milestone card ── */
function MilestoneCard({
  milestone,
  index,
  statusColor,
}: {
  milestone: Milestone;
  index: number;
  statusColor: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const isDone = milestone.status === 'done';
  const isCurrent = milestone.status === 'current';

  return (
    <motion.div
      className="relative pl-8 sm:pl-10 pb-6 last:pb-0"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      {/* Timeline line */}
      <div
        className="absolute left-[11px] top-4 bottom-0 w-[2px]"
        style={{
          background: isDone
            ? `linear-gradient(180deg, ${statusColor}, ${statusColor}40)`
            : 'rgba(255,255,255,0.06)',
        }}
      />

      {/* Dot indicator */}
      <div
        className="absolute left-0 top-1 w-[24px] h-[24px] rounded-full flex items-center justify-center border-2 z-10"
        style={{
          borderColor: statusColor,
          background: isDone ? statusColor : 'var(--color-bg-deep)',
        }}
      >
        {isDone ? (
          <CheckCircle size={14} className="text-bg-deep" />
        ) : isCurrent ? (
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: statusColor }}
          />
        ) : (
          <Circle size={10} style={{ color: statusColor }} />
        )}
      </div>

      {/* Card */}
      <div
        className={`glass rounded-xl border backdrop-blur-xl overflow-hidden transition-all ${
          isCurrent ? 'shadow-[0_0_20px_rgba(0,245,255,0.08)]' : ''
        }`}
        style={{
          borderColor: isCurrent ? `${statusColor}30` : 'var(--color-border)',
        }}
      >
        <div className="p-4 sm:p-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{
                  background: `${statusColor}12`,
                  border: `1px solid ${statusColor}25`,
                }}
              >
                {milestone.icon}
              </div>

              <div className="min-w-0">
                {/* Phase badge */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="font-mono text-[0.5rem] font-bold tracking-wider px-1.5 py-0.5 rounded-full"
                    style={{
                      color: statusColor,
                      background: `${statusColor}10`,
                      border: `1px solid ${statusColor}25`,
                    }}
                  >
                    {milestone.phase}
                  </span>
                  {isCurrent && (
                    <span className="font-mono text-[0.45rem] font-bold tracking-wider text-bg-deep bg-cyan px-1.5 py-0.5 rounded-full">
                      CURRENT
                    </span>
                  )}
                  {milestone.date && (
                    <span className="font-mono text-[0.45rem] text-text-muted">
                      {milestone.date}
                    </span>
                  )}
                </div>
                <h3 className="font-display font-bold text-sm text-text-bright mt-0.5">
                  {milestone.title}
                </h3>
              </div>
            </div>

            {/* Expand button */}
            {milestone.features && milestone.features.length > 0 && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
              >
                {expanded ? (
                  <ChevronUp size={14} className="text-text-dim" />
                ) : (
                  <ChevronDown size={14} className="text-text-dim" />
                )}
              </button>
            )}
          </div>

          {/* Description */}
          <p className="text-text-muted text-xs leading-relaxed mt-2">{milestone.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {milestone.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[0.5rem] font-bold tracking-wider px-1.5 py-0.5 rounded-full"
                style={{
                  color: statusColor,
                  background: `${statusColor}08`,
                  border: `1px solid ${statusColor}15`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Expanded features */}
          <AnimatePresence>
            {expanded && milestone.features && (
              <motion.div
                className="mt-3 pt-3 border-t border-border space-y-1.5"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {milestone.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[0.65rem] text-text-dim">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: statusColor }}
                    />
                    {f}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main component ── */
export function Roadmap() {
  const [activeFilter, setActiveFilter] = useState<MilestoneStatus | 'all'>('all');
  const progress = useMemo(getProgress, []);

  const filtered = useMemo(
    () =>
      activeFilter === 'all'
        ? milestones
        : milestones.filter((m) => m.status === activeFilter),
    [activeFilter],
  );

  const handleFilter = useCallback((f: MilestoneStatus | 'all') => {
    setActiveFilter(f);
  }, []);

  return (
    <section id="roadmap" className="relative max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-cyan bg-cyan/8 px-3.5 py-1.5 rounded-full mb-5 border border-cyan/20">
          Дорожная карта
        </span>
        <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-display font-extrabold text-text-bright mb-3">
          Development Roadmap
        </h2>
        <p className="text-text-muted text-[1.08rem] max-w-[620px] mx-auto leading-relaxed">
          Все 19 фаз разработки сайта. Завершённые, текущие и запланированные.
        </p>
      </div>

      {/* Progress bar */}
      <div className="max-w-[600px] mx-auto mb-8">
        <div className="flex items-center justify-between text-[0.6rem] font-mono mb-2">
          <span className="text-text-dim">
            <Sparkles size={10} className="inline mr-1 text-cyan" />
            Прогресс
          </span>
          <span className="text-cyan font-bold">
            {progress.done}/{progress.total} ({progress.percent}%)
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full relative"
            style={{
              background: 'linear-gradient(90deg, #00FFB3, #00F5FF, #7B61FF)',
            }}
            initial={{ width: 0 }}
            whileInView={{ width: `${progress.percent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['100% 0', '-100% 0'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>
        <div className="flex justify-between mt-1.5 text-[0.45rem] font-mono text-text-muted px-0.5">
          <span>Начато 24.06.2026</span>
          <span>Цель: 19 фаз</span>
        </div>
      </div>

      {/* Status badges row */}
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        {(['done', 'current', 'planned', 'future'] as MilestoneStatus[]).map((s) => {
          const count = milestones.filter((m) => m.status === s).length;
          return (
            <div
              key={s}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[0.55rem] font-mono"
              style={{
                borderColor: `${phaseColors[s]}20`,
                background: `${phaseColors[s]}06`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: phaseColors[s] }}
              />
              <span className="text-text-dim capitalize">{s}</span>
              <span className="font-bold" style={{ color: phaseColors[s] }}>{count}</span>
            </div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center justify-center gap-1 mb-8">
        <Filter size={12} className="text-text-muted" />
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => handleFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg font-bold text-[0.6rem] tracking-wider transition-all ${
              activeFilter === f.id
                ? 'text-bg-deep shadow-[0_0_12px_rgba(0,245,255,0.3)]'
                : 'text-text-dim border border-border hover:text-text-bright hover:border-cyan/30'
            }`}
            style={
              activeFilter === f.id ? { background: f.color } : { background: 'transparent' }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="max-w-[720px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.map((m, i) => (
              <MilestoneCard
                key={m.phase}
                milestone={m}
                index={i}
                statusColor={phaseColors[m.status]}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="text-3xl mb-3">🔍</div>
            <p className="text-text-muted text-sm">Нет вех с таким статусом</p>
          </div>
        )}
      </div>
    </section>
  );
}
