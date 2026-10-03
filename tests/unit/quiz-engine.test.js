import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mock browser environment
global.window = {};
global.document = {
    createElement: () => ({}),
    getElementById: () => null
};

// Load source code
const quizEnginePath = path.join(__dirname, '../../js/quiz-engine.js');
const quizEngineCode = fs.readFileSync(quizEnginePath, 'utf8');

// Execute code
(0, eval)(quizEngineCode);

const QuizEngine = global.window.QuizEngine;

test('QuizEngine.escapeHtml', async (t) => {
    await t.test('should escape special characters', () => {
        assert.strictEqual(QuizEngine.escapeHtml('& < > " \''), '&amp; &lt; &gt; &quot; &#039;');
    });

    await t.test('should return empty string for null', () => {
        assert.strictEqual(QuizEngine.escapeHtml(null), '');
    });

    await t.test('should return empty string for undefined', () => {
        assert.strictEqual(QuizEngine.escapeHtml(undefined), '');
    });

    await t.test('should handle number 0', () => {
        assert.strictEqual(QuizEngine.escapeHtml(0), '0');
    });

    await t.test('should handle boolean false', () => {
        assert.strictEqual(QuizEngine.escapeHtml(false), 'false');
    });

    await t.test('should handle empty string', () => {
        assert.strictEqual(QuizEngine.escapeHtml(''), '');
    });

    await t.test('should handle already escaped strings', () => {
        assert.strictEqual(QuizEngine.escapeHtml('&amp;'), '&amp;amp;');
    });
});
