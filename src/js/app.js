// Mapear elementos
const backBtn               = document.querySelector("#back-to-playlist")
const favBtn                = document.querySelector("#fav-song")
const statusSong            = document.querySelector("#status-song")
const albumCoverImg         = document.querySelector("#album-cover")

const currentDuration       = document.querySelector("#current-duration")
const totalDuration         = document.querySelector("#total-duration")
const progressBar           = document.querySelector("#total-duration")

const song                  = document.querySelector("#song")
const songTitle             = document.querySelector("#music-playing h1")
const songArtists           = document.querySelector("#music-playing h2")

const prevSongBtn           = document.querySelector("#songs-control a.prev")
const playSongBtn           = document.querySelector("#songs-control a.play")
const nextSongBtn           = document.querySelector("#songs-control a.next")

const playlistControls      = document.querySelector("#playlist-controls")
const showPlaylist          = document.querySelector("#show-playlist")
const showPlaylistIcon      = document.querySelector("#show-playlist i")
const showPlaylistText      = document.querySelector("#show-playlist span")

const playlistContainer     = document.querySelector(".playlist-container")
const songsPlaylis          = document.querySelector(".playlist-container .songs-list")

// Lista de músicas
const songs = [
    {
        file: "hey",
        songName: "Hey [Instumental]",
        artist: "The Beatles",
        cover: "hey.jpg",
    },
    {
        file: "summer",
        songName: "Summer Beats",
        artist: "Summer EletroHits",
        cover: "summer.jpg",
    },
    {
        file: "ukulele",
        songName: "Ukulele Song",
        artist: "Eddie Vader",
        cover: "ukulele.jpg",
    },
]

// Música atual
let songIndex = 2

// Iniciar player
loadSong(songs[songIndex])

// Mostrar informações da música
function loadSong(songObj) {
    songTitle.innerText = songObj.songName
    albumCoverImg.src = `/src/js/media/images/${songObj.cover}`
    songArtists.innerText = songObj.artist
    

    song.src = `/src/js/media/musics/${songObj.file}.mp3`
}

// Tocar Música
function playSong() {
    playSongBtn.classList.add("playing")
    playSongBtn.querySelector('i.fa-solid').classList.remove('fa-play');
    playSongBtn.querySelector('i.fa-solid').classList.add('fa-pause');
  
    song.play();
}

// Parar Música
function pauseSong() {
    playSongBtn.classList.remove("playing")
    playSongBtn.querySelector('i.fa-solid').classList.remove('fa-pause');
    playSongBtn.querySelector('i.fa-solid').classList.add('fa-play');
  
    song.pause();
}

// Voltar Música
function prevSong(e) {
    e.preventDefault()

    songIndex--

    if(songIndex < 0)
        songIndex = songs.length - 1

    loadSong(songs[songIndex])
    playSong()

}

// Avançar Música
function nextSong(e) {
    e.preventDefault()

    songIndex++

    if(songIndex > songs.length - 1)
        songIndex = 0

    loadSong(songs[songIndex])
    playSong()
}

// Eventos
playSongBtn.addEventListener("click", (e) => {
    e.preventDefault()

    const isPlaying = playSongBtn.classList.contains("playing")
    
    if(isPlaying) {
        pauseSong()
        statusSong.innerText = "paused"
    } else {
        playSong()
        statusSong.innerText = "now playing"
    }
})

prevSongBtn.addEventListener("click", prevSong)
nextSongBtn.addEventListener("click", nextSong)
