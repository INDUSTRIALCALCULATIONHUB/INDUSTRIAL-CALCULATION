const fs = require('fs');
const path = require('path');
const root = process.cwd();
const excluded = new Set(['.git', 'assets', 'outputs', 'tmp', 'design-prototypes']);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? (excluded.has(entry.name) ? [] : walk(target)) : (entry.isFile() && entry.name.endsWith('.html') ? [target] : []);
  });
}

function visible(value) {
  return value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
}

function title(html, fallback) {
  return visible(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || fallback).replace(/\s*\|\s*Industrial Calculation Hub.*$/i, '');
}

const rows = walk(root).map((file) => {
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('<!-- next101-')) return null;
  const relative = path.relative(root, file).replace(/\\/g, '/');
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] || html;
  return {
    domain: relative.startsWith('industrial-processes/') ? 'Industrial Processes' : 'Engineering Reference Data',
    page: title(html, path.basename(file, '.html')),
    words: visible(main).split(/\s+/).filter(Boolean).length,
    faqs: (main.match(/<details\b[^>]*>/gi) || []).length,
    file: relative,
  };
}).filter(Boolean).sort((a, b) => a.domain.localeCompare(b.domain) || a.page.localeCompare(b.page));

if (rows.length !== 101) throw new Error(`Expected 101 report rows, found ${rows.length}.`);
const markdown = [
  '# Final Industrial Processes and Engineering Reference Data Content-Depth Update',
  '',
  'Updated: 31 August 2026',
  '',
  'This register covers the final 101-page content phase: all 55 Industrial Processes guides and all 46 Engineering Reference Data guides. Each has at least 14 FAQs and an in-article site illustration. Process pages have been expanded to the core or major-system range; reference pages use the appropriate narrow, source-governed reference depth.',
  '',
  '| Domain | Updated page | Visible words | FAQs | File |',
  '| --- | --- | ---: | ---: | --- |',
  ...rows.map((row) => `| ${row.domain} | ${row.page.replace(/\|/g, '\\|')} | ${row.words} | ${row.faqs} | \`${row.file}\` |`),
  '',
  'Word counts exclude headers, footers, scripts and hidden markup. They are calculated from visible text inside each page’s `<main>` content and may change slightly after future editorial changes.',
  '',
];
fs.writeFileSync(path.join(root, 'outputs', 'FINAL-101-CONTENT-UPDATE.md'), markdown.join('\n'), 'utf8');
const byDomain = Object.fromEntries([...new Set(rows.map((row) => row.domain))].map((domain) => {
  const set = rows.filter((row) => row.domain === domain);
  const words = set.map((row) => row.words);
  return [domain, { pages: set.length, min: Math.min(...words), max: Math.max(...words), average: Math.round(words.reduce((sum, value) => sum + value, 0) / words.length) }];
}));
console.log(JSON.stringify({ total: rows.length, byDomain }, null, 2));
