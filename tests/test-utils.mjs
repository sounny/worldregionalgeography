import { test, describe, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert';
import Utils from '../js/modules/utils.js';

describe('Utils Module', () => {
    let originalWindow;
    let originalDocument;
    let originalLocalStorage;

    // Storage for mocked localStorage
    let storageMap;

    beforeEach(() => {
        // Save original globals
        originalWindow = global.window;
        originalDocument = global.document;
        originalLocalStorage = global.localStorage;

        storageMap = new Map();

        // Mock window
        global.window = {
            scrollTo: mock.fn(),
            pageYOffset: 0
        };

        // Mock localStorage
        global.localStorage = {
            getItem: mock.fn((key) => storageMap.get(key) || null),
            setItem: mock.fn((key, value) => storageMap.set(key, value)),
            removeItem: mock.fn((key) => storageMap.delete(key)),
            clear: mock.fn(() => storageMap.clear())
        };

        // Mock document structure
        // We need a flexible mock that can handle querySelector calls
        const createElement = (tag) => ({
            tagName: tag.toUpperCase(),
            classList: {
                add: mock.fn(),
                remove: mock.fn(),
                contains: mock.fn(() => false)
            },
            style: {},
            dataset: {},
            getAttribute: mock.fn(() => null),
            setAttribute: mock.fn(),
            addEventListener: mock.fn(),
            getBoundingClientRect: mock.fn(() => ({ top: 100, left: 0, width: 100, height: 100 })),
            offsetHeight: 50,
            textContent: '',
            href: '',
            className: ''
        });

        global.document = {
            createElement: mock.fn(createElement),
            querySelector: mock.fn(() => null),
            querySelectorAll: mock.fn(() => []),
            body: {
                insertBefore: mock.fn(),
                firstChild: null,
                appendChild: mock.fn()
            }
        };
    });

    afterEach(() => {
        // Restore globals
        global.window = originalWindow;
        global.document = originalDocument;
        global.localStorage = originalLocalStorage;
    });

    describe('initSmoothScroll', () => {
        test('should attach click event listeners to anchor links', () => {
            const anchor = {
                getAttribute: mock.fn(() => '#target'),
                addEventListener: mock.fn()
            };

            global.document.querySelectorAll = mock.fn((selector) => {
                if (selector === 'a[href^="#"]') return [anchor];
                return [];
            });

            Utils.initSmoothScroll();

            assert.strictEqual(anchor.addEventListener.mock.calls.length, 1);
            assert.strictEqual(anchor.addEventListener.mock.calls[0].arguments[0], 'click');
        });

        test('should prevent default and scroll on click', () => {
            const preventDefault = mock.fn();
            const targetElement = {
                getBoundingClientRect: mock.fn(() => ({ top: 500 }))
            };

            // Mock anchor element logic
            let clickHandler;
            const anchor = {
                getAttribute: mock.fn(() => '#target'),
                addEventListener: mock.fn((event, handler) => {
                    clickHandler = handler;
                })
            };

            global.document.querySelectorAll = mock.fn((selector) => {
                if (selector === 'a[href^="#"]') return [anchor];
                return [];
            });

            global.document.querySelector = mock.fn((selector) => {
                if (selector === '#target') return targetElement;
                if (selector === '.site-header') return { offsetHeight: 70 };
                return null;
            });

            Utils.initSmoothScroll();

            // Simulate click
            clickHandler.call(anchor, { preventDefault });

            assert.strictEqual(preventDefault.mock.calls.length, 1);
            assert.strictEqual(global.window.scrollTo.mock.calls.length, 1);

            // Calculate expected position: 500 (top) + 0 (pageYOffset) - 70 (header) = 430
            const scrollToCall = global.window.scrollTo.mock.calls[0];
            assert.deepStrictEqual(scrollToCall.arguments[0], {
                top: 430,
                behavior: 'smooth'
            });
        });

        test('should not scroll if href is #', () => {
            const preventDefault = mock.fn();

            let clickHandler;
            const anchor = {
                getAttribute: mock.fn(() => '#'),
                addEventListener: mock.fn((event, handler) => {
                    clickHandler = handler;
                })
            };

            global.document.querySelectorAll = mock.fn(() => [anchor]);

            Utils.initSmoothScroll();

            clickHandler.call(anchor, { preventDefault });

            assert.strictEqual(preventDefault.mock.calls.length, 0);
            assert.strictEqual(global.window.scrollTo.mock.calls.length, 0);
        });
    });

    describe('initAccessibilityEnhancements', () => {
        test('should add skip link if not present', () => {
            global.document.querySelector = mock.fn(() => null); // No existing skip link

            const skipLink = { href: '', className: '', textContent: '' };
            global.document.createElement = mock.fn(() => skipLink);

            Utils.initAccessibilityEnhancements();

            assert.strictEqual(global.document.createElement.mock.calls.length, 1);
            assert.strictEqual(skipLink.href, '#main-content');
            assert.strictEqual(skipLink.className, 'skip-link');
            assert.strictEqual(global.document.body.insertBefore.mock.calls.length, 1);
        });

        test('should add ARIA attributes to navigation', () => {
            const nav = {
                getAttribute: mock.fn(() => null),
                setAttribute: mock.fn()
            };

            global.document.querySelector = mock.fn((sel) => {
                if (sel === '.main-nav') return nav;
                return null;
            });

            Utils.initAccessibilityEnhancements();

            assert.strictEqual(nav.setAttribute.mock.calls.length, 1);
            assert.deepStrictEqual(nav.setAttribute.mock.calls[0].arguments, ['aria-label', 'Main navigation']);
        });

         test('should add roles to main, header, and footer', () => {
            const main = { getAttribute: mock.fn(() => null), setAttribute: mock.fn() };
            const header = { getAttribute: mock.fn(() => null), setAttribute: mock.fn() };
            const footer = { getAttribute: mock.fn(() => null), setAttribute: mock.fn() };

            global.document.querySelector = mock.fn((sel) => {
                if (sel === 'main') return main;
                if (sel === '.site-header') return header;
                if (sel === '.site-footer') return footer;
                return null;
            });

            Utils.initAccessibilityEnhancements();

            assert.strictEqual(main.setAttribute.mock.calls.length, 1);
            assert.deepStrictEqual(main.setAttribute.mock.calls[0].arguments, ['role', 'main']);

            assert.strictEqual(header.setAttribute.mock.calls.length, 1);
            assert.deepStrictEqual(header.setAttribute.mock.calls[0].arguments, ['role', 'banner']);

            assert.strictEqual(footer.setAttribute.mock.calls.length, 1);
            assert.deepStrictEqual(footer.setAttribute.mock.calls[0].arguments, ['role', 'contentinfo']);
        });
    });

    describe('ProgressTracker', () => {
        test('should mark chapter as complete', () => {
            Utils.ProgressTracker.markChapterComplete('chapter-1');

            assert.strictEqual(global.localStorage.setItem.mock.calls.length, 1);
            const [key, value] = global.localStorage.setItem.mock.calls[0].arguments;
            assert.strictEqual(key, 'wrg_progress');

            const data = JSON.parse(value);
            assert.strictEqual(data['chapter-1'].completed, true);
            assert.ok(data['chapter-1'].completedAt);
        });

        test('should check if chapter is complete', () => {
            const progress = { 'chapter-1': { completed: true } };
            global.localStorage.getItem = mock.fn(() => JSON.stringify(progress));

            assert.strictEqual(Utils.ProgressTracker.isChapterComplete('chapter-1'), true);
            assert.strictEqual(Utils.ProgressTracker.isChapterComplete('chapter-2'), false);
        });

        test('should get completed count', () => {
            const progress = {
                'chapter-1': { completed: true },
                'chapter-2': { completed: false },
                'chapter-3': { completed: true }
            };
            global.localStorage.getItem = mock.fn(() => JSON.stringify(progress));

            assert.strictEqual(Utils.ProgressTracker.getCompletedCount(), 2);
        });

        test('should reset progress', () => {
            Utils.ProgressTracker.reset();

            assert.strictEqual(global.localStorage.removeItem.mock.calls.length, 1);
            assert.strictEqual(global.localStorage.removeItem.mock.calls[0].arguments[0], 'wrg_progress');
        });

        test('should handle missing localStorage data gracefully', () => {
             global.localStorage.getItem = mock.fn(() => null);
             assert.strictEqual(Utils.ProgressTracker.isChapterComplete('chapter-1'), false);
             assert.strictEqual(Utils.ProgressTracker.getCompletedCount(), 0);
        });
    });
});
