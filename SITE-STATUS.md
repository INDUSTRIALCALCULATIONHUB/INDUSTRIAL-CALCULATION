# Industrial Calculation Hub - Site Status

## Governance

- **Sitemap status:** Frozen on 2026-08-03.
- **Frozen documents:** `SITE-MAP.md` and `SITE-HIERARCHY.md`.
- **Change rule:** No domain, hierarchy, page-name, URL-structure, or scope change is made to either sitemap document without the owner's explicit approval in advance.
- **Notification rule:** Before any proposed sitemap change, explain the proposed change and wait for approval. Do not make the change merely because it appears useful.
- **Progress rule:** Update this file to report page creation, publication status, review status, and completion counts. Do not use the sitemap documents for routine progress updates.

## Current baseline

| Area | Status | Current count | Notes |
|---|---|---:|---|
| Five-level sitemap | Frozen — public-navigation amendment approved | 1 | The five-level internal taxonomy remains defined in `SITE-HIERARCHY.md`; owner-approved public navigation exposes only Level 1 and Level 2 collections, with canonical-page cross-listing rather than duplicated content. |
| Master sitemap and data policy | Frozen | 1 | Defined in `SITE-MAP.md` |
| Published knowledge pages | Final page-format rewrite and formal format/source review complete | 152 | All one hundred and fifty-two published knowledge pages now use the frozen final knowledge-page template: canonical metadata, five-level context, information strip, table of contents, original page-specific content, FAQs, published related links, book references, review information and disclaimer. The five batch reviews under `outputs/` record the page-format, source and link checks. This is editorial, format and source governance—not independent qualified-engineer sign-off. |
| Published calculator-type pages | Existing — homepage directory complete | 11 active + 1 inactive | Every active existing calculator is individually linked from the homepage. `fabrication-bom-creator.html` remains intentionally excluded because its page is not yet constructed or approved for promotion. |
| Existing calculator interface and knowledge-module upgrade | Implemented | 11 of 11 | All eleven active calculator pages use the approved responsive portal layout, original page-specific illustrations and calculator-specific engineering-knowledge modules. Existing calculator inputs, validation, formulas and output behaviour have been retained; the Plate Weight Calculator's missing geometry inputs and the Thermal Expansion Calculator's undefined-length output error were corrected so their existing intended calculations can produce results. |
| Published unit converters | Interface, results presentation and knowledge-link system implemented | 6 of 6 | Area, length, pressure, temperature, volume, and mass/weight/force converters use the approved responsive portal interface, are individually linked from the homepage and each links to its relevant section in the canonical unit-conversion guide. Their results use one accessible desktop/mobile table system with quantity-specific titles, column headings, explanatory notes and a visibly enlarged quantity badge. Pressure results use a dedicated display rule of up to six decimal places, with scientific notation only for very small or very large values. |
| Unit-converter factor audit | Completed | 6 of 6 | Factors and terminology were checked against NIST/BIPM conventions. The volume converter correction is 1 mm³ = 1 × 10⁻⁹ m³; the mass/force converter now clearly distinguishes mass from pound-force and ounce-force; pressure now uses kgf/cm² terminology. |
| Unit-conversion engineering guide | Upgraded existing canonical page | 1 | `unit-conversion-explained.html` is the single original engineering-knowledge guide for the six existing converters. It has six direct section anchors; this avoids six overlapping articles and does not change the frozen hierarchy. |
| Primary-domain landing pages | Implemented | 4 of 4 | `engineering.html`, `industrial-equipment.html`, `industrial-processes.html` and `engineering-reference-data.html` expose the approved Level 2 groups; all 34 constructed Level 2 routes are linked from their Level 1 pages. |
| Level 2 landing pages | Published | 34 of 34 | All eleven Engineering, all nine Industrial Equipment, all eight Industrial Processes and all six Engineering Reference Data Level 2 groups are live. Each reference-data landing page has an original illustration and approved Level 3 category navigation. |
| Level 3 navigation pages | Implemented from frozen hierarchy | 125 of 125 | The frozen hierarchy defines 125 Level 3 groups: 17 pre-existing routes and 108 newly generated routes. Every Level 2 landing page now links to its Level 3 groups; each Level 3 page lists approved Level 4 routes as non-working contextual cards until its final knowledge content is complete. `outputs/LEVEL3-ROUTE-RECONCILIATION.md` documents the five-route discrepancy with the previous 130-page status figure. |
| New knowledge pages from frozen hierarchy | Engineering complete; Industrial Equipment phase one complete | 152 | All 102 Engineering knowledge records are complete. The first 47 of 94 frozen Industrial Equipment records are now published, alongside three current Industrial Equipment comparison guides. They retain their canonical URLs and require independent qualified-engineer review before project use. |
| New reference-data records | Not started | 0 | No database records created yet |
| Final page-format standard | Frozen — amended with owner approval | 1 | `PAGE-FORMAT-STANDARD.md` includes the 2026-08-23 universal support navigation, separate favicon, original-content, consent and non-deceptive-ad release checks |
| Master page register | Draft 2 — canonical control fields added; owner decisions required | 328 | Formula-driven workbook at `outputs/master-page-register/MASTER-PAGE-REGISTER.xlsx`; its new `Canonical Review` sheet records canonical ID, public-URL status, content role, primary/cross-listed collections, duplicate risk and existing-asset disposition without changing the Page Register. The 2026-08-25 audit found no exact duplicate titles, 10 mapped existing knowledge assets and 5 unmapped legacy knowledge assets. See `MASTER-PAGE-REGISTER-CANONICAL-AUDIT.md`. The workbook remains draft and does not authorize a sitemap, route, page-name or scope change. |
| Global navigation and scroll controls | Implemented | Public portal pages | The compact sticky desktop header remains the primary desktop control. Shared navigation adds a keyboard-accessible Back to Top button after substantial scrolling and a five-action mobile bar: Home, Tools, Learn, Reference and Search. Legal/support links remain in the footer and mobile menu to prevent a crowded fixed bar. |
| Responsive visual design system | Implemented for current portal pages and final knowledge articles | 125 Level 3 routes + current published pages | The owner-selected boxed blue-and-teal portal design now covers the Level 3 navigation routes, all 16 finalized knowledge pages, and the previously upgraded homepage, support, domain, Level 2, tool and converter pages. |
| Sitewide search and sitemap | Expanded | 332 sitemap URLs |  Client-side search now includes every Level 3 navigation route, and the sitemap includes the four Level 1 pages, 34 Level 2 pages and 125 Level 3 pages. Inactive Fabrication BOM Creator remains excluded. |
| Homepage illustration set | Implemented | 6 | Original blueprint-style hero, beam/loading, twin-pump, process-vessel, reference-fastener and engineering-book illustrations are stored under `assets/illustrations` and used by `index.html`. |
| Shared website/mobile-app content model | Draft — owner review required | 1 | Defined in `CONTENT-DATA-MODEL-DRAFT.md`; technology-neutral content contract for knowledge pages first. No physical database, API, or calculator work has been created. |
| Editorial and reference policy | Partially defined | 1 | Page-format standard covers basic book references; approved source library and technical-review workflow remain to be finalized |
| URL, metadata and structured-data standard | Partially implemented | 125 Level 3 pages | Each Level 3 navigation page has a canonical URL, description and CollectionPage structured data. Existing pages remain to be standardized under the wider metadata program. |
| Reference-data governance register | Partially defined | 1 | Policy is in `SITE-MAP.md`; dataset source, versioning, and update workflow still need finalization |
| Homepage and mobile-app design prototype | Approved — homepage updated | 1 | The selected desktop/laptop homepage reference is implemented for `index.html`, which now directly lists every active calculator and each unit converter. Future app screens remain a design direction, not a built app. |
| Legal support and AdSense readiness | Partially implemented | 69 | Standalone `disclaimer.html`, shared SVG favicon, valid six-link support navigation and local-link verification completed across 69 public HTML pages. Live consent configuration and final publisher-account review remain required before ads are enabled. |
| Responsive support-page redesign | Implemented | 5 of 5 | About, Contact, Privacy, Disclaimer and Terms use the same owner-selected responsive header, logo, search control, visual system and six-link footer as the homepage. |

## Existing knowledge pages

- Air Density
- Air Pollution Control Systems
- Bag Filter
- Bernoulli Equation
- Boiler Efficiency
- Duct Flow Rate
- Electrostatic Precipitator
- ESP vs Bag Filter
- Heat Conduction
- Heat Transfer
- Pipe Flow Basics
- Pressure Vessel Design Basics
- Pump Power
- Reynolds Number
- Thermal Expansion

## Next approved work

1. Produce additional final knowledge pages under the completed Level 3 navigation routes, beginning with the highest-value calculator and article cross-links.
2. Establish the independent qualified-engineer technical-review and approved-source workflow before marking new knowledge pages ready for project use.
3. Create governed reference-data records with source, revision and verification fields.
4. Complete a release audit for metadata, structured data, legal/consent configuration and external publisher requirements.

## Recommended construction-control sequence

1. Master Page Register
2. Shared Content and Database Model for Website and Mobile App
3. Global Navigation and URL Standard
4. Responsive Visual Design System and Component Library
5. Editorial, Reference and Technical Review Policy
6. Reference-Data Governance Register
7. Content Production Workflow and Quality-Assurance Checklist
