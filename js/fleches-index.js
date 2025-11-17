document.addEventListener("DOMContentLoaded", function () {
  const heroSection = document.getElementById("heroSection");
  const leftArrow = heroSection.querySelector(".hero__arrow--left");
  const rightArrow = heroSection.querySelector(".hero__arrow--right");
  const cols = heroSection.querySelectorAll(".hero__col");

  let currentIndex = 1; // On commence au centre (index 1)

  // Fonction pour scroller vers une colonne
  function scrollToColumn(index) {
    const targetCol = cols[index];
    if (targetCol) {
      targetCol.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
      currentIndex = index;
      updateArrows();
    }
  }

  // Fonction pour mettre à jour la visibilité des flèches
  function updateArrows() {
    // Masquer la flèche gauche si on est au début
    if (currentIndex === 0) {
      leftArrow.style.opacity = "0.3";
      leftArrow.style.pointerEvents = "none";
    } else {
      leftArrow.style.opacity = "0.6";
      leftArrow.style.pointerEvents = "auto";
    }

    // Masquer la flèche droite si on est à la fin
    if (currentIndex === cols.length - 1) {
      rightArrow.style.opacity = "0.3";
      rightArrow.style.pointerEvents = "none";
    } else {
      rightArrow.style.opacity = "0.6";
      rightArrow.style.pointerEvents = "auto";
    }
  }

  // Navigation vers la gauche
  leftArrow.addEventListener("click", function () {
    if (currentIndex > 0) {
      scrollToColumn(currentIndex - 1);
    }
  });

  // Navigation vers la droite
  rightArrow.addEventListener("click", function () {
    if (currentIndex < cols.length - 1) {
      scrollToColumn(currentIndex + 1);
    }
  });

  // Support du clavier
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft" && currentIndex > 0) {
      scrollToColumn(currentIndex - 1);
    } else if (e.key === "ArrowRight" && currentIndex < cols.length - 1) {
      scrollToColumn(currentIndex + 1);
    }
  });

  // Détecter le scroll manuel pour mettre à jour currentIndex
  let scrollTimeout;
  heroSection.addEventListener("scroll", function () {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Trouver quelle colonne est visible
      const scrollLeft = heroSection.scrollLeft;
      const colWidth =
        cols[0].offsetWidth + parseFloat(getComputedStyle(heroSection).gap);
      currentIndex = Math.round(scrollLeft / colWidth);
      updateArrows();
    }, 100);
  });

  // Initialiser l'état des flèches
  updateArrows();
});
