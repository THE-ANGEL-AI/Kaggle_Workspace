import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import { StorySection } from '../components/StorySection';
import { Bento } from '../components/Bento';
import { Quickstart } from '../components/Quickstart';
import { InteractiveGuide } from '../components/InteractiveGuide';
import { WorkflowDiagram } from '../components/WorkflowDiagram';
import { WorkflowsShowcase } from '../components/WorkflowsShowcase';
import { InstallStepper } from '../components/InstallStepper';
import { LiveStats } from '../components/LiveStats';
import { NewsCard } from '../components/NewsCard';
import { ArchitectureGraph } from '../components/ArchitectureGraph';
import { GPUCostCalculator } from '../components/GPUCostCalculator';
import { RepositoryShowcase } from '../components/RepositoryShowcase';
import { AITerminal } from '../components/AITerminal';
import { GitHubIntegration } from '../components/GitHubIntegration';
import { Roadmap } from '../components/Roadmap';
import { Gallery } from '../components/Gallery';
import { CommunitySection } from '../components/CommunitySection';
import { newsTeaser } from '../data/news';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Cloud, Users, FlaskConical, Play, CheckCircle } from 'lucide-react';

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

/* ── Aside content for each chapter ── */

const Chapter1Aside = () => (
  <div className="glass rounded-2xl p-6 sm:p-8 space-y-4">
    <div className="flex items-center gap-3 text-cyan">
      <Cpu size={28} />
      <span className="font-display font-bold text-sm tracking-wider">Схема работы</span>
    </div>
    <div className="space-y-3">
      {[
        { icon: Play, text: 'Kaggle Notebook → GPU T4 ×2' },
        { icon: FlaskConical, text: 'Instal-скрипты → ComfyUI' },
        { icon: Cloud, text: 'Cloudflare Tunnel → Публичный URL' },
      ].map((item, i) => (
        <div key={i} className="flex items-start gap-3 text-sm text-text-dim">
          <item.icon size={16} className="text-cyan mt-0.5 shrink-0" />
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  </div>
);

const Chapter2Aside = () => (
  <div className="glass rounded-2xl p-6 sm:p-8">
    <div className="grid grid-cols-2 gap-4">
      {[
        { label: 'Время до URL', value: '~2 мин', color: 'text-cyan' },
        { label: 'Идемпотентность', value: '99%', color: 'text-green' },
        { label: 'GPU в сессии', value: '2× T4', color: 'text-purple' },
        { label: 'Стоимость', value: '₽0', color: 'text-yellow' },
      ].map((stat, i) => (
        <div key={i} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className={`font-mono text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
          <div className="text-xs text-text-muted mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
);

const Chapter3Aside = () => (
  <div className="space-y-3">
    {[
      { name: 'Flux2 GGUF', desc: 'Text-to-Image, 12B params', color: '#00F5FF' },
      { name: 'LTX 2.3 Video', desc: 'Text/Image-to-Video + Audio', color: '#7B61FF' },
      { name: 'LTX Director', desc: 'Crop-Guide motion control', color: '#A855F7' },
      { name: 'TTS / Voice', desc: 'Edge-TTS + Kokoro-Fast', color: '#00FFB3' },
    ].map((m, i) => (
      <div key={i} className="glass-light rounded-xl p-4 flex items-center gap-4">
        <div
          className="w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px_var(--color-glow-cyan)]"
          style={{ background: m.color, boxShadow: `0 0 8px ${m.color}60` }}
        />
        <div>
          <div className="font-display font-bold text-sm text-text-bright">{m.name}</div>
          <div className="text-xs text-text-muted">{m.desc}</div>
        </div>
      </div>
    ))}
  </div>
);

const Chapter5Aside = () => (
  <div className="glass rounded-2xl p-6 sm:p-8 space-y-4">
    <div className="flex items-center gap-3 text-cyan">
      <Users size={28} />
      <span className="font-display font-bold text-sm tracking-wider">Сообщество</span>
    </div>
    <div className="space-y-3 text-sm">
      <a href="https://github.com/THE-ANGEL-AI/Kaggle_Workspace_FreeGPU" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-white/[0.06]">
        <CheckCircle size={18} className="text-cyan shrink-0" />
        <span className="text-text-dim">GitHub — ставь звезду ⭐</span>
      </a>
      <a href="https://vk.com/theangel_lab" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-white/[0.06]">
        <CheckCircle size={18} className="text-purple shrink-0" />
        <span className="text-text-dim">ВКонтакте — новости и анонсы</span>
      </a>
      <a href="https://boosty.to/the_angel/donate" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-white/[0.06]">
        <CheckCircle size={18} className="text-violet shrink-0" />
        <span className="text-text-dim">Boosty — поддержать проект 💖</span>
      </a>
    </div>
  </div>
);

const Chapter6Aside = () => (
  <div className="glass rounded-2xl p-6 sm:p-8">
    <div className="font-display font-bold text-sm tracking-wider text-cyan mb-4">Ближайшие планы</div>
    <div className="space-y-3 text-sm">
      {[
        'Раздельная загрузка LoRA / ControlNet',
        'Автоматический деплой на Vast.ai / RunPod',
        'TTS с клонированием голоса (CosyVoice)',
        'Discord-бот для генераций через команды',
      ].map((item, i) => (
        <div key={i} className="flex items-start gap-3 text-text-dim">
          <span className="font-mono text-[0.6rem] text-text-muted mt-0.5">0{i + 1}</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Home page ── */

export function Home() {
  return (
    <>
      <Hero />

      {/* ── Глава 1: Что это? ── */}
      <StorySection
        chapter={1}
        label="Глава 1"
        title="Kaggle Workspace FreeGPU — это"
        accent="бесплатный ComfyUI"
        aside={<Chapter1Aside />}
      >
        <p>
          Готовый пайплайн для запуска <strong className="text-text-bright">ComfyUI</strong> на двух
          бесплатных <strong className="text-text-bright">Tesla T4</strong> (16 GB VRAM each) прямо
          из Kaggle-блокнота. Без своей видеокарты, без оплаты облака, без лимитов по времени.
        </p>
        <p>
          Три Python-скрипта в папке <code className="text-cyan text-sm">instal/</code> делают всё
          автоматически: поднимают окружение, скачивают ноды, создают симлинки на модели и
          открывают туннель. Результат — публичный URL с ComfyUI за пару минут.
        </p>
      </StorySection>

      {/* ── Глава 2: Почему это работает ── */}
      <StorySection
        chapter={2}
        label="Глава 2"
        title="Почему это"
        accent="работает"
        aside={<Chapter2Aside />}
        reversed
        colors={['#7B61FF', '#A855F7']}
      >
        <p>
          Kaggle даёт <strong className="text-text-bright">2× Tesla T4</strong> на сессию с
          драйвером 580.x — это современнее, чем T4 на Colab (530.x). На Turing-архитектуре
          нативный <strong className="text-text-bright">SDPA</strong> (Flash Attention) вместо
          неработающего xformers.
        </p>
        <p>
          Скрипты написаны с учётом особенностей Kaggle: venv чинится при рестарте без
          переустановки torch, модели монтируются через симлинки из <code className="text-purple text-sm">/kaggle/input</code>,
          а Cloudflare-туннель пробрасывает порт наружу через одну ячейку.
        </p>
      </StorySection>

      {/* ── Глава 3: Модели ── */}
      <StorySection
        chapter={3}
        label="Глава 3"
        title="Поддерживаемые"
        accent="модели"
        aside={<Chapter3Aside />}
        colors={['#A855F7', '#00F5FF']}
      >
        <p>
          В репозитории — готовые workflow для <strong className="text-text-bright">Flux2 GGUF</strong>
          {' '}(12B, text-to-image), <strong className="text-text-bright">LTX 2.3 Video</strong> (22B,
          text/image-to-video с аудио) и <strong className="text-text-bright">LTX Director</strong>{' '}
          (Crop-Guide для точного контроля движения камеры).
        </p>
        <p>
          TTS-модели (Edge-TTS, Kokoro-Fast) для озвучки. Веса лежат в
          {' '}<code className="text-violet text-sm">/kaggle/input</code> — один раз скопировал,
          при перезапуске сессии не теряются.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {['Flux2 GGUF', 'LTX 2.3', 'Image-to-Video', 'Video-to-Video', 'TTS'].map((tag) => (
            <span key={tag} className="text-[0.6rem] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-white/[0.08] text-text-dim">
              {tag}
            </span>
          ))}
        </div>
      </StorySection>

      {/* ── Глава 4: Возможности ── (wrap existing Bento) */}
      <StorySection
        chapter={4}
        label="Глава 4"
        title="Ключевые"
        accent="возможности"
        colors={['#00FFB3', '#00F5FF']}
      >
        <p>
          Шесть модулей работают как конвейер: от поднятия окружения до публичного URL
          с ComfyUI. Идемпотентность скриптов — можно перезапускать без страха сломать.
        </p>
        <p>
          Готовые workflow-графы лежат в папке <code className="text-green text-sm">workflows/</code> —
          импортируй в ComfyUI и сразу запускай генерацию.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          {['~2 мин', '99%', '0 ₽'].map((v, i) => (
            <div key={i} className="glass-light rounded-xl py-3">
              <div className="font-mono text-lg font-extrabold text-green">{v}</div>
              <div className="text-[0.6rem] text-text-muted mt-0.5">
                {['До URL', 'Идемпотентность', 'Цена'][i]}
              </div>
            </div>
          ))}
        </div>
      </StorySection>

      {/* PHASE 7 — Interactive Architecture */}
      <section id="architecture"><ArchitectureGraph /></section>

      {/* PHASE 8 — GPU Cost Calculator */}
      <section id="calculator"><GPUCostCalculator /></section>

      {/* PHASE 9 — Repository Showcase */}
      <section id="repository"><RepositoryShowcase /></section>

      {/* PHASE 10 — AI Terminal */}
      <section id="terminal"><AITerminal /></section>

      {/* PHASE 13 — Gallery */}
      <Gallery />

      {/* PHASE 12 — Live GitHub Integration */}
      <GitHubIntegration />

      {/* PHASE 14 — Roadmap */}
      <Roadmap />

      {/* PHASE 15 — Community Section */}
      <CommunitySection />

      {/* Legacy Bento + Quickstart sections */}
      {/* Interactive Guide — replaces old Quickstart */}
      <InteractiveGuide />
      <section id="pipeline"><WorkflowDiagram /></section>

      <motion.div id="features" {...reveal}><Bento /></motion.div>
      {/* Old Quickstart kept with id for anchor link */}
      <motion.div id="quickstart-all" {...reveal}><Quickstart /></motion.div>

      {/* ── Глава 5: Сообщество ── */}
      <StorySection
        chapter={5}
        label="Глава 5"
        title="Присоединяйся к"
        accent="сообществу"
        aside={<Chapter5Aside />}
        reversed
        colors={['#FF007A', '#A855F7']}
      >
        <p>
          Проект живёт благодаря сообществу. <strong className="text-text-bright">GitHub</strong> —
          ставь звезду, форкай, предлагай изменения. В <strong className="text-text-bright">VK</strong>{' '}
          выходят анонсы новых моделей и обновлений.
        </p>
        <p>
          Хочешь поддержать проект деньгами — <strong className="text-text-bright">Boosty</strong>
          {' '}даёт доступ к ранним билдам и приоритетной поддержке. Каждый донат идёт на
          покупку GPU-часов для тестирования новых моделей.
        </p>
      </StorySection>

      {/* Legacy sections */}
      <motion.div id="workflows" {...reveal}><WorkflowsShowcase /></motion.div>
      <motion.div {...reveal}><InstallStepper /></motion.div>
      <motion.div id="stats" {...reveal}><LiveStats /></motion.div>

      {/* ── Глава 6: Будущее ── */}
      <StorySection
        chapter={6}
        label="Глава 6"
        title="Будущее"
        accent="проекта"
        aside={<Chapter6Aside />}
        colors={['#FCEE0A', '#00F5FF']}
      >
        <p>
          Сейчас это <strong className="text-text-bright">ComfyUI на двух T4</strong> с
          предустановленными моделями. В планах — поддержка ControlNet, раздельная загрузка
          LoRA-адаптеров и TTS с клонированием голоса.
        </p>
        <p>
          В перспективе — интеграция с <strong className="text-text-bright">Vast.ai</strong> и
          {' '}<strong className="text-text-bright">RunPod</strong> для тех, кому нужно больше GPU,
          и Discord-бот для генераций через команды. Проект растёт — присоединяйся!
        </p>
      </StorySection>

      {/* ── News ── */}
      <motion.section id="updates" className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20" {...reveal}>
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-cyan bg-cyan/8 px-3.5 py-1.5 rounded-full mb-5 border border-cyan/20">Новостная лента</span>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-display font-extrabold text-text-bright mb-3">Что нового</h2>
          <p className="text-text-muted text-[1.08rem] max-w-[660px] mx-auto leading-relaxed">Последние релизы и обновления проекта. Полная лента — на странице новостей.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {newsTeaser.map((e, i) => <NewsCard key={i} entry={e} />)}
        </div>

        <div className="mt-8 text-center">
          <Link to="/news" className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-sm text-cyan border border-cyan bg-white/3 hover:bg-cyan hover:text-deep hover:shadow-[0_0_24px_var(--color-glow-cyan),0_0_60px_var(--color-glow-cyan)] hover:-translate-y-0.5 transition-all">
            Все новости <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </motion.section>

      {/* ── CTA ── */}
      <motion.section id="cta" className="max-w-[1200px] mx-auto px-4 sm:px-8 pb-16 sm:pb-20" {...reveal}>
        <div className="relative text-center bg-glass border border-border rounded-[28px] p-10 sm:p-16 overflow-hidden backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-violet/5 pointer-events-none" />
          <div className="relative">
            <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-display font-extrabold text-text-bright mb-3">Готовы попробовать?</h2>
            <p className="text-text-muted text-[1.08rem] max-w-[580px] mx-auto mb-8 leading-relaxed">Скопируйте три ячейки в свой Kaggle-блокнот — через пару минут будет публичный ComfyUI на двух Tesla T4.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="https://github.com/THE-ANGEL-AI/Kaggle_Workspace_FreeGPU" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-sm bg-cyan text-deep hover:shadow-[0_0_24px_var(--color-glow-cyan),0_0_60px_var(--color-glow-cyan)] hover:-translate-y-0.5 transition-all">
                Открыть на GitHub
              </a>
              <a href="https://boosty.to/the_angel/donate" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-sm text-magenta border border-magenta bg-white/3 hover:bg-magenta hover:text-deep hover:shadow-[0_0_24px_var(--color-glow-magenta),0_0_60px_var(--color-glow-magenta)] hover:-translate-y-0.5 transition-all">
                💖 Поддержать
              </a>
              <Link to="/news" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-sm text-text-dim border border-border-strong hover:bg-white/6 hover:text-text-bright hover:border-white/30 transition-all">
                Лента обновлений
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
