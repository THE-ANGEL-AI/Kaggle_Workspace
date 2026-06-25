# PROJECT_MEMORY — Kaggle_Cloud (ComfyUI Flux2 на 2× T4)

> Локальная память проекта. **В `.gitignore`** — на GitHub не уезжает.
> Сюда складываем решения, грабли и состояние, которых не видно из кода.

## Что это за проект

Блокнот Kaggle для запуска **ComfyUI (Flux2 GGUF)** на **2× Tesla T4**.
Вся логика — в 3 скриптах в папке `instal/`, блокнот `comfyui-flux2.ipynb` = 3 строки.

```
instal/instal_comfyui.py     # ШАГ 1: uv + venv(py3.12) + torch cu130 + ComfyUI + Manager
instal/instal_castom_node.py # ШАГ 2: кастомные ноды + symlink на модели
instal/start.py              # ШАГ 3: запуск + Cloudflare-туннель + кнопки
```

## Правила общения (для AI-агентов)

> Дубликат правила из корневого `AGENTS.md`. Хранится здесь на случай, если
> инструменты, которые автоматически подхватывают `AGENTS.md` (Claude Code и
> подобные), не активированы, или агент в первую очередь читает PROJECT_MEMORY.

- **Все ответы — на русском языке.**
- **Followup-подсказки (`suggest_followups`) — на русском.**
- Комментарии в коде, логи, сообщения об ошибках — на русском.
- Английский — только там, где технически неизбежно: имена файлов, URL,
  имена пакетов, идентификаторы в коде, устоявшиеся англоязычные термины
  (`workflow`, `venv`, `torch`, `ComfyUI` и т. п.).
- Если пользователь просит «общайся на русском» / «пиши по-русски» — это
  правило остаётся в силе на все дальнейшие сессии в этом проекте.

## Ключевые решения (подтверждены тестом на железе)

- **uv** вместо virtualenv; **Python 3.12**.
- **torch cu130 (CUDA 13.0)**, НЕ cu128: драйвер Kaggle 580.x держит CUDA 13,
  ComfyUI 0.24 на cu130 включает оптимизированные CUDA-операции (на cu128 был
  warning и медленный путь). Откат — константа `TORCH_INDEX` в `instal_comfyui.py`.
- **Без xformers** (нет ядер для Turing T4) → запуск с `--use-pytorch-cross-attention` (SDPA).
- **SageAttention на T4 НЕ работает** (проверено июнь 2026): v2.2+ из исходников
  пропускает sm_75, v1.0.6 падает при компиляции ядра. Единственный быстрый путь — SDPA.
- Мульти-GPU: нода **ComfyUI-MultiGPU / DisTorch2** (pollockjj), а НЕ хак
  ComfyBootlegOffload.py (конфликтовали → тормоза).
- Убраны tensorflow и старые пины diffusers/transformers (конфликты).

## Грабли (почему добавлены проверки)

- **venv «теряется» после рестарта сессии.** `/kaggle/working/venv` переживает
  рестарт, но управляемый uv-ом CPython в `~/.cache` — нет. `venv/bin/python`
  становится битым симлинком. → Проверяем venv **запуском** (`python -c pass`),
  а не `os.path.exists`. `start.py` при поломке сам перезапускает `instal_comfyui.py`.
- **pip отказывается ставить uv** (`externally-managed-environment`, PEP 668) на
  свежих образах. → Ставим uv только если `shutil.which("uv")` пуст, при ошибке
  повторяем с `--break-system-packages`.
- **uv venv задавал вопрос** про очистку существующей папки. → `UV_NO_PROMPT=1`
  + `--clear` при пересоздании.

## Состояние

### 2026-06-06

- Скрипты перенесены в `instal/` (через `git mv`, история сохранена).
- Исправлены логи: везде писалось CUDA 12.8/cu128, хотя ставим 13.0/cu130 — поправлено.
- Во все 3 скрипта добавлены идемпотентные проверки (uv / venv / torch / ffmpeg / ComfyUI).
- README актуализирован. Блокнот правит вызовы на `instal/...`.

### 2026-06-24 — синхронизация с Kaggle_Workspace_FreeGPU

- **Смена имени репо.** Старое `THE-ANGEL-AI/Kaggle_Workspace` →
  новое `THE-ANGEL-AI/Kaggle_Workspace_FreeGPU`. Все живые ссылки
  в `README.md`, `instal/start.py` и комментарии в `.gitignore` приведены
  к новому имени; git remote перенаправлен на новый URL, push в `main`
  прошёл через rebase поверх чужого коммита, удалявшего 3 бейджа —
  итоговая история: `5b3361f → 2621ab4 → a394532`.
- **Чистка dead-code в `instal/start.py`.** Удалена константа `GIT_REPO_URL`:
  auto-update в `_check_git_updates()` берёт origin из локального `_THIS_DIR`
  (этот каталог уже git-клон после первой загрузки), константа нигде
  в коде не читалась. `py_compile` всех четырёх скриптов `instal/` чистый.
- **Два файла памяти агентов.** Создан корневой `AGENTS.md` (правила для
  AI-агентов — стандартное имя, автоматически читается Claude Code и
  подобными инструментами на старте сессии). Плюс в этом `PROJECT_MEMORY.md`
  зафиксирован раздёл «Правила общения (для AI-агентов)» с жёстким правилом
  общения на русском как запасной вариант, если `AGENTS.md` не подхватится.
- **Политика по `AGENTS.md` оставлена прежней.** Решено НЕ публиковать
  `AGENTS.md` в репо (правило `**/AGENTS.md` + `/*` в `.gitignore`
  помечает файл как «локальная инструкция, не публикуется»). Последний
  push сознательно содержит только `README.md` / `.gitignore` /
  `instal/start.py` — без `AGENTS.md`.

### 2026-06-24 — редизайн docs-site в стиле cyberpunk + anime 2026

Полная переделка лендинга репо. До этого GitHub Pages рендерил README
через Jekyll с 22+ «мусорными» деплоями на каждый коммит в `main`.
Решено:

- **Сайт переехал в отдельную папку `docs-site/`** (whitelisted в
  `.gitignore` рядом с `!Notebook/`, `!workflows/`, `!instal/`). Не
  трогает `instal/`, `workflows/`, `Notebook/` — только лендинг.
- **4 файла:** `index.html` (cyberpunk hero с kinetic-glitch + bento +
  fake-terminal + news teaser + examples + CTA + footer), `news.html`
  (отдельная страница ленты, 6 записей от 15.11.2026 до 01.08.2026),
  `styles.css` (cyberpunk palette: cyan / magenta / yellow / violet
  поверх `--bg-void`, keyframes `glitch-r/glitch-b/pulse/blink` через
  `data-text` для kinetic hero, scanlines + ambient grid + vignette,
  кнопки с полным циклом состояний idle / hover / active / focus,
  bento-grid 6-col, `prefers-reduced-motion`) и `assets/character.png`
  (главный персонаж-талисман проекта, 1920×1088 PNG ~3.1 MB,
  встроен в hero справа в neon-glow рамке с floating анимацией и
  split-layout (текст слева / персонаж справа); на mobile —
  single-column, рисунок сверху через `order: -1`).
- **Коммит `51878c2`:** «feat(site): полный редизайн docs-site…»,
  +1295 / −355 строк, автор `THE-ANGEL-AI` без `Co-Authored-By`,
  push в `origin/main` чистый. Детали схемы деплоя — в новом разделе
  «GitHub Pages workflow» ниже.

### 2026-06-24 — миграция docs-site на Vite 6 + React 19 + TS SPA

Полный переход с vanilla HTML5+CSS на современный SPA-стек. GitHub Pages
остался тем же хостингом, добавился только build-pipeline.

- **Конфигурация Vite**: `package.json` + `package-lock.json` — React
  19.0 + react-router-dom 7.1 + framer-motion 12.4 + TS 5.7 + Vite 6.0.
  `vite.config.ts` — `base: '/Kaggle_Workspace_FreeGPU/'` (subpath
  GH Pages), `outDir: 'docs-site/dist'`, manual chunks (react-vendor /
  motion-vendor / app code) для лучшего LCP. `tsconfig.json` +
  `tsconfig.node.json` — strict mode + paths aliases (@components,
  @hooks, @styles, @lib, @data, @pages).
- **SPA-fallback для прямых заходов**: `public/404.html` сохраняет
  путь прямого захода (например `/news`) в sessionStorage и
  редиректит на `/`, где `src/main.tsx` функция
  `bootstrapSpaRedirect()` ДО монтирования React Router восстанавливает
  маршрут через `history.replaceState`. Дефенсивная валидация
  `stored.startsWith('/') && !startsWith('//') && !startsWith('/\\')`
  отсекает protocol-relative и backslash-tricks. BrowserRouter настроен
  с `basename={import.meta.env.BASE_URL}` — корректно strip'ает
  /Kaggle_Workspace_FreeGPU/ prefix на GH Pages (без этого `<Route
  path="/news">` не матчится).
- **Source-структура**: `src/` разнесён на `components/` (Nav / Footer
  / Hero с mouse-tracking spotlight через Framer Motion useMotionValue,
  Bento 6 карточек со stagger-reveal, Quickstart terminal-snippet с
  copy-кнопкой, NewsCard, WorkflowsShowcase, InstallStepper 3-step
  с прогресс-баром и копированием, LiveStats с animated counters),
  `pages/` (`Home` собирает все 11 секций + `News` отдельная лента),
  `hooks/` (useMousePosition, useReducedMotion, useScrollProgress,
  useCopyToClipboard), `lib/cn.ts`, `data/news.ts` (одна source of
  truth для index и /news), `styles/` — дизайн-система на
  `:root` CSS-переменных (tokens / reset / globals / hero /
  components).
- **Изменено**: `.github/workflows/pages.yml` — добавлены
  `actions/setup-node@v4` (Node 22), `npm ci`, `npm run build`
  (= `tsc --noEmit && vite build`), upload `docs-site/dist/` через
  `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`.
  `.gitignore` — добавлены `node_modules/`, `docs-site/dist/`, `.vite/`,
  плюс `.jbase/.jkid` (см. предыдущий раздел).
- **Удалено**: старый `docs-site/styles.css` (Vite `src/styles/*.css`
  — новый source of truth). `docs-site/index.html` и `docs-site/news.html`
  больше НЕ деплоятся напрямую — после build они заменены на Vite-output
  в `docs-site/dist/` с маршрутами `/` и `/news` под BrowserRouter.
- **Bundle sizes после `vite build`**: `index.html` 1.22 KB (gzip
  0.69 KB), `index.css` 23.53 KB (gzip 5.60 KB), `react-vendor` 48.42 KB
  (gzip 17.14 KB), `motion-vendor` 131.81 KB (gzip 43.51 KB),
  `app code` 210.49 KB (gzip 66.39 KB). Итого ~210 KB gzip JS + 6 KB
  gzip CSS — ок для интерактивного лендинга с Framer Motion-анимациями.
  Vendor-чанки вынесены отдельно — react (48 KB) и Framer Motion
  (132 KB) кешируются независимо от app-кода (210 KB).

**Коммит `fa4874e`**: «feat(site): миграция docs-site → Vite 6 + React
19 + TypeScript SPA», +4554 / −986 строк, 36 новых файлов, автор
`THE-ANGEL-AI` без `Co-Authored-By`. Pre-push code-review прошёл три
итерации: первая нашла critical regression `BrowserRouter basename`
(без него SPA-fallback бесполезен — `<Route path="/news">` не матчится
на GH Pages subpath), вторая дала «Принято» после фикса. Build
`CI=true npm run build` чистый (tsc --noEmit + vite build за 2.74 c).
Push в `origin/main` чистый — 0 ahead/behind после push. Workflow
GitHub Actions должен отработать за 1-2 минуты и поднять новый SPA
на `https://the-angel-ai.github.io/Kaggle_Workspace_FreeGPU/`.

## GitHub Pages workflow

Чтобы будущие сессии не гадали «почему 22 деплоя и зачем отдельный сайт».

- **Папка сайта:** `docs-site/` — whitelisted в `.gitignore` рядом с
  `!Notebook/`, `!workflows/`, `!instal/`. Внутри теперь **source
  для Vite-build'а**, а не готовый сайт: корневой `index.html` (Vite
  entry для всех SPA-маршрутов, монтирует `<div id="root">` +
  подгружает `/src/main.tsx`), `public/404.html` (SPA-fallback, см.
  новую секцию «2026-06-24 — миграция docs-site на Vite + React + TS»),
  `public/assets/character.png` (копия талисмана, 1920×1088 PNG
  ~3.1 MB). Вся Vite-инфраструктура — в корне репо: `package.json`,
  `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json` и весь
  `src/` (компоненты, страницы, хуки, дизайн-система). Реально
  деплоится результат `npm run build` — папка `docs-site/dist/`
  (HTML + hashed JS-чанки + CSS). `.nojekyll` оставлен на всякий
  случай (Pages читает его как подсказку «не обрабатывать как
  Jekyll-сайт», плюс теперь есть SPA-fallback через 404.html).
- **Деплойный workflow:** `.github/workflows/pages.yml`. Условный
  триггер — деплой запускается **только** когда меняется содержимое
  папки `docs-site/` или сам workflow-файл:

  ```yaml
  on:
    push:
      branches: [ main ]
      paths:
        - 'docs-site/**'
        - '.github/workflows/pages.yml'
    workflow_dispatch:
  ```

  Правки `instal/`, `workflows/`, `Notebook/`, `README.md` —
  НЕ триггерят пересборку Pages. `workflow_dispatch` оставлен на
  случай форсированного ручного деплоя из вкладки Actions.
- **Action-теги** (зафиксированы): `actions/checkout@v4`,
  `actions/configure-pages@v4`, `actions/upload-pages-artifact@v3`,
  `actions/deploy-pages@v4`. Без `@v5` — был риск что версия ещё
  не опубликована к июню 2026 (поправлено в одном из прошлых
  коммитов после ревью).
- **Permissions:** `contents: read`, `pages: write`, `id-token: write`.
- **Concurrency:** группа `pages`, `cancel-in-progress: true` —
  второй запущенный деплой отменяет первый, в истории GH Actions не
  копится хвост из параллельных прогонов.
- **Deploy environment:** `environment.name: github-pages`. GitHub
  сам подставит `${{ steps.deployment.outputs.page_url }}` — наш
  сайт должен открываться по
  `https://the-angel-ai.github.io/Kaggle_Workspace_FreeGPU/`.

### ⚠️ Обязательный ручной шаг в `Settings → Pages`

Делается один раз для репо. **Source** должен быть переключён с
«Branch: main» на **«GitHub Actions»**. URL:
`https://github.com/THE-ANGEL-AI/Kaggle_Workspace_FreeGPU/settings/pages`.

Без этого переключения старая Jekyll-рендерилка README продолжает
работать, а наш workflow `pages.yml` молча игнорируется — лендинг не
поднимется, хотя коммиты в `docs-site/` идут в `main`. Проверить
можно по вкладке Actions: если деплои не появляются после правок в
`docs-site/`, значит Source не переключён.

### Было / стало

- **Было:** каждый push в `main` → Jekyll-рендер README → новый
  деплой. 22+ деплоев за всё время, история замусорена, README
  смотрелся как «простая страничка» в корпоративных серых тонах.
- **Стало:** правки скриптов → ноль деплоев. Правки внутри
  `docs-site/` → один условный деплой через GitHub Actions.

## Сайт (ветка `site`) — статус на 2026-06-24

### ✅ Выполнено (PHASE 1-15)

**PHASE 1 — Project Setup**
- Vite + React 19 + TypeScript + TailwindCSS v4 + Framer Motion + Three.js + GSAP + Lenis
- ESLint + Prettier, strict TypeScript (`noUnusedLocals`, `noUnusedParameters`)
- SEO: Open Graph, Twitter Cards, JSON-LD, sitemap.xml, robots.txt
- GitHub Pages деплой настроен (ветка `main` через Actions)
- SPA-fallback через `404.html` + `bootstrapSpaRedirect()`

**PHASE 2 — Visual Identity**
- Дизайн-система «AI Laboratory of the Future»
- Палитра: #00F5FF (cyan) / #7B61FF (violet) / #A855F7 (purple) / #0A0A1E (deep)
- Glassmorphism, holographic effects, neon glow, gradient text
- CSS-переменные дизайн-системы

**PHASE 3 — Hero Section**
- 3D-сцена (R3F): AI Core (икосаэдр + MeshDistortMaterial), парящие орбы, particle system, data streams
- AI Boot Sequence: 10 строк, прогресс-индикаторы, blinking cursor
- Магнитные кнопки (MagneticButton), text reveal, custom cursor (CursorGlow)

**PHASE 4 — 3D Experience**
- GPUModel: floating GPU с VRAM chips, hover proximity glow
- NeuralNetwork: 3-слойная нейросеть (5-8-5 нодов) с Line-соединениями
- HolographicRings, DataCubes, EnergyRing, HoverOrb
- Geometry cleanup (useEffect dispose)

**PHASE 5 — Scroll Storytelling**
- Lenis smooth scroll + 6 глав с параллаксом и scroll-триггерами
- StorySection: переиспользуемый компонент с gradient accent

**PHASE 6 — Quick Start Experience**
- InteractiveGuide: 5-шаговый онбординг (30s), копирование кода
- WorkflowDiagram: SVG-схема пайплайна с анимированными стрелками
- InstallStepper: анимированные шаги 1/3, 2/3, 3/3

**PHASE 7 — Interactive Architecture**
- SVG-граф с 11 нодами, flow-dots (анимированные частицы вдоль рёбер)
- Zoom + pan, hover/click info-панель

**PHASE 8 — GPU Cost Calculator**
- Слайдер часов/неделю (1–168), 4 платформы (Kaggle $0, Colab $9.99, RunPod $14.50, Vast.ai $11.20)
- Анимированные счётчики, savings-bars, таблица GPU (T4/P100/A100/4090)

**PHASE 9 — Repository Showcase**
- 4 таба: Structure / Scripts / Workflows / Features
- Рекурсивное дерево файлов, 3 скрипта, 3 workflow, 6 фич

**PHASE 10 — AI Terminal**
- 16 команд (10 основных + 6 секретных: whoami, neofetch, matrix, sudo, 42, uptime)
- Matrix rain на Canvas (RAF), история ArrowUp/Down, цветной парсер

**PHASE 11 — AI Angel Assistant**
- SVG-маскот (аниме-ангел), плавающий виджет с контекстными подсказками
- Welcome toast (sessionStorage), рекомендации, Escape-закрытие

**PHASE 12 — Live GitHub Integration**
- Хук useGitHubData с in-memory кешем (2min TTL)
- Stars/Forks/Watchers/Issues, коммиты, контрибьюторы, релизы

**PHASE 13 — Gallery**
- 8 SVG-превью (Flux×3, LTX×2, Comfy×2, TTS×2), masonry grid
- Lightbox с клавиатурой (Esc, ←, →), категории, hover-zoom

**PHASE 14 — Roadmap**
- 19 вех, прогресс-бар 74%, фильтрация по статусу
- Timeline cards с expand/collapse, AnimatePresence

**PHASE 15 — Community Section**
- 4 платформы (GitHub/Discord/VK/Boosty), 6 анимированных счётчиков
- SVG-график роста (6 мес), недельная активность, фичи сообщества

### 📁 Ключевые файлы (ветка `site`)
```
src/
├── scenes/
│   └── HeroScene.tsx              ← 3D сцена (AI Core, GPU, Particles)
├── components/
│   ├── Hero.tsx / HeroBootSequence.tsx / CursorGlow.tsx
│   ├── InteractiveGuide.tsx / WorkflowDiagram.tsx / StorySection.tsx
│   ├── ArchitectureGraph.tsx      ← SVG-граф компонентов
│   ├── GPUCostCalculator.tsx      ← Калькулятор GPU
│   ├── RepositoryShowcase.tsx     ← Табы + дерево файлов
│   ├── AITerminal.tsx             ← 16 команд, matrix rain
│   ├── AngelAssistant.tsx         ← SVG-маскот, floating widget
│   ├── GitHubIntegration.tsx      ← GitHub API stats
│   ├── Gallery.tsx                ← Masonry + lightbox
│   ├── Roadmap.tsx               ← Timeline roadmap
│   ├── CommunitySection.tsx       ← Сообщество + график роста
│   ├── Bento.tsx / LiveStats.tsx / WorkflowsShowcase.tsx / InstallStepper.tsx
│   └── ui/button.tsx             ← Shadcn button
├── data/
│   ├── gpuCosts.ts / gallery.tsx / community.ts / roadmap.ts
│   ├── repository.ts / terminalCommands.ts / assistantHints.ts
│   └── news.ts / architecture.ts
├── hooks/
│   ├── useGitHubData.ts           ← GitHub API с кешем
│   ├── useLenis.ts / useMousePosition.ts
│   └── useCopyToClipboard.ts / useReducedMotion.ts
├── pages/
│   ├── Home.tsx                   ← Главная (20+ секций)
│   └── News.tsx                   ← Лента новостей
├── styles/index.css               ← Дизайн-система
├── App.tsx                        ← Router + AngelAssistant глобально
└── main.tsx                       ← Entry point + SPA redirect
```

### 📋 Осталось (PHASE 16-19)

| Фаза | Описание |
|------|----------|
| **PHASE 16** | Social Proof — анимированные счётчики, параллакс |
| **PHASE 17** | Advanced Effects — liquid transitions, aurora |
| **PHASE 18** | Performance Optimization — Lighthouse 95+ |
| **PHASE 19** | Final Polish — кросс-браузер, мобильные, a11y |

### 🏗️ Известные проблемы

- **Bundle size**: основной чанк ~210 KB gzip (уже оптимизирован через manualChunks)
- **character.png**: 3.1 MB — нужно сжать до WebP
- **og-image.png**: не создан (нужен для Open Graph preview)
- **Lighthouse**: не проводился (PHASE 18)

## Не сделано / на будущее

- Настоящий A/B замер времени генерации cu128 vs cu130 (нужен реальный воркфлоу).
- Своя кастомная нода ComfyUI с графическим интерфейсом внутри Kaggle.
