import { navigate } from '../../router.js';
import { API_BASE } from '../../config.js';
const Admin = () => `
    <!-- SECTION ADMIN -->
        <section id="admin">

            <h1 class="admin-title">Gestion Administrative</h1>
            <p class="admin-subtitle">Bienvenue, Admin. Voici l'état actuel de votre inventaire.</p>

            <!-- Stats -->
            <div class="stats-grid">
                <div class="stat-card pink-bg">
                    <div class="stat-label">Ventes du mois</div>
                    <div class="stat-value" id="statVentes">...</div>
                    <div class="stat-trend" id="statVentesTrend"></div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Clients inscrits</div>
                    <div class="stat-value" id="statClients">...</div>
                    <i class="fa fa-users stat-icon"></i>
                </div>
                <div class="stat-card gray-bg">
                    <div class="stat-label">Stock alerte</div>
                    <div class="stat-value red" id="statStockAlerte">...</div>
                    <i class="fa fa-box-archive stat-icon"></i>
                </div>
            </div>

            <!-- Formulaire ajout / modification -->
            <form id="produitForm" class="produit-form hidden">
                <input type="hidden" id="produitId">
                <div class="form-group">
                    <label>Nom du produit</label>
                    <input type="text" id="produitNom" required>
                </div>
                <div class="form-group">
                    <label>Prix (€)</label>
                    <input type="number" id="produitPrix" min="0" step="0.01" required>
                </div>
                <div class="form-group">
                    <label>Stock (unités)</label>
                    <input type="number" id="produitStock" min="0" step="1" required>
                </div>
                <div class="form-group form-group-photo">
                    <label>Photo du produit</label>
                    <div class="produit-photo-uploader">
                        <div class="produit-photo-preview" id="produitPhotoPreview">
                            <i class="fa fa-image"></i>
                        </div>
                        <div class="produit-photo-controls">
                            <input type="file" id="produitPhoto" accept="image/*">
                            <button type="button" class="btn-photo-remove" id="btnSupprimerPhoto">Retirer la photo</button>
                            <p class="produit-photo-hint">Formats JPG, PNG ou WEBP. La photo sera enregistrée avec le produit.</p>
                        </div>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-cancel" id="btnAnnulerProduit">Annuler</button>
                    <button type="submit" class="btn-save" id="btnEnregistrerProduit">Enregistrer</button>
                </div>
            </form>

            <!-- Table -->
            <div class="table-wrapper">
                <div class="table-header">
                    <span>Image</span>
                    <span>Nom du produit</span>
                    <span>Prix</span>
                    <span>Stock</span>
                    <span style="display:flex;align-items:center;gap:10px;">
                        Actions
                        <button class="btn-add" id="btnAjouterProduit">+</button>
                    </span>
                </div>

                <div id="produits-liste">
                    <p style="padding:24px;color:#aaa;">Chargement des produits...</p>
                </div>

                <!-- Pagination -->
                <div class="pagination">
                    <span class="pagination-info" id="pagination-info">Chargement...</span>
                    <div class="pagination-btns">
                        <button class="page-arrow">&#8249;</button>
                        <button class="page-btn active">1</button>
                        <button class="page-arrow">&#8250;</button>
                    </div>
                </div>
                 
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
Admin.afterRender = () => {
    const liste = document.getElementById('produits-liste');
    const paginationInfo = document.getElementById('pagination-info');
    const form = document.getElementById('produitForm');
    const inputId = document.getElementById('produitId');
    const inputNom = document.getElementById('produitNom');
    const inputPrix = document.getElementById('produitPrix');
    const inputStock = document.getElementById('produitStock');
    const inputPhoto = document.getElementById('produitPhoto');
    const photoPreview = document.getElementById('produitPhotoPreview');
    const btnSupprimerPhoto = document.getElementById('btnSupprimerPhoto');

    // Image du produit en cours d'édition : data URL (photo choisie) ou chemin existant, null si aucune
    let imageData = null;

    const afficherApercu = (src) => {
        photoPreview.innerHTML = src
            ? `<img src="${src}" alt="Aperçu du produit">`
            : '<i class="fa fa-image"></i>';
    };

    inputPhoto?.addEventListener('change', () => {
        const fichier = inputPhoto.files[0];
        if (!fichier) return;

        const lecteur = new FileReader();
        lecteur.onload = () => {
            imageData = lecteur.result;
            afficherApercu(imageData);
        };
        lecteur.readAsDataURL(fichier);
    });

    btnSupprimerPhoto?.addEventListener('click', () => {
        imageData = null;
        inputPhoto.value = '';
        afficherApercu(null);
    });

    const badgeClass = (stock) => {
        if (stock <= 0) return 'stock-alert';
        if (stock <= 10) return 'stock-low';
        return 'stock-ok';
    };

    const ouvrirFormulaire = (produit = null) => {
        if (produit) {
            inputId.value = produit.id;
            inputNom.value = produit.nom;
            inputPrix.value = produit.prix;
            inputStock.value = produit.stock;
            imageData = produit.image || null;
        } else {
            form.reset();
            inputId.value = '';
            imageData = null;
        }
        inputPhoto.value = '';
        afficherApercu(imageData);
        form.classList.remove('hidden');
        inputNom.focus();
    };

    const fermerFormulaire = () => {
        form.classList.add('hidden');
        form.reset();
        imageData = null;
        afficherApercu(null);
    };

    const afficherProduits = (produits) => {
        if (!produits.length) {
            liste.innerHTML = '<p style="padding:24px;color:#aaa;">Aucun produit pour le moment.</p>';
            paginationInfo.textContent = 'Aucun produit';
            return;
        }

        liste.innerHTML = produits.map(p => {
            const media = p.image
                ? `<img src="${p.image}" alt="${p.nom}" class="product-img">`
                : `<div class="product-img-placeholder"><i class="fa ${p.icone || 'fa-shirt'}"></i></div>`;

            return `
            <div class="table-row">
                ${media}
                <div>
                    <div class="product-name">${p.nom}</div>
                    <div class="product-id">ID: #${p.id}</div>
                </div>
                <div class="product-price">€${Number(p.prix).toFixed(2)}</div>
                <div><span class="stock-badge ${badgeClass(p.stock)}">${p.stock} UNITÉS</span></div>
                <div class="action-btns">
                    <button class="btn-edit" title="Modifier" data-id="${p.id}"><i class="fa fa-pen"></i></button>
                    <button class="btn-delete" title="Supprimer" data-id="${p.id}"><i class="fa fa-trash"></i></button>
                </div>
            </div>
        `;
        }).join('');

        paginationInfo.textContent = `Affichage de 1–${produits.length} sur ${produits.length} produits`;

        liste.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', async () => {
                try {
                    const res = await fetch(`${API_BASE}/produits/${btn.dataset.id}`);
                    if (!res.ok) {
                        alert('Produit introuvable.');
                        return;
                    }
                    const produit = await res.json();
                    ouvrirFormulaire(produit);
                } catch (err) {
                    console.error(err);
                    alert('Impossible de charger ce produit.');
                }
            });
        });

        liste.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = Number(btn.dataset.id);
                if (!confirm('Supprimer ce produit ?')) return;

                try {
                    const res = await fetch(`${API_BASE}/produits/${id}`, { method: 'DELETE' });
                    if (!res.ok) {
                        alert('Erreur lors de la suppression');
                        return;
                    }
                    chargerProduits();
                } catch (err) {
                    console.error(err);
                    alert('Le serveur est indisponible');
                }
            });
        });
    };

    const chargerProduits = async () => {
        try {
            const res = await fetch(`${API_BASE}/produits`);
            const produits = await res.json();
            afficherProduits(produits);
        } catch (err) {
            console.error(err);
            liste.innerHTML = '<p style="padding:24px;color:#e05a5a;">Impossible de charger les produits.</p>';
        }
    };

    document.getElementById('btnAjouterProduit')?.addEventListener('click', () => {
        ouvrirFormulaire();
    });

    document.getElementById('btnAnnulerProduit')?.addEventListener('click', () => {
        fermerFormulaire();
    });

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = inputId.value;
        const payload = {
            nom: inputNom.value,
            prix: Number(inputPrix.value),
            stock: Number(inputStock.value),
            image: imageData
        };

        try {
            const res = await fetch(
                id ? `${API_BASE}/produits/${id}` : `${API_BASE}/produits`,
                {
                    method: id ? 'PATCH' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }
            );

            if (!res.ok) {
                alert("Erreur lors de l'enregistrement");
                return;
            }

            fermerFormulaire();
            chargerProduits();

        } catch (err) {
            console.error(err);
            alert('Le serveur est indisponible');
        }
    });

    // --- Calcul des statistiques réelles ---
    const chargerStats = async () => {
        const statVentes = document.getElementById('statVentes');
        const statVentesTrend = document.getElementById('statVentesTrend');
        const statClients = document.getElementById('statClients');
        const statStockAlerte = document.getElementById('statStockAlerte');

        try {
            const [resCommandes, resUtilisateurs, resProduits] = await Promise.all([
                fetch(`${API_BASE}/commandes`),
                fetch(`${API_BASE}/utilisateurs`),
                fetch(`${API_BASE}/produits`)
            ]);

            const commandes = await resCommandes.json();
            const utilisateurs = await resUtilisateurs.json();
            const produits = await resProduits.json();

            // Ventes du mois en cours vs mois précédent
            const maintenant = new Date();
            const moisActuel = maintenant.getMonth();
            const anneeActuelle = maintenant.getFullYear();
            const moisPrecedent = moisActuel === 0 ? 11 : moisActuel - 1;
            const anneePrecedente = moisActuel === 0 ? anneeActuelle - 1 : anneeActuelle;

            let totalMoisActuel = 0;
            let totalMoisPrecedent = 0;

            commandes.forEach(c => {
                const d = new Date(c.date);
                if (d.getFullYear() === anneeActuelle && d.getMonth() === moisActuel) {
                    totalMoisActuel += Number(c.montant);
                } else if (d.getFullYear() === anneePrecedente && d.getMonth() === moisPrecedent) {
                    totalMoisPrecedent += Number(c.montant);
                }
            });

            statVentes.textContent = `${totalMoisActuel.toFixed(2)} €`;

            if (totalMoisPrecedent > 0) {
                const variation = ((totalMoisActuel - totalMoisPrecedent) / totalMoisPrecedent) * 100;
                const signe = variation >= 0 ? '+' : '';
                const icone = variation >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
                statVentesTrend.innerHTML = `<i class="fa ${icone}"></i> ${signe}${variation.toFixed(1)}% vs mois dernier`;
            } else {
                statVentesTrend.textContent = 'Pas de données pour le mois dernier';
            }

            // Nombre de clients inscrits (hors comptes admin)
            const nbClients = utilisateurs.filter(u => u.role !== 'admin').length;
            statClients.textContent = nbClients;

            // Produits dont le stock est faible ou nul
            const nbStockAlerte = produits.filter(p => Number(p.stock) <= 10).length;
            statStockAlerte.textContent = nbStockAlerte;

        } catch (err) {
            console.error(err);
            statVentes.textContent = 'N/A';
            statClients.textContent = 'N/A';
            statStockAlerte.textContent = 'N/A';
        }
    };

    chargerStats();
    chargerProduits();
};
export default Admin;