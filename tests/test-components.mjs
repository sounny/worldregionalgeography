
import test from 'node:test';
import assert from 'node:assert';
import Components from '../js/modules/components.js';

// Mock DOM
class MockElement {
    constructor(tagName) {
        this.tagName = tagName.toUpperCase();
        this._classList = new Set();
        this.classList = {
            add: (c) => this._classList.add(c),
            remove: (c) => this._classList.delete(c),
            toggle: (c, force) => {
                if (force === undefined) {
                    this._classList.has(c) ? this._classList.delete(c) : this._classList.add(c);
                } else {
                    force ? this._classList.add(c) : this._classList.delete(c);
                }
            },
            contains: (c) => this._classList.has(c)
        };
        this.attributes = new Map();
        this.eventListeners = new Map();
        this.children = [];
        this.id = '';
        this.parentElement = null;
        this.dataset = {};
    }

    setAttribute(name, value) {
        this.attributes.set(name, String(value));
        if (name === 'id') this.id = value;
    }

    getAttribute(name) {
        return this.attributes.get(name);
    }

    appendChild(child) {
        this.children.push(child);
        child.parentElement = this;
    }

    querySelector(selector) {
        if (selector.startsWith('.')) {
            const className = selector.substring(1);

            const find = (element) => {
                if (element.classList.contains(className)) return element;
                for (const child of element.children) {
                    const found = find(child);
                    if (found) return found;
                }
                return null;
            }

            // Search descendants
            for (const child of this.children) {
                 const found = find(child);
                 if (found) return found;
            }
            return null;
        }
        return null;
    }

    addEventListener(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    // Helper to trigger events
    trigger(event, eventObj = {}) {
        const listeners = this.eventListeners.get(event) || [];
        listeners.forEach(cb => cb({
            preventDefault: () => {},
            ...eventObj
        }));
    }

    click() {
        this.trigger('click');
    }
}

// Global Document Mock
global.document = {
    _elements: [], // Store elements created/queried for test setup

    createElement: (tag) => new MockElement(tag),

    querySelectorAll: (selector) => {
        if (selector.startsWith('.')) {
            const className = selector.substring(1);
            return global.document._elements.filter(el => el.classList.contains(className));
        }
        return [];
    },

    // Helper to clear for next test
    _reset: () => {
        global.document._elements = [];
    }
};

global.window = {};

test('Components.initAccordions initialization', (t) => {
    document._reset();

    // Setup DOM structure
    const item = document.createElement('div');
    item.classList.add('accordion-item');

    const header = document.createElement('button');
    header.classList.add('accordion-header');
    item.appendChild(header);

    const content = document.createElement('div');
    content.classList.add('accordion-content');
    item.appendChild(content);

    document._elements.push(item);

    // Run initialization
    Components.initAccordions();

    // Assertions
    assert.ok(header.id.startsWith('accordion-header-'), 'Header should have generated ID');
    assert.ok(content.id.startsWith('accordion-content-'), 'Content should have generated ID');

    assert.strictEqual(header.getAttribute('aria-controls'), content.id, 'Header aria-controls should point to content ID');
    assert.strictEqual(content.getAttribute('aria-labelledby'), header.id, 'Content aria-labelledby should point to header ID');

    assert.strictEqual(header.getAttribute('role'), 'button');
    assert.strictEqual(header.getAttribute('tabindex'), '0');
    assert.strictEqual(content.getAttribute('role'), 'region');

    // Default state (not active)
    assert.strictEqual(header.getAttribute('aria-expanded'), 'false');
    assert.strictEqual(content.getAttribute('aria-hidden'), 'true');
    assert.strictEqual(item.classList.contains('active'), false);
});

test('Components.initAccordions click interaction', (t) => {
    document._reset();

    const item = document.createElement('div');
    item.classList.add('accordion-item');

    const header = document.createElement('button');
    header.classList.add('accordion-header');
    item.appendChild(header);

    const content = document.createElement('div');
    content.classList.add('accordion-content');
    item.appendChild(content);

    document._elements.push(item);

    Components.initAccordions();

    // Simulate Click
    header.click();

    assert.strictEqual(item.classList.contains('active'), true, 'Click should toggle active class');
    assert.strictEqual(header.getAttribute('aria-expanded'), 'true', 'Click should set aria-expanded to true');
    assert.strictEqual(content.getAttribute('aria-hidden'), 'false', 'Click should set aria-hidden to false');

    // Click again to close
    header.click();

    assert.strictEqual(item.classList.contains('active'), false, 'Second click should remove active class');
    assert.strictEqual(header.getAttribute('aria-expanded'), 'false');
    assert.strictEqual(content.getAttribute('aria-hidden'), 'true');
});

test('Components.initAccordions keyboard interaction', (t) => {
    document._reset();

    const item = document.createElement('div');
    item.classList.add('accordion-item');

    const header = document.createElement('button');
    header.classList.add('accordion-header');
    item.appendChild(header);

    const content = document.createElement('div');
    content.classList.add('accordion-content');
    item.appendChild(content);

    document._elements.push(item);

    Components.initAccordions();

    // Simulate Enter key
    header.trigger('keydown', { key: 'Enter' });
    assert.strictEqual(item.classList.contains('active'), true, 'Enter key should toggle active class');

    // Simulate Space key
    header.trigger('keydown', { key: ' ' });
    assert.strictEqual(item.classList.contains('active'), false, 'Space key should toggle active class');

    // Simulate other key (e.g., 'a')
    header.trigger('keydown', { key: 'a' });
    assert.strictEqual(item.classList.contains('active'), false, 'Other keys should not toggle active class');
});

test('Components.initAccordions edge cases', (t) => {
    document._reset();

    // Case 1: Missing header
    const itemNoHeader = document.createElement('div');
    itemNoHeader.classList.add('accordion-item');
    const contentOnly = document.createElement('div');
    contentOnly.classList.add('accordion-content');
    itemNoHeader.appendChild(contentOnly);

    document._elements.push(itemNoHeader);

    // Case 2: Existing IDs
    const itemWithIds = document.createElement('div');
    itemWithIds.classList.add('accordion-item');

    const headerWithId = document.createElement('button');
    headerWithId.classList.add('accordion-header');
    headerWithId.id = 'existing-header-id';
    itemWithIds.appendChild(headerWithId);

    const contentWithId = document.createElement('div');
    contentWithId.classList.add('accordion-content');
    contentWithId.id = 'existing-content-id';
    itemWithIds.appendChild(contentWithId);

    document._elements.push(itemWithIds);

    // Case 3: Initially Active
    const itemActive = document.createElement('div');
    itemActive.classList.add('accordion-item');
    itemActive.classList.add('active');

    const headerActive = document.createElement('button');
    headerActive.classList.add('accordion-header');
    itemActive.appendChild(headerActive);

    const contentActive = document.createElement('div');
    contentActive.classList.add('accordion-content');
    itemActive.appendChild(contentActive);

    document._elements.push(itemActive);

    // Run Init
    Components.initAccordions();

    // Verify Case 1: Should not crash

    // Verify Case 2: IDs preserved
    assert.strictEqual(headerWithId.id, 'existing-header-id');
    assert.strictEqual(contentWithId.id, 'existing-content-id');
    assert.strictEqual(headerWithId.getAttribute('aria-controls'), 'existing-content-id');

    // Verify Case 3: Initially Active state respected
    assert.strictEqual(headerActive.getAttribute('aria-expanded'), 'true');
    assert.strictEqual(contentActive.getAttribute('aria-hidden'), 'false');
});
