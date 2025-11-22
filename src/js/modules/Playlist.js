import apiNapster from "../services/apiNapster.js";

export default class Playlist {
    constructor() {
        this.songs = [];
        this.localSongs = [
            {
                id: "hey",
                previewURL: "hey",
                name: "Hey [Instrumental]",
                artistName: "The Beatles",
                albumId: "hey.jpg",
                duration: "02:51",
                type: "local"
            },
            {
                id: "summer",
                previewURL: "summer",
                name: "Summer Beats",
                artistName: "Summer EletroHits",
                albumId: "summer.jpg",
                duration: "03:37",
                type: "local"
            },
            {
                id: "ukulele",
                previewURL: "ukulele",
                name: "Ukulele Song",
                artistName: "Eddie Vader",
                albumId: "ukulele.jpg",
                duration: "02:26",
                type: "local"
            },
        ];

        // Initialize with local songs
        this.addSongs(this.localSongs);

        // Favorites
        this.favorites = this.loadFavorites();
    }

    loadFavorites() {
        const stored = localStorage.getItem('myPlayer_favorites');
        return stored ? JSON.parse(stored) : [];
    }

    saveFavorites() {
        localStorage.setItem('myPlayer_favorites', JSON.stringify(this.favorites));
    }

    toggleFavorite(song) {
        const index = this.favorites.findIndex(f => f._id === song._id);
        if (index === -1) {
            this.favorites.push(song);
        } else {
            this.favorites.splice(index, 1);
        }
        this.saveFavorites();
        return index === -1; // Returns true if added, false if removed
    }

    isFavorite(songId) {
        return this.favorites.some(f => f._id === songId);
    }

    getFavorites() {
        return this.favorites;
    }

    addSongs(newSongs) {
        const processedSongs = newSongs.map(song => {
            // Ensure unique ID for DOM
            const _id = song.id.replace(/\./g, "_");
            return { ...song, _id };
        });
        this.songs.push(...processedSongs);
        return processedSongs;
    }

    removeSong(index) {
        if (index >= 0 && index < this.songs.length) {
            this.songs.splice(index, 1);
        }
    }

    getSong(index) {
        return this.songs[index];
    }

    getAllSongs() {
        return this.songs;
    }

    async fetchMoreSongs(limit = 5, offset = 0) {
        const tracks = await apiNapster(limit, offset);
        return this.addSongs(tracks);
    }
}
