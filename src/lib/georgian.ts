/**
 * Georgian has no "uppercase" in the Latin sense. The design's small labels use Mtavruli,
 * a separate set of capital letters (U+1C90–U+1CBF). CSS `text-transform: uppercase` renders
 * Mtavruli inconsistently across browsers, so we convert the text itself at build time.
 *
 * Editors write labels in normal letters (Mkhedruli); <Caps> calls this function.
 */
const MKHEDRULI_START = 0x10d0; // ა
const MKHEDRULI_END = 0x10ff;
const MTAVRULI_OFFSET = 0x1c90 - 0x10d0;

export function toMtavruli(text: string): string {
  let out = '';
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    // U+10FB (paragraph separator) and U+10FC (modifier) have no Mtavruli form.
    if (code >= MKHEDRULI_START && code <= MKHEDRULI_END && code !== 0x10fb && code !== 0x10fc) {
      out += String.fromCodePoint(code + MTAVRULI_OFFSET);
    } else {
      out += ch.toUpperCase();
    }
  }
  return out;
}

const MONTHS = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];

/** "14 ნოემბერი, 2026" — formatted by hand because Intl Georgian month support varies by runtime. */
export function formatDateKa(date: Date): string {
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}, ${date.getUTCFullYear()}`;
}
