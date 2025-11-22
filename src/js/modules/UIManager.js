export default class UIManager {
    constructor() {
        this.elements = {
            app: document.getElementById('app'),
            albumCover: document.getElementById('album-cover'),
            songTitle: document.getElementById('song-title'),
            artistName: document.getElementById('artist-name'),
            currentDuration: document.getElementById('current-duration'),
            totalDuration: document.getElementById('total-duration'),
            progressBar: document.getElementById('progress-bar'),
            progressContainer: document.getElementById('progress-container'),
            playBtn: document.getElementById('play-btn'),
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn'),
            playlistContainer: document.getElementById('playlist-container'),
            showPlaylistBtn: document.getElementById('show-playlist-btn'),
            backToPlaylistBtn: document.getElementById('back-to-playlist'),
            songsList: document.getElementById('songs-list'),
            loadMoreBtn: document.getElementById('load-more-btn'),
            statusSong: document.getElementById('status-song'),
            favBtn: document.getElementById('fav-song'),
            showFavoritesBtn: document.getElementById('show-favorites-btn'),
            playlistHeaderTitle: document.querySelector('.playlist-header h1'),
        };
    }

    updatePlaylistHeader(title) {
        this.elements.playlistHeaderTitle.innerText = title;
    }

    setActiveTab(tab) {
        this.elements.showPlaylistBtn.classList.toggle('active', tab === 'playlist');
        this.elements.showFavoritesBtn.classList.toggle('active', tab === 'favorites');
    }

    toggleFavorite(isFav) {
        const icon = this.elements.favBtn.querySelector('i');
        if (isFav) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            this.elements.favBtn.style.color = '#f09';
        } else {
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            this.elements.favBtn.style.color = 'inherit';
        }
    }

    updateSongInfo(song) {
        this.elements.songTitle.innerText = song.name;
        this.elements.artistName.innerText = song.artistName;

        const coverSrc = song.type === 'local'
            ? `/media/images/${song.albumId}`
            : `http://direct.rhapsody.com/imageserver/v2/albums/${song.albumId}/images/400x400.jpg`;

        this.elements.albumCover.src = coverSrc;

        // Update background
        this.elements.app.style.setProperty('--bg-image', `url('${coverSrc}')`);
    }

    updateProgress(percent) {
        this.elements.progressBar.style.width = `${percent}%`;
    }

    updateTime(current, total) {
        this.elements.currentDuration.innerText = current;
        this.elements.totalDuration.innerText = total;
    }

    setPlayState(isPlaying) {
        const icon = this.elements.playBtn.querySelector('i');
        if (isPlaying) {
            this.elements.playBtn.classList.add('playing');
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            this.elements.statusSong.innerText = 'Now Playing';
            this.elements.albumCover.classList.add('playing');
        } else {
            this.elements.playBtn.classList.remove('playing');
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            this.elements.statusSong.innerText = 'Paused';
            this.elements.albumCover.classList.remove('playing');
        }
    }

    togglePlaylist() {
        this.elements.playlistContainer.classList.toggle('active');
    }

    renderPlaylist(songs, activeIndex) {
        this.elements.songsList.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.id = `track-${song._id}`;
            if (index === activeIndex) li.classList.add('active-song');

            li.innerHTML = `
        <div class="song-info">
          <span class="song-name">${song.name}</span>
          <span class="song-artist">${song.artistName}</span>
        </div>
        <span class="song-duration">${song.duration || '--:--'}</span>
      `;

            // Add click event to play this song
            li.addEventListener('click', () => {
                document.dispatchEvent(new CustomEvent('play-song-index', { detail: index }));
            });

            this.elements.songsList.appendChild(li);
        });
    }

    highlightActiveSong(index, songs) {
        const allItems = this.elements.songsList.querySelectorAll('li');
        allItems.forEach(item => item.classList.remove('active-song'));

        if (songs[index]) {
            const activeItem = this.elements.songsList.querySelector(`#track-${songs[index]._id}`);
            if (activeItem) activeItem.classList.add('active-song');
        }
    }
}
