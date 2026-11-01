import re

with open('js/ai-osint.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_header = """/* =====================================================
   AI OSINT ALL-IN-ONE (Browser Native Engine)
   Integrated into IPNeon Suite
   Author: ramaneon
   License: MIT
   ===================================================== */"""

new_header = """/* =====================================================
   AI NEON OSINT ARSENAL — Unified Intelligence Engine
   Integrated into IPNeon Suite
   Author: ramaneon
   License: IPNEON PROPRIETARY COMMERCIAL ROYALTY LICENSE
   ===================================================== */"""

content = content.replace(old_header, new_header, 1)

with open('js/ai-osint.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done:", content[:300])

