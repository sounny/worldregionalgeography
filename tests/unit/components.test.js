import test from 'node:test';
import assert from 'node:assert';
import Components from '../../js/modules/components.js';

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
    }

    get className() { return this._className; }
    set className(val) {
        this._className = val;
        this.classList.classes.clear();
        val.split(/\s+/).filter(Boolean).forEach(cls => this.classList.classes.add(cls));
    }

    click() {
        this.dispatchEvent('click');
    }

    setAttribute(name, value) { this.attributes[name] = String(value); }
    getAttribute(name) { return this.attributes[name] || null; }
    addEventListener(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }
    dispatchEvent(event) {
        const eventName = typeof event === 'string' ? event : event.type;
        if (this.listeners[eventName]) {
            this.listeners[eventName].forEach(cb => cb({
                type: eventName,
                target: this,
                key: event.key,
                preventDefault: () => {}
            }));
        }
    }
    querySelector(selector) {
        if (selector.startsWith('.')) {
            const cls = selector.slice(1);
            return this.children.find(child => child.classList.contains(cls)) || null;
        }
        return null;
    }
    appendChild(child) {
        this.children.push(child);
        child.parentNode = this;
    }
}

global.document = {
    elements: [],
    createElement(tagName) {
        return new MockElement(tagName);
    },
    querySelectorAll(selector) {
        if (selector === '.texas-toggle') {
            return this.elements.filter(el => el.classList.contains('texas-toggle'));
        }
        if (selector === '.accordion-item') {
            return this.elements.filter(el => el.classList.contains('accordion-item'));
        }
        if (selector === '.term-highlight') {
            return this.elements.filter(el => el.classList.contains('term-highlight'));
        }
        return [];
    }
};

// Tests
test('Components Module - initTexasToggle', (t) => {
    const toggle = new MockElement();
    toggle.classList.add('texas-toggle');

    const btn = new MockElement('button');
    btn.classList.add('btn-texas-toggle');

    const content = new MockElement();
    content.classList.add('texas-content');
    content.classList.add('hidden');

    toggle.children.push(btn, content);
    document.elements = [toggle];

    Components.initTexasToggle();

    assert.strictEqual(btn.getAttribute('role'), 'button');
    assert.strictEqual(btn.getAttribute('aria-expanded'), 'false');
    assert.strictEqual(content.getAttribute('aria-hidden'), 'true');
    assert.ok(content.id.startsWith('texas-connection-'));

    // Test click
    btn.dispatchEvent('click');
    assert.strictEqual(btn.getAttribute('aria-expanded'), 'true');
    assert.strictEqual(content.getAttribute('aria-hidden'), 'false');
    assert.ok(!content.classList.contains('hidden'));
    assert.ok(btn.classList.contains('active'));

    // Test keyboard Enter
    btn.dispatchEvent({ type: 'keydown', key: 'Enter' });
    assert.strictEqual(btn.getAttribute('aria-expanded'), 'false');
    assert.strictEqual(content.getAttribute('aria-hidden'), 'true');
    assert.ok(content.classList.contains('hidden'));
});

test('Components Module - initAccordions', (t) => {
    const item = new MockElement();
    item.classList.add('accordion-item');

    const header = new MockElement();
    header.classList.add('accordion-header');

    const content = new MockElement();
    content.classList.add('accordion-content');

    item.children.push(header, content);
    document.elements = [item];

    Components.initAccordions();

    assert.strictEqual(header.getAttribute('role'), 'button');
    assert.strictEqual(header.getAttribute('aria-expanded'), 'false');
    assert.strictEqual(content.getAttribute('aria-hidden'), 'true');

    // Test click
    header.dispatchEvent('click');
    assert.strictEqual(header.getAttribute('aria-expanded'), 'true');
    assert.strictEqual(content.getAttribute('aria-hidden'), 'false');
    assert.ok(item.classList.contains('active'));
});

test('Components Module - initKeyTerms', (t) => {
    const term = new MockElement();
    term.classList.add('term-highlight');
    term.dataset.definition = 'Test definition';

    document.elements = [term];

    Components.initKeyTerms();

    const tooltip = term.children.find(child => child.classList.contains('term-tooltip'));
    assert.ok(tooltip);
    assert.strictEqual(tooltip.textContent, 'Test definition');

    // Test mouseenter
    term.dispatchEvent('mouseenter');
    assert.ok(tooltip.classList.contains('visible'));

    // Test mouseleave
    term.dispatchEvent('mouseleave');
    assert.ok(!tooltip.classList.contains('visible'));

    // Test focus
    term.dispatchEvent('focus');
    assert.ok(tooltip.classList.contains('visible'));

    // Test blur
    term.dispatchEvent('blur');
    assert.ok(!tooltip.classList.contains('visible'));
});
