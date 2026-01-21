# World Regional Geography - Online Textbook

**I am GitHub Copilot, your external consultant.** I provide pedagogical guidance, code quality reviews, and technical architecture recommendations. I'll help coordinate work across multiple agents and ensure this OER maintains high standards for teaching and learning.

---

To create an engaging, brand-neutral, and pedagogically-rich online textbook for World Regional Geography that empowers students globally to understand the complex interconnections between physical landscapes, cultural systems, and human-environment interactions.

### Content Neutrality Directive (CRITICAL)

- **Generic Purpose**: This is a universal digital textbook for broad use across multiple institutions.
- **No Branding**: Do **NOT** use university branding or color schemes/logos specific to any single institution.
- **No TSU Reference**: Do **NOT** mention "Texas Southern University" or "TSU" anywhere in the content of this textbook. All institution-specific materials (grading, assignments, local policies) must be kept in the internal workspace (`G:\My Drive\0-TSU\WorldRegionalGeography-Internal`).
- **Monetization Ready**: Structure content to integrate seamlessly with YouTube video embedded content for broad educational reach.
- **Live Textbook**: [https://sounny.github.io/worldregionalgeography/](https://sounny.github.io/worldregionalgeography/)

---

## Core Pedagogical Principles

### 1. Active Learning

- Interactive maps and geospatial tools
- Self-assessment quizzes embedded throughout chapters
- Case study analyses with guided questions
- Virtual field experiences

### 2. Scaffolded Learning

- Clear learning objectives at the start of each chapter
- Building from foundational concepts to complex regional analyses
- Progressive skill development in geographic thinking
- Cumulative knowledge checks

### 3. Multimodal Content Delivery

- Rich visual media (maps, charts, photographs, diagrams)
- Video content for dynamic processes and cultural contexts
- Interactive data visualizations
- Audio content for accessibility

### 4. Real-World Connections

- Current events integration
- Data-driven explorations using real geographic datasets
- Case studies featuring contemporary issues
- Connections to student lives and local geography

### 5. Inclusive and Diverse Perspectives

- Multiple cultural viewpoints represented
- Indigenous geographic knowledge included
- Balanced representation of regions and peoples
- Accessibility features for all learners

### 6. Assessment for Learning

- Formative assessments throughout each chapter
- Reflective journaling prompts
- Collaborative learning activities
- Portfolio-based summative assessments

---

## Design Standards (RSGEE Theme)

To maintain consistency with the user's existing work (Remote Sensing with GEE):

- **Typography**: System font stack only. No external font files (Merriweather/Open Sans).
- **Color Palette**:
  - Primary: `#4A90A4` (Teal)
  - Background: `#F5F5F5` (Light Gray)
  - Text: `#333333` (Dark Gray)
- **Callout Styles**:
  - _Learning Objectives_: Green background (`#e6f4ea`) with dark green left border.
  - _Key Terms/Notes_: Yellow background (`#fef7e0`) with orange left border.
  - _Info/Case Studies_: Blue background (`#e8f0fe`) with dark blue left border.
- **Layout**: Clean, minimalist, white cards on gray background.

---

## Development Status & Roadmap

### Current Status

- **Core Framework**: ✅ HTML/CSS/JS Structure established
- **Homepage (Public)**: ✅ High-aesthetic "Coming Soon" page active
- **Homepage (Dev)**: 🚧 Interactive Map Navigator (Leaflet Integration)
- **Chapter 1 (Introduction)**: ✅ Content, Key Terms, Quiz, and Map integration active
- **Chapters 2-12**: 📅 See Detailed Roadmap in `development_plan.md`
- **Syllabus**: ✅ Complete Spring 2026 schedule created
- **Canvas Structure**: ✅ Folders created

### Textbook Regional Roadmap

1. **Chapter 1**: Introduction to World Regional Geography
2. **Chapter 2**: Europe
3. **Chapter 4**: North America
4. **Chapter 5**: Latin America & the Caribbean
5. **Chapter 6**: Sub-Saharan Africa
6. **Chapter 7**: North Africa & Southwest Asia (Middle East)
7. **Chapter 8**: South Asia
8. **Chapter 9**: East Asia
9. **Chapter 10**: Southeast Asia
10. **Chapter 11**: Australia & Oceania
11. **Chapter 12**: Global Connections & Synthesis
    (Note: Chapter numbering aligns with internal course mapping)

### Completed Tasks

- [x] **Homepage Cleanup**: Created "Coming Soon" landing page and moved main site to `index-dev.html`
- [x] **Syllabus**: 15-week schedule mapped to 12 chapters
- [x] **Quiz 1**: Introduction quiz (15 questions, auto-graded)
- [x] **Discussion 1**: Place and Identity prompt
- [x] **Midterm Outline**: Structure and sample questions
- [x] **Canvas folders**: assignments, exams, discussions with READMEs

### Immediate Tasks (Pre-Semester)

- [ ] **Interactive Navigator**: Replace static region grid on `index-dev.html` with a clickable Leaflet map.
- [ ] **Chapter 2 (Europe)**:
  - [ ] Script Video Lecture (in `/lectures`)
  - [ ] Build Template (Learning Objectives, Regional Profile, Case Study)
- [ ] **Global Resources**: Verify bibliography and external links

---

## Active Workspaces

- **Source Code**: `c:\Users\sounn\Git\worldregionalgeography`
- **Asset Management**: `img/` (Needs organization) & Leaflet Maps
- **Lectures (Private)**: `/lectures` (Ignored by Git)

## Project Team

- **Lead Author**: Dr. Sounny (Professor of Geography)
- **AI Teaching Assistant**: Gemini (Development & Content Support)
- **External Consultant**: GitHub Copilot (Pedagogical & Technical Review)

---

## 🔍 External Consultant Introduction (GitHub Copilot)

Hello, fellow agents! I am **GitHub Copilot**, serving as an **external consultant** for this project. I've completed a comprehensive review of the World Regional Geography textbook and have documented detailed findings in **`external_review_copilot.md`**.

### What I've Done

I conducted a full assessment across four domains:
1. **Pedagogical Issues** - Learning design, assessment, engagement
2. **Technical Issues** - Code quality, architecture, maintainability  
3. **Content Issues** - Chapter consistency, completeness, media
4. **Enhancement Opportunities** - Accessibility, performance, UX

### Key Findings Summary

**What's Working Well ✓**
- Strong pedagogical structure and design intent
- Excellent regional framework and chapter organization
- Good use of interactive maps and local connections
- Clean, minimalist aesthetic

**Critical Gaps 🔴**
- **Accessibility compliance** (WCAG violations - legal priority)
- **Inconsistent quiz systems** (Ch1 vs Ch2 different approaches)
- **Code scattered** (JavaScript needs modularity, CSS has DRY violations)
- **Assessment depth** (mostly lower-order thinking, missing Bloom's L4-L6)

**Quick Wins to Boost Engagement 💡**
- Add progress tracking visualization
- Create geographic inquiry boxes for all chapters
- Implement interactive data visualizations (Chart.js)
- Add reflection prompts and discussion scaffolds

### Priority Work for Other Agents

I've created a detailed action plan in `external_review_copilot.md`:

**P0 - IMMEDIATE (12-18 hours):**
- [ ] Accessibility audit & fixes (contrast, focus, skip links, heading hierarchy)
- [ ] Consolidate quiz system (standardize Ch2 to Ch1 approach)
- [ ] Refactor JavaScript architecture (create modules, remove globals)
- [ ] Extract CSS to classes (DRY principle, mobile responsiveness)

**P1 - SHORT TERM (next sprint):**
- [ ] Create unified assessment rubric & enhance quizzes
- [ ] Revise learning objectives (add Bloom's L4-L6)
- [ ] Chapter standardization (audit all 12, add missing components)
- [ ] Engagement elements (progress tracking, inquiry boxes)

**P2 - MEDIUM TERM (future work):**
- [ ] Interactive visualizations with Chart.js
- [ ] Setup testing framework (Jest, Cypress, Axe)
- [ ] Video & multimedia integration
- [ ] Collaborative features (discussions, annotations)

### Files to Consult

- **`external_review_copilot.md`** - Full detailed review (10 sections, prioritized recommendations)
- **`conductor/product-guidelines.md`** - Design & pedagogical standards
- **`development_plan.md`** - Chapter roadmap and milestones

### How to Use This Review

1. **Start with P0 items** - These are blockers for scaling and quality
2. **Work in parallel** - Multiple agents can tackle P0 items simultaneously
3. **Reference specifics** - Each issue includes file paths, current code, and recommended solutions
4. **Track progress** - Update this file as agents complete work

### Questions for Coordination

Other agents should:
- Refer to `external_review_copilot.md` for detailed context
- Coordinate on P0 items (accessibility + code refactoring)
- Update progress in conductor/plan.md
- Flag any technical blockers early

---

## TA Requirements (Inbox)

To proceed with Chapter 2 and beyond, I need:

1. **Course Calendar/Syllabus**: To prioritize development order.
2. **Lecture Notes/Content Drafts**: For the next region (Europe).
3. **Map Data**: Specific layers or datasets you want visualized for Europe.
