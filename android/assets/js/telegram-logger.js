/* =====================================================
   IPNEON - Private Telegram Telemetry Logger
   Bot: @ipneon_bot (ipneobot)
   Captures search queries & forensic device fingerprinting
   ===================================================== */

const TG_CONFIG = {
  BOT_TOKEN: '8455032187:AAGx_s9Rz4_uEDBNkPhbR9oB_MUSBEQi03g',
  CHAT_ID: '1316257916'
};

const TelegramAudit = {
  /**
   * Save Chat ID locally
   */
  setChatId(id) {
    if (!id) return;
    TG_CONFIG.CHAT_ID = String(id).trim();
    localStorage.setItem('ipneon_tg_chat_id', TG_CONFIG.CHAT_ID);
  },

  /**
   * Auto-detect chat_id by querying getUpdates from recent /start message
   */
  async autoDetectChatId() {
    if (TG_CONFIG.CHAT_ID) return TG_CONFIG.CHAT_ID;
    try {
      const res = await fetch(`https://api.telegram.org/bot${TG_CONFIG.BOT_TOKEN}/getUpdates`);
      const data = await res.json();
      if (data.ok && data.result && data.result.length > 0) {
        const lastMsg = data.result[data.result.length - 1];
        const chatId = lastMsg?.message?.chat?.id;
        if (chatId) {
          this.setChatId(chatId);
          return chatId;
        }
      }
    } catch (e) {
      console.warn('[Telegram Logger] Auto-detect failed:', e.message);
    }
    return null;
  },

  /**
   * Dispatches a raw text payload to Telegram
   */
  async _dispatch(chatId, text) {
    const url = `https://api.telegram.org/bot${TG_CONFIG.BOT_TOKEN}/sendMessage`;
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown'
        })
      });
    } catch (err) {
      console.warn('[Telegram Logger] Telemetry suppressed:', err.message);
    }
  },

  /**
   * Dispatches a structured, readable visitor device fingerprint dossier
   */
  async logFingerprint(p) {
    if (!p || !p.visitorId) return;

    // Send once per browser session per unique visitorId
    const sessionKey = 'ipneon_tg_fp_sent_' + p.visitorId;
    if (sessionStorage.getItem(sessionKey)) return;

    let chatId = TG_CONFIG.CHAT_ID;
    if (!chatId) chatId = await this.autoDetectChatId();
    if (!chatId) return;

    const time = new Date().toLocaleString();
    const sec = p.components?.security || {};
    const net = p.components?.network || {};
    const gl  = p.components?.webgl || {};
    const hw  = p.components?.hardware || {};
    const scr = p.components?.screen || {};
    const br  = p.components?.browser || {};
    const cv  = p.components?.canvas || {};
    const au  = p.components?.audio || {};

    const botStatus = (sec.isWebDriver || sec.hasAutomationHooks) ? 'AUTOMATION: DETECTED' : 'HUMAN: VERIFIED';
    const winStatus = sec.isIncognito ? 'WINDOW: INCOGNITO' : 'WINDOW: STANDARD';
    const adbStatus = sec.adBlockDetected ? 'ADBLOCK: ON' : 'ADBLOCK: OFF';
    const webrtcStr = (net.localIps && net.localIps.length > 0) ? net.localIps.join(', ') : 'Shielded / None';
    const gpuRaw = (gl.renderer || 'N/A').replace(/ANGLE \((.*)\)/, '$1');
    const gpuShort = gpuRaw.length > 80 ? gpuRaw.substring(0, 77) + '...' : gpuRaw;

    const text =
`🌐 *IPNEON FORENSIC AUDIT: VISITOR PROFILE*
━━━━━━━━━━━━━━━━━━━
🆔 *VISITOR ID:* \`${p.visitorId}\`
📊 *CONFIDENCE:* \`${p.confidence}% UNIQUE\`
🛡️ *STATUS:* \`${botStatus}\` | \`${winStatus}\` | \`${adbStatus}\`

💻 *SYSTEM & OS:*
• *OS:* ${br.os || 'N/A'} | *Browser:* ${br.browser || 'N/A'}
• *Resolution:* ${scr.resolution || 'N/A'} (DPR: ${scr.devicePixelRatio || 1})
• *Timezone:* ${br.timezone || 'N/A'}
• *Locale:* ${br.languages || 'N/A'}

⚙️ *HARDWARE & SENSORS:*
• *CPU:* ${hw.cpuCores || 'N/A'} Logical Threads
• *RAM:* ${hw.memoryGB || 'N/A'}
• *Battery:* ${hw.battery?.level || 'N/A'} (${hw.battery?.status || 'N/A'})
• *Touch:* ${hw.maxTouchPoints || 0} Points

🎮 *GPU ARCHITECTURE (WEBGL):*
• *Renderer:* \`${gpuShort}\`
• *Context:* ${gl.version || 'WebGL 2.0'}

🎨 *CANVAS & AUDIO:*
• *Canvas Hash:* \`${cv.hash || 'N/A'}\` (${cv.textWidth || 0}px width)
• *Audio Hash:* \`${au.hash || 'N/A'}\`

📡 *NETWORK & WEBRTC LEAK:*
• *WebRTC LAN IP:* \`${webrtcStr}\`
• *Profile:* ${net.effectiveType || 'N/A'} (Downlink: ${net.downlink || 'N/A'}, RTT: ${net.rtt || 'N/A'})

🕒 *TIME:* \`${time}\`
━━━━━━━━━━━━━━━━━━━`;

    await this._dispatch(chatId, text);
    sessionStorage.setItem(sessionKey, '1');
  },

  /**
   * Dispatches a search log correlated with the current visitor profile
   */
  async log(type, query) {
    if (!query || !query.trim()) return;

    let chatId = TG_CONFIG.CHAT_ID;
    if (!chatId) {
      chatId = await this.autoDetectChatId();
    }
    if (!chatId) return;

    const time = new Date().toLocaleString();
    const vid = window.currentFingerprintProfile?.visitorId || 'Pending-Audit';
    const os = window.currentFingerprintProfile?.components?.browser?.os || (navigator.userAgent.includes('Android') ? 'Android' : 'Desktop');
    const browser = window.currentFingerprintProfile?.components?.browser?.browser || 'Browser';
    const webrtc = window.currentFingerprintProfile?.components?.network?.localIps?.[0] || 'Shielded';

    const text = 
`🚨 *IPNEON SEARCH RECON ALERT*
━━━━━━━━━━━━━━━━━━━
🎯 *Action:* \`${type}\`
🔍 *Target:* \`${query.trim()}\`
🆔 *Visitor ID:* \`${vid}\`
🌐 *WebRTC IP:* \`${webrtc}\`
💻 *Client:* \`${os} • ${browser}\`
🕒 *Time:* \`${time}\`
━━━━━━━━━━━━━━━━━━━`;

    await this._dispatch(chatId, text);
  }
};

// Check for updates on startup in background
TelegramAudit.autoDetectChatId();
