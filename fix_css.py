import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Fix all broken .AI OSINT-* selectors -> .ai-osint-*
# Pattern: .AI OSINT- followed by a word character
css = re.sub(r'\.AI OSINT-', '.ai-osint-', css)

# Also fix .AI OSINT-section (without dash suffix)
# Already covered above

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("CSS fixed. Verifying...")
import subprocess
result = subprocess.run(['python', '-c', 'import re; c=open("css/style.css","r",encoding="utf-8").read(); m=re.findall(r"\\.AI OSINT", c); print(f"Remaining broken selectors: {len(m)}")'], capture_output=True, text=True)
print(result.stdout)
print(result.stderr)
