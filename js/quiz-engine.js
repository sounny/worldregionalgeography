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
     * Render questions into the DOM
     * @param {HTMLElement} container 
     * @param {Array} questions 
     */
    render(container, questions) {
        container.innerHTML = questions.map((q, index) => `
            <div class="quiz-container" data-quiz="q${index}" data-type="${q.type || 'multiple-choice'}">
                <p class="quiz-question">${index + 1}. ${q.question}</p>
                
                ${q.scenario ? `<div class="quiz-scenario"><p><em>${q.scenario}</em></p></div>` : ''}

                <div class="quiz-options">
                    ${q.options.map((opt, i) => `
                        <label class="quiz-option" data-correct="${opt.correct}" data-feedback="${opt.feedback || ''}">
                            <input type="radio" name="q${index}" value="${i}">
                            <span>${opt.text}</span>
                        </label>
                    `).join('')}
                </div>
                <div class="quiz-feedback"></div>
            </div>
        `).join('');
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
            
            options.forEach(option => {
                option.addEventListener('click', (e) => {
                    // Prevent re-answering if already answered
                    if (quiz.classList.contains('answered')) return;
                    
                    // Prevent default only if clicking label wrapper (to allow radio check)
                    // e.preventDefault(); 

                    const isCorrect = option.dataset.correct === 'true';
                    
                    // Mark quiz as answered
                    quiz.classList.add('answered');
                    
                    // Style the selected option
                    option.classList.add(isCorrect ? 'correct' : 'incorrect');
                    option.querySelector('input').checked = true; // Ensure checked state
                    
                    // Highlight correct answer if wrong
                    if (!isCorrect) {
                        const correctOption = quiz.querySelector('[data-correct="true"]');
                        if (correctOption) correctOption.classList.add('correct');
                    }
                    
                    // Show feedback
                    if (feedback) {
                        feedback.classList.add('show');
                        feedback.classList.add(isCorrect ? 'success' : 'error');
                        
                        const feedbackText = option.dataset.feedback;
                        const correctFeedback = quiz.querySelector('[data-correct="true"]')?.dataset.feedback;

                        feedback.innerHTML = isCorrect 
                            ? `<p class="feedback-correct">✓ Correct! ${feedbackText}</p>`
                            : `<p class="feedback-incorrect">✗ Not quite. ${correctFeedback || ''}</p>`;
                    }
                });
            });
        });
    }
};

// Export for global use
window.QuizEngine = QuizEngine;
