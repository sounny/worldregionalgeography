const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// --- Mock Environment ---

class MockElement {
    constructor(tagName = 'DIV') {
        this.tagName = tagName.toUpperCase();
        this.attributes = new Map();
        this.eventListeners = new Map();
        this.children = [];
        this._dataset = {};
        this._classList = new Set();
        this._innerHTML = '';
        this.parentNode = null;
        this.id = '';
        this.textContent = '';
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
            forEach: (cb) => this._classList.forEach(cb)
        };
    }

    // Dataset proxy
    get dataset() {
        return this._dataset;
    }

    getAttribute(name) { return this.attributes.get(name); }

    setAttribute(name, value) {
        this.attributes.set(name, String(value));
        if (name === 'id') this.id = value;
        // Sync data- attributes to dataset
        if (name.startsWith('data-')) {
            const key = name.slice(5).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            this._dataset[key] = value;
        }
    }

    removeAttribute(name) {
        this.attributes.delete(name);
        if (name.startsWith('data-')) {
             const key = name.slice(5).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
             delete this._dataset[key];
        }
    }

    addEventListener(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    dispatchEvent(event) {
        const listeners = this.eventListeners.get(event.type) || [];
        listeners.forEach(cb => cb(event));
        // Simple bubbling simulation could go here, but strictly not needed if we test unit-ly
        // attachListeners uses change on input, bubbling not strictly required if we dispatch on input directly
        return !event.defaultPrevented;
    }

    appendChild(child) {
        if (child instanceof MockElement) {
            this.children.push(child);
            child.parentNode = this;
        }
        return child;
    }

    get innerHTML() {
        return this._innerHTML;
    }

    set innerHTML(val) {
        this._innerHTML = val;
        // Clearing children if set (simple simulation)
        // We do NOT parse HTML here, so using innerHTML to build DOM is not supported in this mock.
        // Use createTree/appendChild for that.
        if (val === '') {
            this.children = [];
        }
    }

    // Selector engine
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
        // Class selector
        if (selector.startsWith('.')) return node.classList.contains(selector.substring(1));
        // ID selector
        if (selector.startsWith('#')) return node.id === selector.substring(1);
        // Attribute selector e.g. [data-correct="true"]
        if (selector.startsWith('[') && selector.endsWith(']')) {
             const parts = selector.slice(1, -1).split('=');
             const attr = parts[0];
             const val = parts[1] ? parts[1].replace(/"/g, '') : null;
             if (val !== null) return node.getAttribute(attr) === val;
             return node.attributes.has(attr);
        }
        // Tag + Attribute selector e.g. input[type="radio"]
        if (selector.includes('[')) {
             const match = selector.match(/([a-zA-Z0-9-]*)\[([^=]+)="([^"]+)"\]/);
             if (match) {
                 const tag = match[1];
                 const attr = match[2];
                 const value = match[3];
                 if (tag && node.tagName !== tag.toUpperCase()) return false;
                 return node.getAttribute(attr) === value;
             }
        }
        return node.tagName === selector.toUpperCase();
    }
}

// Global Setup
global.window = {};
global.document = {
    createElement: (tag) => new MockElement(tag),
    getElementById: (id) => null,
    body: new MockElement('BODY')
};
global.HTMLElement = MockElement;

// Load Code Under Test
const quizEnginePath = path.join(__dirname, '../js/quiz-engine.js');
const quizEngineCode = fs.readFileSync(quizEnginePath, 'utf8');
eval(quizEngineCode);

// --- Tests ---

describe('QuizEngine', () => {

    describe('Security: XSS Prevention', () => {
        it('should escape malicious HTML in questions, options, and feedback', () => {
            const maliciousQuestions = [
                {
                    question: '<img src=x onerror=alert(1)>',
                    scenario: '<em>Scenario XSS</em>',
                    type: 'multiple-choice',
                    options: [
                        {
                            text: '<script>alert(2)</script>',
                            correct: true,
                            feedback: '<img src=y onerror=alert(3)>'
                        }
                    ]
                }
            ];

            const container = new MockElement('DIV');
            window.QuizEngine.render(container, maliciousQuestions);

            assert.strictEqual(container.innerHTML.includes('<img src=x onerror=alert(1)>'), false, 'Question HTML injected');
            assert.strictEqual(container.innerHTML.includes('&lt;img src=x onerror=alert(1)&gt;'), true, 'Question HTML not escaped');

            assert.strictEqual(container.innerHTML.includes('<script>alert(2)</script>'), false, 'Option HTML injected');
            assert.strictEqual(container.innerHTML.includes('&lt;script&gt;alert(2)&lt;/script&gt;'), true, 'Option HTML not escaped');

            assert.strictEqual(container.innerHTML.includes('data-feedback="<img src=y onerror=alert(3)>"'), false, 'Feedback attr injected');
        });
    });

    describe('Rendering', () => {
        it('should render legitimate questions correctly', () => {
            const safeQuestions = [
                {
                    question: "What is 2+2?",
                    scenario: "Basic Math",
                    type: "multiple-choice",
                    options: [
                        { text: "4", correct: true, feedback: "Correct" }
                    ]
                }
            ];

            const container = new MockElement('DIV');
            window.QuizEngine.render(container, safeQuestions);

            assert.match(container.innerHTML, /What is 2\+2\?/, 'Question text missing');
            assert.match(container.innerHTML, /Basic Math/, 'Scenario text missing');
            assert.match(container.innerHTML, /value="0"/, 'Option value missing');
        });
    });

    describe('Interaction: attachListeners', () => {
        let container, quiz, optionCorrect, optionIncorrect, feedback, inputCorrect, inputIncorrect;

        beforeEach(() => {
            // Build DOM Manually for Interaction Testing
            container = new MockElement('DIV');

            quiz = new MockElement('DIV');
            quiz.classList.add('quiz-container');

            // Correct Option
            optionCorrect = new MockElement('LABEL');
            optionCorrect.classList.add('quiz-option');
            optionCorrect.dataset.correct = 'true';
            optionCorrect.dataset.feedback = 'Good job!';
            // Note: attachListeners checks dataset from attributes mostly in real DOM,
            // but here we set dataset directly or via attribute.
            // The code uses `option.dataset.correct` and `option.dataset.feedback`.
            // Our mock syncs setAttribute to dataset, but let's be explicit.
            optionCorrect.setAttribute('data-correct', 'true');
            optionCorrect.setAttribute('data-feedback', 'Good job!');

            inputCorrect = new MockElement('INPUT');
            inputCorrect.setAttribute('type', 'radio');
            inputCorrect.setAttribute('name', 'q0');
            inputCorrect.setAttribute('value', '0');
            optionCorrect.appendChild(inputCorrect);

            // Incorrect Option
            optionIncorrect = new MockElement('LABEL');
            optionIncorrect.classList.add('quiz-option');
            optionIncorrect.dataset.correct = 'false';
            optionIncorrect.dataset.feedback = 'Try again.';
            optionIncorrect.setAttribute('data-correct', 'false');
            optionIncorrect.setAttribute('data-feedback', 'Try again.');

            inputIncorrect = new MockElement('INPUT');
            inputIncorrect.setAttribute('type', 'radio');
            inputIncorrect.setAttribute('name', 'q0');
            inputIncorrect.setAttribute('value', '1');
            optionIncorrect.appendChild(inputIncorrect);

            // Feedback Element
            feedback = new MockElement('DIV');
            feedback.classList.add('quiz-feedback');

            quiz.appendChild(optionCorrect);
            quiz.appendChild(optionIncorrect);
            quiz.appendChild(feedback);
            container.appendChild(quiz);

            // Attach listeners
            window.QuizEngine.attachListeners(container);
        });

        it('should mark quiz as answered and highlight correct option on correct selection', () => {
            // Simulate selection
            inputCorrect.dispatchEvent({ type: 'change', target: inputCorrect });

            assert.strictEqual(quiz.classList.contains('answered'), true, 'Quiz should be marked answered');
            assert.strictEqual(optionCorrect.classList.contains('correct'), true, 'Selected correct option should be highlighted correct');
            assert.strictEqual(optionCorrect.classList.contains('incorrect'), false, 'Selected correct option should NOT be highlighted incorrect');

            // Check feedback
            assert.strictEqual(feedback.classList.contains('show'), true, 'Feedback should be shown');
            assert.strictEqual(feedback.classList.contains('success'), true, 'Feedback should be success');

            // Check feedback text (via children)
            assert.strictEqual(feedback.children.length, 1, 'Feedback should have one child paragraph');
            assert.strictEqual(feedback.children[0].textContent, 'Correct! Good job!', 'Feedback text mismatch');
        });

        it('should highlight incorrect option and show correct answer on wrong selection', () => {
            // Simulate selection
            inputIncorrect.dispatchEvent({ type: 'change', target: inputIncorrect });

            assert.strictEqual(quiz.classList.contains('answered'), true, 'Quiz should be marked answered');
            assert.strictEqual(optionIncorrect.classList.contains('incorrect'), true, 'Selected incorrect option should be highlighted incorrect');

            // Check that correct option is ALSO highlighted
            assert.strictEqual(optionCorrect.classList.contains('correct'), true, 'Correct option should be revealed');

            // Check feedback
            assert.strictEqual(feedback.classList.contains('show'), true, 'Feedback should be shown');
            assert.strictEqual(feedback.classList.contains('error'), true, 'Feedback should be error');

            // Check feedback text
            assert.strictEqual(feedback.children.length, 1);
            assert.strictEqual(feedback.children[0].textContent, 'Not quite. Good job!', 'Feedback text mismatch (should show correct answer feedback)');
        });

        it('should prevent changing answer after selection', () => {
            // First selection (Correct)
            inputCorrect.dispatchEvent({ type: 'change', target: inputCorrect });
            assert.strictEqual(optionCorrect.classList.contains('correct'), true);

            // Reset mock tracking manually if needed, or just check that state doesn't change
            // Try to select incorrect one
            inputIncorrect.dispatchEvent({ type: 'change', target: inputIncorrect });

            // Should still be answered and correct option should NOT lose its class (logic prevents re-entry)
            // But wait, if re-entry is preventing, nothing happens.
            // If it allowed it, optionIncorrect would get 'incorrect' class.
            assert.strictEqual(optionIncorrect.classList.contains('incorrect'), false, 'Should not allow changing to incorrect option');
        });

        it('should set ARIA attributes on feedback element', () => {
             assert.strictEqual(feedback.getAttribute('aria-live'), 'polite');
             assert.strictEqual(feedback.getAttribute('role'), 'status');
        });
    });
});
