import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import Utils from './utils.js';

// Mock Setup
const localStorageStore = new Map();

global.localStorage = {
    getItem: (key) => localStorageStore.get(key) || null,
    setItem: (key, value) => localStorageStore.set(key, value.toString()),
    removeItem: (key) => localStorageStore.delete(key),
    clear: () => localStorageStore.clear()
};

// Mock DOM elements
class MockElement {
    constructor(tagName) {
        this.tagName = tagName.toUpperCase();
        this.attributes = new Map();
        this.classList = new Set();
        this.style = {};
        this.children = [];
        this.parentNode = null;
        this.textContent = '';
        this.offsetHeight = 100; // Default height
    }

    getAttribute(name) {
        return this.attributes.get(name) || null;
    }

    setAttribute(name, value) {
        this.attributes.set(name, value);
    }

    getBoundingClientRect() {
        return { top: 200, left: 0, width: 100, height: 100 };
    }

    addEventListener(event, callback) {
        if (!this.listeners) this.listeners = {};
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    // Helper to trigger events
    trigger(event, eventData = {}) {
        if (this.listeners && this.listeners[event]) {
            this.listeners[event].forEach(cb => cb({ ...eventData, preventDefault: () => {} }));
        }
    }
}

global.document = {
    body: {
        firstChild: null,
        insertBefore: mock.fn((newNode, refNode) => {
            // simpler implementation for verification
        })
    },
    createElement: mock.fn((tag) => new MockElement(tag)),
    querySelector: mock.fn(),
    querySelectorAll: mock.fn()
};

global.window = {
    pageYOffset: 0,
    scrollTo: mock.fn()
};

describe('Utils Module', () => {

    describe('ProgressTracker', () => {
        beforeEach(() => {
            localStorage.clear();
        });

        it('should start with empty progress', () => {
            const progress = Utils.ProgressTracker.getProgress();
            assert.deepEqual(progress, {});
            assert.equal(Utils.ProgressTracker.getCompletedCount(), 0);
        });

        it('should mark a chapter as complete', () => {
            Utils.ProgressTracker.markChapterComplete('chapter-1');

            const progress = Utils.ProgressTracker.getProgress();
            assert.ok(progress['chapter-1'].completed);
            assert.ok(progress['chapter-1'].completedAt);
            assert.equal(Utils.ProgressTracker.isChapterComplete('chapter-1'), true);
            assert.equal(Utils.ProgressTracker.getCompletedCount(), 1);
        });

        it('should handle multiple chapters', () => {
            Utils.ProgressTracker.markChapterComplete('chapter-1');
            Utils.ProgressTracker.markChapterComplete('chapter-2');

            assert.equal(Utils.ProgressTracker.getCompletedCount(), 2);
            assert.equal(Utils.ProgressTracker.isChapterComplete('chapter-1'), true);
            assert.equal(Utils.ProgressTracker.isChapterComplete('chapter-2'), true);
            assert.equal(Utils.ProgressTracker.isChapterComplete('chapter-3'), false);
        });

        it('should reset progress', () => {
            Utils.ProgressTracker.markChapterComplete('chapter-1');
            Utils.ProgressTracker.reset();

            assert.deepEqual(Utils.ProgressTracker.getProgress(), {});
            assert.equal(Utils.ProgressTracker.getCompletedCount(), 0);
        });
    });

    describe('initAccessibilityEnhancements', () => {
        beforeEach(() => {
            // Reset mocks
            global.document.querySelector.mock.resetCalls();
            global.document.createElement.mock.resetCalls();
            global.document.body.insertBefore.mock.resetCalls();
        });

        it('should add skip link if it does not exist', () => {
            // Mock querySelector to return null for .skip-link
            global.document.querySelector.mock.mockImplementation((selector) => {
                if (selector === '.skip-link') return null;
                return new MockElement('div');
            });

            Utils.initAccessibilityEnhancements();

            assert.equal(global.document.createElement.mock.calls.length, 1);
            assert.equal(global.document.createElement.mock.calls[0].arguments[0], 'a');
            assert.equal(global.document.body.insertBefore.mock.calls.length, 1);
        });

        it('should not add skip link if it already exists', () => {
            // Mock querySelector to return element for .skip-link
            global.document.querySelector.mock.mockImplementation((selector) => {
                if (selector === '.skip-link') return new MockElement('a');
                return new MockElement('div');
            });

            Utils.initAccessibilityEnhancements();

            assert.equal(global.document.createElement.mock.calls.length, 0);
            assert.equal(global.document.body.insertBefore.mock.calls.length, 0);
        });

        it('should add ARIA label to main navigation if missing', () => {
            const nav = new MockElement('nav');
            global.document.querySelector.mock.mockImplementation((selector) => {
                if (selector === '.main-nav') return nav;
                return new MockElement('div');
            });

            Utils.initAccessibilityEnhancements();

            assert.equal(nav.getAttribute('aria-label'), 'Main navigation');
        });

        it('should add roles to landmarks if missing', () => {
            const main = new MockElement('main');
            const header = new MockElement('header');
            const footer = new MockElement('footer');

            global.document.querySelector.mock.mockImplementation((selector) => {
                if (selector === 'main') return main;
                if (selector === '.site-header') return header;
                if (selector === '.site-footer') return footer;
                return new MockElement('div');
            });

            Utils.initAccessibilityEnhancements();

            assert.equal(main.getAttribute('role'), 'main');
            assert.equal(header.getAttribute('role'), 'banner');
            assert.equal(footer.getAttribute('role'), 'contentinfo');
        });
    });

    describe('initSmoothScroll', () => {
        beforeEach(() => {
            global.document.querySelectorAll.mock.resetCalls();
            global.window.scrollTo.mock.resetCalls();
        });

        it('should attach click event listeners to anchor links', () => {
            const anchor = new MockElement('a');
            anchor.setAttribute('href', '#target');

            global.document.querySelectorAll.mock.mockImplementation((selector) => {
                if (selector === 'a[href^="#"]') return [anchor];
                return [];
            });

            Utils.initSmoothScroll();

            // Check if listener attached
            assert.ok(anchor.listeners['click']);
            assert.equal(anchor.listeners['click'].length, 1);
        });

        it('should scroll to target on click', () => {
            const anchor = new MockElement('a');
            anchor.setAttribute('href', '#target');

            const target = new MockElement('div');

            global.document.querySelectorAll.mock.mockImplementation((selector) => {
                if (selector === 'a[href^="#"]') return [anchor];
                return [];
            });

            global.document.querySelector.mock.mockImplementation((selector) => {
                if (selector === '#target') return target;
                if (selector === '.site-header') return { offsetHeight: 70 }; // Mock header
                return null;
            });

            Utils.initSmoothScroll();

            // Simulate click
            const preventDefault = mock.fn();
            anchor.listeners['click'][0].call(anchor, { preventDefault });

            assert.equal(preventDefault.mock.calls.length, 1);
            assert.equal(global.window.scrollTo.mock.calls.length, 1);

            // Check arguments to scrollTo
            const args = global.window.scrollTo.mock.calls[0].arguments[0];
            assert.ok(args.top !== undefined);
            assert.equal(args.behavior, 'smooth');
        });

        it('should ignore links with just "#"', () => {
             const anchor = new MockElement('a');
            anchor.setAttribute('href', '#');

            global.document.querySelectorAll.mock.mockImplementation((selector) => {
                if (selector === 'a[href^="#"]') return [anchor];
                return [];
            });

             Utils.initSmoothScroll();

            // Simulate click
            const preventDefault = mock.fn();
            anchor.listeners['click'][0].call(anchor, { preventDefault });

            assert.equal(preventDefault.mock.calls.length, 0);
            assert.equal(global.window.scrollTo.mock.calls.length, 0);
        });
    });
});
