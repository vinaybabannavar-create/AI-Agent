# Deployment Guide

This guide provides step-by-step instructions for deploying the AI Agent Builder System to production.

## Overview

- **Backend**: Deploy to Render or Railway
- **Frontend**: Deploy to Vercel or Netlify

## Prerequisites

- GitHub account
- Accounts on your chosen hosting platforms
- Your code pushed to GitHub

---

## Step 1: Push to GitHub

### Initialize Git Repository

```bash
cd "c:\Users\LENOVO\Downloads\AI AGENT BUILDER SYSTEM"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: AI Agent Builder System"
```

### Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `ai-agent-builder-system` (or your preferred name)
3. **Do NOT** initialize with README (we already have one)
4. Click "Create repository"

### Push to GitHub

```bash
# Add remote (replace with your repository URL)
git remote add origin https://github.com/yourusername/ai-agent-builder-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Verify

- Visit your GitHub repository
- Ensure all files are present
- **Verify sensitive files are NOT present**: `users.json`, `.env` files should be excluded

---

## Step 2: Deploy Backend

### Option A: Deploy to Render (Recommended)

#### 2.1 Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account (if not already connected)
4. Select your `ai-agent-builder-system` repository

#### 2.2 Configure Service

- **Name**: `ai-agent-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: 
  ```bash
  pip install -r requirements.txt
  ```
- **Start Command**:
  ```bash
  gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$PORT
  ```

#### 2.3 Environment Variables

Click **"Advanced"** and add:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://your-frontend-url.vercel.app` (update after frontend deployment) |
| `ENVIRONMENT` | `production` |

> **Note**: You'll update `FRONTEND_URL` after deploying the frontend in Step 3.

#### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, copy your backend URL (e.g., `https://ai-agent-backend.onrender.com`)

#### 2.5 Test Backend

Visit `https://your-backend-url.onrender.com/health` - you should see:
```json
{
  "status": "healthy",
  "service": "AI Agents Builder System",
  "environment": "production"
}
```

### Option B: Deploy to Railway

#### 2.1 Create Project

1. Go to [Railway](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository

#### 2.2 Configure

- Railway will auto-detect the Dockerfile
- Set **Root Directory**: `backend`
- Add environment variables:
  - `FRONTEND_URL`: `https://your-frontend-url.vercel.app`
  - `ENVIRONMENT`: `production`

#### 2.3 Deploy

1. Click **"Deploy"**
2. Copy your backend URL from Railway dashboard

---

## Step 3: Deploy Frontend

### Option A: Deploy to Vercel (Recommended)

#### 3.1 Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository

#### 3.2 Configure Project

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

#### 3.3 Environment Variables

Add the following:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | Your backend URL from Step 2 (e.g., `https://ai-agent-backend.onrender.com`) |

#### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-5 minutes)
3. Once deployed, copy your frontend URL (e.g., `https://ai-agent-builder.vercel.app`)

#### 3.5 Update Backend CORS

**IMPORTANT**: Go back to your backend hosting platform and update the `FRONTEND_URL` environment variable:

**For Render**:
1. Go to your backend service
2. Click **"Environment"**
3. Update `FRONTEND_URL` to your Vercel URL
4. Click **"Save Changes"**
5. Service will auto-redeploy

**For Railway**:
1. Go to your backend service
2. Click **"Variables"**
3. Update `FRONTEND_URL`
4. Service will auto-redeploy

### Option B: Deploy to Netlify

#### 3.1 Create Site

1. Go to [Netlify](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select your repository

#### 3.2 Configure

- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `.next`

#### 3.3 Environment Variables

Go to **Site settings** → **Environment variables** and add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | Your backend URL |

#### 3.4 Deploy

1. Click **"Deploy site"**
2. Update backend `FRONTEND_URL` as described above

---

## Step 4: Verify Deployment

### 4.1 Test Frontend

1. Visit your frontend URL
2. Try to sign up for a new account
3. Log in
4. Upload a document
5. Verify all features work

### 4.2 Test Backend

1. Visit `https://your-backend-url/docs`
2. Verify API documentation loads
3. Test the `/health` endpoint

### 4.3 Test Integration

1. Open browser developer tools (F12)
2. Go to Console tab
3. Navigate through your app
4. Verify no CORS errors
5. Check Network tab - API calls should succeed

---

## Step 5: Post-Deployment Setup

### 5.1 Custom Domain (Optional)

**Vercel**:
1. Go to your project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

**Render**:
1. Go to your service → **Settings** → **Custom Domain**
2. Add your domain
3. Update DNS records

### 5.2 Set Up Database (Recommended)

Currently, the app uses `users.json` for storage. For production, consider:

- **MongoDB Atlas** (free tier available)
- **PostgreSQL** on Render/Railway
- **Supabase** (free tier available)

### 5.3 Enable HTTPS

Both Vercel and Render provide automatic HTTPS. Verify:
- Frontend URL uses `https://`
- Backend URL uses `https://`
- Update environment variables if needed

---

## Troubleshooting

### CORS Errors

**Symptom**: Frontend can't connect to backend

**Solution**:
1. Verify `FRONTEND_URL` in backend matches your frontend URL exactly
2. Ensure both URLs use `https://` (not `http://`)
3. No trailing slash in URLs
4. Redeploy backend after changing environment variables

### Build Failures

**Backend**:
- Check build logs for missing dependencies
- Verify `requirements.txt` is correct
- Ensure Tesseract is available (included in Dockerfile)

**Frontend**:
- Check for TypeScript errors
- Verify all dependencies are in `package.json`
- Try deleting `node_modules` and `.next` locally, then push again

### Environment Variables Not Working

**Frontend**:
- Ensure variables are prefixed with `NEXT_PUBLIC_`
- Redeploy after adding/changing variables
- Check deployment logs

**Backend**:
- Verify variables are set in hosting platform
- Check for typos in variable names
- Redeploy after changes

### 500 Internal Server Error

**Backend**:
- Check backend logs in Render/Railway dashboard
- Verify all required environment variables are set
- Test `/health` endpoint

### Users Not Persisting

**Issue**: User data lost after backend restart

**Solution**: 
- This is expected with `users.json` storage
- Implement proper database (see Step 5.2)
- For temporary fix, use persistent storage volume (Render Disks)

---

## Monitoring

### Render

- View logs: Service → **Logs** tab
- Monitor metrics: Service → **Metrics** tab
- Set up alerts: Service → **Settings** → **Alerts**

### Vercel

- View deployments: Project → **Deployments**
- Check analytics: Project → **Analytics**
- Monitor logs: Deployment → **Functions** → View logs

---

## Updating Your Deployment

### Push Updates

```bash
# Make your changes
git add .
git commit -m "Your update message"
git push origin main
```

Both Vercel and Render will automatically redeploy when you push to GitHub.

### Manual Redeploy

**Render**: Service → **Manual Deploy** → **Deploy latest commit**

**Vercel**: Project → **Deployments** → **Redeploy**

---

## Cost Estimates

### Free Tier Limits

**Render**:
- Free tier available
- Spins down after 15 minutes of inactivity
- 750 hours/month free

**Vercel**:
- Free for personal projects
- 100 GB bandwidth/month
- Unlimited deployments

**Railway**:
- $5 free credit/month
- Pay-as-you-go after that

### Recommended for Production

- **Render**: $7/month (Starter plan) - no spin down
- **Vercel**: Free tier usually sufficient
- **Total**: ~$7/month

---

## Security Checklist

- [ ] All sensitive data in `.gitignore`
- [ ] Environment variables set correctly
- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS properly configured
- [ ] API keys not exposed in frontend code
- [ ] Database credentials secured (if using database)
- [ ] Regular dependency updates

---

## Next Steps

1. Set up monitoring and alerts
2. Implement proper database
3. Add automated testing
4. Set up CI/CD pipeline
5. Configure custom domain
6. Implement rate limiting
7. Add logging and analytics

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review deployment logs
3. Verify environment variables
4. Test locally first
5. Open an issue on GitHub

---

**Congratulations! Your AI Agent Builder System is now live! 🎉**
