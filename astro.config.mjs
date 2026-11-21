// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The public address of the site. Change it here once the real domain is live.
const SITE = process.env.SITE_URL || 'https://acton-tbilisi-website.pages.dev';

export default defineConfig({
  site: SITE,
  output: 'static', // plain HTML files; the only server code lives in /functions (Cloudflare Pages Functions)
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !page.includes('/design-system') })],
  i18n: {
    // Georgian only for now. To add English: add 'en' here, create src/content/**/en/ folders
    // and src/i18n/en.ts, then add pages under src/pages/en/. See docs/I18N.md.
    locales: ['ka'],
    defaultLocale: 'ka',
    routing: { prefixDefaultLocale: false },
  },
  image: {
    layout: 'constrained',
  },
});
