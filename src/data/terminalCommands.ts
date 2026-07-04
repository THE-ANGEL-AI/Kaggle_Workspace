/* ──────────────────────────────────────────────
   AI Terminal — команды и ответы
   ────────────────────────────────────────────── */

interface CommandResponse {
  /** Lines to print (supports ansi-like color tags) */
  lines: string[];
  /** Override typing speed (ms per char) */
  speed?: number;
  /** Whether to clear before printing */
  clear?: boolean;
  /** Execute a function (for interactive commands) */
  effect?: 'matrix' | 'neofetch' | 'snake';
}

/* ── Command aliases ── */
const commandAliases: Record<string, string> = {
  ls: 'help',
  '?': 'help',
  gh: 'github',
  kg: 'kaggle',
  start: 'quickstart',
  info: 'specs',
  cls: 'clear',
  exit: 'clear',
};

/* ── Response generator ── */
export function getCommandResponse(command: string): CommandResponse | null {
  const cmd = command.toLowerCase().trim();
  const resolved = commandAliases[cmd] ?? cmd;

  switch (resolved) {
    case 'help':
      return {
        lines: [
          '',
          '  <cyan>╭──────────────────────────────────────╮</cyan>',
          '  <cyan>│</cyan>  <bold>THE ANGEL AI — Terminal Help</bold>        <cyan>│</cyan>',
          '  <cyan>│</cyan>                                      <cyan>│</cyan>',
          '  <cyan>│</cyan>  <cyan>Основные команды:</cyan>                   <cyan>│</cyan>',
          '  <cyan>│</cyan>  help        — этот список              <cyan>│</cyan>',
          '  <cyan>│</cyan>  github      — открыть GitHub            <cyan>│</cyan>',
          '  <cyan>│</cyan>  kaggle      — про Kaggle Workspace      <cyan>│</cyan>',
          '  <cyan>│</cyan>  comfy       — статус ComfyUI            <cyan>│</cyan>',
          '  <cyan>│</cyan>  flux        — Flux2 GGUF                <cyan>│</cyan>',
          '  <cyan>│</cyan>  ltx         — LTX 2.3 Video             <cyan>│</cyan>',
          '  <cyan>│</cyan>  models      — список моделей            <cyan>│</cyan>',
          '  <cyan>│</cyan>  specs       — GPU характеристики        <cyan>│</cyan>',
          '  <cyan>│</cyan>  quickstart  — быстрый старт              <cyan>│</cyan>',
          '  <cyan>│</cyan>  clear       — очистить экран            <cyan>│</cyan>',
          '  <cyan>│</cyan>                                      <cyan>│</cyan>',
          '  <cyan>│</cyan>  <dim>Секретные команды: whoami, neofetch,</dim>  <cyan>│</cyan>',
          '  <cyan>│</cyan>  <dim>uptime, matrix, sudo, 42</dim>            <cyan>│</cyan>',
          '  <cyan>╰──────────────────────────────────────╯</cyan>',
          '',
        ],
        speed: 4,
      };

    case 'github':
      return {
        lines: [
          '',
          '  🐙 <cyan>THE-ANGEL-AI / Kaggle_Workspace_FreeGPU</cyan>',
          '',
          '  <dim>Stars:</dim>    ★ <bold>мне нужна твоя звезда!</bold>',
          '  <dim>License:</dim>  MIT',
          '  <dim>URL:</dim>      <cyan>https://github.com/THE-ANGEL-AI/Kaggle_Workspace_FreeGPU</cyan>',
          '',
          '  <dim>Ты можешь:</dim>',
          '  • Поставить звезду ⭐',
          '  • Форкнуть репозиторий',
          '  • Открыть Issue / PR',
          '  • Задать вопрос в Discussions',
          '',
          '  <green>→ Открываю GitHub в новой вкладке...</green>',
          '',
        ],
        speed: 8,
        effect: undefined,
      };

    case 'kaggle':
      return {
        lines: [
          '',
          '  <cyan>╭──────────────────────────────────────╮</cyan>',
          '  <cyan>│</cyan>  <bold>Kaggle Workspace FreeGPU</bold>           <cyan>│</cyan>',
          '  <cyan>│</cyan>                                      <cyan>│</cyan>',
          '  <cyan>│</cyan>  Платформа:  Kaggle Notebooks         <cyan>│</cyan>',
          '  <cyan>│</cyan>  GPU:        2× Tesla T4 (16GB each)   <cyan>│</cyan>',
          '  <cyan>│</cyan>  CUDA:       13.0 (Driver 580.x)       <cyan>│</cyan>',
          '  <cyan>│</cyan>  Цена:       <green>Бесплатно</green> 💵               <cyan>│</cyan>',
          '  <cyan>│</cyan>  Лимит:      ~30 часов/неделю          <cyan>│</cyan>',
          '  <cyan>│</cyan>  Туннель:    Cloudflare                 <cyan>│</cyan>',
          '  <cyan>│</cyan>  Скрипты:    instal/ (3 файла)          <cyan>│</cyan>',
          '  <cyan>╰──────────────────────────────────────╯</cyan>',
          '',
        ],
        speed: 4,
      };

    case 'comfy':
      return {
        lines: [
          '',
          '  <cyan>●</cyan> <bold>ComfyUI Status:</bold> <green>READY</green>',
          '',
          '  <dim>Version:</dim>  0.24+',
          '  <dim>Backend:</dim>  PyTorch 2.x (CUDA 13.0)',
          '  <dim>Port:</dim>     8188',
          '  <dim>Nodes:</dim>    50+ (Manager auto-installed)',
          '  <dim>MultiGPU:</dim>  DisTorch2 (2× T4)',
          '',
          '  <green>✓ ComfyUI запущен и готов к работе</green>',
          '  <dim>  Импортируй workflow из workflows/ и жми Queue</dim>',
          '',
        ],
        speed: 6,
      };

    case 'flux':
      return {
        lines: [
          '',
          '  🖼️ <bold><cyan>Flux2 GGUF</cyan></bold>',
          '',
          '  <dim>Параметры:</dim>     12B (GGUF квант)',
          '  <dim>Тип:</dim>          Text-to-Image',
          '  <dim>Разрешение:</dim>    1024×1024',
          '  <dim>Скорость:</dim>      ~30s на 2× T4',
          '  <dim>Workflow:</dim>      workflows/Flux2dev32b_GGUF.json',
          '',
          '  <cyan>━━━━━━━━━━━━━━━━━━━━━━━━━━━</cyan>',
          '  <dim>Также доступен API-воркфлоу для</dim>',
          '  <dim>скриптового запуска через HTTP.</dim>',
          '',
        ],
        speed: 6,
      };

    case 'ltx':
      return {
        lines: [
          '',
          '  🎬 <bold><magenta>LTX 2.3 Video</magenta></bold>',
          '',
          '  <dim>Параметры:</dim>     22B',
          '  <dim>Тип:</dim>          Text/Image-to-Video + Audio',
          '  <dim>Кадры:</dim>        До 121',
          '  <dim>Разрешение:</dim>    720p',
          '  <dim>Управление:</dim>    Crop-Guide (motion control)',
          '  <dim>Workflow:</dim>      workflows/LTX_Director-V2-Beta.json',
          '',
          '  <magenta>━━━━━━━━━━━━━━━━━━━━━━━━━━━</magenta>',
          '  <dim>LTX Director даёт точный контроль</dim>',
          '  <dim>движения камеры через crop-guide.</dim>',
          '',
        ],
        speed: 6,
      };

    case 'models':
      return {
        lines: [
          '',
          '  <bold>Поддерживаемые модели</bold>',
          '',
          '  <cyan>●</cyan> Flux2 GGUF          — Text-to-Image, 12B',
          '  <purple>●</purple> LTX 2.3 Video      — Text/Image-to-Video, 22B',
          '  <magenta>●</magenta> LTX Director       — Crop-Guide motion control',
          '  <green>●</green> Edge-TTS           — Озвучка текста',
          '  <green>●</green> Kokoro-Fast        — Быстрый TTS',
          '',
          '  <dim>Все веса лежат в /kaggle/input —</dim>',
          '  <dim>копируются один раз, не теряются</dim>',
          '  <dim>при перезапуске сессии.</dim>',
          '',
        ],
        speed: 5,
      };

    case 'specs':
      return {
        lines: [
          '',
          '  <bold><cyan>Системные характеристики</cyan></bold>',
          '',
          '  <dim>GPU:</dim>          2× NVIDIA Tesla T4 (Turing)',
          '  <dim>VRAM:</dim>         16 GB GDDR6 each',
          '  <dim>CUDA Cores:</dim>   2,560 per GPU',
          '  <dim>FP16 TFLOPS:</dim>  65 per GPU',
          '  <dim>Driver:</dim>       580.x',
          '  <dim>CUDA:</dim>         13.0',
          '  <dim>Python:</dim>       3.12 (uv-managed)',
          '  <dim>Attention:</dim>    SDPA (Flash Attention)',
          '  <dim>Torch:</dim>        cu130',
          '',
          '  <dim>Ram:</dim>          ~32 GB system RAM',
          '  <dim>Disk:</dim>         100+ GB ephemeral',
          '',
        ],
        speed: 4,
      };

    case 'quickstart':
      return {
        lines: [
          '',
          '  <green>⚡ Быстрый старт в 3 шага</green>',
          '',
          '  <cyan>$</cyan> <bold>Шаг 1:</bold> Клонируй репозиторий',
          '  <dim>  !git clone https://github.com/THE-ANGEL-AI/</dim>',
          '  <dim>  Kaggle_Workspace_FreeGPU.git || git pull</dim>',
          '',
          '  <purple>$</purple> <bold>Шаг 2:</bold> Запусти установку',
          '  <dim>  !python Kaggle_Workspace_FreeGPU/instal/</dim>',
          '  <dim>  instal_comfyui.py</dim>',
          '  <dim>  !python Kaggle_Workspace_FreeGPU/instal/</dim>',
          '  <dim>  instal_castom_node.py</dim>',
          '',
          '  <green>$</green> <bold>Шаг 3:</bold> Запусти ComfyUI + туннель',
          '  <dim>  %run Kaggle_Workspace_FreeGPU/instal/start.py</dim>',
          '',
          '  <green>✓ Готово! Через ~2 мин получишь URL.</green>',
          '',
        ],
        speed: 8,
      };

    case 'clear':
      return { lines: [], clear: true };

    /* ── Easter eggs ── */

    case 'whoami':
      return {
        lines: [
          '',
          '  <cyan>⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿</cyan>',
          '  <cyan>⣿</cyan>  <bold>THE ANGEL AI</bold>                <cyan>⣿</cyan>',
          '  <cyan>⣿</cyan>  <dim>Laboratory of the Future</dim>     <cyan>⣿</cyan>',
          '  <cyan>⣿</cyan>                                    <cyan>⣿</cyan>',
          '  <cyan>⣿</cyan>  <green>●</green> Status:  <green>ONLINE</green>              <cyan>⣿</cyan>',
          '  <cyan>⣿</cyan>  <cyan>●</cyan> Mission: Free GPU for All     <cyan>⣿</cyan>',
          '  <cyan>⣿</cyan>  <magenta>●</magenta> Soul:    ❤️                  <cyan>⣿</cyan>',
          '  <cyan>⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿</cyan>',
          '',
          '  <dim>Я — AI-ангел-хранитель этого проекта.</dim>',
          '  <dim>Моя цель — сделать GPU доступным каждому.</dim>',
          '',
        ],
        speed: 6,
      };

    case 'neofetch':
      return {
        lines: [
          '',
          '  <cyan>        ████████████</cyan>  <bold>THE-ANGEL-AI@kaggle</bold>',
          '  <cyan>      ██            ██</cyan>  ───────────────────',
          '  <cyan>    ██                ██</cyan>  <dim>OS:</dim>     Kaggle Linux x86_64',
          '  <cyan>    ██    ████  ████   ██</cyan>  <dim>Host:</dim>   Tesla T4 × 2',
          '  <cyan>    ██    ████  ████   ██</cyan>  <dim>Kernel:</dim> CUDA 13.0',
          '  <cyan>    ██    ████  ████   ██</cyan>  <dim>Shell:</dim>  Python 3.12 (uv)',
          '  <cyan>    ██                ██</cyan>  <dim>Comfy:</dim>  0.24+ <green>●</green>',
          '  <cyan>      ██            ██</cyan>  <dim>GPU:</dim>     2× T4 (16GB)',
          '  <cyan>        ████████████</cyan>  <dim>Tunnel:</dim>  Cloudflare <green>●</green>',
          '',
        ],
        speed: 3,
      };

    case 'uptime':
      return {
        lines: [
          '',
          '  <cyan>⏱</cyan>  <bold>System Uptime</bold>',
          '',
          '  <dim>Session:</dim>   ∞ (Kaggle сессия жива, пока активна)',
          '  <dim>Keep-alive:</dim> <green>● ACTIVE</green> (фоновая задача)',
          '  <dim>GPU Time:</dim>   Неограниченно (free tier)',
          '',
          '  <dim>«Время — единственный ресурс, который</dim>',
          '  <dim> мы не можем купить. Но GPU — можем.»</dim>',
          '',
        ],
        speed: 6,
      };

    case 'matrix':
      return {
        lines: [
          '',
          '  <green>ИНИЦИАЛИЗАЦИЯ МАТРИЦЫ...</green>',
          '  <dim>Следите за экраном...</dim>',
          '',
        ],
        speed: 20,
        effect: 'matrix',
      };

    case 'sudo':
      return {
        lines: [
          '',
          '  <magenta>⛔</magenta>  <bold>sudo: нужны права root</bold>',
          '  <dim>  Чтобы получить привилегии, просто поставь</dim>',
          '  <dim>  звезду на GitHub. Это единственное, что</dim>',
          '  <dim>  нужно для доступа к магии.</dim>',
          '',
          '  <cyan>  → https://github.com/THE-ANGEL-AI/</cyan>',
          '  <cyan>    Kaggle_Workspace_FreeGPU</cyan>',
          '',
        ],
        speed: 5,
      };

    case '42':
      return {
        lines: [
          '',
          '  <cyan>╭──────────────────────────────────────╮</cyan>',
          '  <cyan>│</cyan>                                    <cyan>│</cyan>',
          '  <cyan>│</cyan>      <bold>Ответ на главный вопрос</bold>      <cyan>│</cyan>',
          '  <cyan>│</cyan>      <green>жизни, вселенной и всего</green>      <cyan>│</cyan>',
          '  <cyan>│</cyan>      <green>такого...</green>                    <cyan>│</cyan>',
          '  <cyan>│</cyan>                                    <cyan>│</cyan>',
          '  <cyan>│</cyan>               <bold>42</bold>                   <cyan>│</cyan>',
          '  <cyan>│</cyan>                                    <cyan>│</cyan>',
          '  <cyan>│</cyan>  <dim>«Я всегда знал, что во Вселенной</dim>  <cyan>│</cyan>',
          '  <cyan>│</cyan>  <dim> есть что-то неправильное.»</dim>        <cyan>│</cyan>',
          '  <cyan>│</cyan>       — Дуглас Адамс                <cyan>│</cyan>',
          '  <cyan>╰──────────────────────────────────────╯</cyan>',
          '',
        ],
        speed: 5,
      };

    default:
      return {
        lines: [
          '',
          `  <magenta>⛔</magenta>  Команда не найдена: <bold>${cmd}</bold>`,
          '  <dim>  Введи help для списка доступных команд.</dim>',
          '',
        ],
        speed: 4,
      };
  }
}
