import { navigate } from '../../router.js';
const UserDashboard = () => `
   <!-- SECTION USER -->
        <section id="userDashboard">

            <h1 class="admin-title">Bienvenue sur TrendyWear</h1>
            <p class="admin-subtitle">
                Découvrez vos collections et gérez votre espace personnel.
            </p>

            <!-- Cartes -->
            <div class="stats-grid">

                <div class="stat-card pink-bg">
                    <div class="stat-label">Mes commandes</div>
                    <div class="stat-value">05</div>
                    <div class="stat-trend">
                        <i class="fa fa-bag-shopping"></i>
                        Commandes passées
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-label">Favoris</div>
                    <div class="stat-value">12</div>
                    <div class="stat-badge">
                        <i class="fa fa-heart"></i>
                    </div>
                </div>

                <div class="stat-card gray-bg">
                    <div class="stat-label">Panier</div>
                    <div class="stat-value red">03</div>
                    <i class="fa fa-cart-shopping stat-icon"></i>
                </div>

            </div>

            <!-- Mes produits -->
            <div class="table-wrapper">

                <div class="table-header">
                    <span>Image</span>
                    <span>Produit</span>
                    <span>Prix</span>
                    <span>Statut</span>
                    <span>Action</span>
                </div>

                <div class="table-row">
                    <div class="product-img-placeholder">
                        <img src="publics/images/sombre.jpg" alt="manteau" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                    </div>

                    <div>
                        <div class="product-name">
                            Manteau Élégance Rose
                        </div>
                        <div class="product-id">
                            Commande #TW001
                        </div>
                    </div>

                    <div class="product-price">
                        €189.00
                    </div>

                    <div>
                        <span class="stock-badge stock-ok">
                            Livré
                        </span>
                    </div>

                    <div class="action-btns">
                        <button class="btn-edit">
                            <i class="fa fa-eye"></i>
                        </button>
                    </div>
                </div>

                <div class="table-row">
                    <div class="product-img-placeholder">
                        <img src="publics/images/prada.jpg" alt="manteau" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                    </div>

                    <div>
                        <div class="product-name">
                            Robe Élégante
                        </div>
                        <div class="product-id">
                            Commande #TW002
                        </div>
                    </div>

                    <div class="product-price">
                        €129.00
                    </div>

                    <div>
                        <span class="stock-badge stock-low">
                            En préparation
                        </span>
                    </div>

                    <div class="action-btns">
                        <button class="btn-edit">
                            <i class="fa fa-eye"></i>
                        </button>
                    </div>
                </div>

            </div>

            <div style="margin:20px;">
                <button class="login-cha button" style="width: 150px; height: 42px; background-color: #c4f8cc; border: none; border-radius: 10px; cursor: pointer;" onclick="logout()">
                    Déconnexion
                </button>
            </div>

        </section>
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
UserDashboard.afterRender = () => {
    const viewButtons = document.querySelectorAll('.btn-edit');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Détails de la commande à implémenter');
        });
    });
};

export default UserDashboard;