import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';

// Mock Browser Environment
class MockElement {
    constructor(tagName = 'div') {
        this.tagName = tagName.toUpperCase();
        this.classList = {
            _classes: new Set(),
            add: (cls) => this.classList._classes.add(cls),
            remove: (cls) => this.classList._classes.delete(cls),
            toggle: (cls) => {
                if (this.classList._classes.has(cls)) {
                    this.classList._classes.delete(cls);
                    return false;
                }
                this.classList._classes.add(cls);
                return true;
            },
            contains: (cls) => this.classList._classes.has(cls),
            toString: () => [...this.classList._classes].join(' ')
        };
        this.attributes = new Map();
        this.parentElement = null;
        this._closestMatch = null; // For testing closest()
    }

    setAttribute(name, value) {
        this.attributes.set(name, String(value));
    }

    getAttribute(name) {
        return this.attributes.get(name) || null;
    }

    closest(selector) {
        // Simple mock: assumes the test sets _closestMatch if we want to simulate a match
        return this._closestMatch || null;
    }
}

// Global mocks
global.window = {
    innerWidth: 1024
};

global.document = {
    _listeners: {},
    addEventListener: (event, callback) => {
        if (!global.document._listeners[event]) {
            global.document._listeners[event] = [];
        }
        global.document._listeners[event].push(callback);
    },
    querySelector: () => null, // Default implementation
    querySelectorAll: () => [],
    createElement: (tag) => new MockElement(tag)
};

global.HTMLElement = MockElement;

// Import the module under test
import Navigation from '../js/modules/navigation.js';

describe('Navigation.initOutsideClick', () => {
    let navMenu;
    let navToggle;
    let clickListener;

    beforeEach(() => {
        // Reset listeners
        global.document._listeners = {};

        // create fresh elements
        navMenu = new MockElement('nav');
        navToggle = new MockElement('button');

        // Mock querySelector
        global.document.querySelector = (selector) => {
            if (selector === '.nav-menu') return navMenu;
            if (selector === '.nav-toggle') return navToggle;
            return null;
        };
    });

    it('should register a click event listener on document', () => {
        Navigation.initOutsideClick();
        assert.ok(global.document._listeners['click'], 'Click listener should be registered');
        assert.strictEqual(global.document._listeners['click'].length, 1);
    });

    it('should not close menu when clicking inside .main-nav', () => {
        Navigation.initOutsideClick();
        clickListener = global.document._listeners['click'][0];

        // Setup initial state
        navMenu.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');

        // Simulate click inside main-nav
        const event = {
            target: new MockElement('div')
        };
        // Mock closest to return something truthy (the container itself)
        event.target._closestMatch = new MockElement('div');

        clickListener(event);

        assert.ok(navMenu.classList.contains('active'), 'Menu should remain active');
        assert.strictEqual(navToggle.getAttribute('aria-expanded'), 'true');
    });

    it('should close menu when clicking outside .main-nav', () => {
        Navigation.initOutsideClick();
        clickListener = global.document._listeners['click'][0];

        // Setup initial state
        navMenu.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');

        // Simulate click outside main-nav
        const event = {
            target: new MockElement('div')
        };
        // Mock closest to return null
        event.target._closestMatch = null;

        clickListener(event);

        assert.ok(!navMenu.classList.contains('active'), 'Menu should not be active');
        assert.strictEqual(navToggle.getAttribute('aria-expanded'), 'false');
    });

    it('should handle missing navToggle gracefully', () => {
         global.document.querySelector = (selector) => {
            if (selector === '.nav-menu') return navMenu;
            if (selector === '.nav-toggle') return null; // Missing toggle
            return null;
        };

        Navigation.initOutsideClick();
        clickListener = global.document._listeners['click'][0];

        navMenu.classList.add('active');

        const event = {
            target: new MockElement('div')
        };
        event.target._closestMatch = null;

        // Should not throw error
        try {
            clickListener(event);
        } catch (e) {
            assert.fail('Should not throw error: ' + e.message);
        }

        assert.ok(!navMenu.classList.contains('active'), 'Menu should be closed');
    });

    it('should handle missing navMenu gracefully', () => {
         global.document.querySelector = (selector) => {
            if (selector === '.nav-menu') return null; // Missing menu
            if (selector === '.nav-toggle') return navToggle;
            return null;
        };

        Navigation.initOutsideClick();
        clickListener = global.document._listeners['click'][0];

        const event = {
            target: new MockElement('div')
        };
        event.target._closestMatch = null;

        // Should not throw error
        try {
            clickListener(event);
        } catch (e) {
             assert.fail('Should not throw error: ' + e.message);
        }
    });
});
