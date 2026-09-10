[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$Source,
    [Parameter(Mandatory=$true)][string]$Destination
)
$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath $Source -PathType Leaf)) { throw 'Source video not found.' }
if (Test-Path -LiteralPath $Destination) { throw 'Destination already exists. Choose a new candidate path.' }
$encoder = (Get-Command ffmpeg -ErrorAction Stop).Source
& $encoder -v warning -n -i $Source -vf 'scale=608:1080' -c:v libx264 -preset medium -crf 24 -g 1 -keyint_min 1 -bf 0 -pix_fmt yuv420p -an -movflags +faststart $Destination
if ($LASTEXITCODE -ne 0) { throw 'Candidate encoding failed.' }
Get-FileHash -LiteralPath $Destination -Algorithm SHA256
