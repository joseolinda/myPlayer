export default class Player {
    constructor(audioElement) {
        this.audio = audioElement;
        this.isPlaying = false;
    }

    load(song) {
        if (!song) return;

        const src = song.type === 'local'
            ? `/media/musics/${song.previewURL}.mp3`
            : song.previewURL;

        this.audio.src = src;
        this.audio.load();
    }

    play() {
        this.audio.play()
            .then(() => {
                this.isPlaying = true;
            })
            .catch(err => console.error("Error playing audio:", err));
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    seek(percent) {
        if (this.audio.duration) {
            const time = (this.audio.duration * percent) / 100;
            this.audio.currentTime = time;
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}
