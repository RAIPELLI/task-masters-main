# Quick Start: Deploy to Railway.app with Single Link

## 🚀 5-Minute Setup

### What You Get
✅ Single public URL for entire app (frontend + backend)
✅ Automatic SSL/HTTPS
✅ Free tier available  
✅ Auto-redeploy on git push

### Files Added for Deployment
```
✓ Dockerfile               - Multi-stage build (React + FastAPI)
✓ railway.json            - Railway configuration
✓ DEPLOYMENT_GUIDE.md     - Detailed guide
✓ backend/.env.example    - Environment template
✓ Updated API routing     - Relative URLs for production
```

### One-Time Setup

#### 1. Create GitHub Repo
```bash
cd your-project-folder
git init
git add .
git commit -m "Ready for Railway deployment"
git remote add origin https://github.com/YOU/task-masters.git
git push -u origin main
```

#### 2. Connect Railway (Click-by-Click)
1. Go to https://railway.app
2. Sign up (free account)
3. Click "Create Project" → "Deploy from GitHub"
4. Select your repo
5. Railway auto-detects Dockerfile ✨

#### 3. Set Environment Variables in Railway
In Railway Dashboard → Variables:
```
SECRET_KEY=generate-random-string-here
ALGORITHM=HS256
DATABASE_URL=sqlite:///./test.db
OPENAI_API_KEY=optional-your-key
CORS_ORIGINS=https://your-railway-url.up.railway.app
```

#### 4. Click Deploy
Done! Your app is live at: `https://your-project-xxxxx.up.railway.app`

---

## 🔄 After Deployment

### Make Changes & Redeploy
```bash
# Make code changes
git add .
git commit -m "Your changes"
git push origin main
# Railway auto-redeploys in 2-5 minutes!
```

### Access Your App
```
Frontend: https://your-project-xxxxx.up.railway.app
API:      https://your-project-xxxxx.up.railway.app/users/me
```

---

## 📊 Architecture

```
One URL → Railway Container
                ↓
        Docker runs Dockerfile
                ↓
    ┌─────────────────────────┐
    │   Frontend (React)      │
    │   Served as static      │
    │   files from /          │
    └─────────────────────────┘
    ┌─────────────────────────┐
    │   Backend (FastAPI)     │
    │   Routes /api/* and /*  │
    │   Databases SQLite      │
    └─────────────────────────┘
```

---

## 💡 Tips

- **First deploy**: Takes 2-5 minutes (builds Docker image)
- **Subsequent deploys**: ~1-2 minutes  
- **Data persistence**: SQLite data lost on rebuild (use PostgreSQL for production)
- **Custom domain**: Railway → Settings → Domains
- **Monitor logs**: Railway Dashboard → Service → Logs tab

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| 502 Bad Gateway | Check Railway logs for backend errors |
| Frontend not loading | Verify `npm run build` works locally |
| API 404 errors | Check `API_URL` in `src/lib/api.ts` is empty/relative |
| Database errors | Verify `DATABASE_URL` env var is set |

---

## 📖 Full Documentation
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed setup

## ✨ What Changed

**Code Changes** (minimal - keeps project intact):
- Added Dockerfile (multi-stage build)
- Added railway.json config  
- Updated `src/lib/api.ts` to use relative URLs in production
- Added static file mounting to `backend/main.py`

**No breaking changes** - local development still works as before!

---

## 🎯 Next Steps

1. ✅ Test locally: `npm run dev` (frontend) + `python backend/main.py` (backend)
2. ✅ Push to GitHub
3. ✅ Deploy to Railway.app
4. ✅ Share your link!

**Your public URL will be**: `https://[project-name]-[random].up.railway.app`
