/* ──────────────────────────────────────────────
   Архитектура проекта — ноды, группы, рёбра
   ────────────────────────────────────────────── */

export interface ArchNode {
  id: string;
  label: string;
  group: GroupId;
  description: string;
  details: string;
  tech: string[];
  icon: string;
  x: number;
  y: number;
}

export interface ArchEdge {
  from: string;
  to: string;
  label: string;
}

export type GroupId =
  | 'entry'
  | 'pages'
  | 'components'
  | 'scenes'
  | 'hooks'
  | 'data'
  | 'lib';

export interface ArchGroup {
  id: GroupId;
  label: string;
  color: string;
  bgColor: string;
}

export const architectureGroups: ArchGroup[] = [
  { id: 'entry',     label: 'Entry',    color: '#00F5FF', bgColor: 'rgba(0,245,255,0.06)' },
  { id: 'pages',     label: 'Pages',    color: '#7B61FF', bgColor: 'rgba(123,97,255,0.06)' },
  { id: 'components',label: 'Components',color: '#A855F7', bgColor: 'rgba(168,85,247,0.05)' },
  { id: 'scenes',    label: 'Scenes',   color: '#00FFB3', bgColor: 'rgba(0,255,179,0.05)' },
  { id: 'hooks',     label: 'Hooks',    color: '#FF007A', bgColor: 'rgba(255,0,122,0.05)' },
  { id: 'data',      label: 'Data',     color: '#FCEE0A', bgColor: 'rgba(252,238,10,0.05)' },
  { id: 'lib',       label: 'Lib',      color: '#FF8C42', bgColor: 'rgba(255,140,66,0.05)' },
];

export const architectureNodes: ArchNode[] = [
  // ── Entry ──
  { id: 'main',    label: 'main.tsx',    group: 'entry',     icon: '🚀', x: 500, y: 40,
    description: 'Точка входа SPA',
    details: 'BrowserRouter с basename для GH Pages. SPA-fallback через sessionStorage. Рендерит <App /> в StrictMode.',
    tech: ['React 19', 'react-router-dom'] },
  { id: 'app',     label: 'App.tsx',     group: 'entry',     icon: '⚛️', x: 500, y: 120,
    description: 'Корневой layout',
    details: 'CursorGlow → Nav → AnimatePresence(Routes) → Footer. Маршруты: "/" → Home, "/news" → News. Плавные page-transitions через Framer Motion.',
    tech: ['Framer Motion', 'react-router-dom'] },

  // ── Pages ──
  { id: 'home',    label: 'Home.tsx',    group: 'pages',     icon: '🏠', x: 200, y: 230,
    description: 'Главная страница',
    details: 'Собирает секции: Hero → StorySection × 6 → InteractiveGuide → WorkflowDiagram → Bento → Quickstart → WorkflowsShowcase → News → CTA. Каждая секция — отдельный компонент с scroll-анимациями. Тяжёлые блоки (Architecture/Repository/GitHub/Gallery/Roadmap/Community/SocialProof) — lazy-чанки через React.lazy + Suspense.',
    tech: ['Framer Motion', 'React Router'] },
  { id: 'news',    label: 'News.tsx',    group: 'pages',     icon: '📰', x: 800, y: 230,
    description: 'Лента обновлений',
    details: 'Header с градиентом → Changelog-лента из newsEntries. Каждая запись — NewsCard со staggered-анимацией появления.',
    tech: ['Framer Motion'] },

  // ── Components ──
  { id: 'nav',         label: 'Nav.tsx',        group: 'components', icon: '🧭', x: 50,  y: 360,
    description: 'Навигация',
    details: 'Fixed top bar с логотипом THE ANGEL AI. Десктоп: inline-ссылки с underline-анимацией. Мобильный: burger-меню → slide-out панель с Framer Motion. Escape закрывает меню.',
    tech: ['Framer Motion', 'lucide-react'] },
  { id: 'footer',      label: 'Footer.tsx',     group: 'components', icon: '📋', x: 950, y: 360,
    description: 'Подвал',
    details: 'Ссылки на GitHub, VK, Boosty, лента новостей. Glass-фон с backdrop-blur.',
    tech: [] },
  { id: 'hero',        label: 'Hero.tsx',       group: 'components', icon: '✨', x: 200, y: 370,
    description: 'Hero-секция',
    details: '3D-сцена на фоне, AI Boot Sequence при загрузке, магнитные кнопки (GitHub / Quick Start / Boosty), parallax по мыши. Кинектический заголовок с градиентом.',
    tech: ['Framer Motion', 'Three.js'] },
  { id: 'bootseq',     label: 'HeroBootSequence.tsx', group: 'components', icon: '💻', x: 50,  y: 480,
    description: 'Boot-анимация',
    details: '10 строк лога с таймингом (300–800ms). Цветовые индикаторы (зелёный для ACTIVE, циан для GPU). Мигающий курсор в стиле терминала.',
    tech: ['CSS animations'] },
  { id: 'cursor',      label: 'CursorGlow.tsx',  group: 'components', icon: '🖱️', x: 950, y: 480,
    description: 'Кастомный курсор',
    details: 'Точка + кольцо. Следит за мышью через useMousePosition. Расширяется над интерактивными элементами (a, button, [data-cursor-hover]). Скрыт на touch-устройствах.',
    tech: ['useMousePosition'] },
  { id: 'bento',       label: 'Bento.tsx',       group: 'components', icon: '📦', x: 200, y: 490,
    description: 'Карточки фич (Bento Grid)',
    details: '7 карточек в grid 6 колонок. Каждая с иконкой, заголовком, описанием и опциональной статистикой. Hover: подсветка border-cyan и тень. Stagger-анимация появления.',
    tech: ['Framer Motion', 'lucide-react'] },
  { id: 'quickstart',  label: 'Quickstart.tsx',  group: 'components', icon: '⚡', x: 400, y: 490,
    description: 'Быстрый старт',
    details: 'Терминальный блок с 3 ячейками для Kaggle. Кнопка Copy с обратной связью (Check → 2s). Stripped-рендер ReactNode в строку.',
    tech: ['useCopyToClipboard'] },
  { id: 'guide',       label: 'InteractiveGuide.tsx', group: 'components', icon: '🎮', x: 600, y: 490,
    description: 'Интерактивный гид',
    details: '5-шаговый онбординг с авто-пролистыванием (6s/шаг). Анимация progress bar, staggered-dots, prev/next/restart. Копирование кода каждого шага.',
    tech: ['Framer Motion', 'lucide-react'] },
  { id: 'diagram',     label: 'WorkflowDiagram.tsx',  group: 'components', icon: '🔀', x: 800, y: 490,
    description: 'Схема пайплайна',
    details: '5 нод (Kaggle → Instal → ComfyUI → Tunnel → URL) с SVG-стрелками. Pulse-ring анимация. Mobile: vertical stacked. Desktop: horizontal с arrow connectors.',
    tech: ['Framer Motion'] },
  { id: 'workflows',   label: 'WorkflowsShowcase.tsx', group: 'components', icon: '🖼️', x: 50,  y: 600,
    description: 'Показ workflow',
    details: '3 карточки (Flux2 GGUF, LTX 2.3, TTS) с SVG-превью. Анимированные градиенты, вращающиеся круги, пульсирующие волны.',
    tech: ['Framer Motion', 'SVG animations'] },
  { id: 'story',       label: 'StorySection.tsx',  group: 'components', icon: '📜', x: 650, y: 600,
    description: 'Scroll-сторителлинг',
    details: 'Переиспользуемый компонент-обёртка. Parallax glow bg, scrollYProgress, textY/bgY/opacity transforms. Номер главы (01-06) с декоративным stroke. Gradient accent для заголовка.',
    tech: ['Framer Motion (useScroll/useTransform)'] },
  { id: 'newscard',    label: 'NewsCard.tsx',     group: 'components', icon: '📇', x: 850, y: 600,
    description: 'Карточка новости',
    details: 'Rail с цветовым variant (a/b/c). Дата, тег, заголовок, тело, опциональные bullets. Hover: сдвиг вправо + glow.',
    tech: ['CSS transitions'] },

  // ── Scenes ──
  { id: 'heroscene',   label: 'HeroScene.tsx',   group: 'scenes',    icon: '🌌', x: 200, y: 740,
    description: '3D-сцена Hero',
    details: 'Three.js / R3F: AI Core (икосаэдр), 2× GPU, нейросеть (3-слойная), парящие орбы, data streams, кольца. Camera parallax по мыши. FBO-частицы. **Lazy-чанк** (грузится после монтирования Hero).',
    tech: ['Three.js', '@react-three/fiber', '@react-three/drei'] },
  { id: 'aurora',      label: 'Aurora.tsx',      group: 'scenes',    icon: '🌌', x: 400, y: 740,
    description: 'Aurora-фон (PHASE 17)',
    details: 'Глобальный «воздух»: 3 дышащих радиальных пятна (cyan/violet/magenta) через CSS keyframes (18-26s). mix-blend-mode: screen. SVG-noise grain. pointer-events: none. prefers-reduced-motion → анимация отключена.',
    tech: ['CSS animations', 'mix-blend-mode'] },
  { id: 'liquid',      label: 'LiquidDivider.tsx', group: 'components', icon: '🌊', x: 600, y: 740,
    description: 'Liquid-разделитель (PHASE 17)',
    details: 'SVG с двумя морфящимися <path> через SMIL <animate>. 4 цветовых акцента (cyan/violet/purple/green). flip для чередования. Pure CSS/SMIL — без JS-циклов.',
    tech: ['SVG SMIL', 'CSS'] },

  // ── Hooks ──
  { id: 'uselenis',        label: 'useLenis.ts',        group: 'hooks',     icon: '🔄', x: 700, y: 740,
    description: 'Плавный скролл',
    details: 'Lenis v1 smooth scroll. RAF-driven, предотвращает конфликт с Framer Motion useScroll.',
    tech: ['Lenis'] },
  { id: 'usemouse',        label: 'useMousePosition.ts', group: 'hooks',     icon: '🖲️', x: 820, y: 740,
    description: 'Позиция мыши',
    details: 'mousemove listener → нормализованные координаты (0-100%). Используется Hero (parallax), CursorGlow.',
    tech: ['React useEffect'] },
  { id: 'usereduced',      label: 'useReducedMotion.ts', group: 'hooks',     icon: '♿', x: 940, y: 740,
    description: 'prefers-reduced-motion',
    details: 'Читает prefers-reduced-motion, кеширует. Отключает анимации для accessibility.',
    tech: ['matchMedia'] },
  { id: 'usecopy',         label: 'useCopyToClipboard.ts', group: 'hooks',   icon: '📋', x: 700, y: 840,
    description: 'Копирование в буфер',
    details: 'navigator.clipboard.writeText + таймер 2s на сброс состояния copied.',
    tech: ['navigator.clipboard'] },

  // ── Data ──
  { id: 'newsdata',        label: 'news.ts',           group: 'data',      icon: '🗄️', x: 820, y: 840,
    description: 'Данные новостей',
    details: 'Массив NewsEntry (date, title, body, tag, bullets, variant). newsTeaser (первые 4) для Home, newsEntries (все) для /news.',
    tech: ['TypeScript types'] },

  // ── Lib ──
  { id: 'cn',              label: 'cn.ts / utils.ts',  group: 'lib',       icon: '🔧', x: 940, y: 840,
    description: 'Утилиты',
    details: 'cn() — clsx + tailwind-merge для Tailwind классов. Другие хелперы.',
    tech: ['clsx', 'tailwind-merge'] },
];

export const architectureEdges: ArchEdge[] = [
  // Entry → App
  { from: 'main', to: 'app', label: 'mounts' },

  // App → everything
  { from: 'app', to: 'nav', label: 'renders' },
  { from: 'app', to: 'footer', label: 'renders' },
  { from: 'app', to: 'cursor', label: 'renders' },
  { from: 'app', to: 'aurora', label: 'fixed bg' },
  { from: 'app', to: 'home', label: 'route "/"' },
  { from: 'app', to: 'news', label: 'route "/news"' },

  // Home → sections
  { from: 'home', to: 'hero', label: 'renders' },
  { from: 'home', to: 'story', label: '× 6 chapters' },
  { from: 'home', to: 'bento', label: 'renders' },
  { from: 'home', to: 'quickstart', label: 'renders' },
  { from: 'home', to: 'guide', label: 'renders' },
  { from: 'home', to: 'diagram', label: 'renders' },
  { from: 'home', to: 'workflows', label: 'renders' },
  { from: 'home', to: 'liquid', label: '× 4 dividers' },
  { from: 'home', to: 'newscard', label: 'uses' },

  // Hero → children
  { from: 'hero', to: 'heroscene', label: '3D bg' },
  { from: 'hero', to: 'bootseq', label: 'boot overlay' },
  { from: 'hero', to: 'usemouse', label: 'parallax' },

  // News → data
  { from: 'news', to: 'newscard', label: 'uses' },
  { from: 'news', to: 'newsdata', label: 'reads' },
  { from: 'newscard', to: 'newsdata', label: 'typed by' },

  // Hook dependencies
  { from: 'cursor', to: 'usemouse', label: 'uses' },
  { from: 'bento', to: 'usereduced', label: 'uses' },
  { from: 'story', to: 'usereduced', label: 'uses' },
  { from: 'aurora', to: 'usereduced', label: 'uses' },
  { from: 'quickstart', to: 'usecopy', label: 'uses' },
  { from: 'guide', to: 'usecopy', label: 'uses' },

  // App → hooks
  { from: 'app', to: 'uselenis', label: 'initializes' },

  // Lib
  { from: 'bento', to: 'cn', label: 'uses' },
  { from: 'guide', to: 'cn', label: 'uses' },
];
