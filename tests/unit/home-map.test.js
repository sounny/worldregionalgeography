import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const homeMapCode = fs.readFileSync(path.join(__dirname, '../../js/home-map.js'), 'utf8');

describe('home-map.js', () => {
    let domContentLoadedCallback;
    let mockDocument;
    let mockL;
    let createdMap;
    let createdTileLayer;
    let createdMarkers;

    beforeEach(() => {
        createdMap = null;
        createdTileLayer = null;
        createdMarkers = [];

        mockDocument = {
            addEventListener: (event, callback) => {
                if (event === 'DOMContentLoaded') {
                    domContentLoadedCallback = callback;
                }
            },
            getElementById: (id) => {
                if (id === 'global-map') return { id: 'global-map' };
                return null;
            }
        };

        global.document = mockDocument;

        mockL = {
            map: (id, options) => {
                createdMap = {
                    id,
                    options,
                    view: null,
                    setView(coords, zoom) {
                        this.view = { coords, zoom };
                        return this;
                    }
                };
                return createdMap;
            },
            tileLayer: (url, options) => {
                createdTileLayer = {
                    url,
                    options,
                    addedTo: null,
                    addTo(map) {
                        this.addedTo = map;
                        return this;
                    }
                };
                return createdTileLayer;
            },
            circleMarker: (coords, options) => {
                const marker = {
                    coords,
                    options,
                    addedTo: null,
                    popupContent: null,
                    clickCallback: null,
                    popupOpened: false,
                    addTo(map) {
                        this.addedTo = map;
                        return this;
                    },
                    bindPopup(content) {
                        this.popupContent = content;
                        return this;
                    },
                    on(event, callback) {
                        if (event === 'click') {
                            this.clickCallback = callback;
                        }
                        return this;
                    },
                    openPopup() {
                        this.popupOpened = true;
                    }
                };
                createdMarkers.push(marker);
                return marker;
            }
        };

        global.L = mockL;

        // Reset domContentLoadedCallback
        domContentLoadedCallback = null;

        // Evaluate the code to register the event listener
        eval(homeMapCode);
    });

    test('registers DOMContentLoaded listener', () => {
        assert.ok(domContentLoadedCallback, 'DOMContentLoaded callback should be registered');
    });

    test('initializes map on DOMContentLoaded when global-map exists and L is defined', () => {
        // Trigger initialization
        domContentLoadedCallback();

        // Verify Map creation
        assert.ok(createdMap, 'Map should be created');
        assert.strictEqual(createdMap.id, 'global-map');
        assert.strictEqual(createdMap.options.minZoom, 2);
        assert.deepStrictEqual(createdMap.options.maxBounds, [[-90, -180], [90, 180]]);
        assert.strictEqual(createdMap.options.maxBoundsViscosity, 1.0);
        assert.deepStrictEqual(createdMap.view.coords, [20, 0]);
        assert.strictEqual(createdMap.view.zoom, 2);

        // Verify TileLayer creation
        assert.ok(createdTileLayer, 'TileLayer should be created');
        assert.ok(createdTileLayer.url.includes('cartocdn.com/rastertiles/voyager'));
        assert.strictEqual(createdTileLayer.addedTo, createdMap);

        // Verify Region Markers
        assert.strictEqual(createdMarkers.length, 10, 'Should create 10 region markers');

        // Verify first marker (Europe)
        const europeMarker = createdMarkers[0];
        assert.deepStrictEqual(europeMarker.coords, [50, 10]);
        assert.strictEqual(europeMarker.options.radius, 12);
        assert.strictEqual(europeMarker.options.fillColor, '#3b82f6');
        assert.strictEqual(europeMarker.addedTo, createdMap);
        assert.ok(europeMarker.popupContent.includes('Europe'));
        assert.ok(europeMarker.popupContent.includes('chapters/02-europe/index.html'));

        // Verify click handler opens popup
        assert.strictEqual(europeMarker.popupOpened, false);
        europeMarker.clickCallback.call(europeMarker);
        assert.strictEqual(europeMarker.popupOpened, true);
    });

    test('does not initialize map when global-map element is missing', () => {
        global.document.getElementById = () => null;

        domContentLoadedCallback();

        assert.strictEqual(createdMap, null, 'Map should not be created');
        assert.strictEqual(createdTileLayer, null, 'TileLayer should not be created');
        assert.strictEqual(createdMarkers.length, 0, 'No markers should be created');
    });

    test('does not initialize map when L is undefined', () => {
        global.L = undefined;

        domContentLoadedCallback();

        assert.strictEqual(createdMap, null, 'Map should not be created');
        assert.strictEqual(createdTileLayer, null, 'TileLayer should not be created');
        assert.strictEqual(createdMarkers.length, 0, 'No markers should be created');
    });
});
