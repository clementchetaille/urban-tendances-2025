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
