import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mock browser environment
global.window = {};
global.document = {
    createElement: (tag) => ({
        tagName: tag.toUpperCase(),
        classList: { add: () => {}, remove: () => {}, contains: () => false },
        dataset: {},
        setAttribute: () => {},
        innerHTML: '',
        appendChild: () => {},
        querySelector: () => null,
        querySelectorAll: () => []
    }),
    getElementById: () => null
};

// Load source code
const quizEnginePath = path.join(__dirname, '../js/quiz-engine.js');
const quizEngineCode = fs.readFileSync(quizEnginePath, 'utf8');

// Execute code
// Using indirect eval to run in global scope
(0, eval)(quizEngineCode);

const QuizEngine = global.window.QuizEngine;

describe('QuizEngine.render', () => {
    it('should render a single question correctly', () => {
        const container = { innerHTML: '' };
        const questions = [{
            question: 'Test Question',
            options: [{ text: 'Option 1', correct: true }]
        }];

        QuizEngine.render(container, questions);

        // Basic checks
        assert.ok(container.innerHTML.includes('Test Question'), 'Question text missing');
        assert.ok(container.innerHTML.includes('Option 1'), 'Option text missing');
        assert.ok(container.innerHTML.includes('data-quiz="q0"'), 'Missing data-quiz attribute');
        assert.ok(container.innerHTML.includes('data-type="multiple-choice"'), 'Default type missing');
    });

    it('should render scenario when provided', () => {
        const container = { innerHTML: '' };
        const questions = [{
            question: 'Q',
            scenario: 'Test Scenario',
            options: []
        }];

        QuizEngine.render(container, questions);
        assert.ok(container.innerHTML.includes('Test Scenario'), 'Scenario text missing');
        assert.ok(container.innerHTML.includes('class="quiz-scenario"'), 'Scenario container missing');
    });

    it('should not render scenario container when not provided', () => {
        const container = { innerHTML: '' };
        const questions = [{
            question: 'Q',
            options: []
        }];

        QuizEngine.render(container, questions);
        assert.doesNotMatch(container.innerHTML, /class="quiz-scenario"/, 'Scenario container should not exist');
    });

    it('should set correct data attributes for options', () => {
        const container = { innerHTML: '' };
        const questions = [{
            question: 'Q',
            options: [
                { text: 'Correct', correct: true, feedback: 'Good job' },
                { text: 'Wrong', correct: false, feedback: 'Try again' }
            ]
        }];

        QuizEngine.render(container, questions);

        // Check correct option
        assert.ok(container.innerHTML.includes('data-correct="true"'), 'Correct option attribute missing');
        assert.ok(container.innerHTML.includes('data-feedback="Good job"'), 'Correct feedback missing');

        // Check wrong option
        assert.ok(container.innerHTML.includes('data-correct="false"'), 'Wrong option attribute missing');
        assert.ok(container.innerHTML.includes('data-feedback="Try again"'), 'Wrong feedback missing');
    });

    it('should escape HTML in content', () => {
        const container = { innerHTML: '' };
        const questions = [{
            question: '<script>alert(1)</script>',
            scenario: '<b>Bold</b>',
            options: [
                { text: '<i>Italic</i>', feedback: '<u>Underline</u>' }
            ]
        }];

        QuizEngine.render(container, questions);

        // Should not contain raw tags
        assert.doesNotMatch(container.innerHTML, /<script>/, 'Question script tag not escaped');
        assert.doesNotMatch(container.innerHTML, /<b>/, 'Scenario bold tag not escaped');
        assert.doesNotMatch(container.innerHTML, /<i>/, 'Option italic tag not escaped');
        assert.doesNotMatch(container.innerHTML, /<u>/, 'Feedback underline tag not escaped');

        // Should contain escaped versions
        assert.ok(container.innerHTML.includes('&lt;script&gt;'), 'Escaped script missing');
        assert.ok(container.innerHTML.includes('&lt;b&gt;'), 'Escaped bold missing');
        assert.ok(container.innerHTML.includes('&lt;i&gt;'), 'Escaped italic missing');
        assert.ok(container.innerHTML.includes('&lt;u&gt;'), 'Escaped underline missing');
    });

    it('should render multiple questions with correct indices', () => {
        const container = { innerHTML: '' };
        const questions = [
            { question: 'Q1', options: [] },
            { question: 'Q2', options: [] }
        ];

        QuizEngine.render(container, questions);

        assert.ok(container.innerHTML.includes('data-quiz="q0"'), 'First question index incorrect');
        assert.ok(container.innerHTML.includes('data-quiz="q1"'), 'Second question index incorrect');
        assert.ok(container.innerHTML.includes('1. Q1'), 'First question number incorrect');
        assert.ok(container.innerHTML.includes('2. Q2'), 'Second question number incorrect');
    });
});
