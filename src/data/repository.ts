/* ──────────────────────────────────────────────
   Repository Showcase — данные репозитория
   Структура main ветки Kaggle_Workspace_FreeGPU
   ────────────────────────────────────────────── */

export interface RepoScript {
  name: string;
  file: string;
  icon: string;
  step: number;
  title: string;
  description: string;
  details: string;
  color: string;
  lines?: number;
}

export interface RepoWorkflow {
  name: string;
  file: string;
  icon: string;
  description: string;
  models: string[];
  accent: string;
}

interface RepoFeature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

/** Scripts (instal/) */
export const repoScripts: RepoScript[] = [
  {
    name: 'instal_comfyui.py',
    file: 'instal/instal_comfyui.py',
    icon: '⚙️',
    step: 1,
    title: 'Окружение и зависимости',
    description: 'uv + venv + Python 3.12 + torch cu130 + ComfyUI + Manager',
    details: 'Поднимает изолированное окружение через uv (быстрее pip/virtualenv). Ставит torch для CUDA 13.0 (cu130) — оптимизирован под драйвер Kaggle 580.x. Без xformers и SageAttention (не работают на T4), использует родной SDPA. ComfyUI 0.24+ и Manager устанавливаются автоматически.',
    color: '#00F5FF',
  },
  {
    name: 'instal_castom_node.py',
    file: 'instal/instal_castom_node.py',
    icon: '🧩',
    step: 2,
    title: 'Кастомные ноды и модели',
    description: 'Симлинки на модели + ComfyUI-Manager custom nodes',
    details: 'Создаёт симлинки на веса из /kaggle/input (Flux2 GGUF, LTX 2.3 Video, TTS). Устанавливает DisTorch2 для MultiGPU (2× T4). Через ComfyUI-Manager доустанавливает недостающие ноды из реестра. Всё идемпотентно — можно перезапускать без риска.',
    color: '#A855F7',
  },
  {
    name: 'start.py',
    file: 'instal/start.py',
    icon: '🚀',
    step: 3,
    title: 'Запуск + туннель',
    description: 'ComfyUI на 2× T4 + Cloudflare Tunnel + keep-alive',
    details: 'Запускает ComfyUI на двух Tesla T4 через DisTorch2. Поднимает Cloudflare-туннель для публичного URL. Генерирует кнопки управления (Open / Stop / Restart). Keep-alive в фоновом потоке не даёт Kaggle усыпить сессию через ~40 минут простоя.',
    color: '#00FFB3',
  },
];

/** Workflows */
export const repoWorkflows: RepoWorkflow[] = [
  {
    name: 'Flux2 GGUF',
    file: 'workflows/Flux2dev32b_GGUF.json',
    icon: '🖼️',
    description: 'Text-to-Image на Flux2 (12B, GGUF-квант) для ComfyUI. Генерация 1024×1024 за ~30с на 2× T4.',
    models: ['Flux2 GGUF', 'CLIP', 'T5'],
    accent: '#00F5FF',
  },
  {
    name: 'Flux2 GGUF v2 API',
    file: 'workflows/Flux2dev32b_GGUF v2 API.json',
    icon: '🔌',
    description: 'API-версия Flux2: скриптовый запуск через внешние запросы, интеграция с ботами и автоматизацией.',
    models: ['Flux2 GGUF', 'CLIP', 'T5'],
    accent: '#7B61FF',
  },
  {
    name: 'LTX Director V2 Beta',
    file: 'workflows/LTX_Director-V2-Beta.json',
    icon: '🎬',
    description: 'LTX 2.3 Video — Text/Image-to-Video с Crop-Guide для контроля движения камеры. До 121 кадра, 720p.',
    models: ['LTX 2.3 Video', 'Audio-model'],
    accent: '#FF007A',
  },
];

/** Feature cards */
export const repoFeatures: RepoFeature[] = [
  { icon: '🧠', title: 'Free GPU Access', description: 'Два Tesla T4 (16 GB VRAM each) — бесплатно, на неограниченное время сессии', color: '#00F5FF' },
  { icon: '⚡', title: 'ComfyUI Ready', description: 'Готовое окружение с ComfyUI 0.24+, Manager и 50+ кастомных нод', color: '#A855F7' },
  { icon: '🎨', title: 'Flux2 GGUF Support', description: 'Flux2 12B в GGUF-кванте — text-to-image 1024×1024 за ~30 секунд', color: '#7B61FF' },
  { icon: '🎬', title: 'LTX 2.3 Video', description: 'Text/Image-to-Video + Audio до 121 кадра, Crop-Guide motion control', color: '#FF007A' },
  { icon: '☁️', title: 'Cloud Deployment', description: 'Cloudflare-туннель — публичный URL из блокнота за 2 минуты', color: '#00FFB3' },
  { icon: '🤖', title: 'AI Automation', description: 'Keep-alive, идемпотентные скрипты, API-ready для ботов и пайплайнов', color: '#FCEE0A' },
];

/* ── Inline file tree for Structure tab ── */

export interface FileTreeNode {
  name: string;
  icon: string;
  type: 'file' | 'dir';
  description: string;
  children?: FileTreeNode[];
}

export const repoFileTree: FileTreeNode[] = [
  {
    name: 'Kaggle_Workspace_FreeGPU',
    icon: '📁',
    type: 'dir',
    description: 'Корень репозитория',
    children: [
      {
        name: 'instal/',
        icon: '📦',
        type: 'dir',
        description: 'Скрипты установки',
        children: [
          { name: 'instal_comfyui.py', icon: '⚙️', type: 'file', description: 'uv + venv + torch + ComfyUI' },
          { name: 'instal_castom_node.py', icon: '🧩', type: 'file', description: 'Ноды + симлинки моделей' },
          { name: 'start.py', icon: '🚀', type: 'file', description: 'Запуск + Cloudflare-туннель' },
          { name: 'kaggle_env.py', icon: '🔧', type: 'file', description: 'Конфигурация окружения' },
          { name: '.gitignore', icon: '🔒', type: 'file', description: 'Игнор для instal/' },
        ],
      },
      {
        name: 'workflows/',
        icon: '🔀',
        type: 'dir',
        description: 'ComfyUI графы',
        children: [
          { name: 'Flux2dev32b_GGUF.json', icon: '🖼️', type: 'file', description: 'Flux2 Text-to-Image' },
          { name: 'Flux2dev32b_GGUF v2 API.json', icon: '🔌', type: 'file', description: 'Flux2 API-версия' },
          { name: 'LTX_Director-V2-Beta.json', icon: '🎬', type: 'file', description: 'LTX Video 2.3' },
        ],
      },
      {
        name: 'Notebook/',
        icon: '📓',
        type: 'dir',
        description: 'Блокноты Kaggle',
        children: [],
      },
      {
        name: 'docs-site/',
        icon: '🌐',
        type: 'dir',
        description: 'Исходники GitHub Pages (Vite)',
        children: [],
      },
      { name: 'README.md', icon: '📖', type: 'file', description: 'Документация' },
      { name: '.gitignore', icon: '🔒', type: 'file', description: 'Корневой .gitignore' },
    ],
  },
];
