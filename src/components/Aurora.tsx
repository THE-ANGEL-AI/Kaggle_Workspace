import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Aurora-эффект — медленно дышащие градиентные пятна на фоне.
 *
 * Используется как глобальный «воздух» сайта: создаёт ощущение живой атмосферы
 * между секциями без тяжёлого 3D. Три слоя радиальных градиентов (cyan/violet/magenta)
 * медленно перемещаются через CSS keyframes, opacity ~25% чтобы не перебивать
 * контент. `mix-blend-mode: screen` делает их светящимися поверх тёмного фона.
 *
 * При `prefers-reduced-motion` пятна становятся статичными (только начальная
 * позиция, никакой анимации). На мобильных устройствах уменьшается blur для
 * экономии GPU.
 *
 * Компонент рендерится ОДИН раз в App.tsx — fixed под всем контентом.
 */
export function Aurora() {
  const reduced = useReducedMotion();

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{
        // Слой не должен блочить скролл/клики — только подсветка
        contain: 'strict',
      }}
    >
      {/* Cyan orb — большой, в левом верхнем */}
      <div
        className={`absolute rounded-full blur-[120px] ${reduced ? '' : 'aurora-anim-1'}`}
        style={{
          width: '60vw',
          height: '60vw',
          maxWidth: '900px',
          maxHeight: '900px',
          top: '-10%',
          left: '-15%',
          background: 'radial-gradient(circle, rgba(0,245,255,0.35) 0%, transparent 70%)',
          mixBlendMode: 'screen',
          willChange: reduced ? 'auto' : 'transform',
        }}
      />

      {/* Violet orb — справа, средний */}
      <div
        className={`absolute rounded-full blur-[100px] ${reduced ? '' : 'aurora-anim-2'}`}
        style={{
          width: '50vw',
          height: '50vw',
          maxWidth: '700px',
          maxHeight: '700px',
          top: '20%',
          right: '-10%',
          background: 'radial-gradient(circle, rgba(123,97,255,0.30) 0%, transparent 70%)',
          mixBlendMode: 'screen',
          willChange: reduced ? 'auto' : 'transform',
        }}
      />

      {/* Magenta orb — нижний центр, акцентный */}
      <div
        className={`absolute rounded-full blur-[140px] ${reduced ? '' : 'aurora-anim-3'}`}
        style={{
          width: '45vw',
          height: '45vw',
          maxWidth: '650px',
          maxHeight: '650px',
          bottom: '-15%',
          left: '30%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)',
          mixBlendMode: 'screen',
          willChange: reduced ? 'auto' : 'transform',
        }}
      />

      {/* Зернистость поверх — скрывает banding от больших градиентов */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}
