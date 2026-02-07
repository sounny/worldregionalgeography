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
     * Initialize tooltips for key terms (Optimized)
     */
    initKeyTerms() {
        // 1. Ensure accessibility: Add tabindex to all terms if missing (Iterate once)
        const terms = document.querySelectorAll('.term-highlight');
        if (terms.length === 0) return;

        terms.forEach(term => {
            if (!term.hasAttribute('tabindex')) {
                term.setAttribute('tabindex', '0');
            }
        });

        // 2. Shared tooltip element (Create once)
        let tooltip = document.getElementById('shared-term-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('span');
            tooltip.id = 'shared-term-tooltip';
            tooltip.className = 'term-tooltip';
            tooltip.setAttribute('role', 'tooltip');
            tooltip.setAttribute('aria-hidden', 'true');
            document.body.appendChild(tooltip);
        }

        // 3. Helper to show/hide
        const showTooltip = (target) => {
            const definition = target.dataset.definition;
            if (!definition) return;

            tooltip.textContent = definition;
            tooltip.classList.add('visible');
            tooltip.setAttribute('aria-hidden', 'false');

            // Position Logic
            const rect = target.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            
            tooltip.style.position = 'absolute';
            tooltip.style.bottom = 'auto'; // Override CSS bottom: 100%
            // Position exactly at top of term (transform handles gap)
            tooltip.style.top = `${rect.top + scrollTop - tooltip.offsetHeight}px`;
            tooltip.style.left = `${rect.left + scrollLeft}px`;
            
            // Prevent going off-screen left
            if (parseFloat(tooltip.style.left) < 0) tooltip.style.left = '10px';
        };

        const hideTooltip = () => {
            tooltip.classList.remove('visible');
            tooltip.setAttribute('aria-hidden', 'true');
        };

        // 4. Event Delegation (Attach listeners once to body)
        if (document.body.dataset.keyTermsInitialized) return;
        document.body.dataset.keyTermsInitialized = 'true';

        document.body.addEventListener('mouseover', (e) => {
            const term = e.target.closest('.term-highlight');
            if (term) {
                showTooltip(term);
            }
        });

        document.body.addEventListener('mouseout', (e) => {
            const term = e.target.closest('.term-highlight');
            if (term) {
                 // If moving to a child of the term, don't hide
                 if (term.contains(e.relatedTarget)) return;
                hideTooltip();
            }
        });

        // Keyboard support (Focus delegation)
        document.body.addEventListener('focusin', (e) => {
            const term = e.target.closest('.term-highlight');
            if (term) {
                showTooltip(term);
            }
        });

        document.body.addEventListener('focusout', (e) => {
            const term = e.target.closest('.term-highlight');
            if (term) {
                hideTooltip();
            }
        });
    }
};

// Export for use in main application
export default Components;