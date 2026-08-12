const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");

let musicPlaying = false;


/* =========================
   MUSIC
========================= */

function toggleMusic() {

    if (musicPlaying) {

        music.pause();

        musicButton.textContent = "🎵";

        musicPlaying = false;

    } else {

        music.play();

        musicButton.textContent = "🔊";

        musicPlaying = true;

    }

}


/* =========================
   OPEN GIFT
========================= */

function scrollToMemories() {

    document
        .getElementById("memories")
        .scrollIntoView({
            behavior: "smooth"
        });

}