#!/bin/bash
# Quick deployment script for VPS

echo "🚀 Starting Quick Deployment..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root"
    exit 1
fi

# Stop services
echo "⏸️  Stopping services..."
systemctl stop gunicorn
systemctl stop nginx

# Backup existing installation
if [ -d "/var/www/azmooneh" ]; then
    echo "💾 Backing up existing installation..."
    mv /var/www/azmooneh /var/www/azmooneh.backup.$(date +%Y%m%d_%H%M%S)
fi

# Copy new files
echo "📦 Installing new files..."
mkdir -p /var/www/azmooneh
cp -r ./* /var/www/azmooneh/

# Create virtual environment if it doesn't exist
cd /var/www/azmooneh
if [ ! -d "venv" ]; then
    echo "🐍 Creating virtual environment..."
    python3 -m venv venv
fi

# Install dependencies
echo "📚 Installing Python dependencies..."
source venv/bin/activate
pip install -r requirements.txt

# Set permissions
echo "🔐 Setting permissions..."
chown -R www-data:www-data /var/www/azmooneh/db.sqlite3
chmod 664 /var/www/azmooneh/db.sqlite3
chown -R www-data:www-data /var/www/azmooneh

# Copy systemd service files
echo "⚙️  Installing systemd services..."
cp deploy/gunicorn.service /etc/systemd/system/gunicorn.service
systemctl daemon-reload
systemctl enable gunicorn

# Copy nginx config
echo "🌐 Installing nginx config..."
cp deploy/nginx.conf /etc/nginx/sites-available/azmooneh
if [ ! -L "/etc/nginx/sites-enabled/azmooneh" ]; then
    ln -s /etc/nginx/sites-available/azmooneh /etc/nginx/sites-enabled/
fi

# Deploy frontend
echo "🎨 Deploying frontend..."
mkdir -p /var/www/html/azmooneh
cp -r dist/* /var/www/html/azmooneh/

# Test nginx config
echo "✅ Testing nginx configuration..."
nginx -t

# Start services
echo "▶️  Starting services..."
systemctl start gunicorn
systemctl start nginx

# Check status
echo ""
echo "📊 Service Status:"
systemctl status gunicorn --no-pager -l | head -10
echo ""
systemctl status nginx --no-pager -l | head -10

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "🌐 Frontend: https://roydadapp.ir"
echo "🔧 Backend API: https://api.roydadapp.ir/admin"
echo ""
echo "👤 Test Accounts:"
echo "   Professor: Tagepour / T1171313"
echo "   Student: 403663934 / student123"
echo "   Admin: admin / admin@123"
echo ""
echo "📝 Check SWOT tab for 11 Persian questions"
