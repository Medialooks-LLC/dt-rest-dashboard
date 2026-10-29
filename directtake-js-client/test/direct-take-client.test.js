import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { DirectTakeClient } from '../src/index.js';

const originalFetch = globalThis.fetch;
const originalLocation = globalThis.location;

afterEach(() => {
  globalThis.fetch = originalFetch;
  globalThis.location = originalLocation;
});

test('default fetch is called with the global object as context', async () => {
  globalThis.fetch = function fetch(input, init) {
    assert.equal(this, globalThis);
    assert.equal(String(input), 'http://localhost:9000/api/channels');
    assert.equal(init.method, 'GET');
    return Promise.resolve(new Response('[]'));
  };

  const client = new DirectTakeClient();
  const channels = await client.getChannels();

  assert.deepEqual(channels, []);
});

test('relative base URLs resolve against the browser location', async () => {
  globalThis.location = new URL('http://127.0.0.1:9001/');
  globalThis.fetch = function fetch(input) {
    assert.equal(String(input), 'http://127.0.0.1:9001/dt-api/sources');
    return Promise.resolve(new Response('[]'));
  };

  const client = new DirectTakeClient({ baseUrl: '/dt-api/' });
  const sources = await client.getSources();

  assert.deepEqual(sources, []);
});

test('split methods send PUT to rec-split and sync-rec-split', async () => {
  const calls = [];
  const client = new DirectTakeClient({
    baseUrl: 'http://localhost:9531/api/',
    fetchImpl: (input, init) => {
      calls.push([init.method, String(input)]);
      return Promise.resolve(new Response(''));
    }
  });

  await client.splitChannelRecording(2);
  await client.splitSyncRecording();

  assert.deepEqual(calls, [
    ['PUT', 'http://localhost:9531/api/channels/2/rec-split'],
    ['PUT', 'http://localhost:9531/api/channels/sync-rec-split']
  ]);
});

test('actOnDialog sends ok, yes, no and cancel, and refuses unknown answers', async () => {
  const paths = [];
  const client = new DirectTakeClient({
    baseUrl: 'http://localhost:9531/api/',
    fetchImpl: (input) => {
      paths.push(new URL(String(input)).pathname);
      return Promise.resolve(new Response(''));
    }
  });

  for (const action of ['ok', 'Yes', 'no', 'cancel', true, false, 'abc']) {
    await client.actOnDialog(action);
  }

  assert.deepEqual(paths, [
    '/api/app/dialog/ok',
    '/api/app/dialog/yes',
    '/api/app/dialog/no',
    '/api/app/dialog/cancel',
    '/api/app/dialog/ok',
    '/api/app/dialog/cancel',
    '/api/app/dialog/cancel'
  ]);
});
