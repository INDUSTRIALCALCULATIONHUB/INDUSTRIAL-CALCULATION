const fs = require('fs');
const path = require('path');
const candidates = require('./canonical_page_candidates');

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function plain(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}
function section(html, id) {
  return new RegExp(`<section id="${id}">([\\s\\S]*?)<\\/section>`, 'i').exec(html)?.[1] || '';
}
function concise(value, words = 44) {
  return plain(value).split(' ').slice(0, words).join(' ').replace(/[,:;]$/, '');
}

let updated = 0;
for (const page of candidates) {
  const file = path.join(process.cwd(), ...page.route.split('/'), 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const currentFaq = section(html, 'faq');
  const firstDetail = /<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/i.exec(currentFaq);
  if (!firstDetail) throw new Error(`First FAQ not found: ${page.id}`);
  const inputs = concise(section(html, 'inputs'), 52);
  const method = concise(section(html, 'method'), 52);
  const failure = concise(section(html, 'failure'), 52);
  const verification = concise(section(html, 'verification'), 52);
  const title = esc(page.title);
  const firstQuestion = plain(firstDetail[1]);
  const firstAnswer = plain(firstDetail[2]);
  const details = [
    [firstQuestion, firstAnswer],
    [`Which inputs should be confirmed for ${page.title}?`, `${inputs}. Confirm the source, condition and measurement basis for each input before treating a calculated or selected value as reliable.`],
    [`How should ${page.title} be reviewed in practice?`, `${method}. Record the actual operating line-up and repeat the review at the condition most likely to challenge performance.`],
    [`What warning signs deserve early attention?`, `${failure}. A trend linked to the physical mechanism is more useful than waiting for a single visible failure.`],
    [`What evidence supports acceptance?`, `${verification}. Keep the records traceable so later maintenance or a process change can be compared with the original basis.`],
    [`When should ${page.title} be reassessed?`, `Reassess it after a change in duty, throughput, process material, temperature, pressure, geometry, maintenance condition, control logic or a recurring abnormal trend. The original result is valid only for the conditions it represented.`],
    ['Can a typical value or handbook rule be used for final design?', `Only as a preliminary screen. Final decisions for ${title} need the actual component or system data, applicable standard, supplier limits and qualified engineering review.`],
    ['Where should an engineering investigation begin?', `Start by defining the system boundary and current operating condition, then compare measured evidence with the design intent. Address the controlling mechanism before changing capacity, setpoints or hardware.`],
  ];
  const faq = `<section id="faq"><h2>Frequently Asked Questions</h2><div class="faq-list">${details.map(([question, answer]) => `<details><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join('')}</div></section>`;
  const boundary = /<section id="faq">[\s\S]*?<\/section>(?=<section id="related")/;
  if (!boundary.test(html)) throw new Error(`FAQ boundary not found: ${page.id}`);
  html = html.replace(boundary, faq);
  fs.writeFileSync(file, html);
  updated += 1;
}
console.log(JSON.stringify({ updated, faqsPerPage: 8 }, null, 2));
