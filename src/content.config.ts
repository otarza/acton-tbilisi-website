/**
 * CONTENT MODEL — the single source of truth for what content exists and which fields it has.
 *
 * Every collection lives in src/content/<collection>/<locale>/...  (locale = "ka" for now).
 * If you add or rename a field here, update docs/CONTENT.md in the same change.
 *
 * Shared conventions:
 *  - `placeholder: true`  → the text was invented for the design and must be confirmed by the school.
 *                           `npm run placeholders` lists all of them. Remove the flag once confirmed.
 *  - `photo`              → an id from src/content/photos.yaml (never a raw file path).
 *  - `order`              → lower numbers come first.
 */
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const placeholder = z.boolean().default(false);
const photoId = z.string();

/* ---------- Site-wide settings (contacts, nav, announcement bar, dates) ---------- */
const settings = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/settings' }),
  schema: z.object({
    schoolName: z.string(),
    schoolNameShort: z.string(),
    logoSubtitle: z.string(),
    phone: z.string(),
    phoneHref: z.string(),
    email: z.string(),
    address: z.string(),
    addressPlaceholder: placeholder,
    responseTime: z.string(),
    bookingUrl: z.string(),
    messengerUrl: z.string(),
    whatsappUrl: z.string(),
    facebookUrl: z.string(),
    instagramUrl: z.string(),
    announcement: z
      .object({ enabled: z.boolean(), text: z.string(), linkText: z.string(), href: z.string(), placeholder })
      .optional(),
    nextExhibition: z.object({ date: z.coerce.date(), title: z.string(), placeholder }),
    nav: z.array(z.object({ label: z.string(), href: z.string() })),
    footer: z.object({
      headline: z.string(),
      headlineAccent: z.string(),
      about: z.array(z.string()),
    }),
    seo: z.object({ title: z.string(), description: z.string() }),
  }),
});

/* ---------- Page copy (one YAML file per page; free-form but validated) ---------- */
const sectionHeading = z.object({
  label: z.string(),
  title: z.string(),
  accent: z.string().optional(),
  titleAfter: z.string().optional(),
  placeholder,
});

const homePage = defineCollection({
  loader: glob({ pattern: '**/home.yaml', base: './src/content/pages' }),
  schema: z.object({
    seo: z.object({ title: z.string(), description: z.string() }),
    hero: z.object({
      kicker: z.string(),
      title: z.string(),
      accent: z.string(),
      lead: z.string(),
      cta: z.string(),
      secondaryCta: z.string(),
      photo: photoId,
      placeholder,
    }),
    marquee: z.array(z.string()),
    honest: sectionHeading.extend({
      quote: z.string(),
      quoteAuthor: z.string(),
      values: z.array(z.string()),
    }),
    studios: sectionHeading,
    day: sectionHeading.extend({
      schedule: z.array(z.object({ time: z.string(), title: z.string(), text: z.string() })),
    }),
    progress: sectionHeading.extend({
      sample: z.object({
        name: z.string(),
        meta: z.string(),
        bars: z.array(z.object({ label: z.string(), value: z.string(), percent: z.number(), color: z.enum(['blue', 'teal', 'red']) })),
        goal: z.string(),
      }),
      badges: z.array(z.object({ label: z.string(), color: z.enum(['blue', 'teal', 'red', 'gold']) })),
      exhibitionText: z.string(),
    }),
    fit: sectionHeading.extend({
      forYou: z.array(z.string()),
      notForYou: z.array(z.string()),
      quiz: z.object({
        title: z.string(),
        intro: z.string(),
        audiences: z.array(
          z.object({
            label: z.string(),
            questions: z.array(z.object({ q: z.string(), options: z.array(z.string()).length(3) })),
            verdicts: z.object({ yes: z.string(), maybe: z.string(), no: z.string() }),
          }),
        ),
        verdictLabels: z.object({ yes: z.array(z.string()), maybe: z.array(z.string()), no: z.array(z.string()) }),
      }),
    }),
    videos: sectionHeading.extend({
      note: z.string(),
      items: z.array(
        z.object({ title: z.string(), subtitle: z.string().optional(), duration: z.string(), photo: photoId, youtubeId: z.string().default('') }),
      ),
    }),
    testimonials: sectionHeading,
    trust: sectionHeading.extend({
      cards: z.array(z.object({ kind: z.enum(['accreditation', 'team', 'safety']), title: z.string(), big: z.string().optional(), text: z.string(), href: z.string() })),
    }),
    price: sectionHeading.extend({
      amount: z.string(),
      period: z.string(),
      includes: z.array(z.string()),
      comparison: z.object({
        title: z.string(),
        rows: z.array(z.object({ label: z.string(), value: z.string(), percent: z.number(), ours: z.boolean().default(false) })),
        note: z.string(),
      }),
      extras: z.array(z.object({ label: z.string(), value: z.string() })),
    }),
    join: sectionHeading.extend({
      steps: z.array(z.object({ title: z.string(), text: z.string() })),
      formTitle: z.string(),
      formNote: z.string(),
    }),
    faqPreview: z.object({ label: z.string(), allLink: z.string() }),
  }),
});

const aboutPage = defineCollection({
  loader: glob({ pattern: '**/about.yaml', base: './src/content/pages' }),
  schema: z.object({
    seo: z.object({ title: z.string(), description: z.string() }),
    hero: z.object({ label: z.string(), title: z.string(), accent: z.string(), after: z.string().optional(), lead: z.string(), stats: z.array(z.object({ big: z.string(), text: z.string() })), placeholder }),
    story: sectionHeading.extend({ items: z.array(z.object({ when: z.string(), title: z.string(), text: z.string() })) }),
    team: sectionHeading.extend({
      groups: z.object({ founder: z.object({ label: z.string(), intro: z.string() }), guide: z.object({ label: z.string(), intro: z.string() }), investor: z.object({ label: z.string(), intro: z.string() }) }),
      investors: z.array(z.object({ name: z.string(), isParent: z.boolean().default(false) })),
      bioNote: z.string(),
    }),
    accreditation: sectionHeading.extend({
      cards: z.array(z.object({ status: z.enum(['confirmed', 'pending', 'info']), statusLabel: z.string(), title: z.string(), text: z.string(), link: z.object({ text: z.string(), href: z.string() }).optional() })),
    }),
    safety: sectionHeading.extend({ intro: z.string(), items: z.array(z.object({ icon: z.string(), title: z.string(), text: z.string() })) }),
    privacy: sectionHeading.extend({
      intro: z.string(),
      details: z.array(z.object({ q: z.string(), a: z.string() })),
      consentDemo: z.object({ title: z.string(), intro: z.string(), switches: z.array(z.object({ label: z.string(), hint: z.string(), on: z.boolean() })), noneText: z.string(), someText: z.string() }),
    }),
    cta: z.object({ title: z.string(), accent: z.string(), button: z.string() }),
  }),
});

const faqPage = defineCollection({
  loader: glob({ pattern: '**/faq.yaml', base: './src/content/pages' }),
  schema: z.object({
    seo: z.object({ title: z.string(), description: z.string() }),
    hero: z.object({ label: z.string(), title: z.string(), accent: z.string(), after: z.string().optional(), lead: z.string() }),
    categories: z.record(z.string(), z.string()),
    archive: sectionHeading.extend({ intro: z.string(), topics: z.record(z.string(), z.string()) }),
    cta: z.object({ title: z.string(), accent: z.string(), button: z.string() }),
  }),
});

/* ---------- Repeating content (one Markdown file per item) ---------- */
const studios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/studios' }),
  schema: z.object({
    name: z.string(),
    ageMin: z.number().int(),
    ageMax: z.number().int(),
    photo: photoId,
    color: z.enum(['teal', 'blue', 'red']),
    points: z.array(z.string()),
    order: z.number().default(0),
    placeholder,
  }),
});

export const FAQ_CATEGORIES = ['learning', 'status', 'daily', 'price', 'enrollment'] as const;
const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    category: z.enum(FAQ_CATEGORIES),
    order: z.number().default(100),
    showOnHome: z.boolean().default(false),
    /** Short answer the on-site assistant gives. If missing, the assistant uses the first paragraph. */
    assistantAnswer: z.string().optional(),
    /** Extra words people might type, to help the assistant find this answer. */
    keywords: z.array(z.string()).default([]),
    /** Optional short button label: this question is offered as a quick-pick chip in the assistant. */
    chip: z.string().optional(),
    /** true = the assistant must hand this topic to a human after answering. */
    handoff: z.boolean().default(false),
    placeholder,
  }),
});

export const QUESTION_TOPICS = ['fairness', 'science', 'money', 'people'] as const;
const questions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/questions' }),
  schema: z.object({
    number: z.number().int().positive(),
    week: z.coerce.date(),
    topic: z.enum(QUESTION_TOPICS),
    question: z.string(),
    /** Answer choices shown for voting (only used while this is the current question). */
    options: z.array(z.string()).min(2).max(4).default(['დიახ', 'არა', 'დამოკიდებულია']),
    /** Optional fallback percentages, same order as options, shown when live votes are unavailable. */
    results: z.array(z.number()).optional(),
    conclusion: z.string().optional(),
    studios: z.string().optional(),
    placeholder,
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    group: z.enum(['founder', 'guide']),
    role: z.string(),
    isParent: z.boolean().default(false),
    facts: z.array(z.string()).default([]),
    photo: photoId.optional(),
    order: z.number().default(100),
    placeholder,
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    order: z.number().default(100),
    /** The parent approved this exact wording for the website. */
    approved: z.boolean().default(false),
    placeholder,
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    cover: photoId.optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().optional(),
    draft: z.boolean().default(false),
    placeholder,
  }),
});

/* ---------- Photo register (alt text + consent for every photo) ---------- */
const photos = defineCollection({
  loader: file('./src/content/photos.yaml'),
  schema: z.object({
    id: z.string(),
    file: z.string(),
    alt: z.string(),
    /** signed = written parental consent on file; pending = not yet; none-needed = no identifiable children. */
    consent: z.enum(['signed', 'pending', 'none-needed']),
    source: z.string().optional(),
    note: z.string().optional(),
  }),
});

export const collections = { settings, homePage, aboutPage, faqPage, studios, faq, questions, team, testimonials, posts, photos };
