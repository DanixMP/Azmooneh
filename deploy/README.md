# Deployment Files

This directory contains all files needed to deploy the Azmooneh App to your VPS.

## Files Overview

- **deploy.sh** - Main deployment script (run on VPS)
- **update.sh** - Quick update script for code changes (run on VPS)
- **local-deploy.sh** - Deploy from your local machine to VPS
- **gunicorn.service** - Systemd service file for Gunicorn
- **nginx.conf** - Nginx configuration
- **requirements-production.txt** - Python dependencies for production
- **DEPLOYMENT_GUIDE.md** - Complete deployment documentation
- **QUICK_DEPLOY.md** - Quick start guide

## Quick Start

### Option 1: From Your Local Machine (Windows)

```bash
# Using Git Bash or WSL
chmod +x deploy/local-deploy.sh
./deploy/local-deploy.sh
```

### Option 2: Manual Upload and Deploy

1. Upload project to VPS at `/var/www/azmooneh`
2. SSH into VPS: `ssh root@193.151.154.135`
3. Run: `cd /var/www/azmooneh && chmod +x deploy/deploy.sh && ./deploy/deploy.sh`

## After Deployment

Your app will be available at:
- Frontend: https://roydadapp.ir
- Backend API: https://api.roydadapp.ir
- Admin Panel: https://api.roydadapp.ir/admin

## Need Help?

Read the full guides:
- Quick start: `QUICK_DEPLOY.md`
- Complete guide: `DEPLOYMENT_GUIDE.md`
