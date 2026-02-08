/**
 * Map Manager Module
 * Handles all map-related functionality including preview maps and regional navigators
 */

const MapManager = {
    /**
     * Initialize the preview map on the home page
     */
    initPreviewMap() {
        const mapContainer = document.getElementById('preview-map');
        if (!mapContainer || typeof L === 'undefined') return;

        const map = L.map('preview-map', {
            zoomControl: true,
            scrollWheelZoom: false
        }).setView([20, 0], 2);

        // Add tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        // Define world regions with approximate bounds
        const regions = [
            { name: 'Europe', center: [50, 10], color: '#2d8fa8' },
            { name: 'Russia', center: [60, 100], color: '#1e5f74' },
            { name: 'North America', center: [45, -100], color: '#f4a261' },
            { name: 'Latin America', center: [-15, -60], color: '#e07b3c' },
            { name: 'Sub-Saharan Africa', center: [0, 20], color: '#2a9d8f' },
            { name: 'North Africa & SW Asia', center: [28, 30], color: '#40c9b8' },
            { name: 'South Asia', center: [22, 78], color: '#e76f51' },
            { name: 'East Asia', center: [35, 115], color: '#264653' },
            { name: 'Southeast Asia', center: [5, 115], color: '#287271' },
            { name: 'Australia & Oceania', center: [-25, 140], color: '#8ab17d' }
        ];

        // Add markers for each region
        const markerGroup = L.layerGroup();
        regions.forEach(region => {
            const marker = L.circleMarker(region.center, {
                radius: 12,
                fillColor: region.color,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            });

            marker.addTo(markerGroup);

            marker.bindPopup(`<strong>${region.name}</strong>`);
            
            marker.on('mouseover', function() {
                this.openPopup();
                this.setStyle({ radius: 16, fillOpacity: 1 });
            });
            
            marker.on('mouseout', function() {
                this.setStyle({ radius: 12, fillOpacity: 0.8 });
            });
        });

        markerGroup.addTo(map);
    },

    /**
     * Initialize the interactive world map navigator
     */
    initRegionalNavigator() {
        const mapContainer = document.getElementById('regions-map');
        const infoPanel = document.getElementById('region-info-panel');
        if (!mapContainer || !infoPanel || typeof L === 'undefined') return;

        const navMap = L.map('regions-map', {
            zoomControl: true,
            scrollWheelZoom: false,
            zoomSnap: 0.5
        }).setView([20, 10], 1.5);

        // Darker, more professional base layer for dev
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(navMap);

        const regionalData = {
            'europe': {
                name: 'Europe',
                theme: 'Migration & Identity',
                desc: 'Exploring European integration, the legacy of industrialization, and the contemporary challenges of migration and cultural identity.',
                link: 'chapters/02-europe/index.html',
                center: [50, 10],
                color: 'var(--color-primary)'
            },
            'russia': {
                name: 'Russia & Post-Soviet',
                theme: 'Geopolitics & Energy',
                desc: 'Understanding the geopolitical transitions after the Soviet Union and the critical role of resource geography in global affairs.',
                link: 'chapters/03-russia/index.html',
                center: [60, 100],
                color: '#1e5f74'
            },
            'north-america': {
                name: 'North America',
                theme: 'Urbanization & Diversity',
                desc: 'Analyzing urban expansion, economic integration under USMCA, and the environmental challenges facing the US and Canada.',
                link: 'chapters/04-north-america/index.html',
                center: [45, -100],
                color: '#f4a261'
            },
            'latin-america': {
                name: 'Latin America',
                theme: 'Biodiversity & Inequality',
                desc: 'Studying the Amazonian ecosystems, the impact of colonialism on development, and the dynamics of urbanization in mega-cities.',
                link: 'chapters/05-latin-america/index.html',
                center: [-15, -60],
                color: '#e07b3c'
            },
            'sub-saharan-africa': {
                name: 'Sub-Saharan Africa',
                theme: 'Development & Global Health',
                desc: 'Examining rapid demographic shifts, resource management, and the cultural diversity that defines the African continent.',
                link: 'chapters/06-sub-saharan-africa/index.html',
                center: [0, 20],
                color: '#2a9d8f'
            },
            'mena': {
                name: 'N. Africa & SW Asia',
                theme: 'Water & Conflict',
                desc: 'The geography of arid landscapes, the geopolitics of petroleum, and the cultural significance of the region as a hearth of civilization.',
                link: 'chapters/07-north-africa-sw-asia/index.html',
                center: [28, 30],
                color: '#40c9b8'
            },
            'south-asia': {
                name: 'South Asia',
                theme: 'Population & Monsoons',
                desc: 'Analyzing the challenges of high population density, climate vulnerability in low-lying regions, and India\'s economic rise.',
                link: 'chapters/08-south-asia/index.html',
                center: [22, 78],
                color: '#e76f51'
            },
            'east-asia': {
                name: 'East Asia',
                theme: 'Industrialization & Growth',
                desc: 'Tracking the dramatic economic shift of China, the technologic power of Japan, and the environmental costs of rapid growth.',
                link: 'chapters/09-east-asia/index.html',
                center: [35, 115],
                color: '#264653'
            },
            'southeast-asia': {
                name: 'Southeast Asia',
                theme: 'Globalization & Maritime Trade',
                desc: 'The strategic importance of the Malacca Strait, biodiversity in tropical rainforests, and the economic integration of ASEAN.',
                link: 'chapters/10-southeast-asia/index.html',
                center: [5, 115],
                color: '#287271'
            },
            'oceania': {
                name: 'Australia & Oceania',
                theme: 'Island Risk & Resilience',
                desc: 'Studying sea-level rise in the Pacific, the unique physical geography of the Outback, and indigenous land rights.',
                link: 'chapters/11-australia-oceania/index.html',
                center: [-25, 140],
                color: '#8ab17d'
            }
        };

        // Add Markers and Link to Panel
        const markerGroup = L.layerGroup();
        Object.keys(regionalData).forEach(id => {
            const region = regionalData[id];
            
            const marker = L.circleMarker(region.center, {
                radius: 15,
                fillColor: region.color,
                color: '#fff',
                weight: 3,
                opacity: 1,
                fillOpacity: 0.8
            });

            marker.addTo(markerGroup);

            // Tooltip
            marker.bindTooltip(region.name, {
                permanent: false, 
                direction: 'top',
                className: 'region-hover-label'
            });

            // Hover events
            marker.on('mouseover', function() {
                this.setStyle({ radius: 20, fillOpacity: 1 });
                updateInfoPanel(id);
            });

            marker.on('mouseout', function() {
                this.setStyle({ radius: 15, fillOpacity: 0.8 });
            });

            // Click event
            marker.on('click', function() {
                window.location.href = region.link;
            });
        });

        markerGroup.addTo(navMap);

        function updateInfoPanel(id) {
            const data = regionalData[id];
            if (!data || !infoPanel) return;

            infoPanel.innerHTML = `
                <span class="theme-badge">${data.theme}</span>
                <h3>${data.name}</h3>
                <p>${data.desc}</p>
                <a href="${data.link}" class="btn btn-primary btn-go">View Chapter ➜</a>
            `;
            
            // Add a nice fade-in animation
            infoPanel.style.animation = 'none';
            infoPanel.offsetHeight; // trigger reflow
            infoPanel.style.animation = 'fadeIn 0.3s ease-out forwards';
        }
    },

};

// Export for use in main application
export default MapManager;