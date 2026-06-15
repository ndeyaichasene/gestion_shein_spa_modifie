import { footer } from '../../components/Footer.js';
import { carteProduit, attacherActionsProduits } from '../../components/ProductGrid.js';
import { API_BASE } from '../../config.js';

// Titres affichés selon la catégorie demandée dans l'URL (#/Catalogue/<categorie>)
const INFOS_CATEGORIES = {
    Nouveautes:  { titre: 'Nouveautés',   eyebrow: 'CATALOGUES', sousTitre: 'Découvrez les dernières arrivées de la collection TrendyWear.' },
    Collections: { titre: 'Collections',  eyebrow: 'CATALOGUES', sousTitre: 'Nos pièces signatures, pensées pour durer et se porter en toute saison.' },
    VenteFlash:  { titre: 'Vente Flash',  eyebrow: 'OFFRES',     sousTitre: "Profitez de réductions exceptionnelles, pour un temps limité seulement." },
    Femmes:      { titre: 'Femmes',       eyebrow: 'CATALOGUES', sousTitre: 'La sélection féminine TrendyWear : élégance et confort au quotidien.' },
    Hommes:      { titre: 'Hommes',       eyebrow: 'CATALOGUES', sousTitre: 'La sélection masculine TrendyWear : des pièces intemporelles, taillées pour durer.' }
};

const Catalogue = (params = {}) => {
    const categorie = params.categorie || 'Collections';
    const infos = INFOS_CATEGORIES[categorie] || INFOS_CATEGORIES.Collections;

    return `
        <section class="page-banner">
            <h1>${infos.titre}</h1>
            <p>${infos.sousTitre}</p>
        </section>

        <section class="catalogue">
            <div class="container">
                <div class="catalogue-header">
                    <div><div class="eyebrow">${infos.eyebrow}</div><h2 class="catalogue-title font-serif">${infos.titre}</h2></div>
                </div>
                <div class="products" id="products-liste" data-categorie="${categorie}">
                    <p>Chargement des produits...</p>
                </div>
            </div>
        </section>

        ${footer}
    `;
};

Catalogue.afterRender = async () => {
    const liste = document.getElementById('products-liste');
    const categorie = liste.dataset.categorie;

    try {
        const res = await fetch(`${API_BASE}/produits`);
        let produits = await res.json();

        // Filtrage selon la catégorie demandée
        if (categorie === 'Nouveautes') {
            produits = produits.filter(p => p.badge === 'NEW');
        } else if (categorie === 'VenteFlash') {
            produits = produits.filter(p => p.badge && p.badge.startsWith('-'));
        } else if (categorie === 'Femmes' || categorie === 'Hommes') {
            produits = produits.filter(p => p.categorie === categorie);
        }
        // 'Collections' (et toute valeur inconnue) -> tous les produits

        if (!produits.length) {
            liste.innerHTML = '<p style="text-align:center; padding:40px 0; color:#888;">Aucun produit dans cette catégorie pour le moment.</p>';
            return;
        }

        liste.innerHTML = produits.map(carteProduit).join('');
        await attacherActionsProduits(liste);

    } catch (err) {
        console.error(err);
        liste.innerHTML = '<p style="text-align:center; padding:40px 0; color:#888;">Impossible de charger les produits.</p>';
    }
};

export default Catalogue;