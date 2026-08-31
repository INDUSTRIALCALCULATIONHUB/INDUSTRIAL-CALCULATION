const fs = require('fs');
const path = require('path');

const assetDirectory = path.join(process.cwd(), 'assets', 'illustrations');

function knowledgeFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const item = path.join(directory, entry.name);
    if (entry.isDirectory()) return knowledgeFiles(item);
    if (entry.name !== 'index.html') return [];
    const html = fs.readFileSync(item, 'utf8');
    return html.includes('class="knowledge-page"') ? [path.relative(process.cwd(), item).replace(/\\/g, '/')] : [];
  });
}

const mappings = [
  {
    asset: 'bag-filter-pulse-jet-blueprint-v1.png',
    alt: 'Original cutaway blueprint illustration of a pulse-jet bag filter with fabric bags, compressed-air cleaning and dust hoppers',
    files: [
      'engineering/air-pollution-control-and-environmental-engineering/particulate-collection/bag-filters/bag-filter-working-principle-and-components/index.html',
      'industrial-processes/air-pollution-control-processes/dust-collection-baghouse-systems-capture-filtration-and-discharge-bag-filter-dust-collection-process/index.html',
      'industrial-processes/cement-manufacturing-process/environmental-systems/dust-collection/bag-filter-process-in-cement-plants/index.html',
      'industrial-equipment/air-pollution-control-equipment/bag-filters-baghouse-sections-filter-bags-cages-pulse-valves-and-hopper-bag-filter-components/index.html',
    ],
  },
  {
    asset: 'esp-electrostatic-precipitator-blueprint-v1.png',
    alt: 'Original cutaway blueprint illustration of a dry electrostatic precipitator with collecting plates, discharge electrodes and ash hoppers',
    files: [
      'engineering/air-pollution-control-and-environmental-engineering/particulate-collection/electrostatic-precipitators/electrostatic-precipitator-working-principle-and-components/index.html',
      'industrial-processes/air-pollution-control-processes/esp-systems-electrostatic-collection-charging-collection-and-rapping-esp-dust-collection-process/index.html',
      'industrial-equipment/air-pollution-control-equipment/electrostatic-precipitators-esp-fields-electrodes-rappers-and-tr-sets-esp-components/index.html',
      'industrial-processes/power-generation-processes/coal-fired-thermal-power-plant/flue-gas-cleaning/esp-process-in-thermal-power-plants/index.html',
    ],
  },
  {
    asset: 'wet-fgd-absorber-blueprint-v1.png',
    alt: 'Original cutaway blueprint illustration of a wet flue-gas-desulfurization absorber with spray zone, mist eliminator, slurry recirculation and oxidation air',
    files: [
      'engineering/air-pollution-control-and-environmental-engineering/gas-treatment/fgd/flue-gas-desulfurization-process-and-equipment/index.html',
      'industrial-processes/air-pollution-control-processes/fgd-systems-wet-fgd-absorption-oxidation-and-gypsum-handling-wet-fgd-process-flow/index.html',
      'industrial-processes/power-generation-processes/coal-fired-thermal-power-plant/flue-gas-cleaning/fgd-process-in-thermal-power-plants/index.html',
    ],
  },
  {
    asset: 'cement-preheater-calciner-kiln-blueprint-v1.png',
    alt: 'Original blueprint illustration of a cement preheater, calciner, rotary kiln and clinker cooler process route',
    files: [
      'industrial-processes/cement-manufacturing-process/raw-material-handling/raw-meal-preparation/raw-mill-and-raw-meal-blending-process/index.html',
      'industrial-processes/cement-manufacturing-process/raw-material-handling/limestone-handling/limestone-crushing-and-conveying-process/index.html',
      'industrial-processes/cement-manufacturing-process/pyroprocessing/clinker-cooling/clinker-cooler-and-clinker-handling-process/index.html',
      'industrial-processes/cement-manufacturing-process/pyroprocessing/preheater-and-calciner/preheater-calciner-and-rotary-kiln-process/index.html',
      'industrial-processes/cement-manufacturing-process/cement-finishing/grinding/cement-mill-and-separator-process/index.html',
      'industrial-processes/cement-manufacturing-process/cement-finishing/packing/cement-packing-and-dispatch-process/index.html',
      'industrial-processes/cement-manufacturing-process/environmental-systems/material-transfer/dust-control-at-cement-transfer-points/index.html',
    ],
  },
  {
    asset: 'industrial-ventilation-duct-fan-blueprint-v1.png',
    alt: 'Original blueprint illustration of an industrial local-exhaust system with capture hood, ductwork, bag filter, induced-draft fan and stack',
    files: [
      'engineering/fluid-mechanics-piping-pumps-fans-ducts/fans-and-duct-systems/duct-systems/duct-pressure-loss/duct-pressure-loss-and-system-resistance/index.html',
      'engineering/fluid-mechanics-piping-pumps-fans-ducts/fans-and-duct-systems/industrial-fans/fan-laws-static-pressure-and-fan-power/index.html',
    ],
  },
  {
    asset: 'water-tube-boiler-system-blueprint-v1.png',
    alt: 'Original cutaway blueprint illustration of a water-tube boiler with furnace, steam drum, heat-recovery sections, draft fans and ash hopper',
    directories: ['industrial-equipment/boilers-steam-and-combustion-equipment'],
  },
  {
    asset: 'bulk-conveying-systems-blueprint-v1.png',
    alt: 'Original blueprint illustration of belt, screw, chain and bucket-elevator bulk-material conveying systems',
    directories: ['industrial-equipment/conveying-systems'],
  },
  {
    asset: 'rotating-equipment-pump-fan-blower-compressor-blueprint-v1.png',
    alt: 'Original blueprint comparison of a centrifugal pump, centrifugal fan, Roots blower and industrial air compressor',
    directories: ['industrial-equipment/pumps-fans-blowers-and-compressors'],
  },
  {
    asset: 'heat-exchanger-pressure-vessel-blueprint-v1.png',
    alt: 'Original cutaway blueprint illustration of a shell-and-tube heat exchanger and vertical pressure vessel',
    directories: ['industrial-equipment/heat-exchangers-cooling-systems-and-vessels'],
  },
  {
    asset: 'mechanics-and-fabrication-blueprint-v1.png',
    alt: 'Original blueprint illustration of beam bending, shaft and bearing support, welded plate joint and stress-strain behaviour',
    directories: ['engineering/mechanical-engineering-and-fabrication'],
  },
  {
    asset: 'industrial-gas-and-particulate-control-blueprint-v1.png',
    alt: 'Original blueprint illustration of industrial gas and particulate pollutants moving from a process source through controlled exhaust treatment',
    files: [
      'engineering/air-pollution-control-and-environmental-engineering/air-pollutants/gaseous-pollution/sox-nox-vocs-and-industrial-gas-pollutants/index.html',
      'engineering/air-pollution-control-and-environmental-engineering/air-pollutants/particulate-pollution/particulate-matter-dust-and-fly-ash/index.html',
    ],
  },
  {
    asset: 'continuous-emission-monitoring-system-blueprint-v1.png',
    alt: 'Original blueprint illustration of a continuous emission monitoring system with stack probe, sample conditioning, analyser cabinets and calibration gas',
    files: [
      'engineering/air-pollution-control-and-environmental-engineering/emission-monitoring/cems/continuous-emission-monitoring-system-basics-and-components/index.html',
    ],
  },
  {
    asset: 'scr-sncr-nox-control-blueprint-v1.png',
    alt: 'Original blueprint illustration of SCR catalyst reaction and SNCR reagent injection arrangements for industrial NOx control',
    files: [
      'engineering/air-pollution-control-and-environmental-engineering/gas-treatment/denox/scr-and-sncr-nox-control-fundamentals/index.html',
      'industrial-processes/air-pollution-control-processes/denox-systems-scr-and-sncr-reagent-injection-and-reaction-scr-and-sncr-process-flow/index.html',
    ],
  },
  {
    asset: 'cyclone-separator-blueprint-v1.png',
    alt: 'Original cutaway blueprint illustration of an industrial cyclone separator with tangential inlet, vortex finder, hopper and rotary airlock',
    files: [
      'engineering/air-pollution-control-and-environmental-engineering/particulate-collection/mechanical-collectors/cyclone-separator-working-principle-and-applications/index.html',
    ],
  },
  {
    asset: 'piping-head-and-pressure-loss-blueprint-v1.png',
    alt: 'Original blueprint illustration of a pumped piping system with elevation change, valves, fittings, gauges and pressure-loss locations',
    files: [
      'engineering/fluid-mechanics-piping-pumps-fans-ducts/fluid-flow-principles/pressure-and-head/pressure-head-velocity-head-and-total-head/index.html',
      'engineering/fluid-mechanics-piping-pumps-fans-ducts/fluid-properties/viscosity/dynamic-and-kinematic-viscosity/index.html',
      'engineering/fluid-mechanics-piping-pumps-fans-ducts/piping-systems/pipe-flow/pipe-friction-loss-and-darcy-weisbach-equation/index.html',
      'engineering/fluid-mechanics-piping-pumps-fans-ducts/piping-systems/pipe-losses/minor-losses-in-pipes-fittings-and-valves/index.html',
      'engineering/fluid-mechanics-piping-pumps-fans-ducts/piping-systems/piping-design-basics/pipe-sizing-engineering-inputs-and-limitations/index.html',
    ],
  },
  {
    asset: 'rotating-equipment-pump-fan-blower-compressor-blueprint-v1.png',
    alt: 'Original cutaway blueprint comparison of rotating equipment, including a centrifugal pump and its impeller flow path',
    files: [
      'engineering/fluid-mechanics-piping-pumps-fans-ducts/pumps/centrifugal-pumps/centrifugal-pump-working-principle/index.html',
      'engineering/fluid-mechanics-piping-pumps-fans-ducts/pumps/centrifugal-pumps/pump-curves-and-system-curves/index.html',
      'engineering/fluid-mechanics-piping-pumps-fans-ducts/pumps/pump-operation/npsh-and-cavitation-in-pumps/index.html',
    ],
  },
  {
    asset: 'materials-selection-blueprint-v1.png',
    alt: 'Original technical material-selection board showing metallic, non-metallic, lining and insulation material forms',
    directories: ['engineering/materials-of-construction'],
  },
];

let pagesChanged = 0;
for (const mapping of mappings) {
  const targetFiles = mapping.files || mapping.directories.flatMap((directory) => knowledgeFiles(path.join(process.cwd(), directory)));
  for (const relativeFile of targetFiles) {
    const file = path.join(process.cwd(), relativeFile);
    let html = fs.readFileSync(file, 'utf8');
    const relativeAsset = path.relative(path.dirname(file), path.join(assetDirectory, mapping.asset)).replace(/\\/g, '/');
    let changedThisPage = false;
    html = html.replace(/<img\b[^>]*>/g, (tag) => {
      if (tag.includes(mapping.asset) || !tag.includes('l2-')) return tag;
      changedThisPage = true;
      return tag.replace(/src="[^"]*"/, 'src="' + relativeAsset + '"').replace(/alt="[^"]*"/, 'alt="' + mapping.alt + '"');
    });
    if (!changedThisPage && !html.includes(mapping.asset)) throw new Error('No replaceable topic image found: ' + relativeFile);
    if (changedThisPage) {
      fs.writeFileSync(file, html, 'utf8');
      pagesChanged += 1;
    }
  }
}

console.log('Updated ' + pagesChanged + ' pages with original topic-specific illustration assets.');
