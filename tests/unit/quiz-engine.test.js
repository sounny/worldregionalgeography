import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup a minimal mock for window/document
global.window = {};
global.document = {
    getElementById: () => null
};

// Read and eval the non-module script
const enginePath = path.join(__dirname, '../../js/quiz-engine.js');
const engineCode = fs.readFileSync(enginePath, 'utf8');
eval(engineCode);

const QuizEngine = global.window.QuizEngine;

test('QuizEngine.escapeHtml - standard HTML escaping', (t) => {
    const input = '<script>alert("xss & hack")</script>';
    const expected = '&lt;script&gt;alert(&quot;xss &amp; hack&quot;)&lt;/script&gt;';
    assert.strictEqual(QuizEngine.escapeHtml(input), expected);
});

test('QuizEngine.escapeHtml - single quotes', (t) => {
    const input = "'single quote'";
    const expected = '&#039;single quote&#039;';
    assert.strictEqual(QuizEngine.escapeHtml(input), expected);
});

test('QuizEngine.escapeHtml - undefined input', (t) => {
    assert.strictEqual(QuizEngine.escapeHtml(undefined), '');
});

test('QuizEngine.escapeHtml - null input', (t) => {
    assert.strictEqual(QuizEngine.escapeHtml(null), '');
});

test('QuizEngine.escapeHtml - empty string', (t) => {
    assert.strictEqual(QuizEngine.escapeHtml(''), '');
});

test('QuizEngine.escapeHtml - numeric input', (t) => {
    assert.strictEqual(QuizEngine.escapeHtml(123), '123');
    assert.strictEqual(QuizEngine.escapeHtml(0), '0');
    assert.strictEqual(QuizEngine.escapeHtml(-42.5), '-42.5');
});

test('QuizEngine.escapeHtml - boolean input', (t) => {
    assert.strictEqual(QuizEngine.escapeHtml(true), 'true');
    assert.strictEqual(QuizEngine.escapeHtml(false), 'false');
});

test('QuizEngine.escapeHtml - object input', (t) => {
    assert.strictEqual(QuizEngine.escapeHtml({}), '[object Object]');
});
