# 🚀 Deployment Ready!

Your Azmooneh App is now fully configured and ready to deploy to **roydadapp.ir**

## ✅ What's Been Done

### 1. Deployment Infrastructure
- ✅ Complete deployment scripts for VPS
- ✅ Production Django settings
- ✅ Nginx configuration
- ✅ Gunicorn service setup
- ✅ SSL certificate automation (Let's Encrypt)
- ✅ Windows-friendly deployment tools

### 2. Configuration Files
- ✅ Production environment variables
- ✅ API URL configuration for frontend
- ✅ CORS settings for production
- ✅ Static files configuration
- ✅ Security headers enabled

### 3. Documentation
- ✅ Step-by-step deployment checklist
- ✅ Windows deployment guide
- ✅ Complete deployment manual
- ✅ Quick reference guide
- ✅ Troubleshooting guide

### 4. Code Updates
- ✅ Frontend configured to use environment-based API URLs
- ✅ Connection test updated for production
- ✅ Centralized API service created
- ✅ Build output directory configured

## 📋 Quick Start

### For Windows Users (Easiest)

1. **Open PowerShell** in your project directory
2. **Run:**
   ```powershell
   .\deploy\deploy-windows.ps1
   ```
3. **Follow the instructions** to upload and deploy

### What You Need

- ✅ VPS IP: 193.151.154.135
- ✅ VPS Access: root / @7Vw*#Fd03Ef
- ✅ Domain: roydadapp.ir (already pointing to VPS)
- ⚠️ **IMPORTANT:** Set up `api.roydadapp.ir` subdomain first!

## ⚠️ Before You Deploy

### Critical: Set Up DNS Subdomain

You **must** add this DNS record before deploying:

**In your domain registrar's control panel:**
- Type: **A Record**
- Name: **api**
- Value: **193.151.154.135**
- TTL: **3600** (or default)

**Verify it's working:**
```powershell
nslookup api.roydadapp.ir 8.8.8.8
```

Should return: `193.151.154.135`

Wait 5-10 minutes for DNS propagation if it doesn't work immediately.

## 📚 Documentation Files

Start with these in order:

1. **`deploy/SIMPLE_STEPS.txt`** - Print this! Simple step-by-step
2. **`DEPLOYMENT_CHECKLIST.md`** - Complete checklist
3. **`deploy/WINDOWS_DEPLOY.md`** - Windows-specific guide
4. **`deploy/DEPLOYMENT_GUIDE.md`** - Full technical details
5. **`deploy/QUICK_DEPLOY.md`** - Quick reference

## 🎯 Deployment Process

### Time Required
- First deployment: **15-20 minutes**
- Future updates: **1-2 minutes**

### Steps Overview
1. Set up DNS subdomain (5 minutes)
2. Create deployment package (1 minute)
3. Upload to VPS (2 minutes)
4. Run deployment script (10 minutes)
5. Create admin user (1 minute)
6. Verify deployment (1 minute)

### What Gets Installed
- Python 3 + Virtual Environment
- Node.js 20.x
- Nginx (web server)
- Gunicorn (WSGI server)
- Let's Encrypt SSL certificates
- All project dependencies

## 🌐 After Deployment

Your app will be live at:

- **Frontend:** https://roydadapp.ir
- **Backend API:** https://api.roydadapp.ir
- **Admin Panel:** https://api.roydadapp.ir/admin

## 🔧 Useful Commands

### Check Status
```bash
sudo systemctl status gunicorn
sudo systemctl status nginx
```

### View Logs
```bash
sudo journalctl -u gunicorn -f
sudo tail -f /var/log/nginx/error.log
```

### Restart Services
```bash
sudo systemctl restart gunicorn
sudo systemctl restart nginx
```

### Update Application
```bash
cd /var/www/azmooneh
./deploy/update.sh
```

## 🆘 Common Issues & Solutions

### 502 Bad Gateway
**Problem:** Gunicorn not running  
**Solution:**
```bash
sudo systemctl restart gunicorn
sudo journalctl -u gunicorn -n 50
```

### SSL Certificate Issues
**Problem:** HTTPS not working  
**Solution:**
```bash
sudo certbot renew
sudo systemctl restart nginx
```

### Static Files Not Loading
**Problem:** CSS/JS not loading  
**Solution:**
```bash
cd /var/www/azmooneh
source venv/bin/activate
export DJANGO_SETTINGS_MODULE=backend.settings_production
python manage.py collectstatic --noinput
```

### CORS Errors
**Problem:** Frontend can't connect to backend  
**Solution:** Check `CORS_ALLOWED_ORIGINS` in `backend/settings_production.py`

## 🔒 Security Checklist

After deployment:
- [ ] Change VPS root password
- [ ] Set up firewall (UFW)
- [ ] Configure automated backups
- [ ] Review Django security settings
- [ ] Set up monitoring (optional)
- [ ] Document admin credentials securely

## 📦 Project Structure

```
deploy/
├── deploy.sh                 # Main deployment script (VPS)
├── update.sh                 # Quick update script (VPS)
├── deploy-windows.ps1        # Windows deployment helper
├── local-deploy.sh           # Deploy from local (Linux/Mac)
├── gunicorn.service          # Gunicorn systemd service
├── nginx.conf                # Nginx configuration
├── requirements-production.txt
├── DEPLOYMENT_GUIDE.md       # Complete guide
├── QUICK_DEPLOY.md           # Quick reference
├── WINDOWS_DEPLOY.md         # Windows guide
├── SIMPLE_STEPS.txt          # Printable steps
└── README.md                 # Deployment files overview

backend/
└── settings_production.py    # Production Django settings

src/
├── config.ts                 # API configuration
└── services/
    └── api.ts                # Centralized API service

.env.production               # Production environment vars
.env.development              # Development environment vars
```

## 🎓 Learning Resources

- Django Deployment: https://docs.djangoproject.com/en/stable/howto/deployment/
- Nginx Docs: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/docs/
- Gunicorn: https://docs.gunicorn.org/

## 💡 Tips

1. **Test locally first:** Run `npm run build` to ensure frontend builds
2. **Backup database:** Before deploying, backup your local database
3. **Use version control:** Commit all changes before deploying
4. **Monitor logs:** Keep an eye on logs during first deployment
5. **Document changes:** Note any custom configurations you make

## 🚀 Ready to Deploy?

1. ✅ Read `deploy/SIMPLE_STEPS.txt`
2. ✅ Set up DNS subdomain
3. ✅ Run `.\deploy\deploy-windows.ps1`
4. ✅ Follow the instructions
5. ✅ Enjoy your live app!

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section in `deploy/DEPLOYMENT_GUIDE.md`
2. Review logs: `sudo journalctl -u gunicorn -f`
3. Verify DNS: `nslookup api.roydadapp.ir 8.8.8.8`
4. Check service status: `sudo systemctl status gunicorn nginx`

---

**Status:** ✅ Ready to Deploy  
**Domain:** roydadapp.ir  
**VPS:** 193.151.154.135  
**Estimated Time:** 15-20 minutes  

**Next Step:** Set up `api.roydadapp.ir` DNS record, then run deployment!

Good luck! 🎉
