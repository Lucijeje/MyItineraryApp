#!/bin/bash

# Heroku Deployment Script
# This script helps deploy the server to Heroku

echo "🚀 Heroku Deployment Script"
echo "============================"
echo ""

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed."
    echo "Please install it from: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "⚠️  Not logged in to Heroku. Please login:"
    heroku login
fi

# Navigate to server directory
cd server

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository in server directory..."
    git init
    git add .
    git commit -m "Initial commit for Heroku deployment"
fi

# Check if Heroku app exists
read -p "Enter your Heroku app name (or press Enter to create new): " app_name

if [ -z "$app_name" ]; then
    echo "Creating new Heroku app..."
    heroku create
    app_name=$(heroku apps:info --json | grep -o '"name":"[^"]*' | cut -d'"' -f4)
    echo "✅ Created app: $app_name"
else
    # Check if app exists
    if heroku apps:info -a "$app_name" &> /dev/null; then
        echo "✅ Using existing app: $app_name"
        heroku git:remote -a "$app_name"
    else
        echo "❌ App '$app_name' does not exist."
        read -p "Create new app with this name? (y/n): " create_app
        if [ "$create_app" = "y" ]; then
            heroku create "$app_name"
            heroku git:remote -a "$app_name"
        else
            exit 1
        fi
    fi
fi

# Deploy
echo ""
echo "🚀 Deploying to Heroku..."
git push heroku master || git push heroku main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Get your app URL: heroku info -a $app_name"
    echo "2. Update REACT_APP_API_URL in GitHub Secrets with your Heroku URL"
    echo "3. Open your app: heroku open -a $app_name"
    echo ""
    echo "⚠️  IMPORTANT: Heroku has ephemeral filesystem."
    echo "   Data in storage/ will be lost on restart."
    echo "   Consider using a database for production."
else
    echo "❌ Deployment failed. Check the error messages above."
    exit 1
fi
