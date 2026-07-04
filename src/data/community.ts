/* ──────────────────────────────────────────────
   Community — платформы, статистика, метрики
   ────────────────────────────────────────────── */

export interface SocialPlatform {
  id: string;
  name: string;
  description: string;
  url: string;
  color: string;
  icon: string;
  stats: { label: string; value: string }[];
  cta: string;
}

interface CommunityStat {
  label: string;
  value: number;
  suffix: string;
  color: string;
  icon: string;
}

interface GrowthMetric {
  month: string;
  value: number;
}

export const socialPlatforms: SocialPlatform[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Исходный код проекта, issue, pull requests, обсуждения архитектуры',
    url: 'https://github.com/THE-ANGEL-AI/Kaggle_Workspace_FreeGPU',
    color: '#00F5FF',
    icon: '🐙',
    stats: [
      { label: 'Stars', value: '★ 56' },
      { label: 'Forks', value: '18' },
      { label: 'Issues', value: '5' },
    ],
    cta: '⭐ Поставить звезду',
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Обсуждения, поддержка, бета-тесты, анонсы релизов в реальном времени',
    url: 'https://discord.gg/theangel',
    color: '#7B61FF',
    icon: '💬',
    stats: [
      { label: 'Участников', value: '180+' },
      { label: 'Онлайн', value: '20–40' },
      { label: 'Каналов', value: '10' },
    ],
    cta: '🔊 Присоединиться',
  },
  {
    id: 'vk',
    name: 'VK',
    description: 'Новости проекта, туториалы, анонсы обновлений, голосования за фичи',
    url: 'https://vk.com/theangel_lab',
    color: '#A855F7',
    icon: '📢',
    stats: [
      { label: 'Подписчиков', value: '350+' },
      { label: 'Постов', value: '55+' },
      { label: 'Охват', value: '1.8K / нед' },
    ],
    cta: '📨 Подписаться',
  },
  {
    id: 'boosty',
    name: 'Boosty',
    description: 'Донаты, ранний доступ, приоритетная поддержка, голоса за новые модели',
    url: 'https://boosty.to/the_angel/donate',
    color: '#00FFB3',
    icon: '💖',
    stats: [
      { label: 'Подписчиков', value: '22' },
      { label: 'Цель', value: '50' },
      { label: 'Собрано', value: '44%' },
    ],
    cta: '💖 Поддержать',
  },
];

export const communityStats: CommunityStat[] = [
  {
    label: 'Участников сообщества',
    value: 560,
    suffix: '+',
    color: '#00F5FF',
    icon: '👥',
  },
  {
    label: 'Сгенерировано изображений',
    value: 18500,
    suffix: '+',
    color: '#7B61FF',
    icon: '🖼️',
  },
  {
    label: 'Запусков ComfyUI',
    value: 5200,
    suffix: '+',
    color: '#A855F7',
    icon: '🚀',
  },
  {
    label: 'Видео-генераций LTX',
    value: 1450,
    suffix: '+',
    color: '#00FFB3',
    icon: '🎬',
  },
  {
    label: 'Звёзд на GitHub',
    value: 56,
    suffix: '',
    color: '#FCEE0A',
    icon: '⭐',
  },
  {
    label: 'Скачиваний репозитория',
    value: 2300,
    suffix: '+',
    color: '#FF007A',
    icon: '📦',
  },
];

export const growthMetrics: GrowthMetric[] = [
  { month: 'Фев', value: 40 },
  { month: 'Мар', value: 85 },
  { month: 'Апр', value: 160 },
  { month: 'Май', value: 280 },
  { month: 'Июн', value: 420 },
  { month: 'Июл', value: 560 },
];

export const communityFeatures = [
  {
    title: 'Совместное творчество',
    desc: 'Делитесь генерациями, workflow и идеями в общих каналах Discord и VK',
  },
  {
    title: 'Приоритетная поддержка',
    desc: 'Бустеры на Boosty получают ответы на вопросы в течение 24 часов',
  },
  {
    title: 'Бета-тест новых моделей',
    desc: 'Первыми пробуйте LTX Director, Flux2 обновления и TTS-пилоты',
  },
  {
    title: 'Влияние на roadmap',
    desc: 'Голосуйте за следующие фичи: ControlNet, LoRA, DreamBooth и другие',
  },
];
