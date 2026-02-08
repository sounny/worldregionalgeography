/**
 * World Regional Geography - Quiz Engine
 * A lightweight, dependency-free quiz module for client-side validation.
 */

const QuizEngine = {
    /**
     * Initialize quiz components from JSON data or existing DOM structure
     * @param {string} containerId - The ID of the container where questions will be rendered
     * @param {Array} questions - Array of question objects (optional if rendered server-side)
     */
    init(containerId, questions = []) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // If questions are provided, render them
        if (questions.length > 0) {
            this.render(container, questions);
        }

        // Attach event listeners to all quiz options (whether static or dynamic)
        this.attachListeners(container);
    },

    /**
     * Helper to escape HTML special characters to prevent XSS
     * @param {string} str
     * @returns {string}
     */
    escapeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    /**
     * Render questions into the DOM
     * @param {HTMLElement} container 
     * @param {Array} questions 
     */
    render(container, questions) {
        // Clear existing content safely
        container.innerHTML = '';

        questions.forEach((q, index) => {
            const quizDiv = document.createElement('div');
            quizDiv.className = 'quiz-container';
            quizDiv.setAttribute('data-quiz', `q${index}`);
            // setAttribute automatically handles escaping for attribute values
            quizDiv.setAttribute('data-type', q.type || 'multiple-choice');

            const questionP = document.createElement('p');
            questionP.className = 'quiz-question';
            // textContent automatically escapes HTML, preventing XSS
            questionP.textContent = `${index + 1}. ${q.question}`;
            quizDiv.appendChild(questionP);

            if (q.scenario) {
                const scenarioDiv = document.createElement('div');
                scenarioDiv.className = 'quiz-scenario';
                const p = document.createElement('p');
                const em = document.createElement('em');
                em.textContent = q.scenario;
                p.appendChild(em);
                scenarioDiv.appendChild(p);
                quizDiv.appendChild(scenarioDiv);
            }

            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quiz-options';

            q.options.forEach((opt, i) => {
                const label = document.createElement('label');
                label.className = 'quiz-option';
                label.setAttribute('data-correct', String(Boolean(opt.correct)));
                label.setAttribute('data-feedback', opt.feedback || '');

                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `q${index}`;
                input.value = i;
                
                const span = document.createElement('span');
                span.textContent = opt.text;

                label.appendChild(input);
                label.appendChild(span);
                optionsDiv.appendChild(label);
            });

            quizDiv.appendChild(optionsDiv);

            const feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'quiz-feedback';
            quizDiv.appendChild(feedbackDiv);

            container.appendChild(quizDiv);
        });
    },

    /**
     * Attach click listeners to quiz options
     * @param {HTMLElement} container 
     */
    attachListeners(container) {
        const quizContainers = container.querySelectorAll('.quiz-container');
        
        quizContainers.forEach(quiz => {
            const options = quiz.querySelectorAll('.quiz-option');
            const feedback = quiz.querySelector('.quiz-feedback');

            if (feedback) {
                feedback.setAttribute('aria-live', 'polite');
                feedback.setAttribute('role', 'status');
            }
            
            options.forEach(option => {
                const input = option.querySelector('input[type="radio"]');
                if (!input) return;

                // Use change so keyboard selection works (Space/Arrow keys)
                input.addEventListener('change', () => {
                    // Prevent re-answering if already answered
                    if (quiz.classList.contains('answered')) return;

                    const isCorrect = option.dataset.correct === 'true';

                    // Mark quiz as answered
                    quiz.classList.add('answered');

                    // Style the selected option
                    option.classList.add(isCorrect ? 'correct' : 'incorrect');

                    // Highlight correct answer if wrong
                    if (!isCorrect) {
                        const correctOption = quiz.querySelector('[data-correct="true"]');
                        if (correctOption) correctOption.classList.add('correct');
                    }

                    // Show feedback
                    if (feedback) {
                        feedback.classList.add('show');
                        feedback.classList.add(isCorrect ? 'success' : 'error');

                        const feedbackText = option.dataset.feedback || '';
                        const correctFeedback = quiz.querySelector('[data-correct="true"]')?.dataset.feedback || '';

                        // Clear previous content
                        feedback.innerHTML = '';

                        const p = document.createElement('p');
                        p.className = isCorrect ? 'feedback-correct' : 'feedback-incorrect';
                        p.textContent = isCorrect
                            ? `Correct! ${feedbackText}`
                            : `Not quite. ${correctFeedback}`;

                        feedback.appendChild(p);
                    }
                });
            });
        });
    }
};

// Export for global use
window.QuizEngine = QuizEngine;
