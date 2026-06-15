import { footer } from '../../components/Footer.js';
import { carteProduit, attacherActionsProduits } from '../../components/ProductGrid.js';
import { listerFavoris } from '../../cart.js';
import { API_BASE } from '../../config.js';

const Favoris = () => `
    <section class="page-banner">
        <h1>Mes Favoris</h1>
        <p>Retrouvez ici les articles que vous avez ajoutés à vos favoris.</p>
    </section>

    <section class="catalogue">
        <div class="container">
            <div class="products" id="favoris-liste">
                <p>Chargement de vos favoris...</p>
            </div>
        </div>
    </section>

    ${footer}
`;

Favoris.afterRender = async () => {
    const liste = document.getElementById('favoris-liste');

    try {
        const favoris = await listerFavoris();

        if (!favoris.length) {
            liste.innerHTML = `
                <p style="text-align:center; color:#888; padding:40px 0; grid-column: 1 / -1;">
                    Vous n'avez pas encore d'article en favoris. Parcourez nos collections et cliquez sur
                    <i class="fa fa-heart"></i> pour les retrouver ici.
                </p>
            `;
            return;
        }

        // Récupère les détails de chaque produit favori
        const produits = await Promise.all(
            favoris.map(f =>
                fetch(`${API_BASE}/produits/${f.produitId}`)
                    .then(res => res.ok ? res.json() : null)
            )
        );

        const produitsValides = produits.filter(Boolean);

        if (!produitsValides.length) {
            liste.innerHTML = `
                <p style="text-align:center; color:#888; padding:40px 0; grid-column: 1 / -1;">
                    Vous n'avez pas encore d'article en favoris. Parcourez nos collections et cliquez sur
                    <i class="fa fa-heart"></i> pour les retrouver ici.
                </p>
            `;
            return;
        }

        liste.innerHTML = produitsValides.map(carteProduit).join('');
        await attacherActionsProduits(liste, {
            onFavoriToggle: (produitId, estFavori, btn) => {
                if (!estFavori) {
                    btn.closest('.product')?.remove();
                    if (!liste.querySelector('.product')) {
                        liste.innerHTML = `
                            <p style="text-align:center; color:#888; padding:40px 0; grid-column: 1 / -1;">
                                Vous n'avez pas encore d'article en favoris. Parcourez nos collections et cliquez sur
                                <i class="fa fa-heart"></i> pour les retrouver ici.
                            </p>
                        `;
                    }
                }
            }
        });

        // Sur cette page, les cœurs affichés doivent être actifs par défaut
        liste.querySelectorAll('.btn-favori').forEach(btn => btn.classList.add('active'));

    } catch (err) {
        console.error(err);
        liste.innerHTML = `
            <p style="text-align:center; color:#888; padding:40px 0; grid-column: 1 / -1;">
                Impossible de charger vos favoris (le serveur est-il lancé (node server.js, port 10000) ?).
            </p>
        `;
    }
};

export default Favoris;