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

function majorProcess(relative) {
  const topicPath = relative.replace(/^industrial-processes\//, '').toLowerCase();
  return /(boiler|coal|ash|cement|steel|blast|sinter|casting|rolling|fgd|esp|bag-filter|dust|scr|sncr|power-plant|combined-cycle|gas-turbine|stp|etp|water-treatment|distillation|reactor|relief|flare|crushing|silo|cooling-water)/.test(topicPath);
}

const referenceCompletion = `<section class="content-depth-section" id="next101-reference-completion"><p class="portal-kicker">Controlled application</p><h2>Use in calculations, specifications and records</h2><p>When a value from this reference is used in a calculation, state the source alongside the input and preserve the original unit. Use a controlled conversion only where necessary, show the selected value and any tolerance or allowance, then round the final presented result appropriately. This makes the calculation reviewable and prevents a copied number from losing its engineering context.</p><p>In a specification or purchase document, write the full required designation rather than a shortened informal name. Include applicable standard, material grade, dimensions, tolerances, test or certification requirement, surface or coating condition, quantity and any compatibility requirement with connected parts. Resolve differences between this educational guide and the controlled project requirement in favour of the latter.</p><p>For inspection, compare the actual component or material against its marking, certificate, approved drawing and permitted tolerance. Do not accept a substitute solely because it appears similar. Substitution can alter fit, strength, pressure capability, corrosion behaviour, welding response, temperature limit or traceability. Record the verification route so that future maintenance or modification work can identify what was installed.</p></section>`;

const majorCompletion = `<section class="content-depth-section" id="next101-major-process-completion"><p class="portal-kicker">Major-process readiness</p><h2>Capacity, availability and safe response</h2><p>For a major process, capacity should be checked against the complete train, not only the rated central unit. Review the limiting upstream and downstream equipment, storage, conveying, gas or liquid route, utility supply, residue handling and operator response time. A capacity increase can require changes to pressure balance, heat removal, air or water demand, environmental control, protection settings, access and maintenance resources.</p><p>Define an availability strategy with critical spares, inspection frequency, condition indicators, planned outage tasks, bypass philosophy and a route for safe operation at reduced capacity. The plan should distinguish tolerable degradation from conditions that require immediate intervention. Retain baseline trends after commissioning so that changes in energy, pressure loss, temperature approach, emissions, vibration, quality or discharge behaviour can be interpreted early.</p><p>Emergency and abnormal-condition procedures should state the alarm cues, stabilising actions, isolation boundaries, communication steps, required personal protection and verification needed before restart. Review these procedures after incidents, modifications or changes in operating personnel. Safe, repeatable recovery is a core performance requirement for a system of this scale.</p></section>`;

let referenceUpdated = 0;
let majorUpdated = 0;
for (const file of walk(root).filter((file) => file.endsWith('.html'))) {
  const relative = path.relative(root, file).replace(/\\/g, '/');
  let html = fs.readFileSync(file, 'utf8');
  const marker = `<!-- next101-${relative}-end -->`;
  if (!html.includes(marker)) continue;
  let changed = false;
  if (relative.startsWith('engineering-reference-data/') && !html.includes('id="next101-reference-completion"')) {
    html = html.replace(marker, `${referenceCompletion}${marker}`);
    referenceUpdated += 1;
    changed = true;
  }
  if (relative.startsWith('industrial-processes/') && majorProcess(relative) && !html.includes('id="next101-major-process-completion"')) {
    html = html.replace(marker, `${majorCompletion}${marker}`);
    majorUpdated += 1;
    changed = true;
  }
  if (changed) fs.writeFileSync(file, html);
}

if (referenceUpdated !== 46 || majorUpdated < 1) throw new Error(`Unexpected completion scope: ${referenceUpdated} reference, ${majorUpdated} major process.`);
console.log(JSON.stringify({ referenceUpdated, majorUpdated }, null, 2));
