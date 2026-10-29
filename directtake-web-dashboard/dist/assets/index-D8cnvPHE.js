(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();class ke extends Error{constructor(e,n){super(`Direct Take API request failed with HTTP ${e.status} ${e.statusText}. ${n}`),this.name="DirectTakeApiError",this.status=e.status,this.statusText=e.statusText,this.body=n}}class Le{constructor({baseUrl:e="http://localhost:9000/api/",token:n="",fetchImpl:s=Re()}={}){if(!s)throw new Error("A fetch implementation is required.");this.baseUrl=V(e),this.token=n,this.fetch=Ae(s)}setConnection({baseUrl:e,token:n}={}){e&&(this.baseUrl=V(e)),n!==void 0&&(this.token=n)}getApplicationState(e){return this.get("app/state",e)}getConversionLists(e){return this.get("app/conversion-lists",e)}getConversionConfig(e){return this.get("app/conversion-config",e)}setConversionConfig(e,n){return this.put("app/conversion-config",e,n)}getSettings(e){return this.get("app/settings",e)}updateSettings(e,n){return this.put("app/settings",e,n)}startNewProject(e){return this.put("app/new",{},e)}saveProject(e,n){return this.put("app/save",{Path:e},n)}loadProject(e,n){return this.put("app/load",{Path:e},n)}getResources(e){return this.get("app/resources",e)}getSyncState(e){return this.get("app/sync",e)}getSchedule(e){return this.get("app/schedule",e)}setSchedule(e,n){return this.put("app/schedule",e,n)}getDialog(e){return this.get("app/dialog",e)}actOnDialog(e,n){const s=e===!0?"ok":e===!1?"cancel":String(e??"").trim().toLowerCase(),i=["ok","yes","no","cancel"].includes(s)?s:"cancel";return this.put(`app/dialog/${i}`,{},n)}getAudioDevices(e){return this.get("devices/audio",e)}getVideoDevices(e){return this.get("devices/video",e)}getSources(e){return this.get("sources",e)}getSource(e,n){return this.get(`sources/${e}`,n)}addSource(e,n){return this.post("sources",e,n)}updateSource(e,n,s){return this.put(`sources/${e}`,n,s)}deleteSource(e,n){return this.delete(`sources/${e}`,n)}getDestinations(e){return this.get("destinations",e)}getDestination(e,n){return this.get(`destinations/${e}`,n)}addDestination(e,n){return this.post("destinations",e,n)}updateDestination(e,n,s){return this.put(`destinations/${e}`,n,s)}deleteDestination(e,n){return this.delete(`destinations/${e}`,n)}getPresets(e){return this.get("presets/",e)}getPreset(e,n){return this.get(`presets/${e}`,n)}addPreset(e,n){return this.post("presets",e,n)}updatePreset(e,n,s){return this.put(`presets/${e}`,n,s)}deletePreset(e,n){return this.delete(`presets/${e}`,n)}getPresetFormats(e,n){return this.get(`presets/${e}/formats`,n)}getPresetVideoCodecs(e,n){return this.get(`presets/${e}/videoCodecs`,n)}getPresetAudioCodecs(e,n){return this.get(`presets/${e}/audioCodecs`,n)}getPresetTimecodes(e,n){return this.get(`presets/${e}/timecodes`,n)}getChannels(e){return this.get("channels",e)}getChannel(e,n){return this.get(`channels/${e}`,n)}setChannelCount(e,n){return this.put(`channels/count/${e}`,{},n)}getChannelPreview(e,n){return this.get(`channels/${e}/preview`,n)}setChannelSource(e,n,s){return this.put(`channels/${e}/set-source/${R(n)}`,{},s)}unsetChannelSource(e,n){return this.put(`channels/${e}/unset-source`,{},n)}addChannelDestination(e,n,s){return this.put(`channels/${e}/add-dest/${R(n)}`,{},s)}deleteChannelDestination(e,n,s){return this.put(`channels/${e}/delete-dest/${R(n)}`,{},s)}enableChannelSync(e,n){return this.put(`channels/${e}/sync-on`,{},n)}disableChannelSync(e,n){return this.put(`channels/${e}/sync-off`,{},n)}startChannelRecording(e,n){return this.put(`channels/${e}/rec-start`,{},n)}pauseChannelRecording(e,n){return this.put(`channels/${e}/rec-pause`,{},n)}stopChannelRecording(e,n){return this.put(`channels/${e}/rec-stop`,{},n)}splitChannelRecording(e,n){return this.put(`channels/${e}/rec-split`,{},n)}startSyncRecording(e){return this.put("channels/sync-rec-start",{},e)}pauseSyncRecording(e){return this.put("channels/sync-rec-pause",{},e)}stopSyncRecording(e){return this.put("channels/sync-rec-stop",{},e)}splitSyncRecording(e){return this.put("channels/sync-rec-split",{},e)}get(e,n){return this.request(e,{...n,method:"GET"})}post(e,n,s){return this.request(e,{...s,method:"POST",body:n})}put(e,n={},s){return this.request(e,{...s,method:"PUT",body:n})}delete(e,n){return this.request(e,{...n,method:"DELETE"})}async request(e,{method:n="GET",body:s,signal:i,headers:o={}}={}){const d={Accept:"application/json",...o};if(this.token){const m=this.token.trim().replace(/^Bearer\s+/i,"");d.Authorization=`Bearer ${m}`}const l={method:n,headers:d,signal:i};s!==void 0&&n!=="GET"&&(d["Content-Type"]="application/json",l.body=JSON.stringify(s));const u=await this.fetch(new URL(e,Ee(this.baseUrl)),l),c=await u.text();if(!u.ok)throw new ke(u,c);if(!c)return null;try{return JSON.parse(c)}catch{return c.replace(/^"|"$/g,"")}}}function V(t){const e=String(t||"").trim();return e.endsWith("/")?e:`${e}/`}function Ee(t){var e;return typeof globalThis<"u"&&((e=globalThis.location)!=null&&e.href)?new URL(t,globalThis.location.href):t}function Re(){return typeof globalThis<"u"?globalThis.fetch:void 0}function Ae(t){return typeof globalThis<"u"&&t===globalThis.fetch?t.bind(globalThis):t}function R(t){return encodeURIComponent(t)}/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J=(t,e,n=[])=>{const s=document.createElementNS("http://www.w3.org/2000/svg",t);return Object.keys(e).forEach(i=>{s.setAttribute(i,String(e[i]))}),n.length&&n.forEach(i=>{const o=J(...i);s.appendChild(o)}),s};var Ue=([t,e,n])=>J(t,e,n);/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qe=t=>Array.from(t.attributes).reduce((e,n)=>(e[n.name]=n.value,e),{}),Me=t=>typeof t=="string"?t:!t||!t.class?"":t.class&&typeof t.class=="string"?t.class.split(" "):t.class&&Array.isArray(t.class)?t.class:"",Fe=t=>t.flatMap(Me).map(n=>n.trim()).filter(Boolean).filter((n,s,i)=>i.indexOf(n)===s).join(" "),Oe=t=>t.replace(/(\w)(\w*)(_|-|\s*)/g,(e,n,s)=>n.toUpperCase()+s.toLowerCase()),G=(t,{nameAttr:e,icons:n,attrs:s})=>{var B;const i=t.getAttribute(e);if(i==null)return;const o=Oe(i),d=n[o];if(!d)return console.warn(`${t.outerHTML} icon name was not found in the provided icons object.`);const l=qe(t),[u,c,m]=d,b={...c,"data-lucide":i,...s,...l},x=Fe(["lucide",`lucide-${i}`,l,s]);x&&Object.assign(b,{class:x});const Ie=Ue([u,b,m]);return(B=t.parentNode)==null?void 0:B.replaceChild(Ie,t)};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y=["svg",h,[["circle",{cx:"12",cy:"12",r:"10"}],["polyline",{points:"12 6 12 12 16 14"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=["svg",h,[["path",{d:"M15 3h6v6"}],["path",{d:"M10 14 21 3"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=["svg",h,[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=["svg",h,[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=["svg",h,[["polygon",{points:"6 3 20 12 6 21 6 3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=["svg",h,[["path",{d:"M5 12h14"}],["path",{d:"M12 5v14"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=["svg",h,[["path",{d:"M4.9 19.1C1 15.2 1 8.8 4.9 4.9"}],["path",{d:"M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"}],["circle",{cx:"12",cy:"12",r:"2"}],["path",{d:"M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"}],["path",{d:"M19.1 4.9C23 8.8 23 15.1 19.1 19"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=["svg",h,[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"}],["path",{d:"M21 3v5h-5"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"}],["path",{d:"M8 16H3v5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=["svg",h,[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}],["path",{d:"M3 3v5h5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=["svg",h,[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=["svg",h,[["circle",{cx:"6",cy:"6",r:"3"}],["path",{d:"M8.12 8.12 12 12"}],["path",{d:"M20 4 8.12 15.88"}],["circle",{cx:"6",cy:"18",r:"3"}],["path",{d:"M14.8 14.8 20 20"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=["svg",h,[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"}],["circle",{cx:"12",cy:"12",r:"3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ce=["svg",h,[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const de=["svg",h,[["path",{d:"m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"}],["path",{d:"m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"}],["line",{x1:"8",x2:"8",y1:"2",y2:"5"}],["line",{x1:"2",x2:"5",y1:"8",y2:"8"}],["line",{x1:"16",x2:"16",y1:"19",y2:"22"}],["line",{x1:"19",x2:"22",y1:"16",y2:"16"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=["svg",h,[["path",{d:"M12 20h.01"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0"}],["path",{d:"M5 12.859a10 10 0 0 1 14 0"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=["svg",h,[["path",{d:"M18 6 6 18"}],["path",{d:"m6 6 12 12"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pe=({icons:t={},nameAttr:e="data-lucide",attrs:n={}}={})=>{if(!Object.values(t).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof document>"u")throw new Error("`createIcons()` only works in a browser environment.");const s=document.querySelectorAll(`[${e}]`);if(Array.from(s).forEach(i=>G(i,{nameAttr:e,icons:t,attrs:n})),e==="data-lucide"){const i=document.querySelectorAll("[icon-name]");i.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(i).forEach(o=>G(o,{nameAttr:"icon-name",icons:t,attrs:n})))}},z=Pt(),je=It(),He=kt(),Be=Lt(),a={client:new Le({baseUrl:z}),baseUrl:z,token:localStorage.getItem("dt.token")||"",previewUpdateSeconds:je,resourceUpdateSeconds:He,channelStatsUpdateSeconds:Be,channels:[],sources:[],destinations:[],presets:[],videoDevices:[],audioDevices:[],resources:null,sync:null,settings:null,schedule:null,channelPreviews:new Map,channelPresetNames:new Map,selectedChannel:null,selectedSource:null,selectedDestination:null,log:[],previewRefreshId:0,previewTimerId:null,resourceTimerId:null,channelStatsTimerId:null};document.querySelector("#app").innerHTML=`
  <main class="shell">
    <section class="connection">
      <label>
        <span>REST API URL</span>
        <input id="baseUrl" value="${r(a.baseUrl)}" placeholder="http://localhost:9000/api/" />
      </label>
      <label>
        <span>Authorization token</span>
        <input id="token" value="${r(a.token)}" type="password" placeholder="perm:..." />
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
`;pe({icons:{Clock:Y,ExternalLink:X,Link:Q,Pause:Z,Play:ee,Plus:te,Radio:ne,RefreshCw:ae,RotateCcw:se,Save:ie,Scissors:oe,Settings:re,Square:ce,Unlink:de,Wifi:le,X:ue}});const p={baseUrl:document.querySelector("#baseUrl"),token:document.querySelector("#token"),refresh:document.querySelector("#refresh"),sources:document.querySelector("#sources"),destinations:document.querySelector("#destinations"),presets:document.querySelector("#presets"),channels:document.querySelector("#channels"),resources:document.querySelector("#resources"),syncState:document.querySelector("#syncState"),syncMode:document.querySelector("#syncMode"),syncSchedule:document.querySelector("#syncSchedule"),schedule:document.querySelector("#schedule"),log:document.querySelector("#log"),modalRoot:document.querySelector("#modalRoot")};document.querySelector("#connect").addEventListener("click",Ve);document.querySelector("#newSource").addEventListener("click",()=>me());document.querySelector("#newDestination").addEventListener("click",()=>ge());document.querySelector("#newPreset").addEventListener("click",()=>he());document.querySelector("#settings").addEventListener("click",We);document.querySelector("#saveLog").addEventListener("click",dt);document.querySelector("#openLog").addEventListener("click",lt);p.refresh.addEventListener("click",O);document.querySelector("#setSource").addEventListener("click",()=>S("Set source",()=>a.client.setChannelSource(w(),Tt().Name)));document.querySelector("#unsetSource").addEventListener("click",()=>S("Unset source",()=>a.client.unsetChannelSource(w())));document.querySelector("#addDest").addEventListener("click",()=>S("Add destination",()=>a.client.addChannelDestination(w(),Te().Name)));document.querySelector("#removeDest").addEventListener("click",()=>S("Remove destination",()=>a.client.deleteChannelDestination(w(),Te().Name)));document.querySelector("#syncOn").addEventListener("click",()=>S("Enable sync",()=>a.client.enableChannelSync(w())));document.querySelector("#syncOff").addEventListener("click",()=>S("Disable sync",()=>a.client.disableChannelSync(w())));document.querySelector("#recStart").addEventListener("click",()=>S("Start recording",()=>a.client.startChannelRecording(w())));document.querySelector("#recPause").addEventListener("click",()=>S("Pause recording",()=>a.client.pauseChannelRecording(w())));document.querySelector("#recStop").addEventListener("click",()=>S("Stop recording",()=>a.client.stopChannelRecording(w())));document.querySelector("#recSplit").addEventListener("click",()=>S("Split recording",()=>a.client.splitChannelRecording(w())));document.querySelector("#syncStart").addEventListener("click",()=>g("Start synchronous recording",()=>a.client.startSyncRecording()));document.querySelector("#syncPause").addEventListener("click",()=>g("Pause synchronous recording",()=>a.client.pauseSyncRecording()));document.querySelector("#syncStop").addEventListener("click",()=>g("Stop synchronous recording",()=>a.client.stopSyncRecording()));document.querySelector("#syncSplit").addEventListener("click",()=>g("Split synchronous recording",()=>a.client.splitSyncRecording()));p.syncMode.addEventListener("change",()=>{var e;const t=Number(p.syncMode.value);g(`Synchronization mode ${((e=p.syncMode.selectedOptions[0])==null?void 0:e.textContent)??t}`,()=>a.client.updateSettings({SyncModeIndex:t}))});p.schedule.addEventListener("click",ze);document.querySelectorAll("[data-grid]").forEach(t=>{t.addEventListener("click",()=>g(`Set grid ${t.dataset.grid}`,()=>a.client.setChannelCount(Number(t.dataset.grid))))});document.addEventListener("dragenter",we,!0);document.addEventListener("dragover",we,!0);document.addEventListener("drop",()=>{$e()});document.addEventListener("dragend",()=>{$e()});T();async function Ve(){a.baseUrl=Pe(p.baseUrl.value.trim()||"/dt-api/"),p.baseUrl.value=a.baseUrl,a.token=p.token.value.trim(),localStorage.setItem("dt.baseUrl",a.baseUrl),localStorage.setItem("dt.token",a.token),a.client.setConnection({baseUrl:a.baseUrl,token:a.token}),await g("Connect",O,{skipRefresh:!0})}async function O(){var u;const[t,e,n,s,i,o,d,l]=await Promise.all([a.client.getSources(),a.client.getDestinations(),a.client.getPresets(),a.client.getChannels(),a.client.getResources(),a.client.getSyncState(),a.client.getVideoDevices(),a.client.getAudioDevices()]);a.sources=$(t),a.destinations=$(e),a.presets=$(n),a.channels=$(s),a.videoDevices=W(d,"Video"),a.audioDevices=W(l,"Audio"),a.resources=i,a.sync=o,[a.settings,a.schedule]=await Promise.all([a.client.getSettings().catch(()=>null),a.client.getSchedule().catch(()=>null)]),a.channels.some(c=>c.Index===a.selectedChannel)||(a.selectedChannel=((u=a.channels[0])==null?void 0:u.Index)??null),T(),Se(),j({force:!0}),H(),De(),Ne()}async function S(t,e){await g(t,e)}async function g(t,e,{skipRefresh:n=!1}={}){try{await e(),v(`${t}: ok`),f(),n||await O()}catch(s){v(`${t}: ${s.message}`),f(),s.status===409&&/message box/i.test(String(s.body??""))&&await Ge()}}async function Ge(){let t;try{t=await a.client.getDialog()}catch(n){v(`Message box: ${n.message}`),f();return}if(!t||typeof t!="object"||!t.IsDialog)return;const e=t.DialogButtons==="Yes_No"?'<button type="button" data-dialog-answer="no"><span>No</span></button><button type="button" data-dialog-answer="yes"><span>Yes</span></button>':'<button type="button" data-dialog-answer="ok"><span>OK</span></button>';D(`
    <div class="dialog message-dialog">
      <div class="dialog-header">
        <div class="dialog-title">Direct Take</div>
      </div>
      <div class="message-text">${r(t.DialogContent??"")}</div>
      <div class="dialog-actions">${e}</div>
    </div>
  `),p.modalRoot.querySelectorAll("[data-dialog-answer]").forEach(n=>{n.addEventListener("click",async()=>{y(),await g(`Message box: ${n.dataset.dialogAnswer}`,()=>a.client.actOnDialog(n.dataset.dialogAnswer))})})}function ze(){const t=a.schedule??{},e=t.ScheduleType==="All channels";D(`
    <form id="scheduleForm" class="dialog">
      <div class="dialog-header">
        <div class="dialog-title">Schedule</div>
        <button type="button" class="icon-button" data-close-dialog title="Close"><i data-lucide="x"></i></button>
      </div>
      <label>
        <span>Start at</span>
        <input name="startTime" type="time" step="1" value="${r(t.StartTime??"")}" />
      </label>
      <label>
        <span>Stop at</span>
        <input name="stopTime" type="time" step="1" value="${r(t.StopTime??"")}" />
      </label>
      <label>
        <span>Channels</span>
        <select name="scheduleType">
          <option value="In Sync only"${e?"":" selected"}>In Sync only</option>
          <option value="All channels"${e?" selected":""}>All channels</option>
        </select>
      </label>
      <div class="field-hint">Times of day on the Direct Take computer. An active schedule repeats every day. Leave a time empty to skip it.</div>
      <div class="dialog-actions">
        <button type="button" data-schedule-off><i data-lucide="x"></i><span>Turn off</span></button>
        <button type="submit"><i data-lucide="clock"></i><span>Schedule</span></button>
      </div>
    </form>
  `),document.querySelector("#scheduleForm").addEventListener("submit",Ke),p.modalRoot.querySelector("[data-schedule-off]").addEventListener("click",async()=>{y(),await g("Schedule off",()=>a.client.setSchedule({IsEnabled:!1,StartTime:null,StopTime:null}))})}async function Ke(t){t.preventDefault();const e=new FormData(t.currentTarget),n=i=>i?String(i).length===5?`${i}:00`:String(i):null,s={IsEnabled:!0,StartTime:n(e.get("startTime")),StopTime:n(e.get("stopTime")),ScheduleType:String(e.get("scheduleType"))};y(),await g("Schedule",()=>a.client.setSchedule(s))}async function We(){const t=await a.client.getSettings().catch(()=>null);D(`
    <form id="settingsForm" class="dialog">
      <div class="dialog-header">
        <div class="dialog-title">Settings</div>
        <button type="button" class="icon-button" data-close-dialog title="Close"><i data-lucide="x"></i></button>
      </div>
      <label>
        <span>Preview update interval, seconds</span>
        <input name="previewUpdateSeconds" type="number" min="0" max="3600" step="1" value="${r(a.previewUpdateSeconds)}" />
      </label>
      <div class="field-hint">Use 0 to disable automatic thumbnail updates.</div>
      <label>
        <span>Resources update interval, seconds</span>
        <input name="resourceUpdateSeconds" type="number" min="0" max="3600" step="1" value="${r(a.resourceUpdateSeconds)}" />
      </label>
      <div class="field-hint">Use 0 to disable automatic CPU, RAM, and disk updates.</div>
      <label>
        <span>Channel stats update interval, seconds</span>
        <input name="channelStatsUpdateSeconds" type="number" min="0" max="3600" step="1" value="${r(a.channelStatsUpdateSeconds)}" />
      </label>
      <div class="field-hint">Use 0 to disable automatic recording stat updates.</div>
      ${Je(t)}
      <div class="dialog-actions">
        <button type="button" data-close-dialog><i data-lucide="x"></i><span>Cancel</span></button>
        <button type="submit"><i data-lucide="save"></i><span>Save Settings</span></button>
      </div>
    </form>
  `),document.querySelector("#settingsForm").addEventListener("submit",e=>_e(e,t))}async function _e(t,e){t.preventDefault();const n=new FormData(t.currentTarget),s=C(Number(n.get("previewUpdateSeconds")),0,3600),i=C(Number(n.get("resourceUpdateSeconds")),0,3600),o=C(Number(n.get("channelStatsUpdateSeconds")),0,3600);a.previewUpdateSeconds=s,a.resourceUpdateSeconds=i,a.channelStatsUpdateSeconds=o,localStorage.setItem("dt.previewUpdateSeconds",String(s)),localStorage.setItem("dt.resourceUpdateSeconds",String(i)),localStorage.setItem("dt.channelStatsUpdateSeconds",String(o)),y(),H(),De(),Ne(),v(`Settings: preview ${M(s)}, resources ${M(i)}, channel stats ${M(o)}`),f(),await Ye(n,e)}function Je(t){return!t||typeof t.GpuDecoding!="boolean"?"":`
      <div class="checkbox-row">
        <input id="gpuDecoding" name="gpuDecoding" type="checkbox" ${t.GpuDecoding?"checked":""} />
        <label for="gpuDecoding">Decode network streams on GPU</label>
      </div>
      <div class="field-hint">A Direct Take setting: NVIDIA NVDEC decodes the network stream sources opened after the change.</div>
  `}async function Ye(t,e){if(!e||typeof e.GpuDecoding!="boolean")return;const n=t.get("gpuDecoding")==="on";n!==e.GpuDecoding&&await g(`GPU decoding ${n?"on":"off"}`,()=>a.client.updateSettings({GpuDecoding:n}),{skipRefresh:!0})}async function Xe(t){await g("Load source",async()=>{const e=await a.client.getSource(t.Index);me({index:t.Index,source:e||t})},{skipRefresh:!0})}async function Qe(t){await g("Load destination",async()=>{const e=await a.client.getDestination(t.Index);ge({index:t.Index,destination:e||t})},{skipRefresh:!0})}function me({index:t=null,source:e={}}={}){const n=`Source ${a.sources.length+1}`,s=_(a.videoDevices,e.VideoDevice),i=_(a.audioDevices,e.AudioDevice),o=a.videoDevices.map((u,c)=>`
    <option value="${c}" ${c===s?"selected":""}>${r(u.Name)}</option>
  `).join(""),d=a.audioDevices.map((u,c)=>`
    <option value="${c}" ${c===i?"selected":""}>${r(u.Name)}</option>
  `).join(""),l=t!==null;D(`
    <form id="sourceForm" class="dialog" data-index="${l?t:""}">
      <div class="dialog-header">
        <div class="dialog-title">${l?"Edit Source":"Create Source"}</div>
        <button type="button" class="icon-button" data-close-dialog title="Close"><i data-lucide="x"></i></button>
      </div>
      <label>
        <span>Source name</span>
        <input name="name" value="${r(e.Name||n)}" required />
      </label>
      <label>
        <span>Video device</span>
        <select name="videoDevice" required ${a.videoDevices.length?"":"disabled"}>
          ${o||"<option>No video devices loaded</option>"}
        </select>
      </label>
      <label>
        <span>Audio device</span>
        <select name="audioDevice" ${a.audioDevices.length?"":"disabled"}>
          ${d||"<option>No audio devices loaded</option>"}
        </select>
      </label>
      <label>
        <span>Audio gain</span>
        <input name="audioGain" value="${r(e.AudioGain??0)}" />
      </label>
      <div class="dialog-actions">
        <button type="button" data-close-dialog><i data-lucide="x"></i><span>Cancel</span></button>
        <button type="submit"><i data-lucide="save"></i><span>${l?"Save Source":"Create Source"}</span></button>
      </div>
    </form>
  `),document.querySelector("#sourceForm").addEventListener("submit",st)}function ge({index:t=null,destination:e={}}={}){const n=`Destination ${a.destinations.length+1}`,s=a.presets.map(o=>`
    <option value="${r(o.Name)}" ${o.Name===e.PresetName?"selected":""}>${r(o.Name)}</option>
  `).join(""),i=t!==null;D(`
    <form id="destinationForm" class="dialog" data-index="${i?t:""}">
      <div class="dialog-header">
        <div class="dialog-title">${i?"Edit Destination":"Create Destination"}</div>
        <button type="button" class="icon-button" data-close-dialog title="Close"><i data-lucide="x"></i></button>
      </div>
      <label>
        <span>Destination name</span>
        <input name="name" value="${r(e.Name||n)}" required />
      </label>
      <label>
        <span>Recording folder</span>
        <input name="location" value="${r(e.Location||"")}" placeholder="D:\\Recordings" required />
      </label>
      <label>
        <span>Encoding preset</span>
        <select name="presetName" required ${a.presets.length?"":"disabled"}>
          ${s||"<option>No presets loaded</option>"}
        </select>
      </label>
      <label>
        <span>Naming template</span>
        <input name="namingTemplate" value="${r(e.NamingTemplate||"{Source}_{Year}-{Month}-{Day}_{Hour}-{Min}-{Sec}")}" required />
      </label>
      <label>
        <span>Auto split every</span>
        <input name="splitInterval" value="${r(e.SplitIntervalString||"00:00:00")}" placeholder="HH:mm:ss" />
      </label>
      <div class="checkbox-row">
        <input id="overwriteDestinationFiles" name="overwrite" type="checkbox" ${e.OverwriteExistingFiles?"checked":""} />
        <label for="overwriteDestinationFiles">Overwrite existing files</label>
      </div>
      <div class="dialog-actions">
        <button type="button" data-close-dialog><i data-lucide="x"></i><span>Cancel</span></button>
        <button type="submit"><i data-lucide="save"></i><span>${i?"Save Destination":"Create Destination"}</span></button>
      </div>
    </form>
  `),document.querySelector("#destinationForm").addEventListener("submit",it)}async function Ze(t){await g("Load preset",async()=>{const e=await a.client.getPreset(t.Index);await he({index:t.Index,preset:e||t})},{skipRefresh:!0})}async function he({index:t=null,preset:e={}}={}){var m;const n=`Preset ${a.presets.length+1}`,s=t!==null,i=t??((m=a.presets[0])==null?void 0:m.Index)??0,[o,d,l,u]=await Promise.all([I("formats",()=>a.client.getPresetFormats(i)),I("video codecs",()=>a.client.getPresetVideoCodecs(i)),I("audio codecs",()=>a.client.getPresetAudioCodecs(i)),I("timecodes",()=>a.client.getPresetTimecodes(i))]),c=$(u);D(`
    <form id="presetForm" class="dialog preset-dialog" data-index="${s?t:""}">
      <div class="dialog-header">
        <div class="dialog-title">${s?"Edit Preset":"Create Preset"}</div>
        <button type="button" class="icon-button" data-close-dialog title="Close"><i data-lucide="x"></i></button>
      </div>
      <label>
        <span>Preset name</span>
        <input name="name" value="${r(e.Name||n)}" required />
      </label>
      <label>
        <span>Type</span>
        <input name="type" value="${r(e.Type||"Local File Recording")}" required />
      </label>
      <label>
        <span>Format</span>
        ${A("format",o,e.Format,"MP4 (MPEG-4 Part 14)")}
      </label>
      <label>
        <span>Video codec</span>
        ${A("videoCodec",d,e.VideoCodec)}
      </label>
      <label>
        <span>Audio codec</span>
        ${A("audioCodec",l,e.AudioCodec)}
      </label>
      <label>
        <span>Start timecode</span>
        <select name="startTimecode">
          ${c.map(b=>{var x;return`
            <option value="${r(b.Key)}" ${b.Key===((x=e.StartTimecode)==null?void 0:x.Key)?"selected":""}>${r(b.Value)}</option>
          `}).join("")||'<option value="">No timecode list loaded</option>'}
        </select>
      </label>
      <label>
        <span>Video bitrate</span>
        <input name="videoBitrate" value="${r(e.VideoBitrate||"")}" placeholder="15M" />
      </label>
      <label>
        <span>Key frame interval</span>
        <input name="keyFrameInterval" value="${r(e.KeyFrameInterval||"")}" placeholder="60" />
      </label>
      <label>
        <span>Full encoder configuration</span>
        <textarea name="config" rows="5" placeholder="format='mp4' video::codec='n265' audio::codec='libmp3lame'">${r(e.Config||"")}</textarea>
      </label>
      <div class="dialog-actions">
        <button type="button" data-close-dialog><i data-lucide="x"></i><span>Cancel</span></button>
        <button type="submit"><i data-lucide="save"></i><span>${s?"Save Preset":"Create Preset"}</span></button>
      </div>
    </form>
  `),document.querySelector("#presetForm").addEventListener("submit",ot)}async function I(t,e){try{return $(await e())}catch(n){return v(`Load preset ${t}: ${n.message}`),f(),[]}}function A(t,e,n="",s=""){const i=$(e);if(!i.length)return`<input name="${t}" value="${r(n||"")}" placeholder="${r(s)}" />`;const o=n&&i.includes(n),d=n&&!o?`<option value="${r(n)}" selected>${r(n)}</option>`:"";return`
    <select name="${t}">
      ${d}
      ${i.map(l=>`
        <option value="${r(l)}" ${l===n?"selected":""}>${r(l)}</option>
      `).join("")}
    </select>
  `}function et(t){if(t)return{Key:t}}async function tt(t){var u;const e=a.channels.find(c=>c.Index===t);if(!e)return;const n=await nt(e),s=e.SourceName&&e.SourceName!=="Not Specified"?e.SourceName:"",i=[`<option value="" ${s?"":"selected"}>Not Specified</option>`,...a.sources.map(c=>`
      <option value="${r(c.Name)}" ${c.Name===s?"selected":""}>${r(c.Name)}</option>
    `)].join(""),o=a.destinations.length?a.destinations.map(c=>{const m=`channelDestination-${c.Index}`,b=(e.Destinations||[]).includes(c.Name);return`
        <div class="checkbox-row compact">
          <input id="${m}" name="destinations" value="${r(c.Name)}" type="checkbox" ${b?"checked":""} />
          <label for="${m}">${r(c.Name)}</label>
        </div>
      `}).join(""):'<div class="field-hint">No destinations loaded.</div>',d=((u=a.channelPresetNames.get(e.Index))==null?void 0:u[0])||"",l=['<option value="">Keep current presets</option>',...a.presets.map(c=>`
      <option value="${r(c.Name)}" ${c.Name===d?"selected":""}>${r(c.Name)}</option>
    `)].join("");D(`
    <form id="channelForm" class="dialog channel-dialog" data-index="${e.Index}">
      <div class="dialog-header">
        <div class="dialog-title">Edit Channel ${e.Index}</div>
        <button type="button" class="icon-button" data-close-dialog title="Close"><i data-lucide="x"></i></button>
      </div>
      <div class="channel-dialog-top">
        <div class="channel-dialog-preview" data-channel-preview>
          ${fe(e)}
        </div>
        <div class="channel-dialog-side">
          <div class="channel-dialog-status" data-channel-status>
            ${ve(e)}
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
        ${be(e)}
      </div>
      <div class="channel-dialog-grid">
        <label>
          <span>Source</span>
          <select name="sourceName">
            ${i}
          </select>
        </label>
        <label>
          <span>Preset for selected destinations</span>
          <select name="presetName">
            ${l}
          </select>
        </label>
      </div>
      <div>
        <span class="field-label">Destinations</span>
        <div class="checkbox-stack">
          ${o}
        </div>
      </div>
      <div>
        <span class="field-label">Destination Details</span>
        <div class="destination-details">
          ${at(n)}
        </div>
      </div>
      <div class="dialog-actions">
        <button type="button" data-close-dialog><i data-lucide="x"></i><span>Cancel</span></button>
        <button type="submit"><i data-lucide="save"></i><span>Save Channel</span></button>
      </div>
    </form>
  `),document.querySelector("#channelForm").addEventListener("submit",rt),document.querySelectorAll("[data-channel-action]").forEach(c=>{c.addEventListener("click",()=>ct(e.Index,c.dataset.channelAction))})}async function nt(t){return Promise.all((t.Destinations||[]).map(async e=>{const n=a.destinations.find(s=>s.Name===e);if(!n)return{name:e,error:"Destination not loaded."};try{const s=await a.client.getDestination(n.Index),i=s!=null&&s.PresetName?a.presets.find(d=>d.Name===s.PresetName):null,o=i?await a.client.getPreset(i.Index):null;return{name:e,location:s==null?void 0:s.Location,presetName:s==null?void 0:s.PresetName,config:(o==null?void 0:o.Config)||(s==null?void 0:s.Config)||""}}catch(s){return{name:e,error:s.message}}}))}function at(t){return t.length?t.map(e=>`
    <section class="destination-detail-card">
      <div class="detail-title">${r(e.name)}</div>
      ${e.error?`<div class="field-hint">${r(e.error)}</div>`:`
        <div class="detail-row"><span>Path</span><b>${r(e.location||"Not specified")}</b></div>
        <div class="detail-row"><span>Preset</span><b>${r(e.presetName||"Not specified")}</b></div>
        <pre class="config-block">${r(e.config||"No encoder configuration reported.")}</pre>
      `}
    </section>
  `).join(""):'<div class="field-hint">No destinations assigned.</div>'}function fe(t){const e=a.channelPreviews.get(t.Index);return(e==null?void 0:e.status)==="ready"?`<img src="${r(e.src)}" alt="" />`:"<div>No preview</div>"}function ve(t){return`
    <span class="status-pill ${t.IsRecording?"active":""}">${t.IsRecording?"Recording":"Idle"}</span>
    ${t.IsRecordingPause?'<span class="status-pill warn">Paused</span>':""}
    ${t.IsInSync?'<span class="status-pill sync">Sync</span>':""}
    ${t.IsSomethingWrong?'<span class="status-pill danger">Warning</span>':""}
  `}function be(t){return[N("Duration",t.RecordingDuration||"00:00:00"),N("Encoder FPS",`${t.RecordingFPS||"0.00"} fps`),N("Buffered",t.RecordingBuffered||"0"),N("Drops",t.RecordingDrops||"0"),N("Breaks",t.RecordingBreaks||"0"),N("Audio Preview",t.IsAudioPreview?"On":"Off")].join("")}function N(t,e){return`
    <div class="channel-stat-card">
      <span>${r(t)}</span>
      <b>${r(e)}</b>
    </div>
  `}function L(){const t=document.querySelector("#channelForm");if(!t)return;const e=a.channels.find(o=>o.Index===Number(t.dataset.index));if(!e)return;const n=t.querySelector("[data-channel-status]"),s=t.querySelector("[data-channel-stats]"),i=t.querySelector("[data-channel-preview]");n&&(n.innerHTML=ve(e)),s&&(s.innerHTML=be(e)),i&&(i.innerHTML=fe(e))}async function st(t){t.preventDefault();const e=t.currentTarget.dataset.index,n=new FormData(t.currentTarget),s=a.videoDevices[Number(n.get("videoDevice"))],i=a.audioDevices[Number(n.get("audioDevice"))];if(!s){v("Create source: select a video device first."),f();return}const o=E({Name:n.get("name"),VideoDevice:s,AudioDevice:i,AudioGain:n.get("audioGain")}),d=e!=="";await g(d?"Update source":"Create source",()=>d?a.client.updateSource(Number(e),o):a.client.addSource(o)),y()}async function it(t){t.preventDefault();const e=t.currentTarget.dataset.index,n=new FormData(t.currentTarget),s=E({Name:n.get("name"),Type:"Local File Recording",Location:n.get("location"),NamingTemplate:n.get("namingTemplate"),OverwriteExistingFiles:n.get("overwrite")==="on",SplitIntervalString:n.get("splitInterval"),PresetName:n.get("presetName"),PostCapturingAction:"Do Nothing"}),i=e!=="";await g(i?"Update destination":"Create destination",()=>i?a.client.updateDestination(Number(e),s):a.client.addDestination(s)),y()}async function ot(t){t.preventDefault();const e=t.currentTarget.dataset.index,n=new FormData(t.currentTarget),s=E({Name:n.get("name"),Type:n.get("type"),Format:n.get("format"),VideoCodec:n.get("videoCodec"),AudioCodec:n.get("audioCodec"),VideoBitrate:n.get("videoBitrate"),KeyFrameInterval:n.get("keyFrameInterval"),StartTimecode:et(n.get("startTimecode")),ManualTimecode:n.get("startTimecode")==="00:00:00:00"?"00:00:00:00":void 0,Config:n.get("config")}),i=e!=="";await g(i?"Update preset":"Create preset",()=>i?a.client.updatePreset(Number(e),s):a.client.addPreset(s)),y()}async function rt(t){t.preventDefault();const e=new FormData(t.currentTarget),n=Number(t.currentTarget.dataset.index),s=a.channels.find(l=>l.Index===n),i=String(e.get("sourceName")||""),o=e.getAll("destinations").map(String),d=String(e.get("presetName")||"");if(!s){y();return}await g(`Update channel ${n}`,async()=>{const l=s.SourceName&&s.SourceName!=="Not Specified"?s.SourceName:"";i!==l&&(i?await a.client.setChannelSource(n,i):await a.client.unsetChannelSource(n));const u=new Set(s.Destinations||[]),c=new Set(o);for(const m of c)u.has(m)||await a.client.addChannelDestination(n,m);for(const m of u)c.has(m)||await a.client.deleteChannelDestination(n,m);d&&await Ce(o,d)}),y()}async function ct(t,e){const n={"rec-start":()=>a.client.startChannelRecording(t),"rec-pause":()=>a.client.pauseChannelRecording(t),"rec-stop":()=>a.client.stopChannelRecording(t),"rec-split":()=>a.client.splitChannelRecording(t)};await g(`Channel ${t} ${e}`,n[e]),L()}function D(t){p.modalRoot.innerHTML=`<div class="modal-backdrop">${t}</div>`,p.modalRoot.querySelectorAll("[data-close-dialog]").forEach(e=>{e.addEventListener("click",y)}),pe({icons:{Clock:Y,ExternalLink:X,Link:Q,Pause:Z,Play:ee,Plus:te,Radio:ne,RefreshCw:ae,RotateCcw:se,Save:ie,Scissors:oe,Settings:re,Square:ce,Unlink:de,Wifi:le,X:ue}})}function y(){p.modalRoot.innerHTML=""}function dt(){const t=xe(),e=new Blob([t],{type:"text/plain"}),n=URL.createObjectURL(e),s=document.createElement("a"),i=new Date().toISOString().replace(/[:.]/g,"-");s.href=n,s.download=`directtake-dashboard-log-${i}.txt`,s.click(),URL.revokeObjectURL(n),v("Log: saved"),f()}function lt(){const t=window.open("","_blank");if(!t){v("Log: popup blocked."),f();return}t.document.write(`
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
        <pre>${r(xe())}</pre>
      </body>
    </html>
  `),t.document.close(),v("Log: opened in new tab"),f()}function T(){var e,n,s;U(p.sources,a.sources,a.selectedSource,"source",i=>{a.selectedSource=i.Index,T()},Xe,"source"),U(p.destinations,a.destinations,a.selectedDestination,"destination",i=>{a.selectedDestination=i.Index,T()},Qe,"destination"),U(p.presets,a.presets,null,"preset",()=>{},Ze,"preset"),P(),p.resources.innerHTML=ye(a.resources),p.syncState.textContent=a.sync?`Recording: ${!!a.sync.IsSyncRecording} | Paused: ${!!a.sync.IsSyncRecordingPause}`:"No sync state loaded",p.syncSchedule.textContent=ut(a.schedule);const t=(e=a.settings)==null?void 0:e.SyncModeIndex;p.syncMode.value=t==null?"0":String(t),p.syncMode.disabled=!a.settings||!!((n=a.sync)!=null&&n.IsSyncRecording),p.schedule.classList.toggle("active",!!((s=a.schedule)!=null&&s.IsEnabled)),f()}function ut(t){if(!(t!=null&&t.IsEnabled))return"";const e=t.StartTime?`start ${t.StartTime}`:"",n=t.StopTime?`stop ${t.StopTime}`:"";return`Schedule: ${[e,n].filter(Boolean).join(", ")}, ${t.ScheduleType}`}function U(t,e,n,s,i=()=>{},o=null,d=null){t.innerHTML=e.length?e.map(l=>`
      <button class="row ${l.Index===n?"selected":""}" data-index="${l.Index}" ${d?'draggable="true"':""}>
        <span class="row-title">${r(l.Name)}</span>
        <span class="row-meta">${r(l.Device||l.Type||l.Config||s)}</span>
      </button>
    `).join(""):`<div class="empty">No ${s}s loaded</div>`,t.querySelectorAll(".row").forEach(l=>{let u=null;l.addEventListener("click",()=>{if(o){window.clearTimeout(u),u=window.setTimeout(()=>K(l,e,i),180);return}K(l,e,i)}),o&&l.addEventListener("dblclick",()=>{window.clearTimeout(u);const c=e.find(m=>m.Index===Number(l.dataset.index));c&&o(c)}),d&&l.addEventListener("dragstart",c=>{const m=e.find(b=>b.Index===Number(l.dataset.index));m&&(document.body.classList.add("dragging-dashboard-item"),c.dataTransfer.effectAllowed="copy",c.dataTransfer.dropEffect="copy",c.dataTransfer.setData("application/json",JSON.stringify({kind:d,index:m.Index,name:m.Name})),c.dataTransfer.setData("text/plain",`${d}: ${m.Name}`),c.dataTransfer.setDragImage(ht(d,m.Name),18,18))})})}function ye(t){const e=Nt(t);if(!e)return'<div class="empty">No resources loaded</div>';const n=e.totalRam>0?e.currentRam/e.totalRam*100:0,s=e.disks.length?e.disks.map(i=>k(i.key,`${q(i.percent)} used`,i.percent)).join(""):'<div class="resource-empty">No disks reported</div>';return`
    <div class="resource-summary">
      ${k("CPU",`${q(e.currentCpu)} current`,e.currentCpu)}
      ${k("RAM",`${F(e.currentRam)} / ${F(e.totalRam)} GB`,n)}
      ${k("Total CPU",`${q(e.totalCpu)}`,e.totalCpu)}
    </div>
    <div class="resource-disks">
      ${s}
    </div>
  `}function k(t,e,n){const s=C(Number(n),0,100);return`
    <div class="resource-card ${s>=85?"danger":s>=70?"warn":"ok"}">
      <div class="resource-card-header">
        <span>${r(t)}</span>
        <b>${r(e)}</b>
      </div>
      <div class="meter">
        <span style="width: ${s}%"></span>
      </div>
    </div>
  `}function K(t,e,n){const s=e.find(i=>i.Index===Number(t.dataset.index));s&&n(s)}function P(){p.channels.innerHTML=a.channels.length?a.channels.map(t=>`
      <button class="channel ${t.Index===a.selectedChannel?"selected":""}" data-index="${t.Index}">
        ${bt(t)}
        <span class="channel-index">CH ${t.Index}</span>
        <span class="channel-source">${r(t.SourceName||"Not Specified")}</span>
        <span class="channel-dests">${r((t.Destinations||[]).join(", ")||"No destinations")}</span>
        <span class="channel-presets">${r(pt(t))}</span>
        <span class="badges">
          ${t.IsRecording?'<b class="badge rec">REC</b>':'<b class="badge">IDLE</b>'}
          ${t.IsRecordingPause?'<b class="badge">PAUSED</b>':""}
          ${t.IsInSync?'<b class="badge sync">SYNC</b>':""}
        </span>
        <span class="channel-stats">${r(t.RecordingDuration||"00:00:00")} | ${r(t.RecordingFPS||"0.00")} fps | drops ${r(t.RecordingDrops||"0")}</span>
      </button>
    `).join(""):'<div class="empty">No channels loaded</div>',p.channels.querySelectorAll(".channel").forEach(t=>{let e=null;t.addEventListener("click",()=>{window.clearTimeout(e),e=window.setTimeout(()=>{a.selectedChannel=Number(t.dataset.index),T()},180)}),t.addEventListener("dblclick",()=>{window.clearTimeout(e),tt(Number(t.dataset.index))}),t.addEventListener("dragenter",n=>{n.preventDefault(),n.dataTransfer.dropEffect="copy",t.classList.add("drop-target")}),t.addEventListener("dragover",n=>{n.preventDefault(),n.dataTransfer.dropEffect="copy",t.classList.add("drop-target")}),t.addEventListener("dragleave",()=>{t.classList.remove("drop-target")}),t.addEventListener("drop",n=>{n.preventDefault(),t.classList.remove("drop-target");const s=gt(n);s&&ft(Number(t.dataset.index),s)})})}function pt(t){var n;const e=a.channelPresetNames.get(t.Index);return(n=t.Destinations)!=null&&n.length?e?e.length?e.join(", "):"No presets":"Presets loading":"No presets"}async function Se(){const t=new Map;await Promise.all(a.channels.map(async e=>{const n=[];for(const s of e.Destinations||[]){const i=a.destinations.find(o=>o.Name===s);if(i)try{const o=await a.client.getDestination(i.Index);o!=null&&o.PresetName&&!n.includes(o.PresetName)&&n.push(o.PresetName)}catch{n.includes("Preset unavailable")||n.push("Preset unavailable")}}t.set(e.Index,n)})),a.channelPresetNames=t,P()}function we(t){mt(t)&&(t.preventDefault(),t.dataTransfer.dropEffect="copy")}function mt(t){var e;return document.body.classList.contains("dragging-dashboard-item")||Array.from(((e=t.dataTransfer)==null?void 0:e.types)||[]).includes("application/json")}function gt(t){try{const e=t.dataTransfer.getData("application/json");return e?JSON.parse(e):null}catch{return null}}function ht(t,e){const n=document.createElement("div");return n.className="drag-ghost",n.textContent=`${t}: ${e}`,document.body.append(n),window.setTimeout(()=>n.remove(),0),n}function $e(){document.body.classList.remove("dragging-dashboard-item"),document.querySelectorAll(".drop-target").forEach(t=>{t.classList.remove("drop-target")})}async function ft(t,e){if(e.kind==="source"){await g(`Drop source on CH ${t}`,()=>a.client.setChannelSource(t,e.name));return}if(e.kind==="destination"){await g(`Drop destination on CH ${t}`,()=>a.client.addChannelDestination(t,e.name));return}e.kind==="preset"&&await vt(t,e.name)}async function vt(t,e){const n=a.channels.find(i=>i.Index===t),s=(n==null?void 0:n.Destinations)||[];if(!s.length){v(`Drop preset on CH ${t}: assign a destination first.`),f();return}await g(`Drop preset on CH ${t}`,async()=>{await Ce(s,e)})}async function Ce(t,e){for(const n of t){const s=a.destinations.find(o=>o.Name===n);if(!s)continue;const i=await a.client.getDestination(s.Index);await a.client.updateDestination(s.Index,E({...i,PresetName:e}))}}function bt(t){const e=t.SourceName||"",n=e&&e!=="Not Specified",s=a.channelPreviews.get(t.Index);return n?(s==null?void 0:s.status)==="ready"?`<span class="channel-preview"><img src="${r(s.src)}" alt="" /></span>`:(s==null?void 0:s.status)==="error"?'<span class="channel-preview empty-preview">No preview</span>':'<span class="channel-preview empty-preview">Loading</span>':'<span class="channel-preview empty-preview">No source</span>'}async function j({force:t=!1}={}){var i;const e=++a.previewRefreshId,n=new Set,s=[];for(const o of a.channels){const d=o.SourceName||"",l=d&&d!=="Not Specified",u=`${o.Index}:${d}`;if(!l){a.channelPreviews.delete(o.Index);continue}n.add(u),!(!t&&((i=a.channelPreviews.get(o.Index))==null?void 0:i.key)===u)&&(a.channelPreviews.set(o.Index,{key:u,status:"loading"}),s.push($t(o.Index,u,e)))}for(const[o,d]of a.channelPreviews)n.has(d.key)||a.channelPreviews.delete(o);s.length&&(P(),await Promise.allSettled(s),L())}function H(){a.previewTimerId&&(window.clearInterval(a.previewTimerId),a.previewTimerId=null),!(!a.previewUpdateSeconds||!wt())&&(a.previewTimerId=window.setInterval(()=>{j({force:!0})},a.previewUpdateSeconds*1e3))}function De(){a.resourceTimerId&&(window.clearInterval(a.resourceTimerId),a.resourceTimerId=null),a.resourceUpdateSeconds&&(a.resourceTimerId=window.setInterval(St,a.resourceUpdateSeconds*1e3))}function Ne(){a.channelStatsTimerId&&(window.clearInterval(a.channelStatsTimerId),a.channelStatsTimerId=null),a.channelStatsUpdateSeconds&&(a.channelStatsTimerId=window.setInterval(yt,a.channelStatsUpdateSeconds*1e3))}async function yt(){var t;try{const e=await a.client.getChannels();a.channels=$(e),a.channels.some(n=>n.Index===a.selectedChannel)||(a.selectedChannel=((t=a.channels[0])==null?void 0:t.Index)??null),P(),Se(),j(),L(),H()}catch(e){v(`Channel stats update: ${e.message}`),f()}}async function St(){try{a.resources=await a.client.getResources(),p.resources.innerHTML=ye(a.resources)}catch(t){v(`Resources update: ${t.message}`),f()}}function wt(){return a.channels.some(t=>{const e=t.SourceName||"";return e&&e!=="Not Specified"})}async function $t(t,e,n){try{const s=await Ct(i=>a.client.getChannelPreview(t,{signal:i}),6e3);if(n!==a.previewRefreshId)return;a.channelPreviews.set(t,{key:e,status:"ready",src:Dt(s)})}catch{n===a.previewRefreshId&&a.channelPreviews.set(t,{key:e,status:"error"})}P(),L()}function Ct(t,e){const n=new AbortController,s=window.setTimeout(()=>n.abort(),e);return t(n.signal).finally(()=>{window.clearTimeout(s)})}function Dt(t){const e=String(t||"").trim();return e.startsWith("data:")?e:`data:image/png;base64,${e}`}function $(t){return Array.isArray(t)?t:Array.isArray(t==null?void 0:t.value)?t.value:[]}function W(t,e){return Array.isArray(t)?t:Array.isArray(t==null?void 0:t[e])?t[e]:Array.isArray(t==null?void 0:t.value)?t.value:[]}function E(t){return Object.fromEntries(Object.entries(t).filter(([,e])=>e!=null&&e!==""))}function _(t,e){if(!e)return 0;const n=t.findIndex(s=>s.Type===e.Type&&s.Index===e.Index&&s.Name===e.Name);return n>=0?n:0}function Nt(t){const e=Array.isArray(t==null?void 0:t.value)?t.value:t;if(!Array.isArray(e))return null;const n={};for(let s=0;s<e.length;s+=2)n[e[s]]=e[s+1];return{currentCpu:Number(n.CurrentCPU)||0,totalCpu:Number(n.TotalCPU)||0,currentRam:Number(n.CurrentRAM)||0,totalRam:Number(n.TotalRAM)||0,disks:$(n.DiskInfo).map(s=>({key:s.Key,percent:100-xt(s.Value)})).filter(s=>s.key)}}function xt(t){return Number(String(t??"").replace("%",""))||0}function q(t){return`${F(t)}%`}function F(t){return Number(t||0).toFixed(1)}function M(t){return t?`every ${t}s`:"off"}function C(t,e,n){return Number.isFinite(t)?Math.min(Math.max(Math.round(t),e),n):e}function f(){p.log.textContent=a.log.join(`
`)}function xe(){return a.log.join(`
`)||"No log entries."}function v(t){a.log=[`${new Date().toLocaleTimeString()} ${t}`,...a.log].slice(0,80)}function w(){if(a.selectedChannel===null)throw new Error("Select a channel first.");return a.selectedChannel}function Tt(){const t=a.sources.find(e=>e.Index===a.selectedSource);if(!t)throw new Error("Select a source first.");return t}function Te(){const t=a.destinations.find(e=>e.Index===a.selectedDestination);if(!t)throw new Error("Select a destination first.");return t}function r(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function Pt(){return Pe(localStorage.getItem("dt.baseUrl")||"/dt-api/")}function It(){return C(Number(localStorage.getItem("dt.previewUpdateSeconds")??30),0,3600)}function kt(){return C(Number(localStorage.getItem("dt.resourceUpdateSeconds")??15),0,3600)}function Lt(){return C(Number(localStorage.getItem("dt.channelStatsUpdateSeconds")??3),0,3600)}function Pe(t){const e=String(t||"").trim();return Et(e)?"/dt-api/":e||"/dt-api/"}function Et(t){try{return new URL(t).port==="9531"}catch{return!1}}
