const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const source = readFileSync(require('node:path').join(__dirname, '../likes.js'), 'utf8');
const tick = () => new Promise(resolve => setImmediate(resolve));
const response = (value, status = 200) => ({ status, ok: status >= 200 && status < 300, json: async () => ({ value }) });
function setup({ stored = false, blocked = false, fetcher, locks } = {}) {
  const attributes = {};
  const handlers = {};
  const events = {};
  const count = {};
  const feedback = {};
  const storage = new Map(stored ? [['xudong-homepage-liked', '1']] : []);
  const calls = [];
  const button = {
    hidden: true,
    querySelector: () => count,
    setAttribute: (key, value) => { attributes[key] = value; },
    addEventListener: (name, callback) => { handlers[name] = callback; }
  };
  vm.runInNewContext(source, {
    document: { querySelector: selector => selector === '.profile-like' ? button : feedback },
    window: { addEventListener: (name, callback) => { events[name] = callback; } },
    navigator: { locks },
    localStorage: {
      getItem(key) { if (blocked) throw new Error('Storage denied'); return storage.get(key) ?? null; },
      setItem(key, value) { if (blocked) throw new Error('Storage denied'); storage.set(key, value); }
    },
    fetch: async (url, options) => {
      calls.push({ url, options });
      return fetcher ? fetcher(url, options) : response(url.includes('/hit/') ? 8 : 7);
    },
    AbortController, setTimeout, clearTimeout, Intl
  });
  return { attributes, handlers, events, count, feedback, storage, calls, button };
}

test('loading only reads the shared total; confirmed click persists and cannot repeat', async () => {
  const ui = setup();
  assert.equal(ui.button.disabled, true);
  await tick();
  assert.equal(ui.count.textContent, '7');
  assert(ui.calls.every(call => call.url.includes('/get/')));
  await ui.handlers.click();
  assert.equal(ui.count.textContent, '8');
  assert.equal(ui.attributes['aria-pressed'], 'true');
  assert.equal(ui.storage.get('xudong-homepage-liked'), '1');
  await ui.handlers.click();
  assert.equal(ui.calls.filter(call => call.url.includes('/hit/')).length, 1);
  assert.equal(ui.calls[0].options.credentials, 'omit');
});

test('reloaded browser reads the shared count without adding another like', async () => {
  const ui = setup({ stored: true });
  await tick();
  await ui.handlers.click();
  assert.equal(ui.attributes['aria-pressed'], 'true');
  assert.equal(ui.calls.length, 1);
});

test('rapid clicks submit only once while the write is pending', async () => {
  let finish;
  const ui = setup({ fetcher: url => url.includes('/get/') ? response(7) : new Promise(resolve => { finish = resolve; }) });
  await tick();
  const pending = ui.handlers.click();
  await ui.handlers.click();
  assert.equal(ui.calls.length, 2);
  assert.equal(ui.button.disabled, true);
  finish(response(8));
  await pending;
  assert.equal(ui.count.textContent, '8');
});

test('load failure shows an unavailable count rather than a fabricated zero', async () => {
  const ui = setup({ fetcher: async () => { throw new Error('Offline'); } });
  await tick();
  assert.equal(ui.count.textContent, '—');
  assert.equal(ui.feedback.hidden, false);
  assert.equal(ui.button.disabled, false);
});

test('failed or malformed writes never mark the visitor as liked', async () => {
  for (const result of [response(0, 500), response(-1), response('8'), response(0, 404)]) {
    const ui = setup({ fetcher: url => url.includes('/get/') ? response(7) : result });
    await tick();
    await ui.handlers.click();
    assert.equal(ui.attributes['aria-pressed'], 'false');
    assert.equal(ui.count.textContent, '7');
    assert.equal(ui.storage.size, 0);
    assert.match(ui.feedback.textContent, /Could not confirm/);
  }
});

test('an unused counter starts at zero and successful likes work with storage blocked', async () => {
  const ui = setup({ blocked: true, fetcher: url => url.includes('/get/') ? response(undefined, 404) : response(1) });
  await tick();
  assert.equal(ui.count.textContent, '0');
  await ui.handlers.click();
  await ui.handlers.click();
  assert.equal(ui.attributes['aria-pressed'], 'true');
  assert.equal(ui.count.textContent, '1');
  assert.equal(ui.calls.length, 2);
});

test('another tab winning the lock prevents a second increment', async () => {
  let ui;
  ui = setup({ locks: { request: async (name, callback) => {
    ui.storage.set('xudong-homepage-liked', '1');
    return callback();
  } } });
  await tick();
  await ui.handlers.click();
  assert.equal(ui.attributes['aria-pressed'], 'true');
  assert(ui.calls.every(call => call.url.includes('/get/')));
});

test('storage events synchronize successful likes without writing the counter', async () => {
  const ui = setup();
  await tick();
  ui.events.storage({ key: 'xudong-homepage-liked', newValue: '1' });
  await tick();
  await ui.handlers.click();
  assert.equal(ui.attributes['aria-pressed'], 'true');
  assert(ui.calls.every(call => call.url.includes('/get/')));
});
