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

function text(value) {
  return value.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
}

function titleOf(html, fallback) {
  return text(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || fallback);
}

function summaryOf(html, fallback) {
  return text(html.match(/class="knowledge-page__summary">([\s\S]*?)<\/p>/i)?.[1] || fallback);
}

function processProfile(relative) {
  const source = relative.toLowerCase();
  if (/(water|stp|etp|effluent|ro-|dm-water|cooling-water)/.test(source)) return {
    family: 'water, wastewater and utility-water process',
    purpose: 'control water quality, hydraulic loading, solids separation and the transfer or disposal of residuals while protecting downstream equipment, users and the receiving environment',
    feed: 'inlet flow, contaminant or solids loading, pH, temperature, conductivity, biological condition, chemical dose and peak-flow variation',
    stages: ['receive and equalise variable flow', 'remove gross solids or condition the feed', 'separate, react, aerate, filter or polish as required', 'clarify and manage residual solids', 'verify treated-water quality', 'transfer treated water or sludge through the approved route', 'record performance and maintain the unit operations'],
    control: 'flow balancing, level control, chemical dosing, dissolved oxygen or redox where applicable, pH, pressure loss, turbidity, conductivity and residual-solids handling',
    risks: 'hydraulic shock, incompatible chemicals, biological upset, membrane or media fouling, sludge accumulation, corrosion, odour, confined-space exposure and inadequate sampling',
  };
  if (/(cement|kiln|clinker|raw-mill|mill-and-separator)/.test(source)) return {
    family: 'cement-manufacturing process',
    purpose: 'prepare, heat-treat, grind, handle or dispatch mineral material while maintaining product chemistry, throughput, heat efficiency, dust control and safe material movement',
    feed: 'material composition, moisture, particle size, feed rate, fuel or heat input, gas temperature, mill or kiln load, separator condition and product-quality target',
    stages: ['receive and condition the mineral feed', 'meter and proportion material', 'crush, dry, grind or blend to the specified state', 'apply heating or separation duty where required', 'collect product and recover entrained dust', 'store or dispatch under controlled conditions', 'trend quality and energy indicators'],
    control: 'feed-rate stability, moisture, temperature profile, pressure, draft, mill load, classifier setting, product fineness, dust-collector performance and conveyor availability',
    risks: 'hot material, dust explosion or fire, refractory or lining damage, buildup, wear, false air, conveyor spillage, filter upset and unsafe access to rotating equipment',
  };
  if (/(steel|blast-furnace|sinter|oxygen-furnace|electric-arc|casting|rolling)/.test(source)) return {
    family: 'steel-manufacturing process',
    purpose: 'transform prepared raw materials or molten metal into controlled intermediate or finished steel while managing energy, chemistry, temperature, slag, gases, cooling and product quality',
    feed: 'raw-material chemistry, scrap or iron quality, flux, fuel, oxygen or electrical input, temperature, production rate, slag condition, cooling-water availability and quality target',
    stages: ['prepare and charge feed materials', 'supply heat, oxygen or reducing conditions as required', 'control reaction, melting or refining behaviour', 'separate slag, gas, dust or other by-products', 'cast, cool, shape or roll the product', 'recover utilities and treat emissions or residues', 'verify chemistry, temperature and dimensional quality'],
    control: 'feed mix, thermal input, oxygen or electrical power, bath or gas temperature, slag chemistry, pressure and draft, cooling-water flow, casting speed and product inspection',
    risks: 'molten-material exposure, water ingress, pressure or gas release, refractory failure, dust and fume, moving equipment, crane interfaces, fire, explosion and high-energy electrical systems',
  };
  if (/(fgd|esp|bag-filter|dust|scr|sncr|denox|gas-cleaning)/.test(source)) return {
    family: 'air-pollution-control process',
    purpose: 'capture, separate, react or condition pollutants in a gas stream so that the required process, workplace and environmental performance is achieved without creating unmanaged residues',
    feed: 'gas flow, temperature, moisture, oxygen, contaminant loading, particle characteristics, reagent quality, pressure loss, utility condition and outlet-performance requirement',
    stages: ['collect and distribute the gas stream', 'condition temperature or chemistry where required', 'contact the gas with collection, filtration or reaction equipment', 'separate dust, liquid or reaction products', 'discharge cleaned gas through the controlled route', 'handle collected solids, slurry or spent reagent', 'verify performance from representative measurements'],
    control: 'gas flow and draft, temperature, pressure loss, reagent or cleaning utility, electrical field or pulse condition where relevant, hopper or slurry level, bypass position and emissions trend',
    risks: 'corrosion, erosion, condensation, reagent handling, high voltage, combustible dust, loss of draft, hopper blockage, leakage, unsafe access and inaccurate emissions measurement',
  };
  if (/(power-plant|boiler|coal|ash|steam-turbine|gas-turbine|combined-cycle|solar|wind|biomass)/.test(source)) return {
    family: 'power-generation process',
    purpose: 'convert fuel, heat, fluid energy or renewable resource into dependable electrical output while controlling efficiency, reliability, water and emissions duties, equipment protection and grid-related operating constraints',
    feed: 'fuel or renewable-resource condition, load demand, temperature, pressure, flow, water chemistry, combustion or turbine condition, auxiliary availability and emissions limit',
    stages: ['receive and prepare the energy source', 'convert energy through combustion, heat transfer, expansion or electrical generation', 'control the working-fluid or electrical system', 'recover heat, water, ash or other by-products', 'treat gases, water or solids before discharge', 'synchronise or transfer output through the approved system', 'monitor efficiency, integrity and availability'],
    control: 'load set point, fuel or energy input, pressure, temperature, flow, draft, water chemistry, vibration, generator condition, auxiliary power and emissions or discharge indicators',
    risks: 'high temperature and pressure, fuel fire or explosion, rotating-equipment failure, electrical hazards, water chemistry excursion, thermal stress, ash or residue blockage, grid disturbance and uncontrolled release',
  };
  if (/(chemical|distillation|reactor|flare|relief|gas-handling|fuel-supply|heat-recovery)/.test(source)) return {
    family: 'chemical and petrochemical process',
    purpose: 'contain, transform, separate, recover or safely dispose of process materials while maintaining the required composition, energy balance, pressure control, inventory and protective function',
    feed: 'material composition, phase behaviour, flow, temperature, pressure, impurity level, reaction or separation requirement, utility condition and upset scenario',
    stages: ['receive and verify feed conditions', 'meter, mix, heat, cool, compress or react the material', 'separate required products and by-products', 'recover energy or return useful material where practicable', 'control pressure, inventory and composition', 'route emissions, relief or effluent through the approved system', 'document quality and safe operating status'],
    control: 'flow, level, pressure, temperature, composition, heat duty, reflux or recycle where applicable, relief availability, flare or vent status and utility quality',
    risks: 'loss of containment, overpressure, incompatible chemicals, thermal runaway, static electricity, toxic or flammable release, corrosion, fouling, control failure and emergency isolation',
  };
  return {
    family: 'industrial material-handling or utility process',
    purpose: 'move, condition, store or distribute material or utility service reliably while maintaining the required rate, quality, containment, equipment condition and safe access',
    feed: 'material or utility properties, flow rate, moisture, particle size or quality, temperature, pressure, storage level, route configuration, operating schedule and downstream demand',
    stages: ['receive the input under controlled conditions', 'meter or distribute the service or material', 'convey, compress, cool, heat or otherwise condition it', 'separate undesirable material or recover useful product where required', 'transfer to storage or the next process boundary', 'control interfaces and discharge conditions', 'inspect, trend and maintain critical equipment'],
    control: 'flow, pressure, temperature, level, moisture or quality, equipment speed, valve or damper position, power demand, vibration, alarms and downstream availability',
    risks: 'blockage, leakage, spillage, wear, corrosion, dust, noise, rotating equipment, overpressure, confined-space exposure, poor access and unintended release',
  };
}

function referenceProfile(relative) {
  const source = relative.toLowerCase();
  if (/(fastener|bolt|nut|washer|gasket|weld)/.test(source)) return { family: 'fastener, gasket or joining reference', focus: 'nominal designation, thread or joint form, material grade, coating, temperature and corrosion suitability, tightening method, mating components and the current governing standard or supplier document' };
  if (/(pipe|tube|fitting|flange)/.test(source)) return { family: 'pipework and connection reference', focus: 'nominal size, schedule or wall, pressure-temperature rating, end preparation, material grade, facing or connection type, dimensional standard, corrosion allowance and the controlled piping class' };
  if (/(section|beam|channel|angle|hollow)/.test(source)) return { family: 'rolled or hollow structural-section reference', focus: 'section designation, dimensional series, mass basis, material grade, tolerances, orientation, connection detail, corrosion protection, load case and governing structural design standard' };
  if (/(plate|sheet|bar|rod|wire)/.test(source)) return { family: 'plate, sheet, bar, rod or wire reference', focus: 'product form, nominal dimension, thickness or gauge system, mass basis, material grade, delivery condition, tolerance, surface condition, traceability and the applicable product standard' };
  return { family: 'materials, properties or standards reference', focus: 'material identity, grade or specification, unit system, test or reference temperature, permitted range, source edition, fabrication or service condition, and the applicable project or statutory requirement' };
}

function faqs(title, kind) {
  const noun = kind === 'process' ? 'process' : 'reference value';
  return [
    ['What should be established first?', `Establish the actual boundary, service condition, required decision and governing case before using ${title}.`],
    ['Which data are essential?', 'Use current drawings, controlled records, representative measurements, relevant material or fluid information and the applicable project or standard basis.'],
    ['Why is normal operation not enough?', 'Start-up, shutdown, minimum, maximum, maintenance, upset and future cases can reveal different controlling limits.'],
    ['How should the result be verified?', `Compare the ${noun} with independent inspection, calibrated measurements, current supplier information and the documented operating condition.`],
    ['When is a repeat review needed?', 'Repeat the review after a material, load, configuration, equipment, control, route, standard or operating-procedure change.'],
    ['Can this page approve final project work?', 'No. Final design, procurement, safety, code and compliance decisions require current project information and qualified professional review.'],
    ['What should be retained in the record?', 'Retain sources, versions, assumptions, units, calculations, limitations, review actions and field-verification evidence.'],
    ['How should uncertainty be handled?', 'Identify uncertainty explicitly, test important sensitivities and avoid reporting more precision than the input evidence supports.'],
    ['Why involve operations and maintenance?', 'They identify practical limitations involving access, isolation, reliability, cleaning, availability and actual equipment behaviour.'],
    ['What is a common error?', 'Mixing incompatible conditions, units, source revisions or boundaries is a common cause of misleading engineering conclusions.'],
    ['What should follow implementation?', 'Confirm performance against the documented basis, close outstanding actions and reassess the conclusion if field evidence differs from expectation.'],
  ].map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join('');
}

function processBlock(title, summary, relative, image) {
  const p = processProfile(relative);
  const major = /(boiler|coal|ash|cement|steel|blast|sinter|casting|rolling|fgd|esp|bag-filter|dust|scr|sncr|power-plant|combined-cycle|gas-turbine|stp|etp|water-treatment|distillation|reactor|relief|flare|crushing|silo|cooling-water)/.test(relative.toLowerCase());
  const majorSection = major ? `<section class="content-depth-section"><p class="portal-kicker">System-wide engineering</p><h2>Lifecycle, interfaces and change control</h2><p>A ${p.family} must be reviewed as a connected operating system, not as isolated equipment. Changes in upstream feed, utility quality, throughput, environmental conditions or maintenance strategy can transfer a constraint to another part of the plant. Review capacity, pressure or energy margin, bypass arrangements, storage, residue handling, operator workload, controls, access and the ability to test performance after an outage or modification.</p><div class="article-card-grid"><section><h3>Upstream interface</h3><p>Confirm that the source process supplies the expected quantity, condition and variability, including credible upset and start-up conditions.</p></section><section><h3>Utilities and controls</h3><p>Verify dependable power, air, water, steam, fuel, reagent, instrumentation and protective actions throughout the required operating envelope.</p></section><section><h3>Downstream interface</h3><p>Check product, treated stream, residue, discharge, storage and transport arrangements so that a local improvement does not create another bottleneck.</p></section><section><h3>Assurance record</h3><p>Retain the design basis, performance test, as-built configuration, operating limits, training requirements, inspection plan and management-of-change record.</p></section></div><h3>Performance and reliability evidence</h3><p>Define acceptance criteria before commissioning or changing the system. The test plan should identify measurement points, calibration, operating stability, test duration, calculation method, safe access and responsibilities. Trend the variables that explain both output and condition, such as flow, temperature, pressure loss, energy or reagent use, vibration, leakage, alarm activity, solids handling and maintenance interventions.</p><p>After an abnormal event, preserve relevant history, protect the safety boundary, inspect the physical failure path and confirm recovery under representative conditions. Use the findings to revise procedures, spare strategy, inspection frequency or the engineering basis where justified.</p></section>` : '';
  return `<!-- next101-${relative}-start --><section class="content-depth-section"><p class="portal-kicker">Expanded process guide</p><h2>${title}: purpose, boundary and engineering basis</h2><p>${summary} In practice, the purpose of this ${p.family} is to ${p.purpose}. The final arrangement must be assessed against the actual operating duty, interfaces and project requirements rather than a generic flow diagram.</p><p>Start by defining the material or energy boundary, the required outcome, the normal and limiting operating cases, the quality or environmental target, and the owner of each interface. Record the source and date of the data used so that the process basis remains traceable when conditions change.</p><figure class="article-figure"><img src="${image}" alt="Original Industrial Calculation Hub illustration providing context for ${title}"><figcaption>Context illustration only. Use controlled drawings, current operating evidence and qualified review for project decisions.</figcaption></figure><h3>Process inputs and design basis</h3><div class="article-card-grid"><section><h4>Feed and duty</h4><p>Confirm ${p.feed}. Identify the source revision, measurement method and whether the value represents normal, maximum, minimum or upset operation.</p></section><section><h4>Required outcome</h4><p>Set the product, utility, discharge, emissions, recovery, storage or transfer requirement with an agreed acceptance basis.</p></section><section><h4>Interfaces</h4><p>Map upstream supply, utilities, controls, structural and access needs, downstream handling, residue routes and emergency isolation.</p></section><section><h4>Governing case</h4><p>Check which credible case controls capacity, quality, reliability, integrity, energy use, safety or environmental performance.</p></section></div><h3>Typical process sequence</h3><ol class="method-list"><li><strong>Receive and validate the feed.</strong> Confirm actual condition, variability and hazards before the material or utility enters the process boundary.</li><li><strong>Establish a stable operating state.</strong> Align inventory, flow, temperature, pressure, level, draft or energy input before relying on performance data.</li><li><strong>Perform the principal unit operation.</strong> ${p.stages[2]}; document the intended mechanism, residence time or contact condition and its practical limits.</li><li><strong>Manage separation and recycle.</strong> ${p.stages[3]}; prevent unwanted carryover, bypass, leakage, short circuiting or accumulation.</li><li><strong>Control quality and transfer.</strong> ${p.stages[4]} and ${p.stages[5]}, with clear ownership for off-spec material or abnormal discharge.</li><li><strong>Protect people and assets.</strong> Provide alarm, trip, relief, isolation, ventilation, guarding and access measures appropriate to the hazards.</li><li><strong>Verify and improve.</strong> ${p.stages[6]}; compare results with the approved basis and investigate meaningful deviations.</li></ol><h3>Operating controls and performance factors</h3><p>The principal operating controls normally include ${p.control}. Their set points and alarm limits should be based on the process design basis, equipment limits, quality target and operating experience. A trend must be interpreted with its operating context: a change in flow, feed property, ambient condition or downstream restriction can explain a value that would otherwise appear abnormal.</p><p>Use an input–output balance where practical. Compare the quantity and condition entering the boundary with useful product, treated stream, loss, recycle and accumulated inventory. An unexplained imbalance may indicate measurement error, unrecorded bypass, leakage, sampling bias, carryover, incomplete reaction, moisture change or an incorrect boundary.</p><h3>Instrumentation, sampling and control response</h3><div class="article-card-grid"><section><h4>Measurement integrity</h4><p>Locate sensors at representative points, confirm calibration and retain the unit, range, reference condition and date with the trend.</p></section><section><h4>Sampling plan</h4><p>Use defined points, representative duration and safe handling so that a laboratory or field result supports the actual operating decision.</p></section><section><h4>Alarms and trips</h4><p>Distinguish advisory alarms from protective actions, and provide an understood operator response for each credible abnormal condition.</p></section><section><h4>Manual checks</h4><p>Combine instrument trends with inspection for leakage, wear, vibration, deposition, discharge condition, access and housekeeping.</p></section></div><h3>Start-up, shutdown and maintenance</h3><p>Start-up should verify isolation status, correct line-up, utility availability, inventory, interlocks, protective equipment and readiness of downstream systems before introducing full duty. Increase load in a controlled manner and confirm expected trends after each change. Shutdown should leave material, pressure, temperature and electrical energy in a condition that can be safely isolated, inspected and restarted.</p><p>Plan maintenance around the components that determine containment, transfer, separation, heat or mass transfer, measurement, isolation and discharge. Include access, lifting, cleaning, spare parts, permits, lockout, confined-space controls and post-maintenance functional testing in the work scope.</p><h3>Common performance problems</h3><p>${p.risks}. Investigate the physical mechanism before changing a set point or replacing equipment. Verify the data boundary, inspect the affected route, compare the trend with process changes and test the most plausible cause using controlled evidence.</p><p>A useful troubleshooting record states the symptom, time, operating condition, affected equipment, relevant alarms, field observations, actions taken, outcome and remaining uncertainty. This supports repeatable learning rather than relying on memory after the event.</p><h3>Limitations and engineering use</h3><p>This page provides an educational framework. It does not define a complete P&amp;ID, operating procedure, safety study, equipment guarantee, emissions demonstration, material specification or final design. Confirm applicable codes, permits, supplier information, hazard reviews and project documents before implementation.</p><p>Where a calculation, change or operating decision could affect safety, environmental compliance, containment, product quality or equipment integrity, obtain qualified review using current site-specific data.</p><h3>Frequently asked questions</h3><div class="faq-list">${faqs(title, 'process')}</div></section>${majorSection}<!-- next101-${relative}-end -->`;
}

function referenceBlock(title, summary, relative, image) {
  const p = referenceProfile(relative);
  return `<!-- next101-${relative}-start --><section class="content-depth-section"><p class="portal-kicker">Expanded reference guide</p><h2>${title}: scope, identification and controlled use</h2><p>${summary} This is a ${p.family}. It is intended to help a visitor identify the information that must be confirmed before a dimension, property, designation, mass or table entry is used in design, procurement, fabrication, inspection or maintenance.</p><p>Do not treat a web reference as an approved project table. The user must establish ${p.focus}. Numerical information must remain traceable to the applicable standard, manufacturer document, material certificate, controlled drawing or project specification.</p><figure class="article-figure"><img src="${image}" alt="Original Industrial Calculation Hub illustration providing context for ${title}"><figcaption>Context illustration only. It is not an approved standard table, certificate or project specification.</figcaption></figure><h3>Identify the reference correctly</h3><div class="article-card-grid"><section><h4>Item identity</h4><p>Record the complete designation, product form, size series, grade, condition and any suffix that changes meaning or applicability.</p></section><section><h4>Basis and units</h4><p>Confirm the unit system, datum, temperature or pressure condition, nominal versus actual value and rounding rule before comparison.</p></section><section><h4>Source control</h4><p>Use the current approved edition or supplier record; retain document number, revision, issue date and page or table reference.</p></section><section><h4>Project fit</h4><p>Check that the value is compatible with the project specification, code, material class, service environment and fabrication method.</p></section></div><h3>Practical use sequence</h3><ol class="method-list"><li>Identify the equipment, component or material and the decision that the reference must support.</li><li>Confirm the full designation and distinguish nominal size, catalogue value, design dimension, actual measured value and tolerance.</li><li>Check the applicable source edition, national or international standard, project specification and supplier documentation.</li><li>Verify units, reference conditions, temperature effects, material state and any conversion factor before using a value.</li><li>Compare the entry with interfacing components, pressure or load condition, fabrication method, corrosion allowance and inspection requirement.</li><li>Record the source, version, selection basis, calculation inputs and limitations in the project or maintenance record.</li><li>Obtain competent review where the item affects containment, safety, structural capacity, code compliance or critical performance.</li></ol><h3>Selection, procurement and inspection context</h3><p>Selection should not be based on one dimension or a familiar designation alone. Confirm fit-up, compatibility, tolerance, availability, manufacturing route, test requirements, traceability, coating or surface condition, storage and installation method. Where an item interfaces with another standard system, verify both sides of the connection before releasing a purchase or fabrication instruction.</p><p>At receipt or inspection, compare the actual marking, certificate, quantity, dimensions and condition with the controlled requirement. Segregate unidentified, damaged, mixed or out-of-tolerance material until its status is resolved. Use calibrated instruments and suitable sampling where measurement is required.</p><h3>Data quality and limitation checks</h3><p>Reference data can be misleading when a value is copied without its qualification. Common examples are nominal values treated as minimums, gauge systems confused with physical thickness, mass treated as force, standard dimensions applied to a different series, and temperature-dependent properties used outside their stated range.</p><p>When a table has incomplete context, obtain the primary source rather than estimating a critical value. Document uncertainty, avoid false precision and use an approved calculation or specialist review when the consequence of error is material.</p><h3>Frequently asked questions</h3><div class="faq-list">${faqs(title, 'reference')}</div></section><!-- next101-${relative}-end -->`;
}

const selected = walk(root).filter((file) => {
  const relative = path.relative(root, file).replace(/\\/g, '/');
  return relative.startsWith('industrial-processes/') || relative.startsWith('engineering-reference-data/');
}).filter((file) => fs.readFileSync(file, 'utf8').includes('class="knowledge-page"'));

const counts = { processes: 0, reference: 0 };
for (const file of selected) {
  const relative = path.relative(root, file).replace(/\\/g, '/');
  let html = fs.readFileSync(file, 'utf8');
  const marker = `<!-- next101-${relative}-start -->`;
  if (html.includes(marker)) continue;
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] || html;
  const image = main.match(/<img[^>]+src="([^"]+)"/i)?.[1];
  if (!image) throw new Error(`Missing primary illustration: ${relative}`);
  const title = titleOf(html, path.basename(file, '.html'));
  const summary = summaryOf(html, `${title} is an Industrial Calculation Hub knowledge page.`);
  const block = relative.startsWith('industrial-processes/') ? processBlock(title, summary, relative, image) : referenceBlock(title, summary, relative, image);
  const insertAt = html.indexOf('<section id="related"');
  if (insertAt < 0) throw new Error(`Related-resources insertion point not found: ${relative}`);
  html = `${html.slice(0, insertAt)}${block}${html.slice(insertAt)}`;
  fs.writeFileSync(file, html);
  if (relative.startsWith('industrial-processes/')) counts.processes += 1;
  else counts.reference += 1;
}

if (selected.length !== 101 || counts.processes !== 55 || counts.reference !== 46) {
  throw new Error(`Unexpected scope. Found ${selected.length}; updated ${counts.processes} processes and ${counts.reference} reference pages.`);
}

console.log(JSON.stringify({ selected: selected.length, ...counts }, null, 2));
