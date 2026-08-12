const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =========================
   MUSIC
========================= */

const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
let musicPlaying = false;

function toggleMusic() {
    if (musicPlaying) {
        music.pause();
        musicButton.classList.remove("playing");
        musicPlaying = false;
    } else {
        music.play().catch(() => {});
        musicButton.classList.add("playing");
        musicPlaying = true;
    }
}

/* =========================
   OPEN GIFT (scroll to memories)
========================= */

function scrollToMemories() {
    document.getElementById("memories").scrollIntoView({ behavior: "smooth" });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================
   GIFT BOX INTERACTION
========================= */

const giftBox = document.getElementById("giftBox");
const giftLabel = document.getElementById("giftLabel");
const sparkleEmojis = ["✨", "💜", "🌸", "♡", "🌷"];

function burstSparkles(originEl) {
    const rect = originEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = prefersReducedMotion ? 0 : 14;

    for (let i = 0; i < count; i++) {
        const s = document.createElement("span");
        s.className = "sparkle-burst";
        s.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
        const angle = Math.random() * Math.PI * 2;
        const distance = 60 + Math.random() * 90;
        s.style.left = cx + "px";
        s.style.top = cy + "px";
        s.style.setProperty("--sx", Math.cos(angle) * distance + "px");
        s.style.setProperty("--sy", Math.sin(angle) * distance + "px");
        s.style.animationDelay = Math.random() * 0.15 + "s";
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 1100);
    }
}

let giftOpened = false;

function openGift() {
    if (giftOpened) {
        scrollToMemories();
        return;
    }
    giftOpened = true;
    giftBox.classList.add("open");
    burstSparkles(giftBox);
    giftLabel.textContent = "happy opening! ♡";

    setTimeout(scrollToMemories, prefersReducedMotion ? 100 : 650);
}

giftBox.addEventListener("click", openGift);
giftBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openGift();
    }
});

/* =========================
   WAX SEAL / LETTER
========================= */

const envelope = document.getElementById("envelope");
const waxSeal = document.getElementById("waxSeal");

waxSeal.addEventListener("click", () => {
    envelope.classList.add("open");
    burstSparkles(waxSeal);
    envelope.querySelector(".letter").scrollIntoView({ behavior: "smooth", block: "center" });
});

/* =========================
   SCROLL PROGRESS BAR
========================= */

const progressFill = document.getElementById("progressFill");

function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressFill.style.width = pct + "%";
}

/* =========================
   BACK TO TOP VISIBILITY
========================= */

const topBtn = document.getElementById("topBtn");

function updateTopBtn() {
    if (window.scrollY > window.innerHeight * 0.6) {
        topBtn.classList.add("visible");
    } else {
        topBtn.classList.remove("visible");
    }
}

window.addEventListener("scroll", () => {
    updateProgress();
    updateTopBtn();
}, { passive: true });

/* =========================
   SCROLL REVEAL
========================= */

const revealEls = document.querySelectorAll("[data-reveal]");

if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("in-view"));
} else {
    const groups = new Map();

    revealEls.forEach((el) => {
        const parent = el.closest("section") || document.body;
        if (!groups.has(parent)) groups.set(parent, []);
        groups.get(parent).push(el);
    });

    groups.forEach((els) => {
        els.forEach((el, i) => {
            el.style.setProperty("--reveal-delay", Math.min(i * 0.08, 0.5) + "s");
        });
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));
}

/* =========================
   AMBIENT PETALS
========================= */

const petalField = document.getElementById("petalField");
const petalEmojis = ["🌸", "🌷", "✨", "🌼"];

function spawnPetal() {
    if (prefersReducedMotion) return;

    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];

    const duration = 9 + Math.random() * 8;
    const drift = (Math.random() - 0.5) * 160;

    petal.style.left = Math.random() * 100 + "vw";
    petal.style.fontSize = 14 + Math.random() * 14 + "px";
    petal.style.animationDuration = duration + "s";
    petal.style.setProperty("--drift", drift + "px");

    petalField.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 1000 + 200);
}

if (!prefersReducedMotion) {
    for (let i = 0; i < 6; i++) {
        setTimeout(() => spawnPetal(), i * 900);
    }
    setInterval(spawnPetal, 1600);
}

/* =========================
   LIGHTBOX GALLERY
========================= */

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

const galleryImgs = Array.from(document.querySelectorAll("img[data-lightbox]"));
let currentIndex = 0;

function showLightbox(index) {
    currentIndex = (index + galleryImgs.length) % galleryImgs.length;
    const img = galleryImgs[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.dataset.caption || "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
}

galleryImgs.forEach((img, i) => {
    img.addEventListener("click", () => showLightbox(i));
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => showLightbox(currentIndex - 1));
lightboxNext.addEventListener("click", () => showLightbox(currentIndex + 1));

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showLightbox(currentIndex - 1);
    if (e.key === "ArrowRight") showLightbox(currentIndex + 1);
});

/* =========================
   INIT
========================= */

updateProgress();
updateTopBtn();