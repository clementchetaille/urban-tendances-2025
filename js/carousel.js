document.addEventListener("DOMContentLoaded", function () {
  const carouselContainer = document.querySelector(".carousel-container");

  if (!carouselContainer) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  carouselContainer.addEventListener("mousedown", (e) => {
    isDown = true;
    carouselContainer.style.cursor = "grabbing";
    startX = e.pageX - carouselContainer.offsetLeft;
    scrollLeft = carouselContainer.scrollLeft;
  });

  carouselContainer.addEventListener("mouseleave", () => {
    isDown = false;
    carouselContainer.style.cursor = "grab";
  });

  carouselContainer.addEventListener("mouseup", () => {
    isDown = false;
    carouselContainer.style.cursor = "grab";
  });

  carouselContainer.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carouselContainer.offsetLeft;
    const walk = (x - startX) * 2;
    carouselContainer.scrollLeft = scrollLeft - walk;
  });

  // Empêcher le drag sur les images et liens
  const draggableElements = carouselContainer.querySelectorAll("img, a");
  draggableElements.forEach((el) => {
    el.addEventListener("dragstart", (e) => {
      e.preventDefault();
    });
  });
});

// CAROUSSEL DE LA PAGE LES BETONS //
// Carousel Couleurs Bétons
document.addEventListener("DOMContentLoaded", function () {
  const track = document.getElementById("colorsCarouselTrack");
  const prevBtn = document.getElementById("colorsPrevBtn");
  const nextBtn = document.getElementById("colorsNextBtn");
  const indicatorsContainer = document.getElementById("colorsIndicators");

  if (!track || !prevBtn || !nextBtn) return;

  const slides = track.querySelectorAll(".colors-carousel__slide");
  let currentIndex = 0;

  // Créer les indicateurs
  slides.forEach((_, index) => {
    const indicator = document.createElement("button");
    indicator.classList.add("indicator");
    if (index === 0) indicator.classList.add("active");
    indicator.setAttribute("aria-label", `Aller à la couleur ${index + 1}`);
    indicator.addEventListener("click", () => goToSlide(index));
    indicatorsContainer.appendChild(indicator);
  });

  const indicators = indicatorsContainer.querySelectorAll(".indicator");

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Mettre à jour les indicateurs
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  // Navigation au clavier
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });
});
