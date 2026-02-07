/**
 * World Regional Geography - Map Initialization Module
 * Handles Leaflet map setup, tile layers, and GeoJSON integration.
 */

const MapManager = {
    /**
     * Initialize a standard Leaflet map
     * @param {string} containerId - The ID of the HTML element
     * @param {Array} center - [lat, lng]
     * @param {number} zoom - Initial zoom level
     * @returns {L.Map|null}
     */
    initMap(containerId, center = [20, 0], zoom = 2) {
        const container = document.getElementById(containerId);
        if (!container || typeof L === 'undefined') {
            console.error(`Map container ${containerId} not found or Leaflet not loaded.`);
            return null;
        }

        const map = L.map(containerId, {
            zoomControl: true,
            scrollWheelZoom: false,
            zoomSnap: 0.5
        }).setView(center, zoom);

        // Standard light-themed base layer
        const lightBasemap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        });

        // Physical/Terrain base layer
        const terrainBasemap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            maxZoom: 17,
            attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)'
        });

        lightBasemap.addTo(map);

        // Layer Control Setup
        const baseMaps = {
            "Political (Light)": lightBasemap,
            "Physical (Terrain)": terrainBasemap
        };

        map.layerControl = L.control.layers(baseMaps, {}).addTo(map);

        return map;
    },

    /**
     * Add GeoJSON data to a map with standard styling
     * @param {L.Map} map 
     * @param {Object} data - GeoJSON object
     * @param {Object} options - Style and interaction options
     * @param {string} layerName - Optional name for layer control
     */
    addGeoJson(map, data, options = {}, layerName = "World Regions") {
        if (!map || !data) return null;

        const defaultStyle = {
            color: '#2c3e50',
            weight: 2,
            opacity: 0.8,
            fillColor: '#4A90A4',
            fillOpacity: 0.25
        };

        const layer = L.geoJSON(data, {
            style: (feature) => {
                // Use region-specific color if defined in properties
                const regionColor = feature.properties?.color || defaultStyle.fillColor;
                return {
                    color: options.style?.color || '#2c3e50',
                    weight: options.style?.weight || 2,
                    opacity: options.style?.opacity || 0.8,
                    fillColor: regionColor,
                    fillOpacity: options.style?.fillOpacity || 0.25
                };
            },
            onEachFeature: (feature, layer) => {
                if (feature.properties && feature.properties.name) {
                    // Enhanced popup with link to chapter
                    let linkUrl = feature.properties.link || feature.properties.chapter;

                    // Adjust path for chapter pages (which are two levels deep)
                    if (linkUrl && !linkUrl.startsWith('http') && !linkUrl.startsWith('../')) {
                        if (window.location.pathname.includes('/chapters/')) {
                            linkUrl = '../../' + linkUrl;
                        }
                    }

                    const chapterLink = linkUrl
                        ? `<br><a href="${linkUrl}" class="popup-link">Go to chapter →</a>`
                        : '';
                    layer.bindPopup(`<strong>${feature.properties.name}</strong>${chapterLink}`);
                }
                
                if (options.onEachFeature) {
                    options.onEachFeature(feature, layer);
                }

                // Store original style for mouseout
                const originalFillOpacity = options.style?.fillOpacity || 0.25;
                const regionColor = feature.properties?.color || defaultStyle.fillColor;

                layer.on({
                    mouseover: (e) => {
                        const l = e.target;
                        l.setStyle({ 
                            fillOpacity: 0.5,
                            weight: 3
                        });
                        l.bringToFront();
                    },
                    mouseout: (e) => {
                        const l = e.target;
                        l.setStyle({ 
                            fillOpacity: originalFillOpacity,
                            weight: 2
                        });
                    },
                    click: (e) => {
                        // Zoom to region on click
                        map.fitBounds(e.target.getBounds(), { padding: [20, 20] });
                    }
                });
            }
        }).addTo(map);

        if (map.layerControl && layerName) {
            map.layerControl.addOverlay(layer, layerName);
        }

        return layer;
    }
};

// Export for global use
window.MapManager = MapManager;