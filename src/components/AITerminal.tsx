import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getCommandResponse } from '../data/terminalCommands';
import { ChevronRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

/* ── Color tag to className ── */
const colorMap: Record<string, string> = {
  cyan: 'text-cyan',
  green: 'text-green',
  purple: 'text-purple',
  magenta: 'text-magenta',
  yellow: 'text-yellow',
  dim: 'text-text-muted',
  bold: 'font-bold',
  red: 'text-red-500',
};

/** Parse color tags like <cyan>text</cyan> into spans */
function parseColoredText(line: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /<(\w+)>(.*?)<\/\1>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    // Text before tag
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index));
    }
    const cls = colorMap[match[1]] ?? '';
    parts.push(
      <span key={match.index} className={cls}>
        {match[2]}
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }
  // Remaining text
  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }
  return parts.length > 0 ? parts : [line];
}

/* ── History entry ── */
interface HistoryEntry {
  type: 'input' | 'output';
  text: string;
  lines?: string[];
}

/* ── Matrix Rain Effect ── */
function MatrixRain({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let elapsed = 0;
    const duration = 3000; // 3 seconds
    const fontSize = 14;
    const cols = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array.from({ length: cols }, () => Math.random() * -100);
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = y > 0 && Math.random() > 0.98 ? '#00F5FF' : '#00F5FF88';
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      elapsed += 16;
      if (elapsed >= duration) {
        cancelAnimationFrame(animId);
        ctx.fillStyle = '#0A0A0A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        onDone();
        return;
      }
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [onDone]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-10"
      width={800}
      height={400}
    />
  );
}

/* ── Typed output line ── */
function TypedLine({
  text,
  speed,
  onDone,
}: {
  text: string;
  speed: number;
  onDone: () => void;
}) {
  const [visible, setVisible] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    const totalChars = text.length;
    if (totalChars === 0) {
      onDone();
      return;
    }
    timerRef.current = setInterval(() => {
      setVisible((prev) => {
        if (prev >= totalChars) {
          clearInterval(timerRef.current);
          onDone();
          return totalChars;
        }
        return prev + 2; // type 2 chars at a time for speed
      });
    }, speed);
    return () => clearInterval(timerRef.current);
  }, [text, speed, onDone]);

  return (
    <span>
      {text.slice(0, Math.min(visible, text.length))}
      {visible < text.length && (
        <span className="text-cyan animate-pulse">▊</span>
      )}
    </span>
  );
}

/* ── Output line with typewriter ── */
function OutputLine({
  line,
  typing,
  speed,
  onDone,
}: {
  line: string;
  typing: boolean;
  speed: number;
  onDone: () => void;
}) {
  const colored = useMemo(() => parseColoredText(line), [line]);
  const isPlain = typeof colored[0] === 'string' || (colored.length === 1 && typeof colored[0] === 'string');

  return (
    <div className="font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
      {typing && isPlain ? (
        <TypedLine
          text={line}
          speed={speed}
          onDone={onDone}
        />
      ) : (
        <span className="[&_.text-cyan]:text-cyan [&_.text-green]:text-green [&_.text-purple]:text-purple [&_.text-magenta]:text-magenta [&_.text-yellow]:text-yellow [&_.text-text-muted]:text-text-muted [&_.font-bold]:font-bold">
          {colored}
        </span>
      )}
    </div>
  );
}

/* ── Main Terminal ── */
export function AITerminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', text: '', lines: [
      '<cyan>╭──────────────────────────────────────────╮</cyan>',
      '<cyan>│</cyan>  <bold>THE ANGEL AI — Terminal v2.0</bold>            <cyan>│</cyan>',
      '<cyan>│</cyan>                                          <cyan>│</cyan>',
      '<cyan>│</cyan>  <dim>Введи</dim> <cyan>help</cyan> <dim>для списка команд.</dim>               <cyan>│</cyan>',
      '<cyan>│</cyan>  <dim>Есть секретные команды — попробуй</dim>      <cyan>│</cyan>',
      '<cyan>│</cyan>  <dim>их найти!</dim>                              <cyan>│</cyan>',
      '<cyan>╰──────────────────────────────────────────╯</cyan>',
    ] },
  ]);
  const [input, setInput] = useState('');
  const [typingQueue, setTypingQueue] = useState<Array<{ lines: string[]; speed: number; clear?: boolean; effect?: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history, typingQueue]);

  // Process typing queue
  useEffect(() => {
    if (isTyping || typingQueue.length === 0) return;

    const next = typingQueue[0]!;
    setIsTyping(true);

    if (next.clear) {
      setHistory([]);
      setTypingQueue((prev) => prev.slice(1));
      setIsTyping(false);
      return;
    }

    if (next.effect === 'matrix') {
      setMatrixActive(true);
      setTypingQueue((prev) => prev.slice(1));
      setIsTyping(false);
      return;
    }

    // Add output lines to history one by one
    const entry: HistoryEntry = {
      type: 'output',
      text: '',
      lines: next.lines,
    };
    setHistory((prev) => [...prev, entry]);
    setTypingQueue((prev) => prev.slice(1));

    // After all lines are "typed", finish
    const totalTime = next.lines.reduce((acc, l) => acc + l.length * next.speed, 0);
    setTimeout(() => {
      setIsTyping(false);
    }, Math.min(totalTime, 3000));
  }, [typingQueue, isTyping]);

  const executeCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim();
      if (!trimmed) return;

      // Add to history
      setHistory((prev) => [...prev, { type: 'input', text: `$ ${trimmed}` }]);
      setCmdHistory((prev) => [...prev, trimmed]);
      setHistoryIdx(-1);

      const response = getCommandResponse(trimmed);
      if (response) {
        setTypingQueue((prev) => [...prev, { lines: response.lines, speed: response.speed ?? 6, clear: response.clear, effect: response.effect }]);
      }

      // Open GitHub link for github command
      if (trimmed.toLowerCase() === 'github' || trimmed === 'gh') {
        window.open('https://github.com/THE-ANGEL-AI/Kaggle_Workspace_FreeGPU', '_blank', 'noopener');
      }
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isTyping) return;
      executeCommand(input);
      setInput('');
    },
    [input, isTyping, executeCommand],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (cmdHistory.length === 0) return;
        const newIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(newIdx);
        setInput(cmdHistory[newIdx]!);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIdx === -1) return;
        const newIdx = historyIdx + 1;
        if (newIdx >= cmdHistory.length) {
          setHistoryIdx(-1);
          setInput('');
        } else {
          setHistoryIdx(newIdx);
          setInput(cmdHistory[newIdx]!);
        }
      }
    },
    [cmdHistory, historyIdx],
  );

  const handleMatrixDone = useCallback(() => {
    setMatrixActive(false);
  }, []);

  return (
    <section className="relative max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20 overflow-hidden">
      <SectionHeader
        badge="Терминал"
        title="AI Terminal"
        description="Интерактивный терминал проекта. Вводи команды — получай информацию."
      />

      {/* Terminal */}
      <motion.div
        className="relative max-w-[820px] mx-auto bg-[#0C0C0C] border border-border rounded-2xl overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.60),0_0_40px_rgba(0,245,255,0.03)]"
        style={{ willChange: 'transform, opacity' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Matrix rain overlay */}
        {matrixActive && <MatrixRain onDone={handleMatrixDone} />}

        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-black/40 border-b border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            <span className="w-[10px] h-[10px] rounded-full bg-[#ff5f56]" />
            <span className="w-[10px] h-[10px] rounded-full bg-[#ffbd2e]" />
            <span className="w-[10px] h-[10px] rounded-full bg-[#27c93f]" />
          </div>
          <span className="ml-3 font-mono text-[0.6rem] text-text-muted tracking-wider">
            THE ANGEL AI — Terminal
          </span>
          <span className="ml-auto font-mono text-[0.55rem] text-text-muted">
            {cmdHistory.length > 0 && `${cmdHistory.length} cmd`}
          </span>
        </div>

        {/* Output area */}
        <div
          ref={outputRef}
          className="p-4 sm:p-5 h-[360px] sm:h-[420px] overflow-y-auto font-mono text-xs sm:text-sm leading-relaxed space-y-0.5"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#00F5FF33 transparent',
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((entry, i) => (
            <div key={i}>
              {entry.type === 'input' ? (
                <div className="flex items-start gap-2">
                  <span className="text-green shrink-0">$</span>
                  <span className="text-text-bright">{entry.text.slice(2)}</span>
                </div>
              ) : (
                <div>
                  {entry.lines?.map((line, j) => (
                    <OutputLine
                      key={j}
                      line={line}
                      typing={false}
                      speed={6}
                      onDone={() => {}}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator for queue */}
          {typingQueue.length > 0 && (
            <div className="flex items-center gap-1.5 text-text-muted">
              <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
              <span className="text-[0.6rem] font-mono">Обработка...</span>
            </div>
          )}
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.06] bg-black/20"
        >
          <span className="text-green font-mono text-sm shrink-0">$</span>
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping || matrixActive}
              placeholder={isTyping ? 'Подождите...' : 'Введите команду...'}
              className="w-full bg-transparent text-text-bright font-mono text-sm outline-none placeholder:text-text-muted/40"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
            {/* Blinking cursor */}
            {!input && !isTyping && (
              <span className="absolute left-0 text-cyan animate-[boot-blink_0.8s_step-end_infinite] text-sm">
                ▊
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={isTyping || matrixActive}
            className="flex items-center gap-1 font-mono text-[0.6rem] font-bold tracking-wider text-cyan hover:text-text-bright transition-colors disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
        </form>

        {/* Command hints */}
        <div className="flex flex-wrap gap-1.5 px-4 py-2 border-t border-white/[0.03] bg-black/10">
          {['help', 'github', 'kaggle', 'comfy', 'flux', 'models'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => {
                if (isTyping || matrixActive) return;
                executeCommand(cmd);
              }}
              className="font-mono text-[0.55rem] font-bold tracking-wider px-2 py-0.5 rounded-full border border-white/[0.08] text-text-muted hover:text-cyan hover:border-cyan/30 transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
