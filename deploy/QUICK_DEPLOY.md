# Quick Deployment Instructions

## Option 1: Automated Deployment (Recommended)

### From Windows (Your Current Machine)

1. **Install WSL or Git Bash** (if not already installed)

2. **Run the deployment script:**
   ```bash
   chmod +x deploy/local-deploy.sh
   ./deploy/local-deploy.sh
   ```

This will automatically:
- Package your project
- Upload to VPS
- Install dependencies
- Configure services
- Set up SSL

### From PowerShell (Windows Alternative)

```powershell
# Create deployment package
Compress-Archive -Path . -DestinationPath azmooneh.zip -Force `
    -Exclude node_modules,venv,.git,__pycache__,*.pyc,db.sqlite3,dist

# Upload to VPS (using WinSCP or similar)
# Then SSH into VPS and run deployment
```

## Option 2: Manual Deployment

### Step 1: Upload Files to VPS

Using WinSCP, FileZilla, or SCP:
- Connect to: 193.151.154.135
- Username: root
- Password: @7Vw*#Fd03Ef
- Upload entire project to: /var/www/azmooneh

### Step 2: SSH into VPS

```bash
ssh root@193.151.154.135
```

### Step 3: Run Deployment

```bash
cd /var/www/azmooneh
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

### Step 4: Create Admin User

```bash
cd /var/www/azmooneh
source venv/bin/activate
export DJANGO_SETTINGS_MODULE=backend.settings_production
python manage.py createsuperuser
```

## Post-Deployment

### Verify Services

```bash
sudo systemctl status gunicorn
sudo systemctl status nginx
```

### Check Your Sites

- Frontend: https://roydadapp.ir
- Backend API: https://api.roydadapp.ir/admin
- API Docs: https://api.roydadapp.ir/api/

### View Logs

```bash
# Gunicorn logs
sudo journalctl -u gunicorn -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## Updating After Changes

```bash
# On VPS
cd /var/www/azmooneh
./deploy/update.sh
```

## Important Notes

1. **DNS Setup**: Make sure api.roydadapp.ir points to 193.151.154.135
2. **Firewall**: Ports 80, 443, and 22 should be open
3. **SSL**: Certificates will be auto-installed by Let's Encrypt
4. **First Time**: Deployment takes 5-10 minutes
5. **Updates**: Takes 1-2 minutes

## Troubleshooting

### 502 Bad Gateway
```bash
sudo systemctl restart gunicorn
sudo journalctl -u gunicorn -n 50
```

### SSL Issues
```bash
sudo certbot renew --dry-run
```

### Permission Issues
```bash
sudo chown -R www-data:www-data /var/www/azmooneh
```

## Need Help?

Check the full guide: `deploy/DEPLOYMENT_GUIDE.md`
