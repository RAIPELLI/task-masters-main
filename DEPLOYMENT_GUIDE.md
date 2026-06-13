# Deployment Guide: Railway.app

## Overview
This application is configured for single-link deployment on Railway.app with:
- **Frontend**: React + TypeScript (built to static files)
- **Backend**: FastAPI + Python
- **Database**: SQLite (local) or PostgreSQL (production)

## Prerequisites
1. Railway.app account (free tier available): https://railway.app
2. Git repository (GitHub/GitLab)
3. Docker (already configured via Dockerfile)

## Step-by-Step Deployment

### 1. Push Code to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/task-masters.git
git push -u origin main
```

### 2. Connect to Railway.app
1. Go to [railway.app](https://railway.app)
2. Click "Create Project"
3. Select "Deploy from GitHub"
4. Authorize GitHub and select your repository
5. Railway will automatically detect the Dockerfile

### 3. Configure Environment Variables
1. In Railway dashboard, go to your project
2. Click on the service
3. Go to "Variables" tab
4. Add the following environment variables:

```
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=your-super-secret-key-generate-random-string
ALGORITHM=HS256
OPENAI_API_KEY=your-openai-key-optional
CORS_ORIGINS=https://your-railway-domain.up.railway.app
```

### 4. Set Port (Railway Auto-Detection)
- Railway automatically sets `PORT` environment variable
- The Dockerfile and startup script use `$PORT` - no changes needed

### 5. Deploy
1. Click "Deploy" in Railway dashboard
2. Wait for build to complete (2-5 minutes)
3. Once deployed, Railway will provide a public URL

### 6. Access Your App
Your app will be available at the URL provided by Railway, e.g.:
```
https://task-masters-production.up.railway.app
```

## Production Configuration

### Database Upgrade (Optional)
For production, upgrade from SQLite to PostgreSQL:

1. In Railway dashboard, create a new PostgreSQL service
2. Get the connection string from Railway
3. Update `DATABASE_URL` environment variable:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   ```
4. Redeploy

### Environment Variables for Production
```
SECRET_KEY=generate-a-strong-random-string
ALGORITHM=HS256
DATABASE_URL=postgresql://user:pass@host/db  # Use PostgreSQL for production
OPENAI_API_KEY=your-api-key
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
CORS_ORIGINS=https://your-domain.up.railway.app
```

## File Structure During Deployment

```
project-root/
├── Dockerfile              (Multi-stage build)
├── railway.json            (Railway config)
├── package.json            (Frontend dependencies)
├── backend/
│   ├── main.py            (FastAPI app with static file mounting)
│   ├── requirements.txt    (Python dependencies)
│   ├── .env.example        (Environment template)
│   └── [other Python files]
├── src/                    (React source - built to dist/)
├── dist/                   (Built React app - created during Docker build)
└── [other config files]
```

## How the Single-Link Works

1. **Docker Build Process**:
   - Stage 1: Builds React frontend → `dist/` folder
   - Stage 2: Copies built React files to `frontend_dist/`
   - Sets up FastAPI to serve files

2. **Runtime**:
   - FastAPI starts on Railway's assigned `$PORT`
   - Serves `/api/*` routes as backend API
   - Serves all other routes from React static files
   - React handles client-side routing

3. **URL Pattern**:
   - `https://domain.up.railway.app/` → React app
   - `https://domain.up.railway.app/users/me` → Backend API
   - `https://domain.up.railway.app/bookings` → Backend API
   - Any unknown route → React index.html (SPA routing)

## Troubleshooting

### App won't deploy
- Check Docker builds locally: `docker build -t task-masters .`
- Verify Dockerfile syntax
- Check Railway build logs

### Frontend not loading
- Verify `frontend_dist` path in code
- Check if `npm run build` succeeded in Docker
- Review Railway deployment logs

### API calls failing
- Ensure `API_URL` in `src/lib/api.ts` is relative (empty string in prod)
- Check CORS settings - currently allows all origins
- Verify environment variables are set in Railway

### Database issues
- For SQLite: Persists in Railway volumes (ephemeral - data lost on redeploy)
- For PostgreSQL: Recommended for production
- Check `DATABASE_URL` environment variable

## Monitoring

1. **Railway Dashboard**:
   - View logs in real-time
   - Monitor CPU/Memory usage
   - Check deployment history

2. **Common Issues**:
   - Check `app.log` for errors
   - Review Python traceback in logs
   - Verify database connectivity

## Updating After Deployment

1. Make changes to code
2. Push to GitHub: `git push origin main`
3. Railway automatically redeploys
4. Changes live in 2-5 minutes

## Custom Domain (Optional)

1. In Railway: Project → Settings → Domains
2. Add custom domain
3. Update DNS records
4. Update `CORS_ORIGINS` environment variable

## Cost Considerations

- **Railway Free Tier**: $5 monthly credit (usually sufficient for small apps)
- **Usage-based pricing**: After free tier
- **Upgrade**: Simple scaling in Railway dashboard

## Support & Documentation

- Railway Docs: https://docs.railway.app
- FastAPI: https://fastapi.tiangolo.com
- React: https://react.dev
- Docker: https://docs.docker.com
