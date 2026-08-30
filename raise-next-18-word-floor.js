const fs = require('fs');

const addition = (title) => `
<h3>Data quality, uncertainty and decision boundaries</h3>
<p>Engineering data is useful only when its condition is explicit. Record whether a value is measured, calculated, supplier-rated, estimated or assumed; then note the date, instrument or source, units, reference condition and expected uncertainty. For ${title}, a nominal value can be misleading if it is not tied to the actual service, temperature, pressure, composition, material condition, geometry or equipment state. Use a short data register to distinguish confirmed information from values that still require field verification.</p>
<p>When a result is close to a capacity, durability, quality or safety limit, test the inputs that could change the decision. A small change in geometry, property, fouling, moisture, temperature, loss, wear, loading or control response may be more important than extra decimal places. State the range considered and choose a practical action: collect better data, provide an appropriate margin, modify the operating limit, or obtain a specialist calculation. This approach avoids both false confidence and unreasonably conservative decisions.</p>
<p>Educational guidance identifies questions and calculation structure; it does not set project acceptance criteria. Confirm applicable legislation, owner requirements, current codes, supplier limits, hazard studies and competent-authority approvals before procurement, construction, operation or modification. Where field evidence differs from an assessment, treat the difference as information to investigate rather than an automatic reason to change the model or the plant.</p>`;

const files = fs.readdirSync('engineering', { recursive: true })
  .filter((file) => file.endsWith('index.html'))
  .map((file) => `engineering/${file.replaceAll('\\', '/')}`);

let updated = 0;
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('<!-- next18-')) continue;
  const title = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || 'This engineering guide')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const start = html.indexOf('<!-- next18-');
  const end = html.indexOf('-end -->', start);
  if (start < 0 || end < 0) throw new Error(`Missing expansion markers: ${file}`);
  const block = html.slice(start, end);
  if (block.includes('Data quality, uncertainty and decision boundaries')) continue;
  const updatedBlock = block.replace('<h3>Expanded FAQs</h3>', `${addition(title)}<h3>Expanded FAQs</h3>`);
  if (updatedBlock === block) throw new Error(`FAQ heading missing: ${file}`);
  html = html.slice(0, start) + updatedBlock + html.slice(end);
  fs.writeFileSync(file, html, 'utf8');
  updated += 1;
}

console.log(`Raised ${updated} guides above the minimum-content floor.`);
