/* =====================================================
   IPNEON - fingerprint.js
   Advanced Browser & Device Fingerprinting Engine
   Inspired by fingerprint.to & FingerprintJS
   Author: ramaneon
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
  h1 = Math.imul(h1, 0x85ebca6b);
  h1 ^= h1 >>> 13;
  h1 = Math.imul(h1, 0xc2b2ae35);
  h1 ^= h1 >>> 16;
  return (h1 >>> 0).toString(16).padStart(8, '0');
}

// Global state holding collected fingerprint profile
let currentFingerprintProfile = null;

// --- Main Collector ---
async function collectFingerprint() {
  const profile = {
    timestamp: new Date().toISOString(),
    components: {}
  };

  try {
    // 1. Canvas Fingerprint
    const canvasRes = getCanvasFingerprint();
    profile.components.canvas = canvasRes;

    // 2. Audio Fingerprint
    const audioRes = await getAudioFingerprint();
    profile.components.audio = audioRes;

    // 3. WebGL & GPU
    const webglRes = getWebGLFingerprint();
    profile.components.webgl = webglRes;

    // 4. Screen & Window Geometry
    const screenRes = getScreenProfile();
    profile.components.screen = screenRes;

    // 5. Hardware & Device Concurrency
    const hwRes = await getHardwareProfile();
    profile.components.hardware = hwRes;

    // 6. Network & WebRTC Leak
    const netRes = await getNetworkProfile();
    profile.components.network = netRes;

    // 7. Browser Environment & OS
    const browserRes = getBrowserProfile();
    profile.components.browser = browserRes;

    // 8. Bot & Privacy Heuristics
    const botRes = await getSecurityHeuristics();
    profile.components.security = botRes;

    // 9. Font Probing
    const fontRes = getInstalledFonts();
    profile.components.fonts = fontRes;

    // Synthesize Unique Visitor ID
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
    profile.visitorId = `neon_${primaryHash}${secondaryHash}`;
    profile.confidence = calculateConfidence(profile);

    currentFingerprintProfile = profile;
    renderFingerprintUI(profile);
    
    if (typeof addLog === 'function') {
      addLog('success', `Device Fingerprint generated: ${profile.visitorId}`);
    }
  } catch (err) {
    console.error('Fingerprint generation error:', err);
    if (typeof addLog === 'function') {
      addLog('warn', `Fingerprint collection error: ${err.message}`);
    }
  }
}

// --- 1. Canvas Fingerprint ---
function getCanvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 70;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { hash: 'unsupported', textMetrics: 'n/a' };

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 280, 70);
    grad.addColorStop(0, '#00ff9f');
    grad.addColorStop(0.5, '#00e5ff');
    grad.addColorStop(1, '#b84fff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 280, 70);

    // Overlay shapes & alpha blend
    ctx.fillStyle = 'rgba(2, 4, 9, 0.75)';
    ctx.beginPath();
    ctx.arc(40, 35, 25, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    // Geometric text with shadows
    ctx.textBaseline = 'top';
    ctx.font = '16px "Share Tech Mono", "Arial", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ff4ecd';
    ctx.shadowBlur = 4;
    ctx.fillText('IPNEON // FINGERPRINT <canvas>', 55, 14);

    // Unicode & Emoji glyphs for distinct font/emoji rendering engine differences
    ctx.font = '14px sans-serif';
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffea00';
    ctx.fillText('⚡ 🛡️ 👁️ C78!~`@#$', 55, 38);

    const dataUrl = canvas.toDataURL();
    const hash = murmurhash3(dataUrl);

    // Draw to live preview canvas if present
    const previewCanvas = document.getElementById('fp-canvas-preview');
    if (previewCanvas) {
      previewCanvas.width = 280;
      previewCanvas.height = 70;
      const pCtx = previewCanvas.getContext('2d');
      if (pCtx) {
        pCtx.drawImage(canvas, 0, 0);
      }
    }

    const metrics = ctx.measureText('IPNEON // FINGERPRINT <canvas>');
    const textWidth = Math.round(metrics.width * 100) / 100;

    return {
      hash: hash,
      dataUrlLength: dataUrl.length,
      textWidth: textWidth,
      supported: true
    };
  } catch (e) {
    return { hash: 'error_' + e.message, supported: false };
  }
}

// --- 2. Audio Fingerprint ---
function getAudioFingerprint() {
  return new Promise((resolve) => {
    try {
      const AudioCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!AudioCtx) {
        resolve({ hash: 'unsupported', sampleRate: 'n/a', status: 'unsupported' });
        return;
      }

      const context = new AudioCtx(1, 44100, 44100);
      const oscillator = context.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(10000, context.currentTime);

      const compressor = context.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-50, context.currentTime);
      compressor.knee.setValueAtTime(40, context.currentTime);
      compressor.ratio.setValueAtTime(12, context.currentTime);
      compressor.reduction.setValueAtTime(-20, context.currentTime);
      compressor.attack.setValueAtTime(0, context.currentTime);
      compressor.release.setValueAtTime(0.25, context.currentTime);

      oscillator.connect(compressor);
      compressor.connect(context.destination);
      oscillator.start(0);

      const timeout = setTimeout(() => {
        resolve({ hash: 'timeout', sampleRate: context.sampleRate || 44100, status: 'timeout' });
      }, 1000);

      context.oncomplete = (event) => {
        clearTimeout(timeout);
        try {
          const samples = event.renderedBuffer.getChannelData(0);
          let sum = 0;
          for (let i = 4500; i < 5000; i++) {
            sum += Math.abs(samples[i] || 0);
          }
          const audioHash = murmurhash3(sum.toString());
          resolve({
            hash: audioHash,
            sampleRate: context.sampleRate,
            maxChannels: context.destination.maxChannelCount || 2,
            status: 'rendered'
          });
        } catch (err) {
          resolve({ hash: 'eval_error', sampleRate: 44100, status: 'error' });
        }
      };

      context.startRendering().catch(() => {
        resolve({ hash: 'failed_rendering', status: 'failed' });
      });
    } catch (e) {
      resolve({ hash: 'audio_error', status: 'error' });
    }
  });
}

// --- 3. WebGL & GPU ---
function getWebGLFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      return {
        supported: false,
        vendor: 'Not Supported',
        renderer: 'Not Supported',
        version: 'None',
        extensionsCount: 0
      };
    }

    let vendor = gl.getParameter(gl.VENDOR) || 'Unknown';
    let renderer = gl.getParameter(gl.RENDERER) || 'Unknown';

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || vendor;
      renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || renderer;
    }

    const version = gl.getParameter(gl.VERSION) || 'WebGL 1.0';
    const shadingLanguage = gl.getParameter(gl.SHADING_LANGUAGE_VERSION) || 'Unknown';
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;
    const maxViewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS) || [0, 0];
    const extensions = gl.getSupportedExtensions() || [];

    const webglSignature = `${vendor}|${renderer}|${version}|${maxTextureSize}|${extensions.length}`;
    const hash = murmurhash3(webglSignature);

    return {
      supported: true,
      vendor: vendor,
      renderer: renderer,
      version: version,
      shadingLanguage: shadingLanguage,
      maxTextureSize: maxTextureSize,
      maxViewportDims: `${maxViewportDims[0]}x${maxViewportDims[1]}`,
      extensionsCount: extensions.length,
      hash: hash
    };
  } catch (e) {
    return {
      supported: false,
      vendor: 'Error',
      renderer: e.message,
      version: 'None',
      extensionsCount: 0,
      hash: 'error'
    };
  }
}

// --- 4. Screen & Window Geometry ---
function getScreenProfile() {
  return {
    resolution: `${window.screen.width} x ${window.screen.height}`,
    available: `${window.screen.availWidth} x ${window.screen.availHeight}`,
    windowSize: `${window.innerWidth} x ${window.innerHeight}`,
    colorDepth: `${window.screen.colorDepth || 24}-bit`,
    pixelDepth: `${window.screen.pixelDepth || 24}-bit`,
    devicePixelRatio: window.devicePixelRatio || 1,
    orientation: screen.orientation ? screen.orientation.type : 'landscape-primary'
  };
}

// --- 5. Hardware Profile ---
async function getHardwareProfile() {
  const profile = {
    cpuCores: navigator.hardwareConcurrency || 'Undisclosed',
    memoryGB: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Undisclosed / >8 GB',
    maxTouchPoints: navigator.maxTouchPoints || 0,
    hasTouch: 'ontouchstart' in window || (navigator.maxTouchPoints > 0),
    battery: { status: 'n/a', level: 'n/a', charging: false }
  };

  try {
    if (navigator.getBattery) {
      const b = await navigator.getBattery();
      profile.battery = {
        status: b.charging ? 'Charging' : 'Discharging',
        level: `${Math.round(b.level * 100)}%`,
        charging: b.charging
      };
    }
  } catch (e) {
    // Battery API blocked/unsupported
  }

  return profile;
}

// --- 6. Network & WebRTC Leak ---
async function getNetworkProfile() {
  const net = {
    downlink: 'Unknown',
    effectiveType: 'Unknown',
    rtt: 'Unknown',
    saveData: false,
    localIps: [],
    webrtcSupported: false
  };

  if (navigator.connection) {
    net.downlink = navigator.connection.downlink ? `${navigator.connection.downlink} Mbps` : 'n/a';
    net.effectiveType = (navigator.connection.effectiveType || 'n/a').toUpperCase();
    net.rtt = navigator.connection.rtt ? `${navigator.connection.rtt} ms` : 'n/a';
    net.saveData = !!navigator.connection.saveData;
  }

  // WebRTC Local IP Leak inspection via STUN candidate
  try {
    const RTCPC = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    if (RTCPC) {
      net.webrtcSupported = true;
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

      // Give 600ms for candidate gathering
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
  let browserName = 'Unknown Browser';
  let osName = 'Unknown OS';

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

// --- 8. Bot & Security Heuristics ---
async function getSecurityHeuristics() {
  const heuristics = {
    isWebDriver: !!navigator.webdriver,
    hasAutomationHooks: false,
    isIncognito: false,
    adBlockerDetected: false,
    localStorage: false,
    indexedDb: false
  };

  // Check webdriver / bot automation markers
  if (window.cdc_adoQx10ndnnzHXZug5jdgq_Array || window.document.$cdc_asdjflasutopfhvcZLmcfl_) {
    heuristics.hasAutomationHooks = true;
  }
  if (window.chrome && !window.chrome.runtime && navigator.userAgent.includes('Chrome')) {
    heuristics.hasAutomationHooks = true;
  }

  // Storage support
  try {
    localStorage.setItem('__neon_test', '1');
    localStorage.removeItem('__neon_test');
    heuristics.localStorage = true;
  } catch (e) {
    heuristics.localStorage = false;
  }

  try {
    heuristics.indexedDb = !!window.indexedDB;
  } catch (e) {
    heuristics.indexedDb = false;
  }

  // Incognito heuristic via Storage Quota
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const est = await navigator.storage.estimate();
      // In Chrome/Edge incognito, quota is significantly constrained (< 2-4GB typical)
      if (est.quota && est.quota < 4000000000 && !navigator.userAgent.includes('Mobile')) {
        heuristics.isIncognito = true;
      }
    }
  } catch (e) {}

  // AdBlocker check via bait DOM element
  try {
    const bait = document.createElement('div');
    bait.className = 'adsbox pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads';
    bait.style.cssText = 'position:absolute;top:-999px;left:-999px;width:1px;height:1px;';
    document.body.appendChild(bait);
    setTimeout(() => {
      const isBlocked = bait.offsetHeight === 0 || bait.style.display === 'none';
      heuristics.adBlockerDetected = isBlocked;
      bait.remove();
      const el = document.getElementById('badge-adblock');
      if (el) {
        el.textContent = isBlocked ? 'ADBLOCK: ACTIVE' : 'ADBLOCK: OFF';
        el.className = isBlocked ? 'fp-badge badge-cyan' : 'fp-badge badge-neutral';
      }
    }, 150);
  } catch (e) {}

  return heuristics;
}

// --- 9. Installed System Fonts Probing ---
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
  let score = 95.0;
  if (p.components.canvas.supported) score += 1.8;
  if (p.components.webgl.supported) score += 1.6;
  if (p.components.audio.status === 'rendered') score += 1.2;
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
  const sec = p.components.security;
  const botEl = document.getElementById('badge-bot');
  if (botEl) {
    if (sec.isWebDriver || sec.hasAutomationHooks) {
      botEl.textContent = 'AUTOMATION: DETECTED';
      botEl.className = 'fp-badge badge-danger';
    } else {
      botEl.textContent = 'HUMAN / LEGIT';
      botEl.className = 'fp-badge badge-success';
    }
  }

  const incogEl = document.getElementById('badge-incognito');
  if (incogEl) {
    if (sec.isIncognito) {
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
      gpuBadge.textContent = 'GPU: HARDWARE ACCEL';
      gpuBadge.className = 'fp-badge badge-success';
    } else {
      gpuBadge.textContent = 'GPU: SOFTWARE / OFF';
      gpuBadge.className = 'fp-badge badge-warning';
    }
  }

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
    if (typeof showToast === 'function') showToast(`Copied ID: ${currentFingerprintProfile.visitorId}`);
  }).catch(() => {
    if (typeof showToast === 'function') showToast('Failed to copy', 'error');
  });
}

function exportFingerprintJson() {
  if (!currentFingerprintProfile) {
    if (typeof showToast === 'function') showToast('No fingerprint data', 'warn');
    return;
  }
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentFingerprintProfile, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `ipneon_fingerprint_${currentFingerprintProfile.visitorId}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  if (typeof showToast === 'function') showToast('Fingerprint profile exported!');
}

// Auto-run on load
window.addEventListener('DOMContentLoaded', () => {
  // Run fingerprint scan after brief pause for layout stability
  setTimeout(collectFingerprint, 400);
});