# Deployment Checklist for roydadapp.ir

## Pre-Deployment

### DNS Configuration
- [x] roydadapp.ir points to 193.151.154.135 ✅
- [ ] api.roydadapp.ir points to 193.151.154.135 (Set this up!)
- [ ] www.roydadapp.ir points to 193.151.154.135 (Optional)

### VPS Access
- [x] VPS IP: 193.151.154.135
- [x] SSH Access: root@193.151.154.135
- [x] Password: @7Vw*#Fd03Ef

### Local Preparation
- [x] All deployment files created
- [ ] Test build locally: `npm run build`
- [ ] Review production settings
- [ ] Backup current database (if exists)

## Deployment Steps

### 1. DNS Setup (IMPORTANT!)
Before deploying, set up the subdomain:

**Option A: Using your domain registrar's control panel**
- Add A record: `api` → `193.151.154.135`
- Add A record: `www` → `193.151.154.135` (optional)

**Option B: Using command line (if you have access)**
```bash
# Check if subdomain is set
nslookup api.roydadapp.ir 8.8.8.8
```

Wait 5-10 minutes for DNS propagation.

### 2. Upload Project to VPS

**Option A: Using SCP (Git Bash/WSL)**
```bash
# Create archive
tar -czf azmooneh.tar.gz --exclude=node_modules --exclude=venv --exclude=.git .

# Upload
scp azmooneh.tar.gz root@193.151.154.135:/tmp/

# Extract on VPS
ssh root@193.151.154.135
mkdir -p /var/www/azmooneh
cd /var/www/azmooneh
tar -xzf /tmp/azmooneh.tar.gz
```

**Option B: Using WinSCP/FileZilla**
- Connect to 193.151.154.135
- Upload entire project to `/var/www/azmooneh`
- Exclude: node_modules, venv, .git, __pycache__

### 3. Run Deployment Script

```bash
ssh root@193.151.154.135
cd /var/www/azmooneh
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

This will take 5-10 minutes and will:
- Install all dependencies
- Build frontend
- Configure Django
- Set up Gunicorn
- Configure Nginx
- Install SSL certificates

### 4. Create Admin User

```bash
cd /var/www/azmooneh
source venv/bin/activate
export DJANGO_SETTINGS_MODULE=backend.settings_production
python manage.py createsuperuser
```

### 5. Verify Deployment

- [ ] Frontend loads: https://roydadapp.ir
- [ ] API responds: https://api.roydadapp.ir/admin
- [ ] SSL certificate installed (green padlock)
- [ ] Can login to admin panel
- [ ] Can create test exam
- [ ] CORS working (no console errors)

## Post-Deployment

### Security
- [ ] Change VPS root password
- [ ] Set up firewall (UFW)
- [ ] Configure fail2ban (optional)
- [ ] Set up database backups
- [ ] Review Django security settings

### Monitoring
- [ ] Set up log rotation
- [ ] Configure monitoring (optional)
- [ ] Test error pages (404, 500)

### Documentation
- [ ] Document admin credentials (securely)
- [ ] Note any custom configurations
- [ ] Update team on new URLs

## Useful Commands

### Check Services
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

## Troubleshooting

### 502 Bad Gateway
- Check Gunicorn: `sudo systemctl status gunicorn`
- View logs: `sudo journalctl -u gunicorn -n 50`
- Restart: `sudo systemctl restart gunicorn`

### SSL Certificate Issues
- Check Certbot: `sudo certbot certificates`
- Renew: `sudo certbot renew`

### Static Files Not Loading
```bash
cd /var/www/azmooneh
source venv/bin/activate
export DJANGO_SETTINGS_MODULE=backend.settings_production
python manage.py collectstatic --noinput
```

### CORS Errors
- Check `CORS_ALLOWED_ORIGINS` in `backend/settings_production.py`
- Restart Gunicorn after changes

## Rollback Plan

If something goes wrong:

```bash
# Stop services
sudo systemctl stop gunicorn
sudo systemctl stop nginx

# Restore from backup
cd /var/www/azmooneh
# Restore your backup here

# Restart services
sudo systemctl start gunicorn
sudo systemctl start nginx
```

## Support Resources

- Deployment Guide: `deploy/DEPLOYMENT_GUIDE.md`
- Quick Deploy: `deploy/QUICK_DEPLOY.md`
- Django Docs: https://docs.djangoproject.com/
- Nginx Docs: https://nginx.org/en/docs/

## Next Steps After Successful Deployment

1. Set up automated backups
2. Configure monitoring and alerts
3. Set up CI/CD pipeline (optional)
4. Document any custom configurations
5. Train team on deployment process
6. Plan for scaling (if needed)

---

**Current Status:** Ready to deploy to roydadapp.ir
**Estimated Time:** 15-20 minutes for first deployment
**Difficulty:** Medium (automated scripts provided)
