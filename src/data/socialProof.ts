/* ──────────────────────────────────────────────
   Social Proof — счётчики, метрики, отзывы
   ────────────────────────────────────────────── */

export interface ProofCounter {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  color: string;
  icon: string;
  description: string;
}

export interface MilestoneMetric {
  label: string;
  value: string;
  color: string;
  description: string;
}

export interface Testimonial {
  text: string;
  author: string;
  role: string;
  avatar: string;
}

export const proofCounters: ProofCounter[] = [
  {
    label: 'Участников сообщества',
    value: 428,
    suffix: '+',
    color: '#00F5FF',
    icon: '👥',
    description: 'Активных пользователей в Discord, VK и GitHub',
  },
  {
    label: 'Сгенерировано изображений',
    value: 12800,
    suffix: '+',
    color: '#7B61FF',
    icon: '🖼️',
    description: 'Flux2 GGUF и ComfyUI генерации',
  },
  {
    label: 'Запусков ComfyUI',
    value: 3400,
    suffix: '+',
    color: '#A855F7',
    icon: '🚀',
    description: 'Успешных сессий на 2× T4',
  },
  {
    label: 'Видео-генераций LTX',
    value: 890,
    suffix: '+',
    color: '#FF007A',
    icon: '🎬',
    description: 'LTX 2.3 Video и Director генерации',
  },
  {
    label: 'Звёзд на GitHub',
    value: 42,
    suffix: '',
    color: '#FCEE0A',
    icon: '⭐',
    description: 'Рейтинг проекта на GitHub',
  },
  {
    label: 'Скачиваний репозитория',
    value: 1500,
    suffix: '+',
    color: '#00FFB3',
    icon: '📦',
    description: 'Клонирований и скачиваний с GitHub',
  },
];

export const milestoneMetrics: MilestoneMetric[] = [
  {
    label: 'GPU часов в месяц',
    value: '2 580+',
    color: '#00F5FF',
    description: 'Бесплатных часов на двух T4',
  },
  {
    label: 'Сэкономлено $',
    value: '$4 200+',
    color: '#00FFB3',
    description: 'В пересчёте на RunPod по $0.16/h',
  },
  {
    label: 'Среднее время сессии',
    value: '4.2h',
    color: '#7B61FF',
    description: 'Средняя длительность одной сессии',
  },
  {
    label: 'Успешность запуска',
    value: '97%',
    color: '#A855F7',
    description: 'Процент успешных запусков ComfyUI',
  },
];

export const testimonials: Testimonial[] = [
  {
    text: 'Наконец-то можно нормально гонять Flux2 без Colab-лимитов. Два T4 с SDPA — это реально быстро!',
    author: 'Алексей М.',
    role: 'ML Engineer',
    avatar: '🤖',
  },
  {
    text: 'Установка за 2 минуты, всё идемпотентно — перезапускаешь сессию и не боишься, что сломается.',
    author: 'Екатерина Д.',
    role: 'AI Artist',
    avatar: '🎨',
  },
  {
    text: 'LTX Director с Crop-Guide — это киллер-фича. Контроль движения камеры прямо из блокнота.',
    author: 'Дмитрий К.',
    role: 'Video Producer',
    avatar: '🎥',
  },
  {
    text: 'Бесплатный ComfyUI на 2× T4 — лучший вариант для экспериментов без вложений.',
    author: 'Михаил С.',
    role: 'Indie Developer',
    avatar: '💻',
  },
];
