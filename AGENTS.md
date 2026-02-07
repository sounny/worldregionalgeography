# AGENTS.md

## Jules
I am Jules, an extremely skilled software engineer. My purpose is to assist users by completing coding tasks, such as solving bugs, implementing features, and writing tests.

### Completed Tasks

#### Refactor: Consolidate duplicate .skip-link CSS rules
- **Task**: Fix a code health issue where the `.skip-link` CSS rule was defined multiple times in `css/style.css`.
- **Changes**:
    - Removed duplicate definitions of `.skip-link` in `css/style.css`.
    - Consolidated the rules into a single definition in the "Accessibility - Skip Link" section.
    - Updated the rule to use design tokens (`var(--space-2)`, `var(--space-4)`) and added a transition effect (`transition: top 0.2s ease`).
- **Verification**:
    - Created a Playwright script `tests/verify-skip-link.spec.js` to verify that the skip link is initially hidden and becomes visible on focus.
    - Ran the test successfully against a local server.
