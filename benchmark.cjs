const fs = require('fs');

// Simple mock DOM to run QuizEngine
class MockElement {
    constructor(tagName = 'div') {
        this.tagName = tagName;
        this.className = '';
        this.innerHTML = '';
        this.textContent = '';
        this.attributes = {};
        this.dataset = {};
        this.children = [];
        this.classList = {
            classes: new Set(),
            add(cls) { this.classes.add(cls); },
            contains(cls) { return this.classes.has(cls); }
        };
        this.listeners = {};
        this.type = '';
        this.name = '';
        this.value = '';
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
        if (name.startsWith('data-')) {
            const prop = name.slice(5).replace(/-([a-z])/g, g => g[1].toUpperCase());
            this.dataset[prop] = value;
        }
    }

    appendChild(child) {
        if (!child) return;
        child.parentNode = this;
        this.children.push(child);
    }

    addEventListener(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    querySelector(sel) {
        if (sel === '.quiz-feedback') {
            return this.children.find(c => c.className === 'quiz-feedback') || null;
        }
        if (sel === 'input[type="radio"]') {
            return this.children.find(c => c.tagName === 'input' && c.type === 'radio') || null;
        }
        if (sel === '[data-correct="true"]') {
            return this.children.find(c => c.dataset && c.dataset.correct === 'true') || null;
        }
        if (sel === '.quiz-options') {
            return this.children.find(c => c.className === 'quiz-options') || null;
        }
        return null;
    }

    querySelectorAll(sel) {
        if (sel === '.quiz-container') {
            return this.children.filter(c => c.className === 'quiz-container');
        }
        if (sel === '.quiz-option') {
            const optionsDiv = this.children.find(c => c.className === 'quiz-options');
            return optionsDiv ? optionsDiv.children.filter(c => c.className === 'quiz-option') : [];
        }
        return [];
    }

    closest(sel) {
        if (sel === '.quiz-option') {
            let curr = this;
            while(curr) {
                if (curr.className === 'quiz-option') return curr;
                curr = curr.parentNode;
            }
        }
        if (sel === '.quiz-container') {
            let curr = this;
            while(curr) {
                if (curr.className === 'quiz-container') return curr;
                curr = curr.parentNode;
            }
        }
        return null;
    }
}

global.document = {
    createElement(tagName) {
        return new MockElement(tagName);
    },
    getElementById(id) {
        return global.mockContainer;
    }
};
global.window = {};

const quizEngineSrc = fs.readFileSync('js/quiz-engine.js', 'utf8');
eval(quizEngineSrc);

// Create questions
const questions = [];
for (let i = 0; i < 5000; i++) {
    questions.push({
        question: `Question ${i}`,
        options: [
            { text: 'A', correct: true, feedback: 'Good' },
            { text: 'B', correct: false, feedback: 'Bad' },
            { text: 'C', correct: false, feedback: 'Bad' },
            { text: 'D', correct: false, feedback: 'Bad' }
        ]
    });
}

global.mockContainer = new MockElement('div');
global.mockContainer.id = 'quiz-container';

console.time('render');
global.window.QuizEngine.render(global.mockContainer, questions);
console.timeEnd('render');

console.time('attachListeners');
global.window.QuizEngine.attachListeners(global.mockContainer);
console.timeEnd('attachListeners');

// Count listeners
let listenerCount = 0;
if (global.mockContainer.listeners['change']) {
    listenerCount += global.mockContainer.listeners['change'].length;
}

global.mockContainer.querySelectorAll('.quiz-container').forEach(quiz => {
    if (quiz.listeners['change']) listenerCount += quiz.listeners['change'].length;
    quiz.querySelectorAll('.quiz-option').forEach(option => {
        const input = option.querySelector('input[type="radio"]');
        if (input && input.listeners['change']) {
            listenerCount += input.listeners['change'].length;
        }
    });
});
console.log('Total option listeners:', listenerCount);
