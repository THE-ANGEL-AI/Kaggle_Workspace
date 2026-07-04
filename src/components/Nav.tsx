import { Link } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ExternalLink } from 'lucide-react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useScrollLock } from '../hooks/useScrollLock';

const links = [
  { to: '/#project', label: 'Проект' },
  { to: '/#start', label: 'Старт' },
  { to: '/#updates', label: 'Новости' },
  { to: '/news', label: 'Лента →' },
];

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEscapeKey(() => setMenuOpen(false), menuOpen);
  useScrollLock(menuOpen);

  const close = useCallback(() => setMenuOpen(false), []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 h-16 bg-deep/80 backdrop-blur-2xl border-b border-border">
      <Link to="/" onClick={close} className="flex items-center gap-2.5 font-display font-extrabold text-sm tracking-wider text-text-bright">
        <span className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_10px_var(--color-cyan),0_0_20px_var(--color-glow-cyan)] animate-pulse" />
        THE ANGEL AI
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-6 text-sm">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="text-text-dim hover:text-text-bright transition-colors relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-gradient-to-r after:from-cyan after:to-magenta after:rounded-full after:scale-x-0 after:origin-left after:transition-transform after:duration-280 hover:after:scale-x-100">
            {l.label}
          </Link>
        ))}
      </div>

      {/* Burger */}
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="md:hidden flex items-center justify-center w-9 h-9 border border-border-strong rounded-lg bg-white/3 hover:border-cyan transition-colors"
        aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
      >
        {menuOpen ? <X size={18} className="text-cyan" /> : <Menu size={18} className="text-text-dim" />}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-void/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-50 w-[min(360px,85vw)] bg-glass backdrop-blur-2xl border-l border-border flex flex-col shadow-[-10px_0_50px_rgba(0,0,0,0.6)]"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <span className="font-display font-bold text-sm text-text-bright">Меню</span>
                <button onClick={close} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors">
                  <X size={16} className="text-text-dim" />
                </button>
              </div>
              <div className="flex-1 flex flex-col p-4 gap-1">
                {links.map((l) => (
                  <Link key={l.to} to={l.to} onClick={close} className="flex items-center justify-between px-4 py-3.5 rounded-lg text-text-dim hover:text-text-bright hover:bg-cyan/5 transition-all text-[1.05rem] font-semibold group">
                    <span>{l.label}</span>
                    <ExternalLink size={14} className="text-cyan opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-border flex gap-4 text-sm">
                <a href="https://github.com/THE-ANGEL-AI" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-cyan transition-colors">GitHub</a>
                <a href="https://boosty.to/the_angel/donate" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-cyan transition-colors">Boosty</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
