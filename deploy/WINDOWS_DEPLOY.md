# Windows Deployment Guide

## Quick Deploy from Windows

### Method 1: Using PowerShell Script (Easiest)

1. **Open PowerShell** in your project directory

2. **Run the deployment script:**
   ```powershell
   .\deploy\deploy-windows.ps1
   ```

3. **Follow the instructions** shown by the script to upload and deploy

### Method 2: Manual Steps

#### Step 1: Create Deployment Package

```powershell
# Compress project (excluding unnecessary files)
$exclude = @('node_modules', 'venv', '.git', '__pycache__', 'dist')
Compress-Archive -Path . -DestinationPath azmooneh.zip -Force
```

#### Step 2: Upload to VPS

**Using WinSCP (Recommended):**
1. Download WinSCP: https://winscp.net/
2. Connect to:
   - Host: `193.151.154.135`
   - Username: `root`
   - Password: `@7Vw*#Fd03Ef`
3. Upload `azmooneh.zip` to `/tmp/`

**Using FileZilla:**
1. Download FileZilla: https://filezilla-project.org/
2. Use SFTP protocol
3. Connect with same credentials
4. Upload to `/tmp/`

#### Step 3: Connect via SSH

**Using Windows Terminal (Windows 11):**
```powershell
ssh root@193.151.154.135
```

**Using PuTTY:**
1. Download PuTTY: https://www.putty.org/
2. Host: `193.151.154.135`
3. Port: `22`
4. Click "Open"
5. Login with username `root` and password `@7Vw*#Fd03Ef`

#### Step 4: Deploy on VPS

Once connected via SSH:

```bash
# Create app directory
mkdir -p /var/www/azmooneh
cd /var/www/azmooneh

# Extract files
unzip /tmp/azmooneh.zip

# Run deployment
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

#### Step 5: Create Admin User

```bash
cd /var/www/azmooneh
source venv/bin/activate
export DJANGO_SETTINGS_MODULE=backend.settings_production
python manage.py createsuperuser
```

## Verify Deployment

Open in your browser:
- Frontend: https://roydadapp.ir
- Backend: https://api.roydadapp.ir/admin

## Updating Your App

After making changes:

1. **Create new package:**
   ```powershell
   .\deploy\deploy-windows.ps1
   ```

2. **Upload to VPS** (same as before)

3. **Run update script on VPS:**
   ```bash
   cd /var/www/azmooneh
   ./deploy/update.sh
   ```

## Troubleshooting

### Can't connect via SSH

- Check if port 22 is open on VPS
- Try using PuTTY instead of Windows Terminal
- Verify VPS IP and credentials

### Upload fails

- Check your internet connection
- Try using WinSCP instead of FileZilla
- Verify VPS credentials

### Deployment script fails

- Check logs: `sudo journalctl -u gunicorn -n 50`
- Verify all files uploaded correctly
- Check disk space: `df -h`

## Tools You'll Need

1. **PowerShell** (Built into Windows)
2. **WinSCP** or **FileZilla** (for file upload)
3. **Windows Terminal** or **PuTTY** (for SSH)

## Important Notes

- Make sure `api.roydadapp.ir` DNS is set up before deploying
- First deployment takes 5-10 minutes
- SSL certificates are installed automatically
- Keep your VPS password secure

## Need Help?

- Full guide: `deploy/DEPLOYMENT_GUIDE.md`
- Quick reference: `deploy/QUICK_DEPLOY.md`
- Checklist: `DEPLOYMENT_CHECKLIST.md`
