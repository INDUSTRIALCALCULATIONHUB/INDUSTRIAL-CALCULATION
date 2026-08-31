const fs = require('fs');
const path = require('path');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const item = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(item) : item;
  });
}

const section = `<section class="content-depth-section" id="next110-major-lifecycle"><p class="portal-kicker">Operations readiness</p><h2>Operating discipline and abnormal-condition response</h2><p>Define clear operating limits for flow, temperature, pressure loss, utility quality, level, electrical condition and any emissions or process indicator that demonstrates system health. The operating team should know which limits call for routine adjustment, urgent investigation, controlled derating or shutdown. Alarm rationalisation and written response steps are especially important when several interacting subsystems can mask the original cause of poor performance.</p><p>After an abnormal event, preserve relevant trends and inspection evidence, check the safety boundary, determine the physical failure path and verify recovery with representative operating data. Close the event through controlled corrective action, a review of spares and maintenance work, and a management-of-change check whenever the remedy alters the original process, equipment or control basis.</p></section>`;

let updated = 0;
for (const file of walk('.').filter((file) => file.endsWith('.html'))) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('id="next110-major-calibration"') || html.includes('id="next110-major-lifecycle"')) continue;
  const marker = html.match(/<!-- next110-[\s\S]*?-end -->/);
  if (!marker) throw new Error(`Missing next110 marker: ${file}`);
  html = html.replace(marker[0], `${section}${marker[0]}`);
  fs.writeFileSync(file, html);
  updated += 1;
}
if (updated !== 4) throw new Error(`Unexpected major-system scope: ${updated}`);
console.log(`Completed major-system depth on ${updated} guides.`);
