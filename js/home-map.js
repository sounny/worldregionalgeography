document.addEventListener('DOMContentLoaded', function() {
    // Initialize global map
    if (typeof L !== 'undefined' && document.getElementById('global-map')) {
        const map = L.map('global-map', {
            minZoom: 2,
            maxBounds: [[-90, -180], [90, 180]],
            maxBoundsViscosity: 1.0
        }).setView([20, 0], 2);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap © CARTO'
        }).addTo(map);

        // Add region markers
        const regions = [
            { name: 'Europe', coords: [50, 10], url: 'chapters/02-europe/index.html' },
            { name: 'Russia and Central Asia', coords: [60, 100], url: 'chapters/03-russia/index.html' },
            { name: 'North America', coords: [40, -100], url: 'chapters/04-north-america/index.html' },
            { name: 'Latin America', coords: [-10, -60], url: 'chapters/05-latin-america/index.html' },
            { name: 'Sub-Saharan Africa', coords: [0, 20], url: 'chapters/06-sub-saharan-africa/index.html' },
            { name: 'Middle East', coords: [25, 45], url: 'chapters/07-north-africa-sw-asia/index.html' },
            { name: 'South Asia', coords: [20, 78], url: 'chapters/08-south-asia/index.html' },
            { name: 'East Asia', coords: [35, 105], url: 'chapters/09-east-asia/index.html' },
            { name: 'Southeast Asia', coords: [5, 115], url: 'chapters/10-southeast-asia/index.html' },
            { name: 'Oceania', coords: [-25, 135], url: 'chapters/11-australia-oceania/index.html' }
        ];

        regions.forEach(region => {
            L.circleMarker(region.coords, {
                radius: 12,
                fillColor: '#3b82f6',
                color: '#fff',
                weight: 2,
                fillOpacity: 0.8
            }).addTo(map)
            .bindPopup('<strong>' + region.name + '</strong><br><a href="' + region.url + '">Explore Chapter</a>')
            .on('click', function() {
                this.openPopup();
            });
        });
    }
});
