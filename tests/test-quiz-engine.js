const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Minimal mock for browser environment
global.window = {};
global.document = {
    createElement: (tag) => {
        return {
            tagName: tag.toUpperCase(),
            classList: { add: () => {}, remove: () => {}, contains: () => false },
            dataset: {},
            setAttribute: () => {},
            innerHTML: '',
            appendChild: () => {},
            querySelector: () => null,
            querySelectorAll: () => []
        };
    },
    getElementById: (id) => null
};

// Load the source code
const quizEnginePath = path.join(__dirname, '../js/quiz-engine.js');
const quizEngineCode = fs.readFileSync(quizEnginePath, 'utf8');

// Execute the code in the global scope (simulating <script> tag)
eval(quizEngineCode);

// Test Data
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

const container = {
    innerHTML: '',
    querySelectorAll: () => []
};

// Run Render
console.log('Running render with malicious input...');
try {
    window.QuizEngine.render(container, maliciousQuestions);

    // Check for vulnerabilities
    let failed = false;

    if (container.innerHTML.includes('<img src=x onerror=alert(1)>')) {
        console.log('[FAIL] Question HTML injected directly.');
        failed = true;
    } else {
        console.log('[PASS] Question HTML escaped.');
    }

    if (container.innerHTML.includes('<script>alert(2)</script>')) {
        console.log('[FAIL] Option HTML injected directly.');
        failed = true;
    } else {
        console.log('[PASS] Option HTML escaped.');
    }

    if (container.innerHTML.includes('data-feedback="<img src=y onerror=alert(3)>"')) {
        console.log('[FAIL] Feedback attribute injected directly.');
        failed = true;
    } else {
        console.log('[PASS] Feedback attribute escaped.');
    }

    if (container.innerHTML.includes('data-correct=""><img src=x onerror=alert(4)>"')) {
        console.log('[FAIL] Correct attribute injected directly.');
        failed = true;
    } else {
        console.log('[PASS] Correct attribute escaped/sanitized.');
    }

    if (container.innerHTML.includes('<em>Scenario XSS</em>')) {
         // This is tricky. Scenario IS wrapped in <em> in the code.
         // If we pass <em>Scenario XSS</em>, and it comes out as <em><em>Scenario XSS</em></em>,
         // then it's injected.
         // But the code does: `<div ...><p><em>${q.scenario}</em></p></div>`
         // So if we pass `Scenario XSS`, it becomes `<em>Scenario XSS</em>`.
         // If we pass `<em>XSS</em>`, it becomes `<em><em>XSS</em></em>`.
         // Let's check if the raw string is present.
         if (container.innerHTML.includes('<em>Scenario XSS</em>')) {
             console.log('[FAIL] Scenario HTML injected directly (if input contained tags).');
             // In this case, our input was '<em>Scenario XSS</em>', so it should appear verbatim if not escaped.
             failed = true;
         }
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

    if (!container.innerHTML.includes('What is 2+2?')) {
        console.log('[FAIL] Legitimate question text missing.');
        failed = true;
    } else {
        console.log('[PASS] Legitimate question text rendered.');
    }

    if (!container.innerHTML.includes('Basic Math')) {
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
