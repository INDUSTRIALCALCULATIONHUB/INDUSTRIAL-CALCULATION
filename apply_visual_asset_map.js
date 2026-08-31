const fs = require('fs');
const path = require('path');

const replacements = [
  {
    file: 'electrostatic-precipitator.html',
    oldSrc: 'assets/illustrations/l2-air-pollution-control-equipment-v1.png',
    newSrc: 'assets/illustrations/esp-electrostatic-precipitator-blueprint-v1.png',
    oldAlts: [
      'Original blueprint illustration of air-pollution-control equipment',
      'Original site illustration providing engineering context for Electrostatic Precipitator: Working Principle, Components, Types and Applications',
    ],
    newAlts: [
      'Original cutaway blueprint illustration of a dry electrostatic precipitator with collecting plates, discharge electrodes and ash hoppers',
      'Original technical illustration showing the gas path, discharge electrodes, collecting plates and ash hoppers of a dry electrostatic precipitator',
    ],
  },
  {
    file: 'bag-filter.html',
    oldSrc: 'assets/illustrations/l2-air-pollution-control-equipment-v1.png',
    newSrc: 'assets/illustrations/bag-filter-pulse-jet-blueprint-v1.png',
    oldAlts: [
      'Original blueprint illustration of air-pollution-control equipment',
      'Original site illustration providing engineering context for Bag Filter: Working Principle, Components, Types and Applications',
    ],
    newAlts: [
      'Original cutaway blueprint illustration of a pulse-jet bag filter with fabric bags, compressed-air cleaning and dust hoppers',
      'Original technical illustration showing the gas path, filter bags, pulse-cleaning system and hopper discharge of a pulse-jet bag filter',
    ],
  },
];

let changed = 0;
for (const entry of replacements) {
  const file = path.join(process.cwd(), entry.file);
  let html = fs.readFileSync(file, 'utf8');
  for (let index = 0; index < entry.oldAlts.length; index += 1) {
    const from = 'src="' + entry.oldSrc + '" alt="' + entry.oldAlts[index] + '"';
    const to = 'src="' + entry.newSrc + '" alt="' + entry.newAlts[index] + '"';
    if (html.includes(to)) continue;
    if (!html.includes(from)) throw new Error('Expected image not found in ' + entry.file + ': ' + entry.oldAlts[index]);
    html = html.replace(from, to);
  }
  fs.writeFileSync(file, html, 'utf8');
  changed += 1;
}

console.log('Updated ' + changed + ' page(s) with mapped, topic-specific illustrations.');
