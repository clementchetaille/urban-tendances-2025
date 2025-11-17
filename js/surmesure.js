// ====== SUR MESURE PAGE ======= //

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

// CAROUSEL 2 //
///////////////////////

// Navigation du carousel avec les flèches
document.addEventListener("DOMContentLoaded", function () {
  const galerieGrid = document.querySelector(".galerie-processus__grid");
  const arrowLeft = document.querySelector(".galerie-processus__arrow--left");
  const arrowRight = document.querySelector(".galerie-processus__arrow--right");

  if (galerieGrid && arrowLeft && arrowRight) {
    const scrollAmount = 350; // Ajustez selon la largeur de vos images

    arrowLeft.addEventListener("click", () => {
      galerieGrid.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    });

    arrowRight.addEventListener("click", () => {
      galerieGrid.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    });
  }
});
