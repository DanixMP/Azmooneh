# Deployment Summary

## ✅ What's Been Set Up

Your Azmooneh App is ready to deploy to **roydadapp.ir** (VPS: 193.151.154.135)

### Created Files

1. **Deployment Scripts**
   - `deploy/deploy.sh` - Main deployment script (runs on VPS)
   - `deploy/update.sh` - Quick update script
   - `deploy/deploy-windows.ps1` - Windows deployment helper
   - `deploy/local-deploy.sh` - Deploy from local machine (Linux/Mac)

2. **Configuration Files**
   - `backend/settings_production.py` - Production Django settings
   - `deploy/gunicorn.service` - Gunicorn systemd service
   - `deploy/nginx.conf` - Nginx web server config
   - `.env.production` - Production environment variables
   - `.env.development` - Development environment variables

3. **Documentation**
   - `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist
   - `deploy/DEPLOYMENT_GUIDE.md` - Complete deployment guide
   - `deploy/QUICK_DEPLOY.md` - Quick start instructions
   - `deploy/WINDOWS_DEPLOY.md` - Windows-specific guide
   - `deploy/README.md` - Deployment files overview

4. **Helper Files**
   - `src/config.ts` - API configuration for frontend
   - `deploy/requirements-production.txt` - Production Python packages

## 🚀 How to Deploy

### Quick Start (Windows)

```powershell
# In PowerShell
.\deploy\deploy-windows.ps1
```

Then follow the instructions to upload and deploy.

### What Happens During Deployment

1. ✅ Installs Python, Node.js, Nginx
2. ✅ Sets up virtual environment
3. ✅ Installs all dependencies
4. ✅ Builds React frontend
5. ✅ Configures Django for production
6. ✅ Sets up Gunicorn service
7. ✅ Configures Nginx reverse proxy
8. ✅ Installs SSL certificates (Let's Encrypt)

### After Deployment

Your app will be live at:
- **Frontend:** https://roydadapp.ir
- **Backend API:** https://api.roydadapp.ir
- **Admin Panel:** https://api.roydadapp.ir/admin

## ⚠️ Important: Before You Deploy

### 1. Set Up DNS Subdomain

You need to add this DNS record:
- **Type:** A
- **Name:** api
- **Value:** 193.151.154.135
- **TTL:** 3600 (or default)

This creates `api.roydadapp.ir` for your backend.

### 2. Verify DNS

```powershell
nslookup api.roydadapp.ir 8.8.8.8
```

Should return: 193.151.154.135

## 📋 Deployment Checklist

- [x] Deployment scripts created
- [x] Configuration files ready
- [x] Production settings configured
- [x] Documentation complete
- [ ] DNS subdomain set up (api.roydadapp.ir)
- [ ] Files uploaded to VPS
- [ ] Deployment script executed
- [ ] Admin user created
- [ ] SSL certificates installed
- [ ] Application tested

## 🔧 Tech Stack

**Backend:**
- Django 6.0
- Django REST Framework
- Gunicorn (WSGI server)
- SQLite (can upgrade to PostgreSQL)

**Frontend:**
- React 18
- Vite
- TypeScript
- Tailwind CSS

**Infrastructure:**
- Nginx (reverse proxy)
- Let's Encrypt (SSL)
- Ubuntu/Debian Linux

## 📚 Documentation Guide

1. **Start here:** `DEPLOYMENT_CHECKLIST.md`
2. **Windows users:** `deploy/WINDOWS_DEPLOY.md`
3. **Need details:** `deploy/DEPLOYMENT_GUIDE.md`
4. **Quick reference:** `deploy/QUICK_DEPLOY.md`

## 🆘 Common Issues

### 502 Bad Gateway
```bash
sudo systemctl restart gunicorn
sudo journalctl -u gunicorn -n 50
```

### SSL Certificate Issues
```bash
sudo certbot renew
```

### Static Files Not Loading
```bash
python manage.py collectstatic --noinput
```

## 🔄 Updating Your App

After making code changes:

```bash
# On VPS
cd /var/www/azmooneh
./deploy/update.sh
```

## 📞 Support

- Check logs: `sudo journalctl -u gunicorn -f`
- Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Service status: `sudo systemctl status gunicorn nginx`

## 🎯 Next Steps

1. ✅ Review `DEPLOYMENT_CHECKLIST.md`
2. ✅ Set up DNS subdomain
3. ✅ Run deployment script
4. ✅ Create admin user
5. ✅ Test your application
6. ✅ Set up backups (recommended)
7. ✅ Change VPS password (security)

---

**Status:** Ready to deploy! 🚀
**Estimated Time:** 15-20 minutes
**Difficulty:** Easy (automated)
