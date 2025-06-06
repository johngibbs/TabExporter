function Get-ZipFileContents
{
    [CmdletBinding()]
    [OutputType([System.IO.Compression.ZipArchiveEntry])]
    Param
    (
        [Parameter(Mandatory = $true, Position = 0)]
        [ValidateNotNullOrEmpty()]
        [ValidateScript({ Test-Path $_ -PathType Leaf })]
        [string]$Path
    )

    try
    {
        if (-not ([System.Reflection.Assembly]::Load("System.IO.Compression.FileSystem")))
        {
            throw "Could not load the System.IO.Compression.FileSystem assembly. Is .NET Framework 4.5 or later installed?"
        }
        
        $fullPath = Resolve-Path $Path -ErrorAction Stop
        $zip = [System.IO.Compression.ZipFile]::OpenRead($fullPath)
        Write-Output $zip.Entries
    }
    catch
    {
        Write-Error "Failed to open the ZIP file: $_"
    }
    finally
    {
        if ($zip)
        {
            $zip.Dispose()
        }
    }
}

# Create a temporary directory for packaging
$tempDir = Join-Path $env:TEMP "TabExporter-$(Get-Date -Format 'yyyyMMddHHmmss')"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# Copy files to temp directory, maintaining directory structure
$filesToCopy = @(
    "_locales",
    "icons",
    "background.js",
    "CHANGELOG.md",
    "LICENSE",
    "manifest.json",
    "popup.html",
    "popup.js",
    "PRIVACY.md",
    "README.md"
)

Write-Host "Copying files to temporary directory: $tempDir"
foreach ($item in $filesToCopy) {
    if (Test-Path $item) {
        Copy-Item -Path $item -Destination $tempDir -Recurse -Force
        Write-Host "- Copied: $item"
    } else {
        Write-Warning "File or directory not found: $item"
    }
}

# Create dist directory if it doesn't exist
$distDir = "dist"
if (-not (Test-Path -Path $distDir)) {
    New-Item -ItemType Directory -Path $distDir | Out-Null
}

# Create ZIP filename with version from manifest
$manifest = Get-Content "manifest.json" -Raw | ConvertFrom-Json
$version = $manifest.version
$zipName = "TabExporter-v$version.zip"
$zipPath = Join-Path -Path $distDir -ChildPath $zipName

# Remove existing ZIP if it exists
if (Test-Path -Path $zipPath) {
    Remove-Item -Path $zipPath -Force
}

# Create ZIP file from temp directory
Write-Host "`nCreating ZIP file: $zipPath"
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force

# Clean up temp directory
Write-Host "`nRemoving temporary directory: $tempDir"
Remove-Item -Path $tempDir -Recurse -Force

# List files in the zip for verification
Write-Host "`nCreated package: $zipPath"
Write-Host "`nPackage contents:"
Get-ZipFileContents -Path $zipPath | Format-Table -Property LastWriteTime,Length,FullName -AutoSize
