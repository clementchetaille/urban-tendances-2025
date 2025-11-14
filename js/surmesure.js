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

// Script du carousel avec navigation fluide
(function () {
  const track = document.getElementById("surmesureCarouselTrack");
  const prevBtn = document.getElementById("surmesurePrevBtn");
  const nextBtn = document.getElementById("surmesureNextBtn");
  const indicators = document.getElementById("surmesureIndicators");
  const slides = track.querySelectorAll(".surmesure-carousel__slide");

  let currentIndex = 0;
  const totalSlides = slides.length;

  // Créer les indicateurs
  slides.forEach((_, index) => {
    const indicator = document.createElement("button");
    indicator.className = "surmesure-carousel__indicator";
    indicator.setAttribute("aria-label", `Aller à l'image ${index + 1}`);
    if (index === 0) indicator.classList.add("active");
    indicator.addEventListener("click", () => goToSlide(index));
    indicators.appendChild(indicator);
  });

  const allIndicators = indicators.querySelectorAll(
    ".surmesure-carousel__indicator"
  );

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Mettre à jour les indicateurs
    allIndicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentIndex);
    });

    // Gérer la désactivation des boutons aux extrémités (optionnel)
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalSlides - 1;
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
    } else {
      currentIndex = 0; // Revenir au début
    }
    updateCarousel();
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = totalSlides - 1; // Aller à la fin
    }
    updateCarousel();
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  // Événements des boutons
  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  // Navigation au clavier
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });

  // Support du swipe sur mobile (optionnel)
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  track.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) nextSlide();
    if (touchEndX > touchStartX + 50) prevSlide();
  }

  // Défilement automatique (optionnel - décommentez si souhaité)
  /*
  let autoplayInterval = setInterval(nextSlide, 5000);
  
  track.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  track.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(nextSlide, 5000);
  });
  */
})();
