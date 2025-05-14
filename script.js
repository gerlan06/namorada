// Verificar elementos DOM
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
    const startDate = new Date('2025-02-14T00:00:00');
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

// Elementos do player
const songTitle = document.getElementById('song-title');
const trackList = document.getElementById('track-list');
const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

if (!songTitle) console.error('Elemento "song-title" não encontrado.');
if (!trackList) console.error('Elemento "track-list" não encontrado.');
if (!audioPlayer) console.error('Elemento "audio-player" não encontrado.');
if (!playPauseBtn) console.error('Elemento "play-pause-btn" não encontrado.');
if (!prevBtn) console.error('Elemento "prev-btn" não encontrado.');
if (!nextBtn) console.error('Elemento "next-btn" não encontrado.');

// Lista de músicas com arquivos MP3 locais
const tracks = [
    { name: 'Melhor que Ontem - Djonga', src: 'musica1.mp3' },
    { name: 'Chuva de Arroz - Luan Santana', src: 'musica2.mp3' },
    { name: 'Será que é Amor - Arlindo Cruz', src: 'musica3.mp3' },
    { name: 'Música 4', src: 'musica4.mp3' }, // Substitua pelo nome real
    { name: 'Música 5', src: 'musica5.mp3' }  // Substitua pelo nome real
];

let currentTrackIndex = 0;

function loadTrack(index) {
    audioPlayer.src = tracks[index].src;
    songTitle.textContent = tracks[index].name;
    audioPlayer.load();
    console.log('Carregando música:', tracks[index].name);
}

function playTrack() {
    audioPlayer.play();
    playPauseBtn.textContent = '⏸️';
    console.log('Reproduzindo:', tracks[currentTrackIndex].name);
}

function pauseTrack() {
    audioPlayer.pause();
    playPauseBtn.textContent = '▶️';
    console.log('Pausado:', tracks[currentTrackIndex].name);
}

function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    playTrack();
}

function playPrevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    playTrack();
}

function loadTracks() {
    console.log('Carregando lista de músicas...');
    if (!trackList) return;

    trackList.innerHTML = '';
    tracks.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = track.name;
        li.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
            playTrack();
        });
        trackList.appendChild(li);
    });
    console.log('Lista de músicas carregada com sucesso!');
}

// Eventos do player
playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        playTrack();
    } else {
        pauseTrack();
    }
});

nextBtn.addEventListener('click', playNextTrack);
prevBtn.addEventListener('click', playPrevTrack);

// Tocar próxima música automaticamente ao finalizar
audioPlayer.addEventListener('ended', playNextTrack);

// Carregar a primeira música ao iniciar
loadTrack(currentTrackIndex);

startTimer();
loadTracks();