const flottants = document.querySelectorAll(".flottant");

flottants.forEach((flottant) => {
  flottant.addEventListener("mousemove", (e) => {
    const rect = flottant.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const moveX = x / 5;
    const moveY = y / 5;

    flottant.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  flottant.addEventListener("mouseleave", () => {
    flottant.style.transform = "translate(0, 0)";
  });
});

// === TEXTE QUI APPARAIT HERO === //

// Au chargement de la page
window.addEventListener("load", () => {
  const topBlock = document.querySelector(".hero__block--top");
  const botBlock = document.querySelector(".hero__block--bot");

  setTimeout(() => {
    topBlock?.classList.add("is-visible");
    botBlock?.classList.add("is-visible");
  }, 300); // démarre après 300ms
});

// OU avec Intersection Observer (au scroll)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.2 }
);

document
  .querySelectorAll(".hero__block--top, .hero__block--bot")
  .forEach((block) => {
    observer.observe(block);
  });
