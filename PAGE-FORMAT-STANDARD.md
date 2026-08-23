# Industrial Calculation Hub - Final Page Format Standard

## Status and governance

**Status:** Frozen on 2026-08-03; owner-approved AdSense and site-trust amendment on 2026-08-23

**Approved format standard:** 2026-08-03

**Change rule:** Do not change this page-format standard, its page sequences, required sections, related-link rules, or pre-publication checklist without the owner's explicit approval in advance.

**Use rule:** Use this document as the mandatory review checklist when creating or revising every public page.

**Amendment authority:** The owner approved the addition of universal support links, a separate replaceable brand favicon, and AdSense readiness checks on 2026-08-23. This amendment does not change the sitemap, hierarchy, page names, or page-type sequences.

This document is the required content and linking format for new pages and for the staged revision of existing pages. The sitemap remains frozen; this standard controls how pages within that sitemap are built.

## 1. Universal rules for every public page

Every public page must contain the following in this order:

```text
1. Accurate HTML head metadata and canonical URL
2. Site header and primary navigation
3. Breadcrumbs
4. H1 page title
5. Short technical summary
6. Page-information strip
7. Table of contents (for long pages)
8. Page-specific technical content
9. Frequently asked questions
10. Related Engineering Resources
11. References
12. Review information
13. Engineering disclaimer where relevant
14. Site footer
```

### 1.1 Required page-information strip

Display directly below the summary:

```text
Content type: Engineering principle | Equipment guide | Process guide | Reference data
Level: Full five-level breadcrumb classification
Audience: Student | Design engineer | Project engineer | Plant engineer
Last reviewed: DD Month YYYY
```

Reference-data pages also display:

```text
Data source: [source name]
Source edition/revision: [edition]
Data verified: DD Month YYYY
```

### 1.2 Required technical quality rules

- Use the final approved page title consistently in the H1, title tag, canonical URL, structured data, breadcrumbs, and related links.
- Use SI units as the primary unit system. State conversions where useful.
- Define every symbol before using it in an equation.
- State assumptions, applicable range, and limitations beside formulas or data tables.
- Use original text, original diagrams, and original tables.
- Knowledge-page references use fundamental books only, as approved for this site.
- Do not reproduce copyrighted standard text, tables, figures, or diagrams.
- Cite the source edition and publication details in the References section.
- Do not publish final-design, legal-compliance, or safety-setting instructions as general advice.
- Use only valid internal links. Do not link to a planned, renamed, or missing page.

### 1.3 Universal site-trust and AdSense readiness rules

- Use the common, replaceable brand mark at `assets/brand/industrial-calculation-hub-mark.svg` as the favicon on every public HTML page.
- Every public page must display a visible legal/support navigation block containing valid links to **Home**, **About**, **Contact**, **Privacy**, **Disclaimer**, and **Terms**.
- Use the consistent footer copyright notice: `© 2026 Industrial Calculation Hub. All Rights Reserved.` until the owner approves a year change.
- Publish original explanatory text, tables and diagrams only. Do not copy website text, copyrighted book/standard tables, figures, diagrams, photographs, or another publisher’s page layout.
- Use book references for technical pages as required above; a reference supports the content but does not permit reproducing protected text or illustrations.
- Before enabling or placing Google ads on a page, confirm that the page has substantial publisher content and that ads cannot be mistaken for navigation, downloads, results, buttons or other user-interface elements.
- Keep all calls to action, menus, download links and page-navigation controls clearly separate from advertising placements.
- The Privacy page must be kept current for actual data collection, cookies, third-party advertising and consent practices. Configure and test the applicable consent-management flow in the publisher account before serving personalized ads where Google requires it.
- Do not state or imply that Google, an advertiser, a publisher, a book author or a standards body endorses the site unless that is factually documented and approved.

---

# 2. Engineering Principle Page Format

Use for pages such as heat conduction, Bernoulli equation, Reynolds number, pipe flow, thermal expansion, dead load, wind load, material balance, and pump curves.

```text
Breadcrumbs
H1: [Topic]: Principles, Formulae and Industrial Applications
Technical summary
Page-information strip
Table of contents

H2: What Is [Topic]?
H2: Why Is [Topic] Important in Engineering?
H2: Key Terms and Definitions
H2: Fundamental Principle
H2: Formulae, Symbols and Units
H3: Main Formula
H3: Symbol Definitions
H3: Unit Consistency
H2: Assumptions and Validity Range
H2: Factors Affecting [Topic]
H2: Types, Classifications or Operating Cases
H2: Step-by-Step Engineering Method
H2: Illustrative Engineering Example
H2: Industrial Applications
H2: Common Mistakes and Limitations
H2: Frequently Asked Questions
H2: Related Engineering Resources
H2: References
H2: Review Information
H2: Engineering Disclaimer
```

### Required related links

```text
1 parent domain page
1 prerequisite/fundamental page
2 closely related engineering principle pages
1 related equipment page
1 related industrial process page
1 existing calculator or reference-data page, where available
```

---

# 3. Industrial Equipment Page Format

Use for boilers, pumps, fans, dampers, valves, gates, rotary air valves, double flap valves, conveyors, feeders, bag filters, ESPs, heat exchangers, and similar equipment.

```text
Breadcrumbs
H1: [Equipment Name]: Working Principle, Components, Types and Applications
Technical summary
Page-information strip
Table of contents

H2: What Is a [Equipment Name]?
H2: Purpose and Plant Location
H2: Working Principle
H2: Main Components and Their Functions
H3: Component 1
H3: Component 2
H3: Component 3
H2: Equipment Diagram
H2: Types and Configurations
H2: Main Operating Parameters
H2: Materials of Construction
H2: Selection Inputs and Engineering Considerations
H2: Installation and Process Interfaces
H2: Operation Fundamentals
H2: Common Problems, Failure Modes and Causes
H2: Inspection and Maintenance Basics
H2: Applications by Industry
H2: Frequently Asked Questions
H2: Related Engineering Resources
H2: References
H2: Review Information
H2: Engineering Disclaimer
```

### Required related links

```text
1 parent equipment-family page
1 engineering-principle page
2 related component/equipment pages
1 relevant industrial-process page
1 materials, gasket, hardware, or dimensional-data page where applicable
1 existing calculator where applicable
```

---

# 4. Industrial Process Page Format

Use for coal handling, boiler steam generation, FGD, ETP, cement manufacture, steelmaking, ash handling, RO/DM water, and other plant-process pages.

```text
Breadcrumbs
H1: [Process Name]: Process Flow, Equipment and Industrial Applications
Technical summary
Page-information strip
Table of contents

H2: What Is the [Process Name]?
H2: Process Purpose and Boundary
H2: Inputs, Outputs and By-products
H2: Simplified Process Flow Diagram
H2: Step-by-Step Process Description
H3: Process Step 1
H3: Process Step 2
H3: Process Step 3
H2: Major Equipment Used in the Process
H2: Key Operating Variables
H2: Utilities Required
H2: Instrumentation and Control Overview
H2: Emissions, Waste and By-product Handling
H2: Safety and Operating Limitations
H2: Common Process Problems and Basic Troubleshooting
H2: Applications by Industry
H2: Frequently Asked Questions
H2: Related Engineering Resources
H2: References
H2: Review Information
H2: Engineering Disclaimer
```

### Required related links

```text
1 parent process-family page
2 to 4 major equipment pages used in the process
2 related engineering-principle pages
1 relevant reference-data page
1 existing calculator or converter where available
1 upstream/downstream process page where relevant
```

---

# 5. Engineering Reference Data Page Format

Use for material properties, pipe schedules, plate thicknesses, rolled sections, hollow sections, gaskets, fasteners, and hardware.

```text
Breadcrumbs
H1: [Data Set Name]
Technical summary
Data-information strip
Table of contents

H2: What This Data Table Covers
H2: Source, Edition and Scope
H2: Important Limitations Before Use
H2: Filter and Selection Fields
H2: Main Reference Data Table
H2: Field Definitions and Units
H2: Data Conditions and Tolerances
H2: How to Use This Data
H2: Example Interpretation
H2: Related Engineering Applications
H2: Related Engineering Resources
H2: Source and Revision History
H2: Review Information
H2: Engineering Disclaimer
```

### Required related links

```text
1 parent data-category page
1 related material, equipment, or component data page
1 engineering-principle page explaining use of the data
1 equipment or process page where the data is applied
1 existing calculator where relevant
```

### Data-table requirements

- State unit system in every table heading.
- Identify standard designation and edition.
- State product form, material condition, and test temperature where relevant.
- Include a source/revision field on every dataset.
- Mark approximate or non-equivalent cross-reference data clearly.
- Never state that material grades are identical unless the source explicitly confirms it.

---

# 6. Domain and Category Landing Page Format

Use for Engineering, Thermal Engineering, Industrial Equipment, Conveying Systems, Industrial Processes, Power Generation Processes, and Reference Data categories.

```text
Breadcrumbs
H1: [Domain or Category Name]
Short description of the category
H2: What This Section Covers
H2: Key Subdomains
H2: Featured Knowledge Pages
H2: Featured Equipment or Processes
H2: Reference Data Available in This Section
H2: Existing Calculators and Converters
H2: Learning Path: Start Here
H2: Recently Updated Pages
```

Landing pages do not repeat full technical content from child pages. Their job is to guide the user to the right subject, equipment, process, or reference table.

---

# 7. Existing Engineering Calculator Page Format

No new calculator pages are planned. When an existing calculator is updated, use this format:

```text
Breadcrumbs
H1: [Calculator Name]
Short purpose statement
Calculation tool
Input definitions and units
Result definitions and units
Formula and calculation method
Assumptions and limitations
Illustrative use case
Related engineering knowledge pages
Related reference-data pages
References
Review information
Engineering disclaimer
```

Calculator pages must link to the explanatory knowledge page first. A calculator is a supporting tool, not a replacement for engineering understanding.

---

# 8. Existing Unit Converter Page Format

```text
Breadcrumbs
H1: [Unit Converter Name]
Short purpose statement
Converter tool
Supported units
Conversion basis and formula
Common industrial uses
Related engineering knowledge pages
References
Review information
Disclaimer
```

---

# 9. Related Engineering Resources - Required Link Block

Every technical page ends with this section before References:

```html
<section class="section related-resources">
  <h2>Related Engineering Resources</h2>
  <div class="grid">
    <!-- 5 to 8 approved, existing and directly relevant links only -->
  </div>
</section>
```

Use grouped link labels when more clarity is useful:

```text
Related Engineering Principles
Related Industrial Equipment
Related Industrial Processes
Related Reference Data
Related Calculator or Unit Converter
```

## Link-selection rules

- Minimum: 5 valid links for a substantial knowledge page when relevant pages exist.
- Maximum: 8 links in the main related-resources block.
- Include the direct parent category link on all Level 5 pages.
- Include only existing, approved pages.
- Use the final official page title as the link text.
- Do not create a link solely for keywords.
- Check all relative links before publishing.

---

# 10. References, review and disclaimer format

## References

Use this book-reference format:

```text
Author(s). Title. Edition. Publisher. Year.
```

Example:

```text
Incropera, F. P., DeWitt, D. P., Bergman, T. L. and Lavine, A. S.
Fundamentals of Heat and Mass Transfer. [Edition]. Wiley. [Year].
```

## Review information

```text
Content type: [type]
Last reviewed: [date]
Reference set reviewed: [book list/version]
```

## Engineering disclaimer

Use this standard wording unless the page requires a more specific warning:

```text
This page is provided for educational and preliminary engineering-reference purposes.
It does not replace project specifications, detailed design, manufacturer information,
applicable standards, safety requirements, or review by a qualified engineer.
Verify all values, assumptions and design decisions for the actual service conditions.
```

---

# 11. Mandatory pre-publication checklist

```text
[ ] Page follows the correct page-type template.
[ ] H1, title tag, canonical URL, breadcrumb, and structured data agree.
[ ] Technical content is original and book-referenced.
[ ] Equations contain defined symbols and units.
[ ] Assumptions and limitations are stated.
[ ] Required visuals are original and correctly labeled.
[ ] Related links are valid and relevant.
[ ] No link points to a missing page.
[ ] References use the approved format.
[ ] Review date is present.
[ ] Disclaimer is present where required.
[ ] Mobile layout and table readability are checked.
[ ] Shared SVG favicon is present: `assets/brand/industrial-calculation-hub-mark.svg`.
[ ] Home, About, Contact, Privacy, Disclaimer and Terms links are visible and valid.
[ ] Copyright notice uses the approved year and wording.
[ ] Content, diagrams, tables and images are original or have verified written licence/permission.
[ ] The page contains substantial publisher content; it is not a navigation-only, thin-content or ad-first page.
[ ] No ad placement can be mistaken for a menu, result, download, button or other navigation control.
[ ] Actual Privacy, cookie and consent disclosures are verified for the live site configuration before ads are enabled.
```
