import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const chartDataJsPath = path.resolve(__dirname, '../../js/chart-data.js');
const chartDataJsCode = fs.readFileSync(chartDataJsPath, 'utf8');

// Mock Environment
const mockDocument = {
    getElementById: (id) => null,
};

const mockConsole = {
    warn: () => {},
    error: () => {},
};

// We will use a function to set up the environment and eval the code
function getChartDataManager(env = {}) {
    const context = {
        document: { ...mockDocument, ...env.document },
        console: { ...mockConsole, ...env.console },
        Chart: env.Chart,
        ...env.globals
    };

    // Use a function to wrap the eval and return ChartDataManager
    const fn = new Function('document', 'console', 'Chart', `
        ${chartDataJsCode}
        return ChartDataManager;
    `);

    return fn(context.document, context.console, context.Chart);
}

test('ChartDataManager.createChart - container not found', (t) => {
    let warnCalled = false;
    const ChartDataManager = getChartDataManager({
        console: {
            warn: (msg) => {
                if (msg.includes('not found')) warnCalled = true;
            }
        }
    });

    const result = ChartDataManager.createChart('non-existent', {});
    assert.strictEqual(result, null);
    assert.strictEqual(warnCalled, true);
});

test('ChartDataManager.createChart - Chart library not loaded', (t) => {
    let errorCalled = false;
    const ChartDataManager = getChartDataManager({
        document: {
            getElementById: (id) => ({}) // Found container
        },
        console: {
            error: (msg) => {
                if (msg.includes('Chart.js library not loaded')) errorCalled = true;
            }
        },
        Chart: undefined
    });

    const result = ChartDataManager.createChart('my-chart', {});
    assert.strictEqual(result, null);
    assert.strictEqual(errorCalled, true);
});

test('ChartDataManager.createChart - constructor error', (t) => {
    let errorCalled = false;
    const ChartDataManager = getChartDataManager({
        document: {
            getElementById: (id) => ({})
        },
        console: {
            error: (msg) => {
                if (msg.includes('Error creating chart')) errorCalled = true;
            }
        },
        Chart: class {
            constructor() {
                throw new Error('Constructor failure');
            }
        }
    });

    const result = ChartDataManager.createChart('my-chart', {});
    assert.strictEqual(result, null);
    assert.strictEqual(errorCalled, true);
});

test('ChartDataManager.createChart - success', (t) => {
    const mockCtx = { id: 'canvas' };
    const mockConfig = { type: 'bar' };

    const ChartDataManager = getChartDataManager({
        document: {
            getElementById: (id) => mockCtx
        },
        Chart: class {
            constructor(ctx, config) {
                this.ctx = ctx;
                this.config = config;
            }
        }
    });

    const result = ChartDataManager.createChart('my-chart', mockConfig);
    assert.ok(result instanceof Object);
    assert.strictEqual(result.ctx, mockCtx);
    assert.strictEqual(result.config, mockConfig);
});
