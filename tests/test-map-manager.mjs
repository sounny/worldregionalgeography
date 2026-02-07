
import { test, describe, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert';

// We need to setup mocks BEFORE importing the module because top-level code might use them
// (though MapManager seems to use them inside functions).

// Mock DOM
const elementCache = {};

const mockDocument = {
    getElementById: mock.fn((id) => {
        // Return null for missing elements tests if we want, but tests override the mock.
        // For standard calls, return cached or new object.
        if (!elementCache[id]) {
            elementCache[id] = {
                id,
                style: {},
                innerHTML: '',
                offsetHeight: 100,
                classList: { add: () => {}, remove: () => {}, contains: () => false }
            };
        }
        return elementCache[id];
    }),
    createElement: mock.fn((tag) => ({ tagName: tag.toUpperCase(), style: {}, classList: { add: () => {} } }))
};

const mockWindow = {
    location: { href: '' }
};

global.document = mockDocument;
global.window = mockWindow;

// Mock Leaflet
const createMockLayer = () => ({
    addTo: mock.fn(function() { return this; }),
    bindPopup: mock.fn(function() { return this; }),
    bindTooltip: mock.fn(function() { return this; }),
    on: mock.fn(function(event, handler) {
        // Store handler to trigger it later if needed
        if (!this._handlers) this._handlers = {};
        this._handlers[event] = handler;
        return this;
    }),
    setStyle: mock.fn(function() { return this; }),
    openPopup: mock.fn(function() { return this; })
});

const createMockMap = () => ({
    setView: mock.fn(function() { return this; }),
    addTo: mock.fn(function() { return this; }),
});

const createdLayers = [];

const mockL = {
    map: mock.fn(() => createMockMap()),
    tileLayer: mock.fn(() => createMockLayer()),
    circleMarker: mock.fn(() => {
        const layer = createMockLayer();
        createdLayers.push(layer);
        return layer;
    }),
    marker: mock.fn(() => {
        const layer = createMockLayer();
        createdLayers.push(layer);
        return layer;
    }),
    geoJSON: mock.fn(() => createMockLayer()),
    featureGroup: mock.fn(() => createMockLayer())
};

global.L = mockL;

// Import the module under test
import MapManager from '../js/modules/mapManager.js';

describe('MapManager', () => {
    beforeEach(() => {
        // Reset mocks
        mockDocument.getElementById.mock.resetCalls();
        mockL.map.mock.resetCalls();
        mockL.tileLayer.mock.resetCalls();
        mockL.circleMarker.mock.resetCalls();
        mockL.marker.mock.resetCalls();
        mockL.geoJSON.mock.resetCalls();
        mockWindow.location.href = '';
        createdLayers.length = 0;

        // Reset cache
        for (const key in elementCache) delete elementCache[key];
    });

    describe('initPreviewMap', () => {
        test('should initialize map if container exists', () => {
            MapManager.initPreviewMap();

            assert.strictEqual(mockDocument.getElementById.mock.calls.length, 1);
            assert.strictEqual(mockDocument.getElementById.mock.calls[0].arguments[0], 'preview-map');

            assert.strictEqual(mockL.map.mock.calls.length, 1);
            assert.strictEqual(mockL.map.mock.calls[0].arguments[0], 'preview-map');

            // Check if tile layer was added
            assert.strictEqual(mockL.tileLayer.mock.calls.length, 1);

            // Check if markers were added (10 regions)
            assert.strictEqual(mockL.circleMarker.mock.calls.length, 10);
        });

        test('should not initialize if container missing', () => {
            // Mock getElementById to return null
            const originalGet = mockDocument.getElementById;
            mockDocument.getElementById = mock.fn(() => null);

            MapManager.initPreviewMap();

            assert.strictEqual(mockL.map.mock.calls.length, 0);

            // Restore
            mockDocument.getElementById = originalGet;
        });
    });

    describe('initRegionalNavigator', () => {
        test('should initialize navigator map with correct markers', () => {
            MapManager.initRegionalNavigator();

            assert.strictEqual(mockL.map.mock.calls.length, 1);
            assert.strictEqual(mockL.map.mock.calls[0].arguments[0], 'regions-map');

            // Check markers (10 regions)
            assert.strictEqual(mockL.circleMarker.mock.calls.length, 10);

            // Verify tooltips are bound
            const marker = createdLayers[0];
            assert.strictEqual(marker.bindTooltip.mock.calls.length, 1);
        });

        test('should handle mouseover interaction correctly', () => {
            MapManager.initRegionalNavigator();

            // Test interaction on the first created marker (Europe)
            const marker = createdLayers[0];
            assert.ok(marker._handlers['mouseover'], 'mouseover handler should be attached');

            // Trigger mouseover
            marker._handlers['mouseover'].call(marker);

            // Check if style was updated
            assert.strictEqual(marker.setStyle.mock.calls.length, 1);
            assert.deepStrictEqual(marker.setStyle.mock.calls[0].arguments[0], { radius: 20, fillOpacity: 1 });

            // Check if panel was updated with Europe data
            const panel = elementCache['region-info-panel'];
            assert.ok(panel.innerHTML.includes('Europe'), 'Info panel should contain region name Europe');
            assert.ok(panel.innerHTML.includes('Migration & Identity'), 'Info panel should contain Europe theme');
        });

        test('should handle mouseout interaction correctly', () => {
             MapManager.initRegionalNavigator();
             const marker = createdLayers[0];

             // Trigger mouseout
             marker._handlers['mouseout'].call(marker);

             // Check if style was reset
             assert.strictEqual(marker.setStyle.mock.calls.length, 1);
             assert.deepStrictEqual(marker.setStyle.mock.calls[0].arguments[0], { radius: 15, fillOpacity: 0.8 });
        });

        test('should handle click navigation', () => {
            MapManager.initRegionalNavigator();
            const marker = createdLayers[0]; // Europe

            // Trigger click
            marker._handlers['click'].call(marker);

            assert.ok(mockWindow.location.href.includes('chapters/02-europe/index.html'), 'Should navigate to Europe chapter');
        });

        test('should fail gracefully if elements missing', () => {
             const originalGet = mockDocument.getElementById;
             mockDocument.getElementById = mock.fn(() => null);

             MapManager.initRegionalNavigator();
             assert.strictEqual(mockL.map.mock.calls.length, 0);

             mockDocument.getElementById = originalGet;
        });

        test('should fail gracefully if L is undefined', () => {
             const originalL = global.L;
             global.L = undefined;

             MapManager.initRegionalNavigator();
             assert.strictEqual(mockL.map.mock.calls.length, 0);

             global.L = originalL;
        });
    });

    describe('createRegionMap', () => {
        test('should create map with config', () => {
            const config = {
                center: [10, 10],
                zoom: 5,
                geojson: { type: 'FeatureCollection', features: [] },
                markers: [{ coords: [10, 10], name: 'Test' }]
            };

            const map = MapManager.createRegionMap('test-container', config);

            assert.strictEqual(mockL.map.mock.calls.length, 1);
            assert.strictEqual(mockL.map.mock.calls[0].arguments[0], 'test-container');

            assert.strictEqual(mockL.geoJSON.mock.calls.length, 1);
            assert.strictEqual(mockL.marker.mock.calls.length, 1);
        });
    });
});
