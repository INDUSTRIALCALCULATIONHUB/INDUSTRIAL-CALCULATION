(() => {
  "use strict";

  const articleInfo = {
    "air-density-explained.html": ["Fluid mechanics", "Air-density and atmospheric-property reference"],
    "air-pollution-control-systems.html": ["Environmental engineering", "Industrial emission-control systems"],
    "bag-filter.html": ["Air pollution control", "Fabric-filter operation and performance"],
    "bernoulli-equation-explained.html": ["Fluid mechanics", "Energy equation and flow-system analysis"],
    "boiler-efficiency-explained.html": ["Thermal engineering", "Boiler performance and heat-loss methods"],
    "duct-flow-rate-explained.html": ["Fluid mechanics", "Airflow, velocity and duct sizing"],
    "electrostatic-precipitator.html": ["Air pollution control", "ESP operation and collection performance"],
    "esp-vs-bag-filter.html": ["Air pollution control", "Technology comparison for particulate control"],
    "heat-conduction-explained.html": ["Thermal engineering", "Fourier's law and thermal conductivity"],
    "heat-transfer-explained.html": ["Thermal engineering", "Conduction, convection and radiation"],
    "pipe-flow-basics.html": ["Fluid mechanics", "Piping flow, losses and hydraulic design"],
    "pressure-vessel-design-basics.html": ["Mechanical engineering", "Pressure-vessel stress and design basics"],
    "pump-power-basics.html": ["Fluid mechanics", "Pump hydraulic power and motor selection"],
    "reynolds-number-explained.html": ["Fluid mechanics", "Flow-regime classification"],
    "thermal-expansion-explained.html": ["Thermal engineering", "Free linear thermal movement"]
  };

  const technicalSources = {
    "air-density-explained.html": ["NASA Glenn Research Center: standard atmosphere reference", "https://www.grc.nasa.gov/www/k-12/airplane/atmosmet.html"],
    "air-pollution-control-systems.html": ["US EPA: Air Pollution Control Cost Manual", "https://www.epa.gov/economic-and-cost-analysis-air-pollution-regulations/cost-reports-and-guidance-air-pollution"],
    "bag-filter.html": ["US EPA: Fabric-filter guidance", "https://www.epa.gov/sites/default/files/2020-07/documents/c_allchs.pdf"],
    "bernoulli-equation-explained.html": ["NASA Glenn Research Center: Bernoulli equation", "https://www.grc.nasa.gov/www/k-12/airplane/bern.html"],
    "boiler-efficiency-explained.html": ["US Department of Energy: steam systems", "https://www.energy.gov/cmei/ito/steam-systems"],
    "duct-flow-rate-explained.html": ["US EPA: ductwork and system guidance", "https://www.epa.gov/economic-and-cost-analysis-air-pollution-regulations/cost-reports-and-guidance-air-pollution"],
    "electrostatic-precipitator.html": ["US EPA: particulate-control guidance", "https://www.epa.gov/economic-and-cost-analysis-air-pollution-regulations/cost-reports-and-guidance-air-pollution"],
    "esp-vs-bag-filter.html": ["US EPA: particulate-control guidance", "https://www.epa.gov/economic-and-cost-analysis-air-pollution-regulations/cost-reports-and-guidance-air-pollution"],
    "heat-conduction-explained.html": ["NIST: thermophysical-properties resources", "https://www.nist.gov/pml/thermophysical-properties-division"],
    "heat-transfer-explained.html": ["US Department of Energy: industrial heat resources", "https://www.energy.gov/eere/iedo/industrial-heat"],
    "pipe-flow-basics.html": ["Hydraulic Institute: pump and piping-system resources", "https://www.pumps.org/"],
    "pressure-vessel-design-basics.html": ["ASME: Boiler and Pressure Vessel Code overview", "https://www.asme.org/codes-standards/bpvc-standards/bpvc-2023"],
    "pump-power-basics.html": ["Hydraulic Institute: pump-system resources", "https://www.pumps.org/"],
    "reynolds-number-explained.html": ["NASA Glenn Research Center: Reynolds number", "https://www.grc.nasa.gov/www/k-12/airplane/reynolds.html"],
    "thermal-expansion-explained.html": ["NIST: thermophysical-properties resources", "https://www.nist.gov/pml/thermophysical-properties-division"]
  };

  const fileName = window.location.pathname.split("/").pop() || "";
  const [collection, scope] = articleInfo[fileName] || ["Engineering knowledge", "Existing engineering reference article"];
  const [sourceLabel, sourceUrl] = technicalSources[fileName] || ["Industrial Calculation Hub engineering disclaimer", "disclaimer.html"];
  const makeHeader = () => `<header class="public-header"><a class="brand" href="index.html" aria-label="Industrial Calculation Hub home"><img class="brand__mark" src="assets/brand/industrial-calculation-hub-mark.svg" alt=""><span class="brand__name"><strong>Industrial</strong><span>Calculation Hub</span></span></a><button class="public-menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false">☰</button><nav class="public-nav" aria-label="Primary navigation"><a href="index.html">Home</a><a href="index.html#tools">Tools</a><a href="engineering.html" aria-current="page">Learn</a><a href="engineering-reference-data.html">Reference Data</a><a href="about.html">About</a><a class="public-nav__search" href="search.html">Search website</a></nav><a class="header-search" href="search.html" aria-label="Search the website"><span>Search topics, tools, articles...</span><b aria-hidden="true">⌕</b></a></header>`;
  const footerMarkup = `<nav class="footer-nav" aria-label="Legal and support navigation"><a href="index.html">Home</a><a href="about.html">About</a><a href="contact.html">Contact</a><a href="privacy.html">Privacy</a><a href="disclaimer.html">Disclaimer</a><a href="terms.html">Terms</a></nav><div class="footer-copyright">© 2026 Industrial Calculation Hub. All Rights Reserved.</div>`;

  const installArticleUpgrade = () => {
    const oldTopBar = document.querySelector(".topbar");
    const wrapper = document.querySelector(".wrapper");
    if (!oldTopBar || !wrapper || document.querySelector(".legacy-article-upgraded")) return;

    document.body.classList.add("legacy-knowledge-page");
    oldTopBar.insertAdjacentHTML("beforebegin", makeHeader());
    oldTopBar.remove();
    document.body.classList.add("legacy-article-upgraded");
    wrapper.classList.add("legacy-article-shell");
    wrapper.setAttribute("role", "main");

    const hero = wrapper.querySelector(".header");
    const h1 = hero?.querySelector("h1") || null;
    if (hero) { hero.classList.remove("header", "center"); hero.classList.add("legacy-article-hero"); }
    if (hero && !h1) {
      const heading = document.createElement("h1");
      heading.textContent = document.title.replace(/\s*\|\s*Industrial Calculation Hub$/i, "");
      hero.prepend(heading);
    }
    if (hero && !hero.querySelector(".legacy-article-hero__meta")) {
      const meta = document.createElement("p");
      meta.className = "legacy-article-hero__meta";
      meta.textContent = `${collection} · Updated format: 29 August 2026`;
      hero.append(meta);
    }

    const headings = [...wrapper.querySelectorAll(".section > h2")].filter((heading) => !/engineering disclaimer/i.test(heading.textContent));
    if (headings.length) {
      const toc = document.createElement("nav");
      toc.className = "legacy-article-toc";
      toc.setAttribute("aria-label", "On this page");
      const title = document.createElement("strong"); title.textContent = "On this page"; toc.append(title);
      const list = document.createElement("ol");
      headings.slice(0, 12).forEach((heading, index) => {
        const id = heading.id || `section-${index + 1}`;
        heading.id = id;
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = `#${id}`;
        link.textContent = heading.textContent.trim();
        item.append(link); list.append(item);
      });
      toc.append(list);
      hero?.insertAdjacentElement("afterend", toc);
    }

    const review = document.createElement("section");
    review.className = "legacy-article-review";
    review.innerHTML = `<p class="portal-kicker">Article update</p><h2>Review and responsible use</h2><p><strong>Scope:</strong> ${scope}. This existing article has been moved into the current navigation, search and reading format. It remains educational and preliminary engineering-reference content.</p><p class="article-review-source"><strong>Technical reference baseline:</strong> <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${sourceLabel} ↗</a></p><div class="article-callout article-callout--warning"><strong>Project-use check:</strong><span>Verify applicable standards, manufacturer data, current operating conditions and project-specific calculations before design, procurement, construction or safety decisions.</span></div><p><a href="disclaimer.html">Read the Engineering Disclaimer →</a> &nbsp; <a href="contact.html">Report a correction or improvement →</a></p>`;
    const legacyFooter = document.querySelector(".footer");
    if (legacyFooter) { legacyFooter.className = "site-footer"; legacyFooter.innerHTML = footerMarkup; }
    else { const footer = document.createElement("footer"); footer.className = "site-footer"; footer.innerHTML = footerMarkup; document.body.append(footer); }
    (legacyFooter || document.querySelector(".site-footer"))?.insertAdjacentElement("beforebegin", review);

    const menuToggle = document.querySelector(".public-menu-toggle");
    const navigation = document.querySelector(".public-nav");
    menuToggle?.addEventListener("click", () => { const open = navigation.dataset.open === "true"; navigation.dataset.open = String(!open); menuToggle.setAttribute("aria-expanded", String(!open)); });
  };

  installArticleUpgrade();
})();
