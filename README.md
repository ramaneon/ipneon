# [IPNEON] — Advanced IP Intelligence & Browser Fingerprinting Suite

> Professional-grade cybersecurity tool for IP intelligence, OSINT reconnaissance, threat geolocation, and hardware/browser fingerprinting.

[![Live Tool](https://img.shields.io/badge/🌐%20LIVE%20TOOL-ramaneon.github.io/ipneon-00ff9f?style=for-the-badge)](https://ramaneon.github.io/ipneon/)
![License](https://img.shields.io/badge/License-MIT-00e5ff?style=for-the-badge)
![GitHub stars](https://img.shields.io/github/stars/ramaneon/ipneon?style=for-the-badge&color=00ff9f)
![GitHub Pages](https://img.shields.io/github/deployments/ramaneon/ipneon/github-pages?label=Pages&style=for-the-badge&color=b84fff)

## 🌐 Live Tool

### **[https://ramaneon.github.io/ipneon/](https://ramaneon.github.io/ipneon/)**

Free, browser-based, zero install, client-side execution. Built for ethical security researchers, penetration testers, and OSINT analysts.

---

## 🔥 Features & Capabilities

### 👁️ Browser & Device Fingerprinting Engine *(Inspired by fingerprint.to)*
Client-side device entropy extraction generating a unique 64-bit forensic Visitor Identifier:
- **Canvas 2D Fingerprint**: Renders subpixel gradients, shadows, emoji glyphs, and alpha blend operations to calculate a unique 32-bit MurmurHash3 signature. Displays a live visual canvas preview.
- **AudioContext Acoustic Dynamics**: Synthesizes a 10kHz triangular wave through dynamic compressor nodes using `OfflineAudioContext`, extracting DAC and DSP float32 buffer resonance hashes.
- **WebGL & GPU Architecture**: Queries unmasked GPU Renderer and Vendor via `WEBGL_debug_renderer_info` (e.g. NVIDIA RTX, Intel Iris, Apple M-Series), max texture limits, and WebGL 2.0 capabilities.
- **Hardware & Sensor Metrics**: Probes logical CPU threads (`hardwareConcurrency`), RAM memory quota, screen geometry/DPR, touch capability (`maxTouchPoints`), and battery status.
- **WebRTC Local IP Leak**: Probes Google STUN servers (`stun.l.google.com:19302`) via `RTCPeerConnection` to expose private LAN subnet IPs (192.168.x.x, 10.x.x.x) bypassing basic proxies.
- **Bot & Privacy Heuristics**: Automated checks for Headless / Selenium WebDriver (`navigator.webdriver`), Incognito/Private window heuristics, AdBlockers, and Storage quotas.
- **System Typography Probing**: Baseline differential font measurement probing 20+ installed system typefaces.
- **Forensic Export**: One-click JSON profile export for audits and forensic logs.

### 20 IP Tracking Vectors
Comprehensive educational and penetration testing compendium of 20 IP capture vectors:
| # | Vector | Type | Description |
|---|--------|------|-------------|
| 01 | IP Logger Links | Active / Network | Masked redirect endpoints capturing visitor telemetry |
| 02 | Email Login Trap | Active / Social | Disposable accounts logging authentication IPs |
| 03 | Screen Share IP Reveal | Passive / Social | Remote screen diagnostics exposing WAN endpoints |
| 04 | Custom Website Logger | Active / Network | Dedicated vanity landing pages with serverless logging |
| 05 | Steam Account Lure | Active / Social | Steam Guard 2FA notification telemetry |
| 06 | Netflix Account Trap | Active / Social | Streaming device activity access logs |
| 07 | GTA V Social Club | Passive / Social | In-game network diagnostics WAN IP reveal |
| 08 | Black Ops 3 Network | Passive / Social | In-game connection telemetry and network panels |
| 09 | Console Packet Sniffer | Active / Network | Wireshark & P2P UDP packet capture for console lobbies |
| 10 | Discord Verify Trap | Active / Social | Verification gates requiring logged click-through |
| 11 | Discord Token Grabber | Active / Network | Session and network exfiltration payloads |
| 12 | EXE/PY IP Grabber | Active / Network | Standalone Python / C# lightweight reconnaissance agents |
| 13 | Epic Games 2FA Trap | Active / Social | Authentication challenge email metadata |
| 14 | Social Engineering Ask | Passive / Social | Human vector connection troubleshooting pretexts |
| 15 | Physical Network Access | Active / Network | Local WLAN inspection and ARP/subnet scanning |
| 16 | Stress Test Service Trap | Active / Social | Booter account login history inspection |
| 17 | FiveM Server Logger | Active / Network | Server-side player connection hooks |
| 18 | CS:GO / Source Server Logger | Active / Network | Dedicated engine connection and RCON logs |
| 19 | Leaked Database Search | Passive / Network | Historical IP records from public breach archives |
| 20 | Minecraft Name DB Lookup | Passive / Network | Historical player UUID and server log resolvers |

### Core OSINT Arsenal
- **IP Tracker**: Real-time geolocation, ISP, ASN, threat score calculation, and OpenStreetMap rendering.
- **Username Hunter**: Instant cross-platform check across 20+ major social and developer platforms.
- **Email Intel**: Fast lookups on HaveIBeenPwned, DeHashed, and IntelX.
- **Link Logger Builder**: Quick redirect generator with Grabify & IPLogger integration.
- **Breach Check**: Multi-source breach intelligence lookup.
- **Live Terminal & Matrix Background**: Real-time activity log with timestamps and cyberpunk matrix rain canvas.

---

## 🚀 Running Locally

No installation or build steps required. Plain HTML5, CSS3, and modern Vanilla ES6+:

```bash
git clone https://github.com/ramaneon/ipneon.git
cd ipneon
# Open directly in your browser:
start index.html
```

---

## 🔒 Ethics & Disclaimer

This tool is created strictly for educational, defensive, and authorized cybersecurity assessment purposes. Gathering intelligence without permission may violate local computer misuse and privacy legislation.

---

## 👨‍💻 Author

Built with high voltage by [ramaneon](https://github.com/ramaneon).