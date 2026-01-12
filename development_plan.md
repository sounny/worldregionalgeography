# World Regional Geography - Development Plan

This document outlines the strategic plan for developing the "World Regional Geography" interactive online textbook, prioritizing pedagogical best practices and an engaging "Regional First" user experience.

## 1. Pedagogical Foundations

Inspired by modern geographic education and the user's course plan, each chapter will follow a standardized, scaffolded structure:

### Chapter Template Structure

1. **Learning Objectives**: 3-5 measurable outcomes based on Texas Core Curriculum standards.
2. **Regional Profile (Snapshot)**: At-a-glance facts, statistics, and a "sense of place" introduction.
3. **Interactive Regional Map**: A LeafletJS-based map featuring key layers (Physiographic, Political, Thematic).
4. **Physical Geography**: Climate, topography, and biogeography of the region.
5. **Human Geography**: Cultural landscapes, population patterns, and economic systems.
6. **Global Theme Integration**: Each region is paired with a cross-cutting global issue (e.g., Europe & Migration, Russia & Geopolitics).
7. **Texas Connection**: A "Local to Global" sidebar grounded in Texas-based examples.
8. **Case Study**: Deep dive into a specific regional conflict or success story.
9. **Lecture & Video**: Embedded YouTube playlist and "Lecture Mode" transcript (private development in `/lectures`).
10. **Knowledge Check**: Embedded auto-graded quiz.

---

## 2. Interactive Map Navigator (Dev Home)

Instead of a static grid, the `index-dev.html` will feature a **Global Interactive Navigator**:

- **Implementation**: LeafletJS with a custom GeoJSON layer.
- **Functionality**:
  - Hovering over a region highlights it and shows a "Regional Summary" tooltip.
  - Clicking a region takes the student directly to that chapter.
  - Regions will be color-coded based on the primary global theme (Sustainability, Conflict, Development).

---

## 3. Chapter Outline & Roadmap

| Chapter | Region                    | Primary Global Theme           | Texas Connection         | Status     |
| :------ | :------------------------ | :----------------------------- | :----------------------- | :--------- |
| **01**  | **Introduction**          | Foundations & Spatial Thinking | Geographic Lens in TX    | ✅ Active  |
| **02**  | **Europe**                | Migration & Identity           | Heritage & Colonial ties | 🚧 Draft   |
| **03**  | **Russia & Central Asia** | Geopolitics & Energy           | Energy Politics          | 📅 Pending |
| **04**  | **North America**         | Urbanization & Diversity       | Urban Growth in TX       | 📅 Pending |
| **05**  | **Latin America**         | Biodiversity & Inequality      | Borderlands context      | 📅 Pending |
| **06**  | **Sub-Saharan Africa**    | Development & Global Links     | Global Health ties       | 📅 Pending |
| **07**  | **N. Africa & SW Asia**   | Water & Conflict               | Water Management         | 📅 Pending |
| **08**  | **South Asia**            | Population & Climate           | Flood Resilience         | 📅 Pending |
| **09**  | **East Asia**             | Industrialization & Growth     | Global Trade links       | 📅 Pending |
| **10**  | **Southeast Asia**        | Globalization & Tourism        | Maritime Trade           | 📅 Pending |
| **11**  | **Australia & Oceania**   | Island Geography & Risk        | Coastal Resilience       | 📅 Pending |
| **12**  | **Conclusion**            | Global Connections             | Texas in the World       | 📅 Pending |

---

## 4. Lecture & YouTube Workflow

Lectures will be developed in the private `/lectures` folder (ignored by Git):

- **Scripting**: Draft each page's content as a video script.
- **Recording**: Record segments for YouTube and embed them in the "multimodal" section of each page.
- **Lecture Mode**: A toggle on the textbook page that switches the view to a "script-friendly" format for instructors or visually impaired students.

---

## 5. Development Milestones

1. **Phase 1 (Navigator)**: Implement the Leaflet-based interactive global navigator on `index-dev.html`.
2. **Phase 2 (Chapter 2 - Prototype)**: Build out Chapter 2 (Europe) as the "Gold Standard" template.
3. **Phase 3 (Content Sprint)**: Develop Chapters 3-6 (Midterm range).
4. **Phase 4 (Thematic Synthesis)**: Refine Chapters 11-12 to tie the semester together.
