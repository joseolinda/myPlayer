import apiNapster from "../js/services/apiNapster.js"

// Mapear elementos
const backBtn               = document.querySelector("#back-to-playlist")
const favBtn                = document.querySelector("#fav-song")
const statusSong            = document.querySelector("#status-song")
const albumCoverImg         = document.querySelector("#album-cover")

const currentDuration       = document.querySelector("#current-duration")
const totalDuration         = document.querySelector("#total-duration")
const progressBar           = document.querySelector("#progress-bar")
const progressBarContainer  = document.querySelector(".progress-bar-container")

const song                  = document.querySelector("#song")
const songTitle             = document.querySelector("#music-playing h1")
const songartistNames           = document.querySelector("#music-playing h2")

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
const localSongs = [
    {
        previewURL: "hey",
        name: "Hey [Instumental]",
        artistName: "The Beatles",
        albumId: "hey.jpg",
        type: "local"
    },
    {
        previewURL: "summer",
        name: "Summer Beats",
        artistName: "Summer EletroHits",
        albumId: "summer.jpg",
        type: "local"
    },
    {
        previewURL: "ukulele",
        name: "Ukulele Song",
        artistName: "Eddie Vader",
        albumId: "ukulele.jpg",
        type: "local"
    },
]

let songs = []
songs.push(... localSongs)


// Conectar api
const songsFromNapster = apiNapster()
songsFromNapster.then(tracks => {
    songs.push(...tracks)
    return songs
}).catch(err => console.log("Erro na API Napster", err))

// Música atual
let songIndex = 2

// Iniciar player
loadSong(songs[songIndex])

// Mostrar informações da música
function loadSong(songObj) {
    songTitle.innerText = songObj.name
    albumCoverImg.src = `src/js/media/images/${songObj.cover}`
    songartistNames.innerText = songObj.artistName
    

    song.src = `src/js/media/musics/${songObj.previewURL}.mp3`
}

// Tocar Música
function playSong() {
    playSongBtn.classList.add("playing")
    playSongBtn.querySelector('i.fa-solid').classList.remove('fa-play')
    playSongBtn.querySelector('i.fa-solid').classList.add('fa-pause')
  
    song.play()
}

// Parar Música
function pauseSong() {
    playSongBtn.classList.remove("playing")
    playSongBtn.querySelector('i.fa-solid').classList.remove('fa-pause')
    playSongBtn.querySelector('i.fa-solid').classList.add('fa-play')
  
    song.pause()
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
    if(e) e.preventDefault()

    songIndex++

    if(songIndex > songs.length - 1)
        songIndex = 0

    loadSong(songs[songIndex])
    playSong()
}

// Converter duração em minutos e segundos
function convertDuration(audioCurrentTime) {
    const minutes = String(Math.floor(audioCurrentTime / 60)).padStart(2, '0')
    const seconds = String(Math.floor(audioCurrentTime - minutes * 60)).padStart(2, '0')
    const dur = minutes.substring(-2) + ":" + seconds.substring(-2)

    return dur
}

// Atualizar barra de progresso
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement
    const progressPercent = (currentTime / duration) * 100
    progressBar.style.width = `${progressPercent}%`

    currentDuration.innerText = currentTime ? convertDuration(currentTime) : "--:--"
    totalDuration.innerText = duration ? convertDuration(duration) : "--:--"
}

// Atualizar barra de progresso ao clicar na barra
function updateProgressOnClick(e) {
    const { duration } = song
    const clickedPercent = e.layerX * 100 / e.target.clientWidth

    song.currentTime = 0
    song.currentTime = (duration * clickedPercent.toFixed(0) / 100).toFixed(0)
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

song.addEventListener('timeupdate', updateProgress)
progressBarContainer.addEventListener("click", updateProgressOnClick)

// Tocar próxima música quando a atual acabar
song.addEventListener("ended", () => {
    setTimeout(nextSong, 400)
})