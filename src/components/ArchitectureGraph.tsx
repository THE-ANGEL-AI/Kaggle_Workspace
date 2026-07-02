import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  architectureNodes,
  architectureEdges,
  architectureGroups,
  type ArchNode,
  type ArchGroup,
} from '../data/architecture';
import { ArchitectureInfoPanel } from './ArchitectureInfoPanel';
import { ZoomIn, ZoomOut, RotateCcw, Layers } from 'lucide-react';
import { Tooltip } from './ui/tooltip';

/* ── Helpers ── */

/** Bezier control point offset for curved edges */
function getCurvePath(
  x1: number, y1: number,
  x2: number, y2: number,
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx1 = x1 + dx * 0.4;
  const cx2 = x2 - dx * 0.4;
  const cy1 = y1 + dy * 0.15;
  const cy2 = y2 - dy * 0.15;
  return `M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;
}

/** Get group by id */
function getGroup(id: string): ArchGroup | undefined {
  return architectureGroups.find((g) => g.id === id);
}

/* ── Constants ── */
const GRAPH_W = 1060;
const GRAPH_H = 940;
const NODE_W = 130;
const NODE_H = 44;
const GROUP_PAD = 24;

/* ── Edge path component with flow dot ── */
function EdgePath({
  edge,
  nodeMap,
  index,
}: {
  edge: { from: string; to: string; label: string };
  nodeMap: Map<string, ArchNode>;
  index: number;
}) {
  const from = nodeMap.get(edge.from);
  const to = nodeMap.get(edge.to);
  if (!from || !to) return null;

  const x1 = from.x;
  const y1 = from.y + NODE_H / 2;
  const x2 = to.x;
  const y2 = to.y - NODE_H / 2;
  const path = getCurvePath(x1, y1, x2, y2);

  // Midpoint for label
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - 10;

  return (
    <g>
      {/* Edge line */}
      <path
        d={path}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={1.2}
        strokeDasharray="4 3"
      />
      {/* Edge label */}
      <text
        x={mx}
        y={my}
        textAnchor="middle"
        fill="rgba(255,255,255,0.25)"
        fontSize="8"
        fontFamily="JetBrains Mono, ui-monospace, monospace"
        letterSpacing="1"
      >
        {edge.label}
      </text>
      {/* Flow dot */}
      <circle r="0" fill="#00F5FF" opacity="0.7">
        <animateMotion
          dur={`${2.5 + (index % 5) * 0.8}s`}
          repeatCount="indefinite"
          path={path}
        />
        <animate
          attributeName="r"
          values="0;2.5;0"
          dur={`${2.5 + (index % 5) * 0.8}s`}
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
}

/* ── Node component ── */
function GraphNode({
  node,
  group,
  isHovered,
  isSelected,
  onHover,
  onLeave,
  onClick,
}: {
  node: ArchNode;
  group: ArchGroup | undefined;
  isHovered: boolean;
  isSelected: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const color = group?.color ?? '#888';
  const active = isHovered || isSelected;

  return (
    <g
      style={{ cursor: 'pointer' }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* Glow behind node when active */}
      {active && (
        <rect
          x={node.x - NODE_W / 2 - 8}
          y={node.y - NODE_H / 2 - 8}
          width={NODE_W + 16}
          height={NODE_H + 16}
          rx={14}
          fill="none"
          stroke={color}
          strokeWidth={1}
          strokeOpacity={0.3}
          filter={`url(#glow-${node.id})`}
        />
      )}

      {/* Node rect */}
      <motion.rect
        x={node.x - NODE_W / 2}
        y={node.y - NODE_H / 2}
        width={NODE_W}
        height={NODE_H}
        rx={10}
        fill={active ? `${color}18` : 'rgba(24,24,27,0.85)'}
        stroke={active ? color : 'rgba(255,255,255,0.08)'}
        strokeWidth={active ? 1.5 : 1}
        initial={false}
        animate={{
          scale: active ? 1.05 : 1,
          filter: active
            ? `drop-shadow(0 0 12px ${color}40)`
            : 'drop-shadow(0 0 0px transparent)',
        }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: `${node.x}px ${node.y}px` }}
      />

      {/* Icon */}
      <text
        x={node.x - NODE_W / 2 + 14}
        y={node.y + 5}
        textAnchor="middle"
        fontSize="14"
        dominantBaseline="central"
      >
        {node.icon}
      </text>

      {/* Label */}
      <text
        x={node.x - NODE_W / 2 + 30}
        y={node.y + 1}
        fill={active ? '#F8F8FF' : '#B8B8D0'}
        fontSize="9"
        fontFamily="var(--font-mono), JetBrains Mono, ui-monospace, monospace"
        fontWeight={active ? '700' : '500'}
        letterSpacing="0.3"
        dominantBaseline="central"
      >
        {node.label.length > 16 ? node.label.slice(0, 14) + '…' : node.label}
      </text>

      {/* Small accent dot */}
      <circle
        cx={node.x + NODE_W / 2 - 10}
        cy={node.y}
        r={3}
        fill={color}
        opacity={active ? 1 : 0.4}
      />
    </g>
  );
}

/* ── Group background ── */
function GroupRegion({ group, nodes }: { group: ArchGroup; nodes: ArchNode[] }) {
  const groupNodes = nodes.filter((n) => n.group === group.id);
  if (groupNodes.length === 0) return null;

  const minX = Math.min(...groupNodes.map((n) => n.x - NODE_W / 2)) - GROUP_PAD;
  const maxX = Math.max(...groupNodes.map((n) => n.x + NODE_W / 2)) + GROUP_PAD;
  const minY = Math.min(...groupNodes.map((n) => n.y - NODE_H / 2)) - GROUP_PAD;
  const maxY = Math.max(...groupNodes.map((n) => n.y + NODE_H / 2)) + GROUP_PAD;

  const w = maxX - minX;
  const h = maxY - minY;

  return (
    <g>
      <rect
        x={minX}
        y={minY}
        width={w}
        height={h}
        rx={16}
        fill={group.bgColor}
        stroke={`${group.color}15`}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      {/* Group label */}
      <text
        x={minX + 14}
        y={minY + 18}
        fill={group.color}
        fontSize="9"
        fontFamily="JetBrains Mono, ui-monospace, monospace"
        fontWeight="700"
        letterSpacing="2"
        opacity={0.6}
      >
        {group.label.toUpperCase()}
      </text>
    </g>
  );
}

/* ── Main component ── */
export function ArchitectureGraph() {
  const [hoveredNode, setHoveredNode] = useState<ArchNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [zoom, setZoom] = useState(0.65);
  const containerRef = useRef<HTMLDivElement>(null);

  const nodeMap = useMemo(
    () => new Map(architectureNodes.map((n) => [n.id, n])),
    [],
  );

  const activeNode = hoveredNode ?? selectedNode;
  const activeGroup = activeNode ? getGroup(activeNode.group) : undefined;

  const handleNodeHover = useCallback((node: ArchNode) => {
    setHoveredNode(node);
  }, []);

  const handleNodeLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  const handleNodeClick = useCallback((node: ArchNode) => {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
    setExpanded(false);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedNode(null);
    setHoveredNode(null);
    setExpanded(false);
  }, []);

  const handleToggleExpand = useCallback(() => {
    setExpanded((v) => !v);
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((v) => Math.min(v + 0.1, 1.2));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((v) => Math.max(v - 0.1, 0.35));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(0.65);
  }, []);

  // Determine if mobile — с реактивностью на resize
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768,
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    onChange(mq);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // На мобиле группируем ноды по группам для вертикального списка
  const nodesByGroup = useMemo(() => {
    const map = new Map<string, ArchNode[]>();
    for (const n of architectureNodes) {
      if (!map.has(n.group)) map.set(n.group, []);
      map.get(n.group)!.push(n);
    }
    return map;
  }, []);

  return (
    <section className="relative max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-cyan bg-cyan/8 px-3.5 py-1.5 rounded-full mb-5 border border-cyan/20">
          Архитектура
        </span>
        <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-display font-extrabold text-text-bright mb-3">
          Интерактивный граф компонентов
        </h2>
        <p className="text-text-muted text-[1.08rem] max-w-[620px] mx-auto leading-relaxed">
          Наведи на узел — увидишь описание. Нажми — откроются технические детали.
          Точки анимируют поток данных между модулями.
        </p>
      </div>

      {/* Zoom controls */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Tooltip text="Уменьшить">
          <button
            onClick={zoomOut}
            className="flex items-center gap-1.5 font-mono text-[0.65rem] font-bold tracking-wider text-text-dim bg-glass border border-border px-3 py-1.5 rounded-lg hover:text-cyan hover:border-cyan/30 transition-all"
            aria-label="Уменьшить"
          >
            <ZoomOut size={14} /> -
          </button>
        </Tooltip>
        <span className="font-mono text-[0.6rem] text-text-muted tracking-wider w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Tooltip text="Увеличить">
          <button
            onClick={zoomIn}
            className="flex items-center gap-1.5 font-mono text-[0.65rem] font-bold tracking-wider text-text-dim bg-glass border border-border px-3 py-1.5 rounded-lg hover:text-cyan hover:border-cyan/30 transition-all"
            aria-label="Увеличить"
          >
            <ZoomIn size={14} /> +
          </button>
        </Tooltip>
        <Tooltip text="100% масштаб">
          <button
            onClick={resetZoom}
            className="flex items-center gap-1.5 font-mono text-[0.65rem] font-bold tracking-wider text-text-dim bg-glass border border-border px-3 py-1.5 rounded-lg hover:text-cyan hover:border-cyan/30 transition-all"
            aria-label="Сбросить"
          >
            <RotateCcw size={14} />
          </button>
        </Tooltip>
      </div>

      {/* Mobile: вертикальный список по группам (SVG-граф неудобен на узких экранах) */}
      {isMobile && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-text-muted text-xs font-mono mb-2">
            <Layers size={14} className="text-cyan" />
            <span className="uppercase tracking-wider">{architectureGroups.length} групп · {architectureNodes.length} нодов</span>
          </div>
          {architectureGroups.map((group) => {
            const groupNodes = nodesByGroup.get(group.id) ?? [];
            return (
              <div
                key={group.id}
                className="glass rounded-2xl border border-border p-4 backdrop-blur-xl"
                style={{ borderColor: `${group.color}30` }}
              >
                <div
                  className="flex items-center gap-2 mb-3 pb-2 border-b"
                  style={{ borderColor: `${group.color}20` }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      background: group.color,
                      boxShadow: `0 0 8px ${group.color}`,
                    }}
                  />
                  <span
                    className="font-mono text-[0.6rem] font-bold tracking-[0.18em] uppercase"
                    style={{ color: group.color }}
                  >
                    {group.label}
                  </span>
                  <span className="ml-auto font-mono text-[0.55rem] text-text-muted">
                    {groupNodes.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {groupNodes.map((node) => (
                    <button
                      key={node.id}
                      onClick={() => handleNodeClick(node)}
                      className={`text-left flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                        selectedNode?.id === node.id
                          ? 'border-cyan/40 bg-cyan/10'
                          : 'border-border bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="text-base shrink-0">{node.icon}</span>
                      <span className="text-[0.7rem] font-medium text-text-bright leading-tight truncate">
                        {node.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Graph + Info Panel layout */}
      <div className={`grid gap-6 ${isMobile ? '' : 'md:grid-cols-[1fr_320px]'}`}>
        {/* SVG Graph — только desktop */}
        {!isMobile && (
        <div
          ref={containerRef}
          className="relative glass rounded-2xl border border-border backdrop-blur-xl overflow-auto"
          style={{ maxHeight: '600px' }}
        >
          <svg
            viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`}
            width={GRAPH_W * zoom}
            height={GRAPH_H * zoom}
            className="min-w-[1060px]"
            style={{ transformOrigin: 'top left' }}
          >
            {/* Filters */}
            <defs>
              {architectureNodes.map((node) => (
                <filter key={node.id} id={`glow-${node.id}`}>
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
            </defs>

            {/* Groups */}
            {architectureGroups.map((group) => (
              <GroupRegion key={group.id} group={group} nodes={architectureNodes} />
            ))}

            {/* Edges */}
            {architectureEdges.map((edge, i) => (
              <EdgePath
                key={`${edge.from}-${edge.to}-${i}`}
                edge={edge}
                nodeMap={nodeMap}
                index={i}
              />
            ))}

            {/* Nodes */}
            {architectureNodes.map((node) => (
              <GraphNode
                key={node.id}
                node={node}
                group={getGroup(node.group)}
                isHovered={hoveredNode?.id === node.id}
                isSelected={selectedNode?.id === node.id}
                onHover={() => handleNodeHover(node)}
                onLeave={handleNodeLeave}
                onClick={() => handleNodeClick(node)}
              />
            ))}
          </svg>
        </div>
        )}

        {/* Info Panel */}
        <div className="md:w-[320px] shrink-0">
          {!activeNode && (
            <div className="glass rounded-2xl border border-border p-6 text-center backdrop-blur-xl h-full flex flex-col items-center justify-center">
              <span className="text-3xl mb-3">🔍</span>
              <p className="text-text-muted text-sm max-w-[220px] mx-auto leading-relaxed">
                Наведи на любой узел на графе, чтобы увидеть его описание
              </p>
              <div
                className="mt-4 w-12 h-0.5 rounded-full"
                style={{ background: 'linear-gradient(90deg, #00F5FF, #7B61FF, #A855F7)' }}
              />
            </div>
          )}
          <ArchitectureInfoPanel
            node={activeNode}
            group={activeGroup}
            expanded={expanded}
            onClose={handleClose}
            onToggleExpand={handleToggleExpand}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-[0.65rem]">
        {architectureGroups.map((g) => (
          <div key={g.id} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: g.color }}
            />
            <span className="font-mono font-bold tracking-wider text-text-muted">
              {g.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
