# Deployment Guide for roydadapp.ir

## Prerequisites

- VPS with Ubuntu 20.04+ or Debian 11+
- Root or sudo access
- Domain: roydadapp.ir pointing to 193.151.154.135
- Subdomain: api.roydadapp.ir pointing to 193.151.154.135

## Quick Start

### 1. Connect to Your VPS

```bash
ssh root@193.151.154.135
```

Password: `@7Vw*#Fd03Ef`

### 2. Upload Project Files

From your local machine, upload the project:

```bash
# Create a zip of your project (exclude node_modules and venv)
tar -czf azmooneh.tar.gz --exclude=node_modules --exclude=venv --exclude=.git --exclude=__pycache__ .

# Upload to VPS
scp azmooneh.tar.gz root@193.151.154.135:/tmp/

# On VPS, extract files
ssh root@193.151.154.135
mkdir -p /var/www/azmooneh
cd /var/www/azmooneh
tar -xzf /tmp/azmooneh.tar.gz
```

### 3. Run Deployment Script

```bash
cd /var/www/azmooneh
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

The script will:
- Install all dependencies (Python, Node.js, Nginx)
- Set up virtual environment
- Build the frontend
- Configure Django with production settings
- Set up Gunicorn service
- Configure Nginx
- Install SSL certificates

### 4. Create Admin User

```bash
cd /var/www/azmooneh
source venv/bin/activate
export DJANGO_SETTINGS_MODULE=backend.settings_production
python manage.py createsuperuser
```

## Manual Setup (Alternative)

If you prefer manual setup, follow these steps:

### Install Dependencies

```bash
sudo apt update
sudo apt install -y python3-pip python3-venv nginx git

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Setup Python Environment

```bash
cd /var/www/azmooneh
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
```

### Build Frontend

```bash
npm install
npm run build
mkdir -p frontend
cp -r dist/* frontend/
```

### Configure Django

```bash
export DJANGO_SETTINGS_MODULE=backend.settings_production
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

### Setup Gunicorn

```bash
sudo cp deploy/gunicorn.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable gunicorn
sudo systemctl start gunicorn
```

### Setup Nginx

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/azmooneh
sudo ln -s /etc/nginx/sites-available/azmooneh /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### Setup SSL

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d roydadapp.ir -d www.roydadapp.ir -d api.roydadapp.ir
```

## Updating Your Application

After making code changes:

```bash
cd /var/www/azmooneh
chmod +x deploy/update.sh
./deploy/update.sh
```

## Troubleshooting

### Check Service Status

```bash
sudo systemctl status gunicorn
sudo systemctl status nginx
```

### View Logs

```bash
# Gunicorn logs
sudo journalctl -u gunicorn -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Restart Services

```bash
sudo systemctl restart gunicorn
sudo systemctl restart nginx
```

### Common Issues

1. **502 Bad Gateway**: Gunicorn not running
   ```bash
   sudo systemctl status gunicorn
   sudo journalctl -u gunicorn -n 50
   ```

2. **Static files not loading**: Run collectstatic
   ```bash
   python manage.py collectstatic --noinput
   ```

3. **CORS errors**: Check CORS_ALLOWED_ORIGINS in settings_production.py

## Environment Variables

Create `/var/www/azmooneh/.env`:

```bash
DJANGO_SECRET_KEY='your-secret-key-here'
DEBUG=False
ALLOWED_HOSTS=roydadapp.ir,www.roydadapp.ir,api.roydadapp.ir
```

## Security Checklist

- [x] DEBUG = False in production
- [x] Strong SECRET_KEY
- [x] HTTPS enabled
- [x] Firewall configured (allow 80, 443, 22)
- [ ] Regular backups configured
- [ ] Database password secured
- [ ] Change default VPS password

## Firewall Setup

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Backup Database

```bash
cd /var/www/azmooneh
source venv/bin/activate
python manage.py dumpdata > backup_$(date +%Y%m%d).json
```

## Support

For issues, check:
- Gunicorn logs: `sudo journalctl -u gunicorn -f`
- Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Django logs: Check your application logs

## URLs

- Frontend: https://roydadapp.ir
- Backend API: https://api.roydadapp.ir
- Admin Panel: https://api.roydadapp.ir/admin
