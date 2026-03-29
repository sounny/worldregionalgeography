import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

// Read and evaluate the script in the global scope
const mapInitSource = fs.readFileSync(path.resolve('./js/map-init.js'), 'utf8');

test('MapManager Initialization and Methods', async (t) => {
    // 1. Setup Mock Environment
    const originalWindow = global.window;
    const originalDocument = global.document;
    const originalL = global.L;
    const originalConsoleError = console.error;

    // We will collect logs to verify error handling
    let errorLogs = [];
    console.error = (msg) => errorLogs.push(msg);

    // Mock Document
    const mockElements = {};
    global.document = {
        getElementById: (id) => mockElements[id] || null
    };

    // Mock Window
    global.window = {
        location: { pathname: '/chapters/01-intro/' }
    };

    // Mock Leaflet (L)
    const createMockLayer = () => {
        const layer = {
            addTo: () => layer,
            bindPopup: () => layer,
            on: () => layer,
            setStyle: () => layer,
            bringToFront: () => layer
        };
        return layer;
    };

    const mockL = {
        map: (id, options) => {
            return {
                setView: (center, zoom) => ({
                    _id: id,
                    _center: center,
                    _zoom: zoom,
                    _options: options,
                    layerControl: null,
                    fitBounds: () => {}
                })
            };
        },
        tileLayer: (url, options) => {
            return {
                _url: url,
                _options: options,
                addTo: () => {}
            };
        },
        control: {
            layers: function(baseMaps, overlayMaps) {
                return {
                    _baseMaps: baseMaps,
                    _overlayMaps: overlayMaps,
                    addTo: function(map) {
                        map.layerControl = this;
                        return { addOverlay: () => {} };
                    },
                    addOverlay: () => {}
                };
            }
        },
        geoJSON: (data, options) => {
            return {
                _data: data,
                _options: options,
                addTo: () => {},
                on: () => {}
            };
        }
    };
    global.L = mockL;

    // Load MapManager into the environment
    // Use `eval` to simulate script tag loading since it defines a global
    eval(mapInitSource);
    const MapManager = global.window.MapManager;

    await t.test('MapManager should exist', () => {
        assert.ok(MapManager, 'MapManager should be defined');
    });

    await t.test('initMap: returns null if container does not exist', () => {
        errorLogs = [];
        const result = MapManager.initMap('missing-map');
        assert.strictEqual(result, null);
        assert.ok(errorLogs[0].includes('not found or Leaflet not loaded'));
    });

    await t.test('initMap: returns null if Leaflet (L) is undefined', () => {
        global.L = undefined;
        mockElements['test-map'] = { id: 'test-map' };
        errorLogs = [];

        const result = MapManager.initMap('test-map');

        assert.strictEqual(result, null);
        assert.ok(errorLogs[0].includes('not found or Leaflet not loaded'));

        global.L = mockL; // Restore
    });

    await t.test('initMap: successfully initializes map', () => {
        mockElements['valid-map'] = { id: 'valid-map' };

        const map = MapManager.initMap('valid-map', [30, -90], 5);

        assert.ok(map);
        assert.strictEqual(map._id, 'valid-map');
        assert.deepStrictEqual(map._center, [30, -90]);
        assert.strictEqual(map._zoom, 5);
        assert.ok(map.layerControl);
    });

    await t.test('initMap: uses default center and zoom if not provided', () => {
        mockElements['default-map'] = { id: 'default-map' };

        const map = MapManager.initMap('default-map');

        assert.ok(map);
        assert.deepStrictEqual(map._center, [20, 0]);
        assert.strictEqual(map._zoom, 2);
    });

    await t.test('addGeoJson: returns null if map is missing', () => {
        const result = MapManager.addGeoJson(null, {});
        assert.strictEqual(result, null);
    });

    await t.test('addGeoJson: returns null if data is missing', () => {
        const result = MapManager.addGeoJson({}, null);
        assert.strictEqual(result, null);
    });

    await t.test('addGeoJson: adds geoJSON to map with default styling', () => {
        mockElements['geo-map'] = { id: 'geo-map' };
        const map = MapManager.initMap('geo-map');

        const geoJsonData = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: { name: "Test Region" },
                    geometry: { type: "Point", coordinates: [0, 0] }
                }
            ]
        };

        const layer = MapManager.addGeoJson(map, geoJsonData);
        assert.ok(layer);
        assert.deepStrictEqual(layer._data, geoJsonData);
        assert.ok(layer._options.style);
        assert.ok(layer._options.onEachFeature);
    });

    await t.test('addGeoJson: correctly applies custom styles', () => {
        mockElements['style-map'] = { id: 'style-map' };
        const map = MapManager.initMap('style-map');

        const geoJsonData = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: { color: "#ff0000" },
                    geometry: { type: "Point", coordinates: [0, 0] }
                }
            ]
        };

        const options = {
            style: { color: '#0000ff', weight: 4 }
        };

        const layer = MapManager.addGeoJson(map, geoJsonData, options);
        assert.ok(layer);

        const featureStyle = layer._options.style(geoJsonData.features[0]);
        assert.strictEqual(featureStyle.fillColor, '#ff0000'); // from properties
        assert.strictEqual(featureStyle.color, '#0000ff'); // from custom options
        assert.strictEqual(featureStyle.weight, 4); // from custom options
    });

    // Restore Original Environment
    t.after(() => {
        global.window = originalWindow;
        global.document = originalDocument;
        global.L = originalL;
        console.error = originalConsoleError;
    });
});
