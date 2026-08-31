const fs = require('fs');
const path = require('path');
const candidates = require('./canonical_page_candidates');

const root = process.cwd();
const ignored = new Set(['node_modules', '.git', 'outputs']);
const stopWords = new Set(['the', 'and', 'for', 'of', 'in', 'to', 'with', 'a', 'an', 'principle', 'principles', 'basic', 'basics', 'application', 'applications', 'industrial', 'engineering', 'process', 'system', 'systems', 'working', 'selection', 'operation', 'operations']);

function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignored.has(entry.name)) return [];
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return files(target);
    return entry.name.endsWith('.html') ? [target] : [];
  });
}
function text(value) { return value.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim(); }
function tokens(value) { return new Set(text(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ').filter((word) => word && !stopWords.has(word))); }
function similarity(left, right) {
  const a = tokens(left); const b = tokens(right);
  const intersection = [...a].filter((token) => b.has(token)).length;
  return intersection / Math.max(1, a.size + b.size - intersection);
}

const existing = files(root).flatMap((file) => {
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('class="knowledge-page"')) return [];
  const title = /<h1>([\s\S]*?)<\/h1>/.exec(html)?.[1];
  return title ? [{ title: text(title), route: path.relative(root, file).replace(/\\/g, '/') }] : [];
});

const audit = candidates.map((candidate) => {
  const targetFile = path.join(root, candidate.route, 'index.html');
  const near = existing.map((page) => ({ ...page, score: similarity(candidate.title, page.title) })).sort((a, b) => b.score - a.score).slice(0, 3);
  const exact = near.find((page) => page.score === 1);
  const status = fs.existsSync(targetFile) || exact ? 'Reject — existing canonical page' : near[0].score >= 0.65 ? 'Review — close topical match' : 'Approved unique canonical topic';
  return { ...candidate, targetFile: path.relative(root, targetFile).replace(/\\/g, '/'), status, near };
});

const rejected = audit.filter((entry) => entry.status.startsWith('Reject'));
const close = audit.filter((entry) => entry.status.startsWith('Review'));
const approved = audit.filter((entry) => entry.status.startsWith('Approved'));
const report = [
  '# Canonical-Page Audit for 53 Proposed Additions',
  '',
  `Generated: ${new Date().toISOString().slice(0, 10)}`,
  '',
  `- Existing final-format knowledge pages compared: **${existing.length}**`,
  `- Proposed new canonical pages: **${candidates.length}**`,
  `- Approved unique canonical topics: **${approved.length}**`,
  `- Close topical matches needing a decision: **${close.length}**`,
  `- Exact existing-page conflicts: **${rejected.length}**`,
  '',
  'A page is approved only when its target route does not already exist, no existing page has the same normalized title, and its highest title-token similarity is below 0.65. This is a duplicate-risk screen, not a substitute for editorial judgement.',
  '',
  '## Proposed Canonical Register',
  '',
  '| ID | Domain | Canonical page | Proposed route | Best existing-topic match | Score | Outcome |',
  '| --- | --- | --- | --- | --- | ---: | --- |',
  ...audit.map((entry) => `| ${entry.id} | ${entry.domain} | ${entry.title} | \`${entry.targetFile}\` | ${entry.near[0].title} | ${(entry.near[0].score * 100).toFixed(0)}% | ${entry.status} |`),
  '',
  '## Rejected or Review Candidates',
  '',
  ...(rejected.length || close.length ? [...rejected, ...close].flatMap((entry) => [
    `### ${entry.id} — ${entry.title}`,
    `- Outcome: ${entry.status}`,
    ...entry.near.map((page) => `- Existing comparison: ${page.title} — \`${page.route}\` — ${(page.score * 100).toFixed(0)}% title-token overlap`),
    '',
  ]) : ['- None.']),
  '',
];
const output = path.join(root, 'outputs', 'literature-audit');
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'CANONICAL-PAGE-AUDIT-53.md'), report.join('\n'), 'utf8');
console.log(JSON.stringify({ existing: existing.length, proposed: candidates.length, approved: approved.length, review: close.length, rejected: rejected.length }, null, 2));
