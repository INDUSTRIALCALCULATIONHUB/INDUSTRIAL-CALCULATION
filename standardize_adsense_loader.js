const fs = require('fs');
const path = require('path');

const root = process.cwd();
const loader = [
  '<script async src="https://fundingchoicesmessages.google.com/i/pub-1658062441623612?ers=1"></script>',
  '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1658062441623612" crossorigin="anonymous"></script>',
].join('\n  ');

let updated = 0;
let alreadyPresent = 0;

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;

    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(filePath);
      continue;
    }
    if (!entry.isFile() || !filePath.endsWith('.html')) continue;

    let html = fs.readFileSync(filePath, 'utf8');
    if (!html.includes('knowledge-page')) continue;
    if (html.includes('pagead2.googlesyndication.com')) {
      alreadyPresent += 1;
      continue;
    }
    if (!/<head[^>]*>/i.test(html)) {
      throw new Error(`Missing <head> in ${filePath}`);
    }

    html = html.replace(/<head[^>]*>/i, (head) => `${head}\n  ${loader}`);
    fs.writeFileSync(filePath, html);
    updated += 1;
  }
}

walk(root);
console.log(JSON.stringify({ updated, alreadyPresent }));
