# PowerShell deployment script for Windows
# Run this from your local Windows machine

$VPS_IP = "193.151.154.135"
$VPS_USER = "root"
$VPS_PASSWORD = "@7Vw*#Fd03Ef"
$APP_DIR = "/var/www/azmooneh"

Write-Host "📦 Preparing deployment package..." -ForegroundColor Yellow

# Create temporary directory
$TEMP_DIR = Join-Path $env:TEMP "azmooneh_deploy"
if (Test-Path $TEMP_DIR) {
    Remove-Item -Recurse -Force $TEMP_DIR
}
New-Item -ItemType Directory -Path $TEMP_DIR | Out-Null

# Copy files excluding unnecessary directories
Write-Host "Copying project files..." -ForegroundColor Cyan
$excludeDirs = @('node_modules', 'venv', '.git', '__pycache__', 'dist', '.vscode')
Get-ChildItem -Path . -Recurse | Where-Object {
    $item = $_
    $exclude = $false
    foreach ($dir in $excludeDirs) {
        if ($item.FullName -like "*\$dir\*" -or $item.Name -eq $dir) {
            $exclude = $true
            break
        }
    }
    -not $exclude
} | Copy-Item -Destination {
    $dest = Join-Path $TEMP_DIR $_.FullName.Substring($PWD.Path.Length)
    $destDir = Split-Path $dest
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }
    $dest
}

# Create archive
$archivePath = Join-Path $env:TEMP "azmooneh.zip"
Write-Host "Creating archive..." -ForegroundColor Cyan
Compress-Archive -Path "$TEMP_DIR\*" -DestinationPath $archivePath -Force

Write-Host "`n✅ Package created: $archivePath" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Upload $archivePath to your VPS using WinSCP or FileZilla" -ForegroundColor White
Write-Host "   - Host: $VPS_IP" -ForegroundColor White
Write-Host "   - Username: $VPS_USER" -ForegroundColor White
Write-Host "   - Password: $VPS_PASSWORD" -ForegroundColor White
Write-Host "   - Upload to: /tmp/" -ForegroundColor White
Write-Host "`n2. Connect via SSH (using PuTTY or Windows Terminal):" -ForegroundColor White
Write-Host "   ssh $VPS_USER@$VPS_IP" -ForegroundColor Cyan
Write-Host "`n3. Run these commands on VPS:" -ForegroundColor White
Write-Host "   mkdir -p $APP_DIR" -ForegroundColor Cyan
Write-Host "   cd $APP_DIR" -ForegroundColor Cyan
Write-Host "   unzip /tmp/azmooneh.zip" -ForegroundColor Cyan
Write-Host "   chmod +x deploy/deploy.sh" -ForegroundColor Cyan
Write-Host "   ./deploy/deploy.sh" -ForegroundColor Cyan

Write-Host "`n📝 Full instructions: deploy\QUICK_DEPLOY.md" -ForegroundColor Yellow

# Cleanup temp directory
Remove-Item -Recurse -Force $TEMP_DIR

Write-Host "`n✨ Ready to deploy!" -ForegroundColor Green
