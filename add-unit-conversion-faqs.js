const fs = require('fs');

const file = 'unit-conversion-explained.html';
const marker = '<!-- next110-unit-conversion-explained.html-end -->';
const extraFaqs = `<details><summary>Why should a conversion factor be traceable?</summary><p>A traceable factor lets the user confirm its definition, reference condition and exact unit relationship before using the converted result in an engineering calculation.</p></details><details><summary>When can rounding change an engineering decision?</summary><p>Rounding can matter near a limit, tolerance, alarm threshold or acceptance criterion. Retain suitable significant figures during calculation and round only when presenting the final value.</p></details><details><summary>Should units be checked after a value is converted?</summary><p>Yes. Confirm the target unit, the original value, the conversion direction and whether the reference condition is compatible with the calculation or data source.</p></details>`;

let html = fs.readFileSync(file, 'utf8');
if (!html.includes(marker)) throw new Error('Expected update marker not found.');
if (!html.includes('Why should a conversion factor be traceable?')) {
  html = html.replace(marker, `${extraFaqs}${marker}`);
  fs.writeFileSync(file, html);
}

console.log('Unit conversion FAQ total:', (html.match(/<details\\b/g) || []).length);
