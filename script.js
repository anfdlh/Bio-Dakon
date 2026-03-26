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
        VanillaTilt.init(document.querySelectorAll(".bento-glass"), {
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

    if (hour >= 5 && hour < 11) greeting = 'Sugeng Enjing';
    else if (hour >= 11 && hour < 15) greeting = 'Sugeng Siang';
    else if (hour >= 15 && hour < 19) greeting = 'Sugeng Sonten';
    else greeting = 'Sugeng Dalu';

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

// 7. Lanyard Live Discord Presence Integration
const LANYARD_USER_ID = "758184274330648597"; // IMPORTANT: Replace this with your 18-digit Discord ID
const lanyardEndpoint = `https://api.lanyard.rest/v1/users/${LANYARD_USER_ID}`;
let spotifyInterval = null;
let activityInterval = null;

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = Math.floor(totalSeconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function setupSpotifyProgress(start, end) {
    if (spotifyInterval) clearInterval(spotifyInterval);

    spotifyInterval = setInterval(() => {
        const now = new Date().getTime();
        const total = end - start;
        const current = now - start;

        let percent = (current / total) * 100;
        if (percent > 100) percent = 100;

        const bar = document.getElementById('spotify-bar');
        const currentText = document.getElementById('spotify-current');
        const totalText = document.getElementById('spotify-total');

        if (bar) bar.style.width = `${percent}%`;
        if (currentText) currentText.innerText = formatTime(current);
        if (totalText) totalText.innerText = formatTime(total);

        if (percent >= 100) clearInterval(spotifyInterval);
    }, 1000);
}

function updateLanyardUI(d) {
    try {

        const statusDot = document.getElementById('lanyard-status-dot');
        const statusText = document.getElementById('lanyard-status-text');
        const container = document.getElementById('lanyard-activities-container');

        if (!statusDot || !d || !container) return;

        // 1. Update Online Status Dot & Text
        statusDot.className = `status-indicator ${d.discord_status}`;
        statusText.innerText = d.discord_status.toUpperCase();

        // 2. Fetch Multi-Activity
        if (d.activities && d.activities.length > 0) {
            let htmlStr = `<div style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1.5px; display: flex; align-items: center; gap: 8px;"><i class="fas fa-bolt" style="color: var(--color-discord);"></i> AKTIVITASE DAKON SAK IKI</div>`;
            let spotifyData = null;
            let activeTimers = [];

            d.activities.forEach(activity => {
                let iconHtml = '';
                let smallIconHtml = '';
                let progressHtml = '';
                let timeHtml = '';
                let title = activity.name;
                let desc1 = activity.state ? `<p class="social-desc">${activity.state}</p>` : '';
                let desc2 = activity.details ? `<p class="social-desc" style="font-size: 0.8rem; opacity: 0.8;">${activity.details}</p>` : '';

                // Elapsed Time Logic
                if (activity.id !== "spotify:1" && activity.timestamps && activity.timestamps.start) {
                    const timerId = `timer-${activity.id}`;
                    activeTimers.push({ id: timerId, start: activity.timestamps.start });
                    timeHtml = `<p class="social-desc" style="font-size: 0.75rem; margin-top:4px; font-variant-numeric: tabular-nums; opacity: 0.9; color: var(--color-discord); font-weight: 600;"><i class="far fa-clock"></i> <span id="${timerId}">00:00</span> elapsed</p>`;
                }

                // Icon Handling for Spotify or Discord App Games
                if (activity.id === "spotify:1" && d.spotify) {
                    iconHtml = `<img src="${d.spotify.album_art_url}" class="lanyard-main-icon" alt="Spotify">`;
                    spotifyData = d.spotify;
                    title = d.spotify.song;
                    desc1 = `<p class="social-desc">by ${d.spotify.artist}</p>`;
                    desc2 = `<p class="social-desc" style="font-size: 0.8rem; opacity: 0.8;">on ${d.spotify.album}</p>`;

                    progressHtml = `
                        <div class="spotify-progress-wrapper">
                            <div class="spotify-progress-container">
                                <div class="spotify-progress-bar" id="spotify-bar"></div>
                            </div>
                            <div class="spotify-time">
                                <span id="spotify-current">0:00</span>
                                <span id="spotify-total">0:00</span>
                            </div>
                        </div>
                    `;
                } else if (activity.assets && activity.assets.large_image) {
                    const imgId = activity.assets.large_image.replace('mp:', 'https://media.discordapp.net/');
                    const imgUrl = imgId.startsWith('https') ? imgId : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${imgId}.png`;
                    iconHtml = `<img src="${imgUrl}" class="lanyard-main-icon" alt="${activity.name}">`;

                    if (activity.assets.small_image) {
                        const sImgId = activity.assets.small_image.replace('mp:', 'https://media.discordapp.net/');
                        const sImgUrl = sImgId.startsWith('https') ? sImgId : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${sImgId}.png`;
                        smallIconHtml = `<img src="${sImgUrl}" class="lanyard-small-icon" alt="Badge" title="${activity.assets.small_text || ''}">`;
                    }
                } else if (activity.application_id) {
                    // Fallback to fetch native Discord game icon using Lanyard proxy
                    const imgUrl = `https://dcdn.dstn.to/app-icons/${activity.application_id}`;
                    iconHtml = `<img src="${imgUrl}" class="lanyard-main-icon" alt="${activity.name}">`;
                } else {
                    iconHtml = `<i class="fas fa-gamepad lanyard-main-icon" style="font-size: 1.8rem; color: #fff; background: rgba(0,0,0,0.5); display: flex; align-items:center; justify-content:center;"></i>`;
                }

                htmlStr += `
                    <div class="lanyard-content">
                        <div class="lanyard-icon-wrapper">
                            ${iconHtml}
                            ${smallIconHtml}
                        </div>
                        <div class="lanyard-info" style="width: 100%;">
                            <h4 class="social-title" style="font-size: 1.25rem; font-weight: 800; color: #fff; margin-bottom: 2px;">${title}</h4>
                            ${desc2}
                            ${desc1}
                            ${timeHtml}
                            ${progressHtml}
                        </div>
                    </div>
                `;
            });

            container.innerHTML = htmlStr;

            // Initialize progress if Spotify is in activity
            if (spotifyData) {
                setupSpotifyProgress(spotifyData.timestamps.start, spotifyData.timestamps.end);
            } else {
                if (spotifyInterval) clearInterval(spotifyInterval);
            }

            // Initialize elapsed time loop
            if (activityInterval) clearInterval(activityInterval);
            if (activeTimers.length > 0) {
                activityInterval = setInterval(() => {
                    const now = new Date().getTime();
                    activeTimers.forEach(t => {
                        const el = document.getElementById(t.id);
                        if (el && document.body.contains(el)) {
                            const diff = now - t.start;
                            const totalSeconds = Math.floor(diff / 1000);
                            const hours = Math.floor(totalSeconds / 3600);
                            const minutes = Math.floor((totalSeconds % 3600) / 60);
                            const seconds = Math.floor(totalSeconds % 60);

                            const sStr = seconds < 10 ? '0' + seconds : seconds;
                            const mStr = minutes < 10 ? '0' + minutes : minutes;

                            if (hours > 0) {
                                const hStr = hours < 10 ? '0' + hours : hours;
                                el.innerText = `${hStr}:${mStr}:${sStr}`;
                            } else {
                                el.innerText = `${mStr}:${sStr}`;
                            }
                        }
                    });
                }, 1000);
            }

        } else {
            // No activity active
            container.innerHTML = `
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1.5px; display: flex; align-items: center; gap: 8px;"><i class="fas fa-bolt" style="color: var(--color-discord);"></i> AKTIVITASE DAKON SAK IKI</div>
                <div class="lanyard-content">
                    <div class="lanyard-icon-wrapper">
                        <i class="fab fa-discord lanyard-main-icon" style="font-size: 2.2rem; color: var(--color-discord); display: flex; align-items:center; justify-content:center;"></i>
                    </div>
                    <div class="lanyard-info" style="width: 100%;">
                        <h4 class="social-title" style="font-size: 1.4rem; font-weight: 800; color: #fff; margin-bottom: 4px;">Ga Ono Aktivitas</h4>
                        <p class="social-desc">Seng tenang...</p>
                    </div>
                </div>
            `;
            if (spotifyInterval) clearInterval(spotifyInterval);
            if (activityInterval) clearInterval(activityInterval);
        }
    } catch (error) {
        console.error("Aktivitas error:", error);
    }
}

// Check if Placeholder and setup
if (LANYARD_USER_ID === "YOUR_DISCORD_ID_HERE") {
    const container = document.getElementById('lanyard-activities-container');
    if (container) {
        container.innerHTML = `
            <div class="lanyard-content">
                <div class="lanyard-info" style="width: 100%;">
                    <h4 class="social-title">...</h4>
                    <p class="social-desc">...</p>
                </div>
            </div>
        `;
    }
} else {
    function connectLanyard() {
        const ws = new WebSocket('wss://api.lanyard.rest/socket');
        let heartbeatInterval = null;

        ws.onopen = () => {
            ws.send(JSON.stringify({
                op: 2,
                d: { subscribe_to_id: LANYARD_USER_ID }
            }));
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            if (msg.op === 1) { // Hello event, start heartbeat
                heartbeatInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ op: 3 }));
                    }
                }, msg.d.heartbeat_interval);
            }

            if (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE') {
                updateLanyardUI(msg.d);
            }
        };

        ws.onclose = () => {
            if (heartbeatInterval) clearInterval(heartbeatInterval);
            setTimeout(connectLanyard, 5000); // Auto reconnect
        };
    }

    connectLanyard();
}

// 8. Anonymous Guestbook Webhook
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1454442109414146202/WjaEtveHw5wgHN3e6oo6Ex2K_tSP7lzpaPmSTWiijyA6y2O6Dspq1HoEWDTr6IHe6LmG";

async function sendGuestbookMessage() {
    const input = document.getElementById('guestbook-input');
    const sendBtn = document.getElementById('guestbook-send-btn');
    const statusMsg = document.getElementById('guestbook-status');
    const message = input.value.trim();

    const showStatus = (text, color) => {
        statusMsg.style.display = 'block';
        statusMsg.style.color = color;
        statusMsg.innerText = text;
        setTimeout(() => { statusMsg.style.display = 'none'; }, 4000);
    };

    if (!message) {
        showStatus('Pesan ga boleh kosong!', '#ff4757');
        return;
    }

    if (DISCORD_WEBHOOK_URL === "YOUR_DISCORD_WEBHOOK_URL_HERE") {
        showStatus('Webhook URL belum diisi di script.js! Beritahu Admin.', '#ffa502');
        return;
    }

    sendBtn.disabled = true;
    sendBtn.style.opacity = '0.5';
    sendBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Mengirim...';

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: "<@758184274330648597> You got a new secret message!",
                username: "Anonymous Dakon",
                avatar_url: "https://cdn-icons-png.flaticon.com/512/3011/3011270.png",
                embeds: [{
                    title: "💌 New Secret Message!",
                    description: "```\n" + message + "\n```",
                    color: 16729344,
                    timestamp: new Date().toISOString()
                }]
            })
        });

        if (response.ok) {
            input.value = '';
            showStatus('Pesan rahasia berhasil terkirim!', '#2ed573');
        } else {
            throw new Error('Failed to send');
        }
    } catch (error) {
        console.error("Webhook error:", error);
        showStatus('Gagal ngirim pesan, coba lagi ya.', '#ff4757');
    } finally {
        sendBtn.disabled = false;
        sendBtn.style.opacity = '1';
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Pesan';
    }
}
