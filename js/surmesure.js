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

// CAROUSEL SWIPE FUNCTIONALITY
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".surmesure-carousel__wrapper");
  const track = document.querySelector(".surmesure-carousel__track");
  const slides = document.querySelectorAll(".surmesure-carousel__slide");
  const prevBtn = document.querySelector(".surmesure-carousel__nav--prev");
  const nextBtn = document.querySelector(".surmesure-carousel__nav--next");

  if (!carousel || !track || slides.length === 0) return;

  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let currentIndex = 0;
  let animationID;

  // Calcul du nombre de slides visibles
  function getSlidesPerView() {
    const width = window.innerWidth;
    if (width <= 480) return 1;
    if (width <= 768) return 2;
    if (width <= 1024) return 3;
    return 4;
  }

  // Calcul de la largeur d'un slide
  function getSlideWidth() {
    return slides[0].offsetWidth + 20; // +20 pour le gap
  }

  // Position du carousel
  function setPositionByIndex() {
    const slideWidth = getSlideWidth();
    const slidesPerView = getSlidesPerView();
    const maxIndex = Math.max(0, slides.length - slidesPerView);

    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
    currentTranslate = currentIndex * -slideWidth;
    prevTranslate = currentTranslate;
    setSliderPosition();
  }

  function setSliderPosition() {
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  // Animation
  function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
  }

  // TOUCH EVENTS
  track.addEventListener("touchstart", touchStart);
  track.addEventListener("touchmove", touchMove);
  track.addEventListener("touchend", touchEnd);

  // MOUSE EVENTS
  track.addEventListener("mousedown", touchStart);
  track.addEventListener("mousemove", touchMove);
  track.addEventListener("mouseup", touchEnd);
  track.addEventListener("mouseleave", touchEnd);

  function touchStart(event) {
    isDragging = true;
    startPos = getPositionX(event);
    animationID = requestAnimationFrame(animation);
    track.style.transition = "none";
  }

  function touchMove(event) {
    if (!isDragging) return;

    const currentPosition = getPositionX(event);
    const diff = currentPosition - startPos;
    currentTranslate = prevTranslate + diff;
  }

  function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;
    const slideWidth = getSlideWidth();

    // Si le mouvement est assez grand, changer de slide
    if (movedBy < -50) {
      currentIndex++;
    } else if (movedBy > 50) {
      currentIndex--;
    }

    track.style.transition = "transform 0.5s ease";
    setPositionByIndex();
  }

  function getPositionX(event) {
    return event.type.includes("mouse")
      ? event.pageX
      : event.touches[0].clientX;
  }

  // BOUTONS NAVIGATION
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentIndex--;
      setPositionByIndex();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentIndex++;
      setPositionByIndex();
    });
  }

  // RESPONSIVE - Recalculer au resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setPositionByIndex();
    }, 250);
  });

  // Initialisation
  setPositionByIndex();
});
