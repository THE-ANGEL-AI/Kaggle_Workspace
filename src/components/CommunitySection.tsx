import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  socialPlatforms,
  communityStats,
  growthMetrics,
  communityFeatures,
  type SocialPlatform,
} from '../data/community';
import { ExternalLink, Users, Sparkles, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { AnimatedCounter } from './ui/AnimatedCounter';
import { SectionHeader } from './SectionHeader';

/* ── Stat Card ── */
function StatCard({ stat, index }: { stat: typeof communityStats[0]; index: number }) {
  return (
    <motion.div
      className="glass rounded-xl border border-border p-4 sm:p-5 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <div className="text-2xl mb-1">{stat.icon}</div>
      <div
        className="font-mono text-xl sm:text-2xl font-extrabold"
        style={{ color: stat.color }}
      >
        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
      </div>
      <div className="text-[0.65rem] text-text-muted mt-1 font-medium tracking-wide">
        {stat.label}
      </div>
    </motion.div>
  );
}

/* ── Social Platform Card ── */
function PlatformCard({
  platform,
  isExpanded,
  onToggle,
}: {
  platform: SocialPlatform;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      className="glass rounded-xl border border-border overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -2 }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{platform.icon}</span>
            <div>
              <h3 className="font-display font-bold text-sm text-text-bright">{platform.name}</h3>
              <p className="text-text-muted text-[0.65rem] mt-0.5">{platform.description}</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.03] hover:bg-white/[0.08] transition-colors text-text-dim hover:text-text-bright"
            aria-label={isExpanded ? 'Свернуть' : 'Развернуть'}
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {platform.stats.map((stat) => (
            <div key={stat.label} className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <div className="font-mono text-[0.55rem] font-bold" style={{ color: platform.color }}>
                {stat.value}
              </div>
              <div className="text-[0.45rem] text-text-muted mt-0.5 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <a
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[0.6rem] font-bold tracking-wider transition-all"
          style={{
            color: platform.color,
            border: `1px solid ${platform.color}30`,
            background: `${platform.color}08`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${platform.color}20`;
            e.currentTarget.style.borderColor = `${platform.color}60`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `${platform.color}08`;
            e.currentTarget.style.borderColor = `${platform.color}30`;
          }}
        >
          {platform.cta}
          <ExternalLink size={10} className="transition-transform group-hover/btn:translate-x-0.5" />
        </a>

        {/* Expanded details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-[0.55rem] text-text-muted font-mono">
                  <TrendingUp size={10} className="text-green" />
                  Активность за неделю
                </div>
                <div className="mt-2 flex gap-1">
                  {[30, 55, 45, 70, 60, 85, 75].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <div
                        className="w-full rounded-sm transition-all duration-500"
                        style={{
                          height: `${h * 0.4}px`,
                          background: platform.color,
                          opacity: 0.3 + h * 0.006,
                        }}
                      />
                      <span className="text-[0.35rem] text-text-muted font-mono">
                        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ── Growth Chart (SVG) ── */
function GrowthChart() {
  const maxVal = Math.max(...growthMetrics.map((m) => m.value));
  const padding = { top: 20, right: 16, bottom: 30, left: 40 };
  const width = 600;
  const height = 220;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = growthMetrics.map((m, i) => ({
    x: padding.left + (i / (growthMetrics.length - 1)) * chartW,
    y: padding.top + chartH - (m.value / maxVal) * chartH,
    ...m,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  return (
    <div className="glass rounded-xl border border-border p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-sm text-text-bright">Рост сообщества</h3>
          <p className="text-text-muted text-[0.65rem] mt-0.5">Участников по месяцам, 2026</p>
        </div>
        <div className="flex items-center gap-1.5 text-[0.55rem] font-mono text-cyan">
          <TrendingUp size={12} />
          +950% за 6 мес
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const y = padding.top + chartH - frac * chartH;
          const val = Math.round(maxVal * frac);
          return (
            <g key={frac}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
              <text x={padding.left - 6} y={y + 3} textAnchor="end" fill="rgba(255,255,255,0.15)" fontSize="8" fontFamily="JetBrains Mono">
                {val}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <defs>
          <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00F5FF" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path
          d={`${linePath} L${points[points.length - 1].x},${padding.top + chartH} L${points[0].x},${padding.top + chartH} Z`}
          fill="url(#growthGrad)"
        />

        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="#00F5FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        {/* Gradient dot on line */}
        {points.map((p) => (
          <motion.circle
            key={p.month}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#0A0A1E"
            stroke="#00F5FF"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 1.5 + p.month.length * 0.05 }}
          />
        ))}

        {/* Month labels */}
        {points.map((p) => (
          <text
            key={p.month}
            x={p.x}
            y={padding.top + chartH + 18}
            textAnchor="middle"
            fill="rgba(255,255,255,0.2)"
            fontSize="8"
            fontFamily="JetBrains Mono"
          >
            {p.month}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ── Community Feature Card ── */
function FeatureCard({ feature, index }: { feature: typeof communityFeatures[0]; index: number }) {
  return (
    <motion.div
      className="glass rounded-xl border border-border p-4 sm:p-5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      whileHover={{ y: -2 }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 text-sm"
        style={{
          background: `linear-gradient(135deg, ${['#00F5FF', '#7B61FF', '#A855F7', '#00FFB3'][index]}20, transparent)`,
          border: `1px solid ${['#00F5FF', '#7B61FF', '#A855F7', '#00FFB3'][index]}30`,
        }}
      >
        <Sparkles size={14} style={{ color: ['#00F5FF', '#7B61FF', '#A855F7', '#00FFB3'][index] }} />
      </div>
      <h4 className="font-display font-bold text-[0.75rem] text-text-bright mb-1">{feature.title}</h4>
      <p className="text-text-muted text-[0.65rem] leading-relaxed">{feature.desc}</p>
    </motion.div>
  );
}

/* ── Main Community Section ── */
export function CommunitySection() {
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

  const togglePlatform = useCallback((id: string) => {
    setExpandedPlatform((prev) => (prev === id ? null : id));
  }, []);

  return (
    <section id="community" className="relative max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-cyan/[0.03] via-violet/[0.02] to-transparent pointer-events-none" />

      <SectionHeader
        badge="PHASE 15"
        title={
          <>
            Сообщество{' '}
            <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">THE ANGEL</span>
          </>
        }
        description="420+ участников, 12 800+ генераций, 4 платформы. Присоединяйся к растущему сообществу."
        className="mb-12"
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mb-10">
        {communityStats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* Main grid: Platforms + Chart */}
      <div className="grid lg:grid-cols-2 gap-5 mb-10">
        {/* Social platforms */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Users size={14} className="text-cyan" />
            <span className="font-mono text-[0.55rem] font-bold tracking-wider text-text-dim uppercase">Платформы</span>
          </div>
          {socialPlatforms.map((platform) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              isExpanded={expandedPlatform === platform.id}
              onToggle={() => togglePlatform(platform.id)}
            />
          ))}
        </div>

        {/* Growth chart */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-green" />
            <span className="font-mono text-[0.55rem] font-bold tracking-wider text-text-dim uppercase">Рост</span>
          </div>
          <GrowthChart />
          <div className="grid grid-cols-2 gap-3">
            {communityFeatures.map((feature, i) => (
              <FeatureCard key={feature.title} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <a
          href="https://discord.gg/theangel"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-sm bg-gradient-to-r from-cyan to-violet text-deep hover:shadow-[0_0_24px_rgba(0,245,255,0.3),0_0_60px_rgba(123,97,255,0.2)] hover:-translate-y-0.5 transition-all"
        >
          <Users size={16} />
          Присоединиться к сообществу
          <ExternalLink size={14} className="transition-transform group-hover:translate-x-0.5" />
        </a>
        <p className="text-text-muted text-[0.6rem] mt-3 font-mono">
          Discord · VK · GitHub · Boosty — везде @THE_ANGEL_AI
        </p>
      </motion.div>
    </section>
  );
}
