# Industrial Calculation Hub — Global Navigation and URL Standard

**Status:** Draft — owner approval required before freezing  
**Purpose:** Keep navigation, page identity, links and future URLs consistent across desktop, mobile web and the future app.  
**Non-change statement:** This document does not assign or change canonical URLs, alter the frozen sitemap, rename pages, or authorize new pages.

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
| New domain landing pages | Do not create a public route until its page, URL and metadata are approved together. |
| New knowledge pages | Use the Master Page Register content ID and wait for the URL standard decision before assigning a canonical route. |
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

## 7. Approval required before the next routing action

The owner must approve the permanent URL pattern, whether legacy `.html` pages will migrate, and the redirect approach before any domain landing page or new knowledge-page route is created.
