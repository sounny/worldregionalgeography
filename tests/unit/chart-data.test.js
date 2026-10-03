import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';

// Load the chart-data script
const code = fs.readFileSync('js/chart-data.js', 'utf8');

test('ChartDataManager Module', async (t) => {
    let originalDocument;
    let originalConsole;
    let originalChart;

    t.beforeEach(() => {
        originalDocument = global.document;
        originalConsole = { ...global.console };
        originalChart = global.Chart;
    });

    t.afterEach(() => {
        global.document = originalDocument;
        global.console = originalConsole;
        global.Chart = originalChart;
    });

    // Basic setup to evaluate the non-module script
    const setupEnv = () => {
        global.document = {
            getElementById: (id) => {
                if (id === 'test-container') return {}; // Mock canvas element
                return null;
            }
        };

        let warnMsg = null;
        let errorMsg = null;

        global.console = {
            ...global.console,
            warn: (msg) => { warnMsg = msg; },
            error: (msg, err) => { errorMsg = msg; }
        };

        // Capture ChartDataManager
        const wrappedCode = `
            ${code}
            return ChartDataManager;
        `;
        const getManager = new Function(wrappedCode);
        return { manager: getManager(), getWarn: () => warnMsg, getError: () => errorMsg };
    };

    await t.test('createChart - handles missing container', () => {
        const { manager, getWarn } = setupEnv();
        const result = manager.createChart('missing-container', {});

        assert.strictEqual(result, null);
        assert.strictEqual(getWarn(), 'Chart container missing-container not found');
    });

    await t.test('createChart - handles missing Chart.js library', () => {
        const { manager, getError } = setupEnv();
        // Ensure Chart is undefined
        global.Chart = undefined;

        const result = manager.createChart('test-container', {});

        assert.strictEqual(result, null);
        assert.strictEqual(getError(), 'Chart.js library not loaded. Add CDN script tag.');
    });

    await t.test('createChart - successfully creates chart', () => {
        const { manager } = setupEnv();

        // Mock Chart constructor
        let chartCreated = false;
        global.Chart = class {
            constructor(ctx, config) {
                chartCreated = true;
                this.ctx = ctx;
                this.config = config;
            }
        };

        const result = manager.createChart('test-container', { type: 'bar' });

        assert.ok(result);
        assert.strictEqual(chartCreated, true);
        assert.strictEqual(result.config.type, 'bar');
    });

    await t.test('createChart - handles error during chart creation', () => {
        const { manager, getError } = setupEnv();

        // Mock Chart constructor to throw an error
        global.Chart = class {
            constructor(ctx, config) {
                throw new Error('Test error during chart creation');
            }
        };

        const result = manager.createChart('test-container', { type: 'bar' });

        assert.strictEqual(result, null);
        assert.ok(getError().includes('Error creating chart test-container'));
    });
});
