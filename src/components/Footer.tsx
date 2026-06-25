import { Link } from 'react-router-dom';
import { GitBranch, Heart, Newspaper } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative z-10 bg-glass backdrop-blur-xl border-t border-border px-4 sm:px-8 py-10">
      <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-5">
        <div>
          <strong className="text-text-bright text-sm tracking-wider">THE ANGEL AI</strong>
          <span className="block text-text-muted text-sm mt-1">сделано с ❤️ для тех, у кого нет своего GPU</span>
        </div>
        <nav className="flex flex-wrap gap-4 sm:gap-6 text-sm">
          <a href="https://github.com/THE-ANGEL-AI" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-text-dim hover:text-cyan transition-colors">
            <GitBranch size={16} /> GitHub
          </a>
          <a href="https://vk.com/theangel_lab" target="_blank" rel="noopener noreferrer" className="text-text-dim hover:text-cyan transition-colors">ВКонтакте</a>
          <a href="https://boosty.to/the_angel/donate" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-text-dim hover:text-cyan transition-colors">
            <Heart size={16} /> Boosty
          </a>
          <Link to="/news" className="flex items-center gap-1.5 text-text-dim hover:text-cyan transition-colors">
            <Newspaper size={16} /> Лента
          </Link>
        </nav>
      </div>
    </footer>
  );
}
