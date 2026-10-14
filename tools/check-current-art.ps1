Add-Type -AssemblyName System.Drawing
$artJobs = Get-Content -LiteralPath 'data/current-20261013/character-jobs.json' -Raw | ConvertFrom-Json
$artResults = @()
foreach ($artJob in $artJobs) {
    if ($artJob.status -ne 'generated') { continue }
    $artPath = Join-Path 'dist' $artJob.imagePath
    $artBitmap = [System.Drawing.Bitmap]::FromFile((Resolve-Path -LiteralPath $artPath))
    try {
        $cornerAlpha = @($artBitmap.GetPixel(0,0).A, $artBitmap.GetPixel($artBitmap.Width-1,0).A, $artBitmap.GetPixel(0,$artBitmap.Height-1).A, $artBitmap.GetPixel($artBitmap.Width-1,$artBitmap.Height-1).A)
        $transparentSamples = 0; $subjectSamples = 0
        for ($artY=0; $artY -lt $artBitmap.Height; $artY+=32) {
            for ($artX=0; $artX -lt $artBitmap.Width; $artX+=32) {
                $artAlpha=$artBitmap.GetPixel($artX,$artY).A
                if ($artAlpha -eq 0) { $transparentSamples++ }
                if ($artAlpha -ge 240) { $subjectSamples++ }
            }
        }
        $artResults += [pscustomobject]@{ id=$artJob.id; width=$artBitmap.Width; height=$artBitmap.Height; cornerAlpha=$cornerAlpha; transparentSamples=$transparentSamples; subjectSamples=$subjectSamples; sha256=(Get-FileHash -LiteralPath $artPath -Algorithm SHA256).Hash; valid=($transparentSamples -gt 0 -and $subjectSamples -gt 0 -and ($cornerAlpha | Where-Object { $_ -gt 2 }).Count -eq 0) }
    } finally { $artBitmap.Dispose() }
}
$artResults | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath 'data/current-20261013/art-integrity.json' -Encoding utf8
$artFailures=@($artResults | Where-Object { -not $_.valid })
$artDuplicates=@($artResults | Group-Object sha256 | Where-Object Count -gt 1)
Write-Output "Images checked: $($artResults.Count); invalid alpha: $($artFailures.Count); duplicate files: $($artDuplicates.Count)"
if ($artFailures.Count -gt 0 -or $artDuplicates.Count -gt 0) { throw 'Artwork integrity check failed' }

