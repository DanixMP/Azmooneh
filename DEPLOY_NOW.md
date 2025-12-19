# 🚀 Deploy Now - Git Method

## Step-by-Step Deployment Using Git

### ✅ Prerequisites Check
- [x] DNS configured (roydadapp.ir, api.roydadapp.ir)
- [x] Git repository: https://github.com/DanixMP/Azmooneh.git
- [x] VPS access: 193.151.154.135
- [x] All deployment files created

---

## 📝 Step 1: Commit and Push (Local Machine)

Open terminal in your project directory:

```bash
# Check what files will be committed
git status

# Add all files
git add .

# Commit with message
git commit -m "Production deployment ready with full configuration"

# Push to GitHub
git push origin main
```

**Verify on GitHub:** Visit https://github.com/DanixMP/Azmooneh to confirm files are uploaded.

---

## 🔐 Step 2: Connect to VPS

```bash
ssh root@193.151.154.135
```

**Password:** `@7Vw*#Fd03Ef`

---

## 📦 Step 3: Clone Repository on VPS

```bash
# Clone from GitHub
git clone https://github.com/DanixMP/Azmooneh.git /var/www/azmooneh

# Navigate to directory
cd /var/www/azmooneh

# Verify files
ls -la
```

---

## 🚀 Step 4: Run Deployment Script

```bash
# Make script executable
chmod +x deploy/deploy.sh

# Run deployment (takes 10-15 minutes)
./deploy/deploy.sh
```

**What happens:**
- ✅ Installs Python, Node.js, Nginx
- ✅ Creates virtual environment
- ✅ Installs dependencies
- ✅ Builds React frontend
- ✅ Configures Django
- ✅ Sets up Gunicorn service
- ✅ Configures Nginx
- ✅ Installs SSL certificates

---

## 👤 Step 5: Create Admin User

```bash
cd /var/www/azmooneh
source venv/bin/activate
export DJANGO_SETTINGS_MODULE=backend.settings_production
python manage.py createsuperuser
```

Follow prompts:
- Username: (your choice)
- Email: (your email)
- Password: (secure password)

---

## ✅ Step 6: Verify Deployment

### Check Services

```bash
sudo systemctl status gunicorn
sudo systemctl status nginx
```

Both should show "active (running)" in green.

### Test in Browser

1. **Frontend:** https://roydadapp.ir
2. **Backend API:** https://api.roydadapp.ir/admin
3. **Login** with admin credentials you just created

---

## 🔄 Future Updates

When you make changes:

### On Local Machine:
```bash
git add .
git commit -m "Description of changes"
git push origin main
```

### On VPS:
```bash
ssh root@193.151.154.135
cd /var/www/azmooneh
./deploy/update.sh
```

---

## 🆘 If Something Goes Wrong

### View Logs
```bash
# Gunicorn logs
sudo journalctl -u gunicorn -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Restart Services
```bash
sudo systemctl restart gunicorn
sudo systemctl restart nginx
```

### Check Deployment Script Output
The script shows detailed output. If it fails, read the error message carefully.

---

## 📞 Common Issues

### 502 Bad Gateway
```bash
sudo systemctl restart gunicorn
sudo journalctl -u gunicorn -n 50
```

### SSL Certificate Issues
```bash
sudo certbot certificates
sudo certbot renew
```

### Static Files Not Loading
```bash
cd /var/www/azmooneh
source venv/bin/activate
export DJANGO_SETTINGS_MODULE=backend.settings_production
python manage.py collectstatic --noinput
sudo systemctl restart nginx
```

---

## 🎉 Success Checklist

- [ ] Code pushed to GitHub
- [ ] Repository cloned on VPS
- [ ] Deployment script completed successfully
- [ ] Admin user created
- [ ] Gunicorn service running
- [ ] Nginx service running
- [ ] SSL certificates installed
- [ ] Frontend loads at https://roydadapp.ir
- [ ] Backend loads at https://api.roydadapp.ir/admin
- [ ] Can login to admin panel

---

## 🔒 Post-Deployment Security

```bash
# Change VPS password
passwd

# Set up firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Set correct permissions
sudo chown -R www-data:www-data /var/www/azmooneh
```

---

## 📊 Your Deployment Info

**Repository:** https://github.com/DanixMP/Azmooneh.git  
**VPS IP:** 193.151.154.135  
**Frontend:** https://roydadapp.ir  
**Backend:** https://api.roydadapp.ir  
**Admin:** https://api.roydadapp.ir/admin  

---

**Ready? Let's start with Step 1!** 🚀

Copy and paste the commands one by one, and let me know if you encounter any issues.
