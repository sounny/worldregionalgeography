/**
 * Utilities Module
 * Provides utility functions for the application
 */

const Utils = {
    /**
     * Enable smooth scrolling for anchor links
     */
    initSmoothScroll() {
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
    },

    /**
     * Add accessibility enhancements to navigation
     */
    initAccessibilityEnhancements() {
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
        const mainContent = document.querySelector('main');
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
    },

    /**
     * Progress Tracking System
     */
    ProgressTracker: {
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
    }
};

// Export for use in main application
export default Utils;