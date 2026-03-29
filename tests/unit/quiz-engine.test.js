import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the source code
const quizEnginePath = path.join(__dirname, '../../js/quiz-engine.js');
const quizEngineCode = fs.readFileSync(quizEnginePath, 'utf8');

// Mock DOM
class MockElement {
    constructor(tagName) {
        this.tagName = tagName;
        this.attributes = {};
        this.children = [];
        this.dataset = {};
        this.classList = {
            add: () => {},
            remove: () => {},
            contains: () => false
        };
        this.innerHTML = '';
        this.textContent = '';
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    getAttribute(name) {
        return this.attributes[name] || null;
    }

    appendChild(child) {
        this.children.push(child);
    }

    querySelector() {
        return null;
    }

    querySelectorAll() {
        return [];
    }
}

global.document = {
    createElement: (tag) => new MockElement(tag),
    getElementById: (id) => new MockElement('div')
};
global.window = {};

// Evaluate the script in the context of the mock environment
eval(quizEngineCode);

test('QuizEngine.escapeHtml', (t) => {
    const QuizEngine = global.window.QuizEngine;

    // Happy paths
    assert.strictEqual(QuizEngine.escapeHtml('hello'), 'hello', 'Normal string should not be modified');
    assert.strictEqual(QuizEngine.escapeHtml(''), '', 'Empty string should return empty string');

    // Edge cases for null/undefined
    assert.strictEqual(QuizEngine.escapeHtml(null), '', 'null should return empty string');
    assert.strictEqual(QuizEngine.escapeHtml(undefined), '', 'undefined should return empty string');

    // Non-string types
    assert.strictEqual(QuizEngine.escapeHtml(123), '123', 'Numbers should be converted to string');
    assert.strictEqual(QuizEngine.escapeHtml(true), 'true', 'Booleans should be converted to string');
    assert.strictEqual(QuizEngine.escapeHtml(false), 'false', 'Booleans should be converted to string');

    // Special characters mapping tests
    assert.strictEqual(QuizEngine.escapeHtml('&'), '&amp;', 'Ampersand should be escaped');
    assert.strictEqual(QuizEngine.escapeHtml('<'), '&lt;', 'Less than should be escaped');
    assert.strictEqual(QuizEngine.escapeHtml('>'), '&gt;', 'Greater than should be escaped');
    assert.strictEqual(QuizEngine.escapeHtml('"'), '&quot;', 'Double quote should be escaped');
    assert.strictEqual(QuizEngine.escapeHtml("'"), '&#39;', 'Single quote should be escaped');

    // Complex strings
    assert.strictEqual(
        QuizEngine.escapeHtml('<script>alert("XSS & testing")\'</script>'),
        '&lt;script&gt;alert(&quot;XSS &amp; testing&quot;)&#39;&lt;/script&gt;',
        'Complex XSS string should be fully escaped'
    );
});
