const fs = require('fs');

function findSectionBounds(html, id) {
  const marker = `<section id="${id}"`;
  const start = html.indexOf(marker);
  if (start === -1) throw new Error(`Missing section ${id}`);
  const tagEnd = html.indexOf('>', start);
  const tags = /<\/?section\b[^>]*>/gi;
  let depth = 1;
  tags.lastIndex = tagEnd + 1;
  while (depth > 0) {
    const match = tags.exec(html);
    if (!match) throw new Error(`Unclosed section ${id}`);
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return { start, end: match.index, closeEnd: match.index + match[0].length };
  }
}

function removeBlock(html, key) {
  const expression = new RegExp(`\\s*<!-- core-depth:${key}:start -->[\\s\\S]*?<!-- core-depth:${key}:end -->`, 'g');
  return html.replace(expression, '');
}

function appendToSection(html, id, key, content) {
  html = removeBlock(html, key);
  const bounds = findSectionBounds(html, id);
  const block = `<!-- core-depth:${key}:start -->${content}<!-- core-depth:${key}:end -->`;
  return html.slice(0, bounds.end) + block + html.slice(bounds.end);
}

function paragraphs(title, values) {
  return `<h3>${title}</h3>${values.map((value) => `<p>${value}</p>`).join('')}`;
}

function checklist(title, values) {
  return `<h3>${title}</h3><ol class="method-list">${values.map((value) => `<li>${value}</li>`).join('')}</ol>`;
}

function troubleshooting(title, values) {
  return `<h3>${title}</h3><div class="article-card-grid">${values.map(([heading, text]) => `<section><h4>${heading}</h4><p>${text}</p></section>`).join('')}</div>`;
}

function extraFaqs(values) {
  return `<div class="faq-list">${values.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}</div>`;
}

const base = 'engineering/fluid-mechanics-piping-pumps-fans-ducts';
const guides = [
  {
    file: 'air-density-explained.html',
    name: 'Air Density',
    principle: [
      'Density should be assigned at the station where the engineering duty is evaluated. A fan catalogue may quote a reference density, while the fan inlet may be warmer, at elevation, humid, contaminated or under a different static pressure. A result that mixes a weather-station density with a duct volume measured downstream of a heater has no single physical basis, even though both values may look reasonable on their own.',
      'For air systems, distinguish actual volume flow from mass flow and reference volume flow. The duct area and measured velocity establish an actual local volume flow; density converts that value to mass flow. A standard or normal volume is a reporting convention for the same gas amount. It must always state the reference pressure, temperature and dry or wet basis before it can be compared with actual-flow data.'
    ],
    formulae: [
      'When pressure and temperature change between stations, calculate a separate density for each station or transform the flow to a declared common reference basis. Do not assume that a fan discharge volume, a hot-gas stack volume and a combustion-air requirement use the same density simply because each is expressed in m³/h.',
      'The ideal-gas relation is useful for screening dry atmospheric air, but humid-air, flue-gas and process-gas calculations need a composition-aware method. Moisture affects partial pressures, while combustion products and vapours change the mixture molecular mass. For final design, use an approved project property method rather than applying a dry-air constant to every gas stream.'
    ],
    method: [
      '<strong>Set the condition notation.</strong> Label every flow as actual, dry standard, wet standard or another declared convention before beginning the calculation.',
      '<strong>Establish the duty station.</strong> Identify whether the value is needed at the fan inlet, fan discharge, heat exchanger, stack, room or measurement plane.',
      '<strong>Obtain absolute pressure.</strong> Use a local atmospheric basis at elevation or add atmospheric pressure to a gauge reading where appropriate.',
      '<strong>Obtain temperature and composition.</strong> Use the actual gas temperature and determine whether water vapour, combustion products or other constituents are material.',
      '<strong>Select the property method.</strong> Use an ideal-gas estimate only for an appropriate dry-air screening case; otherwise use approved psychrometric or mixture data.',
      '<strong>Calculate density and mass flow together.</strong> Keep density and volume flow at the same station and condition before multiplying them.',
      '<strong>Check equipment implications.</strong> Compare the condition with fan, blower, filter, burner, stack and motor data that may be based on another reference density.',
      '<strong>Record the reference convention.</strong> Preserve pressure, temperature, humidity, composition, flow basis and data source in the calculation record.'
    ],
    selection: [
      'Fan and blower selection is usually controlled by actual volume, pressure and gas density at the inlet. A density correction may affect developed pressure, absorbed power and the interpretation of a published curve. It does not by itself guarantee that a motor, VFD, shaft, bearing, impeller, noise limit or surge/stall margin is suitable for the new condition.',
      'For ventilation and heat-transfer work, mass flow often carries the energy balance while actual volume determines duct velocity and equipment face velocity. Both quantities are needed. A design that checks only the volume can miss the thermal load, while a design that checks only mass flow can miss noise, erosion, pressure loss or filter-face-velocity limits.'
    ],
    troubleshooting: [
      ['Unexpected fan power', 'Verify inlet density, actual flow, gas temperature and the fan curve reference condition before concluding that the motor is undersized.'],
      ['Mass-balance mismatch', 'Check whether one stream is reported at actual conditions while another is reported at standard or normal conditions.'],
      ['Seasonal performance change', 'Compare local temperature, barometric pressure and humidity at the equipment inlet, not only outdoor design weather data.'],
      ['Stack or emission discrepancy', 'Confirm the dry/wet basis, oxygen correction basis and reference condition before comparing volumetric and mass-rate data.']
    ],
    faqs: [
      ['Why can fan pressure change at the same speed?', 'The fan and system operate with the local gas density and system resistance. A catalogue reference condition may differ from the actual inlet condition, so curve interpretation and absorbed power must be corrected using manufacturer guidance.'],
      ['Should density be calculated before or after a heater?', 'Calculate it at the station represented by the flow or duty. Heating lowers density at similar pressure, so inlet and outlet values are normally different.'],
      ['Is sea-level air density suitable for high-altitude plants?', 'Not as a direct substitute. Use local absolute pressure, temperature and composition; lower atmospheric pressure normally reduces ambient density.'],
      ['What information should accompany an air-density result?', 'State the gas description, temperature, absolute pressure, humidity or composition basis, calculation method, flow station and whether the associated flow is actual or reference volume.']
    ]
  },
  {
    file: `${base}/fluid-properties/density-and-specific-gravity/density-specific-gravity-and-specific-weight/index.html`,
    name: 'Density, Specific Gravity and Specific Weight',
    principle: [
      'The property selected must match the physical volume in the engineering question. A vessel filled with liquid needs liquid density at storage temperature; a hopper needs bulk density at a defined packing condition; a gas holder needs density at its pressure and temperature. Particle density is not a safe replacement for bulk density because the void space can dominate a storage-volume or conveying calculation.',
      'Specific gravity is useful only when its reference is explicit. In liquid work the reference is commonly water at a stated condition, but the convention should never be guessed. In gas work, a relative density may refer to dry air at a stated basis. The ratio is convenient for comparison, yet the original density remains necessary whenever mass, volume, pressure head or force per volume is calculated.'
    ],
    formulae: [
      'Hydrostatic calculations require a consistent distinction between pressure, head and specific weight. A liquid with greater density creates a larger pressure difference for the same vertical height; however, pump head is often expressed as metres of the pumped liquid rather than a direct pressure value. Convert deliberately and identify the fluid whose density is being used.',
      'For bulk solids, measured mass divided by a container volume produces a condition-specific bulk density. The result can change with filling method, vibration, aeration, moisture, segregation and consolidation. It is better to report “loose bulk density at stated test condition” than a single unqualified density that later becomes a false design constant.'
    ],
    method: [
      '<strong>Name the material and physical state.</strong> Record grade, concentration, particle form and whether the calculation concerns liquid, gas, solid particles or a bulk solid.',
      '<strong>Define the volume boundary.</strong> Decide whether voids, entrained gas, internal porosity or freeboard are included in the stated volume.',
      '<strong>State the condition.</strong> Record temperature, pressure, moisture, compaction or sample-preparation condition as appropriate.',
      '<strong>Select a traceable value.</strong> Prefer plant measurement, certified supplier data or a recognised reference that matches the actual material and condition.',
      '<strong>Check the unit basis.</strong> Convert mass, volume and force units before applying density, specific gravity or specific weight relations.',
      '<strong>Check the property type.</strong> Confirm that the calculation needs density, specific gravity, specific weight, true density, bulk density or tapped density.',
      '<strong>Test the consequence.</strong> Compare the resulting mass, hydrostatic pressure, storage volume or load with engineering expectation.',
      '<strong>Retain the definition.</strong> Save the source, date, test method and operating basis with the derived result.'
    ],
    selection: [
      'Storage and handling studies should normally use a range, not a single optimistic bulk-density value. A facility may be limited by loose density during filling, compacted density during structural loading, or aerated density during pneumatic conveying. The proper value depends on the decision being made and may need validation through representative material testing.',
      'For liquid inventory and metering, density variation with temperature and composition can alter the mass represented by a fixed volume. Where commercial, safety or process balances depend on that conversion, the project should define the property source and reference-temperature convention rather than relying on a rounded handbook value.'
    ],
    troubleshooting: [
      ['Unexpected hopper capacity', 'Check whether the estimate used particle density instead of loose or as-filled bulk density, and confirm the moisture and compaction condition.'],
      ['Incorrect liquid mass inventory', 'Compare the tank temperature and product composition with the density basis used in the volume-to-mass conversion.'],
      ['Hydrostatic pressure disagreement', 'Confirm that specific weight and density were not interchanged and that all pressure/head conversions use the same liquid basis.'],
      ['Conflicting supplier values', 'Ask whether the values represent true, bulk, tapped, apparent or standard-condition density before choosing one for design.']
    ],
    faqs: [
      ['Can one density value be used for every calculation?', 'No. The same material may need different values for true density, liquid density, bulk density, gas density or specific weight depending on the physical boundary and operating condition.'],
      ['Why is bulk density often lower than particle density?', 'Bulk density includes the voids between particles, while particle density excludes them. The difference can be large for irregular, porous or loosely packed solids.'],
      ['When should specific weight be used instead of density?', 'Use specific weight when the calculation is expressed in force per volume, such as hydrostatic load or pressure gradient. Use density for mass and mass-flow calculations.'],
      ['How should a density value be recorded?', 'Include material identity, phase, temperature, pressure where relevant, moisture or composition, property definition, units, source and measurement or reference date.']
    ]
  },
  {
    file: `${base}/fluid-properties/viscosity/dynamic-and-kinematic-viscosity/index.html`,
    name: 'Dynamic and Kinematic Viscosity',
    principle: [
      'Viscosity can dominate system behaviour long before it is obvious from a fluid’s appearance. In laminar pipe flow, pressure loss is strongly tied to viscosity and flow rate; in turbulent flow, viscosity still affects the Reynolds number and friction factor. A liquid that becomes more viscous during cold start-up can therefore move from an acceptable operating condition to a pump, motor or pressure-drop problem.',
      'Non-Newtonian fluids need extra care. Their apparent viscosity may vary with shear rate, time under shear, temperature, solids concentration or previous mixing history. A single number from a data sheet may represent a particular test method rather than the shear conditions inside a pump, pipe, mixer or coating line. The calculation basis must identify the relevant rheological regime.'
    ],
    formulae: [
      'Viscosity values are frequently reported in mPa·s, cP, mm²/s or cSt. These units are related but not interchangeable without density. One centipoise equals one mPa·s for dynamic viscosity, while one centistoke equals one mm²/s for kinematic viscosity. Convert the data deliberately before inserting it into a Reynolds-number, pressure-loss or lubrication relation.',
      'Temperature-viscosity data should be treated as a curve or a declared table, not as an assumed straight line. For oils, resins, syrups, slurries and polymer solutions, a modest temperature difference can change the pumping and heat-transfer behaviour materially. Use the controlling cold, normal and hot operating conditions where they affect equipment selection.'
    ],
    method: [
      '<strong>Define the service.</strong> Identify whether the question concerns pipe pressure loss, pumpability, mixing, heat transfer, coating, lubrication or settling.',
      '<strong>Identify fluid behaviour.</strong> Determine whether a Newtonian approximation is suitable or whether shear-dependent rheology is expected.',
      '<strong>Set the condition range.</strong> Record normal, lowest and highest temperature, pressure, solids concentration and shear environment where relevant.',
      '<strong>Choose the correct viscosity type.</strong> Use dynamic viscosity for shear-stress relations and kinematic viscosity for Reynolds-number work when density is known.',
      '<strong>Verify units.</strong> Convert cP, mPa·s, cSt, mm²/s, Pa·s and m²/s before combining property values.',
      '<strong>Calculate the flow regime.</strong> Evaluate Reynolds number and confirm that the selected pressure-loss or heat-transfer method applies.',
      '<strong>Review equipment limits.</strong> Check pump curve correction, minimum velocity, allowable pressure drop, motor torque and heat-transfer implications.',
      '<strong>Document the property source.</strong> Retain test method, shear rate where relevant, temperature, sample composition and data source.'
    ],
    selection: [
      'Pump selection for viscous liquids should account for capacity, head, efficiency, power, NPSH behaviour, speed and the pump type’s sensitivity to viscosity. A water-based performance curve is not automatically valid for a viscous liquid. Positive-displacement and centrifugal pumps may respond very differently, so supplier correction methods and service experience are important.',
      'Pipe sizing involves a balance between velocity, pressure loss, residence time, solids behaviour, cleaning requirements and capital cost. Increasing diameter can reduce friction loss but may create low-velocity deposition or poor heat transfer. The chosen line size should be checked across the viscosity and flow envelope, not only at a warm nominal condition.'
    ],
    troubleshooting: [
      ['High cold-start pressure', 'Compare the start-up fluid temperature and actual viscosity with the design basis; heating, recirculation or a different pump arrangement may be needed.'],
      ['Poor pump capacity', 'Check viscosity correction, suction condition, line losses and whether the pump is operating outside its suitable range.'],
      ['Unstable slurry behaviour', 'Confirm solids concentration, particle distribution, shear history and whether apparent viscosity was measured at representative shear rate.'],
      ['Heat-transfer shortfall', 'Review flow regime and viscosity at the wall or film temperature, which can differ from the bulk-fluid temperature.']
    ],
    faqs: [
      ['Is centipoise the same as mPa·s?', 'Yes. One cP equals one mPa·s for dynamic viscosity. Kinematic-viscosity units require density before they can be converted to dynamic viscosity.'],
      ['Why is viscosity important for pump selection?', 'It changes internal losses, efficiency, flow capability, power and sometimes NPSH behaviour. Use supplier data and correction methods for the actual liquid.'],
      ['Can viscosity be assumed constant in a heated process?', 'Not without checking the operating range. Many liquids change viscosity significantly with temperature, especially near cold start-up or product-change conditions.'],
      ['What makes a non-Newtonian viscosity value difficult to use?', 'The apparent value may depend on shear rate, time, temperature and test method. The calculation needs data representative of the equipment and operating regime.']
    ]
  },
  {
    file: `${base}/fluid-flow-principles/pressure-and-head/pressure-head-velocity-head-and-total-head/index.html`,
    name: 'Pressure Head, Velocity Head and Total Head',
    principle: [
      'The head form of the energy equation is useful because it expresses pressure, elevation and velocity on one length basis. It enables an engineer to follow how energy changes between two points in a system and to separate useful pressure rise from static lift, velocity changes and irreversible losses. The result is only meaningful when both points, the fluid density and the flow condition are clearly defined.',
      'Total head is not simply the reading of one gauge. It is a calculated energy quantity that may include pressure head, elevation head and velocity head, with losses and pump or turbine head considered between stations. In real systems, readings can also be affected by tapping location, pulsation, two-phase flow, local disturbances and mismatched elevation datums.'
    ],
    formulae: [
      'When a pressure is converted to metres of head, the conversion uses the density of the fluid being considered. The same pressure difference corresponds to a different head for a liquid with a different density. For this reason, always name the liquid and temperature when moving between kPa, bar and metres of liquid head.',
      'Velocity head is often small in large, slow process lines but can become material in nozzles, small pipes, high-velocity ducts and transitions. A pressure measurement at one local high-velocity point should not be mistaken for the static pressure needed at another station. Use a consistent pressure definition and measurement method.'
    ],
    method: [
      '<strong>Define stations 1 and 2.</strong> Mark the exact pressure taps or physical boundaries, including elevations and pipe diameters.',
      '<strong>Confirm the fluid basis.</strong> Use density at the actual temperature and composition, especially for hot, compressible or multiphase services.',
      '<strong>Identify the pressure type.</strong> Distinguish static, stagnation, gauge and absolute pressure and do not interchange them without conversion.',
      '<strong>Calculate velocities.</strong> Use the actual internal flow area and actual volume flow at each station.',
      '<strong>Set a common elevation datum.</strong> Record elevations from one reference plane and use a clear sign convention.',
      '<strong>Include energy addition and removal.</strong> Add pump head or subtract turbine head where these occur between stations.',
      '<strong>Include losses.</strong> Account for friction, fittings, equipment, control valves and other irreversible energy losses.',
      '<strong>Check measurement quality.</strong> Consider instrument range, calibration, tapping location, flow disturbance and transient behaviour before acting on a head balance.'
    ],
    selection: [
      'Head calculations support pump-duty definition, control-valve sizing, system-curve development, static-lift assessment and troubleshooting. They should be retained as a station-by-station energy record rather than as an isolated final number. That record makes later review possible when a pipe, valve, flow rate, liquid temperature or equipment item changes.',
      'For compressible gas systems, the incompressible head form may be insufficient because density changes materially through the system. Use a compressible-flow method, appropriate pressure conventions and a temperature/composition basis. For two-phase or flashing flow, specialised models and qualified review are needed.'
    ],
    troubleshooting: [
      ['Pump duty disagreement', 'Confirm the suction and discharge station elevations, gauge locations, liquid density and whether measured pressure includes a local velocity effect.'],
      ['Unexpected static pressure', 'Look for a control-valve position, fouled strainer, elevation change, density change or flow-rate increase that shifts the energy balance.'],
      ['Conflicting head values', 'Check that one calculation did not use metres of water while another used metres of the actual pumped liquid.'],
      ['Noisy or unstable readings', 'Review pressure-tapping arrangement, pulsation, air pockets, pump operation and transient flow before using the data in a steady-state equation.']
    ],
    faqs: [
      ['Is total head the same as gauge pressure?', 'No. Total head is an energy quantity that can include pressure, elevation and velocity terms. Gauge pressure is only one measured pressure reference.'],
      ['Why does the same pressure equal different liquid heads?', 'Head is pressure divided by specific weight. A denser liquid has greater specific weight, so a fixed pressure corresponds to fewer metres of that liquid.'],
      ['When can velocity head be neglected?', 'Only after checking its magnitude against the other terms. It is often small in large process lines but can be important in small, fast or changing-diameter lines.'],
      ['Can the incompressible energy equation be used for gases?', 'Only for limited low-density-change screening cases. Significant pressure, temperature or density change requires a suitable compressible-flow method.']
    ]
  },
  {
    file: `${base}/piping-systems/pipe-flow/pipe-friction-loss-and-darcy-weisbach-equation/index.html`,
    name: 'Pipe Friction Loss and the Darcy-Weisbach Equation',
    principle: [
      'Darcy-Weisbach expresses distributed friction loss through a pipe length using a friction factor, length-to-diameter ratio and velocity head. It is broadly applicable, but its reliability depends on a suitable friction-factor method, correct internal diameter, representative roughness, actual fluid properties and an appropriate flow-regime assessment. The equation is not a substitute for an incomplete piping model.',
      'Friction factor is not a material label that can be copied from one system to another. It changes with Reynolds number and relative roughness. Ageing, corrosion, scale, deposits, lining condition, flexible hose, internal welds and actual pipe schedule can make the installed system different from an ideal clean-pipe assumption.'
    ],
    formulae: [
      'Use the Darcy friction factor consistently. Some references use the Fanning friction factor, which differs by a factor of four. Check the equation and source convention before transferring a factor into a spreadsheet, calculator or simulation. A seemingly small convention error can create a major pressure-loss error.',
      'For a network, calculate each straight run with its own diameter, length, flow and condition. Combine those losses with fittings, valves, equipment and elevation effects in a system head balance. Do not collapse different line sizes, branches or parallel paths into one arbitrary equivalent length without a documented method.'
    ],
    method: [
      '<strong>Draw the flow path.</strong> Identify every straight run, change in diameter, branch, parallel path, control valve, equipment item and elevation change.',
      '<strong>Set the flow cases.</strong> Check normal, minimum, maximum, start-up, bypass and future-capacity cases that can change velocity and pressure loss.',
      '<strong>Confirm actual internal diameter.</strong> Use the installed schedule, lining, tube/pipe designation and corrosion allowance basis rather than nominal size alone.',
      '<strong>Obtain fluid properties.</strong> Use density and viscosity at the flow condition; viscosity can change the Reynolds number and friction factor materially.',
      '<strong>Calculate velocity and Reynolds number.</strong> Use actual flow area and flow at the relevant operating condition.',
      '<strong>Select friction factor method.</strong> Use an applicable laminar relation or a recognised turbulent-flow correlation with declared roughness basis.',
      '<strong>Calculate each distributed loss.</strong> Preserve units and identify whether the result is pressure, head or energy per mass.',
      '<strong>Review sensitivity.</strong> Test flow, roughness, viscosity, fouling, future line-up and allowable-pressure-drop assumptions before finalising the design.'
    ],
    selection: [
      'Line sizing is a compromise between pressure drop, capital cost, velocity, erosion, noise, solids transport, minimum flow, cleaning and future capacity. A larger pipe may save energy but may also reduce velocity below a required self-cleansing or solids-suspension value. Record the reason for the selected diameter rather than treating the friction calculation as the only decision criterion.',
      'For existing systems, measured differential pressure is valuable for checking model assumptions. Compare measured flow, fluid temperature, valve positions and line condition with the model case. A large difference can reveal fouling, a hidden restriction, incorrect internal diameter, an unrecorded line-up change or an instrument problem.'
    ],
    troubleshooting: [
      ['Pressure loss higher than model', 'Check actual flow, viscosity, internal diameter, partially closed valves, strainers, deposits and whether fittings or equipment losses were omitted.'],
      ['Pump cannot reach duty', 'Compare calculated total system head with pump curve at the actual fluid condition and inspect suction/discharge restrictions.'],
      ['Low flow in parallel branch', 'Model the common headers and branch resistances; flow divides according to system resistance, not simply pipe size.'],
      ['Rapid deterioration', 'Investigate scaling, corrosion, slurry deposition, liner damage or erosion that changes roughness and effective bore.']
    ],
    faqs: [
      ['What is the difference between Darcy and Fanning friction factor?', 'The Darcy factor is four times the Fanning factor. The equation and source convention must match the factor used.'],
      ['Does pipe roughness matter in all flow regimes?', 'It has little direct effect in fully laminar flow but becomes important in turbulent flow through the relative-roughness term.'],
      ['Can equivalent length replace a full fitting calculation?', 'It can be a preliminary simplification when documented, but a detailed system should use suitable fitting-loss data and actual geometry.'],
      ['Why check more than one flow case?', 'Friction loss changes strongly with velocity, so maximum, minimum, bypass and future cases may govern different equipment or operating limits.']
    ]
  },
  {
    file: `${base}/piping-systems/pipe-losses/minor-losses-in-pipes-fittings-and-valves/index.html`,
    name: 'Minor Losses in Pipes, Fittings and Valves',
    principle: [
      'The term “minor loss” describes a local loss mechanism, not necessarily a small contribution to the total system head. A control valve, partly blocked strainer, narrow entrance, abrupt expansion, filter, heat exchanger or complex branch can dominate a short piping system. Local losses arise from separation, mixing, turning, acceleration, deceleration and turbulence caused by geometry or equipment.',
      'A loss coefficient is meaningful only for the geometry, flow direction, valve position, Reynolds-number range and reference velocity used by its source. A generic value for a clean fully open valve cannot represent a throttled valve, a different fitting radius, a reversed check valve, a dirty basket strainer or an installation with closely coupled disturbances.'
    ],
    formulae: [
      'The common relation hL = K v²/(2g) uses a local reference velocity. In a change of diameter, state which pipe velocity is associated with K. Inconsistent velocity bases create silent errors. When a manufacturer provides pressure-drop data or a Cv/Kv relation, use that approved data under the stated fluid and flow conditions instead of substituting a generic K value.',
      'Local losses should be integrated into the same energy balance as distributed pipe friction, static lift and equipment pressure drop. The result may be reported as pressure loss, head loss or required pump head, but every term must be converted to one consistent basis before summing.'
    ],
    method: [
      '<strong>Inventory all local features.</strong> Include entrances, exits, bends, tees, reducers, expanders, valves, strainers, meters, filters, nozzles and equipment connections.',
      '<strong>Set the operating state.</strong> Record valve travel, clean/dirty condition, flow direction, bypass status and expected line-up for every governing case.',
      '<strong>Choose the correct data source.</strong> Prefer supplier pressure-drop curves for proprietary items and recognised data for standard fittings.',
      '<strong>Confirm reference velocity.</strong> Use the diameter and flow area specified by the K-value source, especially across changes in diameter.',
      '<strong>Calculate each loss.</strong> Keep K values, pressure-drop curves and Cv/Kv methods separate and traceable rather than mixing conventions.',
      '<strong>Include interactions where needed.</strong> Closely spaced fittings, disturbed flow and special installations may not behave as isolated standard components.',
      '<strong>Combine with pipe friction.</strong> Add all losses to the system head calculation at each operating case.',
      '<strong>Review condition sensitivity.</strong> Test fouling, valve throttling, filter loading and future additions that could materially change the result.'
    ],
    selection: [
      'Piping layout can reduce losses before a larger pump is selected. Long-radius bends, gradual transitions, full-bore valves where appropriate, adequate strainer area and sensible valve placement can reduce the required system head and operating cost. The best choice also considers access, isolation, maintenance, process control and safety—not pressure loss alone.',
      'Control valves deserve separate review because their required pressure drop is related to control authority as well as hydraulic loss. Selecting a valve only for minimum pressure drop can produce poor controllability; selecting it only for throttling range can impose excessive energy loss. Use the control philosophy and supplier sizing method.'
    ],
    troubleshooting: [
      ['Gradual pressure-loss increase', 'Inspect strainers, filters, fouling-prone equipment and valves that may no longer be fully open.'],
      ['Poor flow control', 'Review control-valve authority, installed characteristic, upstream/downstream pressure and whether system resistance changed from the design case.'],
      ['High noise or vibration', 'Check local velocity, cavitation or flashing risk, sharp restrictions, valve trim and insufficient downstream pressure recovery.'],
      ['Unexpected branch flow split', 'Model tees, headers, valves and downstream branch losses rather than considering only straight-pipe resistance.']
    ],
    faqs: [
      ['Why are “minor” losses sometimes major?', 'A local restriction or item can dominate the total loss when the straight pipe is short, the velocity is high or the component is throttled or fouled.'],
      ['Can one K value be used for every bend?', 'No. Bend radius, angle, diameter, roughness, flow regime and nearby disturbances affect the loss. Use data that represents the actual fitting.'],
      ['When should manufacturer pressure-drop data override a handbook coefficient?', 'Use manufacturer data for proprietary valves, filters, strainers, exchangers and other equipment whenever it matches the service and operating state.'],
      ['Does a valve have the same loss when half open?', 'No. Loss can rise sharply with travel and depends on the valve type and trim. Use the valve’s installed-flow data.']
    ]
  },
  {
    file: `${base}/piping-systems/piping-design-basics/pipe-sizing-engineering-inputs-and-limitations/index.html`,
    name: 'Pipe Sizing: Engineering Inputs and Limitations',
    principle: [
      'Pipe sizing is a system decision, not the selection of a nominal diameter from a velocity table. The line must carry the required flow across credible operating cases while meeting pressure, velocity, controllability, materials, installation, cleaning, safety and cost requirements. The line can be technically oversized for one criterion and undersized for another, which is why a traceable design basis is essential.',
      'A nominal pipe size does not define its internal flow area. Schedule, wall thickness, lining, corrosion allowance, tube versus pipe convention and fabrication details affect bore and therefore velocity and pressure loss. The calculation should use the actual design internal diameter and identify any future or degraded condition that changes it.'
    ],
    formulae: [
      'Velocity is obtained from actual volume flow divided by internal area, but the governing volume may be different at a pump suction, discharge, hot-gas duct, gas compressor line or control-valve inlet. Use the actual condition at the location. For gases, a reference volume must first be translated to an actual local volume before it is used for velocity.',
      'Pressure-loss calculations need to include straight-pipe friction, fittings, valves, equipment, elevation, fluid-property variation and operating flow range. Velocity limits are screening inputs, not universal rules. A suitable velocity depends on erosion, noise, deposition, water hammer, entrained solids, two-phase risk, process control and cleaning requirements.'
    ],
    method: [
      '<strong>Define service and boundaries.</strong> State fluid, phase, composition, design/normal/minimum/maximum flow and the start/end points of the line.',
      '<strong>Set process constraints.</strong> Identify allowable pressure drop, minimum downstream pressure, velocity limits, temperature, corrosion, cleaning and safety constraints.',
      '<strong>Establish physical route.</strong> Include line length, elevation, fittings, branches, equipment connections, future tie-ins and available installation space.',
      '<strong>Select candidate bores.</strong> Use actual internal diameters for the intended material, schedule, lining and corrosion allowance.',
      '<strong>Calculate actual velocities.</strong> Convert gas/reference flows to actual local conditions before evaluating velocity.',
      '<strong>Calculate system loss.</strong> Include distributed and local losses plus static head and equipment pressure requirements.',
      '<strong>Check every operating case.</strong> Review normal, minimum, maximum, start-up, cleaning, bypass, shutdown and future-capacity cases as relevant.',
      '<strong>Document selection rationale.</strong> Retain the hydraulic results alongside mechanical, maintenance, control, cost and constructability considerations.'
    ],
    selection: [
      'For liquids, a small bore can reduce capital cost but increase pump head, operating energy, noise, erosion and sensitivity to fouling. A large bore can reduce loss but may cause low velocity, sedimentation, poor mixing or greater inventory. Slurry and viscous services often require additional criteria for deposition, settling, minimum transport velocity and start-up torque.',
      'For gas and vapour systems, compressibility, pressure ratio, choked-flow risk, noise, vibration, relief discharge, condensate and temperature change may govern. A simple incompressible velocity check is not enough for high-pressure, high-temperature, flashing or critical-service gas systems. Select a method suited to the service and project code basis.'
    ],
    troubleshooting: [
      ['Insufficient downstream pressure', 'Review the complete pressure-loss path, including control valves, filters, equipment and actual flow rather than only the main line diameter.'],
      ['Low-velocity solids deposition', 'Check the actual minimum-flow condition, material size distribution, density, viscosity and whether a flushing or operating procedure is required.'],
      ['High noise or erosion', 'Inspect local high-velocity points at valves, reducers, tees and restrictions; the nominal line velocity may hide the controlling location.'],
      ['Frequent modification requests', 'Preserve spare capacity, tie-in philosophy, route space and a documented design basis so later changes can be evaluated consistently.']
    ],
    faqs: [
      ['Can a pipe be sized only from a recommended velocity?', 'No. Velocity is one screening criterion. Pressure drop, fluid properties, equipment limits, control needs, safety and operating cases must also be checked.'],
      ['Why does internal diameter matter more than nominal size?', 'Velocity and friction loss depend on actual bore. Pipe schedule, lining and corrosion allowance can materially change the flow area.'],
      ['Should future capacity be included in pipe sizing?', 'Include it when the project basis requires it, but document the assumed flow and the cost or operability trade-off rather than hiding it in an unexplained oversize line.'],
      ['What is the best pipe diameter?', 'The best diameter is the one that meets the defined process, mechanical, safety, maintenance and economic criteria across the required operating range.']
    ]
  },
  {
    file: `${base}/pumps/centrifugal-pumps/centrifugal-pump-working-principle/index.html`,
    name: 'Centrifugal Pump Working Principle',
    principle: [
      'A centrifugal pump converts mechanical energy from its driver into fluid energy through the rotating impeller and stationary casing or diffuser. The pump does not impose a single fixed flow independently of the installation. Its actual operating point is established where the pump head-capacity characteristic intersects the system requirement at the fluid condition, speed and impeller configuration in service.',
      'Pump performance is affected by liquid density, viscosity, vapour pressure, temperature, solids, gas entrainment, impeller trim, rotation speed, wear, internal clearances and suction conditions. A published water curve is a starting reference; final selection and acceptance must use the manufacturer’s information and the actual process basis.'
    ],
    formulae: [
      'Hydraulic power is related to flow, head, density and gravity, while driver input also depends on pump and motor efficiency. These quantities must refer to the same operating point. A high-density liquid can increase required power for the same flow and head, while a high-viscosity liquid can reduce centrifugal-pump hydraulic performance and alter the duty point.',
      'Head is commonly expressed in metres of the pumped liquid, not metres of water unless that convention is explicitly stated. Convert between differential pressure and head with the actual liquid density. The system calculation must also consider suction condition and NPSH separately; sufficient discharge head does not assure a safe suction condition.'
    ],
    method: [
      '<strong>Define the required duty.</strong> State normal, minimum, maximum and any start-up or upset flow; identify required differential head and end conditions.',
      '<strong>Model the system curve.</strong> Include static lift, suction/discharge pipe loss, fittings, control valves, equipment and pressure requirements.',
      '<strong>Define the liquid.</strong> Record density, viscosity, temperature, vapour pressure, solids, corrosivity, gas content and expected variation.',
      '<strong>Check suction conditions.</strong> Calculate NPSH available for the limiting level, temperature, flow and source pressure and compare with supplier data.',
      '<strong>Select candidate pump curves.</strong> Use the actual speed, impeller diameter, efficiency, power and operating-range limits.',
      '<strong>Check driver and controls.</strong> Review motor power, VFD range, minimum continuous stable flow, recirculation and control philosophy.',
      '<strong>Review materials and sealing.</strong> Select wetted materials, seal plan, bearings and auxiliary systems appropriate to the service and reliability target.',
      '<strong>Document the duty point.</strong> Keep the curve revision, operating conditions, margins and assumptions with the purchase or design record.'
    ],
    selection: [
      'A robust centrifugal-pump selection aims to place normal operation in the manufacturer’s preferred range while allowing credible changes in system resistance and flow. Operation too far from the preferred region can increase vibration, radial thrust, recirculation, temperature rise, seal problems and bearing load. The allowable range is pump-specific and must come from the supplier and project requirements.',
      'The pump is part of a package. Suction piping, baseplate, alignment, pipe strain, driver, coupling, seal support, minimum-flow line, instrumentation, isolation valves and commissioning procedure all influence reliability. A correct hydraulic curve does not compensate for a poor suction layout, inadequate foundation, misalignment or unsuitable maintenance access.'
    ],
    troubleshooting: [
      ['Low delivered flow', 'Compare actual system resistance, valve position, impeller rotation, suction restriction, fluid viscosity and pump curve against the expected operating point.'],
      ['High vibration', 'Check operation away from the preferred region, cavitation, pipe strain, misalignment, foundation condition, bearing health and rotating-element damage.'],
      ['Motor overload', 'Review fluid density/viscosity, actual flow, impeller trim, speed, pump efficiency and whether the system curve changed after commissioning.'],
      ['Seal or bearing failures', 'Investigate suction stability, minimum-flow operation, vibration, alignment, seal-support conditions and process contaminants.']
    ],
    faqs: [
      ['Does a centrifugal pump create a fixed flow?', 'No. The flow depends on the intersection of the pump curve with the installed system curve at the actual fluid condition and speed.'],
      ['Why is NPSH checked separately from pump head?', 'Head describes the energy required to move the liquid through the system. NPSH addresses suction-side vapour-formation and cavitation risk at the pump inlet.'],
      ['Can a pump be selected from flow and head alone?', 'No. Fluid properties, NPSH, operating range, driver power, materials, seal system, controls, reliability and supplier data also matter.'],
      ['Why can a water curve be unsuitable for a viscous liquid?', 'Viscosity can change centrifugal-pump flow, head, efficiency, power and suction behaviour. Use the supplier’s correction method and service data.']
    ]
  },
  {
    file: `${base}/pumps/centrifugal-pumps/pump-curves-and-system-curves/index.html`,
    name: 'Pump Curves and System Curves',
    principle: [
      'A pump curve expresses how head, efficiency, power and NPSH requirement vary with flow for a particular pump, speed and impeller condition. A system curve expresses the head required by the installed system at each flow. The operating point is their intersection, so any change in valve position, static level, line resistance, fluid properties, pump speed or impeller condition can move the duty.',
      'The most useful curve review is therefore an operating-envelope exercise, not a single-point check. It should consider normal, minimum, maximum, future, start-up and upset cases as relevant; it should also identify minimum continuous stable flow, preferred operating region, runout limits, driver power, NPSH margin and control method.'
    ],
    formulae: [
      'A typical system curve combines static head with frictional head that often rises approximately with flow squared for a fixed liquid, pipe arrangement and valve condition. This approximation does not replace detailed modelling where viscosity, two-phase behaviour, variable equipment loss or control-valve behaviour materially changes the relationship.',
      'Pump affinity relations are useful for screening speed or impeller changes under similar conditions, but they do not replace tested curves. Flow tends to change with speed, head with speed squared and power with speed cubed; efficiency, NPSH, mechanical limits and motor capacity still require supplier confirmation.'
    ],
    method: [
      '<strong>Obtain the correct pump curve.</strong> Confirm model, impeller diameter, speed, rotation, test liquid, curve revision and applicable tolerance.',
      '<strong>Define system boundaries.</strong> Identify suction source, discharge destination, static levels, pressures, pipe runs, fittings, equipment and control valves.',
      '<strong>Build curves for operating cases.</strong> Calculate normal, minimum, maximum and credible future or upset system requirements.',
      '<strong>Plot the operating point.</strong> Locate the intersection of pump and system curves at the actual liquid condition.',
      '<strong>Check efficiency and power.</strong> Read values at the duty point and verify the driver across the full allowable flow range.',
      '<strong>Check operating limits.</strong> Review preferred range, minimum continuous stable flow, runout, vibration, temperature rise and recirculation limits.',
      '<strong>Check NPSH margin.</strong> Compare NPSHa and NPSHr at the controlling flow and speed, not only at the nominal point.',
      '<strong>Set the control philosophy.</strong> Review throttling, VFD, bypass, parallel operation or impeller trimming with the supplier and process requirements.'
    ],
    selection: [
      'A throttling valve moves the operating point by increasing system resistance, while a VFD changes the pump curve through speed. Either approach can be appropriate, but their energy, controllability, turndown, minimum-flow and reliability effects differ. Compare the full operating envelope rather than selecting controls from a single normal-point curve.',
      'Parallel pumps add another layer because each unit and the common piping influence flow division. An operating point that is stable with one pump may be unstable or inefficient with two. Use combined-pump curves, common-header losses and minimum-flow requirements when assessing staged or parallel arrangements.'
    ],
    troubleshooting: [
      ['Measured duty differs from curve', 'Verify curve revision, impeller trim, speed, rotation, actual liquid properties, system line-up, instrument calibration and pressure-tap locations.'],
      ['Operation near runout', 'Inspect discharge resistance, bypass paths and control action; high flow may overload the driver or reduce NPSH margin.'],
      ['Operation at low flow', 'Check minimum continuous stable flow, recirculation, temperature rise, internal recirculation, vibration and seal/bearing conditions.'],
      ['Parallel-pump instability', 'Review common-header curve, check-valve behaviour, pump-curve shape, pump matching and control sequencing.']
    ],
    faqs: [
      ['What sets a pump operating point?', 'The operating point is the intersection of the actual pump curve and the actual system curve at the fluid condition, speed and configuration in service.'],
      ['Can a control valve increase pump capacity?', 'A throttling valve increases resistance and normally moves the operating point to lower flow. It may be needed for control, but it does not create pump head.'],
      ['Why review driver power at runout?', 'Some pumps draw their highest power at high flow. A normal-point motor check may not protect the driver at low system resistance or abnormal line-up.'],
      ['Are affinity laws enough to approve a speed change?', 'No. They are screening relations. Confirm the actual curve, NPSH, power, vibration, mechanical speed, seal and motor/VFD limits with the supplier.']
    ]
  },
  {
    file: `${base}/pumps/pump-operation/npsh-and-cavitation-in-pumps/index.html`,
    name: 'NPSH and Cavitation in Pumps',
    principle: [
      'NPSH available is a system property calculated at the pump inlet; NPSH required is a pump characteristic at a stated flow, speed and impeller condition. They must be compared at the same operating case. An NPSH calculation that uses a nominal flow while the pump can run near maximum flow may miss the condition with the least margin.',
      'Cavitation is not the only suction failure mechanism. Air entrainment, vortexing, inadequate submergence, gas breakout, flashing, poor inlet geometry, suction recirculation and transients can also degrade performance. A satisfactory simple NPSH margin does not remove the need to assess the source vessel, sump, pipe layout and operating changes.'
    ],
    formulae: [
      'The vapour-pressure term must correspond to the liquid temperature and composition. It can change quickly for hot water, hydrocarbons, solvents and volatile mixtures. Use absolute pressure throughout the NPSH balance; gauge pressure and absolute vapour pressure cannot be safely combined without conversion.',
      'Suction loss increases with flow and can increase further when a strainer fouls, a valve is partially closed, a pipe is undersized or the liquid becomes more viscous. Calculate the limiting case rather than relying on a clean, cool, normal-flow line-up. The project and supplier should define the required margin method.'
    ],
    method: [
      '<strong>Define controlling scenarios.</strong> Consider high temperature, low level, maximum flow, lowest source pressure, site elevation, dirty strainer and abnormal line-up.',
      '<strong>Draw the complete suction path.</strong> Include source vessel, liquid surface, submergence, pipe, reducers, valves, strainers, meters, fittings and pump inlet datum.',
      '<strong>Obtain actual fluid data.</strong> Use density and vapour pressure at the controlling temperature and composition.',
      '<strong>Set source absolute pressure.</strong> Use atmospheric pressure at site elevation or vessel absolute pressure as appropriate.',
      '<strong>Calculate static contribution.</strong> Measure liquid level relative to pump centreline with a stated sign convention.',
      '<strong>Calculate suction loss.</strong> Include actual bore, flow, viscosity, fittings, clean/dirty strainer conditions and any suction equipment.',
      '<strong>Obtain NPSHr data.</strong> Use the supplier curve for the selected pump, speed, impeller trim and flow.',
      '<strong>Review margin and inlet hydraulics.</strong> Apply project/supplier margin criteria and assess vortexing, entrainment, transients and installation geometry.'
    ],
    selection: [
      'NPSH margin can often be improved by lowering the pump, raising the source pressure or liquid level, reducing suction losses, increasing suction-pipe bore, simplifying the inlet, lowering liquid temperature, using a lower-speed pump or selecting a pump with more favourable suction characteristics. Each option has layout, cost, maintenance and process implications that should be compared early.',
      'Suction lines should generally promote calm, uniform flow into the pump. Avoid arrangements that trap gas, create strong swirl or place closely coupled elbows, reducers or restrictions immediately upstream without considering supplier installation guidance. The exact arrangement is pump- and service-specific, so use the manufacturer and project standards for final layout.'
    ],
    troubleshooting: [
      ['Noise resembling gravel', 'Investigate cavitation, but also check entrained air, loose components, bearing condition and piping vibration before assigning the cause.'],
      ['Problem only at high temperature', 'Recalculate vapour pressure and NPSHa at the actual hot condition; a previously adequate cool-service margin may disappear.'],
      ['Problem after maintenance', 'Check strainer condition, valve position, suction-line assembly, gasket intrusion, pump elevation and any change in source level or line-up.'],
      ['Intermittent vibration', 'Review low source level, vortexing, air entrainment, level-control cycling, parallel-pump interaction and transient operation.']
    ],
    faqs: [
      ['Can NPSHa be calculated from gauge pressure?', 'Only after converting the source pressure to an absolute basis. Vapour pressure and NPSH relations use absolute pressure.'],
      ['Why does a dirty strainer affect NPSH?', 'It adds suction-side loss, reducing the pressure margin available at the pump inlet, especially at high flow.'],
      ['Does a larger suction pipe always solve cavitation?', 'It can reduce suction loss, but cavitation risk can also be driven by temperature, source pressure, pump selection, inlet geometry, vortexing or air entrainment.'],
      ['Is NPSHr a fixed number for a pump?', 'No. It varies with flow, speed and impeller condition. Use the supplier curve for the actual selected configuration.']
    ]
  },
  {
    file: `${base}/fans-and-duct-systems/duct-systems/duct-pressure-loss/duct-pressure-loss-and-system-resistance/index.html`,
    name: 'Duct Pressure Loss and System Resistance',
    principle: [
      'Duct-system resistance is the pressure required to move a specified actual air or gas volume through the complete path. It includes straight-duct friction and local losses through hoods, entries, bends, branches, transitions, dampers, filters, coils, silencers, dust collectors, outlets and process equipment. A fan selected on only the main-duct friction loss is unlikely to meet the real duty.',
      'For many fixed air systems, the frictional part of resistance rises approximately with the square of actual volume flow. Static-pressure requirements, variable dampers, loading filters and equipment behaviour can modify this relationship. The relevant density is the actual fan-inlet or duct condition; a standard-air flow must first be translated before it is used for velocity or loss calculation.'
    ],
    formulae: [
      'Pressure loss can be expressed as total, static or velocity pressure depending on the calculation convention. Use one consistent set of definitions across the fan curve, duct model and measured data. A static-pressure value from one station cannot be added blindly to a total-pressure value from another without understanding the velocity and measurement basis.',
      'Equivalent-length methods may be useful for early screening, but detailed systems should model important fittings, hoods, branches, filters, dampers and proprietary equipment with suitable loss data. Components whose resistance changes in service, such as filters and collectors, need clean and dirty conditions rather than one fixed value.'
    ],
    method: [
      '<strong>Define the duty station and flow basis.</strong> Mark actual volume, density, temperature and the fan inlet/discharge condition represented by each calculation.',
      '<strong>Map the complete air path.</strong> Include capture hood, duct runs, branches, transitions, dampers, filters, collector, fan, stack and discharge components.',
      '<strong>Set operating cases.</strong> Check normal, minimum, maximum, clean, dirty, future and abnormal damper or branch line-up conditions.',
      '<strong>Select duct geometry.</strong> Use actual duct dimensions, shape, material, lining, roughness and route including access doors and fittings.',
      '<strong>Calculate velocities.</strong> Use actual local volume and internal area; identify high-velocity restrictions separately from main duct runs.',
      '<strong>Calculate distributed and local loss.</strong> Use compatible friction and fitting-loss methods plus supplier data for equipment.',
      '<strong>Build the system curve.</strong> Combine losses and static requirements at each flow, then compare with the selected fan curve.',
      '<strong>Review operation and maintenance.</strong> Check fan power, VFD range, filter loading, noise, vibration, capture performance and access for balancing.'
    ],
    selection: [
      'Duct sizing balances pressure loss, capture or transport velocity, noise, erosion, deposition, space, fabrication cost and fan energy. A large duct can reduce friction but may fail to maintain particulate transport; a small duct may be noisy, erosive and power-intensive. Where dust is present, use the required conveying or capture-velocity basis and validate it for the actual particulate material.',
      'Air-pollution-control systems must be considered from hood to discharge. The collector pressure drop, filter-cleaning cycle, hopper evacuation, leakage, stack condition and fan arrangement can affect the delivered flow at the hood. A good system curve includes the likely dirty condition and the effect of balancing dampers, not only the clean new installation.'
    ],
    troubleshooting: [
      ['Poor capture at a hood', 'Check delivered flow, hood geometry, branch balancing, damper position, duct leakage, collector loading and system resistance.'],
      ['High fan power', 'Review actual flow, density, filter condition, fan speed, pressure measurement basis and whether a damper or bypass has shifted the operating point.'],
      ['Dust settling in ducts', 'Evaluate actual transport velocity, particle characteristics, branch flows, horizontal runs and whether the material changed from the original design basis.'],
      ['Noise and vibration', 'Inspect high-velocity restrictions, fan operation near unstable region, unbalanced dampers, flexible connections, supports and pulsation sources.']
    ],
    faqs: [
      ['Why use actual air volume for duct velocity?', 'Duct area contains the gas at the local operating condition. A standard or normal volume must be converted to actual volume before calculating velocity and pressure loss.'],
      ['Do dirty filters change the system curve?', 'Yes. Their pressure drop can rise substantially, shifting the fan operating point and reducing delivered flow unless control action compensates.'],
      ['Can duct friction be calculated without the hood and collector?', 'Only as a partial check. Fan selection needs the resistance of the complete path from inlet or hood through discharge.'],
      ['Why is branch balancing important?', 'Parallel branches divide flow according to their resistance. Without balancing, one hood may receive excess flow while another receives insufficient capture.']
    ]
  },
  {
    file: `${base}/fans-and-duct-systems/industrial-fans/fan-laws-static-pressure-and-fan-power/index.html`,
    name: 'Fan Laws, Static Pressure and Fan Power',
    principle: [
      'Fan laws are similarity relations used to estimate how a comparable fan responds to a change in speed, size or density. They are most reliable when the fan geometry, flow regime and efficiency remain sufficiently similar. They are valuable for screening VFD changes and preliminary studies, but they cannot replace a manufacturer’s tested curve or a complete system-resistance calculation.',
      'A fan’s operating point is determined jointly by the fan performance curve and the system curve. Increasing speed moves the fan characteristic, but the actual flow response depends on system resistance and control configuration. Power may rise far faster than flow because the approximate speed relationship is cubic, which can quickly exceed motor, VFD, shaft or acoustic limits.'
    ],
    formulae: [
      'The basic affinity relations are usually stated as flow proportional to speed, pressure proportional to speed squared and power proportional to speed cubed for the same fan at similar density. Density correction and efficiency change must be considered separately. Do not use the simplified relations to compare unrelated fan designs or materially different gases without supplier guidance.',
      'Static pressure, total pressure and velocity pressure should be defined consistently with the fan curve and testing convention. An error in pressure definition can lead to the wrong system curve, fan selection or measured-performance conclusion. Use the applicable manufacturer and industry convention for the fan type and measurement arrangement.'
    ],
    method: [
      '<strong>Identify the fan and curve basis.</strong> Confirm fan type, speed, impeller, gas density, test standard, curve revision and the pressure definition used.',
      '<strong>Define the system.</strong> Include all duct, hood, filter, equipment, damper, collector and discharge losses at actual operating conditions.',
      '<strong>Set the operating envelope.</strong> Identify minimum, normal, maximum, clean, dirty, seasonal and future flow requirements.',
      '<strong>Locate operating points.</strong> Intersect the fan curve with the appropriate system curve for each case.',
      '<strong>Apply fan laws cautiously.</strong> Use them only for comparable changes and treat the output as a screening estimate.',
      '<strong>Check absorbed power.</strong> Verify motor, VFD, electrical supply, mechanical speed, shaft, bearing and temperature limits across the range.',
      '<strong>Check stability and acoustics.</strong> Avoid unsuitable stall, surge, vibration or noise regions according to manufacturer guidance.',
      '<strong>Plan verification.</strong> Specify the flow, pressure, temperature, density and measurement locations needed during commissioning or troubleshooting.'
    ],
    selection: [
      'Fan selection should consider the entire operating envelope, not simply the highest efficiency at one point. A fan may need stable turndown, a dirty-filter margin, high-temperature materials, corrosion resistance, access for maintenance, acceptable sound, safe motor loading and compatibility with VFD control. These factors are often as important as the nominal airflow and pressure.',
      'Dampers and VFDs are different control tools. Dampers raise system resistance and dissipate pressure; VFDs can reduce speed and often reduce energy at part load, but their achievable range is constrained by fan stability, motor cooling, minimum flow, process capture requirements and mechanical limitations. The control choice must follow the system and process duty.'
    ],
    troubleshooting: [
      ['Flow lower than expected', 'Verify system resistance, filter condition, damper position, rotation, fan speed, density and whether the measured pressure uses the same definition as the curve.'],
      ['Motor overload after speed increase', 'Review cubic power sensitivity, actual density, fan efficiency, system resistance and whether the operating point shifted toward high flow.'],
      ['Unstable operation', 'Check for stall or surge region, poor system-curve match, parallel fans, pulsation, inlet distortion and rapid control changes.'],
      ['High sound level', 'Investigate tip speed, local restrictions, damper throttling, turbulence, discharge arrangement, structural transmission and fan operating point.']
    ],
    faqs: [
      ['Why does a small speed increase cause a large power rise?', 'For a similar fan at comparable conditions, power varies approximately with the cube of speed. This makes motor and VFD checks essential before increasing speed.'],
      ['Can a VFD always replace a damper?', 'Not always. The fan must remain stable, mechanically suitable and capable of meeting process minimum-flow and pressure requirements across the speed range.'],
      ['What pressure should be used for fan selection?', 'Use the pressure definition required by the manufacturer’s curve and the applicable test convention, matched to the complete system calculation.'],
      ['Do fan laws apply to every fan type?', 'They are similarity relations for comparable configurations and conditions. Final selection needs the specific manufacturer curve and operating-limit review.']
    ]
  }
];

const finalDesignAdditions = new Map([
  ['air-density-explained.html', {
    discussion: [
      'For a project calculation, issue a condition schedule rather than an isolated density number. The schedule should list each air or gas stream, its location, actual pressure and temperature, humidity or composition basis, actual and reference volume conventions, density, mass flow, measurement source and the calculation or simulation method. This exposes incompatible assumptions before they propagate into a fan, burner, heat balance, stack or emissions calculation.',
      'During commissioning, compare measured conditions with the design basis at the fan inlet and the duty station. A flow result may appear wrong because the instrument reports actual volume while the design report shows a dry standard volume. Reconcile the bases before adjusting dampers, fan speed or equipment settings. Any persistent difference should be investigated with calibrated pressure, temperature and flow measurements.'
    ],
    checklist: ['Identify every actual, wet-standard and dry-standard flow convention in the design package.', 'Record local atmospheric pressure or plant vessel pressure as an absolute value.', 'Define humidity, gas composition and condensable-vapour assumptions for every non-dry-air stream.', 'Use the same station condition for density, actual volume and mass-flow calculations.', 'Confirm fan and motor curves use a compatible density and pressure convention.', 'Specify commissioning measurements that can reproduce the adopted condition basis.']
  }],
  [`${base}/fluid-properties/density-and-specific-gravity/density-specific-gravity-and-specific-weight/index.html`, {
    discussion: [
      'A property register should accompany design calculations that depend on density. For each material, state the material description, relevant grade or concentration, physical state, temperature and pressure range, whether the value is true, liquid, bulk, loose, compacted or tapped density, the source, date and applicability. This prevents an unqualified density from being copied into unrelated storage, hydraulic, structural or mass-balance work.',
      'Where density affects safety, capacity or procurement, request a representative value range instead of a single nominal number. For a bulk material, include moisture, particle-size distribution, compaction and aeration sensitivity. For a liquid, include temperature and composition. For a gas, include pressure, temperature and molecular composition. The governing calculation should show which extreme is conservative for its purpose.'
    ],
    checklist: ['Define the physical volume boundary, including or excluding voids and entrained gas.', 'Use a source that represents the actual material grade, mixture or bulk-solid condition.', 'State temperature, pressure, moisture and compaction condition with every selected value.', 'Distinguish mass density from specific weight and specific gravity before calculation.', 'Identify whether the low or high property value is conservative for each decision.', 'Retain certificates, laboratory methods or approved reference sources with the design record.']
  }],
  [`${base}/fluid-properties/viscosity/dynamic-and-kinematic-viscosity/index.html`, {
    discussion: [
      'The design basis should show viscosity across the credible operating envelope, not only at a nominal temperature. Include cold start, normal production, maximum temperature, composition change, solids loading and expected shear regime. For non-Newtonian material, identify the required rheological model or test data. That information lets pump, piping, heating, mixing and control decisions be reviewed against the same physical basis.',
      'Commissioning and troubleshooting benefit from comparing measured pressure drop, flow, temperature and power with a condition-corrected model. A pressure increase may be caused by colder material, higher solids, a changed formulation, fouling or a flow-meter error. Separating these causes avoids an unnecessary pump or line-size change when the actual issue is a process-condition shift.'
    ],
    checklist: ['Obtain viscosity data at the normal, lowest and highest credible operating temperatures.', 'Confirm whether dynamic or kinematic viscosity is required by each equation.', 'For non-Newtonian service, state test method, shear-rate range and time dependence.', 'Check actual fluid density before converting between dynamic and kinematic viscosity.', 'Review pump curve corrections, motor torque and pressure-loss limits at the worst case.', 'Define field measurements needed to verify viscosity-sensitive performance after start-up.']
  }],
  [`${base}/fluid-flow-principles/pressure-and-head/pressure-head-velocity-head-and-total-head/index.html`, {
    discussion: [
      'A practical energy-balance sheet should identify every calculation station with elevation, pipe size, velocity, pressure type, density basis, energy addition or removal and intervening loss. This makes the result auditable and allows a reviewer to trace a reported pump head or pressure shortfall to its physical source. It is preferable to one final total with no defined station references.',
      'Before finalising an energy balance, reconcile it with measurement capability. Pressure transmitters must have appropriate ranges and locations; elevations need a common datum; flow measurement must represent the intended station; and transient or pulsating systems may require time-averaged or specialised analysis. A steady-state equation cannot make uncertain field data more reliable.'
    ],
    checklist: ['Name every calculation station and establish one elevation datum.', 'State whether each pressure is static, stagnation, gauge or absolute.', 'Use fluid density appropriate to the station temperature and composition.', 'Include all pump, turbine, control-valve and equipment terms between stations.', 'Test whether velocity-head or compressibility effects are material to the result.', 'Specify pressure-tap, flow-measurement and commissioning checks for verification.']
  }],
  [`${base}/piping-systems/pipe-flow/pipe-friction-loss-and-darcy-weisbach-equation/index.html`, {
    discussion: [
      'A friction-loss calculation becomes a design tool when it is connected to allowable pressure drop, pump head, energy cost, control margin and the installed piping configuration. Record the selected internal diameter, roughness basis, corrosion or lining assumption, property condition, correlation and all operating cases. These inputs are just as important as the computed loss because they determine whether the result still applies after a material, schedule or process change.',
      'For long lines, high-energy services, slurry systems or critical process duties, carry out a sensitivity review. Vary flow, viscosity, roughness, fouling and future capacity within credible bounds. The purpose is not to make the model look precise; it is to identify which uncertainty controls the pump duty, allowable pressure, motor power or operating procedure.'
    ],
    checklist: ['Use actual internal diameters for the material, schedule, lining and corrosion allowance.', 'Identify the friction-factor convention and correlation used in the calculation.', 'Apply density and viscosity at the actual operating condition for each case.', 'Include parallel branches, changes in diameter, fittings and equipment in the system model.', 'Test clean/fouled and normal/maximum/future flow cases where they affect the decision.', 'Retain the pressure-loss schedule and model inputs with the pump or piping design record.']
  }],
  [`${base}/piping-systems/pipe-losses/minor-losses-in-pipes-fittings-and-valves/index.html`, {
    discussion: [
      'Local-loss documentation should identify every component whose condition or position can change the system head. This includes control valves, filters, strainers, check valves, equipment nozzles, meters and temporary screens. Where a supplier curve exists, save the curve revision and the clean/dirty, flow, fluid and valve-position basis. That is more defensible than an unexplained handbook coefficient applied to a proprietary component.',
      'During field review, prioritise components that can create a concentrated loss or poor flow distribution. A short restriction can matter more than many metres of pipe. Differential-pressure measurement across a strainer, filter or valve can validate the model and reveal abnormal fouling, but measurement taps must be located and interpreted consistently.'
    ],
    checklist: ['Create a fitting-and-equipment loss register for every significant component.', 'Use manufacturer pressure-drop data for proprietary items when available.', 'State the reference velocity used with each K value, especially at diameter changes.', 'Record valve type, travel, trim and expected control position for governing cases.', 'Include clean and dirty resistance where filters, strainers or collectors are present.', 'Specify differential-pressure measurements that will validate critical local losses.']
  }],
  [`${base}/piping-systems/piping-design-basics/pipe-sizing-engineering-inputs-and-limitations/index.html`, {
    discussion: [
      'The selected line size should be accompanied by a concise decision record: required flow envelope, actual velocity range, pressure-loss results, downstream pressure requirement, material and schedule, route constraints, corrosion allowance, maintenance needs, future capacity and the criteria that governed. This allows future projects to understand whether the size was selected for hydraulics, solids transport, noise, controllability, cleaning, standardisation or capital cost.',
      'For complex services, review pipe sizing with process, mechanical, operations and maintenance stakeholders before issue. A hydraulically acceptable line may be impossible to drain, clean, support, insulate, inspect or isolate safely. Conversely, a mechanically convenient standard size may need a revised pump, control valve or operating procedure if its hydraulic performance is unsuitable.'
    ],
    checklist: ['List the required normal, minimum, maximum, start-up and future flow cases.', 'Use the selected material, schedule, lining and corrosion allowance to determine actual bore.', 'Check pressure drop, velocity, downstream pressure and static elevation together.', 'Apply service-specific criteria for solids, viscosity, erosion, noise, flushing or cleaning.', 'Review constructability, access, drains, vents, supports and insulation with the route layout.', 'Record the governing criterion and any approved deviation from a standard velocity guideline.']
  }],
  [`${base}/pumps/centrifugal-pumps/centrifugal-pump-working-principle/index.html`, {
    discussion: [
      'A pump data sheet should translate the process duty into a complete pump package requirement. In addition to normal and rated flow/head, include operating range, liquid properties, NPSH basis, materials, seal plan, driver, motor margin, controls, baseplate, instrumentation, auxiliaries, inspection, testing and applicable standards. The package must remain suitable through start-up, low flow, high flow, temperature variation and credible abnormal line-ups.',
      'After installation, verify the pump against the documented duty rather than relying on a single discharge-pressure reading. Measure or infer flow, suction and discharge pressure at defined taps, liquid temperature, speed, motor power, vibration and seal conditions. Compare the values with the actual system curve and curve revision. This establishes a defensible baseline for later performance changes.'
    ],
    checklist: ['Define normal, rated, minimum, maximum and abnormal flow/head cases.', 'State liquid density, viscosity, vapour pressure, solids, gas content and temperature range.', 'Calculate NPSHa for limiting conditions and compare against the selected pump curve and required margin.', 'Check preferred operating range, minimum-flow requirement, runout power and driver capacity.', 'Specify wetted materials, sealing, auxiliary systems, instrumentation and maintenance access.', 'Plan commissioning tests for flow, pressure, power, vibration, rotation, alignment and seal performance.']
  }],
  [`${base}/pumps/centrifugal-pumps/pump-curves-and-system-curves/index.html`, {
    discussion: [
      'Maintain a curve register that ties each plotted pump curve to a manufacturer revision, impeller diameter, speed, test liquid, efficiency basis and tolerance. Maintain a matching system-curve record that identifies static conditions, pipe and equipment losses, flow cases, fluid properties and valve line-up. Without these references, a later operating-point discussion can become an argument between unmatched data sources.',
      'Use curve review as an operating-management tool. It can indicate when a control valve is wasting excessive head, when a VFD speed change is approaching a power limit, when parallel sequencing is unstable or when a fouled system has shifted from its baseline. The review must be refreshed after major piping, equipment, fluid or control changes.'
    ],
    checklist: ['Use the supplier curve revision for the exact pump, impeller, speed and rotation.', 'Prepare system curves for normal, minimum, maximum, future and abnormal line-up cases.', 'Locate efficiency, power, NPSH and allowable operating-range limits at every expected point.', 'Check runout and low-flow conditions, not only the rated intersection.', 'Evaluate the selected control method for energy, stability, turndown and minimum-flow needs.', 'Save commissioning points and measurements as the baseline for later curve comparison.']
  }],
  [`${base}/pumps/pump-operation/npsh-and-cavitation-in-pumps/index.html`, {
    discussion: [
      'The NPSH calculation should be retained with a suction-system sketch that shows the liquid source, level range, pressure basis, elevation, pipe size, fittings, strainer, valves, flow direction and pump datum. It should list the controlling liquid temperature, density, vapour pressure, source pressure, calculated loss and the selected NPSHr curve. This makes the suction-margin decision reviewable after layout or operating changes.',
      'Commissioning should verify the assumptions that are practical to measure: liquid level, source pressure, temperature, valve position, strainer differential pressure, pump speed and flow. If noise, vibration or performance loss occurs, compare the actual limiting scenario with the design calculation before changing the pump. The root cause may be operating condition or inlet hydraulics rather than insufficient nominal head.'
    ],
    checklist: ['Draw the entire suction path and define the pump-inlet datum.', 'Use absolute source pressure and vapour pressure at the controlling liquid condition.', 'Check low level, high flow, high temperature, dirty strainer and abnormal line-up cases.', 'Use NPSHr data for the selected pump, speed, impeller trim and flow.', 'Apply the project and supplier margin criterion and review inlet hydraulic risks separately.', 'Specify field checks for level, temperature, strainer drop, pressure, flow and vibration during commissioning.']
  }],
  [`${base}/fans-and-duct-systems/duct-systems/duct-pressure-loss/duct-pressure-loss-and-system-resistance/index.html`, {
    discussion: [
      'A complete duct-system calculation should provide a resistance schedule from the capture point or inlet through the fan and discharge. For each branch, list actual air volume, density, velocity, duct dimensions, straight-run loss, fittings, damper position, equipment loss, clean/dirty condition and the governing operating case. This register makes balancing, fan selection and later troubleshooting much more reliable than a single total static-pressure number.',
      'Commissioning should measure enough data to reconcile the system curve: fan speed, flow at representative branches, static or total pressure at defined locations, filter or collector differential pressure, damper positions, temperature and density basis. Compare results with the clean and dirty design cases. A system can appear adequate at the fan while one critical hood or branch remains under-ventilated.'
    ],
    checklist: ['Identify actual gas volume, density and temperature at the calculation station.', 'Prepare a branch-by-branch resistance schedule from hood or inlet to discharge.', 'Include hoods, transitions, dampers, filters, collectors, silencers and discharge losses.', 'Check clean, dirty, minimum, maximum, future and abnormal branch line-up cases.', 'Compare all operating system curves with fan performance, power, stability and noise limits.', 'Plan commissioning measurement locations and balancing actions for every critical branch.']
  }],
  [`${base}/fans-and-duct-systems/industrial-fans/fan-laws-static-pressure-and-fan-power/index.html`, {
    discussion: [
      'A fan selection and control record should state the fan curve revision, impeller and speed, gas density and temperature, pressure convention, system curves, operating envelope, motor/VFD limits, noise target, required turndown, dirty-condition margin and commissioning data. This prevents a later speed change from being made against an incomplete or incompatible curve basis.',
      'Commission fan control from measured system behaviour rather than assuming the affinity laws exactly describe the installation. Confirm flow, pressure, speed, power, temperature, density and vibration through the expected range. If the fan serves capture, combustion or pollution-control duties, verify that the minimum process requirement is met before pursuing energy savings by reducing speed.'
    ],
    checklist: ['Confirm the fan curve, test standard, pressure definition and reference gas condition.', 'Build system curves for all operating, clean/dirty and future cases at actual density.', 'Check power, motor, VFD, shaft, bearing and mechanical speed limits across the range.', 'Review stable operating range, stall/surge risk, noise and vibration for the selected control method.', 'Evaluate damper and VFD strategies against process minimum-flow and energy requirements.', 'Specify commissioning measurements for flow, pressure, temperature, density, speed, power and vibration.']
  }]
]);

const depthClosingNotes = new Map([
  ['air-density-explained.html', 'For design release, reconcile density-dependent results across the full package: fan selection, motor loading, duct velocity, heat balance, combustion-air requirement and emissions reporting. If different teams use different reference conditions, provide a conversion table and name the responsible condition basis. This simple coordination step is often more valuable than reporting density to unnecessary decimal places.'],
  [`${base}/fluid-properties/density-and-specific-gravity/density-specific-gravity-and-specific-weight/index.html`, 'The final property value should be selected for the consequence being checked. The highest liquid density may govern static load, the lowest may govern pump pressure-to-head conversion, and a conservative bulk-density range may be required for capacity or structural work. State the rationale rather than assuming one value is conservative for every engineering decision.'],
  [`${base}/fluid-properties/viscosity/dynamic-and-kinematic-viscosity/index.html`, 'Where viscosity controls equipment performance, include the expected temperature path in operating procedures. A line that works during hot production may not start after a cold shutdown. Define heating, recirculation, flushing, minimum-speed, pressure-alarm and sampling requirements from the verified fluid behaviour rather than from a nominal data-sheet value.'],
  [`${base}/fluid-flow-principles/pressure-and-head/pressure-head-velocity-head-and-total-head/index.html`, 'An energy balance should always state what it does not include. For example, a simplified steady liquid calculation may omit compressibility, flashing, transient surge, two-phase slip, pump pulsation or control dynamics. Naming these boundaries prevents a preliminary head balance from being used as proof that a more specialised hydraulic review is unnecessary.'],
  [`${base}/piping-systems/pipe-flow/pipe-friction-loss-and-darcy-weisbach-equation/index.html`, 'For final issue, compare calculated pressure loss with the allowable pressure at every affected item, not merely with the pump head. Equipment such as control valves, spray nozzles, exchangers, filters, meters and process consumers can have independent minimum-pressure requirements that turn an apparently acceptable line loss into a system constraint.'],
  [`${base}/piping-systems/pipe-losses/minor-losses-in-pipes-fittings-and-valves/index.html`, 'The final loss schedule should identify any item with a manufacturer guarantee or operating limit. A valve Cv, filter clean/dirty differential pressure, strainer capacity or exchanger allowable drop should be traceable to the selected item and duty. Generic loss factors remain useful for early layout studies but should not silently replace approved equipment data.'],
  [`${base}/piping-systems/piping-design-basics/pipe-sizing-engineering-inputs-and-limitations/index.html`, 'Pipe size must also be coordinated with pressure rating, wall thickness, supports, expansion flexibility, insulation, heat tracing, drains, vents and access. The hydraulic calculation defines only one part of the line. Resolve conflicts before procurement, because a late schedule, material or routing change can alter both the bore and the pressure-loss result.'],
  [`${base}/pumps/centrifugal-pumps/centrifugal-pump-working-principle/index.html`, 'Before purchase or final approval, compare the proposed pump package with the operating philosophy: duty/standby arrangement, automatic start, minimum-flow protection, isolation, flushing, spares, lifting, alignment access and alarm response. These package decisions determine whether an acceptable hydraulic selection remains reliable in normal operation and maintenance.'],
  [`${base}/pumps/centrifugal-pumps/pump-curves-and-system-curves/index.html`, 'Curve information should be controlled like any other design input. If an impeller trim, speed, fluid property, line route, valve philosophy or equipment pressure drop changes, regenerate the operating-envelope plot. This avoids commissioning a pump against a system curve that was correct for an earlier version of the process or piping design.'],
  [`${base}/pumps/pump-operation/npsh-and-cavitation-in-pumps/index.html`, 'NPSH review should be revisited when the source vessel level, product temperature, process composition, pump speed, pipe bore, strainer arrangement or suction line-up changes. These changes can reduce margin without changing the specified discharge head, which is why suction analysis must be managed separately from the normal pump-duty calculation.'],
  [`${base}/fans-and-duct-systems/duct-systems/duct-pressure-loss/duct-pressure-loss-and-system-resistance/index.html`, 'A duct model should be updated after significant layout, hood, collector, filter-media, branch-demand or fan-control changes. Small additions can move resistance enough to disturb branch balance or fan power. Preserve the original resistance schedule and measurements so modifications are checked against a known system baseline instead of an assumed clean condition.'],
  [`${base}/fans-and-duct-systems/industrial-fans/fan-laws-static-pressure-and-fan-power/index.html`, 'For final approval, define the permitted speed range and control response together with the process owner. The maximum speed must respect power and mechanical limits; the minimum speed must sustain capture, combustion, cooling, ventilation or process flow. These limits should be configured, tested and documented rather than left to informal operator judgement.']
]);

const coreRangeCompletions = new Map([
  [`${base}/piping-systems/pipe-flow/pipe-friction-loss-and-darcy-weisbach-equation/index.html`, 'For pressure-critical systems, state the residual-pressure requirement at the remote consumer and calculate the complete path to that point. This converts a friction-loss result into an operational requirement rather than a standalone number. Review the result against normal and maximum consumption conditions so the remote user is not starved when demand changes.'],
  [`${base}/piping-systems/pipe-losses/minor-losses-in-pipes-fittings-and-valves/index.html`, 'When an item is both a hydraulic restriction and a maintainable component, provide isolation, bypass, differential-pressure indication and safe access as required by the service. These details can determine whether the calculated clean and dirty losses remain manageable in operation.'],
  [`${base}/piping-systems/piping-design-basics/pipe-sizing-engineering-inputs-and-limitations/index.html`, 'Check the selected bore against the available standard sizes and component bores, then update the hydraulic model using the final selected size. A nominally minor standardisation change can materially alter velocity or pressure loss in a small or high-flow line.'],
  [`${base}/pumps/centrifugal-pumps/pump-curves-and-system-curves/index.html`, 'Where test acceptance is required, define the permitted flow, head, efficiency, power, NPSH and vibration tolerances before procurement. The acceptance point, test liquid and conversion method must match the contractual duty basis; otherwise a valid factory test may not demonstrate the site operating requirement. Retain the agreed acceptance curve with the operating-envelope plot for future comparison, together with the equipment data sheet, approved control philosophy and actual commissioning readings. This package provides a clear baseline for performance, capacity and maintenance decisions.'],
  [`${base}/pumps/pump-operation/npsh-and-cavitation-in-pumps/index.html`, 'If the service is especially sensitive, agree the suction-margin and test or verification method with the pump supplier early. This avoids discovering a restrictive suction requirement only after the vessel elevation, piping route or equipment layout is fixed.']
]);

// The first 10 guides are core topics. The two shortest source pages receive the same technical depth; all additions are topic-specific and removable on rerun.
for (const guide of guides) {
  let html = fs.readFileSync(guide.file, 'utf8');
  html = appendToSection(html, 'principle', 'principle', paragraphs('Engineering interpretation and design basis', guide.principle));
  html = appendToSection(html, 'formulae', 'formulae', paragraphs('Using the result in engineering work', guide.formulae));
  html = appendToSection(html, 'method', 'method', checklist('Design-review checklist', guide.method));
  html = appendToSection(html, 'applications', 'selection', paragraphs('Selection and operating context', guide.selection));
  html = appendToSection(html, 'mistakes', 'troubleshooting', troubleshooting('Troubleshooting signals', guide.troubleshooting));
  html = appendToSection(html, 'faq', 'faq', extraFaqs(guide.faqs));
  const finalDesign = finalDesignAdditions.get(guide.file);
  html = appendToSection(html, 'applications', 'final-design', `${paragraphs('Decision record and final-design handover', finalDesign.discussion)}${checklist('Final design and commissioning checks', finalDesign.checklist)}`);
  html = appendToSection(html, 'applications', 'scope-note', `<h3>Scope control before final use</h3><p>${depthClosingNotes.get(guide.file)}</p>`);
  const completion = coreRangeCompletions.get(guide.file);
  if (completion) html = appendToSection(html, 'applications', 'core-range-completion', `<h3>Further design coordination</h3><p>${completion}</p>`);
  fs.writeFileSync(guide.file, html, 'utf8');
}

console.log(`Expanded ${guides.length} core fluid-mechanics guides.`);
