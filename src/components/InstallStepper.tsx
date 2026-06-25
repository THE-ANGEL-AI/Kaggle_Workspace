import { motion } from 'framer-motion';
import { Clock, Play } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

const steps = [
  { num: '01', title: 'Окружение и зависимости', detail: 'uv поднимает Python 3.12 и venv, ставится torch cu130 + ComfyUI + Manager. Идемпотентно: если уже стоит — пропускается.', badge: '~40s' },
  { num: '02', title: 'Кастомные ноды и модели', detail: 'Симлинки на модели из /kaggle/input (Flux2 GGUF, LTX 2.3). ComfyUI-Manager ставит недостающие ноды из реестра.', badge: '~25s' },
  { num: '03', title: 'Запуск + публичный URL', detail: 'Поднимается ComfyUI на 2× T4, Cloudflare-туннель пробрасывает порт наружу. Появляются кнопки keep-alive.', badge: '~12s' },
];

export function InstallStepper() {
  const [animating, setAnimating] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);

  const startAnimation = useCallback(() => {
    setAnimating(true);
    setActiveStep(0);
  }, []);

  useEffect(() => {
    if (!animating || activeStep >= steps.length) return;
    const timer = setTimeout(() => {
      setActiveStep((prev) => prev + 1);
    }, 800);
    return () => clearTimeout(timer);
  }, [animating, activeStep]);

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20">
      <div className="text-center mb-14">
        <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-cyan bg-cyan/8 px-3.5 py-1.5 rounded-full mb-5 border border-cyan/20">Timeline</span>
        <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-display font-extrabold text-text-bright mb-3">Как это работает — по шагам</h2>
        <p className="text-text-muted text-[1.08rem] max-w-[660px] mx-auto leading-relaxed">Суммарно ~80 секунд от клонирования до публичного ComfyUI.</p>
        {!animating && (
          <button
            onClick={startAnimation}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm bg-cyan/10 text-cyan border border-cyan/25 hover:bg-cyan/20 transition-all mt-4"
          >
            <Play size={14} /> Анимировать шаги
          </button>
        )}
      </div>

      <div className="max-w-[880px] mx-auto grid gap-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            className="stepper-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={animating ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            animate={animating ? {
              opacity: i <= activeStep ? 1 : 0.2,
              y: i <= activeStep ? 0 : 10,
              scale: i === activeStep ? 1.02 : 1,
            } : undefined}
          >
            <div className="stepper-number">
              {s.num}
            </div>
            <div>
              <h3 className="font-display font-bold text-[1.1rem] text-text-bright mb-0.5">{s.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{s.detail}</p>
            </div>
            <div className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wide text-yellow bg-yellow/8 px-2.5 py-1.5 rounded-full border border-yellow/25 whitespace-nowrap">
              {i === activeStep && animating ? (
                <span className="w-2 h-2 rounded-full bg-green shadow-[0_0_6px_rgba(0,255,179,0.8)] animate-pulse" />
              ) : (
                <Clock size={12} />
              )} {s.badge}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
