import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock Environment
const mockDocument = {
    elements: {},
    getElementById(id) {
        return this.elements[id] || null;
    }
};

class MockChart {
    constructor(ctx, config) {
        this.ctx = ctx;
        this.config = config;
    }
}

global.document = mockDocument;
global.Chart = MockChart;
global.window = { Chart: MockChart };

// Load source code
const sourcePath = path.resolve(__dirname, '../../js/chart-data.js');
const sourceCode = fs.readFileSync(sourcePath, 'utf8');

// Execute source. We don't pass Chart as a parameter so it looks it up in global.
const runSource = () => {
    const fn = new Function('document', 'window', `${sourceCode}; return ChartDataManager;`);
    return fn(mockDocument, global.window);
};

const ChartDataManager = runSource();

test('ChartDataManager - defaultOptions', (t) => {
    assert.strictEqual(typeof ChartDataManager.defaultOptions, 'object');
    assert.strictEqual(ChartDataManager.defaultOptions.responsive, true);
    assert.strictEqual(ChartDataManager.defaultOptions.plugins.legend.position, 'bottom');
});

test('ChartDataManager - regionColors', (t) => {
    assert.strictEqual(ChartDataManager.regionColors.europe, '#4A90A4');
    assert.strictEqual(ChartDataManager.regionColors.russia, '#E67E22');
});

test('ChartDataManager - getPopulationChart', (t) => {
    const regionPop = 500000000;
    const worldPop = 8000000000;
    const chart = ChartDataManager.getPopulationChart(regionPop, worldPop);

    assert.strictEqual(chart.type, 'pie');
    assert.deepStrictEqual(chart.data.labels, ['Region', 'Rest of World']);
    assert.deepStrictEqual(chart.data.datasets[0].data, [regionPop, worldPop - regionPop]);
    assert.strictEqual(chart.options.responsive, true);
    assert.strictEqual(chart.options.plugins.title.text, 'Regional vs. Global Population');
});

test('ChartDataManager - russiaResourcesChart', (t) => {
    const chart = ChartDataManager.russiaResourcesChart;
    assert.strictEqual(chart.type, 'doughnut');
    assert.ok(chart.data.datasets[0].data.length > 0);
});

test('ChartDataManager - createChart', (t) => {
    const containerId = 'test-chart';
    const config = { type: 'bar', data: {}, options: {} };

    // Test missing container
    const nullChart = ChartDataManager.createChart('missing-container', config);
    assert.strictEqual(nullChart, null);

    // Test successful creation
    mockDocument.elements[containerId] = { id: containerId };
    const chart = ChartDataManager.createChart(containerId, config);
    assert.ok(chart instanceof MockChart);
    assert.strictEqual(chart.ctx.id, containerId);
    assert.strictEqual(chart.config, config);

    // Test missing Chart library
    const originalChart = global.Chart;
    // In Node.js global context, 'typeof Chart' checks the global object.
    delete global.Chart;

    const noLibraryChart = ChartDataManager.createChart(containerId, config);
    assert.strictEqual(noLibraryChart, null);

    global.Chart = originalChart;
});

test('ChartDataManager - data transformation consistency', (t) => {
    // Verify that bar charts have the correct scale configuration
    const barCharts = [
        ChartDataManager.russiaEconomyChart,
        ChartDataManager.menaOilReservesChart,
        ChartDataManager.southAsiaDensityChart
    ];

    barCharts.forEach(chart => {
        assert.strictEqual(chart.type, 'bar');
        assert.ok(chart.options.scales, 'Chart should have scales defined');
    });
});
