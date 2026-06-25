import { useState, useEffect, useCallback } from 'react';

const OWNER = 'THE-ANGEL-AI';
const REPO = 'Kaggle_Workspace_FreeGPU';
const BASE = 'https://api.github.com';
const CACHE_TTL = 120_000; // 2 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/* ── Types ── */
export interface RepoData {
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  description: string;
  language: string;
  updatedAt: string;
  topics: string[];
}

export interface CommitData {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

export interface ContributorData {
  login: string;
  avatar: string;
  contributions: number;
  url: string;
}

export interface ReleaseData {
  tag: string;
  name: string;
  publishedAt: string;
  url: string;
  body: string;
}

export interface GitHubState {
  repo: RepoData | null;
  commits: CommitData[];
  contributors: ContributorData[];
  release: ReleaseData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

/* ── Fetch helper ── */
async function fetchJson<T>(url: string, cacheKey: string): Promise<T> {
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  });

  if (!res.ok) {
    // Rate limit fallback
    if (res.status === 403 || res.status === 429) {
      throw new Error('GitHub API rate limit exceeded. Try again later.');
    }
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const data = (await res.json()) as T;
  setCache(cacheKey, data);
  return data;
}

/* ── Hook ── */
export function useGitHubData(intervalMs = 120_000): GitHubState & { refresh: () => void } {
  const [state, setState] = useState<GitHubState>({
    repo: null,
    commits: [],
    contributors: [],
    release: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const [repoData, commitsData, contributorsData, releaseData] = await Promise.all([
        fetchJson<{
          stargazers_count: number;
          forks_count: number;
          open_issues_count: number;
          subscribers_count: number;
          description: string;
          language: string;
          updated_at: string;
          topics: string[];
        }>(`${BASE}/repos/${OWNER}/${REPO}`, `repo-${REPO}`),

        fetchJson<
          {
            sha: string;
            commit: {
              message: string;
              author: { name: string; date: string };
            };
            html_url: string;
          }[]
        >(`${BASE}/repos/${OWNER}/${REPO}/commits?per_page=5`, `commits-${REPO}`),

        fetchJson<
          {
            login: string;
            avatar_url: string;
            contributions: number;
            html_url: string;
          }[]
        >(`${BASE}/repos/${OWNER}/${REPO}/contributors?per_page=6`, `contributors-${REPO}`),

        fetchJson<{
          tag_name: string;
          name: string;
          published_at: string;
          html_url: string;
          body: string;
        } | ''>(`${BASE}/repos/${OWNER}/${REPO}/releases/latest`, `release-${REPO}`).catch(() => null as unknown as never),
      ]);

      setState({
        repo: {
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          openIssues: repoData.open_issues_count,
          watchers: repoData.subscribers_count,
          description: repoData.description,
          language: repoData.language,
          updatedAt: repoData.updated_at,
          topics: repoData.topics,
        },
        commits: commitsData.map((c) => ({
          sha: c.sha.slice(0, 7),
          message: c.commit.message.split('\n')[0] ?? '',
          author: c.commit.author.name,
          date: c.commit.author.date,
          url: c.html_url,
        })),
        contributors: contributorsData.map((c) => ({
          login: c.login,
          avatar: c.avatar_url,
          contributions: c.contributions,
          url: c.html_url,
        })),
        release: releaseData
          ? {
              tag: (releaseData as { tag_name: string }).tag_name,
              name: (releaseData as { name: string }).name,
              publishedAt: (releaseData as { published_at: string }).published_at,
              url: (releaseData as { html_url: string }).html_url,
              body: (releaseData as { body: string }).body,
            }
          : null,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch GitHub data',
        lastUpdated: prev.lastUpdated,
      }));
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, intervalMs);
    return () => clearInterval(interval);
  }, [fetchData, intervalMs]);

  return { ...state, refresh: fetchData };
}
