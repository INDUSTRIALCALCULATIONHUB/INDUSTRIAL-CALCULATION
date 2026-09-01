const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cmpLoader = '<script async src="https://fundingchoicesmessages.google.com/i/pub-1658062441623612?ers=1"></script>';
const adsenseLoader = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1658062441623612" crossorigin="anonymous"></script>';

let updated = 0;
let alreadyPresent = 0;
let skippedPrototypes = 0;

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;

    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (path.relative(root, filePath).split(path.sep)[0] === 'design-prototypes') {
        skippedPrototypes += 1;
        continue;
      }
      walk(filePath);
      continue;
    }
    if (!entry.isFile() || !filePath.endsWith('.html')) continue;

    let html = fs.readFileSync(filePath, 'utf8');
    const hasCmp = html.includes('fundingchoicesmessages.google.com/i/pub-1658062441623612?ers=1');
    const hasAdsense = html.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1658062441623612');
    if (hasCmp && hasAdsense) {
      alreadyPresent += 1;
      continue;
    }
    if (!/<head[^>]*>/i.test(html)) {
      throw new Error(`Missing <head> in ${filePath}`);
    }

    const missingLoaders = [
      hasCmp ? null : cmpLoader,
      hasAdsense ? null : adsenseLoader,
    ].filter(Boolean).join('\n  ');
    html = html.replace(/<head[^>]*>/i, (head) => `${head}\n  ${missingLoaders}`);
    fs.writeFileSync(filePath, html);
    updated += 1;
  }
}

walk(root);
console.log(JSON.stringify({ updated, alreadyPresent, skippedPrototypes }));
