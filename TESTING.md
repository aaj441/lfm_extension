# Testing Guide for Last.fm Recommender

## Quick Start - Running the App

### Method 1: Python Server (Recommended)

1. Open a terminal in the project directory
2. Run the server:
   ```bash
   python3 server.py
   ```
3. Open your browser to: `http://localhost:8000`
4. Open the browser console (F12) to see debug logs

### Method 2: Direct File Open (May have CORS issues)

- Simply open `index.html` in your browser
- If you see errors, use Method 1 instead

## Testing the App

### Step 1: Connect to Last.fm

Try one of these demo usernames:
- `rj` - Last.fm founder, lots of scrobbles
- `bahnhof` - Active user with diverse taste
- Or use your own Last.fm username!

**What to expect:**
- Click "Connect"
- You should see "Connecting to Last.fm..." in the console
- The app will fetch your recent tracks
- Console will show API calls and responses

### Step 2: Check Now Playing

**What to expect:**
- You should see your most recent track displayed
- Track name, artist, album, and artwork should appear
- Check browser console for "Current track:" log

**If nothing appears:**
- Open browser console (F12 → Console tab)
- Look for error messages
- Common issues:
  - User has no scrobbles
  - API rate limit reached
  - CORS errors (use Python server instead)

### Step 3: Check Recommendations

**What to expect:**
- 5 recommendations should appear below the now playing track
- Each shows: track name, artist, album art, and similarity match %
- Pass (✕) and Like (♥) buttons on each

**Console logs to check:**
- "Generating recommendations for: [Artist]"
- "Found X similar artists"
- "Generated X recommendations"

### Step 4: Interact with Recommendations

**Test Pass button:**
1. Click ✕ on a recommendation
2. That recommendation should disappear
3. "Passed" counter should increase
4. Console shows the action

**Test Like button:**
1. Click ♥ on a recommendation
2. That recommendation should disappear
3. "Liked" and "Discovered" counters should increase
4. Console logs the liked track

### Step 5: Test Pagination

**What to expect:**
- If you have more than 5 recommendations, pagination appears
- Click → to go to next page
- Click ← to go to previous page
- Page indicator shows "Page X of Y"

### Step 6: Test Refresh

1. Click the 🔄 button
2. App should fetch your latest track
3. New recommendations should generate
4. Watch console for API calls

## Debugging Common Issues

### Issue: Nothing loads after clicking Connect

**Check:**
1. Open browser console (F12)
2. Look for error messages
3. Check network tab for failed API calls

**Possible causes:**
- Invalid username
- API key issues
- Network connectivity
- CORS (use Python server)

### Issue: "No similar artists found"

**Possible causes:**
- Artist is very obscure
- Artist name has special characters
- Try clicking refresh for a different track

### Issue: Images not loading

**What to check:**
- Some tracks don't have artwork
- This is normal - a placeholder will show
- Check console for image URLs

### Issue: Recommendations not showing

**What to check:**
1. Browser console for errors
2. Network tab for failed API calls
3. Try a different username or refresh

**Debug logs to look for:**
```
API Call: artist.getSimilar
Similar artists response: {...}
Found X similar artists
Loading recommended tracks...
Generated X recommendations
```

## Console Commands for Debugging

Open browser console and try:

```javascript
// Check if app is loaded
console.log('App loaded:', typeof LastFmRecommender !== 'undefined');

// Get localStorage data
console.log('Username:', localStorage.getItem('lfm_username'));
console.log('Stats:', localStorage.getItem('lfm_stats'));

// Clear localStorage and reload
localStorage.clear();
location.reload();
```

## Expected API Flow

1. **Connect:** `user.getInfo` → validates username
2. **Now Playing:** `user.getRecentTracks` → gets latest track
3. **Similar Artists:** `artist.getSimilar` → finds related artists
4. **Top Tracks:** `artist.getTopTracks` (for each similar artist) → builds recommendations

## Performance Notes

- Initial load: 5-10 seconds (fetching similar artists + tracks)
- Each recommendation fetch has a 100ms delay to avoid rate limiting
- Auto-refresh every 30 seconds for now playing

## Mobile Testing

### On iOS:
1. Start Python server: `python3 server.py`
2. Get your computer's local IP (e.g., 192.168.1.100)
3. On iPhone, open Safari
4. Go to: `http://192.168.1.100:8000`
5. Add to Home Screen for PWA experience

### On Android:
1. Start Python server
2. Get your computer's local IP
3. On Android, open Chrome
4. Go to: `http://[your-ip]:8000`
5. Menu → Add to Home screen

## Success Criteria

A working prototype should:
- ✅ Connect with a Last.fm username
- ✅ Display current/recent track with artwork
- ✅ Show 5 recommendations based on similar artists
- ✅ Allow pass/like interactions
- ✅ Show match percentages
- ✅ Support pagination
- ✅ Update stats counters
- ✅ Work on mobile browsers
- ✅ Show helpful error messages

## Need Help?

If you're stuck:
1. Check browser console for errors
2. Check network tab for failed requests
3. Try the demo usernames (rj, bahnhof)
4. Clear localStorage and try again
5. Make sure you're using the Python server
