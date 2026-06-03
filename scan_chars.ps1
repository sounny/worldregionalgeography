param([string]$FilePath)
$bytes = [System.IO.File]::ReadAllBytes($FilePath)
$text = [System.Text.Encoding]::UTF8.GetString($bytes)
$count = 0
for ($i=0; $i -lt $text.Length; $i++) {
    $c = [int]$text[$i]
    if (($c -ge 0x80 -and $c -le 0x9F) -or $c -eq 0x2013 -or $c -eq 0x2014 -or $c -eq 0x201C -or $c -eq 0x201D -or $c -eq 0x2018 -or $c -eq 0x2019 -or $c -eq 0x2190 -or $c -eq 0x2192) {
        $start = [Math]::Max(0, $i-15)
        $len = [Math]::Min(35, $text.Length - $start)
        $ctx = $text.Substring($start, $len) -replace "`r`n", "\\n" -replace "`n", "\\n"
        Write-Output "Pos $i : U+$($c.ToString('X4')) context=[$ctx]"
        $count++
        if ($count -ge 50) { break }
    }
}
if ($count -eq 0) { Write-Output "No problematic characters found." }
