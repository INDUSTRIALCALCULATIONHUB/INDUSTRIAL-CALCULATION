const fs = require('fs');
const path = require('path');

const root = process.cwd();
const searchPages = [
  'engineering/electrical-engineering/index.html',
  'engineering/instrumentation-and-control-engineering/index.html',
  'engineering/water-and-wastewater-engineering/index.html',
  'industrial-equipment/electrical-and-instrumentation-equipment/index.html',
  'industrial-equipment/water-and-wastewater-equipment/index.html',
  'industrial-processes/water-and-wastewater-treatment-processes/index.html',
];

for (const relative of searchPages) {
  const file = path.join(root, relative);
  const before = fs.readFileSync(file, 'utf8');
  const after = before.replace('class="header-search" href="#existing-knowledge"', 'class="header-search" href="../../index.html#knowledge"');
  if (after === before) throw new Error(`Search anchor not found: ${relative}`);
  fs.writeFileSync(file, after);
}

const bom = path.join(root, 'fabrication-bom-creator.html');
const bomBefore = fs.readFileSync(bom, 'utf8');
const bomAfter = bomBefore
  .replace('href="index.html#converters">Unit Conversion', 'href="index.html#tools">Unit Conversion')
  .replace('href="index.html#blogs">Engineering Knowledge', 'href="index.html#knowledge">Engineering Knowledge');
if (bomAfter === bomBefore) throw new Error('BOM anchor replacements were not found');
fs.writeFileSync(bom, bomAfter);
console.log(JSON.stringify({ repairedSearchAnchors: searchPages.length, repairedBomAnchors: 2 }, null, 2));
