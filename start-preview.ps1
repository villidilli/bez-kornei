$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) { & $node.Source (Join-Path $PSScriptRoot 'serve-preview.cjs'); exit $LASTEXITCODE }
$bundled = Get-ChildItem -Path "$env:LOCALAPPDATA\OpenAI\Codex\runtimes\cua_node\*\bin\node.exe" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($bundled) { & $bundled.FullName (Join-Path $PSScriptRoot 'serve-preview.cjs'); exit $LASTEXITCODE }
if (Get-Command py -ErrorAction SilentlyContinue) { py -3 -m http.server 8765 --bind 127.0.0.1 --directory bez-korney-preview; exit $LASTEXITCODE }
throw 'Node.js or Python 3 is required to start the preview.'