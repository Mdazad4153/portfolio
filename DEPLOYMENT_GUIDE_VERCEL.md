# 🚀 Deployment Guide for Vercel

Your portfolio is fully configured for deployment on **Vercel**. Since we are using a **monorepo-style** setup (Frontend + Backend in one repo), we have configured `vercel.json` to handle everything automatically.

## ✅ Prerequisites

1.  **GitHub Repository**: Ensure your project is pushed to GitHub.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
3.  **Supabase Database**: Your database is already set up on Supabase.

## 🛠️ Deployment Steps

### 1. Push Code to GitHub
Ensure all your latest changes are pushed to your GitHub repository.
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Connect to Vercel
1.  Go to **Vercel Dashboard**.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository (`portfolio`).

### 3. Configure Project
- **Framework Preset**: Select **"Other"** (or leave default).
- **Root Directory**: Leave as `./` (root).
- **Build Command**: Leave empty.
- **Output Directory**: Leave empty.
- **Install Command**: `cd backend && npm install` (Optional but verifying dependencies is good, though Vercel usually handles root `vercel.json` builds automatically). *Actually, with our `vercel.json`, Vercel handles the backend build automatically.*

### 4. 🔑 Add Environment Variables (Crucial!)
In the Vercel Project Settings > **Environment Variables**, add the variables from your `backend/.env` file:

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | `your_supabase_url` |
| `SUPABASE_SERVICE_KEY` | `your_supabase_service_key` |
| `JWT_SECRET` | `your_jwt_secret` |
| `EMAIL_USER` | `your_email` (if using contact form) |
| `EMAIL_PASS` | `your_email_password` |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `NODE_ENV` | `production` |

### 5. Deploy 🚀
Click **"Deploy"**. Vercel will:
1.  Detect `vercel.json`.
2.  Build the backend as Serverless Functions (`/api/*`).
3.  Serve the frontend as Static Files (`/*`).

## 🌐 Post-Deployment
- Your site will be live at `https://your-project.vercel.app`.
- The Admin Panel will be at `https://your-project.vercel.app/admin.html`.
- API endpoints will work at `https://your-project.vercel.app/api/...`.

## 🔄 Updates
Whenever you push to GitHub, Vercel will automatically redeploy your site!
