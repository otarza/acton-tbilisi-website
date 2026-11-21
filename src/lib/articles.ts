/**
 * ARTICLES (სტატიები) — helpers shared by /articles, /articles/<slug>, /articles/authors/<author> and the homepage.
 * Content: src/content/articles/<lang>/<slug>.md. Authors are team members (src/content/team/<lang>/<author>.md).
 */
import { getEntry, type CollectionEntry } from 'astro:content';
import { getLocalized, slugOf, getPage } from '@/lib/content';
import { defaultLang, type Lang } from '@/i18n/ui';
import { ARTICLE_TOPICS } from '@/content.config';

export type Topic = (typeof ARTICLE_TOPICS)[number];
export type Article = CollectionEntry<'articles'>;
export type Author = CollectionEntry<'team'>;

/** Avatar colours, picked by the author's position in the team list so they stay stable. */
const AVATAR_COLORS = ['var(--av-1)', 'var(--av-2)', 'var(--av-3)', 'var(--av-4)'];

/** Published articles (drafts too while running `npm run dev`), newest first. */
export async function getArticles(lang: Lang = defaultLang): Promise<Article[]> {
  const all = await getLocalized('articles', lang);
  return all
    .filter((a) => import.meta.env.DEV || !a.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const articleUrl = (a: Article) => `/articles/${slugOf(a.id)}`;
export const authorUrl = (authorSlug: string) => `/articles/authors/${authorSlug}`;

/** Minutes to read: `readMinutes` if set, else words in the text ÷ 130 (Georgian words are long). */
export function readMinutes(a: Article): number {
  if (a.data.readMinutes) return a.data.readMinutes;
  const words = (a.body ?? '').replace(/[#>*_`\-\[\]()!]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 130));
}

export async function getAuthor(slug: string, lang: Lang = defaultLang): Promise<Author> {
  const entry = await getEntry('team', `${lang}/${slug}`);
  if (!entry) throw new Error(`Article author "${slug}" is not a file in src/content/team/${lang}/ (use the file name without .md)`);
  return entry;
}

export async function authorColor(slug: string, lang: Lang = defaultLang): Promise<string> {
  const team = (await getLocalized('team', lang)).sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
  const i = Math.max(0, team.findIndex((m) => slugOf(m.id) === slug));
  return AVATAR_COLORS[i % AVATAR_COLORS.length];
}

/** Topic label + tag class, from src/content/pages/<lang>/articles.yaml. */
export async function getTopics(lang: Lang = defaultLang) {
  const page = await getPage('articlesPage', lang);
  return ARTICLE_TOPICS.map((key) => ({ key, label: page.topics[key].label, tag: `tag--${page.topics[key].color}` }));
}

/** Everything a card needs, resolved once. */
export async function cardData(a: Article, lang: Lang = defaultLang) {
  const author = await getAuthor(a.data.author, lang);
  const topics = await getTopics(lang);
  return {
    id: a.id,
    url: articleUrl(a),
    title: a.data.title,
    description: a.data.description,
    date: a.data.date,
    cover: a.data.cover,
    minutes: readMinutes(a),
    topics: a.data.topics.map((k) => topics.find((t) => t.key === k)!),
    authorSlug: a.data.author,
    authorName: author.data.name,
    authorColor: await authorColor(a.data.author, lang),
    authorPhoto: author.data.photo,
    placeholder: a.data.placeholder,
    draft: a.data.draft,
  };
}
export type CardData = Awaited<ReturnType<typeof cardData>>;

/** Up to `n` related articles: same topic first, then same author, then the newest. */
export function related(current: Article, all: Article[], n = 3): Article[] {
  const others = all.filter((a) => a.id !== current.id);
  const score = (a: Article) =>
    (a.data.topics.some((t) => current.data.topics.includes(t)) ? 2 : 0) + (a.data.author === current.data.author ? 1 : 0);
  return others
    .map((a, i) => ({ a, s: score(a), i }))
    .sort((x, y) => y.s - x.s || x.i - y.i)
    .slice(0, n)
    .map((x) => x.a);
}

/** Wrap `accent` (a part of `title`) so it can get the highlight bar. */
export function splitTitle(title: string, accent?: string): [string, string, string] {
  if (!accent || !title.includes(accent)) return [title, '', ''];
  const i = title.indexOf(accent);
  return [title.slice(0, i), accent, title.slice(i + accent.length)];
}
