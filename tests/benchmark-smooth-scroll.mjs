import { performance } from 'perf_hooks';
import fs from 'fs';
import { JSDOM } from 'jsdom';

// Create a DOM environment with many anchor links
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<body>
  <div id="content"></div>
</body>
</html>
`);

const window = dom.window;
const document = window.document;

// Add 10,000 anchor links
const content = document.getElementById('content');
let html = '';
for (let i = 0; i < 10000; i++) {
    html += `<a href="#section-${i}">Section ${i}</a>\n`;
    html += `<div id="section-${i}">Content ${i}</div>\n`;
}
content.innerHTML = html;

// Mock window.scrollTo
window.scrollTo = () => {};
window.pageYOffset = 0;

// Read main.js
const mainJs = fs.readFileSync('js/main.js', 'utf8');

// Function to measure initialization time
function measureInit(isDelegated) {
    // Reset DOM state

    // Create function execution context
    let initSmoothScrollCode = '';

    // Extract the initSmoothScroll function from main.js
    const match = mainJs.match(/function initSmoothScroll\(\) \{[\s\S]*?\n\}/);
    if (!match) {
        console.error("Could not find initSmoothScroll function");
        return 0;
    }

    let fnStr = match[0];

    if (isDelegated) {
        // Replace with delegated version
        fnStr = `function initSmoothScroll() {
            document.body.addEventListener('click', function(e) {
                const anchor = e.target.closest('a[href^="#"]');
                if (!anchor) return;

                const href = anchor.getAttribute('href');
                if (href === '#') return;

                let target;
                try { target = document.querySelector(href); } catch(e) { return; }

                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }`;
    }

    const wrappedFn = new Function('document', 'window', `
        ${fnStr}

        const start = performance.now();
        initSmoothScroll();
        const end = performance.now();
        return end - start;
    `);

    return wrappedFn(document, window);
}

// Run baseline
const baselineTime = measureInit(false);
console.log(`Baseline (O(N) addEventListener): ${baselineTime.toFixed(2)}ms`);

// Run optimized
const optimizedTime = measureInit(true);
console.log(`Optimized (Event Delegation): ${optimizedTime.toFixed(2)}ms`);
console.log(`Improvement: ${(baselineTime / optimizedTime).toFixed(2)}x faster`);
