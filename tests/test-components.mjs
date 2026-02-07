
import { test, describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

// --- Mocks ---

class MockElement {
    constructor(tagName, className = '') {
        this.tagName = tagName.toUpperCase();
        this._classList = new Set(className.split(' ').filter(c => c));
        this.attributes = new Map();
        this.eventListeners = new Map();
        this.children = [];
        this.id = '';
        this.dataset = {};
    }

    get classList() {
        return {
            add: (...classes) => classes.forEach(c => this._classList.add(c)),
            remove: (...classes) => classes.forEach(c => this._classList.delete(c)),
            toggle: (c, force) => {
                if (force === undefined) {
                    force = !this._classList.has(c);
                }
                if (force) this._classList.add(c);
                else this._classList.delete(c);
                return force;
            },
            contains: (c) => this._classList.has(c),
            entries: () => this._classList.entries(),
            values: () => this._classList.values(),
            [Symbol.iterator]: () => this._classList.values()
        };
    }

    // Support getting/setting className string
    get className() {
        return Array.from(this._classList).join(' ');
    }

    set className(val) {
        this._classList = new Set(val.split(' ').filter(c => c));
    }

    setAttribute(name, value) {
        this.attributes.set(name, String(value));
    }

    getAttribute(name) {
        return this.attributes.get(name) || null;
    }

    hasAttribute(name) {
        return this.attributes.has(name);
    }

    addEventListener(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    // Helper to manually trigger event
    dispatchEvent(event) {
        const listeners = this.eventListeners.get(event.type) || [];
        listeners.forEach(cb => cb(event));
        return !event.defaultPrevented;
    }

    // Helper for specific click
    click() {
        this.dispatchEvent({ type: 'click', target: this, preventDefault: () => {} });
    }

    querySelector(selector) {
        // Simple class selector support for now
        if (selector.startsWith('.')) {
            const className = selector.substring(1);
            return this.children.find(child => child.classList.contains(className)) || null;
        }
        return null;
    }

    appendChild(child) {
        this.children.push(child);
    }
}

class MockDocument {
    constructor() {
        this.elements = [];
    }

    querySelectorAll(selector) {
        // Simple class selector support
        if (selector.startsWith('.')) {
            const className = selector.substring(1);
            return this.elements.filter(el => el.classList.contains(className));
        }
        return [];
    }

    createElement(tag) {
        return new MockElement(tag);
    }
}

// Setup Global Mocks
const mockDoc = new MockDocument();
global.document = mockDoc;
global.window = {};

// Import the module under test
import Components from '../js/modules/components.js';

describe('Components.initTexasToggle', () => {

    beforeEach(() => {
        // Reset the mock document elements before each test
        mockDoc.elements = [];
    });

    it('should initialize ARIA attributes and classes correctly', () => {
        const toggle = new MockElement('div', 'texas-toggle');
        const btn = new MockElement('button', 'btn-texas-toggle');
        const content = new MockElement('div', 'texas-content hidden'); // Initially hidden

        toggle.appendChild(btn);
        toggle.appendChild(content);
        mockDoc.elements.push(toggle);

        Components.initTexasToggle();

        // Check ID generation
        assert.ok(content.id.startsWith('texas-connection-'), 'Content should have an ID generated');

        // Check ARIA attributes on button
        assert.equal(btn.getAttribute('aria-controls'), content.id);
        assert.equal(btn.getAttribute('role'), 'button');
        assert.equal(btn.getAttribute('tabindex'), '0');
        assert.equal(btn.getAttribute('aria-expanded'), 'false'); // Because content is hidden

        // Check ARIA attributes on content
        assert.equal(content.getAttribute('role'), 'region');
        assert.equal(content.getAttribute('aria-labelledby'), `${content.id}-label`);
        assert.equal(content.getAttribute('aria-hidden'), 'true');
    });

    it('should toggle state on click', () => {
        const toggle = new MockElement('div', 'texas-toggle');
        const btn = new MockElement('button', 'btn-texas-toggle');
        const content = new MockElement('div', 'texas-content hidden');

        toggle.appendChild(btn);
        toggle.appendChild(content);
        mockDoc.elements.push(toggle);

        Components.initTexasToggle();

        // Simulate Click
        btn.click();

        // Check updated state (Expanded)
        assert.equal(btn.getAttribute('aria-expanded'), 'true');
        assert.equal(content.getAttribute('aria-hidden'), 'false');
        assert.equal(content.classList.contains('hidden'), false);
        assert.equal(btn.classList.contains('active'), true);

        // Simulate Click again (Collapsed)
        btn.click();

        // Check updated state (Collapsed)
        assert.equal(btn.getAttribute('aria-expanded'), 'false');
        assert.equal(content.getAttribute('aria-hidden'), 'true');
        assert.equal(content.classList.contains('hidden'), true);
        assert.equal(btn.classList.contains('active'), false);
    });

    it('should handle keyboard navigation (Enter/Space)', () => {
        const toggle = new MockElement('div', 'texas-toggle');
        const btn = new MockElement('button', 'btn-texas-toggle');
        const content = new MockElement('div', 'texas-content hidden');

        toggle.appendChild(btn);
        toggle.appendChild(content);
        mockDoc.elements.push(toggle);

        Components.initTexasToggle();

        // Helper to simulate keydown
        const triggerKey = (key) => {
            let defaultPrevented = false;
            btn.dispatchEvent({
                type: 'keydown',
                key: key,
                preventDefault: () => { defaultPrevented = true; }
            });
            return defaultPrevented;
        };

        // Trigger Enter
        const enterPrevented = triggerKey('Enter');
        assert.equal(enterPrevented, true, 'Enter key should prevent default');
        assert.equal(btn.getAttribute('aria-expanded'), 'true', 'Enter key should toggle state');

        // Trigger Space
        const spacePrevented = triggerKey(' ');
        assert.equal(spacePrevented, true, 'Space key should prevent default');
        assert.equal(btn.getAttribute('aria-expanded'), 'false', 'Space key should toggle state again');

        // Trigger Other Key (e.g., 'A')
        const otherPrevented = triggerKey('A');
        assert.equal(otherPrevented, false, 'Other keys should not prevent default');
        assert.equal(btn.getAttribute('aria-expanded'), 'false', 'Other keys should not toggle state');
    });

    it('should gracefully handle missing child elements', () => {
        const toggleEmpty = new MockElement('div', 'texas-toggle');
        // No children

        const toggleNoBtn = new MockElement('div', 'texas-toggle');
        toggleNoBtn.appendChild(new MockElement('div', 'texas-content'));

        const toggleNoContent = new MockElement('div', 'texas-toggle');
        toggleNoContent.appendChild(new MockElement('button', 'btn-texas-toggle'));

        mockDoc.elements.push(toggleEmpty, toggleNoBtn, toggleNoContent);

        // Should not throw error
        assert.doesNotThrow(() => Components.initTexasToggle());
    });

    it('should do nothing if no toggles found', () => {
        mockDoc.elements = [];
        // Should not throw error
        assert.doesNotThrow(() => Components.initTexasToggle());
    });
});
