# Master Page Register — Canonical Content and Duplicate-Risk Audit

## Status

**Audit date:** 25 August 2026  
**Scope:** Read-only review of `outputs/master-page-register/MASTER-PAGE-REGISTER.xlsx`, current published knowledge assets and the owner-approved two-level public-navigation policy.  
**Change authority:** This report does not change the frozen sitemap, Master Page Register, current URLs, page titles or routes. It records audit findings and the decisions required before further final knowledge pages are created.

## 1. Audit result summary

| Check | Result | Required control |
|---|---:|---|
| Controlled records in the register | 328 | Keep the workbook draft until canonical fields and decisions are reviewed. |
| Knowledge/data records | 295 | Each needs one canonical content owner before publication. |
| Exact duplicate final titles | 0 | No exact-title merge is currently required. |
| Similar-title pairs flagged by automated screening | 64 | These are review candidates, not confirmed duplicates; most are intentionally different equipment, process or data records. |
| Existing knowledge assets directly mapped in the register | 10 of 15 | Retain their mapped record as the current canonical owner, subject to later content-format audit. |
| Existing knowledge assets without a direct canonical register mapping | 5 | Owner decision is required before they are promoted or reworked. |
| Current Level 3/4 landing pages | 18 | Retain as optional contextual routes; do not use them as required public-navigation steps. |

The register contains no exact duplicate page title. The principal risk is **near-duplicate scope**: the same industrial subject can appear correctly as an engineering principle, equipment guide, process page and reference-data record. These must be related through cross-listing, not copied into separate general-purpose articles.

## 2. Canonical-content rule applied by this audit

For every subject, select one canonical page with one Content ID and canonical public URL. The page may appear in more than one Level 1 or Level 2 collection through curated cards, related resources and search results.

| Page role | Canonical responsibility | Cross-listing use |
|---|---|---|
| Engineering principle | Explains governing concepts, formulae, assumptions and limitations. | Link from related equipment, processes and reference data. |
| Equipment guide | Explains a physical item, components, operation, selection inputs and interfaces. | Link from engineering principles and the processes using the item. |
| Process guide | Explains plant boundary, inputs/outputs, process flow, equipment and utilities. | Link from its major equipment and principles. |
| Reference-data record | Supplies controlled, sourced data with revision, conditions and limitations. | Link from applicable engineering, equipment and process pages. |

This role distinction resolves most apparent similarity without creating duplicate final content.

## 3. Existing knowledge assets — canonical mapping audit

### 3.1 Directly mapped existing assets — retain as current canonical owner

| Content ID | Existing page | Register title |
|---|---|---|
| ICH-ENG-002 | `air-density-explained.html` | Air Density: Formula, Factors and Industrial Use |
| ICH-ENG-005 | `reynolds-number-explained.html` | Reynolds Number: Laminar and Turbulent Flow |
| ICH-ENG-006 | `bernoulli-equation-explained.html` | Bernoulli Equation: Principle and Applications |
| ICH-ENG-008 | `pipe-flow-basics.html` | Pipe Flow Rate, Velocity and Diameter |
| ICH-ENG-015 | `pump-power-basics.html` | Pump Power and Motor Selection Basics |
| ICH-ENG-017 | `duct-flow-rate-explained.html` | Duct Flow Rate, Velocity and Area |
| ICH-ENG-019 | `heat-conduction-explained.html` | Heat Conduction: Principles, Formula and Industrial Applications |
| ICH-ENG-023 | `thermal-expansion-explained.html` | Thermal Expansion of Solids and Piping |
| ICH-ENG-027 | `boiler-efficiency-explained.html` | Boiler Efficiency and Heat Losses |
| ICH-ENG-033 | `pressure-vessel-design-basics.html` | Pressure Vessel Design Basics |

These pages need the staged content-format and technical-review audit already recorded in the register, but they do not need duplicate replacements.

### 3.2 Existing assets requiring an owner-approved canonical decision

| Existing page | Audit finding | Recommended action before rework |
|---|---|---|
| `bag-filter.html` | Matches the scope of ICH-ENG-086, **Bag Filter: Working Principle and Components**. Related Industrial Equipment and process records have different roles. | Assign ICH-ENG-086 as the canonical engineering guide; cross-link equipment components and process pages. |
| `electrostatic-precipitator.html` | Matches the scope of ICH-ENG-085, **Electrostatic Precipitator: Working Principle and Components**. The Industrial Equipment record is component-specific. | Assign ICH-ENG-085 as the canonical engineering guide; cross-link the component and process records. |
| `air-pollution-control-systems.html` | No direct final-page record with the same scope is currently mapped in the register. | Keep as a legacy overview until the owner approves its canonical register placement or retirement. Do not create another general overview page. |
| `esp-vs-bag-filter.html` | No direct comparison-page record is currently mapped in the register. | Keep as a legacy comparison page pending owner approval for a comparison-page record or retirement. Do not duplicate the ESP and Bag Filter guides. |
| `heat-transfer-explained.html` | The register has final records for conduction, convection and overall coefficient, but not a mapped Heat Transfer overview final page. | Keep as a legacy overview pending owner decision. It may cross-link the specific principle pages but must not duplicate them. |

## 4. Similar-title screening — review findings

The automated screen found 64 title pairs with shared terms. They are not automatically duplicates. The following are the important controls.

| Candidate relationship | Audit conclusion | Canonical/cross-link direction |
|---|---|---|
| Carbon Steel Grades vs Carbon Steel Pipe Grades | Different scope: general material grades versus pipe-product grades. | Retain separate controlled reference records; cross-link material grade to pipe-grade applications. |
| Bottom Ash Handling System vs Bottom Ash Handling Process | Different role: equipment/system guide versus plant process. | Retain both; process page links to system guide. |
| Fly Ash Handling System vs Fly Ash Handling Process | Different role: equipment/system guide versus plant process. | Retain both; process page links to system guide. |
| Fuel Oil and Gas Firing System vs Industrial Fuel Supply Process | Different role: equipment/firing interface versus process boundary. | Retain both; cross-link bidirectionally. |
| Refractory and Insulation Materials: Types and Applications vs Refractory and Insulation Materials: Properties and Applications | High-risk scope overlap across Engineering and Reference Data. | Owner decision required: designate the reference-data record as the controlled properties source and limit the Engineering page to material-selection principles, or consolidate to one canonical page. |
| Bag Filter / ESP engineering, equipment and process records | Different role, but high risk of copied explanation. | Use one primary engineering explanation, component-only equipment pages and process-specific application pages; cross-link instead of repeating working-principle text. |
| Plate, sheet, bar, rolled-section and hollow-section tables | Related data families rather than duplicates. | Keep separate tables because their dimensional basis and controlled sources differ; cross-link from the family landing page. |

## 5. Two-level public-navigation treatment of current Level 3/4 pages

Public navigation exposes only Level 1 and Level 2. The following already-created routes are retained, but become optional contextual routes reachable from search, full breadcrumbs, related resources and direct links—not mandatory public-menu steps.

### Engineering

- Fluid Properties — Level 3 contextual collection
- Density and Specific Gravity — Level 4 contextual collection

### Engineering Reference Data

- Ferrous Metals
- Non-Ferrous Metals
- Non-Metallic Materials
- Material Properties
- Standards Directory
- Plates and Sheets
- Bars and Rods
- Wire
- Pipes
- Tubes
- Piping Components
- Rolled Sections
- Hollow Sections
- Gaskets and Seals
- Fasteners and Hardware
- Welding Consumables

No route is to be deleted, renamed or redirected as part of this audit. The later two-level public-navigation implementation will present final pages directly from the relevant Level 2 collection while preserving these routes for context and discovery.

## 6. Required Master Page Register fields before the next final page

Before another final knowledge page is created, add or complete the following review fields in the draft register. This is a workbook update for a separate owner-approved step.

```text
Canonical Content ID
Canonical public URL
Content role: Engineering principle | Equipment guide | Process guide | Reference data
Primary Level 1 and Level 2 collection
Cross-listed Level 1 and Level 2 collections
Duplicate-risk status: Clear | Related but distinct | Consolidate | Owner decision required
Existing-asset disposition: Canonical | Upgrade in place | Legacy overview | Retire only with approval
```

## 7. Recommended next action

Obtain owner decisions for the five unmapped legacy knowledge assets and the Refractory/Insulation overlap. Then update the draft Master Page Register with the canonical and cross-listing fields before implementing two-level public navigation or producing the next final knowledge page.

## 8. Draft Register implementation — 25 August 2026

The draft workbook is now **Draft 2**. A new `Canonical Review` worksheet provides a one-to-one review record for all 328 controlled records without changing the existing Page Register rows.

It adds these control fields:

- Canonical Content ID
- Canonical Public URL
- Content Role
- Primary Level 1 / Level 2 Collection
- Cross-listed Collections
- Duplicate-risk Status
- Existing-asset Disposition
- Review Note

The Content ID, title, observed/proposed route and primary collection are formula-linked to the Page Register. Ten directly mapped existing knowledge assets are marked **Upgrade in place**. The five unmapped legacy knowledge assets, the legacy utility explanation, and the two Refractory/Insulation records remain visibly marked **Owner decision required** where applicable.

This Draft 2 implementation does **not** change a sitemap node, hierarchy level, public URL, page title, existing asset, production HTML or production CSS. The owner decisions in Sections 3.2 and 4 remain required before those subjects are promoted, reworked, consolidated or retired.
