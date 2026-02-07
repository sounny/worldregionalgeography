const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();

// Mock minimal browser environment
global.window = {
    scrollTo: () => {},
    pageYOffset: 0,
    innerWidth: 1024,
    // WRG might be assigned
};

global.document = {
    addEventListener: (event, callback) => {
        // Trigger DOMContentLoaded immediately for testing if needed, or store callback
        if (event === 'DOMContentLoaded') {
            setTimeout(callback, 0);
        }
    },
    createElement: (tag) => ({
        tagName: tag.toUpperCase(),
        className: '',
        classList: {
            add: () => {},
            remove: () => {},
            toggle: () => {},
            contains: () => false
        },
        setAttribute: () => {},
        getAttribute: () => null,
        appendChild: () => {},
        addEventListener: () => {},
        dataset: {}
    }),
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    body: {
        insertBefore: () => {},
        firstChild: null,
        addEventListener: () => {}
    }
};

global.localStorage = localStorageMock;

// Mock Leaflet (L)
global.L = {
    map: () => ({
        setView: () => ({ addTo: () => {} }),
        addTo: () => {}
    }),
    tileLayer: () => ({ addTo: () => {} }),
    circleMarker: () => ({ addTo: () => {}, bindPopup: () => {}, on: () => {} })
};

// Load the source code
const mainJsPath = path.join(__dirname, '../js/main.js');
const mainJsCode = fs.readFileSync(mainJsPath, 'utf8');

// Execute the code in the global scope
try {
    eval(mainJsCode);
} catch (e) {
    console.error('Error executing main.js:', e);
    process.exit(1);
}

// Verification Logic
console.log('Verifying js/main.js exports after refactor (iteration 2)...');

let failed = false;

// Check window.WRG (Should be defined)
if (typeof window.WRG === 'object') {
    console.log('[PASS] window.WRG is defined.');

    // Check ProgressTracker inside WRG (Should be defined)
    if (typeof window.WRG.ProgressTracker === 'object' && typeof window.WRG.ProgressTracker.markChapterComplete === 'function') {
        console.log('[PASS] window.WRG.ProgressTracker is functional.');
    } else {
        console.log('[FAIL] window.WRG.ProgressTracker is missing or invalid.');
        failed = true;
    }

    // Check initKeyTerms inside WRG (Should be UNDEFINED)
    if (typeof window.WRG.initKeyTerms === 'undefined') {
        console.log('[PASS] window.WRG.initKeyTerms is correctly removed from exports.');
    } else {
        console.log('[FAIL] window.WRG.initKeyTerms should be undefined.');
        failed = true;
    }

} else {
    console.log('[FAIL] window.WRG is missing.');
    failed = true;
}

// Check window.ProgressTracker (Should be UNDEFINED - strict namespacing)
if (typeof window.ProgressTracker === 'undefined') {
    console.log('[PASS] window.ProgressTracker is not leaked as loose global.');
} else {
    console.log('[FAIL] window.ProgressTracker leaked to global scope.');
    failed = true;
}

// Check global/window function initKeyTerms (Should NOT be defined globally)
if (typeof window.initKeyTerms === 'undefined' && typeof global.initKeyTerms === 'undefined') {
    console.log('[PASS] initKeyTerms is not leaked to global scope.');
} else {
    console.log('[FAIL] initKeyTerms leaked to global scope.');
    failed = true;
}

if (failed) {
    console.log('\nVerification FAILED');
    process.exit(1);
} else {
    console.log('\nVerification SUCCESS');
    process.exit(0);
}
