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

// Elementos do player
const songTitle = document.getElementById('song-title');
const trackList = document.getElementById('track-list');

if (!songTitle) console.error('Elemento "song-title" não encontrado.');
if (!trackList) console.error('Elemento "track-list" não encontrado.');

// Lista de músicas com URLs do YouTube
const tracks = [
    { name: 'Melhor que Ontem - Djonga', url: 'https://www.youtube.com/watch?v=uS8eTYD2vMg' },
    { name: 'Chuva de Arroz - Luan Santana', url: 'https://www.youtube.com/watch?v=rTsbSY04s1Y' },
    { name: 'Será que é Amor - Arlindo Cruz', url: 'https://www.youtube.com/watch?v=X9zG4lEfDrc' }
];

function playTrack(url, trackName) {
    window.open(url, '_blank'); // Abre o vídeo no YouTube em uma nova aba
    console.log('Abrindo vídeo no YouTube:', url);
    if (songTitle) songTitle.textContent = trackName;
}

function loadTracks() {
    console.log('Carregando lista de músicas...');
    if (!trackList) {
        console.error('Elemento "track-list" não encontrado.');
        return;
    }

    trackList.innerHTML = '';
    tracks.forEach(track => {
        const li = document.createElement('li');
        li.textContent = track.name;
        li.addEventListener('click', () => {
            playTrack(track.url, track.name);
        });
        trackList.appendChild(li);
    });
    console.log('Lista de músicas carregada com sucesso!');
}

startTimer();
loadTracks();