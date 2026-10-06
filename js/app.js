/* =====================================================
   IPNEON -- app.js  |  Author: ramaneon
   ===================================================== */
'use strict';

const TOOLS = [
  { id:1,  icon:'🔗', name:'IP Logger Links',        desc:'Generate masked redirect links that silently capture the visitor IP. Works like Grabify but with custom domains for higher trust.',         tags:['active','network'],   detail:'<h4>HOW IT WORKS</h4><p>Create a redirect URL. When victim clicks, their browser hits your logger endpoint capturing IP before redirecting.</p><h4>TOOLS</h4><p><code>Grabify.link</code> · <code>IPLogger.org</code> · Custom PHP logger</p><h4>OPSEC</h4><p>Use VPN when running your logger. Victim can potentially get YOUR IP.</p>' },
  { id:2,  icon:'📧', name:'Email Login Trap',        desc:'Create a fake Gmail account and let the target log in. Login history reveals their originating IP address.',                                tags:['active','social'],    detail:'<h4>HOW IT WORKS</h4><p>Create throwaway Google account. When target logs in, check Account > Security > Recent Activity to find their IP.</p><h4>PLATFORMS</h4><p><code>Google</code> · <code>Microsoft</code> · <code>ProtonMail</code></p><h4>OPSEC</h4><p>Access login history from a VPN — the page also logs YOUR access IP.</p>' },
  { id:3,  icon:'🖥️', name:'Screen Share IP Reveal',  desc:'During a screenshare, direct the target to whatismyip.com — their IP appears on screen.',                                                    tags:['passive','social'],   detail:'<h4>HOW IT WORKS</h4><p>While in a screenshare (Discord, Zoom), navigate victim to <code>whatismyip.com</code> or Google "what is my IP".</p><h4>SOCIAL ENGINEERING</h4><p>Tell them you need to help troubleshoot their internet. Works on non-technical targets.</p>' },
  { id:4,  icon:'🌐', name:'Custom Website Logger',   desc:'Deploy a free-hosted website with an embedded IP capture script. Far more trusted than known logger links.',                               tags:['active','network'],   detail:'<h4>HOW IT WORKS</h4><p>Host a page on Netlify/GitHub Pages with PHP or JS IP capture. Victims trust it because it looks real.</p><h4>TECH STACK</h4><p><code>PHP: $_SERVER[REMOTE_ADDR]</code> · Netlify Functions · Serverless backend</p>' },
  { id:5,  icon:'🎮', name:'Steam Account Lure',      desc:'Create a fake Steam account with Steam Guard. When victim logs in, you receive their IP via the Steam Guard email.',                       tags:['active','social'],    detail:'<h4>HOW IT WORKS</h4><p>Enable Steam Guard 2FA. Offer account as free giveaway. Steam Guard sends verification code + login location/IP to YOUR email.</p>' },
  { id:6,  icon:'📺', name:'Netflix Account Trap',    desc:'Fake Netflix credentials. Login history in account settings reveals IP addresses of each session.',                                         tags:['active','social'],    detail:'<h4>HOW IT WORKS</h4><p>Create Netflix account, give creds to target. Check Account > Recent Device Streaming Activity to get their IP, device, and timestamp.</p>' },
  { id:7,  icon:'🎯', name:'GTA V Social Club',       desc:'During screen share, have target navigate to GTA Social Club Network tab — their WAN IP is displayed directly.',                           tags:['passive','social'],   detail:'<h4>HOW IT WORKS</h4><p>GTA V Social Club launcher shows network info including player IP in Network settings tab. Visible during screenshare.</p>' },
  { id:8,  icon:'💥', name:'Black Ops 3 Network',     desc:'CoD: Black Ops 3 Settings > Network panel exposes the player network IP.',                                                                  tags:['passive','social'],   detail:'<h4>HOW IT WORKS</h4><p>During screenshare, ask them to go to Settings > Network. Their external IP is shown in network diagnostics.</p>' },
  { id:9,  icon:'🎮', name:'Console Packet Sniffer',  desc:'Use WireShark or Console Sniffer during PS/Xbox party sessions to capture all peer IPs from UDP packets.',                                  tags:['active','network'],   detail:'<h4>TOOLS</h4><p><code>PS4:</code> Console Sniffer · PSN Resolver | <code>Xbox:</code> ReLanc Remastered | <code>Any:</code> Wireshark filter <code>udp.port==3478</code></p><h4>HOW</h4><p>All peers must connect directly P2P — their UDP packets contain source IPs.</p>' },
  { id:10, icon:'🤖', name:'Discord Verify Trap',     desc:'Create a fake Discord verify flow requiring members to click an IP logger link to gain access.',                                            tags:['active','social'],    detail:'<h4>HOW IT WORKS</h4><p>Set up a Discord server requiring verification. Verification link = your IP logger URL. Social pressure drives clicks.</p><h4>SETUP</h4><p>Use MEE6 to restrict channels · Post logger link as verification step</p>' },
  { id:11, icon:'🔑', name:'Discord Token Grabber',   desc:'Deploy a token grabber payload that exfiltrates the victims Discord token and IP address to a webhook.',                                    tags:['active','network'],   detail:'<h4>HOW IT WORKS</h4><p>Token grabber reads Discord local storage token + sends system info including IP to a Discord webhook via HTTP POST.</p><h4>DELIVERY</h4><p>Fake mods · Free Nitro .exe · Malicious bots</p>' },
  { id:12, icon:'💻', name:'EXE/PY IP Grabber',       desc:'Custom Python or compiled .exe payload that silently fetches and exfiltrates the victims IP to your server or webhook.',                   tags:['active','network'],   detail:'<h4>PYTHON</h4><p><code>requests.get(https://api.ipify.org)</code> + POST to webhook. Package with PyInstaller.</p><h4>C# .NET</h4><p><code>new WebClient().DownloadString(ipify)</code> + WebRequest exfil.</p>' },
  { id:13, icon:'🎁', name:'Epic Games 2FA Trap',     desc:'Create fake Epic Games account with 2FA. When victim logs in, their IP is sent to your email with the 2FA code.',                         tags:['active','social'],    detail:'<h4>HOW IT WORKS</h4><p>Create Epic account, enable email 2FA, offer free V-Bucks. Epic sends 2FA code to YOUR email with login metadata including IP geolocation.</p>' },
  { id:14, icon:'🔍', name:'Social Engineering Ask',  desc:'Simply ask the target to Google "what is my IP" and read the numbers to you under a believable pretext.',                                  tags:['passive','social'],   detail:'<h4>PRETEXTS</h4><p>"I need your IP to set up the Minecraft server" · "Tech support needs it to fix your connection" · "The game needs your IP to whitelist you"</p>' },
  { id:15, icon:'🏠', name:'Physical Network Access', desc:'Connect to target WiFi and query your own IP — their router public IP is your IP on that network.',                                         tags:['active','network'],   detail:'<h4>HOW IT WORKS</h4><p>Connect to victim WiFi. All devices share the same public IP. Search "what is my IP" — the result IS their home IP.</p><h4>EXTRA</h4><p><code>nmap -sn 192.168.1.0/24</code> reveals all connected devices.</p>' },
  { id:16, icon:'💣', name:'Stress Test Service Trap',desc:'Create a Stressthem account for the target. When they log in, the service logs their IP in login history.',                                  tags:['active','social'],    detail:'<h4>HOW IT WORKS</h4><p>Create Stressthem/booter account. Give credentials to victim. Login history reveals their IP in account settings.</p>' },
  { id:17, icon:'🚗', name:'FiveM Server Logger',     desc:'Host a FiveM GTA multiplayer server. Every connecting player IP is logged in server-side connection events.',                               tags:['active','network'],   detail:'<h4>CODE</h4><p><code>AddEventHandler("playerConnecting", function(name, setKick, def) { print(GetPlayerEndpoint(source)) })</code></p><h4>ALSO</h4><p>Works with any Ragemp, alt:V, or FiveM server framework.</p>' },
  { id:18, icon:'🔫', name:'CS:GO / Source Server',   desc:'Run any Source engine game server. All connecting clients have their IPs logged automatically in server connection logs.',                  tags:['active','network'],   detail:'<h4>HOW IT WORKS</h4><p>Source engine logs all connections with timestamps and IPs. Check <code>logs/L*.log</code> in server dir.</p><h4>WORKS WITH</h4><p>CS2 · TF2 · GMod · Minecraft (server.log) · Rust · Any dedicated game server</p>' },
  { id:19, icon:'🗃️', name:'Leaked Database Search',  desc:'Search breach databases for the targets email/username — leaked records sometimes contain historical IP addresses.',                       tags:['passive','network'],  detail:'<h4>TOOLS</h4><p><code>HaveIBeenPwned</code> · <code>Dehashed</code> · <code>IntelX</code> · <code>BreachDirectory</code> · Telegram leak bots</p>' },
  { id:20, icon:'⛏️', name:'Minecraft Name DB Lookup', desc:'Search Minecraft username databases and old server logs — many contain historical player IPs tied to UUIDs.',                              tags:['passive','network'],  detail:'<h4>TOOLS</h4><p><code>mcbans.com</code> lookup · Old server log archives · Minecraft IP databases · UUID resolvers with historical data</p>' }
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
  const sections = ['home','tools','tracker','osint','about'];
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
function calcThreatScore(data) { let s=5; if(isDatacenter(data.org))s+=30; if(isTorLike(data.org))s+=50; return Math.min(s,100); }

function updateGauge(score) {
  const arc=document.getElementById('gauge-arc');
  const scoreEl=document.getElementById('gauge-score-text');
  const labelEl=document.getElementById('gauge-label');
  const dash=(score/100)*173;
  arc.setAttribute('stroke-dasharray',`${dash} 173`);
  const color=score<30?'#00ff9f':score<60?'#ff8c00':'#ff4ecd';
  arc.setAttribute('stroke',color);
  scoreEl.setAttribute('fill',color);
  scoreEl.textContent=score;
  labelEl.textContent=score<30?'SAFE':score<60?'SUSPICIOUS':'HIGH RISK';
  labelEl.style.color=color;
}

function setScanLoading(on) {
  document.getElementById('scan-btn-text').classList.toggle('hidden',on);
  document.getElementById('scan-loader').classList.toggle('hidden',!on);
  document.getElementById('btn-scan').disabled=on;
}

async function copyRaw() {
  try { await navigator.clipboard.writeText(document.getElementById('raw-output').textContent); showToast('Raw data copied!'); }
  catch(e) { showToast('Copy failed','error'); }
}

function huntUsername() {
  const username=document.getElementById('username-input').value.trim();
  if(!username){showToast('Enter a username','error');return;}
  const results=document.getElementById('username-results');
  addLog('warn',`Username hunt started: ${username}`);
  let html=`<p style="color:var(--text-dim);font-family:var(--font-mono);font-size:0.65rem;margin-bottom:0.6rem;">Click to verify each platform (opens new tab):</p>`;
  PLATFORMS.forEach(p=>{
    const url=p.url+encodeURIComponent(username);
    html+=`<div class="platform-row"><span class="platform-name">${p.name}</span><a href="${url}" target="_blank" class="platform-found" style="text-decoration:none;font-size:0.65rem;font-family:var(--font-mono);">CHECK --></a></div>`;
  });
  results.innerHTML=html;
  addLog('success',`Username links generated for: ${username}`);
  showToast(`Check links for "${username}"`);
}

function lookupEmail() {
  const email=document.getElementById('email-input').value.trim();
  if(!email||!email.includes('@')){showToast('Enter a valid email','error');return;}
  const [user,domain]=email.split('@');
  document.getElementById('email-results').innerHTML=`
    <div class="platform-row"><span class="platform-name">FORMAT</span><span class="platform-found">VALID</span></div>
    <div class="platform-row"><span class="platform-name">DOMAIN</span><span class="platform-found">${domain}</span></div>
    <div class="platform-row"><span class="platform-name">USERNAME</span><span class="platform-found">${user}</span></div>
    <div class="platform-row"><span class="platform-name">HIBP</span><a href="https://haveibeenpwned.com/account/${encodeURIComponent(email)}" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">CHECK</a></div>
    <div class="platform-row"><span class="platform-name">DEHASHED</span><a href="https://dehashed.com/search?query=${encodeURIComponent(email)}" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">CHECK</a></div>
    <div class="platform-row"><span class="platform-name">INTELX</span><a href="https://intelx.io/?s=${encodeURIComponent(email)}" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">CHECK</a></div>
  `;
  addLog('success',`Email intel pulled for: ${email}`);
  showToast(`Email intel ready for "${email}"`);
}

function generateLoggerLink() {
  const dest=document.getElementById('link-target').value.trim();
  if(!dest){showToast('Enter a destination URL','error');return;}
  document.getElementById('link-results').innerHTML=`
    <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-dim);margin-bottom:0.5rem;">TRACKING LINKS:</div>
    <div class="platform-row"><span class="platform-name">Grabify</span><a href="https://grabify.link/track?url=${encodeURIComponent(dest)}" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">OPEN</a></div>
    <div class="platform-row"><span class="platform-name">IPLogger</span><a href="https://iplogger.org/logger2/?url=${encodeURIComponent(dest)}" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">OPEN</a></div>
    <div style="margin-top:0.5rem;font-size:0.62rem;color:var(--neon-orange);font-family:var(--font-mono);">Use VPN when viewing logs.</div>
  `;
  addLog('success',`Logger links generated for: ${dest}`);
  showToast('Logger links generated!');
}

function checkBreach() {
  const query=document.getElementById('breach-input').value.trim();
  if(!query){showToast('Enter email or username','error');return;}
  document.getElementById('breach-results').innerHTML=`
    <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-dim);margin-bottom:0.5rem;">BREACH SOURCES:</div>
    <div class="platform-row"><span class="platform-name">HaveIBeenPwned</span><a href="https://haveibeenpwned.com/account/${encodeURIComponent(query)}" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">CHECK</a></div>
    <div class="platform-row"><span class="platform-name">Dehashed</span><a href="https://dehashed.com/search?query=${encodeURIComponent(query)}" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">CHECK</a></div>
    <div class="platform-row"><span class="platform-name">IntelX</span><a href="https://intelx.io/?s=${encodeURIComponent(query)}" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">CHECK</a></div>
    <div class="platform-row"><span class="platform-name">LeakCheck</span><a href="https://leakcheck.io/check?query=${encodeURIComponent(query)}" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">CHECK</a></div>
    <div class="platform-row"><span class="platform-name">BreachDirectory</span><a href="https://breachdirectory.org" target="_blank" class="platform-found" style="text-decoration:none;font-family:var(--font-mono);font-size:0.65rem;">CHECK</a></div>
  `;
  addLog('success',`Breach sources loaded for: ${query}`);
  showToast('Breach intel sources loaded!');
}

function initLogTimestamp() { const el=document.getElementById('log-init-time'); if(el) el.textContent=getTimestamp(); }

function addLog(type,message) {
  logCount++;
  const stream=document.getElementById('log-stream');
  const el=document.createElement('div');
  el.className=`log-entry log-${type}`;
  el.innerHTML=`<span class="log-time">${getTimestamp()}</span><span class="log-msg">${message}</span>`;
  stream.appendChild(el);
  stream.scrollTop=stream.scrollHeight;
  document.getElementById('log-count').textContent=logCount+' entries';
}

function clearLog() {
  document.getElementById('log-stream').innerHTML='';
  logCount=0;
  document.getElementById('log-count').textContent='0 entries';
}

function getTimestamp() {
  const d=new Date();
  return `[${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}]`;
}

function showToast(msg,type='success') {
  const c=document.getElementById('toast-container');
  const t=document.createElement('div');
  t.className=`toast ${type}`;
  t.textContent=msg;
  c.appendChild(t);
  setTimeout(()=>t.remove(),3100);
}

function toggleMenu() { document.getElementById('main-nav').classList.toggle('open'); }
