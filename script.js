document.getElementById('entry-screen').addEventListener('click', function() {
    document.getElementById('entry-screen').classList.add('hidden');
    document.getElementById('main-screen').classList.remove('hidden');
    startBalloons();
    startCarousel();
    initializeSpotifyPlayer();
});

function startTimer() {
    const startDate = new Date('2023-01-01T00:00:00');
    const timer = document.getElementById('timer');

    function updateTimer() {
        const now = new Date();
        const diff = now - startDate;
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        timer.textContent = years + ' anos, ' + months + ' meses, ' + days + ' dias, ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
    }

    setInterval(updateTimer, 1000);
    updateTimer();
}

let currentIndex = 0;
const slides = document.getElementsByClassName('carousel-item');
const totalSlides = slides.length;

function startCarousel() {
    setInterval(function() {
        moveSlide(1);
    }, 3000);
}

function moveSlide(direction) {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
    slides[currentIndex].classList.add('active');
}

function startBalloons() {
    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        balloon.textContent = '❤️';
        balloon.style.left = Math.random() * 90 + 'vw';
        document.body.appendChild(balloon);
        setTimeout(function() { balloon.remove(); }, 6000);
    }
    setInterval(createBalloon, 500);
}

// Spotify Integration
const playPauseBtn = document.getElementById('play-pause-btn');
const seekBar = document.getElementById('seek-bar');
const songTitle = document.getElementById('song-title');
const trackList = document.getElementById('track-list');
let player;

function getAccessToken() {
    const refreshToken = 'AQAHK6_k6IlgHKTmDdnh-XWgVWIBpGGA-i4_d2rwumit15Aatuhs6moPaKZ2Vq-ACWijTtQ2khNh2nCD4Q8-8ozupPz-JfkBgs773g5Une1QXOg7msO_4l524-gG3l7kTao'; // Substitua pelo refresh token
    const clientId = '4b44b1869d5d46c18711c31928ff229b'; // Substitua pelo Client ID
    const clientSecret = '922e3bccbd314b258a3fabd3e8fa4ea9'; // Substitua pelo Client Secret

    return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=refresh_token&refresh_token=' + refreshToken
    })
    .then(response => response.json())
    .then(data => {
        console.log('Token obtido:', data.access_token);
        return data.access_token;
    })
    .catch(error => {
        console.error('Erro ao obter token:', error);
        return null;
    });
}

function initializeSpotifyPlayer() {
    console.log('Inicializando Spotify Player...');
    loadTracks(); // Carrega a lista imediatamente como fallback

    window.onSpotifyWebPlaybackSDKReady = () => {
        getAccessToken().then(token => {
            if (!token) {
                console.error('Token não obtido. Verifique refresh_token, client_id e client_secret.');
                return;
            }

            player = new Spotify.Player({
                name: 'App para Minha Namorada',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            player.addListener('ready', ({ device_id }) => {
                console.log('Dispositivo pronto com ID:', device_id);
                // loadTracks(); // Já chamado como fallback
            });

            player.addListener('player_state_changed', state => {
                if (state) {
                    const currentTrack = state.track_window.current_track;
                    songTitle.textContent = currentTrack.name;
                    const progress = (state.position / state.duration) * 100;
                    seekBar.value = progress;
                    seekBar.style.background = `linear-gradient(to right, #1DB954 ${progress}%, #535353 ${progress}%)`;
                    playPauseBtn.textContent = state.paused ? '▶️' : '⏸️';
                }
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Dispositivo offline com ID:', device_id);
            });

            player.connect().then(success => {
                if (success) {
                    console.log('Conectado ao Spotify com sucesso!');
                } else {
                    console.error('Falha ao conectar ao Spotify.');
                }
            });
        });
    };
}

function loadTracks() {
    console.log('Carregando lista de músicas...');
    const tracks = [
        { name: 'Nonstop - Drake', uri: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC' },
        { name: 'Blinding Lights - The Weeknd', uri: 'spotify:track:0VjIjW4M7ezpRtJmf5L3FO' },
        { name: 'Shape of You - Ed Sheeran', uri: 'spotify:track:7GhIk7IlSIunPntWdH8vTI' }
    ];

    trackList.innerHTML = ''; // Limpa a lista antes de preencher
    tracks.forEach(track => {
        const li = document.createElement('li');
        li.textContent = track.name;
        li.addEventListener('click', () => {
            if (player) {
                player.play({ uris: [track.uri] });
                console.log('Tocando:', track.name);
            } else {
                console.error('Player não inicializado ainda.');
            }
        });
        trackList.appendChild(li);
    });
    console.log('Lista de músicas carregada com sucesso!');
}

playPauseBtn.addEventListener('click', function() {
    if (player) {
        player.getCurrentState().then(state => {
            if (state.paused) player.resume();
            else player.pause();
        });
    } else {
        console.error('Player não inicializado para play/pause.');
    }
});

seekBar.addEventListener('input', function() {
    if (player) {
        player.getCurrentState().then(state => {
            const seekTime = (seekBar.value / 100) * state.duration;
            player.seek(seekTime);
        });
    } else {
        console.error('Player não inicializado para seek.');
    }
});

startTimer();