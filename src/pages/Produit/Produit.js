import { footer } from '../../components/Footer.js';
import { ajouterAuPanier, basculerFavori, listerFavoris } from '../../cart.js';
import { API_BASE } from '../../config.js';
import { navigate } from '../../router.js';

// Avis clients d'exemple, communs à tous les produits (contenu illustratif)
const AVIS_EXEMPLE = [
    { nom: 'Sophie L.', note: 5, commentaire: "Qualité exceptionnelle, la coupe est parfaite et le tissu est encore plus beau qu'en photo. Je recommande vivement !" },
    { nom: 'Marc D.', note: 4, commentaire: "Très belle pièce, taille bien. La livraison a été rapide et l'emballage soigné." },
    { nom: 'Aïcha B.', note: 5, commentaire: "Exactement comme sur la photo, la matière est agréable et tombe parfaitement. Un coup de cœur !" }
];

const Produit = () => `
    <section class="produit-hero">
        <div class="container produit-hero-grid">
            <div class="produit-gallery">
                <div class="produit-thumbnails" id="produitThumbnails"></div>
                <div class="produit-image-principale">
                    <img id="produitImagePrincipale" src="" alt="">
                </div>
            </div>
            <div class="produit-info" id="produit-info">
                <p>Chargement du produit...</p>
            </div>
        </div>
    </section>

    <section class="produit-tabs-section" id="produit-tabs-section" style="display:none;">
        <div class="container">
            <div class="produit-tabs">
                <button class="tab-btn active" data-tab="description">Description</button>
                <button class="tab-btn" data-tab="avis" id="tabAvisBtn">Avis</button>
                <button class="tab-btn" data-tab="matieres">Matières &amp; entretien</button>
            </div>

            <div class="tab-content active" id="tab-description"></div>
            <div class="tab-content" id="tab-avis"></div>
            <div class="tab-content" id="tab-matieres"></div>
        </div>
    </section>

    <section class="produit-suggestions">
        <div class="container">
            <div class="suggestions-header">
                <h2>Vous aimerez aussi</h2>
                <a href="#/Catalogue/Collections" class="tout-voir">TOUT VOIR</a>
            </div>
            <div class="suggestions-grid" id="suggestions-liste">
                <p>Chargement...</p>
            </div>
        </div>
    </section>

    ${footer}
`;

Produit.afterRender = async (params = {}) => {
    const id = params.id;
    const infoBox = document.getElementById('produit-info');

    try {
        const res = await fetch(`${API_BASE}/produits/${id}`);

        if (!res.ok) {
            infoBox.innerHTML = '<p>Produit introuvable.</p>';
            return;
        }

        const p = await res.json();

        // --- Galerie d'images ---
        const images = [p.image, p.imageDetail || p.image, p.image].filter(Boolean);
        const thumbnails = document.getElementById('produitThumbnails');
        const imagePrincipale = document.getElementById('produitImagePrincipale');

        thumbnails.innerHTML = images.map((img, i) => `
            <button class="thumb ${i === 0 ? 'active' : ''}" data-img="${img}">
                <img src="${img}" alt="">
            </button>
        `).join('');

        imagePrincipale.src = images[0];
        imagePrincipale.alt = p.nom;

        thumbnails.querySelectorAll('.thumb').forEach(btn => {
            btn.addEventListener('click', () => {
                thumbnails.querySelectorAll('.thumb').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                imagePrincipale.src = btn.dataset.img;
            });
        });

        // --- Badge (NOUVEAUTÉ / PROMO) ---
        let badgeHtml = '';
        if (p.badge === 'NEW') {
            badgeHtml = `<span class="produit-badge-label">Nouveauté</span>`;
        } else if (p.badge && p.badge.startsWith('-')) {
            badgeHtml = `<span class="produit-badge-label produit-badge-promo">Promo ${p.badge}</span>`;
        }

        // --- Prix ---
        const prixHtml = p.ancienPrix
            ? `${Number(p.prix).toFixed(2)} € <span class="old">${Number(p.ancienPrix).toFixed(2)} €</span>`
            : `${Number(p.prix).toFixed(2)} €`;

        // --- Tailles & couleurs ---
        const tailles = p.tailles && p.tailles.length ? p.tailles : ['Unique'];
        const couleurs = p.couleurs || [];

        const taillesHtml = tailles.map((t, i) => `
            <button class="taille-btn ${i === 0 ? 'active' : ''}" data-taille="${t}">${t}</button>
        `).join('');

        const couleursHtml = couleurs.map((c, i) => `
            <button class="couleur-btn ${i === 0 ? 'active' : ''}" data-couleur="${c.nom}" style="background:${c.hex}" title="${c.nom}"></button>
        `).join('');

        infoBox.innerHTML = `
            ${badgeHtml}
            <h1 class="produit-titre">${p.nom}</h1>
            <div class="produit-prix">${prixHtml}</div>

            <div class="produit-option">
                <div class="produit-option-header">
                    <span class="produit-option-label">Choisir la taille</span>
                    <a href="javascript:void(0)" class="guide-tailles" id="guideTailles">Guide des tailles</a>
                </div>
                <div class="tailles-liste">${taillesHtml}</div>
            </div>

            ${couleurs.length ? `
                <div class="produit-option">
                    <div class="produit-option-label">Couleur : <span id="couleurNom">${couleurs[0].nom}</span></div>
                    <div class="couleurs-liste" style="margin-top:10px;">${couleursHtml}</div>
                </div>
            ` : ''}

            <button id="btnAjouterPanierDetail" class="btn-panier-principal">
                <i class="fa fa-cart-shopping"></i> Ajouter au panier
            </button>
            <button id="btnFavoriDetail" class="btn-favori-principal">
                <i class="fa fa-heart"></i> Ajouter aux favoris
            </button>

            <div class="produit-livraison">
                <div class="livraison-item">
                    <i class="fa fa-truck"></i>
                    <div>
                        <strong>Livraison Standard Gratuite</strong>
                        <span>Estimation de livraison : 2-4 jours ouvrés</span>
                    </div>
                </div>
                <div class="livraison-item">
                    <i class="fa fa-rotate"></i>
                    <div>
                        <strong>Retours Gratuits sous 30 Jours</strong>
                        <span>Satisfait ou remboursé</span>
                    </div>
                </div>
            </div>
        `;

        // --- Sélection taille ---
        let selectedTaille = tailles[0];
        infoBox.querySelectorAll('.taille-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                infoBox.querySelectorAll('.taille-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedTaille = btn.dataset.taille;
            });
        });

        // --- Sélection couleur ---
        let selectedCouleur = couleurs[0]?.nom || null;
        const couleurNomEl = document.getElementById('couleurNom');
        infoBox.querySelectorAll('.couleur-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                infoBox.querySelectorAll('.couleur-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedCouleur = btn.dataset.couleur;
                if (couleurNomEl) couleurNomEl.textContent = selectedCouleur;
            });
        });

        // --- Guide des tailles (placeholder) ---
        document.getElementById('guideTailles')?.addEventListener('click', () => {
            alert('Guide des tailles à venir.');
        });

        // --- Ajouter au panier ---
        const btnPanier = document.getElementById('btnAjouterPanierDetail');
        const texteOriginalPanier = btnPanier.innerHTML;

        btnPanier?.addEventListener('click', async () => {
            try {
                await ajouterAuPanier(p.id, { taille: selectedTaille, couleur: selectedCouleur });
                btnPanier.innerHTML = '<i class="fa fa-check"></i> Ajouté au panier';
                setTimeout(() => { btnPanier.innerHTML = texteOriginalPanier; }, 1500);
            } catch (err) {
                console.error(err);
                alert("Impossible d'ajouter au panier (le serveur est-il lancé (node server.js, port 10000) ?)");
            }
        });

        // --- Favoris ---
        const btnFavori = document.getElementById('btnFavoriDetail');

        try {
            const favoris = await listerFavoris();
            if (favoris.some(f => f.produitId === p.id)) {
                btnFavori.classList.add('active');
                btnFavori.innerHTML = '<i class="fa fa-heart"></i> Ajouté aux favoris';
            }
        } catch (err) {
            console.error('Impossible de charger les favoris :', err);
        }

        btnFavori?.addEventListener('click', async () => {
            try {
                const estFavori = await basculerFavori(p.id);
                btnFavori.classList.toggle('active', estFavori);
                btnFavori.innerHTML = estFavori
                    ? '<i class="fa fa-heart"></i> Ajouté aux favoris'
                    : '<i class="fa fa-heart"></i> Ajouter aux favoris';
            } catch (err) {
                console.error(err);
                alert('Impossible de mettre à jour les favoris (le serveur est-il lancé (node server.js, port 10000) ?)');
            }
        });

        // --- Onglets : description / avis / matières & entretien ---
        document.getElementById('produit-tabs-section').style.display = '';
        document.getElementById('tabAvisBtn').textContent = `Avis (${p.avis || 0})`;

        const materiaux = p.materiaux || [];
        const entretien = p.entretien || [];

        document.getElementById('tab-description').innerHTML = `
            <div class="description-grid">
                <div class="description-text">
                    <h2>${p.titreDetail || 'Détails du produit'}</h2>
                    <p>${p.descriptionLongue || p.description || ''}</p>
                    <ul>${materiaux.map(m => `<li>${m}</li>`).join('')}</ul>
                </div>
                <div class="description-image">
                    <img src="${p.imageDetail || p.image}" alt="">
                </div>
            </div>
        `;

        document.getElementById('tab-avis').innerHTML = `
            <div class="avis-liste">
                ${AVIS_EXEMPLE.map(a => `
                    <div class="avis-item">
                        <div class="avis-header">
                            <strong>${a.nom}</strong>
                            <span class="avis-etoiles">${'★'.repeat(a.note)}${'☆'.repeat(5 - a.note)}</span>
                        </div>
                        <p>${a.commentaire}</p>
                    </div>
                `).join('')}
            </div>
        `;

        document.getElementById('tab-matieres').innerHTML = `
            <div class="description-grid">
                <div class="description-text">
                    <h2>Composition</h2>
                    <ul>${materiaux.map(m => `<li>${m}</li>`).join('')}</ul>
                </div>
                <div class="description-text">
                    <h2>Entretien</h2>
                    <ul>${entretien.map(e => `<li>${e}</li>`).join('')}</ul>
                </div>
            </div>
        `;

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
            });
        });

        // --- Vous aimerez aussi ---
        const suggestionsListe = document.getElementById('suggestions-liste');

        try {
            const resTous = await fetch(`${API_BASE}/produits`);
            const tous = await resTous.json();

            const suggestions = tous
                .filter(autre => autre.id !== p.id)
                .sort((a, b) =>
                    (a.categorie === p.categorie ? -1 : 0) - (b.categorie === p.categorie ? -1 : 0)
                )
                .slice(0, 4);

            suggestionsListe.innerHTML = suggestions.map(s => `
                <div class="suggestion-card" data-id="${s.id}">
                    <div class="suggestion-media">
                        ${s.image
                            ? `<img src="${s.image}" alt="${s.nom}">`
                            : `<div class="product-img-placeholder"><i class="fa ${s.icone || 'fa-shirt'}"></i></div>`}
                    </div>
                    <div class="suggestion-nom">${s.nom}</div>
                    <div class="suggestion-prix">${Number(s.prix).toFixed(2)} €</div>
                </div>
            `).join('');

            suggestionsListe.querySelectorAll('.suggestion-card').forEach(card => {
                card.addEventListener('click', () => {
                    navigate(`/Produit/${card.dataset.id}`);
                });
            });

        } catch (err) {
            console.error(err);
            suggestionsListe.innerHTML = '<p>Impossible de charger les suggestions.</p>';
        }

    } catch (err) {
        console.error(err);
        infoBox.innerHTML = '<p>Impossible de charger le produit.</p>';
    }
};

export default Produit;