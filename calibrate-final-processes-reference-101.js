const fs = require('fs');
const path = require('path');
const root = process.cwd();
const excluded = new Set(['.git', 'assets', 'outputs', 'tmp', 'design-prototypes']);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return excluded.has(entry.name) ? [] : walk(target);
    return entry.isFile() && entry.name.endsWith('.html') ? [target] : [];
  });
}

function isMajorProcess(relative) {
  return /(boiler|coal|ash|cement|steel|blast|sinter|casting|rolling|fgd|esp|bag-filter|dust|scr|sncr|power-plant|combined-cycle|gas-turbine|stp|etp|water-treatment|distillation|reactor|relief|flare|crushing|silo|cooling-water)/.test(relative.toLowerCase());
}

const processCore = `<section class="content-depth-section" id="next101-process-core-depth"><p class="portal-kicker">Operating decision framework</p><h2>Process decisions, evidence and operating readiness</h2><p>Engineering decisions should state the expected operating condition, the evidence used and the limit that would require action. A calculated capacity or an apparent trend is not enough when the process can be influenced by feed variation, weather, equipment condition, utility quality, downstream restriction or an unrecognised change in configuration. Build the decision around a clear boundary and confirm that the available data represent that boundary.</p><h3>Evidence hierarchy</h3><div class="article-card-grid"><section><h4>Controlled basis</h4><p>Use current PFDs, P&amp;IDs, data sheets, operating procedures, material specifications, cause-and-effect information and approved calculation records.</p></section><section><h4>Measured condition</h4><p>Use calibrated trends, laboratory results, field readings, inspection findings and maintenance history obtained under recorded operating conditions.</p></section><section><h4>Independent check</h4><p>Reconcile key conclusions with a balance, a second measurement, supplier limit, physical inspection or alternative calculation method.</p></section><section><h4>Action record</h4><p>Record the decision, uncertainty, safeguards, owner, due date and the test or inspection that will confirm the expected outcome.</p></section></div><h3>Operating-envelope review</h3><p>For each significant variable, define a normal band and a practical response threshold. Typical variables include flow, inventory, pressure, temperature, composition, moisture, utility demand, pressure loss, energy use, emissions or discharge quality, equipment speed and vibration. Consider whether the instrument location, range and calibration can distinguish a genuine process change from normal measurement noise.</p><p>Review the interaction between variables. A higher flow may reduce residence time, change pressure loss, reduce separation efficiency, increase entrainment, raise a pump or fan load, or overwhelm a downstream storage or treatment step. A local response can therefore move the constraint rather than resolve it. Test the complete process route before accepting a permanent change.</p><h3>Preparation for abnormal conditions</h3><p>Identify the early symptoms of loss of feed quality, utility interruption, high or low inventory, equipment degradation, fouling, blockage, leakage, loss of containment, incorrect line-up, instrument failure or loss of control. Provide a safe and understood response: stabilise the unit, protect people and equipment, isolate where necessary, notify affected interfaces and preserve evidence for investigation.</p><p>After an upset, do not return directly to normal duty solely because one indicator recovers. Verify the affected equipment, downstream route, inventory, protective function and quality or emissions condition. Record any temporary control changes and close them through the appropriate operating and change-management process.</p><h3>Documentation for repeatable operation</h3><p>A useful operating record identifies the design basis, normal and limiting cases, operating limits, alarm response, sampling and analysis method, maintenance tasks, spare strategy, inspection points and acceptance criteria. It helps new operators, reviewers and maintenance teams understand why the process is run in a particular way and makes later deviations easier to diagnose.</p></section>`;

const majorProcess = `<section class="content-depth-section" id="next101-major-process-depth"><p class="portal-kicker">Major-system assurance</p><h2>Integrated system performance and lifecycle control</h2><p>Major industrial process systems must be evaluated as a lifecycle arrangement: design intent, construction quality, commissioning, normal operation, maintenance, upset response, environmental duty and eventual modification are connected. The most visible item of equipment rarely governs performance alone. Layout, gas or material distribution, utility reliability, access, storage, discharge paths, controls and operator actions may determine whether the intended process outcome is achieved consistently.</p><h3>Interface checklist</h3><div class="article-card-grid"><section><h4>Feed source</h4><p>Confirm quantity, condition, composition, variability, contamination, temperature and credible upset behaviour from the upstream process.</p></section><section><h4>Equipment train</h4><p>Check capacity margin, bypasses, isolation, pressure or hydraulic balance, wear, fouling, heat loss, leakage, instrumentation and protective functions.</p></section><section><h4>Utilities</h4><p>Verify electrical power, compressed air, water, steam, fuel, reagent, cooling, drainage, ventilation and automation services under the controlling cases.</p></section><section><h4>Discharge route</h4><p>Confirm that product, treated stream, residue, ash, sludge, dust, gas or water can be safely contained, measured, stored and transferred.</p></section></div><h3>Commissioning and acceptance evidence</h3><p>Set measurable acceptance criteria before testing. State the operating condition, stabilisation period, sampling or measurement locations, calibration requirements, test duration, calculation method, data treatment, safe-access conditions and responsibility for witness and approval. Compare the result with the agreed design basis, supplier guarantee and applicable process, quality or environmental requirement.</p><p>Capture the as-built arrangement, set points, control logic, alarm limits, inspection findings, outstanding actions, training requirements and baseline operating trends. These records are essential when a later concern is caused by a change in feed, duty, fuel, material, component, operating method or environmental condition.</p><h3>Reliability, maintenance and management of change</h3><p>Use condition trends and field observations to plan maintenance before performance is lost. Include inspection for wear, corrosion, deposition, leakage, vibration, belt or chain condition, refractory or lining condition, bag or electrode condition, alignment, support movement, utility quality and residue discharge where relevant. Safe access, isolation, lifting, cleaning, permits and post-maintenance functional checks are part of process reliability, not secondary activities.</p><p>Apply management of change to material modifications, throughput increases, alternate fuels or feeds, route changes, software or set-point revisions, replacement equipment, temporary bypasses and revised maintenance strategies. Recheck the design and safety basis whenever a change could affect containment, emission, energy balance, equipment integrity, quality or the ability of operators to respond safely.</p></section>`;

const referenceCore = `<section class="content-depth-section" id="next101-reference-core-depth"><p class="portal-kicker">Source-governed use</p><h2>Verification before using a reference value</h2><p>Before entering a table value into a design, fabrication, inspection or procurement document, confirm the source edition, full item designation, unit system, reference condition and applicable tolerance. A value copied from an uncontrolled summary may be unsuitable even when the number appears familiar. Retain the primary-source reference so the selection can be checked later.</p><h3>Reference-data quality checks</h3><ul><li>Distinguish nominal, minimum, maximum, average, calculated and actual measured values.</li><li>Check whether the source applies to the required material grade, product form, heat treatment, dimensional series, pressure class or service condition.</li><li>Use controlled conversions and retain adequate significant figures until the final presentation.</li><li>Confirm interfaces with mating components, fabrication methods, test requirements and project specifications.</li><li>Escalate values affecting safety, pressure containment, structural capacity, statutory compliance or critical performance for competent review.</li></ul><p>Where the controlled source is unavailable, record the gap rather than inventing a missing value or implied tolerance. Obtain the applicable standard, manufacturer information or qualified review before release of work that depends on it.</p></section>`;

let processUpdated = 0;
let majorUpdated = 0;
let referenceUpdated = 0;
for (const file of walk(root).filter((file) => file.endsWith('.html'))) {
  const relative = path.relative(root, file).replace(/\\/g, '/');
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes(`<!-- next101-${relative}-start -->`)) continue;
  const marker = `<!-- next101-${relative}-end -->`;
  if (!html.includes(marker)) throw new Error(`Missing update marker: ${relative}`);
  let changed = false;
  if (relative.startsWith('industrial-processes/')) {
    if (!html.includes('id="next101-process-core-depth"')) {
      html = html.replace(marker, `${processCore}${marker}`);
      processUpdated += 1;
      changed = true;
    }
    if (isMajorProcess(relative) && !html.includes('id="next101-major-process-depth"')) {
      html = html.replace(marker, `${majorProcess}${marker}`);
      majorUpdated += 1;
      changed = true;
    }
  } else if (relative.startsWith('engineering-reference-data/')) {
    if (!html.includes('id="next101-reference-core-depth"')) {
      html = html.replace(marker, `${referenceCore}${marker}`);
      referenceUpdated += 1;
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(file, html);
}

if (processUpdated !== 55 || referenceUpdated !== 46 || majorUpdated < 1) {
  throw new Error(`Unexpected calibration counts: ${processUpdated} process, ${majorUpdated} major, ${referenceUpdated} reference.`);
}
console.log(JSON.stringify({ processUpdated, majorUpdated, referenceUpdated }, null, 2));
