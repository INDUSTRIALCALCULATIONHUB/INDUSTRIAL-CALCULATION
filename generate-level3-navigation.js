/*
 * Generates Level 3 navigation pages from SITE-HIERARCHY.md without changing
 * that frozen source. The output is deliberately navigation-only: it lists the
 * approved Level 4 topics but does not create premature, empty knowledge pages.
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = __dirname;
const hierarchyFile = path.join(root, "SITE-HIERARCHY.md");
const searchFile = path.join(root, "assets", "js", "site-search.js");
const auditFile = path.join(root, "outputs", "LEVEL3-ROUTE-RECONCILIATION.md");
const manifestFile = path.join(root, "outputs", "LEVEL3-ROUTE-MANIFEST.json");
const sitemapFile = path.join(root, "sitemap.xml");
const domains = {
  Engineering: { directory: "engineering", route: "engineering.html" },
  "Industrial Equipment": { directory: "industrial-equipment", route: "industrial-equipment.html" },
  "Industrial Processes": { directory: "industrial-processes", route: "industrial-processes.html" },
  "Engineering Reference Data": { directory: "engineering-reference-data", route: "engineering-reference-data.html" }
};

const escapeHtml = (value) => String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const cleanText = (value) => String(value || "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const slugify = (value) => String(value || "").toLowerCase().replace(/&/g, " and ").replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function readL2Routes() {
  const routes = new Map();
  Object.entries(domains).forEach(([domainName, domain]) => {
    const domainPath = path.join(root, domain.directory);
    fs.readdirSync(domainPath, { withFileTypes: true }).filter((entry) => entry.isDirectory()).forEach((entry) => {
      const relative = path.join(domain.directory, entry.name, "index.html");
      const source = fs.readFileSync(path.join(root, relative), "utf8");
      const h1 = cleanText((source.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]);
      const image = (source.match(/<div class="domain-landing-hero__art">\s*<img[^>]+src="([^"]+)"[^>]+alt="([^"]*)"/i) || []).slice(1);
      if (!h1) throw new Error(`No Level 2 heading found in ${relative}`);
      routes.set(`${domainName}|${h1}`, {
        ...domain,
        domainName,
        title: h1,
        l2Directory: entry.name,
        imagePath: image[0] ? path.basename(image[0].split("?")[0]) : "",
        imageAlt: image[1] || `Blueprint illustration for ${h1}`
      });
    });
  });
  return routes;
}

function readHierarchy() {
  const lines = fs.readFileSync(hierarchyFile, "utf8").replace(/\r/g, "").split("\n");
  const fence = "`".repeat(3);
  const entries = [];
  let heading = "";

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.startsWith("# ") || line === "---") heading = "";
    if (line.startsWith("## L1 ")) heading = line;
    if (line !== `${fence}text` || !heading) continue;

    const domainName = (heading.match(/^## L1 (.*?) > L2/) || [])[1];
    if (!domains[domainName]) continue;
    const block = [];
    while (++i < lines.length && lines[i] !== fence) block.push(lines[i]);
    let l2Title = "";
    let current = null;

    block.forEach((raw) => {
      if (!raw.trim()) { current = null; return; }
      if (!/[├└│]/.test(raw)) {
        l2Title = raw.trim();
        current = null;
        return;
      }
      const level3 = raw.match(/^[├└]── (.*)$/);
      if (level3) {
        const segments = level3[1].split(" > ").map((value) => value.trim()).filter(Boolean);
        current = { domainName, l2Title, title: segments[0], children: segments[1] ? [segments[1]] : [] };
        entries.push(current);
        return;
      }
      const level4 = raw.match(/^(?:│   |    )[├└]── (.*)$/);
      if (level4 && current) current.children.push(level4[1].split(" > ")[0].trim());
    });
  }
  return entries;
}

function pageHtml(entry, parent) {
  const level3Slug = slugify(entry.title);
  const parentRoute = `${parent.directory}/${parent.l2Directory}/${level3Slug}/`;
  const cardItems = entry.children.length ? entry.children : ["Detailed knowledge topics"];
  const cardMarkup = cardItems.map((topic, index) => `<article class="discipline-card"><span class="discipline-card__number">${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(topic)}</h3><p>This approved knowledge route sits within ${escapeHtml(entry.title)} and will receive its final page after technical review.</p><span class="discipline-card__status">Detailed route planned</span></article>`).join("");
  const imageMarkup = parent.imagePath ? `<div class="domain-landing-hero__art"><img src="../../../assets/illustrations/${escapeHtml(parent.imagePath)}" alt="${escapeHtml(parent.imageAlt)}"></div>` : "";
  const description = `Explore ${entry.title} within ${parent.title}. This navigation page lists the approved detailed knowledge routes before final publication.`;
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: entry.title,
    url: `https://industrialcalculation.com/${parent.directory}/${parent.l2Directory}/${level3Slug}/`,
    isPartOf: { "@type": "CollectionPage", name: parent.title, url: `https://industrialcalculation.com/${parent.directory}/${parent.l2Directory}/` }
  });
  const domainDirectory = domains[entry.domainName];
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(entry.title)} | Industrial Calculation Hub</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="https://industrialcalculation.com/${parentRoute}">
  <link rel="icon" type="image/svg+xml" href="../../../assets/brand/industrial-calculation-hub-mark.svg?v=20260824-colors">
  <link rel="alternate icon" href="../../../favicon.png">
  <link rel="stylesheet" href="../../../style.css?v=20260829-navigation">
  <script type="application/ld+json">${jsonLd}</script>
  <script defer src="../../../assets/js/site-search.js?v=20260829-navigation"></script>
</head>
<body class="public-page">
  <div class="site-frame">
    <header class="public-header">
      <a class="brand" href="../../../index.html" aria-label="Industrial Calculation Hub home"><img class="brand__mark" src="../../../assets/brand/industrial-calculation-hub-mark.svg?v=20260824-colors" alt=""><span class="brand__name"><strong>Industrial</strong><span>Calculation Hub</span></span></a>
      <button class="public-menu-toggle" type="button" aria-expanded="false" aria-controls="public-navigation">Menu</button>
      <nav class="public-nav" id="public-navigation" aria-label="Primary navigation" data-open="false"><a href="../../../index.html">Home</a><a href="../../../index.html#tools">Tools</a><a href="../../../engineering.html">Learn</a><a href="../../../engineering-reference-data.html">Reference Data</a><a href="../../../about.html">About</a></nav>
      <a class="header-search" href="#topic-groups" aria-label="Search topics, tools and articles"><span>Search topics, tools, articles...</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="6"/><path d="m16 16 5 5"/></svg></a>
    </header>
    <main class="portal-main">
      <section class="domain-landing-hero" aria-labelledby="topic-title">
        <div class="domain-landing-hero__copy"><p class="domain-breadcrumb"><a href="../../../index.html">Home</a> <span aria-hidden="true">/</span> <a href="../../../${domainDirectory.route}">${escapeHtml(entry.domainName)}</a> <span aria-hidden="true">/</span> <a href="../">${escapeHtml(parent.title)}</a> <span aria-hidden="true">/</span> ${escapeHtml(entry.title)}</p><p class="portal-kicker">Level 3 navigation group</p><h1 id="topic-title">${escapeHtml(entry.title)}</h1><p>${escapeHtml(description)}</p></div>
        ${imageMarkup}
      </section>
      <nav class="domain-directory" aria-label="Primary domain directory"><a href="../../../engineering.html"${entry.domainName === "Engineering" ? " aria-current=\"page\"" : ""}>Engineering</a><a href="../../../industrial-equipment.html"${entry.domainName === "Industrial Equipment" ? " aria-current=\"page\"" : ""}>Industrial Equipment</a><a href="../../../industrial-processes.html"${entry.domainName === "Industrial Processes" ? " aria-current=\"page\"" : ""}>Industrial Processes</a><a href="../../../engineering-reference-data.html"${entry.domainName === "Engineering Reference Data" ? " aria-current=\"page\"" : ""}>Engineering Reference Data</a></nav>
      <section class="domain-landing-content" id="topic-groups" aria-labelledby="detail-routes-title"><div class="domain-landing-heading"><div><p class="portal-kicker">Approved detailed routes</p><h2 id="detail-routes-title">Explore ${escapeHtml(entry.title)}</h2></div></div><p class="navigation-page-note">These Level 4 routes are shown for orientation. They are not published as working links until their knowledge content is complete and technically reviewed.</p><div class="discipline-grid">${cardMarkup}</div></section>
    </main>
    <footer class="site-footer"><nav class="footer-nav" aria-label="Legal and support navigation"><a href="../../../index.html">Home</a><a href="../../../about.html">About</a><a href="../../../contact.html">Contact</a><a href="../../../privacy.html">Privacy</a><a href="../../../disclaimer.html">Disclaimer</a><a href="../../../terms.html">Terms</a></nav><div class="footer-copyright">© 2026 Industrial Calculation Hub. All Rights Reserved.</div></footer>
  </div>
  <script>const menu=document.querySelector('.public-menu-toggle');const navigation=document.querySelector('.public-nav');menu?.addEventListener('click',()=>{const open=navigation.dataset.open==='true';navigation.dataset.open=String(!open);menu.setAttribute('aria-expanded',String(!open));});</script>
</body>
</html>`;
}

function linkL2Cards(parent, entries) {
  const file = path.join(root, parent.directory, parent.l2Directory, "index.html");
  let source = fs.readFileSync(file, "utf8");
  entries.forEach((entry) => {
    const title = escapeRegex(entry.title);
    const slug = slugify(entry.title);
    const cardPattern = new RegExp(`<article class="discipline-card">([\\s\\S]*?<h3>${title}<\\/h3>[\\s\\S]*?)<\\/article>`, "g");
    source = source.replace(cardPattern, (_match, content) => {
      const improvedContent = content.replace(/<span class="discipline-card__status">[\s\S]*?<\/span>/, '<span class="discipline-card__status">Open topic group →</span>');
      return `<a class="discipline-card discipline-card--link" href="${slug}/">${improvedContent}</a>`;
    });
  });
  fs.writeFileSync(file, source);
}

function updateSearchIndex(entries, parents) {
  const index = entries.map((entry) => {
    const parent = parents.get(`${entry.domainName}|${entry.l2Title}`);
    return {
      title: `${entry.title} | Industrial Calculation Hub`,
      href: `${parent.directory}/${parent.l2Directory}/${slugify(entry.title)}/`,
      type: `${entry.domainName} navigation`,
      description: `Explore approved detailed knowledge routes for ${entry.title} in ${parent.title}.`
    };
  });
  let source = fs.readFileSync(searchFile, "utf8");
  source = source.replace(/const generatedLevel3Index = \[[\s\S]*?\];/, `const generatedLevel3Index = ${JSON.stringify(index)};`);
  fs.writeFileSync(searchFile, source);
}

function updateSitemap(entries, parents) {
  let source = fs.readFileSync(sitemapFile, "utf8");
  const existing = new Set([...source.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
  const urls = [];
  Object.values(domains).forEach((domain) => urls.push(`https://industrialcalculation.com/${domain.route}`));
  [...new Set(entries.map((entry) => `${entry.domainName}|${entry.l2Title}`))].forEach((key) => {
    const parent = parents.get(key);
    urls.push(`https://industrialcalculation.com/${parent.directory}/${parent.l2Directory}/`);
  });
  entries.forEach((entry) => {
    const parent = parents.get(`${entry.domainName}|${entry.l2Title}`);
    urls.push(`https://industrialcalculation.com/${parent.directory}/${parent.l2Directory}/${slugify(entry.title)}/`);
  });
  const additions = urls.filter((url) => !existing.has(url));
  if (!additions.length) return;
  const rows = additions.map((url) => `<url>\n    <loc>${url}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${url.split("/").length > 6 ? "0.5" : "0.6"}</priority>\n</url>`).join("\n\n");
  source = source.replace(/\s*<\/urlset>\s*$/, `\n\n<!-- ================= DOMAIN AND NAVIGATION PAGES ================= -->\n\n${rows}\n\n</urlset>\n`);
  fs.writeFileSync(sitemapFile, source);
}

function initialRouteState(entries, parents) {
  if (fs.existsSync(manifestFile)) return JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  const preExistingRoutes = [];
  const generatedRoutes = [];
  entries.forEach((entry) => {
    const parent = parents.get(`${entry.domainName}|${entry.l2Title}`);
    const relative = path.join(parent.directory, parent.l2Directory, slugify(entry.title), "index.html");
    try {
      execFileSync("git", ["ls-files", "--error-unmatch", "--", relative], { cwd: root, stdio: "ignore" });
      preExistingRoutes.push(relative.replace(/\\/g, "/"));
    } catch {
      generatedRoutes.push(relative.replace(/\\/g, "/"));
    }
  });
  const state = { source: "SITE-HIERARCHY.md", defined: entries.length, preExistingRoutes, generatedRoutes };
  fs.writeFileSync(manifestFile, `${JSON.stringify(state, null, 2)}\n`);
  return state;
}

function writeAudit(entries, initialState, parents) {
  const groups = [...new Set(entries.map((entry) => `${entry.domainName}|${entry.l2Title}`))];
  const listedParents = groups.map((key) => {
    const parent = parents.get(key);
    return `| ${parent.domainName} | ${parent.title} | /${parent.directory}/${parent.l2Directory}/ | ${entries.filter((entry) => `${entry.domainName}|${entry.l2Title}` === key).length} |`;
  }).join("\n");
  fs.mkdirSync(path.dirname(auditFile), { recursive: true });
  fs.writeFileSync(auditFile, `# Level 3 Route Reconciliation\n\nGenerated: 29 August 2026\n\n## Source and result\n\n- Frozen source checked: SITE-HIERARCHY.md\n- Defined Level 3 navigation groups: **${entries.length}**\n- Pre-existing Level 3 routes: **${initialState.preExistingRoutes.length}**\n- Newly generated Level 3 routes: **${initialState.generatedRoutes.length}**\n- Total Level 3 routes after generation: **${entries.length}**\n\n## Register discrepancy\n\nSITE-STATUS.md records 130 total Level 3 routes and 113 remaining. The frozen hierarchy contains 125 defined groups. Because a route must come from the frozen hierarchy, this implementation creates the 108 missing approved routes and does not invent five additional topics. Reconcile the status register before changing the frozen hierarchy.\n\n## Parent-route reconciliation\n\n| Primary domain | Level 2 collection | Published parent route | Level 3 groups |\n| --- | --- | --- | ---: |\n${listedParents}\n\nAll generated Level 3 pages list their approved Level 4 routes as non-working contextual cards until final knowledge pages are complete and reviewed.\n`);
}

function validateGeneratedNavigation(entries, parents) {
  const issues = [];
  const sitemap = fs.readFileSync(sitemapFile, "utf8");
  const searchSource = fs.readFileSync(searchFile, "utf8");
  const match = searchSource.match(/const generatedLevel3Index = (\[[\s\S]*?\]);/);
  const searchEntries = match ? JSON.parse(match[1]) : [];
  if (searchEntries.length !== entries.length) issues.push(`Search index has ${searchEntries.length} Level 3 entries; expected ${entries.length}.`);
  entries.forEach((entry) => {
    const parent = parents.get(`${entry.domainName}|${entry.l2Title}`);
    const slug = slugify(entry.title);
    const route = `${parent.directory}/${parent.l2Directory}/${slug}/`;
    const file = path.join(root, route, "index.html");
    const url = `https://industrialcalculation.com/${route}`;
    if (!fs.existsSync(file)) { issues.push(`Missing Level 3 file: ${route}`); return; }
    const page = fs.readFileSync(file, "utf8");
    const headingPattern = new RegExp(`<h1[^>]*>\\s*${escapeRegex(entry.title)}\\s*<\\/h1>`, "i");
    if (!headingPattern.test(page)) issues.push(`Heading mismatch: ${route}`);
    if (!page.includes(`<link rel="canonical" href="${url}">`)) issues.push(`Canonical mismatch: ${route}`);
    if (!sitemap.includes(`<loc>${url}</loc>`)) issues.push(`Sitemap route missing: ${route}`);
    const parentSource = fs.readFileSync(path.join(root, parent.directory, parent.l2Directory, "index.html"), "utf8");
    if (!parentSource.includes(`href="${slug}/"`) || !parentSource.includes(`<h3>${entry.title}</h3>`)) issues.push(`Level 2 link missing: ${route}`);
  });
  if (issues.length) throw new Error(`Level 3 navigation validation failed:\n${issues.join("\n")}`);
}

const parents = readL2Routes();
const entries = readHierarchy();
const missingParents = [...new Set(entries.filter((entry) => !parents.has(`${entry.domainName}|${entry.l2Title}`)).map((entry) => `${entry.domainName} > ${entry.l2Title}`))];
if (missingParents.length) throw new Error(`Published Level 2 route missing for: ${missingParents.join(", ")}`);

const existing = [];
const created = [];
entries.forEach((entry) => {
  const parent = parents.get(`${entry.domainName}|${entry.l2Title}`);
  const file = path.join(root, parent.directory, parent.l2Directory, slugify(entry.title), "index.html");
  if (fs.existsSync(file)) { existing.push(entry); return; }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, pageHtml(entry, parent));
  created.push(entry);
});

[...new Set(entries.map((entry) => `${entry.domainName}|${entry.l2Title}`))].forEach((key) => {
  const parent = parents.get(key);
  linkL2Cards(parent, entries.filter((entry) => `${entry.domainName}|${entry.l2Title}` === key));
});
updateSearchIndex(entries, parents);
updateSitemap(entries, parents);
const initialState = initialRouteState(entries, parents);
writeAudit(entries, initialState, parents);
validateGeneratedNavigation(entries, parents);
console.log(`Level 3 navigation: ${initialState.preExistingRoutes.length} pre-existing, ${initialState.generatedRoutes.length} generated, ${entries.length} total.`);
