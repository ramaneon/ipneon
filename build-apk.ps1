# IPNeon Standalone Android APK Build Automation
# Target: Android 10 to 17 (API 29 - 36+)

$ErrorActionPreference = "Stop"
$SDK = "C:\Users\Admin\AppData\Local\Android\Sdk"
$BUILD_TOOLS = "$SDK\build-tools\36.0.0"
$PLATFORM = "$SDK\platforms\android-36\android.jar"

Write-Host "[+] Preparing directories..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "android\build", "android\gen", "android\build\obj", "android\build\dex", "android\assets\css", "android\assets\js", "release" | Out-Null

Write-Host "[+] Synchronizing web assets..." -ForegroundColor Cyan
Copy-Item "index.html" -Destination "android\assets\" -Force
Copy-Item "css\*" -Destination "android\assets\css\" -Recurse -Force
Copy-Item "js\*" -Destination "android\assets\js\" -Recurse -Force

Write-Host "[+] Compiling Android resources with AAPT2..." -ForegroundColor Cyan
& "$BUILD_TOOLS\aapt2.exe" compile --dir "android\res" -o "android\build\compiled_res.zip"

Write-Host "[+] Linking APK package..." -ForegroundColor Cyan
& "$BUILD_TOOLS\aapt2.exe" link -o "android\build\unaligned.apk" -I "$PLATFORM" --manifest "android\AndroidManifest.xml" -A "android\assets" "android\build\compiled_res.zip" --java "android\gen" --auto-add-overlay

Write-Host "[+] Compiling Java source code..." -ForegroundColor Cyan
& javac -source 8 -target 8 -d "android\build\obj" -cp "$PLATFORM;android\gen" "android\src\com\ramaneon\ipneon\MainActivity.java" "android\gen\com\ramaneon\ipneon\R.java"

Write-Host "[+] Generating DEX bytecode with D8..." -ForegroundColor Cyan
$classes = (Get-ChildItem "android\build\obj" -Recurse -Filter "*.class" | Select-Object -ExpandProperty FullName)
& "$BUILD_TOOLS\d8.bat" --output "android\build\dex" $classes --lib "$PLATFORM" --min-api 29

Write-Host "[+] Injecting DEX and assets..." -ForegroundColor Cyan
& jar uf "android\build\unaligned.apk" -C "android\build\dex" classes.dex
& jar uf "android\build\unaligned.apk" -C "android" assets

Write-Host "[+] Aligning package with zipalign..." -ForegroundColor Cyan
& "$BUILD_TOOLS\zipalign.exe" -p -f 4 "android\build\unaligned.apk" "android\build\aligned.apk"

Write-Host "[+] Signing APK with release key..." -ForegroundColor Cyan
& "$BUILD_TOOLS\apksigner.bat" sign --ks "android\release.keystore" --ks-pass pass:ipneon123 --key-pass pass:ipneon123 --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true --out "ipneon.apk" "android\build\aligned.apk"
Copy-Item "ipneon.apk" -Destination "release\ipneon-v2.0.0.apk" -Force

Write-Host "[✓] Build complete: ipneon.apk generated successfully!" -ForegroundColor Green
