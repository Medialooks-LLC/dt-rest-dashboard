import { DirectTakeClient } from '@local/directtake-js-client';
import { createIcons, Clock, ExternalLink, Link, Pause, Play, Plus, Radio, RefreshCw, RotateCcw, Save, Scissors, Settings, Square, Unlink, Wifi, X } from 'lucide';
import './styles.css';

const defaultBaseUrl = getInitialBaseUrl();
const defaultPreviewUpdateSeconds = getInitialPreviewUpdateSeconds();
const defaultResourceUpdateSeconds = getInitialResourceUpdateSeconds();
const defaultChannelStatsUpdateSeconds = getInitialChannelStatsUpdateSeconds();

const state = {
  client: new DirectTakeClient({ baseUrl: defaultBaseUrl }),
  baseUrl: defaultBaseUrl,
  token: localStorage.getItem('dt.token') || '',
  previewUpdateSeconds: defaultPreviewUpdateSeconds,
  resourceUpdateSeconds: defaultResourceUpdateSeconds,
  channelStatsUpdateSeconds: defaultChannelStatsUpdateSeconds,
  channels: [],
  sources: [],
  destinations: [],
  presets: [],
  videoDevices: [],
  audioDevices: [],
  resources: null,
  sync: null,
  settings: null,
  schedule: null,
  channelPreviews: new Map(),
  channelPresetNames: new Map(),
  selectedChannel: null,
  selectedSource: null,
  selectedDestination: null,
  log: [],
  previewRefreshId: 0,
  previewTimerId: null,
  resourceTimerId: null,
  channelStatsTimerId: null
};

document.querySelector('#app').innerHTML = `
  <main class="shell">
    <section class="connection">
      <label>
        <span>REST API URL</span>
        <input id="baseUrl" value="${escapeHtml(state.baseUrl)}" placeholder="http://localhost:9000/api/" />
      </label>
      <label>
        <span>Authorization token</span>
        <input id="token" value="${escapeHtml(state.token)}" type="password" placeholder="perm:..." />
      </label>
      <button id="connect"><i data-lucide="wifi"></i><span>Connect</span></button>
      <button id="refresh"><i data-lucide="refresh-cw"></i><span>Refresh</span></button>
      <button id="settings" class="icon-button" title="Settings"><i data-lucide="settings"></i></button>
    </section>

    <section class="workspace">
      <aside class="inventory">
        <section class="panel">
          <div class="panel-header">
            <div class="panel-title">Sources</div>
            <button id="newSource" class="icon-button" title="Create source"><i data-lucide="plus"></i></button>
          </div>
          <div id="sources" class="list"></div>
        </section>
        <section class="panel">
          <div class="panel-header">
            <div class="panel-title">Destinations</div>
            <button id="newDestination" class="icon-button" title="Create destination"><i data-lucide="plus"></i></button>
          </div>
          <div id="destinations" class="list"></div>
        </section>
        <section class="panel">
          <div class="panel-header">
            <div class="panel-title">Presets</div>
            <button id="newPreset" class="icon-button" title="Create preset"><i data-lucide="plus"></i></button>
          </div>
          <div id="presets" class="list"></div>
        </section>
      </aside>

      <section class="main-area">
        <section class="panel channels-panel">
          <div class="panel-header">
            <div class="panel-title">Channels</div>
            <div class="grid-buttons">
              <button data-grid="1">1</button>
              <button data-grid="4">4</button>
              <button data-grid="9">9</button>
              <button data-grid="16">16</button>
            </div>
          </div>
          <div id="channels" class="channels"></div>
        </section>

        <section class="actions">
          <button id="setSource"><i data-lucide="link"></i><span>Set Source</span></button>
          <button id="unsetSource"><i data-lucide="unlink"></i><span>Unset Source</span></button>
          <button id="addDest"><i data-lucide="link"></i><span>Assign Dest</span></button>
          <button id="removeDest"><i data-lucide="unlink"></i><span>Remove Dest</span></button>
          <button id="syncOn"><i data-lucide="radio"></i><span>Sync On</span></button>
          <button id="syncOff"><i data-lucide="radio"></i><span>Sync Off</span></button>
          <button id="recStart" class="danger"><i data-lucide="play"></i><span>Rec</span></button>
          <button id="recPause"><i data-lucide="pause"></i><span>Pause</span></button>
          <button id="recStop"><i data-lucide="square"></i><span>Stop</span></button>
          <button id="recSplit" title="Continue the recording of the selected channel in new files"><i data-lucide="scissors"></i><span>Split</span></button>
        </section>

        <section class="system-grid">
          <section class="panel">
            <div class="panel-title">Resources</div>
            <div id="resources" class="resources-view"></div>
          </section>
          <section class="panel">
            <div class="panel-header">
              <div class="panel-title">Synchronous Recording</div>
              <button id="schedule" class="icon-button" title="Schedule"><i data-lucide="clock"></i></button>
            </div>
            <div id="syncState" class="sync-state"></div>
            <div id="syncSchedule" class="sync-schedule"></div>
            <label class="sync-mode">
              <span>Mode</span>
              <select id="syncMode" title="How the channels marked In Sync are kept together. It can't be changed during a synchronous recording.">
                <option value="0">Frame lock-step (any source)</option>
                <option value="1">Match by camera timecode (SDI)</option>
                <option value="2">Independent channels, common start and stop</option>
              </select>
            </label>
            <div class="sync-actions">
              <button id="syncStart"><i data-lucide="play"></i><span>Start</span></button>
              <button id="syncPause"><i data-lucide="pause"></i><span>Pause</span></button>
              <button id="syncStop"><i data-lucide="square"></i><span>Stop</span></button>
              <button id="syncSplit" title="Continue all synchronized channels in new files, on the same frame"><i data-lucide="scissors"></i><span>Split</span></button>
            </div>
          </section>
        </section>
      </section>
    </section>

    <section class="log">
      <div class="panel-header">
        <div class="panel-title">Log</div>
        <div class="log-tools">
          <button id="saveLog" class="icon-button" title="Save log"><i data-lucide="save"></i></button>
          <button id="openLog" class="icon-button" title="Open log in new tab"><i data-lucide="external-link"></i></button>
        </div>
      </div>
      <pre id="log"></pre>
    </section>
    <div id="modalRoot"></div>
  </main>
`;

createIcons({ icons: { Clock, ExternalLink, Link, Pause, Play, Plus, Radio, RefreshCw, RotateCcw, Save, Scissors, Settings, Square, Unlink, Wifi, X } });

const elements = {
  baseUrl: document.querySelector('#baseUrl'),
  token: document.querySelector('#token'),
  refresh: document.querySelector('#refresh'),
  sources: document.querySelector('#sources'),
  destinations: document.querySelector('#destinations'),
  presets: document.querySelector('#presets'),
  channels: document.querySelector('#channels'),
  resources: document.querySelector('#resources'),
  syncState: document.querySelector('#syncState'),
  syncMode: document.querySelector('#syncMode'),
  syncSchedule: document.querySelector('#syncSchedule'),
  schedule: document.querySelector('#schedule'),
  log: document.querySelector('#log'),
  modalRoot: document.querySelector('#modalRoot')
};

document.querySelector('#connect').addEventListener('click', connect);
document.querySelector('#newSource').addEventListener('click', () => openSourceDialog());
document.querySelector('#newDestination').addEventListener('click', () => openDestinationDialog());
document.querySelector('#newPreset').addEventListener('click', () => openPresetDialog());
document.querySelector('#settings').addEventListener('click', openSettingsDialog);
document.querySelector('#saveLog').addEventListener('click', saveLog);
document.querySelector('#openLog').addEventListener('click', openLogTab);
elements.refresh.addEventListener('click', refresh);
document.querySelector('#setSource').addEventListener('click', () => runSelectedAction('Set source', () => state.client.setChannelSource(requireChannel(), requireSource().Name)));
document.querySelector('#unsetSource').addEventListener('click', () => runSelectedAction('Unset source', () => state.client.unsetChannelSource(requireChannel())));
document.querySelector('#addDest').addEventListener('click', () => runSelectedAction('Add destination', () => state.client.addChannelDestination(requireChannel(), requireDestination().Name)));
document.querySelector('#removeDest').addEventListener('click', () => runSelectedAction('Remove destination', () => state.client.deleteChannelDestination(requireChannel(), requireDestination().Name)));
document.querySelector('#syncOn').addEventListener('click', () => runSelectedAction('Enable sync', () => state.client.enableChannelSync(requireChannel())));
document.querySelector('#syncOff').addEventListener('click', () => runSelectedAction('Disable sync', () => state.client.disableChannelSync(requireChannel())));
document.querySelector('#recStart').addEventListener('click', () => runSelectedAction('Start recording', () => state.client.startChannelRecording(requireChannel())));
document.querySelector('#recPause').addEventListener('click', () => runSelectedAction('Pause recording', () => state.client.pauseChannelRecording(requireChannel())));
document.querySelector('#recStop').addEventListener('click', () => runSelectedAction('Stop recording', () => state.client.stopChannelRecording(requireChannel())));
document.querySelector('#recSplit').addEventListener('click', () => runSelectedAction('Split recording', () => state.client.splitChannelRecording(requireChannel())));
document.querySelector('#syncStart').addEventListener('click', () => runAction('Start synchronous recording', () => state.client.startSyncRecording()));
document.querySelector('#syncPause').addEventListener('click', () => runAction('Pause synchronous recording', () => state.client.pauseSyncRecording()));
document.querySelector('#syncStop').addEventListener('click', () => runAction('Stop synchronous recording', () => state.client.stopSyncRecording()));
document.querySelector('#syncSplit').addEventListener('click', () => runAction('Split synchronous recording', () => state.client.splitSyncRecording()));
elements.syncMode.addEventListener('change', () => {
  const mode = Number(elements.syncMode.value);
  runAction(`Synchronization mode ${elements.syncMode.selectedOptions[0]?.textContent ?? mode}`, () => state.client.updateSettings({ SyncModeIndex: mode }));
});
elements.schedule.addEventListener('click', openScheduleDialog);

document.querySelectorAll('[data-grid]').forEach((button) => {
  button.addEventListener('click', () => runAction(`Set grid ${button.dataset.grid}`, () => state.client.setChannelCount(Number(button.dataset.grid))));
});

document.addEventListener('dragenter', acceptDashboardDrag, true);
document.addEventListener('dragover', acceptDashboardDrag, true);

document.addEventListener('drop', () => {
  clearDragState();
});

document.addEventListener('dragend', () => {
  clearDragState();
});

render();

async function connect() {
  state.baseUrl = normalizeDashboardBaseUrl(elements.baseUrl.value.trim() || '/dt-api/');
  elements.baseUrl.value = state.baseUrl;
  state.token = elements.token.value.trim();
  localStorage.setItem('dt.baseUrl', state.baseUrl);
  localStorage.setItem('dt.token', state.token);
  state.client.setConnection({ baseUrl: state.baseUrl, token: state.token });
  await runAction('Connect', refresh, { skipRefresh: true });
}

async function refresh() {
  const [sources, destinations, presets, channels, resources, sync, videoDevices, audioDevices] = await Promise.all([
    state.client.getSources(),
    state.client.getDestinations(),
    state.client.getPresets(),
    state.client.getChannels(),
    state.client.getResources(),
    state.client.getSyncState(),
    state.client.getVideoDevices(),
    state.client.getAudioDevices()
  ]);

  state.sources = toList(sources);
  state.destinations = toList(destinations);
  state.presets = toList(presets);
  state.channels = toList(channels);
  state.videoDevices = toDeviceList(videoDevices, 'Video');
  state.audioDevices = toDeviceList(audioDevices, 'Audio');
  state.resources = resources;
  state.sync = sync;
  // preferences and schedule are optional: an older Direct Take without them still connects
  [state.settings, state.schedule] = await Promise.all([
    state.client.getSettings().catch(() => null),
    state.client.getSchedule().catch(() => null)
  ]);

  if (!state.channels.some((channel) => channel.Index === state.selectedChannel)) {
    state.selectedChannel = state.channels[0]?.Index ?? null;
  }

  render();
  refreshChannelPresetNames();
  refreshChannelPreviews({ force: true });
  schedulePreviewUpdates();
  scheduleResourceUpdates();
  scheduleChannelStatsUpdates();
}

async function runSelectedAction(label, action) {
  await runAction(label, action);
}

async function runAction(label, action, { skipRefresh = false } = {}) {
  try {
    await action();
    pushLog(`${label}: ok`);
    renderLog();
    if (!skipRefresh) {
      await refresh();
    }
  } catch (error) {
    pushLog(`${label}: ${error.message}`);
    renderLog();
    // Direct Take answers 409 while one of its message boxes is open: show it here so it can be answered
    if (error.status === 409 && /message box/i.test(String(error.body ?? ''))) {
      await openMessageBoxDialog();
    }
  }
}

async function openMessageBoxDialog() {
  let info;
  try {
    info = await state.client.getDialog();
  } catch (error) {
    pushLog(`Message box: ${error.message}`);
    renderLog();
    return;
  }
  if (!info || typeof info !== 'object' || !info.IsDialog) {
    return;
  }
  const buttons = info.DialogButtons === 'Yes_No'
    ? '<button type="button" data-dialog-answer="no"><span>No</span></button><button type="button" data-dialog-answer="yes"><span>Yes</span></button>'
    : '<button type="button" data-dialog-answer="ok"><span>OK</span></button>';
  showDialog(`
    <div class="dialog message-dialog">
      <div class="dialog-header">
        <div class="dialog-title">Direct Take</div>
      </div>
      <div class="message-text">${escapeHtml(info.DialogContent ?? '')}</div>
      <div class="dialog-actions">${buttons}</div>
    </div>
  `);
  elements.modalRoot.querySelectorAll('[data-dialog-answer]').forEach((button) => {
    button.addEventListener('click', async () => {
      closeDialog();
      await runAction(`Message box: ${button.dataset.dialogAnswer}`, () => state.client.actOnDialog(button.dataset.dialogAnswer));
    });
  });
}

function openScheduleDialog() {
  const schedule = state.schedule ?? {};
  const isAll = schedule.ScheduleType === 'All channels';
  showDialog(`
    <form id="scheduleForm" class="dialog">
      <div class="dialog-header">
        <div class="dialog-title">Schedule</div>
        <button type="button" class="icon-button" data-close-dialog title="Close"><i data-lucide="x"></i></button>
      </div>
      <label>
        <span>Start at</span>
        <input name="startTime" type="time" step="1" value="${escapeHtml(schedule.StartTime ?? '')}" />
      </label>
      <label>
        <span>Stop at</span>
        <input name="stopTime" type="time" step="1" value="${escapeHtml(schedule.StopTime ?? '')}" />
      </label>
      <label>
        <span>Channels</span>
        <select name="scheduleType">
          <option value="In Sync only"${isAll ? '' : ' selected'}>In Sync only</option>
          <option value="All channels"${isAll ? ' selected' : ''}>All channels</option>
        </select>
      </label>
      <div class="field-hint">Times of day on the Direct Take computer. An active schedule repeats every day. Leave a time empty to skip it.</div>
      <div class="dialog-actions">
        <button type="button" data-schedule-off><i data-lucide="x"></i><span>Turn off</span></button>
        <button type="submit"><i data-lucide="clock"></i><span>Schedule</span></button>
      </div>
    </form>
  `);
  document.querySelector('#scheduleForm').addEventListener('submit', submitScheduleForm);
  elements.modalRoot.querySelector('[data-schedule-off]').addEventListener('click', async () => {
    closeDialog();
    await runAction('Schedule off', () => state.client.setSchedule({ IsEnabled: false, StartTime: null, StopTime: null }));
  });
}

async function submitScheduleForm(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  // a time input gives HH:mm when the seconds are 00; Direct Take expects HH:mm:ss
  const toTime = (value) => (value ? (String(value).length === 5 ? `${value}:00` : String(value)) : null);
  const schedule = {
    IsEnabled: true,
    StartTime: toTime(form.get('startTime')),
    StopTime: toTime(form.get('stopTime')),
    ScheduleType: String(form.get('scheduleType'))
  };
  closeDialog();
  await runAction('Schedule', () => state.client.setSchedule(schedule));
}

async function openSettingsDialog() {
  const appSettings = await state.client.getSettings().catch(() => null);
  showDialog(`
    <form id="settingsForm" class="dialog">
      <div class="dialog-header">
        <div class="dialog-title">Settings</div>
        <button type="button" class="icon-button" data-close-dialog title="Close"><i data-lucide="x"></i></button>
      </div>
      <label>
        <span>Preview update interval, seconds</span>
        <input name="previewUpdateSeconds" type="number" min="0" max="3600" step="1" value="${escapeHtml(state.previewUpdateSeconds)}" />
      </label>
      <div class="field-hint">Use 0 to disable automatic thumbnail updates.</div>
      <label>
        <span>Resources update interval, seconds</span>
        <input name="resourceUpdateSeconds" type="number" min="0" max="3600" step="1" value="${escapeHtml(state.resourceUpdateSeconds)}" />
      </label>
      <div class="field-hint">Use 0 to disable automatic CPU, RAM, and disk updates.</div>
      <label>
        <span>Channel stats update interval, seconds</span>
        <input name="channelStatsUpdateSeconds" type="number" min="0" max="3600" step="1" value="${escapeHtml(state.channelStatsUpdateSeconds)}" />
      </label>
      <div class="field-hint">Use 0 to disable automatic recording stat updates.</div>
      ${renderGpuDecodingField(appSettings)}
      <div class="dialog-actions">
        <button type="button" data-close-dialog><i data-lucide="x"></i><span>Cancel</span></button>
        <button type="submit"><i data-lucide="save"></i><span>Save Settings</span></button>
      </div>
    </form>
  `);

  document.querySelector('#settingsForm').addEventListener('submit', (event) => submitSettingsForm(event, appSettings));
}

async function submitSettingsForm(event, appSettings) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const previewValue = clampNumber(Number(form.get('previewUpdateSeconds')), 0, 3600);
  const resourceValue = clampNumber(Number(form.get('resourceUpdateSeconds')), 0, 3600);
  const channelStatsValue = clampNumber(Number(form.get('channelStatsUpdateSeconds')), 0, 3600);

  state.previewUpdateSeconds = previewValue;
  state.resourceUpdateSeconds = resourceValue;
  state.channelStatsUpdateSeconds = channelStatsValue;
  localStorage.setItem('dt.previewUpdateSeconds', String(previewValue));
  localStorage.setItem('dt.resourceUpdateSeconds', String(resourceValue));
  localStorage.setItem('dt.channelStatsUpdateSeconds', String(channelStatsValue));
  closeDialog();
  schedulePreviewUpdates();
  scheduleResourceUpdates();
  scheduleChannelStatsUpdates();
  pushLog(`Settings: preview ${formatInterval(previewValue)}, resources ${formatInterval(resourceValue)}, channel stats ${formatInterval(channelStatsValue)}`);
  renderLog();
  await applyGpuDecoding(form, appSettings);
}

// GPU decoding is a Direct Take preference (Preferences > Decode network streams on GPU); older versions do not report it
function renderGpuDecodingField(appSettings) {
  if (!appSettings || typeof appSettings.GpuDecoding !== 'boolean') {
    return '';
  }
  return `
      <div class="checkbox-row">
        <input id="gpuDecoding" name="gpuDecoding" type="checkbox" ${appSettings.GpuDecoding ? 'checked' : ''} />
        <label for="gpuDecoding">Decode network streams on GPU</label>
      </div>
      <div class="field-hint">A Direct Take setting: NVIDIA NVDEC decodes the network stream sources opened after the change.</div>
  `;
}

async function applyGpuDecoding(form, appSettings) {
  if (!appSettings || typeof appSettings.GpuDecoding !== 'boolean') {
    return;
  }
  const gpuDecoding = form.get('gpuDecoding') === 'on';
  if (gpuDecoding !== appSettings.GpuDecoding) {
    await runAction(`GPU decoding ${gpuDecoding ? 'on' : 'off'}`, () => state.client.updateSettings({ GpuDecoding: gpuDecoding }), { skipRefresh: true });
  }
}

async function openSourceEditor(summary) {
  await runAction('Load source', async () => {
    const source = await state.client.getSource(summary.Index);
    openSourceDialog({ index: summary.Index, source: source || summary });
  }, { skipRefresh: true });
}

async function openDestinationEditor(summary) {
  await runAction('Load destination', async () => {
    const destination = await state.client.getDestination(summary.Index);
    openDestinationDialog({ index: summary.Index, destination: destination || summary });
  }, { skipRefresh: true });
}

function openSourceDialog({ index = null, source = {} } = {}) {
  const defaultName = `Source ${state.sources.length + 1}`;
  const selectedVideoIndex = findDeviceIndex(state.videoDevices, source.VideoDevice);
  const selectedAudioIndex = findDeviceIndex(state.audioDevices, source.AudioDevice);
  const videoOptions = state.videoDevices.map((device, index) => `
    <option value="${index}" ${index === selectedVideoIndex ? 'selected' : ''}>${escapeHtml(device.Name)}</option>
  `).join('');
  const audioOptions = state.audioDevices.map((device, index) => `
    <option value="${index}" ${index === selectedAudioIndex ? 'selected' : ''}>${escapeHtml(device.Name)}</option>
  `).join('');
  const isEdit = index !== null;

  showDialog(`
    <form id="sourceForm" class="dialog" data-index="${isEdit ? index : ''}">
      <div class="dialog-header">
        <div class="dialog-title">${isEdit ? 'Edit Source' : 'Create Source'}</div>
        <button type="button" class="icon-button" data-close-dialog title="Close"><i data-lucide="x"></i></button>
      </div>
      <label>
        <span>Source name</span>
        <input name="name" value="${escapeHtml(source.Name || defaultName)}" required />
      </label>
      <label>
        <span>Video device</span>
        <select name="videoDevice" required ${state.videoDevices.length ? '' : 'disabled'}>
          ${videoOptions || '<option>No video devices loaded</option>'}
        </select>
      </label>
      <label>
        <span>Audio device</span>
        <select name="audioDevice" ${state.audioDevices.length ? '' : 'disabled'}>
          ${audioOptions || '<option>No audio devices loaded</option>'}
        </select>
      </label>
      <label>
        <span>Audio gain</span>
        <input name="audioGain" value="${escapeHtml(source.AudioGain ?? 0)}" />
      </label>
      <div class="dialog-actions">
        <button type="button" data-close-dialog><i data-lucide="x"></i><span>Cancel</span></button>
        <button type="submit"><i data-lucide="save"></i><span>${isEdit ? 'Save Source' : 'Create Source'}</span></button>
      </div>
    </form>
  `);

  document.querySelector('#sourceForm').addEventListener('submit', submitSourceForm);
}

function openDestinationDialog({ index = null, destination = {} } = {}) {
  const defaultName = `Destination ${state.destinations.length + 1}`;
  const presetOptions = state.presets.map((preset) => `
    <option value="${escapeHtml(preset.Name)}" ${preset.Name === destination.PresetName ? 'selected' : ''}>${escapeHtml(preset.Name)}</option>
  `).join('');
  const isEdit = index !== null;

  showDialog(`
    <form id="destinationForm" class="dialog" data-index="${isEdit ? index : ''}">
      <div class="dialog-header">
        <div class="dialog-title">${isEdit ? 'Edit Destination' : 'Create Destination'}</div>
        <button type="button" class="icon-button" data-close-dialog title="Close"><i data-lucide="x"></i></button>
      </div>
      <label>
        <span>Destination name</span>
        <input name="name" value="${escapeHtml(destination.Name || defaultName)}" required />
      </label>
      <label>
        <span>Recording folder</span>
        <input name="location" value="${escapeHtml(destination.Location || '')}" placeholder="D:\\Recordings" required />
      </label>
      <label>
        <span>Encoding preset</span>
        <select name="presetName" required ${state.presets.length ? '' : 'disabled'}>
          ${presetOptions || '<option>No presets loaded</option>'}
        </select>
      </label>
      <label>
        <span>Naming template</span>
        <input name="namingTemplate" value="${escapeHtml(destination.NamingTemplate || '{Source}_{Year}-{Month}-{Day}_{Hour}-{Min}-{Sec}')}" required />
      </label>
      <label>
        <span>Auto split every</span>
        <input name="splitInterval" value="${escapeHtml(destination.SplitIntervalString || '00:00:00')}" placeholder="HH:mm:ss" />
      </label>
      <div class="checkbox-row">
        <input id="overwriteDestinationFiles" name="overwrite" type="checkbox" ${destination.OverwriteExistingFiles ? 'checked' : ''} />
        <label for="overwriteDestinationFiles">Overwrite existing files</label>
      </div>
      <div class="dialog-actions">
        <button type="button" data-close-dialog><i data-lucide="x"></i><span>Cancel</span></button>
        <button type="submit"><i data-lucide="save"></i><span>${isEdit ? 'Save Destination' : 'Create Destination'}</span></button>
      </div>
    </form>
  `);

  document.querySelector('#destinationForm').addEventListener('submit', submitDestinationForm);
}

async function openPresetEditor(summary) {
  await runAction('Load preset', async () => {
    const preset = await state.client.getPreset(summary.Index);
    await openPresetDialog({ index: summary.Index, preset: preset || summary });
  }, { skipRefresh: true });
}

async function openPresetDialog({ index = null, preset = {} } = {}) {
  const defaultName = `Preset ${state.presets.length + 1}`;
  const isEdit = index !== null;
  const listIndex = index ?? state.presets[0]?.Index ?? 0;
  const [formats, videoCodecs, audioCodecs, timecodes] = await Promise.all([
    loadPresetList('formats', () => state.client.getPresetFormats(listIndex)),
    loadPresetList('video codecs', () => state.client.getPresetVideoCodecs(listIndex)),
    loadPresetList('audio codecs', () => state.client.getPresetAudioCodecs(listIndex)),
    loadPresetList('timecodes', () => state.client.getPresetTimecodes(listIndex))
  ]);
  const timecodeOptions = toList(timecodes);

  showDialog(`
    <form id="presetForm" class="dialog preset-dialog" data-index="${isEdit ? index : ''}">
      <div class="dialog-header">
        <div class="dialog-title">${isEdit ? 'Edit Preset' : 'Create Preset'}</div>
        <button type="button" class="icon-button" data-close-dialog title="Close"><i data-lucide="x"></i></button>
      </div>
      <label>
        <span>Preset name</span>
        <input name="name" value="${escapeHtml(preset.Name || defaultName)}" required />
      </label>
      <label>
        <span>Type</span>
        <input name="type" value="${escapeHtml(preset.Type || 'Local File Recording')}" required />
      </label>
      <label>
        <span>Format</span>
        ${renderSelectOrInput('format', formats, preset.Format, 'MP4 (MPEG-4 Part 14)')}
      </label>
      <label>
        <span>Video codec</span>
        ${renderSelectOrInput('videoCodec', videoCodecs, preset.VideoCodec)}
      </label>
      <label>
        <span>Audio codec</span>
        ${renderSelectOrInput('audioCodec', audioCodecs, preset.AudioCodec)}
      </label>
      <label>
        <span>Start timecode</span>
        <select name="startTimecode">
          ${timecodeOptions.map((timecode) => `
            <option value="${escapeHtml(timecode.Key)}" ${timecode.Key === preset.StartTimecode?.Key ? 'selected' : ''}>${escapeHtml(timecode.Value)}</option>
          `).join('') || '<option value="">No timecode list loaded</option>'}
        </select>
      </label>
      <label>
        <span>Video bitrate</span>
        <input name="videoBitrate" value="${escapeHtml(preset.VideoBitrate || '')}" placeholder="15M" />
      </label>
      <label>
        <span>Key frame interval</span>
        <input name="keyFrameInterval" value="${escapeHtml(preset.KeyFrameInterval || '')}" placeholder="60" />
      </label>
      <label>
        <span>Full encoder configuration</span>
        <textarea name="config" rows="5" placeholder="format='mp4' video::codec='n265' audio::codec='libmp3lame'">${escapeHtml(preset.Config || '')}</textarea>
      </label>
      <div class="dialog-actions">
        <button type="button" data-close-dialog><i data-lucide="x"></i><span>Cancel</span></button>
        <button type="submit"><i data-lucide="save"></i><span>${isEdit ? 'Save Preset' : 'Create Preset'}</span></button>
      </div>
    </form>
  `);

  document.querySelector('#presetForm').addEventListener('submit', submitPresetForm);
}

async function loadPresetList(label, loader) {
  try {
    return toList(await loader());
  } catch (error) {
    pushLog(`Load preset ${label}: ${error.message}`);
    renderLog();
    return [];
  }
}

function renderSelectOrInput(name, options, value = '', placeholder = '') {
  const list = toList(options);

  if (!list.length) {
    return `<input name="${name}" value="${escapeHtml(value || '')}" placeholder="${escapeHtml(placeholder)}" />`;
  }

  const hasValue = value && list.includes(value);
  const customOption = value && !hasValue ? `<option value="${escapeHtml(value)}" selected>${escapeHtml(value)}</option>` : '';

  return `
    <select name="${name}">
      ${customOption}
      ${list.map((option) => `
        <option value="${escapeHtml(option)}" ${option === value ? 'selected' : ''}>${escapeHtml(option)}</option>
      `).join('')}
    </select>
  `;
}

function buildStartTimecode(key) {
  if (!key) {
    return undefined;
  }

  return { Key: key };
}

async function openChannelDialog(channelIndex) {
  const channel = state.channels.find((item) => item.Index === channelIndex);

  if (!channel) {
    return;
  }

  const destinationDetails = await loadChannelDestinationDetails(channel);
  const currentSourceName = channel.SourceName && channel.SourceName !== 'Not Specified' ? channel.SourceName : '';
  const sourceOptions = [
    `<option value="" ${currentSourceName ? '' : 'selected'}>Not Specified</option>`,
    ...state.sources.map((source) => `
      <option value="${escapeHtml(source.Name)}" ${source.Name === currentSourceName ? 'selected' : ''}>${escapeHtml(source.Name)}</option>
    `)
  ].join('');
  const destinationOptions = state.destinations.length
    ? state.destinations.map((destination) => {
      const id = `channelDestination-${destination.Index}`;
      const checked = (channel.Destinations || []).includes(destination.Name);
      return `
        <div class="checkbox-row compact">
          <input id="${id}" name="destinations" value="${escapeHtml(destination.Name)}" type="checkbox" ${checked ? 'checked' : ''} />
          <label for="${id}">${escapeHtml(destination.Name)}</label>
        </div>
      `;
    }).join('')
    : '<div class="field-hint">No destinations loaded.</div>';
  const currentPresetName = state.channelPresetNames.get(channel.Index)?.[0] || '';
  const presetOptions = [
    '<option value="">Keep current presets</option>',
    ...state.presets.map((preset) => `
      <option value="${escapeHtml(preset.Name)}" ${preset.Name === currentPresetName ? 'selected' : ''}>${escapeHtml(preset.Name)}</option>
    `)
  ].join('');

  showDialog(`
    <form id="channelForm" class="dialog channel-dialog" data-index="${channel.Index}">
      <div class="dialog-header">
        <div class="dialog-title">Edit Channel ${channel.Index}</div>
        <button type="button" class="icon-button" data-close-dialog title="Close"><i data-lucide="x"></i></button>
      </div>
      <div class="channel-dialog-top">
        <div class="channel-dialog-preview" data-channel-preview>
          ${renderChannelDialogPreview(channel)}
        </div>
        <div class="channel-dialog-side">
          <div class="channel-dialog-status" data-channel-status>
            ${renderChannelDialogStatus(channel)}
          </div>
          <div class="channel-dialog-actions">
            <button type="button" class="danger" data-channel-action="rec-start"><i data-lucide="play"></i><span>Rec</span></button>
            <button type="button" data-channel-action="rec-pause"><i data-lucide="pause"></i><span>Pause</span></button>
            <button type="button" data-channel-action="rec-stop"><i data-lucide="square"></i><span>Stop</span></button>
            <button type="button" data-channel-action="rec-split"><i data-lucide="scissors"></i><span>Split</span></button>
          </div>
        </div>
      </div>
      <div class="channel-dialog-stats" data-channel-stats>
        ${renderChannelDialogStats(channel)}
      </div>
      <div class="channel-dialog-grid">
        <label>
          <span>Source</span>
          <select name="sourceName">
            ${sourceOptions}
          </select>
        </label>
        <label>
          <span>Preset for selected destinations</span>
          <select name="presetName">
            ${presetOptions}
          </select>
        </label>
      </div>
      <div>
        <span class="field-label">Destinations</span>
        <div class="checkbox-stack">
          ${destinationOptions}
        </div>
      </div>
      <div>
        <span class="field-label">Destination Details</span>
        <div class="destination-details">
          ${renderChannelDestinationDetails(destinationDetails)}
        </div>
      </div>
      <div class="dialog-actions">
        <button type="button" data-close-dialog><i data-lucide="x"></i><span>Cancel</span></button>
        <button type="submit"><i data-lucide="save"></i><span>Save Channel</span></button>
      </div>
    </form>
  `);

  document.querySelector('#channelForm').addEventListener('submit', submitChannelForm);
  document.querySelectorAll('[data-channel-action]').forEach((button) => {
    button.addEventListener('click', () => runChannelDialogAction(channel.Index, button.dataset.channelAction));
  });
}

async function loadChannelDestinationDetails(channel) {
  return Promise.all((channel.Destinations || []).map(async (destinationName) => {
    const destination = state.destinations.find((item) => item.Name === destinationName);

    if (!destination) {
      return { name: destinationName, error: 'Destination not loaded.' };
    }

    try {
      const fullDestination = await state.client.getDestination(destination.Index);
      const preset = fullDestination?.PresetName
        ? state.presets.find((item) => item.Name === fullDestination.PresetName)
        : null;
      const fullPreset = preset ? await state.client.getPreset(preset.Index) : null;

      return {
        name: destinationName,
        location: fullDestination?.Location,
        presetName: fullDestination?.PresetName,
        config: fullPreset?.Config || fullDestination?.Config || ''
      };
    } catch (error) {
      return { name: destinationName, error: error.message };
    }
  }));
}

function renderChannelDestinationDetails(details) {
  if (!details.length) {
    return '<div class="field-hint">No destinations assigned.</div>';
  }

  return details.map((detail) => `
    <section class="destination-detail-card">
      <div class="detail-title">${escapeHtml(detail.name)}</div>
      ${detail.error ? `<div class="field-hint">${escapeHtml(detail.error)}</div>` : `
        <div class="detail-row"><span>Path</span><b>${escapeHtml(detail.location || 'Not specified')}</b></div>
        <div class="detail-row"><span>Preset</span><b>${escapeHtml(detail.presetName || 'Not specified')}</b></div>
        <pre class="config-block">${escapeHtml(detail.config || 'No encoder configuration reported.')}</pre>
      `}
    </section>
  `).join('');
}

function renderChannelDialogPreview(channel) {
  const preview = state.channelPreviews.get(channel.Index);

  if (preview?.status === 'ready') {
    return `<img src="${escapeHtml(preview.src)}" alt="" />`;
  }

  return '<div>No preview</div>';
}

function renderChannelDialogStatus(channel) {
  return `
    <span class="status-pill ${channel.IsRecording ? 'active' : ''}">${channel.IsRecording ? 'Recording' : 'Idle'}</span>
    ${channel.IsRecordingPause ? '<span class="status-pill warn">Paused</span>' : ''}
    ${channel.IsInSync ? '<span class="status-pill sync">Sync</span>' : ''}
    ${channel.IsSomethingWrong ? '<span class="status-pill danger">Warning</span>' : ''}
  `;
}

function renderChannelDialogStats(channel) {
  return [
    renderChannelStat('Duration', channel.RecordingDuration || '00:00:00'),
    renderChannelStat('Encoder FPS', `${channel.RecordingFPS || '0.00'} fps`),
    renderChannelStat('Buffered', channel.RecordingBuffered || '0'),
    renderChannelStat('Drops', channel.RecordingDrops || '0'),
    renderChannelStat('Breaks', channel.RecordingBreaks || '0'),
    renderChannelStat('Audio Preview', channel.IsAudioPreview ? 'On' : 'Off')
  ].join('');
}

function renderChannelStat(label, value) {
  return `
    <div class="channel-stat-card">
      <span>${escapeHtml(label)}</span>
      <b>${escapeHtml(value)}</b>
    </div>
  `;
}

function updateOpenChannelDialog() {
  const form = document.querySelector('#channelForm');

  if (!form) {
    return;
  }

  const channel = state.channels.find((item) => item.Index === Number(form.dataset.index));

  if (!channel) {
    return;
  }

  const status = form.querySelector('[data-channel-status]');
  const stats = form.querySelector('[data-channel-stats]');
  const preview = form.querySelector('[data-channel-preview]');

  if (status) {
    status.innerHTML = renderChannelDialogStatus(channel);
  }

  if (stats) {
    stats.innerHTML = renderChannelDialogStats(channel);
  }

  if (preview) {
    preview.innerHTML = renderChannelDialogPreview(channel);
  }
}

async function submitSourceForm(event) {
  event.preventDefault();
  const index = event.currentTarget.dataset.index;
  const form = new FormData(event.currentTarget);
  const videoDevice = state.videoDevices[Number(form.get('videoDevice'))];
  const audioDevice = state.audioDevices[Number(form.get('audioDevice'))];

  if (!videoDevice) {
    pushLog('Create source: select a video device first.');
    renderLog();
    return;
  }

  const payload = removeEmptyFields({
    Name: form.get('name'),
    VideoDevice: videoDevice,
    AudioDevice: audioDevice,
    AudioGain: form.get('audioGain')
  });
  const isEdit = index !== '';

  await runAction(isEdit ? 'Update source' : 'Create source', () => (
    isEdit ? state.client.updateSource(Number(index), payload) : state.client.addSource(payload)
  ));
  closeDialog();
}

async function submitDestinationForm(event) {
  event.preventDefault();
  const index = event.currentTarget.dataset.index;
  const form = new FormData(event.currentTarget);

  const payload = removeEmptyFields({
    Name: form.get('name'),
    Type: 'Local File Recording',
    Location: form.get('location'),
    NamingTemplate: form.get('namingTemplate'),
    OverwriteExistingFiles: form.get('overwrite') === 'on',
    SplitIntervalString: form.get('splitInterval'),
    PresetName: form.get('presetName'),
    PostCapturingAction: 'Do Nothing'
  });
  const isEdit = index !== '';

  await runAction(isEdit ? 'Update destination' : 'Create destination', () => (
    isEdit ? state.client.updateDestination(Number(index), payload) : state.client.addDestination(payload)
  ));
  closeDialog();
}

async function submitPresetForm(event) {
  event.preventDefault();
  const index = event.currentTarget.dataset.index;
  const form = new FormData(event.currentTarget);
  const payload = removeEmptyFields({
    Name: form.get('name'),
    Type: form.get('type'),
    Format: form.get('format'),
    VideoCodec: form.get('videoCodec'),
    AudioCodec: form.get('audioCodec'),
    VideoBitrate: form.get('videoBitrate'),
    KeyFrameInterval: form.get('keyFrameInterval'),
    StartTimecode: buildStartTimecode(form.get('startTimecode')),
    ManualTimecode: form.get('startTimecode') === '00:00:00:00' ? '00:00:00:00' : undefined,
    Config: form.get('config')
  });
  const isEdit = index !== '';

  await runAction(isEdit ? 'Update preset' : 'Create preset', () => (
    isEdit ? state.client.updatePreset(Number(index), payload) : state.client.addPreset(payload)
  ));
  closeDialog();
}

async function submitChannelForm(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const channelIndex = Number(event.currentTarget.dataset.index);
  const channel = state.channels.find((item) => item.Index === channelIndex);
  const nextSourceName = String(form.get('sourceName') || '');
  const nextDestinationNames = form.getAll('destinations').map(String);
  const presetName = String(form.get('presetName') || '');

  if (!channel) {
    closeDialog();
    return;
  }

  await runAction(`Update channel ${channelIndex}`, async () => {
    const currentSourceName = channel.SourceName && channel.SourceName !== 'Not Specified' ? channel.SourceName : '';

    if (nextSourceName !== currentSourceName) {
      if (nextSourceName) {
        await state.client.setChannelSource(channelIndex, nextSourceName);
      } else {
        await state.client.unsetChannelSource(channelIndex);
      }
    }

    const currentDestinationNames = new Set(channel.Destinations || []);
    const nextDestinationSet = new Set(nextDestinationNames);

    for (const destinationName of nextDestinationSet) {
      if (!currentDestinationNames.has(destinationName)) {
        await state.client.addChannelDestination(channelIndex, destinationName);
      }
    }

    for (const destinationName of currentDestinationNames) {
      if (!nextDestinationSet.has(destinationName)) {
        await state.client.deleteChannelDestination(channelIndex, destinationName);
      }
    }

    if (presetName) {
      await updateDestinationsPreset(nextDestinationNames, presetName);
    }
  });
  closeDialog();
}

async function runChannelDialogAction(channelIndex, action) {
  const actions = {
    'rec-start': () => state.client.startChannelRecording(channelIndex),
    'rec-pause': () => state.client.pauseChannelRecording(channelIndex),
    'rec-stop': () => state.client.stopChannelRecording(channelIndex),
    'rec-split': () => state.client.splitChannelRecording(channelIndex)
  };

  await runAction(`Channel ${channelIndex} ${action}`, actions[action]);
  updateOpenChannelDialog();
}

function showDialog(content) {
  elements.modalRoot.innerHTML = `<div class="modal-backdrop">${content}</div>`;
  elements.modalRoot.querySelectorAll('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', closeDialog);
  });
  createIcons({ icons: { Clock, ExternalLink, Link, Pause, Play, Plus, Radio, RefreshCw, RotateCcw, Save, Scissors, Settings, Square, Unlink, Wifi, X } });
}

function closeDialog() {
  elements.modalRoot.innerHTML = '';
}

function saveLog() {
  const content = getLogText();
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');

  link.href = url;
  link.download = `directtake-dashboard-log-${stamp}.txt`;
  link.click();
  URL.revokeObjectURL(url);
  pushLog('Log: saved');
  renderLog();
}

function openLogTab() {
  const logWindow = window.open('', '_blank');

  if (!logWindow) {
    pushLog('Log: popup blocked.');
    renderLog();
    return;
  }

  logWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>Direct Take Dashboard Log</title>
        <style>
          :root { color-scheme: dark; }
          body {
            margin: 0;
            padding: 18px;
            background: #0c1116;
            color: #d9e4ee;
            font: 13px/1.5 Consolas, "Cascadia Mono", monospace;
          }
          header {
            position: sticky;
            top: 0;
            padding-bottom: 12px;
            background: #0c1116;
            font: 700 14px/1.4 "Segoe UI", system-ui, sans-serif;
          }
          pre {
            margin: 0;
            white-space: pre-wrap;
          }
        </style>
      </head>
      <body>
        <header>Direct Take Dashboard Log</header>
        <pre>${escapeHtml(getLogText())}</pre>
      </body>
    </html>
  `);
  logWindow.document.close();
  pushLog('Log: opened in new tab');
  renderLog();
}

function render() {
  renderList(elements.sources, state.sources, state.selectedSource, 'source', (item) => {
    state.selectedSource = item.Index;
    render();
  }, openSourceEditor, 'source');
  renderList(elements.destinations, state.destinations, state.selectedDestination, 'destination', (item) => {
    state.selectedDestination = item.Index;
    render();
  }, openDestinationEditor, 'destination');
  renderList(elements.presets, state.presets, null, 'preset', () => {}, openPresetEditor, 'preset');
  renderChannels();
  elements.resources.innerHTML = renderResources(state.resources);
  elements.syncState.textContent = state.sync
    ? `Recording: ${Boolean(state.sync.IsSyncRecording)} | Paused: ${Boolean(state.sync.IsSyncRecordingPause)}`
    : 'No sync state loaded';
  elements.syncSchedule.textContent = formatSchedule(state.schedule);
  const syncMode = state.settings?.SyncModeIndex;
  elements.syncMode.value = syncMode === undefined || syncMode === null ? '0' : String(syncMode);
  elements.syncMode.disabled = !state.settings || Boolean(state.sync?.IsSyncRecording);
  elements.schedule.classList.toggle('active', Boolean(state.schedule?.IsEnabled));
  renderLog();
}

function formatSchedule(schedule) {
  if (!schedule?.IsEnabled) {
    return '';
  }
  const start = schedule.StartTime ? `start ${schedule.StartTime}` : '';
  const stop = schedule.StopTime ? `stop ${schedule.StopTime}` : '';
  return `Schedule: ${[start, stop].filter(Boolean).join(', ')}, ${schedule.ScheduleType}`;
}

function renderList(container, items, selectedIndex, kind, onSelect = () => {}, onEdit = null, dragKind = null) {
  container.innerHTML = items.length
    ? items.map((item) => `
      <button class="row ${item.Index === selectedIndex ? 'selected' : ''}" data-index="${item.Index}" ${dragKind ? 'draggable="true"' : ''}>
        <span class="row-title">${escapeHtml(item.Name)}</span>
        <span class="row-meta">${escapeHtml(item.Device || item.Type || item.Config || kind)}</span>
      </button>
    `).join('')
    : `<div class="empty">No ${kind}s loaded</div>`;

  container.querySelectorAll('.row').forEach((row) => {
    let clickTimer = null;

    row.addEventListener('click', () => {
      if (onEdit) {
        window.clearTimeout(clickTimer);
        clickTimer = window.setTimeout(() => selectListRow(row, items, onSelect), 180);
        return;
      }

      selectListRow(row, items, onSelect);
    });

    if (onEdit) {
      row.addEventListener('dblclick', () => {
        window.clearTimeout(clickTimer);
        const item = items.find((candidate) => candidate.Index === Number(row.dataset.index));
        if (item) {
          onEdit(item);
        }
      });
    }

    if (dragKind) {
      row.addEventListener('dragstart', (event) => {
        const item = items.find((candidate) => candidate.Index === Number(row.dataset.index));
        if (item) {
          document.body.classList.add('dragging-dashboard-item');
          event.dataTransfer.effectAllowed = 'copy';
          event.dataTransfer.dropEffect = 'copy';
          event.dataTransfer.setData('application/json', JSON.stringify({
            kind: dragKind,
            index: item.Index,
            name: item.Name
          }));
          event.dataTransfer.setData('text/plain', `${dragKind}: ${item.Name}`);
          event.dataTransfer.setDragImage(createDragImage(dragKind, item.Name), 18, 18);
        }
      });
    }
  });
}

function renderResources(resources) {
  const metrics = normalizeResources(resources);

  if (!metrics) {
    return '<div class="empty">No resources loaded</div>';
  }

  const ramPercent = metrics.totalRam > 0 ? (metrics.currentRam / metrics.totalRam) * 100 : 0;
  const diskCards = metrics.disks.length
    ? metrics.disks.map((disk) => renderMetricCard(disk.key, `${formatPercent(disk.percent)} used`, disk.percent)).join('')
    : '<div class="resource-empty">No disks reported</div>';

  return `
    <div class="resource-summary">
      ${renderMetricCard('CPU', `${formatPercent(metrics.currentCpu)} current`, metrics.currentCpu)}
      ${renderMetricCard('RAM', `${formatNumber(metrics.currentRam)} / ${formatNumber(metrics.totalRam)} GB`, ramPercent)}
      ${renderMetricCard('Total CPU', `${formatPercent(metrics.totalCpu)}`, metrics.totalCpu)}
    </div>
    <div class="resource-disks">
      ${diskCards}
    </div>
  `;
}

function renderMetricCard(label, value, percent) {
  const clampedPercent = clampNumber(Number(percent), 0, 100);
  const tone = clampedPercent >= 85 ? 'danger' : clampedPercent >= 70 ? 'warn' : 'ok';

  return `
    <div class="resource-card ${tone}">
      <div class="resource-card-header">
        <span>${escapeHtml(label)}</span>
        <b>${escapeHtml(value)}</b>
      </div>
      <div class="meter">
        <span style="width: ${clampedPercent}%"></span>
      </div>
    </div>
  `;
}

function selectListRow(row, items, onSelect) {
  const item = items.find((candidate) => candidate.Index === Number(row.dataset.index));
  if (item) {
    onSelect(item);
  }
}

function renderChannels() {
  elements.channels.innerHTML = state.channels.length
    ? state.channels.map((channel) => `
      <button class="channel ${channel.Index === state.selectedChannel ? 'selected' : ''}" data-index="${channel.Index}">
        ${renderChannelPreview(channel)}
        <span class="channel-index">CH ${channel.Index}</span>
        <span class="channel-source">${escapeHtml(channel.SourceName || 'Not Specified')}</span>
        <span class="channel-dests">${escapeHtml((channel.Destinations || []).join(', ') || 'No destinations')}</span>
        <span class="channel-presets">${escapeHtml(renderChannelPresetNames(channel))}</span>
        <span class="badges">
          ${channel.IsRecording ? '<b class="badge rec">REC</b>' : '<b class="badge">IDLE</b>'}
          ${channel.IsRecordingPause ? '<b class="badge">PAUSED</b>' : ''}
          ${channel.IsInSync ? '<b class="badge sync">SYNC</b>' : ''}
        </span>
        <span class="channel-stats">${escapeHtml(channel.RecordingDuration || '00:00:00')} | ${escapeHtml(channel.RecordingFPS || '0.00')} fps | drops ${escapeHtml(channel.RecordingDrops || '0')}</span>
      </button>
    `).join('')
    : '<div class="empty">No channels loaded</div>';

  elements.channels.querySelectorAll('.channel').forEach((row) => {
    let clickTimer = null;

    row.addEventListener('click', () => {
      window.clearTimeout(clickTimer);
      clickTimer = window.setTimeout(() => {
        state.selectedChannel = Number(row.dataset.index);
        render();
      }, 180);
    });
    row.addEventListener('dblclick', () => {
      window.clearTimeout(clickTimer);
      openChannelDialog(Number(row.dataset.index));
    });
    row.addEventListener('dragenter', (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      row.classList.add('drop-target');
    });
    row.addEventListener('dragover', (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      row.classList.add('drop-target');
    });
    row.addEventListener('dragleave', () => {
      row.classList.remove('drop-target');
    });
    row.addEventListener('drop', (event) => {
      event.preventDefault();
      row.classList.remove('drop-target');
      const payload = getDragPayload(event);
      if (payload) {
        applyDropToChannel(Number(row.dataset.index), payload);
      }
    });
  });
}

function renderChannelPresetNames(channel) {
  const presetNames = state.channelPresetNames.get(channel.Index);

  if (!channel.Destinations?.length) {
    return 'No presets';
  }

  if (!presetNames) {
    return 'Presets loading';
  }

  return presetNames.length ? presetNames.join(', ') : 'No presets';
}

async function refreshChannelPresetNames() {
  const nextPresetNames = new Map();

  await Promise.all(state.channels.map(async (channel) => {
    const presetNames = [];

    for (const destinationName of channel.Destinations || []) {
      const destination = state.destinations.find((item) => item.Name === destinationName);

      if (!destination) {
        continue;
      }

      try {
        const fullDestination = await state.client.getDestination(destination.Index);

        if (fullDestination?.PresetName && !presetNames.includes(fullDestination.PresetName)) {
          presetNames.push(fullDestination.PresetName);
        }
      } catch {
        if (!presetNames.includes('Preset unavailable')) {
          presetNames.push('Preset unavailable');
        }
      }
    }

    nextPresetNames.set(channel.Index, presetNames);
  }));

  state.channelPresetNames = nextPresetNames;
  renderChannels();
}

function acceptDashboardDrag(event) {
  if (!isDashboardDrag(event)) {
    return;
  }

  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}

function isDashboardDrag(event) {
  return document.body.classList.contains('dragging-dashboard-item')
    || Array.from(event.dataTransfer?.types || []).includes('application/json');
}

function getDragPayload(event) {
  try {
    const text = event.dataTransfer.getData('application/json');
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

function createDragImage(kind, name) {
  const element = document.createElement('div');
  element.className = 'drag-ghost';
  element.textContent = `${kind}: ${name}`;
  document.body.append(element);
  window.setTimeout(() => element.remove(), 0);
  return element;
}

function clearDragState() {
  document.body.classList.remove('dragging-dashboard-item');
  document.querySelectorAll('.drop-target').forEach((element) => {
    element.classList.remove('drop-target');
  });
}

async function applyDropToChannel(channelIndex, payload) {
  if (payload.kind === 'source') {
    await runAction(`Drop source on CH ${channelIndex}`, () => state.client.setChannelSource(channelIndex, payload.name));
    return;
  }

  if (payload.kind === 'destination') {
    await runAction(`Drop destination on CH ${channelIndex}`, () => state.client.addChannelDestination(channelIndex, payload.name));
    return;
  }

  if (payload.kind === 'preset') {
    await applyPresetDropToChannel(channelIndex, payload.name);
  }
}

async function applyPresetDropToChannel(channelIndex, presetName) {
  const channel = state.channels.find((item) => item.Index === channelIndex);
  const destinationNames = channel?.Destinations || [];

  if (!destinationNames.length) {
    pushLog(`Drop preset on CH ${channelIndex}: assign a destination first.`);
    renderLog();
    return;
  }

  await runAction(`Drop preset on CH ${channelIndex}`, async () => {
    await updateDestinationsPreset(destinationNames, presetName);
  });
}

async function updateDestinationsPreset(destinationNames, presetName) {
  for (const destinationName of destinationNames) {
    const destination = state.destinations.find((item) => item.Name === destinationName);

    if (!destination) {
      continue;
    }

    const fullDestination = await state.client.getDestination(destination.Index);
    await state.client.updateDestination(destination.Index, removeEmptyFields({
      ...fullDestination,
      PresetName: presetName
    }));
  }
}

function renderChannelPreview(channel) {
  const sourceName = channel.SourceName || '';
  const hasSource = sourceName && sourceName !== 'Not Specified';
  const preview = state.channelPreviews.get(channel.Index);

  if (!hasSource) {
    return '<span class="channel-preview empty-preview">No source</span>';
  }

  if (preview?.status === 'ready') {
    return `<span class="channel-preview"><img src="${escapeHtml(preview.src)}" alt="" /></span>`;
  }

  if (preview?.status === 'error') {
    return '<span class="channel-preview empty-preview">No preview</span>';
  }

  return '<span class="channel-preview empty-preview">Loading</span>';
}

async function refreshChannelPreviews({ force = false } = {}) {
  const refreshId = ++state.previewRefreshId;
  const activeChannelKeys = new Set();
  const previewTasks = [];

  for (const channel of state.channels) {
    const sourceName = channel.SourceName || '';
    const hasSource = sourceName && sourceName !== 'Not Specified';
    const previewKey = `${channel.Index}:${sourceName}`;

    if (!hasSource) {
      state.channelPreviews.delete(channel.Index);
      continue;
    }

    activeChannelKeys.add(previewKey);

    if (!force && state.channelPreviews.get(channel.Index)?.key === previewKey) {
      continue;
    }

    state.channelPreviews.set(channel.Index, { key: previewKey, status: 'loading' });
    previewTasks.push(loadChannelPreview(channel.Index, previewKey, refreshId));
  }

  for (const [index, preview] of state.channelPreviews) {
    if (!activeChannelKeys.has(preview.key)) {
      state.channelPreviews.delete(index);
    }
  }

  if (previewTasks.length) {
    renderChannels();
    await Promise.allSettled(previewTasks);
    updateOpenChannelDialog();
  }
}

function schedulePreviewUpdates() {
  if (state.previewTimerId) {
    window.clearInterval(state.previewTimerId);
    state.previewTimerId = null;
  }

  if (!state.previewUpdateSeconds || !hasPreviewableChannels()) {
    return;
  }

  state.previewTimerId = window.setInterval(() => {
    refreshChannelPreviews({ force: true });
  }, state.previewUpdateSeconds * 1000);
}

function scheduleResourceUpdates() {
  if (state.resourceTimerId) {
    window.clearInterval(state.resourceTimerId);
    state.resourceTimerId = null;
  }

  if (!state.resourceUpdateSeconds) {
    return;
  }

  state.resourceTimerId = window.setInterval(refreshResources, state.resourceUpdateSeconds * 1000);
}

function scheduleChannelStatsUpdates() {
  if (state.channelStatsTimerId) {
    window.clearInterval(state.channelStatsTimerId);
    state.channelStatsTimerId = null;
  }

  if (!state.channelStatsUpdateSeconds) {
    return;
  }

  state.channelStatsTimerId = window.setInterval(refreshChannelStats, state.channelStatsUpdateSeconds * 1000);
}

async function refreshChannelStats() {
  try {
    const channels = await state.client.getChannels();
    state.channels = toList(channels);

    if (!state.channels.some((channel) => channel.Index === state.selectedChannel)) {
      state.selectedChannel = state.channels[0]?.Index ?? null;
    }

    renderChannels();
    refreshChannelPresetNames();
    refreshChannelPreviews();
    updateOpenChannelDialog();
    schedulePreviewUpdates();
  } catch (error) {
    pushLog(`Channel stats update: ${error.message}`);
    renderLog();
  }
}

async function refreshResources() {
  try {
    state.resources = await state.client.getResources();
    elements.resources.innerHTML = renderResources(state.resources);
  } catch (error) {
    pushLog(`Resources update: ${error.message}`);
    renderLog();
  }
}

function hasPreviewableChannels() {
  return state.channels.some((channel) => {
    const sourceName = channel.SourceName || '';
    return sourceName && sourceName !== 'Not Specified';
  });
}

async function loadChannelPreview(index, key, refreshId) {
  try {
    const base64 = await withTimeout((signal) => state.client.getChannelPreview(index, { signal }), 6000);

    if (refreshId !== state.previewRefreshId) {
      return;
    }

    state.channelPreviews.set(index, {
      key,
      status: 'ready',
      src: toPreviewImageSrc(base64)
    });
  } catch {
    if (refreshId === state.previewRefreshId) {
      state.channelPreviews.set(index, { key, status: 'error' });
    }
  }

  renderChannels();
  updateOpenChannelDialog();
}

function withTimeout(action, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  return action(controller.signal).finally(() => {
    window.clearTimeout(timeoutId);
  });
}

function toPreviewImageSrc(value) {
  const image = String(value || '').trim();
  return image.startsWith('data:') ? image : `data:image/png;base64,${image}`;
}

function toList(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.value)) {
    return value.value;
  }

  return [];
}

function toDeviceList(value, key) {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.[key])) {
    return value[key];
  }

  if (Array.isArray(value?.value)) {
    return value.value;
  }

  return [];
}

function removeEmptyFields(value) {
  return Object.fromEntries(Object.entries(value).filter(([, fieldValue]) => {
    return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
  }));
}

function findDeviceIndex(devices, selectedDevice) {
  if (!selectedDevice) {
    return 0;
  }

  const index = devices.findIndex((device) => {
    return device.Type === selectedDevice.Type
      && device.Index === selectedDevice.Index
      && device.Name === selectedDevice.Name;
  });

  return index >= 0 ? index : 0;
}

function normalizeResources(resources) {
  const entries = Array.isArray(resources?.value) ? resources.value : resources;

  if (!Array.isArray(entries)) {
    return null;
  }

  const values = {};

  for (let index = 0; index < entries.length; index += 2) {
    values[entries[index]] = entries[index + 1];
  }

  return {
    currentCpu: Number(values.CurrentCPU) || 0,
    totalCpu: Number(values.TotalCPU) || 0,
    currentRam: Number(values.CurrentRAM) || 0,
    totalRam: Number(values.TotalRAM) || 0,
    // Direct Take reports the free space of each drive; the cards show how full the drive is
    disks: toList(values.DiskInfo).map((disk) => ({
      key: disk.Key,
      percent: 100 - parsePercent(disk.Value)
    })).filter((disk) => disk.key)
  };
}

function parsePercent(value) {
  return Number(String(value ?? '').replace('%', '')) || 0;
}

function formatPercent(value) {
  return `${formatNumber(value)}%`;
}

function formatNumber(value) {
  return Number(value || 0).toFixed(1);
}

function formatInterval(value) {
  return value ? `every ${value}s` : 'off';
}

function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(Math.max(Math.round(value), min), max);
}

function renderLog() {
  elements.log.textContent = state.log.join('\n');
}

function getLogText() {
  return state.log.join('\n') || 'No log entries.';
}

function pushLog(message) {
  state.log = [`${new Date().toLocaleTimeString()} ${message}`, ...state.log].slice(0, 80);
}

function requireChannel() {
  if (state.selectedChannel === null) {
    throw new Error('Select a channel first.');
  }
  return state.selectedChannel;
}

function requireSource() {
  const source = state.sources.find((item) => item.Index === state.selectedSource);
  if (!source) {
    throw new Error('Select a source first.');
  }
  return source;
}

function requireDestination() {
  const destination = state.destinations.find((item) => item.Index === state.selectedDestination);
  if (!destination) {
    throw new Error('Select a destination first.');
  }
  return destination;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function getInitialBaseUrl() {
  return normalizeDashboardBaseUrl(localStorage.getItem('dt.baseUrl') || '/dt-api/');
}

function getInitialPreviewUpdateSeconds() {
  return clampNumber(Number(localStorage.getItem('dt.previewUpdateSeconds') ?? 30), 0, 3600);
}

function getInitialResourceUpdateSeconds() {
  return clampNumber(Number(localStorage.getItem('dt.resourceUpdateSeconds') ?? 15), 0, 3600);
}

function getInitialChannelStatsUpdateSeconds() {
  return clampNumber(Number(localStorage.getItem('dt.channelStatsUpdateSeconds') ?? 3), 0, 3600);
}

function normalizeDashboardBaseUrl(baseUrl) {
  const url = String(baseUrl || '').trim();

  if (isLocalDirectTakeApiUrl(url)) {
    return '/dt-api/';
  }

  return url || '/dt-api/';
}

function isLocalDirectTakeApiUrl(baseUrl) {
  try {
    const url = new URL(baseUrl);
    return url.port === '9531';
  } catch {
    return false;
  }
}
