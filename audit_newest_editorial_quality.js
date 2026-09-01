const fs = require('fs');
const path = require('path');

const root = process.cwd();
const ignored = new Set(['.git', 'node_modules', 'outputs']);

function walk(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target, files);
    else if (entry.isFile() && target.endsWith('.html')) files.push(target);
  }
  return files;
}

function textFrom(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function shingles(text, width = 7) {
  const words = text.split(' ');
  const set = new Set();
  for (let index = 0; index <= words.length - width; index += 1) {
    set.add(words.slice(index, index + width).join(' '));
  }
  return set;
}

const pages = walk(root)
  .map((file) => ({ file, html: fs.readFileSync(file, 'utf8') }))
  .filter(({ html }) => html.includes('ICH-CAN-'))
  .map(({ file, html }) => ({
    file: path.relative(root, file).replace(/\\/g, '/'),
    canonical: /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1] || '',
    references: />References</.test(html),
    faq: /Frequently Asked Questions|Frequently asked questions/.test(html),
    practical: /Practical|Example|Worked example|Engineering note/.test(html),
    related: /Related .*Resources|Related resources/.test(html),
    words: textFrom(html).split(' ').filter(Boolean).length,
    shingles: shingles(textFrom(html)),
  }));

const similarPairs = [];
for (let left = 0; left < pages.length; left += 1) {
  for (let right = left + 1; right < pages.length; right += 1) {
    const a = pages[left].shingles;
    const b = pages[right].shingles;
    const intersection = [...a].filter((value) => b.has(value)).length;
    const similarity = intersection / (a.size + b.size - intersection);
    if (similarity >= 0.8) similarPairs.push({ left: pages[left].file, right: pages[right].file, similarity });
  }
}

console.log(JSON.stringify({
  pages: pages.length,
  missingCanonical: pages.filter((page) => !page.canonical).map((page) => page.file),
  missingReferences: pages.filter((page) => !page.references).map((page) => page.file),
  missingFaq: pages.filter((page) => !page.faq).map((page) => page.file),
  missingPracticalContent: pages.filter((page) => !page.practical).map((page) => page.file),
  missingRelatedResources: pages.filter((page) => !page.related).map((page) => page.file),
  wordCountRange: [Math.min(...pages.map((page) => page.words)), Math.max(...pages.map((page) => page.words))],
  nearDuplicatePairCountAtOrAbove80PercentSevenWordShingles: similarPairs.length,
  highestSimilarityPairs: similarPairs.sort((a, b) => b.similarity - a.similarity).slice(0, 10),
}, null, 2));
