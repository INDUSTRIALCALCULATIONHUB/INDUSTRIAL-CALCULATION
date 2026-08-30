"use strict";

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const target = path.join(root, "engineering.html");

function collectHtml(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git" || entry.name === "node_modules") return [];
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectHtml(fullPath);
    return entry.isFile() && entry.name.endsWith(".html") ? [fullPath] : [];
  });
}

let updatedPages = 0;
let updatedLinks = 0;

for (const filePath of collectHtml(root)) {
  const original = fs.readFileSync(filePath, "utf8");
  const relativeTarget = path.relative(path.dirname(filePath), target).split(path.sep).join("/") || "engineering.html";
  const isEngineeringLanding = path.resolve(filePath) === target;
  const learnLink = `<a href="${relativeTarget}"${isEngineeringLanding ? ' aria-current="page"' : ""}>Learn</a>`;
  const updated = original.replace(/(<nav\b[^>]*\bclass=["'][^"']*\bpublic-nav\b[^"']*["'][^>]*>)([\s\S]*?)(<\/nav>)/g, (nav, start, content, end) => {
    return `${start}${content.replace(/<a\s+href="[^"]*"[^>]*>Learn<\/a>/g, learnLink)}${end}`;
  });

  if (updated !== original) {
    fs.writeFileSync(filePath, updated, "utf8");
    updatedPages += 1;
    updatedLinks += (original.match(/<a\s+href="[^"]*"[^>]*>Learn<\/a>/g) || []).length;
  }
}

const generatorUpdates = {
  "create-engineering-reference-data-pages.js": [[
    'href="#article-content" aria-current="page">Learn</a>',
    'href="${prefix}engineering.html">Learn</a>',
  ]],
  "create-industrial-equipment-phase-one.js": [[
    'href="#article-content" aria-current="page">Learn</a>',
    'href="${prefix}engineering.html">Learn</a>',
  ]],
  "create-industrial-processes-first-50.js": [[
    'href="#article-content" aria-current="page">Learn</a>',
    'href="${prefix}engineering.html">Learn</a>',
  ]],
  "create-next-15-engineering-pages.js": [[
    'href="#article-content" aria-current="page">Learn</a>',
    'href="${prefix}engineering.html">Learn</a>',
  ]],
  "create-remaining-engineering-pages.js": [[
    'href="#article-content" aria-current="page">Learn</a>',
    'href="${prefix}engineering.html">Learn</a>',
  ]],
  "create-thermal-mechanical-pages.js": [[
    'href="#article-content" aria-current="page">Learn</a>',
    'href="${prefix}engineering.html">Learn</a>',
  ]],
  "generate-level3-navigation.js": [[
    'href="#topic-groups" aria-current="page">Learn</a>',
    'href="../../../engineering.html">Learn</a>',
  ]],
  "rewrite-final-knowledge-pages.js": [[
    'href="#article-content" aria-current="page">Learn</a>',
    'href="${esc(rootRelative(page.route, "engineering.html"))}">Learn</a>',
  ]],
};

let updatedTemplates = 0;
for (const [fileName, replacements] of Object.entries(generatorUpdates)) {
  const filePath = path.join(root, fileName);
  const original = fs.readFileSync(filePath, "utf8");
  let updated = original;
  for (const [from, to] of replacements) {
    if (updated.includes(from)) {
      updated = updated.replaceAll(from, to);
    } else if (!updated.includes(to)) {
      throw new Error(`The standard Learn link is missing from ${fileName}.`);
    }
  }
  if (updated !== original) {
    fs.writeFileSync(filePath, updated, "utf8");
    updatedTemplates += 1;
  }
}

let verifiedLinks = 0;
const invalidLinks = [];
for (const filePath of collectHtml(root)) {
  const source = fs.readFileSync(filePath, "utf8");
  for (const nav of source.matchAll(/<nav\b[^>]*\bclass=["'][^"']*\bpublic-nav\b[^"']*["'][^>]*>([\s\S]*?)<\/nav>/g)) {
    for (const link of nav[1].matchAll(/<a\s+href="([^"]+)"[^>]*>Learn<\/a>/g)) {
      verifiedLinks += 1;
      const destination = path.resolve(path.dirname(filePath), link[1]);
      if (destination !== target) {
        invalidLinks.push(`${path.relative(root, filePath)} -> ${link[1]}`);
      }
    }
  }
}

if (invalidLinks.length) {
  throw new Error(`Incorrect Learn destinations:\n${invalidLinks.join("\n")}`);
}

console.log(`Updated ${updatedLinks} Learn link(s) across ${updatedPages} page(s).`);
console.log(`Updated ${updatedTemplates} page-generation template(s).`);
console.log(`Verified ${verifiedLinks} Learn link(s) point to engineering.html.`);
