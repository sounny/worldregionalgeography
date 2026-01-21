# Quiz System Documentation

This document explains how to create and manage quizzes for the World Regional Geography textbook.

## Quiz System Architecture

The quiz system uses a standardized JSON format and the `QuizEngine` module to provide consistent quiz functionality across all chapters.

### Key Components

1. **QuizEngine.js** - The core quiz module that handles rendering and interaction
2. **quiz-data.json** - JSON file containing quiz questions and answers for each chapter
3. **HTML container** - Standardized HTML structure for quiz display

## Quiz Data Format

### Basic Structure

```json
[
    {
        "question": "Question text here?",
        "options": [
            { "text": "Option 1", "correct": true, "feedback": "Explanation for correct answer" },
            { "text": "Option 2", "correct": false },
            { "text": "Option 3", "correct": false },
            { "text": "Option 4", "correct": false }
        ]
    }
]
```

### Field Descriptions

- **question** (string, required): The question text
- **options** (array, required): Array of answer options
  - **text** (string, required): The option text
  - **correct** (boolean, required): Whether this option is correct
  - **feedback** (string, optional): Additional feedback for this specific option

### Advanced Features

#### Scenarios
Add context to questions with scenarios:

```json
{
    "question": "What is the capital of France?",
    "scenario": "Consider the political and cultural significance of this city.",
    "options": [...]
}
```

#### Question Types
Support for different question types:

```json
{
    "question": "Select all that apply",
    "type": "multiple-select",
    "options": [...]
}
```

## Implementation Guide

### Step 1: Create quiz-data.json

Create a `quiz-data.json` file in the chapter directory with your questions in the standard format.

### Step 2: Add HTML Container

Add this HTML structure where you want the quiz to appear:

```html
<section id="knowledge-check" class="section-container">
    <h2>✅ Knowledge Check</h2>
    <div id="quiz-container" class="quiz-wrapper">
        <p class="loading">Loading quiz questions...</p>
    </div>
</section>
```

### Step 3: Load Quiz Engine

Add these scripts to your HTML file:

```html
<script src="../../js/main.js"></script>
<script src="../../js/quiz-engine.js"></script>
```

### Step 4: Initialize Quiz

Add this JavaScript to load and initialize the quiz:

```javascript
// Initialize the Chapter X Quiz from external JSON
fetch('quiz-data.json')
    .then(response => response.json())
    .then(data => QuizEngine.init('quiz-container', data))
    .catch(err => console.error('Error loading quiz data:', err));
```

## Quiz Design Best Practices

### Pedagogical Guidelines

1. **Alignment with Learning Objectives**: Each quiz question should map to a specific learning objective
2. **Bloom's Taxonomy**: Include questions at different cognitive levels:
   - Remember: Recall facts and basic concepts
   - Understand: Explain ideas or concepts
   - Apply: Use information in new situations
   - Analyze: Draw connections among ideas
   - Evaluate: Justify a stand or decision
   - Create: Produce new or original work

3. **Question Types**: Mix of question types for comprehensive assessment:
   - Multiple Choice (standard)
   - True/False
   - Matching
   - Short Answer (future enhancement)
   - Essay (future enhancement)

### Technical Guidelines

1. **Question Count**: 8-12 questions per chapter
2. **Option Count**: 4 options per multiple choice question
3. **Feedback**: Provide meaningful feedback for correct answers
4. **Randomization**: Consider randomizing question order (future enhancement)

## Examples

### Good Question Example

```json
{
    "question": "Which physical feature is most often used to mark Europe's eastern boundary?",
    "options": [
        { "text": "The Ural Mountains", "correct": true, "feedback": "The Ural Mountains are commonly used as Europe's eastern boundary." },
        { "text": "The Mediterranean Sea", "correct": false },
        { "text": "The Rhine River", "correct": false },
        { "text": "The Alps", "correct": false }
    ]
}
```

### Higher-Order Thinking Question

```json
{
    "question": "Analyze how the Gulf Stream influences European climate and its impact on human settlement patterns.",
    "options": [
        { "text": "It creates warmer winters, allowing for year-round agriculture and dense coastal populations", "correct": true, "feedback": "The Gulf Stream brings warm water, moderating temperatures and supporting human activity." },
        { "text": "It causes frequent hurricanes that prevent settlement", "correct": false },
        { "text": "It has no significant impact on climate", "correct": false },
        { "text": "It makes Europe colder than similar latitudes", "correct": false }
    ]
}
```

## Quiz System API

### QuizEngine Methods

#### `QuizEngine.init(containerId, questions)`
Initialize a quiz in the specified container.

- **containerId** (string): ID of the container element
- **questions** (array): Array of question objects

#### `QuizEngine.render(container, questions)`
Render questions into the DOM.

- **container** (HTMLElement): The container element
- **questions** (array): Array of question objects

#### `QuizEngine.attachListeners(container)`
Attach event listeners to quiz options.

- **container** (HTMLElement): The container element

## Troubleshooting

### Common Issues

1. **Quiz not loading**: Check that `quiz-data.json` exists and is valid JSON
2. **No questions displayed**: Verify the container ID matches
3. **JavaScript errors**: Ensure QuizEngine.js is loaded before initialization
4. **Styling issues**: Make sure the quiz CSS classes are properly applied

### Debugging Tips

1. Check browser console for errors
2. Verify JSON syntax using a validator
3. Test with a simple quiz first
4. Ensure all required fields are present

## Future Enhancements

### Planned Features

- [ ] Question randomization
- [ ] Question banking (larger pool, random selection)
- [ ] Timed quizzes
- [ ] Multiple question types (matching, true/false, short answer)
- [ ] Quiz analytics and progress tracking
- [ ] Adaptive quizzes (difficulty based on performance)
- [ ] Export/import quiz data
- [ ] Collaborative quiz creation interface

### Technical Improvements

- [ ] Error handling for missing data
- [ ] Loading states and progress indicators
- [ ] Accessibility enhancements
- [ ] Mobile optimization
- [ ] Performance optimization for large quizzes

## Maintenance

### Creating New Quizzes

1. Copy the template `quiz-data.json`
2. Modify questions for the specific chapter
3. Test the quiz thoroughly
4. Ensure all questions align with learning objectives

### Updating Existing Quizzes

1. Review questions for accuracy and relevance
2. Update feedback based on student performance data
3. Add new question types as needed
4. Maintain consistency with other chapters

## Quiz System Standards

### File Naming
- `quiz-data.json` - Standard name for quiz data files
- `quiz-engine.js` - Core quiz module

### Directory Structure
```
chapters/
  01-introduction/
    quiz-data.json
    index.html
  02-europe/
    quiz-data.json
    index.html
  ...
```

### Version Compatibility
- All chapters should use the same quiz engine version
- Quiz data format should be consistent across chapters
- Updates to the engine should maintain backward compatibility

## Resources

### Tools
- [JSON Validator](https://jsonlint.com/)
- [Quiz Question Generator](https://www.questiongenerator.ai/)
- [Bloom's Taxonomy Guide](https://cft.vanderbilt.edu/guides-sub-pages/blooms-taxonomy/)

### References
- [Best Practices for Online Quizzes](https://teaching.cornell.edu/teaching-resources/assessing-student-learning/online-quizzes)
- [Accessible Quiz Design](https://webaim.org/techniques/forms/)
- [Effective Multiple Choice Questions](https://www.vanderbilt.edu/cft/guides-sub-pages/writing-good-multiple-choice-questions/)

## Support

For issues with the quiz system:
1. Check this documentation
2. Review the console for errors
3. Test with a simple quiz
4. Contact the development team if issues persist

## Changelog

### Version 1.0 (Current)
- Standardized JSON format
- Consistent quiz engine across chapters
- Basic multiple choice support
- Feedback system
- Accessibility features

### Future Versions
- 1.1: Additional question types
- 1.2: Question randomization
- 1.3: Analytics and tracking
- 2.0: Adaptive quizzes and AI-generated questions