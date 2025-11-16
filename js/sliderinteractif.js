document.addEventListener("DOMContentLoaded", function () {
  const comparators = document.querySelectorAll(".image-comparator__container");

  comparators.forEach((container) => {
    const slider = container.querySelector(".image-comparator__slider");
    const beforeWrapper = container.querySelector(
      ".image-comparator__before-wrapper"
    );
    const beforeImage = container.querySelector(".image-comparator__before");
    let isDragging = false;

    // Ajuster la largeur de l'image "before" à celle du conteneur
    function setImageWidth() {
      const containerWidth = container.offsetWidth;
      beforeImage.style.width = containerWidth + "px";
    }

    setImageWidth();
    window.addEventListener("resize", setImageWidth);

    function updateSlider(x) {
      const rect = container.getBoundingClientRect();
      const position = ((x - rect.left) / rect.width) * 100;
      const clampedPosition = Math.max(0, Math.min(100, position));

      slider.style.left = clampedPosition + "%";
      beforeWrapper.style.width = clampedPosition + "%";
    }

    // Mouse events
    slider.addEventListener("mousedown", (e) => {
      isDragging = true;
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        updateSlider(e.clientX);
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Touch events
    slider.addEventListener("touchstart", (e) => {
      isDragging = true;
      e.preventDefault();
    });

    document.addEventListener("touchmove", (e) => {
      if (isDragging) {
        updateSlider(e.touches[0].clientX);
      }
    });

    document.addEventListener("touchend", () => {
      isDragging = false;
    });

    // Click
    container.addEventListener("click", (e) => {
      if (!isDragging) {
        updateSlider(e.clientX);
      }
    });
  });
});
