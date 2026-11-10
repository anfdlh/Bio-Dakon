/**
 * DAKON PERSONAL SPACE — SKIN GALLERY & COMMAND GENERATOR
 * Bento Glassmorphism Architecture matching index.html
 */

// ==========================================
// CONFIGURATION & DEFAULTS
// ==========================================
const GITHUB_REPO = "anfdlh/Bio-Dakon";
const GITHUB_BRANCH = "main";

// Baseline skin list (Guarantees all 8 skins work offline / file:/// protocol)
const DEFAULT_SKIN_LIST = [
    { file: "Dakon Ireng.png", name: "Dakon Ireng", category: "Custom Skin" },
    { file: "Dakon biru.png", name: "Dakon biru", category: "Custom Skin" },
    { file: "skin.png", name: "skin", category: "Custom Skin" },
    { file: "xpaann Merah.png", name: "xpaann Merah", category: "Custom Skin" },
    { file: "xpaann blue.png", name: "xpaann blue", category: "Custom Skin" },
    { file: "xpaann ireng sma.png", name: "xpaann ireng sma", category: "Custom Skin" },
    { file: "xpaann sma.png", name: "xpaann sma", category: "Custom Skin" },
    { file: "xpaann.png", name: "xpaann", category: "Custom Skin" }
];

// State
let loadedSkins = [];
let activeUrlMode = "github_raw"; // 'github_raw' | 'hosted'
let selectedSkin = null;

// ==========================================
// TOAST NOTIFICATION (Identical to index.html)
// ==========================================
let toastTimer = null;
function showToast(message, iconClass = 'fa-check-circle') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg') || document.getElementById('toast-text');
    if (!toast || !toastMsg) return;

    const icon = toast.querySelector('i');
    if (icon) {
        icon.className = `fas ${iconClass}`;
    }

    toastMsg.textContent = message;
    toast.classList.add('visible');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
}

// ==========================================
// CLIPBOARD COPY HELPER
// ==========================================
function copyToClipboard(text, successMsg = 'Tersalin!') {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => showToast(successMsg, 'fa-copy'))
            .catch(() => fallbackCopy(text, successMsg));
    } else {
        fallbackCopy(text, successMsg);
    }
}

function fallbackCopy(text, successMsg) {
    try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (ok) {
            showToast(successMsg, 'fa-copy');
        } else {
            prompt('Salin command berikut:', text);
        }
    } catch (_) {
        prompt('Salin command berikut:', text);
    }
}

// ==========================================
// URL & COMMAND GENERATOR
// ==========================================
function getSkinImageUrl(skinItem) {
    if (skinItem.customUrl) {
        return skinItem.customUrl;
    }

    const filename = skinItem.file;
    const encodedFile = encodeURIComponent(filename);

    if (activeUrlMode === 'hosted') {
        if (window.location.protocol.startsWith('http')) {
            const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
            return `${baseUrl}upload/${encodedFile}`;
        }
    }

    // Default to GitHub Raw URL (globally reachable by Minecraft servers)
    return `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/upload/${encodedFile}`;
}

function generateSkinCommand(skinItem) {
    const imageUrl = getSkinImageUrl(skinItem);
    return `/skin url "${imageUrl}"`;
}

// ==========================================
// 2D MINECRAFT SKIN COMPOSITE RENDERER
// Assembles 64x64 or 64x32 skin PNG into a 2D model
// ==========================================
function renderMinecraftSkin(imageElement, canvas) {
    if (!canvas || !imageElement) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 16;
    canvas.height = 32;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 16, 32);

    const isSkin = (imageElement.naturalWidth === 64 && (imageElement.naturalHeight === 64 || imageElement.naturalHeight === 32));

    if (!isSkin) {
        ctx.drawImage(imageElement, 0, 0, 16, 32);
        return;
    }

    const hasOuterLayers = imageElement.naturalHeight === 64;

    function drawPart(sx, sy, sw, sh, dx, dy, dw, dh) {
        ctx.drawImage(imageElement, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    // 1. HEAD (sx:8, sy:8, 8x8 -> dx:4, dy:0, 8x8)
    drawPart(8, 8, 8, 8, 4, 0, 8, 8);

    // 2. HEAD HELMET / HAT (Outer layer sx:40, sy:8, 8x8)
    drawPart(40, 8, 8, 8, 4, 0, 8, 8);

    // 3. TORSO (sx:20, sy:20, 8x12 -> dx:4, dy:8, 8x12)
    drawPart(20, 20, 8, 12, 4, 8, 8, 12);

    // 4. RIGHT ARM (Player right = screen left)
    drawPart(44, 20, 4, 12, 0, 8, 4, 12);

    // 5. LEFT ARM (Player left = screen right)
    if (hasOuterLayers) {
        drawPart(36, 52, 4, 12, 12, 8, 4, 12);
    } else {
        ctx.save();
        ctx.translate(16, 0);
        ctx.scale(-1, 1);
        drawPart(44, 20, 4, 12, 0, 8, 4, 12);
        ctx.restore();
    }

    // 6. RIGHT LEG (dx:4, dy:20, 4x12)
    drawPart(4, 20, 4, 12, 4, 20, 4, 12);

    // 7. LEFT LEG (dx:8, dy:20, 4x12)
    if (hasOuterLayers) {
        drawPart(20, 52, 4, 12, 8, 20, 4, 12);
    } else {
        ctx.save();
        ctx.translate(16, 0);
        ctx.scale(-1, 1);
        drawPart(4, 20, 4, 12, 4, 20, 4, 12);
        ctx.restore();
    }

    // Outer layers for 64x64 skins
    if (hasOuterLayers) {
        // Jacket (Torso outer): sx:20, sy:36, 8x12
        drawPart(20, 36, 8, 12, 4, 8, 8, 12);

        // Right Arm outer: sx:44, sy:36, 4x12
        drawPart(44, 36, 4, 12, 0, 8, 4, 12);

        // Left Arm outer: sx:52, sy:52, 4x12
        drawPart(52, 52, 4, 12, 12, 8, 4, 12);

        // Right Leg outer: sx:4, sy:36, 4x12
        drawPart(4, 36, 4, 12, 4, 20, 4, 12);

        // Left Leg outer: sx:4, sy:52, 4x12
        drawPart(4, 52, 4, 12, 8, 20, 4, 12);
    }
}

// ==========================================
// LOAD SKINS (Multi-tier: Defaults + JSON + GitHub Auto-Discovery)
// ==========================================
async function loadSkins() {
    const skinMap = new Map();

    // 1. Seed baseline default skins (Offline / file:/// ready)
    DEFAULT_SKIN_LIST.forEach(item => {
        skinMap.set(item.file.toLowerCase(), {
            file: item.file,
            name: item.name || item.file.replace(/\.[^/.]+$/, ""),
            category: item.category || "Custom Skin"
        });
    });

    // 2. Fetch local skins.json (When hosted on web / localhost / GitHub Pages)
    try {
        const res = await fetch('upload/skins.json?v=' + Date.now());
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(item => {
                    const file = typeof item === 'string' ? item : item.file;
                    const name = typeof item === 'string' ? item.replace(/\.[^/.]+$/, "") : (item.name || item.file.replace(/\.[^/.]+$/, ""));
                    if (file) {
                        skinMap.set(file.toLowerCase(), {
                            file: file,
                            name: name,
                            category: (typeof item === 'object' && item.category) ? item.category : "Custom Skin"
                        });
                    }
                });
            }
        }
    } catch (_) {
        // Silently fall back if running under file:// without local server
    }

    // 3. GitHub API Auto-Discovery
    // Automatically detects any new .png files pushed to GitHub's upload/ folder!
    try {
        const ghRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/upload`);
        if (ghRes.ok) {
            const ghFiles = await ghRes.json();
            if (Array.isArray(ghFiles)) {
                ghFiles.forEach(fileObj => {
                    if (fileObj.name && fileObj.name.toLowerCase().endsWith('.png')) {
                        const key = fileObj.name.toLowerCase();
                        if (!skinMap.has(key)) {
                            skinMap.set(key, {
                                file: fileObj.name,
                                name: fileObj.name.replace(/\.[^/.]+$/, ""),
                                category: "Custom Skin"
                            });
                        }
                    }
                });
            }
        }
    } catch (_) {
        // Silently skip if offline or rate-limited
    }

    // 4. Include custom uploaded skins saved in browser localStorage
    try {
        const localSkins = JSON.parse(localStorage.getItem('dakon_custom_skins') || '[]');
        if (Array.isArray(localSkins)) {
            localSkins.forEach(item => {
                if (item && item.file) {
                    skinMap.set('custom_' + item.file.toLowerCase(), item);
                }
            });
        }
    } catch (_) {}

    loadedSkins = Array.from(skinMap.values());
    renderGallery(loadedSkins);
}

// ==========================================
// RENDER GALLERY
// ==========================================
function renderGallery(skinsToRender) {
    const grid = document.getElementById('skin-grid');
    const emptyState = document.getElementById('gallery-empty');
    const countBadge = document.getElementById('skin-count-badge');

    if (countBadge) {
        countBadge.innerHTML = `<span class="status-dot"></span> ${skinsToRender.length} Skin Tersedia`;
    }

    if (!grid) return;

    if (skinsToRender.length === 0) {
        grid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
        return;
    }

    grid.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';

    grid.innerHTML = '';

    skinsToRender.forEach((skin, index) => {
        const card = createSkinCard(skin, index);
        grid.appendChild(card);
    });

    initTilt();
}

// Create individual skin card DOM
function createSkinCard(skin, index) {
    const card = document.createElement('article');
    card.className = 'bento-glass skin-bento-card';

    const localSrc = skin.customUrl || `upload/${encodeURIComponent(skin.file)}`;
    const skinName = skin.name || skin.file.replace(/\.[^/.]+$/, "");

    card.innerHTML = `
        <div class="skin-card-header">
            <span class="skin-badge-pill">
                <span class="skin-badge-dot"></span>
                <span>Minecraft Skin</span>
            </span>
            <span class="skin-dimension" id="dim-${index}">64x64 PNG</span>
        </div>

        <div class="skin-preview-stage" title="Klik untuk salin command & lihat detail">
            <canvas class="skin-char-canvas" id="canvas-${index}" style="width: 72px; height: 144px;"></canvas>
            
            <div class="skin-texture-thumbnail" title="Tekstur PNG Asli">
                <img src="${localSrc}" alt="${skinName} Texture" id="thumb-${index}">
            </div>

            <div class="click-hint-overlay">
                <span><i class="fas fa-copy"></i> Klik untuk Salin</span>
            </div>
        </div>

        <div class="skin-info-wrap">
            <div class="skin-name-row">
                <h3 class="skin-title" title="${skinName}">${skinName}</h3>
                <span class="skin-tag">#${index + 1}</span>
            </div>

            <div class="cmd-preview-box" title="Klik untuk salin command">
                <div class="cmd-prefix">
                    <span>Command Minecraft</span>
                    <i class="far fa-copy"></i>
                </div>
                <code class="cmd-text">
                    <span class="cmd-highlight">/skin url</span> "${getSkinImageUrl(skin)}"
                </code>
            </div>

            <div class="card-actions-grid">
                <button class="btn-card-copy" id="btn-copy-${index}">
                    <i class="far fa-copy"></i>
                    <span>Salin Command</span>
                </button>
                <button class="btn-card-icon" id="btn-modal-${index}" title="Lihat Detail & Download">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
    `;

    // Load skin image & render to 2D Canvas with fallback
    const img = new Image();
    if (localSrc.startsWith('http') && !localSrc.startsWith(window.location.origin)) {
        img.crossOrigin = "anonymous";
    }

    img.onload = () => {
        const canvas = card.querySelector(`#canvas-${index}`);
        renderMinecraftSkin(img, canvas);
        const dimEl = card.querySelector(`#dim-${index}`);
        if (dimEl) {
            dimEl.textContent = `${img.naturalWidth}x${img.naturalHeight} PNG`;
        }
    };

    img.onerror = () => {
        // Fallback to GitHub raw URL if local file path fails
        const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/upload/${encodeURIComponent(skin.file)}`;
        if (img.src !== rawUrl) {
            img.crossOrigin = "anonymous";
            img.src = rawUrl;
            const thumb = card.querySelector(`#thumb-${index}`);
            if (thumb) thumb.src = rawUrl;
        }
    };

    img.src = localSrc;

    // EVENT LISTENERS:
    // 1. Clicking on the stage copies command and opens modal
    const stage = card.querySelector('.skin-preview-stage');
    stage.addEventListener('click', () => {
        const cmd = generateSkinCommand(skin);
        copyToClipboard(cmd, `Command tersalin! Siap paste di Minecraft.`);
        openSkinModal(skin, img);
    });

    // 2. Clicking on the command box copies command
    const cmdBox = card.querySelector('.cmd-preview-box');
    cmdBox.addEventListener('click', (e) => {
        e.stopPropagation();
        const cmd = generateSkinCommand(skin);
        copyToClipboard(cmd, `Command tersalin! Siap paste di Minecraft.`);
    });

    // 3. Salin Command button
    const copyBtn = card.querySelector(`#btn-copy-${index}`);
    copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cmd = generateSkinCommand(skin);
        copyToClipboard(cmd, `Command tersalin: /skin url "..."`);
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = `<i class="fas fa-check"></i> <span>Tersalin!</span>`;
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = `<i class="far fa-copy"></i> <span>Salin Command</span>`;
        }, 2000);
    });

    // 4. Modal expand button
    const modalBtn = card.querySelector(`#btn-modal-${index}`);
    modalBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openSkinModal(skin, img);
    });

    return card;
}

// ==========================================
// SKIN INSPECTOR MODAL
// ==========================================
function openSkinModal(skin, preloadedImg) {
    selectedSkin = skin;
    const modal = document.getElementById('skin-modal');
    if (!modal) return;

    const modalTitle = document.getElementById('modal-skin-title');
    const modalFile = document.getElementById('modal-skin-file');
    const modalCmd = document.getElementById('modal-cmd-text');
    const modalTexture = document.getElementById('modal-texture-img');
    const modalCanvas = document.getElementById('modal-char-canvas');

    const skinName = skin.name || skin.file.replace(/\.[^/.]+$/, "");
    const imgUrl = getSkinImageUrl(skin);

    if (modalTitle) modalTitle.textContent = skinName;
    if (modalFile) modalFile.textContent = skin.file || 'custom-skin.png';

    if (modalCmd) {
        modalCmd.innerHTML = `<span class="hl-skin">/skin url</span> <span class="hl-quote">"${imgUrl}"</span>`;
    }

    const localSrc = skin.customUrl || `upload/${encodeURIComponent(skin.file)}`;
    if (modalTexture) {
        modalTexture.src = localSrc;
    }

    if (modalCanvas) {
        if (preloadedImg && preloadedImg.complete && preloadedImg.naturalWidth > 0) {
            renderMinecraftSkin(preloadedImg, modalCanvas);
        } else {
            const tempImg = new Image();
            if (localSrc.startsWith('http') && !localSrc.startsWith(window.location.origin)) {
                tempImg.crossOrigin = "anonymous";
            }
            tempImg.onload = () => renderMinecraftSkin(tempImg, modalCanvas);
            tempImg.onerror = () => {
                const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/upload/${encodeURIComponent(skin.file)}`;
                tempImg.crossOrigin = "anonymous";
                tempImg.src = rawUrl;
            };
            tempImg.src = localSrc;
        }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSkinModal() {
    const modal = document.getElementById('skin-modal');
    if (modal) {
        modal.classList.remove('active');
    }
    document.body.style.overflow = '';
}

// ==========================================
// SEARCH FILTER
// ==========================================
function initSearch() {
    const input = document.getElementById('skin-search');
    if (!input) return;

    input.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query) {
            renderGallery(loadedSkins);
            return;
        }

        const filtered = loadedSkins.filter(skin => {
            const name = (skin.name || skin.file).toLowerCase();
            return name.includes(query);
        });
        renderGallery(filtered);
    });
}

// ==========================================
// URL SOURCE SELECTOR
// ==========================================
function initSourceSelector() {
    const sel = document.getElementById('source-mode-select');
    if (!sel) return;

    sel.addEventListener('change', (e) => {
        activeUrlMode = e.target.value;
        renderGallery(loadedSkins);
        showToast(`Format URL: ${activeUrlMode === 'github_raw' ? 'GitHub Raw (Minecraft Ready)' : 'Website Domain'}`);
    });
}

// ==========================================
// DRAG & DROP / TEST LOCAL SKIN
// ==========================================
function initDropzone() {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('skin-file-input');

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('drag-over');
        });
    });

    dropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleSkinFileUpload(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleSkinFileUpload(e.target.files[0]);
        }
    });
}

function handleSkinFileUpload(file) {
    if (!file.type.includes('png') && !file.name.endsWith('.png')) {
        showToast('Mohon upload file PNG skin Minecraft!', 'fa-exclamation-triangle');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target.result;
        const newSkin = {
            file: file.name,
            name: file.name.replace(/\.[^/.]+$/, ""),
            customUrl: dataUrl,
            category: "Uploaded Local"
        };

        // Add to state and persist
        loadedSkins.unshift(newSkin);
        try {
            const saved = JSON.parse(localStorage.getItem('dakon_custom_skins') || '[]');
            saved.unshift(newSkin);
            localStorage.setItem('dakon_custom_skins', JSON.stringify(saved.slice(0, 20)));
        } catch (_) {}

        renderGallery(loadedSkins);

        // Close upload modal
        const uploadModal = document.getElementById('upload-modal');
        if (uploadModal) uploadModal.classList.remove('active');
        document.body.style.overflow = '';

        showToast(`Skin "${newSkin.name}" berhasil ditambahkan!`);
        
        // Auto open inspector modal
        const tempImg = new Image();
        tempImg.onload = () => openSkinModal(newSkin, tempImg);
        tempImg.src = dataUrl;
    };
    reader.readAsDataURL(file);
}

// ==========================================
// TILT INITIALIZATION (Identical to index.html)
// ==========================================
function initTilt() {
    if (window.innerWidth > 768 && typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".bento-glass"), {
            max: 5,
            speed: 400,
            glare: true,
            "max-glare": 0.15
        });
    }
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Particles.js (Matching index.html exactly)
    if (typeof particlesJS !== 'undefined') {
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
    }

    // 2. Entrance Animation (Matching index.html)
    const card = document.querySelector('.profile-card');
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) rotateX(10deg)';

        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) rotateX(0)';
        }, 100);
    }

    initTilt();
    initSearch();
    initSourceSelector();
    initDropzone();
    loadSkins();

    // Modal Event Listeners
    const modal = document.getElementById('skin-modal');
    const closeBtn = document.getElementById('btn-close-modal');
    if (closeBtn) closeBtn.addEventListener('click', closeSkinModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeSkinModal();
        });
    }

    // Modal Action Buttons
    const btnModalCopyCmd = document.getElementById('btn-modal-copy-cmd');
    if (btnModalCopyCmd) {
        btnModalCopyCmd.addEventListener('click', () => {
            if (!selectedSkin) return;
            const cmd = generateSkinCommand(selectedSkin);
            copyToClipboard(cmd, `Command tersalin: /skin url "..."`);
            btnModalCopyCmd.classList.add('copied');
            btnModalCopyCmd.innerHTML = `<i class="fas fa-check"></i> <span>Command Tersalin!</span>`;
            setTimeout(() => {
                btnModalCopyCmd.classList.remove('copied');
                btnModalCopyCmd.innerHTML = `<i class="fas fa-copy"></i> <span>Salin Command</span>`;
            }, 2000);
        });
    }

    const btnModalCopyUrl = document.getElementById('btn-modal-copy-url');
    if (btnModalCopyUrl) {
        btnModalCopyUrl.addEventListener('click', () => {
            if (!selectedSkin) return;
            const url = getSkinImageUrl(selectedSkin);
            copyToClipboard(url, `URL gambar tersalin!`);
        });
    }

    const btnModalDownload = document.getElementById('btn-modal-download');
    if (btnModalDownload) {
        btnModalDownload.addEventListener('click', () => {
            if (!selectedSkin) return;
            const src = selectedSkin.customUrl || `upload/${encodeURIComponent(selectedSkin.file)}`;
            const a = document.createElement('a');
            a.href = src;
            a.download = selectedSkin.file;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            showToast(`Mengunduh ${selectedSkin.file}...`, 'fa-download');
        });
    }

    // Upload Modal Trigger
    const btnOpenUpload = document.getElementById('btn-open-upload');
    const uploadModal = document.getElementById('upload-modal');
    const btnCloseUpload = document.getElementById('btn-close-upload');

    if (btnOpenUpload && uploadModal) {
        btnOpenUpload.addEventListener('click', () => {
            uploadModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (btnCloseUpload && uploadModal) {
        btnCloseUpload.addEventListener('click', () => {
            uploadModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (uploadModal) {
        uploadModal.addEventListener('click', (e) => {
            if (e.target === uploadModal) {
                uploadModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ESC key closes any open modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSkinModal();
            if (uploadModal) {
                uploadModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
});
