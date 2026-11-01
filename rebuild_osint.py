#!/usr/bin/env python3
"""
Rebuilds ai-osint.js:
- Unified AI NEON OSINT Suite
- Smart-routing universal search bar (auto-detects username / email / domain / phone)
- Tabs: Universal Search | Username Hunter | Email + Breach | Link Logger | Evidence Graph | Arsenal | History
- executeSearch() routes to the correct live tool automatically
"""

with open('js/ai-osint.js', 'r', encoding='utf-8') as f:
    src = f.read()

# ── 1. Replace renderMainSection entirely ────────────────────────────────────
OLD_RENDER = '''  // --- RENDER MAIN HTML STRUCTURE ---
  function renderMainSection() {
    const mount = document.getElementById('ai-osint-mount');
    if (!mount) return;

    mount.innerHTML = `
      <div class="ai-osint-container">
        <!-- TOP NAVIGATION TABS -->
        <div class="ai-osint-nav-tabs">
          <button class="ai-osint-tab-btn active" data-tab="search" onclick="AI_OSINT.switchTab('search')">
            <span>🔍</span> UNIVERSAL AI SEARCH
          </button>
          <button class="ai-osint-tab-btn" data-tab="core-osint" onclick="AI_OSINT.switchTab('core-osint')">
            <span>🎯</span> CORE OSINT TOOLS (4)
          </button>
          <button class="ai-osint-tab-btn" data-tab="graph" onclick="AI_OSINT.switchTab('graph')">
            <span>🕸️</span> EVIDENCE TOPOLOGY GRAPH
          </button>
          <button class="ai-osint-tab-btn" data-tab="tools" onclick="AI_OSINT.switchTab('tools')">
            <span>🧰</span> SOURCES & ARSENAL (${tools.filter(t=>t.status==='connected').length})
          </button>
          <button class="ai-osint-tab-btn" data-tab="history" onclick="AI_OSINT.switchTab('history')">
            <span>📜</span> DOSSIER HISTORY
          </button>
        </div>'''

NEW_RENDER = '''  // --- RENDER MAIN HTML STRUCTURE ---
  function renderMainSection() {
    const mount = document.getElementById('ai-osint-mount');
    if (!mount) return;

    mount.innerHTML = `
      <div class="ai-osint-container">

        <!-- ═══ UNIFIED SEARCH BAR (sticky, always visible above all tabs) ═══ -->
        <div class="ai-osint-unified-search-wrap">
          <div class="ai-osint-suite-badge">
            <span class="suite-pulse"></span>
            ⚡ AI NEON OSINT SUITE &bull; 3,140+ ENDPOINTS &bull; AUTO-ROUTE INTELLIGENCE
          </div>
          <div class="ai-osint-search-bar-wrap" id="ai-osint-main-bar">
            <span class="ai-osint-kind-badge" id="ai-osint-kind-badge" style="display:none;"></span>
            <input
              type="text"
              id="ai-osint-search-input"
              class="ai-osint-search-input"
              placeholder="Search username, email, phone, domain, IP… auto-routed to the right tool"
              autocomplete="off"
              spellcheck="false"
            />
            <button class="ai-osint-search-btn" id="ai-osint-search-submit" onclick="AI_OSINT.executeSearch()">
              <span>SEARCH</span> ⚡
            </button>
          </div>
          <div class="ai-osint-presets-row">
            <span class="wp-label">QUICK FIRE:</span>
            <button class="wp-chip" onclick="AI_OSINT.executeSearch('johndoe_92')">👤 johndoe_92</button>
            <button class="wp-chip" onclick="AI_OSINT.executeSearch('acme-logistics.com')">🌐 acme-logistics.com</button>
            <button class="wp-chip" onclick="AI_OSINT.executeSearch('it-ops@acme-logistics.com')">📧 it-ops@acme-logistics.com</button>
            <button class="wp-chip" onclick="AI_OSINT.executeSearch('+44 20 7946 0958')">📞 +44 20 7946 0958</button>
            <button class="wp-chip" onclick="AI_OSINT.executeSearch('Northwind Holdings Ltd')">🏢 Northwind Holdings</button>
          </div>
        </div>

        <!-- TOP NAVIGATION TABS -->
        <div class="ai-osint-nav-tabs">
          <button class="ai-osint-tab-btn active" data-tab="search" onclick="AI_OSINT.switchTab('search')">
            <span>🔍</span> UNIVERSAL SEARCH
          </button>
          <button class="ai-osint-tab-btn" data-tab="username" onclick="AI_OSINT.switchTab('username')">
            <span>👤</span> USERNAME HUNTER
          </button>
          <button class="ai-osint-tab-btn" data-tab="email" onclick="AI_OSINT.switchTab('email')">
            <span>📧</span> EMAIL + BREACH
          </button>
          <button class="ai-osint-tab-btn" data-tab="linklog" onclick="AI_OSINT.switchTab('linklog')">
            <span>🔗</span> LINK LOGGER
          </button>
          <button class="ai-osint-tab-btn" data-tab="graph" onclick="AI_OSINT.switchTab('graph')">
            <span>🕸️</span> EVIDENCE GRAPH
          </button>
          <button class="ai-osint-tab-btn" data-tab="tools" onclick="AI_OSINT.switchTab('tools')">
            <span>🧰</span> ARSENAL (${tools.filter(t=>t.status==='connected').length})
          </button>
          <button class="ai-osint-tab-btn" data-tab="history" onclick="AI_OSINT.switchTab('history')">
            <span>📜</span> HISTORY
          </button>
        </div>'''

src = src.replace(OLD_RENDER, NEW_RENDER, 1)

# ── 2. Replace the old Tab 1 (search view with its own hero box + search bar) ──
# The old search view had a big hero box WITH its own search bar — remove that
# since the unified bar is now above all tabs
OLD_TAB1 = '''        <!-- 1. SEARCH & PROFILES VIEW -->
        <div class="ai-osint-tab-view active" id="ai-osint-view-search">
          <div class="ai-osint-hero-box">
            <div class="ai-osint-lens-radar">
              <div class="lens-ring l1"></div>
              <div class="lens-ring l2"></div>
              <div class="lens-core">👁️‍🗨️</div>
            </div>
            <h2 class="ai-osint-title">AI NEON <span class="accent">OSINT Suite</span></h2>
            <p class="ai-osint-sub">Unified intelligence suite &bull; Multi-vector search across 3,140+ public endpoints &bull; Username &amp; Email Hunter &bull; 100% in-browser zero downloads</p>

            <!-- INPUT BAR -->
            <div class="ai-osint-search-bar-wrap">
              <span class="ai-osint-kind-badge" id="ai-osint-kind-badge" style="display:none;"></span>
              <input type="text" id="ai-osint-search-input" class="ai-osint-search-input" placeholder="Enter nickname, email, phone, domain (e.g. johndoe_92, acme-logistics.com)..." autocomplete="off" spellcheck="false" />
              <button class="ai-osint-search-btn" id="ai-osint-search-submit" onclick="AI_OSINT.executeSearch()">
                <span>SEARCH</span> ⚡
              </button>
            </div>

            <!-- PRESETS -->
            <div class="ai-osint-presets-row">
              <span class="wp-label">SAMPLE PRESETS:</span>
              <button class="wp-chip" onclick="AI_OSINT.executeSearch('johndoe_92')">👤 johndoe_92</button>
              <button class="wp-chip" onclick="AI_OSINT.executeSearch('acme-logistics.com')">🌐 acme-logistics.com</button>
              <button class="wp-chip" onclick="AI_OSINT.executeSearch('it-ops@acme-logistics.com')">📧 it-ops@acme-logistics.com</button>
              <button class="wp-chip" onclick="AI_OSINT.executeSearch('+44 20 7946 0958')">📞 +44 20 7946 0958</button>
              <button class="wp-chip" onclick="AI_OSINT.executeSearch('Northwind Holdings Ltd')">🏢 Northwind Holdings</button>
            </div>
          </div>

          <!-- PROGRESS BAR (ANIMATED STAGES) -->
          <div class="ai-osint-progress-box" id="ai-osint-progress-container" style="display:none;">
            <div class="wp-top">
              <span class="wp-status" id="ai-osint-progress-status">Initiating OSINT scan...</span>
              <span class="wp-count" id="ai-osint-progress-count">0 / 3,140 sites checked</span>
            </div>
            <div class="wp-track">
              <div class="wp-bar" id="ai-osint-progress-bar"></div>
            </div>
          </div>

          <!-- RESULTS CONTAINER -->
          <div class="ai-osint-results-wrapper" id="ai-osint-results-container" style="display:none;"></div>
        </div>

        <!-- 2. CORE OSINT TOOLS VIEW (COMBINED) -->
        <div class="ai-osint-tab-view" id="ai-osint-view-core-osint">
          <div class="section-header" style="margin-bottom:1.5rem; text-align:center;">
            <span class="section-tag">// TARGET ENUMERATION</span>
            <h3 class="section-title" style="font-size:1.6rem;">CORE RECON <span class="accent">ARSENAL</span></h3>
            <p class="section-sub">Username, email, link generator and breach intelligence lookup</p>
          </div>
          <div class="osint-grid" id="osint-grid">
            <div class="osint-card osint-card-large" id="osint-username">
              <div class="osint-card-header">
                <span class="osint-icon">🔍</span>
                <h3 class="osint-title">USERNAME HUNTER</h3>
              </div>
              <div class="osint-input-row">
                <input type="text" id="username-input" class="osint-input" placeholder="Enter username..." onkeydown="if(event.key==='Enter')huntUsername()" />
                <button class="osint-btn" id="btn-username" onclick="huntUsername()">HUNT</button>
              </div>
              <div class="osint-results" id="username-results">
                <p class="osint-hint">Run automated live background probes across 16+ platforms (displays verified active profiles only)</p>
              </div>
            </div>
            <div class="osint-card" id="osint-email">
              <div class="osint-card-header">
                <span class="osint-icon">📧</span>
                <h3 class="osint-title">EMAIL INTEL</h3>
              </div>
              <div class="osint-input-row">
                <input type="text" id="email-input" class="osint-input" placeholder="Enter email address..." onkeydown="if(event.key==='Enter')lookupEmail()" />
                <button class="osint-btn" id="btn-email" onclick="lookupEmail()">LOOKUP</button>
              </div>
              <div class="osint-results" id="email-results">
                <p class="osint-hint">Check breaches, reputation and deliverability</p>
              </div>
            </div>
            <div class="osint-card" id="osint-logger">
              <div class="osint-card-header">
                <span class="osint-icon">🔗</span>
                <h3 class="osint-title">LINK LOGGER</h3>
              </div>
              <div class="osint-input-row">
                <input type="text" id="link-target" class="osint-input" placeholder="Destination URL..." onkeydown="if(event.key==='Enter')generateLoggerLink()" />
                <button class="osint-btn" id="btn-genlink" onclick="generateLoggerLink()">GENERATE</button>
              </div>
              <div class="osint-results" id="link-results">
                <p class="osint-hint">Generate a custom tracking redirect link</p>
              </div>
            </div>
            <div class="osint-card" id="osint-breach">
              <div class="osint-card-header">
                <span class="osint-icon">💥</span>'''

NEW_TAB1 = '''        <!-- 1. UNIVERSAL SEARCH + AI PROFILES VIEW -->
        <div class="ai-osint-tab-view active" id="ai-osint-view-search">
          <!-- PROGRESS BAR (ANIMATED STAGES) -->
          <div class="ai-osint-progress-box" id="ai-osint-progress-container" style="display:none;">
            <div class="wp-top">
              <span class="wp-status" id="ai-osint-progress-status">Initiating OSINT scan...</span>
              <span class="wp-count" id="ai-osint-progress-count">0 / 3,140 sites checked</span>
            </div>
            <div class="wp-track">
              <div class="wp-bar" id="ai-osint-progress-bar"></div>
            </div>
          </div>
          <!-- IDLE STATE (shown before first search) -->
          <div class="ai-osint-idle-state" id="ai-osint-idle-state">
            <div class="ai-osint-lens-radar">
              <div class="lens-ring l1"></div>
              <div class="lens-ring l2"></div>
              <div class="lens-core">👁️‍🗨️</div>
            </div>
            <p class="ai-osint-idle-text">Enter any username, email, phone or domain above &mdash; the suite auto-routes to the correct intelligence tool and begins live reconnaissance.</p>
            <div class="ai-osint-route-pills">
              <span class="route-pill">👤 Username &rarr; Live Platform Hunt</span>
              <span class="route-pill">📧 Email &rarr; Breach + Reputation</span>
              <span class="route-pill">🌐 Domain &rarr; WHOIS + Cert + Shodan</span>
              <span class="route-pill">📞 Phone &rarr; Carrier + Leak Sources</span>
            </div>
          </div>
          <!-- RESULTS CONTAINER -->
          <div class="ai-osint-results-wrapper" id="ai-osint-results-container" style="display:none;"></div>
        </div>

        <!-- 2. USERNAME HUNTER TAB -->
        <div class="ai-osint-tab-view" id="ai-osint-view-username">
          <div class="section-header" style="margin-bottom:1.5rem; text-align:center;">
            <span class="section-tag">// LIVE PLATFORM RECON</span>
            <h3 class="section-title" style="font-size:1.6rem;">USERNAME <span class="accent">HUNTER</span></h3>
            <p class="section-sub">Live probes across 16+ platforms — only verified active profiles returned</p>
          </div>
          <div class="osint-card osint-card-large" id="osint-username" style="max-width:860px;margin:0 auto;">
            <div class="osint-input-row">
              <input type="text" id="username-input" class="osint-input" placeholder="Enter username (e.g. johndoe_92)..." onkeydown="if(event.key==='Enter')huntUsername()" />
              <button class="osint-btn" id="btn-username" onclick="huntUsername()">⚡ HUNT</button>
            </div>
            <div class="osint-results" id="username-results">
              <p class="osint-hint">Run automated live background probes across 16+ platforms (displays verified active profiles only)</p>
            </div>
          </div>
        </div>

        <!-- 3. EMAIL + BREACH TAB -->
        <div class="ai-osint-tab-view" id="ai-osint-view-email">
          <div class="section-header" style="margin-bottom:1.5rem; text-align:center;">
            <span class="section-tag">// CREDENTIAL INTELLIGENCE</span>
            <h3 class="section-title" style="font-size:1.6rem;">EMAIL + BREACH <span class="accent">INTEL</span></h3>
            <p class="section-sub">Check breaches, reputation, deliverability, and leaked databases</p>
          </div>
          <div class="osint-grid" style="max-width:900px;margin:0 auto;">
            <div class="osint-card" id="osint-email">
              <div class="osint-card-header">
                <span class="osint-icon">📧</span>
                <h3 class="osint-title">EMAIL INTEL</h3>
              </div>
              <div class="osint-input-row">
                <input type="text" id="email-input" class="osint-input" placeholder="Enter email address..." onkeydown="if(event.key==='Enter')lookupEmail()" />
                <button class="osint-btn" id="btn-email" onclick="lookupEmail()">LOOKUP</button>
              </div>
              <div class="osint-results" id="email-results">
                <p class="osint-hint">Check breaches, reputation and deliverability</p>
              </div>
            </div>
            <div class="osint-card" id="osint-breach">
              <div class="osint-card-header">
                <span class="osint-icon">💥</span>
                <h3 class="osint-title">BREACH CHECK</h3>
              </div>
              <div class="osint-input-row">
                <input type="text" id="breach-input" class="osint-input" placeholder="Email or username..." onkeydown="if(event.key==='Enter')checkBreach()" />
                <button class="osint-btn" id="btn-breach" onclick="checkBreach()">CHECK</button>
              </div>
              <div class="osint-results" id="breach-results">
                <p class="osint-hint">Check known data breaches and leaked databases</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. LINK LOGGER TAB -->
        <div class="ai-osint-tab-view" id="ai-osint-view-linklog">
          <div class="section-header" style="margin-bottom:1.5rem; text-align:center;">
            <span class="section-tag">// TRACKING REDIRECT ENGINE</span>
            <h3 class="section-title" style="font-size:1.6rem;">LINK <span class="accent">LOGGER</span></h3>
            <p class="section-sub">Generate custom IP-capturing redirect links — victim clicks, you get their IP silently</p>
          </div>
          <div class="osint-card" id="osint-logger" style="max-width:700px;margin:0 auto;">
            <div class="osint-card-header">
              <span class="osint-icon">🔗</span>
              <h3 class="osint-title">LINK LOGGER</h3>
            </div>
            <div class="osint-input-row">
              <input type="text" id="link-target" class="osint-input" placeholder="Destination URL (e.g. https://google.com)..." onkeydown="if(event.key==='Enter')generateLoggerLink()" />
              <button class="osint-btn" id="btn-genlink" onclick="generateLoggerLink()">GENERATE</button>
            </div>
            <div class="osint-results" id="link-results">
              <p class="osint-hint">Generate a custom tracking redirect link — captures visitor IP on click</p>
            </div>
          </div>
        </div>

        <!-- !! REMOVED OLD CORE-OSINT BLOCK — kept IDs for app.js compatibility !! -->
        <!-- Hidden compat shim so app.js legacy selectors don't break -->
        <div style="display:none;" aria-hidden="true">
          <div id="osint-grid"></div>
        </div>'''

src = src.replace(OLD_TAB1, NEW_TAB1, 1)

# ── 3. Fix switchTab to handle the new tab IDs ───────────────────────────────
OLD_SWITCH = '''  function switchTab(tab) {
    activeTab = tab;
    document.querySelectorAll('.ai-osint-tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
    document.querySelectorAll('.ai-osint-tab-view').forEach(v => {
      v.classList.toggle('active', v.id === `ai-osint-view-${tab}`);
    });

    if (tab === 'graph') {
      renderEvidenceGraph();
    } else if (tab === 'tools') {
      renderToolsView();
    } else if (tab === 'history') {
      renderHistoryView();
    }
  }'''

NEW_SWITCH = '''  function switchTab(tab) {
    activeTab = tab;
    document.querySelectorAll('.ai-osint-tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
    document.querySelectorAll('.ai-osint-tab-view').forEach(v => {
      v.classList.toggle('active', v.id === `ai-osint-view-${tab}`);
    });
    if (tab === 'graph') {
      renderEvidenceGraph();
    } else if (tab === 'tools') {
      renderToolsView();
    } else if (tab === 'history') {
      renderHistoryView();
    }
    // Scroll suite into view smoothly when switching tabs
    const suite = document.getElementById('ai-osint');
    if (suite) suite.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }'''

src = src.replace(OLD_SWITCH, NEW_SWITCH, 1)

# ── 4. Upgrade executeSearch() to smart-route to the right native tool ────────
OLD_EXEC = '''  // --- SEARCH ENGINE ---
  function executeSearch(forcedQuery = null) {
    const input = document.getElementById('ai-osint-search-input');
    const q = forcedQuery || (input ? input.value.trim() : '');
    if (!q) {
      if (window.showToast) window.showToast('Please enter a nickname, email, domain, or company.', 'warn');
      return;
    }
    if (input) input.value = q;

    switchTab('search');
    const kind = detectKind(q);
    const meta = KIND_META[kind];

    // Trigger Telegram audit logger if active
    if (typeof TelegramAudit !== 'undefined' && typeof TelegramAudit.log === 'function') {
      TelegramAudit.log('AI_OSINT_SEARCH', `${q} [${kind.toUpperCase()}]`);
    }

    // UI Progress Display
    const resultsContainer = document.getElementById('ai-osint-results-container');
    const progressContainer = document.getElementById('ai-osint-progress-container');
    const progressBar = document.getElementById('ai-osint-progress-bar');
    const progressStatus = document.getElementById('ai-osint-progress-status');
    const progressCount = document.getElementById('ai-osint-progress-count');

    if (progressContainer) progressContainer.style.display = 'block';
    if (resultsContainer) resultsContainer.style.display = 'none';

    const stages = [
      'Scanning top-tier social graphs...',
      'Probing developer platforms & code registries...',
      'Querying credential breach corpora & paste dumps...',
      'Auditing WHOIS & Certificate Transparency logs...',
      'Synthesizing AI entity correlation footprint...'
    ];

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 6;
      if (progress > 100) progress = 100;

      if (progressBar) progressBar.style.width = progress + '%';
      const stageIdx = Math.min(stages.length - 1, Math.floor((progress / 100) * stages.length));
      if (progressStatus) progressStatus.textContent = stages[stageIdx];
      if (progressCount) {
        const checked = Math.round((progress / 100) * 3140);
        progressCount.textContent = `${checked.toLocaleString()} / 3,140 sites checked`;
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (progressContainer) progressContainer.style.display = 'none';
          generateAndRenderResults(q, kind);
        }, 400);
      }
    }, 90);
  }'''

NEW_EXEC = '''  // --- UNIFIED SMART-ROUTING SEARCH ENGINE ---
  function executeSearch(forcedQuery = null) {
    const input = document.getElementById('ai-osint-search-input');
    const q = forcedQuery || (input ? input.value.trim() : '');
    if (!q) {
      if (window.showToast) window.showToast('Enter a target — username, email, phone, or domain.', 'warn');
      return;
    }
    if (input) input.value = q;

    const kind = detectKind(q);
    const meta = KIND_META[kind];

    // Update kind badge
    const badge = document.getElementById('ai-osint-kind-badge');
    if (badge) {
      badge.style.display = 'inline-flex';
      badge.innerHTML = `<span style="margin-right:4px;">${meta.icon}</span> ${meta.label.toUpperCase()} DETECTED`;
    }

    // Telegram audit
    if (typeof TelegramAudit !== 'undefined' && typeof TelegramAudit.log === 'function') {
      TelegramAudit.log('AI_OSINT_SEARCH', `${q} [${kind.toUpperCase()}]`);
    }

    // Show toast with route info
    if (window.showToast) {
      const routeLabel = kind === 'username' ? 'Username Hunter'
        : kind === 'email' ? 'Email + Breach Intel'
        : kind === 'phone' ? 'Phone Carrier Lookup'
        : kind === 'domain' ? 'Domain OSINT'
        : 'Intelligence Profile';
      window.showToast(`${meta.icon} Auto-routing to ${routeLabel}...`, 'success');
    }

    // ═══ SMART ROUTING ═══
    if (kind === 'username') {
      // Route → Username Hunter tab + fire live hunt
      switchTab('username');
      const uInput = document.getElementById('username-input');
      if (uInput) uInput.value = q;
      if (typeof huntUsername === 'function') huntUsername();
      // Also show AI profile summary in search tab after delay
      setTimeout(() => _showAIProfileSummary(q, kind), 500);

    } else if (kind === 'email') {
      // Route → Email + Breach tab + fire both tools
      switchTab('email');
      const eInput = document.getElementById('email-input');
      const bInput = document.getElementById('breach-input');
      if (eInput) eInput.value = q;
      if (bInput) bInput.value = q;
      if (typeof lookupEmail === 'function') lookupEmail();
      setTimeout(() => { if (typeof checkBreach === 'function') checkBreach(); }, 300);

    } else if (kind === 'phone') {
      // Route → Email+Breach tab as breach check
      switchTab('email');
      const bInput = document.getElementById('breach-input');
      if (bInput) bInput.value = q;
      if (typeof checkBreach === 'function') checkBreach();

    } else if (kind === 'domain') {
      // Route → Universal Search tab with AI domain profile + also scroll to tracker
      switchTab('search');
      _runSearchWithProgress(q, kind);

    } else {
      // company or unknown → Universal AI profile search
      switchTab('search');
      _runSearchWithProgress(q, kind);
    }

    // Always update history
    history.unshift({
      query: q, kind,
      count: 0,
      time: 'Just now',
      date: new Date().toISOString()
    });
    if (history.length > 50) history.pop();
    saveState();
  }

  // Internal: run animated progress then render AI profiles (for domain/company/search tab)
  function _runSearchWithProgress(q, kind) {
    // Hide idle state
    const idle = document.getElementById('ai-osint-idle-state');
    if (idle) idle.style.display = 'none';

    const resultsContainer = document.getElementById('ai-osint-results-container');
    const progressContainer = document.getElementById('ai-osint-progress-container');
    const progressBar = document.getElementById('ai-osint-progress-bar');
    const progressStatus = document.getElementById('ai-osint-progress-status');
    const progressCount = document.getElementById('ai-osint-progress-count');

    if (progressContainer) progressContainer.style.display = 'block';
    if (resultsContainer) resultsContainer.style.display = 'none';

    const stages = [
      'Scanning top-tier social graphs...',
      'Probing developer platforms & code registries...',
      'Querying credential breach corpora & paste dumps...',
      'Auditing WHOIS & Certificate Transparency logs...',
      'Synthesizing AI entity correlation footprint...'
    ];

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 6;
      if (progress > 100) progress = 100;
      if (progressBar) progressBar.style.width = progress + '%';
      const idx = Math.min(stages.length - 1, Math.floor((progress / 100) * stages.length));
      if (progressStatus) progressStatus.textContent = stages[idx];
      if (progressCount) {
        const checked = Math.round((progress / 100) * 3140);
        progressCount.textContent = `${checked.toLocaleString()} / 3,140 sites checked`;
      }
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (progressContainer) progressContainer.style.display = 'none';
          generateAndRenderResults(q, kind);
        }, 400);
      }
    }, 90);
  }

  // Show a quick AI summary panel in search tab (called after username hunt routes)
  function _showAIProfileSummary(q, kind) {
    const idle = document.getElementById('ai-osint-idle-state');
    if (idle) idle.style.display = 'none';
    const res = document.getElementById('ai-osint-results-container');
    if (!res) return;
    const profiles = buildProfilesForTarget(q, kind);
    currentSearchResults = { query: q, kind, profiles, timestamp: new Date() };
    res.style.display = 'block';
    const meta = KIND_META[kind];
    const exactMatches = profiles.filter(p => p.match === 'exact').length;
    res.innerHTML = `
      <div class="ai-osint-res-header">
        <div class="ai-osint-res-meta">
          <span class="ai-osint-res-kind">${meta.icon} ${meta.label.toUpperCase()} — AI PROFILE SUMMARY</span>
          <h2 class="ai-osint-res-title">${escapeHtml(q)}</h2>
        </div>
        <div class="ai-osint-res-actions">
          <button class="btn-secondary" onclick="AI_OSINT.exportCasePDF()"><span>📄</span> Save Dossier</button>
          <button class="btn-primary" onclick="AI_OSINT.promoteToCase('${escapeHtml(q)}', '${kind}')"><span>🕸️</span> Evidence Graph</button>
        </div>
      </div>
      <div class="ai-osint-ai-card">
        <div class="ai-osint-ai-badge"><span class="sparkle-pulse">✨</span> AI EXECUTIVE INTELLIGENCE SUMMARY</div>
        <p class="ai-osint-ai-summary">
          Target <strong>${escapeHtml(q)}</strong> is cross-referenced across <strong>${profiles.length} public network surfaces</strong>.
          <strong>${exactMatches} profiles</strong> show high biometric correlation. Live Username Hunter results are loading in the tab above.
          Use <strong>Evidence Graph</strong> to map the full attack surface.
        </p>
      </div>
      <div class="ai-osint-filter-bar" id="ai-osint-filter-bar">
        <button class="ai-osint-filter-chip active" onclick="AI_OSINT.filterProfiles('All')">All (${profiles.length})</button>
        <button class="ai-osint-filter-chip" onclick="AI_OSINT.filterProfiles('Dev')">Dev (${profiles.filter(p=>p.group==='Dev').length})</button>
        <button class="ai-osint-filter-chip" onclick="AI_OSINT.filterProfiles('Social')">Social (${profiles.filter(p=>p.group==='Social').length})</button>
        <button class="ai-osint-filter-chip" onclick="AI_OSINT.filterProfiles('Gaming')">Gaming (${profiles.filter(p=>p.group==='Gaming').length})</button>
        <button class="ai-osint-filter-chip" onclick="AI_OSINT.filterProfiles('Forums')">Forums (${profiles.filter(p=>p.group==='Forums').length})</button>
        <button class="ai-osint-filter-chip" onclick="AI_OSINT.filterProfiles('Media')">Media (${profiles.filter(p=>p.group==='Media').length})</button>
      </div>
      <div class="ai-osint-profiles-grid" id="ai-osint-profiles-grid">
        ${renderProfileItems(profiles)}
      </div>
    `;
  }'''

src = src.replace(OLD_EXEC, NEW_EXEC, 1)

# ── 5. Fix bindEvents — search input now in unified bar (already correct IDs) ─
# The input ID is still 'ai-osint-search-input', so bindEvents() stays unchanged

# ── 6. Remove the old breach-check div from core-osint view that was cut mid-tag ─
# (The old cut at the end of the core-osint block after osint-breach)
# Find it and close it out properly — the OLD_TAB1 replacement already handles this
# by removing the old core-osint block entirely

with open('js/ai-osint.js', 'w', encoding='utf-8') as f:
    f.write(src)

print("ai-osint.js rebuilt successfully.")
print(f"File size: {len(src):,} bytes")

# Verify key strings present
checks = [
    'ai-osint-unified-search-wrap',
    'ai-osint-view-username',
    'ai-osint-view-email',
    'ai-osint-view-linklog',
    'ai-osint-idle-state',
    '_runSearchWithProgress',
    '_showAIProfileSummary',
    'huntUsername()',
    'lookupEmail()',
    'checkBreach()',
    'generateLoggerLink()',
    'kind === \'username\'',
    'kind === \'email\'',
    'QUICK FIRE',
    'route-pill',
]
for c in checks:
    found = c in src
    status = '✅' if found else '❌ MISSING'
    print(f"  {status}  {c}")
