import { motion } from 'framer-motion';
import { NewsCard } from '../components/NewsCard';
import { Link } from 'react-router-dom';
import { newsEntries } from '../data/news';
import { ArrowLeft } from 'lucide-react';

export function News() {
  return (
    <>
      <header className="relative z-10 px-4 sm:px-8 pt-24 pb-10 text-center overflow-hidden">
        <div className="absolute inset-0 -m-[20%] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 50% 50% at 30% 30%, rgba(0,240,255,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 70% 60%, rgba(255,0,122,0.06) 0%, transparent 60%)',
          }}
        />
        <motion.h1
          className="relative z-10 text-[clamp(2.4rem,7vw,5rem)] font-display font-black leading-[1.05] -tracking-[0.035em] text-text-bright"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Лента<br />
          <span className="bg-gradient-to-r from-cyan to-magenta bg-clip-text text-transparent">обновлений</span>
        </motion.h1>
        <motion.p
          className="relative z-10 text-text-dim text-[clamp(0.95rem,1.4vw,1.1rem)] max-w-[620px] mx-auto mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Релизы, обновления GPU/CUDA, поддержка новых моделей и фиксы.
        </motion.p>
        <div className="relative z-10 mx-auto mt-6 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-cyan to-transparent shadow-[0_0_20px_var(--color-glow-cyan)]" />
      </header>

      <section className="max-w-[880px] mx-auto px-4 sm:px-8 pb-20">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-cyan bg-cyan/8 px-3.5 py-1.5 rounded-full mb-5 border border-cyan/20">Changelog</span>
          <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-display font-extrabold text-text-bright">История изменений</h2>
        </div>

        <motion.div
          className="grid gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {newsEntries.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
            >
              <NewsCard entry={e} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <Link to="/" className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-sm text-text-dim border border-border-strong hover:bg-white/6 hover:text-text-bright hover:border-white/30 transition-all">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Вернуться на главную
          </Link>
        </div>
      </section>
    </>
  );
}
