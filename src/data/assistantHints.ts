/* ──────────────────────────────────────────────
   AI Angel Assistant — контекстные подсказки
   ────────────────────────────────────────────── */

export interface AssistantHint {
  /** Section id or selector to match */
  section: string;
  /** Title of the hint */
  title: string;
  /** Hint message */
  message: string;
  /** Emoji icon */
  icon: string;
  /** Suggested action */
  action?: string;
  /** Action link */
  actionLink?: string;
}

/** Ordered by page position */
export const hints: AssistantHint[] = [
  {
    section: 'hero',
    title: 'Добро пожаловать!',
    message: 'Я — AI-ангел-хранитель этого проекта. Здесь ты найдёшь всё для бесплатного запуска ComfyUI на двух Tesla T4.',
    icon: '👋',
    action: 'Смотреть 3D сцену',
    actionLink: '#hero',
  },
  {
    section: 'architecture',
    title: 'Архитектура проекта',
    message: 'Интерактивный граф показывает все компоненты сайта. Наведи на узел — увидишь описание, нажми — откроются детали.',
    icon: '🔮',
    action: 'Исследовать граф',
    actionLink: '#architecture',
  },
  {
    section: 'calculator',
    title: 'GPU Cost Calculator',
    message: 'Сравни цены на GPU-облака. Двигай слайдер — увидишь, сколько экономишь с Kaggle по сравнению с Colab, RunPod и Vast.ai.',
    icon: '💰',
    action: 'Рассчитать',
    actionLink: '#calculator',
  },
  {
    section: 'story',
    title: 'История проекта',
    message: 'Шесть глав расскажут, что это за проект, почему он работает, какие модели поддерживает и куда развивается.',
    icon: '📖',
    action: 'Читать',
    actionLink: '#story',
  },
  {
    section: 'features',
    title: 'Ключевые фичи',
    message: 'Шесть модулей работают как конвейер: от поднятия окружения до публичного URL с ComfyUI. Всё идемпотентно!',
    icon: '⚡',
    action: 'Смотреть фичи',
    actionLink: '#features',
  },
  {
    section: 'guide',
    title: 'Интерактивный гид',
    message: '5-шаговый онбординг с автопролистыванием. Нажимай ← → для ручного управления или дай авто-режиму всё показать.',
    icon: '🎮',
    action: 'Пройти гид',
    actionLink: '#start',
  },
  {
    section: 'pipeline',
    title: 'Схема работы',
    message: 'От Kaggle-блокнота до публичного ComfyUI — визуальная схема пайплайна. Всего ~80 секунд!',
    icon: '🔀',
    action: 'Смотреть схему',
    actionLink: '#pipeline',
  },
  {
    section: 'repository',
    title: 'Что внутри репо',
    message: 'Файловая структура, 3 instal-скрипта, 3 workflow, 6 ключевых фич — всё в одном месте с табами.',
    icon: '📂',
    action: 'Исследовать',
    actionLink: '#repository',
  },
  {
    section: 'terminal',
    title: 'Попробуй терминал',
    message: 'Введи help, github, comfy, flux — или найди секретные команды: whoami, neofetch, matrix, 42, sudo.',
    icon: '💻',
    action: 'Открыть терминал',
    actionLink: '#terminal',
  },
  {
    section: 'workflows',
    title: 'Готовые графы',
    message: 'Flux2 GGUF, LTX 2.3 Video, TTS — импортируй в ComfyUI и запускай генерацию без настройки.',
    icon: '🎨',
    action: 'Смотреть workflows',
    actionLink: '#workflows',
  },
  {
    section: 'stats',
    title: 'Live-статистика',
    message: 'GPU hours, идемпотентность скриптов, этапы, время восстановления — цифры обновляются в реальном времени.',
    icon: '📊',
    action: 'Смотреть дашборд',
    actionLink: '#stats',
  },
  {
    section: 'cta',
    title: 'Готов начать?',
    message: 'Открой репозиторий на GitHub, поставь звезду и запусти ComfyUI на двух бесплатных T4 через Kaggle.',
    icon: '🚀',
    action: 'На GitHub',
    actionLink: 'https://github.com/THE-ANGEL-AI/Kaggle_Workspace_FreeGPU',
  },
];

/** Welcome message for first-time visitors */
export const welcomeMessage = {
  title: 'Привет! Я — THE ANGEL AI 🕊️',
  message:
    'Я твой AI-гид по проекту. Помогу разобраться, подскажу фичи и отвечу на вопросы. Просто нажимай на меня, когда нужна подсказка!',
};

/** Feature recommendations */
interface FeatureRecommendation {
  icon: string;
  title: string;
  description: string;
  link: string;
  color: string;
}

export const recommendations: FeatureRecommendation[] = [
  { icon: '🚀', title: 'Быстрый старт', description: '3 шага до ComfyUI', link: '#start', color: '#00F5FF' },
  { icon: '💰', title: 'Калькулятор цен', description: 'Сравнить GPU-облака', link: '#calculator', color: '#7B61FF' },
  { icon: '💻', title: 'AI Терминал', description: 'Интерактивные команды', link: '#terminal', color: '#A855F7' },
  { icon: '📂', title: 'Репозиторий', description: 'Структура проекта', link: '#repository', color: '#00FFB3' },
];

/** Detect section from scroll position */
export function detectSection(): string {
  if (typeof window === 'undefined') return 'hero';

  const scrollY = window.scrollY + 200;
  const sections = [
    { id: 'cta', selector: '[class*="pb-16"]:last-of-type' },
    { id: 'repository', selector: '#repository' },
    { id: 'terminal', selector: '#terminal' },
    { id: 'stats', selector: '#stats' },
    { id: 'workflows', selector: '#workflows' },
    { id: 'calculator', selector: '#calculator' },
    { id: 'architecture', selector: '#architecture' },
    { id: 'guide', selector: '#start' },
    { id: 'pipeline', selector: '#pipeline' },
    { id: 'features', selector: '#features' },
    { id: 'story', selector: '#story' },
    { id: 'hero', selector: '#hero' },
  ];

  // Find the last section that is above the current scroll position
  for (const section of sections) {
    const el = document.querySelector(section.selector);
    if (el) {
      const rect = el.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      if (absoluteTop <= scrollY) {
        return section.id;
      }
    }
  }

  return 'hero';
}
