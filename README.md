# [IPNEON] — Advanced IP Intelligence Suite

> Professional-grade cybersecurity tool for IP intelligence, OSINT, geolocation, threat analysis, and network reconnaissance.

![IPNeon Banner](https://img.shields.io/badge/IPNeon-Cybersecurity-00ff9f?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzAwZmY5ZiIgZD0iTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01ek0yIDE3bDEwIDUgMTAtNS0xMC01LTEwIDV6Ii8+PC9zdmc+)
![GitHub stars](https://img.shields.io/github/stars/ramaneon/ipneon?style=for-the-badge&color=00ff9f)
![License](https://img.shields.io/badge/License-MIT-00e5ff?style=for-the-badge)

## Features

### 20 IP Tracking Vectors
| # | Vector | Type |
|---|--------|------|
| 01 | IP Logger Links (Grabify-style) | Active/Network |
| 02 | Email Login Trap (Gmail/Microsoft) | Active/Social |
| 03 | Screen Share IP Reveal | Passive/Social |
| 04 | Custom Website Logger | Active/Network |
| 05 | Steam Account Lure | Active/Social |
| 06 | Netflix Account Trap | Active/Social |
| 07 | GTA V Social Club Network Tab | Passive/Social |
| 08 | Black Ops 3 Network Settings | Passive/Social |
| 09 | Console Packet Sniffer (PS/Xbox) | Active/Network |
| 10 | Discord Verify Trap | Active/Social |
| 11 | Discord Token Grabber | Active/Network |
| 12 | EXE/PY IP Grabber | Active/Network |
| 13 | Epic Games 2FA Trap | Active/Social |
| 14 | Social Engineering Ask | Passive/Social |
| 15 | Physical Network Access | Active/Network |
| 16 | Stress Test Service Trap | Active/Social |
| 17 | FiveM Server Logger | Active/Network |
| 18 | CS:GO / Source Server Logger | Active/Network |
| 19 | Leaked Database Search | Passive/Network |
| 20 | Minecraft Name DB Lookup | Passive/Network |

### Core Tools
- **IP Tracker** — Real-time geolocation, ISP, ASN, threat score, and map for any IP
- **Username Hunter** — Check username across 20+ platforms
- **Email Intel** — Breach check, deliverability, and reputation
- **Link Logger** — Generate masked tracking redirect links
- **Breach Check** — Search HIBP, Dehashed, IntelX, LeakCheck

### UI Features
- Matrix rain background animation
- Neon cyberpunk design with glassmorphism
- Animated threat score gauge
- OpenStreetMap location embed
- Live activity log
- Mobile responsive

## Tech Stack

- **HTML5** — Semantic structure
- **Vanilla CSS** — Custom design system with CSS variables
- **Vanilla JS** — No frameworks, zero dependencies
- **APIs** — ipapi.co (geolocation), ipify.org (self-IP)
- **Maps** — OpenStreetMap embed

## Quick Start

```bash
git clone https://github.com/ramaneon/ipneon.git
cd ipneon
# Open index.html in any browser — no build step required
```

Or just open `index.html` directly in your browser. No server needed for the core features.

## File Structure

```
ipneon/
├── index.html          # Main entry point
├── css/
│   └── style.css       # Full design system
├── js/
│   └── app.js          # All logic — tools, scanner, OSINT
├── assets/             # Static assets
└── README.md
```

## Disclaimer

> **For educational and authorized security testing purposes only.**
> The author is not responsible for any misuse of this tool.
> Always obtain proper authorization before using any IP tracking techniques.

## Author

Built by [ramaneon](https://github.com/ramaneon)

---
*Resistance is where the arc jumps — not where the current stops.*
