// Типизированный список новостных записей. Один источник для Home (teaser)
// и News (полная лента). Сортировка: новые сверху.

type NewsTag = 'release' | 'gpu' | 'video' | 'infra' | 'docs';

export interface NewsEntry {
  /** ISO дата, для сортировки и <time datetime=""> */
  date: string;
  /** ДД.ММ.ГГГГ для отображения */
  dateHuman: string;
  tag: NewsTag;
  title: string;
  body: string;
  bullets?: string[];
  /** Visual variant: a/b/c — affects the left-rail gradient (cyan/magenta/yellow) */
  variant?: 'a' | 'b' | 'c';
}

export const newsEntries: NewsEntry[] = [
  {
    date: '2026-07-04',
    dateHuman: '04.07.2026',
    tag: 'release',
    title: '🧹 Рефакторинг сайта: чистота и производительность',
    body: 'Проведён полный аудит ветки site. Удалены неиспользуемые зависимости, мёртвые компоненты и мусорные папки. Билд стал легче и чище.',
    bullets: [
      'Удалены motion, gsap, geist, tw-animate-css — не использовались.',
      'Переход на eslint.config.mjs (flat config).',
      'Новые компоненты: FadeIn, SectionHeader, AnimatedCounter.',
      'Новые хуки: useEscapeKey, useMediaQuery, useScrollLock.',
    ],
  },
  {
    date: '2026-07-02',
    dateHuman: '02.07.2026',
    tag: 'infra',
    variant: 'b',
    title: '⚡ Все 19 фаз сайта завершены',
    body: 'Финальный полишинг: доступность, производительность, кросс-браузерность. Initial bundle — всего 100 KB gzip.',
    bullets: [
      'React.lazy + Suspense для 8 чанков.',
      'Aurora background + Liquid SVG dividers.',
      'Focus-visible, skip-link, prefers-reduced-motion.',
      'Lighthouse-ready: SEO, a11y, performance.',
    ],
  },
  {
    date: '2026-06-28',
    dateHuman: '28.06.2026',
    tag: 'gpu',
    variant: 'c',
    title: '🎛️ Лаунчер переписан: кнопки, логи, стабильность',
    body: 'Полная переработка launcher.py и logging_ui.py. ipywidgets заменены на HTML + stdout. Кнопки Остановить/Перезапустить вернулись.',
    bullets: [
      'Убран nest_asyncio — ячейка больше не уходит в фон.',
      'Логи теперь не дублируются, всё чисто и читаемо.',
      '--use-split-cross-attention критичен для T4 (без него OOM).',
    ],
  },
  {
    date: '2026-06-24',
    dateHuman: '24.06.2026',
    tag: 'video',
    title: '🎥 LTX 2.3 Video + SageAttention на T4',
    body: 'Запущен LTX 2.3 22B GGUF на двух Tesla T4 через Hybrid Split Loader. SageAttention форкнут под SM75.',
    bullets: [
      'ComfyUI-LTX2-MultiGPU — авторская нода для 2×T4.',
      'SageAttention-SM75-path — форк с фиксами для Turing.',
      'SDPA fallback если SageAttention не поддерживается.',
    ],
  },
  {
    date: '2026-06-24',
    dateHuman: '24.06.2026',
    tag: 'docs',
    variant: 'b',
    title: '🌐 Редизайн сайта: Cyberpunk × Anime 2026',
    body: 'README больше не рендерится через Jekyll. Полностью переработанный лендинг на Vite + React 19 + TypeScript.',
    bullets: [
      '3D-сцена (Three.js + R3F) с AI Core и парящими GPU.',
      'AI Boot Sequence, магнитные кнопки, кастомный курсор.',
      'AI Terminal с 16 командами и Matrix rain.',
      'Аниме-маскот — ангел-хранитель проекта.',
    ],
  },
  {
    date: '2026-06-06',
    dateHuman: '06.06.2026',
    tag: 'release',
    variant: 'c',
    title: '🧪 Релиз v1: первые публичные скрипты',
    body: 'Первая публичная версия. Проект выложен на GitHub, скрипты установки вынесены в instal/, добавлен ComfyUI-MultiGPU.',
    bullets: [
      '3 скрипта: instal_comfyui.py, instal_castom_node.py, start.py.',
      'Идемпотентность — перезапуск сессии не ломает окружение.',
      'Cloudflare-туннель для доступа к ComfyUI из браузера.',
    ],
  },
];

/** Just newest 2 entries — for Home teaser. */
export const newsTeaser = newsEntries.slice(0, 2);
