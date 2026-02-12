document.addEventListener('DOMContentLoaded', () => {
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#ffffff" },
            "shape": { "type": "circle" },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#7289da",
                "opacity": 0.2,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": { "enable": true, "mode": "grab" },
                "onclick": { "enable": true, "mode": "push" },
                "resize": true
            },
            "modes": {
                "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
                "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 },
                "repulse": { "distance": 200, "duration": 0.4 },
                "push": { "particles_nb": 4 },
                "remove": { "particles_nb": 2 }
            }
        },
        "retina_detect": true
    });

    // 2. Entrance Animation
    const card = document.querySelector('.profile-card');
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) rotateX(10deg)';

    setTimeout(() => {
        card.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) rotateX(0)';
    }, 100);

    // Initialize Tilt only on Desktop
    if (window.innerWidth > 768) {
        VanillaTilt.init(document.querySelector(".profile-card"), {
            max: 5,
            speed: 400,
            glare: true,
            "max-glare": 0.2
        });
    }

});

// 3. Clipboard Functionality
function copyDiscord(e) {
    e.preventDefault();
    const discordID = "anfdlhh";

    navigator.clipboard.writeText(discordID).then(() => {
        showToast(`Copied: ${discordID}`);
    }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = discordID;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast(`Copied: ${discordID}`);
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-msg');

    msg.textContent = message;
    toast.classList.add('visible');

    setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
}

// 4. Playlist Toggle Function
function togglePlaylist() {
    const playlist = document.getElementById('playlist');
    const btn = document.querySelector('.toggle-btn');

    if (playlist && btn) {
        playlist.classList.toggle('open');
        btn.classList.toggle('active');
    }
}

// 5. Load Songs from JS Data
const songs = [
    {
        "title": "Stitches",
        "artist": "Shawn Mendes",
        "image": "https://i.scdn.co/image/ab67616d0000485175bd5306fb4669a15ee74eff",
        "audioFile": "music/stitches.mp3"
    },
    {
        "title": "Show Me Love",
        "artist": "WizTheMc, bees & honey",
        "image": "https://i.scdn.co/image/ab67616d00004851f67307349b14986af73d4fa0",
        "audioFile": "music/show-me-love.mp3"
    },
    {
        "title": "Heat Waves",
        "artist": "Glass Animals",
        "image": "https://i.scdn.co/image/ab67616d0000b2739e495fb707973f3390850eea",
        "audioFile": "music/That s So True.mp3"
    },
    {
        "title": "Blinding Lights",
        "artist": "The Weeknd",
        "image": "https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699",
        "audioFile": "music/blinding-lights.mp3"
    },
    {
        "title": "cardigan",
        "artist": "Taylor Swift",
        "image": "https://i.scdn.co/image/ab67616d0000485195f754318336a07e85ec59bc",
        "audioFile": "music/cardigan.mp3"
    },
    {
        "title": "Just For A Moment",
        "artist": "Gryffin, Iselin",
        "image": "https://i.scdn.co/image/ab67616d000048510e5311993a01fb2e7169f6a7",
        "audioFile": "music/just-for-a-moment.mp3"
    },
    {
        "title": "Team",
        "artist": "Lorde",
        "image": "https://i.scdn.co/image/ab67616d00004851187331e276c898d39764cc98",
        "audioFile": "music/team.mp3"
    },
    {
        "title": "No Lie",
        "artist": "Sean Paul, Dua Lipa",
        "image": "https://i.scdn.co/image/ab67616d000048512d564195ed3dd7b70d64862c",
        "audioFile": "music/no-lie.mp3"
    },
    {
        "title": "Two Birds",
        "artist": "Regina Spektor",
        "image": "https://i.scdn.co/image/ab67616d00004851c06f8d26d1620c4689f8d46a",
        "audioFile": "music/two-birds.mp3"
    },
    {
        "title": "Car's Outside",
        "artist": "James Arthur",
        "image": "https://i.scdn.co/image/ab67616d00004851f740f5f279648d0a1147e6a6",
        "audioFile": "music/cars-outside.mp3"
    }
];

// 6. Custom Audio Player Logic (HTML5 Audio)
var audioPlayer = null;
var isPlaying = false;
var currentSongIndex = 0;
var isShuffle = false;
var updateInterval;

// Initialize audio player when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    audioPlayer = document.getElementById('audio-player');

    if (audioPlayer) {
        audioPlayer.addEventListener('play', () => {
            isPlaying = true;
            updatePlayPauseIcon();
            startProgressLoop();
        });

        audioPlayer.addEventListener('pause', () => {
            isPlaying = false;
            updatePlayPauseIcon();
            stopProgressLoop();
        });

        audioPlayer.addEventListener('ended', () => {
            playNext();
        });

        audioPlayer.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            alert('Error playing audio. Try another song.');
        });
    }
});

function loadSongs() {
    const playlistContainer = document.getElementById('playlist');
    if (!playlistContainer) return;
    playlistContainer.innerHTML = '';

    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.onclick = () => playSongAtIndex(index);

        songItem.innerHTML = `
            <img src="${song.image}" alt="Art" class="song-img">
            <div class="song-details">
                <span class="song-title">${song.title}</span>
                <span class="song-artist">${song.artist}</span>
            </div>
            <i class="fas fa-play" style="margin-left:auto; font-size: 0.8rem; opacity: 0.7;"></i>
        `;
        playlistContainer.appendChild(songItem);
    });

    // Add View All Button
    const viewAll = document.createElement('a');
    viewAll.href = 'https://open.spotify.com/playlist/5bfMG67zHHB52NyxcbTBxQ';
    viewAll.target = "_blank";
    viewAll.className = 'view-all-btn';
    viewAll.innerHTML = 'View Full Playlist <i class="fas fa-external-link-alt"></i>';
    playlistContainer.appendChild(viewAll);
}

function playSongAtIndex(index) {
    currentSongIndex = index;
    const song = songs[currentSongIndex];

    // UI Update
    document.getElementById('default-music-view').style.display = 'none';
    document.getElementById('player-view').style.display = 'block';

    document.getElementById('np-title').innerText = song.title;
    document.getElementById('np-artist').innerText = song.artist;

    if (audioPlayer) {
        // Load local MP3 file
        audioPlayer.src = song.audioFile;
        audioPlayer.load();
        audioPlayer.play().catch(e => {
            console.error('Play error:', e);
            // Fallback: show message to user
            alert('Click the Play button to start the music');
        });
    }
}

function togglePlayPause() {
    if (!audioPlayer) return;
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.play().catch(e => console.error('Play error:', e));
    }
}

function updatePlayPauseIcon() {
    const btn = document.getElementById('play-pause-btn');
    if (isPlaying) {
        btn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        btn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function playNext() {
    let nextIndex;
    if (isShuffle) {
        nextIndex = Math.floor(Math.random() * songs.length);
    } else {
        nextIndex = (currentSongIndex + 1) % songs.length;
    }
    playSongAtIndex(nextIndex);
}

function playPrev() {
    let prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSongAtIndex(prevIndex);
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    const btn = document.getElementById('shuffle-btn');
    if (isShuffle) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
}

function closePlayer() {
    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }
    document.getElementById('player-view').style.display = 'none';
    document.getElementById('default-music-view').style.display = 'flex';
}

// Progress Bar
function startProgressLoop() {
    stopProgressLoop();
    updateInterval = setInterval(() => {
        if (!audioPlayer) return;
        const duration = audioPlayer.duration;
        const currentTime = audioPlayer.currentTime;
        if (duration > 0) {
            const percent = (currentTime / duration) * 100;
            document.getElementById('progress-bar').style.width = percent + '%';
        }
    }, 1000);
}

function stopProgressLoop() {
    if (updateInterval) clearInterval(updateInterval);
}

// 6. Dynamic Features (Greeting & Typing)
function updateGreeting() {
    const hour = new Date().getHours();
    const greetingElement = document.getElementById('greeting');
    let greeting = 'Welcome';

    if (hour >= 5 && hour < 12) greeting = 'Good Morning';
    else if (hour >= 12 && hour < 18) greeting = 'Good Afternoon';
    else if (hour >= 18 && hour < 22) greeting = 'Good Evening';
    else greeting = 'Good Night';

    if (greetingElement) greetingElement.innerText = greeting;
}

const typingText = document.querySelector('.typing-text');
const words = ["MANGAN", "TURU", "NGEGAME", "DOLAN"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    if (!typingText) return;

    const currentWord = words[wordIndex];
    if (isDeleting) {
        typingText.innerText = currentWord.substring(0, charIndex--);
    } else {
        typingText.innerText = currentWord.substring(0, charIndex++);
    }

    let typeSpeed = isDeleting ? 100 : 200;

    if (!isDeleting && charIndex === currentWord.length + 1) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

// Initialize Dynamic Features
loadSongs();
updateGreeting();
typeEffect();
