// footer.js
document.addEventListener("DOMContentLoaded", function () {
  const footerHTML = `
       <footer class="footer">
  <div class="footer-content">
    <!-- Section principale -->
    <div class="footer-main">
      <div class="footer-brand">
        <img src="/assets/logos/logo-ut-2.png" alt="Urban Tendances" />
        <p>Design et fabrication de mobilier urbain d'exception.</p>
      </div>
      
      <div class="footer-grid">
        <div class="footer-column">
          <h3>Découvrir</h3>
          <ul>
            <li><a href="/index.html">Accueil</a></li>
            <li><a href="/dist/projets.html">Nos projets</a></li>
            <li><a href="/sur-mesure.html">Sur mesure</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h3>À propos</h3>
          <ul>
            <li><a href="/histoire.html">Notre histoire</a></li>
            <li><a href="/contact.html">Contact</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h3>Contact</h3>
          <ul class="footer-contact">
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <a href="mailto:contact@urbantendances.fr">contact@urbantendances.fr</a>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>01 23 45 67 89</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Barre du bas -->
    <div class="footer-bottom">
      <p>&copy; 2025 Urban Tendances. Tous droits réservés. Réalisé par HeyClem</p>
      <div class="footer-legal">
        <a href="#">Mentions légales</a>
        <a href="#">Confidentialité</a>
      </div>
    </div>
  </div>
</footer>
    `;

  document.getElementById("footer-container").innerHTML = footerHTML;
});
