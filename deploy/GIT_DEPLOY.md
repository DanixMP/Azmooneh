# Git-Based Deployment Guide

## 🎯 Deployment Using Git (Recommended)

Using Git is the cleanest and most professional way to deploy your application.

### Repository
**GitHub:** https://github.com/DanixMP/Azmooneh.git

---

## 🚀 Quick Deployment Steps

### Step 1: Commit and Push Your Code

```bash
# Check status
git status

# Add all files
git add .

# Commit changes
git commit -m "Ready for production deployment"

# Push to GitHub
git push origin main
```

### Step 2: SSH into VPS

```bash
ssh root@193.151.154.135
```

Password: `@7Vw*#Fd03Ef`

### Step 3: Run Deployment Script

```bash
# The script will automatically clone from GitHub
curl -o deploy.sh https://raw.githubusercontent.com/DanixMP/Azmooneh/main/deploy/deploy.sh
chmod +x deploy.sh
./deploy.sh
```

Or if you prefer to clone first:

```bash
# Clone repository
git clone https://github.com/DanixMP/Azmooneh.git /var/www/azmooneh
cd /var/www/azmooneh

# Run deployment
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

---

## 🔄 Updating Your Application

When you make changes:

### On Your Local Machine

```bash
# Make your changes
# Test locally

# Commit and push
git add .
git commit -m "Description of changes"
git push origin main
```

### On VPS

```bash
ssh root@193.151.154.135
cd /var/www/azmooneh
./deploy/update.sh
```

The update script will:
1. Pull latest changes from GitHub
2. Install new dependencies
3. Run migrations
4. Rebuild frontend
5. Restart services

---

## 📋 Complete Workflow

### Initial Deployment

```bash
# LOCAL MACHINE
git add .
git commit -m "Production ready"
git push origin main

# VPS
ssh root@193.151.154.135
git clone https://github.com/DanixMP/Azmooneh.git /var/www/azmooneh
cd /var/www/azmooneh
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

### Future Updates

```bash
# LOCAL MACHINE
git add .
git commit -m "Update feature X"
git push origin main

# VPS
ssh root@193.151.154.135
cd /var/www/azmooneh
./deploy/update.sh
```

---

## 🔒 Security Best Practices

### 1. Environment Variables

Never commit sensitive data! Create `.env` on VPS:

```bash
cd /var/www/azmooneh
nano .env
```

Add:
```
DJANGO_SECRET_KEY='your-secret-key-here'
DEBUG=False
```

### 2. .gitignore

Make sure these are in `.gitignore`:
```
.env
.env.local
.env.production.local
db.sqlite3
*.pyc
__pycache__/
node_modules/
dist/
```

---

## 🎯 Advantages of Git Deployment

✅ **Version Control** - Track all changes  
✅ **Easy Rollback** - `git checkout` to previous version  
✅ **Clean Updates** - Just `git pull`  
✅ **No File Upload** - Direct from GitHub  
✅ **Team Collaboration** - Multiple developers  
✅ **CI/CD Ready** - Can automate later  

---

## 🆘 Troubleshooting

### Git Authentication Issues

If you get authentication errors:

```bash
# Use HTTPS with token
git clone https://YOUR_TOKEN@github.com/DanixMP/Azmooneh.git

# Or set up SSH keys (recommended)
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
# Add this to GitHub Settings > SSH Keys
```

### Permission Issues

```bash
sudo chown -R www-data:www-data /var/www/azmooneh
sudo chmod -R 755 /var/www/azmooneh
```

### Pull Conflicts

```bash
cd /var/www/azmooneh
git stash  # Save local changes
git pull origin main
git stash pop  # Reapply local changes
```

---

## 📊 Deployment Checklist

- [ ] Code committed and pushed to GitHub
- [ ] `.env` files not in repository
- [ ] DNS configured (roydadapp.ir, api.roydadapp.ir)
- [ ] SSH access to VPS working
- [ ] Repository cloned on VPS
- [ ] Deployment script executed
- [ ] Admin user created
- [ ] Services running (gunicorn, nginx)
- [ ] SSL certificates installed
- [ ] Application tested

---

## 🔄 Rollback Procedure

If something goes wrong:

```bash
cd /var/www/azmooneh

# View commit history
git log --oneline

# Rollback to previous commit
git checkout COMMIT_HASH

# Rebuild and restart
./deploy/update.sh
```

---

## 🌟 Next Steps

1. **Commit your code:**
   ```bash
   git add .
   git commit -m "Production deployment ready"
   git push origin main
   ```

2. **Deploy to VPS:**
   ```bash
   ssh root@193.151.154.135
   git clone https://github.com/DanixMP/Azmooneh.git /var/www/azmooneh
   cd /var/www/azmooneh
   ./deploy/deploy.sh
   ```

3. **Verify:**
   - https://roydadapp.ir
   - https://api.roydadapp.ir/admin

---

**Ready to deploy? Let's commit and push!** 🚀
