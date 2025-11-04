document.addEventListener("DOMContentLoaded", () => {
  // Effet "swipe" fluide au clic/drag (comme sur mobile)
  const sliders = document.querySelectorAll(".product-images");
  if (sliders.length) {
    sliders.forEach((slider) => {
      slider.querySelectorAll("img").forEach((img) => (img.draggable = false));
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let velocity = 0;
      let momentumID;

      const momentum = () => {
        slider.scrollLeft += velocity;
        velocity *= 0.95;
        if (Math.abs(velocity) > 0.5) {
          momentumID = requestAnimationFrame(momentum);
        }
      };

      slider.addEventListener("mousedown", (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        velocity = 0;
        cancelAnimationFrame(momentumID);
        slider.classList.add("active");
      });

      slider.addEventListener("mouseleave", () => {
        if (!isDown) return;
        isDown = false;
        slider.classList.remove("active");
        momentumID = requestAnimationFrame(momentum);
      });

      slider.addEventListener("mouseup", () => {
        isDown = false;
        slider.classList.remove("active");
        momentumID = requestAnimationFrame(momentum);
      });

      slider.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.3;
        const prevScrollLeft = slider.scrollLeft;
        slider.scrollLeft = scrollLeft - walk;
        velocity = (slider.scrollLeft - prevScrollLeft) * 0.8;
      });
    });
  }

  // Gestion des liens actifs de la products-bar
  const currentPage = window.location.pathname.split("/").pop();
  const productLinks = document.querySelectorAll(".products-bar a");

  productLinks.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    const linkPage = href.split("/").pop();

    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
});

// Animation au scroll
const sketchSection = document.querySelector(".sketch-section");

window.addEventListener("scroll", () => {
  const rect = sketchSection.getBoundingClientRect();
  const isVisible =
    rect.top < window.innerHeight * 0.8 &&
    rect.bottom > window.innerHeight * 0.2;

  if (isVisible) {
    sketchSection.classList.add("active");
  } else {
    sketchSection.classList.remove("active");
  }
});

// Toggle dropdown au clic sur le bouton
const dropdownBtn = document.querySelector(".collection-btn");
const dropdown = document.querySelector(".collection-dropdown");

if (dropdownBtn && dropdown) {
  dropdownBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    dropdown.classList.toggle("active");
  });

  // Fermer le dropdown en cliquant ailleurs
  document.addEventListener("click", function (e) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
}

// ====== IMAGE QUI S'AGRANDIT ====== //
// Sélectionner tous les éléments nécessaires
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-image");
const closeModal = document.querySelector(".close-modal");
const projectImages = document.querySelectorAll(".project-images img");

// Ajouter un écouteur de clic sur chaque image
projectImages.forEach((img) => {
  img.addEventListener("click", function () {
    modal.style.display = "block";
    modalImg.src = this.src;
  });
});

// Fermer la modale au clic sur la croix
closeModal.addEventListener("click", function () {
  modal.style.display = "none";
});

// Fermer la modale au clic en dehors de l'image
modal.addEventListener("click", function (e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Fermer avec la touche Échap
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && modal.style.display === "block") {
    modal.style.display = "none";
  }
});
