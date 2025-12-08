# 🚀 Deployment Guide - Md Azad's Portfolio

## 📋 Pre-Deployment Checklist

### ✅ Code Ready
- [x] Backend server working locally
- [x] Frontend responsive and tested
- [x] Database connection stable
- [x] Environment variables configured
- [x] Git repository initialized
- [x] .gitignore properly set up

### ⚠️ Before Deployment

1. **Update API URLs** (Already configured with auto-detection)
   - `frontend/js/app.js` - Lines 1-2
   - `frontend/js/admin.js` - Lines 1-2
   - `frontend/js/photo-cropper.js` - Lines 400-401

2. **Environment Variables** (.env)
   - PORT
   - MONGODB_URI (Use MongoDB Atlas for production)
   - JWT_SECRET
   - EMAIL credentials (for contact form)

---

## 🌐 Deployment Options

### Option 1: Render.com (Recommended - FREE)

#### Backend Deployment

1. **Create Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Connect Repository**
   - Push code to GitHub
   - Connect GitHub to Render

3. **Create Web Service**
   - Click "New +" → "Web Service"
   - Select your repository
   - Configure:
     ```
     Name: portfolio-backend
     Environment: Node
     Build Command: cd backend && npm install
     Start Command: cd backend && npm start
     ```

4. **Add Environment Variables**
   ```
   MONGODB_URI=your_atlas_connection_string
   JWT_SECRET=your_secret_key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email
   EMAIL_PASS=your_app_password
   ```

5. **Deploy**
   - Save and deploy
   - Copy the deployed URL (e.g., `https://portfolio-xyz.onrender.com`)

#### Frontend Configuration

1. **Update API URL in JS files**
   ```javascript
   // Already configured - just update the production URL
   const API = isLocal ? 
     'http://localhost:5000/api' : 
     'https://YOUR-RENDER-URL.onrender.com/api';
   ```

2. Frontend will be served automatically by the backend server!

---

### Option 2: Vercel + MongoDB Atlas

#### Backend Setup

1. **MongoDB Atlas**
   - Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Get connection string
   - Whitelist all IPs (0.0.0.0/0)

2. **Vercel Deployment**
   ```bash
   npm install -g vercel
   cd backend
   vercel
   ```

3. **Add Environment Variables in Vercel Dashboard**

#### Frontend Setup

1. **Deploy to Vercel**
   ```bash
   cd frontend
   vercel
   ```

---

### Option 3: Railway.app (Alternative - FREE)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project from GitHub repo
4. Add environment variables
5. Deploy automatically

---

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free

2. **Create Cluster**
   - Choose FREE tier (M0)
   - Select nearest region
   - Create cluster

3. **Database Access**
   - Create database user
   - Save username & password

4. **Network Access**
   - Add IP: `0.0.0.0/0` (Allow from anywhere)

5. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/portfolio
   ```

6. **Seed Database**
   ```bash
   MONGODB_URI=your_atlas_uri node seed.js
   ```

---

## 📧 Email Configuration (Contact Form)

### Using Gmail

1. **Enable 2-Factor Authentication**
   - Go to Google Account Settings
   - Enable 2FA

2. **Generate App Password**
   - Go to Security → App Passwords
   - Generate password for "Mail"
   - Copy the 16-digit password

3. **Add to Environment Variables**
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASS=your-16-digit-app-password
   EMAIL_FROM=your.email@gmail.com
   ```

---

## 🔐 Security Checklist

- [ ] Change default admin password after first login
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Never commit `.env` file to GitHub
- [ ] Enable HTTPS (automatic on Render/Vercel)
- [ ] Use production MongoDB Atlas (not local)
- [ ] Restrict MongoDB network access if possible
- [ ] Set secure CORS policies

---

## 🧪 Testing Before Deployment

```bash
# Backend Health Check
curl https://your-backend-url.com/api/health

# Test API endpoints
curl https://your-backend-url.com/api/profile

# Check frontend loads
Open: https://your-backend-url.com/index.html
```

---

## 📱 Post-Deployment Steps

1. **Test All Features**
   - [ ] Login to admin panel
   - [ ] Upload profile photo
   - [ ] Add/Edit/Delete skills
   - [ ] Add projects
   - [ ] Test contact form
   - [ ] Check mobile responsiveness

2. **Update Links**
   - [ ] Update GitHub README with live URL
   - [ ] Add link to your resume/CV

3. **Monitor Performance**
   - Check Render logs for errors
   - Monitor MongoDB Atlas metrics

---

## 🐛 Common Issues & Solutions

### Issue: CORS Errors
**Solution:** Check backend CORS settings in `server.js`

### Issue: Database Connection Failed
**Solution:** 
- Verify MongoDB URI
- Check IP whitelist (0.0.0.0/0)
- Ensure database user has correct permissions

### Issue: Images Not Loading
**Solution:** 
- Check `/uploads` route in server.js
- Verify file upload permissions
- Ensure correct file paths

### Issue: Admin Login Not Working
**Solution:**
- Run `node seed.js` to create admin user
- Check JWT_SECRET is set
- Clear browser cookies

---

## 🎯 Current Configuration

### Automatic Environment Detection
Your app is already configured with smart environment detection:

```javascript
const isLocal = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1';
const API = isLocal ? 
  'http://localhost:5000/api' : 
  'https://portfolio-fbhl.onrender.com/api';
```

**Just update the production URL after deploying!**

---

## 📞 Support

For deployment issues:
1. Check Render/Vercel logs
2. Verify all environment variables
3. Test API endpoints manually
4. Check MongoDB Atlas connection

---

## 🎉 You're Ready to Deploy!

Your portfolio is **production-ready**! Just:
1. Push to GitHub
2. Deploy backend to Render
3. Update production API URL
4. Test everything
5. Share your awesome portfolio! 🚀

---

**Deployed By:** Md Azad Ansari  
**Tech Stack:** Node.js + Express + MongoDB + Vanilla JS  
**Deployment:** Render.com (Backend) + Static Frontend
