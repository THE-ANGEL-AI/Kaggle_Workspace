/* ──────────────────────────────────────────────
   Roadmap — вехи, статусы, достижения
   ────────────────────────────────────────────── */

export type MilestoneStatus = 'done' | 'current' | 'planned' | 'future';

export interface Milestone {
  phase: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  icon: string;
  tags: string[];
  date?: string;
  features?: string[];
}

export const milestones: Milestone[] = [
  {
    phase: 'PHASE 1',
    title: 'Project Setup',
    description: 'Vite + React 19 + TypeScript + TailwindCSS + Framer Motion + Three.js + GitHub Pages',
    status: 'done',
    icon: '⚙️',
    tags: ['Vite', 'React 19', 'TS', 'Tailwind', 'Framer'],
    date: '24.06.2026',
  },
  {
    phase: 'PHASE 2',
    title: 'Visual Identity',
    description: 'Дизайн-система «AI Laboratory of the Future»: палитра #00F5FF / #7B61FF / #A855F7, glassmorphism, neon glow',
    status: 'done',
    icon: '🎨',
    tags: ['Design System', 'Glassmorphism', 'Neon'],
    date: '24.06.2026',
  },
  {
    phase: 'PHASE 3',
    title: 'Hero Section',
    description: '3D-сцена (Three.js + R3F), AI Boot Sequence, магнитные кнопки, кастомный курсор, параллакс',
    status: 'done',
    icon: '✨',
    tags: ['Three.js', '3D', 'Boot', 'Parallax'],
    date: '24.06.2026',
  },
  {
    phase: 'PHASE 4',
    title: '3D Experience',
    description: 'AI Core, GPU модели, нейросеть, парящие орбы, data streams, holographic rings',
    status: 'done',
    icon: '🌌',
    tags: ['R3F', 'Particles', 'Holographic'],
    date: '24.06.2026',
  },
  {
    phase: 'PHASE 5',
    title: 'Scroll Storytelling',
    description: '6 глав с параллаксом, scroll-триггеры, Lenis smooth scroll, gradient accent для заголовков',
    status: 'done',
    icon: '📜',
    tags: ['Scroll', 'Storytelling', 'Parallax'],
    date: '24.06.2026',
  },
  {
    phase: 'PHASE 6',
    title: 'Quick Start Experience',
    description: '30-секундный онбординг, визуальная схема пайплайна, копирование кода, анимированный stepper',
    status: 'done',
    icon: '⚡',
    tags: ['Onboarding', 'Guide', 'Pipeline'],
    date: '24.06.2026',
  },
  {
    phase: 'PHASE 7',
    title: 'Interactive Architecture',
    description: 'Интерактивный SVG-граф компонентов с нодами, рёбрами, flow-dots, зумом, info-панелью',
    status: 'done',
    icon: '🔮',
    tags: ['SVG', 'Graph', 'Interactive'],
    date: '25.06.2026',
  },
  {
    phase: 'PHASE 8',
    title: 'GPU Cost Calculator',
    description: 'Слайдер часов/неделю, 4 платформы (Kaggle/Colab/RunPod/Vast), анимированные счётчики, savings-bars',
    status: 'done',
    icon: '💰',
    tags: ['Calculator', 'GPU', 'Comparison'],
    date: '25.06.2026',
  },
  {
    phase: 'PHASE 9',
    title: 'Repository Showcase',
    description: 'Табы: структура (дерево), скрипты, workflow, фичи. Рекурсивный FileTree с expand/collapse',
    status: 'done',
    icon: '📂',
    tags: ['Repository', 'File Tree', 'Tabs'],
    date: '25.06.2026',
  },
  {
    phase: 'PHASE 10',
    title: 'AI Terminal',
    description: '16 команд (help, github, flux и секретные), matrix rain на Canvas, история через ArrowUp/Down, цветной парсер',
    status: 'done',
    icon: '💻',
    tags: ['Terminal', 'Easter Eggs', 'Matrix'],
    date: '25.06.2026',
  },
  {
    phase: 'PHASE 11',
    title: 'AI Angel Assistant',
    description: 'Плавающий виджет с SVG-маскотом, контекстные подсказки по скроллу, welcome toast, рекомендации',
    status: 'done',
    icon: '🕊️',
    tags: ['Assistant', 'Contextual', 'Floating'],
    date: '25.06.2026',
  },
  {
    phase: 'PHASE 12',
    title: 'Live GitHub Integration',
    description: 'Stars/forks/watchers/issues через GitHub API, последние коммиты, контрибьюторы, релизы, кеш 2min',
    status: 'done',
    icon: '🐙',
    tags: ['GitHub API', 'Live', 'Stats'],
    date: '25.06.2026',
  },
  {
    phase: 'PHASE 13',
    title: 'Gallery',
    description: 'Галерея изображений/видео с Masonry Grid, инфинити карусель, hover zoom, lazy loading',
    status: 'planned',
    icon: '🖼️',
    tags: ['Gallery', 'Masonry', 'Lazy'],
    features: ['Masonry grid', 'Infinite carousel', 'Hover zoom', 'Fullscreen preview', 'Category filters'],
  },
  {
    phase: 'PHASE 14',
    title: 'Roadmap',
    description: 'Интерактивная дорожная карта с вехами, прогрессом, анимациями и фильтрацией (вы здесь)',
    status: 'current',
    icon: '🗺️',
    tags: ['Roadmap', 'Timeline', 'Progress'],
    features: ['Timeline view', 'Progress bars', 'Milestone filter', 'Achievement badges'],
  },
  {
    phase: 'PHASE 15',
    title: 'Community Section',
    description: 'GitHub/Discord/VK/Boosty с интеграцией, счётчики участников, метрики роста',
    status: 'planned',
    icon: '👥',
    tags: ['Community', 'Social', 'Metrics'],
    features: ['GitHub embed', 'Discord widget', 'VK/Boosty links', 'Growth charts'],
  },
  {
    phase: 'PHASE 16',
    title: 'Social Proof',
    description: 'Анимированные счётчики пользователей, генераций, скачиваний с эффектом параллакса',
    status: 'planned',
    icon: '📈',
    tags: ['Counters', 'Analytics', 'Proof'],
    features: ['Animated counters', 'User stats', 'Generation metrics', 'Parallax effect'],
  },
  {
    phase: 'PHASE 17',
    title: 'Advanced Effects',
    description: 'Liquid transitions, aurora background, glass reflections, dynamic blur, hover particles',
    status: 'future',
    icon: '✨',
    tags: ['Effects', 'Liquid', 'Aurora'],
    features: ['Liquid transitions', 'Aurora shader', 'Glass reflections', 'Hover particles'],
  },
  {
    phase: 'PHASE 18',
    title: 'Performance Optimization',
    description: 'Lazy loading, bundle splitting, image/webp, Lighthouse 95+, mobile optimization',
    status: 'future',
    icon: '⚡',
    tags: ['Performance', 'Lighthouse', 'Optimization'],
    features: ['Code splitting', 'Image optimization', 'Lazy loading', 'Lighthouse 95+'],
  },
  {
    phase: 'PHASE 19',
    title: 'Final Polish',
    description: 'Кросс-браузер, мобильные, UX-доработки, accessibility review, финальные анимации',
    status: 'future',
    icon: '🎯',
    tags: ['Polish', 'UX', 'Accessibility'],
    features: ['Cross-browser', 'Mobile test', 'A11y review', 'Animation polish'],
  },
];

export const phaseColors: Record<MilestoneStatus, string> = {
  done: '#00FFB3',
  current: '#00F5FF',
  planned: '#7B61FF',
  future: 'rgba(255,255,255,0.15)',
};

export function getProgress(): { done: number; total: number; percent: number } {
  const total = milestones.length;
  const done = milestones.filter((m) => m.status === 'done' || m.status === 'current').length;
  return { done, total, percent: Math.round((done / total) * 100) };
}
