# External Consultant Review: World Regional Geography Online Textbook

**Date:** 2026-01-21

## Executive Summary
The project has a strong foundation (clear chapter structure, clean baseline styling, interactive mapping intent). The highest-impact gaps are (1) accessibility compliance, (2) assessment consistency, and (3) maintainable front-end architecture. Addressing these first will improve learner experience immediately and reduce long-term development cost.

## What's Working Well
- Clear chapter organization and consistent “textbook” flow across `chapters/*/index.html`.
- Interactive intent is already present (maps, quizzes) and matches active-learning goals.
- A cohesive baseline theme exists in `css/style.css` (variables, spacing scale, reusable components).

## Priority Findings And Fixes

### 1) Accessibility And Inclusive Design (P0 - Critical)
**Primary risk:** Without WCAG 2.1 AA-level fixes, interactive elements can be unusable for keyboard and assistive-technology users.

**Observed issues to address:**
- **Contrast:** “Muted” text and figure captions can be borderline on light backgrounds.
- **Keyboard focus:** Interactive controls (quiz inputs, buttons, accordions, map controls) need visible focus states.
- **ARIA state:** Accordion toggles should expose `aria-expanded` and relationships via `aria-controls`.
- **Navigation:** Add a skip link and ensure heading hierarchy is not skipped (H1 -> H2 -> H3).

**Concrete implementation targets:**
- `css/style.css`: add strong `:focus-visible` styling and raise muted text contrast.
- `js/main.js`: set/update `aria-expanded` on accordions/toggles; ensure quiz feedback uses an `aria-live` region.
- `chapters/*/index.html`: add skip link + landmark structure; fix heading levels.

**Acceptance criteria (practical checks):**
- Tab navigation reaches all interactive elements; focus ring is always visible.
- Accordions announce expanded/collapsed state to screen readers.
- No skipped heading levels; one H1 per page.

### 2) Assessment Architecture And Alignment (P0 - Critical)
**Primary risk:** Chapter-to-chapter inconsistency undermines pedagogy and increases maintenance.

**Current pattern mismatch:**
- `chapters/01-introduction/quiz-data.json` is loaded dynamically via the shared quiz engine.
- `chapters/02-europe/index.html` (and potentially other chapters) include inline or chapter-specific quiz logic.

**Recommendations:**
- Standardize all chapters on `js/quiz-engine.js` and a per-chapter data file (either `chapters/<chapter>/quiz-data.json` or a centralized `data/` folder).
- Require every quiz question to reference a learning objective id (simple mapping) to keep alignment explicit.
- Expand beyond basic MCQ over time (T/F, matching), but start by unifying the “plumbing” first.

**Concrete implementation targets:**
- `js/quiz-engine.js`: support objective ids and display better failure states when data cannot load.
- `chapters/*/index.html`: remove inline quiz scripts; add a consistent quiz container and initialization attributes.

### 3) JavaScript Architecture And Error Handling (P0 - High)
**Primary risk:** A growing `js/main.js` becomes fragile and hard to extend.

**Issues:**
- Mixed responsibilities (navigation, accordions, maps, quizzes) in a single file.
- Global functions and inconsistent error reporting.

**Recommendations (incremental, low-risk):**
- Introduce a lightweight module structure (even if staying on plain JS + `defer`), separating concerns:
  - navigation
  - accordion/toggles
  - maps
  - quizzes
- Add user-visible error states for failed fetches (e.g., quiz data) rather than silent console-only errors.

**Concrete implementation targets:**
- `js/main.js`: refactor into small modules or at minimum grouped namespaces; add consistent error UI.
- `js/map-init.js`: consolidate chapter map initialization to avoid chapter-by-chapter divergence.

### 4) CSS DRY And Responsive Layout (P1 - Medium)
**Primary risk:** Inline styles and duplicated layout patterns will slow down future chapter development and cause mobile regressions.

**Issues:**
- Repeated inline styles for grids, cards, map containers.
- Fixed map heights reduce usability on small screens.

**Recommendations:**
- Create reusable component classes (e.g., `.profile-grid`, `.stat-card`, `.map-container`) in `css/style.css`.
- Move any repeated inline styles from chapter HTML into named classes.
- Use responsive constraints for `.interactive-map` (e.g., `min-height` + `aspect-ratio`).

### 5) Asset Management And Performance (P1 - Medium)
**Primary risk:** Slow loads and inconsistent image use reduce engagement.

**Recommendations:**
- Add native lazy loading on all non-critical images: `loading="lazy"`.
- Adopt a consistent image folder convention (even if migration happens later).
- Consider local fallbacks for critical CDN assets if offline/blocked environments matter.

**Concrete implementation targets:**
- `chapters/*/index.html`: add `loading="lazy"` for below-the-fold images.
- `img/` and `images/`: plan a consolidation path and metadata strategy.

### 6) Content Consistency And Chapter Completeness (P1 - Medium)
**Primary risk:** Learner experience varies per region.

**Recommendations:**
- Create a chapter checklist and use it to audit `chapters/03-russia/index.html` through `chapters/12-conclusion/index.html`.
- Ensure every chapter has:
  - learning objectives (including at least one higher-order objective)
  - a human geography section
  - a geographic inquiry/reflection prompt
  - a knowledge check using the same quiz system

### 7) Inclusive Representation (P1 - Medium)
**Recommendations:**
- Balance case studies to include Global South perspectives and Indigenous knowledge where relevant.
- Ensure “Important Person” spotlights represent diverse genders, regions of origin, and roles (community leaders and practitioners in addition to academics).

## Action Plan (Recommended)

### P0 (Do First - 1 to 2 work sessions)
- Accessibility baseline fixes: contrast, focus-visible, skip link, heading hierarchy, accordion aria.
- Consolidate quiz system across chapters using `js/quiz-engine.js` + per-chapter `quiz-data.json`.
- Add user-visible error states for failed async loads (quiz data; map resources).

### P1 (Next Sprint)
- Extract repeated inline styles into CSS component classes; improve responsive map containers.
- Add lazy loading for images; start media organization plan.
- Create `docs/CHAPTER_CHECKLIST.md` and run a chapter consistency audit.

### P2 (Future Work)
- Add additional assessment types (matching, drag/drop) and richer feedback.
- Add lightweight progress tracking (per chapter completion + quiz score summary stored locally).
- Add testing (at minimum: a small accessibility scan and a few critical UI flows).

## Notes On Browser Compatibility
This project can stay “modern evergreen browser” friendly (Chrome/Edge/Firefox/Safari current versions). If older browsers must be supported, explicitly document the support matrix and only then add polyfills/feature detection.
