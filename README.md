# Last.fm Recommender - 2008 Style

Bring back the golden age of music discovery! This app recreates the classic Last.fm recommendation experience from 2008, when recommendations felt real and organic through collaborative filtering instead of modern algorithms.

## Features

- **Now Playing Display** - See your current track with album art
- **Classic Recommendations** - Get 5 song recommendations based on similar artists (the 2008 way!)
- **Pass/Like System** - Swipe-style discovery with pass (✕) and like (♥) buttons
- **Pagination** - Browse through multiple pages of recommendations
- **Mobile-First Design** - Built for listening on the go
- **Retro Black & Red Theme** - Styled like the late 2000s Last.fm

## How It Works

1. **Connect Your Last.fm Account** - Enter your Last.fm username to get started
2. **Now Playing Sync** - The app fetches your currently playing or most recent track
3. **Collaborative Filtering** - Using Last.fm's similar artist data, it finds artists that sound alike
4. **Human-Curated Recs** - Recommendations are based on real user listening patterns, not algorithms
5. **Discover & Rate** - Like or pass on each recommendation to refine your taste

## Getting Started

### Quick Start (Recommended)

1. **Start the server:**
   ```bash
   python3 server.py
   ```

2. **Open in your browser:**
   ```
   http://localhost:8000
   ```

3. **Try it out:**
   - Enter a Last.fm username (try: `rj` or `bahnhof`)
   - Or use your own Last.fm username
   - Click "Connect"
   - Start discovering music!

4. **Debug mode:**
   - Open browser console (F12) to see detailed logs
   - See [TESTING.md](TESTING.md) for full testing guide

### Alternative: Direct File Open

Simply open `index.html` in your browser (may have CORS limitations)

### Using as a Mobile Web App (PWA)

On mobile devices, you can "install" this as an app:

**iOS:**
1. Open in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"

**Android:**
1. Open in Chrome
2. Tap the menu (⋮)
3. Tap "Add to Home Screen"

## The 2008 Difference

Back in 2008, Last.fm's recommendations were built on **collaborative filtering** - real people's listening habits creating connections between artists. The algorithm was simpler but felt more authentic. This app brings that experience back by:

- Using Last.fm's similar artist API (still powered by historical listening data)
- Focusing on artist similarity over playlist algorithms
- Simple pass/like interface for discovery
- No machine learning black boxes

## Tech Stack

- Vanilla JavaScript (no framework bloat!)
- Last.fm Web API
- Progressive Web App (PWA) ready
- Mobile-responsive design

## Customization

Want to tweak the style? Edit `style.css` to adjust the black and red color scheme:

```css
:root {
    --lfm-red: #e31c23;
    --lfm-dark-red: #b71519;
    --lfm-bg: #0a0a0a;
    --lfm-secondary-bg: #1a1a1a;
}
```

## Future Ideas

- [ ] Integration with genome project data
- [ ] Save liked tracks to playlists
- [ ] Playback controls (Spotify/YouTube integration)
- [ ] Export recommendations
- [ ] Social features (share discoveries)

## License

Built with nostalgia for the golden age of music discovery.