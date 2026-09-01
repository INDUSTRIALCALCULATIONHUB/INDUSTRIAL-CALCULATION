const fs = require('fs');
const path = require('path');

const pages = [
  ['fabrication-bom-creator.html', 'noindex,follow'],
  ['design-prototypes/mobile-app-preview.html', 'noindex,nofollow'],
  ['design-prototypes/homepage-preview.html', 'noindex,nofollow'],
  ['design-prototypes/engineering-domain-landing-approval.html', 'noindex,nofollow'],
];

for (const [relative, directive] of pages) {
  const file = path.join(process.cwd(), ...relative.split('/'));
  const before = fs.readFileSync(file, 'utf8');
  const existing = /<meta name="robots" content="[^"]*">/i;
  const after = existing.test(before)
    ? before.replace(existing, `<meta name="robots" content="${directive}">`)
    : before.replace(/<meta charset="utf-8">/i, `<meta charset="utf-8"><meta name="robots" content="${directive}">`);
  if (after === before) throw new Error(`Could not add indexing directive: ${relative}`);
  fs.writeFileSync(file, after);
}
console.log(JSON.stringify({ excluded: pages.map(([relative, directive]) => ({ relative, directive })) }, null, 2));
