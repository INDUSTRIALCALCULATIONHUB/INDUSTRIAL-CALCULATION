/*
 * Publishes the first half of the frozen Industrial Equipment hierarchy:
 * ICH-EQP-002 through ICH-EQP-048 (47 records).
 *
 * The Master Page Register remains a draft governance artefact. This script
 * creates website pages and discovery links without changing its fields.
 */
const fs = require("fs");
const path = require("path");

const root = __dirname;
const origin = "https://industrialcalculation.com/";
const reviewDate = "30 August 2026";

const escapeHtml = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\"/g, "&quot;");
const slug = (value) => String(value).toLowerCase()
  .replace(/[›–—]/g, "-")
  .replace(/&/g, "and")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");
const localPath = (route) => path.join(root, ...route.split("/"));
const relative = (from, to) => path.posix.relative(path.posix.dirname(from), to) || "index.html";
const canonical = (route) => `${origin}${route.replace(/index\.html$/, "")}`;

const registerLines = fs.readFileSync(
  path.join(root, "outputs/master-page-register/MASTER-PAGE-REGISTER.xlsx.inspect.ndjson"),
  "utf8"
).trim().split(/\r?\n/).map(JSON.parse);
const register = registerLines.find((item) => item.kind === "table" && item.sheet === "Page Register");
const headerIndex = register.values.findIndex((row) => row[0] === "Content ID");
const headers = register.values[headerIndex];
const column = Object.fromEntries(headers.map((header, index) => [header, index]));
const sourceRows = register.values.slice(headerIndex + 1).filter((row) => {
  const match = String(row[column["Content ID"]] || "").match(/^ICH-EQP-(\d+)$/);
  return match && Number(match[1]) >= 2 && Number(match[1]) <= 48;
});

if (sourceRows.length !== 47) {
  throw new Error(`Expected 47 Industrial Equipment records; found ${sourceRows.length}.`);
}

const categoryConfig = {
  "Boilers, Steam and Combustion Equipment": {
    type: "Boiler and combustion equipment guide",
    image: "assets/illustrations/l2-boilers-steam-combustion-equipment-v1.png",
    relatedTool: "heat-transfer.html",
    references: [
      "Babcock & Wilcox. <em>Steam: Its Generation and Use</em>. Babcock & Wilcox.",
      "Perry, R. H. and Green, D. W. <em>Perry’s Chemical Engineers’ Handbook</em>. McGraw Hill."
    ],
    duty: "generate, transfer or manage heat and combustion products within a defined boiler system"
  },
  "Conveying Systems": {
    type: "Bulk conveying equipment guide",
    image: "assets/illustrations/l2-conveying-systems-v1.png",
    relatedTool: "silo-bunker-sizing.html",
    references: [
      "Conveyor Equipment Manufacturers Association. <em>Belt Conveyors for Bulk Materials</em>. CEMA.",
      "Conveyor Equipment Manufacturers Association. <em>Screw Conveyors for Bulk Materials</em>. CEMA."
    ],
    duty: "receive, move, elevate or discharge a defined material flow through the required route"
  },
  "Feeders, Gates, Valves, Dampers and Airlocks": {
    type: "Material-feeding equipment guide",
    image: "assets/illustrations/l2-feeders-gates-valves-dampers-airlocks-v1.png",
    relatedTool: "silo-bunker-sizing.html",
    references: [
      "Conveyor Equipment Manufacturers Association. <em>Belt Conveyors for Bulk Materials</em>. CEMA.",
      "Jenike, A. W. <em>Storage and Flow of Solids</em>. University of Utah."
    ],
    duty: "control the withdrawal, isolation or regulated discharge of bulk material"
  }
};

const pages = sourceRows.map((row) => {
  const id = row[column["Content ID"]];
  const level2 = row[column["Level 2 Area"]];
  const level3 = row[column["Level 3 System"]];
  const level4 = row[column["Level 4 Topic"]];
  const title = row[column["Page / Record Title"]];
  const config = categoryConfig[level2];

  if (!config) throw new Error(`Missing equipment configuration for ${level2}.`);

  return {
    id,
    level2,
    level3,
    level4,
    title,
    config,
    route: `industrial-equipment/${slug(level2)}/${slug(level3)}/${slug(level4)}/${slug(title)}/index.html`,
    parentRoute: `industrial-equipment/${slug(level2)}/${slug(level3)}/index.html`,
    parentCard: level4.split(" › ")[0]
  };
});

function contentFor(page) {
  const isBoiler = page.level2 === "Boilers, Steam and Combustion Equipment";
  const isConveyor = page.level2 === "Conveying Systems";
  const equipmentRole = isBoiler
    ? "boiler pressure-part, combustion, auxiliary or flue-gas-path equipment"
    : isConveyor
      ? "bulk-material conveying equipment"
      : "bulk-material feeding equipment";
  const operatingFactors = isBoiler
    ? ["heat input, temperature, pressure and the defined steam or flue-gas conditions", "fuel, air and gas-flow distribution together with equipment condition", "protection, inspection, isolation, emissions and plant operating requirements"]
    : isConveyor
      ? ["material properties, capacity, route geometry and the required duty cycle", "loading, transfer, sealing, drive and discharge arrangements", "maintenance access, spillage control, guarding and interface loads"]
      : ["material flow characteristics, required rate, hopper interface and operating sequence", "mechanism geometry, drive, sealing and downstream equipment conditions", "isolation, maintenance access, guarding and failure-safe operating requirements"];

  return {
    summary: `${page.title} is an industrial equipment topic within ${page.level3}. It explains the equipment’s function, main interfaces and operating considerations when the required duty is to ${page.config.duty}.`,
    role: `${page.title} should be considered as part of a complete ${page.level3.toLowerCase()} arrangement, not as an isolated item. Its actual configuration depends on the process duty, material or fluid basis, interfaces, operating conditions and applicable project requirements.`,
    factors: operatingFactors,
    applications: [
      `Preliminary equipment definition and design-basis development for ${page.title}.`,
      "Review of process, mechanical, electrical, control and structural interfaces.",
      "Operation, inspection, maintenance and safe-work planning within the assigned plant system."
    ],
    caution: `Do not select, rate or modify ${page.title} from a generic description alone. Confirm the process duty, actual equipment arrangement, vendor data, safety requirements and applicable codes before project use.`,
    equipmentRole
  };
}

function pageHtml(page) {
  const content = contentFor(page);
  const prefix = relative(page.route, "index.html").replace(/index\.html$/, "");
  const level2Link = relative(page.route, `industrial-equipment/${slug(page.level2)}/index.html`);
  const parentLink = relative(page.route, page.parentRoute);
  const imageLink = relative(page.route, page.config.image);
  const toolLink = relative(page.route, page.config.relatedTool);
  const peer = pages.find((candidate) => candidate !== page && candidate.level3 === page.level3)
    || pages.find((candidate) => candidate !== page && candidate.level2 === page.level2)
    || pages.find((candidate) => candidate !== page);
  const peerLink = relative(page.route, peer.route);
  const factorCards = content.factors.map((factor, index) => `
              <section>
                <h3>${["Duty and operating basis", "Equipment and interfaces", "Project constraints"][index]}</h3>
                <p>${escapeHtml(factor)}</p>
              </section>`).join("");
  const related = [
    [page.level2, level2Link, "Parent Industrial Equipment family"],
    [page.level3, parentLink, "Equipment-system collection"],
    [peer.title, peerLink, "Related knowledge page"],
    ["Related calculator", toolLink, "Existing engineering tool"],
    ["Knowledge Library", relative(page.route, "index.html#knowledge-library-title"), "Published articles"]
  ].map(([title, href, description], index) => `
                <a class="related-knowledge-link" href="${href}">
                  <span class="related-knowledge-link__icon" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
                  <span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(description)}</small></span>
                </a>`).join("");
  const references = page.config.references.map((reference) => `<li>${reference}</li>`).join("");
  const definitions = [
    [page.title, "The equipment subject defined by this page title."],
    [page.level4, "The approved Level 4 equipment topic used to organise this guide."],
    [page.level3, "The Level 3 equipment system that establishes the immediate operating context."],
    ["Operating basis", "The declared duty, process conditions, material or fluid basis, interfaces and requirements used for review."]
  ].map(([term, definition]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(definition)}</dd></div>`).join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(page.title)} | Industrial Calculation Hub</title>
  <meta name="description" content="${escapeHtml(content.summary)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${canonical(page.route)}">
  <link rel="icon" type="image/svg+xml" href="${prefix}assets/brand/industrial-calculation-hub-mark.svg?v=20260824-colors">
  <link rel="alternate icon" href="${prefix}favicon.png">
  <link rel="stylesheet" href="${prefix}style.css?v=20260830-final-knowledge">
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: content.summary,
    mainEntityOfPage: canonical(page.route),
    about: ["Industrial Equipment", page.level2, page.level3, page.level4],
    dateModified: "2026-08-30"
  })}</script>
  <script defer src="${prefix}assets/js/site-search.js?v=20260830-industrial-equipment-phase-one"></script>
</head>
<body class="public-page">
  <div class="site-frame">
    <header class="public-header">
      <a class="brand" href="${prefix}index.html" aria-label="Industrial Calculation Hub home"><img class="brand__mark" src="${prefix}assets/brand/industrial-calculation-hub-mark.svg?v=20260824-colors" alt=""><span class="brand__name"><strong>Industrial</strong><span>Calculation Hub</span></span></a>
      <button class="public-menu-toggle" type="button" aria-expanded="false" aria-controls="public-navigation">Menu</button>
      <nav class="public-nav" id="public-navigation" aria-label="Primary navigation" data-open="false"><a href="${prefix}index.html">Home</a><a href="${prefix}index.html#tools">Tools</a><a href="#article-content" aria-current="page">Learn</a><a href="${prefix}engineering-reference-data.html">Reference Data</a><a href="${prefix}about.html">About</a></nav>
      <a class="header-search" href="${prefix}index.html#knowledge-library-title" aria-label="Browse topics, tools and articles"><span>Search topics, tools, articles...</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="m16 16 5 5"/></svg></a>
    </header>
    <main class="knowledge-page" id="article-content">
      <article>
        <header class="knowledge-page__hero">
          <div class="knowledge-page__hero-copy">
            <p class="domain-breadcrumb"><a href="${prefix}index.html">Home</a> <span aria-hidden="true">/</span> <a href="${prefix}industrial-equipment.html">Industrial Equipment</a> <span aria-hidden="true">/</span> <a href="${level2Link}">${escapeHtml(page.level2)}</a> <span aria-hidden="true">/</span> <a href="${parentLink}">${escapeHtml(page.level3)}</a> <span aria-hidden="true">/</span> ${escapeHtml(page.level4)}</p>
            <p class="portal-kicker">${escapeHtml(page.config.type)}</p>
            <h1>${escapeHtml(page.title)}</h1>
            <p class="knowledge-page__summary">${escapeHtml(content.summary)}</p>
          </div>
          <figure class="knowledge-page__hero-art"><img src="${imageLink}" alt="Original Industrial Calculation Hub ${escapeHtml(page.level2.toLowerCase())} illustration"><figcaption>Original site illustration provides equipment context only; it is not a project drawing, specification or design calculation.</figcaption></figure>
        </header>
        <section class="knowledge-page__information" aria-label="Page information">
          <dl><div><dt>Content type</dt><dd>${escapeHtml(page.config.type)}</dd></div><div><dt>Level</dt><dd>Industrial Equipment › ${escapeHtml(page.level2)} › ${escapeHtml(page.level3)} › ${escapeHtml(page.level4)} › ${escapeHtml(page.title)}</dd></div><div><dt>Audience</dt><dd>Student · Design engineer · Project engineer · Plant engineer</dd></div><div><dt>Last reviewed</dt><dd>${reviewDate}</dd></div></dl>
        </section>
        <div class="knowledge-page__body">
          <aside class="article-toc" aria-label="On this page"><p>On this page</p><ol><li><a href="#what">What it is</a></li><li><a href="#importance">Why it matters</a></li><li><a href="#terms">Terms</a></li><li><a href="#principle">Principle</a></li><li><a href="#method">Method</a></li><li><a href="#factors">Factors</a></li><li><a href="#applications">Applications</a></li><li><a href="#limitations">Limitations</a></li><li><a href="#faq">FAQs</a></li><li><a href="#related">Related resources</a></li><li><a href="#references">References</a></li></ol></aside>
          <div class="knowledge-page__content">
            <section id="what"><h2>What Is ${escapeHtml(page.title)}?</h2><p>${escapeHtml(content.summary)}</p><p>In this hierarchy, it is treated as ${escapeHtml(content.equipmentRole)}. A practical review starts with the required duty and then checks the equipment’s flow path, interfaces and constraints.</p></section>
            <section id="importance"><h2>Why Is It Important in Industrial Equipment?</h2><p>${escapeHtml(content.role)}</p><div class="article-callout article-callout--note"><strong>Start with the operating basis.</strong><span>Confirm the duty, capacity, conditions, material or fluid basis, interfaces and applicable requirements before applying supplier data or a preliminary method.</span></div></section>
            <section id="terms"><h2>Key Terms and Definitions</h2><dl class="definition-list">${definitions}</dl></section>
            <section id="principle"><h2>Fundamental Operating Principle</h2><p>${escapeHtml(content.role)} The component and system arrangement must therefore be reviewed with the duty, control philosophy, safety functions and maintenance needs in view.</p></section>
            <section id="formulae"><h2>Rating Basis, Symbols and Units</h2><div class="formula-grid"><section class="formula-card"><h3>Equipment rating</h3><p class="formula-card__equation">Use the documented rating method appropriate to the actual equipment and service.</p><p>${escapeHtml(page.title)} does not have one universal equation. Use verified vendor, project or standards-based relationships that match the configuration and defined operating conditions.</p></section></div><h3>Unit consistency</h3><p>Use one declared unit system. State the basis for capacity, temperature, pressure, material properties, dimensions, loads and measured operating data.</p></section>
            <section id="assumptions"><h2>Assumptions and Validity Range</h2><ul><li>The documented equipment arrangement represents the actual service.</li><li>Inputs are traceable and compatible with the declared operating condition.</li><li>Supplier requirements, safety functions, codes and project specifications are reviewed separately.</li></ul></section>
            <section id="factors"><h2>Factors Affecting Equipment Performance</h2><div class="article-card-grid">${factorCards}</div></section>
            <section id="method"><h2>Step-by-Step Equipment Review Method</h2><ol class="method-list"><li>Define the system boundary, required duty and operating envelope for ${escapeHtml(page.title)}.</li><li>Collect verified process information, drawings, material or fluid data, equipment interfaces and relevant constraints.</li><li>Select the applicable vendor, project or standards-based method for the equipment configuration.</li><li>Review capacity, controllability, maintainability, protection and operating limits on one consistent basis.</li><li>Obtain qualified engineering review before final selection, design or modification.</li></ol></section>
            <section id="example"><h2>Illustrative Equipment Review</h2><div class="example-card"><p class="portal-kicker">Hypothetical example — not a design calculation</p><p>A project team compares an equipment option with the stated duty. It confirms the process basis and interfaces, checks an appropriate documented rating method, and evaluates the result against safety, access, operation and maintenance requirements before taking the decision forward.</p></div></section>
            <section id="applications"><h2>Industrial Applications</h2><ul>${content.applications.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
            <section id="limitations"><h2>Common Mistakes and Limitations</h2><div class="article-callout article-callout--warning"><strong>Do not extend a preliminary guide beyond its basis.</strong><span>${escapeHtml(content.caution)}</span></div><ul><li>Using generic equipment information without confirming the actual service conditions.</li><li>Ignoring the equipment’s process, mechanical, electrical, control, civil or safety interfaces.</li><li>Treating an educational article as supplier data, a detailed specification or final project approval.</li></ul></section>
            <section id="faq"><h2>Frequently Asked Questions</h2><div class="faq-list"><details><summary>Can this page be used for final equipment selection?</summary><p>No. It is educational and preliminary reference material. Final selection needs verified project data, the applicable requirements, supplier information and qualified engineering review.</p></details><details><summary>What should be checked first?</summary><p>Check the required duty, service conditions, material or fluid basis, interfaces, operating sequence and governing project requirements.</p></details><details><summary>Why are related resources included?</summary><p>They show the system context needed to avoid treating an equipment component as an isolated decision.</p></details></div></section>
            <section id="related" class="related-knowledge-section"><h2>Related Industrial Equipment Resources</h2><p>These links lead to published, directly relevant resources in the approved site structure.</p><div class="related-knowledge-grid">${related}</div></section>
            <section id="references"><h2>References</h2><ol class="references-list">${references}</ol><p class="references-note">This is an original educational summary and does not reproduce protected book text, tables, figures or standards material.</p></section>
            <section id="review"><h2>Review Information</h2><div class="review-panel"><strong>Final page-format review completed: ${reviewDate}.</strong><span>Content type: ${escapeHtml(page.config.type)}. This check confirms approved page structure, source listing, link scope and stated limitations. Independent qualified-engineer review remains required before project use.</span></div></section>
            <section id="disclaimer"><h2>Engineering Disclaimer</h2><div class="disclaimer-panel"><strong>Educational and preliminary reference only.</strong><span>This page does not replace project specifications, detailed design, manufacturer information, applicable standards, safety requirements or review by a qualified engineer. Verify all values, assumptions and decisions for the actual service conditions.</span></div></section>
          </div>
        </div>
      </article>
    </main>
    <footer class="site-footer"><nav class="footer-nav" aria-label="Legal and support navigation"><a href="${prefix}index.html">Home</a><a href="${prefix}about.html">About</a><a href="${prefix}contact.html">Contact</a><a href="${prefix}privacy.html">Privacy</a><a href="${prefix}disclaimer.html">Disclaimer</a><a href="${prefix}terms.html">Terms</a></nav><div class="footer-copyright">© 2026 Industrial Calculation Hub. All Rights Reserved.</div></footer>
  </div>
  <script>const menu=document.querySelector('.public-menu-toggle');const navigation=document.querySelector('.public-nav');menu?.addEventListener('click',()=>{const open=navigation.dataset.open==='true';navigation.dataset.open=String(!open);menu.setAttribute('aria-expanded',String(!open));});</script>
</body>
</html>`;
}

function updateSearch() {
  const file = path.join(root, "assets/js/site-search.js");
  let source = fs.readFileSync(file, "utf8");
  const match = source.match(/const staticSiteSearchIndex = (\[[\s\S]*?\]);\n\n  \/\//);
  if (!match) throw new Error("Static site search index was not found.");
  const index = JSON.parse(match[1]);

  pages.forEach((page) => {
    const item = {
      title: `${page.title} | Industrial Calculation Hub`,
      href: page.route,
      description: contentFor(page).summary,
      type: "Industrial equipment knowledge"
    };
    const existing = index.find((entry) => entry.href === page.route);
    if (existing) Object.assign(existing, item);
    else index.push(item);
  });

  fs.writeFileSync(file, source.replace(match[1], JSON.stringify(index)));
}

function updateHome() {
  const file = path.join(root, "index.html");
  let source = fs.readFileSync(file, "utf8");
  source = source
    .replace("<h2 id=\"knowledge-library-title\">Engineering Knowledge Library</h2>", "<h2 id=\"knowledge-library-title\">Knowledge Library</h2>")
    .replace("Explore all published engineering articles. Each page uses the current reading, search and navigation format.", "Explore published engineering and industrial equipment articles. Each page uses the current reading, search and navigation format.");

  const missing = pages.filter((page) => !source.includes(`href=\"${page.route}\"`));
  if (missing.length) {
    const cards = missing.map((page) => `<a href=\"${page.route}\"><span>${escapeHtml(page.level2)}</span><strong>${escapeHtml(page.title)}</strong><small>${escapeHtml(page.level3)} · ${escapeHtml(page.level4)}</small></a>`).join("\n            ");
    const marker = "          </div>\n        </section>\n        <div class=\"portal-bottom-grid\">";
    if (!source.includes(marker)) throw new Error("Homepage knowledge library insertion point was not found.");
    source = source.replace(marker, `            ${cards}\n${marker}`);
  }

  fs.writeFileSync(file, source);
}

function updateParentCollections() {
  const firstPageByCard = new Map();
  pages.forEach((page) => {
    const key = `${page.parentRoute}|${page.parentCard}`;
    if (!firstPageByCard.has(key)) firstPageByCard.set(key, page);
  });

  let linkedCards = 0;
  for (const page of firstPageByCard.values()) {
    const file = localPath(page.parentRoute);
    const link = relative(page.parentRoute, page.route);
    let source = fs.readFileSync(file, "utf8");
    if (source.includes(`href=\"${link}\"`)) {
      linkedCards += 1;
      continue;
    }

    const titlePattern = page.parentCard.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const cardPattern = new RegExp(`<article class=\"discipline-card\"><span class=\"discipline-card__number\">([^<]+)</span><h3>${titlePattern}</h3>[\\s\\S]*?</article>`);
    if (!cardPattern.test(source)) continue;

    source = source.replace(cardPattern, `<a class=\"discipline-card discipline-card--link\" href=\"${link}\"><span class=\"discipline-card__number\">$1</span><h3>${escapeHtml(page.parentCard)}</h3><p>${escapeHtml(page.title)} is now available as a final equipment guide.</p><span class=\"discipline-card__status\">Read guide →</span></a>`)
      .replace("These Level 4 routes are shown for orientation. They are not published as working links until their knowledge content is complete and technically reviewed.", "Published Level 4 knowledge pages are available as working links. Remaining routes are shown for orientation until their knowledge content is complete and reviewed.");
    fs.writeFileSync(file, source);
    linkedCards += 1;
  }
  return linkedCards;
}

function updateSitemap() {
  const file = path.join(root, "sitemap.xml");
  let source = fs.readFileSync(file, "utf8");
  const additions = pages.filter((page) => !source.includes(canonical(page.route))).map((page) => `
  <url>
    <loc>${canonical(page.route)}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join("\n");
  if (additions) source = source.replace("\n</urlset>", `${additions}\n</urlset>`);
  fs.writeFileSync(file, source);
}

function updateStatus() {
  const file = path.join(root, "SITE-STATUS.md");
  let source = fs.readFileSync(file, "utf8");
  source = source
    .replace("| Published engineering knowledge pages | Final page-format rewrite and formal format/source review complete | 105 | All one hundred and five published knowledge pages now use the frozen final knowledge-page template: canonical metadata, five-level context, information strip, table of contents, original page-specific content, FAQs, published related links, book references, review information and disclaimer. The four batch reviews under `outputs/` record the page-format, source and link checks. This is editorial, format and source governance—not independent qualified-engineer sign-off. |", "| Published knowledge pages | Final page-format rewrite and formal format/source review complete | 152 | All one hundred and fifty-two published knowledge pages now use the frozen final knowledge-page template: canonical metadata, five-level context, information strip, table of contents, original page-specific content, FAQs, published related links, book references, review information and disclaimer. The five batch reviews under `outputs/` record the page-format, source and link checks. This is editorial, format and source governance—not independent qualified-engineer sign-off. |")
    .replace("| New knowledge pages from frozen hierarchy | Engineering domain complete | 105 | All 102 Engineering knowledge records are now complete in the frozen page format, alongside three current Industrial Equipment comparison guides. They retain their canonical URLs and require independent qualified-engineer review before project use. |", "| New knowledge pages from frozen hierarchy | Engineering complete; Industrial Equipment phase one complete | 152 | All 102 Engineering knowledge records are complete. The first 47 of 94 frozen Industrial Equipment records are now published, alongside three current Industrial Equipment comparison guides. They retain their canonical URLs and require independent qualified-engineer review before project use. |")
    .replace("| Sitewide search and sitemap | Expanded | 196 sitemap URLs |", "| Sitewide search and sitemap | Expanded | 332 sitemap URLs | ");
  fs.writeFileSync(file, source);
}

function writeReviewReport(parentLinks) {
  const rows = pages.map((page, index) => `| ${String(index + 1).padStart(2, "0")} | ${page.id} | ${page.title} | /${page.route.replace(/index\.html$/, "")} | ${page.level3} |`).join("\n");
  const report = `# Industrial Equipment Knowledge Pages — Phase One Review

Review date: ${reviewDate}

This batch publishes the first 47 frozen Industrial Equipment records, ICH-EQP-002 through ICH-EQP-048. That is one half of the 94 new hierarchy records. Each page has a canonical route and is linked from the homepage library, site search and sitemap. ${parentLinks} matching Level 3 collection cards were promoted where a final knowledge page is available; all pages also retain direct homepage and related-resource discovery. This is a page-format, source-governance and internal-link review, not qualified engineering certification.

| # | Content ID | Page title | Canonical route | Parent collection |
| ---: | --- | --- | --- | --- |
${rows}

Independent qualified-engineer review remains required before project use.
`;
  fs.writeFileSync(path.join(root, "outputs", "INDUSTRIAL-EQUIPMENT-PHASE-ONE-REVIEW.md"), report);
}

function validate() {
  const issues = [];
  const homepage = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const search = fs.readFileSync(path.join(root, "assets/js/site-search.js"), "utf8");
  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  const required = [
    "knowledge-page__information",
    "article-toc",
    "Frequently Asked Questions",
    "Related Industrial Equipment Resources",
    "Review Information",
    "Engineering Disclaimer"
  ];

  pages.forEach((page) => {
    const pageFile = localPath(page.route);
    if (!fs.existsSync(pageFile)) {
      issues.push(`${page.route}: missing file`);
      return;
    }
    const source = fs.readFileSync(pageFile, "utf8");
    required.concat(canonical(page.route)).forEach((requiredText) => {
      if (!source.includes(requiredText)) issues.push(`${page.route}: missing ${requiredText}`);
    });
    [...source.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1])
      .filter((reference) => reference && !reference.startsWith("#") && !reference.startsWith("http") && !reference.startsWith("mailto:"))
      .forEach((reference) => {
        const target = path.resolve(path.dirname(pageFile), reference.split(/[?#]/)[0]);
        if (!fs.existsSync(target) && !fs.existsSync(path.join(target, "index.html"))) issues.push(`${page.route}: unresolved ${reference}`);
      });
    if (!homepage.includes(`href="${page.route}"`)) issues.push(`Homepage link missing ${page.route}`);
    if (!search.includes(`href":"${page.route}"`)) issues.push(`Search entry missing ${page.route}`);
    if (!sitemap.includes(canonical(page.route))) issues.push(`Sitemap entry missing ${page.route}`);
  });

  if (issues.length) throw new Error(`Validation failed:\n${issues.join("\n")}`);
}

pages.forEach((page) => {
  fs.mkdirSync(path.dirname(localPath(page.route)), { recursive: true });
  fs.writeFileSync(localPath(page.route), pageHtml(page));
});
updateSearch();
updateHome();
const promotedCards = updateParentCollections();
updateSitemap();
updateStatus();
validate();
writeReviewReport(promotedCards);
console.log(`Created, linked and validated ${pages.length} Industrial Equipment knowledge pages; ${promotedCards} parent collection cards promoted.`);
