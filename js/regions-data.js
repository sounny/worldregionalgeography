/**
 * World Regional Geography - Regional GeoJSON Data
 * Contains simplified boundaries for the world regions studied in the textbook.
 */

const RegionalData = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            id: "europe",
            properties: { name: "Europe", chapter: "../02-europe/index.html" },
            geometry: {
                type: "Polygon",
                coordinates: [[[-10, 35], [40, 35], [40, 70], [-10, 70], [-10, 35]]]
            }
        },
        {
            type: "Feature",
            id: "russia",
            properties: { name: "Russia & Central Asia", chapter: "../03-russia/index.html" },
            geometry: {
                type: "Polygon",
                coordinates: [[[40, 40], [180, 40], [180, 75], [40, 75], [40, 40]]]
            }
        },
        {
            type: "Feature",
            id: "north-america",
            properties: { name: "North America", chapter: "../04-north-america/index.html" },
            geometry: {
                type: "Polygon",
                coordinates: [[[-170, 15], [-50, 15], [-50, 75], [-170, 75], [-170, 15]]]
            }
        },
        {
            type: "Feature",
            id: "latin-america",
            properties: { name: "Latin America", chapter: "../05-latin-america/index.html" },
            geometry: {
                type: "Polygon",
                coordinates: [[[-120, -55], [-35, -55], [-35, 30], [-120, 30], [-120, -55]]]
            }
        },
        {
            type: "Feature",
            id: "africa-sub",
            properties: { name: "Sub-Saharan Africa", chapter: "../06-sub-saharan-africa/index.html" },
            geometry: {
                type: "Polygon",
                coordinates: [[[-20, -35], [50, -35], [50, 20], [-20, 20], [-20, -35]]]
            }
        },
        {
            type: "Feature",
            id: "mena",
            properties: { name: "North Africa & SW Asia", chapter: "../07-north-africa-sw-asia/index.html" },
            geometry: {
                type: "Polygon",
                coordinates: [[[-20, 10], [75, 10], [75, 45], [-20, 45], [-20, 10]]]
            }
        },
        {
            type: "Feature",
            id: "south-asia",
            properties: { name: "South Asia", chapter: "../08-south-asia/index.html" },
            geometry: {
                type: "Polygon",
                coordinates: [[[60, 5], [100, 5], [100, 40], [60, 40], [60, 5]]]
            }
        },
        {
            type: "Feature",
            id: "east-asia",
            properties: { name: "East Asia", chapter: "../09-east-asia/index.html" },
            geometry: {
                type: "Polygon",
                coordinates: [[[100, 18], [150, 18], [150, 55], [100, 55], [100, 18]]]
            }
        },
        {
            type: "Feature",
            id: "southeast-asia",
            properties: { name: "Southeast Asia", chapter: "../10-southeast-asia/index.html" },
            geometry: {
                type: "Polygon",
                coordinates: [[[90, -12], [140, -12], [140, 25], [90, 25], [90, -12]]]
            }
        },
        {
            type: "Feature",
            id: "oceania",
            properties: { name: "Australia & Oceania", chapter: "../11-australia-oceania/index.html" },
            geometry: {
                type: "Polygon",
                coordinates: [[[110, -50], [180, -50], [180, 0], [110, 0], [110, -50]]]
            }
        }
    ]
};

window.WorldRegionsData = RegionalData;
