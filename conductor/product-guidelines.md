# Product Guidelines: World Regional Geography Interactive Textbook

## 1. Editorial Voice & Prose Style
- **Tone**: Academic and Formal. The prose should maintain a professional, objective, and authoritative voice suitable for a university-level audience.
- **Language**: Use precise geographic terminology. Avoid overly colloquial language while maintaining clarity.
- **Dashes**: Strictly avoid em-dashes (`—`). Use regular hyphens (`-`) or spaced en-dashes (` - `) as per the project's style guidelines.

## 2. Visual Design & UI/UX Principles
- **Aesthetic**: Clean and Minimalist. Prioritize ample whitespace, high-quality typography, and a limited color palette to minimize cognitive load and focus attention on the core geographic content.
- **Navigation**: Consistent header with a dropdown menu for chapters. Mobile-responsive "hamburger" menu for smaller screens.

## 3. Pedagogical Component Layout
- **"Important Person" & Case Studies**: Integrated as Marginalia or Sidebars. These elements should be floated to the side (on desktop) or interspersed strategically (on mobile) to complement the main narrative without creating disruptive vertical breaks.
- **Texas Connections**: Integrated as Interactive Toggles. These call-outs should be hidden behind a "Local Connection" button/icon to keep the primary focus on the global region while providing immediate access to local relevance.
- **Chapter Summary Tools**: Use Interactive Accordions for the "Summary of Big Ideas," "Glossary of Terms," and potentially the "Knowledge Check" instructions. This keeps the footer area organized and allows students to expand only the review material they need.

## 4. Media & Asset Standards
- **Maps**: Must be LeafletJS-based. Map controls should be responsive and include layer controls.
- **Images**: Prioritize Wikimedia Commons. All images must include alt-text for accessibility and appropriate attribution in the footer or via a tooltip.
- **Graphics**: Interactive graphs (via Chart.js or similar) should match the minimalist aesthetic—simple lines, clear legends, and accessible color schemes.

## 5. Structural Consistency
- Every chapter must follow the exact same structural template:
    1. Learning Objectives
    2. Regional Profile
    3. Interactive Map
    4. Physical Geography Analysis
    5. Human Geography Analysis
    6. "Important Person" Sidebar
    7. "Texas Connection" Toggle
    8. Case Study
    9. Interactive Accordions (Summary & Glossary)
    10. Knowledge Check (Quiz)
