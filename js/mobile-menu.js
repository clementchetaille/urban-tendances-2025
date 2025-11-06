document.addEventListener("DOMContentLoaded", function () {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeMenuBtn = document.getElementById("closeMenuBtn");

  // Ouvrir le menu
  hamburgerBtn.addEventListener("click", function () {
    mobileMenu.classList.add("active");
    document.body.classList.add("menu-open");
  });

  // Fermer le menu avec le bouton X
  closeMenuBtn.addEventListener("click", function () {
    mobileMenu.classList.remove("active");
    document.body.classList.remove("menu-open");
  });

  // Fermer en cliquant sur l'overlay
  mobileMenu.addEventListener("click", function (e) {
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });

  // Fermer avec la touche Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
      mobileMenu.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });
});

// Gérer les sous-menus accordéon
document.querySelectorAll(".mobile-submenu-toggle").forEach((toggle) => {
  toggle.addEventListener("click", function () {
    const parent = this.closest(".mobile-submenu");
    parent.classList.toggle("active");
  });
});
