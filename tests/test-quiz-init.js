const { test, describe, beforeEach, mock } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Mock DOM environment
global.window = {};
global.document = {
    getElementById: () => null,
    createElement: (tag) => ({
        tagName: tag.toUpperCase(),
        classList: { add: () => {}, remove: () => {}, contains: () => false },
        dataset: {},
        setAttribute: () => {},
        innerHTML: '',
        appendChild: () => {},
        querySelector: () => null,
        querySelectorAll: () => []
    })
};

// Load the source code
const quizEnginePath = path.join(__dirname, '../js/quiz-engine.js');
const quizEngineCode = fs.readFileSync(quizEnginePath, 'utf8');

// Execute the code in global scope
eval(quizEngineCode);

const QuizEngine = global.window.QuizEngine;

describe('QuizEngine.init', () => {
    let container;

    beforeEach(() => {
        // Reset container mock
        container = {
            id: 'quiz-container',
            innerHTML: '',
            querySelectorAll: () => [],
            classList: { add: () => {}, remove: () => {}, contains: () => false },
            dataset: {},
            setAttribute: () => {},
            appendChild: () => {}
        };

        // Mock getElementById to return our container by default if ID matches
        global.document.getElementById = mock.fn((id) => {
            if (id === 'quiz-container') return container;
            return null;
        });
    });

    test('should return early if container is not found', (t) => {
        // Mock getElementById to return null
        global.document.getElementById = mock.fn(() => null);

        // Spy on render and attachListeners
        const render = t.mock.method(QuizEngine, 'render');
        const attachListeners = t.mock.method(QuizEngine, 'attachListeners');

        QuizEngine.init('non-existent');

        assert.strictEqual(render.mock.callCount(), 0);
        assert.strictEqual(attachListeners.mock.callCount(), 0);
    });

    test('should render questions and attach listeners if questions are provided', (t) => {
        const render = t.mock.method(QuizEngine, 'render');
        const attachListeners = t.mock.method(QuizEngine, 'attachListeners');

        const questions = [{ question: 'Q1', options: [] }];
        QuizEngine.init('quiz-container', questions);

        assert.strictEqual(render.mock.callCount(), 1);
        assert.deepStrictEqual(render.mock.calls[0].arguments, [container, questions]);

        assert.strictEqual(attachListeners.mock.callCount(), 1);
        assert.deepStrictEqual(attachListeners.mock.calls[0].arguments, [container]);
    });

    test('should attach listeners but not render if no questions provided', (t) => {
        const render = t.mock.method(QuizEngine, 'render');
        const attachListeners = t.mock.method(QuizEngine, 'attachListeners');

        QuizEngine.init('quiz-container');

        assert.strictEqual(render.mock.callCount(), 0);

        assert.strictEqual(attachListeners.mock.callCount(), 1);
        assert.deepStrictEqual(attachListeners.mock.calls[0].arguments, [container]);
    });

    test('should attach listeners but not render if empty questions array provided', (t) => {
         const render = t.mock.method(QuizEngine, 'render');
         const attachListeners = t.mock.method(QuizEngine, 'attachListeners');

         QuizEngine.init('quiz-container', []);

         assert.strictEqual(render.mock.callCount(), 0);
         assert.strictEqual(attachListeners.mock.callCount(), 1);
         assert.deepStrictEqual(attachListeners.mock.calls[0].arguments, [container]);
    });
});
