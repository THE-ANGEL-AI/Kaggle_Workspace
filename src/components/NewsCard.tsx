import type { NewsEntry } from '../data/news';

const variantColors: Record<string, string> = {
  a: 'from-cyan to-magenta shadow-[0_0_8px_var(--color-glow-cyan)]',
  b: 'from-magenta to-violet shadow-[0_0_8px_var(--color-glow-magenta)]',
  c: 'from-yellow to-cyan',
};

interface Props { entry: NewsEntry }

export function NewsCard({ entry }: Props) {
  return (
    <article className="relative bg-glass backdrop-blur-md border border-border rounded-[14px] p-5 sm:p-6 pl-8 sm:pl-9 hover:border-cyan/25 hover:shadow-[0_8px_30px_rgba(0,0,0,0.35),0_0_20px_rgba(0,240,255,0.06)] hover:translate-x-0.5 transition-all">
      {/* Rail */}
      <span className={`absolute left-0 top-5 bottom-5 w-[3px] rounded-full bg-gradient-to-b ${variantColors[entry.variant || 'a'] || variantColors.a}`} />

      <div className="flex items-center justify-between font-mono text-xs text-text-muted mb-2">
        <time dateTime={entry.date}>{entry.dateHuman}</time>
        <span className="text-magenta bg-magenta/10 px-2 py-0.5 rounded-full font-bold tracking-wider uppercase text-[0.7rem] border border-magenta/15">
          {entry.tag.toUpperCase()}
        </span>
      </div>
      <h3 className="font-display font-bold text-[1.15rem] text-text-bright mb-1.5">{entry.title}</h3>
      <p className="text-text-dim text-sm">{entry.body}</p>
      {entry.bullets && entry.bullets.length > 0 && (
        <ul className="mt-2 ml-4 text-text-dim text-sm space-y-1 list-disc marker:text-cyan/50">
          {entry.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}
    </article>
  );
}
