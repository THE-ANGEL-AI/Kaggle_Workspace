/* ──────────────────────────────────────────────
   Gallery — элементы галереи с SVG-превью
   ────────────────────────────────────────────── */

import type { ReactNode } from 'react';

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: 'flux' | 'ltx' | 'comfy' | 'tts';
  /** SVG preview render function */
  preview: ReactNode;
  /** Simulated stats */
  stats?: string;
  date?: string;
}

/* ── SVG Preview Components ── */

const glitchDefs = (
  <defs>
    <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#0A0A2E" />
      <stop offset="50%" stopColor="#1A0A3E" />
      <stop offset="100%" stopColor="#0A0A2E" />
    </linearGradient>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#0A1A2E" />
      <stop offset="50%" stopColor="#0A0A1E" />
      <stop offset="100%" stopColor="#1A0A2E" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#00F5FF" />
      <stop offset="100%" stopColor="#00F5FF88" />
    </linearGradient>
    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#7B61FF" />
      <stop offset="100%" stopColor="#A855F7" />
    </linearGradient>
    <linearGradient id="magentaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FF007A" />
      <stop offset="100%" stopColor="#A855F788" />
    </linearGradient>
    <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#00FFB3" />
      <stop offset="100%" stopColor="#00FFB388" />
    </linearGradient>
    <filter id="glow1">
      <feGaussianBlur stdDeviation="3" />
    </filter>
  </defs>
);

/* ── Gallery items ── */
export const galleryItems: GalleryItem[] = [
  // ── Flux ──
  {
    id: 'flux-1',
    title: 'Flux2 GGUF — Cyberpunk City',
    description: 'Text-to-Image генерация 1024×1024. Промпт: «cyberpunk city neon lights rain»',
    category: 'flux',
    stats: '1024×1024 · ~28s',
    date: 'Июнь 2026',
    preview: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {glitchDefs}
        <rect width="400" height="300" fill="url(#bg1)" />
        {/* City skyline */}
        {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((x, i) => (
          <rect key={x} x={x} y={80 + (i % 3) * 30} width={25} height={220 - (i % 3) * 30} fill={`rgba(0,245,255,${0.08 + i * 0.02})`} />
        ))}
        {/* Neon lines */}
        <line x1="0" y1="60" x2="400" y2="60" stroke="#FF007A" strokeWidth="0.5" opacity="0.4" />
        <line x1="0" y1="270" x2="400" y2="270" stroke="#00F5FF" strokeWidth="0.5" opacity="0.4" />
        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <circle key={i} cx={20 + i * 26} cy={30 + (i * 17) % 200} r={1.5} fill="#00F5FF" opacity={0.3 + Math.random() * 0.4}>
            <animate attributeName="cy" values={`${30 + (i * 17) % 200};${20 + (i * 17) % 200};${30 + (i * 17) % 200}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {/* Glow orb */}
        <circle cx="200" cy="150" r="60" fill="rgba(0,245,255,0.05)" filter="url(#glow1)" />
        <text x="200" y="290" textAnchor="middle" fill="#00F5FF" fontSize="8" fontFamily="JetBrains Mono" letterSpacing="2" opacity="0.6">
          FLUX // CYBERPUNK
        </text>
      </svg>
    ),
  },
  {
    id: 'flux-2',
    title: 'Flux2 GGUF — Fantasy Landscape',
    description: 'Text-to-Image: «ethereal fantasy landscape floating islands crystal energy»',
    category: 'flux',
    stats: '1024×1024 · ~32s',
    date: 'Июнь 2026',
    preview: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {glitchDefs}
        <rect width="400" height="300" fill="url(#bg2)" />
        {/* Floating islands */}
        <ellipse cx="120" cy="180" rx="70" ry="20" fill="rgba(123,97,255,0.12)" />
        <ellipse cx="280" cy="150" rx="50" ry="15" fill="rgba(168,85,247,0.10)" />
        <ellipse cx="200" cy="220" rx="90" ry="25" fill="rgba(123,97,255,0.08)" />
        {/* Crystal pillars */}
        <polygon points="100,180 104,120 108,180" fill="#00F5FF" opacity="0.3" />
        <polygon points="130,180 133,130 136,180" fill="#7B61FF" opacity="0.3" />
        <polygon points="270,150 273,100 276,150" fill="#A855F7" opacity="0.25" />
        {/* Energy rings */}
        <ellipse cx="200" cy="100" rx="80" ry="15" fill="none" stroke="#00F5FF" strokeWidth="0.5" opacity="0.3">
          <animateTransform attributeName="transform" type="rotate" from="0 200 100" to="360 200 100" dur="12s" repeatCount="indefinite" />
        </ellipse>
        <text x="200" y="290" textAnchor="middle" fill="#7B61FF" fontSize="8" fontFamily="JetBrains Mono" letterSpacing="2" opacity="0.6">
          FLUX // FANTASY
        </text>
      </svg>
    ),
  },
  {
    id: 'flux-3',
    title: 'Flux2 GGUF — Portrait',
    description: 'Промпт: «portrait of a cyber angel, neon hair, holographic wings, futuristic»',
    category: 'flux',
    stats: '1024×1024 · ~30s',
    date: 'Июнь 2026',
    preview: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {glitchDefs}
        <rect width="400" height="300" fill="#0A0A1E" />
        {/* Silhouette */}
        <ellipse cx="200" cy="130" rx="50" ry="60" fill="rgba(0,245,255,0.06)" />
        <ellipse cx="200" cy="190" rx="70" ry="80" fill="rgba(123,97,255,0.05)" />
        {/* Halo */}
        <ellipse cx="200" cy="65" rx="35" ry="10" fill="#00F5FF" opacity="0.3" />
        <ellipse cx="200" cy="65" rx="30" ry="7" fill="#00F5FF" opacity="0.5" />
        {/* Wings */}
        <path d="M130 160 Q110 120 130 100 Q150 120 150 160Z" fill="#A855F7" opacity="0.2" />
        <path d="M270 160 Q290 120 270 100 Q250 120 250 160Z" fill="#A855F7" opacity="0.2" />
        {/* Neon tears */}
        <circle cx="185" cy="135" r="1.5" fill="#00F5FF">
          <animate attributeName="cy" values="135;200;135" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0;1" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="215" cy="135" r="1.5" fill="#00F5FF">
          <animate attributeName="cy" values="135;200;135" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0;1" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <text x="200" y="290" textAnchor="middle" fill="#FF007A" fontSize="8" fontFamily="JetBrains Mono" letterSpacing="2" opacity="0.6">
          FLUX // PORTRAIT
        </text>
      </svg>
    ),
  },
  // ── LTX ──
  {
    id: 'ltx-1',
    title: 'LTX 2.3 — Camera Pan',
    description: 'Text-to-Video: «drone shot over neon city, slow pan right» · 121 frames · Crop-Guide',
    category: 'ltx',
    stats: '720p · 121fr · ~90s',
    date: 'Июнь 2026',
    preview: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {glitchDefs}
        <rect width="400" height="300" fill="#0A0A2E" />
        {/* Film strip frames */}
        {[5, 55, 105, 155, 205, 255, 305, 355].map((x, i) => (
          <g key={x}>
            <rect x={x} y={40} width={40} height={30} rx={2} fill={`rgba(255,0,122,${0.05 + i * 0.04})`} stroke="#FF007A" strokeWidth="0.5" opacity={0.6} />
            <rect x={x} y={85} width={40} height={30} rx={2} fill={`rgba(255,0,122,${0.03 + i * 0.03})`} stroke="#FF007A" strokeWidth="0.5" opacity={0.5} />
            <rect x={x} y={130} width={40} height={30} rx={2} fill={`rgba(255,0,122,${0.04 + i * 0.04})`} stroke="#FF007A" strokeWidth="0.5" opacity={0.5} />
            <rect x={x} y={175} width={40} height={30} rx={2} fill={`rgba(255,0,122,${0.03 + i * 0.03})`} stroke="#FF007A" strokeWidth="0.5" opacity={0.4} />
            <rect x={x} y={220} width={40} height={30} rx={2} fill={`rgba(255,0,122,${0.04 + i * 0.04})`} stroke="#FF007A" strokeWidth="0.5" opacity={0.5} />
            {/* Frame number */}
            <text x={x + 20} y={265} textAnchor="middle" fill="#FF007A" fontSize="6" fontFamily="JetBrains Mono" opacity={0.5}>F{i + 1}</text>
          </g>
        ))}
        {/* Play button overlay */}
        <circle cx="200" cy="140" r="25" fill="rgba(255,0,122,0.2)" stroke="#FF007A" strokeWidth="1">
          <animate attributeName="r" values="25;30;25" dur="2s" repeatCount="indefinite" />
        </circle>
        <polygon points="190,128 190,152 215,140" fill="#FF007A" />
        <text x="200" y="290" textAnchor="middle" fill="#FF007A" fontSize="8" fontFamily="JetBrains Mono" letterSpacing="2" opacity="0.6">
          LTX // CAMERA PAN
        </text>
      </svg>
    ),
  },
  {
    id: 'ltx-2',
    title: 'LTX 2.3 — Orbit Rotation',
    description: 'Image-to-Video: 360° orbit around a 3D object · Crop-Guide motion control',
    category: 'ltx',
    stats: '720p · 97fr · ~75s',
    date: 'Июнь 2026',
    preview: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {glitchDefs}
        <rect width="400" height="300" fill="#0A0A1E" />
        {/* Orbit path */}
        <ellipse cx="200" cy="150" rx="120" ry="50" fill="none" stroke="#7B61FF" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
        {/* Object in center */}
        <rect x="175" y="125" width="50" height="50" rx="8" fill="rgba(0,245,255,0.1)" stroke="#00F5FF" strokeWidth="1">
          <animateTransform attributeName="transform" type="rotate" from="0 200 150" to="360 200 150" dur="8s" repeatCount="indefinite" />
        </rect>
        {/* Orbiting dot */}
        <circle cx="320" cy="150" r="4" fill="#A855F7">
          <animateMotion dur="6s" repeatCount="indefinite" path="M200,100 Q320,100 320,150 Q320,200 200,200 Q80,200 80,150 Q80,100 200,100" />
        </circle>
        {/* Camera arc indicator */}
        <path d="M80,150 Q140,90 200,80" fill="none" stroke="#FF007A" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
        <text x="200" y="290" textAnchor="middle" fill="#7B61FF" fontSize="8" fontFamily="JetBrains Mono" letterSpacing="2" opacity="0.6">
          LTX // ORBIT
        </text>
      </svg>
    ),
  },
  // ── ComfyUI ──
  {
    id: 'comfy-1',
    title: 'ComfyUI — Flux2 Workflow',
    description: 'Граф Flux2 GGUF в ComfyUI: ноды загрузки, KSampler, VAE decoder, MultiGPU',
    category: 'comfy',
    stats: '50+ нод · 2× T4',
    date: 'Июнь 2026',
    preview: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {glitchDefs}
        <rect width="400" height="300" fill="#1A1A2E" />
        {/* Grid background */}
        <pattern id="comfyGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0L0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        </pattern>
        <rect width="400" height="300" fill="url(#comfyGrid)" />
        {/* Node blocks */}
        {[
          { x: 30, y: 30, w: 60, h: 40, c: '#00F5FF' },
          { x: 30, y: 100, w: 60, h: 40, c: '#7B61FF' },
          { x: 130, y: 65, w: 70, h: 60, c: '#A855F7' },
          { x: 250, y: 30, w: 60, h: 40, c: '#00FFB3' },
          { x: 250, y: 120, w: 60, h: 50, c: '#FF007A' },
          { x: 350, y: 75, w: 40, h: 40, c: '#FCEE0A' },
        ].map((node, i) => (
          <g key={i}>
            <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={6} fill={`${node.c}0A`} stroke={node.c} strokeWidth="0.8" opacity={0.6} />
            {/* Port dots */}
            <circle cx={node.x + node.w / 2} cy={node.y} r={3} fill={node.c} />
            <circle cx={node.x + node.w / 2} cy={node.y + node.h} r={3} fill={node.c} />
          </g>
        ))}
        {/* Connection lines */}
        {[
          [90, 50, 130, 95],
          [90, 120, 130, 125],
          [200, 95, 250, 50],
          [200, 95, 250, 145],
          [310, 50, 350, 95],
          [310, 145, 350, 95],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00F5FF" strokeWidth="0.5" opacity={0.2}>
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
          </line>
        ))}
        <text x="200" y="290" textAnchor="middle" fill="#A855F7" fontSize="8" fontFamily="JetBrains Mono" letterSpacing="2" opacity="0.6">
          COMFYUI // WORKFLOW
        </text>
      </svg>
    ),
  },
  {
    id: 'comfy-2',
    title: 'ComfyUI — LTX Director',
    description: 'Граф LTX Director V2 Beta: Crop-Guide, KSampler, Video-Combine, Audio',
    category: 'comfy',
    stats: '40+ нод · мульти-GPU',
    date: 'Июнь 2026',
    preview: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {glitchDefs}
        <rect width="400" height="300" fill="#1A0A2E" />
        <pattern id="comfyGrid2" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0L0 0 0 20" fill="none" stroke="rgba(255,0,122,0.03)" strokeWidth="0.5" />
        </pattern>
        <rect width="400" height="300" fill="url(#comfyGrid2)" />
        {/* Pipeline blocks */}
        {[
          { x: 20, y: 80, w: 50, h: 35, c: '#FF007A' },
          { x: 20, y: 160, w: 50, h: 35, c: '#7B61FF' },
          { x: 110, y: 120, w: 65, h: 50, c: '#A855F7' },
          { x: 220, y: 60, w: 55, h: 35, c: '#00F5FF' },
          { x: 220, y: 150, w: 55, h: 35, c: '#00FFB3' },
          { x: 320, y: 105, w: 60, h: 50, c: '#FCEE0A' },
        ].map((node, i) => (
          <rect key={i} x={node.x} y={node.y} width={node.w} height={node.h} rx={6} fill={`${node.c}0A`} stroke={node.c} strokeWidth="0.8" opacity={0.6} />
        ))}
        {/* Arrows */}
        {[
          { x1: 70, y1: 97, x2: 110, y2: 145 },
          { x1: 70, y1: 177, x2: 110, y2: 145 },
          { x1: 175, y1: 145, x2: 220, y2: 77 },
          { x1: 175, y1: 145, x2: 220, y2: 167 },
          { x1: 275, y1: 77, x2: 320, y2: 130 },
          { x1: 275, y1: 167, x2: 320, y2: 130 },
        ].map((a, i) => (
          <line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} stroke="#FF007A" strokeWidth="0.5" strokeDasharray="3 2" opacity={0.3} />
        ))}
        <text x="200" y="290" textAnchor="middle" fill="#A855F7" fontSize="8" fontFamily="JetBrains Mono" letterSpacing="2" opacity="0.6">
          COMFYUI // LTX DIRECTOR
        </text>
      </svg>
    ),
  },
  // ── TTS ──
  {
    id: 'tts-1',
    title: 'TTS Pipeline — Voice Synthesis',
    description: 'Edge-TTS: синтез речи с клонированием голоса. Волновая форма + спектрограмма',
    category: 'tts',
    stats: 'Real-time · Multi-voice',
    date: 'Июнь 2026',
    preview: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {glitchDefs}
        <rect width="400" height="300" fill="#0A1A0A" />
        {/* Waveform */}
        <path d="M0,150 Q20,80 40,120 T80,100 T120,130 T160,80 T200,110 T240,90 T280,120 T320,100 T360,120 T400,150" fill="none" stroke="#00FFB3" strokeWidth="1.5" opacity="0.6">
          <animate attributeName="d" values="M0,150 Q20,80 40,120 T80,100 T120,130 T160,80 T200,110 T240,90 T280,120 T320,100 T360,120 T400,150;M0,150 Q20,120 40,90 T80,110 T120,80 T160,120 T200,90 T240,110 T280,100 T320,130 T360,110 T400,150;M0,150 Q20,80 40,120 T80,100 T120,130 T160,80 T200,110 T240,90 T280,120 T320,100 T360,120 T400,150" dur="2s" repeatCount="indefinite" />
        </path>
        {/* Second wave */}
        <path d="M0,160 Q20,130 40,150 T80,140 T120,160 T160,135 T200,155 T240,145 T280,155 T320,140 T360,150 T400,160" fill="none" stroke="#00FFB3" strokeWidth="0.8" opacity="0.3">
          <animate attributeName="d" values="M0,160 Q20,130 40,150 T80,140 T120,160 T160,135 T200,155 T240,145 T280,155 T320,140 T360,150 T400,160;M0,160 Q20,150 40,130 T80,155 T120,140 T160,155 T200,140 T240,155 T280,145 T320,160 T360,140 T400,160;M0,160 Q20,130 40,150 T80,140 T120,160 T160,135 T200,155 T240,145 T280,155 T320,140 T360,150 T400,160" dur="2.5s" repeatCount="indefinite" />
        </path>
        {/* Frequency bars */}
        {[30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250, 270, 290, 310, 330, 350, 370].map((x) => (
          <rect key={x} x={x} y={185 + Math.sin(x * 0.1) * 20} width={3} height={Math.max(5, 30 + Math.sin(x * 0.3) * 15)} fill="rgba(0,255,179,0.15)">
            <animate attributeName="height" values={`${5 + Math.sin(x * 0.3) * 15};${10 + Math.cos(x * 0.2) * 20};${5 + Math.sin(x * 0.3) * 15}`} dur={`${1 + (x % 5) * 0.3}s`} repeatCount="indefinite" />
          </rect>
        ))}
        <text x="200" y="285" textAnchor="middle" fill="#00FFB3" fontSize="8" fontFamily="JetBrains Mono" letterSpacing="2" opacity="0.6">
          TTS // WAVEFORM
        </text>
      </svg>
    ),
  },
  {
    id: 'tts-2',
    title: 'Kokoro-Fast — Multi-voice TTS',
    description: 'Быстрый TTS с поддержкой русского, английского, японского. Клонирование голоса',
    category: 'tts',
    stats: '5 языков · 8 голосов',
    date: 'Июнь 2026',
    preview: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {glitchDefs}
        <rect width="400" height="300" fill="#0A0A1A" />
        {/* Frequency spectrum */}
        {Array.from({ length: 20 }).map((_, i) => (
          <rect key={i} x={10 + i * 20} y={100 - Math.abs(10 - i) * 5} width={12} height={Math.abs(10 - i) * 10 + 20} rx={2} fill={`rgba(0,245,255,${0.08 + (1 - Math.abs(10 - i) / 10) * 0.2})`}>
            <animate attributeName="height" values={`${Math.abs(10 - i) * 10 + 20};${Math.abs(8 - i) * 12 + 25};${Math.abs(10 - i) * 10 + 20}`} dur={`${1.5 + (i % 4) * 0.3}s`} repeatCount="indefinite" />
          </rect>
        ))}
        {/* Language labels */}
        {['RU', 'EN', 'JA', 'KO'].map((lang, i) => (
          <text key={lang} x={50 + i * 100} y={200} textAnchor="middle" fill="#00F5FF" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold" opacity={0.4}>
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
            {lang}
          </text>
        ))}
        <text x="200" y="290" textAnchor="middle" fill="#00F5FF" fontSize="8" fontFamily="JetBrains Mono" letterSpacing="2" opacity="0.6">
          KOKORO // MULTI-VOICE
        </text>
      </svg>
    ),
  },
];

export const galleryCategories = [
  { id: 'all', label: 'Все', color: '#00F5FF' },
  { id: 'flux', label: 'Flux2 GGUF', color: '#7B61FF' },
  { id: 'ltx', label: 'LTX 2.3 Video', color: '#FF007A' },
  { id: 'comfy', label: 'ComfyUI', color: '#A855F7' },
  { id: 'tts', label: 'TTS', color: '#00FFB3' },
] as const;
