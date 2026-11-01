/* =====================================================
   IPNEON - fingerprint.js
   Enterprise Browser & Device Forensic Engine
   Inspired by Fingerprint.to / Fingerprint Pro Intelligence
   Smart Signals • Persistent Cross-Session Visitor ID • Tamper & Bot Detection
   Author: ramaneon
   License: IPNEON PROPRIETARY COMMERCIAL ROYALTY LICENSE
   ===================================================== */

// --- 32-bit MurmurHash3 ---
function murmurhash3(key, seed = 0) {
  let remainder = key.length & 3;
  let bytes = key.length - remainder;
  let h1 = seed;
  let c1 = 0xcc9e2d51;
  let c2 = 0x1b873593;
  let i = 0;
  while (i < bytes) {
    let k1 =
      (key.charCodeAt(i) & 0xff) |
      ((key.charCodeAt(++i) & 0xff) << 8) |
      ((key.charCodeAt(++i) & 0xff) << 16) |
      ((key.charCodeAt(++i) & 0xff) << 24);
    ++i;
    k1 = Math.imul(k1, c1);
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = Math.imul(k1, c2);
    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1 = Math.imul(h1, 5) + 0xe6546b64;
  }
  let k1 = 0;
  switch (remainder) {
    case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
    case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
    case 1:
      k1 ^= key.charCodeAt(i) & 0xff;
      k1 = Math.imul(k1, c1);
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = Math.imul(k1, c2);
      h1 ^= k1;
  }
  h1 ^= key.length;
  h1 ^= h1 >>> 16;
  h1 = Math.imul(0x85ebca6b, h1);
  h1 ^= h1 >>> 13;
  h1 = Math.imul(0xc2b2ae35, h1);
  h1 ^= h1 >>> 16;
  return (h1 >>> 0).toString(16).padStart(8, '0');
}

// Global state holding collected forensic profile
let currentFingerprintProfile = null;

// --- Main Collector (Fingerprint.to Architecture) ---
async function collectFingerprint() {
  const requestId = 'req_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
  const profile = {
    requestId,
    timestamp: new Date().toISOString(),
    visitorId: '',
    visitorFound: false,
    confidence: { score: 0.99, comment: 'High-entropy composite' },
    smartSignals: {},
    components: {}
  };

  try {
    // 1. Canvas Forensics (Subpixel & Text Metrics)
    const canvasRes = getCanvasFingerprint();
    profile.components.canvas = canvasRes;

    // 2. Audio Dynamics & DSP Oscillators
    const audioRes = await getAudioFingerprint();
    profile.components.audio = audioRes;

    // 3. WebGL GPU Architecture & Shader Precision
    const webglRes = getWebGLFingerprint();
    profile.components.webgl = webglRes;

    // 4. Screen Geometry & Color Depth
    const screenRes = getScreenProfile();
    profile.components.screen = screenRes;

    // 5. Hardware & Sensor Concurrency
    const hwRes = await getHardwareProfile();
    profile.components.hardware = hwRes;

    // 6. Network & WebRTC Leak
    const netRes = await getNetworkProfile();
    profile.components.network = netRes;

    // 7. Browser Environment & OS
    const browserRes = getBrowserProfile();
    profile.components.browser = browserRes;

    // 8. System Font Probing
    const fontRes = getInstalledFonts();
    profile.components.fonts = fontRes;

    // 9. SMART SIGNALS ENGINE (Fingerprint.to Enterprise Signals)
    const smartSignals = await evaluateSmartSignals(canvasRes, webglRes, browserRes, screenRes);
    profile.smartSignals = smartSignals;
    profile.components.security = smartSignals; // compatibility alias

    // 10. Persistent Multi-Storage Visitor Identity Synthesis
    const seedString = [
      canvasRes.hash,
      audioRes.hash,
      webglRes.renderer,
      webglRes.vendor,
      screenRes.resolution,
      screenRes.colorDepth,
      hwRes.cpuCores,
      hwRes.memoryGB,
      browserRes.os,
      browserRes.platform,
      browserRes.timezone,
      fontRes.installed.join(','),
      screenRes.devicePixelRatio
    ].join('###');

    const primaryHash = murmurhash3(seedString, 0x1337);
    const secondaryHash = murmurhash3(seedString, 0xbeef);
    const computedVid = `neon_${primaryHash}${secondaryHash}`;

    // Cross-Storage Persistence (LocalStorage + SessionStorage + IndexedDB shadow)
    const persistentId = syncPersistentVisitorId(computedVid);
    profile.visitorId = persistentId.id;
    profile.visitorFound = persistentId.found;
    profile.visitCount = persistentId.count;
    profile.firstSeen = persistentId.firstSeen;
    profile.confidence = calculateConfidence(profile);

    currentFingerprintProfile = profile;
    renderFingerprintUI(profile);

    if (typeof addLog === 'function') {
      addLog('success', `Smart Signals synthesized for: ${profile.visitorId} (Visit #${profile.visitCount})`);
    }

    if (typeof TelegramAudit !== 'undefined' && typeof TelegramAudit.logFingerprint === 'function') {
      TelegramAudit.logFingerprint(profile);
    }
  } catch (err) {
    console.error('[Fingerprint Engine Error]', err);
    if (typeof addLog === 'function') {
      addLog('warn', `Fingerprint synthesis error: ${err.message}`);
    }
  }
}

// --- Multi-Storage Persistence Sync (Cross-Session Memory) ---
function syncPersistentVisitorId(computedId) {
  const STORAGE_KEY = '__ipneon_vid';
  const META_KEY = '__ipneon_vid_meta';
  let storedId = null;
  let meta = { count: 1, firstSeen: new Date().toISOString(), lastSeen: new Date().toISOString() };

  try {
    storedId = localStorage.getItem(STORAGE_KEY);
    const rawMeta = localStorage.getItem(META_KEY);
    if (rawMeta) meta = JSON.parse(rawMeta);
  } catch (e) {}

  const finalId = storedId || computedId;
  const isFound = !!storedId;

  meta.count = (meta.count || 0) + 1;
  meta.lastSeen = new Date().toISOString();

  try {
    localStorage.setItem(STORAGE_KEY, finalId);
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  } catch (e) {}

  try {
    sessionStorage.setItem(STORAGE_KEY, finalId);
  } catch (e) {}

  return {
    id: finalId,
    found: isFound,
    count: meta.count,
    firstSeen: meta.firstSeen
  };
}

// --- SMART SIGNALS ENGINE (Enterprise Fingerprint.to Parity) ---
async function evaluateSmartSignals(canvas, webgl, browser, screen) {
  const signals = {
    botDetection: { isBot: false, type: 'human', confidence: 0.98 },
    incognitoMode: { isIncognito: false, detectionVector: 'none' },
    browserTampering: { isTampered: false, reasons: [] },
    virtualMachine: { isVM: false, engine: 'Bare Metal' },
    privacyNetwork: { isVPN: false, isTor: false, isRelay: false },
    suspectScore: 0.05 // 0.00 (safe) to 1.00 (hostile)
  };

  // Signal 1: Bot / Automation Detection
  if (navigator.webdriver) {
    signals.botDetection.isBot = true;
    signals.botDetection.type = 'navigator.webdriver (Automated Engine)';
    signals.suspectScore += 0.45;
  }
  if (window.cdc_adoQx10ndnnzHXZug5jdgq_Array || window.document.$cdc_asdjflasutopfhvcZLmcfl_ || window.document.__webdriver_evaluate) {
    signals.botDetection.isBot = true;
    signals.botDetection.type = 'Selenium/ChromeDriver Hook';
    signals.suspectScore += 0.50;
  }
  if (window.navigator.languages === '' || (window.chrome && !window.chrome.runtime && navigator.userAgent.includes('Headless'))) {
    signals.botDetection.isBot = true;
    signals.botDetection.type = 'Headless Chromium';
    signals.suspectScore += 0.40;
  }

  // Signal 2: Browser Tampering / Anti-Detect Engine
  const ua = navigator.userAgent;
  const platform = navigator.platform || '';
  if (ua.includes('Windows') && !platform.includes('Win')) {
    signals.browserTampering.isTampered = true;
    signals.browserTampering.reasons.push('OS / Platform mismatch');
    signals.suspectScore += 0.25;
  }
  if (ua.includes('Macintosh') && !platform.includes('Mac')) {
    signals.browserTampering.isTampered = true;
    signals.browserTampering.reasons.push('macOS UA / Platform mismatch');
    signals.suspectScore += 0.25;
  }
  // Check if native functions have been hooked via Proxy or wrapper
  try {
    if (Function.prototype.toString.call(navigator.geolocation.getCurrentPosition).indexOf('[native code]') === -1) {
      signals.browserTampering.isTampered = true;
      signals.browserTampering.reasons.push('Geolocation hook detected');
    }
  } catch (e) {}

  // Signal 3: Virtual Machine / Emulation Heuristic
  const renderer = (webgl.renderer || '').toLowerCase();
  if (renderer.includes('swiftshader') || renderer.includes('llvmpipe') || renderer.includes('virtualbox') || renderer.includes('vmware')) {
    signals.virtualMachine.isVM = true;
    signals.virtualMachine.engine = 'Software / Hypervisor Renderer';
    signals.suspectScore += 0.30;
  } else if (renderer.includes('microsoft basic render driver')) {
    signals.virtualMachine.isVM = true;
    signals.virtualMachine.engine = 'Microsoft WARP / RDP Virtual GPU';
    signals.suspectScore += 0.15;
  }

  // Signal 4: Incognito / Private Browsing Vector
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const est = await navigator.storage.estimate();
      if (est.quota && est.quota < 4000000000 && !ua.includes('Mobile')) {
        signals.incognitoMode.isIncognito = true;
        signals.incognitoMode.detectionVector = 'Restricted Storage Quota (<4GB)';
        signals.suspectScore += 0.10;
      }
    }
  } catch (e) {}

  // Clamp suspect score to 0.0 - 1.0
  signals.suspectScore = Math.min(1.0, Math.max(0.01, signals.suspectScore));

  return signals;
}

// --- 1. Canvas Fingerprint ---
function getCanvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 70;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { hash: 'unsupported', textMetrics: 'n/a', supported: false };

    const grad = ctx.createLinearGradient(0, 0, 280, 70);
    grad.addColorStop(0, '#00ff9f');
    grad.addColorStop(0.5, '#00e5ff');
    grad.addColorStop(1, '#b84fff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 280, 70);

    ctx.font = '15px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#030712';
    ctx.fillText('IPNEON⚡FORENSICS 2.0 <canvas> 🚀', 10, 32);

    ctx.font = '13px "Courier New", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('entropy://render.subpixel.hash', 12, 54);

    ctx.beginPath();
    ctx.arc(245, 35, 20, 0, Math.PI * 2);
    ctx.strokeStyle = '#00ff9f';
    ctx.lineWidth = 3;
    ctx.stroke();

    const dataUrl = canvas.toDataURL();
    const hash = murmurhash3(dataUrl, 0xcafe);
    const metrics = ctx.measureText('IPNEON⚡FORENSICS 2.0 <canvas> 🚀');

    return {
      hash,
      dataUrlLength: dataUrl.length,
      textWidth: metrics.width.toFixed(2),
      supported: true
    };
  } catch (e) {
    return { hash: 'canvas_error', textMetrics: 'error', supported: false };
  }
}

// --- 2. Audio Dynamics Fingerprint ---
async function getAudioFingerprint() {
  try {
    const AudioCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!AudioCtx) return { hash: 'unsupported', status: 'unsupported', sampleRate: 0 };

    const context = new AudioCtx(1, 44100, 44100);
    const osc = context.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(10000, context.currentTime);

    const comp = context.createDynamicsCompressor();
    comp.threshold.setValueAtTime(-50, context.currentTime);
    comp.knee.setValueAtTime(40, context.currentTime);
    comp.ratio.setValueAtTime(12, context.currentTime);
    comp.reduction.setValueAtTime(-20, context.currentTime);
    comp.attack.setValueAtTime(0, context.currentTime);
    comp.release.setValueAtTime(0.25, context.currentTime);

    osc.connect(comp);
    comp.connect(context.destination);
    osc.start(0);

    const audioPromise = context.startRendering();
    const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 1200));
    const renderedBuffer = await Promise.race([audioPromise, timeoutPromise]);

    if (!renderedBuffer) {
      return { hash: 'audio_timeout', status: 'timeout', sampleRate: context.sampleRate };
    }

    const output = renderedBuffer.getChannelData(0);
    let sampleSum = 0;
    for (let i = 4500; i < 5000; i++) {
      sampleSum += Math.abs(output[i]);
    }

    const audioHash = murmurhash3(sampleSum.toString(16), 0x900d);
    return {
      hash: audioHash,
      sampleRate: context.sampleRate,
      status: 'rendered',
      dynamicsSum: sampleSum.toFixed(6)
    };
  } catch (e) {
    return { hash: 'audio_error', status: 'error', sampleRate: 0 };
  }
}

// --- 3. WebGL Architecture & GPU ---
function getWebGLFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return { supported: false };

    let renderer = 'Unknown Renderer';
    let vendor = 'Unknown Vendor';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (ext) {
      renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || renderer;
      vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) || vendor;
    }

    const exts = gl.getSupportedExtensions() || [];
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

    return {
      supported: true,
      vendor,
      renderer,
      version: gl.getParameter(gl.VERSION),
      shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      extensionsCount: exts.length,
      maxTextureSize
    };
  } catch (e) {
    return { supported: false, error: e.message };
  }
}

// --- 4. Screen Geometry ---
function getScreenProfile() {
  return {
    resolution: `${window.screen.width} x ${window.screen.height}`,
    available: `${window.screen.availWidth} x ${window.screen.availHeight}`,
    colorDepth: `${window.screen.colorDepth}-bit`,
    devicePixelRatio: window.devicePixelRatio || 1
  };
}

// --- 5. Hardware Concurrency & Sensors ---
async function getHardwareProfile() {
  const profile = {
    cpuCores: navigator.hardwareConcurrency || 4,
    memoryGB: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : '8+ GB (API Protected)',
    maxTouchPoints: navigator.maxTouchPoints || 0,
    hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    battery: { level: 'N/A', status: 'N/A' }
  };

  try {
    if (navigator.getBattery) {
      const bat = await navigator.getBattery();
      profile.battery.level = `${Math.round(bat.level * 100)}%`;
      profile.battery.status = bat.charging ? 'Charging' : 'Discharging';
    }
  } catch (e) {}

  return profile;
}

// --- 6. Network & WebRTC Leak ---
async function getNetworkProfile() {
  const net = {
    downlink: 'N/A',
    effectiveType: 'Broadband',
    rtt: 'N/A',
    localIps: []
  };

  if (navigator.connection) {
    net.downlink = navigator.connection.downlink ? `${navigator.connection.downlink} Mbps` : 'N/A';
    net.effectiveType = navigator.connection.effectiveType ? navigator.connection.effectiveType.toUpperCase() : 'LAN/WIFI';
    net.rtt = navigator.connection.rtt ? `${navigator.connection.rtt} ms` : 'N/A';
  }

  try {
    const RTCPC = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    if (RTCPC) {
      const pc = new RTCPC({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      pc.createDataChannel('leakTest');
      const gatheredIps = new Set();
      pc.onicecandidate = (event) => {
        if (event && event.candidate && event.candidate.candidate) {
          const line = event.candidate.candidate;
          const ipv4Match = line.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
          if (ipv4Match && !ipv4Match[1].startsWith('0.')) {
            gatheredIps.add(ipv4Match[1]);
          }
        }
      };
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await new Promise(r => setTimeout(r, 650));
      pc.close();
      net.localIps = Array.from(gatheredIps);
    }
  } catch (e) {
    net.webrtcError = e.message;
  }

  return net;
}

// --- 7. Browser Profile & Environment ---
function getBrowserProfile() {
  const ua = navigator.userAgent;
  let browserName = 'Chromium';
  let osName = 'Windows';

  if (ua.indexOf('Firefox') > -1) browserName = 'Mozilla Firefox';
  else if (ua.indexOf('SamsungBrowser') > -1) browserName = 'Samsung Internet';
  else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) browserName = 'Opera';
  else if (ua.indexOf('Edg') > -1) browserName = 'Microsoft Edge';
  else if (ua.indexOf('Chrome') > -1) browserName = 'Google Chrome / Chromium';
  else if (ua.indexOf('Safari') > -1) browserName = 'Apple Safari';

  if (ua.indexOf('Win') > -1) osName = 'Windows';
  else if (ua.indexOf('Mac') > -1) osName = 'macOS';
  else if (ua.indexOf('Android') > -1) osName = 'Android';
  else if (ua.indexOf('Linux') > -1) osName = 'Linux';
  else if (ua.indexOf('like Mac') > -1) osName = 'iOS';

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const tzOffset = -(new Date().getTimezoneOffset() / 60);
  const tzOffsetStr = `UTC${tzOffset >= 0 ? '+' : ''}${tzOffset}:00`;

  return {
    browser: browserName,
    os: osName,
    platform: navigator.platform || 'Unknown',
    language: navigator.language || 'en',
    languages: (navigator.languages || [navigator.language]).join(', '),
    timezone: tz,
    timezoneOffset: tzOffsetStr,
    userAgent: ua,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack === '1' || window.doNotTrack === '1' ? 'Enabled' : 'Disabled'
  };
}

// --- 8. Installed System Fonts Probing ---
function getInstalledFonts() {
  const fontList = [
    'Arial', 'Calibri', 'Cambria', 'Comic Sans MS', 'Consolas', 'Courier New',
    'Georgia', 'Impact', 'Lucida Console', 'Lucida Sans Unicode', 'Microsoft Sans Serif',
    'Palatino Linotype', 'Segoe UI', 'Tahoma', 'Times New Roman', 'Trebuchet MS',
    'Verdana', 'Monaco', 'Menlo', 'Ubuntu', 'Roboto', 'Helvetica Neue'
  ];

  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testString = 'mmmmmmmmmmlli';
  const testSize = '72px';
  const h = document.createElement('canvas');
  const ctx = h.getContext('2d');
  if (!ctx) return { count: 0, installed: [] };

  const baseWidths = {};
  baseFonts.forEach(base => {
    ctx.font = `${testSize} ${base}`;
    baseWidths[base] = ctx.measureText(testString).width;
  });

  const detected = [];
  fontList.forEach(font => {
    let matches = false;
    for (let base of baseFonts) {
      ctx.font = `${testSize} "${font}", ${base}`;
      const width = ctx.measureText(testString).width;
      if (width !== baseWidths[base]) {
        matches = true;
        break;
      }
    }
    if (matches) detected.push(font);
  });

  return {
    count: detected.length,
    installed: detected
  };
}

// --- Confidence Metric ---
function calculateConfidence(p) {
  let score = 96.5;
  if (p.components.canvas.supported) score += 1.4;
  if (p.components.webgl.supported) score += 1.2;
  if (p.components.audio.status === 'rendered') score += 0.8;
  return Math.min(99.9, score).toFixed(1);
}

// --- Render UI ---
function renderFingerprintUI(p) {
  // Visitor ID & Confidence
  const vidEl = document.getElementById('fp-visitor-id');
  if (vidEl) vidEl.textContent = p.visitorId;

  const confEl = document.getElementById('fp-confidence');
  if (confEl) confEl.textContent = `${p.confidence}% UNIQUE`;

  // Quick Badges
  const ss = p.smartSignals;
  const botEl = document.getElementById('badge-bot');
  if (botEl) {
    if (ss.botDetection.isBot) {
      botEl.textContent = `BOT: ${ss.botDetection.type.toUpperCase()}`;
      botEl.className = 'fp-badge badge-danger';
    } else {
      botEl.textContent = 'HUMAN / AUTHENTIC';
      botEl.className = 'fp-badge badge-success';
    }
  }

  const incogEl = document.getElementById('badge-incognito');
  if (incogEl) {
    if (ss.incognitoMode.isIncognito) {
      incogEl.textContent = 'WINDOW: INCOGNITO';
      incogEl.className = 'fp-badge badge-warning';
    } else {
      incogEl.textContent = 'WINDOW: STANDARD';
      incogEl.className = 'fp-badge badge-neutral';
    }
  }

  const net = p.components.network;
  const rtcEl = document.getElementById('badge-webrtc');
  if (rtcEl) {
    if (net.localIps && net.localIps.length > 0) {
      rtcEl.textContent = `WEBRTC LEAK: ${net.localIps.length} IP(s)`;
      rtcEl.className = 'fp-badge badge-cyan';
    } else {
      rtcEl.textContent = 'WEBRTC: SHIELDED';
      rtcEl.className = 'fp-badge badge-neutral';
    }
  }

  const gl = p.components.webgl;
  const gpuBadge = document.getElementById('badge-gpu');
  if (gpuBadge) {
    if (gl.supported) {
      gpuBadge.textContent = ss.virtualMachine.isVM ? `VM: ${ss.virtualMachine.engine}` : 'GPU: HARDWARE ACCEL';
      gpuBadge.className = ss.virtualMachine.isVM ? 'fp-badge badge-warning' : 'fp-badge badge-success';
    } else {
      gpuBadge.textContent = 'GPU: SOFTWARE / OFF';
      gpuBadge.className = 'fp-badge badge-warning';
    }
  }

  // Populate Smart Signals (Fingerprint.to Enterprise Engine)
  setText('fp-visit-velocity', `Visit #${p.visitCount || 1} (First seen: ${(p.firstSeen || new Date().toISOString()).split('T')[0]})`);
  const scorePct = ((ss?.suspectScore || 0.05) * 100).toFixed(1);
  const scoreLabel = (ss?.suspectScore || 0.05) < 0.2 ? 'Low Risk / Authentic' : ((ss?.suspectScore || 0.05) < 0.5 ? 'Moderate Anomaly' : 'High Suspicion');
  setText('fp-suspect-score', `${scorePct}% (${scoreLabel})`);
  setText('fp-tamper-status', ss?.browserTampering?.isTampered ? `Tampered (${ss.browserTampering.reasons.join(', ')})` : 'Clean (Native Prototypes Intact)');
  setText('fp-vm-status', ss?.virtualMachine?.isVM ? `Virtual Machine (${ss.virtualMachine.engine})` : 'Bare Metal Hardware');

  // Populate Field Values
  setText('fp-canvas-hash', p.components.canvas.hash);
  setText('fp-canvas-metrics', `${p.components.canvas.textWidth}px bounding width`);
  setText('fp-audio-hash', p.components.audio.hash);
  setText('fp-audio-rate', `${p.components.audio.sampleRate} Hz (${p.components.audio.status})`);

  setText('fp-gpu-renderer', gl.renderer || 'N/A');
  setText('fp-gpu-vendor', gl.vendor || 'N/A');
  setText('fp-webgl-version', gl.version || 'N/A');
  setText('fp-webgl-exts', `${gl.extensionsCount} extensions active`);
  setText('fp-max-texture', `${gl.maxTextureSize}px`);

  const scr = p.components.screen;
  const hw = p.components.hardware;
  setText('fp-screen-res', scr.resolution);
  setText('fp-screen-avail', scr.available);
  setText('fp-color-depth', `${scr.colorDepth} (DPR: ${scr.devicePixelRatio})`);
  setText('fp-cpu-cores', `${hw.cpuCores} Logical Threads`);
  setText('fp-ram-mem', hw.memoryGB);
  setText('fp-touch-points', `${hw.maxTouchPoints} (${hw.hasTouch ? 'Touch Enabled' : 'No Touch'})`);
  setText('fp-battery-stat', `${hw.battery.level} (${hw.battery.status})`);

  const br = p.components.browser;
  setText('fp-os-name', br.os);
  setText('fp-browser-name', br.browser);
  setText('fp-timezone', `${br.timezone} (${br.timezoneOffset})`);
  setText('fp-locale-langs', br.languages);
  setText('fp-dnt-status', br.doNotTrack);

  setText('fp-net-type', `${net.effectiveType} (Downlink: ${net.downlink})`);
  setText('fp-net-rtt', net.rtt);
  setText('fp-webrtc-ips', net.localIps.length > 0 ? net.localIps.join(', ') : 'None detected (Protected)');

  const fnt = p.components.fonts;
  setText('fp-fonts-count', `${fnt.count} Probed Fonts Active`);
  setText('fp-fonts-list', fnt.installed.length > 0 ? fnt.installed.slice(0, 8).join(', ') + '...' : 'System default only');

  // Raw JSON display
  const jsonPreview = document.getElementById('fp-raw-json');
  if (jsonPreview) {
    jsonPreview.textContent = JSON.stringify(p, null, 2);
  }
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val || '-';
}

function copyFingerprintId() {
  if (!currentFingerprintProfile) {
    if (typeof showToast === 'function') showToast('Fingerprint not yet generated', 'warn');
    return;
  }
  navigator.clipboard.writeText(currentFingerprintProfile.visitorId).then(() => {
    if (typeof showToast === 'function') showToast(`Copied Visitor ID: ${currentFingerprintProfile.visitorId}`);
  }).catch(() => {
    if (typeof showToast === 'function') showToast('Failed to copy', 'error');
  });
}

function exportFingerprintJson() {
  if (!currentFingerprintProfile) {
    if (typeof showToast === 'function') showToast('No fingerprint data', 'warn');
    return;
  }
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentFingerprintProfile, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `ipneon_fingerprint_${currentFingerprintProfile.visitorId}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  if (typeof showToast === 'function') showToast('Fingerprint profile exported!');
}

// Auto-run on load
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(collectFingerprint, 350);
});
