import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  repoScripts,
  repoWorkflows,
  repoFeatures,
  repoFileTree,
  type RepoScript,
  type RepoWorkflow,
  type FileTreeNode,
} from '../data/repository';
import {
  ChevronRight,
  ChevronDown,
  ExternalLink,
  FolderOpen,
  Code,
  Braces,
  Sparkles,
} from 'lucide-react';
import { SectionHeader } from './SectionHeader';

/* ── Tab config ── */
interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'structure', label: 'Структура', icon: <FolderOpen size={14} /> },
  { id: 'scripts', label: 'Скрипты', icon: <Code size={14} /> },
  { id: 'workflows', label: 'Workflows', icon: <Braces size={14} /> },
  { id: 'features', label: 'Фичи', icon: <Sparkles size={14} /> },
];

/* ── File tree node (recursive) ── */
function TreeNode({ node, depth = 0 }: { node: FileTreeNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <button
        onClick={() => hasChildren && setExpanded((v) => !v)}
        className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg hover:bg-white/[0.03] transition-colors group"
        style={{ paddingLeft: `${12 + depth * 20}px` }}
      >
        {hasChildren ? (
          <span className="text-text-muted shrink-0">
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
        ) : (
          <span className="w-3 shrink-0" />
        )}
        <span className="text-sm shrink-0">{node.icon}</span>
        <span className={`font-mono text-xs ${node.type === 'dir' ? 'font-bold text-text-bright' : 'text-text-dim'} truncate`}>
          {node.name}
        </span>
        <span className="text-[0.55rem] text-text-muted truncate ml-auto hidden sm:block group-hover:text-cyan/60 transition-colors">
          {node.description}
        </span>
      </button>
      <AnimatePresence>
        {hasChildren && expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
          >
            {node.children!.map((child) => (
              <TreeNode key={child.name} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Structure tab ── */
function StructureTab() {
  return (
    <motion.div
      className="glass rounded-2xl border border-border backdrop-blur-xl overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
        <span className="font-display font-bold text-sm text-text-bright">Дерево файлов</span>
        <a
          href="https://github.com/THE-ANGEL-AI/Kaggle_Workspace_FreeGPU"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-mono text-[0.6rem] text-cyan hover:text-text-bright transition-colors"
        >
          <ExternalLink size={10} /> GitHub
        </a>
      </div>
      <div className="p-3">
        {repoFileTree.map((node) => (
          <TreeNode key={node.name} node={node} />
        ))}
      </div>

      {/* Quick stats */}
      <div className="flex gap-4 px-5 py-3 border-t border-border bg-white/[0.02]">
        {[
          { label: 'Скриптов', value: '4', color: 'text-cyan' },
          { label: 'Workflow', value: '3', color: 'text-purple' },
          { label: 'Директорий', value: '4', color: 'text-violet' },
          { label: 'Файлов', value: '10+', color: 'text-green' },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 text-[0.6rem] font-mono">
            <span className={`font-extrabold ${s.color}`}>{s.value}</span>
            <span className="text-text-muted">{s.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Script card ── */
function ScriptCard({ script, index }: { script: RepoScript; index: number }) {
  return (
    <motion.div
      className="glass rounded-2xl border border-border backdrop-blur-xl overflow-hidden"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.1 }}
    >
      <div className="p-5 sm:p-6">
        {/* Step badge + icon */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{ background: `${script.color}15`, border: `1px solid ${script.color}30` }}
          >
            {script.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[0.55rem] font-bold tracking-wider px-2 py-0.5 rounded-full"
                style={{ color: script.color, background: `${script.color}10`, border: `1px solid ${script.color}25` }}
              >
                ШАГ {script.step}/3
              </span>
              <span className="font-mono text-[0.55rem] text-text-muted">{script.file}</span>
            </div>
            <h3 className="font-display font-bold text-sm text-text-bright mt-0.5">{script.title}</h3>
          </div>
        </div>

        <p className="text-text-dim text-xs mb-3">{script.description}</p>

        <div
          className="h-px w-full mb-3"
          style={{ background: `linear-gradient(90deg, ${script.color}40, transparent)` }}
        />

        <p className="text-text-muted text-xs leading-relaxed">{script.details}</p>
      </div>
    </motion.div>
  );
}

/* ── Scripts tab ── */
function ScriptsTab() {
  return (
    <div className="grid md:grid-cols-3 gap-3">
      {repoScripts.map((script, i) => (
        <ScriptCard key={script.name} script={script} index={i} />
      ))}
    </div>
  );
}

/* ── Workflow card ── */
function WorkflowCard({ wf, index }: { wf: RepoWorkflow; index: number }) {
  return (
    <motion.a
      href={`https://github.com/THE-ANGEL-AI/Kaggle_Workspace_FreeGPU/tree/main/${wf.file}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block glass rounded-2xl border border-border backdrop-blur-xl overflow-hidden hover:-translate-y-1 transition-all"
      style={{
        borderColor: `${wf.accent}15`,
      }}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.1 }}
    >
      <div className="p-5 sm:p-6">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4"
          style={{ background: `${wf.accent}12`, border: `1px solid ${wf.accent}25` }}
        >
          {wf.icon}
        </div>

        <h3 className="font-display font-bold text-sm text-text-bright mb-1.5">{wf.name}</h3>
        <p className="text-text-muted text-xs leading-relaxed mb-3">{wf.description}</p>

        {/* Model tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {wf.models.map((m) => (
            <span
              key={m}
              className="font-mono text-[0.5rem] font-bold tracking-wider px-1.5 py-0.5 rounded-full"
              style={{ color: wf.accent, background: `${wf.accent}10`, border: `1px solid ${wf.accent}20` }}
            >
              {m}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 font-mono text-[0.55rem] text-text-dim group-hover:text-cyan transition-colors">
          <span className="truncate">{wf.file}</span>
          <ExternalLink size={10} className="shrink-0" />
        </div>
      </div>
    </motion.a>
  );
}

/* ── Workflows tab ── */
function WorkflowsTab() {
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {repoWorkflows.map((wf, i) => (
        <WorkflowCard key={wf.name} wf={wf} index={i} />
      ))}
    </div>
  );
}

/* ── Features tab ── */
function FeaturesTab() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {repoFeatures.map((f, i) => (
        <motion.div
          key={f.title}
          className="glass rounded-2xl border border-border backdrop-blur-xl p-5 sm:p-6"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.06 }}
        >
          <span className="text-2xl mb-3 block">{f.icon}</span>
          <h3 className="font-display font-bold text-sm text-text-bright mb-1.5">{f.title}</h3>
          <p className="text-text-muted text-xs leading-relaxed">{f.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Main component ── */
export function RepositoryShowcase() {
  const [activeTab, setActiveTab] = useState('structure');

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  return (
    <section className="relative max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20 overflow-hidden">
      <SectionHeader
        badge="Репозиторий"
        title="Что внутри репозитория"
        description="Исследуй структуру, скрипты, workflow и возможности проекта."
      />

      {/* Tab bar */}
      <div className="flex items-center justify-center gap-1 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-bold text-[0.7rem] tracking-wider transition-all ${
              activeTab === tab.id
                ? 'bg-cyan text-bg-deep shadow-[0_0_16px_var(--color-glow-cyan)]'
                : 'text-text-dim bg-glass border border-border hover:text-text-bright hover:border-cyan/30'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'structure' && <StructureTab />}
          {activeTab === 'scripts' && <ScriptsTab />}
          {activeTab === 'workflows' && <WorkflowsTab />}
          {activeTab === 'features' && <FeaturesTab />}
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <a
          href="https://github.com/THE-ANGEL-AI/Kaggle_Workspace_FreeGPU"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm bg-cyan text-bg-deep hover:shadow-[0_0_24px_var(--color-glow-cyan),0_0_60px_var(--color-glow-cyan)] hover:-translate-y-0.5 transition-all"
        >
          <ExternalLink size={16} />
          Открыть на GitHub
        </a>
      </motion.div>
    </section>
  );
}
