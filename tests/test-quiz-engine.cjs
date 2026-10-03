const assert = require('assert');
const fs = require('fs');
const path = require('path');

// --- Improved Mock Environment ---

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

class MockElement {
    constructor(tagName) {
        this.tagName = tagName.toUpperCase();
        this.attributes = {};
        this.children = [];
        this.style = {};
        this._classList = new Set();
        this.parentNode = null;
    }

    get classList() {
        return {
            add: (...args) => args.forEach(c => this._classList.add(c)),
            remove: (...args) => args.forEach(c => this._classList.delete(c)),
            contains: (c) => this._classList.has(c),
            toggle: (c) => this._classList.has(c) ? this._classList.delete(c) : this._classList.add(c)
        };
    }

    set className(v) {
        this._classList = new Set(v.split(' ').filter(Boolean));
    }

    get className() {
        return Array.from(this._classList).join(' ');
    }

    setAttribute(k, v) {
        this.attributes[k] = String(v);
    }

    getAttribute(k) {
        return this.attributes[k] || null;
    }

    removeAttribute(k) {
        delete this.attributes[k];
    }

    // Minimal dataset support (read-only proxy ideally, but empty obj for now is enough if we use setAttribute)
    get dataset() {
        return {};
    }

    appendChild(child) {
        if (child instanceof MockElement) {
            child.parentNode = this;
            this.children.push(child);
        } else if (typeof child === 'string') {
            this.children.push(child);
        }
        return child;
    }

    get innerHTML() {
        return this.children.map(c => {
            return (typeof c === 'string') ? c : c.outerHTML;
        }).join('');
    }

    set innerHTML(html) {
        // If html is empty, clear children.
        // If html is a string, we just store it as a raw string child for now.
        // This supports the legacy behavior where innerHTML is set to a big string.
        this.children = html ? [html] : [];
    }

    get outerHTML() {
        // Sync classList to attributes
        if (this._classList.size > 0) {
            this.attributes['class'] = Array.from(this._classList).join(' ');
        }

        const attrs = Object.entries(this.attributes)
            .map(([k, v]) => ` ${k}="${escapeHtml(v)}"`)
            .join('');

        return `<${this.tagName.toLowerCase()}${attrs}>${this.innerHTML}</${this.tagName.toLowerCase()}>`;
    }

    set textContent(text) {
        // textContent escapes special chars when retrieved as HTML
        // We store it as a string that WILL be escaped during outerHTML generation of children?
        // Wait, innerHTML getter just returns string children as-is.
        // So we should escape it HERE if we store it as a string child.
        this.children = [escapeHtml(text)];
    }

    get textContent() {
         return this.children.map(c => typeof c === 'string' ? c : c.textContent).join('');
    }

    querySelector(selector) {
        if (selector.startsWith('.')) {
            const className = selector.substring(1);
            if (this.classList.contains(className)) return this;
        }
        if (selector.toUpperCase() === this.tagName) return this;

        // Basic attribute selector support [attr="val"]
        const attrMatch = selector.match(/^\[([\w-]+)="(.*)"\]$/);
        if (attrMatch) {
            const [_, k, v] = attrMatch;
            if (this.getAttribute(k) === v) return this;
        }

        for (const child of this.children) {
            if (child instanceof MockElement) {
                const found = child.querySelector(selector);
                if (found) return found;
            }
        }
        return null;
    }

    querySelectorAll(selector) {
        let results = [];
        // Self check
        if (selector.startsWith('.')) {
             const className = selector.substring(1);
             if (this.classList.contains(className)) results.push(this);
        }

        for (const child of this.children) {
            if (child instanceof MockElement) {
                results = results.concat(child.querySelectorAll(selector));
            }
        }
        return results;
    }

    addEventListener() {}
}

global.window = {};
global.document = {
    createElement: (tag) => new MockElement(tag),
    getElementById: (id) => null,
    body: new MockElement('BODY')
};

// Load the source code
const quizEnginePath = path.join(__dirname, '../js/quiz-engine.js');
const quizEngineCode = fs.readFileSync(quizEnginePath, 'utf8');

// Execute the code in the global scope
eval(quizEngineCode);

// --- Test Data ---

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
            },
            {
                text: 'Bad correct attr',
                correct: '"><img src=x onerror=alert(4)>',
                feedback: 'test'
            }
        ]
    }
];

// Use a MockElement as container instead of plain object
const container = new MockElement('div');

// Run Render
console.log('Running render with malicious input...');
try {
    window.QuizEngine.render(container, maliciousQuestions);

    // Check for vulnerabilities
    let failed = false;
    const html = container.innerHTML;

    if (html.includes('<img src=x onerror=alert(1)>')) {
        console.log('[FAIL] Question HTML injected directly.');
        failed = true;
    } else {
        console.log('[PASS] Question HTML escaped.');
    }

    if (html.includes('<script>alert(2)</script>')) {
        console.log('[FAIL] Option HTML injected directly.');
        failed = true;
    } else {
        console.log('[PASS] Option HTML escaped.');
    }

    if (html.includes('data-feedback="<img src=y onerror=alert(3)>"')) {
        console.log('[FAIL] Feedback attribute injected directly.');
        failed = true;
    } else {
        console.log('[PASS] Feedback attribute escaped.');
    }

    // Check for correct attribute injection
    // Note: data-correct should be "true" or "false" string
    if (html.includes('<img src=x onerror=alert(4)>')) {
        // A bit loose check, but covers attribute injection if it broke out
        if (html.includes('data-correct=""><img')) {
             console.log('[FAIL] Correct attribute injected directly.');
             failed = true;
        }
    } else {
        console.log('[PASS] Correct attribute escaped/sanitized.');
    }

    // Scenario check
    // Logic: if scenario contains HTML tags, they should be escaped.
    // In our test case, scenario is '<em>Scenario XSS</em>'.
    // Current impl: escapes it -> '&lt;em&gt;Scenario XSS&lt;/em&gt;'
    // Then wraps in <em>: '<em>&lt;em&gt;Scenario XSS&lt;/em&gt;</em>'
    // So '<em>Scenario XSS</em>' (raw) should NOT be present as HTML structure except the outer wrapper.
    // But wait, the outer wrapper IS '<em>...</em>'.
    // So if I grep for '<em>Scenario XSS</em>', I might find it if the input was 'Scenario XSS'.
    // But input was '<em>Scenario XSS</em>'.
    // So it should be '<em>&lt;em&gt;Scenario XSS&lt;/em&gt;</em>'.
    if (html.includes('<em><em>Scenario XSS</em></em>')) {
        console.log('[FAIL] Scenario HTML injected directly.');
        failed = true;
    } else {
         console.log('[PASS] Scenario HTML handled correctly.');
    }

    // --- Legitimate Test Case ---
    console.log('\nRunning render with legitimate input...');
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

    // Reset container
    container.innerHTML = '';

    window.QuizEngine.render(container, safeQuestions);
    const safeHtml = container.innerHTML;

    if (!safeHtml.includes('What is 2+2?')) {
        console.log('[FAIL] Legitimate question text missing.');
        failed = true;
    } else {
        console.log('[PASS] Legitimate question text rendered.');
    }

    if (!safeHtml.includes('Basic Math')) {
        console.log('[FAIL] Legitimate scenario text missing.');
        failed = true;
    }

    if (failed) {
        console.log('\nResult: VULNERABILITY CONFIRMED / FUNCTIONALITY BROKEN');
        process.exit(1);
    } else {
        console.log('\nResult: SAFE');
        process.exit(0);
    }

} catch (e) {
    console.error('Error during test:', e);
    process.exit(1);
}
