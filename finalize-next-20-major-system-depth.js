const fs = require('fs');

const majorSlugs = new Set([
  'dilute-phase-and-dense-phase-pneumatic-conveying',
  'flue-gas-desulfurization-process-and-equipment',
  'bag-filter-working-principle-and-components',
  'electrostatic-precipitator-working-principle-and-components',
]);

const finalExtension = (title) => `
<section class="content-depth-section">
<p class="portal-kicker">Major-system performance and governance</p>
<h2>Performance Testing, Maintenance Strategy and Controlled Decisions</h2>
<p>${title} should have a documented performance basis before its operation is judged, modified or accepted. Define the required duty, applicable limits, guaranteed or design condition, measurement locations, reference conditions, permitted operating range and the relevant uncertainty. A result without this context can be compared incorrectly with a supplier curve, permit limit, design duty or historical trend.</p>
<h3>Define a meaningful test</h3>
<p>A useful test starts with a stable, representative operating period. Record upstream condition, load, material or fuel/feed properties, gas or air flow where relevant, temperature, pressure, utility availability, equipment configuration, instrument status and active control settings. Confirm the data-acquisition method before the test so subsequent performance differences can be interpreted rather than argued.</p>
<p>Acceptance criteria should distinguish capacity, efficiency, quality, reliability, pressure loss, energy, emissions and safety. A system can meet one criterion while failing another. For example, an operational change that improves a local reading may increase energy consumption, wear, dust leakage, reagent use, product degradation or maintenance exposure. State which measures are primary and which are constraints.</p>
<h3>Translate data into maintenance action</h3>
<p>Condition monitoring should connect a measured change to a practical response. Establish the normal trend, alert level, investigation trigger, responsible role and required evidence. Use inspection intervals based on duty, degradation mechanism, consequence and access rather than copying a generic calendar interval. Retain baseline measurements after commissioning and after major maintenance so future observations have a valid reference.</p>
<p>Critical spares should be selected from the system’s credible failure modes and repair time: consider components that can stop production, reduce environmental performance, create a safety constraint or have a long supply lead time. Storage, preservation, identification and the ability to fit the spare safely are part of the reliability plan. An unused spare without a compatible installation record may not reduce recovery time.</p>
<h3>Manage modifications without losing the basis</h3>
<p>Use a controlled change process for changes to material, feed, fuel, process load, route, equipment, set points, controls, software, maintenance procedure or protective system. The review should identify affected drawings, data sheets, operating procedures, limits, permits, training, alarms, spare parts and emergency response. Revalidate the performance basis after implementation and update the controlled record.</p>
<p>When different evidence conflicts, investigate the boundary, measurement condition, instrument health, operating history and hidden interfaces before selecting a correction. A major system often reflects upstream variability and downstream restrictions; isolating the local component without testing those interactions can create a misleading conclusion.</p>
<h3>Source governance and final limitation</h3>
<p>Maintain source-governed records: approved specifications, supplier manuals, controlled drawings, test certificates, inspection reports, calibration records, process-safety documents and applicable legal or permit requirements. This supports a transparent decision trail and prevents an educational summary from being treated as a project-specific design authority.</p>
<p>This guide provides in-depth engineering context and review questions. Final design, procurement, compliance, pressure, electrical, dust-hazard, mechanical-integrity and safety decisions remain the responsibility of qualified professionals using current project information and applicable requirements.</p>
</section>`;

const files = fs.readdirSync('engineering', { recursive: true })
  .filter((file) => file.endsWith('index.html'))
  .map((file) => `engineering/${file.replaceAll('\\', '/')}`);

let updated = 0;
for (const file of files) {
  const slug = file.split('/').at(-2);
  if (!majorSlugs.has(slug)) continue;
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('Major-system performance and governance')) continue;
  const title = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || 'This major system').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const start = html.indexOf('<!-- next20-');
  const end = html.indexOf('-end -->', start);
  if (start < 0 || end < 0) throw new Error(`Missing next20 markers: ${file}`);
  const block = html.slice(start, end);
  const next = block.replace('<h3>Expanded FAQs</h3>', `${finalExtension(title)}<h3>Expanded FAQs</h3>`);
  if (next === block) throw new Error(`FAQ heading missing: ${file}`);
  html = html.slice(0, start) + next + html.slice(end);
  fs.writeFileSync(file, html, 'utf8');
  updated += 1;
}

if (updated !== majorSlugs.size) throw new Error(`Expected ${majorSlugs.size} major systems, got ${updated}`);
console.log(`Finalised ${updated} major systems at extended depth.`);
