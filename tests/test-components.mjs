import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import Components from '../js/modules/components.js';

class MockElement {
    constructor(tagName = 'DIV') {
        this.tagName = tagName.toUpperCase();
        this.attributes = new Map();
        this.eventListeners = new Map();
        this.children = [];
        this.dataset = {};
        this.id = '';
        this.textContent = '';
        this.parentNode = null;

        this._classList = new Set();
    }

    get className() {
        return Array.from(this._classList).join(' ');
    }

    set className(val) {
        this._classList.clear();
        if (val) {
            val.split(/\s+/).filter(c => c).forEach(c => this._classList.add(c));
        }
    }

    get classList() {
        return {
            add: (...args) => args.forEach(c => this._classList.add(c)),
            remove: (...args) => args.forEach(c => this._classList.delete(c)),
            toggle: (c, force) => {
                if (force === true) { this._classList.add(c); return true; }
                if (force === false) { this._classList.delete(c); return false; }
                if (this._classList.has(c)) { this._classList.delete(c); return false; }
                else { this._classList.add(c); return true; }
            },
            contains: (c) => this._classList.has(c),
            // helper for testing
            has: (c) => this._classList.has(c)
        };
    }

    getAttribute(name) { return this.attributes.get(name); }
    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    removeAttribute(name) { this.attributes.delete(name); }

    addEventListener(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    // Test helper to trigger events
    dispatchEvent(event) {
        const listeners = this.eventListeners.get(event.type) || [];
        listeners.forEach(cb => cb(event));
        return !event.defaultPrevented;
    }

    click() {
        this.dispatchEvent({ type: 'click', target: this, preventDefault: () => {} });
    }

    appendChild(child) {
        this.children.push(child);
        child.parentNode = this;
        return child;
    }

    querySelector(selector) {
        return this.find(node => this.matches(node, selector));
    }

    querySelectorAll(selector) {
       const results = [];
       this.traverse(node => {
           if (this.matches(node, selector)) results.push(node);
       });
       return results;
    }

    find(predicate) {
        let result = null;
        this.traverse(node => {
            if (predicate(node) && !result) result = node;
        });
        return result;
    }

    traverse(callback) {
        for (const child of this.children) {
            callback(child);
            child.traverse(callback);
        }
    }

    matches(node, selector) {
        if (selector.startsWith('.')) return node.classList.contains(selector.substring(1));
        if (selector.startsWith('#')) return node.id === selector.substring(1);
        return node.tagName === selector.toUpperCase();
    }
}

// Setup global environment
global.document = {
    createElement: (tag) => new MockElement(tag),
    querySelectorAll: () => [],
    body: new MockElement('BODY')
};
global.window = { document: global.document };

describe('Components Module', () => {
    let documentBody;

    beforeEach(() => {
        // Reset document body and querySelectorAll before each test
        documentBody = new MockElement('BODY');
        global.document.body = documentBody;
        global.document.querySelectorAll = (selector) => documentBody.querySelectorAll(selector);
    });

    // Tests will be added here

    describe('initTexasToggle', () => {
        it('should initialize accessible attributes and handle interactions', () => {
            // Setup
            const container = new MockElement('DIV');
            container.classList.add('texas-toggle');

            const btn = new MockElement('BUTTON');
            btn.classList.add('btn-texas-toggle');

            const content = new MockElement('DIV');
            content.classList.add('texas-content');
            content.classList.add('hidden'); // Initially hidden

            container.appendChild(btn);
            container.appendChild(content);
            documentBody.appendChild(container);

            // Execute
            Components.initTexasToggle();

            // Verify Initialization
            assert.strictEqual(btn.getAttribute('role'), 'button', 'Button role should be set');
            assert.strictEqual(btn.getAttribute('tabindex'), '0', 'Button tabindex should be 0');
            assert.ok(btn.getAttribute('aria-controls'), 'Button should have aria-controls');
            assert.strictEqual(btn.getAttribute('aria-expanded'), 'false', 'Button should start collapsed');

            assert.strictEqual(content.getAttribute('role'), 'region', 'Content role should be region');
            assert.strictEqual(content.getAttribute('aria-hidden'), 'true', 'Content should start hidden');
            assert.ok(content.id, 'Content should have an ID');
            assert.strictEqual(btn.getAttribute('aria-controls'), content.id, 'Aria-controls should match content ID');

            // Verify Click Interaction
            btn.click();

            assert.strictEqual(btn.getAttribute('aria-expanded'), 'true', 'Button should expand on click');
            assert.strictEqual(content.getAttribute('aria-hidden'), 'false', 'Content should be visible');
            assert.ok(!content.classList.contains('hidden'), 'Hidden class should be removed');
            assert.ok(btn.classList.contains('active'), 'Active class should be added to button');

            // Verify Keydown Interaction (Enter)
            const enterEvent = {
                type: 'keydown',
                key: 'Enter',
                preventDefault: () => {}
            };
            let defaultPrevented = false;
            enterEvent.preventDefault = () => { defaultPrevented = true; };

            btn.dispatchEvent(enterEvent);

            assert.ok(defaultPrevented, 'Enter key should prevent default');
            // Check toggle back (it was expanded, now should be collapsed)
            assert.strictEqual(btn.getAttribute('aria-expanded'), 'false', 'Button should collapse on Enter');
        });
    });

    describe('initAccordions', () => {
        it('should initialize and toggle accordions', () => {
            // Setup
            const item = new MockElement('DIV');
            item.classList.add('accordion-item');

            const header = new MockElement('DIV');
            header.classList.add('accordion-header');

            const content = new MockElement('DIV');
            content.classList.add('accordion-content');

            item.appendChild(header);
            item.appendChild(content);
            documentBody.appendChild(item);

            // Execute
            Components.initAccordions();

            // Verify Initialization
            assert.strictEqual(header.getAttribute('role'), 'button');
            assert.strictEqual(header.getAttribute('tabindex'), '0');
            assert.ok(header.getAttribute('aria-controls'));
            assert.strictEqual(content.getAttribute('role'), 'region');
            assert.strictEqual(header.getAttribute('aria-controls'), content.id);

            // Initial state (not active)
            assert.strictEqual(header.getAttribute('aria-expanded'), 'false');
            assert.strictEqual(content.getAttribute('aria-hidden'), 'true');
            assert.ok(!item.classList.contains('active'));

            // Click Interaction
            header.click();

            assert.strictEqual(header.getAttribute('aria-expanded'), 'true');
            assert.strictEqual(content.getAttribute('aria-hidden'), 'false');
            assert.ok(item.classList.contains('active'));

            // Keydown Interaction (Space)
            const spaceEvent = {
                type: 'keydown',
                key: ' ',
                preventDefault: () => {}
            };
            let defaultPrevented = false;
            spaceEvent.preventDefault = () => { defaultPrevented = true; };

            header.dispatchEvent(spaceEvent);

            assert.ok(defaultPrevented, 'Space key should prevent default');
            assert.strictEqual(header.getAttribute('aria-expanded'), 'false', 'Should collapse on Space');
        });
    });

    describe('initKeyTerms', () => {
        it('should initialize tooltips and handle hover/focus events', () => {
            // Setup
            const term = new MockElement('SPAN');
            term.classList.add('term-highlight');
            term.dataset.definition = 'A specific definition';

            documentBody.appendChild(term);

            // Execute
            Components.initKeyTerms();

            // Verify Initialization
            const tooltip = term.children.find(child => child.classList.contains('term-tooltip'));
            assert.ok(tooltip, 'Tooltip should be created and appended');
            assert.strictEqual(tooltip.textContent, 'A specific definition', 'Tooltip text should match definition');

            // Mouse Interactions
            term.dispatchEvent({ type: 'mouseenter' });
            assert.ok(tooltip.classList.contains('visible'), 'Tooltip should be visible on mouseenter');

            term.dispatchEvent({ type: 'mouseleave' });
            assert.ok(!tooltip.classList.contains('visible'), 'Tooltip should NOT be visible on mouseleave');

            // Focus Interactions
            term.dispatchEvent({ type: 'focus' });
            assert.ok(tooltip.classList.contains('visible'), 'Tooltip should be visible on focus');

            term.dispatchEvent({ type: 'blur' });
            assert.ok(!tooltip.classList.contains('visible'), 'Tooltip should NOT be visible on blur');
        });
    });
});
