import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    // Helper for testing
    _getStore: () => store
  };
})();

global.localStorage = localStorageMock;
global.window = {}; // Minimal mock
global.document = {}; // Minimal mock

// Import the module under test
import Utils from '../js/modules/utils.js';

describe('Utils.ProgressTracker', () => {
  const { ProgressTracker } = Utils;
  const CHAPTER_ID = 'chapter-01';

  beforeEach(() => {
    localStorage.clear();
  });

  test('STORAGE_KEY should be defined', () => {
    assert.strictEqual(ProgressTracker.STORAGE_KEY, 'wrg_progress');
  });

  test('getProgress() returns empty object when no data', () => {
    const progress = ProgressTracker.getProgress();
    assert.deepStrictEqual(progress, {});
  });

  test('markChapterComplete() saves progress correctly', () => {
    ProgressTracker.markChapterComplete(CHAPTER_ID);

    const stored = JSON.parse(localStorage.getItem(ProgressTracker.STORAGE_KEY));
    assert.strictEqual(stored[CHAPTER_ID].completed, true);
    assert.ok(stored[CHAPTER_ID].completedAt);
    // Check if date is valid ISO string
    const date = new Date(stored[CHAPTER_ID].completedAt);
    assert.ok(!isNaN(date.getTime()));
  });

  test('isChapterComplete() returns true for completed chapter', () => {
    ProgressTracker.markChapterComplete(CHAPTER_ID);
    assert.strictEqual(ProgressTracker.isChapterComplete(CHAPTER_ID), true);
  });

  test('isChapterComplete() returns false for incomplete chapter', () => {
    assert.strictEqual(ProgressTracker.isChapterComplete('unknown-chapter'), false);
  });

  test('getCompletedCount() returns correct count', () => {
    assert.strictEqual(ProgressTracker.getCompletedCount(), 0);

    ProgressTracker.markChapterComplete('ch1');
    assert.strictEqual(ProgressTracker.getCompletedCount(), 1);

    ProgressTracker.markChapterComplete('ch2');
    assert.strictEqual(ProgressTracker.getCompletedCount(), 2);
  });

  test('reset() clears progress', () => {
    ProgressTracker.markChapterComplete(CHAPTER_ID);
    assert.strictEqual(ProgressTracker.getCompletedCount(), 1);

    ProgressTracker.reset();
    assert.strictEqual(localStorage.getItem(ProgressTracker.STORAGE_KEY), null);
    assert.strictEqual(ProgressTracker.getCompletedCount(), 0);
  });
});
