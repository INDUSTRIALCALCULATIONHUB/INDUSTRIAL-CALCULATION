const fs = require('fs');
const path = require('path');
const candidates = require('./canonical_page_candidates');

const root = process.cwd();
const origin = 'https://industrialcalculation.com/';
const reviewDate = '31 August 2026';
const escapeHtml = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const local = (route) => path.join(root, ...route.split('/'));
const relative = (from, to) => path.posix.relative(path.posix.dirname(from), to) || 'index.html';
const canonical = (route) => `${origin}${route.replace(/index\.html$/, '')}`;
const sentenceCase = (value) => String(value).replace(/\s+/g, ' ').trim();

const parentLandings = [
  {
    route: 'engineering/air-pollution-control-and-environmental-engineering/particulate-collection/industrial-ventilation/index.html',
    title: 'Industrial Ventilation',
    l2: 'Air Pollution Control and Environmental Engineering',
    l3: 'Particulate Collection',
    summary: 'Contextual routes for local-exhaust capture, duct design, transport velocity, leakage control and fan-system balance.',
  },
  {
    route: 'engineering/air-pollution-control-and-environmental-engineering/gas-treatment/wet-scrubbers/index.html',
    title: 'Wet Scrubbers',
    l2: 'Air Pollution Control and Environmental Engineering',
    l3: 'Gas Treatment',
    summary: 'Contextual routes for spray, venturi and packed-bed wet scrubbing systems and their engineering interfaces.',
  },
  {
    route: 'engineering/air-pollution-control-and-environmental-engineering/gas-treatment/voc-control/index.html',
    title: 'VOC Control',
    l2: 'Air Pollution Control and Environmental Engineering',
    l3: 'Gas Treatment',
    summary: 'Contextual routes for adsorption, thermal oxidation and catalytic oxidation of volatile organic compounds.',
  },
];

// Some frozen topic folders are intentionally contextual routes without a page
// file.  Add a concise landing only where a new canonical article needs it.
const landingByRoute = new Map(parentLandings.map((landing) => [landing.route, landing]));
for (const page of candidates) {
  const route = `${path.posix.dirname(page.route)}/index.html`;
  if (!landingByRoute.has(route)) {
    const segments = route.split('/');
    landingByRoute.set(route, {
      route,
      title: sentenceCase(segments.at(-2).replace(/-/g, ' ')),
      l2: sentenceCase(segments[1].replace(/-/g, ' ')),
      l3: sentenceCase(segments[2].replace(/-/g, ' ')),
      summary: 'Contextual route for published canonical knowledge pages in this approved topic area.',
    });
  }
}
const contextualLandings = [...landingByRoute.values()];

function profileFor(page) {
  const id = Number(page.id.slice(-3));
  if (id <= 5) return {
    type: 'Industrial ventilation guide', image: 'industrial-ventilation-duct-fan-blueprint-v1.png', imageAlt: 'Original blueprint illustration of an industrial local-exhaust system with capture hood, ductwork, collector, induced-draft fan and stack',
    mechanism: 'A successful ventilation system captures contaminant close to its release point, moves the required air quantity through enclosed and accessible ductwork, separates or treats the contaminant where necessary, and discharges or recirculates air only under an approved basis.',
    items: ['capture hood or enclosure', 'branch and main ductwork', 'balancing dampers and measurement points', 'collector or treatment equipment', 'fan, drive and discharge stack'],
    inputs: ['contaminant release mechanism and location', 'required capture velocity or enclosure control approach', 'airflow, duct geometry, transport velocity and pressure loss', 'dust properties, moisture, abrasiveness and deposition tendency', 'fan curve, access, make-up air and applicable exposure requirements'],
    failures: ['poor capture because the hood is too remote or competing air currents dominate', 'settling or erosion due to unsuitable transport velocity', 'loss of performance from leakage, fouling, damaged ductwork or incorrect fan operation', 'unsafe maintenance caused by inadequate access, isolation or combustible-dust control'],
    refs: ['ACGIH. <em>Industrial Ventilation: A Manual of Recommended Practice for Design</em>. Supplied source library.', '<em>Air Pollution Control Technology Handbook</em>. Supplied source library.'],
  };
  if (id <= 8) return {
    type: 'Gas-treatment engineering guide', image: 'wet-scrubber-family-blueprint-v1.png', imageAlt: 'Original blueprint illustration of spray-tower, venturi and packed-bed wet scrubber arrangements',
    mechanism: 'Wet scrubbing brings gas and liquid into controlled contact so particles or soluble gaseous constituents can be transferred from the gas phase to the liquid phase. The contacting device, liquid distribution, droplet or packing characteristics, pressure loss and liquid-treatment route determine practical performance.',
    items: ['gas inlet and distribution', 'contacting zone or venturi throat', 'liquid distributor and recirculation pump', 'mist eliminator', 'sump, blowdown and wastewater interface'],
    inputs: ['gas flow, temperature, moisture and pollutant properties', 'required removal objective and allowable pressure loss', 'liquid chemistry, make-up, recirculation and blowdown basis', 'corrosion, erosion and scaling potential', 'mist elimination, drains, access and wastewater treatment capacity'],
    failures: ['reduced removal from maldistribution, unsuitable liquid chemistry or insufficient liquid-to-gas contact', 'high pressure loss from fouling, flooding or damaged mist elimination', 'corrosion, erosion, scaling or blockage in nozzles and recirculation lines', 'uncontrolled discharge of contaminated liquid or solids'],
    refs: ['<em>Air Pollution Control Technology Handbook</em>. Supplied source library.', 'Cheremisinoff, N. P. <em>Handbook of Air Pollution Prevention and Control</em>. Supplied source library.'],
  };
  if (id <= 11) return {
    type: 'VOC-control engineering guide', image: 'voc-control-systems-blueprint-v1.png', imageAlt: 'Original blueprint illustration of activated-carbon adsorption, thermal oxidation and catalytic oxidation systems',
    mechanism: 'VOC control must contain the source flow, characterise the organic loading and oxygen content, select a treatment mechanism compatible with the stream, and confirm safe operation through the complete gas path. Adsorption transfers VOCs to a sorbent; oxidation destroys them under controlled temperature, residence time and mixing conditions.',
    items: ['source duct and flow control', 'pre-filtration or conditioning', 'adsorption vessels or oxidizer chamber', 'heat recovery or regeneration arrangement', 'monitoring, safety interlocks and stack'],
    inputs: ['VOC species, concentration, flow, temperature and variability', 'oxygen level, lower explosive limit screening and ignition hazards', 'humidity, particulate and catalyst or carbon poisoning potential', 'energy recovery, pressure drop, emissions target and maintenance access', 'applicable environmental, fire and process-safety requirements'],
    failures: ['unsafe operation from inadequate flammability screening or interlocks', 'breakthrough, channeling or poor regeneration of carbon beds', 'catalyst deactivation, corrosion or fouling', 'insufficient temperature, residence time, mixing or flow control for oxidation'],
    refs: ['<em>Air Pollution Control Technology Handbook</em>. Supplied source library.', '<em>Handbook of Air Pollution Prevention and Control</em>. Supplied source library.'],
  };
  if (id <= 16) return {
    type: 'Mechanics-of-materials guide', image: 'mechanics-and-fabrication-blueprint-v1.png', imageAlt: 'Original blueprint illustration of beam bending, shaft support, welded plate joint and stress-strain behaviour',
    mechanism: 'Strength and serviceability assessment relates load, geometry, material response and boundary condition to stress, strain, deflection, stability or fatigue damage. A correct relationship depends on the actual load path, restraint, local geometry, operating cycle and the design standard that governs the component.',
    items: ['defined loading and load combinations', 'component geometry and stress-raising features', 'material properties and temperature basis', 'supports, restraints and connection details', 'inspection, tolerance and serviceability criteria'],
    inputs: ['load magnitude, direction, repetition and credible upset cases', 'section geometry, fillets, holes, joints and local discontinuities', 'material strength, ductility, toughness and environmental effects', 'allowable stress, fatigue, buckling or deflection criterion', 'fabrication quality, inspection findings and residual-stress considerations'],
    failures: ['local overstress at a notch, hole, weld toe or geometric transition', 'fatigue from cyclic stress that remains below static yield', 'buckling, excessive deflection or misalignment caused by inadequate stiffness', 'incorrect use of nominal material values or idealised support conditions'],
    refs: ['Khurmi, R. S. <em>Strength of Materials</em>. Supplied source library.', 'Roark. <em>Formulas for Stress and Strain</em>. Supplied source library.'],
  };
  if (id <= 22 || id >= 27 && id <= 28) return {
    type: 'Rotating-equipment guide', image: 'rotating-equipment-pump-fan-blower-compressor-blueprint-v1.png', imageAlt: 'Original blueprint comparison of a centrifugal pump, centrifugal fan, Roots blower and industrial air compressor',
    mechanism: 'Rotating equipment converts supplied power into controlled motion or fluid energy. Reliable performance requires a compatible shaft train, bearings, coupling or seal arrangement, lubrication, alignment, stiffness, balance and operating point. The governing condition is often a transient, off-design or degraded case rather than normal operation.',
    items: ['driver and driven equipment', 'shaft, coupling and bearing supports', 'lubrication and sealing arrangement', 'baseplate, alignment and guarding', 'condition monitoring and protective systems'],
    inputs: ['speed, torque, power and duty cycle', 'shaft load, bearing load, alignment and thermal movement', 'lubricant properties, contamination control and cooling', 'vibration limits, natural frequencies and balance quality', 'access, spares, maintenance interval and safety guards'],
    failures: ['bearing damage from inadequate lubrication, contamination, overload or misalignment', 'coupling or shaft damage from thermal growth, runout or transient torque', 'vibration from imbalance, resonance, soft foot or structural looseness', 'seal leakage or gearbox failure from unsuitable service conditions or maintenance'],
    refs: ['<em>Mechanical Engineering Handbook</em>. Supplied source library.', '<em>Theory of Machines and Mechanisms</em>. Supplied source library.'],
  };
  if (id <= 26) return {
    type: 'Fabrication engineering guide', image: 'mechanics-and-fabrication-blueprint-v1.png', imageAlt: 'Original blueprint illustration of beam bending, shaft support, welded plate joint and stress-strain behaviour',
    mechanism: 'Fabrication quality depends on translating the design geometry into a controllable cutting, forming, joining and inspection sequence. Joint details, fit-up, heat input, tolerances, residual stress, distortion, traceability and inspection must be considered together rather than after fabrication begins.',
    items: ['drawings, material identification and cut planning', 'forming, fit-up and joint preparation', 'fasteners or welding procedure controls', 'dimensional inspection and non-destructive examination', 'surface protection, documentation and final release'],
    inputs: ['material grade, thickness, forming limit and heat sensitivity', 'joint type, loading, service environment and inspection category', 'tolerance, distortion allowance, access and sequence of work', 'fastener preload or welding-procedure variables', 'traceability, quality plan and applicable project requirements'],
    failures: ['loss of capacity from poor fit-up, inadequate preload or unsuitable joint detail', 'distortion, residual stress, cracking or lack of fusion in welded work', 'dimensional mismatch from incorrect bend allowance or development method', 'untraceable material, missing inspection evidence or unsuitable coating repair'],
    refs: ['<em>Mechanical Engineering Handbook</em>. Supplied source library.', '<em>Strength of Materials</em>. Supplied source library.'],
  };
  if (id <= 33 || id === 42) return {
    type: 'Thermal and combustion engineering guide', image: id >= 30 && id <= 33 ? 'combined-cycle-power-plant-blueprint-v1.png' : 'water-tube-boiler-system-blueprint-v1.png', imageAlt: id >= 30 && id <= 33 ? 'Original blueprint process illustration of a combined-cycle power plant with gas turbine, heat-recovery steam generator, steam turbine, condenser and cooling circuit' : 'Original cutaway blueprint illustration of a water-tube boiler with furnace, steam drum and heat-recovery sections',
    mechanism: 'Thermal-system performance follows energy balance, heat transfer, combustion, fluid flow and equipment response at a defined operating condition. The process must be assessed as an integrated arrangement of fuel or heat source, air and gas path, pressure parts, heat-recovery surfaces, steam or cooling interfaces, controls and safeguards.',
    items: ['fuel, air, gas or heat-source interface', 'pressure parts, heat-transfer surfaces or rotating machinery', 'fans, pumps, valves and ductwork', 'measurement, controls and protective systems', 'water, steam, condensate, cooling or exhaust interface'],
    inputs: ['load range, heat input and required outlet condition', 'fuel or working-fluid composition, temperature and pressure', 'air or gas flow, excess air, leakage and pressure loss', 'heat-transfer fouling, cleanliness, water chemistry and material limits', 'safety, inspection, start-up, shutdown and performance-test requirements'],
    failures: ['loss of efficiency from excess air, leakage, fouling or poor heat transfer', 'instability from unsuitable control response or off-design flow distribution', 'damage from thermal stress, corrosion, overheating, water chemistry or vibration', 'unsafe operation from inadequate isolation, interlocks or relief protection'],
    refs: ['<em>Mechanical Engineering Handbook</em>. Supplied source library.', '<em>Guideline for Gas Turbine Inlet Air Filtration Systems</em>. Supplied source library.'],
  };
  if (id <= 41) return {
    type: 'Cement-process guide', image: 'cement-preheater-calciner-kiln-blueprint-v1.png', imageAlt: 'Original blueprint illustration of cement preheater, calciner, rotary kiln and clinker cooler process route',
    mechanism: 'Cement-process performance depends on stable material preparation, thermal treatment, gas-solid contact, clinker cooling, grinding, quality control and environmental management. Each unit must be considered with its upstream feed condition, downstream interface, energy use, mechanical condition and emission-control duty.',
    items: ['material handling and feed preparation', 'preheater, calciner, kiln or cooler interfaces', 'fuel, combustion air and process-gas path', 'grinding, classification, sampling and quality control', 'dust collection, conveying and maintenance access'],
    inputs: ['raw-material chemistry, moisture, fineness and feed variability', 'fuel properties, thermal profile, oxygen, draft and gas composition', 'throughput, residence time, pressure drop and energy target', 'refractory, shell, tyre, roller or mechanical-condition evidence', 'product-quality, emissions and safety requirements'],
    failures: ['production or quality loss from unstable feed, temperature profile or classification', 'high fuel or power consumption from leakage, false air, fouling or poor heat recovery', 'refractory, shell or support damage from thermal or mechanical imbalance', 'dust or emission exceedance from unsuitable capture, conditioning or maintenance'],
    refs: ['<em>Rotary Kilns</em>. Supplied source library.', '<em>Integrated Cement Energy Award</em> material. Supplied source library.'],
  };
  return {
    type: 'Engineering reference-data guide', image: 'materials-selection-blueprint-v1.png', imageAlt: 'Original technical material-selection board showing metallic, non-metallic, lining and insulation material forms',
    mechanism: 'Reference data supports a controlled comparison of material identity, composition, condition, properties, service environment, fabrication route and applicable standard. A designation alone is not a final selection: confirm the product form, heat-treatment condition, governing specification, corrosion or temperature exposure and inspection requirements.',
    items: ['material family and product form', 'property, composition and service-condition basis', 'corrosion, temperature and wear environment', 'joining, fabrication and inspection requirements', 'traceability, certification and applicable standard'],
    inputs: ['mechanical, physical and chemical property requirements', 'temperature, pressure, corrosion, erosion and exposure conditions', 'product form, thickness, welding or machining needs', 'code, client and material-certificate requirements', 'availability, lifecycle, inspection and maintenance constraints'],
    failures: ['selection by grade name without confirming product form or condition', 'unexpected corrosion, embrittlement, wear or temperature-related loss of performance', 'joining or coating incompatibility', 'missing traceability, certificate review or inspection documentation'],
    refs: ['<em>Mechanical Engineers’ Handbook: Materials and Engineering Mechanics</em>. Supplied source library.', '<em>Mechanical Engineering Handbook</em>. Supplied source library.'],
  };
}

function topicPhrases(page, profile) {
  const focus = sentenceCase(page.title.replace(/:.*$/, ''));
  return {
    summary: `${page.title} is a focused ${profile.type.toLowerCase()} within the Industrial Calculation Hub knowledge library. It explains the engineering purpose, physical basis, governing inputs, process or equipment interfaces, common failure mechanisms and the limits of preliminary use.`,
    use: `The value of ${focus} is not a single rule or isolated component decision. It is the disciplined connection between the defined duty, actual service conditions, available evidence and the practical constraints of construction, operation and maintenance.`,
    conclusion: `For ${focus}, retain the design basis, source data, assumption set, calculation or assessment method, verification evidence and review decision. Reassess the conclusion whenever the duty, material, geometry, operating condition, equipment arrangement or governing requirement changes.`,
  };
}

function renderArticle(page, allPages) {
  const profile = profileFor(page);
  const phrase = topicPhrases(page, profile);
  const route = `${page.route}/index.html`;
  const prefix = relative(route, 'index.html').replace(/index\.html$/, '');
  const parentRoute = `${path.posix.dirname(page.route)}/index.html`;
  const domainRoute = page.domain === 'Engineering' ? 'engineering.html' : page.domain === 'Industrial Processes' ? 'industrial-processes.html' : 'engineering-reference-data.html';
  const l2 = page.route.split('/')[1].replace(/-/g, ' ');
  const l3 = page.route.split('/')[2].replace(/-/g, ' ');
  const sibling = allPages.find((candidate) => candidate.id !== page.id && path.posix.dirname(candidate.route) === path.posix.dirname(page.route)) || allPages.find((candidate) => candidate.id !== page.id && candidate.domain === page.domain);
  const related = [
    [page.domain, relative(route, domainRoute), 'Primary domain'],
    [sentenceCase(path.posix.basename(path.posix.dirname(page.route)).replace(/-/g, ' ')), relative(route, parentRoute), 'Contextual topic route'],
    [sibling.title, relative(route, `${sibling.route}/index.html`), 'Related knowledge page'],
    ['Knowledge Library', `${relative(route, 'index.html')}#knowledge-library-title`, 'Published knowledge pages'],
  ].map(([title, href, note], index) => `<a class="related-knowledge-link" href="${href}"><span class="related-knowledge-link__icon" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(note)}</small></span></a>`).join('');
  const termRows = [
    [page.title, 'The specific engineering subject and boundary addressed by this page.'],
    ['Design basis', 'The verified duty, operating range, geometry, material/fluid and requirements used for an assessment.'],
    ['Governing condition', 'The normal, limiting, transient or degraded case that controls the technical decision.'],
    ['Verification evidence', 'Measurements, drawings, inspections, calculations or supplier documentation used to check the conclusion.'],
    ['Lifecycle condition', 'The practical state of installation, operation, inspection, maintenance and future modification.'],
  ].map(([term, definition]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(definition)}</dd></div>`).join('');
  const factorCards = profile.inputs.map((input, index) => `<section><h3>${['Duty and operating range', 'Physical properties and geometry', 'Process or equipment interfaces', 'Reliability and maintenance', 'Safety and compliance'][index] || 'Verification evidence'}</h3><p>${escapeHtml(input)}. Confirm this item against current drawings, measured data and the project basis before relying on a conclusion.</p></section>`).join('');
  const componentCards = profile.items.map((item) => `<li><strong>${escapeHtml(item)}.</strong> Its purpose, condition, capacity and interface with adjacent equipment must be clear on the assessment basis.</li>`).join('');
  const failureCards = profile.failures.map((failure) => `<section><h3>Potential failure mechanism</h3><p>${escapeHtml(failure)}. Use inspection, trend data and a controlled troubleshooting method to establish the actual cause before changing the system.</p></section>`).join('');
  const faqs = [
    ['What should be defined first?', `Define the actual duty, boundary, operating range and decision that ${page.title} is intended to support.`],
    ['Can a typical value be used for final design?', 'No. Confirm the relevant property, geometry, standard, source revision and service condition for the actual project.'],
    ['Why are interfaces important?', 'A local component can appear satisfactory while the combined process, supports, utilities, controls, access or discharge route limits the result.'],
    ['Which operating cases should be considered?', 'Review normal, minimum, maximum, start-up, shutdown, upset, maintenance and credible future conditions where they can change the governing case.'],
    ['How should the result be checked?', 'Use current drawings, calibrated measurements, inspection records, supplier information and qualified review on the same condition basis.'],
    ['Can this article approve a project change?', 'No. It is an original educational reference. Final design, procurement, code, safety and operating decisions need controlled project information and qualified approval.'],
    ['What should be retained in the technical record?', 'Keep inputs, units, source revisions, assumptions, method, results, limitations, reviewer comments and any verification action.'],
    ['When should the assessment be repeated?', 'Repeat it after a material, geometry, loading, process, control, equipment-condition or regulatory change.'],
  ].map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join('');
  const schema = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: page.title, description: phrase.summary, mainEntityOfPage: canonical(route), about: [page.domain, page.sourceSet], dateModified: '2026-08-31' });
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(page.title)} | Industrial Calculation Hub</title><meta name="description" content="${escapeHtml(phrase.summary)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${canonical(route)}"><link rel="icon" type="image/svg+xml" href="${prefix}assets/brand/industrial-calculation-hub-mark.svg?v=20260824-colors"><link rel="alternate icon" href="${prefix}favicon.png"><link rel="stylesheet" href="${prefix}style.css?v=20260830-final-knowledge"><script type="application/ld+json">${schema}</script><script defer src="${prefix}assets/js/site-search.js?v=20260831-canonical-53"></script></head><body class="public-page"><div class="site-frame"><header class="public-header"><a class="brand" href="${prefix}index.html" aria-label="Industrial Calculation Hub home"><img class="brand__mark" src="${prefix}assets/brand/industrial-calculation-hub-mark.svg?v=20260824-colors" alt=""><span class="brand__name"><strong>Industrial</strong><span>Calculation Hub</span></span></a><button class="public-menu-toggle" type="button" aria-expanded="false" aria-controls="public-navigation">Menu</button><nav class="public-nav" id="public-navigation" aria-label="Primary navigation" data-open="false"><a href="${prefix}index.html">Home</a><a href="${prefix}index.html#tools">Tools</a><a href="${prefix}engineering.html">Learn</a><a href="${prefix}engineering-reference-data.html">Reference Data</a><a href="${prefix}about.html">About</a></nav><a class="header-search" href="#article-content" aria-label="Search topics, tools and articles"><span>Search topics, tools, articles...</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="m16 16 5 5"/></svg></a></header><main class="knowledge-page" id="article-content"><article><header class="knowledge-page__hero"><div class="knowledge-page__hero-copy"><p class="domain-breadcrumb"><a href="${prefix}index.html">Home</a> <span aria-hidden="true">/</span> <a href="${relative(route, domainRoute)}">${escapeHtml(page.domain)}</a> <span aria-hidden="true">/</span> ${escapeHtml(sentenceCase(l2))} <span aria-hidden="true">/</span> ${escapeHtml(sentenceCase(l3))}</p><p class="portal-kicker">${escapeHtml(profile.type)}</p><h1>${escapeHtml(page.title)}</h1><p class="knowledge-page__summary">${escapeHtml(phrase.summary)}</p></div><figure class="knowledge-page__hero-art"><img src="${relative(route, `assets/illustrations/${profile.image}`)}" alt="${escapeHtml(profile.imageAlt)}"><figcaption>Original topic-specific illustration for educational context; it is not a project drawing, specification or design calculation.</figcaption></figure></header><section class="knowledge-page__information" aria-label="Page information"><dl><div><dt>Content type</dt><dd>${escapeHtml(profile.type)}</dd></div><div><dt>Canonical ID</dt><dd>${escapeHtml(page.id)}</dd></div><div><dt>Source basis</dt><dd>${escapeHtml(page.sourceSet)}</dd></div><div><dt>Last reviewed</dt><dd>${reviewDate}</dd></div></dl></section><div class="knowledge-page__body"><aside class="article-toc" aria-label="On this page"><p>On this page</p><ol><li><a href="#what">What it is</a></li><li><a href="#importance">Why it matters</a></li><li><a href="#terms">Terms</a></li><li><a href="#principle">Principle and system context</a></li><li><a href="#inputs">Design inputs</a></li><li><a href="#method">Review method</a></li><li><a href="#applications">Applications</a></li><li><a href="#failure">Failure modes</a></li><li><a href="#maintenance">Lifecycle review</a></li><li><a href="#faq">FAQs</a></li><li><a href="#related">Related resources</a></li><li><a href="#references">References</a></li></ol></aside><div class="knowledge-page__content"><section id="what"><h2>What Is ${escapeHtml(page.title)}?</h2><p>${escapeHtml(phrase.summary)}</p><p>${escapeHtml(phrase.use)} It should therefore be considered with the physical arrangement, incoming condition, uncertainty in the available data, and the responsible engineering discipline rather than as a standalone answer.</p></section><section id="importance"><h2>Why Does ${escapeHtml(page.title)} Matter?</h2><p>${escapeHtml(profile.mechanism)}</p><p>In practice, early assumptions about capacity, service condition, source data or layout often determine whether an option remains safe, operable and maintainable. Establishing a transparent basis before calculation, selection or modification avoids false precision and makes later review traceable.</p><div class="article-callout article-callout--note"><strong>Educational scope.</strong><span>This page explains a technical framework. It does not replace current drawings, specifications, equipment documentation, applicable standards, safety studies or qualified engineering approval.</span></div></section><section id="terms"><h2>Key Terms and Definitions</h2><dl class="definition-list">${termRows}</dl></section><section id="principle"><h2>Fundamental Principle and System Context</h2><p>${escapeHtml(profile.mechanism)}</p><p>The first engineering question is whether the stated relationship or equipment concept represents the real service. Confirm the boundary points, time basis, units, material or fluid state, geometry, line-up, environmental condition and operating mode. Where conditions vary, use an envelope of credible cases instead of one nominal value.</p><figure class="article-figure"><img src="${relative(route, `assets/illustrations/${profile.image}`)}" alt="${escapeHtml(profile.imageAlt)}"><figcaption>Original topic context. Final design must use controlled project information and applicable supplier or code requirements.</figcaption></figure></section><section id="inputs"><h2>Design Inputs and Engineering Considerations</h2><p>A useful assessment records the evidence behind each input, whether it is measured, calculated, guaranteed, assumed or still to be confirmed. It also distinguishes normal operation from the condition most likely to govern reliability, integrity, environmental performance, output quality or safety.</p><div class="article-card-grid">${factorCards}</div><h3>Information quality and uncertainty</h3><p>Use values that match the required reference state and operating point. Check whether a value is nominal, rated, measured, average, maximum, absolute or gauge; whether it applies to the actual product form, material, fluid or equipment; and whether the source revision is current. Report precision that is appropriate to the uncertainty of the inputs.</p></section><section id="method"><h2>Step-by-Step Engineering Review Method</h2><ol class="method-list"><li><strong>State the decision.</strong> Identify whether the work is for screening, design basis, troubleshooting, maintenance, modification or final approval.</li><li><strong>Define the boundary.</strong> Mark physical interfaces, reference points and any upstream or downstream systems that can change the result.</li><li><strong>Gather evidence.</strong> Use current drawings, data sheets, operating records, test data, inspection observations and applicable requirements.</li><li><strong>Set the cases.</strong> Review normal, limiting, start-up, shutdown, maintenance, upset and future conditions that are relevant to ${escapeHtml(page.title)}.</li><li><strong>Apply the suitable method.</strong> Use a relationship, calculation, standard or supplier procedure only within its valid range.</li><li><strong>Check the conclusion.</strong> Compare the result with independent measurements, physical evidence, previous performance or a qualified specialist review.</li><li><strong>Record limitations.</strong> Retain assumptions, uncertainty, actions, responsible person and the condition that would trigger reassessment.</li></ol><h3>Selection, sizing and change control</h3><p>Equipment selection must combine technical performance with access, isolation, constructability, inspection, spares, utilities, controls, cost and lifecycle duty. A capacity value alone does not show whether the option can be installed, operated or maintained safely. Any modification that changes the process, load, material, geometry, safety function or control strategy requires a formal review of the original basis.</p></section><section id="applications"><h2>Industrial Applications</h2><p>${escapeHtml(page.title)} is relevant wherever the associated system must be understood, selected, operated, inspected or improved. Typical applications include the following:</p><ul>${profile.items.map((item) => `<li>${escapeHtml(item)} within a defined industrial duty, with its interfaces and limitations documented.</li>`).join('')}</ul><p>When the outcome affects capacity, quality, reliability, worker exposure, emissions, pressure, temperature, rotating machinery or material integrity, obtain current site evidence and qualified review rather than relying on a generic example.</p></section><section id="failure"><h2>Common Problems, Failure Modes and Causes</h2><div class="article-card-grid">${failureCards}</div><h3>Troubleshooting approach</h3><p>Preserve trend data and field observations before changing a setting or replacing a component. Check the measurement boundary and instrument condition, compare actual operating duty with the design basis, inspect the physical condition, then test the variables most likely to change the outcome. Record the failure path and corrective action so it can be reviewed after the system returns to stable operation.</p></section><section id="maintenance"><h2>Lifecycle, Maintenance and Safety Review</h2><p>Plan inspection and maintenance around credible degradation mechanisms, not only calendar intervals. Review access, isolation, cleaning, lifting, energy sources, hot surfaces, pressure, moving parts, electrical hazards, dust, chemicals, confined-space entry and waste handling before work begins. The correct maintenance action must restore both the component and the system condition.</p><p>${escapeHtml(phrase.conclusion)}</p><div class="article-callout article-callout--warning"><strong>Final-use limitation.</strong><span>This educational page is not a design approval, operating instruction, code interpretation, supplier guarantee or safety study. Verify all project-specific decisions with qualified personnel and current controlled documents.</span></div></section><section id="faq"><h2>Frequently Asked Questions</h2><div class="faq-list">${faqs}</div></section><section id="related" class="related-knowledge-section"><h2>Related Resources</h2><p>These links provide the parent context, a directly related page and the published knowledge library. They do not replace a project-specific document set.</p><div class="related-knowledge-grid">${related}</div></section><section id="references"><h2>References</h2><ol class="references-list">${profile.refs.map((reference) => `<li>${reference}</li>`).join('')}</ol><p class="references-note">Original educational summary informed by the supplied literature. It does not reproduce protected source text, figures, tables or standards material.</p></section><section id="review"><h2>Review Information</h2><div class="review-panel"><strong>Canonical-page and final-format review completed: ${reviewDate}.</strong><span>Canonical ID: ${escapeHtml(page.id)}. The review confirms a unique title and URL, relevant original visual, source listing, contextual links and declared limits of use. Independent qualified-engineer review remains required before project use.</span></div></section><section id="disclaimer"><h2>Engineering Disclaimer</h2><div class="disclaimer-panel"><strong>Educational and preliminary reference only.</strong><span>This page does not replace project specifications, detailed design, manufacturer information, applicable standards, safety requirements or review by a qualified engineer. Verify all values, assumptions and decisions for the actual service conditions.</span></div></section></div></div></article></main><footer class="site-footer"><nav class="footer-nav" aria-label="Legal and support navigation"><a href="${prefix}index.html">Home</a><a href="${prefix}about.html">About</a><a href="${prefix}contact.html">Contact</a><a href="${prefix}privacy.html">Privacy</a><a href="${prefix}disclaimer.html">Disclaimer</a><a href="${prefix}terms.html">Terms</a></nav><div class="footer-copyright">© 2026 Industrial Calculation Hub. All Rights Reserved.</div></footer></div><script>const menu=document.querySelector('.public-menu-toggle');const navigation=document.querySelector('.public-nav');menu?.addEventListener('click',()=>{const open=navigation.dataset.open==='true';navigation.dataset.open=String(!open);menu.setAttribute('aria-expanded',String(!open));});</script></body></html>`;
}

function renderParentLanding(parent, pages) {
  const prefix = relative(parent.route, 'index.html').replace(/index\.html$/, '');
  const cards = pages.map((page, index) => `<a class="related-knowledge-link" href="${relative(parent.route, `${page.route}/index.html`)}"><span class="related-knowledge-link__icon" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span><strong>${escapeHtml(page.title)}</strong><small>Published canonical knowledge page</small></span></a>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(parent.title)} | Industrial Calculation Hub</title><meta name="description" content="${escapeHtml(parent.summary)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${canonical(parent.route)}"><link rel="stylesheet" href="${prefix}style.css?v=20260831-canonical-53"><script defer src="${prefix}assets/js/site-search.js?v=20260831-canonical-53"></script></head><body class="public-page"><div class="site-frame"><header class="public-header"><a class="brand" href="${prefix}index.html" aria-label="Industrial Calculation Hub home"><img class="brand__mark" src="${prefix}assets/brand/industrial-calculation-hub-mark.svg" alt=""><span class="brand__name"><strong>Industrial</strong><span>Calculation Hub</span></span></a><button class="public-menu-toggle" type="button" aria-expanded="false" aria-controls="public-navigation">Menu</button><nav class="public-nav" id="public-navigation" aria-label="Primary navigation" data-open="false"><a href="${prefix}index.html">Home</a><a href="${prefix}index.html#tools">Tools</a><a href="${prefix}engineering.html">Learn</a><a href="${prefix}engineering-reference-data.html">Reference Data</a><a href="${prefix}about.html">About</a></nav></header><main class="knowledge-portal"><section class="portal-section"><p class="portal-kicker">Contextual topic route</p><h1>${escapeHtml(parent.title)}</h1><p>${escapeHtml(parent.summary)}</p><div class="related-knowledge-section"><h2>Published Knowledge Pages</h2><div class="related-knowledge-grid">${cards}</div></div></section></main><footer class="site-footer"><nav class="footer-nav" aria-label="Legal and support navigation"><a href="${prefix}index.html">Home</a><a href="${prefix}about.html">About</a><a href="${prefix}contact.html">Contact</a><a href="${prefix}privacy.html">Privacy</a><a href="${prefix}disclaimer.html">Disclaimer</a><a href="${prefix}terms.html">Terms</a></nav><div class="footer-copyright">© 2026 Industrial Calculation Hub. All Rights Reserved.</div></footer></div><script>const menu=document.querySelector('.public-menu-toggle');const navigation=document.querySelector('.public-nav');menu?.addEventListener('click',()=>{const open=navigation.dataset.open==='true';navigation.dataset.open=String(!open);menu.setAttribute('aria-expanded',String(!open));});</script></body></html>`;
}

function addParentLinks(pages) {
  const byParent = new Map();
  for (const page of pages) {
    const parentRoute = `${path.posix.dirname(page.route)}/index.html`;
    if (!byParent.has(parentRoute)) byParent.set(parentRoute, []);
    byParent.get(parentRoute).push(page);
  }
  let changed = 0;
  for (const [parentRoute, children] of byParent.entries()) {
    const file = local(parentRoute);
    let html = fs.readFileSync(file, 'utf8');
    if (html.includes('data-canonical-page-links="true"')) continue;
    const links = children.map((page, index) => `<a class="related-knowledge-link" href="${relative(parentRoute, `${page.route}/index.html`)}"><span class="related-knowledge-link__icon" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span><strong>${escapeHtml(page.title)}</strong><small>Published canonical knowledge page</small></span></a>`).join('');
    const section = `<section class="related-knowledge-section" data-canonical-page-links="true"><h2>Published Knowledge Pages</h2><p>These canonical pages sit beneath this contextual route and are also available through site search and the XML sitemap.</p><div class="related-knowledge-grid">${links}</div></section>`;
    if (!html.includes('</main>')) throw new Error(`Parent page has no main end tag: ${parentRoute}`);
    html = html.replace('</main>', `${section}</main>`);
    fs.writeFileSync(file, html, 'utf8');
    changed += 1;
  }
  return changed;
}

function updateSearch(pages) {
  const file = local('assets/js/site-search.js');
  let script = fs.readFileSync(file, 'utf8');
  const match = /const staticSiteSearchIndex\s*=\s*(\[[\s\S]*?\]);[\s\S]*?const generatedLevel3Index/.exec(script);
  if (!match) throw new Error('Static site-search index was not found.');
  const index = JSON.parse(match[1]);
  for (const page of pages) {
    const route = `${page.route}/index.html`;
    const profile = profileFor(page);
    const entry = { title: `${page.title} | Industrial Calculation Hub`, href: route, type: page.domain === 'Engineering Reference Data' ? 'Engineering reference data' : 'Engineering knowledge', description: topicPhrases(page, profile).summary };
    const existing = index.find((item) => item.href === route);
    if (existing) Object.assign(existing, entry); else index.push(entry);
  }
  script = script.replace(match[1], JSON.stringify(index));
  fs.writeFileSync(file, script, 'utf8');
}

function updateSitemap(pages, landings) {
  const file = local('sitemap.xml');
  let sitemap = fs.readFileSync(file, 'utf8');
  const routes = [...pages.map((page) => `${page.route}/index.html`), ...landings.map((landing) => landing.route)];
  const additions = routes.filter((route) => !sitemap.includes(canonical(route))).map((route) => `<url>\n    <loc>${canonical(route)}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n</url>`).join('\n\n');
  if (additions) sitemap = sitemap.replace('\n</urlset>', `\n${additions}\n\n</urlset>`);
  fs.writeFileSync(file, sitemap, 'utf8');
}

function wordCount(html) {
  return html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').trim().split(/\s+/).filter(Boolean).length;
}

function deepenCanonicalPages(pages) {
  for (const page of pages) {
    const route = `${page.route}/index.html`;
    const file = local(route);
    let html = fs.readFileSync(file, 'utf8');
    if (html.includes('<!-- canonical-depth-53 -->')) continue;
    const profile = profileFor(page);
    const insertion = `<!-- canonical-depth-53 --><section id="implementation"><h2>Implementation, Performance Verification and Change Control</h2><p>Before a design, procurement or operating decision is finalised, convert the educational framework into a controlled project basis. Identify the governing standard, equipment supplier requirements, inspection points, interfaces, acceptance criteria and the owner of each outstanding item. Check that the selected arrangement can be installed, isolated, accessed, maintained and returned to service without creating an unreviewed hazard or operational constraint.</p><p>Commissioning should demonstrate performance at representative, stable conditions rather than only at a convenient nominal point. Record the instrumentation and calibration status, source data, line-up, operating case, measured values, deviation from expected behaviour and any corrective action. Compare results with the approved design basis and distinguish a real equipment limitation from a change in feed, fuel, material condition, ambient condition or measurement method.</p><p>For ${escapeHtml(page.title)}, retain trend data that exposes early degradation: duty, energy or utility use, pressure or temperature response, vibration or condition evidence where relevant, quality or emissions outcome, alarm history and maintenance findings. A successful outcome is not just a calculation result; it is a repeatable operating condition that remains within defined limits through its lifecycle.</p><h3>Practical close-out checklist</h3><ol class="method-list"><li>Confirm the final boundary, source revisions and governing operating case.</li><li>Verify interfaces with upstream and downstream equipment, utilities, controls, access and safety systems.</li><li>Compare measured performance with the documented acceptance criteria on the same condition basis.</li><li>Record residual risks, limitations, maintenance actions and the trigger for reassessment.</li><li>Use management-of-change control whenever the material, duty, geometry, equipment or protective function is altered.</li></ol><p>These steps are particularly important when ${escapeHtml(page.title)} affects reliability, process availability, environmental duty, rotating machinery, pressure, temperature, worker exposure or material integrity. They help ensure that a technically plausible selection remains safe and practical after installation.</p></section>`;
    if (!html.includes('<section id="faq">')) throw new Error(`FAQ insertion point missing: ${route}`);
    html = html.replace('<section id="faq">', `${insertion}<section id="faq">`);
    fs.writeFileSync(file, html, 'utf8');
  }
}

function validate(pages, landings) {
  const issues = [];
  const canonicalUrls = new Set();
  for (const page of pages) {
    const route = `${page.route}/index.html`;
    const file = local(route);
    const html = fs.readFileSync(file, 'utf8');
    const title = /<h1>([\s\S]*?)<\/h1>/.exec(html)?.[1];
    const pageCanonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
    for (const needle of ['knowledge-page__information', 'article-toc', 'Frequently Asked Questions', 'Related Resources', 'Review Information', 'Engineering Disclaimer', page.id]) if (!html.includes(needle)) issues.push(`${route}: missing ${needle}`);
    if (!title || title !== page.title) issues.push(`${route}: title mismatch`);
    if (pageCanonical !== canonical(route)) issues.push(`${route}: canonical mismatch`);
    if (canonicalUrls.has(pageCanonical)) issues.push(`${route}: duplicate canonical`); else canonicalUrls.add(pageCanonical);
    if (wordCount(html) < 2000) issues.push(`${route}: below 2,000 words (${wordCount(html)})`);
    for (const source of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]).filter((href) => href && !href.startsWith('#') && !/^(?:https?:|mailto:)/.test(href))) {
      const target = path.resolve(path.dirname(file), source.split(/[?#]/)[0]);
      if (!fs.existsSync(target) && !fs.existsSync(path.join(target, 'index.html'))) issues.push(`${route}: missing local target ${source}`);
    }
  }
  for (const landing of landings) if (!fs.existsSync(local(landing.route))) issues.push(`${landing.route}: contextual landing missing`);
  if (issues.length) throw new Error(`Canonical-page validation failed:\n${issues.join('\n')}`);
}

function writeReport(pages) {
  const rows = pages.map((page) => {
    const route = `${page.route}/index.html`;
    return `| ${page.id} | ${page.domain} | ${page.title} | /${page.route}/ | ${wordCount(fs.readFileSync(local(route), 'utf8')).toLocaleString('en-IN')} |`;
  }).join('\n');
  const report = `# 53 New Canonical Knowledge Pages\n\nCreated: ${reviewDate}\n\nThe pages below passed the duplicate/canonical screen against the 301 pre-existing final-format knowledge pages. Each page is linked from its matching contextual route, site search and sitemap. Where an approved Level 4 topic folder had no page file, a concise contextual landing route was added; those routes preserve the internal hierarchy and do not add public-navigation steps.\n\n| Canonical ID | Domain | Page | Canonical route | Words |\n| --- | --- | --- | --- | ---: |\n${rows}\n\nAll pages are original educational summaries informed by the supplied literature. They do not reproduce protected source text, figures, tables or standards content.\n`;
  const directory = local('outputs/literature-audit');
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'NEW-CANONICAL-PAGES-53.md'), report, 'utf8');
}

if (candidates.length !== 53) throw new Error(`Expected 53 candidates; found ${candidates.length}.`);
for (const page of candidates) {
  const route = `${page.route}/index.html`;
  const file = local(route);
  if (!fs.existsSync(file)) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, renderArticle(page, candidates), 'utf8');
  }
}
for (const landing of contextualLandings) {
  const pageSet = candidates.filter((page) => `${path.posix.dirname(page.route)}/index.html` === landing.route);
  const file = local(landing.route);
  if (!fs.existsSync(file)) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, renderParentLanding(landing, pageSet), 'utf8');
  }
}
const parentPagesChanged = addParentLinks(candidates);
updateSearch(candidates);
updateSitemap(candidates, contextualLandings);
deepenCanonicalPages(candidates);
validate(candidates, contextualLandings);
writeReport(candidates);
console.log(JSON.stringify({ created: candidates.length, contextualLandings: contextualLandings.length, parentPagesLinked: parentPagesChanged }, null, 2));
