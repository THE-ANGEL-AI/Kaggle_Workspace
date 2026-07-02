import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { AngelAssistant } from './components/AngelAssistant';
import { CursorGlow } from './components/CursorGlow';
import { Aurora } from './components/Aurora';
import { useLenis } from './hooks/useLenis';
import { Home } from './pages/Home';

// News — отдельный чанк, грузится только при заходе на /news
const News = lazy(() => import('./pages/News').then((m) => ({ default: m.News })));

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const } },
};

/* ── Skeleton fallback для lazy-секций ── */
function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.25em] uppercase text-text-muted">
        <span className="w-2 h-2 rounded-full bg-cyan animate-pulse shadow-[0_0_10px_var(--color-glow-cyan)]" />
        Загрузка…
      </div>
    </div>
  );
}

export function App() {
  const location = useLocation();
  useLenis();

  return (
    <>
      <CursorGlow />
      <AngelAssistant />
      <a className="skip-link" href="#main">Перейти к содержимому</a>
      {/* Aurora — глобальный «воздух» (PHASE 17). fixed, pointer-events:none — не блочит клики */}
      <Aurora />
      <div className="bg-grid" aria-hidden="true" />
      <Nav />
      <main id="main" className="relative z-[1]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route
                path="/news"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <News />
                  </Suspense>
                }
              />
              <Route path="*" element={<Home />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
