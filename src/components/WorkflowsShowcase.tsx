import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const workflows = [
  { title: 'Flux2 GGUF', tag: 'text-to-image', accent: 'cyan', preview: 'image' },
  { title: 'LTX 2.3 Six-Panel Director', tag: 'video', accent: 'magenta', preview: 'frames' },
  { title: 'TTS Pipeline', tag: 'speech', accent: 'violet', preview: 'wave' },
];

function ImagePreview() {
  return (
    <svg viewBox="0 0 360 220" className="w-full h-full">
      <defs>
        <radialGradient id="img-grad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#8B2FFF" stopOpacity="0.10" />
        </radialGradient>
        <pattern id="img-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="360" height="220" fill="#252542" />
      <rect width="360" height="220" fill="url(#img-grid)" />
      <circle cx="180" cy="110" r="80" fill="url(#img-grad)" />
      <circle cx="180" cy="110" r="80" fill="none" stroke="#00F0FF" strokeWidth="1" strokeDasharray="4 6" opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" from="0 180 110" to="360 180 110" dur="14s" repeatCount="indefinite" />
      </circle>
      <text x="180" y="118" textAnchor="middle" fill="#00F0FF" fontSize="11" fontFamily="JetBrains Mono" letterSpacing="2">FLUX // DEV // GGUF</text>
    </svg>
  );
}
function FramesPreview() {
  return (
    <svg viewBox="0 0 360 220" className="w-full h-full">
      <rect width="360" height="220" fill="#252542" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${20 + i * 80}, 40)`}>
          <rect width="68" height="48" fill="#1B1B2E" stroke="#FF007A" strokeWidth="0.8" opacity="0.8" />
          <circle cx="34" cy="24" r="6" fill="#FF007A">
            {i % 2 === 0 && <animate attributeName="opacity" values="1;0.3;1" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" />}
          </circle>
          <text x="34" y="60" textAnchor="middle" fill="#FF007A" fontSize="7" fontFamily="JetBrains Mono">F{i + 1}</text>
        </g>
      ))}
      <text x="180" y="140" textAnchor="middle" fill="#FF007A" fontSize="11" fontFamily="JetBrains Mono" letterSpacing="2">LTX-VIDEO // 2.3</text>
    </svg>
  );
}
function WavePreview() {
  return (
    <svg viewBox="0 0 360 220" className="w-full h-full">
      <rect width="360" height="220" fill="#252542" />
      <path d="M0,110 Q60,40 120,90 T240,80 T360,110" fill="none" stroke="#8B2FFF" strokeWidth="2" opacity="0.7">
        <animate attributeName="d" values="M0,110 Q60,40 120,90 T240,80 T360,110;M0,110 Q60,80 120,40 T240,90 T360,110;M0,110 Q60,40 120,90 T240,80 T360,110" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M0,140 Q60,170 120,150 T240,160 T360,140" fill="none" stroke="#8B2FFF" strokeWidth="1.5" opacity="0.4" />
      <text x="180" y="200" textAnchor="middle" fill="#8B2FFF" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="2">TTS // WAVEFORM</text>
    </svg>
  );
}

export function WorkflowsShowcase() {
  const accentMap: Record<string, string> = { cyan: 'hover:border-cyan/30 hover:shadow-[0_8px_40px_rgba(0,0,0,0.40),0_0_30px_rgba(0,240,255,0.08)]', magenta: 'hover:border-magenta/30 hover:shadow-[0_8px_40px_rgba(0,0,0,0.40),0_0_30px_rgba(255,0,122,0.08)]', violet: 'hover:border-violet/30 hover:shadow-[0_8px_40px_rgba(0,0,0,0.40),0_0_30px_rgba(139,47,255,0.08)]' };
  const previewMap: Record<string, React.FC> = { image: ImagePreview, frames: FramesPreview, wave: WavePreview };

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20">
      <div className="text-center mb-14">
        <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-cyan bg-cyan/8 px-3.5 py-1.5 rounded-full mb-5 border border-cyan/20">Workflows</span>
        <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-display font-extrabold text-text-bright mb-3">Три готовых графа</h2>
        <p className="text-text-muted text-[1.08rem] max-w-[660px] mx-auto leading-relaxed">Откройте в ComfyUI — никаких скрытых зависимостей.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
        {workflows.map((w) => {
          const Preview = previewMap[w.preview];
          return (
            <motion.a
              key={w.title}
              href="https://github.com/THE-ANGEL-AI/Kaggle_Workspace_FreeGPU/tree/main/workflows"
              target="_blank"
              className={`group block bg-glass border border-border rounded-[20px] overflow-hidden backdrop-blur-md ${accentMap[w.accent]} hover:-translate-y-1.5 transition-all duration-280`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="aspect-[16/10] bg-elevated border-b border-border overflow-hidden">
                <Preview />
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="font-display font-bold text-[1.1rem] text-text-bright mb-1.5">{w.title}</h3>
                <span className="inline-block font-mono text-[0.72rem] tracking-wide text-text-dim bg-white/4 px-2.5 py-1 rounded-full border border-white/6 mb-2">{w.tag}</span>
                <div className="flex items-center gap-1.5 font-bold text-sm text-cyan group-hover:translate-x-1.5 transition-transform duration-180">
                  открыть <ArrowUpRight size={14} />
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
