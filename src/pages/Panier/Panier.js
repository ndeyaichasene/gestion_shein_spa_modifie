import { footer } from '../../components/Footer.js';
import { listerPanier, retirerDuPanier, modifierQuantitePanier, viderPanier, validerCommande } from '../../cart.js';
import { API_BASE } from '../../config.js';
import { navigate } from '../../router.js';

const Panier = () => `
    <section class="panier-header">
        <h1>Votre Panier</h1>
    </section>

    <section class="panier-page">
        <div id="panier-contenu">
            <p class="panier-vide">Chargement de votre panier...</p>
        </div>
    </section>

    ${footer}
`;

Panier.afterRender = async () => {
    const contenu = document.getElementById('panier-contenu');

    try {
        const items = await listerPanier();

        if (!items.length) {
            contenu.innerHTML = `
                <p class="panier-vide">
                    Votre panier est vide. Parcourez nos collections et ajoutez des articles pour les retrouver ici.
                </p>
            `;
            return;
        }

        // Récupère les détails de chaque produit en parallèle
        const produits = await Promise.all(
            items.map(item =>
                fetch(`${API_BASE}/produits/${item.produitId}`)
                    .then(res => res.ok ? res.json() : null)
            )
        );

        let sousTotal = 0;

        const lignes = items.map((item, i) => {
            const p = produits[i];
            if (!p) return '';

            const sousTotalLigne = Number(p.prix) * item.quantite;
            sousTotal += sousTotalLigne;

            const media = p.image
                ? `<img src="${p.image}" alt="${p.nom}">`
                : `<div class="product-img-placeholder"><i class="fa ${p.icone || 'fa-shirt'}"></i></div>`;

            const variante = `${item.couleur || 'Couleur unique'} • Taille ${item.taille || 'Unique'}`;

            return `
                <div class="panier-item">
                    <div class="panier-item-image">${media}</div>
                    <div class="panier-item-body">
                        <div>
                            <div class="panier-item-titre">${p.nom}</div>
                            <div class="panier-item-variante">${variante}</div>
                        </div>
                        <div class="panier-item-footer">
                            <div class="qte-stepper">
                                <button class="qte-moins" data-item-id="${item.id}" data-qte="${item.quantite - 1}">-</button>
                                <span>${item.quantite}</span>
                                <button class="qte-plus" data-item-id="${item.id}" data-qte="${item.quantite + 1}">+</button>
                            </div>
                            <div class="panier-item-prix">${sousTotalLigne.toFixed(2)} €</div>
                        </div>
                    </div>
                    <button class="panier-item-trash" data-item-id="${item.id}" title="Retirer">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            `;
        }).join('');

        // TVA déjà incluse dans les prix (taux 20%)
        const tva = sousTotal - (sousTotal / 1.2);
        const total = sousTotal;

        contenu.innerHTML = `
            <div class="panier-grid">
                <div class="panier-items">${lignes}</div>

                <div class="panier-resume">
                    <div class="resume-titre">Résumé</div>

                    <div class="resume-ligne">
                        <span>Sous-total</span>
                        <span>${sousTotal.toFixed(2)} €</span>
                    </div>
                    <div class="resume-ligne">
                        <span>Livraison</span>
                        <span>Offerte</span>
                    </div>
                    <div class="resume-ligne">
                        <span>TVA incluse</span>
                        <span>${tva.toFixed(2)} €</span>
                    </div>

                    <div class="resume-total">
                        <span>Total</span>
                        <span>${total.toFixed(2)} €</span>
                    </div>

                    <button class="btn-caisse" id="btnCaisse">Passer à la caisse</button>

                    <div class="resume-infos">
                        <div><i class="fa fa-truck"></i> Livraison Express 24-48h</div>
                        <div><i class="fa fa-shield"></i> Paiement 100% Sécurisé</div>
                        <div><i class="fa fa-rotate"></i> Retours gratuits sous 30 jours</div>
                    </div>

                    <div class="code-promo">
                        <label>Code promo</label>
                        <div class="code-promo-row">
                            <input type="text" id="codePromo" placeholder="Entrez votre code">
                            <button id="btnAppliquerCode">Appliquer</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Boutons -/+ : modifient la quantité puis rafraîchissent la page
        contenu.querySelectorAll('.qte-moins, .qte-plus').forEach(btn => {
            btn.addEventListener('click', async () => {
                await modifierQuantitePanier(btn.dataset.itemId, Number(btn.dataset.qte));
                Panier.afterRender();
            });
        });

        // Bouton supprimer
        contenu.querySelectorAll('.panier-item-trash').forEach(btn => {
            btn.addEventListener('click', async () => {
                await retirerDuPanier(btn.dataset.itemId);
                Panier.afterRender();
            });
        });

        // Passer à la caisse : ouvre une modale de confirmation, crée la commande puis vide le panier
        document.getElementById('btnCaisse')?.addEventListener('click', () => {
            ouvrirModaleCommande({ items, produits, total });
        });

        // Code promo (à implémenter)
        document.getElementById('btnAppliquerCode')?.addEventListener('click', () => {
            const code = document.getElementById('codePromo').value.trim();
            if (!code) {
                alert('Veuillez entrer un code promo.');
                return;
            }
            alert("Ce code promo n'est pas valide.");
        });

    } catch (err) {
        console.error(err);
        contenu.innerHTML = `
            <p class="panier-vide">
                Impossible de charger le panier (le serveur est-il lancé (node server.js, port 10000) ?).
            </p>
        `;
    }
};

// Construit et affiche la modale de validation de commande (récap, adresse, paiement)
function ouvrirModaleCommande({ items, produits, total }) {
    // Empêche d'avoir plusieurs modales ouvertes en même temps
    document.getElementById('modaleCommande')?.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modaleCommande';

    overlay.innerHTML = `
        <div class="modal-box">
            <button class="modal-close" id="modalCommandeFermer" aria-label="Fermer">&times;</button>
            <div id="modalCommandeContenu">
                <h2 class="modal-titre">Récapitulatif de la commande</h2>

                <div class="modal-recap">
                    ${items.map((item, i) => {
                        const p = produits[i];
                        if (!p) return '';
                        const lignePrix = (Number(p.prix) * item.quantite).toFixed(2);
                        return `
                            <div class="modal-recap-ligne">
                                <span>${item.quantite} × ${p.nom}</span>
                                <span>${lignePrix} €</span>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="resume-total modal-total">
                    <span>Total</span>
                    <span>${total.toFixed(2)} €</span>
                </div>

                <div class="form-group">
                    <label for="commandeAdresse">Adresse de livraison</label>
                    <input type="text" id="commandeAdresse" placeholder="Numéro, rue, ville...">
                </div>

                <div class="form-group">
                    <label for="commandePaiement">Mode de paiement</label>
                    <select id="commandePaiement">
                        <option value="Carte bancaire">Carte bancaire</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Paiement à la livraison">Paiement à la livraison</option>
                    </select>
                </div>

                <button class="btn-caisse" id="btnConfirmerCommande">Confirmer la commande (${total.toFixed(2)} €)</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const fermerModale = () => overlay.remove();

    overlay.querySelector('#modalCommandeFermer').addEventListener('click', fermerModale);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) fermerModale();
    });

    overlay.querySelector('#btnConfirmerCommande').addEventListener('click', async (e) => {
        const adresse = overlay.querySelector('#commandeAdresse').value.trim();

        if (!adresse) {
            alert('Veuillez renseigner une adresse de livraison.');
            return;
        }

        const paiement = overlay.querySelector('#commandePaiement').value;
        const btn = e.currentTarget;
        btn.disabled = true;
        btn.textContent = 'Validation en cours...';

        try {
            // Détail des articles enregistré avec la commande
            const articles = items.map((item, i) => {
                const p = produits[i];
                return {
                    produitId: item.produitId,
                    nom: p?.nom,
                    quantite: item.quantite,
                    prix: p ? Number(p.prix) : null,
                    taille: item.taille,
                    couleur: item.couleur
                };
            });

            const commande = await validerCommande({ montant: total, articles, adresse, paiement });

            // Le panier est vidé une fois la commande enregistrée
            await viderPanier();

            overlay.querySelector('#modalCommandeContenu').innerHTML = `
                <div class="modal-succes">
                    <i class="fa fa-circle-check"></i>
                    <h2 class="modal-titre">Merci pour votre commande !</h2>
                    <p>Votre commande <strong>#${commande.id}</strong> d'un montant de <strong>${total.toFixed(2)} €</strong> a bien été enregistrée.</p>
                    <p>Elle sera livrée à : <strong>${adresse}</strong></p>
                    <button class="btn-caisse" id="btnContinuerAchats">Continuer mes achats</button>
                </div>
            `;

            overlay.querySelector('#btnContinuerAchats').addEventListener('click', () => {
                fermerModale();
                navigate('/Catalogue/Collections');
            });

            // Rafraîchit la page panier en arrière-plan (elle affichera "panier vide")
            Panier.afterRender();

        } catch (err) {
            console.error(err);
            alert('Impossible de valider la commande (le serveur est-il lancé (node server.js, port 10000) ?).');
            btn.disabled = false;
            btn.textContent = `Confirmer la commande (${total.toFixed(2)} €)`;
        }
    });
}

export default Panier;