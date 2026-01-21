# Implementation Plan - Track: Standardize Chapter 01

## Phase 1: Structural Refactoring & Styling
- [x] Task: Create specific CSS variables for "Gold Standard" theme (colors, spacing) in `css/style.css`. 7e0bd3e
- [x] Task: Refactor `chapters/01-introduction/index.html` to match the 10-point semantic structure (Objectives through Quiz). 21ff1f3
- [x] Task: Implement responsive grid layout for Sidebars ("Important Person") and Main Content. e96f755
- [~] Task: Implement "Texas Connection" toggle UI and CSS styling.
- [ ] Task: Implement "Accordion" UI and CSS styling for Summary and Glossary.
- [ ] Task: Conductor - User Manual Verification 'Structural Refactoring & Styling' (Protocol in workflow.md)

## Phase 2: Interactive Map Implementation
- [ ] Task: Create `js/map-init.js` module to handle Leaflet initialization.
- [ ] Task: Define a basic GeoJSON dataset for "World Regions" (Introduction context).
- [ ] Task: Integrate the Leaflet map into the `chapters/01-introduction/index.html` "Interactive Map" section.
- [ ] Task: Add layer control to toggle between "Physical" (TileLayer) and "Political" (GeoJSON) views.
- [ ] Task: Conductor - User Manual Verification 'Interactive Map Implementation' (Protocol in workflow.md)

## Phase 3: Pedagogical Logic (Quiz & Interactivity)
- [ ] Task: Create `js/quiz-engine.js` module for simple client-side validation.
- [ ] Task: Define 5 introductory quiz questions in a JSON structure (embedded or external).
- [ ] Task: wire up the "Texas Connection" toggle button event listener.
- [ ] Task: Wire up the Summary/Glossary accordion event listeners.
- [ ] Task: Conductor - User Manual Verification 'Pedagogical Logic' (Protocol in workflow.md)

## Phase 4: Content Population & Polish
- [ ] Task: Review `references/` (if any) or standard geographic sources to populate the "Regional Profile" data.
- [ ] Task: Write the "Texas Connection" content (e.g., Texas's place in the world).
- [ ] Task: Source and embed 1-2 Wikimedia Commons images for the "Important Person" and "Case Study".
- [ ] Task: Final polish of typography (check for em-dashes, quote styles).
- [ ] Task: Conductor - User Manual Verification 'Content Population & Polish' (Protocol in workflow.md)
