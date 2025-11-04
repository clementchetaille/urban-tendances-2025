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

// Carousel functionality with swipe support
let currentPosition = 0;
const track = document.getElementById("surmesureCarouselTrack");
const items = document.querySelectorAll(".surmesure-carousel__slide");
const carouselWrapper = document.querySelector(".surmesure-carousel__wrapper");

// Swipe variables
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;

// Calculate items per view based on screen size
function getItemsPerView() {
  if (window.innerWidth <= 480) return 1;
  if (window.innerWidth <= 768) return 2;
  if (window.innerWidth <= 1024) return 3;
  return 4;
}

function moveCarousel(direction) {
  const itemsPerView = getItemsPerView();
  const maxPosition = items.length - itemsPerView;

  currentPosition += direction;

  if (currentPosition < 0) {
    currentPosition = maxPosition;
  } else if (currentPosition > maxPosition) {
    currentPosition = 0;
  }

  updateCarousel();
}

function goToSlide(index) {
  const itemsPerView = getItemsPerView();
  currentPosition = index * itemsPerView;
  updateCarousel();
}

function updateCarousel() {
  const itemWidth = items[0].offsetWidth;
  const gap = 20;
  const offset = -(currentPosition * (itemWidth + gap));
  track.style.transform = `translateX(${offset}px)`;
  currentTranslate = offset;
  prevTranslate = offset;
}

// Touch/Mouse events for swipe
function touchStart(event) {
  isDragging = true;
  startPos = getPositionX(event);
  animationID = requestAnimationFrame(animation);
  track.style.transition = "none";
}

function touchMove(event) {
  if (isDragging) {
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

function touchEnd() {
  isDragging = false;
  cancelAnimationFrame(animationID);
  track.style.transition = "transform 0.5s ease";

  const movedBy = currentTranslate - prevTranslate;

  // If moved enough, go to next/prev slide
  if (movedBy < -100) {
    moveCarousel(1);
  } else if (movedBy > 100) {
    moveCarousel(-1);
  } else {
    // Snap back to current position
    updateCarousel();
  }
}

function getPositionX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

function animation() {
  if (isDragging) {
    track.style.transform = `translateX(${currentTranslate}px)`;
    requestAnimationFrame(animation);
  }
}

// Add event listeners for swipe
if (carouselWrapper) {
  // Touch events
  carouselWrapper.addEventListener("touchstart", touchStart);
  carouselWrapper.addEventListener("touchmove", touchMove);
  carouselWrapper.addEventListener("touchend", touchEnd);

  // Mouse events
  carouselWrapper.addEventListener("mousedown", touchStart);
  carouselWrapper.addEventListener("mousemove", touchMove);
  carouselWrapper.addEventListener("mouseup", touchEnd);
  carouselWrapper.addEventListener("mouseleave", () => {
    if (isDragging) touchEnd();
  });

  // Prevent context menu on long press
  carouselWrapper.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });
}

// Prevent image dragging
items.forEach((item) => {
  const img = item.querySelector("img");
  if (img) {
    img.addEventListener("dragstart", (e) => e.preventDefault());
  }
});

// Handle window resize
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    currentPosition = 0;
    createDots();
    updateCarousel();
  }, 250);
});

// Optional: Auto-play carousel
let autoplayInterval;
function startAutoplay() {
  autoplayInterval = setInterval(() => {
    moveCarousel(1);
  }, 5000);
}

function stopAutoplay() {
  clearInterval(autoplayInterval);
}

// Uncomment to enable autoplay
// startAutoplay();

// Stop autoplay on user interaction
if (carouselWrapper) {
  carouselWrapper.addEventListener("mouseenter", stopAutoplay);
  // Restart autoplay when mouse leaves (optional)
  // carouselWrapper.addEventListener('mouseleave', startAutoplay);
}
