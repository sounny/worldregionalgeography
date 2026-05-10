import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';

class MockElement {
    constructor(tagName) {
        this.tagName = tagName;
        this.children = [];
        this.textContent = '';
        this.attributes = {};
        this.className = '';
    }
    appendChild(child) {
        this.children.push(child);
    }
    setAttribute(name, value) {
        this.attributes[name] = value;
    }
    get innerHTML() {
        // Simple serialization for testing
        let attrStr = Object.entries(this.attributes).map(([k, v]) => ` ${k}="${v}"`).join('');
        if (this.className) attrStr += ` class="${this.className}"`;

        let content = this.textContent;
        if (this.children.length > 0) {
            content += this.children.map(c => c.serialize()).join('');
        }
        return `<${this.tagName}${attrStr}>${content}</${this.tagName}>`;
    }
    set innerHTML(val) {
        if (val === '') {
            this.children = [];
            this.textContent = '';
        }
    }
    serialize() {
        return this.innerHTML;
    }
}

/**
 * Security test to verify DOM XSS fix in updateInfoPanel
 */
test('Security - updateInfoPanel in js/main.js handles data safely', (t) => {
    // 1. Mock the environment
    const infoPanel = new MockElement('div');
    infoPanel.style = { animation: '' };
    Object.defineProperty(infoPanel, 'offsetHeight', { get: () => 0 });

    global.window = {
        WorldRegionsData: {
            features: [
                {
                    properties: {
                        name: 'Malicious Region',
                        theme: '<img src=x onerror=alert(1)>',
                        desc: 'Dangerous description',
                        link: 'javascript:alert(2)'
                    }
                }
            ]
        }
    };

    global.document = {
        getElementById: (id) => {
            if (id === 'region-info-panel') return infoPanel;
            return null;
        },
        createElement: (tagName) => new MockElement(tagName)
    };

    // 2. Load the function from js/main.js
    const mainJs = fs.readFileSync('js/main.js', 'utf8');
    const updateInfoPanelMatch = [null, mainJs.substring(mainJs.indexOf('function updateInfoPanelContent(data, infoPanel) {') + 'function updateInfoPanelContent(data, infoPanel) {'.length, mainJs.indexOf('// =====================================================\n// Smooth Scrolling')).trim().replace(/}\s*$/, '')];
    const functionBody = updateInfoPanelMatch[1];
    const updateInfoPanel = new Function('data', 'infoPanel', 'document', functionBody);

    // 3. Execute with malicious data
    const maliciousFeature = global.window.WorldRegionsData.features[0];
    updateInfoPanel(maliciousFeature.properties, infoPanel, global.document);

    // 4. Verify fix
    const html = infoPanel.innerHTML;
    // Malicious tags should be escaped or handled as text (meaning they appear as literal strings in serialized output if we simulate textContent)
    assert.ok(!html.includes('<img src=x'), 'HTML should NOT contain the raw malicious img tag');
    assert.ok(html.includes('&lt;img src=x'), 'Malicious tag should be treated as text (escaped in our mock serialize)');
    assert.ok(!html.includes('href="javascript:alert(2)"'), 'HTML should NOT contain the malicious javascript: link');
    assert.ok(html.includes('href="#"'), 'Malicious link should be replaced with #');
});

test('Security - updateInfoPanel in js/modules/components.js handles data safely', (t) => {
    // 1. Mock the environment
    const infoPanel = new MockElement('div');
    infoPanel.style = { animation: '' };
    Object.defineProperty(infoPanel, 'offsetHeight', { get: () => 0 });

    const regionalData = {
        'malicious': {
            name: 'Malicious',
            theme: '<img src=x onerror=alert(1)>',
            desc: 'Dangerous description',
            link: 'javascript:alert(2)'
        }
    };

    global.document = {
        createElement: (tagName) => new MockElement(tagName)
    };

    // 2. Load the function from js/modules/mapManager.js
    const mapManagerJs = fs.readFileSync('js/modules/components.js', 'utf8');
    const updateInfoPanelMatch = [null, mapManagerJs.substring(mapManagerJs.indexOf('updateInfoPanelContent(data, infoPanel) {') + 'updateInfoPanelContent(data, infoPanel) {'.length, mapManagerJs.lastIndexOf('}')).trim().replace(/}\s*$/, '')];
    const functionBody = updateInfoPanelMatch[1];
    const updateInfoPanel = new Function('data', 'infoPanel', 'document', functionBody);

    // 3. Execute with malicious data
    updateInfoPanel(regionalData['malicious'], infoPanel, global.document);

    // 4. Verify fix
    const html = infoPanel.innerHTML;
    assert.ok(!html.includes('<img src=x'), 'HTML should NOT contain the raw malicious img tag');
    assert.ok(html.includes('&lt;img src=x'), 'Malicious tag should be treated as text');
    assert.ok(!html.includes('href="javascript:alert(2)"'), 'HTML should NOT contain the malicious javascript: link');
    assert.ok(html.includes('href="#"'), 'Malicious link should be replaced with #');
});

// Helper for our mock
MockElement.prototype.serialize = function() {
    let attrStr = Object.entries(this.attributes).map(([k, v]) => ` ${k}="${v}"`).join('');
    if (this.className) attrStr += ` class="${this.className}"`;

    // Escaping for textContent in our mock
    let content = this.textContent
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    if (this.children.length > 0) {
        content += this.children.map(c => c.serialize()).join('');
    }
    return `<${this.tagName}${attrStr}>${content}</${this.tagName}>`;
};
