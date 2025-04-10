// Definir a função globalmente antes de tudo
window.onSpotifyWebPlaybackSDKReady = function() {
    console.log('Spotify Web Playback SDK carregado!');
    initializeSpotifyPlayer();
};

// Verificar elementos DOM antes de adicionar eventos
const entryScreen = document.getElementById('entry-screen');
if (entryScreen) {
    entryScreen.addEventListener('click', function() {
        entryScreen.classList.add('hidden');
        const mainScreen = document.getElementById('main-screen');
        if (mainScreen) mainScreen.classList.remove('hidden');
        startBalloons();
        startCarousel();
    });
} else {
    console.error('Elemento "entry-screen" não encontrado no HTML.');
}

function startTimer() {
    const startDate = new Date('2023-01-01T00:00:00');
    const timer = document.getElementById('timer');
    if (!timer) {
        console.error('Elemento "timer" não encontrado no HTML.');
    } else {
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
}

let currentIndex = 0;
const slides = document.getElementsByClassName('carousel-item');
const totalSlides = slides.length;

function startCarousel() {
    if (totalSlides === 0) {
        console.error('Nenhum item de carrossel encontrado no HTML.');
    } else {
        setInterval(function() {
            moveSlide(1);
        }, 3000);
    }
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

if (!playPauseBtn) console.error('Elemento "play-pause-btn" não encontrado no HTML.');
if (!seekBar) console.error('Elemento "seek-bar" não encontrado no HTML.');
if (!songTitle) console.error('Elemento "song-title" não encontrado no HTML.');
if (!trackList) console.error('Elemento "track-list" não encontrado no HTML.');

let player;
let accessToken;
let deviceId;

function getAccessToken() {
    const refreshToken = 'AQCnVFGexUmoO7E3M7P7hm1uxY3T650KeINI4g-NGwjRRoo5To6dRd3My6P-9GNUChHfbuOr1QqX4VFyLQGF24WAKmXezAYtkt4b2-XGcK7An7oDkmCZQgNcR5-kF9WQzyI'; // Substitua pelo refresh token
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
        accessToken = data.access_token;
        return data.access_token;
    })
    .catch(error => {
        console.error('Erro ao obter token:', error);
        return null;
    });
}

function initializeSpotifyPlayer() {
    console.log('Inicializando Spotify Player...');
    loadTracks();

    getAccessToken().then(token => {
        if (!token) {
            console.error('Token não obtido. Verifique refresh_token, client_id e client_secret.');
        } else {
            player = new Spotify.Player({
                name: 'App para Minha Namorada',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            player.addListener('ready', ({ device_id }) => {
                console.log('Dispositivo pronto com ID:', device_id);
                deviceId = device_id;
                setTimeout(() => {
                    setActiveDevice(device_id);
                    console.log('Aguardando ativação do dispositivo...');
                }, 3000);
            });

            player.addListener('player_state_changed', state => {
                if (state && state.track_window && state.track_window.current_track && songTitle) {
                    const currentTrack = state.track_window.current_track;
                    songTitle.textContent = currentTrack.name;
                    const progress = (state.position / state.duration) * 100;
                    if (seekBar) {
                        seekBar.value = progress;
                        seekBar.style.background = `linear-gradient(to right, #1DB954 ${progress}%, #535353 ${progress}%)`;
                    }
                    if (playPauseBtn) playPauseBtn.textContent = state.paused ? '▶️' : '⏸️';
                } else {
                    console.log('Estado do player inválido ou sem faixa ativa:', state);
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
        }
    });
}

function setActiveDevice(deviceId) {
    fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            device_ids: [deviceId],
            play: false
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('Dispositivo ativado com sucesso!');
            checkActiveDevice();
        } else {
            console.error('Erro ao ativar dispositivo:', response.status, response.statusText);
        }
    })
    .catch(error => console.error('Erro ao ativar dispositivo:', error));
}

function checkActiveDevice() {
    fetch('https://api.spotify.com/v1/me/player', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.device && data.device.id === deviceId) {
            console.log('Dispositivo confirmado como ativo no Spotify Connect:', data.device.name);
        } else {
            console.warn('Dispositivo não está ativo no Spotify Connect. Selecione "App para Minha Namorada" manualmente.');
        }
    })
    .catch(error => console.error('Erro ao verificar dispositivo ativo:', error));
}

function playSpotifyTrack(uri) {
    if (!accessToken || !deviceId) {
        console.error('Token ou Device ID não disponível ainda. Aguarde a conexão.');
    } else {
        player.getCurrentState().then(state => {
            if (!state) {
                console.log('Player não está pronto. Tentando novamente em 3 segundos...');
                setTimeout(() => playSpotifyTrack(uri), 3000);
            } else {
                console.log('Tentando reproduzir URI:', uri);
                fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        uris: [uri]
                    })
                })
                .then(response => {
                    if (response.ok) {
                        console.log('Música iniciada com sucesso!');
                    } else {
                        return response.json().then(errorData => {
                            console.error('Erro ao iniciar música:', response.status, errorData);
                            if (response.status === 403) {
                                if (errorData.error.reason === 'PREMIUM_REQUIRED') {
                                    console.error('Erro: Conta Spotify Premium é necessária para usar o Web Playback SDK.');
                                } else {
                                    console.error('Erro 403: Restriction violated. Verifique se o token tem os escopos "user-modify-playback-state" e "streaming".');
                                }
                            }
                            throw new Error(`Erro ${response.status}: ${errorData.error.message}`);
                        });
                    }
                })
                .catch(error => console.error('Erro na API:', error));
            }
        });
    }
}

function loadTracks() {
    console.log('Carregando lista de músicas...');
    const tracks = [
        { name: 'Nocaute - Henrique e Juliano', uri: 'spotify:track:7gKIfGuf9f0pT7Td1GhaMr' },
        { name: 'Chuva de Arroz - Luan Santana', uri: 'spotify:track:5rNwhZzL9PryvOIkNTKN2P' },
        { name: 'Perfect - Ed Sheeran', uri: 'spotify:track:0TGDIypz2P8G7rh6H5CNU6' }
    ];

    if (!trackList) {
        console.error('Elemento "track-list" não encontrado. Não é possível carregar as músicas.');
    } else {
        trackList.innerHTML = '';
        tracks.forEach(track => {
            const li = document.createElement('li');
            li.textContent = track.name;
            li.addEventListener('click', () => {
                if (player && deviceId) {
                    setTimeout(() => playSpotifyTrack(track.uri), 3000);
                    console.log('Tentando tocar:', track.name);
                } else {
                    console.error('Player ou Device ID não inicializado ainda. Aguarde a conexão.');
                }
            });
            trackList.appendChild(li);
        });
        console.log('Lista de músicas carregada com sucesso!');
    }
}

if (playPauseBtn) {
    playPauseBtn.addEventListener('click', function() {
        if (player) {
            player.getCurrentState().then(state => {
                if (!state) {
                    console.log('Nenhum estado disponível para play/pause.');
                } else {
                    if (state.paused) player.resume();
                    else player.pause();
                }
            });
        } else {
            console.error('Player não inicializado para play/pause.');
        }
    });
}

if (seekBar) {
    seekBar.addEventListener('input', function() {
        if (player) {
            player.getCurrentState().then(state => {
                if (!state) {
                    console.log('Nenhum estado disponível para seek.');
                } else {
                    const seekTime = (seekBar.value / 100) * state.duration;
                    player.seek(seekTime);
                }
            });
        } else {
            console.error('Player não inicializado para seek.');
        }
    });
}

startTimer();