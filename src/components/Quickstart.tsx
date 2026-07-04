import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import type { ReactNode } from 'react';
import { SectionHeader } from './SectionHeader';

const cells: { comment: string; code: ReactNode }[] = [
  { comment: '# 0.  Скрипты из репозитория', code: <>!git clone https://github.com/THE-ANGEL-AI/Kaggle_Workspace_FreeGPU.git || \<br />{'  '}git -C Kaggle_Workspace_FreeGPU pull</> },
  { comment: '# 1.  Окружение: uv + venv + torch cu130 + ComfyUI', code: <>!python Kaggle_Workspace_FreeGPU/instal/instal_comfyui.py</> },
  { comment: '# 2.  Кастомные ноды + симлинки на модели', code: <>!python Kaggle_Workspace_FreeGPU/instal/instal_castom_node.py</> },
  { comment: '# 3.  Запуск + Cloudflare-туннель + keep-alive', code: <>%run Kaggle_Workspace_FreeGPU/instal/start.py</> },
];

function Cell({ cell }: { cell: typeof cells[0] }) {
  const [copied, copy] = useCopyToClipboard();
  const raw = `${cell.comment}\n${stripTags(cell.code)}`;

  return (
    <div className="grid grid-cols-[1fr_auto] items-start gap-3 px-3.5 py-3 rounded-lg border border-transparent hover:border-cyan/15 hover:bg-cyan/3 transition-all">
      <div>
        <span className="block text-cyan font-bold text-sm">{cell.comment}</span>
        <div className="mt-1 font-mono text-sm text-text whitespace-pre-wrap break-words">{cell.code}</div>
      </div>
      <button
        onClick={() => copy(raw)}
        className="self-start font-mono text-[0.72rem] tracking-wide text-text-dim bg-white/4 border border-border-strong px-2.5 py-1.5 rounded-md hover:text-cyan hover:border-cyan/40 transition-all"
        aria-label="Скопировать"
      >
        {copied ? <Check size={14} className="text-yellow" /> : <Copy size={14} />}
      </button>
    </div>
  );
}

function stripTags(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(stripTags).join('');
  if (typeof node === 'object' && 'props' in node) return stripTags((node as { props: { children: ReactNode } }).props.children);
  return '';
}

export function Quickstart() {
  return (
    <section id="start" className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20">
      <SectionHeader
        badge="Быстрый старт"
        title="Три ячейки — и ComfyUI работает"
        description="Включите GPU T4 ×2 и интернет. Жмите Copy и вставляйте ячейки по порядку."
        className="mb-14"
      />

      <motion.div
        className="max-w-[920px] mx-auto bg-glass border border-border rounded-[20px] overflow-hidden backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.55),0_0_40px_rgba(0,240,255,0.04)]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Terminal bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/3 border-b border-border">
          {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
            <span key={c} className="w-[11px] h-[11px] rounded-full" style={{ background: c }} />
          ))}
          <span className="ml-2 flex-1 font-mono text-xs text-text-muted text-center">kaggle-notebook.ipynb — ComfyUI setup</span>
        </div>

        <div className="p-5 sm:p-7 font-mono text-sm leading-relaxed text-text space-y-1">
          {cells.map((c, i) => <Cell key={i} cell={c} />)}
        </div>
      </motion.div>

      <p className="mt-6 text-center text-text-muted text-[1.08rem]">
        Можно и одной строкой: <code className="bg-cyan/8 border border-cyan/20 px-2 py-0.5 rounded-md text-cyan">%run .../instal/start.py</code>
      </p>
    </section>
  );
}
