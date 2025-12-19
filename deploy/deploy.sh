#!/bin/bash

# Deployment script for Azmooneh App on VPS
# Run this script on your VPS

set -e

echo "🚀 Starting deployment for roydadapp.ir..."

# Configuration
APP_DIR="/var/www/azmooneh"
REPO_URL="https://github.com/DanixMP/Azmooneh.git"
DOMAIN="roydadapp.ir"
API_DOMAIN="api.roydadapp.ir"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Step 1: Installing system dependencies...${NC}"
sudo apt update
sudo apt install -y python3-pip python3-venv nginx git curl

# Install Node.js 20.x
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo -e "${GREEN}✓ System dependencies installed${NC}"

echo -e "${YELLOW}Step 2: Setting up application directory...${NC}"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Clone or update repository
if [ -d "$APP_DIR/.git" ]; then
    echo "Updating existing repository..."
    cd $APP_DIR
    git pull origin main
else
    echo "Cloning repository..."
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

echo -e "${GREEN}✓ Application directory ready${NC}"

echo -e "${YELLOW}Step 3: Setting up Python virtual environment...${NC}"
cd $APP_DIR
python3 -m venv venv
source venv/bin/activate

echo -e "${YELLOW}Step 4: Installing Python dependencies...${NC}"
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn psycopg2-binary

echo -e "${GREEN}✓ Python dependencies installed${NC}"

echo -e "${YELLOW}Step 5: Building frontend...${NC}"
npm install --include=dev
chmod +x node_modules/.bin/vite
npx vite build

# Create frontend directory
sudo mkdir -p $APP_DIR/frontend
sudo cp -r dist/* $APP_DIR/frontend/

echo -e "${GREEN}✓ Frontend built${NC}"

echo -e "${YELLOW}Step 6: Configuring Django...${NC}"
export DJANGO_SETTINGS_MODULE=backend.settings_production

# Generate a secure secret key
DJANGO_SECRET_KEY=$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
echo "DJANGO_SECRET_KEY='$DJANGO_SECRET_KEY'" > .env

# Run migrations
python manage.py migrate
python manage.py collectstatic --noinput

echo -e "${GREEN}✓ Django configured${NC}"

echo -e "${YELLOW}Step 7: Setting up Gunicorn service...${NC}"
sudo mkdir -p /var/log/gunicorn
sudo cp deploy/gunicorn.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable gunicorn
sudo systemctl restart gunicorn

echo -e "${GREEN}✓ Gunicorn service configured${NC}"

echo -e "${YELLOW}Step 8: Configuring Nginx...${NC}"
sudo cp deploy/nginx.conf /etc/nginx/sites-available/azmooneh
sudo ln -sf /etc/nginx/sites-available/azmooneh /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo -e "${GREEN}✓ Nginx configured${NC}"

echo -e "${YELLOW}Step 9: Setting up SSL with Let's Encrypt...${NC}"
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d $DOMAIN -d $API_DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

echo -e "${GREEN}✓ SSL certificates installed${NC}"

echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "Your application is now running at:"
echo "  Frontend: https://$DOMAIN"
echo "  Backend API: https://$API_DOMAIN"
echo ""
echo "Useful commands:"
echo "  Check Gunicorn status: sudo systemctl status gunicorn"
echo "  Check Nginx status: sudo systemctl status nginx"
echo "  View Gunicorn logs: sudo journalctl -u gunicorn -f"
echo "  View Nginx logs: sudo tail -f /var/log/nginx/error.log"
