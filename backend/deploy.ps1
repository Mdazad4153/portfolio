# Portfolio Backend - Quick Deploy Script (PowerShell)
# This script helps you deploy your backend quickly

Write-Host "🚀 Portfolio Backend Deployment Helper" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Check if vercel is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found!" -ForegroundColor Red
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "✅ Vercel CLI found!" -ForegroundColor Green
Write-Host ""

# Check for .env file
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  No .env file found!" -ForegroundColor Yellow
    Write-Host "📋 Please create .env file with your configuration" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Required variables:" -ForegroundColor White
    Write-Host "  - SUPABASE_URL" -ForegroundColor Gray
    Write-Host "  - SUPABASE_SERVICE_KEY" -ForegroundColor Gray
    Write-Host "  - JWT_SECRET" -ForegroundColor Gray
    Write-Host "  - ADMIN_EMAIL" -ForegroundColor Gray
    Write-Host "  - ADMIN_PASSWORD" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "✅ .env file found!" -ForegroundColor Green
Write-Host ""

# Ask user which deployment type
Write-Host "Select deployment type:" -ForegroundColor Cyan
Write-Host "  1) Preview deployment (test)" -ForegroundColor White
Write-Host "  2) Production deployment" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter choice (1 or 2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "🔨 Deploying preview..." -ForegroundColor Yellow
    vercel
}
elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "🚀 Deploying to production..." -ForegroundColor Green
    vercel --prod
}
else {
    Write-Host "❌ Invalid choice!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Copy the deployment URL" -ForegroundColor White
Write-Host "  2. Update frontend API URL in:" -ForegroundColor White
Write-Host "     - frontend/js/admin.js" -ForegroundColor Gray
Write-Host "     - frontend/js/app.js" -ForegroundColor Gray
Write-Host "  3. Test your deployment" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Magenta
