/**
 * Components Module
 * Handles interactive UI components like Texas toggle and accordions
 */

const Components = {
    /**
     * Initialize all interactive components
     */
    init() {
        this.initTexasToggle();
        this.initAccordions();
        this.initKeyTerms();
        this.initFlipCards();
    },

    /**
     * Initialize Flip Cards
     */
    initFlipCards() {
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
    },

    /**
     * Initialize Texas Connection toggles with enhanced accessibility
     */
    initTexasToggle() {
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
            btn.setAttribute('role', 'button');
            btn.setAttribute('tabindex', '0');
            
            // Keep initial state consistent between class + ARIA attributes
            const isInitiallyHidden = content.classList.contains('hidden');
            btn.setAttribute('aria-expanded', isInitiallyHidden ? 'false' : 'true');
            content.setAttribute('aria-hidden', String(isInitiallyHidden));
            content.setAttribute('role', 'region');
            content.setAttribute('aria-labelledby', `${content.id}-label`);

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
    },

    /**
     * Initialize accordion components with enhanced accessibility
     */
    initAccordions() {
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
    },

    /**
     * Initialize tooltips for key terms
     */
    initKeyTerms() {
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

            term.addEventListener('focus', () => {
                tooltip.classList.add('visible');
            });

            term.addEventListener('blur', () => {
                tooltip.classList.remove('visible');
            });
        });
    }
};

// Export for use in main application
export default Components;