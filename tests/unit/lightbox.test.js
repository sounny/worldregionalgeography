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
        this.innerHTML = '';
        this.style = {};
        this.hidden = false;
        this.src = '';
        this.alt = '';
        this.parentNode = null;
    }

    get className() { return this._className; }
    set className(val) {
        this._className = val;
        this.classList.classes.clear();
        if (val) {
            val.split(/\s+/).filter(Boolean).forEach(cls => this.classList.classes.add(cls));
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

    addEventListener(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    dispatchEvent(event) {
        const eventName = typeof event === 'string' ? event : event.type;
        const eventObj = typeof event === 'string' ? {
            type: eventName,
            target: this,
            preventDefault: () => {}
        } : Object.assign({ target: this, preventDefault: () => {} }, event);

        if (this.listeners[eventName]) {
            this.listeners[eventName].forEach(cb => cb(eventObj));
        }
    }

    querySelector(selector) {
        if (selector === '.lightbox-image') {
            let img = this.children.find(child => child.classList.contains('lightbox-image'));
            if (!img) {
                img = new MockElement('img');
                img.classList.add('lightbox-image');
                this.appendChild(img);
            }
            return img;
        }
        if (selector === '.lightbox-close') {
            let btn = this.children.find(child => child.classList.contains('lightbox-close'));
            if (!btn) {
                btn = new MockElement('button');
                btn.classList.add('lightbox-close');
                this.appendChild(btn);
            }
            return btn;
        }

        if (selector.startsWith('.')) {
            const cls = selector.slice(1);
            const findNode = (node) => {
                if (node.classList && node.classList.contains(cls)) return node;
                for (const child of node.children) {
                    const found = findNode(child);
                    if (found) return found;
                }
                return null;
            };
            return findNode(this);
        }
        return null;
    }

    appendChild(child) {
        this.children.push(child);
        child.parentNode = this;
    }
}

// Reset environment before each test
function setupDOM() {
    global.document = {
        elements: [],
        documentListeners: {},
        body: new MockElement('body'),
        createElement(tagName) {
            const el = new MockElement(tagName);
            this.elements.push(el);
            return el;
        },
        getElementById(id) {
            return this.elements.find(el => el.id === id) || null;
        },
        querySelectorAll(selector) {
            if (selector === '.zoomable-image') {
                return this.elements.filter(el => el.classList.contains('zoomable-image'));
            }
            return [];
        },
        addEventListener(event, callback) {
            if (!this.documentListeners[event]) this.documentListeners[event] = [];
            this.documentListeners[event].push(callback);
        },
        dispatchEvent(event) {
            const eventName = typeof event === 'string' ? event : event.type;
            const eventObj = typeof event === 'string' ? {
                type: eventName,
                target: this,
                preventDefault: () => {}
            } : Object.assign({ target: this, preventDefault: () => {} }, event);

            if (this.documentListeners[eventName]) {
                this.documentListeners[eventName].forEach(cb => cb(eventObj));
            }
        }
    };

    // Create elements list which contains all elements globally created
    global.document.elements = [global.document.body];
}

test('Lightbox Module - Initialization', (t) => {
    setupDOM();

    Lightbox.init();

    const lightbox = document.getElementById('image-lightbox');
    assert.ok(lightbox, 'Lightbox element should be created');
    assert.strictEqual(lightbox.className, 'lightbox-overlay', 'Should have lightbox-overlay class');
    assert.strictEqual(lightbox.getAttribute('role'), 'dialog', 'Should have role=dialog');
    assert.strictEqual(lightbox.getAttribute('aria-modal'), 'true', 'Should have aria-modal=true');
    assert.strictEqual(lightbox.hidden, true, 'Should be hidden initially');

    // Verify it was added to body
    assert.ok(document.body.children.includes(lightbox), 'Should be appended to body');
});

test('Lightbox Module - Open via Click', (t) => {
    setupDOM();

    // Create a mock zoomable image
    const zoomableImg = document.createElement('img');
    zoomableImg.classList.add('zoomable-image');
    zoomableImg.src = 'test-image.jpg';
    zoomableImg.alt = 'Test Image Alt';
    document.body.appendChild(zoomableImg);

    Lightbox.init();

    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-image');

    // Simulate click on zoomable image
    zoomableImg.dispatchEvent('click');

    assert.strictEqual(lightbox.hidden, false, 'Lightbox should be visible');
    assert.strictEqual(lightboxImg.src, 'test-image.jpg', 'Lightbox image src should match');
    assert.strictEqual(lightboxImg.alt, 'Test Image Alt', 'Lightbox image alt should match');
    assert.strictEqual(document.body.style.overflow, 'hidden', 'Body overflow should be hidden');
});

test('Lightbox Module - Open via Keyboard (Enter/Space)', (t) => {
    setupDOM();

    const zoomableImg = document.createElement('img');
    zoomableImg.classList.add('zoomable-image');
    zoomableImg.src = 'test-image.jpg';
    document.body.appendChild(zoomableImg);

    Lightbox.init();
    const lightbox = document.getElementById('image-lightbox');

    // Simulate Enter key
    zoomableImg.dispatchEvent({ type: 'keydown', key: 'Enter' });
    assert.strictEqual(lightbox.hidden, false, 'Should open on Enter');

    // Close it
    lightbox.hidden = true;

    // Simulate Space key
    zoomableImg.dispatchEvent({ type: 'keydown', key: ' ' });
    assert.strictEqual(lightbox.hidden, false, 'Should open on Space');
});

test('Lightbox Module - Close via Close Button', (t) => {
    setupDOM();

    const zoomableImg = document.createElement('img');
    zoomableImg.classList.add('zoomable-image');
    document.body.appendChild(zoomableImg);

    Lightbox.init();

    const lightbox = document.getElementById('image-lightbox');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    // Open it first
    zoomableImg.dispatchEvent('click');
    assert.strictEqual(lightbox.hidden, false);

    // Close via button
    closeBtn.dispatchEvent('click');

    assert.strictEqual(lightbox.hidden, true, 'Lightbox should be hidden after close click');
    assert.strictEqual(document.body.style.overflow, '', 'Body overflow should be reset');
});

test('Lightbox Module - Close via Overlay Click', (t) => {
    setupDOM();

    const zoomableImg = document.createElement('img');
    zoomableImg.classList.add('zoomable-image');
    document.body.appendChild(zoomableImg);

    Lightbox.init();

    const lightbox = document.getElementById('image-lightbox');

    // Open it
    zoomableImg.dispatchEvent('click');
    assert.strictEqual(lightbox.hidden, false);

    // Click on overlay itself (target === lightbox)
    lightbox.dispatchEvent({ type: 'click', target: lightbox });
    assert.strictEqual(lightbox.hidden, true, 'Should close when clicking overlay');

    // Open it again
    zoomableImg.dispatchEvent('click');
    assert.strictEqual(lightbox.hidden, false);

    // Click on image inside overlay (target !== lightbox)
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    lightbox.dispatchEvent({ type: 'click', target: lightboxImg });
    assert.strictEqual(lightbox.hidden, false, 'Should NOT close when clicking child element');
});

test('Lightbox Module - Close via Escape Key', (t) => {
    setupDOM();

    const zoomableImg = document.createElement('img');
    zoomableImg.classList.add('zoomable-image');
    document.body.appendChild(zoomableImg);

    Lightbox.init();

    const lightbox = document.getElementById('image-lightbox');

    // Open it
    zoomableImg.dispatchEvent('click');
    assert.strictEqual(lightbox.hidden, false);

    // Press Escape
    document.dispatchEvent({ type: 'keydown', key: 'Escape' });

    assert.strictEqual(lightbox.hidden, true, 'Should close on Escape key');
    assert.strictEqual(document.body.style.overflow, '', 'Body overflow should be reset');
});
