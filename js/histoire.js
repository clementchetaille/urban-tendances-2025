// ====== HISTOIRE PAGE ======= //

// Video sound toggle functionality
const heroVideo = document.getElementById("surmesureHeroVideo");
const soundToggle = document.getElementById("surmesureSoundToggle");

if (heroVideo && soundToggle) {
  soundToggle.addEventListener("click", () => {
    if (heroVideo.muted) {
      heroVideo.muted = false;
      soundToggle.classList.add("unmuted");
    } else {
      heroVideo.muted = true;
      soundToggle.classList.remove("unmuted");
    }
  });
}
