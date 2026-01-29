# Heroku Deployment Script for PowerShell
# This script helps deploy the server to Heroku

Write-Host "🚀 Heroku Deployment Script" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Check if Heroku CLI is installed
try {
    $null = heroku --version
} catch {
    Write-Host "❌ Heroku CLI is not installed." -ForegroundColor Red
    Write-Host "Please install it from: https://devcenter.heroku.com/articles/heroku-cli" -ForegroundColor Yellow
    exit 1
}

# Check if logged in to Heroku
try {
    $null = heroku auth:whoami 2>$null
} catch {
    Write-Host "⚠️  Not logged in to Heroku. Please login:" -ForegroundColor Yellow
    heroku login
}

# Navigate to server directory
Set-Location server

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing git repository in server directory..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit for Heroku deployment"
}

# Check if Heroku app exists
$app_name = Read-Host "Enter your Heroku app name (or press Enter to create new)"

if ([string]::IsNullOrWhiteSpace($app_name)) {
    Write-Host "Creating new Heroku app..." -ForegroundColor Yellow
    heroku create
    $app_name = (heroku apps:info --json | ConvertFrom-Json).name
    Write-Host "✅ Created app: $app_name" -ForegroundColor Green
} else {
    # Check if app exists
    try {
        $null = heroku apps:info -a "$app_name" 2>$null
        Write-Host "✅ Using existing app: $app_name" -ForegroundColor Green
        heroku git:remote -a "$app_name"
    } catch {
        Write-Host "❌ App '$app_name' does not exist." -ForegroundColor Red
        $create_app = Read-Host "Create new app with this name? (y/n)"
        if ($create_app -eq "y") {
            heroku create "$app_name"
            heroku git:remote -a "$app_name"
        } else {
            exit 1
        }
    }
}

# Deploy
Write-Host ""
Write-Host "🚀 Deploying to Heroku..." -ForegroundColor Yellow

try {
    git push heroku master
} catch {
    try {
        git push heroku main
    } catch {
        Write-Host "❌ Deployment failed. Check the error messages above." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Deployment successful!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Get your app URL: heroku info -a $app_name"
Write-Host "2. Update REACT_APP_API_URL in GitHub Secrets with your Heroku URL"
Write-Host "3. Open your app: heroku open -a $app_name"
Write-Host ""
Write-Host "⚠️  IMPORTANT: Heroku has ephemeral filesystem." -ForegroundColor Yellow
Write-Host "   Data in storage/ will be lost on restart." -ForegroundColor Yellow
Write-Host "   Consider using a database for production." -ForegroundColor Yellow

Set-Location ..
