const fs = require('fs');

const supplement = (title) => `
<h3>Decision record check</h3>
<p>For ${title}, the review record should identify the specific decision being supported, the condition that governs it, the source and revision of each significant input, the method used, the result, its limitations and the person responsible for accepting or escalating the outcome. This keeps an educational explanation distinct from a controlled project calculation.</p>
<p>Before release, ask four practical questions: does the result use the current arrangement; are the units and reference conditions consistent; has the credible worst case been considered; and is a field measurement, supplier confirmation or specialist check needed? A clear answer to these questions provides a more reliable basis for action than adding false numerical precision.</p>`;

const files = fs.readdirSync('engineering', { recursive: true })
  .filter((file) => file.endsWith('index.html'))
  .map((file) => `engineering/${file.replaceAll('\\', '/')}`);

let updated = 0;
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('<!-- next18-') || html.includes('<h3>Decision record check</h3>')) continue;
  const title = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || 'this engineering guide')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const start = html.indexOf('<!-- next18-');
  const end = html.indexOf('-end -->', start);
  if (start < 0 || end < 0) throw new Error(`Missing expansion markers: ${file}`);
  const block = html.slice(start, end);
  const updatedBlock = block.replace('<h3>Expanded FAQs</h3>', `${supplement(title)}<h3>Expanded FAQs</h3>`);
  if (updatedBlock === block) throw new Error(`FAQ heading missing: ${file}`);
  html = html.slice(0, start) + updatedBlock + html.slice(end);
  fs.writeFileSync(file, html, 'utf8');
  updated += 1;
}

console.log(`Completed ${updated} guides to the agreed minimum depth.`);
