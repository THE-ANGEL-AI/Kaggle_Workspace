import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Terminal,
  Package,
  Cpu,
  Globe,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { SectionHeader } from './SectionHeader';

/* ── Step data ── */
interface Step {
  num: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  detail: string;
  code: string;
  time: string;
  color: string;
}

const steps: Step[] = [
  {
    num: '01',
    icon: Terminal,
    title: 'Клонируй репозиторий',
    subtitle: 'Одна команда — все скрипты у тебя',
    detail: 'Скопируй репозиторий в Kaggle-блокнот. Git clone + pull на случай повторного запуска. Флаг || — если папка уже есть, просто обновляется.',
    code: '!git clone https://github.com/THE-ANGEL-AI/Kaggle_Workspace_FreeGPU.git || git -C Kaggle_Workspace_FreeGPU pull',
    time: '~5s',
    color: '#00F5FF',
  },
  {
    num: '02',
    icon: Package,
    title: 'Запусти установку',
    subtitle: 'uv + Python 3.12 + torch cu130 + ComfyUI',
    detail: 'Первый скрипт instal_comfyui.py поднимает venv через uv, ставит torch cu130, ComfyUI и Manager. Идемпотентно — если уже стоит, пропускает шаг.',
    code: '!python Kaggle_Workspace_FreeGPU/instal/instal_comfyui.py',
    time: '~40s',
    color: '#7B61FF',
  },
  {
    num: '03',
    icon: Cpu,
    title: 'Ноды и модели',
    subtitle: 'Симлинки на Flux2 GGUF, LTX 2.3, TTS',
    detail: 'Instal_castom_node.py создаёт симлинки на модели из /kaggle/input и доустанавливает недостающие кастомные ноды через ComfyUI-Manager.',
    code: '!python Kaggle_Workspace_FreeGPU/instal/instal_castom_node.py',
    time: '~25s',
    color: '#A855F7',
  },
  {
    num: '04',
    icon: Globe,
    title: 'Запуск + туннель',
    subtitle: 'ComfyUI на 2× T4 + Cloudflare Tunnel',
    detail: 'Start.py поднимает ComfyUI на двух Tesla T4, запускает Cloudflare-туннель и выводит публичный URL. Keep-alive кнопки не дают Kaggle усыпить сессию.',
    code: '%run Kaggle_Workspace_FreeGPU/instal/start.py',
    time: '~12s',
    color: '#00FFB3',
  },
  {
    num: '05',
    icon: Sparkles,
    title: 'Готово!',
    subtitle: 'Публичный URL — открывай ComfyUI',
    detail: 'Всё. У тебя есть рабочий ComfyUI с Flux2, LTX 2.3 и TTS на двух Tesla T4. Импортируй workflow из папки workflows/ и запускай генерацию.',
    code: 'https://your-tunnel-url.trycloudflare.com',
    time: '0s',
    color: '#FCEE0A',
  },
];

/* ── Single step card ── */
function StepCard({
  step,
  active,
  onCopy,
  copied,
}: {
  step: Step;
  active: boolean;
  onCopy: () => void;
  copied: boolean;
}) {
  const Icon = step.icon;

  return (
    <motion.div
      key={step.num}
      className="flex flex-col items-center text-center px-4 sm:px-8 py-6"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
        style={{
          background: `${step.color}15`,
          border: `1px solid ${step.color}30`,
        }}
      >
        <Icon size={30} style={{ color: step.color }} />
      </div>

      {/* Number badge */}
      <span
        className="font-mono text-[0.65rem] font-bold tracking-wider px-2.5 py-1 rounded-full mb-3"
        style={{
          color: step.color,
          background: `${step.color}10`,
          border: `1px solid ${step.color}25`,
        }}
      >
        ШАГ {step.num}
      </span>

      {/* Title */}
      <h3 className="font-display font-bold text-[1.4rem] text-text-bright mb-1">
        {step.title}
      </h3>
      <p className="text-text-dim text-sm mb-4">{step.subtitle}</p>

      {/* Detail */}
      <p className="text-text-muted text-sm leading-relaxed max-w-[520px] mb-5">
        {step.detail}
      </p>

      {/* Code block */}
      {active && (
        <motion.div
          className="w-full max-w-[580px] bg-bg-panel border border-border rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-border">
            <span className="font-mono text-[0.6rem] tracking-wider text-text-muted uppercase">
              {step.num === '05' ? 'URL' : 'Команда'}
            </span>
            <button
              onClick={onCopy}
              className="flex items-center gap-1.5 font-mono text-[0.65rem] text-text-dim hover:text-cyan transition-colors"
            >
              {copied ? <Check size={12} className="text-yellow" /> : <Copy size={12} />}
              {copied ? 'Скопировано' : 'Копировать'}
            </button>
          </div>
          <pre className="px-4 py-3 font-mono text-sm text-text overflow-x-auto whitespace-nowrap">
            {step.code}
          </pre>
        </motion.div>
      )}

      {/* Time badge */}
      {step.num !== '05' && (
        <span className="mt-4 font-mono text-[0.65rem] text-text-muted tracking-wider">
          ⏱ {step.time}
        </span>
      )}
    </motion.div>
  );
}

/* ── Progress dots ── */
function ProgressDots({
  total,
  current,
  colors,
  onJump,
}: {
  total: number;
  current: number;
  colors: string[];
  onJump: (idx: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-3 border-t border-border">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onJump(i)}
          className="relative group"
          aria-label={`Шаг ${i + 1}`}
        >
          <div
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: i <= current ? colors[i] ?? '#00F5FF' : 'rgba(255,255,255,0.12)',
              boxShadow:
                i <= current
                  ? `0 0 6px ${colors[i] ?? '#00F5FF'}80`
                  : 'none',
              transform: i === current ? 'scale(1.4)' : 'scale(1)',
            }}
          />
        </button>
      ))}
    </div>
  );
}

/* ── Main component ── */
export function InteractiveGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const totalSteps = steps.length;
  const step = steps[currentStep]!;

  // Auto-advance every 6 seconds (30s total)
  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!autoPlay || currentStep >= totalSteps - 1) return;
    timerRef.current = setTimeout(() => {
      if (mountedRef.current) {
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
      }
    }, 6000);
  }, [autoPlay, currentStep, totalSteps]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startTimer]);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  // Manually navigate
  const goNext = useCallback(() => {
    setAutoPlay(false);
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const goPrev = useCallback(() => {
    setAutoPlay(false);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const jumpTo = useCallback((idx: number) => {
    setAutoPlay(false);
    setCurrentStep(idx);
  }, []);

  const restart = useCallback(() => {
    setAutoPlay(true);
    setCurrentStep(0);
    setCopied(false);
  }, []);

  const copyCode = useCallback(() => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(step.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [step.code]);

  const colors = steps.map((s) => s.color);

  return (
    <section id="start" className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20">
      <SectionHeader
        badge="Интерактивный гид"
        title="30-секундный онбординг"
        description="Гайд сам переключает шаги. Нажимай ← → для ручного управления."
      />

      {/* Card */}
      <motion.div
        className="max-w-[720px] mx-auto bg-glass border border-border rounded-2xl overflow-hidden backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.50),0_0_40px_rgba(0,245,255,0.04)]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Progress bar */}
        <div className="h-1 bg-white/[0.06]">
          <motion.div
            className="h-full"
            style={{ background: `linear-gradient(90deg, ${colors.join(', ')})` }}
            initial={{ width: `${((currentStep) / (totalSteps - 1)) * 100}%` }}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Step content */}
        <div className="min-h-[340px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <StepCard
              step={step}
              active
              onCopy={copyCode}
              copied={copied}
            />
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-border">
          <button
            onClick={goPrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 font-mono text-xs text-text-dim hover:text-cyan transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={14} /> Назад
          </button>

          <div className="flex items-center gap-2">
            {autoPlay && currentStep < totalSteps - 1 && (
              <span className="font-mono text-[0.6rem] text-text-muted tracking-wider animate-pulse">
                авто ▶
              </span>
            )}
            <button
              onClick={restart}
              className="flex items-center gap-1 font-mono text-[0.65rem] text-text-dim hover:text-cyan transition-colors"
              title="Заново"
            >
              <RotateCcw size={12} />
            </button>
          </div>

          <button
            onClick={goNext}
            disabled={currentStep >= totalSteps - 1}
            className="flex items-center gap-1.5 font-mono text-xs text-text-dim hover:text-cyan transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Далее <ArrowRight size={14} />
          </button>
        </div>

        {/* Progress dots */}
        <ProgressDots
          total={totalSteps}
          current={currentStep}
          colors={colors}
          onJump={jumpTo}
        />
      </motion.div>

      {/* Ссылка на Quickstart — там все команды одним списком */}
      <div className="mt-8 text-center">
        <p className="text-text-muted text-sm">
          Все команды одним списком — в секции{' '}
          <a href="#quickstart-all" className="text-cyan hover:underline">
            «Быстрый старт»
          </a>
        </p>
      </div>
    </section>
  );
}
