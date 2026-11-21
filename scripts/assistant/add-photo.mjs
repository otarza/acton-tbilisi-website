#!/usr/bin/env node
/**
 * Add a photo safely: rotates it, shrinks it to max 2000px, saves as JPG WITHOUT location/camera data (EXIF),
 * copies it into src/assets/photos/ and registers it in src/content/photos.yaml.
 *
 *   node scripts/assistant/add-photo.mjs <source-file> <id> "<Georgian alt text>" <signed|pending|none-needed> ["source note"]
 *
 * id: latin lowercase with dashes (e.g. saturday-market-2026). Source can be anywhere (Desktop, Downloads, _new-photos/).
 */
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, appendFileSync, mkdtempSync } from 'node:fs';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = new URL('../..', import.meta.url).pathname;
const [src, id, alt, consent, source = 'school, ' + new Date().getFullYear()] = process.argv.slice(2);
const fail = (m) => { console.error(`✖ ${m}`); process.exit(1); };

if (!src || !id || !alt || !consent) fail('Usage: add-photo.mjs <file> <id> "<alt>" <signed|pending|none-needed> ["source"]');
if (!existsSync(src)) fail(`File not found: ${src}`);
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) fail('id must be latin lowercase with dashes, e.g. saturday-market-2026');
if (!['signed', 'pending', 'none-needed'].includes(consent)) fail('consent must be signed, pending or none-needed');
const register = readFileSync(join(ROOT, 'src/content/photos.yaml'), 'utf8');
if (new RegExp(`^- id: ${id}$`, 'm').test(register)) fail(`A photo with id "${id}" already exists. Pick another id.`);
const out = join(ROOT, 'src/assets/photos', `${id}.jpg`);
if (existsSync(out)) fail(`File already exists: ${out}`);

let input = src;
if (/^\.(heic|heif)$/i.test(extname(src))) {
  // iPhone photos: convert with macOS's built-in sips first.
  const tmp = join(mkdtempSync(join(tmpdir(), 'acton-')), 'photo.jpg');
  execFileSync('sips', ['-s', 'format', 'jpeg', src, '--out', tmp], { stdio: 'ignore' });
  input = tmp;
}
const info = await sharp(input).rotate().resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
  .jpeg({ quality: 82, mozjpeg: true }).toFile(out); // sharp drops EXIF/GPS unless asked to keep it
const y = (s) => JSON.stringify(s);
appendFileSync(join(ROOT, 'src/content/photos.yaml'),
  `${register.endsWith('\n') ? '' : '\n'}- id: ${id}\n  file: ${id}.jpg\n  alt: ${y(alt)}\n  consent: ${consent}\n  source: ${y(source)}\n`);
console.log(`Added photo "${id}" (${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB, location data removed).`);
if (consent === 'pending') console.log('⚠ consent: pending → it must not go live until consent is confirmed.');
