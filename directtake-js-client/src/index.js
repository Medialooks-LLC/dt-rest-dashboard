export class DirectTakeApiError extends Error {
  constructor(response, body) {
    super(`Direct Take API request failed with HTTP ${response.status} ${response.statusText}. ${body}`);
    this.name = 'DirectTakeApiError';
    this.status = response.status;
    this.statusText = response.statusText;
    this.body = body;
  }
}

export class DirectTakeClient {
  constructor({ baseUrl = 'http://localhost:9000/api/', token = '', fetchImpl = getDefaultFetch() } = {}) {
    if (!fetchImpl) {
      throw new Error('A fetch implementation is required.');
    }

    this.baseUrl = normalizeBaseUrl(baseUrl);
    this.token = token;
    this.fetch = bindFetch(fetchImpl);
  }

  setConnection({ baseUrl, token } = {}) {
    if (baseUrl) {
      this.baseUrl = normalizeBaseUrl(baseUrl);
    }

    if (token !== undefined) {
      this.token = token;
    }
  }

  getApplicationState(options) {
    return this.get('app/state', options);
  }

  getConversionLists(options) {
    return this.get('app/conversion-lists', options);
  }

  getConversionConfig(options) {
    return this.get('app/conversion-config', options);
  }

  setConversionConfig(config, options) {
    return this.put('app/conversion-config', config, options);
  }

  getSettings(options) {
    return this.get('app/settings', options);
  }

  updateSettings(settings, options) {
    return this.put('app/settings', settings, options);
  }

  startNewProject(options) {
    return this.put('app/new', {}, options);
  }

  saveProject(path, options) {
    return this.put('app/save', { Path: path }, options);
  }

  loadProject(path, options) {
    return this.put('app/load', { Path: path }, options);
  }

  getResources(options) {
    return this.get('app/resources', options);
  }

  getSyncState(options) {
    return this.get('app/sync', options);
  }

  getSchedule(options) {
    return this.get('app/schedule', options);
  }

  setSchedule(schedule, options) {
    return this.put('app/schedule', schedule, options);
  }

  getDialog(options) {
    return this.get('app/dialog', options);
  }

  // action: 'ok', 'yes', 'no' or 'cancel' (true means 'ok', false means 'cancel')
  actOnDialog(action, options) {
    const value = action === true ? 'ok' : action === false ? 'cancel' : String(action ?? '').trim().toLowerCase();
    const normalized = ['ok', 'yes', 'no', 'cancel'].includes(value) ? value : 'cancel';
    return this.put(`app/dialog/${normalized}`, {}, options);
  }

  getAudioDevices(options) {
    return this.get('devices/audio', options);
  }

  getVideoDevices(options) {
    return this.get('devices/video', options);
  }

  getSources(options) {
    return this.get('sources', options);
  }

  getSource(index, options) {
    return this.get(`sources/${index}`, options);
  }

  addSource(source, options) {
    return this.post('sources', source, options);
  }

  updateSource(index, source, options) {
    return this.put(`sources/${index}`, source, options);
  }

  deleteSource(index, options) {
    return this.delete(`sources/${index}`, options);
  }

  getDestinations(options) {
    return this.get('destinations', options);
  }

  getDestination(index, options) {
    return this.get(`destinations/${index}`, options);
  }

  addDestination(destination, options) {
    return this.post('destinations', destination, options);
  }

  updateDestination(index, destination, options) {
    return this.put(`destinations/${index}`, destination, options);
  }

  deleteDestination(index, options) {
    return this.delete(`destinations/${index}`, options);
  }

  getPresets(options) {
    return this.get('presets/', options);
  }

  getPreset(index, options) {
    return this.get(`presets/${index}`, options);
  }

  addPreset(preset, options) {
    return this.post('presets', preset, options);
  }

  updatePreset(index, preset, options) {
    return this.put(`presets/${index}`, preset, options);
  }

  deletePreset(index, options) {
    return this.delete(`presets/${index}`, options);
  }

  getPresetFormats(index, options) {
    return this.get(`presets/${index}/formats`, options);
  }

  getPresetVideoCodecs(index, options) {
    return this.get(`presets/${index}/videoCodecs`, options);
  }

  getPresetAudioCodecs(index, options) {
    return this.get(`presets/${index}/audioCodecs`, options);
  }

  getPresetTimecodes(index, options) {
    return this.get(`presets/${index}/timecodes`, options);
  }

  getChannels(options) {
    return this.get('channels', options);
  }

  getChannel(index, options) {
    return this.get(`channels/${index}`, options);
  }

  setChannelCount(gridSize, options) {
    return this.put(`channels/count/${gridSize}`, {}, options);
  }

  getChannelPreview(index, options) {
    return this.get(`channels/${index}/preview`, options);
  }

  setChannelSource(index, sourceName, options) {
    return this.put(`channels/${index}/set-source/${encodePathPart(sourceName)}`, {}, options);
  }

  unsetChannelSource(index, options) {
    return this.put(`channels/${index}/unset-source`, {}, options);
  }

  addChannelDestination(index, destinationName, options) {
    return this.put(`channels/${index}/add-dest/${encodePathPart(destinationName)}`, {}, options);
  }

  deleteChannelDestination(index, destinationName, options) {
    return this.put(`channels/${index}/delete-dest/${encodePathPart(destinationName)}`, {}, options);
  }

  enableChannelSync(index, options) {
    return this.put(`channels/${index}/sync-on`, {}, options);
  }

  disableChannelSync(index, options) {
    return this.put(`channels/${index}/sync-off`, {}, options);
  }

  startChannelRecording(index, options) {
    return this.put(`channels/${index}/rec-start`, {}, options);
  }

  pauseChannelRecording(index, options) {
    return this.put(`channels/${index}/rec-pause`, {}, options);
  }

  stopChannelRecording(index, options) {
    return this.put(`channels/${index}/rec-stop`, {}, options);
  }

  splitChannelRecording(index, options) {
    return this.put(`channels/${index}/rec-split`, {}, options);
  }

  startSyncRecording(options) {
    return this.put('channels/sync-rec-start', {}, options);
  }

  pauseSyncRecording(options) {
    return this.put('channels/sync-rec-pause', {}, options);
  }

  stopSyncRecording(options) {
    return this.put('channels/sync-rec-stop', {}, options);
  }

  splitSyncRecording(options) {
    return this.put('channels/sync-rec-split', {}, options);
  }

  get(path, options) {
    return this.request(path, { ...options, method: 'GET' });
  }

  post(path, body, options) {
    return this.request(path, { ...options, method: 'POST', body });
  }

  put(path, body = {}, options) {
    return this.request(path, { ...options, method: 'PUT', body });
  }

  delete(path, options) {
    return this.request(path, { ...options, method: 'DELETE' });
  }

  async request(path, { method = 'GET', body, signal, headers = {} } = {}) {
    const requestHeaders = {
      Accept: 'application/json',
      ...headers
    };

    if (this.token) {
      const token = this.token.trim().replace(/^Bearer\s+/i, '');
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    const init = {
      method,
      headers: requestHeaders,
      signal
    };

    if (body !== undefined && method !== 'GET') {
      requestHeaders['Content-Type'] = 'application/json';
      init.body = JSON.stringify(body);
    }

    const response = await this.fetch(new URL(path, getAbsoluteBaseUrl(this.baseUrl)), init);
    const text = await response.text();

    if (!response.ok) {
      throw new DirectTakeApiError(response, text);
    }

    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return text.replace(/^"|"$/g, '');
    }
  }
}

function normalizeBaseUrl(baseUrl) {
  const url = String(baseUrl || '').trim();
  return url.endsWith('/') ? url : `${url}/`;
}

function getAbsoluteBaseUrl(baseUrl) {
  if (typeof globalThis !== 'undefined' && globalThis.location?.href) {
    return new URL(baseUrl, globalThis.location.href);
  }

  return baseUrl;
}

function getDefaultFetch() {
  return typeof globalThis !== 'undefined' ? globalThis.fetch : undefined;
}

function bindFetch(fetchImpl) {
  if (typeof globalThis !== 'undefined' && fetchImpl === globalThis.fetch) {
    return fetchImpl.bind(globalThis);
  }

  return fetchImpl;
}

function encodePathPart(value) {
  return encodeURIComponent(value);
}
