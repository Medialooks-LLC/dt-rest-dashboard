# Direct Take JS Client

Small dependency-free JavaScript wrapper for the Medialooks Direct Take REST API.

```js
import { DirectTakeClient } from '@local/directtake-js-client';

const directTake = new DirectTakeClient({
  baseUrl: 'http://localhost:9000/api/',
  token: 'perm:your-token'
});

const channels = await directTake.getChannels();
await directTake.startChannelRecording(0);
```

All methods accept an optional final `options` object with `signal` and `headers`.
