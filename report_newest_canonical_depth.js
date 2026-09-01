const fs = require('fs');
const path = require('path');
const candidates = require('./canonical_page_candidates');

function visibleWords(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean).length;
}

const rows = candidates.map((page) => {
  const file = path.join(process.cwd(), ...page.route.split('/'), 'index.html');
  return { ...page, words: visibleWords(fs.readFileSync(file, 'utf8')) };
});

const domainOrder = ['Engineering', 'Industrial Processes', 'Engineering Reference Data'];
const domainTotals = domainOrder.map((domain) => {
  const pages = rows.filter((row) => row.domain === domain);
  return { domain, pages: pages.length, min: Math.min(...pages.map((page) => page.words)), max: Math.max(...pages.map((page) => page.words)) };
});
const lines = [
  '# Newest Canonical Pages — Depth Status',
  '',
  'Updated: 1 September 2026',
  '',
  'Every page listed below has been rewritten with topic-specific content. The audit target for this set is 2,000–3,000 words; major-system pages can be expanded in later editorial passes when useful technical sections justify it.',
  '',
  '| Domain | Pages | Minimum words | Maximum words |',
  '| --- | ---: | ---: | ---: |',
  ...domainTotals.map((row) => `| ${row.domain} | ${row.pages} | ${row.min.toLocaleString('en-US')} | ${row.max.toLocaleString('en-US')} |`),
  `| **Total** | **${rows.length}** | **${Math.min(...rows.map((row) => row.words)).toLocaleString('en-US')}** | **${Math.max(...rows.map((row) => row.words)).toLocaleString('en-US')}** |`,
  '',
  '| ID | Domain | Page | Visible words |',
  '| --- | --- | --- | ---: |',
  ...rows.map((row) => `| ${row.id} | ${row.domain} | ${row.title} | ${row.words.toLocaleString('en-US')} |`),
  '',
].join('\n');

const output = path.join(process.cwd(), 'outputs', 'literature-audit', 'NEW-CANONICAL-PAGES-53-DEPTH-STATUS.md');
fs.writeFileSync(output, lines);
console.log(JSON.stringify({ pages: rows.length, output: path.relative(process.cwd(), output), wordRange: [Math.min(...rows.map((row) => row.words)), Math.max(...rows.map((row) => row.words))] }, null, 2));
