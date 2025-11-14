// Script pour centrer la section hero sur la colonne centrale au chargement
(function () {
  // Attendre que le DOM soit chargé
  document.addEventListener("DOMContentLoaded", function () {
    const heroSection = document.getElementById("heroSection");
    const centerCol = document.querySelector(".hero__col--center");

    if (heroSection && centerCol) {
      // Calculer la position pour centrer la colonne centrale
      const scrollPosition =
        centerCol.offsetLeft -
        heroSection.offsetWidth / 2 +
        centerCol.offsetWidth / 2;

      // Scroller vers la colonne centrale sans animation (instantané)
      heroSection.scrollLeft = scrollPosition;
    }
  });

  // Optionnel : Réajuster si la fenêtre est redimensionnée
  window.addEventListener("resize", function () {
    const heroSection = document.getElementById("heroSection");
    const centerCol = document.querySelector(".hero__col--center");

    if (heroSection && centerCol) {
      const scrollPosition =
        centerCol.offsetLeft -
        heroSection.offsetWidth / 2 +
        centerCol.offsetWidth / 2;
      heroSection.scrollLeft = scrollPosition;
    }
  });
})();
