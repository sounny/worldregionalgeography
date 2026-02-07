import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';

// Mock DOM Environment
class MockElement {
    constructor(tagName = 'div') {
        this.tagName = tagName.toUpperCase();
        this.listeners = {};
        this.attributes = {};
        this.classList = {
            _list: new Set(),
            add: function(cls) { this._list.add(cls); },
            remove: function(cls) { this._list.delete(cls); },
            contains: function(cls) { return this._list.has(cls); },
            toggle: function(cls) {
                if (this._list.has(cls)) this._list.delete(cls);
                else this._list.add(cls);
            }
        };
        this.style = {};
        this.top = 0;
        this.offsetHeight = 0;
    }

    addEventListener(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    getAttribute(name) {
        return this.attributes[name] || null;
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    getBoundingClientRect() {
        return { top: this.top, bottom: 0, left: 0, right: 0, width: 0, height: this.offsetHeight };
    }

    // Helper to manually trigger event
    trigger(event, eventData = {}) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => {
                // Call with 'this' bound to the element
                cb.call(this, {
                    ...eventData,
                    preventDefault: eventData.preventDefault || (() => {})
                });
            });
        }
    }
}

// Global mocks
global.window = {
    scrollTo: () => {}, // Mocked per test
    pageYOffset: 0
};

global.document = {
    querySelectorAll: () => [], // Mocked per test
    querySelector: () => null,   // Mocked per test
    createElement: (tag) => new MockElement(tag),
    body: new MockElement('body')
};

// Import the module to test
import Utils from '../js/modules/utils.js';

describe('Utils.initSmoothScroll', () => {
    let scrollToCalls = [];
    let anchors = [];

    beforeEach(() => {
        // Reset mocks
        scrollToCalls = [];
        anchors = [];

        // Mock window.scrollTo
        global.window.scrollTo = (options) => {
            scrollToCalls.push(options);
        };
        global.window.pageYOffset = 0;

        // Mock document.querySelectorAll
        global.document.querySelectorAll = (selector) => {
            if (selector === 'a[href^="#"]') {
                return anchors;
            }
            return [];
        };

        // Mock document.querySelector
        global.document.querySelector = (selector) => {
            // Default header mock
            if (selector === '.site-header') {
                const header = new MockElement('header');
                header.offsetHeight = 70;
                return header;
            }
            return null;
        };
    });

    it('should attach click event listeners to anchor links', () => {
        const anchor = new MockElement('a');
        anchor.setAttribute('href', '#target');
        anchors.push(anchor);

        Utils.initSmoothScroll();

        assert.ok(anchor.listeners['click'], 'Click listener should be attached');
        assert.strictEqual(anchor.listeners['click'].length, 1, 'Should have exactly one listener');
    });

    it('should scroll to target element on click', () => {
        const anchor = new MockElement('a');
        anchor.setAttribute('href', '#section1');
        anchors.push(anchor);

        // Mock the target element
        const targetElement = new MockElement('div');
        targetElement.top = 500; // Element is at 500px from top of viewport

        // Override querySelector to return our target
        const originalQuerySelector = global.document.querySelector;
        global.document.querySelector = (selector) => {
            if (selector === '#section1') return targetElement;
            return originalQuerySelector(selector);
        };

        Utils.initSmoothScroll();

        let preventDefaultCalled = false;
        anchor.trigger('click', {
            preventDefault: () => { preventDefaultCalled = true; }
        });

        assert.strictEqual(preventDefaultCalled, true, 'Should prevent default link behavior');
        assert.strictEqual(scrollToCalls.length, 1, 'Should call window.scrollTo');

        // Expected calculation: target.top (500) + window.pageYOffset (0) - headerHeight (70) = 430
        assert.deepStrictEqual(scrollToCalls[0], {
            top: 430,
            behavior: 'smooth'
        });
    });

    it('should handle window.pageYOffset correctly', () => {
        const anchor = new MockElement('a');
        anchor.setAttribute('href', '#section2');
        anchors.push(anchor);

        const targetElement = new MockElement('div');
        targetElement.top = 200; // Relative to viewport
        global.window.pageYOffset = 1000; // Scrolled down 1000px

        const originalQuerySelector = global.document.querySelector;
        global.document.querySelector = (selector) => {
            if (selector === '#section2') return targetElement;
            return originalQuerySelector(selector);
        };

        Utils.initSmoothScroll();

        anchor.trigger('click', {});

        // Expected: 200 + 1000 - 70 = 1130
        assert.strictEqual(scrollToCalls[0].top, 1130);
    });

    it('should ignore links with href="#"', () => {
        const anchor = new MockElement('a');
        anchor.setAttribute('href', '#');
        anchors.push(anchor);

        Utils.initSmoothScroll();

        let preventDefaultCalled = false;
        anchor.trigger('click', {
            preventDefault: () => { preventDefaultCalled = true; }
        });

        assert.strictEqual(preventDefaultCalled, false, 'Should NOT prevent default for "#"');
        assert.strictEqual(scrollToCalls.length, 0, 'Should NOT call window.scrollTo');
    });

    it('should do nothing if target element does not exist', () => {
        const anchor = new MockElement('a');
        anchor.setAttribute('href', '#missing');
        anchors.push(anchor);

        // Ensure querySelector returns null for #missing (default behavior of our mock)

        Utils.initSmoothScroll();

        let preventDefaultCalled = false;
        anchor.trigger('click', {
            preventDefault: () => { preventDefaultCalled = true; }
        });

        assert.strictEqual(preventDefaultCalled, false, 'Should NOT prevent default if target missing');
        assert.strictEqual(scrollToCalls.length, 0, 'Should NOT call window.scrollTo');
    });
});
