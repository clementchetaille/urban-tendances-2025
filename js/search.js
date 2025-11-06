document.addEventListener("DOMContentLoaded", function () {
  const searchIcon = document.querySelector(".search-icon");
  const searchOverlay = document.querySelector(".search-overlay");
  const searchClose = document.querySelector(".search-close");
  const searchInput = document.querySelector(".search-input");
  const searchResults = document.querySelector(".search-results");

  // Ouvrir l'overlay
  if (searchIcon) {
    searchIcon.addEventListener("click", () => {
      searchOverlay.classList.add("active");
      searchInput.focus();
    });
  }

  // Fermer l'overlay
  if (searchClose) {
    searchClose.addEventListener("click", () => {
      closeSearch();
    });
  }

  // Fermer avec Échap
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchOverlay.classList.contains("active")) {
      closeSearch();
    }
  });

  // Fermer en cliquant sur le fond noir
  searchOverlay.addEventListener("click", (e) => {
    if (e.target === searchOverlay) {
      closeSearch();
    }
  });

  // Fonction pour fermer la recherche
  function closeSearch() {
    searchOverlay.classList.remove("active");
    searchInput.value = "";
    searchResults.classList.remove("active");
    searchResults.innerHTML = "";
  }

  // 🔍 RECHERCHE EN TEMPS RÉEL
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();

    if (query.length < 2) {
      searchResults.classList.remove("active");
      searchResults.innerHTML = "";
      return;
    }

    // Filtrer les produits
    const results = productsData.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.collection.toLowerCase().includes(query) ||
        product.type.toLowerCase().includes(query)
    );

    displayResults(results);
  });

  // Afficher les résultats
  function displayResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML =
        '<div class="no-results">Aucun résultat trouvé</div>';
      searchResults.classList.add("active");
      return;
    }

    searchResults.innerHTML = results
      .slice(0, 10)
      .map(
        (product) => `
      <a href="${product.url}" class="search-result-item">
        <div class="search-result-title">${product.name}</div>
        <div class="search-result-excerpt">${product.collection} • ${product.type}</div>
      </a>
    `
      )
      .join("");

    searchResults.classList.add("active");
  }
});
