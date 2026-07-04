import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';

interface NodeProps {
  label: string;
  desc: string;
  icon: string;
  color: string;
  index: number;
}

const nodes: NodeProps[] = [
  { label: 'Kaggle', desc: 'GPU T4 ×2', icon: '☁️', color: '#00F5FF', index: 0 },
  { label: 'Instal', desc: '3 Python-скрипта', icon: '⚙️', color: '#7B61FF', index: 1 },
  { label: 'ComfyUI', desc: 'Интерфейс генерации', icon: '🎨', color: '#A855F7', index: 2 },
  { label: 'Tunnel', desc: 'Cloudflare', icon: '🔗', color: '#00FFB3', index: 3 },
  { label: 'URL', desc: 'Готово!', icon: '🌐', color: '#FCEE0A', index: 4 },
];

function PipelineNode({ label, desc, icon, color, index }: NodeProps) {
  return (
    <motion.div
      className="relative flex flex-col items-center text-center z-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.12 }}
    >
      {/* Icon circle */}
      <motion.div
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl mb-3 relative"
        style={{
          background: `${color}12`,
          border: `1px solid ${color}30`,
          boxShadow: `0 0 20px ${color}20`,
        }}
        whileHover={{ scale: 1.08, boxShadow: `0 0 30px ${color}40` }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <span className="text-xl sm:text-2xl">{icon}</span>
        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ border: `1px solid ${color}30` }}
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 1.3 }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
        />
      </motion.div>

      {/* Label */}
      <span className="font-display font-bold text-sm text-text-bright">{label}</span>
      <span className="font-mono text-[0.6rem] text-text-muted tracking-wider mt-0.5">{desc}</span>
    </motion.div>
  );
}

function ArrowConnector({ index, color }: { index: number; color: string }) {
  return (
    <div className="hidden sm:flex items-center justify-center flex-shrink-0 w-12 relative">
      <motion.div
        className="h-px w-full"
        style={{
          background: `linear-gradient(90deg, ${color}40, ${nodes[index + 1]?.color ?? '#00F5FF'}40)`,
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.12 + 0.2 }}
      />
      <motion.div
        className="absolute right-0 w-2 h-2 rotate-45"
        style={{
          border: `1px solid ${nodes[index + 1]?.color ?? '#00F5FF'}60`,
          borderLeft: 'none',
          borderBottom: 'none',
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: index * 0.12 + 0.4 }}
      />
    </div>
  );
}

export function WorkflowDiagram() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20">
      <SectionHeader
        badge="Pipeline"
        title="Визуальная схема работы"
        description="От блокнота до публичного ComfyUI — за ~80 секунд"
        className="mb-12"
      />

      <motion.div
        className="glass rounded-2xl p-6 sm:p-10 border border-border backdrop-blur-xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Mobile: stacked layout */}
        <div className="flex sm:hidden flex-col items-center gap-6">
          {nodes.map((node, i) => (
            <div key={node.label} className="flex flex-col items-center w-full">
              <PipelineNode {...node} />
              {i < nodes.length - 1 && (
                <motion.div
                  className="w-px h-6 my-1"
                  style={{ background: `linear-gradient(180deg, ${node.color}40, ${nodes[i + 1]?.color ?? '#00F5FF'}40)` }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Desktop: horizontal layout */}
        <div className="hidden sm:flex items-center justify-center gap-0">
          {nodes.map((node, i) => (
            <div key={node.label} className="flex items-center">
              <PipelineNode {...node} />
              {i < nodes.length - 1 && <ArrowConnector index={i} color={node.color} />}
            </div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          className="mt-10 pt-6 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {[
            { label: 'Всего времени', value: '~80 сек', color: 'text-cyan' },
            { label: 'Команд', value: '3', color: 'text-purple' },
            { label: 'Скриптов', value: '3', color: 'text-violet' },
            { label: 'GPU', value: '2× T4', color: 'text-green' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`font-mono text-xl font-extrabold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-[0.65rem] text-text-muted tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
