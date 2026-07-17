[CmdletBinding()]
param(
    [string]$Source = 'C:\Users\Wenstar\Downloads\Telegram Desktop\video_2026-07-16_22-05-18.mp4',
    [string]$OutputRoot = (Join-Path $PSScriptRoot '..\public\media\v2')
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

if (-not (Test-Path -LiteralPath $Source -PathType Leaf)) {
    throw "Latest edited video does not exist: $Source"
}

$ffmpeg = (Get-Command ffmpeg -ErrorAction Stop).Source
$ffprobe = (Get-Command ffprobe -ErrorAction Stop).Source
$root = [System.IO.Path]::GetFullPath($OutputRoot)
$audioRoot = Join-Path $root 'audio'
$logRoot = Join-Path $root 'logs'
$video = Join-Path $root 'oakenwrench-v2-latest-scrub.mp4'
$audio = Join-Path $audioRoot 'oakenwrench-v2-latest.m4a'
$poster = Join-Path $root 'oakenwrench-v2-latest-poster.webp'
$log = Join-Path $logRoot 'build-v2-media.log'

New-Item -ItemType Directory -Force -Path $root, $audioRoot, $logRoot | Out-Null

# Remove every obsolete v2 derivative. The approved v1 media lives elsewhere and is untouched.
Get-ChildItem -LiteralPath $root -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -ne (Split-Path $poster -Leaf) } |
    Remove-Item -Force
Get-ChildItem -LiteralPath $audioRoot -File -ErrorAction SilentlyContinue | Remove-Item -Force

Set-Content -LiteralPath $log -Encoding utf8 -Value "Latest-cut build started: $((Get-Date).ToString('o'))"

function Invoke-Media {
    param([string]$Label, [string[]]$Arguments)
    Write-Host "[$Label]" -ForegroundColor Cyan
    $previousErrorAction = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        & $ffmpeg @Arguments 2>&1 | Tee-Object -FilePath $log -Append
        $nativeExitCode = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $previousErrorAction
    }
    if ($nativeExitCode -ne 0) { throw "$Label failed with exit code $nativeExitCode" }
}

Invoke-Media 'latest scroll video' @(
    '-hide_banner', '-y', '-i', $Source, '-map', '0:v:0', '-an',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '21',
    '-maxrate', '3200k', '-bufsize', '6400k', '-profile:v', 'high', '-level:v', '4.1',
    '-pix_fmt', 'yuv420p', '-r', '30', '-fps_mode', 'cfr',
    '-g', '4', '-keyint_min', '4', '-sc_threshold', '0',
    '-force_key_frames', 'expr:gte(t,n_forced*0.1333333333)',
    '-movflags', '+faststart', $video
)

Invoke-Media 'matching scroll audio' @(
    '-hide_banner', '-y', '-i', $Source, '-map', '0:a:0', '-vn',
    '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-ac', '2',
    '-movflags', '+faststart', $audio
)

Invoke-Media 'latest first-frame poster' @(
    '-hide_banner', '-y', '-ss', '0', '-i', $Source, '-frames:v', '1',
    '-vf', 'scale=608:1088:flags=lanczos', '-c:v', 'libwebp', '-quality', '88', $poster
)

Add-Content -LiteralPath $log -Encoding utf8 -Value "Latest-cut build finished: $((Get-Date).ToString('o'))"

Write-Host 'Output inventory' -ForegroundColor Green
foreach ($path in @($video, $audio, $poster)) {
    Write-Host $path
    if ($path -match '\.mp4$|\.m4a$') {
        & $ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 $path
    } else {
        Get-Item -LiteralPath $path | Select-Object Length
    }
}
