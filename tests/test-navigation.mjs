import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import Navigation from '../js/modules/navigation.js';

// Mock DOM classes
class MockClassList {
    constructor() {
        this.classes = new Set();
    }
    add(cls) { this.classes.add(cls); }
    remove(cls) { this.classes.delete(cls); }
    toggle(cls) {
        if (this.classes.has(cls)) {
            this.classes.delete(cls);
            return false;
        }
        this.classes.add(cls);
        return true;
    }
    contains(cls) { return this.classes.has(cls); }
}

class MockElement {
    constructor(tagName) {
        this.tagName = tagName;
        this.classList = new MockClassList();
        this.attributes = new Map();
        this.listeners = new Map();
    }

    getAttribute(name) {
        return this.attributes.get(name);
    }

    setAttribute(name, value) {
        this.attributes.set(name, String(value));
    }

    addEventListener(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    // Helper to simulate events
    click() {
        const callbacks = this.listeners.get('click') || [];
        callbacks.forEach(cb => cb({ preventDefault: () => {} }));
    }
}

describe('Navigation.initMobileToggle', () => {
    let originalDocument;
    let navToggle;
    let navMenu;

    beforeEach(() => {
        // Save original document if it exists (though likely undefined in Node)
        if (typeof global.document !== 'undefined') {
            originalDocument = global.document;
        }

        // Setup mock elements
        navToggle = new MockElement('BUTTON');
        navMenu = new MockElement('UL');

        // Setup mock document
        global.document = {
            querySelector: (selector) => {
                if (selector === '.nav-toggle') return navToggle;
                if (selector === '.nav-menu') return navMenu;
                return null;
            }
        };
    });

    afterEach(() => {
        // Restore or cleanup document
        if (originalDocument) {
            global.document = originalDocument;
        } else {
            delete global.document;
        }
    });

    it('should initialize toggle listener when elements exist', () => {
        Navigation.initMobileToggle();

        const listeners = navToggle.listeners.get('click');
        assert.ok(listeners, 'Click listener should be attached to nav toggle');
        assert.strictEqual(listeners.length, 1, 'Should have exactly one click listener');
    });

    it('should toggle aria-expanded and active class on click', () => {
        // Setup initial state
        navToggle.setAttribute('aria-expanded', 'false');

        Navigation.initMobileToggle();

        // Simulate first click (expand)
        navToggle.click();
        assert.strictEqual(navToggle.getAttribute('aria-expanded'), 'true', 'aria-expanded should be true after first click');
        assert.ok(navMenu.classList.contains('active'), 'nav-menu should have active class after first click');

        // Simulate second click (collapse)
        navToggle.click();
        assert.strictEqual(navToggle.getAttribute('aria-expanded'), 'false', 'aria-expanded should be false after second click');
        assert.ok(!navMenu.classList.contains('active'), 'nav-menu should not have active class after second click');
    });

    it('should handle missing elements gracefully', () => {
        // Mock querySelector to return null
        global.document.querySelector = () => null;

        assert.doesNotThrow(() => {
            Navigation.initMobileToggle();
        }, 'Should not throw error when elements are missing');
    });

    it('should handle missing navToggle but present navMenu gracefully', () => {
        global.document.querySelector = (selector) => {
            if (selector === '.nav-menu') return navMenu;
            return null;
        };

        assert.doesNotThrow(() => {
            Navigation.initMobileToggle();
        });
    });

    it('should handle missing navMenu but present navToggle gracefully', () => {
        global.document.querySelector = (selector) => {
            if (selector === '.nav-toggle') return navToggle;
            return null;
        };

        assert.doesNotThrow(() => {
            Navigation.initMobileToggle();
        });

        // Listener should NOT be attached if menu is missing (based on current implementation check: if (navToggle && navMenu))
        const listeners = navToggle.listeners.get('click');
        assert.strictEqual(listeners, undefined, 'Listener should not be attached if menu is missing');
    });
});
