import apiNapster from "../js/services/apiNapster.js"
import swipeleft from "./utils/swipe.js"

// Mapear elementos
const backBtn = document.querySelector("#back-to-playlist")
const favBtn = document.querySelector("#fav-song")
const statusSong = document.querySelector("#status-song")
const albumCoverImg = document.querySelector("#album-cover")

const currentDuration = document.querySelector("#current-duration")
const totalDuration = document.querySelector("#total-duration")
const progressBar = document.querySelector("#progress-bar")
const progressBarContainer = document.querySelector(".progress-bar-container")

const song = document.querySelector("#song")
const songTitle = document.querySelector("#music-playing h1")
const songartistNames = document.querySelector("#music-playing h2")

const prevSongBtn = document.querySelector("#songs-control a.prev")
const playSongBtn = document.querySelector("#songs-control a.play")
const nextSongBtn = document.querySelector("#songs-control a.next")

const footer = document.querySelector("footer")
const playlistControls = document.querySelector("#playlist-controls")
const showPlaylist = document.querySelector("#show-playlist")
const showPlaylistIcon = document.querySelector("#show-playlist i")
const showPlaylistText = document.querySelector("#show-playlist span")

const playlistContainer = document.querySelector(".playlist-container")
const songsPlaylist = document.querySelector(".playlist-container .songs-list")

// Lista de músicas
const localSongs = [
    {
        id: "hey",
        previewURL: "hey",
        name: "Hey [Instumental]",
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
]

let songs = []

// Montar playlist quando array sons[] mudar
const proxySongs = new Proxy(songs, {
    deleteProperty: function (target, property) {
        if(target[property].id) removeSongToPlaylist(target[property])
        delete target[property]
        return true
    },
    set: function (target, property, value, receiver) {
        if(value.id) {
            value._id = value.id.split(".").join("_")
            addSongToPlaylist(value)
        }        
        target[property] = value
        return true
    }
})

proxySongs.push(...localSongs)


// Conectar api
const songsFromNapster = apiNapster()
songsFromNapster.then(tracks => {
    proxySongs.push(...tracks)
}).catch(err => console.log("Erro na API Napster", err))

// Música atual
let songIndex = 0

// Iniciar player
loadSong(songs[songIndex])

// Mostrar informações da música
function loadSong(songObj) {
    songTitle.innerText = songObj.name
    albumCoverImg.src = songObj.type === "local" ? `src/js/media/images/${songObj.albumId}` : `http://direct.rhapsody.com/imageserver/v2/albums/${songObj.albumId}/images/400x400.jpg`
    songartistNames.innerText = songObj.artistName

    song.src = songObj.type === "local" ? `src/js/media/musics/${songObj.previewURL}.mp3` : songObj.previewURL
}

// Tocar Música
function playSong() {
    playSongBtn.classList.add("playing")
    playSongBtn.querySelector('i.fa-solid').classList.remove('fa-play')
    playSongBtn.querySelector('i.fa-solid').classList.add('fa-pause')

    document.querySelector(`#playlist-container .active-song`)?.classList.remove("active-song")
    document.querySelector(`#playlist-container #track-${songs[songIndex]._id}`)?.classList.add("active-song")

    song.play()
}

// Parar Música
function pauseSong() {
    playSongBtn.classList.remove("playing")
    playSongBtn.querySelector('i.fa-solid').classList.remove('fa-pause')
    playSongBtn.querySelector('i.fa-solid').classList.add('fa-play')

    document.querySelector(`#playlist-container .active-song`)?.classList.remove("active-song")

    song.pause()
}

// Voltar Música
function prevSong(e) {
    e.preventDefault()

    songIndex--

    if (songIndex < 0)
        songIndex = songs.length - 1

    loadSong(songs[songIndex])
    playSong()

}

// Avançar Música
function nextSong(e) {
    if (e) e.preventDefault()

    songIndex++

    if (songIndex > songs.length - 1)
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

    if (isPlaying) {
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


// Playlist
function handelShowPlaylist() {
    footer.classList.toggle("view-playlist")
}

function handelClickSongInPlaylist(e) {
    const item = e.closest("li")

    if(item) {
        let findById = item.id.replace("track-", "").replace("_", ".")
        const foundedSongIndex = songs.findIndex(s => s.id === findById)
        songIndex = foundedSongIndex ?? 0
        loadSong(songs[songIndex])
        playSong()
    }
}

function removeSongToPlaylist(s) {
    
    if (songs.length === 1) pauseSong()

    const toRemove = songsPlaylist.querySelector(`#track-${s._id}`)
    songsPlaylist.removeChild(toRemove)
}

function addSongToPlaylist(s) {
    const newSong = `<li id="track-${s._id}" class="song-details">
                        <span class="song-item-play"><i class="fa-solid fa-play"></i></span>
                        <span class="song-item-text">
                            <strong class="song-name">${s.name}</strong><em class="song-artist">${s.artistName}</em>
                        </span>
                        <span class="song-item-duration">${s.duration ?? "00:30"}</span>
                    </li>`
    songsPlaylist.innerHTML += newSong

    document.querySelectorAll("#playlist-container .song-details").forEach(listItem => {
        swipeleft(listItem, () => {
            let findById = listItem.id.replace("track-", "").replace("_", ".")
            const foundedSongIndex = songs.findIndex(ns => ns._id === findById)

            songs.splice(foundedSongIndex, 1)

            if(listItem.classList.contains("active-song")) {
                songIndex++
                prevSongBtn.click()
            }
            listItem.parentElement.removeChild(listItem)
        })
    })
}

// Eventos Playlist
showPlaylist.addEventListener("click", handelShowPlaylist)
songsPlaylist.addEventListener("click", e => {
    handelClickSongInPlaylist(e.target)
})
songsPlaylist.addEventListener("touchend", () => songsPlaylist.click())