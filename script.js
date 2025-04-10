document.getElementById('entry-screen').addEventListener('click', function() {
    document.getElementById('entry-screen').classList.add('hidden');
    document.getElementById('main-screen').classList.remove('hidden');
    startBalloons();
    startCarousel();
    startMusic(); // Inicia a música ao entrar
});

function startTimer() {
    const startDate = new Date('2025-02-14T14:40:00');
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

        setTimeout(function() {
            balloon.remove();
        }, 6000);
    }

    setInterval(createBalloon, 500);
}

// Controle da música
const audio = document.getElementById('background-music');
const playPauseBtn = document.getElementById('play-pause-btn');
const seekBar = document.getElementById('seek-bar');
const songTitle = document.getElementById('song-title');

function startMusic() {
    songTitle.textContent = 'Nocaute'; // Substitua pelo nome real da música
    audio.play(); // Toca a música ao entrar
    playPauseBtn.textContent = '⏸️'; // Mostra pausa quando está tocando
}

playPauseBtn.addEventListener('click', function() {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = '⏸️';
    } else {
        audio.pause();
        playPauseBtn.textContent = '▶️';
    }
});

audio.addEventListener('timeupdate', function() {
    const progress = (audio.currentTime / audio.duration) * 100;
    seekBar.value = progress;
});

seekBar.addEventListener('input', function() {
    const seekTime = (seekBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

audio.addEventListener('loadedmetadata', function() {
    seekBar.max = audio.duration; // Define o máximo da barra com a duração da música
});

startTimer();