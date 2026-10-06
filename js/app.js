/* =====================================================
   IPNEON - app.js
   Advanced IP Intelligence & OSINT Recon Suite
   Author: ramaneon
   ===================================================== */

const TOOLS = [
  { id:1,  icon:'🔗', name:'IP Logger Links',        desc:'Generate masked redirect links that silently capture the visitor IP. Works like Grabify but with custom domains for higher trust.',         tags:['active','network'],   detail:'<h4>HOW IT WORKS</h4><p>Create a redirect URL. When victim clicks, their browser hits your logger endpoint capturing IP before redirecting.</p><h4>TOOLS</h4><p><code>Grabify.link</code> &bull; <code>IPLogger.org</code> &bull; Custom PHP logger</p><h4>OPSEC</h4><p>Use VPN when running your logger. Victim can potentially get YOUR IP.</p>' },
  { id:2,  icon:'📧', name:'Email Login Trap',        desc:'Create a fake Gmail account and let the target log in. Login history reveals their originating IP address.',                                tags:['active','social'],    detail:'<h4>HOW IT WORKS</h4><p>Create throwaway Google account. When target logs in, check Account > Security > Recent Activity to find their IP.</p><h4>PLATFORMS</h4><p><code>Google</code> &bull; <code>Microsoft</code> &bull; <code>ProtonMail</code></p><h4>OPSEC</h4><p>Access login history from a VPN - the page also logs YOUR access IP.</p>' },
  { id:3,  icon:'🖥️', name:'Screen Share IP Reveal',  desc:'During a screenshare, direct the target to whatismyip.com - their IP appears on screen.',                                                    tags:['passive','social'],   detail:'<h4>HOW IT WORKS</h4><p>While in a screenshare (Discord, Zoom), navigate victim to <code>whatismyip.com</code> or Google "what is my IP".</p><h4>SOCIAL ENGINEERING</h4><p>Tell them you need to help troubleshoot their internet. Works on non-technical targets.</p>' },
  { id:4,  icon:'🌐', name:'Custom Website Logger',   desc:'Deploy a free-hosted website with an embedded IP capture script. Far more trusted than known logger links.',                               tags:['active','network'],   detail:'<h4>HOW IT WORKS</h4><p>Host a page on Netlify/GitHub Pages with PHP or JS IP capture. Victims trust it because it looks real.</p><h4>TECH STACK</h4><p><code>PHP: $_SERVER[REMOTE_ADDR]</code> &bull; Netlify Functions &bull; Serverless backend</p>' },
  { id:5,  icon:'🎮', name:'Steam Account Lure',      desc:'Create a fake Steam account with Steam Guard. When victim logs in, you receive their IP via the Steam Guard email.',                       tags:['active','social'],    detail:'<h4>HOW IT WORKS</h4><p>Enable Steam Guard 2FA. Offer account as free giveaway. Steam Guard sends verification code + login location/IP to YOUR email.</p>' },
  { id:6,  icon:'🎬', name:'Netflix Account Trap',    desc:'Fake Netflix credentials. Login history in account settings reveals IP addresses of each session.',                                         tags:['active','social'],    detail:'<h4>HOW IT WORKS</h4><p>Create Netflix account, give creds to target. Check Account > Recent Device Streaming Activity to get their IP, device, and timestamp.</p>' },
  { id:7,  icon:'🏎️', name:'GTA V Social Club',       desc:'During screen share, have target navigate to GTA Social Club Network tab - their WAN IP is displayed directly.',                           tags:['passive','social'],   detail:'<h4>HOW IT WORKS</h4><p>GTA V Social Club launcher shows network info including player IP in Network settings tab. Visible during screenshare.</p>' },
  { id:8,  icon:'🎯', name:'Black Ops 3 Network',     desc:'CoD: Black Ops 3 Settings > Network panel exposes the player network IP.',                                                                  tags:['passive','social'],   detail:'<h4>HOW IT WORKS</h4><p>During screenshare, ask them to go to Settings > Network. Their external IP is shown in network diagnostics.</p>' },
  { id:9,  icon:'📡', name:'Console Packet Sniffer',  desc:'Use WireShark or Console Sniffer during PS/Xbox party sessions to capture all peer IPs from UDP packets.',                                  tags:['active','network'],   detail:'<h4>TOOLS</h4><p><code>PS4:</code> Console Sniffer &bull; PSN Resolver | <code>Xbox:</code> ReLanc Remastered | <code>Any:</code> Wireshark filter <code>udp.port==3478</code></p><h4>HOW</h4><p>All peers must connect directly P2P - their UDP packets contain source IPs.</p>' },
  { id:10, icon:'💬', name:'Discord Verify Trap',     desc:'Create a fake Discord verify flow requiring members to click an IP logger link to gain access.',                                            tags:['active','social'],    detail:'<h4>HOW IT WORKS</h4><p>Set up a Discord server requiring verification. Verification link = your IP logger URL. Social pressure drives clicks.</p><h4>SETUP</h4><p>Use MEE6 to restrict channels &bull; Post logger link as verification step</p>' },
  { id:11, icon:'🔑', name:'Discord Token Grabber',   desc:'Deploy a token grabber payload that exfiltrates the victims Discord token and IP address to a webhook.',                                    tags:['active','network'],   detail:'<h4>HOW IT WORKS</h4><p>Token grabber reads Discord local storage token + sends system info including IP to a Discord webhook via HTTP POST.</p><h4>DELIVERY</h4><p>Fake mods &bull; Free Nitro .exe &bull; Malicious bots</p>' },
  { id:12, icon:'⚡', name:'EXE/PY IP Grabber',       desc:'Custom Python or compiled .exe payload that silently fetches and exfiltrates the victims IP to your server or webhook.',                   tags:['active','network'],   detail:'<h4>PYTHON</h4><p><code>requests.get(https://api.ipify.org)</code> + POST to webhook. Package with PyInstaller.</p><h4>C# .NET</h4><p><code>new WebClient().DownloadString(ipify)</code> + WebRequest exfil.</p>' },
  { id:13, icon:'🛡️', name:'Epic Games 2FA Trap',     desc:'Create fake Epic Games account with 2FA. When victim logs in, their IP is sent to your email with the 2FA code.',                         tags:['active','social'],    detail:'<h4>HOW IT WORKS</h4><p>Create Epic account, enable email 2FA, offer free V-Bucks. Epic sends 2FA code to YOUR email with login metadata including IP geolocation.</p>' },
  { id:14, icon:'🗣️', name:'Social Engineering Ask',  desc:'Simply ask the target to Google "what is my IP" and read the numbers to you under a believable pretext.',                                  tags:['passive','social'],   detail:'<h4>PRETEXTS</h4><p>"I need your IP to set up the Minecraft server" &bull; "Tech support needs it to fix your connection" &bull; "The game needs your IP to whitelist you"</p>' },
  { id:15, icon:'📶', name:'Physical Network Access', desc:'Connect to target WiFi and query your own IP - their router public IP is your IP on that network.',                                         tags:['active','network'],   detail:'<h4>HOW IT WORKS</h4><p>Connect to victim WiFi. All devices share the same public IP. Search "what is my IP" - the result IS their home IP.</p><h4>EXTRA</h4><p><code>nmap -sn 192.168.1.0/24</code> reveals all connected devices.</p>' },
  { id:16, icon:'💥', name:'Stress Test Service Trap',desc:'Create a Stressthem account for the target. When they log in, the service logs their IP in login history.',                                  tags:['active','social'],    detail:'<h4>HOW IT WORKS</h4><p>Create Stressthem/booter account. Give credentials to victim. Login history reveals their IP in account settings.</p>' },
  { id:17, icon:'🚗', name:'FiveM Server Logger',     desc:'Host a FiveM GTA multiplayer server. Every connecting player IP is logged in server-side connection events.',                               tags:['active','network'],   detail:'<h4>CODE</h4><p><code>AddEventHandler("playerConnecting", function(name, setKick, def) { print(GetPlayerEndpoint(source)) })</code></p><h4>ALSO</h4><p>Works with any Ragemp, alt:V, or FiveM server framework.</p>' },
  { id:18, icon:'🕹️', name:'CS:GO / Source Server',   desc:'Run any Source engine game server. All connecting clients have their IPs logged automatically in server connection logs.',                  tags:['active','network'],   detail:'<h4>HOW IT WORKS</h4><p>Source engine logs all connections with timestamps and IPs. Check <code>logs/L*.log</code> in server dir.</p><h4>WORKS WITH</h4><p>CS2 &bull; TF2 &bull; GMod &bull; Minecraft (server.log) &bull; Rust &bull; Any dedicated game server</p>' },
  { id:19, icon:'🔍', name:'Leaked Database Search',  desc:'Search breach databases for the targets email/username - leaked records sometimes contain historical IP addresses.',                       tags:['passive','network'],  detail:'<h4>TOOLS</h4><p><code>HaveIBeenPwned</code> &bull; <code>Dehashed</code> &bull; <code>IntelX</code> &bull; <code>BreachDirectory</code> &bull; Telegram leak bots</p>' },
  { id:20, icon:'⛏️', name:'Minecraft Name DB Lookup', desc:'Search Minecraft username databases and old server logs - many contain historical player IPs tied to UUIDs.',                              tags:['passive','network'],  detail:'<h4>TOOLS</h4><p><code>mcbans.com</code> lookup &bull; Old server log archives &bull; Minecraft IP databases &bull; UUID resolvers with historical data</p>' }
];

const PLATFORMS = [
  { name:'Twitter/X',   url:'https://twitter.com/' },
  { name:'GitHub',      url:'https://github.com/' },
  { name:'Reddit',      url:'https://reddit.com/user/' },
  { name:'Instagram',   url:'https://instagram.com/' },
  { name:'TikTok',      url:'https://tiktok.com/@' },
  { name:'YouTube',     url:'https://youtube.com/@' },
  { name:'Twitch',      url:'https://twitch.tv/' },
  { name:'Steam',       url:'https://steamcommunity.com/id/' },
  { name:'Roblox',      url:'https://roblox.com/user.aspx?username=' },
  { name:'Pinterest',   url:'https://pinterest.com/' },
  { name:'Snapchat',    url:'https://snapchat.com/add/' },
  { name:'LinkedIn',    url:'https://linkedin.com/in/' },
  { name:'Tumblr',      url:'https://tumblr.com/blog/' },
  { name:'Medium',      url:'https://medium.com/@' },
  { name:'HackerNews',  url:'https://news.ycombinator.com/user?id=' },
  { name:'GitLab',      url:'https://gitlab.com/' },
  { name:'DeviantArt',  url:'https://deviantart.com/' },
  { name:'Pastebin',    url:'https://pastebin.com/u/' },
  { name:'Keybase',     url:'https://keybase.io/' },
  { name:'Spotify',     url:'https://open.spotify.com/user/' }
];

let logCount = 0;
let rawData  = null;

document.addEventListener('DOMContentLoaded', () => {
  initMatrix();
  initParticles();
  renderTools();
  animateCounters();
  fetchMyIP();
  initScrollBehavior();
  initLogTimestamp();
  initNavHighlight();
});

function initMatrix() {
  const canvas = document.getElementById('matrixCanvas');
  const ctx    = canvas.getContext('2d');
  let w = canvas.width  = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const chars = '01ABCDEF0123456789NEON';
  const cols  = Math.floor(w / 20);
  const drops = Array(cols).fill(1);
  window.addEventListener('resize', () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; });
  setInterval(() => {
    ctx.fillStyle = 'rgba(2,4,9,0.05)';
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle = '#00ff9f';
    ctx.font      = '14px Share Tech Mono';
    drops.forEach((y,i) => {
      ctx.fillText(chars[Math.floor(Math.random()*chars.length)], i*20, y*20);
      if (y*20>h && Math.random()>0.975) drops[i]=0;
      drops[i]++;
    });
  }, 50);
}

function initParticles() {
  const c = document.getElementById('particles');
  if (!c) return;
  for (let i=0; i<40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random()*100+'vw';
    p.style.animationDuration = (8+Math.random()*15)+'s';
    p.style.animationDelay    = (Math.random()*10)+'s';
    p.style.width = p.style.height = (1+Math.random()*3)+'px';
    p.style.background = Math.random()>0.5?'hsl(160,100%,60%)':'hsl(185,100%,60%)';
    c.appendChild(p);
  }
}

function initScrollBehavior() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY>50));
}

function scrollToSection(id) { document.getElementById(id)?.scrollIntoView({ behavior:'smooth' }); }

function initNavHighlight() {
  const sections = ['home','tools','tracker','fingerprint','osint','about'];
  const links = {};
  sections.forEach(s => { links[s] = document.getElementById('nav-'+s); });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        Object.values(links).forEach(l => l?.classList.remove('active'));
        links[e.target.id]?.classList.add('active');
      }
    });
  }, { threshold:0.3 });
  sections.forEach(s => { const el=document.getElementById(s); if(el) obs.observe(el); });
}

function animateCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = +el.dataset.target;
    let current  = 0;
    const timer  = setInterval(() => {
      current = Math.min(current + target/60, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 25);
  });
}

function renderTools() {
  const grid = document.getElementById('tools-grid');
  if (!grid) return;
  const tc   = { active:'tag-active', passive:'tag-passive', social:'tag-social', network:'tag-network' };
  TOOLS.forEach(tool => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.id        = 'tool-card-'+tool.id;
    card.onclick   = () => openModal(tool);
    card.innerHTML = `
      <span class="tool-num">VEC-${String(tool.id).padStart(2,'0')}</span>
      <span class="tool-icon">${tool.icon}</span>
      <div class="tool-name">${tool.name}</div>
      <div class="tool-desc">${tool.desc}</div>
      <div>${tool.tags.map(t=>`<span class="tool-tag ${tc[t]||'tag-active'}">${t.toUpperCase()}</span>`).join('')}</div>`;
    grid.appendChild(card);
  });
}

function openModal(tool) {
  document.getElementById('modal-title').textContent = `VEC-${String(tool.id).padStart(2,'0')} -- ${tool.name.toUpperCase()}`;
  document.getElementById('modal-body').innerHTML    = tool.detail;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }

async function fetchMyIP() {
  try {
    const data = await (await fetch('https://ipapi.co/json/')).json();
    document.getElementById('live-ip').textContent    = data.ip || '--';
    document.getElementById('live-loc').textContent   = `${data.city||'--'}, ${data.country_name||'--'}`;
    document.getElementById('live-isp').textContent   = (data.org||'--').slice(0,24);
    document.getElementById('live-threat').textContent= 'LOW';
    addLog('system', `Your IP detected: ${data.ip} -- ${data.city}, ${data.country_name}`);
  } catch(e) {
    document.getElementById('live-ip').textContent = 'API Error';
    addLog('error', 'Failed to fetch self IP: '+e.message);
  }
}

async function runIPScan() {
  const input = document.getElementById('ip-input').value.trim();
  if (!input) { showToast('Enter an IP address or domain','error'); return; }
  await scanIP(input);
}

async function scanMyIP() {
  addLog('system','Fetching your public IP...');
  try {
    const data = await (await fetch('https://api.ipify.org?format=json')).json();
    document.getElementById('ip-input').value = data.ip;
    await scanIP(data.ip);
  } catch(e) { showToast('Could not fetch your IP','error'); }
}

function scanPreset(ip) { document.getElementById('ip-input').value=ip; scanIP(ip); }

async function scanIP(target) {
  setScanLoading(true);
  addLog('warn', `Initiating scan on target: ${target}`);
  try {
    const res  = await fetch(`https://ipapi.co/${encodeURIComponent(target)}/json/`);
    if (!res.ok) throw new Error('API returned '+res.status);
    const data = await res.json();
    if (data.error) throw new Error(data.reason||'Invalid target');
    rawData = data;

    setText('res-ip',      data.ip         ||'--');
    setText('res-city',    data.city        ||'--');
    setText('res-region',  data.region      ||'--');
    setText('res-country', `${data.country_name||'--'} ${data.country_code?'('+data.country_code+')':''}`);
    setText('res-postal',  data.postal      ||'--');
    setText('res-coords',  data.latitude&&data.longitude?`${data.latitude}, ${data.longitude}`:'--');
    setText('res-timezone',data.timezone    ||'--');
    setText('res-isp',     data.org         ||'--');
    setText('res-org',     data.org         ||'--');
    setText('res-asn',     data.asn         ||'--');
    setText('res-type',    data.network     ||'--');
    setText('res-hostname',data.hostname    ||'--');
    setText('res-domain',  data.country_tld ||'--');
    setText('res-mobile',  data.is_eu?'EU region':'--');
    setText('res-continent',data.continent_code||'--');
    setText('res-currency', data.currency_name ||'--');
    setText('res-lang',     (data.languages||'--').split(',')[0]);
    setText('res-flag',     data.country_code?getFlag(data.country_code):'--');
    setText('res-calling',  data.country_calling_code||'--');

    const score = calcThreatScore(data);
    updateGauge(score);
    setFlagVal('res-vpn',  'UNKNOWN', false);
    setFlagVal('res-proxy','UNKNOWN', false);
    setFlagVal('res-tor',  isTorLike(data.org)?'YES':'NO', isTorLike(data.org));
    setFlagVal('res-bot',  'NO', false);
    setFlagVal('res-dc',   isDatacenter(data.org)?'YES':'NO', isDatacenter(data.org));

    if (data.latitude && data.longitude) {
      const frame = document.getElementById('map-frame');
      frame.src   = `https://www.openstreetmap.org/export/embed.html?bbox=${data.longitude-0.1},${data.latitude-0.1},${data.longitude+0.1},${data.latitude+0.1}&layer=mapnik&marker=${data.latitude},${data.longitude}`;
      frame.classList.remove('hidden');
      document.getElementById('map-placeholder').classList.add('hidden');
    }

    document.getElementById('raw-output').textContent = JSON.stringify(data, null, 2);
    document.getElementById('tracker-results').classList.remove('hidden');
    addLog('success', `Scan complete for ${data.ip} -- ${data.city||'--'}, ${data.country_name||'--'} -- ASN: ${data.asn||'--'}`);
    showToast(`Scan complete: ${data.ip}`);
  } catch(e) {
    addLog('error','Scan failed: '+e.message);
    showToast('Scan failed: '+e.message,'error');
  } finally { setScanLoading(false); }
}

function setText(id,val)  { const el=document.getElementById(id); if(el) el.textContent=val; }

function setFlagVal(id,label,isYes) {
  const el=document.getElementById(id);
  if (!el) return;
  el.textContent=label;
  el.className='flag-val '+(isYes?'flag-yes':label==='YES'?'flag-yes':label==='NO'?'flag-no':'');
}

function getFlag(cc) { return cc.toUpperCase().replace(/./g,c=>String.fromCodePoint(c.charCodeAt(0)+127397)); }

function isTorLike(org)    { if(!org) return false; const o=org.toLowerCase(); return o.includes('tor')||o.includes('relay'); }
function isDatacenter(org) { if(!org) return false; const o=org.toLowerCase(); return ['aws','amazon','google','microsoft','azure','digitalocean','linode','vultr','ovh','hetzner','cloudflare','fastly','akamai'].some(k=>o.includes(k)); }

function calcThreatScore(data) {
  let score = 5;
  const o   = (data.org||'').toLowerCase();
  if (isDatacenter(o)) score += 35;
  if (isTorLike(o))    score += 55;
  if (!data.city)      score += 15;
  if (data.is_eu)      score += 5;
  return Math.min(score, 99);
}

function updateGauge(score) {
  const arc   = document.getElementById('gauge-arc');
  const text  = document.getElementById('gauge-score-text');
  const label = document.getElementById('gauge-label');
  const max   = 173;
  const val   = Math.round((score/100)*max);
  let color   = '#00ff9f';
  let lbl     = 'LOW RISK';

  if (score > 60)      { color='#ff4ecd'; lbl='CRITICAL'; }
  else if (score > 40) { color='#ff8c00'; lbl='ELEVATED'; }
  else if (score > 20) { color='#00e5ff'; lbl='MODERATE'; }

  arc.style.strokeDasharray = `${val} ${max}`;
  arc.style.stroke          = color;
  text.textContent          = score;
  text.style.fill           = color;
  label.textContent         = lbl;
  label.style.color         = color;
}

function setScanLoading(loading) {
  const btn = document.getElementById('btn-scan');
  const txt = document.getElementById('scan-btn-text');
  const ldr = document.getElementById('scan-loader');
  btn.disabled = loading;
  txt.textContent = loading ? 'SCANNING' : 'SCAN';
  ldr.classList.toggle('hidden', !loading);
}

function copyRaw() {
  if (!rawData) { showToast('No scan data to copy','warn'); return; }
  navigator.clipboard.writeText(JSON.stringify(rawData,null,2))
    .then(() => showToast('Raw JSON copied to clipboard'))
    .catch(() => showToast('Failed to copy','error'));
}

const OSINT_TARGETS = [
  {
    name: 'GitHub',
    icon: '🐙',
    check: async (u) => {
      try {
        const res = await fetch(`https://api.github.com/users/${encodeURIComponent(u)}`);
        if (res.status === 200) {
          const d = await res.json();
          return {
            found: true,
            url: d.html_url || `https://github.com/${u}`,
            avatar: d.avatar_url,
            info: `${d.public_repos || 0} repos • ${d.followers || 0} followers`
          };
        }
      } catch (e) {}
      return { found: false };
    }
  },
  {
    name: 'GitLab',
    icon: '🦊',
    check: async (u) => {
      try {
        const res = await fetch(`https://gitlab.com/api/v4/users?username=${encodeURIComponent(u)}`);
        if (res.status === 200) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            const user = list[0];
            return {
              found: true,
              url: user.web_url || `https://gitlab.com/${u}`,
              avatar: user.avatar_url,
              info: user.name ? `Name: ${user.name}` : 'Active GitLab Profile'
            };
          }
        }
      } catch (e) {}
      return { found: false };
    }
  },
  {
    name: 'Keybase',
    icon: '🔑',
    check: async (u) => {
      try {
        const res = await fetch(`https://keybase.io/_/api/1.0/user/lookup.json?usernames=${encodeURIComponent(u)}`);
        if (res.status === 200) {
          const d = await res.json();
          if (d.status?.name === 'OK' && Array.isArray(d.them) && d.them.length > 0 && d.them[0] !== null) {
            const profile = d.them[0].profile;
            return {
              found: true,
              url: `https://keybase.io/${u}`,
              info: profile?.full_name ? `Name: ${profile.full_name}` : 'PGP Keybase Identity'
            };
          }
        }
      } catch (e) {}
      return { found: false };
    }
  },
  {
    name: 'HackerNews',
    icon: '🔶',
    check: async (u) => {
      try {
        const res = await fetch(`https://hacker-news.firebaseio.com/v0/user/${encodeURIComponent(u)}.json`);
        if (res.status === 200) {
          const d = await res.json();
          if (d && d.id) {
            return {
              found: true,
              url: `https://news.ycombinator.com/user?id=${u}`,
              info: `Karma: ${d.karma || 0} • Created: ${new Date(d.created * 1000).getFullYear()}`
            };
          }
        }
      } catch (e) {}
      return { found: false };
    }
  },
  {
    name: 'Dev.to',
    icon: '👩‍💻',
    check: async (u) => {
      try {
        const res = await fetch(`https://dev.to/api/users/by_username?url=${encodeURIComponent(u)}`);
        if (res.status === 200) {
          const d = await res.json();
          if (d && (d.username || d.id)) {
            return {
              found: true,
              url: `https://dev.to/${u}`,
              avatar: d.profile_image,
              info: d.summary ? d.summary.slice(0, 45) + '...' : (d.name || 'Active Developer')
            };
          }
        }
      } catch (e) {}
      return { found: false };
    }
  },
  {
    name: 'Wikipedia',
    icon: '📚',
    check: async (u) => {
      try {
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=users&ususers=${encodeURIComponent(u)}&usprop=editcount|registration&format=json&origin=*`);
        if (res.status === 200) {
          const d = await res.json();
          const user = d?.query?.users?.[0];
          if (user && user.missing === undefined && user.userid) {
            return {
              found: true,
              url: `https://en.wikipedia.org/wiki/User:${encodeURIComponent(u)}`,
              info: `${user.editcount || 0} edits recorded on Wikipedia`
            };
          }
        }
      } catch (e) {}
      return { found: false };
    }
  },
  {
    name: 'Chess.com',
    icon: '♟️',
    check: async (u) => {
      try {
        const res = await fetch(`https://api.chess.com/pub/player/${encodeURIComponent(u)}`);
        if (res.status === 200) {
          const d = await res.json();
          if (d && d.player_id) {
            return {
              found: true,
              url: d.url || `https://www.chess.com/member/${u}`,
              avatar: d.avatar,
              info: d.title ? `Title: ${d.title} • Status: ${d.status}` : `Status: ${d.status || 'Active'}`
            };
          }
        }
      } catch (e) {}
      return { found: false };
    }
  },
  {
    name: 'Codeforces',
    icon: '🏆',
    check: async (u) => {
      try {
        const res = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(u)}`);
        if (res.status === 200) {
          const d = await res.json();
          if (d.status === 'OK' && d.result?.[0]) {
            const user = d.result[0];
            return {
              found: true,
              url: `https://codeforces.com/profile/${u}`,
              avatar: user.avatar,
              info: `Rank: ${user.rank || 'Unrated'} • Rating: ${user.rating || 0}`
            };
          }
        }
      } catch (e) {}
      return { found: false };
    }
  },
  {
    name: 'Scratch (MIT)',
    icon: '🐱',
    check: async (u) => {
      try {
        const res = await fetch(`https://api.scratch.mit.edu/users/${encodeURIComponent(u)}`);
        if (res.status === 200) {
          const d = await res.json();
          if (d && d.username) {
            return {
              found: true,
              url: `https://scratch.mit.edu/users/${u}`,
              avatar: d.profile?.images?.['90x90'] || d.profile?.images?.['60x60'],
              info: d.profile?.country ? `Country: ${d.profile.country}` : 'Scratch Community Member'
            };
          }
        }
      } catch (e) {}
      return { found: false };
    }
  },
  {
    name: 'Duolingo',
    icon: '🦉',
    check: async (u) => {
      try {
        const res = await fetch(`https://www.duolingo.com/2017-06-30/users?username=${encodeURIComponent(u)}`);
        if (res.status === 200) {
          const d = await res.json();
          if (Array.isArray(d?.users) && d.users.length > 0) {
            const user = d.users[0];
            return {
              found: true,
              url: `https://www.duolingo.com/profile/${u}`,
              avatar: user.picture ? `${user.picture}/large` : null,
              info: user.name ? `Name: ${user.name} • Streak: ${user.streak || 0}` : `Streak: ${user.streak || 0}`
            };
          }
        }
      } catch (e) {}
      return { found: false };
    }
  },
  {
    name: 'Mastodon',
    icon: '🐘',
    check: async (u) => {
      try {
        const res = await fetch(`https://mastodon.social/api/v1/accounts/lookup?acct=${encodeURIComponent(u)}`);
        if (res.status === 200) {
          const d = await res.json();
          if (d && d.username) {
            return {
              found: true,
              url: d.url || `https://mastodon.social/@${u}`,
              avatar: d.avatar,
              info: `${d.followers_count || 0} followers on Fediverse`
            };
          }
        }
      } catch (e) {}
      return { found: false };
    }
  },
  {
    name: 'Reddit',
    icon: '🤖',
    check: async (u) => {
      try {
        const target = `https://www.reddit.com/user/${encodeURIComponent(u)}/about.json`;
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(target)}`);
        if (res.status === 200) {
          const wrap = await res.json();
          if (wrap?.status?.http_code === 200 && wrap.contents) {
            const d = JSON.parse(wrap.contents);
            if (d?.data?.name) {
              return {
                found: true,
                url: `https://reddit.com/user/${u}`,
                info: `Karma: ${(d.data.total_karma || (d.data.link_karma + d.data.comment_karma)) || 0}`
              };
            }
          }
        }
      } catch (e) {}
      return { found: false };
    }
  },
  {
    name: 'Telegram',
    icon: '✈️',
    check: async (u) => {
      try {
        const target = `https://t.me/${encodeURIComponent(u)}`;
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(target)}`);
        if (res.status === 200) {
          const wrap = await res.json();
          if (wrap.contents && wrap.contents.includes('tgme_page_title') && !wrap.contents.includes('If you have Telegram, you can view and join')) {
            return {
              found: true,
              url: `https://t.me/${u}`,
              info: 'Telegram Public Account / Channel'
            };
          }
        }
      } catch (e) {}
      return { found: false };
    }
  },
  {
    name: 'Steam',
    icon: '🎮',
    check: async (u) => {
      try {
        const target = `https://steamcommunity.com/id/${encodeURIComponent(u)}`;
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(target)}`);
        if (res.status === 200) {
          const wrap = await res.json();
          if (wrap.contents && wrap.contents.includes('actual_persona_name')) {
            return {
              found: true,
              url: target,
              info: 'Active Steam Gaming Profile'
            };
          }
        }
      } catch (e) {}
      return { found: false };
    }
  },
  {
    name: 'DockerHub',
    icon: '🐳',
    check: async (u) => {
      try {
        const target = `https://hub.docker.com/v2/users/${encodeURIComponent(u)}/`;
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(target)}`);
        if (res.status === 200) {
          const wrap = await res.json();
          if (wrap?.status?.http_code === 200 && wrap.contents) {
            const d = JSON.parse(wrap.contents);
            if (d?.username) {
              return {
                found: true,
                url: `https://hub.docker.com/u/${u}`,
                info: 'Docker Registry Developer'
              };
            }
          }
        }
      } catch (e) {}
      return { found: false };
    }
  },
  {
    name: 'Gravatar',
    icon: '👤',
    check: async (u) => {
      try {
        const target = `https://en.gravatar.com/${encodeURIComponent(u)}.json`;
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(target)}`);
        if (res.status === 200) {
          const wrap = await res.json();
          if (wrap?.status?.http_code === 200 && wrap.contents) {
            const d = JSON.parse(wrap.contents);
            if (d?.entry?.length > 0) {
              const entry = d.entry[0];
              return {
                found: true,
                url: entry.profileUrl || `https://en.gravatar.com/${u}`,
                avatar: entry.thumbnailUrl,
                info: entry.displayName || 'Gravatar Global Profile'
              };
            }
          }
        }
      } catch (e) {}
      return { found: false };
    }
  }
];

let currentHuntResults = [];
let currentFilter = 'found';

async function huntUsername() {
  const input = document.getElementById('username-input');
  const u = input.value.trim().replace(/^@/, '');
  if (!u) {
    showToast('Enter a username to hunt', 'error');
    return;
  }

  const container = document.getElementById('username-results');
  const btn = document.getElementById('btn-username');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'PROBING...';
  }

  currentHuntResults = [];
  currentFilter = 'found';

  // Skeleton UI with live scanner progress bar
  container.innerHTML = `
    <div class="osint-scanner-bar">
      <div class="osint-scanner-header">
        <span id="osint-status-text">⚡ PROBING 16 PLATFORMS IN BACKGROUND FOR "@${u}"...</span>
        <span class="osint-counter-badge" id="osint-counter-badge">
          <span>🎯</span> <span id="osint-found-count">0</span> CONFIRMED
        </span>
      </div>
      <div class="osint-progress-wrap">
        <div class="osint-progress-fill" id="osint-progress-fill"></div>
      </div>
    </div>
    <div class="osint-filter-wrap" id="osint-filter-wrap" style="display: none;">
      <button class="osint-filter-btn active" id="filter-btn-found" onclick="setOsintFilter('found')">
        CONFIRMED ACTIVE (<span id="filter-count-found">0</span>)
      </button>
      <button class="osint-filter-btn" id="filter-btn-all" onclick="setOsintFilter('all')">
        ALL SCANNED (<span id="filter-count-all">0</span>)
      </button>
    </div>
    <div class="osint-results-feed" id="osint-feed"></div>
  `;

  addLog('warn', `Initiating live multi-platform background probe on: @${u}`);
  showToast(`Probing platforms for @${u}...`);

  const feed = document.getElementById('osint-feed');
  const fill = document.getElementById('osint-progress-fill');
  const statusText = document.getElementById('osint-status-text');
  const foundCountEl = document.getElementById('osint-found-count');
  const filterWrap = document.getElementById('osint-filter-wrap');

  let completed = 0;
  let foundCount = 0;
  const total = OSINT_TARGETS.length;

  // Run all checks in parallel with individual timeouts
  const probeTasks = OSINT_TARGETS.map(async (target) => {
    let result = { target: target.name, icon: target.icon, found: false };
    try {
      const probePromise = target.check(u);
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ found: false }), 6000));
      const res = await Promise.race([probePromise, timeoutPromise]);
      if (res && res.found) {
        result = { ...result, ...res, found: true };
      }
    } catch (err) {
      result.found = false;
    }

    completed++;
    currentHuntResults.push(result);

    const pct = Math.round((completed / total) * 100);
    if (fill) fill.style.width = `${pct}%`;

    // If found, append immediately to feed (only verified accounts shown!)
    if (result.found) {
      foundCount++;
      if (foundCountEl) foundCountEl.textContent = foundCount;
      appendFoundItem(feed, result, u);
    }

    if (statusText) {
      statusText.textContent = `⚡ SCANNING [${completed}/${total}] • Testing ${target.name}...`;
    }
  });

  await Promise.all(probeTasks);

  if (btn) {
    btn.disabled = false;
    btn.textContent = 'HUNT';
  }

  if (filterWrap) filterWrap.style.display = 'flex';
  const cFound = document.getElementById('filter-count-found');
  const cAll = document.getElementById('filter-count-all');
  if (cFound) cFound.textContent = foundCount;
  if (cAll) cAll.textContent = total;

  if (statusText) {
    if (foundCount > 0) {
      statusText.textContent = `✅ RECON COMPLETE: ${foundCount} VERIFIED ACCOUNTS FOUND FOR "@${u}"`;
      statusText.style.color = 'var(--neon-green)';
    } else {
      statusText.textContent = `⚠️ SCAN COMPLETE: NO ACTIVE PROFILES DETECTED FOR "@${u}"`;
      statusText.style.color = 'var(--neon-orange)';
    }
  }

  if (foundCount === 0) {
    feed.innerHTML = `
      <div class="osint-empty-notice">
        <span class="osint-empty-icon">🔎</span>
        <span>No public profiles verified for <strong>@${u}</strong> across 16 tested platforms.</span>
        <span style="font-size:0.68rem;color:var(--text-dim);">Username is available/unclaimed or profiles are set to private.</span>
      </div>
    `;
  }

  addLog('success', `Username Recon Complete: ${foundCount} verified accounts discovered for target @${u}`);
  showToast(`Recon finished: ${foundCount} verified accounts for @${u}`);
}

function setOsintFilter(type) {
  currentFilter = type;
  document.getElementById('filter-btn-found')?.classList.toggle('active', type === 'found');
  document.getElementById('filter-btn-all')?.classList.toggle('active', type === 'all');

  const feed = document.getElementById('osint-feed');
  if (!feed) return;
  feed.innerHTML = '';

  const items = type === 'found' 
    ? currentHuntResults.filter(r => r.found)
    : currentHuntResults;

  if (items.length === 0) {
    feed.innerHTML = `
      <div class="osint-empty-notice">
        <span class="osint-empty-icon">🔎</span>
        <span>No active profiles match this filter.</span>
      </div>
    `;
    return;
  }

  const u = document.getElementById('username-input').value.trim().replace(/^@/, '');
  items.forEach(item => {
    appendFoundItem(feed, item, u);
  });
}

function appendFoundItem(container, res, u) {
  const item = document.createElement('div');
  item.className = `osint-found-item ${res.found ? 'found' : 'not-found'}`;
  
  const avatarHtml = res.avatar 
    ? `<img src="${res.avatar}" alt="${res.target}" class="osint-avatar" onerror="this.style.display='none'" />`
    : `<div class="osint-platform-icon-wrap">${res.icon || '🌐'}</div>`;

  const tagHtml = res.found
    ? `<span class="osint-tag-confirmed">CONFIRMED</span>`
    : `<span class="osint-tag-unclaimed">UNCLAIMED / 404</span>`;

  const actionHtml = res.found
    ? `<a href="${res.url}" target="_blank" rel="noopener noreferrer" class="osint-link-btn">OPEN &rarr;</a>`
    : `<span style="font-family:var(--font-mono);font-size:0.65rem;color:var(--text-dim);">NOT FOUND</span>`;

  item.innerHTML = `
    <div class="osint-left-group">
      ${avatarHtml}
      <div class="osint-meta">
        <div class="osint-meta-title">
          <span>${res.target}</span>
          ${tagHtml}
        </div>
        <div class="osint-meta-sub">${res.found ? (res.info || `@${u}`) : `No active user @${u}`}</div>
      </div>
    </div>
    ${actionHtml}
  `;

  container.appendChild(item);
}

function lookupEmail() {
  const email = document.getElementById('email-input').value.trim();
  if (!email || !email.includes('@')) { showToast('Enter a valid email address','error'); return; }
  document.getElementById('email-results').innerHTML = `
    <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-dim);margin-bottom:0.5rem;">INTEL FOR: "${email}"</div>
    <div class="platform-row"><span class="platform-name">HIBP</span><a href="https://haveibeenpwned.com/account/${encodeURIComponent(email)}" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">CHECK</a></div>
    <div class="platform-row"><span class="platform-name">DEHASHED</span><a href="https://dehashed.com/search?query=${encodeURIComponent(email)}" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">CHECK</a></div>
    <div class="platform-row"><span class="platform-name">INTELX</span><a href="https://intelx.io/?s=${encodeURIComponent(email)}" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">CHECK</a></div>
  `;
  addLog('success', `Email intel pulled for: ${email}`);
  showToast(`Email intel ready for "${email}"`);
}

function generateLoggerLink() {
  const dest = document.getElementById('link-target').value.trim();
  if (!dest) { showToast('Enter a destination URL','error'); return; }
  document.getElementById('link-results').innerHTML = `
    <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-dim);margin-bottom:0.5rem;">TRACKING LINKS:</div>
    <div class="platform-row"><span class="platform-name">Grabify</span><a href="https://grabify.link/track?url=${encodeURIComponent(dest)}" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">OPEN</a></div>
    <div class="platform-row"><span class="platform-name">IPLogger</span><a href="https://iplogger.org/logger2/?url=${encodeURIComponent(dest)}" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">OPEN</a></div>
    <div style="margin-top:0.5rem;font-size:0.62rem;color:var(--neon-orange);font-family:var(--font-mono);">Use VPN when viewing logs.</div>
  `;
  addLog('success', `Logger links generated for: ${dest}`);
  showToast('Logger links generated!');
}

function checkBreach() {
  const query = document.getElementById('breach-input').value.trim();
  if (!query) { showToast('Enter email or username','error'); return; }
  document.getElementById('breach-results').innerHTML = `
    <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-dim);margin-bottom:0.5rem;">BREACH SOURCES:</div>
    <div class="platform-row"><span class="platform-name">HaveIBeenPwned</span><a href="https://haveibeenpwned.com/account/${encodeURIComponent(query)}" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">CHECK</a></div>
    <div class="platform-row"><span class="platform-name">Dehashed</span><a href="https://dehashed.com/search?query=${encodeURIComponent(query)}" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">CHECK</a></div>
    <div class="platform-row"><span class="platform-name">IntelX</span><a href="https://intelx.io/?s=${encodeURIComponent(query)}" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">CHECK</a></div>
    <div class="platform-row"><span class="platform-name">LeakCheck</span><a href="https://leakcheck.io/check?query=${encodeURIComponent(query)}" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">CHECK</a></div>
    <div class="platform-row"><span class="platform-name">BreachDirectory</span><a href="https://breachdirectory.org" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">CHECK</a></div>
  `;
  addLog('success', `Breach sources loaded for: ${query}`);
  showToast('Breach intel sources loaded!');
}

function initLogTimestamp() { const el=document.getElementById('log-init-time'); if(el) el.textContent=getTimestamp(); }

function addLog(type,message) {
  logCount++;
  const stream=document.getElementById('log-stream');
  if (!stream) return;
  const el=document.createElement('div');
  el.className=`log-entry log-${type}`;
  el.innerHTML=`<span class="log-time">${getTimestamp()}</span><span class="log-msg">${message}</span>`;
  stream.appendChild(el);
  stream.scrollTop=stream.scrollHeight;
  const countEl = document.getElementById('log-count');
  if (countEl) countEl.textContent=logCount+' entries';
}

function clearLog() {
  const stream = document.getElementById('log-stream');
  if (stream) stream.innerHTML='';
  logCount=0;
  const countEl = document.getElementById('log-count');
  if (countEl) countEl.textContent='0 entries';
}

function getTimestamp() {
  const d=new Date();
  return `[${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}]`;
}

function showToast(msg,type='success') {
  const c=document.getElementById('toast-container');
  if (!c) return;
  const t=document.createElement('div');
  t.className=`toast ${type}`;
  t.textContent=msg;
  c.appendChild(t);
  setTimeout(()=>t.remove(),3100);
}

function toggleMenu() { document.getElementById('main-nav')?.classList.toggle('open'); }