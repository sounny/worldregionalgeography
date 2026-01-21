/**
 * Navigation Module
 * Handles site navigation, mobile menu, and dropdown functionality
 */

const Navigation = {
    /**
     * Initialize navigation components
     */
    init() {
        this.initMobileToggle();
        this.initDropdowns();
        this.initOutsideClick();
    },

    /**
     * Initialize mobile navigation toggle
     */
    initMobileToggle() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('active');
            });
        }
    },

    /**
     * Initialize dropdown menus
     */
    initDropdowns() {
        const dropdowns = document.querySelectorAll('.nav-dropdown');

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
    },

    /**
     * Close menu on outside click
     */
    initOutsideClick() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.main-nav') && navMenu) {
                navMenu.classList.remove('active');
                navToggle?.setAttribute('aria-expanded', 'false');
            }
        });
    }
};

// Export for use in main application
export default Navigation;