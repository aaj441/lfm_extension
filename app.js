// Last.fm Recommender App
// Brings back the 2008 recommendation experience

class LastFmRecommender {
    constructor() {
        // Default API key (public, rate-limited)
        this.apiKey = '43693a24660b52cf68f3d27e62ed00ec'; // Public demo key
        this.username = '';
        this.currentTrack = null;
        this.recommendations = [];
        this.currentPage = 1;
        this.recsPerPage = 5;

        // Stats
        this.stats = {
            liked: 0,
            passed: 0,
            discovered: 0
        };

        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();

        if (this.username) {
            this.showMainContent();
            this.startRecommendations();
        }
    }

    setupEventListeners() {
        // Auth
        document.getElementById('connectBtn').addEventListener('click', () => this.connect());

        // Refresh
        document.getElementById('refreshBtn').addEventListener('click', () => this.refresh());

        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => this.previousPage());
        document.getElementById('nextPage').addEventListener('click', () => this.nextPage());

        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => this.showSettings());
    }

    async connect() {
        const username = document.getElementById('lastfmUsername').value.trim();
        const apiKey = document.getElementById('lastfmApiKey').value.trim();

        if (!username) {
            alert('Please enter your Last.fm username');
            return;
        }

        this.username = username;
        if (apiKey) {
            this.apiKey = apiKey;
        }

        // Test the connection
        try {
            const response = await this.apiCall('user.getInfo', { user: this.username });
            if (response.error) {
                alert('Could not find that user. Please check your username.');
                return;
            }

            this.saveToStorage();
            this.showMainContent();
            this.startRecommendations();
        } catch (error) {
            alert('Error connecting to Last.fm. Please try again.');
            console.error(error);
        }
    }

    showMainContent() {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    }

    showSettings() {
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('mainContent').style.display = 'none';
        document.getElementById('lastfmUsername').value = this.username;
    }

    async startRecommendations() {
        await this.fetchNowPlaying();
        await this.generateRecommendations();
        this.updateStats();

        // Auto-refresh now playing every 30 seconds
        setInterval(() => this.fetchNowPlaying(), 30000);
    }

    async refresh() {
        await this.fetchNowPlaying();
        await this.generateRecommendations();
    }

    async fetchNowPlaying() {
        try {
            const response = await this.apiCall('user.getRecentTracks', {
                user: this.username,
                limit: 1
            });

            if (response.recenttracks && response.recenttracks.track) {
                const track = Array.isArray(response.recenttracks.track)
                    ? response.recenttracks.track[0]
                    : response.recenttracks.track;

                this.currentTrack = {
                    name: track.name,
                    artist: track.artist['#text'] || track.artist.name,
                    album: track.album['#text'] || '',
                    image: this.getBestImage(track.image)
                };

                this.displayNowPlaying();
            }
        } catch (error) {
            console.error('Error fetching now playing:', error);
        }
    }

    displayNowPlaying() {
        if (!this.currentTrack) return;

        document.getElementById('currentTitle').textContent = this.currentTrack.name;
        document.getElementById('currentArtist').textContent = this.currentTrack.artist;
        document.getElementById('currentAlbum').textContent = this.currentTrack.album || 'Unknown Album';

        const artImg = document.getElementById('currentArt');
        artImg.src = this.currentTrack.image || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
        artImg.alt = this.currentTrack.name;
    }

    async generateRecommendations() {
        if (!this.currentTrack) return;

        this.recommendations = [];

        try {
            // Get similar artists (classic 2008 Last.fm approach!)
            const similarResponse = await this.apiCall('artist.getSimilar', {
                artist: this.currentTrack.artist,
                limit: 20
            });

            if (similarResponse.similarartists && similarResponse.similarartists.artist) {
                const similarArtists = Array.isArray(similarResponse.similarartists.artist)
                    ? similarResponse.similarartists.artist
                    : [similarResponse.similarartists.artist];

                // For each similar artist, get their top tracks
                for (let i = 0; i < Math.min(5, similarArtists.length); i++) {
                    const artist = similarArtists[i];

                    try {
                        const topTracksResponse = await this.apiCall('artist.getTopTracks', {
                            artist: artist.name,
                            limit: 3
                        });

                        if (topTracksResponse.toptracks && topTracksResponse.toptracks.track) {
                            const tracks = Array.isArray(topTracksResponse.toptracks.track)
                                ? topTracksResponse.toptracks.track
                                : [topTracksResponse.toptracks.track];

                            tracks.forEach(track => {
                                this.recommendations.push({
                                    name: track.name,
                                    artist: track.artist.name,
                                    image: this.getBestImage(track.image),
                                    similarTo: this.currentTrack.artist,
                                    match: Math.round(parseFloat(artist.match) * 100)
                                });
                            });
                        }
                    } catch (err) {
                        console.error(`Error fetching tracks for ${artist.name}:`, err);
                    }
                }
            }

            // Shuffle for variety
            this.recommendations = this.shuffleArray(this.recommendations);
            this.currentPage = 1;
            this.displayRecommendations();

        } catch (error) {
            console.error('Error generating recommendations:', error);
        }
    }

    displayRecommendations() {
        const container = document.getElementById('recommendationsList');
        container.innerHTML = '';

        const start = (this.currentPage - 1) * this.recsPerPage;
        const end = start + this.recsPerPage;
        const pageRecs = this.recommendations.slice(start, end);

        if (pageRecs.length === 0) {
            container.innerHTML = '<div class="loading">No recommendations available. Try refreshing!</div>';
            return;
        }

        pageRecs.forEach((rec, index) => {
            const item = document.createElement('div');
            item.className = 'recommendation-item';

            item.innerHTML = `
                <div class="rec-art">
                    <img src="${rec.image || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'}"
                         alt="${rec.name}">
                </div>
                <div class="rec-info">
                    <div class="rec-title">${rec.name}</div>
                    <div class="rec-artist">${rec.artist}</div>
                    <div class="rec-reason">Similar to ${rec.similarTo} (${rec.match}% match)</div>
                </div>
                <div class="rec-actions">
                    <button class="btn-action pass" data-index="${start + index}">✕</button>
                    <button class="btn-action like" data-index="${start + index}">♥</button>
                </div>
            `;

            container.appendChild(item);
        });

        // Add action listeners
        document.querySelectorAll('.btn-action.pass').forEach(btn => {
            btn.addEventListener('click', (e) => this.pass(parseInt(e.target.dataset.index)));
        });

        document.querySelectorAll('.btn-action.like').forEach(btn => {
            btn.addEventListener('click', (e) => this.like(parseInt(e.target.dataset.index)));
        });

        // Update pagination
        const totalPages = Math.ceil(this.recommendations.length / this.recsPerPage);
        document.getElementById('pageInfo').textContent = `Page ${this.currentPage} of ${totalPages}`;
        document.getElementById('prevPage').disabled = this.currentPage === 1;
        document.getElementById('nextPage').disabled = this.currentPage >= totalPages;
    }

    pass(index) {
        this.stats.passed++;
        this.recommendations.splice(index, 1);
        this.saveToStorage();
        this.displayRecommendations();
        this.updateStats();
    }

    like(index) {
        this.stats.liked++;
        this.stats.discovered++;

        const rec = this.recommendations[index];
        console.log('Liked:', rec);

        // Could save to a "liked" list here
        this.recommendations.splice(index, 1);
        this.saveToStorage();
        this.displayRecommendations();
        this.updateStats();
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.displayRecommendations();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.recommendations.length / this.recsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.displayRecommendations();
        }
    }

    updateStats() {
        document.getElementById('likedCount').textContent = this.stats.liked;
        document.getElementById('passedCount').textContent = this.stats.passed;
        document.getElementById('discoveredCount').textContent = this.stats.discovered;
    }

    async apiCall(method, params) {
        const url = new URL('https://ws.audioscrobbler.com/2.0/');
        url.searchParams.append('method', method);
        url.searchParams.append('api_key', this.apiKey);
        url.searchParams.append('format', 'json');

        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });

        const response = await fetch(url);
        return await response.json();
    }

    getBestImage(images) {
        if (!images || !Array.isArray(images)) return '';

        // Prefer large or extralarge images
        const large = images.find(img => img.size === 'large' || img.size === 'extralarge');
        if (large && large['#text']) return large['#text'];

        // Fallback to any image
        const anyImage = images.find(img => img['#text']);
        return anyImage ? anyImage['#text'] : '';
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    saveToStorage() {
        localStorage.setItem('lfm_username', this.username);
        localStorage.setItem('lfm_apikey', this.apiKey);
        localStorage.setItem('lfm_stats', JSON.stringify(this.stats));
    }

    loadFromStorage() {
        this.username = localStorage.getItem('lfm_username') || '';
        this.apiKey = localStorage.getItem('lfm_apikey') || this.apiKey;

        const savedStats = localStorage.getItem('lfm_stats');
        if (savedStats) {
            this.stats = JSON.parse(savedStats);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LastFmRecommender();
});
