#!/bin/bash

# Quick update script for code changes
# Run this after pushing new changes

set -e

APP_DIR="/var/www/azmooneh"

echo "🔄 Updating application..."

cd $APP_DIR

# Pull latest changes
git pull origin main

# Activate virtual environment
source venv/bin/activate

# Update Python dependencies
pip install -r requirements.txt

# Run migrations
export DJANGO_SETTINGS_MODULE=backend.settings_production
python manage.py migrate
python manage.py collectstatic --noinput

# Rebuild frontend
npm install
npm run build
sudo cp -r dist/* frontend/

# Restart services
sudo systemctl restart gunicorn
sudo systemctl reload nginx

echo "✅ Update complete!"
