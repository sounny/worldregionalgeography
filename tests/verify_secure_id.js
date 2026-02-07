const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, '../js/main.js');
const content = fs.readFileSync(mainJsPath, 'utf8');

// Find start index
const startMarker = 'function getSecureId() {';
const startIndex = content.indexOf(startMarker);

if (startIndex === -1) {
    console.error('Could not find getSecureId function');
    process.exit(1);
}

// Extract body by counting braces
let braceCount = 0;
let body = '';
let foundStart = false;

for (let i = startIndex; i < content.length; i++) {
    const char = content[i];
    if (char === '{') {
        braceCount++;
        foundStart = true;
    } else if (char === '}') {
        braceCount--;
    }

    body += char;

    if (foundStart && braceCount === 0) {
        break;
    }
}

console.log('--- Extracted function ---');
console.log(body);
console.log('--------------------------');

// Check for Math.random
if (body.includes('Math.random')) {
    console.log('VULNERABILITY DETECTED: getSecureId contains Math.random()');
} else {
    console.log('CLEAN: No Math.random() usage found.');
}

// Execute verification
try {
    const wrapper = `
        return (function(crypto) {
            ${body}
            return getSecureId();
        })(crypto);
    `;

    // Test 1: No Crypto
    {
        console.log('\n--- Test 1: No Crypto ---');
        const runTest = new Function('crypto', wrapper);

        const originalMathRandom = Math.random;
        let randomCalled = false;
        Math.random = () => {
            randomCalled = true;
            return 0.5;
        };

        const result = runTest(undefined);
        console.log('Result:', result);

        if (randomCalled) {
            console.log('FAIL: Math.random() was called.');
        } else {
            console.log('PASS: Math.random() was NOT called.');
        }

        if (typeof result === 'string' && result.length > 5) {
             console.log('PASS: Returned a valid string.');
        } else {
             console.log('FAIL: Returned invalid result.');
        }

        Math.random = originalMathRandom;
    }

    // Test 2: With Crypto (Mocked)
    {
        console.log('\n--- Test 2: With Crypto ---');
        const mockCrypto = {
            randomUUID: () => 'mock-uuid-1234',
            getRandomValues: (arr) => { arr[0] = 123456789; return arr; }
        };

        const runTest = new Function('crypto', wrapper);
        const result = runTest(mockCrypto);
        console.log('Result:', result);

        if (result === 'mock-uuid-1234') {
            console.log('PASS: Used crypto.randomUUID');
        } else {
            console.log('FAIL: Did not use crypto.randomUUID correctly.');
        }
    }

} catch (e) {
    console.error('Error executing verification:', e);
}
