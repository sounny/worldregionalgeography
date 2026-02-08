import test from 'node:test';
import assert from 'node:assert/strict';

// --- Mock DOM Implementation ---

class MockElement {
    constructor(tagName, classes = []) {
        this.tagName = tagName.toUpperCase();
        this.classList = {
            _classes: new Set(classes),
            add: (c) => this.classList._classes.add(c),
            remove: (c) => this.classList._classes.delete(c),
            toggle: (c) => {
                if (this.classList._classes.has(c)) this.classList._classes.delete(c);
                else this.classList._classes.add(c);
            },
            contains: (c) => this.classList._classes.has(c),
            value: () => Array.from(this.classList._classes).join(' ')
        };
        this.attributes = new Map();
        this.listeners = {};
        this.children = [];
        this.parentNode = null;
        this.style = {};
    }

    setAttribute(name, value) {
        this.attributes.set(name, String(value));
    }

    getAttribute(name) {
        return this.attributes.get(name);
    }

    addEventListener(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    // Simulate event triggering
    dispatchEvent(event) {
        if (this.listeners[event.type]) {
            this.listeners[event.type].forEach(cb => cb(event));
        }
        // Simple bubbling
        if (event.bubbles && this.parentNode) {
            this.parentNode.dispatchEvent(event);
        }
    }

    click() {
        const event = {
            type: 'click',
            target: this,
            preventDefault: () => {},
            stopPropagation: () => {},
            bubbles: true
        };
        this.dispatchEvent(event);
    }

    appendChild(child) {
        this.children.push(child);
        child.parentNode = this;
    }

    querySelector(selector) {
        // Simple mock implementation for direct children or specific test setup
        return this.children.find(child => child.matches(selector)) || null;
    }

    querySelectorAll(selector) {
        return this.children.filter(child => child.matches(selector));
    }

    matches(selector) {
        if (!selector) return false;
        if (selector.startsWith('.')) {
            return this.classList.contains(selector.substring(1));
        }
        if (selector.startsWith('#')) {
            return this.getAttribute('id') === selector.substring(1);
        }
        return this.tagName === selector.toUpperCase();
    }

    closest(selector) {
        if (this.matches(selector)) return this;
        if (this.parentNode) return this.parentNode.closest(selector);
        return null;
    }
}

// Global Document Mock
const documentListeners = {};
global.document = {
    createElement: (tag) => new MockElement(tag),
    querySelector: () => null, // Default
    querySelectorAll: () => [], // Default
    addEventListener: (event, callback) => {
        if (!documentListeners[event]) documentListeners[event] = [];
        documentListeners[event].push(callback);
    },
    // Helper to clear listeners between tests
    _clearListeners: () => {
        for (const key in documentListeners) delete documentListeners[key];
    },
    // Helper to trigger document events
    _dispatchEvent: (event) => {
        if (documentListeners[event.type]) {
            documentListeners[event.type].forEach(cb => cb(event));
        }
    }
};

global.window = {
    innerWidth: 1024
};

// Import the module under test
import Navigation from '../js/modules/navigation.js';

// --- Tests ---

test('Navigation Module Tests', async (t) => {

    // Helper to reset document state
    const resetDocument = () => {
        global.document._clearListeners();
        global.document.querySelector = () => null;
        global.document.querySelectorAll = () => [];
        global.window.innerWidth = 1024;
    };

    await t.test('initMobileToggle toggles active class and aria-expanded', () => {
        resetDocument();

        const navToggle = new MockElement('button', ['nav-toggle']);
        navToggle.setAttribute('aria-expanded', 'false');

        const navMenu = new MockElement('div', ['nav-menu']);

        // Setup document.querySelector to return these
        global.document.querySelector = (selector) => {
            if (selector === '.nav-toggle') return navToggle;
            if (selector === '.nav-menu') return navMenu;
            return null;
        };

        Navigation.initMobileToggle();

        // Simulate click
        navToggle.click();

        assert.strictEqual(navToggle.getAttribute('aria-expanded'), 'true', 'aria-expanded should be true');
        assert.ok(navMenu.classList.contains('active'), 'nav-menu should have active class');

        // Toggle back
        navToggle.click();
        assert.strictEqual(navToggle.getAttribute('aria-expanded'), 'false', 'aria-expanded should be false');
        assert.strictEqual(navMenu.classList.contains('active'), false, 'nav-menu should not have active class');
    });

    await t.test('initDropdowns toggles on mobile (<= 768px)', () => {
        resetDocument();
        global.window.innerWidth = 768;

        const dropdown = new MockElement('div', ['nav-dropdown']);
        const toggle = new MockElement('a', ['dropdown-toggle']);
        dropdown.appendChild(toggle);

        global.document.querySelectorAll = (selector) => {
            if (selector === '.nav-dropdown') return [dropdown];
            return [];
        };

        Navigation.initDropdowns();

        // Simulate click
        // We need to capture preventDefault
        let prevented = false;
        const event = {
            type: 'click',
            target: toggle,
            preventDefault: () => { prevented = true; },
            bubbles: true
        };

        // Manually dispatch to toggle because our MockElement.click() creates its own event
        // but here we need to inspect preventDefault.
        // Or we can just use toggle.click() and check side effects.
        // But the listener is attached to 'toggle'.

        // Navigation.js: toggle.addEventListener('click', ...)
        // So let's trigger it.
        toggle.listeners['click'][0](event);

        assert.strictEqual(prevented, true, 'Should prevent default on mobile');
        assert.ok(dropdown.classList.contains('active'), 'Dropdown should be active');
    });

    await t.test('initDropdowns does NOT toggle on desktop (> 768px)', () => {
        resetDocument();
        global.window.innerWidth = 769;

        const dropdown = new MockElement('div', ['nav-dropdown']);
        const toggle = new MockElement('a', ['dropdown-toggle']);
        dropdown.appendChild(toggle);

        global.document.querySelectorAll = (selector) => {
            if (selector === '.nav-dropdown') return [dropdown];
            return [];
        };

        Navigation.initDropdowns();

        let prevented = false;
        const event = {
            type: 'click',
            target: toggle,
            preventDefault: () => { prevented = true; },
            bubbles: true
        };

        // Trigger listener
        toggle.listeners['click'][0](event);

        assert.strictEqual(prevented, false, 'Should not prevent default on desktop');
        assert.strictEqual(dropdown.classList.contains('active'), false, 'Dropdown should not be active');
    });

    await t.test('initOutsideClick closes menu when clicking outside', () => {
        resetDocument();

        const navMenu = new MockElement('div', ['nav-menu', 'active']);
        const navToggle = new MockElement('button', ['nav-toggle']);
        navToggle.setAttribute('aria-expanded', 'true');

        global.document.querySelector = (selector) => {
            if (selector === '.nav-menu') return navMenu;
            if (selector === '.nav-toggle') return navToggle;
            return null;
        };

        Navigation.initOutsideClick();

        // Simulate click on document body (outside nav)
        const outsideElement = new MockElement('div', ['content']);
        // Mock closest to return null for .main-nav
        outsideElement.closest = (sel) => {
            if (sel === '.main-nav') return null;
            return null;
        };

        const event = {
            type: 'click',
            target: outsideElement
        };

        global.document._dispatchEvent(event);

        assert.strictEqual(navMenu.classList.contains('active'), false, 'Menu should close');
        assert.strictEqual(navToggle.getAttribute('aria-expanded'), 'false', 'Toggle should contract');
    });

    await t.test('initOutsideClick keeps menu open when clicking inside', () => {
        resetDocument();

        const navMenu = new MockElement('div', ['nav-menu', 'active']);
        const navToggle = new MockElement('button', ['nav-toggle']);
        navToggle.setAttribute('aria-expanded', 'true');

        global.document.querySelector = (selector) => {
            if (selector === '.nav-menu') return navMenu;
            if (selector === '.nav-toggle') return navToggle;
            return null;
        };

        Navigation.initOutsideClick();

        // Simulate click inside .main-nav
        const insideElement = new MockElement('span', ['nav-text']);
        // Mock closest to return something for .main-nav
        insideElement.closest = (sel) => {
            if (sel === '.main-nav') return new MockElement('nav', ['main-nav']);
            return null;
        };

        const event = {
            type: 'click',
            target: insideElement
        };

        global.document._dispatchEvent(event);

        assert.ok(navMenu.classList.contains('active'), 'Menu should remain open');
        assert.strictEqual(navToggle.getAttribute('aria-expanded'), 'true', 'Toggle should remain expanded');
    });
});
