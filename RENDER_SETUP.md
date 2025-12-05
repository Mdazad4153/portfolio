# 🚀 How to Deploy to Render

This project is configured to be deployed as a **Web Service** on Render. Since `frontend` files are served by the `backend`, you only need to deploy the backend service!

## Step 1: Create Database (MongoDB Atlas)
Since Render doesn't host databases for free (persistently), use MongoDB Atlas:
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a free cluster (M0 Sandbox).
3.  Click "Connect" > "Connect your application".
4.  Copy the URL. It looks like:
    `const MONGODB_URI = "mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/portfolio?retryWrites=true&w=majority";`
5.  Replace `<password>` with your database password.

## Step 2: Deploy to Render
1.  Push your code to GitHub (if not already done).
2.  Go to [Render Dashboard](https://dashboard.render.com/).
3.  Click **New +** > **Web Service**.
4.  Connect your GitHub repository.
5.  Configure the service:
    *   **Name:** `portfolio-api` (or anything you like)
    *   **Region:** Singapore (or nearest to you)
    *   **Branch:** `main` (or master)
    *   **Root Directory:** `backend` (Important!)
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start`
    *   **Plan:** Free

## Step 3: Add Environment Variables
In the Render dashboard for your service, go to the **Environment** tab and add these keys (from your `.env.example`):

| Key | Value |
| --- | --- |
| `MONGODB_URI` | Your MongoDB Atlas URL (Step 1) |
| `JWT_SECRET` | Any long random secret text |
| `EMAIL_USER` | Your email (for contact form) |
| `EMAIL_PASS` | Your App Password (not login password) |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |

## Step 4: Access your Site
Once deployed, Render will give you a URL like: `https://portfolio-api.onrender.com`.
Open this URL, and your **Portfolio Website will load!** (Because we configured the backend to serve the frontend files).
