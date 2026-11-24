/**
 * CLUBS (კლუბები) — helpers shared by /clubs, /clubs/<club> and the homepage section.
 * Content: src/content/clubs/<lang>/<slug>.md. Page copy and club-wide facts: src/content/pages/<lang>/clubs.yaml.
 */
import type { CollectionEntry } from 'astro:content';
import { getLocalized, slugOf } from '@/lib/content';
import { defaultLang, type Lang } from '@/i18n/ui';

export type Club = CollectionEntry<'clubs'>;

/** All clubs, in `order`. */
export async function getClubs(lang: Lang = defaultLang): Promise<Club[]> {
  return (await getLocalized('clubs', lang)).sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name, 'ka'));
}

export const clubSlug = (c: Club) => slugOf(c.id);
export const clubUrl = (c: Club) => `/clubs/${clubSlug(c)}`;

/** CSS custom properties carrying the club's colour pair (content data, not design tokens). */
export const clubVars = (c: Club) => `--club-bg: ${c.data.colors.bg}; --club-fg: ${c.data.colors.fg}`;

/** "Same interest first, then the rest", without the club itself. */
export function relatedClubs(club: Club, all: Club[], n = 4): Club[] {
  const others = all.filter((c) => c.id !== club.id);
  return [...others.filter((c) => c.data.category === club.data.category), ...others.filter((c) => c.data.category !== club.data.category)].slice(0, n);
}

/** Replace {name} tokens in a copy string. */
export const fill = (text: string, vars: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
