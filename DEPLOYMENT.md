# Railway Deployment Guide

## Quick Deploy to Railway

### Option 1: One-Click Deploy (Recommended)

1. **Push your code to GitHub** (already done!)

2. **Go to Railway.app:**
   - Visit [railway.app](https://railway.app)
   - Sign in with GitHub

3. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository: `aaj441/lfm_extension`
   - Railway will auto-detect the Python app

4. **Wait for deployment:**
   - Railway will automatically:
     - Detect Python via `requirements.txt` and `runtime.txt`
     - Read `railway.json` for configuration
     - Execute `Procfile` or `nixpacks.toml` start command
     - Bind to the provided `PORT` environment variable

5. **Access your app:**
   - Click "View Deployment"
   - Your app will be live at: `https://your-app.railway.app`

### Option 2: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
railway up
```

## Configuration Files Explained

### `Procfile`
Tells Railway how to start the app:
```
web: python3 server.py
```

### `railway.json`
Railway-specific configuration:
- Uses NIXPACKS builder
- Start command: `python3 server.py`
- Restart policy for reliability

### `requirements.txt`
Declares Python dependencies (empty for this project, but needed for detection)

### `runtime.txt`
Specifies Python version: `python-3.11`

### `nixpacks.toml`
Alternative to Procfile, same start command

### Updated `server.py`
Now supports:
- Dynamic PORT from environment variable
- Binds to 0.0.0.0 (required for Railway)
- Production logging

## Troubleshooting Railway Deployment

### Issue: "Application failed to respond"

**Check:**
1. Server is binding to `0.0.0.0`, not `localhost`
2. Using `PORT` environment variable from Railway
3. Check Railway logs for errors

**Fix:**
```python
PORT = int(os.environ.get('PORT', 8000))
socketserver.TCPServer(("0.0.0.0", PORT), ...)
```

### Issue: "Build failed"

**Check Railway logs for:**
- Python version compatibility
- Missing files
- Syntax errors

**Common fixes:**
- Ensure `runtime.txt` specifies supported Python version
- Check `requirements.txt` exists (even if empty)
- Verify `server.py` has no syntax errors

### Issue: "Port already in use"

**This shouldn't happen on Railway**, but locally:
```bash
# Kill process using port 8000
lsof -ti:8000 | xargs kill -9
```

### Issue: Deployment succeeds but app doesn't load

**Check:**
1. Open Railway deployment logs
2. Look for "Last.fm Recommender Server Running!"
3. Check which port it's listening on
4. Verify no CORS errors in browser console

**Debug:**
- Railway provides logs in real-time
- Click "View Logs" in Railway dashboard
- Look for Python errors or HTTP request logs

### Issue: CORS errors in production

**Already handled** in `server.py`:
```python
self.send_header('Access-Control-Allow-Origin', '*')
```

If still seeing errors, check:
- Browser console for specific CORS error
- Last.fm API is being called from client-side (should work)

## Environment Variables

This app doesn't require any environment variables, but you can add them in Railway:

**Optional Variables:**
- `PORT` - Automatically set by Railway (don't override)
- Custom variables for future features

## Monitoring Your Deployment

### Railway Dashboard:
- **Deployments**: See build and deploy history
- **Metrics**: CPU, memory, bandwidth usage
- **Logs**: Real-time application logs
- **Settings**: Environment variables, domains

### Expected Logs:
```
🎵 Last.fm Recommender Server Running!
📱 Listening on port: [dynamic-port]
☁️  Railway deployment mode
```

### Health Check:
Once deployed, visit:
- `https://your-app.railway.app/` - Should load the app
- `https://your-app.railway.app/index.html` - Should load the app
- Browser console should show: "Last.fm Recommender initialized!"

## Custom Domain (Optional)

1. In Railway dashboard, go to Settings
2. Click "Generate Domain" for free Railway subdomain
3. Or add custom domain:
   - Add your domain
   - Update DNS records as instructed
   - Wait for DNS propagation

## Scaling

This static app needs minimal resources:
- **CPU**: Very low (serving static files)
- **Memory**: ~50-100MB
- **Bandwidth**: Depends on traffic

Railway's free tier should be sufficient for moderate use.

## Production Checklist

Before going live:
- ✅ Server binds to 0.0.0.0
- ✅ Uses PORT environment variable
- ✅ CORS headers enabled
- ✅ Static files served correctly
- ✅ No hardcoded localhost URLs
- ✅ Error handling in place
- ✅ Logs are informative

## Alternative: Static Hosting

Since this is a static frontend app, you could also deploy to:
- **Netlify** - Drop the folder, instant deploy
- **Vercel** - Same as Netlify
- **GitHub Pages** - Free hosting from your repo
- **Cloudflare Pages** - Fast global CDN

For static hosting, you don't need `server.py` - just the HTML/CSS/JS files!

### Quick Netlify Deploy:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd /home/user/lfm_extension
netlify deploy --prod
```

Drag and drop these files to Netlify:
- index.html
- style.css
- app.js
- manifest.json

## Support

If deployment still fails:
1. Check Railway's status page
2. Review Railway logs carefully
3. Test locally first: `python3 server.py`
4. Verify all config files are committed to git
5. Check Railway Discord/community forums
