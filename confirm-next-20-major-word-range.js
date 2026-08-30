const fs = require('fs');
const slugs = new Set(['dilute-phase-and-dense-phase-pneumatic-conveying', 'flue-gas-desulfurization-process-and-equipment', 'bag-filter-working-principle-and-components', 'electrostatic-precipitator-working-principle-and-components']);
const note = `<section class="content-depth-section"><h2>Practical Review Note</h2><p>Use a short cross-functional review before concluding that a major-system issue is resolved. Include process or production, operations, maintenance, inspection, electrical or controls personnel as applicable, and environmental or safety representatives where the duty requires them. Compare the proposed action with the current performance basis, plant constraints, maintenance access, available spares, isolation needs and downstream consequences.</p><p>Document what was observed, the operating condition, the evidence used, alternatives considered, residual uncertainty, acceptance criterion and post-change verification plan. This provides a reliable handover to the people who must operate and maintain the system after the immediate issue is closed.</p></section>`;
const files = fs.readdirSync('engineering', { recursive: true }).filter((file) => file.endsWith('index.html')).map((file) => `engineering/${file.replaceAll('\\', '/')}`);
let updated = 0;
for (const file of files) {
  if (!slugs.has(file.split('/').at(-2))) continue;
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('<h2>Practical Review Note</h2>')) continue;
  const start = html.indexOf('<!-- next20-');
  const end = html.indexOf('-end -->', start);
  if (start < 0 || end < 0) throw new Error(`Missing next20 markers: ${file}`);
  const block = html.slice(start, end);
  const next = block.replace('<h3>Expanded FAQs</h3>', `${note}<h3>Expanded FAQs</h3>`);
  if (next === block) throw new Error(`FAQ heading missing: ${file}`);
  html = html.slice(0, start) + next + html.slice(end);
  fs.writeFileSync(file, html, 'utf8');
  updated += 1;
}
if (updated !== slugs.size) throw new Error(`Expected ${slugs.size} pages, got ${updated}`);
console.log(`Confirmed extended range for ${updated} major-system guides.`);
