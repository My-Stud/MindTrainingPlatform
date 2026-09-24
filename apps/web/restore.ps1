Add-Type -AssemblyName System.Drawing
foreach ($f in @("c19_fixed.png", "c20_fixed.png")) {
    $p = "public/images/achievements/" + $f
    $full = (Resolve-Path $p).Path
    $img = [System.Drawing.Image]::FromFile($full)
    $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone)
    $new = $full -replace "_fixed\.png$", ".png"
    $img.Save($new)
    $img.Dispose()
    Remove-Item $full
}
