import test from 'node:test';
import assert from 'node:assert';
import Lightbox from '../../js/modules/lightbox.js';

// Minimal DOM Mock
class MockElement {
    constructor(tagName = 'div') {
        this.tagName = tagName.toUpperCase();
        this.attributes = {};
        this.classList = {
            classes: new Set(),
            add(cls) { this.classes.add(cls); },
            remove(cls) { this.classes.delete(cls); },
            toggle(cls, force) {
                if (force === true) this.classes.add(cls);
                else if (force === false) this.classes.delete(cls);
                else if (this.classes.has(cls)) this.classes.delete(cls);
                else this.classes.add(cls);
            },
            contains(cls) { return this.classes.has(cls); }
        };
        this.listeners = {};
        this.children = [];
        this.dataset = {};
        this.id = '';
        this._className = '';
        this.textContent = '';
        this.style = {};
        this.parentNode = null;
        this.hidden = false;
        this.src = '';
        this.alt = '';
        this._innerHTML = '';
    }

    get className() { return this._className; }
    set className(val) {
        this._className = val;
        this.classList.classes.clear();
        val.split(/\s+/).filter(Boolean).forEach(cls => this.classList.classes.add(cls));
    }

    get innerHTML() { return this._innerHTML; }
    set innerHTML(val) {
        this._innerHTML = val;
        // Clear children
        this.children = [];
        // Simple mock for button and img creation in lightbox
        if (val.includes('lightbox-close')) {
            const btn = new MockElement('button');
            btn.className = 'lightbox-close';
            this.appendChild(btn);
        }
        if (val.includes('lightbox-image')) {
            const img = new MockElement('img');
            img.className = 'lightbox-image';
            this.appendChild(img);
        }
    }

    click() {
        this.dispatchEvent('click');
    }

    focus() {
        this.dispatchEvent('focus');
    }

    setAttribute(name, value) { this.attributes[name] = String(value); }
    getAttribute(name) { return this.attributes[name] || null; }
    hasAttribute(name) { return name in this.attributes; }
    addEventListener(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }
    dispatchEvent(event) {
        const eventName = typeof event === 'string' ? event : event.type;
        const target = event.target || this;
        const eventObj = {
            type: eventName,
            target: target,
            relatedTarget: event.relatedTarget || null,
            key: event.key,
            preventDefault: event.preventDefault || (() => {})
        };
        if (this.listeners[eventName]) {
            this.listeners[eventName].forEach(cb => cb(eventObj));
        }
    }
    querySelector(selector) {
        if (selector.startsWith('.')) {
            const cls = selector.slice(1);
            return this.children.find(child => child.classList.contains(cls)) || null;
        }
        if (selector.startsWith('#')) {
            const id = selector.slice(1);
            return this.children.find(child => child.id === id) || null;
        }
        return null;
    }
    querySelectorAll(selector) {
        if (selector === '.zoomable-image') {
            return global.document.elements.filter(el => el.classList.contains('zoomable-image'));
        }
        return [];
    }
    appendChild(child) {
        this.children.push(child);
        child.parentNode = this;
    }
    getBoundingClientRect() {
        return { top: 0, left: 0, width: 0, height: 0 };
    }
}

global.document = {
    elements: [],
    body: new MockElement('body'),
    listeners: {},
    createElement(tagName) {
        const el = new MockElement(tagName);
        this.elements.push(el);
        return el;
    },
    getElementById(id) {
        if (id === 'image-lightbox') {
            return this.body.children.find(child => child.id === id) || null;
        }
        return this.elements.find(el => el.id === id) || null;
    },
    querySelectorAll(selector) {
        if (selector === '.zoomable-image') {
            return this.elements.filter(el => el.classList.contains('zoomable-image'));
        }
        return [];
    },
    addEventListener(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }
};

test('Lightbox Module - DOM Creation', (t) => {
    // Reset DOM
    global.document.elements = [];
    global.document.body.children = [];

    Lightbox.init();

    const lightbox = global.document.getElementById('image-lightbox');
    assert.ok(lightbox, 'Lightbox element should be created');
    assert.strictEqual(lightbox.id, 'image-lightbox');
    assert.strictEqual(lightbox.hidden, true);
    assert.strictEqual(lightbox.getAttribute('role'), 'dialog');

    // Test multiple init calls
    Lightbox.init();
    const lightboxes = global.document.body.children.filter(child => child.id === 'image-lightbox');
    assert.strictEqual(lightboxes.length, 1, 'Should not create duplicate lightboxes');
});

test('Lightbox Module - Open Interaction', (t) => {
    // Reset DOM
    global.document.elements = [];
    global.document.body.children = [];
    global.document.body.style = {};

    const img = global.document.createElement('img');
    img.className = 'zoomable-image';
    img.src = 'test.jpg';
    img.alt = 'Test Image';
    global.document.elements.push(img);

    Lightbox.init();
    const lightbox = global.document.getElementById('image-lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-image');

    // Test click
    img.dispatchEvent('click');
    assert.strictEqual(lightbox.hidden, false);
    assert.strictEqual(lightboxImg.src, 'test.jpg');
    assert.strictEqual(lightboxImg.alt, 'Test Image');
    assert.strictEqual(global.document.body.style.overflow, 'hidden');

    // Test keyboard activation
    lightbox.hidden = true;
    let preventedDefault = false;
    img.dispatchEvent({ type: 'keydown', key: 'Enter', preventDefault: () => { preventedDefault = true; } });
    assert.strictEqual(preventedDefault, true);
    assert.strictEqual(lightbox.hidden, false);

    lightbox.hidden = true;
    preventedDefault = false;
    img.dispatchEvent({ type: 'keydown', key: ' ', preventDefault: () => { preventedDefault = true; } });
    assert.strictEqual(preventedDefault, true);
    assert.strictEqual(lightbox.hidden, false);
});

test('Lightbox Module - Close Interaction', (t) => {
    // Reset DOM
    global.document.elements = [];
    global.document.body.children = [];
    global.document.body.style = { overflow: 'hidden' };
    global.document.listeners = {};

    Lightbox.init();
    const lightbox = global.document.getElementById('image-lightbox');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    lightbox.hidden = false;

    // Test close button
    closeBtn.dispatchEvent('click');
    assert.strictEqual(lightbox.hidden, true);
    assert.strictEqual(global.document.body.style.overflow, '');

    // Test overlay click
    lightbox.hidden = false;
    lightbox.dispatchEvent({ type: 'click', target: lightbox });
    assert.strictEqual(lightbox.hidden, true);

    // Test overlay click on child (should NOT close)
    lightbox.hidden = false;
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    // Ensure the mock img is found
    assert.ok(lightboxImg, 'Lightbox image should exist');
    lightbox.dispatchEvent({ type: 'click', target: lightboxImg });
    assert.strictEqual(lightbox.hidden, false, 'Clicking lightbox image should NOT close lightbox');

    // Test Escape key
    lightbox.hidden = false;
    const escapeEvent = { type: 'keydown', key: 'Escape' };

    // Lightbox.init() adds listener to document
    if (global.document.listeners['keydown']) {
        global.document.listeners['keydown'].forEach(cb => cb(escapeEvent));
    }
    assert.strictEqual(lightbox.hidden, true, 'Escape key should close lightbox');
});
