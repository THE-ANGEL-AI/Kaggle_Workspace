import { motion } from 'framer-motion';
import { useGitHubData } from '../hooks/useGitHubData';
import {
  Star,
  GitFork,
  Eye,
  AlertCircle,
  GitCommit,
  Users,
  Tag,
  RefreshCw,
  ExternalLink,
  Clock,
} from 'lucide-react';

/* ── Stat card ── */
function StatCard({
  icon,
  label,
  value,
  color,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  loading: boolean;
}) {
  return (
    <div
      className="glass rounded-xl border backdrop-blur-xl p-4 transition-all"
      style={{ borderColor: `${color}15` }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `${color}12` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        <div className="min-w-0">
          <div className="font-mono text-lg font-extrabold" style={{ color }}>
            {loading ? (
              <span className="animate-pulse text-text-muted">—</span>
            ) : (
              typeof value === 'number' ? value.toLocaleString() : value
            )}
          </div>
          <div className="text-[0.55rem] font-mono text-text-muted tracking-wider">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Commit row ── */
function CommitRow({
  commit,
  index,
}: {
  commit: { sha: string; message: string; author: string; date: string; url: string };
  index: number;
}) {
  const date = new Date(commit.date);
  const timeAgo = getTimeAgo(date);

  return (
    <motion.a
      href={commit.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors"
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
    >
      <span className="font-mono text-[0.55rem] font-bold text-cyan bg-cyan/10 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
        {commit.sha}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-text-dim text-xs leading-relaxed truncate group-hover:text-text-bright transition-colors">
          {commit.message}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="font-mono text-[0.5rem] text-text-muted">{commit.author}</span>
          <span className="font-mono text-[0.5rem] text-text-muted">{timeAgo}</span>
        </div>
      </div>
      <ExternalLink size={10} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
    </motion.a>
  );
}

/* ── Contributor avatar ── */
function ContributorAvatar({
  contributor,
  index,
}: {
  contributor: { login: string; avatar: string; contributions: number; url: string };
  index: number;
}) {
  return (
    <motion.a
      href={contributor.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
    >
      <img
        src={contributor.avatar}
        alt={contributor.login}
        className="w-10 h-10 rounded-full border-2 border-border group-hover:border-cyan transition-colors"
        loading="lazy"
      />
      <span
        className="absolute -bottom-1 -right-1 font-mono text-[0.45rem] font-bold bg-bg-deep border border-border rounded-full px-1 py-0.5 text-cyan"
        style={{ lineHeight: '1' }}
      >
        {contributor.contributions}
      </span>
    </motion.a>
  );
}

/* ── Time ago helper ── */
function getTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

/* ── Main component ── */
export function GitHubIntegration() {
  const { repo, commits, contributors, release, loading, error, lastUpdated, refresh } =
    useGitHubData(180_000); // Refresh every 3 min

  return (
    <section id="github" className="relative max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-cyan bg-cyan/8 px-3.5 py-1.5 rounded-full mb-5 border border-cyan/20">
          GitHub Live
        </span>
        <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-display font-extrabold text-text-bright mb-3">
          Живая статистика репозитория
        </h2>
        <p className="text-text-muted text-[1.08rem] max-w-[620px] mx-auto leading-relaxed">
          Данные с GitHub API. Обновляются каждые 3 минуты.
        </p>
      </div>

      {/* Error banner */}
      {error && !loading && (
        <div className="max-w-[620px] mx-auto mb-6 flex items-center gap-2 bg-magenta/10 border border-magenta/20 rounded-lg px-4 py-2.5">
          <AlertCircle size={14} className="text-magenta shrink-0" />
          <span className="text-text-dim text-xs">{error}</span>
          <button
            onClick={refresh}
            className="ml-auto font-mono text-[0.55rem] font-bold text-cyan hover:text-text-bright transition-colors shrink-0"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left column: stats + commits */}
        <div className="space-y-4">
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              icon={<Star size={16} />}
              label="Stars"
              value={repo?.stars ?? 0}
              color="#FCEE0A"
              loading={loading}
            />
            <StatCard
              icon={<GitFork size={16} />}
              label="Forks"
              value={repo?.forks ?? 0}
              color="#7B61FF"
              loading={loading}
            />
            <StatCard
              icon={<Eye size={16} />}
              label="Watchers"
              value={repo?.watchers ?? 0}
              color="#00F5FF"
              loading={loading}
            />
            <StatCard
              icon={<AlertCircle size={16} />}
              label="Issues"
              value={repo?.openIssues ?? 0}
              color="#FF007A"
              loading={loading}
            />
          </div>

          {/* Recent commits */}
          <div className="glass rounded-2xl border border-border backdrop-blur-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <GitCommit size={14} className="text-cyan" />
                <span className="font-display font-bold text-sm text-text-bright">
                  Recent Commits
                </span>
              </div>
              {lastUpdated && (
                <span className="font-mono text-[0.5rem] text-text-muted">
                  <Clock size={10} className="inline mr-1" />
                  {getTimeAgo(lastUpdated)}
                </span>
              )}
            </div>
            <div className="divide-y divide-border/50">
              {loading ? (
                <div className="p-6 text-center">
                  <div className="w-5 h-5 border-2 border-cyan/30 border-t-cyan rounded-full animate-spin mx-auto" />
                </div>
              ) : commits.length > 0 ? (
                commits.map((c, i) => <CommitRow key={c.sha} commit={c} index={i} />)
              ) : (
                <div className="p-4 text-center text-text-muted text-xs">Нет данных</div>
              )}
            </div>
          </div>

          {/* Repo description */}
          {repo?.description && (
            <p className="text-text-muted text-xs leading-relaxed text-center max-w-[580px] mx-auto">
              {repo.description}
              {repo.topics.length > 0 && (
                <span className="block mt-1.5 flex flex-wrap gap-1.5 justify-center">
                  {repo.topics.slice(0, 5).map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[0.5rem] font-bold px-1.5 py-0.5 rounded-full border border-cyan/15 text-cyan/60"
                    >
                      {t}
                    </span>
                  ))}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Right column: contributors + release */}
        <div className="space-y-4">
          {/* Contributors */}
          <div className="glass rounded-2xl border border-border backdrop-blur-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <Users size={14} className="text-purple" />
              <span className="font-display font-bold text-sm text-text-bright">Contributors</span>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2.5">
                {loading ? (
                  <div className="w-full py-4 text-center">
                    <div className="w-5 h-5 border-2 border-purple/30 border-t-purple rounded-full animate-spin mx-auto" />
                  </div>
                ) : contributors.length > 0 ? (
                  contributors.map((c, i) => (
                    <ContributorAvatar key={c.login} contributor={c} index={i} />
                  ))
                ) : (
                  <div className="w-full py-4 text-center text-text-muted text-xs">
                    Нет данных
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Latest release */}
          <div className="glass rounded-2xl border border-border backdrop-blur-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <Tag size={14} className="text-green" />
              <span className="font-display font-bold text-sm text-text-bright">Latest Release</span>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="py-4 text-center">
                  <div className="w-5 h-5 border-2 border-green/30 border-t-green rounded-full animate-spin mx-auto" />
                </div>
              ) : release ? (
                <a
                  href={release.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="font-mono text-xs font-bold text-cyan">{release.tag}</div>
                  <div className="font-display font-bold text-sm text-text-bright mt-0.5 group-hover:text-cyan transition-colors">
                    {release.name}
                  </div>
                  <div className="font-mono text-[0.55rem] text-text-muted mt-1">
                    {new Date(release.publishedAt).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  {release.body && (
                    <p className="text-text-muted text-xs leading-relaxed mt-2 line-clamp-3">
                      {release.body}
                    </p>
                  )}
                </a>
              ) : (
                <div className="text-text-muted text-xs">Нет релизов</div>
              )}
            </div>
          </div>

          {/* Refresh button */}
          <button
            onClick={refresh}
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 font-mono text-[0.6rem] font-bold tracking-wider text-text-dim bg-glass border border-border px-4 py-2.5 rounded-xl hover:text-cyan hover:border-cyan/30 transition-all disabled:opacity-40"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Загрузка...' : 'Обновить'}
          </button>
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-6 text-center">
        <a
          href="https://github.com/THE-ANGEL-AI/Kaggle_Workspace_FreeGPU"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] font-bold text-text-muted hover:text-cyan transition-colors"
        >
          <ExternalLink size={11} />
          Открыть на GitHub
        </a>
      </div>
    </section>
  );
}
