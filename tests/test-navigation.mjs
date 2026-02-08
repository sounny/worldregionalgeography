import test from 'node:test';
import assert from 'node:assert/strict';

// --- Mock DOM Implementation ---

class MockClassList {
    constructor() {
        this.classes = new Set();
    }
    add(cls) { this.classes.add(cls); }
    remove(cls) { this.classes.delete(cls); }
    toggle(cls) {
        if (this.classes.has(cls)) this.classes.delete(cls);
        else this.classes.add(cls);
    }
    contains(cls) { return this.classes.has(cls); }
}

class MockElement {
    constructor(tagName = 'div') {
        this.tagName = tagName.toUpperCase();
        this.classList = new MockClassList();
        this.attributes = new Map();
        this.listeners = {};
        this.children = [];
        this.parentElement = null;
    }

    setAttribute(name, value) {
        this.attributes.set(name, String(value));
    }

    getAttribute(name) {
        return this.attributes.get(name) || null;
    }

    addEventListener(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    // Helper to trigger events
    dispatch(event, eventData = {}) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb({ target: this, ...eventData }));
        }
    }

    appendChild(child) {
        this.children.push(child);
        child.parentElement = this;
    }

    querySelector(selector) {
        // Simple selector matching for classes
        if (selector.startsWith('.')) {
            const className = selector.substring(1);
            // Check direct children (for dropdown.querySelector)
            for (const child of this.children) {
                if (child.classList.contains(className)) return child;
                // Deep search (simplified)
                const found = child.querySelector(selector);
                if (found) return found;
            }
        }
        return null;
    }

    closest(selector) {
        if (selector.startsWith('.')) {
            const className = selector.substring(1);
            let current = this;
            while (current) {
                if (current.classList && current.classList.contains(className)) return current;
                current = current.parentElement;
            }
        }
        return null;
    }
}

// Global Mocks
global.window = {
    innerWidth: 1024
};

global.document = {
    elements: [], // specific elements we inject for tests

    querySelector(selector) {
        if (selector.startsWith('.')) {
            const className = selector.substring(1);
            return this.elements.find(el => el.classList.contains(className)) || null;
        }
        return null;
    },

    querySelectorAll(selector) {
        if (selector.startsWith('.')) {
            const className = selector.substring(1);
            return this.elements.filter(el => el.classList.contains(className));
        }
        return [];
    },

    addEventListener(event, callback) {
        if (!this.listeners) this.listeners = {};
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    },

    dispatch(event, eventData = {}) {
        if (this.listeners && this.listeners[event]) {
            this.listeners[event].forEach(cb => cb({ target: eventData.target || null, ...eventData }));
        }
    }
};


// Import the module under test
// Note: We need to use dynamic import or ensure mocks are set before import if the module executes code at top level.
// Navigation module defines an object but doesn't run init() at top level, so safe to import.
import Navigation from '../js/modules/navigation.js';


test('Navigation module should be an object', () => {
    assert.equal(typeof Navigation, 'object');
    assert.equal(typeof Navigation.init, 'function');
});

test('initMobileToggle functionality', () => {
    // Setup
    const navToggle = new MockElement('button');
    navToggle.classList.add('nav-toggle');
    navToggle.setAttribute('aria-expanded', 'false');

    const navMenu = new MockElement('nav');
    navMenu.classList.add('nav-menu');

    global.document.elements = [navToggle, navMenu];

    // Initialize
    Navigation.initMobileToggle();

    // Verify listeners attached
    assert.ok(navToggle.listeners['click'], 'Click listener should be attached to nav-toggle');

    // Trigger click
    navToggle.dispatch('click');

    // Assertions
    assert.equal(navToggle.getAttribute('aria-expanded'), 'true');
    assert.ok(navMenu.classList.contains('active'), 'nav-menu should have active class');

    // Trigger click again
    navToggle.dispatch('click');
    assert.equal(navToggle.getAttribute('aria-expanded'), 'false');
    assert.ok(!navMenu.classList.contains('active'), 'nav-menu should not have active class');
});

test('initDropdowns functionality - mobile', () => {
    // Setup
    global.window.innerWidth = 768; // Mobile width

    const dropdown = new MockElement('li');
    dropdown.classList.add('nav-dropdown');

    const toggle = new MockElement('a');
    toggle.classList.add('dropdown-toggle');

    dropdown.appendChild(toggle);

    global.document.elements = [dropdown]; // querySelectorAll will find this

    // Initialize
    Navigation.initDropdowns();

    // Verify
    assert.ok(toggle.listeners['click'], 'Click listener should be attached to dropdown-toggle');

    // Trigger click
    let preventDefaultCalled = false;
    toggle.dispatch('click', { preventDefault: () => { preventDefaultCalled = true; } });

    // Assertions
    assert.ok(preventDefaultCalled, 'preventDefault should be called on mobile');
    assert.ok(dropdown.classList.contains('active'), 'dropdown should have active class');
});

test('initDropdowns functionality - desktop', () => {
    // Setup
    global.window.innerWidth = 1024; // Desktop width

    const dropdown = new MockElement('li');
    dropdown.classList.add('nav-dropdown');

    const toggle = new MockElement('a');
    toggle.classList.add('dropdown-toggle');

    dropdown.appendChild(toggle);

    global.document.elements = [dropdown];

    // Initialize
    Navigation.initDropdowns();

    // Trigger click
    let preventDefaultCalled = false;
    toggle.dispatch('click', { preventDefault: () => { preventDefaultCalled = true; } });

    // Assertions
    assert.equal(preventDefaultCalled, false, 'preventDefault should NOT be called on desktop');
    assert.ok(!dropdown.classList.contains('active'), 'dropdown should NOT toggle active class on desktop');
});

test('initOutsideClick functionality', () => {
    // Setup
    const navMenu = new MockElement('nav');
    navMenu.classList.add('nav-menu');
    navMenu.classList.add('active');

    const navToggle = new MockElement('button');
    navToggle.classList.add('nav-toggle');
    navToggle.setAttribute('aria-expanded', 'true');

    const mainNav = new MockElement('div');
    mainNav.classList.add('main-nav');

    const outsideElement = new MockElement('div');

    // Structure: mainNav contains navMenu
    mainNav.appendChild(navMenu);

    global.document.elements = [navMenu, navToggle, mainNav, outsideElement];

    // Initialize
    Navigation.initOutsideClick();

    // Test: Click outside
    global.document.dispatch('click', {
        target: outsideElement,
        closest: (sel) => outsideElement.closest(sel)
    });

    assert.ok(!navMenu.classList.contains('active'), 'Menu should close when clicking outside');
    assert.equal(navToggle.getAttribute('aria-expanded'), 'false');

    // Reset
    navMenu.classList.add('active');

    // Test: Click inside
    global.document.dispatch('click', {
        target: navMenu, // clicking directly on menu
        closest: (sel) => {
             // Mock closest logic: if sel matches .main-nav, check parents.
             // We'll just manually say yes if target is inside main-nav
             if (sel === '.main-nav') return mainNav;
             return null;
        }
    });

    assert.ok(navMenu.classList.contains('active'), 'Menu should stay open when clicking inside');
});
