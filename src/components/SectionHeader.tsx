import type { ReactNode } from 'react';

interface SectionHeaderProps {
  badge: string;
  title: ReactNode;
  description?: string;
  className?: string;
}

export function SectionHeader({ badge, title, description, className = '' }: SectionHeaderProps) {
  return (
    <div className={`text-center mb-10 ${className}`.trim()}>
      <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-cyan bg-cyan/8 px-3.5 py-1.5 rounded-full mb-5 border border-cyan/20">
        {badge}
      </span>
      <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-display font-extrabold text-text-bright mb-3">
        {title}
      </h2>
      {description && (
        <p className="text-text-muted text-[1.08rem] max-w-[620px] mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
