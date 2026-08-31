const fs = require('fs');
const path = require('path');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const item = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(item) : item;
  });
}

const coreChecklist = `<section class="content-depth-section" id="next110-core-checklist"><p class="portal-kicker">Technical check list</p><h2>Before relying on this guide</h2><p>Confirm that the calculation or selection is based on the actual service rather than a nominal description. Identify the current drawing and data-sheet revisions, the operating period represented by measurements, the unit and reference-condition basis, and the responsible person for each critical input. This prevents a valid principle from being applied to an incompatible boundary or outdated condition.</p><h3>Questions for a competent review</h3><ul><li>Does the selected method address the geometry, material, fluid, equipment arrangement and operating range in question?</li><li>Have minimum, maximum, start-up, shutdown, upset, maintenance and future cases been screened where they could govern?</li><li>Are the result, tolerance and rounding appropriate for the quality and uncertainty of the available input data?</li><li>Are plant constraints such as access, isolation, inspection, utilities, controls, safety and environmental duty included in the decision?</li><li>Is there a documented field-verification step before a design, procurement or operating change is approved?</li></ul><p>If one of these questions cannot be answered, retain the limitation in the technical record and obtain the necessary evidence or specialist review. The value of an engineering guide is not merely a result; it is a transparent basis for a safe, traceable and practical decision.</p></section>`;

const majorCalibration = `<section class="content-depth-section" id="next110-major-calibration"><p class="portal-kicker">Major-system assurance</p><h2>Data maturity and lifecycle assurance</h2><p>A major pollution-control system should progress through documented data maturity before it is treated as ready for final selection. Early screening can use design estimates, but later decisions need validated gas or dust properties, duty variations, layout constraints, utility quality, maintenance strategy and an agreed performance-test protocol. Record which values are measured, calculated, guaranteed, assumed or still to be confirmed.</p><h3>Interfaces that often control long-term performance</h3><div class="article-card-grid"><section><h4>Upstream process</h4><p>Changes in fuel, feed, moisture, throughput, temperature, chemistry or operating mode can change the collection duty and maintenance burden.</p></section><section><h4>Gas path and fan</h4><p>Confirm duct leakage, distribution, pressure margin, fan curve, damper control, vibration, expansion and interactions with upstream and downstream equipment.</p></section><section><h4>Discharge and disposal</h4><p>Verify hopper geometry, conveying capacity, isolation, dust conditioning, storage, truck or disposal interfaces and response to bridging or blockage.</p></section><section><h4>People and compliance</h4><p>Provide safe access, lockout, confined-space controls, high-voltage or compressed-air isolation where applicable, inspection plans and reporting controls.</p></section></div><h3>Close-out evidence</h3><p>At commissioning, reconcile measured performance with the approved design basis, supplier data and environmental or process requirements. Capture the as-built configuration, set points, calibration status, baseline trends, outstanding actions and the maintenance schedule. That record becomes the reference for future troubleshooting, emissions review, capacity change and management-of-change decisions.</p></section>`;

const files = walk('.').filter((file) => file.endsWith('.html'));
let coreUpdated = 0;
let majorUpdated = 0;
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('id="next110-core-depth"')) continue;
  const marker = html.match(/<!-- next110-[\s\S]*?-end -->/);
  if (!marker) throw new Error(`Missing next110 marker: ${file}`);
  let changed = false;
  if (!html.includes('id="next110-core-checklist"')) {
    html = html.replace(marker[0], `${coreChecklist}${marker[0]}`);
    coreUpdated += 1;
    changed = true;
  }
  if (html.includes('id="next110-major-system-depth"') && !html.includes('id="next110-major-calibration"')) {
    html = html.replace(marker[0], `${majorCalibration}${marker[0]}`);
    majorUpdated += 1;
    changed = true;
  }
  if (changed) fs.writeFileSync(file, html);
}

if (coreUpdated !== 16 || majorUpdated !== 4) {
  throw new Error(`Unexpected calibration scope: ${coreUpdated} core, ${majorUpdated} major.`);
}
console.log(`Calibrated ${coreUpdated} core guides and ${majorUpdated} major-system guides.`);
