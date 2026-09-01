const fs = require('fs');
const path = require('path');

const root = process.cwd();
const ignored = new Set(['.git', 'node_modules', 'outputs']);
function walk(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}
function targetFor(source, value) {
  const clean = value.replace(/&amp;/g, '&');
  const [address, fragment = ''] = clean.split('#');
  if (/^(?:https?:)?\/\//i.test(address) || /^(?:mailto:|tel:|javascript:|data:)/i.test(address)) return null;
  if (!address) return { file: source, fragment: decodeURIComponent(fragment) };
  const urlPath = decodeURIComponent(address.split('?')[0]);
  const raw = urlPath.startsWith('/') ? path.join(root, urlPath.slice(1)) : path.resolve(path.dirname(source), urlPath);
  let file = raw;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  return { file, fragment: decodeURIComponent(fragment) };
}

const files = walk(root);
const cache = new Map();
function read(file) {
  if (!cache.has(file)) cache.set(file, fs.readFileSync(file, 'utf8'));
  return cache.get(file);
}
const failures = [];
let checked = 0;
for (const source of files) {
  const html = read(source);
  const regex = /(?:href|src)=(?:"([^"]*)"|'([^']*)')/gi;
  for (const match of html.matchAll(regex)) {
    const value = match[1] ?? match[2] ?? '';
    const target = targetFor(source, value);
    if (!target) continue;
    checked += 1;
    if (!fs.existsSync(target.file)) {
      failures.push({ source: path.relative(root, source).replace(/\\/g, '/'), value, issue: 'missing target', target: path.relative(root, target.file).replace(/\\/g, '/') });
      continue;
    }
    if (target.fragment && target.file.toLowerCase().endsWith('.html')) {
      const targetHtml = read(target.file);
      const escaped = target.fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (!(new RegExp(`(?:id|name)=(?:"${escaped}"|'${escaped}')`, 'i')).test(targetHtml)) {
        failures.push({ source: path.relative(root, source).replace(/\\/g, '/'), value, issue: 'missing fragment', target: `${path.relative(root, target.file).replace(/\\/g, '/')}#${target.fragment}` });
      }
    }
  }
}
console.log(JSON.stringify({ htmlFiles: files.length, checked, failureCount: failures.length, failures }, null, 2));
process.exitCode = failures.length ? 1 : 0;
