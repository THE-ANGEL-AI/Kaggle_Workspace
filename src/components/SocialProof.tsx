import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  proofCounters,
  milestoneMetrics,
  testimonials,
} from '../data/socialProof';
import { Star, TrendingUp, Zap, Clock, Users, Quote } from 'lucide-react';
import { AnimatedCounter } from './ui/AnimatedCounter';
import { SectionHeader } from './SectionHeader';

/* ── Counter Card ── */
function CounterCard({
  counter,
  index,
}: {
  counter: (typeof proofCounters)[0];
  index: number;
}) {
  return (
    <motion.div
      className="group relative glass rounded-xl border border-border p-4 sm:p-5 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -3 }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-30"
        style={{ background: counter.color }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl">{counter.icon}</span>
          <span
            className="font-mono text-[0.45rem] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded"
            style={{
              color: counter.color,
              background: `${counter.color}12`,
              border: `1px solid ${counter.color}25`,
            }}
          >
            {counter.label.split(' ').pop()}
          </span>
        </div>

        <div
          className="font-mono text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ color: counter.color }}
        >
          <AnimatedCounter
            value={counter.value}
            suffix={counter.suffix}
            prefix={counter.prefix}
            locale="ru-RU"
            easePower={4}
            threshold={0.2}
          />
        </div>

        <div className="text-[0.65rem] text-text-muted mt-1 font-medium">
          {counter.label}
        </div>

        <p className="text-[0.5rem] text-text-dim mt-1.5 leading-relaxed">
          {counter.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Metric Card ── */
function MetricCard({
  metric,
  index,
}: {
  metric: (typeof milestoneMetrics)[0];
  index: number;
}) {
  return (
    <motion.div
      className="glass rounded-xl border border-border p-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35, delay: 0.2 + index * 0.08 }}
      whileHover={{ y: -2 }}
    >
      <div
        className="font-mono text-xl sm:text-2xl font-extrabold"
        style={{ color: metric.color }}
      >
        {metric.value}
      </div>
      <div className="text-[0.6rem] text-text-muted mt-1 font-medium uppercase tracking-wider">
        {metric.label}
      </div>
      <p className="text-[0.5rem] text-text-dim mt-1">{metric.description}</p>
    </motion.div>
  );
}

/* ── Parallax Background ── */
function ParallaxBg() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 0.5, 1], [-100, 0, 100]);
  const y2 = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  return (
    <motion.div ref={sectionRef} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
      {/* Gradient orbs */}
      <motion.div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{
          y: y1,
          background:
            'radial-gradient(circle, rgba(0,245,255,0.08), rgba(123,97,255,0.04), transparent)',
        }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{
          y: y2,
          background:
            'radial-gradient(circle, rgba(168,85,247,0.08), rgba(255,0,122,0.04), transparent)',
        }}
      />
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <defs>
          <pattern id="proofGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0L0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#proofGrid)" />
      </svg>
    </motion.div>
  );
}

/* ── Main SocialProof Section ── */
export function SocialProof() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = useCallback(() => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const t = setInterval(nextTestimonial, 5000);
    return () => clearInterval(t);
  }, [nextTestimonial]);

  return (
    <section
      id="social-proof"
      className="relative max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20 overflow-hidden"
    >
      <ParallaxBg />

      <SectionHeader
        badge="PHASE 16"
        title={
          <>
            Социальное{' '}
            <span className="bg-gradient-to-r from-cyan via-violet to-purple bg-clip-text text-transparent">
              доказательство
            </span>
          </>
        }
        description="Числа говорят громче слов. 428+ участников, 12 800+ генераций и растущее сообщество."
        className="mb-12"
      />

      {/* Counters grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mb-8 relative z-10">
        {proofCounters.map((counter, i) => (
          <CounterCard key={counter.label} counter={counter} index={i} />
        ))}
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-8 relative z-10">
        {milestoneMetrics.map((metric, i) => (
          <MetricCard key={metric.label} metric={metric} index={i} />
        ))}
      </div>

      {/* Testimonials + Impact row */}
      <div className="grid lg:grid-cols-3 gap-4 relative z-10">
        {/* Featured testimonial (rotating) */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Quote size={14} className="text-cyan" />
            <span className="font-mono text-[0.55rem] font-bold tracking-wider text-text-dim uppercase">
              Что говорят пользователи
            </span>
          </div>

          <div className="relative">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="glass rounded-xl border border-border p-5 sm:p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={
                  i === activeTestimonial
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: -10 }
                }
                transition={{ duration: 0.4 }}
                style={{
                  display: i === activeTestimonial ? 'block' : 'none',
                }}
              >
                <p className="text-sm text-text-bright leading-relaxed italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/50">
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <div className="font-display font-bold text-sm text-text-bright">
                      {t.author}
                    </div>
                    <div className="text-xs text-text-dim">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Nav dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === activeTestimonial
                      ? 'bg-cyan w-6 shadow-[0_0_8px_rgba(0,245,255,0.4)]'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  aria-label={`Отзыв ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Impact summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-green" />
            <span className="font-mono text-[0.55rem] font-bold tracking-wider text-text-dim uppercase">
              Ключевые метрики
            </span>
          </div>

          {[
            {
              icon: Users,
              label: 'Рост за месяц',
              value: '+32%',
              color: '#00F5FF',
            },
            {
              icon: Zap,
              label: 'Генераций/день',
              value: '~85',
              color: '#7B61FF',
            },
            {
              icon: Clock,
              label: 'Online в пике',
              value: '30–50',
              color: '#A855F7',
            },
            {
              icon: Star,
              label: 'Рейтинг проекта',
              value: '4.9 ★',
              color: '#FCEE0A',
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                className="glass rounded-xl border border-border p-3 sm:p-4 flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
              >
                <Icon size={18} style={{ color: item.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[0.5rem] text-text-dim uppercase tracking-wider">
                    {item.label}
                  </div>
                  <div
                    className="font-mono text-sm font-bold"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
