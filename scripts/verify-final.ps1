$ErrorActionPreference = "Continue"
$log = "F:\temp\oakenwrench-v2-final-verify.log"
$done = "F:\temp\oakenwrench-v2-final-verify.done"

Remove-Item -LiteralPath $log, $done -ErrorAction SilentlyContinue
Set-Location "F:\projects\_worktrees\oakenwrench-v2-motion"

npm test *>&1 | Tee-Object -FilePath $log
if ($LASTEXITCODE -ne 0) {
  Set-Content -LiteralPath $done -Value "1"
  exit 1
}

npm run lint *>&1 | Tee-Object -FilePath $log -Append
if ($LASTEXITCODE -ne 0) {
  Set-Content -LiteralPath $done -Value "1"
  exit 1
}

git diff --check *>&1 | Tee-Object -FilePath $log -Append
$code = $LASTEXITCODE
Set-Content -LiteralPath $done -Value $code
exit $code
