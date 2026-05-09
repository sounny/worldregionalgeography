import { test, describe, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

// Mock DOM
const elementCache = {};

const mockDocument = {
    getElementById: mock.fn((id) => {
        if (!elementCache[id]) {
            if (id === 'missing-container') return null;
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

global.document = mockDocument;
global.window = { location: { pathname: '/' } };

// Mock Leaflet
const createMockLayer = () => {
    return {
        addTo: mock.fn(function() { return this; }),
        bindPopup: mock.fn(function() { return this; }),
        on: mock.fn(function(events) {
            this._handlers = events;
            return this;
        }),
        setStyle: mock.fn(function() { return this; }),
        bringToFront: mock.fn(function() { return this; }),
        getBounds: mock.fn(() => 'bounds')
    };
};

const createMockMap = () => {
    return {
        setView: mock.fn(function() { return this; }),
        fitBounds: mock.fn(function() { return this; }),
    };
};

const createMockControlLayers = () => {
    return {
        addTo: mock.fn(function() { return this; }),
        addOverlay: mock.fn(function() { return this; })
    };
};

let mockL;

function resetMocks() {
    for (const key in elementCache) delete elementCache[key];
    mockDocument.getElementById.mock.resetCalls();

    mockL = {
        map: mock.fn(() => createMockMap()),
        tileLayer: mock.fn(() => createMockLayer()),
        geoJSON: mock.fn((data, options) => {
            const layer = createMockLayer();
            layer._data = data;
            layer._options = options;
            return layer;
        }),
        control: {
            layers: mock.fn(() => createMockControlLayers())
        }
    };

    global.L = mockL;

    const consoleError = console.error;
    console.error = mock.fn();
}

resetMocks();

// We use eval to load the non-module script
const scriptContent = fs.readFileSync(path.resolve('./js/map-init.js'), 'utf8');
eval(scriptContent);

const ManagerToTest = window.MapManager;

describe('MapManager (legacy non-module)', () => {
    beforeEach(() => {
        resetMocks();
    });

    describe('initMap', () => {
        test('initializes map with valid container', () => {
            const map = ManagerToTest.initMap('valid-container', [10, 20], 4);

            assert.strictEqual(mockDocument.getElementById.mock.calls.length, 1);
            assert.strictEqual(mockDocument.getElementById.mock.calls[0].arguments[0], 'valid-container');

            assert.strictEqual(mockL.map.mock.calls.length, 1);
            assert.strictEqual(mockL.map.mock.calls[0].arguments[0], 'valid-container');

            // Should add tile layer
            assert.strictEqual(mockL.tileLayer.mock.calls.length, 2);
            assert.ok(map !== null);
        });

        test('returns null if container missing', () => {
            const map = ManagerToTest.initMap('missing-container');
            assert.strictEqual(map, null);
            assert.strictEqual(console.error.mock.calls.length, 1);
        });

        test('returns null if L is undefined', () => {
            const originalL = global.L;
            global.L = undefined;

            try {
                const map = ManagerToTest.initMap('valid-container');
                assert.strictEqual(map, null);
                assert.strictEqual(console.error.mock.calls.length, 1);
            } finally {
                global.L = originalL;
            }
        });
    });

    describe('addGeoJson', () => {
        let mockMap;

        beforeEach(() => {
            mockMap = createMockMap();
            mockMap.layerControl = createMockControlLayers();
        });

        test('returns null if map or data is missing', () => {
            assert.strictEqual(ManagerToTest.addGeoJson(null, {}), null);
            assert.strictEqual(ManagerToTest.addGeoJson(mockMap, null), null);
        });

        test('adds geojson with correct styles', () => {
            const data = { type: 'FeatureCollection', features: [] };
            const layer = ManagerToTest.addGeoJson(mockMap, data, {
                style: { color: 'red', weight: 4 }
            });

            assert.strictEqual(mockL.geoJSON.mock.calls.length, 1);
            assert.strictEqual(layer.addTo.mock.calls.length, 1);
            assert.strictEqual(layer.addTo.mock.calls[0].arguments[0], mockMap);

            assert.strictEqual(mockMap.layerControl.addOverlay.mock.calls.length, 1);
            assert.strictEqual(mockMap.layerControl.addOverlay.mock.calls[0].arguments[0], layer);
            assert.strictEqual(mockMap.layerControl.addOverlay.mock.calls[0].arguments[1], 'World Regions');

            // test style function
            const styleFn = mockL.geoJSON.mock.calls[0].arguments[1].style;
            const styleRes = styleFn({ properties: { color: 'green' } });

            assert.strictEqual(styleRes.fillColor, 'green');
            assert.strictEqual(styleRes.color, 'red');
            assert.strictEqual(styleRes.weight, 4);

            const styleResDefault = styleFn({ properties: {} });
            assert.strictEqual(styleResDefault.fillColor, '#4A90A4');
        });

        test('handles onEachFeature and popups', () => {
            const customOnEach = mock.fn();

            const data = { type: 'FeatureCollection', features: [] };
            ManagerToTest.addGeoJson(mockMap, data, { onEachFeature: customOnEach });

            const onEachFn = mockL.geoJSON.mock.calls[0].arguments[1].onEachFeature;
            const mockFeatureLayer = createMockLayer();

            // test popup with no chapter/link
            onEachFn({ properties: { name: 'Region A' } }, mockFeatureLayer);
            assert.strictEqual(mockFeatureLayer.bindPopup.mock.calls.length, 1);
            assert.ok(mockFeatureLayer.bindPopup.mock.calls[0].arguments[0].includes('Region A'));
            assert.ok(!mockFeatureLayer.bindPopup.mock.calls[0].arguments[0].includes('href'));
            assert.strictEqual(customOnEach.mock.calls.length, 1);

            // test popup with standard link
            onEachFn({ properties: { name: 'Region B', link: 'https://example.com' } }, mockFeatureLayer);
            assert.ok(mockFeatureLayer.bindPopup.mock.calls[1].arguments[0].includes('href="https://example.com"'));

            // test popup with relative link and pathname includes /chapters/
            global.window.location.pathname = '/chapters/01-test/';
            onEachFn({ properties: { name: 'Region C', link: '02-test/index.html' } }, mockFeatureLayer);
            assert.ok(mockFeatureLayer.bindPopup.mock.calls[2].arguments[0].includes('href="../../02-test/index.html"'));
            global.window.location.pathname = '/'; // reset
        });

        test('sets up event delegation', () => {
            const data = { type: 'FeatureCollection', features: [] };
            const layer = ManagerToTest.addGeoJson(mockMap, data, { style: { fillOpacity: 0.1 } });

            assert.strictEqual(layer.on.mock.calls.length, 1);
            const events = layer.on.mock.calls[0].arguments[0];

            assert.ok(events.mouseover);
            assert.ok(events.mouseout);
            assert.ok(events.click);

            const mockFeatureLayer = createMockLayer();

            // mouseover
            events.mouseover({ layer: mockFeatureLayer });
            assert.strictEqual(mockFeatureLayer.setStyle.mock.calls[0].arguments[0].fillOpacity, 0.5);
            assert.strictEqual(mockFeatureLayer.setStyle.mock.calls[0].arguments[0].weight, 3);
            assert.strictEqual(mockFeatureLayer.bringToFront.mock.calls.length, 1);

            // mouseout
            events.mouseout({ layer: mockFeatureLayer });
            assert.strictEqual(mockFeatureLayer.setStyle.mock.calls[1].arguments[0].fillOpacity, 0.1);
            assert.strictEqual(mockFeatureLayer.setStyle.mock.calls[1].arguments[0].weight, 2);

            // click
            events.click({ layer: mockFeatureLayer });
            assert.strictEqual(mockMap.fitBounds.mock.calls.length, 1);
            assert.strictEqual(mockMap.fitBounds.mock.calls[0].arguments[0], 'bounds');
        });
    });
});
