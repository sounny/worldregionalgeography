const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock a simple DOM environment and Leaflet object
const globalMock = {
    window: {
        location: { pathname: '/chapters/01-intro/' },
        MapManager: null
    },
    document: {
        getElementById: () => ({})
    },
    L: {
        geoJSON: (data, options) => {
            // Simulate Leaflet geoJSON creation and call onEachFeature immediately
            const mockLayer = {
                bindPopup: function (html) {
                    this._popupHtml = html;
                },
                on: () => {},
                addTo: () => {}
            };

            data.features.forEach(feature => {
                if (options.onEachFeature) {
                    options.onEachFeature(feature, mockLayer);
                }
            });
            return mockLayer;
        }
    }
};

// Set up globals
global.window = globalMock.window;
global.document = globalMock.document;
global.L = globalMock.L;

// Load the file using eval to simulate browser environment
const scriptPath = path.resolve(__dirname, 'js/map-init.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Use eval instead of vm or require for the non-module script
eval(scriptContent);

function runTests() {
    console.log("Running XSS tests on map-init.js...");

    let popupCalls = [];

    // Map mock for addGeoJson
    const mapMock = {
        layerControl: { addOverlay: () => {} }
    };

    // Replace L.geoJSON temporarily to intercept the created layer
    const originalGeoJSON = global.L.geoJSON;
    global.L.geoJSON = (data, options) => {
        const mockLayer = {
            bindPopup: function(html) {
                popupCalls.push(html);
                return this;
            },
            on: () => {},
            addTo: () => {}
        };

        data.features.forEach(feature => {
            if (options.onEachFeature) {
                options.onEachFeature(feature, mockLayer);
            }
        });

        return mockLayer;
    };

    // Test 1: XSS in feature name
    const maliciousData1 = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            properties: {
                name: '<script>alert(1)</script>',
                link: 'safe-link.html'
            }
        }]
    };

    window.MapManager.addGeoJson(mapMock, maliciousData1);
    const popup1 = popupCalls[0];
    assert.ok(popup1.includes('&lt;script&gt;alert(1)&lt;/script&gt;'), `Popup should escape HTML tags. Got: ${popup1}`);
    assert.ok(!popup1.includes('<script>'), `Popup contains unescaped script tag. Got: ${popup1}`);
    console.log("✅ Passed: XSS in feature name is escaped");

    // Test 2: javascript: URI in link
    popupCalls = []; // reset
    const maliciousData2 = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            properties: {
                name: 'Safe Name',
                link: '  javascript:alert(1)  '
            }
        }]
    };

    window.MapManager.addGeoJson(mapMock, maliciousData2);
    const popup2 = popupCalls[0];
    assert.ok(!popup2.includes('javascript:'), `Popup should not contain javascript: URI. Got: ${popup2}`);
    // Since linkUrl becomes empty string, chapterLink should also be an empty string, meaning no <br>
    assert.ok(!popup2.includes('<br>'), `Popup should not contain link markup when link is sanitized. Got: ${popup2}`);
    console.log("✅ Passed: javascript: URI is sanitized");

    // Test 3: Standard safe usage
    popupCalls = []; // reset
    const safeData = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            properties: {
                name: 'Europe & Russia',
                link: '02-europe'
            }
        }]
    };

    window.MapManager.addGeoJson(mapMock, safeData);
    const popup3 = popupCalls[0];
    assert.ok(popup3.includes('<strong>Europe &amp; Russia</strong>'), `Popup should escape & correctly. Got: ${popup3}`);
    assert.ok(popup3.includes('href="../../02-europe"'), `Popup should construct valid link. Got: ${popup3}`);
    console.log("✅ Passed: Safe data works normally");

    // Restore L.geoJSON
    global.L.geoJSON = originalGeoJSON;

    console.log("All XSS tests passed successfully!");
}

try {
    runTests();
} catch (e) {
    console.error("Test failed:", e.message);
    process.exit(1);
}
