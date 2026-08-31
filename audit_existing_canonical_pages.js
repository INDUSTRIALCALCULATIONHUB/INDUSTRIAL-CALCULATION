const fs = require('fs');
const path = require('path');

const root = process.cwd();
const ignored = new Set(['node_modules', '.git', 'outputs']);

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignored.has(entry.name)) return [];
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(target);
    return entry.name.endsWith('.html') ? [target] : [];
  });
}

function clean(value) {
  return value.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizedTitle(value) {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\b(the|and|for|of|in|to|with|a|an|principles?|basics?|applications?)\b/g, ' ').replace(/\s+/g, ' ').trim();
}

const pages = htmlFiles(root).flatMap((file) => {
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('class="knowledge-page"')) return [];
  const heading = /<h1>([\s\S]*?)<\/h1>/.exec(html)?.[1];
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  if (!heading || !canonical) return [];
  return [{ relative: path.relative(root, file).replace(/\\/g, '/'), title: clean(heading), normalized: normalizedTitle(heading), canonical }];
});

const byTitle = new Map();
const byCanonical = new Map();
for (const page of pages) {
  if (!byTitle.has(page.normalized)) byTitle.set(page.normalized, []);
  byTitle.get(page.normalized).push(page);
  if (!byCanonical.has(page.canonical)) byCanonical.set(page.canonical, []);
  byCanonical.get(page.canonical).push(page);
}
const titleDuplicates = [...byTitle.entries()].filter(([, records]) => records.length > 1);
const canonicalDuplicates = [...byCanonical.entries()].filter(([, records]) => records.length > 1);
const report = [
  '# Existing Canonical-Page Audit',
  '',
  `Generated: ${new Date().toISOString().slice(0, 10)}`,
  '',
  `- Final-format knowledge pages scanned: **${pages.length}**`,
  `- Exact normalized-title duplicate groups: **${titleDuplicates.length}**`,
  `- Canonical-URL duplicate groups: **${canonicalDuplicates.length}**`,
  '',
  '## Exact Normalized-Title Duplicate Risks',
  '',
  ...(titleDuplicates.length ? titleDuplicates.flatMap(([title, records]) => [
    `### ${title}`,
    ...records.map((record) => `- ${record.title} — \`${record.relative}\` — ${record.canonical}`),
    '',
  ]) : ['- None.']),
  '',
  '## Canonical-URL Duplicate Risks',
  '',
  ...(canonicalDuplicates.length ? canonicalDuplicates.flatMap(([url, records]) => [
    `### ${url}`,
    ...records.map((record) => `- ${record.title} — \`${record.relative}\``),
    '',
  ]) : ['- None.']),
  '',
];
const out = path.join(root, 'outputs', 'literature-audit');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'EXISTING-CANONICAL-PAGE-AUDIT.md'), report.join('\n'), 'utf8');
console.log(JSON.stringify({ pages: pages.length, titleDuplicateGroups: titleDuplicates.length, canonicalDuplicateGroups: canonicalDuplicates.length }, null, 2));
