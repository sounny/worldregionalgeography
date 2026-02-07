import assert from 'node:assert';
import Utils from '../js/modules/utils.js';

// Minimal mock for DOM elements
class MockElement {
    constructor(tagName) {
        this.tagName = tagName.toUpperCase();
        this._attributes = new Map();
        this._classList = new Set();
        this.children = [];
        this.parentNode = null;
        this.textContent = '';
        this._href = '';
    }

    getAttribute(name) {
        return this._attributes.has(name) ? this._attributes.get(name) : null;
    }

    setAttribute(name, value) {
        this._attributes.set(name, String(value));
        if (name === 'class') {
            this._classList = new Set(String(value).split(' ').filter(c => c));
        }
    }

    hasAttribute(name) {
        return this._attributes.has(name);
    }

    get className() {
        return this.getAttribute('class') || '';
    }

    set className(value) {
        this.setAttribute('class', value);
    }

    get classList() {
        const sync = () => {
            const classString = Array.from(this._classList).join(' ');
            this._attributes.set('class', classString);
        };

        return {
            add: (...classes) => {
                classes.forEach(c => this._classList.add(c));
                sync();
            },
            remove: (...classes) => {
                classes.forEach(c => this._classList.delete(c));
                sync();
            },
            contains: (c) => this._classList.has(c),
            toggle: (c) => {
                if (this._classList.has(c)) {
                    this._classList.delete(c);
                } else {
                    this._classList.add(c);
                }
                sync();
            }
        };
    }

    get href() {
        return this._href;
    }

    set href(value) {
        this._href = value;
        this.setAttribute('href', value);
    }

    insertBefore(newNode, referenceNode) {
        newNode.parentNode = this;
        if (referenceNode) {
            const index = this.children.indexOf(referenceNode);
            if (index > -1) {
                this.children.splice(index, 0, newNode);
            } else {
                this.children.push(newNode);
            }
        } else {
            this.children.push(newNode);
        }
        return newNode;
    }

    appendChild(newNode) {
        newNode.parentNode = this;
        this.children.push(newNode);
        return newNode;
    }

    get firstChild() {
        return this.children.length > 0 ? this.children[0] : null;
    }

    // Helper to find child by class (shallow search for simplicity in this context)
    querySelector(selector) {
        // Very basic selector matching
        if (selector.startsWith('.')) {
            const className = selector.substring(1);
            return this.children.find(child => child.className.includes(className)) || null;
        }
        return null;
    }
}

// Global Document Mock
global.document = {
    body: new MockElement('BODY'),

    createElement(tagName) {
        return new MockElement(tagName);
    },

    querySelector(selector) {
        // This will be overridden in tests or we can implement a basic registry
        return null;
    },

    querySelectorAll(selector) {
        return [];
    }
};

global.window = {
    pageYOffset: 0,
    scrollTo: () => {}
};

// Test Suite
console.log('🧪 Testing Utils.initAccessibilityEnhancements...');

// Test 1: Add skip link if not present
{
    console.log('Test 1: Add skip link if missing...');

    // Setup
    document.body = new MockElement('BODY');
    // Add some initial content to body
    const initialContent = new MockElement('DIV');
    document.body.appendChild(initialContent);

    // Mock querySelector to return nothing for .skip-link
    document.querySelector = (selector) => {
        if (selector === '.skip-link') return null;
        return null;
    };

    // Run
    Utils.initAccessibilityEnhancements();

    // Verify
    const firstChild = document.body.firstChild;
    assert.strictEqual(firstChild.tagName, 'A', 'First child should be an anchor tag');
    assert.strictEqual(firstChild.className, 'skip-link', 'Should have class skip-link');
    assert.strictEqual(firstChild.getAttribute('href'), '#main-content', 'Should link to #main-content');
    assert.strictEqual(firstChild.textContent, 'Skip to main content', 'Should have correct text content');
    console.log('✅ Passed');
}

// Test 2: Do not add skip link if present
{
    console.log('Test 2: Do not add skip link if present...');

    // Setup
    document.body = new MockElement('BODY');
    const existingSkipLink = new MockElement('A');
    existingSkipLink.className = 'skip-link';
    document.body.appendChild(existingSkipLink);

    // Mock querySelector to return existing link
    document.querySelector = (selector) => {
        if (selector === '.skip-link') return existingSkipLink;
        return null;
    };

    // Run
    Utils.initAccessibilityEnhancements();

    // Verify
    assert.strictEqual(document.body.children.length, 1, 'Should not add another child');
    assert.strictEqual(document.body.firstChild, existingSkipLink, 'Should keep existing skip link');
    console.log('✅ Passed');
}

// Test 3: Add ARIA label to navigation
{
    console.log('Test 3: Add ARIA label to navigation...');

    // Setup
    const nav = new MockElement('NAV');
    nav.className = 'main-nav';

    document.querySelector = (selector) => {
        if (selector === '.main-nav') return nav;
        return null;
    };

    // Run
    Utils.initAccessibilityEnhancements();

    // Verify
    assert.strictEqual(nav.getAttribute('aria-label'), 'Main navigation');
    console.log('✅ Passed');
}

// Test 4: Do not overwrite existing ARIA label
{
    console.log('Test 4: Do not overwrite existing ARIA label...');

    // Setup
    const nav = new MockElement('NAV');
    nav.className = 'main-nav';
    nav.setAttribute('aria-label', 'Custom Nav');

    document.querySelector = (selector) => {
        if (selector === '.main-nav') return nav;
        return null;
    };

    // Run
    Utils.initAccessibilityEnhancements();

    // Verify
    assert.strictEqual(nav.getAttribute('aria-label'), 'Custom Nav');
    console.log('✅ Passed');
}

// Test 5: Add landmark roles
{
    console.log('Test 5: Add landmark roles...');

    // Setup
    const main = new MockElement('MAIN');
    const header = new MockElement('HEADER');
    header.className = 'site-header';
    const footer = new MockElement('FOOTER');
    footer.className = 'site-footer';

    document.querySelector = (selector) => {
        if (selector === 'main') return main;
        if (selector === '.site-header') return header;
        if (selector === '.site-footer') return footer;
        return null;
    };

    // Run
    Utils.initAccessibilityEnhancements();

    // Verify
    assert.strictEqual(main.getAttribute('role'), 'main');
    assert.strictEqual(header.getAttribute('role'), 'banner');
    assert.strictEqual(footer.getAttribute('role'), 'contentinfo');
    console.log('✅ Passed');
}

// Test 6: Preserve existing landmark roles
{
    console.log('Test 6: Preserve existing landmark roles...');

    // Setup
    const main = new MockElement('MAIN');
    main.setAttribute('role', 'application'); // weird but valid for test

    document.querySelector = (selector) => {
        if (selector === 'main') return main;
        return null;
    };

    // Run
    Utils.initAccessibilityEnhancements();

    // Verify
    assert.strictEqual(main.getAttribute('role'), 'application');
    console.log('✅ Passed');
}

console.log('\n✨ All tests passed!');
