import { motion } from 'framer-motion';
import { Rocket, Shield, Zap, Puzzle, Package, Link2, Globe } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const cards = [
  { icon: Rocket, title: 'Запуск одной строкой', body: 'Три Python-скрипта в instal/: окружение, ноды, запуск. Через пару минут после старта — публичный URL.', stat: '~2 мин до URL', span: 3 },
  { icon: Shield, title: 'Самовосстановление venv', body: 'Kaggle ломает venv при рестарте. Скрипты чинят за секунды — без переустановки torch.', stat: '99% идемпотентность', span: 3 },
  { icon: Zap, title: 'torch cu130 под T4', body: 'Драйвер 580.x, нативный SDPA вместо нерабочего xformers на Turing.', span: 2 },
  { icon: Puzzle, title: 'DisTorch2 на 2× GPU', body: 'ComfyUI-MultiGPU распределяет слои между двумя T4 и CPU.', span: 2 },
  { icon: Package, title: 'Модели через симлинки', body: 'Flux2 GGUF и LTX 2.3 из /kaggle/input. Один раз скопировал — мгновенно.', span: 2 },
  { icon: Link2, title: 'Публичный URL из ячейки', body: 'Cloudflare-туннель из блокнота. Кнопки: открыть, остановить, перезапустить. Keep-alive не даёт усыпить сессию.', span: 4 },
  { icon: Globe, title: 'Публичные workflow', body: 'Flux2 GGUF, LTX 2.3 Director в workflows/ — готовые графы.', span: 2 },
];

export function Bento() {
  const reduced = useReducedMotion();

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20">
      <div className="text-center mb-14">
        <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-cyan bg-cyan/8 px-3.5 py-1.5 rounded-full mb-5 border border-cyan/20">Подробности</span>
        <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-display font-extrabold text-text-bright mb-3">ComfyUI как пайплайн из шести модулей</h2>
        <p className="text-text-muted text-[1.08rem] max-w-[660px] mx-auto leading-relaxed">Не одна библиотека — а рабочий конвейер: окружение, ноды, симлинки, два GPU и туннель.</p>
      </div>

      <div className="grid grid-cols-6 gap-3 sm:gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          const span = c.span === 4 ? 'col-span-6 md:col-span-4' : c.span === 2 ? 'col-span-6 sm:col-span-3 md:col-span-2' : 'col-span-6 sm:col-span-3';
          const Card = reduced ? 'div' : motion.div;

          return (
            <Card
              key={c.title}
              className={`${span} relative overflow-hidden rounded-[20px] p-5 sm:p-7 bg-glass border border-border backdrop-blur-xl hover:border-cyan/25 hover:shadow-[0_8px_40px_rgba(0,0,0,0.40),0_0_30px_rgba(0,240,255,0.08)] hover:-translate-y-1 transition-all duration-280`}
              {...(reduced ? {} : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } })}
            >
              <Icon className="w-8 h-8 text-cyan mb-3" />
              <h3 className="font-display font-bold text-[1.15rem] text-text-bright mb-1.5">{c.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{c.body}</p>
              {c.stat && (
                <div className="mt-4 font-mono text-xl font-extrabold text-cyan tracking-wide drop-shadow-[0_0_14px_var(--color-glow-cyan)]">{c.stat}</div>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
