# Direct Take Web Tools

This workspace contains a small browser dashboard and a local JavaScript client for the Medialooks Direct Take REST API.

## Projects

- `directtake-js-client` - dependency-free ESM client for the Direct Take REST API.
- `directtake-web-dashboard` - Vite-powered web dashboard that uses the local client package.

## Requirements

- Node.js 18 or newer
- npm
- A running Medialooks Direct Take REST API service

By default, the dashboard proxies API requests from `/dt-api` to `http://127.0.0.1:9531/api`.

## Install

Install dependencies for both projects:

```sh
cd directtake-js-client
npm install

cd ../directtake-web-dashboard
npm install
```

## Run the dashboard

```sh
cd directtake-web-dashboard
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```text
http://localhost:9001
```

The dashboard stores the REST API URL, auth token, and refresh intervals in browser `localStorage`.

## Configure the API target

The dashboard uses a Vite proxy so the browser can call the Direct Take API through `/dt-api`.

To point the proxy at a different Direct Take REST host:

```sh
cd directtake-web-dashboard
$env:DIRECTTAKE_REST_TARGET = "http://127.0.0.1:9531"
npm run dev
```

The value should be the Direct Take host root, not the `/api` path. The proxy rewrites `/dt-api` to `/api`.

## Dashboard features

- Connect to the Direct Take REST API with an optional bearer token.
- View and manage channels, sources, destinations, and presets.
- Assign sources and destinations to channels.
- Start, pause, and stop channel recording.
- Start, pause, and stop synchronous recording.
- View resource metrics and channel recording stats.
- Refresh channel previews on a configurable interval.
- Save or open the session log.

## JavaScript client usage

```js
import { DirectTakeClient } from '@local/directtake-js-client';

const directTake = new DirectTakeClient({
  baseUrl: 'http://localhost:9000/api/',
  token: 'perm:your-token'
});

const channels = await directTake.getChannels();
await directTake.startChannelRecording(0);
```

All client methods accept an optional final options object with `signal` and `headers`.

## Test the client

```sh
cd directtake-js-client
npm test
```

## Build the dashboard

```sh
cd directtake-web-dashboard
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Repository layout

```text
.
+-- directtake-js-client
|   +-- src/index.js
|   +-- test/direct-take-client.test.js
|   +-- package.json
+-- directtake-web-dashboard
    +-- src/main.js
    +-- src/styles.css
    +-- vite.config.js
    +-- package.json
```
