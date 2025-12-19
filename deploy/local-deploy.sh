#!/bin/bash

# Run this script from your LOCAL machine to deploy to VPS

set -e

VPS_IP="193.151.154.135"
VPS_USER="root"
APP_DIR="/var/www/azmooneh"

echo "📦 Preparing deployment package..."

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo "Using temp directory: $TEMP_DIR"

# Copy project files (excluding unnecessary files)
rsync -av --progress \
    --exclude='node_modules' \
    --exclude='venv' \
    --exclude='.git' \
    --exclude='__pycache__' \
    --exclude='*.pyc' \
    --exclude='db.sqlite3' \
    --exclude='dist' \
    --exclude='.env' \
    ./ "$TEMP_DIR/"

echo "🚀 Uploading to VPS..."

# Upload to VPS
ssh $VPS_USER@$VPS_IP "mkdir -p $APP_DIR"
rsync -avz --progress "$TEMP_DIR/" $VPS_USER@$VPS_IP:$APP_DIR/

echo "🔧 Running deployment on VPS..."

# Run deployment script on VPS
ssh $VPS_USER@$VPS_IP "cd $APP_DIR && chmod +x deploy/deploy.sh && ./deploy/deploy.sh"

# Cleanup
rm -rf "$TEMP_DIR"

echo "✅ Deployment complete!"
echo ""
echo "Your app should be available at:"
echo "  https://roydadapp.ir"
echo "  https://api.roydadapp.ir"
