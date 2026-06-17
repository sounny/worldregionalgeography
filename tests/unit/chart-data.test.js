import { test, describe, beforeEach, after } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

// Load and evaluate the chart-data.js module
const scriptPath = path.resolve('js/chart-data.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Mock DOM
global.document = {
    getElementById: () => null
};

// Mock a simple window context so that script execution defines window.ChartDataManager
// but since the module uses const ChartDataManager, it won't attach to window by default.
// We'll wrap it in a function that returns ChartDataManager to extract it.
const getChartDataManager = new Function('document', `
    ${scriptContent}
    return ChartDataManager;
`);

const ChartDataManager = getChartDataManager(global.document);

describe('ChartDataManager.createChart', () => {
    let mockElement;
    let mockConsoleWarn;
    let mockConsoleError;
    let warnMessages = [];
    let errorMessages = [];

    beforeEach(() => {
        // Reset mocks
        mockElement = { id: 'test-container' };

        warnMessages = [];
        errorMessages = [];

        // Mock console.warn and console.error
        mockConsoleWarn = console.warn;
        console.warn = (msg) => warnMessages.push(msg);

        mockConsoleError = console.error;
        console.error = (msg, err) => errorMessages.push({ msg, err });

        // Default document.getElementById mock
        global.document.getElementById = (id) => {
            if (id === 'test-container') return mockElement;
            return null;
        };

        // Reset Chart global
        delete global.Chart;
    });

    // Restore console methods after all tests
    after(() => {
        console.warn = mockConsoleWarn;
        console.error = mockConsoleError;
    });

    test('should return null and warn if container element is not found', () => {
        const result = ChartDataManager.createChart('missing-container', {});

        assert.strictEqual(result, null);
        assert.strictEqual(warnMessages.length, 1);
        assert.ok(warnMessages[0].includes('Chart container missing-container not found'));
    });

    test('should return null and error if Chart global is undefined', () => {
        const result = ChartDataManager.createChart('test-container', {});

        assert.strictEqual(result, null);
        assert.strictEqual(errorMessages.length, 1);
        assert.ok(errorMessages[0].msg.includes('Chart.js library not loaded'));
    });

    test('should return new Chart instance if container and Chart global exist', () => {
        // Mock Chart constructor
        class MockChart {
            constructor(ctx, config) {
                this.ctx = ctx;
                this.config = config;
                this.isMock = true;
            }
        }
        global.Chart = MockChart;

        const config = { type: 'bar' };
        const result = ChartDataManager.createChart('test-container', config);

        assert.notStrictEqual(result, null);
        assert.strictEqual(result.isMock, true);
        assert.strictEqual(result.ctx, mockElement);
        assert.strictEqual(result.config, config);
        assert.strictEqual(warnMessages.length, 0);
        assert.strictEqual(errorMessages.length, 0);
    });

    test('should return null and error if Chart constructor throws an exception', () => {
        // Mock Chart constructor that throws
        global.Chart = class {
            constructor() {
                throw new Error('Test exception');
            }
        };

        const result = ChartDataManager.createChart('test-container', {});

        assert.strictEqual(result, null);
        assert.strictEqual(errorMessages.length, 1);
        assert.ok(errorMessages[0].msg.includes('Error creating chart test-container'));
        assert.strictEqual(errorMessages[0].err.message, 'Test exception');
    });
});
