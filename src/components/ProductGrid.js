import { ajouterAuPanier, basculerFavori, listerFavoris } from '../cart.js';
import { navigate } from '../router.js';

// Construit le HTML d'une carte produit (utilisé par Intro et Catalogue)
export function carteProduit(p) {
    const media = p.image
        ? `<img src="${p.image}" alt="${p.nom}">`
        : `<div class="product-img-placeholder"><i class="fa ${p.icone || 'fa-shirt'}"></i></div>`;

    const badge = p.badge
        ? `<span class="product-badge ${p.badge.startsWith('-') ? 'sale' : ''}">${p.badge}</span>`
        : '';

    const prix = p.ancienPrix
        ? `${Number(p.prix).toFixed(2)}€ <span class="old">${Number(p.ancienPrix).toFixed(2)}€</span>`
        : `${Number(p.prix).toFixed(2)}€`;

    return `
        <article class="product" data-id="${p.id}">
            <div class="product-media">
                ${media}
                ${badge}
            </div>
            <div class="product-info">
                <h3 class="product-title">${p.nom.toUpperCase()}</h3>
                <p class="product-desc">${p.description || ''}</p>
                <div class="product-price">${prix}</div>
                <div class="product-actions">
                    <button class="btn-panier" data-id="${p.id}" title="Ajouter au panier">
                        <i class="fa fa-cart-plus"></i> Panier
                    </button>
                    <button class="btn-favori" data-id="${p.id}" title="Ajouter aux favoris">
                        <i class="fa fa-heart"></i>
                    </button>
                </div>
            </div>
        </article>
    `;
}

// Attache les écouteurs (panier, favoris, clic -> page détail) sur un conteneur
// déjà rempli avec des cartes produit (via carteProduit).
// options.onFavoriToggle(produitId, estFavori, btn) est appelé après la bascule favori
// (utile par exemple sur la page Favoris pour retirer la carte de l'affichage).
export async function attacherActionsProduits(container, options = {}) {
    // Marquer les produits déjà en favoris (cœur rouge)
    try {
        const favoris = await listerFavoris();
        const idsFavoris = favoris.map(f => f.produitId);

        container.querySelectorAll('.btn-favori').forEach(btn => {
            const id = Number(btn.dataset.id);
            if (idsFavoris.includes(id)) {
                btn.classList.add('active');
            }
        });
    } catch (err) {
        console.error('Impossible de charger les favoris :', err);
    }

    // Bouton "Ajouter au panier"
    container.querySelectorAll('.btn-panier').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = Number(btn.dataset.id);
            try {
                await ajouterAuPanier(id);
                alert('Produit ajouté au panier !');
            } catch (err) {
                console.error(err);
                alert("Impossible d'ajouter au panier (le serveur est-il lancé (node server.js, port 10000) ?)");
            }
        });
    });

    // Bouton "Favoris" (cœur)
    container.querySelectorAll('.btn-favori').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = Number(btn.dataset.id);
            try {
                const estFavori = await basculerFavori(id);
                btn.classList.toggle('active', estFavori);
                options.onFavoriToggle?.(id, estFavori, btn);
            } catch (err) {
                console.error(err);
                alert('Impossible de mettre à jour les favoris (le serveur est-il lancé (node server.js, port 10000) ?)');
            }
        });
    });

    // Clic sur la carte (hors boutons) -> page détail produit
    container.querySelectorAll('.product').forEach(article => {
        article.style.cursor = 'pointer';
        article.addEventListener('click', () => {
            navigate(`/Produit/${article.dataset.id}`);
        });
    });
}