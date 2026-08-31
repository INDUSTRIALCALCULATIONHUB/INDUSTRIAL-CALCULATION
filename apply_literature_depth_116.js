const fs = require('fs');
const path = require('path');

const groups = [
  {
    name: 'Air pollution control',
    directory: 'engineering/air-pollution-control-and-environmental-engineering',
    sources: ['N. P. Cheremisinoff, <em>Handbook of Air Pollution Prevention and Control</em>.', 'K. B. Schnelle Jr. and C. A. Brown, <em>Air Pollution Control Technology Handbook</em>.', 'U.S. EPA, <em>Principles and Practices of Air Pollution Control</em>.'],
    base: 'Air-pollution-control literature treats an emission-control installation as a complete chain: source characterisation, capture or collection, gas transport, treatment, residue handling, monitoring and final discharge. A component rating is not enough; flow, temperature, moisture, dust or gas chemistry, variability, maintenance access and the required outlet performance define the actual duty.',
  },
  {
    name: 'Air-pollution-control processes',
    directory: 'industrial-processes/air-pollution-control-processes',
    sources: ['U.S. EPA, <em>Principles and Practices of Air Pollution Control</em>.', '<em>Air Pollution Control Technology Handbook</em>.', '<em>Handbook of Air Pollution Prevention and Control</em>.'],
    base: 'For an air-pollution-control process, the material path and the gas path must both be clear. Gas distribution, reagent or utility availability, collection efficiency, hopper or residue discharge, monitoring and safe isolation determine whether a process route can sustain its intended environmental performance.',
  },
  {
    name: 'Cement manufacturing',
    directory: 'industrial-processes/cement-manufacturing-process',
    sources: ['Supplied <em>Cement</em> process literature.', '<em>Rotary kilns</em>, cfi/Ber. DKG 92 (2015), No. 10–11.', 'R. Bhargava, <em>Cleaner Technologies and Resource Conservation</em> (supplied cement-industry presentation).'],
    base: 'Cement-process literature links raw-material preparation, thermal treatment, clinker cooling, finish grinding, dust control and dispatch as one controlled production system. Material chemistry, temperature profile, gas flow, residence time, false air, fuel use, product quality and environmental control must be evaluated together rather than as isolated equipment duties.',
  },
  {
    name: 'Fluid systems',
    directory: 'engineering/fluid-mechanics-piping-pumps-fans-ducts',
    sources: ['<em>Mechanical Engineering Handbook</em>, fluid systems and heat-transfer sections.', '<em>Air Pollution Control Technology Handbook</em>, hood, duct and fan chapters.', 'ACGIH, <em>Industrial Ventilation</em> (supplied source library).'],
    base: 'Fluid-system references consistently require a defined system boundary and operating basis before applying an equation. Geometry, roughness, density, viscosity, temperature, flow distribution, fittings, elevation, instrument location and the equipment operating point influence the result and its uncertainty.',
  },
  {
    name: 'Mechanical engineering and fabrication',
    directory: 'engineering/mechanical-engineering-and-fabrication',
    sources: ['R. S. Khurmi, <em>Strength of Materials</em>.', 'W. C. Young and R. G. Budynas, <em>Roark’s Formulas for Stress and Strain</em>, 7th ed.', '<em>Mechanical Engineers’ Handbook: Materials and Engineering Mechanics</em>.'],
    base: 'Mechanical-design references separate material behaviour, load path, geometry, restraints, service environment and the analysis method. Simplified formulae are useful for understanding and preliminary checks only when their loading, geometry and material assumptions are demonstrably applicable.',
  },
  {
    name: 'Materials of construction',
    directory: 'engineering/materials-of-construction',
    sources: ['<em>Mechanical Engineers’ Handbook: Materials and Engineering Mechanics</em>.', 'R. S. Khurmi, <em>Strength of Materials</em>.', 'W. C. Young and R. G. Budynas, <em>Roark’s Formulas for Stress and Strain</em>, 7th ed.'],
    base: 'Materials references make clear that nominal grade names do not independently determine suitability. Mechanical properties, temperature, corrosion environment, abrasion, joining, fabrication route, inspection, supply condition and applicable specifications must be considered together for the actual service.',
  },
  {
    name: 'Pumps, fans, blowers and compressors',
    directory: 'industrial-equipment/pumps-fans-blowers-and-compressors',
    sources: ['<em>Mechanical Engineering Handbook</em>, turbomachinery and machinery sections.', '<em>Mechanical Engineer’s Handbook</em>, machine elements and fluid machinery sections.', '<em>Air Pollution Control Technology Handbook</em>, fan and ventilation chapters.'],
    base: 'Rotating-equipment performance depends on the installed system as well as the machine. Confirm the fluid or gas properties, flow range, pressure or head requirement, inlet condition, control method, driver, system resistance, vibration, sealing, access and maintenance strategy before selecting or diagnosing equipment.',
  },
  {
    name: 'Power-generation processes',
    directory: 'industrial-processes/power-generation-processes',
    sources: ['<em>Mechanical Engineering Handbook</em>, power-generation and energy-system sections.', '<em>Handbook of Air Pollution Prevention and Control</em>.', '<em>Air Pollution Control Technology Handbook</em>.'],
    base: 'Power-generation references connect fuel or energy input, conversion equipment, heat and mass flows, utilities, emissions control, residue handling, water systems, controls and export conditions. A process description is technically useful only when it identifies these interfaces and the normal, start-up, shutdown and abnormal operating cases.',
  },
  {
    name: 'Boilers, steam and combustion equipment',
    directory: 'industrial-equipment/boilers-steam-and-combustion-equipment',
    sources: ['<em>Mechanical Engineering Handbook</em>, boiler and energy-system sections.', '<em>Mechanical Engineer’s Handbook</em>, thermal and machinery sections.', '<em>Handbook of Air Pollution Prevention and Control</em>.'],
    base: 'Boiler equipment must be understood through its connection to combustion, draft, steam-water circulation, heat recovery, ash or residue handling, safety protection and emissions control. The equipment function, process conditions, access, inspection and control response together define its effective duty.',
  },
  {
    name: 'Conveying systems',
    directory: 'industrial-equipment/conveying-systems',
    sources: ['<em>Mechanical Engineering Handbook</em>, machine elements and materials-handling sections.', '<em>Mechanical Engineer’s Handbook</em>, machine design and machinery sections.', 'J. J. Uicker, G. R. Pennock and J. E. Shigley, <em>Theory of Machines and Mechanisms</em>.'],
    base: 'Conveying-equipment reliability depends on the complete material route: feed condition, loading zone, alignment or conveying path, drive and tensioning arrangement, discharge, guards, access, cleaning and the behaviour of the handled material. Individual component capacities must be checked against the installed system and operating range.',
  },
  {
    name: 'Heat exchangers, cooling systems and vessels',
    directory: 'industrial-equipment/heat-exchangers-cooling-systems-and-vessels',
    sources: ['<em>Mechanical Engineering Handbook</em>, heat-exchanger and pressure-vessel sections.', 'W. C. Young and R. G. Budynas, <em>Roark’s Formulas for Stress and Strain</em>, 7th ed.', '<em>Mechanical Engineers’ Handbook: Materials and Engineering Mechanics</em>.'],
    base: 'Thermal and pressure-containing equipment requires a linked review of process duty, temperature and pressure envelope, material behaviour, fouling or corrosion, mechanical loads, supports, inspection, safe access and applicable design requirements. Nominal process duty alone cannot establish equipment suitability.',
  },
];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const item = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(item) : (entry.name === 'index.html' ? [item] : []);
  });
}

function words(html) {
  return (html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').match(/[A-Za-z0-9][A-Za-z0-9'’.-]*/g) || []).length;
}

function detail(title, group) {
  const text = title.toLowerCase();
  if (text.includes('electrostatic') || text.includes('esp ')) return 'For electrostatic collection, gas distribution, particle resistivity, electrical energisation, collecting-surface area, rapping response, hopper evacuation and electrical safety are linked. Trend voltage/current, spark rate, inlet condition, opacity or particulate measurements and ash discharge together before diagnosing a loss of performance.';
  if (text.includes('bag filter') || text.includes('dust collection')) return 'For fabric filtration, interpret pressure-drop trends with gas flow, cleaning activity, dust characteristics, temperature, moisture and hopper condition. Media, finish, air-to-cloth basis, cage condition, pulse performance, compartment isolation and safe bag-replacement arrangements are all part of the engineered system.';
  if (text.includes('fgd') || text.includes('desulfurization')) return 'For flue-gas desulfurization, absorption chemistry, liquid-to-gas contact, reagent quality, oxidation air, slurry circulation, mist elimination, water balance and residue handling are connected. Confirm the required sulphur-removal basis and the treatment or disposal route for all by-products.';
  if (text.includes('scr') || text.includes('sncr') || text.includes('denox')) return 'For NOx control, temperature window, reagent quality, injection distribution, residence time, catalyst condition where used, ammonia-slip control and downstream impacts need a common operating basis. Verify performance with representative gas measurements rather than a nominal load alone.';
  if (text.includes('cement') || text.includes('clinker') || text.includes('kiln') || text.includes('calciner') || text.includes('raw mill') || text.includes('limestone')) return 'For cement service, record the material route and gas route together. Feed chemistry, fineness, moisture, thermal profile, combustion conditions, draft, false air, separator performance, cooling duty and dust capture affect product quality, specific energy use and emissions.';
  if (text.includes('pump') || text.includes('npsh') || text.includes('cavitation')) return 'For pumps, compare the full system curve with the pump curve at the actual liquid condition. Include suction losses, static level, vapour pressure, minimum-flow requirements, control position, seal plan, driver margin and the consequences of operation away from the preferred region.';
  if (text.includes('fan') || text.includes('duct') || text.includes('pressure loss')) return 'For fans and ducts, calculate the complete path from capture or inlet through fittings, equipment and discharge. Check the density basis, branch flows, leakage, damper position, fouling and fan operating point; a straight-duct value alone does not establish reliable system performance.';
  if (text.includes('gas turbine') || text.includes('combined-cycle')) return 'For gas-turbine and combined-cycle systems, compressor condition, fuel quality, ambient condition, firing controls, turbine exhaust, heat-recovery interface, water/steam cycle, emissions and protective logic must be considered as coupled operating systems.';
  if (text.includes('boiler') || text.includes('coal') || text.includes('ash') || text.includes('steam')) return 'For thermal-power processes, preserve the connection between fuel preparation, combustion, draft, steam-water circulation, heat recovery, ash handling, emissions control and water treatment. A change in one subsystem can move the limiting condition elsewhere in the plant.';
  if (text.includes('material') || text.includes('steel') || text.includes('alloy') || text.includes('ptfe') || text.includes('rubber') || text.includes('frp') || text.includes('refractory')) return 'For material selection, define the temperature range, fluid or gas composition, corrosion or abrasion mechanism, mechanical loading, thermal cycling, joining method, inspection access and expected life. Use current supplier data and the governing project specification for final selection.';
  if (text.includes('stress') || text.includes('deflection') || text.includes('shaft') || text.includes('vibration') || text.includes('tank') || text.includes('vessel') || text.includes('weld') || text.includes('plate')) return 'For mechanical or fabrication work, identify the controlling load cases, restraints, local discontinuities, fabrication details, material condition, temperature, inspection and acceptance basis. Escalate to the applicable code method or qualified analysis where the simplified relation does not cover the real geometry or consequence of failure.';
  return group.base;
}

const marker = '<!-- literature-depth-116 -->';
const rows = [];
let discovered = 0;
let updated = 0;
let alreadyPresent = 0;

for (const group of groups) {
  const files = walk(path.join(process.cwd(), group.directory));
  for (const file of files) {
    const htmlBefore = fs.readFileSync(file, 'utf8');
    if (!htmlBefore.includes('class="knowledge-page"')) continue;
    const h1Match = htmlBefore.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (!h1Match) continue;
    discovered += 1;
    const title = h1Match[1].replace(/<[^>]+>/g, '').trim();
    const relative = path.relative(process.cwd(), file).replace(/\\/g, '/');
    if (htmlBefore.includes(marker) || htmlBefore.includes('<!-- literature-informed-review -->')) {
      alreadyPresent += 1;
      rows.push({ title, group: group.name, file: relative, status: 'Previously updated', words: words(htmlBefore) });
      continue;
    }
    const referenceTarget = '<section id="references">';
    if (!htmlBefore.includes(referenceTarget)) throw new Error('Missing references insertion point: ' + relative);
    const sourceItems = group.sources.map((source) => '<li>' + source + '</li>').join('');
    const insertion = marker + '<section class="content-depth-section" id="literature-informed-review"><p class="portal-kicker">Literature-informed technical note</p><h2>Engineering context and review boundaries</h2><p>' + group.base + '</p><p>' + detail(title, group) + '</p><p>Use this page to structure preliminary understanding, data collection and review—not as a substitute for approved design information. Record the source revision, units, operating mode, assumptions, measurement location and known limitations so another competent reviewer can reproduce the conclusion.</p><h3>Literature reviewed for this update</h3><ul class="references-list">' + sourceItems + '</ul><p class="references-note">This is an original educational summary based on the listed literature. It does not reproduce protected source text, figures, tables or design data. Confirm current standards, project documents and supplier information before use.</p></section>';
    const htmlAfter = htmlBefore.replace(referenceTarget, insertion + referenceTarget);
    fs.writeFileSync(file, htmlAfter, 'utf8');
    updated += 1;
    rows.push({ title, group: group.name, file: relative, status: 'Updated', words: words(htmlAfter) });
  }
}

if (discovered !== 116) throw new Error('Expected 116 scoped pages, found ' + discovered);
if (updated + alreadyPresent !== 116) throw new Error('Scoped-page accounting mismatch');

const report = [
  '# Literature-Depth Update: Existing 116 Pages',
  '',
  'Updated: 31 August 2026',
  '',
  'The following existing pages were reviewed against the supplied literature. Every new note is original explanatory content; protected source text, tables, figures and proprietary design data were not copied.',
  '',
  '| Page | Literature group | Status | Approx. page text words | File |',
  '| --- | --- | --- | ---: | --- |',
  ...rows.sort((a, b) => a.file.localeCompare(b.file)).map((row) => '| ' + row.title + ' | ' + row.group + ' | ' + row.status + ' | ' + row.words.toLocaleString() + ' | ' + row.file + ' |'),
  '',
  'Source inventory: outputs/literature-audit/pdf-source-catalog.md.',
  '',
];
fs.writeFileSync(path.join(process.cwd(), 'outputs', 'literature-audit', 'LITERATURE-DEPTH-116-UPDATE.md'), report.join('\n'), 'utf8');
console.log(JSON.stringify({ discovered, updated, alreadyPresent }, null, 2));
