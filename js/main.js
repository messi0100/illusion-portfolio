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

const PARTICLE_COUNT = 80;
const colors = [
    "rgba(0, 255, 0, 0.35)",    // Bright green
    "rgba(255, 255, 0, 0.35)",  // Yellow
    "rgba(255, 102, 0, 0.35)",  // Orange
    "rgba(153, 0, 255, 0.35)",  // Purple
    "rgba(255, 0, 153, 0.35)",  // Pink
    "rgba(0, 255, 255, 0.35)"   // Cyan
];

for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");

    const size = Math.random() * 26 + 10;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;

    p.style.left = Math.random() * 100 + "%";
    p.style.top = Math.random() * 100 + "%";

    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.background = `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 65%)`;

    p.style.opacity = 0.12 + Math.random() * 0.1;
    p.style.animationDuration = Math.random() * 8 + 8 + "s";
    p.style.animationDelay = `-${Math.random() * 5}s`;

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
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    });
}

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

if (track && leftBtn && rightBtn) {
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
}

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

if (modal && expandedVideo && modalTitle && modalDesc && prevBtn && nextBtn) {
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
}

/* ===========================
   AUTO LOOP REVIEW CARDS
   =========================== */

const track1 = document.querySelector('.review-track');
if (track1) {
    const cards = Array.from(track1.children).filter(c => !c.classList.contains("clone"));

    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track1.appendChild(clone);
    });
}

/* =======================================================
   FEATURED SYSTEM TERMINAL CARDS — MODAL PLAYBACK
   ======================================================= */

const sysCards = document.querySelectorAll(".system-terminal");

if (sysCards.length > 0) {
    sysCards.forEach((card, index) => {
        const file = card.getAttribute("data-video");
        const title = card.getAttribute("data-title");

        card.addEventListener("click", () => {
            autoScroll = false; // stop carousel autoplay if active

            expandedVideo.src = file;
            modalTitle.textContent = title;
            modalDesc.textContent = ""; // optional: systems don’t need a desc

            modal.style.display = "flex";
            requestAnimationFrame(() => modal.classList.add("active"));

            expandedVideo.play();
        });
    });
}

/* =======================================================
   FEATURED SYSTEM VIDEO FRAMES — HOVER PREVIEW + SHRINK
   ======================================================= */

document.querySelectorAll(".system-terminal .video-frame video").forEach(v => {
    v.style.maxHeight = "170px";     // SHRINKED SIZE
    v.style.objectFit = "cover";

    v.addEventListener("mouseenter", () => {
        v.play();
    });

    v.addEventListener("mouseleave", () => {
        v.pause();
        v.currentTime = 0;
    });
});

/* =======================================================
   SYSTEM VIDEO SCANLINE (AUTO ANIMATION READY)
   ======================================================= */

document.querySelectorAll(".video-scanline").forEach(sl => {
    sl.style.animation = "videoScan 3s linear infinite";
});

/* CRT Boot Flash */
window.addEventListener("load", () => {
    document.querySelectorAll(".carousel-item video").forEach(v => {
        v.style.opacity = "0";
        setTimeout(() => v.style.transition = "opacity 0.4s", 10);
        setTimeout(() => v.style.opacity = "1", 80);
    });
});

/* =======================================================
   INTERACTIVE TILT ON CARDS
   ======================================================= */
const tiltTargets = document.querySelectorAll(".tilt, .carousel-item, .game-card, .pricing-terminal, .terminal-card");

tiltTargets.forEach(card => {
    let rafId = null;

    const reset = () => {
        card.style.transform = "rotateX(0deg) rotateY(0deg)";
        card.style.boxShadow = "";
    };

    const handleMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 8;  // left/right
        const rotateX = ((y / rect.height) - 0.5) * -8; // up/down

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.boxShadow = `0 16px 40px rgba(0, 0, 0, 0.35), 0 12px 28px rgba(209, 138, 66, 0.15)`;
    };

    card.addEventListener("mouseenter", () => {
        reset();
    });

    card.addEventListener("mousemove", (e) => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => handleMove(e));
    });

    ["mouseleave", "blur"].forEach(evt => {
        card.addEventListener(evt, () => {
            reset();
        });
    });
});

/* =======================================================
   TYPE-ON-SCROLL ANIMATION
   ======================================================= */
const typeTargets = document.querySelectorAll(".type-on-scroll");

typeTargets.forEach(el => {
    const original = el.textContent.trim();
    el.dataset.text = original;
    el.textContent = "";
});

if (typeTargets.length) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (el.dataset.typed === "true") return;
                el.dataset.typed = "true";
                el.classList.add("typing");

                const text = el.dataset.text || "";
                let idx = 0;
                const speed = 30; // ms per char

                const typeChar = () => {
                    if (idx <= text.length) {
                        el.textContent = text.slice(0, idx);
                        idx++;
                        setTimeout(typeChar, speed);
                    } else {
                        el.classList.remove("typing");
                    }
                };
                typeChar();
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.6 });

    typeTargets.forEach(el => observer.observe(el));
}
