const fs = require('fs');

const guides = {
  'air-pollution-control-systems.html': {
    subject: 'Air-pollution-control systems',
    decision: 'Match the pollutant form, gas quantity, temperature, moisture, chemistry, loading profile, required outlet condition and waste route to a complete collection-and-treatment train. A collector selected from nominal flow alone can fail when gas conditioning, material handling, leakage or bypass conditions are not considered.',
    evidence: 'Use representative emission tests, differential pressure, gas temperature, oxygen or moisture where relevant, fan operating data, hopper discharge evidence and inspection findings. Compare data at documented locations and operating conditions rather than combining values from unrelated periods.',
    risk: 'Important review points are gas distribution, corrosion and erosion, combustible-dust risk, reagent handling, induced-draft fan capacity, bypass control and safe maintenance isolation.'
  },
  'bag-filter.html': {
    subject: 'Bag filters',
    decision: 'Set the fabric, air-to-cloth ratio, cleaning method, compartment arrangement and hopper discharge basis from the actual dust, gas temperature, acid-dew-point margin, moisture, particle characteristics and operating profile. Filter area by itself is not a reliable indication of collection performance or service life.',
    evidence: 'Review inlet and outlet opacity or particulate observations, pressure-drop trend, pulse-air condition, cleaning frequency, bag inspection results, hopper level and leakage tests. Separate process changes from cleaning-system or media deterioration before assigning a cause.',
    risk: 'Important review points are temperature excursions, condensation, abrasive dust, bag damage, poor gas distribution, re-entrainment, hopper bridging, ignition sources and safe access for replacement.'
  },
  'bernoulli-equation-explained.html': {
    subject: 'Bernoulli-equation applications',
    decision: 'Choose the two stations and datum carefully, then distinguish pressure, velocity and elevation head from pump input, turbine extraction and irreversible losses. The equation is most useful when every term uses the same fluid, unit system, reference condition and realistic velocity area.',
    evidence: 'Check flow rate, pipe internal diameter, elevation, pressure tapping arrangement, fluid density, temperature and any equipment differential against current drawings and calibrated instruments. Reconcile calculated and measured pressure changes before using the result for a modification.',
    risk: 'Important review points are compressibility, multiphase flow, pulsation, non-uniform velocity profiles, local restrictions and the need to include friction and minor-loss terms.'
  },
  'boiler-efficiency-explained.html': {
    subject: 'Boiler efficiency',
    decision: 'Define whether the result is a direct-output, input–output, heat-loss or efficiency-guarantee value before comparing periods or equipment. Fuel basis, moisture, excess air, steam condition, blowdown, auxiliary consumption and test duration must be controlled together.',
    evidence: 'Use calibrated fuel and steam measurements, fuel analysis, flue-gas oxygen and temperature, feedwater condition, blowdown data, stack loss calculations and stable operating periods. Recheck the balance after a change in fuel, load, soot condition or air leakage.',
    risk: 'Important review points are combustion safety, furnace draft, tube cleanliness, steam-quality requirements, blowdown control, air infiltration and compliance with the applicable test method.'
  },
  'duct-flow-rate-explained.html': {
    subject: 'Duct-flow-rate assessments',
    decision: 'Establish the true internal duct area, gas density basis, branch configuration, process capture requirement and system resistance before selecting a flow rate. Velocity alone does not demonstrate adequate capture, transport, fan margin or safe pressure balance.',
    evidence: 'Review traverse data where possible, static and total pressure, damper positions, fan speed, motor load, temperature, leakage and branch balance. Compare measurements at the same stations and damper state used in the calculation.',
    risk: 'Important review points are dust settling, erosion, leakage, noise, vibration, access doors, expansion movement, fire and explosion isolation and interaction with connected equipment.'
  },
  'electrostatic-precipitator.html': {
    subject: 'Electrostatic precipitators',
    decision: 'Assess collection duty from gas flow, particulate size and resistivity, temperature, chemistry, electrical field conditions, gas distribution and rapping/discharge performance. High collecting area cannot compensate for unstable energisation, poor distribution or unsuitable ash handling.',
    evidence: 'Review secondary voltage and current, spark rate, rapper operation, inlet and outlet particulate measurements, gas temperature, opacity, hopper evacuation and inspection evidence for electrodes, insulators and gas passages.',
    risk: 'Important review points are high-voltage isolation, resistivity changes, back corona, ash deposition, gas leakage, access control, fire or explosion hazards and the integrity of downstream ash handling.'
  },
  'unit-conversion-explained.html': {
    subject: 'Engineering unit conversion',
    decision: 'Identify the physical quantity, base unit, prefix, reference condition and required displayed precision before converting a value. A numerical factor can be correct while the result is still unsuitable because the source and target quantities refer to different temperature, pressure, gauge or standard conditions.',
    evidence: 'Retain the source value, unit symbol, factor source, intermediate value, rounding rule and final unit in the calculation record. Independently reverse-check important conversions and use controlled project units in specifications and data sheets.',
    risk: 'Important review points are gauge versus absolute pressure, mass versus force, temperature intervals versus temperatures, standard versus actual gas volume and inconsistent inch-pound or SI conventions.'
  },
  'esp-vs-bag-filter.html': {
    subject: 'ESP and bag-filter comparison',
    decision: 'Compare the technologies against the duty envelope rather than a single collection-efficiency figure: dust resistivity, inlet loading, particle distribution, temperature, moisture, acid-dew-point margin, space, utilities, maintenance resources, waste handling and emission target all matter.',
    evidence: 'Compare representative emissions, pressure drop, power demand, availability, consumable use, maintenance history, hopper performance and response to load or fuel changes. State the basis and boundary for every comparison.',
    risk: 'Important review points are high-voltage safety, fabric temperature limits, combustible dust, corrosion, water ingress, ash transport, outage strategy and the availability of bypass or isolation arrangements.'
  },
  'heat-conduction-explained.html': {
    subject: 'Heat-conduction calculations',
    decision: 'Set the physical path, geometry, contact condition, material conductivity range, temperature-dependent properties and boundary temperatures before using Fourier-law resistance models. The governing heat path may include metal, insulation, lining, interfaces, fasteners or thermal bridges.',
    evidence: 'Check dimensions, material certificates, installed insulation thickness, surface temperatures, ambient conditions, contact condition and process temperatures. Treat unverified interface resistance or wet insulation as an uncertainty rather than a fixed property.',
    risk: 'Important review points are burn protection, condensation, freeze risk, refractory integrity, thermal stress, insulation damage, vapour barriers and maintainability.'
  },
  'heat-transfer-explained.html': {
    subject: 'Heat-transfer applications',
    decision: 'Separate conduction, convection and radiation paths, then establish the fluid conditions, surface areas, temperature profiles, fouling allowance and phase-change effects. A single overall coefficient is useful only when its basis matches the actual geometry and service.',
    evidence: 'Compare heat duty with flow, inlet and outlet temperatures, pressure drop, utility condition, equipment cleanliness, surface condition and operating trend. Use an energy balance to identify whether a change is real or due to measurement uncertainty.',
    risk: 'Important review points are fouling, corrosion, thermal shock, tube or plate integrity, bypassing, utility stability, surface temperature and safe isolation for cleaning.'
  },
  'pipe-flow-basics.html': {
    subject: 'Pipe-flow calculations',
    decision: 'Define the fluid properties, pipe internal diameter and roughness, route elevation, fittings, valves, equipment losses and duty cases before calculating pressure loss or pump head. The installed system may differ significantly from nominal-pipe assumptions.',
    evidence: 'Verify flow, pressure at defined locations, temperature, density or viscosity, valve position, pump speed, filter condition and current line configuration. Compare normal, minimum, maximum, start-up and future cases with the same boundary conditions.',
    risk: 'Important review points are cavitation, surge, erosion, solids deposition, air pockets, minimum velocity, support movement, isolation requirements and pressure-rating limits.'
  },
  'engineering/instrumentation-and-control-engineering/process-measurement/pressure-and-temperature/pressure-and-temperature-measurement-instruments/index.html': {
    subject: 'Pressure and temperature measurement',
    decision: 'Select instruments from the required range, accuracy, process connection, wetted-material compatibility, response time, installation position, calibration philosophy and safety function. A correctly specified sensor can still give unusable data when the impulse line, thermowell or location is unsuitable.',
    evidence: 'Review calibration certificates, as-found and as-left values, installation drawings, reference-junction or compensation arrangements, impulse-line condition, comparison tests and process trend behaviour.',
    risk: 'Important review points are overpressure, process leakage, blocked impulse lines, vibration, sensor drift, thermowell integrity, electrical classification and management of alarm or trip changes.'
  },
  'pressure-vessel-design-basics.html': {
    subject: 'Pressure-vessel design basics',
    decision: 'Establish the design pressure and temperature, material, corrosion allowance, geometry, loads, service category, fabrication basis, inspection requirement and governing code before treating a thickness result as meaningful. External pressure, nozzle loads, supports and cyclic service can control the design.',
    evidence: 'Use controlled drawings, material records, thickness readings, relief-device data, process limits, welding and inspection records and calculated load cases. Confirm that field condition, damage mechanisms and alterations remain within the documented basis.',
    risk: 'Important review points are pressure containment, brittle fracture, corrosion, fatigue, vacuum collapse, relief sizing, access, lifting, inspection, repair control and statutory requirements.'
  },
  'pump-power-basics.html': {
    subject: 'Pump-power assessments',
    decision: 'Relate hydraulic power to required flow, total dynamic head, fluid density, viscosity, pump efficiency, motor efficiency, drive losses and operating-point stability. Nameplate power alone does not establish that the pump can deliver the duty without cavitation or overload.',
    evidence: 'Review pump curve, motor current, suction and discharge pressure, flow, fluid temperature, valve position, speed, impeller condition, vibration and NPSH margin. Document the curve revision and the operating condition for the comparison.',
    risk: 'Important review points are cavitation, minimum-flow recirculation, seal condition, dead-heading, runout, motor service factor, starting duty, vibration and safe isolation.'
  },
  'reynolds-number-explained.html': {
    subject: 'Reynolds-number use',
    decision: 'Use the characteristic length and velocity appropriate to the geometry, together with fluid properties at the actual temperature and pressure. Reynolds number indicates the relative importance of inertia and viscosity; it is not a substitute for a complete loss, heat-transfer or mixing model.',
    evidence: 'Verify fluid density and viscosity, diameter or hydraulic diameter, flow rate, temperature, surface condition and whether the line is fully developed. Check sensitivity near transition rather than assigning a sharp regime boundary to uncertain data.',
    risk: 'Important review points are non-Newtonian behaviour, multiphase flow, roughness effects, pulsation, entrance length, scale-up limits and applying correlations outside their published range.'
  },
  'thermal-expansion-explained.html': {
    subject: 'Thermal-expansion assessments',
    decision: 'Set the temperature range, installed temperature, material coefficient, restraint condition, route geometry, support arrangement and connected-equipment limits. Free expansion and restrained thermal stress are different design cases and must not be interchanged.',
    evidence: 'Review material records, temperature profile, anchor and guide locations, support movement, expansion-joint condition, nozzle loads, clearances, inspection findings and trends across start-up and shutdown.',
    risk: 'Important review points are restraint loads, buckling, fatigue, sliding resistance, guide alignment, insulation interference, leakage, hot-surface protection and changes after modification.'
  }
};

const major = new Set([
  'air-pollution-control-systems.html',
  'bag-filter.html',
  'electrostatic-precipitator.html',
  'esp-vs-bag-filter.html'
]);

const coreSection = (guide) => `<section class="content-depth-section" id="next110-core-depth"><p class="portal-kicker">Applied engineering review</p><h2>${guide.subject}: decision basis and field verification</h2><p>${guide.decision}</p><h3>Evidence before action</h3><p>${guide.evidence} The technical record should show the source revision, unit basis, measurement location, operating mode and known limitations so that another competent person can reproduce the conclusion.</p><h3>Review sequence</h3><ol class="method-list"><li>State the decision that the assessment must support and establish the system boundary.</li><li>Gather current drawings, data sheets, operating records, inspection evidence and applicable project or code requirements.</li><li>Define normal, limiting, start-up, shutdown, upset and future cases that are relevant to the service.</li><li>Use a method whose assumptions, property basis and validity range match the actual arrangement.</li><li>Check the outcome against independent measurements, supplier information or physical evidence.</li><li>Record sensitivity, uncertainty, actions, owner and any required follow-up measurement or inspection.</li></ol><h3>Limitations and safeguards</h3><p>${guide.risk} This educational page supports preliminary understanding and does not replace a controlled design calculation, manufacturer instruction, safety study, statutory inspection or review by a qualified engineer.</p><h3>Decision record</h3><p>Before implementing a change, retain the governing case, key assumptions, source data, result, reviewer comments, verification plan and change-control reference. Reassess the conclusion when the material, geometry, operating condition, control arrangement, equipment condition or governing requirement changes.</p></section>`;

const majorSection = (guide) => `<section class="content-depth-section" id="next110-major-system-depth"><p class="portal-kicker">System-level engineering</p><h2>${guide.subject}: lifecycle, selection and reliability review</h2><p>For a major industrial system, the technically correct outcome is not only a rated capacity or a collection-performance number. It is a controlled arrangement that continues to perform across varying duty, maintenance outages, material changes, environmental conditions and foreseeable abnormal events. Selection should therefore include interfaces with upstream generation, downstream handling, utilities, controls, structures, access, safety systems and disposal routes.</p><h3>Selection matrix</h3><div class="article-card-grid"><section><h4>Process and duty</h4><p>Define quantity, composition, particle or contaminant behaviour, temperature, pressure, moisture, chemistry, variability, upset conditions and required outlet performance.</p></section><section><h4>Equipment configuration</h4><p>Review capacity margin, modules or compartments, flow distribution, access, isolation, spares, redundancy, start-up sequence and future expansion space.</p></section><section><h4>Utilities and controls</h4><p>Confirm electrical supply, compressed air, water, steam or reagent requirements; include instrument quality, alarms, trips, interlocks and manual response.</p></section><section><h4>Reliability and maintenance</h4><p>Plan inspection, cleaning, replacement, lifting, isolation, waste discharge, failure response, condition monitoring and availability targets from the beginning.</p></section></div><h3>Performance verification plan</h3><p>Define measurable acceptance criteria before procurement or modification. The plan should identify sampling points, instruments, calibration status, operating stability, test duration, calculation method, environmental or safety constraints, responsibility for witnessing and how deviations will be investigated. A single short test cannot prove long-term reliability where loading, chemistry, weather, cleaning condition or utility quality vary.</p><p>During operation, retain trends that show the system’s physical condition as well as its headline performance: pressure loss, electrical or utility consumption, temperature, vibration, leakage, discharge behaviour, alarms, maintenance interventions and inspection findings. Use trend changes to trigger investigation before an emission, production or integrity limit is exceeded.</p><h3>Failure prevention and change control</h3><p>Review credible failure paths such as maldistribution, bypassing, fouling, wear, corrosion, loss of utility, control error, discharge blockage, insulation failure, structural damage and unsafe access. Each should have a practical prevention, detection and response measure. When fuel, feed, throughput, material, layout, duct route, control logic or maintenance strategy changes, repeat the relevant design and safety checks rather than assuming the original basis still applies.</p><h3>Engineering judgement</h3><p>The final choice must balance performance, availability, operability, maintainability, lifecycle cost, constructability and statutory obligations. A qualified engineer should review the controlled data, applicable requirements and site-specific hazards before final design, procurement or operation decisions are made.</p></section>`;

let updated = 0;
for (const [file, guide] of Object.entries(guides)) {
  let html = fs.readFileSync(file, 'utf8');
  const marker = `<!-- next110-${file}-end -->`;
  if (!html.includes(marker)) throw new Error(`Marker not found in ${file}`);
  if (!html.includes('id="next110-core-depth"')) {
    const addition = coreSection(guide) + (major.has(file) ? majorSection(guide) : '');
    html = html.replace(marker, `${addition}${marker}`);
    fs.writeFileSync(file, html);
    updated += 1;
  }
}

console.log(`Engineering guides raised to core depth: ${updated}`);
