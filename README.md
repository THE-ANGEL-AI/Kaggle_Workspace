# 🌐 Kaggle Workspace — Landing Page (GitHub Pages)

**Ветка `site`** репозитория [THE-ANGEL-AI/Kaggle_Workspace_FreeGPU](https://github.com/THE-ANGEL-AI/Kaggle_Workspace_FreeGPU).

Полностью переработанная версия лендинга в стиле **Cyberpunk + Anime 2026** — React SPA с 3D-сценами, анимированными интерфейсами и интеграцией с GitHub API.

| Ссылка | Назначение |
| --- | --- |
| 🐙 [GitHub (main)](https://github.com/THE-ANGEL-AI/Kaggle_Workspace_FreeGPU) | Kaggle-скрипты, workflow, блокноты |
| 🌐 [GitHub Pages](https://the-angel-ai.github.io/Kaggle_Workspace_FreeGPU/) | Лендинг (этот сайт) |
| 🎨 Workflow | `main` → `workflows/` (Flux2 GGUF, LTX 2.3, LTX Director) |
| 📓 Notebooks | `main` → `Notebook/` |

---

## 🚀 Tech Stack

| Технология | Версия | Назначение |
|------------|--------|------------|
| **Vite** | 6.0 | Сборщик с HMR |
| **React** | 19.0 | UI-библиотека |
| **TypeScript** | 5.7 | Типизация (strict mode, noUnusedLocals) |
| **TailwindCSS** | 4.3 | Утилитарные стили + glassmorphism |
| **Framer Motion** | 12.4 | Анимации, AnimatePresence, scroll-триггеры |
| **React Three Fiber** | 9.6 | 3D-сцены (Three.js + R3F) |
| **React Router DOM** | 7.1 | Клиентский роутинг |
| **GSAP** | 3.15 | Продвинутые timeline-анимации |
| **Lenis** | 1.3 | Плавный scroll с easing |
| **Lucide React** | 1.21 | Иконки |
| **Gravity Index** | — | Сравнение GPU-провайдеров |

**Dev:** ESLint + Prettier, TypeScript strict mode.

---

## 📦 PHASE 1–15: Что уже реализовано

### ✅ PHASE 1 — Project Setup
- Vite + React 19 + TypeScript + TailwindCSS + Framer Motion + Three.js
- GitHub Pages CI/CD (`.github/workflows/pages.yml`)
- GitHub Pages base path `/Kaggle_Workspace_FreeGPU/` для production

### ✅ PHASE 2 — Visual Identity
- Дизайн-система «AI Laboratory of the Future»
- Палитра: `#00F5FF` (cyan) / `#7B61FF` (violet) / `#A855F7` (purple) / `#FF007A` (magenta) / `#00FFB3` (green)
- Glassmorphism (backdrop-blur, rgba-glass), neon glow, кастомные тени
- Градиентные акценты, шумовая текстура

### ✅ PHASE 3 — Hero Section
- 3D-сцена (Three.js + R3F) с кастомным шейдером
- AI Boot Sequence — анимация загрузки
- Магнитные кнопки, кастомный курсор, параллакс фона
- Счётчики (428 участников, 12800+ генераций, 3400 запусков)

### ✅ PHASE 4 — 3D Experience
- AI Core — вращающееся ядро с неоновым свечением
- GPU-модели — парящие орбы с частицами
- Data streams — анимированные линии данных
- Holographic rings — голографические кольца
- Пост-обработка через `@react-three/postprocessing`

### ✅ PHASE 5 — Scroll Storytelling
- 6 глав с параллакс-эффектами и scroll-триггерами через Framer Motion `whileInView`
- Lenis для плавного скролла
- Gradient accent для заголовков в каждой главе

### ✅ PHASE 6 — Quick Start Experience
- 30-секундный онбординг (InteractiveGuide)
- Визуальная схема пайплайна (WorkflowDiagram)
- Анимированный stepper (InstallStepper) с шагами 1/3, 2/3, 3/3
- Копирование кода в буфер обмена

### ✅ PHASE 7 — Interactive Architecture
- Интерактивный SVG-граф компонентов (11 нод)
- Flow-dots — анимированные частицы вдоль рёбер графа
- Zoom + pan по графу
- Hover/click для info-панели

### ✅ PHASE 8 — GPU Cost Calculator
- Слайдер часов/неделю (1–168)
- 4 платформы: **Kaggle** ($0), **Colab** ($9.99), **RunPod** ($14.50), **Vast.ai** ($11.20)
- Анимированные счётчики стоимости
- Savings-bars (экономия в год)
- Таблица характеристик GPU (T4, P100, A100, RTX 4090)
- Все цены на июнь 2026

### ✅ PHASE 9 — Repository Showcase
- 4 таба: Структура / Скрипты / Workflows / Фичи
- Рекурсивное дерево файлов с expand/collapse
- 3 карточки instal-скриптов с деталями
- 3 карточки workflow (Flux2 GGUF, Flux2 API, LTX Director)

### ✅ PHASE 10 — AI Terminal
- 16 команд: `help`, `github`, `kaggle`, `comfy`, `flux`, `ltx`, `models`, `specs`, `quickstart`, `clear`
- 6 секретных команд (easter eggs): `whoami`, `neofetch`, `matrix`, `sudo`, `42`, `uptime`
- Matrix rain на Canvas (RAF с символом катаканы)
- История команд через ArrowUp/ArrowDown
- Цветной парсер (`<cyan>`, `<green>`, `<purple>`, `<dim>`, `<bold>`)
- Blinking cursor, автоскролл

### ✅ PHASE 11 — AI Angel Assistant
- Плавающий SVG-маскот с неоновым гало и фиолетовыми крыльями
- Welcome toast при первом посещении (sessionStorage)
- Контекстные подсказки при скролле (определяет секцию по HTML-ID)
- 4 рекомендации (Быстрый старт, Калькулятор, Терминал, Репозиторий)
- Escape закрывает панель

### ✅ PHASE 12 — Live GitHub Integration
- Хук `useGitHubData` с in-memory кешем (2min TTL)
- Stars / Forks / Watchers / Issues через GitHub API
- 5 последних коммитов с SHA, автором, временем («3h ago»)
- Аватары контрибьюторов с числом контрибуций
- Последний релиз с описанием
- Автообновление каждые 3 минуты + кнопка «Обновить»
- Error banner при rate-limit

### ✅ PHASE 13 — Gallery
- 8 SVG-превью в 4 категориях: Flux2 (3), LTX Video (2), ComfyUI (2), TTS (2)
- Masonry grid через CSS columns (1→2→3 responsive)
- Lightbox с клавиатурной навигацией (Esc, ←, →)
- Категории с цветовыми фильтрами
- Hover-zoom с иконкой Maximize2
- Анимированные SVG-элементы (`<animate>`, пульсации, орбиты)

### ✅ PHASE 14 — Roadmap
- 19 вех: 14 завершённых, 1 текущая, 3 плановых, 3 будущих
- Прогресс-бар с шиммером (74%)
- Фильтрация по статусу (All / Done / Current / Planned / Future)
- Timeline cards с expand/collapse, тегами, датами
- `AnimatePresence` для плавных переходов при фильтрации

### ✅ PHASE 15 — Community Section
- 4 платформы: GitHub (⭐), Discord (💬), VK (📢), Boosty (💖) с карточками
- 6 анимированных счётчиков через IntersectionObserver
- SVG-график роста сообщества за 6 месяцев
- Expand-панель с графиком недельной активности
- 4 карточки фич сообщества
- Gradient CTA «Присоединиться к сообществу»

---

## 📋 Project Structure

```
src/
├── components/          # 25 React-компонентов
│   ├── ui/             # shadcn ui (button)
│   ├── AITerminal.tsx
│   ├── AngelAssistant.tsx     # Floating mascot
│   ├── ArchitectureGraph.tsx  # SVG component graph
│   ├── CommunitySection.tsx   # PHASE 15
│   ├── Gallery.tsx            # Masonry gallery
│   ├── GitHubIntegration.tsx  # GitHub API widget
│   ├── GPUCostCalculator.tsx  # Cost calculator
│   ├── Hero.tsx               # 3D hero
│   ├── RepositoryShowcase.tsx # File tree + tabs
│   ├── Roadmap.tsx            # Timeline roadmap
│   └── ... (15+ more)
├── data/               # 9 data modules
│   ├── community.ts
│   ├── gallery.tsx
│   ├── gpuCosts.ts
│   ├── repository.ts
│   ├── roadmap.ts
│   └── terminalCommands.ts
├── hooks/
│   └── useGitHubData.ts   # GitHub API hook
├── pages/
│   ├── Home.tsx            # Main landing
│   └── News.tsx            # News page
├── scenes/
│   └── HeroScene.tsx       # Three.js 3D scene
├── styles/
│   └── index.css           # Tailwind v4 + custom
├── App.tsx                 # Router + global
└── main.tsx                # Entry point
```

---

## 🛠️ Локальная разработка

```bash
npm install
npm run dev          # dev-сервер на http://localhost:5173
npm run typecheck    # tsc --noEmit
npm run build        # сборка в docs-site/dist
```

Базовый URL зашит в `vite.config.ts` как `/Kaggle_Workspace_FreeGPU/`.

### Системные требования

| Требование | Значение |
|------------|----------|
| Node.js | >= 18 |
| npm | >= 8 |
| GPU для dev | не требуется (3D работает в браузере) |
| Chrome | рекомендуется для 3D-сцен |

---

## 🚀 Деплой

Workflow (`.github/workflows/pages.yml`) триггерится на каждый push в `site`:

1. `npm ci` — установка зависимостей
2. `npm run build` — Vite + TSC
3. `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`

> Правки в `main` (`instal/`, `workflows/`, `Notebook/`) CI не запускают.

**Проверка сборки локально:**
```bash
npm run build   # tsc --noEmit && vite build
```

---

## 🎨 Дизайн-система

### Цвета

```css
--color-cyan:    #00F5FF;
--color-violet:  #7B61FF;
--color-purple:  #A855F7;
--color-magenta: #FF007A;
--color-green:   #00FFB3;
--color-yellow:  #FCEE0A;
--bg-deep:       #0A0A1E;
--elevated:      rgba(255,255,255,0.03);
--glass:         rgba(255,255,255,0.04);
--border:        rgba(255,255,255,0.06);
```

### Компоненты

Все компоненты — **named exports**, используют `class-variance-authority` и `tailwind-merge` для стилей. Framer Motion для анимаций, Lucide React для иконок.

---

## 📈 Прогресс (14/19 = 74%)

| Фаза | Статус |
|------|--------|
| PHASE 1 — Project Setup | ✅ Done |
| PHASE 2 — Visual Identity | ✅ Done |
| PHASE 3 — Hero Section | ✅ Done |
| PHASE 4 — 3D Experience | ✅ Done |
| PHASE 5 — Scroll Storytelling | ✅ Done |
| PHASE 6 — Quick Start | ✅ Done |
| PHASE 7 — Interactive Architecture | ✅ Done |
| PHASE 8 — GPU Cost Calculator | ✅ Done |
| PHASE 9 — Repository Showcase | ✅ Done |
| PHASE 10 — AI Terminal | ✅ Done |
| PHASE 11 — Angel Assistant | ✅ Done |
| PHASE 12 — GitHub Integration | ✅ Done |
| PHASE 13 — Gallery | ✅ Done |
| PHASE 14 — Roadmap | ✅ Done |
| PHASE 15 — Community Section | ✅ Done |
| **PHASE 16 — Social Proof** | 📋 Planned |
| **PHASE 17 — Advanced Effects** | 📋 Planned |
| **PHASE 18 — Performance** | 🔮 Future |
| **PHASE 19 — Final Polish** | 🔮 Future |

---

## 👥 Сообщество

- [GitHub](https://github.com/THE-ANGEL-AI/Kaggle_Workspace_FreeGPU) — ставь ⭐
- [VK](https://vk.com/theangel_lab) — новости и анонсы
- [Boosty](https://boosty.to/the_angel/donate) — поддержать проект 💖
