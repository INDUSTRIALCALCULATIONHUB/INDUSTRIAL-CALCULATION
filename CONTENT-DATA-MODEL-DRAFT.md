# Industrial Calculation Hub — Shared Website and Mobile-App Content Data Model

**Status:** Draft — owner review and approval required before freezing  
**Purpose:** One controlled content source for the website and future mobile app  
**Scope:** Knowledge pages first. Existing calculators and unit converters are recorded only; no new calculator development is authorized by this document.

---

## 1. Decision being prepared

The website and mobile app will consume the same engineering-content records. A knowledge page is created once, reviewed once, and then presented appropriately on desktop, laptop, mobile web, and the mobile app.

The Master Page Register supplies the permanent `Content ID` and planning status. The future content repository becomes the publishing source. The spreadsheet remains the governance register; it is not the live application database.

```text
Frozen hierarchy + Master Page Register
                ↓
Shared content repository
                ↓
Website page renderer ────── Mobile-app API / offline reading package
                ↓                            ↓
Desktop, laptop and mobile web              Android / iOS app
```

## 2. Content-unit principle

Each published knowledge page is one **content item** with reusable, ordered content blocks. The same blocks can be displayed as a full web article or as an app reading screen without duplicating engineering text.

| Required field | Purpose |
|---|---|
| `content_id` | Permanent ID from the Master Page Register, for example `ICH-ENG-002` |
| `title` | Approved page title from the frozen hierarchy/register |
| `content_type` | Engineering knowledge, equipment, process, reference data, calculator, converter, or support |
| `hierarchy_path` | Approved parent path for navigation and breadcrumbs |
| `publication_status` | Draft, technical review, approved, published, retired |
| `web_route` | Canonical route after the URL standard is approved |
| `app_content_key` | Stable app/API key; independent of the displayed route |
| `summary` | Short professional explanation for listings, search and app cards |
| `content_blocks` | Ordered body sections, formulae, tables, illustrations, notes and FAQs |
| `references` | Fundamental-book references and specific chapter/page details where available |
| `related_content` | Verified internal related links selected before publication |
| `media_assets` | Diagrams, photographs, drawings and illustrations with alt text and rights data |
| `technical_review` | Reviewer, review status, date and technical notes |
| `revision` | Auditable version and publication history |

## 3. Core repository entities

The physical database can be selected later. These logical entities must be retained regardless of technology.

| Entity | Main role | Important fields |
|---|---|---|
| `content_items` | One record per website/app item | content ID, type, title, status, route, summary, parent ID, app key |
| `content_blocks` | Ordered reusable page sections | content ID, sequence, block type, heading, body, formula markup, table/data reference |
| `taxonomy_nodes` | Navigation and breadcrumbs | node ID, parent ID, level, approved label, sort order, active status |
| `content_taxonomy` | Links content items to taxonomy | content ID, taxonomy node ID, primary flag |
| `media_assets` | Image/diagram library | asset ID, file variants, alt text, caption, source, licence, visual role |
| `content_media` | Uses media on a particular page | content ID, asset ID, block/placement, caption override, sequence |
| `reference_sources` | Approved fundamental-book library | source ID, author, title, edition, publisher, year, ISBN, approval state |
| `content_references` | Exact sources used by an item | content ID, source ID, chapter/page/section, citation note |
| `related_links` | Audited internal linking | source content ID, target content ID, link purpose, sequence, verification status |
| `technical_reviews` | Engineering quality record | content ID, reviewer, role, status, review date, findings, approval reference |
| `content_revisions` | Change and publishing audit trail | content ID, version, change summary, author, timestamp, approval status |
| `reference_datasets` | Governed engineering-data libraries | dataset ID, title, standard/source, version, unit system, review status |
| `reference_records` | Individual engineering-data records | dataset ID, record key, properties, units, standard/grade, effective version |

## 4. Page block contract

`content_blocks` must support the frozen page-format standard. The initial block types are deliberately practical for engineering knowledge work.

| Block type | Use |
|---|---|
| `intro` | Definition, purpose, scope, limits and industrial context |
| `key_points` | Short, scannable engineering takeaways |
| `principle` | Theory, working principle, method or process explanation |
| `formula` | Equation, symbol definitions, unit convention, assumptions and limitations |
| `procedure` | Step-by-step engineering method or operating sequence |
| `diagram` | Labelled diagram, process-flow visual, equipment drawing or schematic |
| `data_table` | Controlled data, dimension table, material property table or comparison |
| `selection_guidance` | Engineering inputs, limits, selection factors and common mistakes |
| `safety_note` | Safety, code, operating or professional responsibility note |
| `faq` | Approved frequently asked questions |
| `references` | Book sources used in the page |
| `related_links` | Selected verified internal links |

The renderer chooses layout for each device. The stored engineering content and review record stay the same.

## 5. Visual and image rule

Every knowledge page and calculator/converter page must have a visual plan before publication. Each media asset must record:

- professional alt text and a short caption;
- asset type: diagram, photograph, drawing, chart, formula image or process-flow visual;
- source, creator/owner, licence or permission status;
- mobile-safe and desktop variants, where required;
- placement in the page and the explanatory purpose of the visual.

Visuals support engineering understanding; they do not replace technical explanation or cited source material.

## 6. Reference and review rule

Initial knowledge content must use fundamental books as the primary technical source base. Each content item is not publishable until it has:

1. a registered source-book set;
2. the frozen page-format sections required for its page type;
3. required visual assets and usable alt text;
4. checked internal related links;
5. technical-review status recorded; and
6. an approved publication status.

Standards, manufacturer documents and external web sources may be tracked later when separately approved; they do not replace the fundamental-book requirement for initial knowledge content.

## 7. Website and mobile-app delivery contract

The website and app both read a device-neutral representation.

| Delivery field | Website use | Mobile-app use |
|---|---|---|
| `content_id` / `app_content_key` | Page identity, analytics and edit traceability | API identity, local cache and offline synchronization |
| `title`, `summary`, taxonomy | Menus, cards, search and breadcrumbs | App lists, search, category views and reading progress |
| `content_blocks` | Responsive article rendering | Native article rendering and offline reading |
| `media_assets` | Responsive image placement | Device-appropriate image download/cache |
| `related_links` | On-page related section | “Continue learning” / related items |
| `revision` / `published_at` | Cache refresh and update notice | Sync and offline-package update |

## 8. Calculator and converter boundary

The existing calculator and converter pages must be represented in the repository as content items so their documentation, visuals, related links and review state can be controlled.

No new calculator, unit converter or CAD-development tool is authorized by this draft. A later, separate calculator model may add fields such as formula version, input schema, validation rules, unit conversion rules, calculation test cases and result explanation.

## 9. Recommended implementation phases

| Phase | Deliverable | Status at this stage |
|---|---|---|
| 1 | Freeze the Master Page Register and this data model | Pending owner approval |
| 2 | Approve URL/metadata/navigation standard and choose the physical database/API technology | Not started |
| 3 | Create the first knowledge pages as controlled content records | Not started |
| 4 | Publish the responsive website from the shared content source | Not started |
| 5 | Connect mobile-app reading, search and offline caching to the same source | Not started |
| 6 | Review existing calculators/converters and separately approve any calculator work | Not started |

## 10. Decisions requiring owner approval before freeze

1. Approve this logical data model as the shared website/mobile-app content contract.
2. Approve a separate URL, metadata and structured-data standard before assigning permanent canonical routes.
3. Select the physical database, authentication, hosting and API technology only when implementation is ready to begin.
4. Approve the formal source-book library and technical-review roles.
5. Approve treatment of the existing legacy pages that are not named in the frozen hierarchy.

---

**Non-change statement:** This document does not change the frozen sitemap, hierarchy, page-format standard, existing production pages, `style.css`, calculator scope, or CAD-tool scope.
