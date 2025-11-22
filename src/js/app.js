import Player from './modules/Player.js';
import Playlist from './modules/Playlist.js';
import UIManager from './modules/UIManager.js';
import swipeLeft from './utils/swipe.js';
import '../scss/main.scss'; // Import styles for Vite

class App {
    constructor() {
        this.ui = new UIManager();
        this.playlist = new Playlist();
        this.player = new Player(document.getElementById('audio-player'));

        this.currentIndex = 0;
        this.activeTab = 'playlist'; // 'playlist' or 'favorites'

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialState();
    }

    setupEventListeners() {
        // Play/Pause
        this.ui.elements.playBtn.addEventListener('click', () => this.togglePlay());

        // Favorite
        this.ui.elements.favBtn.addEventListener('click', () => this.toggleFavorite());

        // Next/Prev
        this.ui.elements.nextBtn.addEventListener('click', () => this.nextSong());
        this.ui.elements.prevBtn.addEventListener('click', () => this.prevSong());

        // Audio Events
        this.player.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.player.audio.addEventListener('ended', () => this.nextSong());
        this.player.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.player.audio.addEventListener('play', () => this.ui.setPlayState(true));
        this.player.audio.addEventListener('pause', () => this.ui.setPlayState(false));

        // Progress Bar Click
        this.ui.elements.progressContainer.addEventListener('click', (e) => {
            const width = this.ui.elements.progressContainer.clientWidth;
            const clickX = e.offsetX;
            const percent = (clickX / width) * 100;
            this.player.seek(percent);
        });

        // Playlist Toggle
        this.ui.elements.showPlaylistBtn.addEventListener('click', () => {
            this.switchPlaylistView('playlist');
            if (!this.ui.elements.playlistContainer.classList.contains('active')) {
                this.ui.togglePlaylist();
            }
        });

        this.ui.elements.showFavoritesBtn.addEventListener('click', () => {
            this.switchPlaylistView('favorites');
            if (!this.ui.elements.playlistContainer.classList.contains('active')) {
                this.ui.togglePlaylist();
            }
        });

        this.ui.elements.backToPlaylistBtn.addEventListener('click', () => this.ui.togglePlaylist());

        // Load More
        this.ui.elements.loadMoreBtn.addEventListener('click', () => this.loadMoreSongs());

        // Play specific song from playlist
        document.addEventListener('play-song-index', (e) => {
            this.playSongAtIndex(e.detail);
            // Close playlist on mobile if song selected
            if (window.innerWidth < 768) {
                this.ui.togglePlaylist();
            }
        });
    }

    loadInitialState() {
        this.renderPlaylist();
        this.loadSong(this.currentIndex);
        this.ui.setActiveTab('playlist');
    }

    loadSong(index) {
        // Always get from the main list for playback to ensure continuity
        // Or if we want to play ONLY from favorites when in favorites view, we need to adjust this.
        // For now, let's keep playback linear based on the full list, but UI shows filtered.
        // BUT, if the user clicks a song in the filtered list, we need to know which one it is.

        // Actually, to support playing from favorites, we should probably track the "current playlist" context.
        // However, to keep it simple for this refactor:
        // We will play from the "all songs" list, but if the user clicks a song in the playlist view,
        // we find that song in the main list and play it.

        const song = this.playlist.getSong(index);
        if (!song) return;

        this.currentIndex = index;
        this.player.load(song);
        this.ui.updateSongInfo(song);

        // Update favorite button state
        const isFav = this.playlist.isFavorite(song._id);
        this.ui.toggleFavorite(isFav);

        this.ui.highlightActiveSong(index, this.getCurrentViewSongs());

        // Reset progress
        this.ui.updateProgress(0);
        this.ui.updateTime("0:00", "0:00");
    }

    togglePlay() {
        this.player.toggle();
    }

    toggleFavorite() {
        const song = this.playlist.getSong(this.currentIndex);
        if (song) {
            const isFav = this.playlist.toggleFavorite(song); // Returns true if added (isFav)
            this.ui.toggleFavorite(isFav);

            // If we are in favorites view, re-render to show/hide the song
            if (this.activeTab === 'favorites') {
                this.renderPlaylist();
            }
        }
    }

    playSongAtIndex(indexInView) {
        // If we are in favorites view, the index corresponds to the favorites array
        // We need to find the corresponding index in the main songs array

        let realIndex = indexInView;

        if (this.activeTab === 'favorites') {
            const favorites = this.playlist.getFavorites();
            const song = favorites[indexInView];
            const allSongs = this.playlist.getAllSongs();
            realIndex = allSongs.findIndex(s => s._id === song._id);
        }

        if (realIndex !== -1) {
            this.loadSong(realIndex);
            this.player.play();
        }
    }

    nextSong() {
        if (this.activeTab === 'favorites') {
            const favorites = this.playlist.getFavorites();
            if (favorites.length === 0) return;

            const currentSong = this.playlist.getSong(this.currentIndex);
            let currentFavIndex = favorites.findIndex(f => f._id === currentSong._id);

            let nextFavIndex = currentFavIndex + 1;
            if (nextFavIndex >= favorites.length) {
                nextFavIndex = 0;
            }
            this.playSongAtIndex(nextFavIndex);
        } else {
            let nextIndex = this.currentIndex + 1;
            if (nextIndex >= this.playlist.getAllSongs().length) {
                nextIndex = 0;
            }
            this.playSongAtIndex(nextIndex);
        }
    }

    prevSong() {
        if (this.activeTab === 'favorites') {
            const favorites = this.playlist.getFavorites();
            if (favorites.length === 0) return;

            const currentSong = this.playlist.getSong(this.currentIndex);
            let currentFavIndex = favorites.findIndex(f => f._id === currentSong._id);

            let prevFavIndex = currentFavIndex - 1;
            if (prevFavIndex < 0) {
                prevFavIndex = favorites.length - 1;
            }
            this.playSongAtIndex(prevFavIndex);
        } else {
            let prevIndex = this.currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = this.playlist.getAllSongs().length - 1;
            }
            this.playSongAtIndex(prevIndex);
        }
    }

    updateProgress() {
        const { currentTime, duration } = this.player.audio;
        if (!duration) return;

        const percent = (currentTime / duration) * 100;
        this.ui.updateProgress(percent);

        const currentFormatted = this.player.formatTime(currentTime);
        const totalFormatted = this.player.formatTime(duration);
        this.ui.updateTime(currentFormatted, totalFormatted);
    }

    updateDuration() {
        const { duration } = this.player.audio;
        const totalFormatted = this.player.formatTime(duration);
        this.ui.updateTime("0:00", totalFormatted);
    }

    async loadMoreSongs() {
        const currentCount = this.playlist.getAllSongs().length;
        const newSongs = await this.playlist.fetchMoreSongs(5, currentCount);

        if (newSongs.length > 0) {
            this.renderPlaylist();
        }
    }

    switchPlaylistView(view) {
        this.activeTab = view;
        this.ui.setActiveTab(view);
        this.ui.updatePlaylistHeader(view === 'favorites' ? 'Liked Songs' : 'Playlist');
        this.renderPlaylist();
    }

    getCurrentViewSongs() {
        return this.activeTab === 'favorites'
            ? this.playlist.getFavorites()
            : this.playlist.getAllSongs();
    }

    renderPlaylist() {
        const songs = this.getCurrentViewSongs();

        // We need to pass the "active index" relative to the current view
        let activeIndexInView = -1;
        const currentSong = this.playlist.getSong(this.currentIndex);

        if (currentSong) {
            activeIndexInView = songs.findIndex(s => s._id === currentSong._id);
        }

        this.ui.renderPlaylist(songs, activeIndexInView);

        // Re-attach swipe events to new elements
        songs.forEach((song, indexInView) => {
            const li = document.getElementById(`track-${song._id}`);
            if (li) {
                swipeLeft(li, () => {
                    // Handle swipe removal
                    // If in favorites, remove from favorites
                    // If in playlist, remove from playlist

                    if (this.activeTab === 'favorites') {
                        this.playlist.toggleFavorite(song);
                    } else {
                        const allSongs = this.playlist.getAllSongs();
                        const realIndex = allSongs.findIndex(s => s._id === song._id);
                        if (realIndex !== -1) {
                            this.playlist.removeSong(realIndex);
                            // If removing current song, play next or stop
                            if (realIndex === this.currentIndex) {
                                if (this.playlist.getAllSongs().length > 0) {
                                    this.nextSong();
                                } else {
                                    this.player.pause();
                                    this.ui.setPlayState(false);
                                }
                            } else if (realIndex < this.currentIndex) {
                                // Adjust current index if removing a song before it
                                this.currentIndex--;
                            }
                        }
                    }
                    this.renderPlaylist();
                });
            }
        });
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
