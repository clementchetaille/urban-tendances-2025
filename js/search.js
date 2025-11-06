document.addEventListener("DOMContentLoaded", function () {
  const searchIcon = document.querySelector(".search-icon");
  const searchOverlay = document.querySelector(".search-overlay");
  const searchClose = document.querySelector(".search-close");
  const searchInput = document.querySelector(".search-input");
  const searchResults = document.querySelector(".search-results");

  // Transformer les données JSON en tableau plat
  let productsData = [];

  // Déterminer le bon chemin pour le JSON selon la profondeur de la page
  function getDataPath() {
    const path = window.location.pathname;

    // Cas 1: /dist/produits/ ou /dist/collections/ avec sous-dossiers
    const matchSubfolder = path.match(/\/dist\/(produits|collections)\/(.*)/);
    if (matchSubfolder) {
      // Compter uniquement les dossiers (pas le fichier .html)
      const segments = matchSubfolder[2]
        .split("/")
        .filter((s) => s && !s.includes(".html"));
      const depth = segments.length;
      // +2 car on doit remonter de dist/produits/ ou dist/collections/
      return "../".repeat(depth + 2) + "src/data/data.json";
    }

    // Cas 2: /dist/xxx.html (comme projets.html, contact.html, etc.)
    if (path.includes("/dist/")) {
      return "../src/data/data.json";
    }

    // Cas 3: racine
    return "src/data/data.json";
  }

  const dataPath = getDataPath();

  // Charger et transformer les données
  fetch(dataPath)
    .then((response) => response.json())
    .then((data) => {
      productsData = transformData(data);
      console.log("Produits chargés:", productsData.length);
      console.log(
        "Exemple d'URLs:",
        productsData.slice(0, 3).map((p) => ({ name: p.name, url: p.url }))
      );
    })
    .catch((error) => console.error("Erreur chargement:", error));

  // Fonction pour transformer la structure JSON imbriquée
  function transformData(data) {
    const flatData = [];
    const path = window.location.pathname;

    Object.entries(data.collections).forEach(([collectionKey, collection]) => {
      Object.entries(collection.products).forEach(
        ([categoryKey, categoryData]) => {
          // Gérer les tableaux (comme assises, jardinieres, barrieres)
          if (Array.isArray(categoryData)) {
            categoryData.forEach((product, index) => {
              let relativePath;

              // Cas 1: pages produits individuelles (profondeur 2)
              // Ex: /dist/produits/potelets/thal-s.html
              if (path.match(/\/dist\/produits\/[^/]+\/[^/]+\.html/)) {
                relativePath = `../${categoryKey}/${collectionKey}${
                  categoryData.length > 1 ? "-" + (index + 1) : ""
                }.html`;
              }
              // Cas 2: pages catégories produits OU collections (profondeur 1)
              // Ex: /dist/produits/assises.html ou /dist/collections/silva.html
              else if (
                path.match(/\/dist\/(produits|collections)\/[^/]+\.html/)
              ) {
                relativePath = `../produits/${categoryKey}/${collectionKey}${
                  categoryData.length > 1 ? "-" + (index + 1) : ""
                }.html`;
              }
              // Cas 3: autres pages dans /dist/
              // Ex: /dist/projets.html
              else if (path.includes("/dist/")) {
                relativePath = `produits/${categoryKey}/${collectionKey}${
                  categoryData.length > 1 ? "-" + (index + 1) : ""
                }.html`;
              }
              // Cas 4: racine
              else {
                relativePath = `dist/produits/${categoryKey}/${collectionKey}${
                  categoryData.length > 1 ? "-" + (index + 1) : ""
                }.html`;
              }

              flatData.push({
                name: product.name,
                collection: collection.name,
                type: categoryKey,
                images: product.images,
                description: product.description,
                url: relativePath,
              });
            });
          }
          // Gérer les objets uniques (comme corbeilles, potelets)
          else if (typeof categoryData === "object") {
            let relativePath;

            // Cas 1: pages produits individuelles (profondeur 2)
            if (path.match(/\/dist\/produits\/[^/]+\/[^/]+\.html/)) {
              relativePath = `../${categoryKey}/${collectionKey}.html`;
            }
            // Cas 2: pages catégories produits OU collections (profondeur 1)
            else if (
              path.match(/\/dist\/(produits|collections)\/[^/]+\.html/)
            ) {
              relativePath = `../produits/${categoryKey}/${collectionKey}.html`;
            }
            // Cas 3: autres pages dans /dist/
            else if (path.includes("/dist/")) {
              relativePath = `produits/${categoryKey}/${collectionKey}.html`;
            }
            // Cas 4: racine
            else {
              relativePath = `dist/produits/${categoryKey}/${collectionKey}.html`;
            }

            flatData.push({
              name: categoryData.name,
              collection: collection.name,
              type: categoryKey,
              images: categoryData.images,
              description: categoryData.description,
              url: relativePath,
            });
          }
        }
      );
    });

    return flatData;
  }

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
  if (searchOverlay) {
    searchOverlay.addEventListener("click", (e) => {
      if (e.target === searchOverlay) {
        closeSearch();
      }
    });
  }

  // Fonction pour fermer la recherche
  function closeSearch() {
    searchOverlay.classList.remove("active");
    searchInput.value = "";
    searchResults.classList.remove("active");
    searchResults.innerHTML = "";
  }

  // 🔍 RECHERCHE EN TEMPS RÉEL
  if (searchInput) {
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
  }

  // Afficher les résultats
  function displayResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML =
        '<div class="no-results">Aucun résultat trouvé</div>';
      searchResults.classList.add("active");
      return;
    }

    const path = window.location.pathname;

    searchResults.innerHTML = results
      .slice(0, 10)
      .map((product) => {
        // Récupérer la première image
        const firstImage = Array.isArray(product.images)
          ? product.images[0]
          : product.images;

        // Ajuster le chemin de l'image selon la page actuelle
        let imagePath;

        // Cas 1: pages produits individuelles (profondeur 2)
        // Ex: /dist/produits/potelets/thal-s.html
        if (path.match(/\/dist\/produits\/[^/]+\/[^/]+\.html/)) {
          imagePath = `../../../${firstImage}`;
        }
        // Cas 2: pages catégories produits OU collections (profondeur 1)
        // Ex: /dist/produits/assises.html ou /dist/collections/silva.html
        else if (path.match(/\/dist\/(produits|collections)\/[^/]+\.html/)) {
          imagePath = `../../${firstImage}`;
        }
        // Cas 3: autres pages dans /dist/
        // Ex: /dist/projets.html
        else if (path.includes("/dist/")) {
          imagePath = `../${firstImage}`;
        }
        // Cas 4: racine
        else {
          imagePath = firstImage;
        }

        return `
          <a href="${product.url}" class="search-result-item">
            <img src="${imagePath}" alt="${product.name}" class="search-result-thumbnail">
            <div class="search-result-content">
              <div class="search-result-title">${product.name}</div>
              <div class="search-result-collection">${product.collection}</div>
            </div>
          </a>
        `;
      })
      .join("");
    searchResults.classList.add("active");
  }
});
