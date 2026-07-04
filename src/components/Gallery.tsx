import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryItems, galleryCategories, type GalleryItem } from '../data/gallery';
import { X, ChevronLeft, ChevronRight, Maximize2, Clock, Image } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useScrollLock } from '../hooks/useScrollLock';

/* ── Gallery Card ── */
function GalleryCard({
  item,
  index,
  onOpen,
}: {
  item: GalleryItem;
  index: number;
  onOpen: (item: GalleryItem) => void;
}) {
  const cat = galleryCategories.find((c) => c.id === item.category);

  return (
    <motion.button
      onClick={() => onOpen(item)}
      className="group relative glass rounded-xl border border-border backdrop-blur-xl overflow-hidden text-left cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
      whileHover={{ y: -4 }}
    >
      {/* Preview */}
      <div
        className="aspect-[4/3] overflow-hidden bg-elevated border-b border-border relative"
      >
        {/* Zoom overlay */}
        <div className="absolute inset-0 bg-bg-deep/0 group-hover:bg-bg-deep/40 transition-all duration-300 z-10 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100">
            <Maximize2 size={24} className="text-cyan drop-shadow-[0_0_10px_var(--color-glow-cyan)]" />
          </div>
        </div>
        {/* Scale on hover */}
        <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
          {item.preview}
        </div>
        {/* Category badge */}
        <span
          className="absolute top-2.5 left-2.5 z-20 font-mono text-[0.5rem] font-bold tracking-wider px-1.5 py-0.5 rounded-full border"
          style={{
            color: cat?.color,
            borderColor: `${cat?.color}30`,
            background: `${cat?.color}15`,
          }}
        >
          {cat?.label}
        </span>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3 className="font-display font-bold text-xs text-text-bright truncate group-hover:text-cyan transition-colors">
          {item.title}
        </h3>
        <p className="text-text-muted text-[0.65rem] leading-relaxed mt-1 line-clamp-2">
          {item.description}
        </p>
        {item.stats && (
          <div className="flex items-center gap-1.5 mt-2 text-[0.5rem] font-mono text-text-muted">
            <Clock size={9} />
            {item.stats}
          </div>
        )}
      </div>
    </motion.button>
  );
}

/* ── Lightbox ── */
function Lightbox({
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  item: GalleryItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const cat = galleryCategories.find((c) => c.id === item.category);

  useEscapeKey(onClose);
  useScrollLock(true);

  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-bg-deep/90 backdrop-blur-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-xl bg-glass border border-border hover:border-cyan/40 hover:text-cyan transition-all"
        aria-label="Закрыть"
      >
        <X size={18} />
      </button>

      {/* Prev */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-xl bg-glass border border-border hover:border-cyan/40 hover:text-cyan transition-all"
          aria-label="Назад"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Next */}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-xl bg-glass border border-border hover:border-cyan/40 hover:text-cyan transition-all"
          aria-label="Вперёд"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* Content */}
      <motion.div
        className="max-w-[800px] w-[calc(100%-48px)] max-h-[90vh] flex flex-col"
        key={item.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {/* Preview large */}
        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-elevated border border-border">
          {item.preview}
        </div>

        {/* Info bar */}
        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[0.55rem] font-bold tracking-wider px-1.5 py-0.5 rounded-full"
                style={{
                  color: cat?.color,
                  background: `${cat?.color}10`,
                  border: `1px solid ${cat?.color}25`,
                }}
              >
                {cat?.label}
              </span>
              {item.date && (
                <span className="font-mono text-[0.5rem] text-text-muted">{item.date}</span>
              )}
            </div>
            <h2 className="font-display font-bold text-lg text-text-bright mt-1">{item.title}</h2>
            <p className="text-text-dim text-sm mt-0.5">{item.description}</p>
          </div>
          {item.stats && (
            <div className="shrink-0 font-mono text-[0.55rem] text-cyan bg-cyan/8 border border-cyan/20 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
              {item.stats}
            </div>
          )}
        </div>

        {/* Counter */}
        <div className="mt-3 text-center font-mono text-[0.55rem] text-text-muted">
          {galleryItems.findIndex((g) => g.id === item.id) + 1} / {galleryItems.length}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Gallery ── */
export function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filtered = useMemo(
    () =>
      activeCategory === 'all'
        ? galleryItems
        : galleryItems.filter((g) => g.category === activeCategory),
    [activeCategory],
  );

  const lightboxIndex = useMemo(
    () => (lightboxItem ? filtered.findIndex((g) => g.id === lightboxItem.id) : -1),
    [lightboxItem, filtered],
  );

  const handleOpen = useCallback((item: GalleryItem) => {
    setLightboxItem(item);
  }, []);

  const handleClose = useCallback(() => {
    setLightboxItem(null);
  }, []);

  const handlePrev = useCallback(() => {
    const idx = filtered.findIndex((g) => g.id === lightboxItem?.id);
    if (idx > 0) setLightboxItem(filtered[idx - 1]!);
  }, [filtered, lightboxItem]);

  const handleNext = useCallback(() => {
    const idx = filtered.findIndex((g) => g.id === lightboxItem?.id);
    if (idx < filtered.length - 1) setLightboxItem(filtered[idx + 1]!);
  }, [filtered, lightboxItem]);

  return (
    <section id="gallery" className="relative max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20 overflow-hidden">
      <SectionHeader
        badge="Галерея"
        title="Примеры генераций"
        description="Flux2 GGUF, LTX 2.3 Video, ComfyUI workflow и TTS. Нажми на карточку для просмотра."
      />

      {/* Category filter */}
      <div className="flex items-center justify-center gap-1.5 mb-8 flex-wrap">
        {galleryCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg font-bold text-[0.6rem] tracking-wider transition-all ${
              activeCategory === cat.id
                ? 'text-bg-deep shadow-[0_0_12px_rgba(0,245,255,0.3)]'
                : 'text-text-dim border border-border hover:text-text-bright hover:border-cyan/30'
            }`}
            style={
              activeCategory === cat.id ? { background: cat.color } : { background: 'transparent' }
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4 space-y-3 sm:space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {filtered.map((item, i) => (
            <GalleryCard key={item.id} item={item} index={i} onOpen={handleOpen} />
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Image size={32} className="text-text-muted mx-auto mb-3" />
          <p className="text-text-muted text-sm">Нет работ в этой категории</p>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <Lightbox
            item={lightboxItem}
            onClose={handleClose}
            onPrev={handlePrev}
            onNext={handleNext}
            hasPrev={lightboxIndex > 0}
            hasNext={lightboxIndex < filtered.length - 1}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
