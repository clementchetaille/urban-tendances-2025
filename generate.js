const fs = require("fs");
const path = require("path");

// 🎯 Variable d'environnement pour gérer les chemins
// En local: BASE_PATH = ''
// En production (GitHub Pages): BASE_PATH = '/urban-tendances-2025'
const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/urban-tendances-2025" : "";

console.log(`🔧 Mode: ${process.env.NODE_ENV || "development"}`);
console.log(`📁 Base path: "${BASE_PATH}"\n`);

// Charger les templates
const cardTemplate = fs.readFileSync(
  "src/templates/card-template.html",
  "utf8"
);
const productTemplate = fs.readFileSync(
  "src/templates/product-template.html",
  "utf8"
);
const typeTemplate = fs.readFileSync(
  "src/templates/type-template.html",
  "utf8"
);
const collectionTemplate = fs.readFileSync(
  "src/templates/collection-template.html",
  "utf8"
);

// Charger les données JSON
const data = JSON.parse(fs.readFileSync("src/data/data.json", "utf8"));

// Créer les dossiers de sortie
const distDir = "dist";
const productsDir = path.join(distDir, "produits");
const collectionsDir = path.join(distDir, "collections");

fs.mkdirSync(productsDir, { recursive: true });
fs.mkdirSync(collectionsDir, { recursive: true });

// Helper pour les images
function renderImages(images) {
  // Utilise BASE_PATH pour préfixer les chemins
  return images
    .map((img) => {
      const cleanPath = img.replace(/^(\.\.\/)+/, "");
      return `<img src="${BASE_PATH}/${cleanPath}" alt="">`;
    })
    .join("\n");
}

// Helper pour les matériaux
function renderMaterials(materials) {
  return materials
    .map((m) => {
      let icon = "";
      const materialLower = m.toLowerCase();

      // Déterminer l'icône selon le matériau
      if (
        materialLower.includes("acier") ||
        materialLower.includes("inox") ||
        materialLower.includes("corten")
      ) {
        icon = `<img src="${BASE_PATH}/assets/icons/acier-texture2.jpg" alt="acier" class="material-icon">`;
      } else if (materialLower.includes("bois")) {
        icon = `<img src="${BASE_PATH}/assets/icons/wood-texture.png" alt="bois" class="material-icon">`;
      }

      return `<li>${icon}${m}</li>`;
    })
    .join("\n");
}

// Helper pour les finitions
function renderFinitions(finitions) {
  if (!finitions || finitions.length === 0) return "<li>Non spécifié</li>";
  return finitions.map((f) => `<li>${f}</li>`).join("\n");
}

// Helper pour les dimensions
function renderDimensions(dimensions) {
  if (!dimensions) return "<li>Non spécifié</li>";

  if (typeof dimensions === "string") {
    if (dimensions.trim() === "") return "<li>Non spécifié</li>";
    return `<li>${dimensions}</li>`;
  }

  if (Array.isArray(dimensions)) {
    if (dimensions.length === 0) return "<li>Non spécifié</li>";
    return dimensions.map((d) => `<li>${d}</li>`).join("\n");
  }

  return "<li>Non spécifié</li>";
}

// Helper pour générer les liens des collections
function generateCollectionLinks(
  currentCollectionSlug,
  type,
  currentIndex = 0
) {
  return Object.entries(data.collections)
    .map(([slug, collection]) => {
      const productInType = collection.products[type];
      if (!productInType) return "";
      const products = Array.isArray(productInType)
        ? productInType
        : [productInType];
      const fileName = products.length > 1 ? `${slug}-1.html` : `${slug}.html`;
      const isActive = slug === currentCollectionSlug;
      const activeClass = isActive ? 'class="active"' : "";

      return `
        <a href="${fileName}" ${activeClass}>
          <span>${collection.name}</span>
        </a>
      `;
    })
    .filter((link) => link !== "")
    .join("\n");
}

// 🧩 Étape 1 : Générer les pages produits individuelles
for (const [collectionSlug, collection] of Object.entries(data.collections)) {
  for (const [type, productsArray] of Object.entries(collection.products)) {
    const products = Array.isArray(productsArray)
      ? productsArray
      : [productsArray];

    for (const [index, product] of products.entries()) {
      const pageTitle =
        product.pageTitle || type.charAt(0).toUpperCase() + type.slice(1);

      const productHTML = productTemplate
        .replace(/{{basePath}}/g, BASE_PATH)
        .replace(/{{type}}/g, type)
        .replace(/{{pageTitle}}/g, pageTitle)
        .replace(/{{collectionName}}/g, collection.name)
        .replace(/{{symbole}}/g, collection.symbole || "")
        .replace(
          /{{collectionLinks}}/g,
          generateCollectionLinks(collectionSlug, type, index)
        )
        .replace(/{{description}}/g, product.description)
        .replace(/{{images}}/g, renderImages(product.images))
        .replace(/{{materials}}/g, renderMaterials(product.materials))
        .replace(/{{finitions}}/g, renderFinitions(product.finitions))
        .replace(/{{dimensions}}/g, renderDimensions(product.dimensions));

      const productFolder = path.join(productsDir, type);
      fs.mkdirSync(productFolder, { recursive: true });

      const fileName =
        products.length > 1
          ? `${collectionSlug}-${index + 1}.html`
          : `${collectionSlug}.html`;
      const productPath = path.join(productFolder, fileName);

      fs.writeFileSync(productPath, productHTML);
      console.log(
        `✅ Produit généré : ${pageTitle} – ${collection.name} (${fileName})`
      );
    }
  }
}

// 🧱 Étape 2 : Générer les pages types (ex : banc.html)
const typesMap = {};

for (const [collectionSlug, collection] of Object.entries(data.collections)) {
  for (const [type, productsArray] of Object.entries(collection.products)) {
    const products = Array.isArray(productsArray)
      ? productsArray
      : [productsArray];

    for (const [index, product] of products.entries()) {
      if (!typesMap[type]) typesMap[type] = [];

      const fileName =
        products.length > 1
          ? `${collectionSlug}-${index + 1}.html`
          : `${collectionSlug}.html`;

      const cleanImagePath = product.images[0].replace(/^(\.\.\/)+/, "");
      const cleanSymbolPath = collection.symbole
        ? collection.symbole.replace(/^(\.\.\/)+/, "")
        : "";

      typesMap[type].push({
        collectionName: collection.name,
        symbole: cleanSymbolPath ? `${BASE_PATH}/${cleanSymbolPath}` : "",
        productName:
          product.name ||
          `${type.charAt(0).toUpperCase() + type.slice(1)} ${collection.name}`,
        imageUrl: `${BASE_PATH}/${cleanImagePath}`,
        productUrl: `${type}/${fileName}`,
        pageTitle: product.pageTitle || null,
        type,
      });
    }
  }
}

// Génération des pages types avec les symboles
for (const [type, products] of Object.entries(typesMap)) {
  const cardsHTML = products
    .map((p) =>
      cardTemplate
        .replace(/{{collectionName}}/g, p.collectionName)
        .replace(/{{symbole}}/g, p.symbole)
        .replace(/{{productName}}/g, p.productName)
        .replace(/{{imageUrl}}/g, p.imageUrl)
        .replace(/{{productUrl}}/g, p.productUrl)
        .replace(/{{type}}/g, type)
    )
    .join("\n");

  const firstProduct = products[0];
  const pageTitle =
    firstProduct.pageTitle || type.charAt(0).toUpperCase() + type.slice(1);

  const typeHTML = typeTemplate
    .replace(/{{basePath}}/g, BASE_PATH)
    .replace(/{{pageTitle}}/g, pageTitle)
    .replace(/{{productList}}/g, cardsHTML);

  const typePath = path.join(productsDir, `${type}.html`);
  fs.writeFileSync(typePath, typeHTML);
  console.log(`📁 Page type générée : ${type}`);
}

// 🏷️ Étape 3 : Générer les pages collections
for (const [collectionSlug, collection] of Object.entries(data.collections)) {
  const listHTML = Object.entries(collection.products)
    .map(([type, productsArray]) => {
      const products = Array.isArray(productsArray)
        ? productsArray
        : [productsArray];
      return products
        .map((product, index) => {
          const firstImage =
            product.images?.[0] || "assets/images/placeholder.jpg";
          const cleanImagePath = firstImage.replace(/^(\.\.\/)+/, "");
          const imagePath = `${BASE_PATH}/${cleanImagePath}`;
          const fileName =
            products.length > 1
              ? `${collectionSlug}-${index + 1}.html`
              : `${collectionSlug}.html`;

          return `
            <div class="product-card">
              <a href="${BASE_PATH}/dist/produits/${type}/${fileName}">
                <div class="card-image" style="background-image: url('${imagePath}')"></div>
                <div class="card-content">
                  <h3 class="product-title">${
                    type.charAt(0).toUpperCase() + type.slice(1)
                  }</h3>
                  <p class="product-collection">${collection.name}</p>
                </div>
              </a>
            </div>
          `;
        })
        .join("\n");
    })
    .join("\n");

  // 🧩 AJOUT : générer les autres collections aléatoirement
  const otherCollections = Object.entries(data.collections)
    .filter(([slug]) => slug !== collectionSlug)
    .sort(() => 0.5 - Math.random()) // mélange aléatoire
    .slice(0, 5) // 5 collections
    .map(([slug, other]) => {
      const otherSymbol = other.symbole
        ? `${BASE_PATH}/${other.symbole.replace(/^(\.\.\/)+/, "")}`
        : "assets/images/placeholder.jpg";

      return `
      <div class="other-collection-card symbol-only">
        <a href="${BASE_PATH}/dist/collections/${slug}.html">
          <div class="symbol-container">
            <img src="${otherSymbol}" alt="${other.name}" class="symbol-image" />
          </div>
          <h3>${other.name}</h3>
        </a>
      </div>
    `;
    })
    .join("\n");

  const cleanSymbolPath = collection.symbole
    ? collection.symbole.replace(/^(\.\.\/)+/, "")
    : "";

  const collectionHTML = collectionTemplate
    .replace(/{{basePath}}/g, BASE_PATH)
    .replace(/{{collectionName}}/g, collection.name)
    .replace(
      /{{symbole}}/g,
      cleanSymbolPath ? `${BASE_PATH}/${cleanSymbolPath}` : ""
    )
    .replace(/{{collectionDescription}}/g, collection.description)
    .replace(/{{productList}}/g, listHTML)
    // 🔥 Ajout du bloc "autres collections"
    .replace(/{{otherCollections}}/g, otherCollections);

  const collectionPath = path.join(collectionsDir, `${collectionSlug}.html`);
  fs.writeFileSync(collectionPath, collectionHTML);
  console.log(`🏷️ Page collection générée : ${collection.name}`);
}

console.log("\n✨ Génération terminée !");
console.log(`📦 Mode: ${process.env.NODE_ENV || "development"}`);
console.log(`🌐 Base path: "${BASE_PATH}"`);

// PAGE PROJETS //
// Charger le template des projets
const projectTemplate = fs.readFileSync(
  "src/templates/project-template.html",
  "utf8"
);
const projectsListTemplate = fs.readFileSync(
  "src/templates/projects-list-template.html",
  "utf8"
);

// 🏗️ Étape 4 : Générer les pages projets individuelles
// 🏗️ Étape 4 : Générer les pages projets individuelles
// 🏗️ Étape 4 : Générer les pages projets individuelles
// 🏗️ Étape 4 : Générer les pages projets individuelles
const projectsDir = path.join(distDir, "projets");
fs.mkdirSync(projectsDir, { recursive: true });

for (const [projectSlug, project] of Object.entries(data.projects || {})) {
  // Générer les images
  const imagesHTML = project.images
    .map((img) => {
      const cleanPath = img.replace(/^(\.\.\/)+/, "");
      const imgPath = `${BASE_PATH}/${cleanPath}`;
      return `<img src="${imgPath}" alt="${project.name}">`;
    })
    .join("\n");

  const imagesSection = `<div class="project-images">${imagesHTML}</div>`;

  // Générer les produits utilisés
  const productsHTML = project.products
    .map((product) => {
      const collection = data.collections[product.collection];
      if (!collection) return "";

      // ✅ Déclarer cleanSymbolPath ici, dans le scope du .map()
      const cleanSymbolPath = collection.symbole
        ? collection.symbole.replace(/^(\.\.\/)+/, "")
        : "";
      const symbolePath = cleanSymbolPath
        ? `${BASE_PATH}/${cleanSymbolPath}`
        : "";

      return `
        <div class="product-used">
          ${
            symbolePath
              ? `<img src="${symbolePath}" alt="${collection.name}">`
              : ""
          }
          <h3>${product.name}</h3>
          <p class="collection-name">${collection.name}</p>
        </div>
      `;
    })
    .join("\n");

  // Remplir le template
  const assetsBasePath = BASE_PATH ? BASE_PATH : "../.."; // Pour assets
  const navBasePath = BASE_PATH ? BASE_PATH : "../.."; // ✅ Changé : pour fichiers racine
  const distNavBasePath = BASE_PATH ? `${BASE_PATH}/dist` : ".."; // Pour fichiers dans dist/

  const projectHTML = projectTemplate
    .replace(/{{basePath}}/g, BASE_PATH)
    .replace(/{{assetsBasePath}}/g, assetsBasePath)
    .replace(/{{navBasePath}}/g, navBasePath) // Pour index.html, sur-mesure.html
    .replace(/{{distNavBasePath}}/g, distNavBasePath) // Pour projets.html, collections.html
    .replace(/{{name}}/g, project.name)
    .replace(/{{city}}/g, project.city)
    .replace(/{{year}}/g, project.year)
    .replace(/{{images}}/g, imagesSection)
    .replace(/{{products}}/g, productsHTML);

  const projectPath = path.join(projectsDir, `${projectSlug}.html`);
  fs.writeFileSync(projectPath, projectHTML);
  console.log(`🏗️ Projet généré : ${project.name}`);
}
// ETAPE OTHER COLLECTIONS :

// 🏗️ Étape 5 : Générer la page liste des projets
const projectsListHTML = Object.entries(data.projects || {})
  .map(([slug, project]) => {
    const firstImage = project.images[0] || "assets/images/placeholder.jpg";
    const cleanPath = firstImage.replace(/^(\.\.\/)+/, "");
    const imagePath = `${BASE_PATH}/${cleanPath}`;
    return `
      <a href="projets/${slug}.html" class="project-card">
        <img src="${imagePath}" alt="${project.name}" class="project-card-image">
        <div class="project-card-content">
          <h2>${project.name}</h2>
          <div class="project-card-meta">
          </div>
        </div>
      </a>
    `;
  })
  .join("\n");

const navBasePath = BASE_PATH ? `${BASE_PATH}/dist` : "..";
const assetsBasePathList = ".."; // 👈 Pour projets.html

const projectsListPageHTML = projectsListTemplate
  .replace(/{{basePath}}/g, BASE_PATH)
  .replace(/{{navBasePath}}/g, navBasePath)
  .replace(/{{assetsBasePath}}/g, assetsBasePathList) // 👈 Utilise la bonne variable
  .replace(/{{projectsList}}/g, projectsListHTML);

const projectsListPath = path.join(distDir, "projets.html");
fs.writeFileSync(projectsListPath, projectsListPageHTML);
console.log("📋 Page liste des projets générée");

// RECHERCHE SITE //
// 🔍 Générer le fichier de recherche
const searchData = [];

for (const [collectionSlug, collection] of Object.entries(data.collections)) {
  for (const [type, productsArray] of Object.entries(collection.products)) {
    const products = Array.isArray(productsArray)
      ? productsArray
      : [productsArray];

    products.forEach((product, index) => {
      const fileName =
        products.length > 1
          ? `${collectionSlug}-${index + 1}.html`
          : `${collectionSlug}.html`;

      searchData.push({
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${
          collection.name
        }`,
        collection: collection.name,
        type: type,
        url: `${BASE_PATH}/dist/produits/${type}/${fileName}`,
      });
    });
  }
}

fs.writeFileSync(
  "js/search-data.js",
  `const productsData = ${JSON.stringify(searchData, null, 2)};`
);
console.log("🔍 Fichier de recherche généré");
