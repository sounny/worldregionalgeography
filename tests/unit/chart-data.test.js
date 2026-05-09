import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const chartDataJsPath = path.resolve(__dirname, '../../js/chart-data.js');
let chartDataJsCode = fs.readFileSync(chartDataJsPath, 'utf8');

// Capture console calls
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
let lastError = null;
let lastWarn = null;

// Mock environment
global.window = global;
global.document = {
    getElementById: () => null
};

global.Chart = class {
    constructor() {}
};

console.error = (...args) => {
    lastError = args.join(' ');
    // originalConsoleError(...args);
};
console.warn = (...args) => {
    lastWarn = args.join(' ');
    // originalConsoleWarn(...args);
};

// Fix the code for evaluation in Node.js ESM environment
chartDataJsCode = chartDataJsCode.replace('const ChartDataManager =', 'global.ChartDataManager =');
chartDataJsCode = chartDataJsCode.replaceAll('...this.defaultOptions', '...global.mockDefaultOptions');

global.mockDefaultOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: { labels: {} },
        tooltip: {}
    },
    scales: {
        y: { ticks: {}, grid: {} },
        x: { ticks: {}, grid: {} }
    }
};

// Execute the code
eval(chartDataJsCode);

test('ChartDataManager.createChart - Successful creation', (t) => {
    const mockCtx = {};
    global.document.getElementById = (id) => id === 'valid-id' ? mockCtx : null;
    global.Chart = class {
        constructor(ctx, config) {
            this.ctx = ctx;
            this.config = config;
        }
    };

    const config = { type: 'bar', data: {}, options: {} };
    const chart = ChartDataManager.createChart('valid-id', config);

    assert.ok(chart instanceof global.Chart);
    assert.strictEqual(chart.ctx, mockCtx);
    assert.strictEqual(chart.config, config);
});

test('ChartDataManager.createChart - Missing container', (t) => {
    lastWarn = null;
    global.document.getElementById = () => null;

    const chart = ChartDataManager.createChart('missing-id', {});

    assert.strictEqual(chart, null);
    assert.ok(lastWarn && lastWarn.includes('Chart container missing-id not found'));
});

test('ChartDataManager.createChart - Missing Chart.js library', (t) => {
    lastError = null;
    const oldChart = global.Chart;
    delete global.Chart;

    global.document.getElementById = () => ({});

    const chart = ChartDataManager.createChart('id', {});

    assert.strictEqual(chart, null);
    assert.ok(lastError && lastError.includes('Chart.js library not loaded'));

    global.Chart = oldChart; // Restore
});

test('ChartDataManager.createChart - Chart constructor error', (t) => {
    lastError = null;
    global.document.getElementById = () => ({});
    global.Chart = class {
        constructor() {
            throw new Error('Simulation error');
        }
    };

    const chart = ChartDataManager.createChart('id', {});

    assert.strictEqual(chart, null);
    assert.ok(lastError && lastError.includes('Error creating chart id:'));
    assert.ok(lastError && lastError.includes('Simulation error'));
});

// Note: Restoring console after all tests might be tricky with node --test if it runs in parallel or async.
// But since these are synchronous tests, it should be fine.
// Actually, it's better to restore at the very end of the file.
// Or use t.after() if available.
