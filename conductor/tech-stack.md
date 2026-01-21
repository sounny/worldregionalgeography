# Tech Stack: World Regional Geography Interactive Textbook

## Frontend Core
- **Markup**: HTML5 (Semantic structure for OER accessibility).
- **Styling**: CSS3 (Custom minimalist styles, responsive design).
- **Scripting**: Vanilla JavaScript (ES6+) for UI interactivity and pedagogical components.

## Interactive & Multimedia
- **Mapping**: [LeafletJS](https://leafletjs.com/) with custom `js/map-init.js` module and `js/regions-data.js` for centralized GeoJSON management.
- **Data Visualizations**: [Chart.js](https://www.chartjs.org/) - Recommended for interactive, minimalist graphs and demographic charts.
- **Quizzes**: Custom `js/quiz-engine.js` module handling JSON-based question loading, scenario support, and client-side validation.

## Content & Assets
- **Content Source**: `references/` folder (Factual data) and `chapters/` (HTML structure).
- **Imagery**: Wikimedia Commons (high-resolution, open-license regional images).
- **Data Files**: GeoJSON (for maps) and JSON (for quiz questions/data viz).

## Deployment & Hosting
- **Platform**: Static Web Hosting (e.g., GitHub Pages).
- **Version Control**: Git.
