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

const expansion = `<section class="content-depth-section" id="next101-major-process-lifecycle"><p class="portal-kicker">System lifecycle guide</p><h2>Design intent through long-term operation</h2><p>A major industrial process is successful only when its intended physical mechanism remains effective in real operation. That requires alignment between the process basis, equipment design, construction quality, control philosophy, operating practice and maintenance strategy. A correct equipment size can underperform when distribution, residence time, temperature, pressure, chemistry, moisture, utility quality, discharge capacity or human response differ from the assumed condition.</p><p>Establish a design-intent statement that links the required process outcome to measurable operating variables. It should state what enters the system, what transformation or separation is expected, the permitted outlet or product condition, normal and limiting cases, essential utilities, protective functions, residue or by-product route, and the evidence required to demonstrate performance. This creates a reference for commissioning, troubleshooting and future change decisions.</p><h3>Capacity and bottleneck assessment</h3><p>Assess capacity across the complete route. Start with the source condition and follow material, gas, liquid, heat and information flows through every critical interface. Check equipment turndown and maximum duty, storage and surge capability, pressure or hydraulic balance, heat-transfer margin, conveyor or pump availability, fan or compressor margin, treatment capacity, waste discharge and the ability to operate during maintenance. A bottleneck often appears at an interface rather than in the central vessel, kiln, furnace, collector, column or machine.</p><p>Evaluate the governing case explicitly. This may be peak throughput, high moisture, difficult chemistry, maximum ambient temperature, cold start, low load, utility loss, feed upset, one unit out of service, reduced residue handling or a restrictive emission or product-quality target. Record the case that controls each design or operating limit and avoid combining data from incompatible scenarios.</p><h3>Control, safeguarding and human factors</h3><p>Control loops should maintain stable operation, while alarms, trips, relief, isolation and permissives protect the process when normal control is insufficient. Review sensor location, instrument range, calibration, response time, failure mode, alarm priority, operator display and the action expected after an alarm. A well-designed safeguard can be weakened by poor installation, bypass management, unclear procedures or lack of testing.</p><p>Operators need practical indicators that connect the control-room trend with equipment condition. Include field rounds for leakage, odour, noise, vibration, deposition, abnormal temperature, level, pressure loss, discharge quality, utility use, drive condition, structural movement and access obstructions. Combine digital history with observation, maintenance feedback and sampling rather than depending on a single instrument.</p><h3>Maintenance, inspection and spares</h3><p>Prioritise components whose failure would interrupt containment, transfer, reaction, separation, heat exchange, measurement, isolation or environmental performance. For each critical item, define inspection method, acceptance limit, frequency, access requirement, isolation point, spare strategy, lead time, lifting or cleaning need and post-maintenance functional test. Consider wear, corrosion, erosion, fouling, fatigue, electrical degradation, refractory or lining condition, seal condition, filter or electrode condition, support integrity and residue buildup as relevant to the process.</p><p>Planned maintenance should be linked to condition evidence where possible. Unexpected failure history, high energy use, increasing pressure drop, emissions trend changes, vibration, temperature approach, repeated alarms or poorer quality can justify an earlier intervention. Complete work with a documented return-to-service check that confirms the line-up, protection, controls and affected interfaces are ready for duty.</p><h3>Change management and continual learning</h3><p>Reassess the process basis when feedstock, fuel, water quality, material grade, product specification, throughput, equipment geometry, software, set point, piping or duct routing, treatment chemistry, maintenance approach or operating procedure changes. Even a minor local change can alter flow distribution, pressure loss, heat balance, corrosion risk, emissions, residue handling or protective response elsewhere in the system.</p><p>After each significant event or modification, compare actual performance with the documented basis. Record what changed, why it changed, the evidence reviewed, the temporary and permanent actions, remaining uncertainty and the confirmation required for close-out. This disciplined feedback loop protects technical knowledge and improves reliability over the life of the process.</p></section>`;

let eligible = 0;
let updated = 0;
for (const file of walk(root).filter((file) => file.endsWith('.html'))) {
  const relative = path.relative(root, file).replace(/\\/g, '/');
  if (!relative.startsWith('industrial-processes/') || !majorProcess(relative)) continue;
  let html = fs.readFileSync(file, 'utf8');
  const marker = `<!-- next101-${relative}-end -->`;
  if (!html.includes(marker)) continue;
  eligible += 1;
  if (html.includes('id="next101-major-process-lifecycle"')) continue;
  html = html.replace(marker, `${expansion}${marker}`);
  fs.writeFileSync(file, html);
  updated += 1;
}

if (eligible !== 49) throw new Error(`Unexpected major process scope: ${eligible} eligible pages.`);
console.log(`Extended ${updated} major industrial-process guides; ${eligible - updated} were already complete.`);
