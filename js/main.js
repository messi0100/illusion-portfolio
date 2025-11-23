// =======================================================
// LOADER FADE
// =======================================================
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    loader.style.opacity = "0";
    setTimeout(() => loader.style.display = "none", 500);
});

// =======================================================
// BACKGROUND PARTICLES
// =======================================================
const container = document.getElementById("bg-particles");

for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");

    const size = Math.random() * 25 + 10;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;

    p.style.left = Math.random() * 100 + "%";
    p.style.top = Math.random() * 100 + "%";

    const isBlue = Math.random() > 0.5;
    p.style.background = isBlue
        ? "rgba(0, 140, 255, 0.5)"
        : "rgba(170, 115, 52, 0.5)";

    p.style.opacity = 0.12 + Math.random() * 0.1;
    p.style.animationDuration = Math.random() * 6 + 6 + "s";

    container.appendChild(p);
}

// =======================================================
// SMOOTH SCROLL (TWEEN STYLE)
// =======================================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));
        if (!target) return;

        const start = window.pageYOffset;
        const end = target.offsetTop - 60;
        const duration = 600;
        const startTime = performance.now();

        function animateScroll(currentTime) {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 2);

            window.scrollTo(0, start + (end - start) * eased);

            if (progress < 1) requestAnimationFrame(animateScroll);
        }

        requestAnimationFrame(animateScroll);
    });
});

// =======================================================
// DARK/LIGHT MODE
// =======================================================
document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
});

// =======================================================
// VIDEO DATA (IDs + captions + sources)
// =======================================================
const systems = [
    {
        id: "combat",
        src: "Videos/combat.mp4",
        title: "Combat + Movement System",
        desc: "Fast anime-styled combat with movement tech and tween-smoothed transitions."
    },
    {
        id: "camera",
        src: "Videos/camera.mp4",
        title: "Advanced RPG Camera System",
        desc: "Smooth RPG-follow camera with stabilization, easing, and dynamic angle control."
    },
    {
        id: "drift",
        src: "Videos/drift.mp4",
        title: "A-Chassis Drift System",
        desc: "Custom drift physics with tuning, responsive chassis, and smooth handling."
    },
    {
        id: "menu",
        src: "Videos/menu.mp4",
        title: "Main Menu Tween System",
        desc: "Animated UI menus with polished easing and satisfying transitions."
    }
];

// =======================================================
// RESPONSIVE CAROUSEL — INFINITE LOOP + AUTO SCROLL
// =======================================================
const track = document.querySelector(".carousel-track");
const leftBtn = document.querySelector(".left-btn");
const rightBtn = document.querySelector(".right-btn");
let autoScroll = true;

// Clone for smooth infinite loop
function setupInfiniteLoop() {
    const items = Array.from(track.children);
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });
}
setupInfiniteLoop();

// Continuous auto-scroll
function continuousScroll() {
    if (autoScroll) {
        track.scrollLeft += 0.7;
    }
    if (track.scrollLeft >= track.scrollWidth / 2) {
        track.scrollLeft = 0;
    }
    requestAnimationFrame(continuousScroll);
}
continuousScroll();

// Pause on hover
track.addEventListener("mouseenter", () => autoScroll = false);
track.addEventListener("mouseleave", () => autoScroll = true);

// Arrow controls (one item per click)
rightBtn.addEventListener("click", () => {
    autoScroll = false;
    const width = track.children[0].offsetWidth + 25;
    track.scrollLeft += width;
    setTimeout(() => autoScroll = true, 800);
});

leftBtn.addEventListener("click", () => {
    autoScroll = false;
    const width = track.children[0].offsetWidth + 25;
    track.scrollLeft -= width;

    if (track.scrollLeft < 0) {
        track.scrollLeft = track.scrollWidth / 2;
    }

    setTimeout(() => autoScroll = true, 800);
});

// Mobile swipe
let startX = 0;
track.addEventListener("touchstart", e => {
    autoScroll = false;
    startX = e.touches[0].clientX;
});
track.addEventListener("touchmove", e => {
    let diff = startX - e.touches[0].clientX;
    track.scrollLeft += diff * 1.3;
});
track.addEventListener("touchend", () => {
    setTimeout(() => autoScroll = true, 1500);
});

// =======================================================
// ADVANCED VIDEO MODAL — ZOOM, BLUR, CAPTIONS, NAVIGATION
// =======================================================

const modal = document.getElementById("videoModal");
const expandedVideo = document.getElementById("expandedVideo");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const prevBtn = document.querySelector(".modal-prev");
const nextBtn = document.querySelector(".modal-next");

let currentIndex = 0;

// Assign IDs to carousel items
document.querySelectorAll(".carousel-item").forEach((item, index) => {
    item.dataset.id = systems[index % systems.length].id;
});

// Open modal
document.querySelectorAll(".carousel-item video").forEach((video, index) => {
    video.addEventListener("click", () => {
        autoScroll = false;
        currentIndex = index % systems.length;
        openModal(currentIndex);
    });
});

function openModal(index) {
    const s = systems[index];

    expandedVideo.src = s.src;
    modalTitle.textContent = s.title;
    modalDesc.textContent = s.desc;

    modal.style.display = "flex";
    requestAnimationFrame(() => modal.classList.add("active"));
}

// Modal close
function closeModal() {
    modal.classList.remove("active");

    setTimeout(() => {
        modal.style.display = "none";
        expandedVideo.pause();
        expandedVideo.src = "";
        autoScroll = true;
    }, 250);
}

// Click outside to close
modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
});

// ESC to close
document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
});

// Next
nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % systems.length;
    openModal(currentIndex);
});

// Prev
prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + systems.length) % systems.length;
    openModal(currentIndex);
});

// Swipe inside modal
let modalStartX = 0;
expandedVideo.addEventListener("touchstart", e => {
    modalStartX = e.touches[0].clientX;
});

expandedVideo.addEventListener("touchend", e => {
    let diff = modalStartX - e.changedTouches[0].clientX;

    if (diff > 40) {
        currentIndex = (currentIndex + 1) % systems.length;
        openModal(currentIndex);
    } else if (diff < -40) {
        currentIndex = (currentIndex - 1 + systems.length) % systems.length;
        openModal(currentIndex);
    }
});

// =======================================================
// FETCH LIVE ROBLOX GAME STATS (VISITS + LIKE RATIO)
// =======================================================

document.querySelectorAll(".game-card").forEach(async card => {
    const universeId = card.dataset.universe;

    const visitsEl = card.querySelector(".visits");
    const ratioEl = card.querySelector(".ratio-text");
    const likeFill = card.querySelector(".like-fill");

    try {
        // Fetch game data
        const res = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
        const data = await res.json();
        const game = data.data[0];

        const visits = game.visits;
        const likes = game.voteData.upVotes;
        const dislikes = game.voteData.downVotes;

        // Update visits
        visitsEl.textContent = visits.toLocaleString();

        // Calculate like ratio
        const totalVotes = likes + dislikes;
        const ratio = totalVotes === 0 ? 0 : likes / totalVotes;
        const percent = Math.round(ratio * 100);

        // Update ratio text
        ratioEl.textContent = percent + "% Like Ratio";

        // Update like bar
        likeFill.style.width = percent + "%";

    } catch (err) {
        visitsEl.textContent = "N/A";
        ratioEl.textContent = "N/A";
        likeFill.style.width = "0%";
    }
});
