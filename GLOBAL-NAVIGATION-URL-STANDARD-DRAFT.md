# Industrial Calculation Hub — Global Navigation and URL Standard

**Status:** Draft — Level 1 and Level 2 route patterns approved; the first Level 2 page is implemented
**Purpose:** Keep navigation, page identity, links and future URLs consistent across desktop, mobile web and the future app.  
**Non-change statement:** This document records the approved Level 1 routes below. It does not alter the frozen sitemap, rename hierarchy pages, or authorize any lower-level route.

## 1. Implemented visual-header navigation baseline

The owner-selected portal header uses the following compact visual navigation:

```text
Home
Tools
Learn
Reference Data
About
```

`Learn` links to the engineering-knowledge section and `Tools` to existing calculators and converters. The four frozen primary domains remain visible as separate homepage cards: Engineering, Industrial Equipment, Industrial Processes and Engineering Reference Data. This visual navigation change does not change the frozen sitemap, hierarchy, page names or current URLs.

## 2. Universal support navigation

Every public page must display these visible, valid support links in its footer:

```text
Home | About | Contact | Privacy | Disclaimer | Terms
```

The legal/support links are separate from engineering-topic navigation and are always available on desktop, laptop and mobile layouts.

## 3. Brand and favicon rule

- The single replaceable source file is `assets/brand/industrial-calculation-hub-mark.svg`.
- All public HTML pages use that file as their SVG favicon.
- The visual mark is paired with real text, `Industrial Calculation Hub`, in the approved homepage header so the site name is readable and accessible.
- Replacing the one SVG file updates the favicon source for all pages. Any future replacement must preserve an original or properly licensed design.

## 4. Current-route and future-route rule

| Route type | Current rule |
|---|---|
| Existing public pages | Retain their current `.html` URLs until the owner approves a migration plan. |
| New domain landing pages | The four approved Level 1 pages use the permanent routes listed below. Any additional landing-page route requires approval before creation. |
| New Level 2 landing pages | Use the approved nested route template below. The directory name is the approved lowercase, hyphenated Level 2 slug. |
| New knowledge pages (Levels 3–5) | Use the Master Page Register content ID and wait for the lower-level URL decision before assigning a canonical route. |
| Redirects | Do not add redirects, rename files or change canonicals without owner approval and a verified redirect map. |
| Calculators/converters | Keep existing URLs; no new calculator or converter route is created by this standard. |

## 5. URL decision checklist for each future public page

```text
[ ] Page is approved in the frozen hierarchy and Master Page Register.
[ ] Official page title is approved.
[ ] Parent landing page route exists and is approved.
[ ] Proposed route is short, lowercase and uses hyphens only.
[ ] Canonical, navigation link, breadcrumb, Open Graph URL and structured data agree.
[ ] Any affected legacy URL has a documented redirect decision.
[ ] Internal-link check has passed after the route is created.
```

## 6. Mobile and app navigation rule

- Mobile web uses the same primary-domain order as desktop; the menu collapses without dropping legal/support links.
- The future app uses the same `Content ID`, `App Content Key` and taxonomy path from the Master Page Register and shared content model.
- App tabs may group content for reading, tools, search and saved pages, but do not create a second content hierarchy.

## 7. Approved Level 1 routes

| Level 1 domain | Approved public route |
|---|---|
| Engineering | `engineering.html` |
| Industrial Equipment | `industrial-equipment.html` |
| Industrial Processes | `industrial-processes.html` |
| Engineering Reference Data | `engineering-reference-data.html` |

These pages are linked from the four homepage domain cards. Existing URLs remain unchanged and no redirects are required.

## 8. Approved Level 2 route pattern

```text
/{level-1-domain-slug}/{level-2-group-slug}/
```

Examples:

```text
/engineering/fluid-mechanics-piping-pumps-fans-ducts/
/industrial-equipment/conveying-systems/
/industrial-processes/power-generation-processes/
/engineering-reference-data/pipes-tubes-fittings-flanges/
```

The first implemented Level 2 page is `/engineering/fluid-mechanics-piping-pumps-fans-ducts/`. Its canonical URL, breadcrumb and app content path use the same approved taxonomy.

## 9. Approval required before the next routing action

The owner must approve the permanent URL pattern for Levels 3–5, whether legacy `.html` pages will migrate, and the redirect approach before any lower-level knowledge-page route is created.
