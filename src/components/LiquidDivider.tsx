/**
 * LiquidDivider — SVG-волна как мягкий переход между секциями.
 *
 * Вместо жёсткой горизонтальной границы рисуем SVG с двумя path-кривыми
 * (верхняя и нижняя поверхности «волны»), которые через CSS keyframes
 * бесконечно смещаются → эффект текущей жидкости.
 *
 * Props:
 *  - `flip` — отразить вертикально (для чередования секций)
 *  - `accent` — цвет верхней заливки (cyan/violet/purple/green)
 *
 * Не использует JS-анимацию — только CSS, GPU-friendly (transform only).
 * При `prefers-reduced-motion` анимация отключается глобальным CSS-правилом.
 */
type Accent = 'cyan' | 'violet' | 'purple' | 'green';

const accentFill: Record<Accent, { top: string; bottom: string }> = {
  cyan:   { top: 'rgba(0, 245, 255, 0.10)', bottom: 'rgba(0, 245, 255, 0.04)' },
  violet: { top: 'rgba(123, 97, 255, 0.10)', bottom: 'rgba(123, 97, 255, 0.04)' },
  purple: { top: 'rgba(168, 85, 247, 0.10)', bottom: 'rgba(168, 85, 247, 0.04)' },
  green:  { top: 'rgba(0, 255, 179, 0.10)', bottom: 'rgba(0, 255, 179, 0.04)' },
};

export function LiquidDivider({
  flip = false,
  accent = 'cyan',
}: {
  flip?: boolean;
  accent?: Accent;
}) {
  const fills = accentFill[accent];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ transform: flip ? 'rotate(180deg)' : undefined }}
      aria-hidden="true"
    >
      <svg
        className="liquid-divider"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`liquid-${accent}-top`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={fills.top} stopOpacity="0" />
            <stop offset="50%" stopColor={fills.top} stopOpacity="1" />
            <stop offset="100%" stopColor={fills.bottom} stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Верхняя волна — основная заливка */}
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill={`url(#liquid-${accent}-top)`}
        >
          <animate
            attributeName="d"
            dur="12s"
            repeatCount="indefinite"
            values="
              M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z;
              M0,30 C240,60 480,10 720,30 C960,60 1200,10 1440,30 L1440,80 L0,80 Z;
              M0,50 C240,20 480,60 720,50 C960,20 1200,60 1440,50 L1440,80 L0,80 Z;
              M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z
            "
          />
        </path>

        {/* Нижняя тонкая линия — блик */}
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40"
          fill="none"
          stroke={fills.top}
          strokeWidth="1.5"
          opacity="0.5"
        >
          <animate
            attributeName="d"
            dur="9s"
            repeatCount="indefinite"
            values="
              M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40;
              M0,30 C240,60 480,10 720,30 C960,60 1200,10 1440,30;
              M0,50 C240,20 480,60 720,50 C960,20 1200,60 1440,50;
              M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40
            "
          />
        </path>
      </svg>
    </div>
  );
}
