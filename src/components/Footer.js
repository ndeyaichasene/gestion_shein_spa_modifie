export const footer = `
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <h3>TRENDYWEAR</h3>
                    <p>Votre destination mode pour une garde-robe sophistiquée et accessible.</p>
                    <div class="socials">
                        <a href="#" aria-label="Instagram">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
                        </a>
                        <a href="#" aria-label="Facebook">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        </a>
                        <a href="#" aria-label="Pinterest">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.5 8.5c1.5-1 4-1.5 5.5.5 1 1.5.5 4-1.5 5-1 .5-1.5 0-1.5 0s.5-2-.5-3-3 1-2 4"/></svg>
                        </a>
                    </div>
                </div>

                <div class="footer-col">
                    <h4>SERVICE CLIENT</h4>
                    <ul>
                        <li><a href="#">Livraison</a></li>
                        <li><a href="#">Retours & Échanges</a></li>
                        <li><a href="#">Guide des Tailles</a></li>
                        <li><a href="#">Contactez-nous</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h4>À PROPOS</h4>
                    <ul>
                        <li><a href="#">Notre Histoire</a></li>
                        <li><a href="#">Engagement Durable</a></li>
                        <li><a href="#">Carrières</a></li>
                        <li><a href="#">Presse</a></li>
                    </ul>
                </div>

                <div class="footer-col newsletter">
                    <h4>NEWSLETTER</h4>
                    <p>Inscrivez-vous pour recevoir nos offres exclusives</p>
                    <form class="newsletter-form" onsubmit="event.preventDefault(); alert('Merci pour votre inscription !')">
                        <input type="email" placeholder="Votre email" required>
                        <button type="submit">OK</button>
                    </form>
                </div>
            </div>

            <div class="footer-bottom">
                <p>© 2025 TRENDYWEAR. Tous droits réservés.</p>
                <div class="links">
                    <a href="#">Confidentialité</a>
                    <a href="#">CGV</a>
                    <a href="#">Cookies</a>
                </div>
            </div>
        </div>
    </footer>
`;