/**
 * World Regional Geography - Main JavaScript
 * Interactive features for the online textbook
 * Consolidated initialization for all interactive components
 */

// =====================================================
// DOMContentLoaded Event Handler (Consolidated)
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initPreviewMap();
    initRegionalNavigator(); // Added for dev index
    initQuizzes();
    initSmoothScroll();
    initTexasToggle();
    initAccordions();
    initFlipCards();
});

/**
 * Initialize Flip Cards
 */
function initFlipCards() {
    const cards = document.querySelectorAll('.flip-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
        
        // Keyboard accessibility
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.toggle('flipped');
            }
        });
    });
}

/**
 * Initialize Texas Connection toggles
 */
function initTexasToggle() {
    const toggles = document.querySelectorAll('.texas-toggle');
    if (!toggles.length) return;

    toggles.forEach((toggle, index) => {
        const btn = toggle.querySelector('.btn-texas-toggle');
        const content = toggle.querySelector('.texas-content');
        if (!btn || !content) return;

        if (!content.id) {
            content.id = `texas-connection-${index + 1}`;
        }

        btn.setAttribute('aria-controls', content.id);
        if (!btn.id) {
            btn.id = `${content.id}-label`;
        }
        
        // Keep initial state consistent between class + ARIA attributes
        const isInitiallyHidden = content.classList.contains('hidden');
        btn.setAttribute('aria-expanded', isInitiallyHidden ? 'false' : 'true');
        content.setAttribute('aria-hidden', String(isInitiallyHidden));
        content.setAttribute('role', 'region');
        content.setAttribute('aria-labelledby', btn.id);

        btn.addEventListener('click', () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!isExpanded));
            content.classList.toggle('hidden');
            content.setAttribute('aria-hidden', String(isExpanded));
            btn.classList.toggle('active');
        });

        // Keyboard navigation support
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
}

/**
 * Initialize accordion components
 */
function initAccordions() {
    const items = document.querySelectorAll('.accordion-item');

    items.forEach((item, index) => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        if (!header || !content) return;

        if (!content.id) {
            content.id = `accordion-content-${index + 1}`;
        }

        if (!header.id) {
            header.id = `accordion-header-${index + 1}`;
        }

        header.setAttribute('aria-controls', content.id);
        content.setAttribute('aria-labelledby', header.id);
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        content.setAttribute('role', 'region');

        const isInitiallyExpanded = header.getAttribute('aria-expanded') === 'true' || item.classList.contains('active');
        header.setAttribute('aria-expanded', String(isInitiallyExpanded));
        content.setAttribute('aria-hidden', String(!isInitiallyExpanded));
        item.classList.toggle('active', isInitiallyExpanded);

        header.addEventListener('click', () => {
            // Optional: Close other items
            // items.forEach(i => { if (i !== item) i.classList.remove('active'); });

            item.classList.toggle('active');
            const isActive = item.classList.contains('active');
            header.setAttribute('aria-expanded', String(isActive));
            content.setAttribute('aria-hidden', String(!isActive));
        });

        // Keyboard navigation support
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });
}

/**
 * Initialize mobile navigation toggle
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    if (navToggle && navMenu) {
        if (!navMenu.id) {
            navMenu.id = 'primary-nav-menu';
        }
        navToggle.setAttribute('aria-controls', navMenu.id);

        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });
    }

    // Helper for secure ID generation
    function getSecureId() {
        if (typeof crypto !== 'undefined') {
            if (typeof crypto.randomUUID === 'function') {
                return crypto.randomUUID();
            }
            if (typeof crypto.getRandomValues === 'function') {
                const array = new Uint32Array(1);
                crypto.getRandomValues(array);
                return array[0].toString(16);
            }
        }
        // Fallback for very old environments
        return Math.random().toString(16).slice(2);
    }

    // Mobile dropdown toggle
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        if (toggle) {
            toggle.setAttribute('aria-haspopup', 'true');

            if (menu && !menu.id) {
                menu.id = `dropdown-menu-${getSecureId()}`;
            }
            if (menu?.id) {
                toggle.setAttribute('aria-controls', menu.id);
            }

            toggle.setAttribute('aria-expanded', dropdown.classList.contains('active') ? 'true' : 'false');

            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                    toggle.setAttribute('aria-expanded', dropdown.classList.contains('active') ? 'true' : 'false');
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
        { name: 'Russia and Central Asia', center: [60, 100], color: '#1e5f74' },
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
        
    });
}

// =====================================================
// Regional Navigator (Dev Home)
// =====================================================

/**
 * Initialize the interactive world map navigator
 */
function initRegionalNavigator() {
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
            name: 'Russia and Central Asia',
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
    Object.keys(regionalData).forEach(id => {
        const region = regionalData[id];
        
        const marker = L.circleMarker(region.center, {
            radius: 15,
            fillColor: region.color,
            color: '#fff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(navMap);

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
}

// =====================================================
// Quiz Component
// =====================================================

/**
 * Initialize all quiz components on the page
 */
function initQuizzes() {
    const quizContainers = document.querySelectorAll('.quiz-container[data-quiz-engine="main"]');
    if (!quizContainers.length) return;
    
    quizContainers.forEach(container => {
        const options = container.querySelectorAll('.quiz-option');
        const feedback = container.querySelector('.quiz-feedback');
        if (feedback) {
            feedback.setAttribute('aria-live', 'polite');
            feedback.setAttribute('role', 'status');
        }

        const inputs = container.querySelectorAll('input[type="radio"]');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                const option = input.closest('.quiz-option');
                if (!option) return;

                options.forEach(opt => opt.classList.remove('correct', 'incorrect'));
                if (feedback) {
                    feedback.classList.remove('success', 'error');
                }

                const isCorrect = option.dataset.correct === 'true';
                option.classList.add(isCorrect ? 'correct' : 'incorrect');

                if (!isCorrect) {
                    const correctOption = container.querySelector('[data-correct="true"]');
                    if (correctOption) {
                        correctOption.classList.add('correct');
                    }
                }

                if (feedback) {
                    const correctFeedback = container.querySelector('[data-correct="true"]')?.dataset.feedback || '';
                    const optionFeedback = option.dataset.feedback || '';
                    feedback.classList.add('show', isCorrect ? 'success' : 'error');
                    feedback.innerHTML = isCorrect
                        ? `<p class="feedback-correct">✓ Correct! ${optionFeedback}</p>`
                        : `<p class="feedback-incorrect">Try again. ${correctFeedback}</p>`;
                }
            });
        });
    });
}

// =====================================================
// Smooth Scrolling
// =====================================================

/**
 * Add accessibility enhancements to navigation
 */
function initAccessibilityEnhancements() {
    const mainContent = document.querySelector('main');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }

    // Add skip link if not present
    if (!document.querySelector('.skip-link')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Add ARIA labels to navigation
    const nav = document.querySelector('.main-nav');
    if (nav && !nav.getAttribute('aria-label')) {
        nav.setAttribute('aria-label', 'Main navigation');
    }

    // Add landmark roles
    if (mainContent && !mainContent.getAttribute('role')) {
        mainContent.setAttribute('role', 'main');
    }

    const header = document.querySelector('.site-header');
    if (header && !header.getAttribute('role')) {
        header.setAttribute('role', 'banner');
    }

    const footer = document.querySelector('.site-footer');
    if (footer && !footer.getAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
    }
}

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

        if (!term.hasAttribute('tabindex')) {
            term.setAttribute('tabindex', '0');
        }

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

        term.addEventListener('focus', () => {
            tooltip.classList.add('visible');
        });

        term.addEventListener('blur', () => {
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
    initKeyTerms,
    ProgressTracker
};
