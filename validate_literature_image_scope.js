const fs = require('fs');
const path = require('path');

const root = process.cwd();
const targetDirectories = [
  'engineering/air-pollution-control-and-environmental-engineering',
  'industrial-processes/air-pollution-control-processes',
  'industrial-processes/cement-manufacturing-process',
  'engineering/fluid-mechanics-piping-pumps-fans-ducts',
  'engineering/mechanical-engineering-and-fabrication',
  'engineering/materials-of-construction',
  'industrial-equipment/pumps-fans-blowers-and-compressors',
  'industrial-processes/power-generation-processes',
  'industrial-equipment/boilers-steam-and-combustion-equipment',
  'industrial-equipment/conveying-systems',
  'industrial-equipment/heat-exchangers-cooling-systems-and-vessels',
];
const rootPages = ['electrostatic-precipitator.html', 'bag-filter.html'];

function knowledgeFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return knowledgeFiles(target);
    if (entry.name !== 'index.html') return [];
    const html = fs.readFileSync(target, 'utf8');
    return html.includes('class="knowledge-page"') ? [target] : [];
  });
}

function words(html) {
  return html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ')
    .trim().split(/\s+/).filter(Boolean).length;
}

const files = [
  ...rootPages.map((relative) => path.join(root, relative)),
  ...targetDirectories.flatMap((relative) => knowledgeFiles(path.join(root, relative))),
].sort();
const issues = [];
const rows = [];

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file).replace(/\\/g, '/');
  const hero = /<figure class="knowledge-page__hero-art"><img\s+src="([^"]+)" alt="([^"]+)"/.exec(html);
  const imageSources = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((match) => match[1]);
  const genericIllustration = imageSources.some((src) => /assets\/illustrations\/l2-/i.test(src));
  const brokenImages = imageSources.filter((src) => {
    if (/^(?:https?:|data:|#)/i.test(src)) return false;
    return !fs.existsSync(path.resolve(path.dirname(file), src.split('?')[0]));
  });
  const depthMarker = html.includes('literature-depth-116') || html.includes('literature-informed-review') || html.includes('canonical-depth-53');
  if (!hero) issues.push(`${relative}: missing hero image`);
  if (genericIllustration) issues.push(`${relative}: generic l2 illustration remains`);
  if (brokenImages.length) issues.push(`${relative}: missing image file(s): ${brokenImages.join(', ')}`);
  if (!depthMarker) issues.push(`${relative}: literature-depth marker missing`);
  rows.push({ relative, wordCount: words(html), hero: hero ? hero[1] : '—', status: (!genericIllustration && !brokenImages.length && hero && depthMarker) ? 'Pass' : 'Review' });
}

const report = [
  '# Literature and Visual Validation',
  '',
  `Generated: ${new Date().toISOString().slice(0, 10)}`,
  '',
  `- Final knowledge pages checked: **${files.length}** (the 116-page programme, two primary directly linked canonical articles, and any newly created canonical pages located inside the same literature subject families)`,
  `- Pages passing image, depth-marker and hero checks: **${rows.filter((row) => row.status === 'Pass').length}**`,
  `- Generic Level-2 illustration references remaining: **${issues.filter((issue) => issue.includes('generic')).length}**`,
  `- Broken local image references: **${issues.filter((issue) => issue.includes('missing image file')).length}**`,
  `- Lowest current page word count: **${Math.min(...rows.map((row) => row.wordCount)).toLocaleString('en-IN')}**`,
  '',
  '## Page Register',
  '',
  '| Page | Words | Hero image | Result |',
  '| --- | ---: | --- | --- |',
  ...rows.map((row) => `| ${row.relative} | ${row.wordCount.toLocaleString('en-IN')} | ${row.hero} | ${row.status} |`),
  '',
  '## Exceptions',
  '',
  ...(issues.length ? issues.map((issue) => `- ${issue}`) : ['- None.']),
  '',
];

const reportDirectory = path.join(root, 'outputs', 'literature-audit');
fs.mkdirSync(reportDirectory, { recursive: true });
fs.writeFileSync(path.join(reportDirectory, 'LITERATURE-IMAGE-VALIDATION-116.md'), report.join('\n'), 'utf8');
console.log(JSON.stringify({ checked: files.length, pass: rows.filter((row) => row.status === 'Pass').length, issues }, null, 2));
