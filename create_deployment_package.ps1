# Create deployment package
Write-Host "Creating deployment package..." -ForegroundColor Green

# Create temp directory for package
$packageDir = "deployment_package"
if (Test-Path $packageDir) {
    Remove-Item -Recurse -Force $packageDir
}
New-Item -ItemType Directory -Path $packageDir | Out-Null

# Copy essential files
Write-Host "Copying files..." -ForegroundColor Yellow

# Backend files
Copy-Item -Recurse "accounts" "$packageDir/accounts"
Copy-Item -Recurse "backend" "$packageDir/backend"
Copy-Item -Recurse "exams" "$packageDir/exams"
Copy-Item -Recurse "swot" "$packageDir/swot"
Copy-Item -Recurse "student_messages" "$packageDir/student_messages"

# Deployment files
Copy-Item -Recurse "deploy" "$packageDir/deploy"

# Frontend build
Copy-Item -Recurse "dist" "$packageDir/dist"

# Database and scripts
Copy-Item "db.sqlite3" "$packageDir/db.sqlite3"
Copy-Item "manage.py" "$packageDir/manage.py"
Copy-Item "requirements.txt" "$packageDir/requirements.txt"
Copy-Item "create_admin.py" "$packageDir/create_admin.py"
Copy-Item "create_test_users.py" "$packageDir/create_test_users.py"
Copy-Item "create_swot_questions.py" "$packageDir/create_swot_questions.py"
Copy-Item "delete_swot_questions.py" "$packageDir/delete_swot_questions.py"

# Environment files
Copy-Item ".env.production" "$packageDir/.env.production"
Copy-Item ".gitignore" "$packageDir/.gitignore"

# Documentation
Copy-Item "README.md" "$packageDir/README.md"
Copy-Item "SWOT_DEPLOYMENT.md" "$packageDir/SWOT_DEPLOYMENT.md"
Copy-Item "DEPLOY_NOW.md" "$packageDir/DEPLOY_NOW.md"

# Create deployment instructions
$instructions = @"
# Deployment Instructions

## Quick Deploy

1. Upload this package to VPS:
   scp -r deployment_package root@193.151.154.135:/tmp/

2. SSH to VPS:
   ssh root@193.151.154.135

3. Run deployment:
   cd /tmp/deployment_package
   chmod +x deploy/quick_deploy.sh
   ./deploy/quick_deploy.sh

## What's Included

- Complete Django backend with all apps
- Built React frontend (dist/)
- SQLite database with:
  - Professor: Tagepour / T1171313
  - Student: 403663934 / student123
  - Admin: admin / admin@123
  - 11 Persian SWOT questions
- All deployment scripts and configs
- Nginx and Gunicorn configurations

## Manual Steps (if needed)

1. Stop services:
   systemctl stop gunicorn
   systemctl stop nginx

2. Backup old installation:
   mv /var/www/azmooneh /var/www/azmooneh.backup

3. Copy new files:
   cp -r /tmp/deployment_package /var/www/azmooneh

4. Set permissions:
   chown -R www-data:www-data /var/www/azmooneh/db.sqlite3
   chmod 664 /var/www/azmooneh/db.sqlite3

5. Copy frontend:
   cp -r /var/www/azmooneh/dist/* /var/www/html/azmooneh/

6. Restart services:
   systemctl start gunicorn
   systemctl start nginx

## Test

- Frontend: https://roydadapp.ir
- Backend API: https://api.roydadapp.ir/admin
- Login as student: 403663934 / student123
- Check SWOT tab for Persian questions
"@

Set-Content -Path "$packageDir/DEPLOY_INSTRUCTIONS.txt" -Value $instructions

Write-Host "Creating zip file..." -ForegroundColor Yellow
Compress-Archive -Path "$packageDir/*" -DestinationPath "azmooneh_deployment.zip" -Force

Write-Host "✓ Deployment package created: azmooneh_deployment.zip" -ForegroundColor Green
Write-Host "  Size: $((Get-Item azmooneh_deployment.zip).Length / 1MB) MB" -ForegroundColor Cyan

# Cleanup
Remove-Item -Recurse -Force $packageDir
Write-Host "✓ Cleaned up temporary files" -ForegroundColor Green
