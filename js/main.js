/**
 * World Regional Geography - Main JavaScript
 * Interactive features for the online textbook
 */

// =====================================================
// Navigation
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initPreviewMap();
    initQuizzes();
    initSmoothScroll();
});

/**
 * Initialize mobile navigation toggle
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });
    }

    // Mobile dropdown toggle
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.main-nav') && navMenu) {
            navMenu.classList.remove('active');
            navToggle?.setAttribute('aria-expanded', 'false');
        }
    });
}

// =====================================================
// Preview Map (Home Page)
// =====================================================

/**
 * Initialize the preview map on the home page
 */
function initPreviewMap() {
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
    regions.forEach(region => {
        const marker = L.circleMarker(region.center, {
            radius: 12,
            fillColor: region.color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);

        marker.bindPopup(`<strong>${region.name}</strong>`);
        
        marker.on('mouseover', function() {
            this.openPopup();
            this.setStyle({ radius: 16, fillOpacity: 1 });
        });
        
        marker.on('mouseout', function() {
            this.closePopup();
            this.setStyle({ radius: 12, fillOpacity: 0.8 });
        });
    });
}

// =====================================================
// Quiz Component
// =====================================================

/**
 * Initialize all quiz components on the page
 */
function initQuizzes() {
    const quizContainers = document.querySelectorAll('.quiz-container');
    
    quizContainers.forEach(container => {
        const options = container.querySelectorAll('.quiz-option');
        const feedback = container.querySelector('.quiz-feedback');
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                // Prevent re-answering
                if (container.classList.contains('answered')) return;
                
                const isCorrect = option.dataset.correct === 'true';
                
                // Mark as answered
                container.classList.add('answered');
                
                // Style the selected option
                option.classList.add(isCorrect ? 'correct' : 'incorrect');
                
                // Show the correct answer if wrong
                if (!isCorrect) {
                    const correctOption = container.querySelector('[data-correct="true"]');
                    if (correctOption) {
                        correctOption.classList.add('correct');
                    }
                }
                
                // Show feedback
                if (feedback) {
                    feedback.classList.add('show');
                    feedback.classList.add(isCorrect ? 'success' : 'error');
                    feedback.textContent = isCorrect 
                        ? '✓ Correct! ' + (option.dataset.feedback || '')
                        : '✗ Not quite. ' + (container.querySelector('[data-correct="true"]')?.dataset.feedback || '');
                }
            });
        });
    });
}

// =====================================================
// Smooth Scrolling
// =====================================================

/**
 * Enable smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =====================================================
// Interactive Map for Chapters
// =====================================================

/**
 * Create an interactive map for a specific region
 * @param {string} containerId - The ID of the map container element
 * @param {object} config - Configuration object with center, zoom, and optional GeoJSON
 */
function createRegionMap(containerId, config) {
    const container = document.getElementById(containerId);
    if (!container || typeof L === 'undefined') return null;

    const map = L.map(containerId, {
        zoomControl: true,
        scrollWheelZoom: true
    }).setView(config.center, config.zoom || 4);

    // Base layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // Add GeoJSON if provided
    if (config.geojson) {
        L.geoJSON(config.geojson, {
            style: config.style || {
                fillColor: '#2d8fa8',
                weight: 2,
                opacity: 1,
                color: '#1e5f74',
                fillOpacity: 0.3
            },
            onEachFeature: config.onEachFeature || null
        }).addTo(map);
    }

    // Add markers if provided
    if (config.markers) {
        config.markers.forEach(marker => {
            L.marker(marker.coords)
                .bindPopup(marker.popup || marker.name)
                .addTo(map);
        });
    }

    return map;
}

// =====================================================
// Key Terms Tooltip
// =====================================================

/**
 * Initialize tooltips for key terms
 */
function initKeyTerms() {
    const terms = document.querySelectorAll('.term-highlight');
    
    terms.forEach(term => {
        const definition = term.dataset.definition;
        if (!definition) return;
        
        const tooltip = document.createElement('span');
        tooltip.className = 'term-tooltip';
        tooltip.textContent = definition;
        term.appendChild(tooltip);
        
        term.addEventListener('mouseenter', () => {
            tooltip.classList.add('visible');
        });
        
        term.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });
}

// =====================================================
// Progress Tracking (Local Storage)
// =====================================================

const ProgressTracker = {
    STORAGE_KEY: 'wrg_progress',
    
    getProgress() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    },
    
    markChapterComplete(chapterId) {
        const progress = this.getProgress();
        progress[chapterId] = {
            completed: true,
            completedAt: new Date().toISOString()
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    },
    
    isChapterComplete(chapterId) {
        const progress = this.getProgress();
        return progress[chapterId]?.completed || false;
    },
    
    getCompletedCount() {
        const progress = this.getProgress();
        return Object.values(progress).filter(p => p.completed).length;
    },
    
    reset() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
};

// Export for use in chapter pages
window.WRG = {
    createRegionMap,
    initKeyTerms,
    ProgressTracker
};
