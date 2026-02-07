/**
 * World Regional Geography - Modular Main JavaScript
 * Entry point for the modular version of the application
 * Uses ES6 modules for better code organization and maintainability
 */

// Import modules
import Navigation from './modules/navigation.js';
import MapManager from './modules/mapManager.js';
import QuizManager from './modules/quizManager.js';
import Components from './modules/components.js';
import Utils from './modules/utils.js';

// Main application initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize utilities first
    Utils.initAccessibilityEnhancements();
    Utils.initSmoothScroll();
    
    // Initialize navigation
    Navigation.init();
    
    // Initialize map components
    MapManager.initPreviewMap();
    MapManager.initRegionalNavigator();
    
    // Initialize quiz components (will be called by individual chapters)
    // QuizManager.init() is called by chapter-specific scripts
    
    // Initialize UI components
    Components.init();
    
    // Export utilities to global scope for chapter pages
    window.WRG = {
        initKeyTerms: Components.initKeyTerms,
        ProgressTracker: Utils.ProgressTracker
    };
});

// Export for potential Node.js usage or testing
export {
    Navigation,
    MapManager,
    QuizManager,
    Components,
    Utils
};