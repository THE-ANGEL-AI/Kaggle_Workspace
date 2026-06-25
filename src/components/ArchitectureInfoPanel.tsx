import type { ArchNode, ArchGroup } from '../data/architecture';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

interface Props {
  node: ArchNode | null;
  group: ArchGroup | undefined;
  expanded: boolean;
  onClose: () => void;
  onToggleExpand: () => void;
}

export function ArchitectureInfoPanel({ node, group, expanded, onClose, onToggleExpand }: Props) {
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          key={node.id}
          className="glass rounded-2xl border backdrop-blur-xl overflow-hidden"
          style={{ borderColor: group?.color ? `${group.color}30` : 'var(--color-border)' }}
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-3.5 border-b"
            style={{ borderColor: `${group?.color}20`, background: `${group?.color}06` }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl shrink-0">{node.icon}</span>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-sm text-text-bright truncate">
                  {node.label}
                </h3>
                <span
                  className="font-mono text-[0.6rem] tracking-wider uppercase font-bold"
                  style={{ color: group?.color ?? '#888' }}
                >
                  {group?.label ?? 'unknown'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Закрыть"
            >
              <X size={14} className="text-text-dim" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-3">
            <p className="text-text-dim text-sm leading-relaxed">{node.description}</p>

            {expanded && (
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-px bg-border" />
                <p className="text-text-muted text-sm leading-relaxed">{node.details}</p>

                {node.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {node.tech.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[0.6rem] font-bold tracking-wider px-2 py-0.5 rounded-full border"
                        style={{
                          color: group?.color,
                          borderColor: `${group?.color}30`,
                          background: `${group?.color}08`,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            <button
              onClick={onToggleExpand}
              className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] font-bold tracking-wider text-cyan hover:text-text-bright transition-colors"
            >
              <ExternalLink size={12} />
              {expanded ? 'Свернуть' : 'Подробнее'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
