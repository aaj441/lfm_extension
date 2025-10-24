# Deployment Guide for Last.fm Recommender

## Issues Identified

The bill deployment failure was caused by missing deployment configuration files and improper server setup for production platforms.

### Root Causes:
1. **Missing Production Server**: The app only had a development server (`server.py`) using Python's built-in `http.server`
2. **No Deployment Configs**: Missing `railway.json`, `vercel.json`, `Procfile`, and `requirements.txt`
3. **No WSGI Support**: Production platforms need WSGI-compatible applications
4. **Missing Dependencies**: No `requirements.txt` for Python package management

## Files Added for Deployment

### 1. `requirements.txt`
```
gunicorn==21.2.0
```
- Adds Gunicorn WSGI server for production deployment

### 2. `railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "gunicorn --bind 0.0.0.0:$PORT server:app",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 3. `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.py"
    }
  ],
  "env": {
    "PYTHONPATH": "."
  }
}
```

### 4. `Procfile`
```
web: gunicorn --bind 0.0.0.0:$PORT server:app
```

### 5. `Dockerfile`
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
ENV PORT=8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "server:app"]
```

### 6. Updated `server.py`
- Added WSGI application support (`app = application`)
- Maintains backward compatibility for development
- Proper CORS headers for production
- Error handling for missing files

## Deployment Instructions

### Railway Deployment
1. Connect your GitHub repository to Railway
2. Railway will automatically detect the `railway.json` configuration
3. The app will be deployed using the specified start command
4. Railway will handle the port binding automatically

### Versa Deployment
1. Connect your GitHub repository to Versa
2. Versa will use the `vercel.json` configuration
3. The Python buildpack will install dependencies from `requirements.txt`
4. Routes will be handled by the WSGI application

### Manual Deployment
```bash
# Install dependencies
pip install -r requirements.txt

# Run with Gunicorn
gunicorn --bind 0.0.0.0:8000 server:app

# Or run development server
python3 server.py
```

## Testing the Fix

### Local Testing
```bash
# Test development server
python3 server.py

# Test production server
gunicorn --bind 0.0.0.0:8000 server:app
```

### Verify Deployment
1. Check that the app loads at the deployment URL
2. Test Last.fm connection with demo usernames (`rj`, `bahnhof`)
3. Verify CORS headers are present
4. Check browser console for any errors

## Troubleshooting

### Common Issues

1. **Port Binding Errors**
   - Ensure the app uses `$PORT` environment variable
   - Railway/Versa will set this automatically

2. **CORS Issues**
   - The updated server includes proper CORS headers
   - Check browser console for CORS errors

3. **File Not Found Errors**
   - Ensure all static files are in the repository
   - Check file paths in the WSGI application

4. **Python Version Issues**
   - Railway uses Python 3.11 by default
   - Versa uses the version specified in `vercel.json`

### Debug Commands
```bash
# Check if Gunicorn is installed
pip list | grep gunicorn

# Test WSGI application
python3 -c "from server import app; print('WSGI app loaded successfully')"

# Check file permissions
ls -la *.html *.js *.css
```

## Next Steps

1. **Commit and Push** the new configuration files
2. **Redeploy** to Railway/Versa
3. **Test** the deployed application
4. **Monitor** logs for any remaining issues

The deployment should now work successfully on both Railway and Versa platforms.